// ========================================
// PYTHON INTEGRATION GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/PythonIntegrationGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #6 in "API Usage" category
// Verified against:
//   - backend/screenshot_endpoints.py (real request schema, response shape)
//   - backend/batch.py (batch endpoints, job lifecycle, polling cadence)
//   - backend/.env.production (tier limits, JWT lifetime, retention window)
//   - backend/api_key_system.py (API key format: pk_ + 32 hex chars)
//   - frontend/src/pages/BatchJobs.js (2-second polling cadence)
//
// Code style:
//   - requests library is the primary throughout (Python's de facto standard)
//   - httpx shown briefly for async use cases
//   - Every example uses environment variables for the API key
//   - Real error messages from the backend, not generic placeholders
//   - Type hints used in interfaces section (Python 3.9+ syntax)
// ========================================

import React from 'react';

const PythonIntegrationGuide = () => {
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
              Build a production-ready PixelPerfect integration in Python. We'll cover capturing
              single screenshots, downloading them to disk, running batch jobs with polling,
              uploading URL files, structured error handling, type hints, concurrency with
              ThreadPoolExecutor, and the production patterns that keep your pipeline reliable.
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
            <strong>Python 3.8 or later</strong> — check with{' '}
            <span className="font-mono">python --version</span>
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
            Comfort with virtual environments and pip
          </span>
        </li>
      </ul>

      {/* Step 1: Setup */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Project Setup</h2>
      <p className="text-gray-700 leading-relaxed">
        Create a virtual environment and install the dependencies you'll need:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`mkdir pixelperfect-python && cd pixelperfect-python

# Create and activate a virtual environment
python -m venv venv

# macOS / Linux / WSL
source venv/bin/activate

# Windows PowerShell
.\\venv\\Scripts\\Activate.ps1

# Install requests (and dotenv for loading .env files)
pip install requests python-dotenv`}
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
$env:PIXELPERFECT_API_KEY = "pk_your_actual_key_here"

# Or, for projects, create a .env file (and add it to .gitignore!)
echo "PIXELPERFECT_API_KEY=pk_your_actual_key_here" > .env`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-4">
        Then load it in your Python script:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import os
from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env into os.environ

API_KEY = os.environ["PIXELPERFECT_API_KEY"]`}
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
              Add <span className="font-mono">.env</span> to your{' '}
              <span className="font-mono">.gitignore</span> immediately. For deployed apps, use
              your hosting provider's secrets manager (Heroku Config Vars, AWS Secrets Manager,
              Render Environment tab) instead of an .env file.
            </p>
          </div>
        </div>
      </div>

      {/* HTTP client choice */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Pick Your HTTP Client</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Two solid options for Python. The choice depends on whether you need async:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Library</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Install</th>
              <th className="text-left p-3 font-semibold text-gray-900">When to use</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>requests</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono">pip install requests</span></td>
              <td className="p-3">Default choice. The de facto standard for synchronous HTTP in Python.</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>httpx</strong></td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono">pip install httpx</span></td>
              <td className="p-3">You're building async services (FastAPI, async Django, etc.) and need <span className="font-mono">await</span> support.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Most examples below use <span className="font-mono">requests</span>. The httpx equivalent
        is shown in the production-patterns section since the patterns translate directly — same
        method names, same response object shape.
      </p>

      {/* Single screenshot */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Capture a Single Screenshot</h2>
      <p className="text-gray-700 leading-relaxed">
        The simplest possible call — one URL, default settings, JSON response with the screenshot URL.
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`# capture.py
import os
import requests

API_KEY  = os.environ["PIXELPERFECT_API_KEY"]
ENDPOINT = "https://api.pixelperfectapi.net/api/v1/screenshot"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type":  "application/json",
}


def capture_screenshot(url, **options):
    """Capture a single screenshot. Returns the JSON response dict."""
    payload = {
        "url":       url,
        "width":     options.get("width",     1920),
        "height":    options.get("height",    1080),
        "format":    options.get("format",    "png"),
        "full_page": options.get("full_page", False),
        "dark_mode": options.get("dark_mode", False),
        "delay":     options.get("delay",     0),
    }

    response = requests.post(
        ENDPOINT,
        headers=HEADERS,
        json=payload,
        timeout=130,  # Slightly above the 120s server timeout
    )

    if not response.ok:
        try:
            detail = response.json().get("detail", response.text)
        except ValueError:
            detail = response.text
        raise RuntimeError(
            f"PixelPerfect {response.status_code}: {detail}"
        )

    return response.json()


# Usage
result = capture_screenshot(
    "https://example.com",
    width=1920,
    height=1080,
    full_page=True,
)

print(f"Screenshot URL: {result['screenshot_url']}")
print(f"Size:           {result['size_bytes']} bytes")`}
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
        Cloudflare R2 file. Stream it to disk to avoid loading the whole image into memory:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`from pathlib import Path


def download_screenshot(screenshot_url, local_path):
    """Stream a screenshot to disk. Memory-efficient for large captures."""
    with requests.get(screenshot_url, stream=True, timeout=60) as response:
        response.raise_for_status()
        with open(local_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
    return Path(local_path)


# Combine: capture + download
result     = capture_screenshot("https://example.com")
local_file = download_screenshot(result["screenshot_url"], "./example.png")
print(f"Saved to {local_file.resolve()}")`}
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
{`import time

BATCH_BASE = "https://api.pixelperfectapi.net/api/v1/batch"

TERMINAL_STATES = {"completed", "partial", "failed", "cancelled"}


def submit_batch(urls, **options):
    """Submit a batch job. Returns the initial job dict (status='queued')."""
    payload = {
        "urls":            urls,
        "format":          options.get("format",          "png"),
        "width":           options.get("width",           1920),
        "height":          options.get("height",          1080),
        "full_page":       options.get("full_page",       False),
        "dark_mode":       options.get("dark_mode",       False),
        "delay":           options.get("delay",           0),
        "remove_elements": options.get("remove_elements", []),
    }

    response = requests.post(
        f"{BATCH_BASE}/submit",
        headers=HEADERS,
        json=payload,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def get_job(job_id):
    """Fetch the current state of a single batch job."""
    response = requests.get(
        f"{BATCH_BASE}/jobs/{job_id}",
        headers=HEADERS,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def poll_until_done(job_id, interval=2, max_wait=600):
    """Poll a batch job until it reaches a terminal state. Returns the final job dict."""
    started = time.time()
    while True:
        job = get_job(job_id)
        print(f"[{job_id}] {job['completed']}/{job['total']} done — {job['status']}")

        if job["status"] in TERMINAL_STATES:
            return job

        if time.time() - started > max_wait:
            raise TimeoutError(f"Job {job_id} did not finish within {max_wait}s")

        time.sleep(interval)


# Full workflow
submission = submit_batch(
    ["https://example.com", "https://github.com", "https://wikipedia.org"],
    format="png",
    full_page=True,
    delay=2,
)
print(f"Submitted job {submission['id']}")

final_job = poll_until_done(submission["id"])

for item in final_job["items"]:
    if item["status"] == "completed":
        print(f"✅ {item['url']} → {item['screenshot_url']}")
    else:
        print(f"❌ {item['url']} → {item['message']}")`}
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
{`def submit_batch_file(file_path, **options):
    """Upload a CSV/TXT/TSV file with URLs and return the job dict."""
    file_path = Path(file_path)

    # Multipart form data — requests handles this naturally with files=
    files = {
        "file": (file_path.name, open(file_path, "rb"), "text/plain"),
    }
    data = {
        "format":    options.get("format",    "png"),
        "width":     str(options.get("width",     1920)),
        "height":    str(options.get("height",    1080)),
        "full_page": str(options.get("full_page", False)).lower(),
    }

    if options.get("dark_mode"):
        data["dark_mode"] = "true"
    if options.get("delay"):
        data["delay"] = str(options["delay"])
    if options.get("remove_elements"):
        # Multipart can't carry arrays — pass as comma-separated string
        data["remove_elements"] = ", ".join(options["remove_elements"])

    # Note: do NOT include Content-Type in headers here — requests sets the
    # multipart/form-data boundary automatically when files= is used.
    headers_no_ct = {"Authorization": f"Bearer {API_KEY}"}

    try:
        response = requests.post(
            f"{BATCH_BASE}/submit_file",
            headers=headers_no_ct,
            files=files,
            data=data,
            timeout=60,
        )
    finally:
        files["file"][1].close()

    if not response.ok:
        detail = response.json().get("detail", response.text) if response.content else response.text
        raise RuntimeError(f"File upload failed: {detail}")

    return response.json()


# Usage — assumes urls.txt has one URL per line
job = submit_batch_file(
    "./urls.txt",
    format="png",
    full_page=True,
    delay=2,
)
print(f"Submitted {job['total']} URLs as job {job['id']}")`}
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

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <h4 className="text-sm font-semibold text-gray-900 mt-0 mb-2">
          Don't manually set Content-Type with <span className="font-mono">files=</span>
        </h4>
        <p className="text-sm text-gray-700 mb-0">
          Common mistake: passing your usual{' '}
          <span className="font-mono">{'{"Content-Type": "application/json"}'}</span> header along
          with a file. <span className="font-mono">requests</span> needs to set the multipart
          boundary itself — overriding it breaks the upload silently. Use a fresh headers dict
          containing only the Authorization line.
        </p>
      </div>

      {/* Error handling */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 7: Handle Errors Properly</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        PixelPerfect returns specific HTTP codes for specific failures. Map them to actionable
        Python-side behavior:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Status</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Meaning</th>
              <th className="text-left p-3 font-semibold text-gray-900">What to do in Python</th>
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

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">A reusable exception class</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`class PixelPerfectError(Exception):
    """Raised when the PixelPerfect API returns an error response."""

    def __init__(self, status_code, detail, response=None):
        super().__init__(f"PixelPerfect {status_code}: {detail}")
        self.status_code = status_code
        self.detail      = detail
        self.response    = response

    @property
    def is_retryable(self):
        """Whether retrying this request might succeed."""
        return self.status_code == 429 or self.status_code >= 500


def call_api(method, url, **kwargs):
    """Wrapper that converts non-2xx responses into PixelPerfectError."""
    response = requests.request(method, url, **kwargs)
    if response.ok:
        return response.json()

    try:
        detail = response.json().get("detail", response.text)
    except ValueError:
        detail = response.text

    raise PixelPerfectError(response.status_code, detail, response)


def capture_with_retry(url, options=None, max_attempts=3):
    """Capture a screenshot, retrying transient failures with exponential backoff."""
    options = options or {}
    payload = {"url": url, **options}

    for attempt in range(1, max_attempts + 1):
        try:
            return call_api(
                "POST",
                "https://api.pixelperfectapi.net/api/v1/screenshot",
                headers=HEADERS,
                json=payload,
                timeout=130,
            )
        except PixelPerfectError as err:
            if not err.is_retryable or attempt == max_attempts:
                raise
            backoff = 2 ** (attempt - 1)  # 1s, 2s, 4s
            print(f"Attempt {attempt} failed ({err.status_code}), retrying in {backoff}s")
            time.sleep(backoff)`}
        </pre>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <h4 className="text-sm font-semibold text-gray-900 mt-0 mb-2">Tip: tenacity for fancier retries</h4>
        <p className="text-sm text-gray-700 mb-0">
          For production, consider the{' '}
          <a href="https://pypi.org/project/tenacity/" className="text-blue-600 hover:underline">tenacity</a>{' '}
          library — it gives you decorator-based retries with jitter, conditional retry rules,
          and structured logging out of the box. Install with{' '}
          <span className="font-mono">pip install tenacity</span>, then{' '}
          <span className="font-mono">{'@retry(stop=stop_after_attempt(3))'}</span> on any function.
        </p>
      </div>

      {/* Type hints */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 8: Type Hints (Bonus)</h2>
      <p className="text-gray-700 leading-relaxed">
        If you use mypy or pyright, here are TypedDict definitions for both response shapes.
        Drop these in a <span className="font-mono">types.py</span> module:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`# types.py
from typing import Literal, TypedDict, Optional


# Single screenshot response
class ScreenshotResponse(TypedDict):
    screenshot_id:  int
    screenshot_url: str
    width:          int
    height:         int
    format:         Literal["png", "jpeg", "webp", "pdf"]
    size_bytes:     int
    created_at:     str
    message:        str


# Batch item state
BatchItemStatus = Literal[
    "queued", "processing", "completed", "failed", "cancelled",
]


class BatchItem(TypedDict):
    idx:             int
    url:             str
    status:          BatchItemStatus
    message:         Optional[str]
    screenshot_url:  Optional[str]
    file_size:       Optional[int]
    processing_time: Optional[float]


# Batch job state
BatchJobStatus = Literal[
    "queued", "processing", "completed", "partial", "failed", "cancelled",
]


class BatchJob(TypedDict):
    id:         str
    created_at: str
    status:     BatchJobStatus
    format:     str
    total:      int
    completed:  int
    failed:     int
    queued:     int
    processing: int
    items:      list[BatchItem]


# Use them in your function signatures
def get_job(job_id: str) -> BatchJob: ...
def submit_batch(urls: list[str], **options) -> BatchJob: ...`}
        </pre>
      </div>

      {/* Production patterns */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 9: Production Patterns</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Always set timeouts</h3>
      <p className="text-gray-700 leading-relaxed">
        Without an explicit timeout, <span className="font-mono">requests</span> will wait
        forever — a frozen connection can hang your entire script. Set timeouts slightly above
        the 120-second server timeout:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`# Single tuple = (connect_timeout, read_timeout)
response = requests.post(
    ENDPOINT,
    headers=HEADERS,
    json=payload,
    timeout=(10, 130),  # 10s to connect, 130s to read
)`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Reuse a Session for performance</h3>
      <p className="text-gray-700 leading-relaxed">
        When making multiple requests, reuse a <span className="font-mono">requests.Session</span>{' '}
        — it pools TCP connections so subsequent calls skip the TLS handshake:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`session = requests.Session()
session.headers.update(HEADERS)

for url in urls:
    response = session.post(ENDPOINT, json={"url": url}, timeout=130)
    # ... process response

session.close()  # Or use it as a context manager: 'with requests.Session() as s:'`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Respect concurrency limits</h3>
      <p className="text-gray-700 leading-relaxed">
        Pro = 3 concurrent captures, Business = 5. If you fire 10 requests in parallel with{' '}
        <span className="font-mono">ThreadPoolExecutor</span>, most will hit HTTP 429. Cap your
        worker count to your tier's limit:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`from concurrent.futures import ThreadPoolExecutor, as_completed

def capture_many(urls, max_workers=3):  # Pro tier = 3
    """Capture URLs in parallel, capped at max_workers concurrent calls."""
    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(capture_screenshot, url): url
            for url in urls
        }
        for future in as_completed(futures):
            url = futures[future]
            try:
                results[url] = future.result()
            except Exception as exc:
                results[url] = {"error": str(exc)}
    return results


# Or — much simpler — just submit them all as a batch and let the server handle pacing.`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Async with httpx (when you need it)</h3>
      <p className="text-gray-700 leading-relaxed">
        If your code already runs in an async context (FastAPI, async Django, asyncio scripts),
        use <span className="font-mono">httpx</span> instead of <span className="font-mono">requests</span>.
        Same patterns, async syntax:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import asyncio
import httpx

async def capture_async(client, url, **options):
    payload = {"url": url, **options}
    response = await client.post(ENDPOINT, json=payload, timeout=130)
    response.raise_for_status()
    return response.json()


async def main(urls):
    async with httpx.AsyncClient(headers=HEADERS) as client:
        results = await asyncio.gather(*[
            capture_async(client, url) for url in urls
        ])
    return results

# asyncio.run(main(["https://example.com", "https://github.com"]))`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Log structurally</h3>
      <p className="text-gray-700 leading-relaxed">
        For production observability, use Python's <span className="font-mono">logging</span>{' '}
        module (or <a href="https://www.structlog.org/" className="text-blue-600 hover:underline">structlog</a> for
        JSON logs) with relevant context:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import logging
logger = logging.getLogger(__name__)

started = time.time()
result  = capture_screenshot(target_url)
logger.info(
    "screenshot_captured",
    extra={
        "screenshot_id":  result["screenshot_id"],
        "url":            target_url,
        "size_bytes":     result["size_bytes"],
        "duration_ms":    int((time.time() - started) * 1000),
    },
)`}
        </pre>
      </div>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"requests.exceptions.SSLError"</h4>
          <p className="text-sm text-gray-700">
            Your Python's CA bundle is outdated. On macOS, run the{' '}
            <span className="font-mono">Install Certificates.command</span> in your Python
            install directory. On Linux,{' '}
            <span className="font-mono">pip install --upgrade certifi</span>. Don't disable SSL
            verification (<span className="font-mono">verify=False</span>) — that's a security hole.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"PixelPerfect 401: Could not validate credentials"</h4>
          <p className="text-sm text-gray-700">
            Your API key is missing, malformed, or revoked. Verify{' '}
            <span className="font-mono">os.environ.get("PIXELPERFECT_API_KEY")</span> returns a
            string starting with <span className="font-mono">pk_</span>. If you're using a{' '}
            <span className="font-mono">.env</span> file, make sure{' '}
            <span className="font-mono">load_dotenv()</span> runs before you read the variable.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"KeyError: 'PIXELPERFECT_API_KEY'"</h4>
          <p className="text-sm text-gray-700">
            The env var isn't set in this shell session. Env vars don't persist across terminal
            tabs unless you add them to your <span className="font-mono">~/.bashrc</span>,{' '}
            <span className="font-mono">~/.zshrc</span>, or PowerShell profile. Use{' '}
            <span className="font-mono">os.environ.get(...)</span> instead of{' '}
            <span className="font-mono">os.environ[...]</span> if you want a default fallback.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My poll loop runs forever"</h4>
          <p className="text-sm text-gray-700">
            Make sure you're checking for terminal states properly. The terminal set is{' '}
            <span className="font-mono">{'{"completed", "partial", "failed", "cancelled"}'}</span>{' '}—
            forgetting <span className="font-mono">"partial"</span> is a common bug that causes
            infinite polling on jobs where some URLs fail.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Downloaded image is corrupted or zero-byte"</h4>
          <p className="text-sm text-gray-700">
            Don't use <span className="font-mono">response.text</span> for binary content — that
            decodes the bytes as UTF-8 and corrupts the file. Use{' '}
            <span className="font-mono">response.content</span> for the raw bytes, or stream with{' '}
            <span className="font-mono">stream=True</span> + <span className="font-mono">iter_content()</span>{' '}
            for memory efficiency.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"File upload returns 422 Unprocessable Entity"</h4>
          <p className="text-sm text-gray-700">
            You probably set a manual <span className="font-mono">Content-Type</span> header
            alongside <span className="font-mono">files=</span>. Remove it — requests sets the
            multipart boundary automatically. Use a fresh headers dict containing only the{' '}
            <span className="font-mono">Authorization</span> line.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"ModuleNotFoundError: No module named 'requests'"</h4>
          <p className="text-sm text-gray-700">
            You're not in your virtualenv. Activate it first:{' '}
            <span className="font-mono">source venv/bin/activate</span> (Linux/macOS) or{' '}
            <span className="font-mono">.\venv\Scripts\Activate.ps1</span> (PowerShell). Confirm
            with <span className="font-mono">which python</span> — the path should include{' '}
            <span className="font-mono">venv/</span>.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/javascript-execution-guide"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">JavaScript execution guide</h4>
            <p className="text-sm text-blue-700 mb-0">Run custom JavaScript on the page before capture</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Python integration, complete 🐍</h4>
            <p className="text-green-800 text-sm mb-0">
              You have everything you need: single captures, downloads, batch with polling,
              file uploads, structured error handling, type hints, ThreadPoolExecutor concurrency,
              and async patterns for when you need them. Time to build your pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonIntegrationGuide;