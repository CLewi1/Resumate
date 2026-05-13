# Resumate

AI-powered ATS bypass tool. Capture LinkedIn job listings with one click, then let AI tailor your resume to each job.

## Getting Started

Copy `.env.example` to `.env.local` and fill in your keys, then run the dev server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Chrome Extension (Sideload)

The extension captures LinkedIn job listings and sends them to the local app.

**Prerequisites:** The app must be running (`bun dev`) before you capture jobs.

1. Build the extension: `bun run build:ext`
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `extension/` folder in this repo

The "Send to Resumate" button will appear on LinkedIn job listing pages. Click it to save a job — the button turns green on success or red if the app is not running.
