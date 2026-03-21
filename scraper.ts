import { chromium } from "playwright";
import { load } from "cheerio";

async function scrapeZipRecruiter(searchTerm: string, location: string) {
    console.log(`Searching for "${searchTerm}" jobs in "${location}"...`);

    const url = `https://www.ziprecruiter.com/jobs-search?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`;

    console.log("Launching browser...");
    const browser = await chromium.launch({
        headless: false, // Set to false to see the browser opening
    });
    console.log("Browser launched!");

    const context = await browser.newContext({
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    try {
        console.log("Navigating to URL...");
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        console.log("Page loaded!");

        const pageTitle = await page.title();
        console.log(`Page title: ${pageTitle}`);

        // Wait for some job elements to load, or just give it a second
        await page.waitForTimeout(3000);

        try {
            console.log("Looking for email input field...");

            // Wait for any standard email input to become visible on the page
            const emailInput = page
                .locator(
                    'input[type="email"], input[name*="email"], input[placeholder*="email" i], input[id*="email" i]',
                )
                .first();

            try {
                // Give it a generous amount of time to appear, in case a modal fades in
                await emailInput.waitFor({ state: "visible", timeout: 8000 });
                console.log("Found email input field! Typing in email...");

                // Clear the box and fill the email
                await emailInput.fill("colin.s.lewandowski@icloud.com");

                // Optional: look for the "Continue" or "Submit" button
                const continueBtn = page
                    .getByRole("button", {
                        name: /(continue|next|submit|sign in|log in)/i,
                    })
                    .first();
                if (await continueBtn.isVisible()) {
                    console.log("Clicking Continue button...");
                    await continueBtn.click();
                    // Wait after clicking so we can see the result
                    await page.waitForTimeout(3000);
                }
            } catch (e) {
                console.log(
                    "Could not find the email input field on the page.",
                );
            }
        } catch (err) {
            console.log(
                "An error occurred while interacting with the email field:",
                err,
            );
        }

        const html = await page.content();
        const $ = load(html);
        const jobs: any[] = [];

        // Note: ZipRecruiter changes their DOM structure often, and relies heavily on JavaScript.
        // We'll look for general job elements.
        // Common tags to look out for on ZipRecruiter are <article> tags or divs with specific classes.

        $("article").each((index, element) => {
            const title =
                $(element).find("h2").text().trim() ||
                $(element).find("a").first().text().trim();
            const company = $(element)
                .find(
                    "a.company_name, [data-cmp='CompanyProfileLink'], .bg-ink-dark, .company-name",
                )
                .text()
                .trim();
            const jobLocation = $(element)
                .find(
                    "a.company_location, .job_location, [data-cmp='Location']",
                )
                .text()
                .trim();
            const jobUrl =
                $(element).find("a.job_link").attr("href") ||
                $(element).find("a").first().attr("href");

            if (title) {
                jobs.push({
                    title,
                    company: company || "Unknown Company",
                    location: jobLocation || "Unknown Location",
                    url: jobUrl,
                });
            }
        });

        console.log(`Found ${jobs.length} jobs!`);
        console.log(JSON.stringify(jobs.slice(0, 5), null, 2));

        if (jobs.length === 0) {
            console.log(
                "\nIf 0 jobs were found, ZipRecruiter might have served a captcha, rendered jobs dynamically via JavaScript, or changed their HTML structure.",
            );
        }
    } catch (error: any) {
        console.error("Scraping failed:", error.message);
    } finally {
        console.log(
            "Keeping the browser open for 60 seconds so you can inspect it...",
        );
        await page.waitForTimeout(60000);
        await browser.close();
    }
}

scrapeZipRecruiter("Software Engineer", "Remote");
