"use server";

export async function fetchGithubData(username, headers = {}) {
  const query = `
      query ($username: String!) {
        user(login: $username) {
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
          pullRequests(first: 1) {
            totalCount
          }
          issues(first: 1) {
            totalCount
          }
        }
      }
    `;

  let userRes, reposRes, eventsRes, gqlRes;

  try {
    [userRes, reposRes, eventsRes, gqlRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, { headers, next: { revalidate: 3600 } }),
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { username } }),
        next: { revalidate: 3600 }
      })
    ]);

    if (userRes.status === 401) throw new Error("Unauthorized Token");
  } catch (error) {
    if (error.message === "Unauthorized Token" || error.message.includes("Bad credentials")) {
      console.warn("⚠️ [GitHub Fetcher] GITHUB_TOKEN is invalid/expired. Falling back to public API. Streaks and GraphQL data will be unavailable.");

      const fallbackHeaders = { ...headers };
      delete fallbackHeaders.Authorization;

      [userRes, reposRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers: fallbackHeaders, next: { revalidate: 3600 } }),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers: fallbackHeaders, next: { revalidate: 3600 } }),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, { headers: fallbackHeaders, next: { revalidate: 3600 } })
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

  // Detailed GraphQL Debugging
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

  // Safety check: returns array?
  const safeEvents = Array.isArray(events) ? events : [];

  const parsedGqlUser = gqlData?.data?.user;

  // Console log to see what we are getting per the user's request
  console.log("[GitHub Fetcher] Fetched API Data for", username, {
    eventsCount: safeEvents.length,
    reposCount: (await reposRes.clone().json()).length,
    prs: parsedGqlUser?.pullRequests?.totalCount,
    issues: parsedGqlUser?.issues?.totalCount
  });

  return {
    user: await userRes.json(),
    repos: await reposRes.json(),
    events: safeEvents,
    contributions: parsedGqlUser?.contributionsCollection?.contributionCalendar,
    totalPRs: parsedGqlUser?.pullRequests?.totalCount,
    totalIssues: parsedGqlUser?.issues?.totalCount
  };
}
