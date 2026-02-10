console.log("StatUp background service worker started ... !");

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