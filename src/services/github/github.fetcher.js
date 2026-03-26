
import { fetchWithTimeout } from "@/lib/utils/timeout";

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

  if (!userRes.ok) throw new Error(`GitHub user not found: ${userRes.statusText}`);

  const events = eventsRes.ok ? await eventsRes.ok : [];
  let gqlData = gqlRes.ok ? await gqlRes.json() : null;

  const parsedGqlUser = gqlData?.data?.user;
  const viewerLogin = gqlData?.data?.viewer?.login;
  const viewerContributions = viewerLogin?.toLowerCase() === username.toLowerCase()
    ? gqlData?.data?.viewer?.contributionsCollection
    : undefined;

  const finalContributions = viewerContributions?.contributionCalendar || parsedGqlUser?.contributionsCollection?.contributionCalendar;

  return {
    user: await userRes.json(),
    repos: await reposRes.json(),
    events: Array.isArray(events) ? events : [],
    contributions: finalContributions,
    totalPRs: parsedGqlUser?.pullRequests?.totalCount,
    totalIssues: parsedGqlUser?.issues?.totalCount,
    pinnedRepos: parsedGqlUser?.pinnedItems?.nodes || [],
    topRepos: parsedGqlUser?.repositories?.nodes || [],
    createdAt: parsedGqlUser?.createdAt,
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

  if (!gqlRes.ok) return [];

  const { data } = await gqlRes.json();
  const viewerCollection = data?.viewer?.login?.toLowerCase() === username.toLowerCase() ? data?.viewer?.contributionsCollection : null;
  const collection = viewerCollection || data?.user?.contributionsCollection;
  if (!collection) return [];

  const details = [];
  const processRepoData = (repoList, type) => {
    repoList?.forEach(item => {
      if (!item.repository.isPrivate) {
        details.push({ repo: item.repository.name, isPrivate: false, count: item.contributions.totalCount, type });
      }
    });
  };

  processRepoData(collection.commitContributionsByRepository, "commits");
  processRepoData(collection.pullRequestContributionsByRepository, "pull requests");
  processRepoData(collection.issueContributionsByRepository, "issues");
  processRepoData(collection.pullRequestReviewContributionsByRepository, "reviews");

  const restrictedCount = collection.restrictedContributionsCount || 0;
  if (restrictedCount > 0) {
    details.push({ repo: "Private Work", isPrivate: true, count: restrictedCount, type: "contributions" });
  }

  return details;
}

export async function fetchRepoReadme(username, repo, headers) {
    if (!username || !repo) return null;
    try {
        const res = await fetchWithTimeout(`https://api.github.com/repos/${username}/${repo}/readme`, {
            headers: { ...headers, "Accept": "application/vnd.github.v3.raw" }
        }, 10000, "GitHub Readme");

        if (!res.ok) return null;
        
        let text = await res.text();
        
        // Very basic strip of image tags `![alt](url)` and HTML images `<img src...>`
        text = text.replace(/!\[.*?\]\([^)]+\)/g, "");
        text = text.replace(/<img[^>]*>/gi, "");
        
        return text.trim();
    } catch (e) {
        console.error(`Failed to fetch readme for ${username}/${repo}`, e);
        return null;
    }
}

export async function fetchRecentCommits(username, repo, count = 10, headers) {
     if (!username || !repo) return [];
     try {
         const res = await fetchWithTimeout(`https://api.github.com/repos/${username}/${repo}/commits?per_page=${count}`, {
             headers
         }, 10000, "GitHub Commits");
         
         if (!res.ok) return [];
         
         const data = await res.json();
         if (!Array.isArray(data)) return [];
         
         return data.map(c => ({
             message: c.commit?.message || "No message",
             date: c.commit?.author?.date || null
         }));
     } catch (e) {
         console.error(`Failed to fetch commits for ${username}/${repo}`, e);
         return [];
     }
}

