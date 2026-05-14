// ========================================
// GUIDE: Element Selection & Cropping
// ========================================
// File: frontend/src/guides/ElementSelectionGuide.jsx
// Author: OneTechly
// Created: May 2026 — Phase 2
//
// Tier: Business+
// Phase: 2 (shipped May 2026)
// ========================================

import React, { useState } from 'react';

const TierBadge = ({ tier }) => {
  const styles = {
    pro:      'bg-blue-100 text-blue-800 border border-blue-300',
    business: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    premium:  'bg-green-100 text-green-800 border border-green-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[tier] || styles.business}`}>
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

const CodeBlock = ({ code, label }) => (
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

const SelectorExample = ({ selector, description, works }) => (
  <div className={`flex items-start gap-3 p-3 rounded-lg border mb-2 ${
    works
      ? 'bg-green-50 border-green-200'
      : 'bg-red-50 border-red-200'
  }`}>
    <span className="text-lg flex-shrink-0">{works ? '✅' : '❌'}</span>
    <div>
      <code className={`text-sm font-mono font-semibold ${works ? 'text-green-800' : 'text-red-800'}`}>
        {selector}
      </code>
      <p className={`text-xs mt-0.5 ${works ? 'text-green-700' : 'text-red-700'}`}>
        {description}
      </p>
    </div>
  </div>
);

export default function ElementSelectionGuide() {
  const [activeTab, setActiveTab] = useState('curl');

  const basicExamples = {
    curl: `curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "target_element": "#hero"
  }'`,
    node: `const response = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://your-site.com',
    target_element: '.pricing-table',
    format: 'png',
  }),
});

const data = await response.json();
console.log(data.screenshot_url);
console.log(data.element_selector);  // → ".pricing-table"`,
    python: `import requests

response = requests.post(
    'https://api.pixelperfectapi.net/api/v1/screenshot/',
    headers={'Authorization': 'Bearer YOUR_TOKEN'},
    json={
        'url': 'https://your-site.com',
        'target_element': 'main > article',
        'format': 'png',
    }
)

data = response.json()
print(data['screenshot_url'])
print(data['element_selector'])  # → "main > article"`,
  };

  return (
    <article className="prose-custom max-w-none">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">✂️</div>
          <TierBadge tier="business" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Element Selection & Cropping</h1>
        <p className="text-indigo-100 text-sm leading-relaxed">
          Capture any specific element on a page — a hero section, pricing table, navigation bar,
          product card, or chart — and receive a screenshot cropped precisely to that element's
          bounding box. No manual image editing required.
        </p>
      </div>

      {/* Quick reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Parameter',   value: 'target_element' },
          { label: 'Tier',        value: 'Business+' },
          { label: 'Input',       value: 'CSS selector' },
          { label: 'Not found',   value: 'HTTP 400' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="font-semibold text-gray-900 text-sm">{value}</div>
          </div>
        ))}
      </div>

      <CalloutBox type="success" title="How it works under the hood">
        PixelPerfect captures a full-page PNG of the entire document first, then uses
        the element's <code className="text-xs bg-green-100 px-1 rounded">getBoundingClientRect()</code> to
        resolve its exact position and dimensions in the document. Pillow then crops the
        full-page image to those coordinates — including correct DPR scaling for
        high-resolution device screenshots. The temporary full-page image is deleted
        immediately after cropping.
      </CalloutBox>

      {/* Basic usage */}
      <SectionHeading>Basic usage</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Pass any valid CSS selector as <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">target_element</code>.
        The API returns a screenshot cropped to that element's exact bounding box, plus
        an <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">element_selector</code> field
        in the response confirming which selector was used.
      </p>

      {/* Code tabs */}
      <div className="mb-6">
        <div className="flex gap-2 mb-3">
          {['curl', 'node', 'python'].map(lang => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === lang
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lang === 'node' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
        <CodeBlock code={basicExamples[activeTab]} label={activeTab === 'node' ? 'Node.js' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
      </div>

      {/* Response */}
      <SubHeading>Response</SubHeading>
      <CodeBlock
        label="JSON response"
        code={`{
  "screenshot_url":   "https://pub-xxx.r2.dev/screenshots/1/abc.png",
  "screenshot_id":    "abc123",
  "element_selector": ".pricing-table",
  "js_warning":       null,
  "format":           "png",
  "size_bytes":       48290,
  "width":            1920,
  "height":           1080,
  "created_at":       "2026-05-14T12:00:00"
}`}
      />

      {/* How the crop works */}
      <SectionHeading>How the crop works</SectionHeading>

      <ol className="space-y-3 mb-6">
        {[
          {
            n: 1,
            title: 'Full page captured',
            body: 'A full-page PNG of the entire document is captured first — even elements far below the visible viewport are included.',
          },
          {
            n: 2,
            title: 'Bounding box resolved',
            body: 'The element\'s position and size are read from the live DOM using getBoundingClientRect() plus scroll offsets. This runs after all page manipulation (custom_js, remove_elements, delay).',
          },
          {
            n: 3,
            title: 'DPR scaling applied',
            body: 'CSS pixel coordinates are multiplied by the device pixel ratio so the crop aligns with physical pixels in the screenshot — critical for device presets with DPR > 1.',
          },
          {
            n: 4,
            title: 'Pillow crop + save',
            body: 'The full-page image is cropped to the element\'s bounding box and saved as the final output in your requested format (PNG, JPEG, or WebP).',
          },
          {
            n: 5,
            title: 'Temp file deleted',
            body: 'The temporary full-page PNG is immediately deleted — only the cropped output is stored and returned.',
          },
        ].map(({ n, title, body }) => (
          <li key={n} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
              {n}
            </span>
            <div>
              <div className="font-semibold text-gray-900 mb-1">{title}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{body}</div>
            </div>
          </li>
        ))}
      </ol>

      {/* Selector reference */}
      <SectionHeading>Selector reference</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Any valid CSS selector works. These are the most common patterns:
      </p>

      <SubHeading>Selectors that work well</SubHeading>
      <SelectorExample selector="#hero"              description="ID selector — unique element, most reliable"            works={true} />
      <SelectorExample selector=".pricing-table"     description="Class selector — first matching element is used"        works={true} />
      <SelectorExample selector="main > article"     description="Child combinator — first matching article in main"      works={true} />
      <SelectorExample selector="[data-testid='nav']" description="Attribute selector — great for test-id attributes"    works={true} />
      <SelectorExample selector="header"             description="Element type — first header in the document"           works={true} />
      <SelectorExample selector=".card:first-child"  description="Pseudo-class — first card in a list"                  works={true} />

      <SubHeading className="mt-4">Selectors to avoid</SubHeading>
      <SelectorExample selector="div"               description="Too broad — matches the first div, rarely what you want" works={false} />
      <SelectorExample selector=".hidden-element"   description="Hidden elements have zero size — raises HTTP 400"        works={false} />
      <SelectorExample selector="::before"          description="Pseudo-elements have no DOM presence for getBoundingClientRect" works={false} />

      <CalloutBox type="tip" title="Finding selectors in Chrome DevTools">
        Right-click any element on your target page → Inspect → right-click the highlighted
        element in DevTools → Copy → Copy selector. Test it in the DevTools console with{' '}
        <code className="text-xs bg-purple-100 px-1 rounded">document.querySelector('YOUR_SELECTOR')</code> to
        confirm it matches exactly what you need.
      </CalloutBox>

      {/* Combining with other params */}
      <SectionHeading>Combining with other parameters</SectionHeading>

      <SubHeading>Element selection + custom JavaScript</SubHeading>
      <p className="text-gray-700 mb-3 leading-relaxed">
        Use <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">custom_js</code> to
        manipulate the page before the element is measured. This is powerful for removing
        overlapping elements that would obscure the target.
      </p>
      <CodeBlock
        label="Node.js"
        code={`// Remove a cookie banner that overlaps the hero, then crop to the hero
const response = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot/', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://your-site.com',
    target_element: '#hero',
    custom_js: "document.querySelector('.cookie-banner')?.remove();",
  }),
});`}
      />

      <SubHeading>Element selection + device emulation</SubHeading>
      <p className="text-gray-700 mb-3 leading-relaxed">
        Crop to an element as it appears on a specific device. The bounding box and DPR
        scaling both reflect the device context — you get the mobile layout cropped to the
        element, not the desktop layout.
      </p>
      <CodeBlock
        label="Python"
        code={`# Capture the mobile navigation bar on an iPhone 13
response = requests.post(
    'https://api.pixelperfectapi.net/api/v1/screenshot/',
    headers={'Authorization': 'Bearer YOUR_TOKEN'},
    json={
        'url': 'https://your-site.com',
        'device': 'iphone_13',
        'target_element': 'nav',
    }
)`}
      />

      <SubHeading>Element selection + wait_for_selector</SubHeading>
      <p className="text-gray-700 mb-3 leading-relaxed">
        Wait for a dynamically loaded element to appear before cropping to it. Useful for
        SPAs where the target element renders after the initial page load.
      </p>
      <CodeBlock
        label="curl"
        code={`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-spa.com/dashboard",
    "wait_for_selector": "#chart-container",
    "target_element": "#chart-container"
  }'`}
      />

      <CalloutBox type="info" title="Using the same selector for both wait and crop">
        Setting <code className="text-xs bg-blue-100 px-1 rounded">wait_for_selector</code> and{' '}
        <code className="text-xs bg-blue-100 px-1 rounded">target_element</code> to the same
        value is a common and recommended pattern for dynamic content. The selector wait
        ensures the element exists and is visible before the bounding box is measured.
      </CalloutBox>

      {/* Error handling */}
      <SectionHeading>Error handling</SectionHeading>

      <div className="space-y-4 mb-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <span>HTTP 400</span>
            <code className="text-xs font-mono bg-red-100 px-2 py-0.5 rounded">Element not found</code>
          </div>
          <p className="text-sm text-red-700 mb-2">
            The selector matched no element on the page at capture time.
          </p>
          <p className="text-xs text-red-600 font-medium">Fix: verify the selector in DevTools, or use <code className="bg-red-100 px-1 rounded">wait_for_selector</code> if the element loads dynamically.</p>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <span>HTTP 400</span>
            <code className="text-xs font-mono bg-red-100 px-2 py-0.5 rounded">Element has zero size</code>
          </div>
          <p className="text-sm text-red-700 mb-2">
            The selector matched an element, but it has no width or height (hidden via CSS, collapsed, or off-screen).
          </p>
          <p className="text-xs text-red-600 font-medium">Fix: use <code className="bg-red-100 px-1 rounded">custom_js</code> to make the element visible, or choose a different selector.</p>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <span>HTTP 400</span>
            <code className="text-xs font-mono bg-red-100 px-2 py-0.5 rounded">Bounding box outside image</code>
          </div>
          <p className="text-sm text-red-700 mb-2">
            The element's position lies entirely outside the captured image dimensions.
          </p>
          <p className="text-xs text-red-600 font-medium">Fix: this is rare and indicates an extreme layout issue. Try scrolling to the element first via <code className="bg-red-100 px-1 rounded">custom_js</code>.</p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <span>HTTP 403</span>
            <code className="text-xs font-mono bg-amber-100 px-2 py-0.5 rounded">Business tier required</code>
          </div>
          <p className="text-sm text-amber-700">
            The <code className="bg-amber-100 px-1 rounded">target_element</code> parameter is gated to Business and Premium tiers.
            Free and Pro requests that include this parameter receive HTTP 403.
          </p>
        </div>
      </div>

      {/* Format support */}
      <SectionHeading>Format support</SectionHeading>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Format</th>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Supported</th>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['PNG',  '✅ Yes', 'Default. Lossless, full alpha channel preserved'],
              ['JPEG', '✅ Yes', 'Alpha channel stripped (JPEG has no transparency)'],
              ['WebP', '✅ Yes', 'Best compression for photographs and mixed content'],
              ['PDF',  '⚠️ Fallback to PNG', 'PDF from a cropped region is not well-defined — API falls back to PNG automatically'],
            ].map(([fmt, support, notes]) => (
              <tr key={fmt} className="border-b border-gray-100 last:border-0">
                <td className="p-3 font-mono text-xs text-gray-800">{fmt}</td>
                <td className="p-3 font-semibold text-gray-900">{support}</td>
                <td className="p-3 text-gray-600">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Use cases */}
      <SectionHeading>Common use cases</SectionHeading>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { icon: '💲', title: 'Pricing tables',        body: 'Capture just the pricing section for comparison pages or marketing assets.' },
          { icon: '📊', title: 'Charts & dashboards',   body: 'Extract individual charts from analytics dashboards for reports and Slack updates.' },
          { icon: '🛍️', title: 'Product cards',         body: 'Capture individual product cards at consistent dimensions for catalogues.' },
          { icon: '🧭', title: 'Navigation bars',       body: 'Screenshot navbars across device sizes for responsive design audits.' },
          { icon: '🖼️', title: 'Hero sections',         body: 'Generate OG images and social preview cards from the page hero.' },
          { icon: '🏷️', title: 'Testimonial blocks',   body: 'Capture individual testimonials or review cards for social proof assets.' },
          { icon: '📋', title: 'Forms',                 body: 'Document form states (empty, filled, error) for QA and compliance records.' },
          { icon: '🔔', title: 'Notification banners',  body: 'Screenshot cookie consent banners or alert bars before removing them.' },
        ].map(({ icon, title, body }) => (
          <div key={title} className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{icon}</span>
              <span className="font-semibold text-gray-900">{title}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Tier note */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center">
        <div className="text-indigo-800 font-semibold mb-1">🏢 Business tier feature</div>
        <p className="text-indigo-700 text-sm">
          Element selection is available on Business and Premium plans.
          The <code className="bg-indigo-100 px-1 rounded">target_element</code> parameter
          is silently rejected with HTTP 403 for Free and Pro accounts.
          Combine it with Custom JavaScript (Pro+) and Device Emulation (Pro+)
          for the most powerful element capture workflow.
        </p>
      </div>
    </article>
  );
}

// ===== END OF ElementSelectionGuide.jsx =====