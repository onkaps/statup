console.log("StatUp Phase 2 loaded");

document.addEventListener("DOMContentLoaded", () => {
    const leetcodeInput = document.getElementById("leetcodeInput");
    const codeforcesInput = document.getElementById("codeforcesInput");
    const codechefInput = document.getElementById("codechefInput");
    const saveBtn = document.getElementById("saveBtn");
    const status = document.getElementById("status");

    chrome.storage.local.get(["userConfig"], (result) => {
        const config = result.userConfig;

        if (config?.usernames) {
            leetcodeInput.value = config.usernames.leetcode || "";
            codeforcesInput.value = config.usernames.codeforces || "";
            codechefInput.value = config.usernames.codechef || "";
            if (config.username.leetcode) {
                fetchLeetCode(config.username.leetcode);
            }

            if (config.username.codeforces) {
                fetchCodeforces(config.username.codeforces);
            }
        }

    });

    saveBtn.addEventListener("click", () => {
        const userConfig = {
            usernames: {
                leetcode: leetcodeInput.value.trim(),
                codeforces: codeforcesInput.value.trim(),
                codechef: codechefInput.value.trim()
            }
        };

        chrome.storage.local.set({ userConfig }, () => {
            console.log("Saved config:", userConfig);
            status.textContent = "Settings saved!";
            status.style.color = "green";
        });
    });

    chrome.runtime.sendMessage(
        {
            type: "PING",
            data: "test"
        },
        (response) => {
            console.log("Background reply: ", response);
        }
    );
});

function fetchLeetCode(username) {
    chrome.runtime.sendMessage(
        { type: "FETCH_LEETCODE", username },
        (response) => {
            console.log("LeetCode response:", response);

            const leetcodeEl = document.getElementById("lcStats");

            if (response?.error) {
                leetcodeEl.textContent = "LeetCode: not found";
                return;
            }

            leetcodeEl.textContent = `LeetCode: ${response.rating} (${response.level})`;
        }
    );
}

function fetchCodeforces(username) {
    chrome.runtime.sendMessage(
        { type: "FETCH_CODEFORCES", username },
        (response) => {
            console.log("Codeforces response:", response);

            const cfEl = document.getElementById("cfStats");

            if (response?.error) {
                cfEl.textContent = "Codeforces: not found";
                return;
            }

            cfEl.textContent = `Codeforces: ${response.rating} (${response.rank})`;
        }
    );
}

