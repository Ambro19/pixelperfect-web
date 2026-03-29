// // =========================================================
// // ========================================
// // BLOG DATA - PIXELPERFECT
// // ========================================
// // File: frontend/src/data/blogData.js
// // Author: OneTechly
// // Updated: March 2026
// //
// // IMPORTANT: content fields are MARKDOWN strings.
// // They are rendered by the renderMarkdown() function
// // inside BlogPost.jsx — NOT by dangerouslySetInnerHTML.
// //
// // Supported Markdown syntax:
// //   ## Heading 2        ### Heading 3
// //   - unordered list    1. ordered list
// //   > blockquote
// //   **bold**            `inline code`    [text](url)
// //   ```lang             code fences
// //   ```
// //   Plain lines become <p> paragraphs.
// // ========================================

// export const blogPosts = [
//   // ──────────────────────────────────────────────
//   // POST 1 — Monitoring
//   // ──────────────────────────────────────────────
//   {
//     id: 1,
//     slug: 'website-monitoring-screenshots',
//     title: 'Why Website Monitoring with Screenshots Changes Everything',
//     excerpt:
//       'Traditional uptime checks only tell you if a site responds. Screenshot monitoring shows what users actually see.',
//     category: 'Monitoring',
//     date: 'January 28, 2026',
//     readTime: '8 min read',
//     author: 'OneTechly Team',
//     content: `
// Traditional uptime checks only tell you if a site **responds**. Screenshot monitoring shows what users **actually see** — broken layouts, missing images, failed checkouts, and more.

// ## Why Screenshot Monitoring?

// - Catch visual regressions that don't trigger functional errors
// - See exactly what your users see on every device
// - Track competitor pages and detect unauthorized changes
// - Archive landing pages and document your site over time

// ## The Limits of Traditional Uptime Monitoring

// A server can return a 200 OK and still render a completely broken page. CSS files may fail to load, JavaScript errors can blank out the entire UI, or a third-party widget can obscure your call-to-action. None of those failures trip a traditional uptime check.

// Screenshot monitoring fills that gap. By capturing what a **real Chromium browser** renders, you see what your users see — every single time.

// ## How PixelPerfect Helps

// PixelPerfect captures high-fidelity screenshots with full support for JavaScript execution, dark mode, custom viewports, and full-page capture. Schedule captures on any interval, diff them automatically, and receive alerts the moment something looks wrong.

// > **Pro Tip:** Combine screenshot monitoring with PixelPerfect's webhook support to trigger Slack alerts whenever a visual change is detected.

// ## Getting Started

// Start monitoring any URL with a single API call:

// \`\`\`bash
// curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://yoursite.com",
//     "format": "png",
//     "width": 1920,
//     "height": 1080,
//     "full_page": true
//   }'
// \`\`\`

// Ready to see what your users actually see? [Start your free trial →](/register)
// `.trim(),
//   },

//   // ──────────────────────────────────────────────
//   // POST 2 — Tutorial
//   // ──────────────────────────────────────────────
//   {
//     id: 2,
//     slug: 'automate-screenshots-nodejs',
//     title: 'How to Automate Screenshots with Node.js and PixelPerfect',
//     excerpt:
//       'Build a reliable screenshot automation system using Node.js and the PixelPerfect API.',
//     category: 'Tutorial',
//     date: 'January 25, 2026',
//     readTime: '6 min read',
//     author: 'OneTechly Team',
//     content: `
// Automation lets you capture screenshots on a schedule without any manual work. This is ideal for monitoring, regression testing, and archiving content.

// ## Why Automate Screenshots?

// - Monitor websites continuously without manual checking
// - Track visual regressions across every deploy
// - Archive landing pages and generate scheduled reports
// - Detect unauthorized changes to public-facing pages

// ## Project Setup

// Create a new Node.js project:

// \`\`\`bash
// mkdir screenshot-automation
// cd screenshot-automation
// npm init -y
// npm install node-fetch node-cron
// \`\`\`

// ## Basic Screenshot Script

// \`\`\`javascript
// import fetch from 'node-fetch';
// import fs from 'fs';

// const API_KEY = process.env.PIXELPERFECT_API_KEY;
// const API_URL = 'https://api.pixelperfectapi.net/v1/screenshot';

// async function captureScreenshot(url, filename) {
//   const res = await fetch(API_URL, {
//     method: 'POST',
//     headers: {
//       'Authorization': \`Bearer \${API_KEY}\`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       url,
//       width: 1920,
//       height: 1080,
//       format: 'png',
//       full_page: true
//     })
//   });

//   if (!res.ok) throw new Error('API error: ' + res.status);

//   const data = await res.json();
//   const img = await fetch(data.screenshot_url);
//   const buf = Buffer.from(await img.arrayBuffer());
//   fs.writeFileSync(filename, buf);
//   console.log('Screenshot saved:', filename);
// }

// captureScreenshot('https://example.com', 'example-screenshot.png');
// \`\`\`

// ## Scheduling with Cron

// \`\`\`javascript
// import cron from 'node-cron';

// // Run at 9 AM every day
// cron.schedule('0 9 * * *', async () => {
//   const date = new Date().toISOString().split('T')[0];
//   await captureScreenshot(
//     'https://example.com',
//     \`screenshots/example-\${date}.png\`
//   );
// });

// console.log('Screenshot automation started...');
// \`\`\`

// ## Cleanup Strategy

// Delete old screenshots after 30 days to manage disk space. Use a simple date-check on filenames or let your CI/CD pipeline handle retention automatically.

// ## Best Practices

// - Store API keys in environment variables — **never** hard-code them
// - Respect rate limits by adding a small delay between batch requests
// - Organize screenshots by date so diffing is straightforward
// - Log failures and set up alerts so automation errors don't go unnoticed

// ## Final Thoughts

// Automation saves time and prevents surprises. With PixelPerfect, screenshot workflows are reliable, fast, and scalable.

// [Start automating today →](/register)
// `.trim(),
//   },

//   // ──────────────────────────────────────────────
//   // POST 3 — Guide (3-tier timeout)
//   // ──────────────────────────────────────────────
//   {
//     id: 3,
//     slug: 'screenshot-reliability-javascript-heavy-sites',
//     title: "Screenshot Reliability for JavaScript-Heavy Sites: PixelPerfect's 3-Step Timeout Strategy",
//     excerpt:
//       'Modern sites keep "networkidle" busy forever. Here\'s how PixelPerfect captures reliable screenshots anyway — using a 3-tier timeout fallback.',
//     category: 'Guide',
//     date: 'February 4, 2026',
//     readTime: '7 min read',
//     author: 'OneTechly Team',
//     content: `
// Modern websites don't behave like simple HTML pages. Sites like news platforms, fashion catalogs, and paywalled publications often keep the browser perpetually busy — continuous ads, A/B tests, live personalization, and analytics pings. That creates a serious problem for screenshot automation.

// A page can look **fully loaded to a human** but never become "idle" enough for simpler screenshot engines to proceed.

// PixelPerfect solves this with a **reliability-first fallback strategy** designed specifically for heavy, modern JavaScript sites.

// ## The Problem: "networkidle" Can Be Too Strict

// Many automation tools use \`'networkidle'\` as the default \`wait_until\` strategy. It's a great default for simple sites — but on heavy pages it might **never** fire:

// - Long-polling connections stay permanently open
// - Ad trackers keep firing network requests continuously
// - Live content streams refresh in the background
// - Client-side hydration triggers late re-fetches after mount

// The result: screenshot requests timeout even when the page is visually complete and your users would consider it fully loaded.

// ## PixelPerfect's Fix: A 3-Tier Timeout Fallback

// We built a **3-tier retry strategy** directly into the screenshot engine. Here's how it works:

// 1. **Try \`'networkidle'\` first** — best visual stability for sites that eventually settle
// 2. **Fall back to \`'domcontentloaded'\`** — less strict, fires once the DOM is ready
// 3. **Final fallback: \`'load'\`** — highest success rate; something is always better than a timeout

// This gives you reliability without sacrificing quality on the majority of sites.

// ### Tier 1 (Preferred): \`'networkidle'\`

// Waits for the page to stop making network requests. Best for sites where content settles within a reasonable timeframe.

// - Captures the most stable UI state
// - Reduces risk of half-rendered elements
// - Ideal for most sites and QA use cases

// ### Tier 2 (Fallback): \`'domcontentloaded'\`

// Fires when the DOM is fully parsed, without waiting for images and async scripts. Less strict than networkidle.

// - Much better for JS-heavy pages
// - Still reasonably stable for most content
// - Often enough to capture a fully usable page

// ### Tier 3 (Final Fallback): \`'load'\`

// The most lenient option. Fires once the page's initial resources have loaded.

// - Highest success rate of the three strategies
// - Useful for sites that never truly reach "idle"
// - Great for monitoring scenarios where a partial capture beats a timeout

// ## Try It With One Request

// A standard PixelPerfect request already uses the fallback strategy automatically — no extra configuration needed:

// \`\`\`bash
// curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://www.nytimes.com",
//     "width": 1920,
//     "height": 1080,
//     "format": "png",
//     "full_page": true,
//     "wait_until": "networkidle"
//   }'
// \`\`\`

// Even if the target never reaches \`'networkidle'\`, PixelPerfect retries through the fallback tiers and still delivers a screenshot.

// ## When To Customize wait_until

// Most of the time you don't need to change anything. But if you know a target is extremely heavy, you can start more lenient:

// - Use \`'domcontentloaded'\` for pages that constantly stream requests
// - Use \`'load'\` for sites you want captured as fast as possible

// PixelPerfect always respects your explicit \`wait_until\` preference.

// ## Best Practices for Heavy Sites

// - **Default to letting PixelPerfect handle it** — the fallback works automatically for most sites
// - For monitoring scenarios, speed matters more than completeness — use \`'load'\`
// - For QA and regression testing, stick with \`'networkidle'\` for maximum visual stability
// - Use \`full_page: false\` for faster viewport-only captures in high-frequency monitoring

// ## Final Thoughts

// Heavy JS sites are the norm now. PixelPerfect's 3-tier strategy gives you **reliability by default** — without writing custom retry logic in your own code.

// Whether you're capturing news sites, fashion catalogs, or any modern web app, PixelPerfect handles the complexity so you don't have to.

// [Try PixelPerfect today →](/register)
// `.trim(),
//   },

//   // ──────────────────────────────────────────────
//   // POST 4 — Guide (Authentication)
//   // ──────────────────────────────────────────────
//   {
//     id: 4,
//     slug: 'how-pixelperfect-authentication-works',
//     title: 'How PixelPerfect Authentication Works: JWT Tokens vs. API Keys Explained',
//     excerpt:
//       'PixelPerfect uses two separate authentication systems for two distinct use cases. Understanding the difference helps you use the platform more confidently and build integrations the right way.',
//     category: 'Guide',
//     date: 'March 26, 2026',
//     readTime: '7 min read',
//     author: 'OneTechly Team',
//     content: `
// When you first land on your PixelPerfect dashboard, you might notice a section that says **"You don't have an API key yet."** If you've already been capturing screenshots successfully, that message can be puzzling. You're clearly authenticated — so what does the API key actually do?

// The answer is that PixelPerfect uses **two completely separate authentication systems**, each designed for a different use case. Understanding how they work will help you use the platform more confidently and build external integrations the right way.

// ## The Two Systems at a Glance

// > **System 1 — JWT tokens** are for web app users. System 2 — **Permanent API keys** are for developers integrating the API into their own code.

// Neither system is superior to the other. They serve different purposes, and in many cases, power users will use both.

// ## System 1: JWT Tokens (How the Web App Authenticates You)

// When you log in at \`pixelperfectapi.net/login\`, the backend performs two steps. It verifies your username and password, then issues a short-lived **JSON Web Token** (JWT) — a digitally signed string that proves your identity for a limited time.

// This token is automatically stored in your browser under the key \`auth_token\` and silently attached to every request the web app makes:

// \`\`\`http
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// \`\`\`

// Every time you capture a screenshot, view your history, or check your subscription status, that header is included. The backend validates the token, identifies you as the rightful account holder, and serves the response.

// ### Key properties of a JWT token

// - **Short-lived** — expires after 24 hours
// - **Automatic** — the web app handles it entirely without any action from you
// - **Session-scoped** — tied to your active browser session
// - **Invisible** — you never see or touch this token directly

// This is exactly how most modern web applications authenticate their users. It is secure, stateless, and requires zero configuration on your part.

// ## System 2: Permanent API Keys (How Developers Authenticate)

// A permanent API key is a long, randomly generated string that looks something like this:

// \`\`\`text
// pp_live_a3f2c1b9d4e8f7a1c2d3e4f5g6h7i8j9
// \`\`\`

// You create it once in the dashboard by clicking **"Create API Key"**, and it remains valid indefinitely until you regenerate it.

// Unlike a JWT, an API key is **not tied to a browser session**. It is designed to be used from **outside the web app** — in scripts, server-side code, CI/CD pipelines, or any automated system that needs to call the PixelPerfect API programmatically.

// ### Using an API key in Python

// \`\`\`python
// import requests

// response = requests.post(
//     "https://api.pixelperfectapi.net/api/v1/screenshot",
//     headers={"Authorization": "Bearer pp_live_a3f2c1b9..."},
//     json={
//         "url": "https://example.com",
//         "width": 1920,
//         "height": 1080,
//         "format": "png"
//     }
// )
// print(response.json())
// \`\`\`

// ### Using an API key in Node.js

// \`\`\`javascript
// const res = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot', {
//   method: 'POST',
//   headers: {
//     'Authorization': \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     url: 'https://example.com',
//     width: 1920,
//     height: 1080,
//     format: 'png'
//   })
// });

// const data = await res.json();
// console.log(data.screenshot_url);
// \`\`\`

// ### Key properties of a permanent API key

// - **Long-lived** — does not expire unless you explicitly regenerate it
// - **Portable** — works from any language, tool, or environment
// - **Developer-facing** — intended for code, not browser sessions
// - **Stored as a hash** — the plaintext key is shown only once at creation; PixelPerfect never stores it again

// ## Why Are They Separate?

// This design reflects a security principle known as **least privilege** — each credential grants only the access it needs for its specific context.

// A JWT is perfect for a browser session: it expires quickly, so a stolen token is only dangerous for a short window. A permanent API key is perfect for code: it persists across restarts and deployments, so your automation never breaks unexpectedly.

// If you used a permanent API key for browser sessions, you'd risk exposing a long-lived credential in browser storage. If you used a short-lived JWT for automation, your scripts would break every 24 hours when the token expired.

// Two systems, two different problems, two appropriate solutions.

// ## What "External API Calls" Means

// The phrase **external API calls** refers to any request that originates **outside the PixelPerfect web interface** — meaning from your own code rather than from your browser.

// Common examples of external API calls:

// - A Python script that captures screenshots of competitor pages every morning
// - A GitHub Action that screenshots your staging environment on every pull request
// - A Node.js microservice that generates PDF reports on demand
// - A cURL command run from your terminal to test a specific URL

// All of these bypass the web app entirely. They communicate directly with the PixelPerfect backend over HTTPS, and they must prove their identity using a permanent API key.

// ## Practical Guidance: Which One Do You Need?

// - **Just using the web app?** You do not need an API key. Your JWT handles everything automatically.
// - **Building an integration or automation?** Create an API key from the dashboard. Store it as an environment variable in your code — never hard-code it in source files or commit it to version control.
// - **Both?** Perfectly normal. Many teams use the web app day-to-day and also run automated screenshot pipelines using the API.

// ## Keeping Your API Key Secure

// An API key is a permanent credential with the same access level as your logged-in account. Treat it with the same care you would a password:

// - Store it in environment variables, not in your source code
// - Never expose it in a client-side JavaScript bundle
// - Regenerate it immediately from the dashboard if you suspect it has been compromised
// - Use separate keys for separate environments (staging vs. production) when possible

// ## Final Thoughts

// The distinction between JWT tokens and permanent API keys is not a complexity for its own sake — it is a deliberate design choice that keeps your account secure across every context in which you use PixelPerfect.

// The web app handles JWT authentication silently and automatically. The permanent API key is there when you are ready to move beyond the interface and build something of your own.

// [Create your API key and start building →](/dashboard)
// `.trim(),
//   },
// ];

// // ── Helpers ────────────────────────────────────────────────────────────────
// export function getAllPosts() {
//   return blogPosts;
// }

// export function getPostBySlug(slug) {
//   return blogPosts.find((p) => p.slug === slug) || null;
// }

// ===================================================

// ========================================
// BLOG DATA - PIXELPERFECT
// ========================================
// File: frontend/src/data/blogData.js
// Author: OneTechly
// Updated: March 2026
//
// IMPORTANT: content fields are MARKDOWN strings.
// They are rendered by the renderMarkdown() function
// inside BlogPost.jsx — NOT by dangerouslySetInnerHTML.
//
// Supported Markdown syntax:
//   ## Heading 2        ### Heading 3
//   - unordered list    1. ordered list
//   > blockquote
//   **bold**            `inline code`    [text](url)
//   ```lang             code fences
//   ```
//   Plain lines become <p> paragraphs.
// ========================================

export const blogPosts = [
  // ──────────────────────────────────────────────
  // POST 1 — Monitoring
  // ──────────────────────────────────────────────
  {
    id: 1,
    slug: 'website-monitoring-screenshots',
    title: 'Why Website Monitoring with Screenshots Changes Everything',
    excerpt:
      'Traditional uptime checks only tell you if a site responds. Screenshot monitoring shows what users actually see.',
    category: 'Monitoring',
    date: 'January 28, 2026',
    readTime: '8 min read',
    author: 'OneTechly Team',
    content: `
Traditional uptime checks only tell you if a site **responds**. Screenshot monitoring shows what users **actually see** — broken layouts, missing images, failed checkouts, and more.

## Why Screenshot Monitoring?

- Catch visual regressions that don't trigger functional errors
- See exactly what your users see on every device
- Track competitor pages and detect unauthorized changes
- Archive landing pages and document your site over time

## The Limits of Traditional Uptime Monitoring

A server can return a 200 OK and still render a completely broken page. CSS files may fail to load, JavaScript errors can blank out the entire UI, or a third-party widget can obscure your call-to-action. None of those failures trip a traditional uptime check.

Screenshot monitoring fills that gap. By capturing what a **real Chromium browser** renders, you see what your users see — every single time.

## How PixelPerfect Helps

PixelPerfect captures high-fidelity screenshots with full support for JavaScript execution, dark mode, custom viewports, and full-page capture. Schedule captures on any interval, diff them automatically, and receive alerts the moment something looks wrong.

> **Pro Tip:** Combine screenshot monitoring with PixelPerfect's webhook support to trigger Slack alerts whenever a visual change is detected.

## Getting Started

Start monitoring any URL with a single API call:

\`\`\`bash
curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yoursite.com",
    "format": "png",
    "width": 1920,
    "height": 1080,
    "full_page": true
  }'
\`\`\`

Ready to see what your users actually see? [Start your free trial →](/register)
`.trim(),
  },

  // ──────────────────────────────────────────────
  // POST 2 — Tutorial
  // ──────────────────────────────────────────────
  {
    id: 2,
    slug: 'automate-screenshots-nodejs',
    title: 'How to Automate Screenshots with Node.js and PixelPerfect',
    excerpt:
      'Build a reliable screenshot automation system using Node.js and the PixelPerfect API.',
    category: 'Tutorial',
    date: 'January 25, 2026',
    readTime: '6 min read',
    author: 'OneTechly Team',
    content: `
Automation lets you capture screenshots on a schedule without any manual work. This is ideal for monitoring, regression testing, and archiving content.

## Why Automate Screenshots?

- Monitor websites continuously without manual checking
- Track visual regressions across every deploy
- Archive landing pages and generate scheduled reports
- Detect unauthorized changes to public-facing pages

## Project Setup

Create a new Node.js project:

\`\`\`bash
mkdir screenshot-automation
cd screenshot-automation
npm init -y
npm install node-fetch node-cron
\`\`\`

## Basic Screenshot Script

\`\`\`javascript
import fetch from 'node-fetch';
import fs from 'fs';

const API_KEY = process.env.PIXELPERFECT_API_KEY;
const API_URL = 'https://api.pixelperfectapi.net/v1/screenshot';

async function captureScreenshot(url, filename) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url,
      width: 1920,
      height: 1080,
      format: 'png',
      full_page: true
    })
  });

  if (!res.ok) throw new Error('API error: ' + res.status);

  const data = await res.json();
  const img = await fetch(data.screenshot_url);
  const buf = Buffer.from(await img.arrayBuffer());
  fs.writeFileSync(filename, buf);
  console.log('Screenshot saved:', filename);
}

captureScreenshot('https://example.com', 'example-screenshot.png');
\`\`\`

## Scheduling with Cron

\`\`\`javascript
import cron from 'node-cron';

// Run at 9 AM every day
cron.schedule('0 9 * * *', async () => {
  const date = new Date().toISOString().split('T')[0];
  await captureScreenshot(
    'https://example.com',
    \`screenshots/example-\${date}.png\`
  );
});

console.log('Screenshot automation started...');
\`\`\`

## Cleanup Strategy

Delete old screenshots after 30 days to manage disk space. Use a simple date-check on filenames or let your CI/CD pipeline handle retention automatically.

## Best Practices

- Store API keys in environment variables — **never** hard-code them
- Respect rate limits by adding a small delay between batch requests
- Organize screenshots by date so diffing is straightforward
- Log failures and set up alerts so automation errors don't go unnoticed

## Final Thoughts

Automation saves time and prevents surprises. With PixelPerfect, screenshot workflows are reliable, fast, and scalable.

[Start automating today →](/register)
`.trim(),
  },

  // ──────────────────────────────────────────────
  // POST 3 — Guide (3-tier timeout)
  // ──────────────────────────────────────────────
  {
    id: 3,
    slug: 'screenshot-reliability-javascript-heavy-sites',
    title: "Screenshot Reliability for JavaScript-Heavy Sites: PixelPerfect's 3-Step Timeout Strategy",
    excerpt:
      'Modern sites keep "networkidle" busy forever. Here\'s how PixelPerfect captures reliable screenshots anyway — using a 3-tier timeout fallback.',
    category: 'Guide',
    date: 'February 4, 2026',
    readTime: '7 min read',
    author: 'OneTechly Team',
    content: `
Modern websites don't behave like simple HTML pages. Sites like news platforms, fashion catalogs, and paywalled publications often keep the browser perpetually busy — continuous ads, A/B tests, live personalization, and analytics pings. That creates a serious problem for screenshot automation.

A page can look **fully loaded to a human** but never become "idle" enough for simpler screenshot engines to proceed.

PixelPerfect solves this with a **reliability-first fallback strategy** designed specifically for heavy, modern JavaScript sites.

## The Problem: "networkidle" Can Be Too Strict

Many automation tools use \`'networkidle'\` as the default \`wait_until\` strategy. It's a great default for simple sites — but on heavy pages it might **never** fire:

- Long-polling connections stay permanently open
- Ad trackers keep firing network requests continuously
- Live content streams refresh in the background
- Client-side hydration triggers late re-fetches after mount

The result: screenshot requests timeout even when the page is visually complete and your users would consider it fully loaded.

## PixelPerfect's Fix: A 3-Tier Timeout Fallback

We built a **3-tier retry strategy** directly into the screenshot engine. Here's how it works:

1. **Try \`'networkidle'\` first** — best visual stability for sites that eventually settle
2. **Fall back to \`'domcontentloaded'\`** — less strict, fires once the DOM is ready
3. **Final fallback: \`'load'\`** — highest success rate; something is always better than a timeout

This gives you reliability without sacrificing quality on the majority of sites.

### Tier 1 (Preferred): \`'networkidle'\`

Waits for the page to stop making network requests. Best for sites where content settles within a reasonable timeframe.

- Captures the most stable UI state
- Reduces risk of half-rendered elements
- Ideal for most sites and QA use cases

### Tier 2 (Fallback): \`'domcontentloaded'\`

Fires when the DOM is fully parsed, without waiting for images and async scripts. Less strict than networkidle.

- Much better for JS-heavy pages
- Still reasonably stable for most content
- Often enough to capture a fully usable page

### Tier 3 (Final Fallback): \`'load'\`

The most lenient option. Fires once the page's initial resources have loaded.

- Highest success rate of the three strategies
- Useful for sites that never truly reach "idle"
- Great for monitoring scenarios where a partial capture beats a timeout

## Try It With One Request

A standard PixelPerfect request already uses the fallback strategy automatically — no extra configuration needed:

\`\`\`bash
curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://www.nytimes.com",
    "width": 1920,
    "height": 1080,
    "format": "png",
    "full_page": true,
    "wait_until": "networkidle"
  }'
\`\`\`

Even if the target never reaches \`'networkidle'\`, PixelPerfect retries through the fallback tiers and still delivers a screenshot.

## When To Customize wait_until

Most of the time you don't need to change anything. But if you know a target is extremely heavy, you can start more lenient:

- Use \`'domcontentloaded'\` for pages that constantly stream requests
- Use \`'load'\` for sites you want captured as fast as possible

PixelPerfect always respects your explicit \`wait_until\` preference.

## Best Practices for Heavy Sites

- **Default to letting PixelPerfect handle it** — the fallback works automatically for most sites
- For monitoring scenarios, speed matters more than completeness — use \`'load'\`
- For QA and regression testing, stick with \`'networkidle'\` for maximum visual stability
- Use \`full_page: false\` for faster viewport-only captures in high-frequency monitoring

## Final Thoughts

Heavy JS sites are the norm now. PixelPerfect's 3-tier strategy gives you **reliability by default** — without writing custom retry logic in your own code.

Whether you're capturing news sites, fashion catalogs, or any modern web app, PixelPerfect handles the complexity so you don't have to.

[Try PixelPerfect today →](/register)
`.trim(),
  },

  // ──────────────────────────────────────────────
  // POST 4 — Guide (Authentication)
  // ──────────────────────────────────────────────
  {
    id: 4,
    slug: 'how-pixelperfect-authentication-works',
    title: 'How PixelPerfect Authentication Works: JWT Tokens vs. API Keys Explained',
    excerpt:
      'PixelPerfect uses two separate authentication systems for two distinct use cases. Understanding the difference helps you use the platform more confidently and build integrations the right way.',
    category: 'Guide',
    date: 'March 26, 2026',
    readTime: '7 min read',
    author: 'OneTechly Team',
    content: `
When you first land on your PixelPerfect dashboard, you might notice a section that says **"You don't have an API key yet."** If you've already been capturing screenshots successfully, that message can be puzzling. You're clearly authenticated — so what does the API key actually do?

The answer is that PixelPerfect uses **two completely separate authentication systems**, each designed for a different use case. Understanding how they work will help you use the platform more confidently and build external integrations the right way.

## The Two Systems at a Glance

> **System 1 — JWT tokens** are for web app users. System 2 — **Permanent API keys** are for developers integrating the API into their own code.

Neither system is superior to the other. They serve different purposes, and in many cases, power users will use both.

## System 1: JWT Tokens (How the Web App Authenticates You)

When you log in at \`pixelperfectapi.net/login\`, the backend performs two steps. It verifies your username and password, then issues a short-lived **JSON Web Token** (JWT) — a digitally signed string that proves your identity for a limited time.

This token is automatically stored in your browser under the key \`auth_token\` and silently attached to every request the web app makes:

\`\`\`http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

Every time you capture a screenshot, view your history, or check your subscription status, that header is included. The backend validates the token, identifies you as the rightful account holder, and serves the response.

### Key properties of a JWT token

- **Short-lived** — expires after 24 hours
- **Automatic** — the web app handles it entirely without any action from you
- **Session-scoped** — tied to your active browser session
- **Invisible** — you never see or touch this token directly

This is exactly how most modern web applications authenticate their users. It is secure, stateless, and requires zero configuration on your part.

## System 2: Permanent API Keys (How Developers Authenticate)

A permanent API key is a long, randomly generated string that looks something like this:

\`\`\`text
pp_live_a3f2c1b9d4e8f7a1c2d3e4f5g6h7i8j9
\`\`\`

You create it once in the dashboard by clicking **"Create API Key"**, and it remains valid indefinitely until you regenerate it.

Unlike a JWT, an API key is **not tied to a browser session**. It is designed to be used from **outside the web app** — in scripts, server-side code, CI/CD pipelines, or any automated system that needs to call the PixelPerfect API programmatically.

### Using an API key in Python

\`\`\`python
import requests

response = requests.post(
    "https://api.pixelperfectapi.net/api/v1/screenshot",
    headers={"Authorization": "Bearer pp_live_a3f2c1b9..."},
    json={
        "url": "https://example.com",
        "width": 1920,
        "height": 1080,
        "format": "png"
    }
)
print(response.json())
\`\`\`

### Using an API key in Node.js

\`\`\`javascript
const res = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    width: 1920,
    height: 1080,
    format: 'png'
  })
});

const data = await res.json();
console.log(data.screenshot_url);
\`\`\`

### Key properties of a permanent API key

- **Long-lived** — does not expire unless you explicitly regenerate it
- **Portable** — works from any language, tool, or environment
- **Developer-facing** — intended for code, not browser sessions
- **Stored as a hash** — the plaintext key is shown only once at creation; PixelPerfect never stores it again

## Why Are They Separate?

This design reflects a security principle known as **least privilege** — each credential grants only the access it needs for its specific context.

A JWT is perfect for a browser session: it expires quickly, so a stolen token is only dangerous for a short window. A permanent API key is perfect for code: it persists across restarts and deployments, so your automation never breaks unexpectedly.

If you used a permanent API key for browser sessions, you'd risk exposing a long-lived credential in browser storage. If you used a short-lived JWT for automation, your scripts would break every 24 hours when the token expired.

Two systems, two different problems, two appropriate solutions.

## What "External API Calls" Means

The phrase **external API calls** refers to any request that originates **outside the PixelPerfect web interface** — meaning from your own code rather than from your browser.

Common examples of external API calls:

- A Python script that captures screenshots of competitor pages every morning
- A GitHub Action that screenshots your staging environment on every pull request
- A Node.js microservice that generates PDF reports on demand
- A cURL command run from your terminal to test a specific URL

All of these bypass the web app entirely. They communicate directly with the PixelPerfect backend over HTTPS, and they must prove their identity using a permanent API key.

## Practical Guidance: Which One Do You Need?

- **Just using the web app?** You do not need an API key. Your JWT handles everything automatically.
- **Building an integration or automation?** Create an API key from the dashboard. Store it as an environment variable in your code — never hard-code it in source files or commit it to version control.
- **Both?** Perfectly normal. Many teams use the web app day-to-day and also run automated screenshot pipelines using the API.

## Keeping Your API Key Secure

An API key is a permanent credential with the same access level as your logged-in account. Treat it with the same care you would a password:

- Store it in environment variables, not in your source code
- Never expose it in a client-side JavaScript bundle
- Regenerate it immediately from the dashboard if you suspect it has been compromised
- Use separate keys for separate environments (staging vs. production) when possible

## Final Thoughts

The distinction between JWT tokens and permanent API keys is not a complexity for its own sake — it is a deliberate design choice that keeps your account secure across every context in which you use PixelPerfect.

The web app handles JWT authentication silently and automatically. The permanent API key is there when you are ready to move beyond the interface and build something of your own.

[Create your API key and start building →](/dashboard)
`.trim(),
  },

  // ──────────────────────────────────────────────
  // POST 5 — Guide (SDKs)
  // ──────────────────────────────────────────────
  {
    id: 5,
    slug: 'what-are-sdks-pixelperfect-api',
    title: 'What Are SDKs? How PixelPerfect Integrates with Any Programming Language',
    excerpt:
      'The PixelPerfect API works with any language that can make an HTTP request. Here is what that means in practice, what an SDK actually is, and how to choose the right integration path for your project.',
    category: 'Guide',
    date: 'March 27, 2026',
    readTime: '8 min read',
    author: 'OneTechly Team',
    content: `
If you have visited the PixelPerfect API page, you may have noticed code examples for seven different programming languages — cURL, Python, JavaScript, Java, PHP, Go, and C. You may also have come across the term **SDK** in our FAQ. This article explains what that means, why it matters, and how to choose the right integration path for your project.

## What Is an API?

Before defining an SDK, it helps to be precise about what an API is in this context.

PixelPerfect exposes a **REST API** — a set of URLs (called endpoints) that accept HTTP requests and return JSON responses. When you want to capture a screenshot, your code sends an HTTP POST request to \`https://api.pixelperfectapi.net/v1/screenshot\` with a JSON body describing the target URL and your capture preferences. The server processes the request, renders the page in a real Chromium browser, stores the resulting image, and returns a JSON response containing the URL where your screenshot is available.

That is the complete interaction. There is no magic — just a well-structured HTTP conversation.

## What Makes This Language-Agnostic?

HTTP is a universal protocol. Every modern programming language has a built-in or widely available library for making HTTP requests:

- Python has \`requests\`
- JavaScript (Node.js) has \`fetch\` and \`axios\`
- Java has \`java.net.http.HttpClient\` (built-in since Java 11)
- Go has \`net/http\` in the standard library
- PHP has \`GuzzleHttp\`
- C has \`libcurl\`

Because PixelPerfect communicates over plain HTTP with JSON, **any language that can send an HTTP request can integrate with the API** — whether or not we provide a dedicated library for it.

## What Is an SDK?

SDK stands for **Software Development Kit**. In the context of a web API, an SDK is a language-specific library — published as an installable package — that wraps the raw API calls so you never have to write them yourself.

Instead of constructing HTTP requests manually, you install a package and call methods:

\`\`\`bash
# Install the (hypothetical) PixelPerfect Python SDK
pip install pixelperfect
\`\`\`

\`\`\`python
from pixelperfect import PixelPerfect

client = PixelPerfect(api_key="pp_live_abc123")

screenshot = client.screenshots.create(
    url="https://example.com",
    width=1920,
    height=1080,
    format="png",
    full_page=True
)

print(screenshot.url)
print(screenshot.size_bytes)
print(screenshot.created_at)
\`\`\`

The SDK handles everything underneath: building the correct JSON payload, attaching your API key to the Authorization header, sending the HTTP request, parsing the response, and surfacing meaningful error messages if something goes wrong.

## What Is the Difference Between a Code Example and an SDK?

This is an important distinction.

A **code example** is a snippet that shows you *how* to call the API. You copy it, adapt it to your project, and maintain it yourself. If the API changes, you update your code manually.

An **SDK** is a published, versioned package maintained by the API provider. When the API evolves, the SDK is updated. You run \`pip install --upgrade pixelperfect\` and the changes are automatically available to your project. The SDK also gives you typed return objects, editor autocompletion, built-in retry logic on transient errors, and consistent error handling — none of which a code snippet provides.

## What PixelPerfect Currently Provides

PixelPerfect's API playground includes **production-ready code examples** in seven languages. These are complete, working request patterns you can paste directly into your project and begin using immediately.

This is the right starting point for most integrations. The code examples show exactly what the API expects and what it returns, with no abstraction hiding the underlying mechanics. For experienced developers, this directness is often preferable — you see the full request, you own the implementation, and you can adapt it precisely to your use case.

Here is the Python example from the API playground:

\`\`\`python
import requests

response = requests.post(
    'https://api.pixelperfectapi.net/v1/screenshot',
    json={
        'url': 'https://example.com',
        'width': 1920,
        'height': 1080,
        'format': 'png',
        'full_page': False,
        'dark_mode': False
    },
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(data['screenshot_url'])
\`\`\`

This is not a toy example — it is the same pattern used in production integrations.

## How to Choose the Right Integration Path

### Use the code examples if:

- You are building a one-off script or internal tool
- You want full visibility into every HTTP request your code makes
- You are working in a language or environment with strong HTTP library support
- You prefer not to add third-party dependencies to your project

### An SDK becomes valuable when:

- You are building a larger integration where consistent error handling matters
- Your team includes developers who are not familiar with raw HTTP requests
- You want editor autocompletion and type safety on API responses
- You need built-in retry logic and automatic handling of rate limit responses

## The Progression of API Integration

Most successful APIs — including Stripe, Twilio, and SendGrid — followed the same trajectory:

1. **Raw API with documentation** — developers construct HTTP requests manually
2. **Official code examples** — the provider publishes working snippets in popular languages
3. **Official SDK v1** — a published, installable package with a clean interface
4. **Mature SDK** — typed response objects, pagination helpers, webhook verification, retry logic, and full test coverage

PixelPerfect currently provides stages 1 and 2. As the API stabilizes and the developer community grows, official SDK packages for Python and JavaScript/Node.js are the natural next step — making the integration experience closer to what you see from established API-first companies.

## Practical Guidance: Getting Started Today

Regardless of your language, the integration pattern is the same in three steps.

**Step 1 — Get your API key** from the PixelPerfect dashboard.

**Step 2 — Store it securely** as an environment variable, not in your source code:

\`\`\`bash
export PIXELPERFECT_API_KEY=pp_live_abc123
\`\`\`

**Step 3 — Make your first request** using the code example for your language from the API playground.

That is all it takes to capture your first screenshot programmatically.

## Final Thoughts

The PixelPerfect API is language-agnostic by design. Whether you are scripting in Python, building a Node.js microservice, integrating from a PHP application, or calling the API from a Go binary, the underlying interaction is identical — a standard HTTP request with a JSON body and an Authorization header.

Code examples give you everything you need to build a working integration today. As the ecosystem grows, official SDKs will make that integration even more natural for developers at every experience level.

[Get your API key and start building →](/register)
`.trim(),
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
export function getAllPosts() {
  return blogPosts;
}

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}