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
});
