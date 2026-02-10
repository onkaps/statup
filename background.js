console.log("StatUp background service worker running... !");

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
        console.log("Raw contest response:", json);

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
    if (message.type === "FETCH_LEETCODE") {
        fetchLeetCodeStats(message.username).then((result) => {
            sendResponse(result);
        });
        return true; // keep channel open for async
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Recevied in background: ", message);

    if (message.type == "PING") {
        sendResponse({
            status: "ok",
            reply: "PONG",
            echo: message.data
        });
    }

    return true;
});