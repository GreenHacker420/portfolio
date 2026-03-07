"use server";

export async function fetchGithubData(username, headers = {}, forceRefresh = false) {
  const query = `
      query ($username: String!) {
        user(login: $username) {
          createdAt
          repositoriesContributedTo(first: 1) { totalCount }
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
          pullRequests(first: 1) { totalCount }
          issues(first: 1) { totalCount }
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                stargazerCount
                forkCount
                primaryLanguage { name color }
              }
            }
          }
          repositories(first: 6, orderBy: { field: STARGAZERS, direction: DESC }, ownerAffiliations: OWNER) {
            nodes {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage { name color }
            }
          }
        }
        viewer {
          login
          contributionsCollection {
            restrictedContributionsCount
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

  let userRes, reposRes, eventsRes, gqlRes;
  const fetchOptions = forceRefresh ? { cache: 'no-store' } : { next: { revalidate: 3600 } };

  try {
    [userRes, reposRes, eventsRes, gqlRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, ...fetchOptions }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers, ...fetchOptions }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, { headers, ...fetchOptions }),
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { username } }),
        ...fetchOptions
      })
    ]);

    if (userRes.status === 401) throw new Error("Unauthorized Token");
  } catch (error) {
    if (error.message === "Unauthorized Token" || error.message.includes("Bad credentials")) {
      console.warn("⚠️ [GitHub Fetcher] GITHUB_TOKEN is invalid/expired. Falling back to public API. Streaks and GraphQL data will be unavailable.");

      const fallbackHeaders = { ...headers };
      delete fallbackHeaders.Authorization;

      [userRes, reposRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers: fallbackHeaders, ...fetchOptions }),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers: fallbackHeaders, ...fetchOptions }),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, { headers: fallbackHeaders, ...fetchOptions })
      ]);

      gqlRes = { ok: false, status: 401, statusText: "Unauthorized", text: async () => '' };
    } else {
      throw error;
    }
  }

  if (!userRes.ok) {
    throw new Error(`GitHub user not found: ${userRes.statusText}`);
  }

  const events = eventsRes.ok ? await eventsRes.json() : [];

  let gqlData = null;
  if (gqlRes.ok) {
    gqlData = await gqlRes.json();
    if (gqlData.errors) {
      console.error("[GitHub Fetcher] GraphQL Errors:", JSON.stringify(gqlData.errors, null, 2));
    }
  } else {
    console.error(`[GitHub Fetcher] GraphQL Request Failed. Status: ${gqlRes.status} ${gqlRes.statusText}`);
    try {
      console.error("Response body:", await gqlRes.text());
    } catch (e) { }
  }

  const safeEvents = Array.isArray(events) ? events : [];
  const parsedGqlUser = gqlData?.data?.user;
  const viewerLogin = gqlData?.data?.viewer?.login;

  // Prefer viewer contributions (includes private commits) over user contributions
  const viewerContributions = viewerLogin?.toLowerCase() === username.toLowerCase()
    ? gqlData?.data?.viewer?.contributionsCollection
    : undefined;

  const finalContributions = viewerContributions?.contributionCalendar || parsedGqlUser?.contributionsCollection?.contributionCalendar;

  // Debug logging
  const viewerTotal = viewerContributions?.contributionCalendar?.totalContributions;
  const userTotal = parsedGqlUser?.contributionsCollection?.contributionCalendar?.totalContributions;
  const allDays = finalContributions?.weeks?.flatMap(w => w.contributionDays) || [];
  const lastDate = allDays.length > 0 ? allDays[allDays.length - 1].date : 'none';
  console.log(`[GitHub Fetcher] viewer=${viewerLogin}, match=${viewerLogin?.toLowerCase() === username.toLowerCase()}, viewerTotal=${viewerTotal}, userTotal=${userTotal}, privateDiff=${(viewerTotal || 0) - (userTotal || 0)}, lastDate=${lastDate}, today=${new Date().toISOString().split('T')[0]}`);

  return {
    user: await userRes.json(),
    repos: await reposRes.json(),
    events: safeEvents,
    contributions: finalContributions,
    totalPRs: parsedGqlUser?.pullRequests?.totalCount,
    totalIssues: parsedGqlUser?.issues?.totalCount,
    pinnedRepos: parsedGqlUser?.pinnedItems?.nodes || [],
    topRepos: parsedGqlUser?.repositories?.nodes || [],
    createdAt: parsedGqlUser?.createdAt || user?.created_at,
    contributedTo: parsedGqlUser?.repositoriesContributedTo?.totalCount || 0
  };
}

export async function fetchContributionDetails(username, date, headers = {}) {
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      viewer {
        login
        contributionsCollection(from: $from, to: $to) {
          restrictedContributionsCount
          commitContributionsByRepository(maxRepositories: 100) {
            repository { name isPrivate }
            contributions { totalCount }
          }
          pullRequestContributionsByRepository(maxRepositories: 100) {
            repository { name isPrivate }
            contributions { totalCount }
          }
          issueContributionsByRepository(maxRepositories: 100) {
            repository { name isPrivate }
            contributions { totalCount }
          }
          pullRequestReviewContributionsByRepository(maxRepositories: 100) {
            repository { name isPrivate }
            contributions { totalCount }
          }
        }
      }
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          commitContributionsByRepository(maxRepositories: 100) {
            repository { name isPrivate }
            contributions { totalCount }
          }
          pullRequestContributionsByRepository(maxRepositories: 100) {
            repository { name isPrivate }
            contributions { totalCount }
          }
          issueContributionsByRepository(maxRepositories: 100) {
            repository { name isPrivate }
            contributions { totalCount }
          }
          pullRequestReviewContributionsByRepository(maxRepositories: 100) {
            repository { name isPrivate }
            contributions { totalCount }
          }
        }
      }
    }
  `;

  const from = `${date}T00:00:00Z`;
  const to = `${date}T23:59:59Z`;

  const gqlRes = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { username, from, to } }),
    cache: 'no-store'
  });

  if (!gqlRes.ok) {
    throw new Error(`GraphQL Details Fetch Failed: ${gqlRes.statusText}`);
  }

  const { data, errors } = await gqlRes.json();
  if (errors) {
    console.error("[GitHub Fetcher] GraphQL Details Errors:", JSON.stringify(errors, null, 2));
    throw new Error("GraphQL Error fetching details");
  }

  const viewerCollection = data?.viewer?.login?.toLowerCase() === username.toLowerCase() ? data?.viewer?.contributionsCollection : null;
  const collection = viewerCollection || data?.user?.contributionsCollection;
  if (!collection) return [];

  const details = [];

  const processRepoData = (repoList, type) => {
    repoList?.forEach(item => {
      // GitHub API never returns private repos in commitContributionsByRepository,
      // but we keep the check for safety
      if (!item.repository.isPrivate) {
        details.push({
          repo: item.repository.name,
          isPrivate: false,
          count: item.contributions.totalCount,
          type
        });
      }
    });
  };

  processRepoData(collection.commitContributionsByRepository, "commits");
  processRepoData(collection.pullRequestContributionsByRepository, "pull requests");
  processRepoData(collection.issueContributionsByRepository, "issues");
  processRepoData(collection.pullRequestReviewContributionsByRepository, "reviews");

  // Use restrictedContributionsCount to show private/restricted contributions
  // This is the ONLY reliable way to get private contribution counts from GitHub API
  const restrictedCount = collection.restrictedContributionsCount || 0;
  if (restrictedCount > 0) {
    details.push({
      repo: "Private Work",
      isPrivate: true,
      count: restrictedCount,
      type: "contributions"
    });
  }

  return details;
}
