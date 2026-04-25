// ========================================
// BATCH PROCESSING GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/BatchProcessingGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #3 in "API Usage" category
// Verified against:
//   - backend/batch.py (real endpoints, Pydantic model, job lifecycle)
//   - frontend/src/pages/BatchJobs.js (polling interval, UI workflow)
//   - backend/main.py (router prefix → /api/v1/batch)
//
// ✅ FIX (Apr 2026): Method 3 now covers both file-upload paths:
//   drag-and-drop AND the Browse button (tap-to-open file picker).
//   Also mentions the 2 MB file size limit inline.
// ========================================

import React from 'react';

const BatchProcessingGuide = () => {
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
              Capture screenshots of many websites at once using the Batch API. This guide covers
              the three ways to submit a job (JSON, file upload, dashboard), how the async job
              lifecycle works, how to poll for results, how to retry and cancel, and four
              ready-to-use recipes.
            </p>
          </div>
        </div>
      </div>

      {/* When to use batch */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Use Batch</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📸</span>
            <h4 className="font-semibold text-gray-900 mb-0">One URL? Use the single endpoint.</h4>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            If you have one website to capture, use{' '}
            <span className="font-mono">POST /api/v1/screenshot</span>. It's synchronous —
            request goes in, PNG comes back. See{' '}
            <a href="/help/article/making-first-api-request" className="text-blue-600 hover:underline">
              Making your first API request
            </a>.
          </p>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📦</span>
            <h4 className="font-semibold text-gray-900 mb-0">Many URLs? Use batch.</h4>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            For 2 to 1,000 URLs captured with the same settings, batch is the right tool. Submit
            once, check back later for results.
          </p>
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
            A <strong>Pro plan or higher</strong> — batch is not available on the Free tier
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            Your API key (see{' '}
            <a href="/help/article/getting-your-api-key" className="text-blue-600 hover:underline">
              Getting your API key
            </a>)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            Understanding of{' '}
            <a href="/help/article/screenshot-parameters-explained" className="text-blue-600 hover:underline">
              screenshot parameters
            </a>{' '}— batch reuses the same ones
          </span>
        </li>
      </ul>

      {/* How batch works — async model */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Batch Works — The Async Model</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Unlike the single-screenshot endpoint (which captures synchronously and returns the result
        in one call), batch is asynchronous. Three steps:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">1</span>
            Submit
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            POST your list of URLs. The API returns immediately with a{' '}
            <span className="font-mono">job_id</span> and the job status (<span className="font-mono">queued</span>).
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">2</span>
            Poll
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            Check <span className="font-mono">GET /jobs/&#123;job_id&#125;</span> every 2 seconds
            to see progress. Each item transitions{' '}
            <span className="font-mono">queued → processing → completed/failed</span>.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">3</span>
            Retrieve
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            When the job finishes (<span className="font-mono">completed</span>,{' '}
            <span className="font-mono">partial</span>, or <span className="font-mono">failed</span>),
            every item has a <span className="font-mono">screenshot_url</span> you can download.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Why async?</h4>
            <p className="text-blue-800 text-sm mb-0">
              Capturing 50 URLs sequentially takes time — typically 3–10 seconds per URL depending
              on site complexity. A single synchronous HTTP request would hang for minutes and
              time out in most network environments. The async model returns the job handle
              immediately and captures run in the background.
            </p>
          </div>
        </div>
      </div>

      {/* Tier limits */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Batch Limits by Plan</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Plan</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">URLs per batch</th>
              <th className="text-left p-3 font-semibold text-gray-900">Typical use case</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Free</strong></td>
              <td className="p-3 border-r border-gray-200 text-gray-500">Not available</td>
              <td className="p-3 text-gray-500">Use the single-screenshot endpoint instead</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Pro</strong></td>
              <td className="p-3 border-r border-gray-200">Up to <strong>50</strong> URLs</td>
              <td className="p-3">Small sites, daily reports, competitor tracking</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Business</strong></td>
              <td className="p-3 border-r border-gray-200">Up to <strong>200</strong> URLs</td>
              <td className="p-3">Medium catalogs, regional monitoring, content audits</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Premium</strong></td>
              <td className="p-3 border-r border-gray-200">Up to <strong>1,000</strong> URLs</td>
              <td className="p-3">Large catalogs, SEO scraping, enterprise workflows</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Every URL counts toward your monthly screenshot quota</h4>
            <p className="text-yellow-800 text-sm mb-0">
              A batch of 50 URLs consumes <strong>50 screenshots</strong> from your monthly
              allowance — plus <strong>1 batch request</strong> from the separate batch-requests
              counter. Plan accordingly, especially on Pro.
            </p>
          </div>
        </div>
      </div>

      {/* Feature parity callout */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-5 my-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">✨</span>
          <div>
            <h4 className="text-base font-semibold text-purple-900 mt-0 mb-2">
              Now at full parity with the single endpoint
            </h4>
            <p className="text-purple-800 text-sm mb-0 leading-relaxed">
              Batch now supports everything the single-screenshot endpoint supports —{' '}
              <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-purple-300">dark_mode</span>,{' '}
              <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-purple-300">delay</span>, and{' '}
              <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-purple-300">remove_elements</span>{' '}
              are applied to every URL in your batch. Hide cookie banners across 200 sites with
              one request. Capture 1,000 pages in dark mode. Add a 3-second delay for lazy-loaded
              images — batch-wide.
            </p>
          </div>
        </div>
      </div>

      {/* Method 1: JSON */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 1: Submit via JSON</h2>
      <p className="text-gray-700 leading-relaxed">
        The standard way. Send a JSON body with a <span className="font-mono">urls</span> array
        and your capture options. The example below shows a realistic submission that combines
        several options together.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">cURL (Linux / macOS / WSL)</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/batch/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      "https://example.com",
      "https://github.com",
      "https://wikipedia.org"
    ],
    "format": "png",
    "width": 1920,
    "height": 1080,
    "full_page": true,
    "dark_mode": false,
    "delay": 2,
    "remove_elements": [
      "#cookie-banner",
      ".gdpr-modal"
    ]
  }'`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">PowerShell (Windows)</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`$body = @{
  urls            = @(
    "https://example.com",
    "https://github.com",
    "https://wikipedia.org"
  )
  format          = "png"
  width           = 1920
  height          = 1080
  full_page       = $true
  dark_mode       = $false
  delay           = 2
  remove_elements = @("#cookie-banner", ".gdpr-modal")
} | ConvertTo-Json

Invoke-RestMethod -Method POST \`
  -Uri "https://api.pixelperfectapi.net/api/v1/batch/submit" \`
  -Headers @{
    "Authorization" = "Bearer YOUR_API_KEY"
    "Content-Type"  = "application/json"
  } \`
  -Body $body`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-4">
        The response comes back immediately with the initial job state:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "id": "a3f2c1b9d4e5f6a8",
  "created_at": "2026-04-23T14:22:01.334521",
  "status": "queued",
  "format": "png",
  "total": 3,
  "completed": 0,
  "failed": 0,
  "queued": 3,
  "processing": 0,
  "items": [
    { "idx": 0, "url": "https://example.com",   "status": "queued", "message": "Waiting to process..." },
    { "idx": 1, "url": "https://github.com",    "status": "queued", "message": "Waiting to process..." },
    { "idx": 2, "url": "https://wikipedia.org", "status": "queued", "message": "Waiting to process..." }
  ]
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Save the <span className="font-mono">id</span> — that's your job handle for polling.
      </p>

      {/* Method 2: File upload */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 2: Submit via File Upload</h2>
      <p className="text-gray-700 leading-relaxed">
        For workflows where URLs live in a file you already manage (exports from a CMS, SEO tools,
        or spreadsheets), upload it directly. Supports <strong>.csv</strong>, <strong>.txt</strong>,
        and <strong>.tsv</strong> formats — max file size <strong>2 MB</strong>.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Accepted file formats</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 text-sm">
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-1">.txt (one per line)</h5>
          <div className="bg-gray-900 rounded p-2 mt-2">
            <code className="text-green-400 text-xs font-mono block whitespace-pre">
{`https://example.com
https://github.com
https://wikipedia.org`}
            </code>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-1">.csv (comma-separated)</h5>
          <div className="bg-gray-900 rounded p-2 mt-2">
            <code className="text-green-400 text-xs font-mono block whitespace-pre">
{`https://example.com,
https://github.com,
https://wikipedia.org`}
            </code>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-1">.tsv (tab-separated)</h5>
          <p className="text-xs text-gray-600 mt-2">
            Same as CSV but uses tab characters as the separator. Useful for exports from
            spreadsheet apps that save with tabs.
          </p>
        </div>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Uploading via cURL</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/batch/submit_file \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@urls.txt" \\
  -F "format=png" \\
  -F "width=1920" \\
  -F "height=1080" \\
  -F "full_page=true" \\
  -F "dark_mode=false" \\
  -F "delay=2" \\
  -F "remove_elements=#cookie-banner, .gdpr-modal"`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Uploading via PowerShell</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`$form = @{
  file            = Get-Item "urls.txt"
  format          = "png"
  width           = "1920"
  height          = "1080"
  full_page       = "true"
  dark_mode       = "false"
  delay           = "2"
  remove_elements = "#cookie-banner, .gdpr-modal"
}

Invoke-RestMethod -Method POST \`
  -Uri "https://api.pixelperfectapi.net/api/v1/batch/submit_file" \`
  -Headers @{ "Authorization" = "Bearer YOUR_API_KEY" } \`
  -Form $form`}
        </pre>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <h4 className="text-sm font-semibold text-gray-900 mt-0 mb-2">
          File upload note: <span className="font-mono">remove_elements</span> format
        </h4>
        <p className="text-sm text-gray-700 mb-0">
          When submitting via <span className="font-mono">/submit_file</span> (multipart upload),
          pass <span className="font-mono">remove_elements</span> as a comma-separated string:{' '}
          <span className="font-mono">".cookie-banner, #popup, .ads"</span>. Multipart forms
          don't natively support arrays, so comma-separated mirrors the dashboard text input.
        </p>
      </div>

      {/* ✅ FIX (Apr 2026): Method 3 now covers both upload paths (drag-drop + Browse) */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 3: Submit from the Dashboard</h2>
      <p className="text-gray-700 leading-relaxed">
        If you just want to run a batch without writing code, use the dashboard playground:
      </p>
      <ol className="space-y-2 mt-4 list-decimal list-inside text-gray-700">
        <li>Sign in to{' '}
          <a href="https://pixelperfectapi.net/dashboard" className="text-blue-600 hover:underline">
            pixelperfectapi.net/dashboard
          </a>
        </li>
        <li>Navigate to <strong>📦 Batch Jobs</strong> in the navigation</li>
        <li>Add your URLs using one of three methods (pick whichever is most convenient):
          <ul className="mt-2 ml-6 space-y-1 list-disc text-sm">
            <li><strong>Paste URLs</strong> into the textarea on the left, one per line</li>
            <li><strong>Drag and drop</strong> a CSV, TXT, or TSV file onto the upload area on the right</li>
            <li>Or <strong>click the <span className="font-mono">Browse…</span> button</strong> to open your device's file picker and select a file from your computer (max 2 MB)</li>
          </ul>
        </li>
        <li>Pick your viewport preset (Desktop, Laptop, Tablet, Mobile) and format</li>
        <li>Set <strong>Advanced Options</strong> if needed — dark mode, delay, elements to hide</li>
        <li>Click <strong>🚀 Submit Batch Job</strong></li>
      </ol>
      <p className="text-gray-700 leading-relaxed mt-3">
        The dashboard polls the job automatically and shows a live progress bar with per-item
        status. Great for ad-hoc runs where the API isn't needed. On mobile, the{' '}
        <span className="font-mono">Browse…</span> button is especially useful since drag-and-drop
        isn't practical on a touchscreen.
      </p>

      {/* The Job object */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Anatomy of a Job Response</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Every batch endpoint returns the same <span className="font-mono">Job</span> object. Here's
        what each field means:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">id</h4>
          <p className="text-sm text-gray-700 mb-0">
            16-character hex string. Your handle for polling, retrying, cancelling, or deleting.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">created_at</h4>
          <p className="text-sm text-gray-700 mb-0">
            ISO 8601 timestamp (UTC). When the job was submitted.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">status</h4>
          <p className="text-sm text-gray-700 mb-0">
            One of: <span className="font-mono">queued</span>, <span className="font-mono">processing</span>,{' '}
            <span className="font-mono">completed</span>, <span className="font-mono">partial</span>,{' '}
            <span className="font-mono">failed</span>, <span className="font-mono">cancelled</span>.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">total, completed, failed, queued, processing</h4>
          <p className="text-sm text-gray-700 mb-0">
            Running counters. <span className="font-mono">completed + failed + queued + processing = total</span>.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">items[]</h4>
          <p className="text-sm text-gray-700 mb-0">
            One entry per URL, in the order you submitted them. Each item has its own{' '}
            <span className="font-mono">idx</span>, <span className="font-mono">url</span>,{' '}
            <span className="font-mono">status</span>, <span className="font-mono">message</span>,{' '}
            <span className="font-mono">screenshot_url</span> (once captured),{' '}
            <span className="font-mono">file_size</span>, and{' '}
            <span className="font-mono">processing_time</span> in seconds.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Job-level status values</h3>
      <div className="space-y-3 my-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-mono text-sm font-semibold text-blue-700 mb-1">queued</h4>
          <p className="text-sm text-gray-700 mb-0">The job hasn't started yet. Usually transitions to <span className="font-mono">processing</span> within a second.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-mono text-sm font-semibold text-blue-700 mb-1">processing</h4>
          <p className="text-sm text-gray-700 mb-0">Items are being captured. Check item-level status for per-URL progress.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-mono text-sm font-semibold text-green-700 mb-1">completed</h4>
          <p className="text-sm text-gray-700 mb-0">Every item succeeded. No failures.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-mono text-sm font-semibold text-yellow-700 mb-1">partial</h4>
          <p className="text-sm text-gray-700 mb-0">Some items succeeded and some failed. Inspect item-level status to see which.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-mono text-sm font-semibold text-red-700 mb-1">failed</h4>
          <p className="text-sm text-gray-700 mb-0">Every item failed. Usually indicates a systemic problem (expired API key, service outage).</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-mono text-sm font-semibold text-gray-700 mb-1">cancelled</h4>
          <p className="text-sm text-gray-700 mb-0">You cancelled the job via <span className="font-mono">POST /jobs/&#123;id&#125;/cancel</span>. Items already captured are preserved.</p>
        </div>
      </div>

      {/* Polling */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Polling for Results</h2>
      <p className="text-gray-700 leading-relaxed">
        After submission, poll the job endpoint until its <span className="font-mono">status</span> is
        one of the terminal values (<span className="font-mono">completed</span>,{' '}
        <span className="font-mono">partial</span>, <span className="font-mono">failed</span>,{' '}
        <span className="font-mono">cancelled</span>).
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        The dashboard polls every <strong>2 seconds</strong> — a good default for most clients.
        Anything faster risks hitting rate limits without adding value (screenshots take several
        seconds each, so sub-second polling just burns API calls).
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Python polling loop</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import os, time, requests

API_KEY = os.environ["PIXELPERFECT_API_KEY"]
BASE    = "https://api.pixelperfectapi.net/api/v1/batch"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# 1. Submit
submit = requests.post(f"{BASE}/submit", headers=HEADERS, json={
    "urls":   ["https://example.com", "https://github.com"],
    "format": "png",
}).json()

job_id = submit["id"]
print(f"Submitted job {job_id}")

# 2. Poll until terminal status
TERMINAL = {"completed", "partial", "failed", "cancelled"}
while True:
    job = requests.get(f"{BASE}/jobs/{job_id}", headers=HEADERS).json()
    print(f"  {job['completed']}/{job['total']} done, status={job['status']}")
    if job["status"] in TERMINAL:
        break
    time.sleep(2)

# 3. Retrieve URLs
for item in job["items"]:
    if item["status"] == "completed":
        print(item["screenshot_url"])
    else:
        print(f"FAILED: {item['url']} — {item['message']}")`}
        </pre>
      </div>

      {/* Job management */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Jobs</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Action</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Endpoint</th>
              <th className="text-left p-3 font-semibold text-gray-900">What it does</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>List jobs</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">GET /api/v1/batch/jobs</span></td>
              <td className="p-3">Returns every batch job you've created, newest first.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Get one job</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">GET /api/v1/batch/jobs/&#123;id&#125;</span></td>
              <td className="p-3">Fetches the latest state of a single job (use for polling).</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Retry failed</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">POST /api/v1/batch/jobs/&#123;id&#125;/retry_failed</span></td>
              <td className="p-3">Re-queues only the items that failed. Completed items stay completed.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Cancel</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">POST /api/v1/batch/jobs/&#123;id&#125;/cancel</span></td>
              <td className="p-3">Stops a queued or processing job. Already-captured items are preserved.</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Delete</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">DELETE /api/v1/batch/jobs/&#123;id&#125;</span></td>
              <td className="p-3">Removes the job record. Captured screenshots remain in your history.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Retry reuses your original settings</h4>
            <p className="text-blue-800 text-sm mb-0">
              When you retry failed items, the same viewport, format, dark mode, delay, and
              remove-elements settings from the original submission are applied. No need to
              re-specify them.
            </p>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Batch Parameters</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Batch accepts the same capture options as the single-screenshot endpoint. Every URL in the
        batch uses the same settings.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Parameter</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Type</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Default</th>
              <th className="text-left p-3 font-semibold text-gray-900">Notes</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">urls</td>
              <td className="p-3 border-r border-gray-200">array&lt;string&gt;</td>
              <td className="p-3 border-r border-gray-200 text-gray-500">required*</td>
              <td className="p-3">Either this or <span className="font-mono">csv_text</span> must be present.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">csv_text</td>
              <td className="p-3 border-r border-gray-200">string</td>
              <td className="p-3 border-r border-gray-200 text-gray-500">required*</td>
              <td className="p-3">Alternative to <span className="font-mono">urls</span> — comma / tab / newline-separated.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">format</td>
              <td className="p-3 border-r border-gray-200">string</td>
              <td className="p-3 border-r border-gray-200">png</td>
              <td className="p-3"><span className="font-mono">png / jpeg / webp / pdf</span></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">width</td>
              <td className="p-3 border-r border-gray-200">int</td>
              <td className="p-3 border-r border-gray-200">1920</td>
              <td className="p-3">Viewport width. 320–7680.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">height</td>
              <td className="p-3 border-r border-gray-200">int</td>
              <td className="p-3 border-r border-gray-200">1080</td>
              <td className="p-3">Viewport height. 240–4320.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">full_page</td>
              <td className="p-3 border-r border-gray-200">bool</td>
              <td className="p-3 border-r border-gray-200">false</td>
              <td className="p-3">Capture entire scrollable page.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">dark_mode</td>
              <td className="p-3 border-r border-gray-200">bool</td>
              <td className="p-3 border-r border-gray-200">false</td>
              <td className="p-3">Render with dark color scheme.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">delay</td>
              <td className="p-3 border-r border-gray-200">int</td>
              <td className="p-3 border-r border-gray-200">0</td>
              <td className="p-3">Seconds to wait after page load. 0–10. Applied per URL.</td>
            </tr>
            <tr>
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">remove_elements</td>
              <td className="p-3 border-r border-gray-200">array&lt;string&gt;</td>
              <td className="p-3 border-r border-gray-200">[]</td>
              <td className="p-3">CSS selectors. ≤20 selectors, ≤200 chars each. Applied to every URL.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed">
        For deep explanations of each parameter — viewport presets, format tradeoffs, CSS selector
        syntax, delay tuning — see{' '}
        <a href="/help/article/screenshot-parameters-explained" className="text-blue-600 hover:underline">
          Screenshot parameters explained
        </a>.
      </p>

      {/* Recipes */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recipes</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Real scenarios with copy-paste JSON bodies.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1. Competitor landing-page audit</h3>
      <p className="text-gray-700 leading-relaxed">
        Capture 10 competitor home pages at desktop resolution, full-page, with cookie banners
        hidden.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "urls": [
    "https://competitor1.com",
    "https://competitor2.com",
    "https://competitor3.com"
  ],
  "format": "png",
  "width": 1920,
  "height": 1080,
  "full_page": true,
  "delay": 2,
  "remove_elements": [
    "#cookie-banner",
    "#onetrust-consent-sdk",
    ".gdpr-modal"
  ]
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2. Mobile-view content audit</h3>
      <p className="text-gray-700 leading-relaxed">
        Capture 30 article URLs at iPhone viewport to verify mobile layout across your catalog.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "urls": [ "https://blog.example.com/post-1", "... 29 more ..." ],
  "format": "webp",
  "width": 375,
  "height": 667,
  "full_page": true,
  "delay": 3
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">3. Dark-mode documentation archive</h3>
      <p className="text-gray-700 leading-relaxed">
        Capture your entire documentation site in dark mode for a branded PDF archive.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "urls": [ "https://docs.example.com/guide-1", "... more ..." ],
  "format": "pdf",
  "dark_mode": true,
  "remove_elements": [
    ".chat-widget",
    "#feedback-button",
    ".docs-nav-search"
  ]
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4. Bulk social media previews</h3>
      <p className="text-gray-700 leading-relaxed">
        Generate Open Graph-sized preview images for 50 blog posts.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "urls": [ "https://blog.example.com/og-preview/post-1", "... 49 more ..." ],
  "format": "jpeg",
  "width": 1200,
  "height": 630
}`}
        </pre>
      </div>

      {/* Handling errors */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Handling Errors</h2>
      <p className="text-gray-700 leading-relaxed">
        Failures can happen at two levels — the job itself, or individual items within a job.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Job-level errors (HTTP status)</h3>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-mono font-bold">400</span>
            No valid URLs found
          </h4>
          <p className="text-sm text-gray-700">
            Your submission had no parseable URLs. Check that each URL starts with{' '}
            <span className="font-mono">http://</span> or <span className="font-mono">https://</span>.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">403</span>
            Not available on free tier / Batch size exceeds limit
          </h4>
          <p className="text-sm text-gray-700">
            Either you're on the Free plan (upgrade to Pro or higher), or you're exceeding your
            plan's URLs-per-batch limit. Split large batches into smaller chunks or upgrade.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">404</span>
            Job not found
          </h4>
          <p className="text-sm text-gray-700">
            The <span className="font-mono">job_id</span> doesn't exist or belongs to a different
            user. Double-check the ID and that you're using the same API key that submitted the job.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-mono font-bold">422</span>
            Validation error
          </h4>
          <p className="text-sm text-gray-700">
            A field is outside its allowed range. Check that <span className="font-mono">delay</span>{' '}
            is 0–10, viewport dimensions are within limits, and{' '}
            <span className="font-mono">format</span> is one of the valid values.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Item-level errors (inside the job)</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Individual items can fail while others succeed. The job's overall status becomes{' '}
        <span className="font-mono">partial</span>. Each failed item has a{' '}
        <span className="font-mono">message</span> field with a plain-English explanation.
      </p>
      <div className="space-y-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-0">
            <strong className="font-mono text-xs text-red-700">"The website address could not be found..."</strong>
            {' '}→ Typo in URL or domain doesn't resolve. Fix and use{' '}
            <span className="font-mono">retry_failed</span>.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-0">
            <strong className="font-mono text-xs text-red-700">"The website took too long to respond..."</strong>
            {' '}→ Slow or overloaded target. Retry later, or exclude from your batch.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-0">
            <strong className="font-mono text-xs text-red-700">"Lost to server restart — retry to recapture"</strong>
            {' '}→ Server restarted while your job was processing. Completed items are safe;
            unfinished ones need a retry.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-0">
            <strong className="font-mono text-xs text-red-700">"The website refused the connection..."</strong>
            {' '}→ Target site blocks automated requests or is offline. No retry will fix it; the
            site has to allow access.
          </p>
        </div>
      </div>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My job has been stuck in queued for a long time"</h4>
          <p className="text-sm text-gray-700">
            Normal queue time is under a second. If it sticks longer than 30 seconds, the service
            may be briefly unavailable. Check{' '}
            <a href="/status" className="text-blue-600 hover:underline">the status page</a>. If
            status is green, cancel the job and resubmit.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Some items say 'Lost to server restart'"</h4>
          <p className="text-sm text-gray-700">
            If the server restarts while your job is processing, completed screenshots persist
            (they're safely in storage) but in-flight captures are lost. Use{' '}
            <span className="font-mono">POST /jobs/&#123;id&#125;/retry_failed</span> to re-queue
            only the lost items — already-completed ones stay completed.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I submitted 60 URLs on Pro and got HTTP 403"</h4>
          <p className="text-sm text-gray-700">
            Pro is capped at 50 URLs per batch. Split your list into two batches (50 + 10), or
            upgrade to Business for 200 per batch. The hard limit prevents one user from monopolizing
            resources.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My file upload returns 'Invalid file format'"</h4>
          <p className="text-sm text-gray-700 mb-2">
            Only <span className="font-mono">.csv</span>, <span className="font-mono">.txt</span>,
            and <span className="font-mono">.tsv</span> extensions are accepted. Max file size{' '}
            <strong>2 MB</strong>. If your file is an Excel{' '}
            <span className="font-mono">.xlsx</span>, export it to CSV first.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Duplicate URLs in my input — does each get captured?"</h4>
          <p className="text-sm text-gray-700">
            No. Duplicates are automatically deduplicated before the job is created. Submitting
            the same URL three times captures it once. This prevents accidentally burning quota.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My poll loop hits rate limits"</h4>
          <p className="text-sm text-gray-700">
            Poll every 2 seconds, not faster. Screenshots take several seconds each, so faster
            polling just wastes API calls without getting you fresher data. For large jobs
            (500+ URLs), consider polling every 5 seconds.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/rate-limits-and-quotas"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Rate limits and quotas</h4>
            <p className="text-sm text-blue-700 mb-0">Understand plan limits and how to optimize heavy workloads</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/screenshot-parameters-explained"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Screenshot parameters explained</h4>
            <p className="text-sm text-green-700 mb-0">Full reference for all capture options used by batch</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/website-monitoring-guide"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Website Monitoring Guide</h4>
            <p className="text-sm text-purple-700 mb-0">Combine batch with scheduling for automated captures</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Batch processing, mastered 📦</h4>
            <p className="text-green-800 text-sm mb-0">
              You know how to submit jobs three ways, poll for results, handle partial failures,
              retry what broke, and combine all the capture options. Scale-up time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessingGuide;

// ===== END OF BatchProcessingGuide.jsx ===== 

// ===========================================================================================
// // ========================================
// // BATCH PROCESSING GUIDE - PIXELPERFECT
// // ========================================
// // File: frontend/src/guides/BatchProcessingGuide.jsx
// // Author: OneTechly
// // Update: April 2026
// //
// // Article #3 in "API Usage" category
// // Verified against:
// //   - backend/batch.py (real endpoints, Pydantic model, job lifecycle)
// //   - frontend/src/pages/BatchJobs.js (polling interval, UI workflow)
// //   - backend/main.py (router prefix → /api/v1/batch)
// // ========================================

// import React from 'react';

// const BatchProcessingGuide = () => {
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
//               Capture screenshots of many websites at once using the Batch API. This guide covers
//               the three ways to submit a job (JSON, file upload, dashboard), how the async job
//               lifecycle works, how to poll for results, how to retry and cancel, and four
//               ready-to-use recipes.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* When to use batch */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Use Batch</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
//         <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
//           <div className="flex items-center gap-2 mb-3">
//             <span className="text-2xl">📸</span>
//             <h4 className="font-semibold text-gray-900 mb-0">One URL? Use the single endpoint.</h4>
//           </div>
//           <p className="text-sm text-gray-700 mb-2">
//             If you have one website to capture, use{' '}
//             <span className="font-mono">POST /api/v1/screenshot</span>. It's synchronous —
//             request goes in, PNG comes back. See{' '}
//             <a href="/help/article/making-first-api-request" className="text-blue-600 hover:underline">
//               Making your first API request
//             </a>.
//           </p>
//         </div>

//         <div className="bg-white border-2 border-purple-200 rounded-lg p-5">
//           <div className="flex items-center gap-2 mb-3">
//             <span className="text-2xl">📦</span>
//             <h4 className="font-semibold text-gray-900 mb-0">Many URLs? Use batch.</h4>
//           </div>
//           <p className="text-sm text-gray-700 mb-2">
//             For 2 to 1,000 URLs captured with the same settings, batch is the right tool. Submit
//             once, check back later for results.
//           </p>
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
//             A <strong>Pro plan or higher</strong> — batch is not available on the Free tier
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span className="leading-relaxed">
//             Your API key (see{' '}
//             <a href="/help/article/getting-your-api-key" className="text-blue-600 hover:underline">
//               Getting your API key
//             </a>)
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span className="leading-relaxed">
//             Understanding of{' '}
//             <a href="/help/article/screenshot-parameters-explained" className="text-blue-600 hover:underline">
//               screenshot parameters
//             </a>{' '}— batch reuses the same ones
//           </span>
//         </li>
//       </ul>

//       {/* How batch works — async model */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Batch Works — The Async Model</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Unlike the single-screenshot endpoint (which captures synchronously and returns the result
//         in one call), batch is asynchronous. Three steps:
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">1</span>
//             Submit
//           </h4>
//           <p className="text-sm text-gray-700 mb-0">
//             POST your list of URLs. The API returns immediately with a{' '}
//             <span className="font-mono">job_id</span> and the job status (<span className="font-mono">queued</span>).
//           </p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">2</span>
//             Poll
//           </h4>
//           <p className="text-sm text-gray-700 mb-0">
//             Check <span className="font-mono">GET /jobs/&#123;job_id&#125;</span> every 2 seconds
//             to see progress. Each item transitions{' '}
//             <span className="font-mono">queued → processing → completed/failed</span>.
//           </p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">3</span>
//             Retrieve
//           </h4>
//           <p className="text-sm text-gray-700 mb-0">
//             When the job finishes (<span className="font-mono">completed</span>,{' '}
//             <span className="font-mono">partial</span>, or <span className="font-mono">failed</span>),
//             every item has a <span className="font-mono">screenshot_url</span> you can download.
//           </p>
//         </div>
//       </div>

//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Why async?</h4>
//             <p className="text-blue-800 text-sm mb-0">
//               Capturing 50 URLs sequentially takes time — typically 3–10 seconds per URL depending
//               on site complexity. A single synchronous HTTP request would hang for minutes and
//               time out in most network environments. The async model returns the job handle
//               immediately and captures run in the background.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Tier limits */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Batch Limits by Plan</h2>

//       <div className="overflow-x-auto my-6">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Plan</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">URLs per batch</th>
//               <th className="text-left p-3 font-semibold text-gray-900">Typical use case</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Free</strong></td>
//               <td className="p-3 border-r border-gray-200 text-gray-500">Not available</td>
//               <td className="p-3 text-gray-500">Use the single-screenshot endpoint instead</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Pro</strong></td>
//               <td className="p-3 border-r border-gray-200">Up to <strong>50</strong> URLs</td>
//               <td className="p-3">Small sites, daily reports, competitor tracking</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Business</strong></td>
//               <td className="p-3 border-r border-gray-200">Up to <strong>200</strong> URLs</td>
//               <td className="p-3">Medium catalogs, regional monitoring, content audits</td>
//             </tr>
//             <tr>
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Premium</strong></td>
//               <td className="p-3 border-r border-gray-200">Up to <strong>1,000</strong> URLs</td>
//               <td className="p-3">Large catalogs, SEO scraping, enterprise workflows</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Every URL counts toward your monthly screenshot quota</h4>
//             <p className="text-yellow-800 text-sm mb-0">
//               A batch of 50 URLs consumes <strong>50 screenshots</strong> from your monthly
//               allowance — plus <strong>1 batch request</strong> from the separate batch-requests
//               counter. Plan accordingly, especially on Pro.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Feature parity callout */}
//       <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-5 my-6">
//         <div className="flex items-start gap-3">
//           <span className="text-2xl flex-shrink-0">✨</span>
//           <div>
//             <h4 className="text-base font-semibold text-purple-900 mt-0 mb-2">
//               Now at full parity with the single endpoint
//             </h4>
//             <p className="text-purple-800 text-sm mb-0 leading-relaxed">
//               Batch now supports everything the single-screenshot endpoint supports —{' '}
//               <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-purple-300">dark_mode</span>,{' '}
//               <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-purple-300">delay</span>, and{' '}
//               <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-purple-300">remove_elements</span>{' '}
//               are applied to every URL in your batch. Hide cookie banners across 200 sites with
//               one request. Capture 1,000 pages in dark mode. Add a 3-second delay for lazy-loaded
//               images — batch-wide.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Method 1: JSON */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 1: Submit via JSON</h2>
//       <p className="text-gray-700 leading-relaxed">
//         The standard way. Send a JSON body with a <span className="font-mono">urls</span> array
//         and your capture options. The example below shows a realistic submission that combines
//         several options together.
//       </p>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">cURL (Linux / macOS / WSL)</h4>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`curl -X POST https://api.pixelperfectapi.net/api/v1/batch/submit \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "urls": [
//       "https://example.com",
//       "https://github.com",
//       "https://wikipedia.org"
//     ],
//     "format": "png",
//     "width": 1920,
//     "height": 1080,
//     "full_page": true,
//     "dark_mode": false,
//     "delay": 2,
//     "remove_elements": [
//       "#cookie-banner",
//       ".gdpr-modal"
//     ]
//   }'`}
//         </pre>
//       </div>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">PowerShell (Windows)</h4>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`$body = @{
//   urls            = @(
//     "https://example.com",
//     "https://github.com",
//     "https://wikipedia.org"
//   )
//   format          = "png"
//   width           = 1920
//   height          = 1080
//   full_page       = $true
//   dark_mode       = $false
//   delay           = 2
//   remove_elements = @("#cookie-banner", ".gdpr-modal")
// } | ConvertTo-Json

// Invoke-RestMethod -Method POST \`
//   -Uri "https://api.pixelperfectapi.net/api/v1/batch/submit" \`
//   -Headers @{
//     "Authorization" = "Bearer YOUR_API_KEY"
//     "Content-Type"  = "application/json"
//   } \`
//   -Body $body`}
//         </pre>
//       </div>

//       <p className="text-gray-700 leading-relaxed mt-4">
//         The response comes back immediately with the initial job state:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "id": "a3f2c1b9d4e5f6a8",
//   "created_at": "2026-04-23T14:22:01.334521",
//   "status": "queued",
//   "format": "png",
//   "total": 3,
//   "completed": 0,
//   "failed": 0,
//   "queued": 3,
//   "processing": 0,
//   "items": [
//     { "idx": 0, "url": "https://example.com",   "status": "queued", "message": "Waiting to process..." },
//     { "idx": 1, "url": "https://github.com",    "status": "queued", "message": "Waiting to process..." },
//     { "idx": 2, "url": "https://wikipedia.org", "status": "queued", "message": "Waiting to process..." }
//   ]
// }`}
//         </pre>
//       </div>

//       <p className="text-gray-700 leading-relaxed">
//         Save the <span className="font-mono">id</span> — that's your job handle for polling.
//       </p>

//       {/* Method 2: File upload */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 2: Submit via File Upload</h2>
//       <p className="text-gray-700 leading-relaxed">
//         For workflows where URLs live in a file you already manage (exports from a CMS, SEO tools,
//         or spreadsheets), upload it directly. Supports <strong>.csv</strong>, <strong>.txt</strong>,
//         and <strong>.tsv</strong> formats — max file size <strong>2 MB</strong>.
//       </p>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Accepted file formats</h4>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 text-sm">
//         <div className="bg-gray-50 p-3 rounded border border-gray-200">
//           <h5 className="font-semibold text-gray-900 mb-1">.txt (one per line)</h5>
//           <div className="bg-gray-900 rounded p-2 mt-2">
//             <code className="text-green-400 text-xs font-mono block whitespace-pre">
// {`https://example.com
// https://github.com
// https://wikipedia.org`}
//             </code>
//           </div>
//         </div>
//         <div className="bg-gray-50 p-3 rounded border border-gray-200">
//           <h5 className="font-semibold text-gray-900 mb-1">.csv (comma-separated)</h5>
//           <div className="bg-gray-900 rounded p-2 mt-2">
//             <code className="text-green-400 text-xs font-mono block whitespace-pre">
// {`https://example.com,
// https://github.com,
// https://wikipedia.org`}
//             </code>
//           </div>
//         </div>
//         <div className="bg-gray-50 p-3 rounded border border-gray-200">
//           <h5 className="font-semibold text-gray-900 mb-1">.tsv (tab-separated)</h5>
//           <p className="text-xs text-gray-600 mt-2">
//             Same as CSV but uses tab characters as the separator. Useful for exports from
//             spreadsheet apps that save with tabs.
//           </p>
//         </div>
//       </div>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Uploading via cURL</h4>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`curl -X POST https://api.pixelperfectapi.net/api/v1/batch/submit_file \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -F "file=@urls.txt" \\
//   -F "format=png" \\
//   -F "width=1920" \\
//   -F "height=1080" \\
//   -F "full_page=true" \\
//   -F "dark_mode=false" \\
//   -F "delay=2" \\
//   -F "remove_elements=#cookie-banner, .gdpr-modal"`}
//         </pre>
//       </div>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Uploading via PowerShell</h4>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`$form = @{
//   file            = Get-Item "urls.txt"
//   format          = "png"
//   width           = "1920"
//   height          = "1080"
//   full_page       = "true"
//   dark_mode       = "false"
//   delay           = "2"
//   remove_elements = "#cookie-banner, .gdpr-modal"
// }

// Invoke-RestMethod -Method POST \`
//   -Uri "https://api.pixelperfectapi.net/api/v1/batch/submit_file" \`
//   -Headers @{ "Authorization" = "Bearer YOUR_API_KEY" } \`
//   -Form $form`}
//         </pre>
//       </div>

//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
//         <h4 className="text-sm font-semibold text-gray-900 mt-0 mb-2">
//           File upload note: <span className="font-mono">remove_elements</span> format
//         </h4>
//         <p className="text-sm text-gray-700 mb-0">
//           When submitting via <span className="font-mono">/submit_file</span> (multipart upload),
//           pass <span className="font-mono">remove_elements</span> as a comma-separated string:{' '}
//           <span className="font-mono">".cookie-banner, #popup, .ads"</span>. Multipart forms
//           don't natively support arrays, so comma-separated mirrors the dashboard text input.
//         </p>
//       </div>

//       {/* Method 3: Dashboard */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 3: Submit from the Dashboard</h2>
//       <p className="text-gray-700 leading-relaxed">
//         If you just want to run a batch without writing code, use the dashboard playground:
//       </p>
//       <ol className="space-y-2 mt-4 list-decimal list-inside text-gray-700">
//         <li>Sign in to{' '}
//           <a href="https://pixelperfectapi.net/dashboard" className="text-blue-600 hover:underline">
//             pixelperfectapi.net/dashboard
//           </a>
//         </li>
//         <li>Navigate to <strong>📦 Batch Jobs</strong> in the navigation</li>
//         <li>Either paste URLs into the textarea (one per line) <em>or</em> drag-and-drop a CSV/TXT/TSV file</li>
//         <li>Pick your viewport preset (Desktop, Laptop, Tablet, Mobile) and format</li>
//         <li>Click <strong>🚀 Submit Batch Job</strong></li>
//       </ol>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         The dashboard polls the job automatically and shows a live progress bar with per-item status.
//         Great for ad-hoc runs where the API isn't needed.
//       </p>

//       {/* The Job object */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Anatomy of a Job Response</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Every batch endpoint returns the same <span className="font-mono">Job</span> object. Here's
//         what each field means:
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">id</h4>
//           <p className="text-sm text-gray-700 mb-0">
//             16-character hex string. Your handle for polling, retrying, cancelling, or deleting.
//           </p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">created_at</h4>
//           <p className="text-sm text-gray-700 mb-0">
//             ISO 8601 timestamp (UTC). When the job was submitted.
//           </p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">status</h4>
//           <p className="text-sm text-gray-700 mb-0">
//             One of: <span className="font-mono">queued</span>, <span className="font-mono">processing</span>,{' '}
//             <span className="font-mono">completed</span>, <span className="font-mono">partial</span>,{' '}
//             <span className="font-mono">failed</span>, <span className="font-mono">cancelled</span>.
//           </p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">total, completed, failed, queued, processing</h4>
//           <p className="text-sm text-gray-700 mb-0">
//             Running counters. <span className="font-mono">completed + failed + queued + processing = total</span>.
//           </p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
//           <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">items[]</h4>
//           <p className="text-sm text-gray-700 mb-0">
//             One entry per URL, in the order you submitted them. Each item has its own{' '}
//             <span className="font-mono">idx</span>, <span className="font-mono">url</span>,{' '}
//             <span className="font-mono">status</span>, <span className="font-mono">message</span>,{' '}
//             <span className="font-mono">screenshot_url</span> (once captured),{' '}
//             <span className="font-mono">file_size</span>, and{' '}
//             <span className="font-mono">processing_time</span> in seconds.
//           </p>
//         </div>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Job-level status values</h3>
//       <div className="space-y-3 my-4">
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <h4 className="font-mono text-sm font-semibold text-blue-700 mb-1">queued</h4>
//           <p className="text-sm text-gray-700 mb-0">The job hasn't started yet. Usually transitions to <span className="font-mono">processing</span> within a second.</p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <h4 className="font-mono text-sm font-semibold text-blue-700 mb-1">processing</h4>
//           <p className="text-sm text-gray-700 mb-0">Items are being captured. Check item-level status for per-URL progress.</p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <h4 className="font-mono text-sm font-semibold text-green-700 mb-1">completed</h4>
//           <p className="text-sm text-gray-700 mb-0">Every item succeeded. No failures.</p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <h4 className="font-mono text-sm font-semibold text-yellow-700 mb-1">partial</h4>
//           <p className="text-sm text-gray-700 mb-0">Some items succeeded and some failed. Inspect item-level status to see which.</p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <h4 className="font-mono text-sm font-semibold text-red-700 mb-1">failed</h4>
//           <p className="text-sm text-gray-700 mb-0">Every item failed. Usually indicates a systemic problem (expired API key, service outage).</p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <h4 className="font-mono text-sm font-semibold text-gray-700 mb-1">cancelled</h4>
//           <p className="text-sm text-gray-700 mb-0">You cancelled the job via <span className="font-mono">POST /jobs/&#123;id&#125;/cancel</span>. Items already captured are preserved.</p>
//         </div>
//       </div>

//       {/* Polling */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Polling for Results</h2>
//       <p className="text-gray-700 leading-relaxed">
//         After submission, poll the job endpoint until its <span className="font-mono">status</span> is
//         one of the terminal values (<span className="font-mono">completed</span>,{' '}
//         <span className="font-mono">partial</span>, <span className="font-mono">failed</span>,{' '}
//         <span className="font-mono">cancelled</span>).
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         The dashboard polls every <strong>2 seconds</strong> — a good default for most clients.
//         Anything faster risks hitting rate limits without adding value (screenshots take several
//         seconds each, so sub-second polling just burns API calls).
//       </p>

//       <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Python polling loop</h4>
//       <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`import os, time, requests

// API_KEY = os.environ["PIXELPERFECT_API_KEY"]
// BASE    = "https://api.pixelperfectapi.net/api/v1/batch"
// HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

// # 1. Submit
// submit = requests.post(f"{BASE}/submit", headers=HEADERS, json={
//     "urls":   ["https://example.com", "https://github.com"],
//     "format": "png",
// }).json()

// job_id = submit["id"]
// print(f"Submitted job {job_id}")

// # 2. Poll until terminal status
// TERMINAL = {"completed", "partial", "failed", "cancelled"}
// while True:
//     job = requests.get(f"{BASE}/jobs/{job_id}", headers=HEADERS).json()
//     print(f"  {job['completed']}/{job['total']} done, status={job['status']}")
//     if job["status"] in TERMINAL:
//         break
//     time.sleep(2)

// # 3. Retrieve URLs
// for item in job["items"]:
//     if item["status"] == "completed":
//         print(item["screenshot_url"])
//     else:
//         print(f"FAILED: {item['url']} — {item['message']}")`}
//         </pre>
//       </div>

//       {/* Job management */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Jobs</h2>

//       <div className="overflow-x-auto my-6">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Action</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Endpoint</th>
//               <th className="text-left p-3 font-semibold text-gray-900">What it does</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>List jobs</strong></td>
//               <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">GET /api/v1/batch/jobs</span></td>
//               <td className="p-3">Returns every batch job you've created, newest first.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Get one job</strong></td>
//               <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">GET /api/v1/batch/jobs/&#123;id&#125;</span></td>
//               <td className="p-3">Fetches the latest state of a single job (use for polling).</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Retry failed</strong></td>
//               <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">POST /api/v1/batch/jobs/&#123;id&#125;/retry_failed</span></td>
//               <td className="p-3">Re-queues only the items that failed. Completed items stay completed.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Cancel</strong></td>
//               <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">POST /api/v1/batch/jobs/&#123;id&#125;/cancel</span></td>
//               <td className="p-3">Stops a queued or processing job. Already-captured items are preserved.</td>
//             </tr>
//             <tr>
//               <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Delete</strong></td>
//               <td className="p-3 border-r border-gray-200"><span className="font-mono text-xs">DELETE /api/v1/batch/jobs/&#123;id&#125;</span></td>
//               <td className="p-3">Removes the job record. Captured screenshots remain in your history.</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Retry reuses your original settings</h4>
//             <p className="text-blue-800 text-sm mb-0">
//               When you retry failed items, the same viewport, format, dark mode, delay, and
//               remove-elements settings from the original submission are applied. No need to
//               re-specify them.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Parameters */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Batch Parameters</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Batch accepts the same capture options as the single-screenshot endpoint. Every URL in the
//         batch uses the same settings.
//       </p>

//       <div className="overflow-x-auto my-6">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Parameter</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Type</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Default</th>
//               <th className="text-left p-3 font-semibold text-gray-900">Notes</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">urls</td>
//               <td className="p-3 border-r border-gray-200">array&lt;string&gt;</td>
//               <td className="p-3 border-r border-gray-200 text-gray-500">required*</td>
//               <td className="p-3">Either this or <span className="font-mono">csv_text</span> must be present.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">csv_text</td>
//               <td className="p-3 border-r border-gray-200">string</td>
//               <td className="p-3 border-r border-gray-200 text-gray-500">required*</td>
//               <td className="p-3">Alternative to <span className="font-mono">urls</span> — comma / tab / newline-separated.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">format</td>
//               <td className="p-3 border-r border-gray-200">string</td>
//               <td className="p-3 border-r border-gray-200">png</td>
//               <td className="p-3"><span className="font-mono">png / jpeg / webp / pdf</span></td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">width</td>
//               <td className="p-3 border-r border-gray-200">int</td>
//               <td className="p-3 border-r border-gray-200">1920</td>
//               <td className="p-3">Viewport width. 320–7680.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">height</td>
//               <td className="p-3 border-r border-gray-200">int</td>
//               <td className="p-3 border-r border-gray-200">1080</td>
//               <td className="p-3">Viewport height. 240–4320.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">full_page</td>
//               <td className="p-3 border-r border-gray-200">bool</td>
//               <td className="p-3 border-r border-gray-200">false</td>
//               <td className="p-3">Capture entire scrollable page.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">dark_mode</td>
//               <td className="p-3 border-r border-gray-200">bool</td>
//               <td className="p-3 border-r border-gray-200">false</td>
//               <td className="p-3">Render with dark color scheme.</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">delay</td>
//               <td className="p-3 border-r border-gray-200">int</td>
//               <td className="p-3 border-r border-gray-200">0</td>
//               <td className="p-3">Seconds to wait after page load. 0–10. Applied per URL.</td>
//             </tr>
//             <tr>
//               <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">remove_elements</td>
//               <td className="p-3 border-r border-gray-200">array&lt;string&gt;</td>
//               <td className="p-3 border-r border-gray-200">[]</td>
//               <td className="p-3">CSS selectors. ≤20 selectors, ≤200 chars each. Applied to every URL.</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <p className="text-gray-700 leading-relaxed">
//         For deep explanations of each parameter — viewport presets, format tradeoffs, CSS selector
//         syntax, delay tuning — see{' '}
//         <a href="/help/article/screenshot-parameters-explained" className="text-blue-600 hover:underline">
//           Screenshot parameters explained
//         </a>.
//       </p>

//       {/* Recipes */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recipes</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Real scenarios with copy-paste JSON bodies.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1. Competitor landing-page audit</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Capture 10 competitor home pages at desktop resolution, full-page, with cookie banners
//         hidden.
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "urls": [
//     "https://competitor1.com",
//     "https://competitor2.com",
//     "https://competitor3.com"
//   ],
//   "format": "png",
//   "width": 1920,
//   "height": 1080,
//   "full_page": true,
//   "delay": 2,
//   "remove_elements": [
//     "#cookie-banner",
//     "#onetrust-consent-sdk",
//     ".gdpr-modal"
//   ]
// }`}
//         </pre>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2. Mobile-view content audit</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Capture 30 article URLs at iPhone viewport to verify mobile layout across your catalog.
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "urls": [ "https://blog.example.com/post-1", "... 29 more ..." ],
//   "format": "webp",
//   "width": 375,
//   "height": 667,
//   "full_page": true,
//   "delay": 3
// }`}
//         </pre>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">3. Dark-mode documentation archive</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Capture your entire documentation site in dark mode for a branded PDF archive.
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "urls": [ "https://docs.example.com/guide-1", "... more ..." ],
//   "format": "pdf",
//   "dark_mode": true,
//   "remove_elements": [
//     ".chat-widget",
//     "#feedback-button",
//     ".docs-nav-search"
//   ]
// }`}
//         </pre>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4. Bulk social media previews</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Generate Open Graph-sized preview images for 50 blog posts.
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "urls": [ "https://blog.example.com/og-preview/post-1", "... 49 more ..." ],
//   "format": "jpeg",
//   "width": 1200,
//   "height": 630
// }`}
//         </pre>
//       </div>

//       {/* Handling errors */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Handling Errors</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Failures can happen at two levels — the job itself, or individual items within a job.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Job-level errors (HTTP status)</h3>
//       <div className="space-y-4">
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <span className="inline-flex items-center justify-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-mono font-bold">400</span>
//             No valid URLs found
//           </h4>
//           <p className="text-sm text-gray-700">
//             Your submission had no parseable URLs. Check that each URL starts with{' '}
//             <span className="font-mono">http://</span> or <span className="font-mono">https://</span>.
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">403</span>
//             Not available on free tier / Batch size exceeds limit
//           </h4>
//           <p className="text-sm text-gray-700">
//             Either you're on the Free plan (upgrade to Pro or higher), or you're exceeding your
//             plan's URLs-per-batch limit. Split large batches into smaller chunks or upgrade.
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">404</span>
//             Job not found
//           </h4>
//           <p className="text-sm text-gray-700">
//             The <span className="font-mono">job_id</span> doesn't exist or belongs to a different
//             user. Double-check the ID and that you're using the same API key that submitted the job.
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//             <span className="inline-flex items-center justify-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-mono font-bold">422</span>
//             Validation error
//           </h4>
//           <p className="text-sm text-gray-700">
//             A field is outside its allowed range. Check that <span className="font-mono">delay</span>{' '}
//             is 0–10, viewport dimensions are within limits, and{' '}
//             <span className="font-mono">format</span> is one of the valid values.
//           </p>
//         </div>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Item-level errors (inside the job)</h3>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Individual items can fail while others succeed. The job's overall status becomes{' '}
//         <span className="font-mono">partial</span>. Each failed item has a{' '}
//         <span className="font-mono">message</span> field with a plain-English explanation.
//       </p>
//       <div className="space-y-3">
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-sm text-gray-700 mb-0">
//             <strong className="font-mono text-xs text-red-700">"The website address could not be found..."</strong>
//             {' '}→ Typo in URL or domain doesn't resolve. Fix and use{' '}
//             <span className="font-mono">retry_failed</span>.
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-sm text-gray-700 mb-0">
//             <strong className="font-mono text-xs text-red-700">"The website took too long to respond..."</strong>
//             {' '}→ Slow or overloaded target. Retry later, or exclude from your batch.
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-sm text-gray-700 mb-0">
//             <strong className="font-mono text-xs text-red-700">"Lost to server restart — retry to recapture"</strong>
//             {' '}→ Server restarted while your job was processing. Completed items are safe;
//             unfinished ones need a retry.
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-sm text-gray-700 mb-0">
//             <strong className="font-mono text-xs text-red-700">"The website refused the connection..."</strong>
//             {' '}→ Target site blocks automated requests or is offline. No retry will fix it; the
//             site has to allow access.
//           </p>
//         </div>
//       </div>

//       {/* Troubleshooting */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

//       <div className="space-y-4">
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"My job has been stuck in queued for a long time"</h4>
//           <p className="text-sm text-gray-700">
//             Normal queue time is under a second. If it sticks longer than 30 seconds, the service
//             may be briefly unavailable. Check{' '}
//             <a href="/status" className="text-blue-600 hover:underline">the status page</a>. If
//             status is green, cancel the job and resubmit.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"Some items say 'Lost to server restart'"</h4>
//           <p className="text-sm text-gray-700">
//             If the server restarts while your job is processing, completed screenshots persist
//             (they're safely in storage) but in-flight captures are lost. Use{' '}
//             <span className="font-mono">POST /jobs/&#123;id&#125;/retry_failed</span> to re-queue
//             only the lost items — already-completed ones stay completed.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"I submitted 60 URLs on Pro and got HTTP 403"</h4>
//           <p className="text-sm text-gray-700">
//             Pro is capped at 50 URLs per batch. Split your list into two batches (50 + 10), or
//             upgrade to Business for 200 per batch. The hard limit prevents one user from monopolizing
//             resources.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"My file upload returns 'Invalid file format'"</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             Only <span className="font-mono">.csv</span>, <span className="font-mono">.txt</span>,
//             and <span className="font-mono">.tsv</span> extensions are accepted. Max file size{' '}
//             <strong>2 MB</strong>. If your file is an Excel{' '}
//             <span className="font-mono">.xlsx</span>, export it to CSV first.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"Duplicate URLs in my input — does each get captured?"</h4>
//           <p className="text-sm text-gray-700">
//             No. Duplicates are automatically deduplicated before the job is created. Submitting
//             the same URL three times captures it once. This prevents accidentally burning quota.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"My poll loop hits rate limits"</h4>
//           <p className="text-sm text-gray-700">
//             Poll every 2 seconds, not faster. Screenshots take several seconds each, so faster
//             polling just wastes API calls without getting you fresher data. For large jobs
//             (500+ URLs), consider polling every 5 seconds.
//           </p>
//         </div>
//       </div>

//       {/* Next Steps */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

//       <div className="grid grid-cols-1 gap-4">
//         <a
//           href="/help/article/rate-limits-and-quotas"
//           className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-blue-900 mb-1">Rate limits and quotas</h4>
//             <p className="text-sm text-blue-700 mb-0">Understand plan limits and how to optimize heavy workloads</p>
//           </div>
//           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/screenshot-parameters-explained"
//           className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-green-900 mb-1">Screenshot parameters explained</h4>
//             <p className="text-sm text-green-700 mb-0">Full reference for all capture options used by batch</p>
//           </div>
//           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/website-monitoring-guide"
//           className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-purple-900 mb-1">Website Monitoring Guide</h4>
//             <p className="text-sm text-purple-700 mb-0">Combine batch with scheduling for automated captures</p>
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
//             <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Batch processing, mastered 📦</h4>
//             <p className="text-green-800 text-sm mb-0">
//               You know how to submit jobs three ways, poll for results, handle partial failures,
//               retry what broke, and combine all the capture options. Scale-up time.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BatchProcessingGuide;