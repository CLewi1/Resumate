const BUTTON_ID = "resumate-capture-btn";

function scrapeJob(): {
    title: string;
    company: string;
    description: string;
    linkedinUrl: string;
} | null {
    const title =
        document.querySelector<HTMLElement>(
            ".job-details-jobs-unified-top-card__job-title h1, .jobs-unified-top-card__job-title h1",
        )?.innerText.trim() ??
        document.querySelector<HTMLElement>(
            "[class*='job-title']",
        )?.innerText.trim();

    const company =
        document.querySelector<HTMLElement>(
            ".job-details-jobs-unified-top-card__company-name a, .jobs-unified-top-card__company-name a",
        )?.innerText.trim() ??
        document.querySelector<HTMLElement>(
            "[class*='company-name']",
        )?.innerText.trim();

    const description =
        document.querySelector<HTMLElement>(
            ".jobs-description__content, .jobs-box__html-content",
        )?.innerText.trim() ??
        document.querySelector<HTMLElement>(
            "[class*='description']",
        )?.innerText.trim();

    const linkedinUrl = window.location.href.split("?")[0];

    if (!title || !company || !description) return null;
    return { title, company, description, linkedinUrl };
}

function setButtonState(
    btn: HTMLButtonElement,
    state: "idle" | "loading" | "success" | "error",
    errorMsg?: string,
) {
    btn.disabled = state === "loading";
    switch (state) {
        case "idle":
            btn.textContent = "Send to Resumate";
            btn.style.background = "#7c3aed";
            break;
        case "loading":
            btn.textContent = "Sending…";
            btn.style.background = "#7c3aed";
            break;
        case "success":
            btn.textContent = "Saved!";
            btn.style.background = "#16a34a";
            setTimeout(() => setButtonState(btn, "idle"), 2000);
            break;
        case "error":
            btn.textContent = errorMsg ?? "Error — is Resumate running?";
            btn.style.background = "#dc2626";
            setTimeout(() => setButtonState(btn, "idle"), 4000);
            break;
    }
}

function injectButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const container = document.querySelector<HTMLElement>(
        ".job-details-jobs-unified-top-card__top-buttons, .jobs-unified-top-card__top-buttons, .jobs-apply-button",
    );
    if (!container) return;

    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.textContent = "Send to Resumate";
    Object.assign(btn.style, {
        background: "#7c3aed",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "8px 16px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        marginLeft: "8px",
        transition: "background 0.2s",
    });

    btn.addEventListener("click", () => {
        const job = scrapeJob();
        if (!job) {
            setButtonState(btn, "error", "Could not read job details");
            return;
        }
        setButtonState(btn, "loading");
        chrome.runtime.sendMessage({ type: "CAPTURE_JOB", payload: job }, (res) => {
            if (chrome.runtime.lastError || !res?.ok) {
                setButtonState(btn, "error", "Resumate not running — run `bun dev`");
            } else {
                setButtonState(btn, "success");
            }
        });
    });

    container.appendChild(btn);
}

// LinkedIn is a SPA — poll for the container when navigating between jobs
const observer = new MutationObserver(() => injectButton());
observer.observe(document.body, { childList: true, subtree: true });
injectButton();
