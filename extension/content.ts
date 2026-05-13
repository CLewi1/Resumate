const BUTTON_ID = "resumate-capture-btn";

function scrapeJob(): {
    title: string;
    company: string;
    description: string;
    linkedinUrl: string;
} | null {
    const path = window.location.pathname;
    const isListView =
        path.includes("/jobs/search") || path.includes("/jobs/collections");

    const title = isListView
        ? document
              .querySelector<HTMLElement>('a[href*="/jobs/view/"]')
              ?.innerText.trim()
        : Array.from(document.querySelectorAll<HTMLElement>("p"))
              .filter((p) => !p.closest("header"))[1]
              ?.innerText.trim();

    const company = document
        .querySelector<HTMLElement>('a[href*="/company/"]')
        ?.innerText.trim();

    const description = document
        .querySelector<HTMLElement>('[data-testid="expandable-text-box"]')
        ?.innerText.trim()
        .replace(/[…\.]{0,3}more\s*$/i, "")
        .trimEnd();

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
        chrome.runtime.sendMessage(
            { type: "CAPTURE_JOB", payload: job },
            (res) => {
                if (chrome.runtime.lastError || !res?.ok) {
                    setButtonState(
                        btn,
                        "error",
                        "Resumate not running — run `bun dev`",
                    );
                } else {
                    setButtonState(btn, "success");
                }
            },
        );
    });

    // Try the known multi-button container first (append inside it)
    const container = document.querySelector<HTMLElement>(
        ".job-details-jobs-unified-top-card__top-buttons, .jobs-unified-top-card__top-buttons",
    );
    if (container) {
        container.appendChild(btn);
        return;
    }

    // Fall back to inserting directly after the Apply button (avoids overflow:hidden parent divs).
    // Match via aria-label — more reliable than textContent with deeply nested spans.
    const applyBtn = document.querySelector<HTMLElement>(
        'a[aria-label*="Apply" i], button[aria-label*="Apply" i]',
    );
    if (applyBtn) {
        (applyBtn.parentElement ?? applyBtn).insertAdjacentElement(
            "afterend",
            btn,
        );
    }
}

// LinkedIn is a SPA — poll for the container when navigating between jobs
const observer = new MutationObserver(() => injectButton());
observer.observe(document.body, { childList: true, subtree: true });
injectButton();

const test = ```
def extract_pay(text: str) -> str:
    # Prefer salary ranges and labeled salary fields.
    normalized = re.sub(r'\s+', ' ', text).strip()

    patterns = [
        # Salary ranges with slashes embedded, e.g. "$65K/yr - $95K/yr".
        r'\$\d+[Kk]/(?:yr|hr)\s*[-–]\s*\$\d+[Kk]/(?:yr|hr)',
        # Decimal hourly ranges, e.g. "$43.27/hr - $59.62/hr".
        r'\$\d+(?:\.\d+)?/(?:yr|hr)\s*[-–]\s*\$\d+(?:\.\d+)?/(?:yr|hr)',
        # Verbose "between X and Y" format, e.g. "between $110,000 and $130,000 per year".
        r'between\s+\$[\d,]+(?:\.\d+)?\s+and\s+\$[\d,]+(?:\.\d+)?\s+(?:per\s+)?(?:year|yr|hour|hr)',
        # Salary Min/Max labeled format.
        r'Salary Minimum:\s*\$?[\d,]+(?:\.\d+)?\s*(?:USD)?\s*/?\s*(?:per\s*(?:year|yr|hour|hr)|/(?:year|yr|hour|hr))?.*?Salary Maximum:\s*\$?[\d,]+(?:\.\d+)?\s*(?:USD)?\s*/?\s*(?:per\s*(?:year|yr|hour|hr)|/(?:year|yr|hour|hr))?',
        # Compensation/base-pay labeled ranges, e.g. "Base pay 120k - 190k".
        r'(?:Compensation\s*)?(?:Base\s*pay|Pay\s*range|Compensation)\s*:?\s*(?:\$?\d{1,3}(?:,\d{3})+(?:\.\d+)?|\$?\d+(?:\.\d+)?[Kk])\s*[-–]\s*(?:\$?\d{1,3}(?:,\d{3})+(?:\.\d+)?|\$?\d+(?:\.\d+)?[Kk])\s*(?:USD|US\s*dollars?)?\s*(?:per\s*(?:year|yr|hour|hr)|/(?:year|yr|hour|hr))?',
        # Salary ranges with optional $ and explicit currency/pay period context.
        r'(?:\$?\d{1,3}(?:,\d{3})+(?:\.\d+)?|\$?\d+(?:\.\d+)?[Kk])\s*[-–]\s*(?:\$?\d{1,3}(?:,\d{3})+(?:\.\d+)?|\$?\d+(?:\.\d+)?[Kk])\s*(?:USD|US\s*dollars?)?\s*(?:per\s*(?:year|yr|hour|hr)|/(?:year|yr|hour|hr))?',
    ]

    for pattern in patterns:
        for match in re.finditer(pattern, normalized, re.IGNORECASE):
            candidate = match.group().strip()
            if re.search(r'\$|\bUSD\b|\bUS\s*dollars?\b|\bper\s*(?:year|yr|hour|hr)\b|/(?:year|yr|hour|hr)\b|\bSalary\b|\bBase\s*pay\b|\bCompensation\b|\bPay\s*range\b', candidate, re.IGNORECASE):
                return candidate

    return "N/A"

async def extract_pay_from_page_elements(page) -> str:
    """Search for pay info in all links and spans on the page."""
    # Try to find pay in clickable elements (links with salary info).
    links = await page.query_selector_all("a, span")
    for element in links:
        text = (await element.inner_text()).strip()
        result = extract_pay(text)
        if result != "N/A":
            return result
    return "N/A"

async def extract_location_from_page(page) -> str:
    """Extract location from the detail panel on the right after clicking a job card."""
    # Find the metadata paragraph with dot separators in the detail panel.
    paragraphs = await page.query_selector_all("p")
    
    for paragraph in paragraphs:
        text = (await paragraph.inner_text()).strip()
        
        # Metadata paragraphs contain "·" separator.
        if "·" not in text:
            continue
        
        # Get the first span in this metadata paragraph - that's the location.
        first_span = await paragraph.query_selector("span")
        if first_span:
            location_text = (await first_span.inner_text()).strip()
            # Validate it looks like a location (has comma, common pattern).
            if "," in location_text and len(location_text) < 50:
                return location_text
    
    return "N/A"

async def extract_posted_date_from_card(card) -> str:
    """Extract posted date from card text like '2 days ago' or 'Reposted 1 week ago'."""
    date_pattern = (
        r"\b((?:reposted\s+)?\d+\+?\s+(?:minute|hour|day|week|month|year)s?\s+ago|today|yesterday|just now)\b"
    )

    # First pass: inspect the entire card text so we are not coupled to exact DOM nesting.
    card_text = (await card.inner_text()).strip()
    match = re.search(date_pattern, card_text, re.IGNORECASE)
    if match:
        return match.group(1)

    # Fallback: inspect each paragraph if full-card matching fails.
    paragraphs = await card.query_selector_all("p")
    for paragraph in paragraphs:
        text = (await paragraph.inner_text()).strip()
        match = re.search(date_pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)

    return "N/A"

async def extract_apply_url_from_page(page) -> str:
    """Extract the runtime apply URL from the apply button or by clicking it."""
    apply_selectors = [
        'button[data-live-test-job-apply-button]',
        '#jobs-apply-button-id',
        'button[aria-label*="Apply"]',
        'a[aria-label*="Apply"]',
        '[role="link"][aria-label*="Apply"]',
    ]

    apply_button = None
    matched_selector = None
    for selector in apply_selectors:
        apply_button = await page.query_selector(selector)
        if apply_button:
            matched_selector = selector
            break

    if not apply_button:
        return "N/A"

    for attr_name in ("href", "data-control-url", "data-url", "data-test-url"):
        attr_value = await apply_button.get_attribute(attr_name)
        if attr_value:
            return attr_value

    try:
        if hasattr(apply_button, "scroll_into_view_if_needed"):
            await apply_button.scroll_into_view_if_needed()

        browser_context = getattr(page, "context", None)
        if browser_context and hasattr(browser_context, "expect_page"):
            async with browser_context.expect_page(timeout=5000) as new_page_info:
                try:
                    await apply_button.scroll_into_view_if_needed()
                except Exception:
                    pass
                await apply_button.click(force=True)
            new_page = await new_page_info.value
            if new_page:
                await new_page.wait_for_load_state("domcontentloaded")
                return new_page.url or "N/A"

        await apply_button.click(force=True)
        await asyncio.sleep(2)
    except Exception:
        return "N/A"

    if page.url:
        return page.url

    return "N/A"


async def click_jobs(page):
    card_selector = 'div[style*="border-color:"][style*="background-color:"] [role="button"][tabindex="0"]'
    next_page_selector = 'button[aria-label="View next page"], button.jobs-search-pagination__button--next, button[aria-label*="next page" i]'

    await page.wait_for_selector(card_selector, timeout=30000)
    await asyncio.sleep(3)

    page_number = 1
    global_index = 1

    while True:
        await dismiss_blocking_dialog(page)
        cards = await page.query_selector_all(card_selector)
        log_line(f"Found {len(cards)} job cards on page {page_number}:\n")

        # Capture current page job ids so we can detect whether pagination actually advanced.
        prev_ids = await get_page_job_ids(page, card_selector)

        for card in cards:
            try:
                await dismiss_blocking_dialog(page)
                try:
                    await card.scroll_into_view_if_needed()
                except Exception:
                    pass
                try:
                    await card.click(force=True)
                except Exception:
                    try:
                        await card.evaluate("el => el.click()")
                    except Exception:
                        await card.click()
                await asyncio.sleep(2)  # wait for detail panel to load
            except Exception as exc:
                log_line(f"[CARD] skipping card click failure on page {page_number}: {exc}")
                continue

            # Extract from the detail panel on the right
            title   = await page.query_selector('a[href*="/jobs/view/"]')
            company = await page.query_selector('a[href*="/company/"]')
            desc_el  = await page.query_selector('[data-testid="expandable-text-box"]')
            desc_text = (await desc_el.inner_html()).strip() if desc_el else ""

            title_text   = (await title.inner_text()).strip()   if title   else "N/A"
            company_text = (await company.inner_text()).strip() if company else "N/A"
            location_text = await extract_location_from_page(page)
            posted_date_text = await extract_posted_date_from_card(card)

            # Pre-compute LinkedIn job URL so we can use it for Easy Apply fallback
            linkedin_url_text = await title.get_attribute("href") if title else "N/A"
            if linkedin_url_text and "/jobs/view/" in linkedin_url_text:
                linkedin_url_text = re.sub(r'(/jobs/view/\d+).*', r'\1', linkedin_url_text)

            # Try pay extraction from description first, then from page elements.
            pay_text = extract_pay(desc_text) if desc_text and extract_pay(desc_text) != "N/A" else "N/A"
            if pay_text == "N/A":
                pay_text = await extract_pay_from_page_elements(page)

            # If the job supports Easy Apply, use the LinkedIn job page as the apply URL.
            easy_apply_selectors = [
                'button[aria-label*="Easy Apply"]',
                'button[data-live-test-job-apply-button]',
                '#jobs-apply-button-id',
            ]

            easy_el = None
            for s in easy_apply_selectors:
                try:
                    easy_el = await page.query_selector(s)
                except Exception:
                    easy_el = None
                if easy_el:
                    break

            # Fallback: scan buttons on the page for attributes or visible text indicating Easy Apply
            if not easy_el:
                buttons = await page.query_selector_all('button')
                for b in buttons:
                    try:
                        data_live = await b.get_attribute('data-live-test-job-apply-button')
                        bid = await b.get_attribute('id')
                        txt = (await b.inner_text()) or ""
                        if data_live is not None or (bid and 'jobs-apply-button-id' in bid) or re.search(r'Easy\s*Apply', txt, re.IGNORECASE):
                            easy_el = b
                            break
                    except Exception:
                        continue

            if easy_el and linkedin_url_text and linkedin_url_text != "N/A":
                apply_url_text = linkedin_url_text
            else:
                apply_url_text = await extract_apply_url_from_page(page)
                # If LinkedIn returned a safety redirect, decode the original target URL.
                if apply_url_text and 'linkedin.com/safety/go/' in apply_url_text:
                    try:
                        parsed = urlparse(apply_url_text)
                        qs = parse_qs(parsed.query)
                        inner = qs.get('url') or qs.get('u')
                        if inner:
                            decoded = unquote(inner[0])
                            apply_url_text = decoded
                    except Exception:
                        pass

            log_line(f"[{global_index}]Title:   {title_text}")
            log_line(f"     Company:   {company_text}")
            log_line(f"     Location:  {location_text}")
            log_line(f"     Pay:       {pay_text}")
            log_line(f"     Posted:    {posted_date_text}")
            log_line(f"     Linked In URL:       {linkedin_url_text}")
            log_line(f"     Apply URL: {apply_url_text}")
            log_line()

            # Extract image URL from card if available
            image_url = "N/A"
            try:
                img_el = await card.query_selector('img')
                if img_el:
                    image_url = await img_el.get_attribute('src') or "N/A"
                    log_line(f"     Image URL: {image_url}")
            except Exception:
                image_url = "N/A"

            api_payload = {
                "source_id": f"linkedin:{linkedin_url_text.split('/jobs/view/')[-1]}" if linkedin_url_text and "/jobs/view/" in linkedin_url_text else f"linkedin:unknown_{global_index}",
                "title": title_text,
                "company": company_text,
                "location": location_text,
                "salary": pay_text,
                "posted_at": posted_date_text,
                "apply_url": apply_url_text,
                "linkedin_url": linkedin_url_text,
                "image_url": image_url,
                "description": desc_text,
            }

            await asyncio.to_thread(post_job_payload, api_payload)

            job_cards.append({
                "source_id": api_payload["source_id"],
                "title":   title_text,
                "company": company_text,
                "location": location_text,
                "pay":     pay_text,
                "posted_date": posted_date_text,
                "apply_url":     apply_url_text,
                "linkedin_url": linkedin_url_text,
                "image_url": image_url,
                "description": desc_text,
            })
            global_index += 1

        try:
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(1)
        except Exception:
            pass

        next_button = await page.query_selector(next_page_selector)
        if not next_button:
            buttons = await page.query_selector_all('button')
            for button in buttons:
                try:
                    aria_label = await button.get_attribute('aria-label') or ''
                    class_name = await button.get_attribute('class') or ''
                    text = (await button.inner_text()) or ''
                    if re.search(r'View next page|next page', aria_label, re.IGNORECASE) or 'jobs-search-pagination__button--next' in class_name or re.search(r'\bNext\b', text, re.IGNORECASE):
                        next_button = button
                        break
                except Exception:
                    continue

        if not next_button:
            log_line(f"[PAGINATION] no next page button found on page {page_number}")
            break

        aria_disabled = await next_button.get_attribute('aria-disabled')
        disabled = await next_button.get_attribute('disabled')
        if aria_disabled == 'true' or disabled is not None:
            log_line(f"[PAGINATION] next page button disabled on page {page_number}")
            break

        try:
            await dismiss_blocking_dialog(page)
            try:
                await next_button.scroll_into_view_if_needed()
            except Exception:
                pass
            try:
                await next_button.click(force=True)
            except Exception:
                try:
                    await next_button.evaluate("el => el.click()")
                except Exception:
                    try:
                        await next_button.click()
                    except Exception:
                        log_line(f"[PAGINATION] click failed on page {page_number}")
            log_line(f"[PAGINATION] clicked next page button on page {page_number}")
            page_number += 1
            await asyncio.sleep(2)

            # Wait for cards to appear, then compare job IDs to detect real change.
            await page.wait_for_selector(card_selector, timeout=30000)
            new_ids = await get_page_job_ids(page, card_selector)

            if new_ids == prev_ids:
                # Retry clicking a couple times in case of transient UI updates
                retried = False
                for attempt in range(2):
                    log_line(f"[PAGINATION] job IDs identical after advance (attempt {attempt+1}), retrying click")
                    try:
                        await asyncio.sleep(1)
                        try:
                            await next_button.click(force=True)
                        except Exception:
                            try:
                                await next_button.evaluate("el => el.click()")
                            except Exception:
                                await next_button.click()
                        await asyncio.sleep(2)
                        new_ids = await get_page_job_ids(page, card_selector)
                        if new_ids != prev_ids:
                            retried = True
                            break
                    except Exception:
                        continue

                if not retried and new_ids == prev_ids:
                    # Last resort: construct the expected next URL and force navigation
                    next_url = build_next_url(page.url, page_number)
                    log_line(f"[PAGINATION] job IDs still identical; forcing navigation to {next_url}")
                    try:
                        await page.goto(next_url)
                        await page.wait_for_selector(card_selector, timeout=30000)
                        new_ids = await get_page_job_ids(page, card_selector)
                    except Exception as exc:
                        log_line(f"[PAGINATION] forced navigation failed: {exc}")
                        raise
        except Exception:
                log_line(f"[PAGINATION] failed to advance from page {page_number}")
                break

    log_line("Page will stay open until you press Ctrl-C.")
    #print(job_cards[0])
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        log_line("Exiting on Ctrl-C.")

```;
