chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type !== "CAPTURE_JOB") return false;

    fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.payload),
    })
        .then(async (res) => {
            const data = await res.json();
            if (res.ok && data.url) {
                chrome.tabs.create({ url: `http://localhost:3000${data.url}` });
            }
            sendResponse({ ok: res.ok, data });
        })
        .catch(() => {
            sendResponse({ ok: false });
        });

    return true;
});
