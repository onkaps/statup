console.log("StatUp background service worker running... !");

async function fetchCodeforcesStats(username) {
    const url = `https://codeforces.com/api/user.info?handles=${username}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const json = await response.json();
        console.log("Raw Codeforces response:", json);

        if (json.status !== "OK" || !json.result || json.result.length === 0) {
            throw new Error("User not found");
        }

        const user = json.result[0];

        return {
            handle: user.handle,
            rating: user.rating || null,
            rank: user.rank || "unrated"
        };
    } catch (error) {
        console.error("Codeforces fetch failed:", error.message);
        return {
            error: true,
            message: error.message
        };
    }
}

async function fetchLeetCodeStats(username) {
    const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        rating
        badge {
          name
        }
      }
    }
  `;
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query,
                variables: {
                    username
                }
            })
        });

        const json = await response.json();
        console.log("Raw LeetCode response:", json);

        const contest = json?.data?.userContestRanking;

        if (!contest || contest.rating == null) {
            return {
                error: true,
                message: "User has no contest rating"
            };
        }

        return {
            rating: Math.round(contest.rating),
            level: contest.badge?.name || "Unrated"
        };
    } catch (error) {
        console.error("LeetCode fetch failed:", error.message);
        return {
            error: true,
            message: error.message
        };
    }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received in background:", message);

    // for ping - test
    if (message.type === "PING") {
        sendResponse({ status: "ok" });
    }

    //leetcode stats
    if (message.type === "FETCH_LEETCODE") {
        fetchLeetCodeStats(message.username).then(sendResponse);
        return true;
    }

    // for codeforces stats
    if (message.type === "FETCH_CODEFORCES") {
        fetchCodeforcesStats(message.username).then(sendResponse);
        return true;
    }

    return true;
});

//take the usernames from storage and fetch stats 
chrome.storage.local.get(["userConfig"], (result) => {
    const config = result.userConfig;

    if (config?.usernames) {
        fetchLeetCodeStats(config.usernames.leetcode).then(console.log);
        fetchCodeforcesStats(config.usernames.codeforces).then(console.log);
    }
}); 
