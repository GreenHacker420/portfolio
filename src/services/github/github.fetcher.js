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
        }
      }
    `;

    const [userRes, reposRes, eventsRes, gqlRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers, next: { revalidate: 3600 } }),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, { headers, next: { revalidate: 3600 } }),
        fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query,
                variables: { username }
            }),
            next: { revalidate: 3600 }
        })
    ]);

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

    return {
        user: await userRes.json(),
        repos: await reposRes.json(),
        events: safeEvents,
        contributions: gqlData?.data?.user?.contributionsCollection?.contributionCalendar
    };
}
