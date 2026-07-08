// ========================================
// GUIDE: Custom JavaScript Execution
// ========================================
// File: frontend/src/guides/JavaScriptExecutionGuide.jsx
// Author: OneTechly
// Updated: May 2026 — Phase 1 full content
//
// ✅ FIX (July 2026 — Mobile Best Practices Card Overflow):
//   Root cause: flex items without min-w-0 can expand beyond their parent.
//   The body text in Best Practices cards contains code-like strings
//   (document.querySelector(...)?.remove()) that have no natural break
//   points — on narrow mobile viewports they overflow to the right.
//   Fix: Added min-w-0 to the text container div and break-words to the
//   body text. Added overflow-x-hidden to the article wrapper to act as
//   a safety net for any other long strings in the article.
//
// Tier: Pro+  |  Phase: 1 (shipped May 2026)
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
    info:    { wrapper: 'bg-blue-50 border-blue-300',     icon: '💡', titleColor: 'text-blue-800',   bodyColor: 'text-blue-700'   },
    warning: { wrapper: 'bg-amber-50 border-amber-300',   icon: '⚠️', titleColor: 'text-amber-800',  bodyColor: 'text-amber-700'  },
    success: { wrapper: 'bg-green-50 border-green-300',   icon: '✅', titleColor: 'text-green-800',  bodyColor: 'text-green-700'  },
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
      description: "Some banners use a fixed ID — check the site's source to confirm.",
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
    // ✅ FIX: Added overflow-x-hidden to prevent any long string from
    // breaking out of the article container on narrow mobile viewports.
    <article className="prose-custom max-w-none overflow-x-hidden">
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
          { label: 'Tier',      value: 'Pro+'       },
          { label: 'Max length',value: '10,000 chars'},
          { label: 'On error',  value: 'Non-fatal ✓' },
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
        Pass your JavaScript as a string in the{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">custom_js</code> field.
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
          { n: 1, text: 'Page navigated and loaded (networkidle)'           },
          { n: 2, text: 'wait_for_selector resolved (if provided)'          },
          { n: 3, text: 'remove_elements applied (CSS selectors hidden)'    },
          { n: 4, text: 'custom_js executed ← your script runs here'       },
          { n: 5, text: '500ms settle wait (lets JS effects render)'        },
          { n: 6, text: 'User delay applied (if delay > 0)'                 },
          { n: 7, text: 'Screenshot captured'                               },
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
        Use{' '}
        <code className="text-xs bg-purple-100 px-1 rounded">wait_for_selector</code>{' '}
        to wait for a dynamically loaded element, then use{' '}
        <code className="text-xs bg-purple-100 px-1 rounded">custom_js</code>{' '}
        to manipulate it. The selector is guaranteed to be present when your script runs.
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

      {/* js_warning */}
      <SectionHeading>The js_warning response field</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Every screenshot response includes a{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">js_warning</code> field.
        It is{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">null</code>{' '}
        when your script executed cleanly, and a string describing the error otherwise.
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
        In automated pipelines, add a check for a non-null{' '}
        <code className="text-xs bg-amber-100 px-1 rounded">js_warning</code>.
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
              ['Execution timeout', '30 seconds',        'Part of overall Playwright timeout'],
              ['Errors',           'Non-fatal',          'Capture succeeds; error in js_warning'],
              ['Access',           'Full DOM',           'window, document, fetch — no sandbox restrictions'],
              ['Async/await',      'Supported',          'Top-level await works inside the script'],
              ['External requests','Allowed',            'fetch() and XMLHttpRequest work normally'],
            ].map(([constraint, value, notes]) => (
              <tr key={constraint} className="border-b border-gray-100 last:border-0">
                <td className="p-3 font-mono text-xs text-gray-800 break-all">{constraint}</td>
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
            body: "Always write document.querySelector('...')?.remove() rather than document.querySelector('...').remove(). If the element doesn't exist, optional chaining silently skips rather than throwing a ReferenceError.",
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
            body: "Log or alert on non-null js_warning values. A silent JS failure means your manipulation didn't run — the screenshot may not look as intended.",
          },
        ].map(({ icon, title, body }) => (
          <div key={title} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl flex-shrink-0">{icon}</div>
            {/*
              ✅ FIX: Added min-w-0 to the text container.
              Without min-w-0, a flex child can grow wider than its parent,
              causing the card to overflow the screen on mobile.
              break-words on the body ensures long code-like strings
              (document.querySelector etc.) wrap at any character.
            */}
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 mb-1">{title}</div>
              <div className="text-sm text-gray-600 leading-relaxed break-words">{body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tier note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
        <div className="text-blue-800 font-semibold mb-1">⚡ Pro tier feature</div>
        <p className="text-blue-700 text-sm">
          Custom JavaScript execution is available on Pro, Business, and Premium plans.
          Free tier requests that include{' '}
          <code className="bg-blue-100 px-1 rounded">custom_js</code> receive HTTP 403.
        </p>
      </div>
    </article>
  );
}

// ===== END OF JavaScriptExecutionGuide.jsx =====

// // ========================================
// // GUIDE: Custom JavaScript Execution
// // ========================================
// // File: frontend/src/guides/JavaScriptExecutionGuide.jsx
// // Author: OneTechly
// // Updated: May 2026 — Phase 1 full content (was stub)
// //
// // Tier: Pro+
// // Phase: 1 (shipped May 2026)
// // ========================================

// import React, { useState } from 'react';

// const TierBadge = ({ tier }) => {
//   const styles = {
//     pro:      'bg-blue-100 text-blue-800 border border-blue-300',
//     business: 'bg-purple-100 text-purple-800 border border-purple-300',
//     premium:  'bg-green-100 text-green-800 border border-green-300',
//   };
//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[tier] || styles.pro}`}>
//       {tier.charAt(0).toUpperCase() + tier.slice(1)}+
//     </span>
//   );
// };

// const CalloutBox = ({ type = 'info', title, children }) => {
//   const styles = {
//     info:    { wrapper: 'bg-blue-50 border-blue-300',   icon: '💡', titleColor: 'text-blue-800',  bodyColor: 'text-blue-700'  },
//     warning: { wrapper: 'bg-amber-50 border-amber-300', icon: '⚠️', titleColor: 'text-amber-800', bodyColor: 'text-amber-700' },
//     success: { wrapper: 'bg-green-50 border-green-300', icon: '✅', titleColor: 'text-green-800', bodyColor: 'text-green-700' },
//     tip:     { wrapper: 'bg-purple-50 border-purple-300', icon: '⚡', titleColor: 'text-purple-800', bodyColor: 'text-purple-700' },
//   };
//   const s = styles[type] || styles.info;
//   return (
//     <div className={`border-l-4 rounded-r-lg p-4 mb-6 ${s.wrapper}`}>
//       {title && (
//         <div className={`font-semibold mb-1 flex items-center gap-2 ${s.titleColor}`}>
//           <span>{s.icon}</span> {title}
//         </div>
//       )}
//       <div className={`text-sm leading-relaxed ${s.bodyColor}`}>{children}</div>
//     </div>
//   );
// };

// const CodeBlock = ({ code, language = 'javascript', label }) => (
//   <div className="mb-6">
//     {label && (
//       <div className="bg-gray-700 text-gray-300 text-xs font-mono px-4 py-2 rounded-t-lg">
//         {label}
//       </div>
//     )}
//     <pre className={`bg-gray-900 text-green-400 text-sm font-mono p-4 overflow-x-auto leading-relaxed ${label ? 'rounded-b-lg' : 'rounded-lg'}`}>
//       <code>{code.trim()}</code>
//     </pre>
//   </div>
// );

// const SectionHeading = ({ children }) => (
//   <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
//     {children}
//   </h2>
// );

// const SubHeading = ({ children }) => (
//   <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
// );

// // Interactive example toggler
// const ExampleTabs = ({ examples }) => {
//   const [active, setActive] = useState(0);
//   return (
//     <div className="mb-6">
//       <div className="flex flex-wrap gap-2 mb-3">
//         {examples.map((ex, i) => (
//           <button
//             key={i}
//             onClick={() => setActive(i)}
//             className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//               active === i
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//             }`}
//           >
//             {ex.label}
//           </button>
//         ))}
//       </div>
//       <CodeBlock code={examples[active].code} label={examples[active].label} />
//       {examples[active].description && (
//         <p className="text-sm text-gray-600 -mt-3 mb-4">{examples[active].description}</p>
//       )}
//     </div>
//   );
// };

// export default function JavaScriptExecutionGuide() {
//   const cookieBannerExamples = [
//     {
//       label: 'Remove by class',
//       code: `// Remove by class name
// document.querySelector('.cookie-banner')?.remove();
// document.querySelector('.cookie-notice')?.remove();
// document.querySelector('.gdpr-banner')?.remove();`,
//       description: 'Works for most cookie banners that use a predictable class name.',
//     },
//     {
//       label: 'Remove by ID',
//       code: `// Remove by ID
// document.getElementById('cookie-popup')?.remove();
// document.getElementById('consent-banner')?.remove();`,
//       description: 'Some banners use a fixed ID — check the site\'s source to confirm.',
//     },
//     {
//       label: 'Click accept then remove',
//       code: `// Click "Accept" first, then remove the banner
// const acceptBtn = document.querySelector(
//   '[aria-label="Accept cookies"], .accept-cookies, #accept-all'
// );
// if (acceptBtn) {
//   acceptBtn.click();
//   // Give the click handler 300ms to run, then clean up
//   await new Promise(r => setTimeout(r, 300));
//   document.querySelector('.cookie-banner')?.remove();
// }`,
//       description: 'Useful when the banner re-appears if dismissed without accepting.',
//     },
//     {
//       label: 'Hide everything matching',
//       code: `// Hide all matching elements (non-destructive)
// const selectors = [
//   '.cookie-banner', '.cookie-notice', '.gdpr-banner',
//   '[class*="cookie"]', '[id*="cookie"]', '[id*="consent"]'
// ];
// selectors.forEach(sel => {
//   document.querySelectorAll(sel).forEach(el => {
//     el.style.setProperty('display', 'none', 'important');
//   });
// });`,
//       description: 'Aggressive approach that catches many banner patterns at once.',
//     },
//   ];

//   const manipulationExamples = [
//     {
//       label: 'Change background',
//       code: `// Set a clean white background
// document.body.style.backgroundColor = '#ffffff';
// document.documentElement.style.backgroundColor = '#ffffff';`,
//       description: 'Useful when a page has a transparent or unexpected background colour.',
//     },
//     {
//       label: 'Inject a watermark',
//       code: `// Add a watermark overlay
// const wm = document.createElement('div');
// wm.style.cssText = \`
//   position: fixed; bottom: 16px; right: 16px;
//   background: rgba(0,0,0,0.6); color: white;
//   padding: 6px 12px; border-radius: 4px;
//   font-family: sans-serif; font-size: 13px;
//   z-index: 99999; pointer-events: none;
// \`;
// wm.textContent = 'Captured by PixelPerfect';
// document.body.appendChild(wm);`,
//       description: 'Brand your screenshots with a custom watermark.',
//     },
//     {
//       label: 'Show hidden element',
//       code: `// Force a hidden element to be visible
// const el = document.querySelector('#hidden-section');
// if (el) {
//   el.style.removeProperty('display');
//   el.style.setProperty('visibility', 'visible', 'important');
//   el.style.setProperty('opacity', '1', 'important');
// }`,
//       description: 'Reveal an element that is hidden by CSS before capturing.',
//     },
//     {
//       label: 'Scroll to position',
//       code: `// Scroll to bottom before capture (use with full_page: false)
// window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });

// // Or scroll to a specific element
// document.querySelector('#pricing-section')?.scrollIntoView();`,
//       description: 'Position the viewport before capture. Pair with full_page: false.',
//     },
//   ];

//   return (
//     <article className="prose-custom max-w-none">
//       {/* Hero */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white">
//         <div className="flex items-start justify-between mb-3">
//           <div className="text-3xl">{'</>'}</div>
//           <TierBadge tier="pro" />
//         </div>
//         <h1 className="text-2xl font-bold mb-2">Custom JavaScript Execution</h1>
//         <p className="text-blue-100 text-sm leading-relaxed">
//           Execute arbitrary JavaScript inside the page before the screenshot is taken.
//           Remove banners, inject content, trigger interactions, and reshape any page
//           exactly as you need it captured.
//         </p>
//       </div>

//       {/* Quick reference */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
//         {[
//           { label: 'Parameter', value: 'custom_js' },
//           { label: 'Tier', value: 'Pro+' },
//           { label: 'Max length', value: '10,000 chars' },
//           { label: 'On error', value: 'Non-fatal ✓' },
//         ].map(({ label, value }) => (
//           <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
//             <div className="text-xs text-gray-500 mb-1">{label}</div>
//             <div className="font-semibold text-gray-900 text-sm">{value}</div>
//           </div>
//         ))}
//       </div>

//       <CalloutBox type="success" title="Option-C error handling">
//         If your JavaScript throws a syntax error or runtime exception, the screenshot
//         still captures successfully. The error is returned in the{' '}
//         <code className="text-xs bg-green-100 px-1 rounded">js_warning</code> field
//         of the response — your workflow is never blocked by a JS error.
//       </CalloutBox>

//       {/* Basic usage */}
//       <SectionHeading>Basic usage</SectionHeading>
//       <p className="text-gray-700 mb-4 leading-relaxed">
//         Pass your JavaScript as a string in the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">custom_js</code> field.
//         It executes after the page loads, before the screenshot is taken.
//       </p>

//       <CodeBlock
//         label="curl"
//         code={`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
//   -H "Authorization: Bearer YOUR_TOKEN" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://example.com",
//     "custom_js": "document.body.style.backgroundColor = \\"#f0f9ff\\";"
//   }'`}
//       />

//       <CodeBlock
//         label="Node.js"
//         code={`const response = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot/', {
//   method: 'POST',
//   headers: {
//     'Authorization': 'Bearer YOUR_TOKEN',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     url: 'https://example.com',
//     custom_js: \`
//       // Remove cookie banner
//       document.querySelector('.cookie-banner')?.remove();

//       // Set clean background
//       document.body.style.backgroundColor = '#ffffff';
//     \`,
//   }),
// });

// const data = await response.json();
// console.log(data.screenshot_url);

// // Check for JS errors (capture still succeeded)
// if (data.js_warning) {
//   console.warn('JS warning:', data.js_warning);
// }`}
//       />

//       <CodeBlock
//         label="Python"
//         code={`import requests

// response = requests.post(
//     'https://api.pixelperfectapi.net/api/v1/screenshot/',
//     headers={'Authorization': 'Bearer YOUR_TOKEN'},
//     json={
//         'url': 'https://example.com',
//         'custom_js': '''
//             document.querySelector('.cookie-banner')?.remove();
//             document.body.style.backgroundColor = '#ffffff';
//         ''',
//     }
// )

// data = response.json()
// print(data['screenshot_url'])

// # Non-fatal — check for warnings even on success
// if data.get('js_warning'):
//     print('JS warning:', data['js_warning'])`}
//       />

//       {/* Execution order */}
//       <SectionHeading>Execution order</SectionHeading>
//       <p className="text-gray-700 mb-4 leading-relaxed">
//         Understanding when your script runs helps you write more effective automation:
//       </p>
//       <ol className="space-y-2 mb-6">
//         {[
//           { n: 1, text: 'Page navigated and loaded (networkidle)' },
//           { n: 2, text: 'wait_for_selector resolved (if provided)' },
//           { n: 3, text: 'remove_elements applied (CSS selectors hidden)' },
//           { n: 4, text: 'custom_js executed ← your script runs here' },
//           { n: 5, text: '500ms settle wait (lets JS effects render)' },
//           { n: 6, text: 'User delay applied (if delay > 0)' },
//           { n: 7, text: 'Screenshot captured' },
//         ].map(({ n, text }) => (
//           <li key={n} className={`flex items-start gap-3 p-3 rounded-lg ${n === 4 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
//             <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
//               n === 4 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
//             }`}>{n}</span>
//             <span className={`text-sm ${n === 4 ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>{text}</span>
//           </li>
//         ))}
//       </ol>

//       <CalloutBox type="tip" title="Combine with wait_for_selector">
//         Use <code className="text-xs bg-purple-100 px-1 rounded">wait_for_selector</code> to
//         wait for a dynamically loaded element, then use <code className="text-xs bg-purple-100 px-1 rounded">custom_js</code> to
//         manipulate it. The selector is guaranteed to be present when your script runs.
//       </CalloutBox>

//       {/* Common use cases */}
//       <SectionHeading>Common use cases</SectionHeading>

//       <SubHeading>Remove cookie banners and popups</SubHeading>
//       <p className="text-gray-700 mb-4 leading-relaxed">
//         Cookie consent banners are the most common use case. Pick the approach that matches your target site:
//       </p>
//       <ExampleTabs examples={cookieBannerExamples} />

//       <SubHeading>Page manipulation</SubHeading>
//       <p className="text-gray-700 mb-4 leading-relaxed">
//         Adjust page appearance, inject overlays, or control scroll position before capture:
//       </p>
//       <ExampleTabs examples={manipulationExamples} />

//       <SubHeading>Simulate user interactions</SubHeading>
//       <CodeBlock
//         label="javascript"
//         code={`// Open a dropdown menu before capturing
// const menuBtn = document.querySelector('[aria-haspopup="true"]');
// if (menuBtn) {
//   menuBtn.click();
//   await new Promise(r => setTimeout(r, 400));
// }

// // Expand an accordion section
// const accordion = document.querySelector('.accordion-header');
// if (accordion && accordion.getAttribute('aria-expanded') === 'false') {
//   accordion.click();
//   await new Promise(r => setTimeout(r, 300));
// }

// // Fill a form field (visible in screenshot)
// const input = document.querySelector('#search-input');
// if (input) {
//   input.value = 'PixelPerfect';
//   input.dispatchEvent(new Event('input', { bubbles: true }));
// }`}
//       />

//       <SubHeading>Remove dynamic noise</SubHeading>
//       <CodeBlock
//         label="javascript"
//         code={`// Freeze animated elements for a clean capture
// document.querySelectorAll('[class*="animate"], [class*="transition"]')
//   .forEach(el => {
//     el.style.animationPlayState = 'paused';
//     el.style.transitionDuration = '0s';
//   });

// // Remove chat widgets (Intercom, Zendesk, etc.)
// ['#intercom-container', '#launcher', '.zopim', '[id^="hubspot"]']
//   .forEach(sel => document.querySelector(sel)?.remove());

// // Hide live chat bubble
// document.querySelector('iframe[title*="chat"]')?.remove();`}
//       />

//       {/* The js_warning field */}
//       <SectionHeading>The js_warning response field</SectionHeading>
//       <p className="text-gray-700 mb-4 leading-relaxed">
//         Every screenshot response includes a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">js_warning</code> field.
//         It is <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">null</code> when
//         your script executed cleanly, and a string describing the error otherwise.
//         The screenshot is captured either way.
//       </p>

//       <CodeBlock
//         label="Successful response"
//         code={`{
//   "screenshot_url": "https://...",
//   "screenshot_id": "abc123",
//   "js_warning": null,
//   "format": "png",
//   "size_bytes": 142857
// }`}
//       />

//       <CodeBlock
//         label="Response with JS error (screenshot still captured)"
//         code={`{
//   "screenshot_url": "https://...",
//   "screenshot_id": "abc123",
//   "js_warning": "Page.evaluate: SyntaxError: Unexpected token '}' ...",
//   "format": "png",
//   "size_bytes": 138204
// }`}
//       />

//       <CalloutBox type="warning" title="Always check js_warning in production">
//         In automated pipelines, add a check for a non-null <code className="text-xs bg-amber-100 px-1 rounded">js_warning</code>.
//         The screenshot captures successfully regardless, but the warning tells you your
//         script didn't run as intended — which may affect the visual output.
//       </CalloutBox>

//       {/* Limits */}
//       <SectionHeading>Limits and constraints</SectionHeading>
//       <div className="overflow-x-auto mb-6">
//         <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Constraint</th>
//               <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Value</th>
//               <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Notes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[
//               ['Max script length', '10,000 characters', 'Pydantic validation — 422 if exceeded'],
//               ['Execution timeout', '30 seconds', 'Part of overall Playwright timeout'],
//               ['Errors', 'Non-fatal', 'Capture succeeds; error in js_warning'],
//               ['Access', 'Full DOM', 'window, document, fetch — no sandbox restrictions'],
//               ['Async/await', 'Supported', 'Top-level await works inside the script'],
//               ['External requests', 'Allowed', 'fetch() and XMLHttpRequest work normally'],
//             ].map(([constraint, value, notes]) => (
//               <tr key={constraint} className="border-b border-gray-100 last:border-0">
//                 <td className="p-3 font-mono text-xs text-gray-800">{constraint}</td>
//                 <td className="p-3 font-semibold text-gray-900">{value}</td>
//                 <td className="p-3 text-gray-600">{notes}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Best practices */}
//       <SectionHeading>Best practices</SectionHeading>
//       <div className="space-y-3 mb-8">
//         {[
//           {
//             icon: '🛡️',
//             title: 'Use optional chaining',
//             body: 'Always write document.querySelector(\'...\')?.remove() rather than document.querySelector(\'...\').remove(). If the element doesn\'t exist, optional chaining silently skips rather than throwing a ReferenceError.',
//           },
//           {
//             icon: '⏱️',
//             title: 'Account for render time',
//             body: 'CSS transitions and JavaScript animations may still be mid-frame when your script finishes. The built-in 500ms settle wait usually covers this, but you can add delay: 1 for heavier pages.',
//           },
//           {
//             icon: '🔍',
//             title: 'Test selectors in DevTools first',
//             body: 'Open your target site, press F12, paste your selector into the console, and confirm it returns the right element before adding it to your API call.',
//           },
//           {
//             icon: '📏',
//             title: 'Keep scripts focused',
//             body: 'One or two operations per capture. Long scripts are harder to debug and consume more of the timeout budget.',
//           },
//           {
//             icon: '🔁',
//             title: 'Handle js_warning in automation',
//             body: 'Log or alert on non-null js_warning values. A silent JS failure means your manipulation didn\'t run — the screenshot may not look as intended.',
//           },
//         ].map(({ icon, title, body }) => (
//           <div key={title} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="text-2xl flex-shrink-0">{icon}</div>
//             <div>
//               <div className="font-semibold text-gray-900 mb-1">{title}</div>
//               <div className="text-sm text-gray-600 leading-relaxed">{body}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Tier note */}
//       <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
//         <div className="text-blue-800 font-semibold mb-1">⚡ Pro tier feature</div>
//         <p className="text-blue-700 text-sm">
//           Custom JavaScript execution is available on Pro, Business, and Premium plans.
//           Free tier requests that include <code className="bg-blue-100 px-1 rounded">custom_js</code> receive HTTP 403.
//         </p>
//       </div>
//     </article>
//   );
// }

// // ===== END OF JavaScriptExecutionGuide.jsx =====

