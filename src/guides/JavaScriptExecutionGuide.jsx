// ========================================
// GUIDE: Custom JavaScript Execution
// ========================================
// File: frontend/src/guides/JavaScriptExecutionGuide.jsx
// Author: OneTechly
// Updated: May 2026 — Phase 1 full content (was stub)
//
// Tier: Pro+
// Phase: 1 (shipped May 2026)
// ========================================

import React, { useState } from 'react';

const TierBadge = ({ tier }) => {
  const styles = {
    pro:      'bg-blue-100 text-blue-800 border border-blue-300',
    business: 'bg-purple-100 text-purple-800 border border-purple-300',
    premium:  'bg-green-100 text-green-800 border border-green-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[tier] || styles.pro}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}+
    </span>
  );
};

const CalloutBox = ({ type = 'info', title, children }) => {
  const styles = {
    info:    { wrapper: 'bg-blue-50 border-blue-300',   icon: '💡', titleColor: 'text-blue-800',  bodyColor: 'text-blue-700'  },
    warning: { wrapper: 'bg-amber-50 border-amber-300', icon: '⚠️', titleColor: 'text-amber-800', bodyColor: 'text-amber-700' },
    success: { wrapper: 'bg-green-50 border-green-300', icon: '✅', titleColor: 'text-green-800', bodyColor: 'text-green-700' },
    tip:     { wrapper: 'bg-purple-50 border-purple-300', icon: '⚡', titleColor: 'text-purple-800', bodyColor: 'text-purple-700' },
  };
  const s = styles[type] || styles.info;
  return (
    <div className={`border-l-4 rounded-r-lg p-4 mb-6 ${s.wrapper}`}>
      {title && (
        <div className={`font-semibold mb-1 flex items-center gap-2 ${s.titleColor}`}>
          <span>{s.icon}</span> {title}
        </div>
      )}
      <div className={`text-sm leading-relaxed ${s.bodyColor}`}>{children}</div>
    </div>
  );
};

const CodeBlock = ({ code, language = 'javascript', label }) => (
  <div className="mb-6">
    {label && (
      <div className="bg-gray-700 text-gray-300 text-xs font-mono px-4 py-2 rounded-t-lg">
        {label}
      </div>
    )}
    <pre className={`bg-gray-900 text-green-400 text-sm font-mono p-4 overflow-x-auto leading-relaxed ${label ? 'rounded-b-lg' : 'rounded-lg'}`}>
      <code>{code.trim()}</code>
    </pre>
  </div>
);

const SectionHeading = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
    {children}
  </h2>
);

const SubHeading = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
);

// Interactive example toggler
const ExampleTabs = ({ examples }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-3">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active === i
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {ex.label}
          </button>
        ))}
      </div>
      <CodeBlock code={examples[active].code} label={examples[active].label} />
      {examples[active].description && (
        <p className="text-sm text-gray-600 -mt-3 mb-4">{examples[active].description}</p>
      )}
    </div>
  );
};

export default function JavaScriptExecutionGuide() {
  const cookieBannerExamples = [
    {
      label: 'Remove by class',
      code: `// Remove by class name
document.querySelector('.cookie-banner')?.remove();
document.querySelector('.cookie-notice')?.remove();
document.querySelector('.gdpr-banner')?.remove();`,
      description: 'Works for most cookie banners that use a predictable class name.',
    },
    {
      label: 'Remove by ID',
      code: `// Remove by ID
document.getElementById('cookie-popup')?.remove();
document.getElementById('consent-banner')?.remove();`,
      description: 'Some banners use a fixed ID — check the site\'s source to confirm.',
    },
    {
      label: 'Click accept then remove',
      code: `// Click "Accept" first, then remove the banner
const acceptBtn = document.querySelector(
  '[aria-label="Accept cookies"], .accept-cookies, #accept-all'
);
if (acceptBtn) {
  acceptBtn.click();
  // Give the click handler 300ms to run, then clean up
  await new Promise(r => setTimeout(r, 300));
  document.querySelector('.cookie-banner')?.remove();
}`,
      description: 'Useful when the banner re-appears if dismissed without accepting.',
    },
    {
      label: 'Hide everything matching',
      code: `// Hide all matching elements (non-destructive)
const selectors = [
  '.cookie-banner', '.cookie-notice', '.gdpr-banner',
  '[class*="cookie"]', '[id*="cookie"]', '[id*="consent"]'
];
selectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.style.setProperty('display', 'none', 'important');
  });
});`,
      description: 'Aggressive approach that catches many banner patterns at once.',
    },
  ];

  const manipulationExamples = [
    {
      label: 'Change background',
      code: `// Set a clean white background
document.body.style.backgroundColor = '#ffffff';
document.documentElement.style.backgroundColor = '#ffffff';`,
      description: 'Useful when a page has a transparent or unexpected background colour.',
    },
    {
      label: 'Inject a watermark',
      code: `// Add a watermark overlay
const wm = document.createElement('div');
wm.style.cssText = \`
  position: fixed; bottom: 16px; right: 16px;
  background: rgba(0,0,0,0.6); color: white;
  padding: 6px 12px; border-radius: 4px;
  font-family: sans-serif; font-size: 13px;
  z-index: 99999; pointer-events: none;
\`;
wm.textContent = 'Captured by PixelPerfect';
document.body.appendChild(wm);`,
      description: 'Brand your screenshots with a custom watermark.',
    },
    {
      label: 'Show hidden element',
      code: `// Force a hidden element to be visible
const el = document.querySelector('#hidden-section');
if (el) {
  el.style.removeProperty('display');
  el.style.setProperty('visibility', 'visible', 'important');
  el.style.setProperty('opacity', '1', 'important');
}`,
      description: 'Reveal an element that is hidden by CSS before capturing.',
    },
    {
      label: 'Scroll to position',
      code: `// Scroll to bottom before capture (use with full_page: false)
window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });

// Or scroll to a specific element
document.querySelector('#pricing-section')?.scrollIntoView();`,
      description: 'Position the viewport before capture. Pair with full_page: false.',
    },
  ];

  return (
    <article className="prose-custom max-w-none">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{'</>'}</div>
          <TierBadge tier="pro" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Custom JavaScript Execution</h1>
        <p className="text-blue-100 text-sm leading-relaxed">
          Execute arbitrary JavaScript inside the page before the screenshot is taken.
          Remove banners, inject content, trigger interactions, and reshape any page
          exactly as you need it captured.
        </p>
      </div>

      {/* Quick reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Parameter', value: 'custom_js' },
          { label: 'Tier', value: 'Pro+' },
          { label: 'Max length', value: '10,000 chars' },
          { label: 'On error', value: 'Non-fatal ✓' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="font-semibold text-gray-900 text-sm">{value}</div>
          </div>
        ))}
      </div>

      <CalloutBox type="success" title="Option-C error handling">
        If your JavaScript throws a syntax error or runtime exception, the screenshot
        still captures successfully. The error is returned in the{' '}
        <code className="text-xs bg-green-100 px-1 rounded">js_warning</code> field
        of the response — your workflow is never blocked by a JS error.
      </CalloutBox>

      {/* Basic usage */}
      <SectionHeading>Basic usage</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Pass your JavaScript as a string in the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">custom_js</code> field.
        It executes after the page loads, before the screenshot is taken.
      </p>

      <CodeBlock
        label="curl"
        code={`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "custom_js": "document.body.style.backgroundColor = \\"#f0f9ff\\";"
  }'`}
      />

      <CodeBlock
        label="Node.js"
        code={`const response = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    custom_js: \`
      // Remove cookie banner
      document.querySelector('.cookie-banner')?.remove();

      // Set clean background
      document.body.style.backgroundColor = '#ffffff';
    \`,
  }),
});

const data = await response.json();
console.log(data.screenshot_url);

// Check for JS errors (capture still succeeded)
if (data.js_warning) {
  console.warn('JS warning:', data.js_warning);
}`}
      />

      <CodeBlock
        label="Python"
        code={`import requests

response = requests.post(
    'https://api.pixelperfectapi.net/api/v1/screenshot/',
    headers={'Authorization': 'Bearer YOUR_TOKEN'},
    json={
        'url': 'https://example.com',
        'custom_js': '''
            document.querySelector('.cookie-banner')?.remove();
            document.body.style.backgroundColor = '#ffffff';
        ''',
    }
)

data = response.json()
print(data['screenshot_url'])

# Non-fatal — check for warnings even on success
if data.get('js_warning'):
    print('JS warning:', data['js_warning'])`}
      />

      {/* Execution order */}
      <SectionHeading>Execution order</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Understanding when your script runs helps you write more effective automation:
      </p>
      <ol className="space-y-2 mb-6">
        {[
          { n: 1, text: 'Page navigated and loaded (networkidle)' },
          { n: 2, text: 'wait_for_selector resolved (if provided)' },
          { n: 3, text: 'remove_elements applied (CSS selectors hidden)' },
          { n: 4, text: 'custom_js executed ← your script runs here' },
          { n: 5, text: '500ms settle wait (lets JS effects render)' },
          { n: 6, text: 'User delay applied (if delay > 0)' },
          { n: 7, text: 'Screenshot captured' },
        ].map(({ n, text }) => (
          <li key={n} className={`flex items-start gap-3 p-3 rounded-lg ${n === 4 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              n === 4 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}>{n}</span>
            <span className={`text-sm ${n === 4 ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>{text}</span>
          </li>
        ))}
      </ol>

      <CalloutBox type="tip" title="Combine with wait_for_selector">
        Use <code className="text-xs bg-purple-100 px-1 rounded">wait_for_selector</code> to
        wait for a dynamically loaded element, then use <code className="text-xs bg-purple-100 px-1 rounded">custom_js</code> to
        manipulate it. The selector is guaranteed to be present when your script runs.
      </CalloutBox>

      {/* Common use cases */}
      <SectionHeading>Common use cases</SectionHeading>

      <SubHeading>Remove cookie banners and popups</SubHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Cookie consent banners are the most common use case. Pick the approach that matches your target site:
      </p>
      <ExampleTabs examples={cookieBannerExamples} />

      <SubHeading>Page manipulation</SubHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Adjust page appearance, inject overlays, or control scroll position before capture:
      </p>
      <ExampleTabs examples={manipulationExamples} />

      <SubHeading>Simulate user interactions</SubHeading>
      <CodeBlock
        label="javascript"
        code={`// Open a dropdown menu before capturing
const menuBtn = document.querySelector('[aria-haspopup="true"]');
if (menuBtn) {
  menuBtn.click();
  await new Promise(r => setTimeout(r, 400));
}

// Expand an accordion section
const accordion = document.querySelector('.accordion-header');
if (accordion && accordion.getAttribute('aria-expanded') === 'false') {
  accordion.click();
  await new Promise(r => setTimeout(r, 300));
}

// Fill a form field (visible in screenshot)
const input = document.querySelector('#search-input');
if (input) {
  input.value = 'PixelPerfect';
  input.dispatchEvent(new Event('input', { bubbles: true }));
}`}
      />

      <SubHeading>Remove dynamic noise</SubHeading>
      <CodeBlock
        label="javascript"
        code={`// Freeze animated elements for a clean capture
document.querySelectorAll('[class*="animate"], [class*="transition"]')
  .forEach(el => {
    el.style.animationPlayState = 'paused';
    el.style.transitionDuration = '0s';
  });

// Remove chat widgets (Intercom, Zendesk, etc.)
['#intercom-container', '#launcher', '.zopim', '[id^="hubspot"]']
  .forEach(sel => document.querySelector(sel)?.remove());

// Hide live chat bubble
document.querySelector('iframe[title*="chat"]')?.remove();`}
      />

      {/* The js_warning field */}
      <SectionHeading>The js_warning response field</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Every screenshot response includes a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">js_warning</code> field.
        It is <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">null</code> when
        your script executed cleanly, and a string describing the error otherwise.
        The screenshot is captured either way.
      </p>

      <CodeBlock
        label="Successful response"
        code={`{
  "screenshot_url": "https://...",
  "screenshot_id": "abc123",
  "js_warning": null,
  "format": "png",
  "size_bytes": 142857
}`}
      />

      <CodeBlock
        label="Response with JS error (screenshot still captured)"
        code={`{
  "screenshot_url": "https://...",
  "screenshot_id": "abc123",
  "js_warning": "Page.evaluate: SyntaxError: Unexpected token '}' ...",
  "format": "png",
  "size_bytes": 138204
}`}
      />

      <CalloutBox type="warning" title="Always check js_warning in production">
        In automated pipelines, add a check for a non-null <code className="text-xs bg-amber-100 px-1 rounded">js_warning</code>.
        The screenshot captures successfully regardless, but the warning tells you your
        script didn't run as intended — which may affect the visual output.
      </CalloutBox>

      {/* Limits */}
      <SectionHeading>Limits and constraints</SectionHeading>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Constraint</th>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Value</th>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Max script length', '10,000 characters', 'Pydantic validation — 422 if exceeded'],
              ['Execution timeout', '30 seconds', 'Part of overall Playwright timeout'],
              ['Errors', 'Non-fatal', 'Capture succeeds; error in js_warning'],
              ['Access', 'Full DOM', 'window, document, fetch — no sandbox restrictions'],
              ['Async/await', 'Supported', 'Top-level await works inside the script'],
              ['External requests', 'Allowed', 'fetch() and XMLHttpRequest work normally'],
            ].map(([constraint, value, notes]) => (
              <tr key={constraint} className="border-b border-gray-100 last:border-0">
                <td className="p-3 font-mono text-xs text-gray-800">{constraint}</td>
                <td className="p-3 font-semibold text-gray-900">{value}</td>
                <td className="p-3 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Best practices */}
      <SectionHeading>Best practices</SectionHeading>
      <div className="space-y-3 mb-8">
        {[
          {
            icon: '🛡️',
            title: 'Use optional chaining',
            body: 'Always write document.querySelector(\'...\')?.remove() rather than document.querySelector(\'...\').remove(). If the element doesn\'t exist, optional chaining silently skips rather than throwing a ReferenceError.',
          },
          {
            icon: '⏱️',
            title: 'Account for render time',
            body: 'CSS transitions and JavaScript animations may still be mid-frame when your script finishes. The built-in 500ms settle wait usually covers this, but you can add delay: 1 for heavier pages.',
          },
          {
            icon: '🔍',
            title: 'Test selectors in DevTools first',
            body: 'Open your target site, press F12, paste your selector into the console, and confirm it returns the right element before adding it to your API call.',
          },
          {
            icon: '📏',
            title: 'Keep scripts focused',
            body: 'One or two operations per capture. Long scripts are harder to debug and consume more of the timeout budget.',
          },
          {
            icon: '🔁',
            title: 'Handle js_warning in automation',
            body: 'Log or alert on non-null js_warning values. A silent JS failure means your manipulation didn\'t run — the screenshot may not look as intended.',
          },
        ].map(({ icon, title, body }) => (
          <div key={title} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl flex-shrink-0">{icon}</div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">{title}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tier note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
        <div className="text-blue-800 font-semibold mb-1">⚡ Pro tier feature</div>
        <p className="text-blue-700 text-sm">
          Custom JavaScript execution is available on Pro, Business, and Premium plans.
          Free tier requests that include <code className="bg-blue-100 px-1 rounded">custom_js</code> receive HTTP 403.
        </p>
      </div>
    </article>
  );
}

// ===== END OF JavaScriptExecutionGuide.jsx =====

// // =================================================================================================================
// // ========================================
// // JAVASCRIPT EXECUTION GUIDE - PIXELPERFECT
// // ========================================
// // File: frontend/src/guides/JavaScriptExecutionGuide.jsx
// // Author: OneTechly
// // Update: April 30, 2026
// //
// // Article #7 in "API Usage" category
// // (Slug: javascript-execution in helpArticles.js)
// //
// // HONEST TREATMENT: Custom JavaScript execution is a Coming Soon feature.
// // The scaffolding exists in backend/routers/screenshot.py (custom_js field,
// // page.evaluate() call) but that router is NOT wired into main.py.
// // The active production handler is backend/screenshot_endpoints.py, which
// // has no custom_js parameter — Pydantic silently strips it if sent.
// //
// // This article does NOT pretend custom_js works today. Instead it:
// //   1. Acknowledges JS execution as a roadmap feature (Phase 1)
// //   2. Documents the planned behavior so developers can design for it now
// //   3. Provides real working alternatives: delay, remove_elements, full_page
// //      — parameters that ARE in the active code path today
// //   4. Routes interested users to the contact form feature-request flow
// //
// // Same pattern as WebhookDeliveryFailuresGuide.jsx.
// //
// // Verified facts used (for the working-alternatives code):
// //   - delay: 0–10 s, active in screenshot_endpoints.py
// //   - remove_elements: ≤20 CSS selectors, active in screenshot_endpoints.py
// //   - full_page: true/false, active in screenshot_endpoints.py
// //   - All three available on all tiers (Free+)
// // ========================================

// import React from 'react';

// const JavaScriptExecutionGuide = () => {
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
//               Where custom JavaScript execution stands on our roadmap, and the parameters
//               you can use today to solve the most common problems people reach for custom JS
//               to fix. By the end you'll have working solutions that don't require waiting for
//               the custom JS feature to ship.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Honest status */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Status Today</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Custom JavaScript execution isn't yet available in the active API. The feature is
//         listed on the{' '}
//         <a href="/features" className="text-blue-600 hover:underline">Features page</a> as
//         Coming Soon (Pro+) for exactly that reason. If you send a{' '}
//         <code className="font-mono">custom_js</code> field in your request today, our API
//         silently ignores it — no error, no execution, no effect.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         That said, this article is useful for two groups:
//       </p>
//       <ul className="space-y-2 mt-3 text-gray-700">
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>People who need something custom JS would fix — dismissing cookie banners,
//             hiding chat widgets, waiting for dynamic content — and want to use the working
//             parameters available today</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>Developers building integrations who want to know what the custom JS
//             interface <em>will</em> look like when it ships, so they can design for it now</span>
//         </li>
//       </ul>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         Both groups are covered below.
//       </p>

//       {/* Get notified */}
//       <div className="bg-purple-50 border-l-4 border-purple-500 p-5 my-6 rounded-lg">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
//           </svg>
//           <div>
//             <h4 className="font-semibold text-purple-900 mb-1">Want to be notified when custom JS ships?</h4>
//             <p className="text-sm text-purple-800 mb-3">
//               Custom JavaScript execution is Phase 1 of our advanced features roadmap — it's
//               the first thing we're building after launch stabilizes. Drop us a note and we'll
//               email you the day it goes live, including the exact parameter name, tier gate,
//               and any integration tips.
//             </p>
//             <a
//               href="/contact?subject=feature-request-javascript-execution"
//               className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm no-underline"
//             >
//               Get notified
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Working alternatives */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Working Alternatives (Available Today)</h2>
//       <p className="text-gray-700 leading-relaxed">
//         The most common reasons developers reach for custom JavaScript are: dismissing cookie
//         banners or modals, hiding distracting UI elements, or waiting for dynamic content to
//         finish rendering. All three are solvable today without custom JS — using parameters
//         that are already in the active API on every tier.
//       </p>

//       {/* remove_elements */}
//       <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
//         Problem: Cookie banners, chat widgets, or ads are in the screenshot
//       </h3>
//       <p className="text-gray-700 leading-relaxed">
//         Use <code className="font-mono">remove_elements</code> — a list of CSS selectors.
//         Our Chromium instance removes matching elements from the DOM before capturing. This
//         covers the overwhelming majority of cases where developers would otherwise write
//         JS to click "accept" or set a cookie.
//       </p>

//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
//   -H "X-API-Key: YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://example.com",
//     "remove_elements": [
//       "#cookie-banner",
//       ".gdpr-overlay",
//       "[id*=cookie]",
//       "[class*=cookie-consent]",
//       "#intercom-container",
//       ".chat-widget",
//       ".ad-container",
//       "iframe[src*=ads]"
//     ]
//   }'`}
//         </pre>
//       </div>

//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Limits</h4>
//             <p className="text-blue-800 text-sm mb-0">
//               Up to 20 selectors per request, each up to 200 characters. Available on all tiers
//               (Free and above). Uses standard CSS selector syntax — IDs, classes, attribute
//               selectors, and combinators all work.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* delay */}
//       <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
//         Problem: Dynamic content hasn't finished loading by capture time
//       </h3>
//       <p className="text-gray-700 leading-relaxed">
//         Use <code className="font-mono">delay</code> — a wait in milliseconds after the page
//         finishes loading and before the screenshot is taken. This lets JavaScript animations
//         complete, lazy-loaded images settle, and carousels initialize.
//       </p>

//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "url": "https://example.com",
//   "delay": 3000        // wait 3 seconds after page load events
// }`}
//         </pre>
//       </div>

//       <p className="text-gray-700 leading-relaxed mt-2">
//         The range is 0–10,000 ms (0–10 seconds). Start at 2–3 seconds for pages with
//         visible animations. Going above 8 seconds rarely helps further and consumes your
//         120-second request budget, so aim for the minimum that solves the problem.
//       </p>

//       {/* full_page */}
//       <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
//         Problem: Below-the-fold content is missing
//       </h3>
//       <p className="text-gray-700 leading-relaxed">
//         Use <code className="font-mono">full_page: true</code>. This captures the entire
//         scrollable document height rather than just the visible viewport. No custom JS needed
//         to programmatically scroll and stitch.
//       </p>

//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "url": "https://example.com",
//   "full_page": true,
//   "width": 1440         // wider viewport shows desktop layout
// }`}
//         </pre>
//       </div>

//       {/* Combining them */}
//       <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
//         Combining the three parameters
//       </h3>
//       <p className="text-gray-700 leading-relaxed">
//         These parameters compose well. A real-world example — capturing a clean full-page
//         screenshot of a SaaS landing page that has a cookie banner, a live chat widget, and
//         a hero animation that takes 2 seconds to complete:
//       </p>

//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
//   -H "X-API-Key: YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://example.com",
//     "width": 1440,
//     "height": 900,
//     "full_page": true,
//     "delay": 2500,
//     "remove_elements": [
//       "#cookie-consent",
//       "#intercom-container",
//       ".announcement-bar"
//     ],
//     "format": "png"
//   }'`}
//         </pre>
//       </div>

//       <p className="text-gray-700 leading-relaxed">
//         This handles the three most common use cases — element removal, render waiting, and
//         full-page capture — without requiring custom JavaScript.
//       </p>

//       {/* Node.js recipe */}
//       <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Node.js recipe</h3>
//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`const API_KEY = process.env.PIXELPERFECT_API_KEY;
// const BASE    = 'https://api.pixelperfectapi.net/api/v1';

// async function cleanScreenshot(url, options = {}) {
//   const {
//     removeSelectors = [],   // CSS selectors to strip
//     waitMs = 0,             // extra time after load
//     fullPage = false,
//     width = 1280,
//     format = 'png',
//   } = options;

//   const res = await fetch(\`\${BASE}/screenshot\`, {
//     method: 'POST',
//     headers: {
//       'X-API-Key': API_KEY,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       url,
//       width,
//       full_page: fullPage,
//       delay: waitMs,
//       remove_elements: removeSelectors,
//       format,
//     }),
//   });

//   const data = await res.json();
//   return data.screenshot_url;
// }

// // Example: full-page capture, no banners, wait for animations
// const url = await cleanScreenshot('https://example.com', {
//   removeSelectors: ['#cookie-banner', '.chat-widget'],
//   waitMs: 2000,
//   fullPage: true,
//   width: 1440,
// });
// console.log('Screenshot:', url);`}
//         </pre>
//       </div>

//       {/* Python recipe */}
//       <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Python recipe</h3>
//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`import os, requests

// API_KEY = os.environ['PIXELPERFECT_API_KEY']
// BASE    = 'https://api.pixelperfectapi.net/api/v1'
// HEADERS = {'X-API-Key': API_KEY, 'Content-Type': 'application/json'}

// def clean_screenshot(url, remove_selectors=None, wait_ms=0,
//                      full_page=False, width=1280, fmt='png'):
//     payload = {
//         'url': url,
//         'width': width,
//         'full_page': full_page,
//         'delay': wait_ms,
//         'remove_elements': remove_selectors or [],
//         'format': fmt,
//     }
//     res = requests.post(f'{BASE}/screenshot', json=payload, headers=HEADERS)
//     res.raise_for_status()
//     return res.json()['screenshot_url']

// # Example
// screenshot = clean_screenshot(
//     'https://example.com',
//     remove_selectors=['#cookie-banner', '.chat-widget'],
//     wait_ms=2000,
//     full_page=True,
//     width=1440,
// )
// print('Screenshot:', screenshot)`}
//         </pre>
//       </div>

//       {/* What custom JS will look like */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
//         What Custom JavaScript Will Look Like (When It Ships)
//       </h2>
//       <p className="text-gray-700 leading-relaxed">
//         For developers planning ahead: this is the contract we're targeting. Treat it as a
//         design preview, not a guarantee — the final interface may differ slightly when
//         implementation completes.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned interface (subject to change)</h3>
//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`POST /api/v1/screenshot
// {
//   "url": "https://example.com",
//   "custom_js": "document.querySelector('#modal').remove(); window.scrollTo(0, 0);",
//   // ... other params
// }`}
//         </pre>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned behavior</h3>
//       <ul className="space-y-3 text-gray-700">
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>
//             <strong>Tier gate:</strong> Pro and above. Free accounts attempting to use{' '}
//             <code className="font-mono">custom_js</code> will receive a 403 with a clear
//             upgrade message.
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>
//             <strong>Execution timing:</strong> After the page finishes loading (after phase 1/2/3
//             wait strategy), before the <code className="font-mono">delay</code> wait,
//             before the screenshot is taken. You can combine{' '}
//             <code className="font-mono">custom_js</code> with{' '}
//             <code className="font-mono">delay</code> — execute JS, then wait for the result
//             to settle.
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>
//             <strong>Scope:</strong> Browser-side only. The JS runs inside the headless Chromium
//             context (same origin as the page). It cannot access our server, your account, or
//             any other PixelPerfect data.
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>
//             <strong>Length limit:</strong> 10,000 characters max. Enough for a realistic
//             manipulation script; not enough to embed entire libraries.
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>
//             <strong>Error handling:</strong> If your JS throws an exception, the screenshot
//             captures anyway and the response will include a{' '}
//             <code className="font-mono">js_warning</code> field describing the error. The
//             screenshot is never blocked by JS failures.
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>
//             <strong>Timeout:</strong> 5 seconds. Infinite loops and long-running scripts
//             are interrupted — the page is captured at the 5-second mark regardless.
//           </span>
//         </li>
//       </ul>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned request shape</h3>
//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "url":         "https://example.com",
//   "custom_js":   "document.querySelector('.modal').remove();",  // Pro+
//   "delay":       1000,                                          // wait after JS runs
//   "remove_elements": ["#cookie-banner"],                        // still works alongside
//   "full_page":   true,
//   "format":      "png"
// }`}
//         </pre>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned response</h3>
//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "screenshot_url": "https://pub-xxx.r2.dev/screenshots/abc123.png",
//   "format":         "png",
//   "js_warning":     null    // or "ReferenceError: foo is not defined" if JS failed
// }`}
//         </pre>
//       </div>

//       {/* Comparison table */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
//         Today's Parameters vs. Custom JS — Which to Use
//       </h2>
//       <div className="overflow-x-auto my-4">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Problem</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Use today</th>
//               <th className="text-left p-3 font-semibold text-gray-900">With custom JS (future)</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Remove cookie banner</td>
//               <td className="p-3 border-r border-gray-200"><code className="font-mono">remove_elements</code></td>
//               <td className="p-3"><code className="font-mono">document.querySelector('.banner').remove()</code></td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Wait for animation</td>
//               <td className="p-3 border-r border-gray-200"><code className="font-mono">delay: 2000</code></td>
//               <td className="p-3">Same — <code className="font-mono">delay</code> still best</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Capture full page</td>
//               <td className="p-3 border-r border-gray-200"><code className="font-mono">full_page: true</code></td>
//               <td className="p-3">Same — <code className="font-mono">full_page</code> still best</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Click "Accept" button</td>
//               <td className="p-3 border-r border-gray-200"><code className="font-mono">remove_elements</code> on the banner</td>
//               <td className="p-3"><code className="font-mono">document.querySelector('#accept').click()</code></td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Fill a login form</td>
//               <td className="p-3 border-r border-gray-200">Not yet possible</td>
//               <td className="p-3"><code className="font-mono">document.querySelector('#user').value = 'demo'</code></td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Scroll to position</td>
//               <td className="p-3 border-r border-gray-200">Not yet possible</td>
//               <td className="p-3"><code className="font-mono">window.scrollTo(0, 500)</code></td>
//             </tr>
//             <tr>
//               <td className="p-3 border-r border-gray-200">Set localStorage value</td>
//               <td className="p-3 border-r border-gray-200">Not yet possible</td>
//               <td className="p-3"><code className="font-mono">localStorage.setItem('accepted', '1')</code></td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <p className="text-gray-700 leading-relaxed mt-3">
//         The table shows that <code className="font-mono">remove_elements</code> and{' '}
//         <code className="font-mono">delay</code> already cover the most common cases. Custom
//         JS adds value for interactions — clicking, form filling, scrolling, and setting
//         browser storage — which are genuinely not possible today.
//       </p>

//       {/* When this article becomes fully applicable */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
//         When This Article Becomes Fully Applicable
//       </h2>
//       <p className="text-gray-700 leading-relaxed">
//         Once custom JS ships (our roadmap Phase 1), this article will expand to cover the
//         real implementation: the exact request format, tier gate behavior, error handling,
//         security boundaries, and debugging tips. For now, the working alternatives above
//         handle the majority of real-world use cases.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         If the alternatives don't cover your specific case, email us at{' '}
//         <a href="mailto:onetechly@gmail.com?subject=Custom JS use case"
//           className="text-blue-600 hover:underline">onetechly@gmail.com</a> with a
//         description of what you're trying to do. Real use cases directly influence what we
//         prioritize in Phase 1, so this is one of the most useful things you can do to help
//         get the feature shipped faster.
//       </p>

//       {/* Next Steps */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>
//       <div className="grid grid-cols-1 gap-4">
//         <a
//           href="/help/article/screenshot-parameters-explained"
//           className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-blue-900 mb-1">Screenshot Parameters Explained</h4>
//             <p className="text-sm text-blue-700 mb-0">
//               Full reference for <code>remove_elements</code>, <code>delay</code>,{' '}
//               <code>full_page</code>, and all other active parameters
//             </p>
//           </div>
//           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/api-timeout-errors"
//           className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-green-900 mb-1">API Timeout Errors</h4>
//             <p className="text-sm text-green-700 mb-0">
//               When pages don't load — how the three-phase strategy works and how to tune{' '}
//               <code>delay</code> for your use case
//             </p>
//           </div>
//           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/contact?subject=feature-request-javascript-execution"
//           className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-purple-900 mb-1">Get notified when custom JS ships</h4>
//             <p className="text-sm text-purple-700 mb-0">
//               We'll email you on launch day — and your use case helps shape the implementation
//             </p>
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
//             <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're not blocked 🧩</h4>
//             <p className="text-green-800 text-sm mb-0">
//               Custom JavaScript execution is coming in Phase 1 of our roadmap, but
//               <code className="font-mono"> remove_elements</code>,{' '}
//               <code className="font-mono">delay</code>, and{' '}
//               <code className="font-mono">full_page</code> — all available today on every
//               tier — cover the majority of real-world use cases. When custom JS ships, your
//               existing integration keeps working — no rewrites required.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JavaScriptExecutionGuide;

// // ===== END OF JavaScriptExecutionGuide.jsx =====

