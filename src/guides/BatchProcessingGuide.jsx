// ========================================
// BATCH PROCESSING GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/BatchProcessingGuide.jsx
// Author: OneTechly
// Update: April 29, 2026
//
// ✅ FIX (Apr 29, 2026): The .tsv card in the "Accepted file formats" section
//    was missing its dark code block. The .txt and .csv cards each had a
//    bg-gray-900 code block with green monospace text; the .tsv card had only
//    a plain text description. Fixed: added an identical dark code block to the
//    .tsv card showing a real tab-separated URL example.
//
// Verified against:
//   - backend/batch.py (real endpoints, Pydantic model, job lifecycle)
//   - frontend/src/pages/BatchJobs.js (polling interval, UI workflow)
//   - backend/main.py (router prefix → /api/v1/batch)
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
            <code className="font-mono">POST /api/v1/screenshot</code>. Synchronous, returns
            the screenshot URL directly. Zero waiting.
          </p>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📦</span>
            <h4 className="font-semibold text-gray-900 mb-0">Many URLs? Use the batch endpoint.</h4>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Submit up to 50 (Pro), 200 (Business), or 1,000 (Premium) URLs in one job.
            Processed asynchronously in parallel. Poll for results.
          </p>
        </div>
      </div>

      {/* Tier requirements */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Requires Pro or higher</h4>
            <p className="text-yellow-800 text-sm mb-0">
              Batch processing is not available on the Free tier. Attempting to submit a batch
              job on a Free account returns a <code className="font-mono">403 Forbidden</code>. Upgrade
              to Pro, Business, or Premium to unlock batch endpoints.
            </p>
          </div>
        </div>
      </div>

      {/* Method 1: JSON */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 1: Submit a URL List (JSON)</h2>
      <p className="text-gray-700 leading-relaxed">
        The most common method. Pass an array of URLs in the request body. All screenshot
        parameters available on the single endpoint are also supported here &mdash; <code className="font-mono">width</code>,{' '}
        <code className="font-mono">height</code>, <code className="font-mono">format</code>, <code className="font-mono">full_page</code>,{' '}
        <code className="font-mono">dark_mode</code>, <code className="font-mono">delay</code>, and <code className="font-mono">remove_elements</code>{' '}
        all apply to every URL in the job.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/batch/submit \\
  -H "X-API-Key: YOUR_API_KEY" \\
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
    "full_page": false,
    "dark_mode": false,
    "delay": 0
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">The response is a job object:</p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
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
    { "idx": 0, "url": "https://example.com",   "status": "queued", "message": "Waiting..." },
    { "idx": 1, "url": "https://github.com",    "status": "queued", "message": "Waiting..." },
    { "idx": 2, "url": "https://wikipedia.org", "status": "queued", "message": "Waiting..." }
  ]
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Save the <code className="font-mono">id</code> &mdash; that's your job handle for polling.
      </p>

      {/* Method 2: File upload */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 2: Submit via File Upload</h2>
      <p className="text-gray-700 leading-relaxed">
        For workflows where URLs live in a file you already manage (exports from a CMS, SEO tools,
        or spreadsheets), upload it directly. Supports <strong>.csv</strong>, <strong>.txt</strong>,
        and <strong>.tsv</strong> formats &mdash; max file size <strong>2 MB</strong>.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Accepted file formats</h4>

      {/* ✅ FIXED: all three cards now have identical structure with dark code block */}
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

        {/* ✅ FIXED: .tsv card now has the same dark code block as .txt and .csv */}
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-1">.tsv (tab-separated)</h5>
          <div className="bg-gray-900 rounded p-2 mt-2">
            <code className="text-green-400 text-xs font-mono block whitespace-pre">
{`https://example.com\t
https://github.com\t
https://wikipedia.org`}
            </code>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Same as CSV but uses tab characters. Useful for spreadsheet exports.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mt-2">
        The parser auto-detects comma, tab, or newline-separated values. Duplicate URLs
        are deduplicated automatically before the job is created.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Uploading via cURL</h4>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/batch/submit_file \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "file=@urls.csv" \\
  -F "format=png" \\
  -F "width=1920" \\
  -F "height=1080"`}
        </pre>
      </div>

      {/* Method 3: Dashboard */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 3: Submit from the Dashboard</h2>
      <p className="text-gray-700 leading-relaxed">
        No code required. Log in, navigate to <strong>Batch Jobs</strong> in the sidebar, paste URLs
        directly into the text area or upload a file, configure the screenshot parameters, and
        submit. The dashboard polls the job automatically and shows a live progress bar.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        This method is useful for ad-hoc captures, testing a URL list before automating it,
        or sharing results with non-technical teammates.
      </p>

      {/* Job lifecycle */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Job Lifecycle</h2>

      <div className="flex flex-col gap-2 my-4">
        {[
          { status: 'queued', color: 'gray', desc: 'Job received, URLs validated and deduplicated, waiting for a worker slot.' },
          { status: 'processing', color: 'blue', desc: 'Workers are actively capturing screenshots in parallel.' },
          { status: 'completed', color: 'green', desc: 'All URLs have been attempted. Check individual item statuses — some may have failed.' },
          { status: 'cancelled', color: 'yellow', desc: 'You cancelled the job before all items completed.' },
          { status: 'failed', color: 'red', desc: 'The job itself failed (rare — usually a server error). Individual item failures do not trigger this.' },
        ].map(({ status, color, desc }) => (
          <div key={status} className={`flex items-start gap-3 p-3 rounded-lg border border-${color}-200 bg-${color}-50`}>
            <code className={`font-mono text-sm font-bold text-${color}-700 flex-shrink-0 mt-0.5`}>{status}</code>
            <p className="text-sm text-gray-700 mb-0">{desc}</p>
          </div>
        ))}
      </div>

      {/* Polling */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Polling for Results</h2>
      <p className="text-gray-700 leading-relaxed">
        Hit the status endpoint with your job ID. Poll every 2&ndash;5 seconds until{' '}
        <code className="font-mono">status</code> is <code className="font-mono">completed</code> or{' '}
        <code className="font-mono">cancelled</code>:
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl https://api.pixelperfectapi.net/api/v1/batch/status/a3f2c1b9d4e5f6a8 \\
  -H "X-API-Key: YOUR_API_KEY"`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">Completed response example:</p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "id": "a3f2c1b9d4e5f6a8",
  "status": "completed",
  "total": 3,
  "completed": 2,
  "failed": 1,
  "items": [
    {
      "idx": 0, "url": "https://example.com",
      "status": "completed",
      "screenshot_url": "https://pub-xxx.r2.dev/screenshots/abc123.png"
    },
    {
      "idx": 1, "url": "https://github.com",
      "status": "completed",
      "screenshot_url": "https://pub-xxx.r2.dev/screenshots/def456.png"
    },
    {
      "idx": 2, "url": "https://wikipedia.org",
      "status": "failed",
      "message": "504 timeout"
    }
  ]
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Partial success is normal. A job with <code className="font-mono">total: 50</code> and{' '}
        <code className="font-mono">failed: 3</code> is not an error &mdash; 47 screenshots succeeded.
        Collect the failed URLs, apply the timeout mitigations if needed, and retry them.
      </p>

      {/* Code recipes */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Code Recipes</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Node.js: Submit and poll to completion</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const API_KEY = process.env.PIXELPERFECT_API_KEY;
const BASE    = 'https://api.pixelperfectapi.net/api/v1';

async function batchCapture(urls, params = {}) {
  // Submit
  const submitRes = await fetch(\`\${BASE}/batch/submit\`, {
    method: 'POST',
    headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls, format: 'png', ...params }),
  });
  const job = await submitRes.json();

  // Poll
  while (true) {
    await new Promise(r => setTimeout(r, 3000));
    const statusRes = await fetch(\`\${BASE}/batch/status/\${job.id}\`, {
      headers: { 'X-API-Key': API_KEY },
    });
    const status = await statusRes.json();
    if (status.status === 'completed' || status.status === 'cancelled') {
      return status.items;
    }
  }
}

const items = await batchCapture([
  'https://example.com',
  'https://github.com',
]);
console.log('Results:', items);`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Python: Submit and poll to completion</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import os, time, requests

API_KEY = os.environ['PIXELPERFECT_API_KEY']
BASE    = 'https://api.pixelperfectapi.net/api/v1'
HEADERS = {'X-API-Key': API_KEY}

def batch_capture(urls: list[str], **params) -> list[dict]:
    # Submit
    res = requests.post(
        f'{BASE}/batch/submit',
        headers={**HEADERS, 'Content-Type': 'application/json'},
        json={'urls': urls, 'format': 'png', **params},
    )
    job = res.json()

    # Poll
    while True:
        time.sleep(3)
        status = requests.get(
            f'{BASE}/batch/status/{job["id"]}', headers=HEADERS
        ).json()
        if status['status'] in ('completed', 'cancelled'):
            return status['items']

items = batch_capture(['https://example.com', 'https://github.com'])
print(items)`}
        </pre>
      </div>

      {/* Cancelling */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cancelling a Job</h2>
      <p className="text-gray-700 leading-relaxed">
        You can cancel a queued or processing job at any time. Screenshots already completed
        are kept; in-progress captures are stopped:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/batch/cancel/JOB_ID \\
  -H "X-API-Key: YOUR_API_KEY"`}
        </pre>
      </div>

      {/* Limits by tier */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limits by Tier</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Tier</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Max URLs / job</th>
              <th className="text-left p-3 font-semibold text-gray-900">Concurrent captures</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Free</strong></td>
              <td className="p-3 border-r border-gray-200">Batch not available</td>
              <td className="p-3">2 (single endpoint only)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Pro</strong></td>
              <td className="p-3 border-r border-gray-200">50</td>
              <td className="p-3">3</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Business</strong></td>
              <td className="p-3 border-r border-gray-200">200</td>
              <td className="p-3">5</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Premium</strong></td>
              <td className="p-3 border-r border-gray-200">1,000</td>
              <td className="p-3">5</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Next steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>
      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/api-timeout-errors"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">API Timeout Errors</h4>
            <p className="text-sm text-blue-700 mb-0">Handle partial failures and retry strategies for batch jobs</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="/help/article/rate-limits-and-quotas"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Rate Limits and Quotas</h4>
            <p className="text-sm text-green-700 mb-0">Understand how concurrent capture limits affect batch throughput</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="/help/article/screenshot-parameters-explained"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Screenshot Parameters Explained</h4>
            <p className="text-sm text-purple-700 mb-0">All parameters available in the batch job body</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Batch API ready 🚀</h4>
            <p className="text-green-800 text-sm mb-0">
              You can submit jobs via JSON, file upload, or the dashboard; poll for results;
              handle partial failures; and cancel mid-job. The code recipes above are
              drop-in starting points for Node.js and Python.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessingGuide;

// =====END OF BatchProcessingGuide.JSX =====