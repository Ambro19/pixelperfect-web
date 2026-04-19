// ========================================
// MAKING YOUR FIRST API REQUEST GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/MakingFirstApiRequestGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Guide #4 in "Getting Started" category
// Real endpoint paths, response fields, and parameters verified against
// backend/screenshot_endpoints.py and frontend/src/pages/ScreenshotPage.js
// ========================================

import React from 'react';

const MakingFirstApiRequestGuide = () => {
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
              In this guide, you'll capture your first screenshot two ways — right from your browser
              dashboard (no setup), and from the command line with cURL. You'll understand the
              request anatomy, every response field, all the customization options, and how to
              handle the errors you're likely to run into.
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
            Your PixelPerfect API key (need one?{' '}
            <a href="/help/article/getting-your-api-key" className="text-blue-600 hover:underline">
              Generate it here
            </a>)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            A web browser — for the dashboard method, that's all you need
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            Optional — a terminal with <span className="font-mono">curl</span> for the API method
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">About 6 minutes of your time</span>
        </li>
      </ul>

      {/* Method 1: Dashboard */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 1: Capture From Your Dashboard (No Setup)</h2>
      <p className="text-gray-700 leading-relaxed">
        The fastest way to capture your first screenshot is right from your PixelPerfect dashboard —
        no command line, no code, no API keys to paste. Your browser session is already authenticated.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 1: Open the Screenshot page</h3>
      <p className="text-gray-700 leading-relaxed">
        From your dashboard, click the <strong>📸 Take Screenshot</strong> tile under Quick Actions.
        You can also navigate directly to:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <code className="text-green-400 text-sm font-mono">
          https://pixelperfectapi.net/screenshot
        </code>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 2: Enter a URL</h3>
      <p className="text-gray-700 leading-relaxed">
        In the <strong>Enter Website URL</strong> field, paste any public URL you want to capture —
        for example, <span className="font-mono">https://example.com</span>. The form validates the
        URL as you type and shows a green <em>"Valid URL detected"</em> pill when it's ready.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Not sure what to try? Click one of the example URLs at the top of the page
        (<span className="font-mono">example.com</span> or <span className="font-mono">github.com</span>).
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 3: Pick a viewport</h3>
      <p className="text-gray-700 leading-relaxed">
        Under <strong>📐 Screenshot Configuration</strong>, use one of the Quick Presets — Desktop,
        Laptop, Tablet, Mobile, or Ultrawide — or set custom width and height values. Defaults are
        1920×1080.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 4: Click Capture</h3>
      <p className="text-gray-700 leading-relaxed">
        Click the big blue <strong>📸 Capture Screenshot</strong> button. The button will show
        <em>"⏳ Capturing…"</em> while the page loads and renders. Within a few seconds, you'll see
        a preview of your screenshot along with:
      </p>
      <ul className="space-y-2 mt-3">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">A <strong>💾 Download</strong> button to save it locally</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">A <strong>🔗 Open in New Tab</strong> button to share it</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">Screenshot details: dimensions, format, and file size</span>
        </li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">That's it!</h4>
            <p className="text-green-800 text-sm mb-0">
              You've captured your first screenshot. Your usage counter on the page will tick up by
              one, and the screenshot is permanently stored — the URL will keep working indefinitely.
            </p>
          </div>
        </div>
      </div>

      {/* Method 2: API */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Method 2: Capture From the API (For Developers)</h2>
      <p className="text-gray-700 leading-relaxed">
        Once you're ready to integrate PixelPerfect into your code, here's everything you need.
      </p>

      {/* Anatomy of a request */}
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Anatomy of a Request</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Every API call has four parts. Getting them right saves debugging later.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">1</span>
            Endpoint
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            The URL you send your request to.
          </p>
          <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded block break-all">
            api.pixelperfectapi.net/api/v1/screenshot
          </code>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">2</span>
            Method
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            The HTTP verb — always <span className="font-mono">POST</span> for creating screenshots.
          </p>
          <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded block">
            POST
          </code>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">3</span>
            Headers
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Your API key and the content type.
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <span className="font-mono">Authorization: Bearer &lt;key&gt;</span></li>
            <li>• <span className="font-mono">Content-Type: application/json</span></li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">4</span>
            Body
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            A JSON object describing the screenshot you want.
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <span className="font-mono">url</span> — required</li>
            <li>• Options — all optional</li>
          </ul>
        </div>
      </div>

      {/* Send a basic request */}
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Send a Basic Request</h3>
      <p className="text-gray-700 leading-relaxed">
        This captures <span className="font-mono">example.com</span> at the default 1920×1080
        viewport, as a PNG.
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com"
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Replace <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">YOUR_API_KEY</span>{' '}
        with your actual key (it starts with <span className="font-mono">pk_</span>) and run it.
        You should get a JSON response within a few seconds.
      </p>

      {/* Understanding the response */}
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Understand the Response</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        A successful response looks like this:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "screenshot_id": "42",
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

      <p className="text-gray-700 leading-relaxed mb-4">
        Here's what each field means:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">screenshot_id</h4>
          <p className="text-sm text-gray-700">
            A unique database ID for this screenshot. You'll see it again if you look up this
            capture in your history.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">screenshot_url</h4>
          <p className="text-sm text-gray-700">
            The permanent URL to your screenshot. Hosted on Cloudflare R2 — fast globally and
            always available.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">width, height</h4>
          <p className="text-sm text-gray-700">
            The actual dimensions of the captured image in pixels.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">format</h4>
          <p className="text-sm text-gray-700">
            The file format — <span className="font-mono">png</span>, <span className="font-mono">jpeg</span>,{' '}
            <span className="font-mono">webp</span>, or <span className="font-mono">pdf</span>.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">size_bytes</h4>
          <p className="text-sm text-gray-700">
            Size of the screenshot file in bytes. Useful for planning bandwidth and storage.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">created_at</h4>
          <p className="text-sm text-gray-700">
            ISO 8601 timestamp (UTC) of when the screenshot was captured. Useful for logs and
            cache busting.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Open the <span className="font-mono">screenshot_url</span> in your browser to view your
        capture. It stays live permanently — you can share it, embed it, or download it.
      </p>

      {/* Customize */}
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Customize Your Request</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        The <span className="font-mono">url</span> field is the only one that's required. Everything
        else is optional with sensible defaults. Here's a fully-customized request:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "width": 1440,
  "height": 900,
  "format": "webp",
  "full_page": true,
  "dark_mode": false,
  "delay": 2,
  "remove_elements": [".cookie-banner", "#popup"]
}`}
        </pre>
      </div>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">width, height</h4>
          <p className="text-sm text-gray-700 mb-2">
            The viewport dimensions in pixels — the size of the browser window we open to render
            the page. Default: <strong>1920×1080</strong>.
          </p>
          <p className="text-xs text-gray-600">
            Width: <span className="font-mono">320–3840</span>. Height:{' '}
            <span className="font-mono">240–2160</span>. Common values: 1920×1080 (desktop),
            1440×900 (laptop), 375×667 (mobile), 3440×1440 (ultrawide).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">format</h4>
          <p className="text-sm text-gray-700 mb-2">
            Choose the output format. Default: <span className="font-mono">png</span>.
          </p>
          <ul className="text-xs text-gray-600 space-y-1 ml-4">
            <li>• <span className="font-mono">png</span> — lossless, larger files, best for UI screenshots with text</li>
            <li>• <span className="font-mono">jpeg</span> — smaller files, best for photos and banners</li>
            <li>• <span className="font-mono">webp</span> — modern format with best compression</li>
            <li>• <span className="font-mono">pdf</span> — document format, great for archiving</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">full_page</h4>
          <p className="text-sm text-gray-700 mb-2">
            Set to <span className="font-mono">true</span> to capture the entire scrollable page,
            not just the viewport. Default: <span className="font-mono">false</span>.
          </p>
          <p className="text-xs text-gray-600">
            Great for long articles or documentation pages. When enabled, the returned{' '}
            <span className="font-mono">height</span> reflects the full page height.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">dark_mode</h4>
          <p className="text-sm text-gray-700 mb-2">
            Set to <span className="font-mono">true</span> to render the page in dark mode (via the{' '}
            <span className="font-mono">prefers-color-scheme: dark</span> media query).
            Default: <span className="font-mono">false</span>.
          </p>
          <p className="text-xs text-gray-600">
            Only works on sites that respect the OS color scheme. Sites with their own theme toggle
            may ignore this.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">delay</h4>
          <p className="text-sm text-gray-700 mb-2">
            Seconds to wait after page load before capturing, between <strong>0</strong> and{' '}
            <strong>10</strong>. Default: <span className="font-mono">0</span>.
          </p>
          <p className="text-xs text-gray-600">
            Useful when a page has animations, lazy-loaded images, or late-rendering content. Try 2
            or 3 if you're getting screenshots with loading spinners or missing images.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 font-mono text-sm">remove_elements</h4>
          <p className="text-sm text-gray-700 mb-2">
            An array of CSS selectors to hide before capture.
          </p>
          <p className="text-xs text-gray-600">
            Perfect for removing cookie banners, popups, chat widgets, or ads. Example:{' '}
            <span className="font-mono">[".cookie-banner", "#live-chat", ".ads"]</span>.
          </p>
        </div>
      </div>

      {/* Multiple languages */}
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">The Same Request in Your Favorite Language</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        cURL is great for testing. Here's how to call the API from code.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Python (with <span className="font-mono">requests</span>)</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import requests

response = requests.post(
    "https://api.pixelperfectapi.net/api/v1/screenshot",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "url": "https://example.com",
        "format": "png",
        "full_page": True,
    },
)

response.raise_for_status()
data = response.json()
print(data["screenshot_url"])`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Node.js (with <span className="font-mono">fetch</span>)</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const response = await fetch(
  "https://api.pixelperfectapi.net/api/v1/screenshot",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com",
      format: "png",
      full_page: true,
    }),
  }
);

if (!response.ok) {
  const err = await response.json();
  throw new Error(err.detail || "Screenshot failed");
}

const data = await response.json();
console.log(data.screenshot_url);`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">JavaScript (Browser <span className="font-mono">fetch</span>)</h4>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-red-900 mt-0 mb-1">Don't call us directly from a production browser</h4>
            <p className="text-red-800 text-sm mb-0">
              Any API key shipped to the browser is visible to anyone using DevTools. Proxy the
              request through your own backend instead. For local testing or server-side rendering,
              browser <span className="font-mono">fetch</span> is fine.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// ⚠️ Local/server-rendered use only — never ship API keys to a production browser
const response = await fetch(
  "https://api.pixelperfectapi.net/api/v1/screenshot",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: "https://example.com" }),
  }
);

const { screenshot_url } = await response.json();`}
        </pre>
      </div>

      {/* Handling errors */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Handling Errors</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        When things go wrong, the API returns an HTTP error status and a JSON body like this:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{ "detail": "Screenshot limit exceeded (100/month). Upgrade your plan to continue." }`}
        </pre>
      </div>
      <p className="text-gray-700 leading-relaxed mb-4">
        Here are the codes you're most likely to see and what to do about each.
      </p>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-mono font-bold">400</span>
            Bad Request
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Something's wrong with your request body — a malformed URL, an unsupported format, or
            dimensions outside the allowed range.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Fix:</strong> Read the <span className="font-mono">detail</span> field — it tells
            you exactly what's wrong. Check that width is 320–3840 and height is 240–2160.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">401</span>
            Unauthorized
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Your API key is missing, malformed, or has been regenerated since you copied it.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Fix:</strong> Double-check the <span className="font-mono">Authorization</span>{' '}
            header — it must be exactly <span className="font-mono">Bearer &lt;your-key&gt;</span>.
            If the key has been regenerated, copy the new one from your dashboard.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">403</span>
            Forbidden
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            You're trying to use a feature your plan doesn't include — most commonly, batch
            processing on the Free tier.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Fix:</strong> Upgrade to Pro or higher — see the{' '}
            <a href="/help/article/understanding-pricing-plans" className="text-blue-600 hover:underline">
              Pricing Plans guide
            </a>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">429</span>
            Too Many Requests
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            You've hit your plan's monthly screenshot quota. The response will say:{' '}
            <em>"Screenshot limit exceeded (N/month). Upgrade your plan to continue."</em>
          </p>
          <p className="text-xs text-gray-600">
            <strong>Fix:</strong> Check your usage counters on the dashboard. Your quota resets
            monthly — or upgrade for higher limits.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-mono font-bold">500</span>
            Internal Server Error
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Something went wrong on our end, or the target page couldn't be captured. A common
            cause: the website took too long to respond and exhausted all retry attempts.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Fix:</strong> Retry with exponential backoff (1s, 2s, 4s). For slow pages, try
            adding a <span className="font-mono">delay</span> parameter or setting{' '}
            <span className="font-mono">full_page: false</span>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-mono font-bold">503</span>
            Service Unavailable
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            The screenshot service itself is temporarily unready — usually during a deploy or if
            the rendering engine needs to restart.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Fix:</strong> Wait 30 seconds and retry. If it persists, check{' '}
            <a href="/status" className="text-blue-600 hover:underline">our status page</a>.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Always check the status code</h4>
            <p className="text-blue-800 text-sm mb-0">
              Don't assume <span className="font-mono">response.json()</span> will always contain a{' '}
              <span className="font-mono">screenshot_url</span>. Check the HTTP status code first
              and read the <span className="font-mono">detail</span> field on errors — your
              production code will thank you.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"The website address could not be found"</h4>
          <p className="text-sm text-gray-700">
            The domain you entered doesn't exist — often a typo (e.g.{' '}
            <span className="font-mono">exampel.com</span> instead of{' '}
            <span className="font-mono">example.com</span>) or a URL with a missing TLD. Check the
            spelling and make sure the site is publicly reachable in a normal browser.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"The website took too long to respond"</h4>
          <p className="text-sm text-gray-700">
            The target site didn't finish loading within the timeout. Heavy JavaScript, slow servers,
            and continuous network activity (analytics, chat widgets) are common causes. Try adding a{' '}
            <span className="font-mono">delay</span> of 2–3 seconds, or use a lighter page for
            testing.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I'm getting back HTML instead of JSON"</h4>
          <p className="text-sm text-gray-700">
            You're probably hitting the wrong URL. Make sure you're using{' '}
            <span className="font-mono">api.pixelperfectapi.net</span> (not{' '}
            <span className="font-mono">pixelperfectapi.net</span>), that the path is{' '}
            <span className="font-mono">/api/v1/screenshot</span> (with the <span className="font-mono">/api/</span> prefix),
            and that your request method is <span className="font-mono">POST</span>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"The screenshot has a loading spinner or missing images"</h4>
          <p className="text-sm text-gray-700">
            Some pages lazy-load images or render content after initial page load. Add a{' '}
            <span className="font-mono">delay</span> parameter (try <span className="font-mono">2</span> or{' '}
            <span className="font-mono">3</span>) to give the page more time to settle before capture.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My cURL command returns a weird error on Windows"</h4>
          <p className="text-sm text-gray-700 mb-2">
            Windows terminals (CMD, PowerShell) handle single quotes differently. Try:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• Use double quotes around the JSON and escape internal quotes with <span className="font-mono">\"</span></li>
            <li>• Or save the JSON to a file and use <span className="font-mono">--data @request.json</span></li>
            <li>• Or use Postman / Insomnia / Thunder Client instead</li>
          </ul>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        You've made your first real API request. Here's where to go from here:
      </p>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/screenshot-parameters-explained"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Screenshot parameters explained</h4>
            <p className="text-sm text-blue-700 mb-0">Deep-dive on every available parameter and how they interact</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/understanding-pricing-plans"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Understanding pricing plans</h4>
            <p className="text-sm text-green-700 mb-0">Compare Free, Pro, Business, and Premium tiers</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/common-error-codes"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Common error codes</h4>
            <p className="text-sm text-purple-700 mb-0">Comprehensive reference for every error you might see</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're calling the API like a pro 🚀</h4>
            <p className="text-green-800 text-sm mb-0">
              You know how to send a request from the dashboard or from code, parse the response,
              customize the output, and handle errors. That's the full foundation — everything else
              is just more options on top.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakingFirstApiRequestGuide;