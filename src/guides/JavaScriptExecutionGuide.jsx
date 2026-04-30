// ========================================
// JAVASCRIPT EXECUTION GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/JavaScriptExecutionGuide.jsx
// Author: OneTechly
// Update: April 30, 2026
//
// Article #7 in "API Usage" category
// (Slug: javascript-execution in helpArticles.js)
//
// HONEST TREATMENT: Custom JavaScript execution is a Coming Soon feature.
// The scaffolding exists in backend/routers/screenshot.py (custom_js field,
// page.evaluate() call) but that router is NOT wired into main.py.
// The active production handler is backend/screenshot_endpoints.py, which
// has no custom_js parameter — Pydantic silently strips it if sent.
//
// This article does NOT pretend custom_js works today. Instead it:
//   1. Acknowledges JS execution as a roadmap feature (Phase 1)
//   2. Documents the planned behavior so developers can design for it now
//   3. Provides real working alternatives: delay, remove_elements, full_page
//      — parameters that ARE in the active code path today
//   4. Routes interested users to the contact form feature-request flow
//
// Same pattern as WebhookDeliveryFailuresGuide.jsx.
//
// Verified facts used (for the working-alternatives code):
//   - delay: 0–10 s, active in screenshot_endpoints.py
//   - remove_elements: ≤20 CSS selectors, active in screenshot_endpoints.py
//   - full_page: true/false, active in screenshot_endpoints.py
//   - All three available on all tiers (Free+)
// ========================================

import React from 'react';

const JavaScriptExecutionGuide = () => {
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
              Where custom JavaScript execution stands on our roadmap, and the parameters
              you can use today to solve the most common problems people reach for custom JS
              to fix. By the end you'll have working solutions that don't require waiting for
              the custom JS feature to ship.
            </p>
          </div>
        </div>
      </div>

      {/* Honest status */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Status Today</h2>
      <p className="text-gray-700 leading-relaxed">
        Custom JavaScript execution isn't yet available in the active API. The feature is
        listed on the{' '}
        <a href="/features" className="text-blue-600 hover:underline">Features page</a> as
        Coming Soon (Pro+) for exactly that reason. If you send a{' '}
        <code className="font-mono">custom_js</code> field in your request today, our API
        silently ignores it — no error, no execution, no effect.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        That said, this article is useful for two groups:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>People who need something custom JS would fix — dismissing cookie banners,
            hiding chat widgets, waiting for dynamic content — and want to use the working
            parameters available today</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Developers building integrations who want to know what the custom JS
            interface <em>will</em> look like when it ships, so they can design for it now</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        Both groups are covered below.
      </p>

      {/* Get notified */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-5 my-6 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Want to be notified when custom JS ships?</h4>
            <p className="text-sm text-purple-800 mb-3">
              Custom JavaScript execution is Phase 1 of our advanced features roadmap — it's
              the first thing we're building after launch stabilizes. Drop us a note and we'll
              email you the day it goes live, including the exact parameter name, tier gate,
              and any integration tips.
            </p>
            <a
              href="/contact?subject=feature-request-javascript-execution"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm no-underline"
            >
              Get notified
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Working alternatives */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Working Alternatives (Available Today)</h2>
      <p className="text-gray-700 leading-relaxed">
        The most common reasons developers reach for custom JavaScript are: dismissing cookie
        banners or modals, hiding distracting UI elements, or waiting for dynamic content to
        finish rendering. All three are solvable today without custom JS — using parameters
        that are already in the active API on every tier.
      </p>

      {/* remove_elements */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
        Problem: Cookie banners, chat widgets, or ads are in the screenshot
      </h3>
      <p className="text-gray-700 leading-relaxed">
        Use <code className="font-mono">remove_elements</code> — a list of CSS selectors.
        Our Chromium instance removes matching elements from the DOM before capturing. This
        covers the overwhelming majority of cases where developers would otherwise write
        JS to click "accept" or set a cookie.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "remove_elements": [
      "#cookie-banner",
      ".gdpr-overlay",
      "[id*=cookie]",
      "[class*=cookie-consent]",
      "#intercom-container",
      ".chat-widget",
      ".ad-container",
      "iframe[src*=ads]"
    ]
  }'`}
        </pre>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Limits</h4>
            <p className="text-blue-800 text-sm mb-0">
              Up to 20 selectors per request, each up to 200 characters. Available on all tiers
              (Free and above). Uses standard CSS selector syntax — IDs, classes, attribute
              selectors, and combinators all work.
            </p>
          </div>
        </div>
      </div>

      {/* delay */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
        Problem: Dynamic content hasn't finished loading by capture time
      </h3>
      <p className="text-gray-700 leading-relaxed">
        Use <code className="font-mono">delay</code> — a wait in milliseconds after the page
        finishes loading and before the screenshot is taken. This lets JavaScript animations
        complete, lazy-loaded images settle, and carousels initialize.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "delay": 3000        // wait 3 seconds after page load events
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-2">
        The range is 0–10,000 ms (0–10 seconds). Start at 2–3 seconds for pages with
        visible animations. Going above 8 seconds rarely helps further and consumes your
        120-second request budget, so aim for the minimum that solves the problem.
      </p>

      {/* full_page */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
        Problem: Below-the-fold content is missing
      </h3>
      <p className="text-gray-700 leading-relaxed">
        Use <code className="font-mono">full_page: true</code>. This captures the entire
        scrollable document height rather than just the visible viewport. No custom JS needed
        to programmatically scroll and stitch.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "full_page": true,
  "width": 1440         // wider viewport shows desktop layout
}`}
        </pre>
      </div>

      {/* Combining them */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
        Combining the three parameters
      </h3>
      <p className="text-gray-700 leading-relaxed">
        These parameters compose well. A real-world example — capturing a clean full-page
        screenshot of a SaaS landing page that has a cookie banner, a live chat widget, and
        a hero animation that takes 2 seconds to complete:
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "width": 1440,
    "height": 900,
    "full_page": true,
    "delay": 2500,
    "remove_elements": [
      "#cookie-consent",
      "#intercom-container",
      ".announcement-bar"
    ],
    "format": "png"
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        This handles the three most common use cases — element removal, render waiting, and
        full-page capture — without requiring custom JavaScript.
      </p>

      {/* Node.js recipe */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Node.js recipe</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const API_KEY = process.env.PIXELPERFECT_API_KEY;
const BASE    = 'https://api.pixelperfectapi.net/api/v1';

async function cleanScreenshot(url, options = {}) {
  const {
    removeSelectors = [],   // CSS selectors to strip
    waitMs = 0,             // extra time after load
    fullPage = false,
    width = 1280,
    format = 'png',
  } = options;

  const res = await fetch(\`\${BASE}/screenshot\`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      width,
      full_page: fullPage,
      delay: waitMs,
      remove_elements: removeSelectors,
      format,
    }),
  });

  const data = await res.json();
  return data.screenshot_url;
}

// Example: full-page capture, no banners, wait for animations
const url = await cleanScreenshot('https://example.com', {
  removeSelectors: ['#cookie-banner', '.chat-widget'],
  waitMs: 2000,
  fullPage: true,
  width: 1440,
});
console.log('Screenshot:', url);`}
        </pre>
      </div>

      {/* Python recipe */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Python recipe</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import os, requests

API_KEY = os.environ['PIXELPERFECT_API_KEY']
BASE    = 'https://api.pixelperfectapi.net/api/v1'
HEADERS = {'X-API-Key': API_KEY, 'Content-Type': 'application/json'}

def clean_screenshot(url, remove_selectors=None, wait_ms=0,
                     full_page=False, width=1280, fmt='png'):
    payload = {
        'url': url,
        'width': width,
        'full_page': full_page,
        'delay': wait_ms,
        'remove_elements': remove_selectors or [],
        'format': fmt,
    }
    res = requests.post(f'{BASE}/screenshot', json=payload, headers=HEADERS)
    res.raise_for_status()
    return res.json()['screenshot_url']

# Example
screenshot = clean_screenshot(
    'https://example.com',
    remove_selectors=['#cookie-banner', '.chat-widget'],
    wait_ms=2000,
    full_page=True,
    width=1440,
)
print('Screenshot:', screenshot)`}
        </pre>
      </div>

      {/* What custom JS will look like */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        What Custom JavaScript Will Look Like (When It Ships)
      </h2>
      <p className="text-gray-700 leading-relaxed">
        For developers planning ahead: this is the contract we're targeting. Treat it as a
        design preview, not a guarantee — the final interface may differ slightly when
        implementation completes.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned interface (subject to change)</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`POST /api/v1/screenshot
{
  "url": "https://example.com",
  "custom_js": "document.querySelector('#modal').remove(); window.scrollTo(0, 0);",
  // ... other params
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned behavior</h3>
      <ul className="space-y-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Tier gate:</strong> Pro and above. Free accounts attempting to use{' '}
            <code className="font-mono">custom_js</code> will receive a 403 with a clear
            upgrade message.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Execution timing:</strong> After the page finishes loading (after phase 1/2/3
            wait strategy), before the <code className="font-mono">delay</code> wait,
            before the screenshot is taken. You can combine{' '}
            <code className="font-mono">custom_js</code> with{' '}
            <code className="font-mono">delay</code> — execute JS, then wait for the result
            to settle.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Scope:</strong> Browser-side only. The JS runs inside the headless Chromium
            context (same origin as the page). It cannot access our server, your account, or
            any other PixelPerfect data.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Length limit:</strong> 10,000 characters max. Enough for a realistic
            manipulation script; not enough to embed entire libraries.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Error handling:</strong> If your JS throws an exception, the screenshot
            captures anyway and the response will include a{' '}
            <code className="font-mono">js_warning</code> field describing the error. The
            screenshot is never blocked by JS failures.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Timeout:</strong> 5 seconds. Infinite loops and long-running scripts
            are interrupted — the page is captured at the 5-second mark regardless.
          </span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned request shape</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url":         "https://example.com",
  "custom_js":   "document.querySelector('.modal').remove();",  // Pro+
  "delay":       1000,                                          // wait after JS runs
  "remove_elements": ["#cookie-banner"],                        // still works alongside
  "full_page":   true,
  "format":      "png"
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned response</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "screenshot_url": "https://pub-xxx.r2.dev/screenshots/abc123.png",
  "format":         "png",
  "js_warning":     null    // or "ReferenceError: foo is not defined" if JS failed
}`}
        </pre>
      </div>

      {/* Comparison table */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        Today's Parameters vs. Custom JS — Which to Use
      </h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Problem</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Use today</th>
              <th className="text-left p-3 font-semibold text-gray-900">With custom JS (future)</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Remove cookie banner</td>
              <td className="p-3 border-r border-gray-200"><code className="font-mono">remove_elements</code></td>
              <td className="p-3"><code className="font-mono">document.querySelector('.banner').remove()</code></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Wait for animation</td>
              <td className="p-3 border-r border-gray-200"><code className="font-mono">delay: 2000</code></td>
              <td className="p-3">Same — <code className="font-mono">delay</code> still best</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Capture full page</td>
              <td className="p-3 border-r border-gray-200"><code className="font-mono">full_page: true</code></td>
              <td className="p-3">Same — <code className="font-mono">full_page</code> still best</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Click "Accept" button</td>
              <td className="p-3 border-r border-gray-200"><code className="font-mono">remove_elements</code> on the banner</td>
              <td className="p-3"><code className="font-mono">document.querySelector('#accept').click()</code></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Fill a login form</td>
              <td className="p-3 border-r border-gray-200">Not yet possible</td>
              <td className="p-3"><code className="font-mono">document.querySelector('#user').value = 'demo'</code></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Scroll to position</td>
              <td className="p-3 border-r border-gray-200">Not yet possible</td>
              <td className="p-3"><code className="font-mono">window.scrollTo(0, 500)</code></td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200">Set localStorage value</td>
              <td className="p-3 border-r border-gray-200">Not yet possible</td>
              <td className="p-3"><code className="font-mono">localStorage.setItem('accepted', '1')</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        The table shows that <code className="font-mono">remove_elements</code> and{' '}
        <code className="font-mono">delay</code> already cover the most common cases. Custom
        JS adds value for interactions — clicking, form filling, scrolling, and setting
        browser storage — which are genuinely not possible today.
      </p>

      {/* When this article becomes fully applicable */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        When This Article Becomes Fully Applicable
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Once custom JS ships (our roadmap Phase 1), this article will expand to cover the
        real implementation: the exact request format, tier gate behavior, error handling,
        security boundaries, and debugging tips. For now, the working alternatives above
        handle the majority of real-world use cases.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        If the alternatives don't cover your specific case, email us at{' '}
        <a href="mailto:onetechly@gmail.com?subject=Custom JS use case"
          className="text-blue-600 hover:underline">onetechly@gmail.com</a> with a
        description of what you're trying to do. Real use cases directly influence what we
        prioritize in Phase 1, so this is one of the most useful things you can do to help
        get the feature shipped faster.
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
            <p className="text-sm text-blue-700 mb-0">
              Full reference for <code>remove_elements</code>, <code>delay</code>,{' '}
              <code>full_page</code>, and all other active parameters
            </p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/api-timeout-errors"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">API Timeout Errors</h4>
            <p className="text-sm text-green-700 mb-0">
              When pages don't load — how the three-phase strategy works and how to tune{' '}
              <code>delay</code> for your use case
            </p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/contact?subject=feature-request-javascript-execution"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Get notified when custom JS ships</h4>
            <p className="text-sm text-purple-700 mb-0">
              We'll email you on launch day — and your use case helps shape the implementation
            </p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're not blocked 🧩</h4>
            <p className="text-green-800 text-sm mb-0">
              Custom JavaScript execution is coming in Phase 1 of our roadmap, but
              <code className="font-mono"> remove_elements</code>,{' '}
              <code className="font-mono">delay</code>, and{' '}
              <code className="font-mono">full_page</code> — all available today on every
              tier — cover the majority of real-world use cases. When custom JS ships, your
              existing integration keeps working — no rewrites required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JavaScriptExecutionGuide;

// ===== END OF JavaScriptExecutionGuide.jsx =====

// =====================================================================
// // JavaScriptExecutionGuide.jsx
// import React from 'react';
// const JavaScriptExecutionGuide = () => (
//   <div className="prose prose-blue max-w-none">
//     <h2>Custom JavaScript Execution</h2>
//     <p>Execute custom JavaScript on pages before capturing screenshots.</p>
//     <p className="text-gray-600 italic">Full content coming soon...</p>
//   </div>
// );
// export default JavaScriptExecutionGuide;