// ========================================
// SCREENSHOT PARAMETERS EXPLAINED - PIXELPERFECT
// ========================================
// File: frontend/src/guides/APIProcessingGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #2 in "API Usage" category
// Deep reference for every screenshot request parameter
// Verified against:
//   - backend/screenshot_endpoints.py (ScreenshotRequest Pydantic model)
//   - backend/screenshot_service.py (capture_screenshot signature)
//   - frontend/src/pages/ScreenshotPage.js (playground UI)
// ========================================

import React from 'react';

const APIProcessingGuide = () => {
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
              This is the complete reference for every parameter accepted by the Screenshot API —
              viewport sizing, output format, full-page capture, dark mode, load delays, and
              element hiding. Each parameter has a deep-dive section, and there's a Recipes section
              at the end with copy-paste JSON for common scenarios.
            </p>
          </div>
        </div>
      </div>

      {/* Assumption / cross-link to auth */}
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-8 rounded">
        <p className="text-gray-700 text-sm mb-0">
          <strong>Before you start:</strong> This article assumes you already know how to
          authenticate requests. If you don't, read{' '}
          <a href="/help/article/api-authentication-methods" className="text-blue-600 hover:underline">
            API authentication methods
          </a>{' '}
          first — takes 5 minutes.
        </p>
      </div>

      {/* Reference table */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Parameters at a Glance</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Every request to <span className="font-mono">POST /api/v1/screenshot</span> accepts these
        fields. Only <span className="font-mono">url</span> is required — everything else has a
        sensible default.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Parameter</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Type</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Default</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Range</th>
              <th className="text-left p-3 font-semibold text-gray-900">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">url</td>
              <td className="p-3 border-r border-gray-200">string</td>
              <td className="p-3 border-r border-gray-200 text-gray-500">required</td>
              <td className="p-3 border-r border-gray-200 text-gray-500">http(s)</td>
              <td className="p-3">The website to capture</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">width</td>
              <td className="p-3 border-r border-gray-200">int</td>
              <td className="p-3 border-r border-gray-200">1920</td>
              <td className="p-3 border-r border-gray-200">320–3840</td>
              <td className="p-3">Viewport width in pixels</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">height</td>
              <td className="p-3 border-r border-gray-200">int</td>
              <td className="p-3 border-r border-gray-200">1080</td>
              <td className="p-3 border-r border-gray-200">240–2160</td>
              <td className="p-3">Viewport height in pixels</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">format</td>
              <td className="p-3 border-r border-gray-200">string</td>
              <td className="p-3 border-r border-gray-200">png</td>
              <td className="p-3 border-r border-gray-200">png / jpeg / webp / pdf</td>
              <td className="p-3">Output file format</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">full_page</td>
              <td className="p-3 border-r border-gray-200">bool</td>
              <td className="p-3 border-r border-gray-200">false</td>
              <td className="p-3 border-r border-gray-200">true / false</td>
              <td className="p-3">Capture entire scrollable page</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">dark_mode</td>
              <td className="p-3 border-r border-gray-200">bool</td>
              <td className="p-3 border-r border-gray-200">false</td>
              <td className="p-3 border-r border-gray-200">true / false</td>
              <td className="p-3">Render with dark color scheme</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">delay</td>
              <td className="p-3 border-r border-gray-200">int</td>
              <td className="p-3 border-r border-gray-200">0</td>
              <td className="p-3 border-r border-gray-200">0–10 (seconds)</td>
              <td className="p-3">Wait time before capture</td>
            </tr>
            <tr>
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">remove_elements</td>
              <td className="p-3 border-r border-gray-200">array&lt;string&gt;</td>
              <td className="p-3 border-r border-gray-200">[]</td>
              <td className="p-3 border-r border-gray-200">≤20 selectors, ≤200 chars each</td>
              <td className="p-3">CSS selectors to hide before capture</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Per-parameter deep sections */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Parameter Reference</h2>

      {/* url */}
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3" id="url"><span className="font-mono">url</span> — the page to capture</h3>
      <p className="text-gray-700 leading-relaxed">
        The only required field. Must include the protocol (<span className="font-mono">http://</span> or{' '}
        <span className="font-mono">https://</span>) and be publicly reachable from the internet —
        pages behind VPNs, localhost, or login walls can't be captured.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        A syntactically valid URL (like <span className="font-mono">https://exampel.com</span>) may still fail
        if the domain doesn't resolve. You'll get an HTTP 500 with a friendly message like "The
        website address could not be found" — check for typos, missing TLDs, or recently-expired
        domains.
      </p>

      {/* width/height */}
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3" id="width-height"><span className="font-mono">width</span> &amp; <span className="font-mono">height</span> — viewport dimensions</h3>
      <p className="text-gray-700 leading-relaxed">
        These define the <em>browser viewport</em> — essentially, the window size we render the
        page at. Responsive sites will adapt their layout to these dimensions, so this is how you
        capture mobile-view screenshots vs. desktop-view screenshots.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Allowed range: width <strong>320–3840</strong>, height <strong>240–2160</strong>. Values
        outside these ranges return HTTP 422 with a validation error.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-4">
        <h4 className="font-semibold text-gray-900 mb-3">Common viewport presets</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">1920 × 1080</span> Desktop (default)</div>
          <div><span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">1366 × 768</span> Laptop</div>
          <div><span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">768 × 1024</span> Tablet</div>
          <div><span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">375 × 667</span> Mobile (iPhone SE)</div>
          <div><span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">3440 × 1440</span> Ultrawide</div>
          <div><span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">1200 × 630</span> Social media preview</div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">
              Viewport ≠ final image size when <span className="font-mono">full_page</span> is on
            </h4>
            <p className="text-yellow-800 text-sm mb-0">
              With <span className="font-mono">full_page: true</span>, the viewport width stays as
              set, but the returned image height reflects the <em>full page height</em>, which is
              whatever the browser rendered. A 1920×1080 request on a long article may return a
              1920×8000 image.
            </p>
          </div>
        </div>
      </div>

      {/* format */}
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3" id="format"><span className="font-mono">format</span> — output file type</h3>
      <p className="text-gray-700 leading-relaxed">
        Four formats are supported. Each has tradeoffs:
      </p>

      <div className="space-y-3 my-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 font-mono text-sm">png <span className="text-xs text-gray-500 font-sans font-normal">(default)</span></h4>
          <p className="text-sm text-gray-700 mb-0">
            Lossless. Best for UI screenshots with crisp text, logos, and sharp edges. Larger file
            size — a typical 1920×1080 page is 150–500 KB.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 font-mono text-sm">jpeg</h4>
          <p className="text-sm text-gray-700 mb-0">
            Lossy but well-compressed. Best for pages with photos or banners where minor
            compression artifacts won't be visible. Roughly half the file size of PNG. Quality is
            fixed at 90 — high enough that compression is invisible at normal viewing distance.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 font-mono text-sm">webp</h4>
          <p className="text-sm text-gray-700 mb-0">
            Modern format with the best compression-to-quality ratio. Supported by every major
            browser since 2020. Use this if your downstream system supports it — typically 25–35%
            smaller than PNG with no visible quality loss.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 font-mono text-sm">pdf</h4>
          <p className="text-sm text-gray-700 mb-0">
            Document format. Returns an A4-page PDF with print-background enabled. Best for
            archiving, creating reports, or feeding into document workflows.{' '}
            <strong>Note:</strong> PDF output ignores <span className="font-mono">full_page</span>{' '}
            — PDFs are paginated by the browser's print engine, not by scrolling.
          </p>
        </div>
      </div>

      {/* full_page */}
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3" id="full-page"><span className="font-mono">full_page</span> — capture beyond the fold</h3>
      <p className="text-gray-700 leading-relaxed">
        By default, screenshots capture only what's visible in the initial viewport — "above the
        fold." Setting <span className="font-mono">full_page: true</span> tells the browser to
        scroll the entire page first and capture everything.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Great for long-form content: articles, documentation, product pages, landing pages. Not
        useful for apps with infinite scroll (you'd capture megabytes of feed content).
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Pair with <span className="font-mono">delay</span> for lazy-loaded images</h4>
            <p className="text-blue-800 text-sm mb-0">
              Many pages lazy-load images as the user scrolls. With <span className="font-mono">full_page: true</span>{' '}
              the browser scrolls programmatically, but JavaScript-triggered lazy loading may not
              finish before capture. Add a <span className="font-mono">delay</span> of 2–3 seconds
              if you see missing images in full-page shots.
            </p>
          </div>
        </div>
      </div>

      {/* dark_mode */}
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3" id="dark-mode"><span className="font-mono">dark_mode</span> — render with dark color scheme</h3>
      <p className="text-gray-700 leading-relaxed">
        Setting <span className="font-mono">dark_mode: true</span> tells the browser to prefer a
        dark color scheme via the CSS media query{' '}
        <span className="font-mono">prefers-color-scheme: dark</span>. Sites that respect this
        media query will render their dark theme; sites that don't will render normally.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        What this means in practice:
      </p>
      <ul className="space-y-2 mt-3">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            <strong>Sites with OS-respecting themes</strong> (GitHub, Stack Overflow, MDN, most
            modern documentation sites) will render their dark variant.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-8a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            <strong>Sites with their own theme toggle</strong> (manual dark/light switch in a
            cookie) will ignore the media query and render whatever the cookie says.
          </span>
        </li>
      </ul>

      {/* delay */}
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3" id="delay"><span className="font-mono">delay</span> — wait before capture</h3>
      <p className="text-gray-700 leading-relaxed">
        An integer number of seconds (0–10) to wait after the page finishes loading before taking
        the screenshot. Useful when pages have animations, late-rendered widgets, or lazy-loaded
        images.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Rough guide to picking a value:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 text-sm">
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <strong className="font-mono">0</strong> — static sites, marketing pages, anything that's
          done by the time DOMContentLoaded fires.
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <strong className="font-mono">2</strong> — most SPAs (React / Vue / Angular) that fetch
          data on mount.
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <strong className="font-mono">3–5</strong> — pages with cookie banner animations, hero
          video fade-ins, or chat-widget auto-popups.
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <strong className="font-mono">5–10</strong> — heavy dashboards, maps that geo-locate the
          viewer, embedded third-party iframes.
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Delay adds to total capture time</h4>
            <p className="text-yellow-800 text-sm mb-0">
              The server has a 120-second total budget per request. Heavy pages can already consume
              30–100 seconds loading. A 10-second delay on top of a slow-loading page can push the
              request into timeout territory. If you need both a long delay <em>and</em> a slow
              page, simpler is better — shrink the viewport or turn off{' '}
              <span className="font-mono">full_page</span>.
            </p>
          </div>
        </div>
      </div>

      {/* remove_elements */}
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3" id="remove-elements"><span className="font-mono">remove_elements</span> — hide elements before capture</h3>
      <p className="text-gray-700 leading-relaxed">
        An array of CSS selectors. Before the screenshot is taken, every element matching any of
        these selectors is hidden via <span className="font-mono">display: none !important</span>.
        Perfect for removing cookie banners, newsletter popups, chat widgets, or ads that clutter
        the shot.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Limits: up to <strong>20 selectors</strong> per request, each up to <strong>200 characters</strong>.
        Anything beyond these limits is silently trimmed.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">A quick CSS selector primer</h4>
      <p className="text-gray-700 leading-relaxed mb-3">
        Getting selectors right is the single most common source of "this feature isn't working"
        confusion. The three prefixes have completely different meanings:
      </p>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Selector</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Matches</th>
              <th className="text-left p-3 font-semibold text-gray-900">Example HTML</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">h1</td>
              <td className="p-3 border-r border-gray-200">Every <span className="font-mono">&lt;h1&gt;</span> element (tag name)</td>
              <td className="p-3 font-mono text-xs">&lt;h1&gt;Title&lt;/h1&gt;</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">.h1</td>
              <td className="p-3 border-r border-gray-200">Elements with <span className="font-mono">class="h1"</span></td>
              <td className="p-3 font-mono text-xs">&lt;div class="h1"&gt;...&lt;/div&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">#h1</td>
              <td className="p-3 border-r border-gray-200">The element with <span className="font-mono">id="h1"</span></td>
              <td className="p-3 font-mono text-xs">&lt;div id="h1"&gt;...&lt;/div&gt;</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 leading-relaxed">
        So <span className="font-mono">h1</span> and <span className="font-mono">.h1</span> are{' '}
        <strong>not the same thing</strong>. On a page like <span className="font-mono">example.com</span>,
        the heading is written as <span className="font-mono">&lt;h1&gt;Example Domain&lt;/h1&gt;</span> with
        no class — so <span className="font-mono">h1</span> hides it, but{' '}
        <span className="font-mono">.h1</span> matches nothing. If a selector appears to "do nothing,"
        it's almost certainly matching zero elements, not a bug in the API.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">How to find the right selector</h4>
      <ol className="space-y-2 mt-3 list-decimal list-inside text-gray-700">
        <li>Open the target page in Chrome, Firefox, or Edge</li>
        <li>Right-click the element you want to hide and choose <strong>Inspect</strong></li>
        <li>In the DevTools Elements panel, the element is highlighted</li>
        <li>Look at the <span className="font-mono">id=</span> or <span className="font-mono">class=</span> attributes — those are your selectors</li>
        <li>Right-click the element in DevTools → <strong>Copy</strong> → <strong>Copy selector</strong> gives you a bulletproof path</li>
      </ol>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Common patterns</h4>
      <div className="space-y-3 my-4">
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h5 className="font-semibold text-sm text-gray-900 mb-1">Cookie banners</h5>
          <p className="font-mono text-xs text-gray-700 break-all">
            "#onetrust-consent-sdk", ".cookie-banner", "#cookie-notice", ".gdpr-modal"
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h5 className="font-semibold text-sm text-gray-900 mb-1">Chat widgets</h5>
          <p className="font-mono text-xs text-gray-700 break-all">
            "#intercom-frame", ".drift-frame-controller", "#hubspot-messages-iframe-container"
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <h5 className="font-semibold text-sm text-gray-900 mb-1">Newsletter popups</h5>
          <p className="font-mono text-xs text-gray-700 break-all">
            ".newsletter-modal", "#email-signup-overlay", ".subscribe-popup"
          </p>
        </div>
      </div>

      {/* Recipes */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Recipes</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Copy-paste request bodies for common scenarios.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1. Social media preview image (Open Graph / Twitter Card)</h3>
      <p className="text-gray-700 leading-relaxed">
        1200×630 is the standard social preview aspect ratio. JPEG keeps file sizes small for fast
        sharing.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com/blog/my-post",
  "width": 1200,
  "height": 630,
  "format": "jpeg"
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2. Full-page documentation capture</h3>
      <p className="text-gray-700 leading-relaxed">
        A full-page PNG capturing the entire article, with a 2-second delay to let any
        code-highlighting finish rendering.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://docs.example.com/getting-started",
  "width": 1440,
  "height": 900,
  "format": "png",
  "full_page": true,
  "delay": 2
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">3. Mobile dark-mode view, banner-free</h3>
      <p className="text-gray-700 leading-relaxed">
        iPhone-sized viewport, rendered in dark mode, with typical cookie banners hidden. WebP for
        efficient storage.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "width": 375,
  "height": 667,
  "format": "webp",
  "dark_mode": true,
  "remove_elements": [
    "#cookie-banner",
    "#onetrust-consent-sdk",
    ".gdpr-modal"
  ]
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4. Printable PDF of a long article</h3>
      <p className="text-gray-700 leading-relaxed">
        A4 PDF output with print-background enabled. Hides chat widgets so they don't clutter the
        document.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com/long-form-article",
  "format": "pdf",
  "remove_elements": [
    ".chat-widget",
    "#intercom-frame",
    ".newsletter-signup"
  ]
}`}
        </pre>
      </div>

      {/* PowerShell vs cURL */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">cURL &amp; PowerShell — two syntaxes, same request</h2>
      <p className="text-gray-700 leading-relaxed">
        This guide uses cURL syntax (the Linux/macOS standard). On Windows PowerShell, the{' '}
        <span className="font-mono">curl</span> command is actually an alias for{' '}
        <span className="font-mono">Invoke-WebRequest</span> and uses different flags. If you're on
        Windows, use the native PowerShell syntax shown on the right below.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Example: Recipe 3 (mobile, dark mode, banners hidden)</h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2">cURL (Linux / macOS / WSL)</div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-xs font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "width": 375,
    "height": 667,
    "dark_mode": true,
    "remove_elements": ["#cookie-banner"]
  }'`}
            </pre>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2">PowerShell (Windows)</div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-xs font-mono">
{`$body = @{
  url             = "https://example.com"
  width           = 375
  height          = 667
  dark_mode       = $true
  remove_elements = @("#cookie-banner")
} | ConvertTo-Json

Invoke-RestMethod -Method POST \`
  -Uri "https://api.pixelperfectapi.net/api/v1/screenshot" \`
  -Headers @{
    "Authorization" = "Bearer YOUR_API_KEY"
    "Content-Type"  = "application/json"
  } \`
  -Body $body`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Getting "parameter not found" errors on Windows?</h4>
            <p className="text-blue-800 text-sm mb-0">
              That usually means PowerShell is interpreting bash-style flags like{' '}
              <span className="font-mono">-X</span> or <span className="font-mono">-H</span>. Use
              the PowerShell syntax on the right, or install real curl and invoke it as{' '}
              <span className="font-mono">curl.exe</span> (not <span className="font-mono">curl</span>,
              which is the alias).
            </p>
          </div>
        </div>
      </div>

      {/* Parameters that don't exist yet */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What's Not Here (Yet)</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        A few parameters you might look for that aren't exposed in the current API:
      </p>
      <div className="space-y-3 my-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 font-mono text-sm">quality</h4>
          <p className="text-sm text-gray-700 mb-0">
            Currently hardcoded at <strong>90</strong> for both JPEG and WebP. Chosen as the
            highest-quality setting that still meaningfully compresses. A configurable{' '}
            <span className="font-mono">quality</span> parameter may be added in a future release.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 font-mono text-sm">wait_for_selector</h4>
          <p className="text-sm text-gray-700 mb-0">
            Wait for a specific element to appear before capturing (e.g. wait for{' '}
            <span className="font-mono">.chart-loaded</span> before screenshotting a dashboard).
            Not currently supported — use <span className="font-mono">delay</span> as a simpler
            alternative.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 font-mono text-sm">custom JavaScript</h4>
          <p className="text-sm text-gray-700 mb-0">
            Executing arbitrary JS before capture (click buttons, fill forms, scroll to a specific
            element) is a planned feature. See the{' '}
            <a href="/help/article/javascript-execution" className="text-blue-600 hover:underline">JavaScript Execution Guide</a>{' '}
            for current state.
          </p>
        </div>
      </div>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Troubleshooting</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My selector doesn't seem to hide anything"</h4>
          <p className="text-sm text-gray-700 mb-2">
            Almost always a selector-syntax mismatch. Reread the CSS selector primer above — in
            particular, make sure you're using the right prefix (<span className="font-mono">.</span> for class,{' '}
            <span className="font-mono">#</span> for id, nothing for tag name). When in doubt,
            paste the selector into the target page's DevTools console:
          </p>
          <div className="bg-gray-900 rounded p-3 my-2">
            <code className="text-green-400 text-xs font-mono">document.querySelectorAll(".your-selector").length</code>
          </div>
          <p className="text-sm text-gray-700 mb-0">
            If that returns 0, the selector doesn't match anything on the page — and the API can't
            hide what isn't there.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I set a delay but the screenshot came back instantly"</h4>
          <p className="text-sm text-gray-700">
            Most likely the page finished loading very quickly (under a second) and your delay was
            measured from <em>after</em> load. Total end-to-end time = page load time + delay. A
            2-second delay on example.com still returns in about 3 seconds total.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"HTTP 422 validation error"</h4>
          <p className="text-sm text-gray-700 mb-2">
            One of your values is outside its allowed range. Check:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• <span className="font-mono">width</span> between 320 and 3840</li>
            <li>• <span className="font-mono">height</span> between 240 and 2160</li>
            <li>• <span className="font-mono">delay</span> between 0 and 10</li>
            <li>• <span className="font-mono">format</span> is one of <span className="font-mono">png, jpeg, webp, pdf</span></li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Dark mode didn't do anything on my target site"</h4>
          <p className="text-sm text-gray-700">
            The target site probably doesn't respect the <span className="font-mono">prefers-color-scheme</span>{' '}
            media query — many sites use their own theme toggle backed by a cookie or
            localStorage. PixelPerfect can't influence those site-internal theme systems.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/batch-processing-guide"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Batch processing guide</h4>
            <p className="text-sm text-blue-700 mb-0">Apply these parameters to many URLs in one request</p>
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
            <h4 className="font-semibold text-green-900 mb-1">Rate limits and quotas</h4>
            <p className="text-sm text-green-700 mb-0">Understand plan limits and how to optimize heavy workloads</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/api-authentication-methods"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">API authentication methods</h4>
            <p className="text-sm text-purple-700 mb-0">If you haven't already — start here before calling the API</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Every knob, documented 📐</h4>
            <p className="text-green-800 text-sm mb-0">
              You now know every parameter the Screenshot API accepts, what each one does, how to
              combine them for real scenarios, and how to debug when a result doesn't match your
              expectations. Bookmark this page — it's the reference you'll come back to.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIProcessingGuide;