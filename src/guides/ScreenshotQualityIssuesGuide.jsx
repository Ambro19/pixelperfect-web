// ========================================
// SCREENSHOT QUALITY ISSUES GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ScreenshotQualityIssuesGuide.jsx
// Author: OneTechly
// Update: April 27, 2026
//
// Article #23 in "Troubleshooting" category
// (Slug: screenshot-quality-issues in helpArticles.js)
//
// Visual problems and their fixes. Each issue follows the same shape:
// symptom (what the user sees) → cause → fix. Most likely cause first.
//
// Verified facts:
//   - Viewport bounds: 320–3840 × 240–2160 (screenshot_endpoints.py)
//   - Formats: png, jpeg, webp, pdf (active code path)
//   - delay parameter: 0–10s
//   - remove_elements: ≤20 selectors, ≤200 chars each
//   - dark_mode: works on all tiers
//   - full_page: works on all tiers
//   - File retention: 7 days
//   - Active code path is screenshot_endpoints.py (NOT routers/screenshot.py)
//
// Tone: calm, direct. Frustrated readers want symptom → fix, not theory.
// ========================================

import React from 'react';

const ScreenshotQualityIssuesGuide = () => {
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
              How to fix screenshots that look wrong. Blurry images, cut-off content, missing
              fonts, content that didn't load, dark-mode quirks, format trade-offs. Each
              problem maps directly to a fix &mdash; no architecture lectures.
            </p>
          </div>
        </div>
      </div>

      {/* Quick navigation */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quick Navigation</h2>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#blurry" className="text-blue-600 hover:underline">My screenshot is blurry or pixelated</a>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#cut-off" className="text-blue-600 hover:underline">Content is cut off at the bottom or right</a>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#fonts" className="text-blue-600 hover:underline">Fonts look wrong or fall back to defaults</a>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#missing-content" className="text-blue-600 hover:underline">Some content didn't load</a>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#popups" className="text-blue-600 hover:underline">Cookie banners and popups are blocking the page</a>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#dark-mode" className="text-blue-600 hover:underline">Dark mode isn't activating</a>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#format" className="text-blue-600 hover:underline">Choosing the right format (PNG vs JPEG vs WebP vs PDF)</a>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#colors" className="text-blue-600 hover:underline">Colors look wrong</a>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <a href="#404" className="text-blue-600 hover:underline">My screenshot URL returns 404</a>
        </li>
      </ul>

      {/* Blurry */}
      <h2 id="blurry" className="text-2xl font-bold text-gray-900 mt-10 mb-4">"My screenshot is blurry or pixelated"</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Most likely cause</h3>
      <p className="text-gray-700 leading-relaxed">
        You're capturing at a small viewport (e.g., 800x600), then displaying or printing the
        image at a larger size. The screenshot is rendered exactly at the dimensions you
        request &mdash; if you stretch it after, browsers interpolate the pixels and it looks soft.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        Capture at the size you'll display it, or larger. For modern displays, 1920x1080 is a
        sensible default. For high-DPI displays, capture at 2x the display size and let the
        browser downscale &mdash; downscaling is sharp; upscaling is soft.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// Soft when displayed at 1920x1080:
{ "url": "https://example.com", "width": 800, "height": 600 }

// Sharp when displayed at 1920x1080:
{ "url": "https://example.com", "width": 1920, "height": 1080 }`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Less common cause</h3>
      <p className="text-gray-700 leading-relaxed">
        You're using JPEG with low quality, or WebP with aggressive compression. JPEG
        artifacts show up as faint blockiness around text and sharp edges. Switch to PNG for
        anything with text or UI elements &mdash; PNG is lossless.
      </p>

      {/* Cut off */}
      <h2 id="cut-off" className="text-2xl font-bold text-gray-900 mt-10 mb-4">"Content is cut off at the bottom or right"</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Most likely cause</h3>
      <p className="text-gray-700 leading-relaxed">
        You captured the viewport only, but the page is taller than the viewport. By default,
        the API captures only what fits in the requested viewport.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        Add <code className="font-mono">"full_page": true</code> to your request. The API will
        scroll the page to its full height and stitch the screenshot, regardless of viewport
        height.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com/long-blog-post",
  "width": 1280,
  "height": 800,
  "full_page": true
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">For horizontal cut-off</h3>
      <p className="text-gray-700 leading-relaxed">
        If content is cut off at the right edge, the page has horizontal scrolling at your
        viewport width. Either widen the viewport (try 1920) or check whether the page has a
        responsive breakpoint that switches to a narrower layout at higher widths.
      </p>

      {/* Fonts */}
      <h2 id="fonts" className="text-2xl font-bold text-gray-900 mt-10 mb-4">"Fonts look wrong or fall back to defaults"</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Most likely cause</h3>
      <p className="text-gray-700 leading-relaxed">
        Web fonts hadn't finished loading when the screenshot was taken. The page rendered the
        text in a fallback font (Times New Roman, Arial) before swapping to the real font.
        This shows up most often with Google Fonts and other externally-hosted font services.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        Add a <code className="font-mono">delay</code> parameter (1&ndash;3 seconds usually does it).
        This pauses the capture after page load, giving fonts time to download and re-render.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "width": 1280,
  "height": 800,
  "delay": 2
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        The maximum delay is 10 seconds. Most pages don't need more than 3.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Less common cause</h3>
      <p className="text-gray-700 leading-relaxed">
        The font's CDN blocks server-side requests by user-agent. Rare, but it happens with
        font services that aggressively gate access. There's no client-side fix for this &mdash;
        try self-hosting the font on the page being captured.
      </p>

      {/* Missing content */}
      <h2 id="missing-content" className="text-2xl font-bold text-gray-900 mt-10 mb-4">"Some content didn't load"</h2>
      <p className="text-gray-700 leading-relaxed">
        Symptom: hero image loaded, body text loaded, but a chart, embedded widget, or
        below-the-fold image is missing or showing a placeholder.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Most likely cause</h3>
      <p className="text-gray-700 leading-relaxed">
        Lazy-loaded content. Modern sites defer loading images and widgets until the user
        scrolls them into view, to save bandwidth. When we capture the visible viewport, the
        content below has never been requested. When we capture full-page, we scroll, but
        sometimes lazy-loaded content needs an extra moment to fetch and render after scroll.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Use <code className="font-mono">"full_page": true</code> &mdash; this triggers the scroll-and-stitch flow that activates most lazy-loaded content</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Add <code className="font-mono">"delay": 3</code> on top of full-page mode &mdash; gives lazy content time to fetch after the scroll trigger</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>For sites with very heavy lazy-loading, try <code className="font-mono">"delay": 5</code></span>
        </li>
      </ul>

      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com/lazy-heavy-page",
  "width": 1280,
  "height": 800,
  "full_page": true,
  "delay": 3
}`}
        </pre>
      </div>

      {/* Popups */}
      <h2 id="popups" className="text-2xl font-bold text-gray-900 mt-10 mb-4">"Cookie banners and popups are blocking the page"</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Most likely cause</h3>
      <p className="text-gray-700 leading-relaxed">
        Cookie consent banners, newsletter signup popups, and "this site uses cookies"
        overlays load on every visit because we don't have prior consent stored. They cover
        the content you actually wanted to capture.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        Use the <code className="font-mono">remove_elements</code> parameter to hide them
        before capture. Pass an array of CSS selectors:
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "width": 1280,
  "height": 800,
  "remove_elements": [
    ".cookie-banner",
    "#cookie-consent",
    ".newsletter-popup",
    "[class*='cookie-notice']"
  ]
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Limits: up to 20 selectors per request, each &le;200 characters. The selectors run via
        <code className="font-mono">document.querySelectorAll()</code> and the matching
        elements get <code className="font-mono">display: none</code> applied before capture.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Finding the right selector</h3>
      <p className="text-gray-700 leading-relaxed">
        Open the page in your browser, right-click the popup, choose Inspect. Look for an
        identifying class or ID on the popup's container element. The wildcard pattern
        <code className="font-mono">[class*='cookie-notice']</code> catches any class
        containing "cookie-notice" &mdash; useful when the exact class name is generated but
        contains a stable substring.
      </p>

      {/* Dark mode */}
      <h2 id="dark-mode" className="text-2xl font-bold text-gray-900 mt-10 mb-4">"Dark mode isn't activating"</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Most likely cause</h3>
      <p className="text-gray-700 leading-relaxed">
        The <code className="font-mono">dark_mode</code> parameter sets the browser's
        preferred-color-scheme to dark. The page only switches if it has dark-mode styles
        wired to <code className="font-mono">@media (prefers-color-scheme: dark)</code> or a
        framework that responds to the system preference.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        If a site uses a manual toggle (a button you click to switch themes) instead of the
        system preference, our parameter has no effect &mdash; there's no JavaScript click happening
        on our side.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        For sites that respect system preference: confirm <code className="font-mono">"dark_mode": true</code> is in your request. That's all that should be needed.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        For sites with a manual toggle: there's no clean workaround in the active API today.
        Custom JavaScript Execution &mdash; which would let you click the toggle before capture &mdash;
        is on our roadmap. See the <a href="/features" className="text-blue-600 hover:underline">Features page</a> for status.
      </p>

      {/* Format */}
      <h2 id="format" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Choosing the Right Format</h2>
      <p className="text-gray-700 leading-relaxed">
        Different formats suit different use cases. Wrong format choice causes a lot of
        avoidable quality complaints.
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Format</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Best for</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Avoid for</th>
              <th className="text-left p-3 font-semibold text-gray-900">File size</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">png</td>
              <td className="p-3 border-r border-gray-200">UI screenshots, text-heavy pages, anything sharp</td>
              <td className="p-3 border-r border-gray-200">Photo-heavy pages where size matters</td>
              <td className="p-3">Large</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">jpeg</td>
              <td className="p-3 border-r border-gray-200">Photo-heavy pages, social previews</td>
              <td className="p-3 border-r border-gray-200">Anything with text or sharp edges</td>
              <td className="p-3">Small</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">webp</td>
              <td className="p-3 border-r border-gray-200">Modern web display, balance of quality and size</td>
              <td className="p-3 border-r border-gray-200">Old systems that don't support WebP</td>
              <td className="p-3">Small</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 font-mono">pdf</td>
              <td className="p-3 border-r border-gray-200">Printable documents, archives, multi-page reports</td>
              <td className="p-3 border-r border-gray-200">Display in a web app</td>
              <td className="p-3">Large</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Common mistakes</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>JPEG for UI screenshots.</strong> JPEG compresses by averaging neighboring pixels, which makes text edges fuzzy. Use PNG for anything with crisp text.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>PNG for photo-heavy pages.</strong> PNG is lossless, so file sizes balloon on photo-heavy content. Use JPEG or WebP and you'll save bandwidth.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>WebP for embedded social previews.</strong> Some social platforms still don't render WebP correctly. Stick to JPEG or PNG for Open Graph images. See the <a href="/help/article/social-media-preview-guide" className="text-blue-600 hover:underline">Social Media Preview guide</a>.</span>
        </li>
      </ul>

      {/* Colors */}
      <h2 id="colors" className="text-2xl font-bold text-gray-900 mt-10 mb-4">"Colors look wrong"</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Most likely cause</h3>
      <p className="text-gray-700 leading-relaxed">
        Display calibration. The screenshot you see in your browser is being rendered through
        your monitor's color profile, which may differ from the source. Open the same image in
        a different viewer (Preview, Photoshop, a different browser) to confirm whether the
        screenshot itself is wrong, or your display is interpreting it differently.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Less common cause</h3>
      <p className="text-gray-700 leading-relaxed">
        The page uses CSS color functions (<code className="font-mono">color-mix()</code>,
        <code className="font-mono">color()</code> with non-sRGB profiles) that don't render
        identically across browsers. Our headless Chromium follows current Chrome behavior &mdash;
        if the page looks different in Firefox or Safari, the screenshot will match Chrome,
        not the others.
      </p>

      {/* 404 */}
      <h2 id="404" className="text-2xl font-bold text-gray-900 mt-10 mb-4">"My screenshot URL returns 404"</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Most likely cause</h3>
      <p className="text-gray-700 leading-relaxed">
        The screenshot was taken more than 7 days ago. We delete screenshot files from R2
        storage after 7 days &mdash; the metadata stays in your dashboard, but the file URL stops
        resolving.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Retake the screenshot for current data</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>For long-term storage, download the bytes within 7 days and host them yourself (S3, R2, your own CDN)</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Less common cause</h3>
      <p className="text-gray-700 leading-relaxed">
        The URL was copied from before the April 12, 2026 R2 fix. Screenshots from earlier
        than that pointed to ephemeral disk storage that was wiped on the next deploy. Those
        URLs are permanently broken &mdash; just retake the screenshot.
      </p>

      {/* When to contact support */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">When to Contact Support</h2>
      <p className="text-gray-700 leading-relaxed">
        For quality issues, contact us if:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>The screenshot looks completely different from what's in the browser, even after trying full-page mode and a 5-second delay</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>The same URL produces inconsistent results between captures</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>You see corruption or partial images that you can't reproduce in the browser</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        Email <a href="mailto:onetechly@gmail.com?subject=Screenshot quality issue" className="text-blue-600 hover:underline">onetechly@gmail.com</a> with: the URL, your full request body, the screenshot URL we returned, and a description (or screenshot) of how the result differs from what you expected.
      </p>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/screenshot-parameters-explained"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Screenshot Parameters Explained</h4>
            <p className="text-sm text-blue-700 mb-0">Full reference for every parameter, with valid ranges and defaults</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/api-timeout-errors"
          className="flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">API Timeout Errors</h4>
            <p className="text-sm text-amber-700 mb-0">When the request takes longer than 120 seconds and how to fix it</p>
          </div>
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/common-error-codes"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Common Error Codes</h4>
            <p className="text-sm text-purple-700 mb-0">When the request fails outright instead of returning a bad image</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Quality dialed in 🎯</h4>
            <p className="text-green-800 text-sm mb-0">
              You know how to fix the most common quality issues: viewport sizing for sharpness,
              <code className="font-mono">full_page</code> for cut-off content, <code className="font-mono">delay</code> for fonts and lazy
              content, <code className="font-mono">remove_elements</code> for popups, and the right format for the job.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotQualityIssuesGuide;

// ===== END OF ScreenshotQualityIssuesGuide.JSX =====