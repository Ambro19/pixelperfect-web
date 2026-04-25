// ========================================
// NODE.JS INTEGRATION GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/NodeIntegrationGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #5 in "API Usage" category
// Verified against:
//   - backend/screenshot_endpoints.py (real request schema, response shape)
//   - backend/batch.py (batch endpoints, job lifecycle, polling cadence)
//   - backend/.env.production (tier limits, JWT lifetime, retention window)
//   - backend/api_key_system.py (API key format: pk_ + 32 hex chars)
//   - frontend/src/pages/BatchJobs.js (2-second polling cadence)
//
// Code style:
//   - Native fetch (Node 18+) is the primary example throughout — zero deps
//   - axios shown as alternative for users who prefer it
//   - Every example uses environment variables for the API key
//   - Real error messages from the backend, not generic placeholders
//   - All endpoints use the production base URL
//
// ✅ FIX (Apr 2026): Corrected slug for the Python integration cross-link.
//    Was: /help/article/python-integration-guide   ← 404 (slug is wrong)
//    Now: /help/article/python-integration          ← matches helpArticles.js
// ========================================

import React from 'react';

const NodeIntegrationGuide = () => {
  return (
    <div className="prose prose-blue max-w-none">
      {/* What you'll learn callout */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-1">What you'll learn</h3>
            <p className="text-blue-800 text-sm mb-0">
              Build a production-ready PixelPerfect integration in Node.js. We'll cover capturing
              single screenshots, downloading them to disk, running batch jobs with polling,
              uploading URL files, handling errors properly, TypeScript types, and the production
              patterns that keep your integration reliable at scale.
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Before You Begin</h2>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            <strong>Node.js 18 or later</strong> — earlier versions don't have global{' '}
            <span className="font-mono">fetch</span>. Check with{' '}
            <span className="font-mono">node --version</span>
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            A PixelPerfect API key (see{' '}
            <a href="/help/article/getting-your-api-key" className="text-blue-600 hover:underline">
              Getting your API key
            </a>) — starts with <span className="font-mono">pk_</span>
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            Comfort with async/await and ES modules
          </span>
        </li>
      </ul>

      {/* Step 1: Setup */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Project Setup</h2>
      <p className="text-gray-700 leading-relaxed">
        Create a new directory and initialize a Node project:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`mkdir pixelperfect-node && cd pixelperfect-node
npm init -y

# Add "type": "module" to package.json so we can use import syntax
npm pkg set type=module`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-4">
        Save your API key as an environment variable so it's never hardcoded:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`# macOS / Linux / WSL
export PIXELPERFECT_API_KEY="pk_your_actual_key_here"

# Windows PowerShell
$env:PIXELPERFECT_API_KEY = "pk_your_actual_key_here"`}
        </pre>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Never commit API keys to git</h4>
            <p className="text-yellow-800 text-sm mb-0">
              For production, use a <span className="font-mono">.env</span> file (with{' '}
              <a href="https://www.npmjs.com/package/dotenv" className="text-yellow-900 underline">dotenv</a>) or
              your hosting provider's secrets manager. Add{' '}
              <span className="font-mono">.env</span> to your{' '}
              <span className="font-mono">.gitignore</span> immediately.
            </p>
          </div>
        </div>
      </div>

      {/* HTTP client choice */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Pick Your HTTP Client</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Three good options. Pick whichever fits your team's habits:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Client</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Install</th>
              <th className="text-left p-3 font-semibold text-gray-900">When to use</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Native fetch</strong></td>
              <td className="p-3 border-r border-gray-200 text-gray-500">None (built into Node 18+)</td>
              <td className="p-3">Default choice. Zero dependencies, modern API.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>axios</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono">npm install axios</span></td>
              <td className="p-3">Already in your codebase, or you want interceptors and richer error info.</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>got</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono">npm install got</span></td>
              <td className="p-3">You want built-in retries and a stream-friendly API.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Most examples below use native <span className="font-mono">fetch</span>. The axios
        equivalent is shown for the first example so you can see the difference; from there
        on, the patterns translate one-to-one.
      </p>

      {/* Single screenshot */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Capture a Single Screenshot</h2>
      <p className="text-gray-700 leading-relaxed">
        The simplest possible call — one URL, default settings, JSON response with the screenshot URL.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Using native fetch</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// capture.js
const API_KEY = process.env.PIXELPERFECT_API_KEY;
const ENDPOINT = "https://api.pixelperfectapi.net/api/v1/screenshot";

async function captureScreenshot(url, options = {}) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      url,
      width:     options.width     ?? 1920,
      height:    options.height    ?? 1080,
      format:    options.format    ?? "png",
      full_page: options.fullPage  ?? false,
      dark_mode: options.darkMode  ?? false,
      delay:     options.delay     ?? 0,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      \`PixelPerfect \${response.status}: \${errorBody.detail || response.statusText}\`
    );
  }

  return response.json();
}

// Usage
const result = await captureScreenshot("https://example.com", {
  width:    1920,
  height:   1080,
  fullPage: true,
});

console.log("Screenshot URL:", result.screenshot_url);
console.log("Size:",           result.size_bytes, "bytes");`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Using axios (alternative)</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import axios from "axios";

const client = axios.create({
  baseURL: "https://api.pixelperfectapi.net/api/v1",
  headers: {
    "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
    "Content-Type":  "application/json",
  },
  timeout: 130_000,  // 130s — slightly above the 120s server timeout
});

async function captureScreenshot(url, options = {}) {
  try {
    const { data } = await client.post("/screenshot", {
      url,
      width:     options.width     ?? 1920,
      height:    options.height    ?? 1080,
      format:    options.format    ?? "png",
      full_page: options.fullPage  ?? false,
    });
    return data;
  } catch (err) {
    if (err.response) {
      throw new Error(
        \`PixelPerfect \${err.response.status}: \${err.response.data.detail}\`
      );
    }
    throw err;
  }
}`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">What you get back</h4>
      <p className="text-gray-700 leading-relaxed">
        A successful response looks like this:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "screenshot_id": 42,
  "screenshot_url": "https://pub-xxx.r2.dev/screenshots/screenshot_20260418_abc123.png",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "size_bytes": 245678,
  "created_at": "2026-04-18T14:23:07.891234",
  "message": "Screenshot captured successfully"
}`}
        </pre>
      </div>

      {/* Saving to disk */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 4: Download the Screenshot to Disk</h2>
      <p className="text-gray-700 leading-relaxed">
        The <span className="font-mono">screenshot_url</span> points to a publicly accessible
        Cloudflare R2 file. Fetch it as binary and write it to your filesystem:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import { writeFile } from "node:fs/promises";

async function downloadScreenshot(screenshotUrl, localPath) {
  const response = await fetch(screenshotUrl);
  if (!response.ok) {
    throw new Error(\`Download failed: HTTP \${response.status}\`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(localPath, buffer);
  return localPath;
}

// Combine: capture + download
const result    = await captureScreenshot("https://example.com");
const localFile = await downloadScreenshot(result.screenshot_url, "./example.png");
console.log(\`Saved to \${localFile}\`);`}
        </pre>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">7-day retention reality</h4>
            <p className="text-blue-800 text-sm mb-0">
              R2 URLs work for <strong>7 days</strong>, then the file is auto-deleted. If you
              need long-term storage, download the screenshot to your own filesystem (or your
              own S3/R2 bucket) immediately after capture.
            </p>
          </div>
        </div>
      </div>

      {/* Batch processing */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 5: Run a Batch Job with Polling</h2>
      <p className="text-gray-700 leading-relaxed">
        For multiple URLs, batch is far more efficient than firing single-screenshot calls in
        parallel — one batch consumes one concurrency slot regardless of how many URLs are in it.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Here's the full pattern: submit, poll until terminal status, retrieve URLs.
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const API_KEY = process.env.PIXELPERFECT_API_KEY;
const BATCH   = "https://api.pixelperfectapi.net/api/v1/batch";
const HEADERS = {
  "Authorization": \`Bearer \${API_KEY}\`,
  "Content-Type":  "application/json",
};

const TERMINAL_STATES = new Set([
  "completed", "partial", "failed", "cancelled",
]);

async function submitBatch(urls, options = {}) {
  const response = await fetch(\`\${BATCH}/submit\`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      urls,
      format:          options.format          ?? "png",
      width:           options.width           ?? 1920,
      height:          options.height          ?? 1080,
      full_page:       options.fullPage        ?? false,
      dark_mode:       options.darkMode        ?? false,
      delay:           options.delay           ?? 0,
      remove_elements: options.removeElements  ?? [],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(\`Batch submit failed: \${err.detail || response.statusText}\`);
  }
  return response.json();
}

async function getJob(jobId) {
  const response = await fetch(\`\${BATCH}/jobs/\${jobId}\`, { headers: HEADERS });
  if (!response.ok) {
    throw new Error(\`Job lookup failed: HTTP \${response.status}\`);
  }
  return response.json();
}

async function pollUntilDone(jobId, { intervalMs = 2000, maxWaitMs = 600_000 } = {}) {
  const startedAt = Date.now();
  while (true) {
    const job = await getJob(jobId);
    console.log(\`[\${jobId}] \${job.completed}/\${job.total} done — \${job.status}\`);

    if (TERMINAL_STATES.has(job.status)) return job;

    if (Date.now() - startedAt > maxWaitMs) {
      throw new Error(\`Job \${jobId} did not finish within \${maxWaitMs}ms\`);
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
}

// Full workflow
const submission = await submitBatch(
  ["https://example.com", "https://github.com", "https://wikipedia.org"],
  { format: "png", fullPage: true, delay: 2 },
);

console.log(\`Submitted job \${submission.id}\`);

const finalJob = await pollUntilDone(submission.id);

for (const item of finalJob.items) {
  if (item.status === "completed") {
    console.log(\`✅ \${item.url} → \${item.screenshot_url}\`);
  } else {
    console.log(\`❌ \${item.url} → \${item.message}\`);
  }
}`}
        </pre>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Why 2 seconds between polls?</h4>
            <p className="text-blue-800 text-sm mb-0">
              That's the same cadence the dashboard uses. Faster polling burns API calls without
              giving you fresher data — screenshots take 3–10 seconds each. For very large jobs
              (500+ URLs), bumping to 5 seconds is reasonable.
            </p>
          </div>
        </div>
      </div>

      {/* File upload */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 6: Upload a URL List File</h2>
      <p className="text-gray-700 leading-relaxed">
        For workflows where URLs come from an external source (a CMS export, an SEO crawl, a
        spreadsheet), upload the file directly. Supports{' '}
        <span className="font-mono">.csv</span>, <span className="font-mono">.txt</span>, and{' '}
        <span className="font-mono">.tsv</span> — max <strong>2 MB</strong>.
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import { readFile } from "node:fs/promises";

async function submitBatchFile(filePath, options = {}) {
  const fileBuffer = await readFile(filePath);
  const fileName   = filePath.split(/[\\\\/]/).pop();

  // FormData is global in Node 18+
  const form = new FormData();
  form.append(
    "file",
    new Blob([fileBuffer], { type: "text/plain" }),
    fileName
  );
  form.append("format",    options.format    ?? "png");
  form.append("width",     String(options.width  ?? 1920));
  form.append("height",    String(options.height ?? 1080));
  form.append("full_page", String(options.fullPage ?? false));

  if (options.darkMode)        form.append("dark_mode", "true");
  if (options.delay)           form.append("delay", String(options.delay));
  if (options.removeElements)  form.append("remove_elements", options.removeElements.join(", "));

  const response = await fetch(
    "https://api.pixelperfectapi.net/api/v1/batch/submit_file",
    {
      method: "POST",
      headers: { "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\` },
      body: form,
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(\`File upload failed: \${err.detail || response.statusText}\`);
  }

  return response.json();
}

// Usage — assumes urls.txt has one URL per line
const job = await submitBatchFile("./urls.txt", {
  format:   "png",
  fullPage: true,
  delay:    2,
});
console.log(\`Submitted \${job.total} URLs as job \${job.id}\`);`}
        </pre>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <h4 className="text-sm font-semibold text-gray-900 mt-0 mb-2">
          Note on <span className="font-mono">remove_elements</span> over multipart
        </h4>
        <p className="text-sm text-gray-700 mb-0">
          When you upload via <span className="font-mono">/submit_file</span>, multipart forms
          don't natively support arrays. So <span className="font-mono">remove_elements</span> is
          passed as a comma-separated string (e.g.{' '}
          <span className="font-mono">".cookie-banner, #popup"</span>) — exactly like the
          dashboard text input. The backend splits on commas before applying.
        </p>
      </div>

      {/* Error handling */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 7: Handle Errors Properly</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        PixelPerfect returns specific HTTP codes for specific failures. Map them to actionable
        Node-side behavior:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Status</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Meaning</th>
              <th className="text-left p-3 font-semibold text-gray-900">What to do in Node</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">400</td>
              <td className="p-3 border-r border-gray-200">Bad request (no URLs, malformed body)</td>
              <td className="p-3">Don't retry — fix the input first.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">401</td>
              <td className="p-3 border-r border-gray-200">Bad or missing API key</td>
              <td className="p-3">Verify <span className="font-mono">PIXELPERFECT_API_KEY</span> env var is set.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">403</td>
              <td className="p-3 border-r border-gray-200">Plan limit (quota or batch size)</td>
              <td className="p-3">Don't retry — wait for monthly reset or upgrade plan.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">422</td>
              <td className="p-3 border-r border-gray-200">Validation error (e.g. delay {">"} 10)</td>
              <td className="p-3">Don't retry — check the field that failed validation.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">429</td>
              <td className="p-3 border-r border-gray-200">Concurrency cap reached</td>
              <td className="p-3">Retry after the <span className="font-mono">Retry-After</span> header (typically 1s).</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">500/503</td>
              <td className="p-3 border-r border-gray-200">Server-side issue</td>
              <td className="p-3">Retry with exponential backoff (up to 3 attempts).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">A reusable error class</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`class PixelPerfectError extends Error {
  constructor(status, detail, response) {
    super(\`PixelPerfect \${status}: \${detail}\`);
    this.name     = "PixelPerfectError";
    this.status   = status;
    this.detail   = detail;
    this.response = response;
  }

  // Convenience: should this error be retried?
  get isRetryable() {
    return this.status === 429 || this.status >= 500;
  }
}

async function callApi(url, init = {}) {
  const response = await fetch(url, init);

  if (response.ok) return response.json();

  const body = await response.json().catch(() => ({}));
  throw new PixelPerfectError(
    response.status,
    body.detail || response.statusText,
    response,
  );
}

// Usage with retry
async function captureWithRetry(url, options, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await callApi(
        "https://api.pixelperfectapi.net/api/v1/screenshot",
        {
          method: "POST",
          headers: {
            "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
            "Content-Type":  "application/json",
          },
          body: JSON.stringify({ url, ...options }),
        },
      );
    } catch (err) {
      if (!(err instanceof PixelPerfectError) || !err.isRetryable || attempt === maxAttempts) {
        throw err;
      }
      const backoff = 2 ** (attempt - 1) * 1000;  // 1s, 2s, 4s
      console.warn(\`Attempt \${attempt} failed (\${err.status}), retrying in \${backoff}ms\`);
      await new Promise(r => setTimeout(r, backoff));
    }
  }
}`}
        </pre>
      </div>

      {/* TypeScript */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 8: TypeScript Types (Bonus)</h2>
      <p className="text-gray-700 leading-relaxed">
        If your project uses TypeScript, here are the response interfaces. Drop these in a{' '}
        <span className="font-mono">types.ts</span> file:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// Single screenshot response
export interface ScreenshotResponse {
  screenshot_id:  number;
  screenshot_url: string;
  width:          number;
  height:         number;
  format:         "png" | "jpeg" | "webp" | "pdf";
  size_bytes:     number;
  created_at:     string;
  message:        string;
}

// Batch item state
export type BatchItemStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface BatchItem {
  idx:             number;
  url:             string;
  status:          BatchItemStatus;
  message:         string | null;
  screenshot_url:  string | null;
  file_size:       number | null;
  processing_time: number | null;
}

// Batch job state
export type BatchJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "partial"
  | "failed"
  | "cancelled";

export interface BatchJob {
  id:         string;
  created_at: string;
  status:     BatchJobStatus;
  format:     string;
  total:      number;
  completed:  number;
  failed:     number;
  queued:     number;
  processing: number;
  items:      BatchItem[];
}

// Request shapes
export interface ScreenshotOptions {
  width?:           number;
  height?:          number;
  format?:          "png" | "jpeg" | "webp" | "pdf";
  full_page?:       boolean;
  dark_mode?:       boolean;
  delay?:           number;
  remove_elements?: string[];
}

export interface BatchSubmitOptions extends ScreenshotOptions {
  urls:      string[];
  csv_text?: string;
  quality?:  number;
}`}
        </pre>
      </div>

      {/* Production patterns */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 9: Production Patterns</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Set request timeouts</h3>
      <p className="text-gray-700 leading-relaxed">
        The PixelPerfect server times out at 120 seconds. Set your client timeout slightly above
        that so you don't cancel a request that was about to succeed:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const controller = new AbortController();
const timeoutId  = setTimeout(() => controller.abort(), 130_000);

try {
  const response = await fetch(url, {
    ...init,
    signal: controller.signal,
  });
  // ... handle response
} finally {
  clearTimeout(timeoutId);
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Respect concurrency limits</h3>
      <p className="text-gray-700 leading-relaxed">
        Pro = 3 concurrent captures, Business = 5. If you fire 10{' '}
        <span className="font-mono">Promise.all</span> calls in parallel, most will hit HTTP 429.
        Use a concurrency limiter:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// Simple semaphore-style limiter
async function withConcurrency(items, fn, limit) {
  const results = new Array(items.length);
  let cursor = 0;

  const workers = Array.from({ length: limit }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx], idx);
    }
  });

  await Promise.all(workers);
  return results;
}

// Usage — capture 100 URLs, but only 3 in flight at a time (Pro tier)
const results = await withConcurrency(
  hundredUrls,
  url => captureScreenshot(url),
  3,
);`}
        </pre>
      </div>
      <p className="text-gray-700 leading-relaxed mt-3">
        Or — much simpler — just submit them as a batch and let the server handle pacing for you.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Log structurally</h3>
      <p className="text-gray-700 leading-relaxed">
        For production observability, log structured data instead of plain strings. Include
        the screenshot ID, URL, status, and processing time so failures are searchable later:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`console.log(JSON.stringify({
  event:           "screenshot_captured",
  screenshot_id:   result.screenshot_id,
  url:             targetUrl,
  size_bytes:      result.size_bytes,
  duration_ms:     Date.now() - startedAt,
}));`}
        </pre>
      </div>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"ReferenceError: fetch is not defined"</h4>
          <p className="text-sm text-gray-700">
            You're on Node 16 or earlier. Either upgrade to Node 18+ (recommended), or install{' '}
            <span className="font-mono">node-fetch</span> and import it explicitly:{' '}
            <span className="font-mono">import fetch from "node-fetch"</span>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Cannot use import statement outside a module"</h4>
          <p className="text-sm text-gray-700">
            Add <span className="font-mono">"type": "module"</span> to your{' '}
            <span className="font-mono">package.json</span>, or rename your file from{' '}
            <span className="font-mono">.js</span> to <span className="font-mono">.mjs</span>.
            Alternatively, switch to CommonJS{' '}
            <span className="font-mono">require()</span> syntax.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"PixelPerfect 401: Could not validate credentials"</h4>
          <p className="text-sm text-gray-700">
            Your API key is missing, malformed, or revoked. Verify{' '}
            <span className="font-mono">process.env.PIXELPERFECT_API_KEY</span> is set in the
            shell where Node runs (env vars don't carry across terminal sessions). Real keys
            start with <span className="font-mono">pk_</span> and are 35 characters total.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My batch poll loop runs forever"</h4>
          <p className="text-sm text-gray-700">
            Make sure you're checking for terminal states properly. The terminal set is{' '}
            <span className="font-mono">{'{ completed, partial, failed, cancelled }'}</span>{' '}—
            forgetting <span className="font-mono">partial</span> is a common bug that causes
            infinite polling on jobs where some URLs fail.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Downloaded image is corrupted"</h4>
          <p className="text-sm text-gray-700">
            You probably forgot to use <span className="font-mono">arrayBuffer()</span> when
            reading the response body. Don't use <span className="font-mono">text()</span>{' '}
            — that decodes the binary as UTF-8 and corrupts the file. Always:{' '}
            <span className="font-mono">Buffer.from(await response.arrayBuffer())</span>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"FormData is not defined"</h4>
          <p className="text-sm text-gray-700">
            Same root cause as the fetch error above — you're on Node 16 or earlier. FormData
            became global in Node 18. Upgrade Node, or install{' '}
            <span className="font-mono">form-data</span> as a polyfill.
          </p>
        </div>
      </div>

      {/* Next Steps - ✅ FIXED slug: python-integration (was: python-integration-guide) */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/python-integration"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Python integration guide</h4>
            <p className="text-sm text-blue-700 mb-0">Same patterns, Python flavor — for backend pipelines and data jobs</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/batch-processing-guide"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Batch processing guide</h4>
            <p className="text-sm text-green-700 mb-0">Deep-dive on batch lifecycle, recipes, and edge cases</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/rate-limits-and-quotas"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Rate limits and quotas</h4>
            <p className="text-sm text-purple-700 mb-0">Concurrency caps, monthly quotas, and how to stretch your plan</p>
          </div>
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Success footer */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-8 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Node.js integration, complete 🟢</h4>
            <p className="text-green-800 text-sm mb-0">
              You have everything you need: single captures, downloads, batch with polling,
              file uploads, structured error handling, TypeScript types, and production
              patterns. Time to build something cool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeIntegrationGuide;

// // ====================================================================================
// // ========================================
// // NODE.JS INTEGRATION GUIDE - PIXELPERFECT
// // ========================================
// // File: frontend/src/guides/NodeIntegrationGuide.jsx
// // Author: OneTechly
// // Update: April 2026
// //
// // Article #5 in "API Usage" category
// // Verified against:
// //   - backend/screenshot_endpoints.py (real request schema, response shape)
// //   - backend/batch.py (batch endpoints, job lifecycle, polling cadence)
// //   - backend/.env.production (tier limits, JWT lifetime, retention window)
// //   - backend/api_key_system.py (API key format: pk_ + 32 hex chars)
// //   - frontend/src/pages/BatchJobs.js (2-second polling cadence)
// //
// // Code style:
// //   - Native fetch (Node 18+) is the primary example throughout — zero deps
// //   - axios shown as alternative for users who prefer it
// //   - Every example uses environment variables for the API key
// //   - Real error messages from the backend, not generic placeholders
// //   - All endpoints use the production base URL
// // ========================================

// import React from 'react';

// const NodeIntegrationGuide = () => {
//   return (
//     <div className="prose prose-blue max-w-none">
//       {/* What you'll learn callout */}
//       <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-1">What you'll learn</h3>
//             <p className="text-blue-800 text-sm mb-0">
//               Build a production-ready PixelPerfect integration in Node.js. We'll cover capturing
//               single screenshots, downloading them to disk, running batch jobs with polling,
//               uploading URL files, handling errors properly, TypeScript types, and the production
//               patterns that keep your integration reliable at scale.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Prerequisites */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Before You Begin</h2>
//       <ul className="space-y-2">
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span className="leading-relaxed">
//             <strong>Node.js 18 or later</strong> — earlier versions don't have global{' '}
//             <span className="font-mono">fetch</span>. Check with{' '}
//             <span className="font-mono">node --version</span>
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span className="leading-relaxed">
//             A PixelPerfect API key (see{' '}
//             <a href="/help/article/getting-your-api-key" className="text-blue-600 hover:underline">
//               Getting your API key
//             </a>) — starts with <span className="font-mono">pk_</span>
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span className="leading-relaxed">
//             Comfort with async/await and ES modules
//           </span>
//         </li>
//       </ul>

//       {/* Step 1: Setup */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Project Setup</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Create a new directory and initialize a Node project:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`mkdir pixelperfect-node && cd pixelperfect-node
// npm init -y

// # Add "type": "module" to package.json so we can use import syntax
// npm pkg set type=module`}
//         </pre>
//       </div>

//       <p className="text-gray-700 leading-relaxed mt-4">
//         Save your API key as an environment variable so it's never hardcoded:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`# macOS / Linux / WSL
// export PIXELPERFECT_API_KEY="pk_your_actual_key_here"

// # Windows PowerShell
// $env:PIXELPERFECT_API_KEY = "pk_your_actual_key_here"`}
//         </pre>
//       </div>

//       <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Never commit API keys to git</h4>
//             <p className="text-yellow-800 text-sm mb-0">
//               For production, use a <span className="font-mono">.env</span> file (with{' '}
//               <a href="https://www.npmjs.com/package/dotenv" className="text-yellow-900 underline">dotenv</a>) or
//               your hosting provider's secrets manager. Add{' '}
//               <span className="font-mono">.env</span> to your{' '}
//               <span className="font-mono">.gitignore</span> immediately.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* HTTP client choice */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Pick Your HTTP Client</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Three good options. Pick whichever fits your team's habits:
//       </p>

//       <div className="overflow-x-auto my-6">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Client</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Install</th>
//               <th className="text-left p-3 font-semibold text-gray-900">When to use</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Native fetch</strong></td>
//               <td className="p-3 border-r border-gray-200 text-gray-500">None (built into Node 18+)</td>
//               <td className="p-3">Default choice. Zero dependencies, modern API.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>axios</strong></td>
//               <td className="p-3 border-r border-gray-200"><span className="font-mono">npm install axios</span></td>
//               <td className="p-3">Already in your codebase, or you want interceptors and richer error info.</td>
//             </tr>
//             <tr>
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>got</strong></td>
//               <td className="p-3 border-r border-gray-200"><span className="font-mono">npm install got</span></td>
//               <td className="p-3">You want built-in retries and a stream-friendly API.</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <p className="text-gray-700 leading-relaxed">
//         Most examples below use native <span className="font-mono">fetch</span>. The axios
//         equivalent is shown for the first example so you can see the difference; from there
//         on, the patterns translate one-to-one.
//       </p>

//       {/* Single screenshot */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Capture a Single Screenshot</h2>
//       <p className="text-gray-700 leading-relaxed">
//         The simplest possible call — one URL, default settings, JSON response with the screenshot URL.
//       </p>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Using native fetch</h4>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`// capture.js
// const API_KEY = process.env.PIXELPERFECT_API_KEY;
// const ENDPOINT = "https://api.pixelperfectapi.net/api/v1/screenshot";

// async function captureScreenshot(url, options = {}) {
//   const response = await fetch(ENDPOINT, {
//     method: "POST",
//     headers: {
//       "Authorization": \`Bearer \${API_KEY}\`,
//       "Content-Type":  "application/json",
//     },
//     body: JSON.stringify({
//       url,
//       width:     options.width     ?? 1920,
//       height:    options.height    ?? 1080,
//       format:    options.format    ?? "png",
//       full_page: options.fullPage  ?? false,
//       dark_mode: options.darkMode  ?? false,
//       delay:     options.delay     ?? 0,
//     }),
//   });

//   if (!response.ok) {
//     const errorBody = await response.json().catch(() => ({}));
//     throw new Error(
//       \`PixelPerfect \${response.status}: \${errorBody.detail || response.statusText}\`
//     );
//   }

//   return response.json();
// }

// // Usage
// const result = await captureScreenshot("https://example.com", {
//   width:    1920,
//   height:   1080,
//   fullPage: true,
// });

// console.log("Screenshot URL:", result.screenshot_url);
// console.log("Size:",           result.size_bytes, "bytes");`}
//         </pre>
//       </div>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Using axios (alternative)</h4>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`import axios from "axios";

// const client = axios.create({
//   baseURL: "https://api.pixelperfectapi.net/api/v1",
//   headers: {
//     "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
//     "Content-Type":  "application/json",
//   },
//   timeout: 130_000,  // 130s — slightly above the 120s server timeout
// });

// async function captureScreenshot(url, options = {}) {
//   try {
//     const { data } = await client.post("/screenshot", {
//       url,
//       width:     options.width     ?? 1920,
//       height:    options.height    ?? 1080,
//       format:    options.format    ?? "png",
//       full_page: options.fullPage  ?? false,
//     });
//     return data;
//   } catch (err) {
//     if (err.response) {
//       throw new Error(
//         \`PixelPerfect \${err.response.status}: \${err.response.data.detail}\`
//       );
//     }
//     throw err;
//   }
// }`}
//         </pre>
//       </div>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">What you get back</h4>
//       <p className="text-gray-700 leading-relaxed">
//         A successful response looks like this:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "screenshot_id": 42,
//   "screenshot_url": "https://pub-xxx.r2.dev/screenshots/screenshot_20260418_abc123.png",
//   "width": 1920,
//   "height": 1080,
//   "format": "png",
//   "size_bytes": 245678,
//   "created_at": "2026-04-18T14:23:07.891234",
//   "message": "Screenshot captured successfully"
// }`}
//         </pre>
//       </div>

//       {/* Saving to disk */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 4: Download the Screenshot to Disk</h2>
//       <p className="text-gray-700 leading-relaxed">
//         The <span className="font-mono">screenshot_url</span> points to a publicly accessible
//         Cloudflare R2 file. Fetch it as binary and write it to your filesystem:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`import { writeFile } from "node:fs/promises";

// async function downloadScreenshot(screenshotUrl, localPath) {
//   const response = await fetch(screenshotUrl);
//   if (!response.ok) {
//     throw new Error(\`Download failed: HTTP \${response.status}\`);
//   }
//   const buffer = Buffer.from(await response.arrayBuffer());
//   await writeFile(localPath, buffer);
//   return localPath;
// }

// // Combine: capture + download
// const result    = await captureScreenshot("https://example.com");
// const localFile = await downloadScreenshot(result.screenshot_url, "./example.png");
// console.log(\`Saved to \${localFile}\`);`}
//         </pre>
//       </div>

//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">7-day retention reality</h4>
//             <p className="text-blue-800 text-sm mb-0">
//               R2 URLs work for <strong>7 days</strong>, then the file is auto-deleted. If you
//               need long-term storage, download the screenshot to your own filesystem (or your
//               own S3/R2 bucket) immediately after capture.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Batch processing */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 5: Run a Batch Job with Polling</h2>
//       <p className="text-gray-700 leading-relaxed">
//         For multiple URLs, batch is far more efficient than firing single-screenshot calls in
//         parallel — one batch consumes one concurrency slot regardless of how many URLs are in it.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         Here's the full pattern: submit, poll until terminal status, retrieve URLs.
//       </p>

//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`const API_KEY = process.env.PIXELPERFECT_API_KEY;
// const BATCH   = "https://api.pixelperfectapi.net/api/v1/batch";
// const HEADERS = {
//   "Authorization": \`Bearer \${API_KEY}\`,
//   "Content-Type":  "application/json",
// };

// const TERMINAL_STATES = new Set([
//   "completed", "partial", "failed", "cancelled",
// ]);

// async function submitBatch(urls, options = {}) {
//   const response = await fetch(\`\${BATCH}/submit\`, {
//     method: "POST",
//     headers: HEADERS,
//     body: JSON.stringify({
//       urls,
//       format:          options.format          ?? "png",
//       width:           options.width           ?? 1920,
//       height:          options.height          ?? 1080,
//       full_page:       options.fullPage        ?? false,
//       dark_mode:       options.darkMode        ?? false,
//       delay:           options.delay           ?? 0,
//       remove_elements: options.removeElements  ?? [],
//     }),
//   });

//   if (!response.ok) {
//     const err = await response.json().catch(() => ({}));
//     throw new Error(\`Batch submit failed: \${err.detail || response.statusText}\`);
//   }
//   return response.json();
// }

// async function getJob(jobId) {
//   const response = await fetch(\`\${BATCH}/jobs/\${jobId}\`, { headers: HEADERS });
//   if (!response.ok) {
//     throw new Error(\`Job lookup failed: HTTP \${response.status}\`);
//   }
//   return response.json();
// }

// async function pollUntilDone(jobId, { intervalMs = 2000, maxWaitMs = 600_000 } = {}) {
//   const startedAt = Date.now();
//   while (true) {
//     const job = await getJob(jobId);
//     console.log(\`[\${jobId}] \${job.completed}/\${job.total} done — \${job.status}\`);

//     if (TERMINAL_STATES.has(job.status)) return job;

//     if (Date.now() - startedAt > maxWaitMs) {
//       throw new Error(\`Job \${jobId} did not finish within \${maxWaitMs}ms\`);
//     }
//     await new Promise(r => setTimeout(r, intervalMs));
//   }
// }

// // Full workflow
// const submission = await submitBatch(
//   ["https://example.com", "https://github.com", "https://wikipedia.org"],
//   { format: "png", fullPage: true, delay: 2 },
// );

// console.log(\`Submitted job \${submission.id}\`);

// const finalJob = await pollUntilDone(submission.id);

// for (const item of finalJob.items) {
//   if (item.status === "completed") {
//     console.log(\`✅ \${item.url} → \${item.screenshot_url}\`);
//   } else {
//     console.log(\`❌ \${item.url} → \${item.message}\`);
//   }
// }`}
//         </pre>
//       </div>

//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Why 2 seconds between polls?</h4>
//             <p className="text-blue-800 text-sm mb-0">
//               That's the same cadence the dashboard uses. Faster polling burns API calls without
//               giving you fresher data — screenshots take 3–10 seconds each. For very large jobs
//               (500+ URLs), bumping to 5 seconds is reasonable.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* File upload */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 6: Upload a URL List File</h2>
//       <p className="text-gray-700 leading-relaxed">
//         For workflows where URLs come from an external source (a CMS export, an SEO crawl, a
//         spreadsheet), upload the file directly. Supports{' '}
//         <span className="font-mono">.csv</span>, <span className="font-mono">.txt</span>, and{' '}
//         <span className="font-mono">.tsv</span> — max <strong>2 MB</strong>.
//       </p>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`import { readFile } from "node:fs/promises";

// async function submitBatchFile(filePath, options = {}) {
//   const fileBuffer = await readFile(filePath);
//   const fileName   = filePath.split(/[\\\\/]/).pop();

//   // FormData is global in Node 18+
//   const form = new FormData();
//   form.append(
//     "file",
//     new Blob([fileBuffer], { type: "text/plain" }),
//     fileName
//   );
//   form.append("format",    options.format    ?? "png");
//   form.append("width",     String(options.width  ?? 1920));
//   form.append("height",    String(options.height ?? 1080));
//   form.append("full_page", String(options.fullPage ?? false));

//   if (options.darkMode)        form.append("dark_mode", "true");
//   if (options.delay)           form.append("delay", String(options.delay));
//   if (options.removeElements)  form.append("remove_elements", options.removeElements.join(", "));

//   const response = await fetch(
//     "https://api.pixelperfectapi.net/api/v1/batch/submit_file",
//     {
//       method: "POST",
//       headers: { "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\` },
//       body: form,
//     },
//   );

//   if (!response.ok) {
//     const err = await response.json().catch(() => ({}));
//     throw new Error(\`File upload failed: \${err.detail || response.statusText}\`);
//   }

//   return response.json();
// }

// // Usage — assumes urls.txt has one URL per line
// const job = await submitBatchFile("./urls.txt", {
//   format:   "png",
//   fullPage: true,
//   delay:    2,
// });
// console.log(\`Submitted \${job.total} URLs as job \${job.id}\`);`}
//         </pre>
//       </div>

//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
//         <h4 className="text-sm font-semibold text-gray-900 mt-0 mb-2">
//           Note on <span className="font-mono">remove_elements</span> over multipart
//         </h4>
//         <p className="text-sm text-gray-700 mb-0">
//           When you upload via <span className="font-mono">/submit_file</span>, multipart forms
//           don't natively support arrays. So <span className="font-mono">remove_elements</span> is
//           passed as a comma-separated string (e.g.{' '}
//           <span className="font-mono">".cookie-banner, #popup"</span>) — exactly like the
//           dashboard text input. The backend splits on commas before applying.
//         </p>
//       </div>

//       {/* Error handling */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 7: Handle Errors Properly</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         PixelPerfect returns specific HTTP codes for specific failures. Map them to actionable
//         Node-side behavior:
//       </p>

//       <div className="overflow-x-auto my-6">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Status</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Meaning</th>
//               <th className="text-left p-3 font-semibold text-gray-900">What to do in Node</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">400</td>
//               <td className="p-3 border-r border-gray-200">Bad request (no URLs, malformed body)</td>
//               <td className="p-3">Don't retry — fix the input first.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">401</td>
//               <td className="p-3 border-r border-gray-200">Bad or missing API key</td>
//               <td className="p-3">Verify <span className="font-mono">PIXELPERFECT_API_KEY</span> env var is set.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">403</td>
//               <td className="p-3 border-r border-gray-200">Plan limit (quota or batch size)</td>
//               <td className="p-3">Don't retry — wait for monthly reset or upgrade plan.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">422</td>
//               <td className="p-3 border-r border-gray-200">Validation error (e.g. delay {">"} 10)</td>
//               <td className="p-3">Don't retry — check the field that failed validation.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">429</td>
//               <td className="p-3 border-r border-gray-200">Concurrency cap reached</td>
//               <td className="p-3">Retry after the <span className="font-mono">Retry-After</span> header (typically 1s).</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50 font-mono text-xs">500/503</td>
//               <td className="p-3 border-r border-gray-200">Server-side issue</td>
//               <td className="p-3">Retry with exponential backoff (up to 3 attempts).</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">A reusable error class</h4>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`class PixelPerfectError extends Error {
//   constructor(status, detail, response) {
//     super(\`PixelPerfect \${status}: \${detail}\`);
//     this.name     = "PixelPerfectError";
//     this.status   = status;
//     this.detail   = detail;
//     this.response = response;
//   }

//   // Convenience: should this error be retried?
//   get isRetryable() {
//     return this.status === 429 || this.status >= 500;
//   }
// }

// async function callApi(url, init = {}) {
//   const response = await fetch(url, init);

//   if (response.ok) return response.json();

//   const body = await response.json().catch(() => ({}));
//   throw new PixelPerfectError(
//     response.status,
//     body.detail || response.statusText,
//     response,
//   );
// }

// // Usage with retry
// async function captureWithRetry(url, options, maxAttempts = 3) {
//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     try {
//       return await callApi(
//         "https://api.pixelperfectapi.net/api/v1/screenshot",
//         {
//           method: "POST",
//           headers: {
//             "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
//             "Content-Type":  "application/json",
//           },
//           body: JSON.stringify({ url, ...options }),
//         },
//       );
//     } catch (err) {
//       if (!(err instanceof PixelPerfectError) || !err.isRetryable || attempt === maxAttempts) {
//         throw err;
//       }
//       const backoff = 2 ** (attempt - 1) * 1000;  // 1s, 2s, 4s
//       console.warn(\`Attempt \${attempt} failed (\${err.status}), retrying in \${backoff}ms\`);
//       await new Promise(r => setTimeout(r, backoff));
//     }
//   }
// }`}
//         </pre>
//       </div>

//       {/* TypeScript */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 8: TypeScript Types (Bonus)</h2>
//       <p className="text-gray-700 leading-relaxed">
//         If your project uses TypeScript, here are the response interfaces. Drop these in a{' '}
//         <span className="font-mono">types.ts</span> file:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`// Single screenshot response
// export interface ScreenshotResponse {
//   screenshot_id:  number;
//   screenshot_url: string;
//   width:          number;
//   height:         number;
//   format:         "png" | "jpeg" | "webp" | "pdf";
//   size_bytes:     number;
//   created_at:     string;
//   message:        string;
// }

// // Batch item state
// export type BatchItemStatus =
//   | "queued"
//   | "processing"
//   | "completed"
//   | "failed"
//   | "cancelled";

// export interface BatchItem {
//   idx:             number;
//   url:             string;
//   status:          BatchItemStatus;
//   message:         string | null;
//   screenshot_url:  string | null;
//   file_size:       number | null;
//   processing_time: number | null;
// }

// // Batch job state
// export type BatchJobStatus =
//   | "queued"
//   | "processing"
//   | "completed"
//   | "partial"
//   | "failed"
//   | "cancelled";

// export interface BatchJob {
//   id:         string;
//   created_at: string;
//   status:     BatchJobStatus;
//   format:     string;
//   total:      number;
//   completed:  number;
//   failed:     number;
//   queued:     number;
//   processing: number;
//   items:      BatchItem[];
// }

// // Request shapes
// export interface ScreenshotOptions {
//   width?:           number;
//   height?:          number;
//   format?:          "png" | "jpeg" | "webp" | "pdf";
//   full_page?:       boolean;
//   dark_mode?:       boolean;
//   delay?:           number;
//   remove_elements?: string[];
// }

// export interface BatchSubmitOptions extends ScreenshotOptions {
//   urls:      string[];
//   csv_text?: string;
//   quality?:  number;
// }`}
//         </pre>
//       </div>

//       {/* Production patterns */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 9: Production Patterns</h2>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Set request timeouts</h3>
//       <p className="text-gray-700 leading-relaxed">
//         The PixelPerfect server times out at 120 seconds. Set your client timeout slightly above
//         that so you don't cancel a request that was about to succeed:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`const controller = new AbortController();
// const timeoutId  = setTimeout(() => controller.abort(), 130_000);

// try {
//   const response = await fetch(url, {
//     ...init,
//     signal: controller.signal,
//   });
//   // ... handle response
// } finally {
//   clearTimeout(timeoutId);
// }`}
//         </pre>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Respect concurrency limits</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Pro = 3 concurrent captures, Business = 5. If you fire 10{' '}
//         <span className="font-mono">Promise.all</span> calls in parallel, most will hit HTTP 429.
//         Use a concurrency limiter:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`// Simple semaphore-style limiter
// async function withConcurrency(items, fn, limit) {
//   const results = new Array(items.length);
//   let cursor = 0;

//   const workers = Array.from({ length: limit }, async () => {
//     while (cursor < items.length) {
//       const idx = cursor++;
//       results[idx] = await fn(items[idx], idx);
//     }
//   });

//   await Promise.all(workers);
//   return results;
// }

// // Usage — capture 100 URLs, but only 3 in flight at a time (Pro tier)
// const results = await withConcurrency(
//   hundredUrls,
//   url => captureScreenshot(url),
//   3,
// );`}
//         </pre>
//       </div>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         Or — much simpler — just submit them as a batch and let the server handle pacing for you.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Log structurally</h3>
//       <p className="text-gray-700 leading-relaxed">
//         For production observability, log structured data instead of plain strings. Include
//         the screenshot ID, URL, status, and processing time so failures are searchable later:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`console.log(JSON.stringify({
//   event:           "screenshot_captured",
//   screenshot_id:   result.screenshot_id,
//   url:             targetUrl,
//   size_bytes:      result.size_bytes,
//   duration_ms:     Date.now() - startedAt,
// }));`}
//         </pre>
//       </div>

//       {/* Troubleshooting */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

//       <div className="space-y-4">
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"ReferenceError: fetch is not defined"</h4>
//           <p className="text-sm text-gray-700">
//             You're on Node 16 or earlier. Either upgrade to Node 18+ (recommended), or install{' '}
//             <span className="font-mono">node-fetch</span> and import it explicitly:{' '}
//             <span className="font-mono">import fetch from "node-fetch"</span>.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"Cannot use import statement outside a module"</h4>
//           <p className="text-sm text-gray-700">
//             Add <span className="font-mono">"type": "module"</span> to your{' '}
//             <span className="font-mono">package.json</span>, or rename your file from{' '}
//             <span className="font-mono">.js</span> to <span className="font-mono">.mjs</span>.
//             Alternatively, switch to CommonJS{' '}
//             <span className="font-mono">require()</span> syntax.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"PixelPerfect 401: Could not validate credentials"</h4>
//           <p className="text-sm text-gray-700">
//             Your API key is missing, malformed, or revoked. Verify{' '}
//             <span className="font-mono">process.env.PIXELPERFECT_API_KEY</span> is set in the
//             shell where Node runs (env vars don't carry across terminal sessions). Real keys
//             start with <span className="font-mono">pk_</span> and are 35 characters total.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"My batch poll loop runs forever"</h4>
//           <p className="text-sm text-gray-700">
//             Make sure you're checking for terminal states properly. The terminal set is{' '}
//             <span className="font-mono">{'{ completed, partial, failed, cancelled }'}</span>{' '}—
//             forgetting <span className="font-mono">partial</span> is a common bug that causes
//             infinite polling on jobs where some URLs fail.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"Downloaded image is corrupted"</h4>
//           <p className="text-sm text-gray-700">
//             You probably forgot to use <span className="font-mono">arrayBuffer()</span> when
//             reading the response body. Don't use <span className="font-mono">text()</span>{' '}
//             — that decodes the binary as UTF-8 and corrupts the file. Always:{' '}
//             <span className="font-mono">Buffer.from(await response.arrayBuffer())</span>.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"FormData is not defined"</h4>
//           <p className="text-sm text-gray-700">
//             Same root cause as the fetch error above — you're on Node 16 or earlier. FormData
//             became global in Node 18. Upgrade Node, or install{' '}
//             <span className="font-mono">form-data</span> as a polyfill.
//           </p>
//         </div>
//       </div>

//       {/* Next Steps */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

//       <div className="grid grid-cols-1 gap-4">
//         <a
//           href="/help/article/python-integration-guide"
//           className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-blue-900 mb-1">Python integration guide</h4>
//             <p className="text-sm text-blue-700 mb-0">Same patterns, Python flavor — for backend pipelines and data jobs</p>
//           </div>
//           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/batch-processing-guide"
//           className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-green-900 mb-1">Batch processing guide</h4>
//             <p className="text-sm text-green-700 mb-0">Deep-dive on batch lifecycle, recipes, and edge cases</p>
//           </div>
//           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/rate-limits-and-quotas"
//           className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-purple-900 mb-1">Rate limits and quotas</h4>
//             <p className="text-sm text-purple-700 mb-0">Concurrency caps, monthly quotas, and how to stretch your plan</p>
//           </div>
//           <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>
//       </div>

//       {/* Success footer */}
//       <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-8 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Node.js integration, complete 🟢</h4>
//             <p className="text-green-800 text-sm mb-0">
//               You have everything you need: single captures, downloads, batch with polling,
//               file uploads, structured error handling, TypeScript types, and production
//               patterns. Time to build something cool.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NodeIntegrationGuide;