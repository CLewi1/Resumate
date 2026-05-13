chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type !== "CAPTURE_JOB") return false;

    fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.payload),
    })
        .then(async (res) => {
            const data = await res.json();
            sendResponse({ ok: true, data });
        })
        .catch(() => {
            sendResponse({ ok: false });
        });

    // Return true to keep the message channel open for the async response
    return true;
});
