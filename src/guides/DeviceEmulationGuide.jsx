// ========================================
// GUIDE: Device Emulation
// ========================================
// File: frontend/src/guides/DeviceEmulationGuide.jsx
// Author: OneTechly
// Created: May 2026 — Phase 1
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

// Device preset data — mirrors SUPPORTED_DEVICES in screenshot_service.py
const DEVICES = [
  {
    group: 'iPhone',
    devices: [
      { key: 'iphone_13',         name: 'iPhone 13',          viewport: '390×844',   dpr: '3×',    ua: 'Safari/iOS',     emoji: '📱' },
      { key: 'iphone_13_pro_max', name: 'iPhone 13 Pro Max',  viewport: '428×926',   dpr: '3×',    ua: 'Safari/iOS',     emoji: '📱' },
      { key: 'iphone_se',         name: 'iPhone SE',          viewport: '375×667',   dpr: '2×',    ua: 'Safari/iOS',     emoji: '📱' },
    ],
  },
  {
    group: 'Android',
    devices: [
      { key: 'pixel_5',           name: 'Google Pixel 5',     viewport: '393×851',   dpr: '2.75×', ua: 'Chrome/Android', emoji: '📱' },
      { key: 'pixel_7',           name: 'Google Pixel 7',     viewport: '412×915',   dpr: '2.625×',ua: 'Chrome/Android', emoji: '📱' },
      { key: 'galaxy_s9',         name: 'Samsung Galaxy S9+', viewport: '320×658',   dpr: '4.5×',  ua: 'Chrome/Android', emoji: '📱' },
    ],
  },
  {
    group: 'Tablet',
    devices: [
      { key: 'ipad_pro',          name: 'iPad Pro 11"',       viewport: '1024×1366', dpr: '2×',    ua: 'Safari/iPadOS',  emoji: '📟' },
      { key: 'ipad_mini',         name: 'iPad Mini',          viewport: '768×1024',  dpr: '2×',    ua: 'Safari/iPadOS',  emoji: '📟' },
      { key: 'galaxy_tab_s4',     name: 'Galaxy Tab S4',      viewport: '712×1138',  dpr: '2.25×', ua: 'Chrome/Android', emoji: '📟' },
    ],
  },
];

export default function DeviceEmulationGuide() {
  const [selectedDevice, setSelectedDevice] = useState('iphone_13');

  const allDevices = DEVICES.flatMap(g => g.devices);
  const activeDevice = allDevices.find(d => d.key === selectedDevice);

  return (
    <article className="prose-custom max-w-none">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">📱</div>
          <TierBadge tier="pro" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Device Emulation Guide</h1>
        <p className="text-indigo-100 text-sm leading-relaxed">
          Capture screenshots that look exactly as they would on real mobile phones and tablets.
          9 curated device presets with accurate viewport sizes, device pixel ratios,
          user-agent strings, and touch support — all powered by Playwright's device registry.
        </p>
      </div>

      {/* Quick reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Parameter', value: 'device' },
          { label: 'Tier', value: 'Pro+' },
          { label: 'Presets', value: '9 devices' },
          { label: 'Override', value: 'width/height' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="font-semibold text-gray-900 text-sm">{value}</div>
          </div>
        ))}
      </div>

      <CalloutBox type="info" title="What device emulation actually sets">
        When you specify a device preset, PixelPerfect sets four things simultaneously inside
        the Playwright browser context: <strong>viewport size</strong> (width × height),{' '}
        <strong>device pixel ratio</strong> (DPR — affects retina rendering),{' '}
        <strong>user-agent string</strong> (tells sites what browser/OS is in use), and{' '}
        <strong>touch support flags</strong>. This is the same emulation Chrome DevTools uses
        when you select a device in its mobile emulator.
      </CalloutBox>

      {/* Basic usage */}
      <SectionHeading>Basic usage</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Pass the device key as a string in the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">device</code> field.
        When set, it overrides the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">width</code> and{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">height</code> fields entirely.
      </p>

      <CodeBlock
        label="curl"
        code={`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "device": "iphone_13"
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
    url: 'https://your-site.com',
    device: 'iphone_13',
    full_page: true,
  }),
});

const data = await response.json();
console.log(data.screenshot_url);
console.log(data.device_used);   // → "iphone_13"`}
      />

      <CodeBlock
        label="Python"
        code={`import requests

response = requests.post(
    'https://api.pixelperfectapi.net/api/v1/screenshot/',
    headers={'Authorization': 'Bearer YOUR_TOKEN'},
    json={
        'url': 'https://your-site.com',
        'device': 'pixel_5',
        'full_page': True,
    }
)

data = response.json()
print(data['screenshot_url'])
print(data['device_used'])   # → "pixel_5"`}
      />

      {/* Device browser */}
      <SectionHeading>Device reference</SectionHeading>
      <p className="text-gray-700 mb-4">
        Select a device below to see its exact specifications:
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {allDevices.map(d => (
          <button
            key={d.key}
            onClick={() => setSelectedDevice(d.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedDevice === d.key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {d.emoji} {d.name}
          </button>
        ))}
      </div>

      {activeDevice && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{activeDevice.emoji}</div>
            <div>
              <div className="font-bold text-gray-900">{activeDevice.name}</div>
              <code className="text-xs text-indigo-600 font-mono">device: "{activeDevice.key}"</code>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Viewport', value: activeDevice.viewport },
              { label: 'Device Pixel Ratio', value: activeDevice.dpr },
              { label: 'User Agent', value: activeDevice.ua },
              { label: 'Touch', value: 'Enabled' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="font-semibold text-gray-800 text-sm">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left p-3 font-semibold">Device key</th>
              <th className="text-left p-3 font-semibold">Name</th>
              <th className="text-left p-3 font-semibold">Viewport</th>
              <th className="text-left p-3 font-semibold">DPR</th>
              <th className="text-left p-3 font-semibold">UA</th>
            </tr>
          </thead>
          <tbody>
            {DEVICES.map(group => (
              <React.Fragment key={group.group}>
                <tr className="bg-gray-100">
                  <td colSpan={5} className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {group.group}
                  </td>
                </tr>
                {group.devices.map((d, i) => (
                  <tr key={d.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-mono text-xs text-indigo-700">{d.key}</td>
                    <td className="p-3 text-gray-900">{d.name}</td>
                    <td className="p-3 text-gray-700">{d.viewport}</td>
                    <td className="p-3 text-gray-700">{d.dpr}</td>
                    <td className="p-3 text-gray-600 text-xs">{d.ua}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* List devices endpoint */}
      <SectionHeading>List available devices via API</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        You can fetch the current device list programmatically. Useful for building
        dynamic dropdowns or validating keys before submitting a capture request.
      </p>
      <CodeBlock
        label="curl"
        code={`curl https://api.pixelperfectapi.net/api/v1/screenshot/devices \\
  -H "Authorization: Bearer YOUR_TOKEN"`}
      />
      <CodeBlock
        label="Response"
        code={`{
  "devices": [
    "iphone_13", "iphone_13_pro_max", "iphone_se",
    "pixel_5", "pixel_7",
    "ipad_pro", "ipad_mini",
    "galaxy_s9", "galaxy_tab_s4"
  ],
  "descriptions": {
    "iphone_13": "iPhone 13 (390×844, 3× DPR, Safari UA)",
    "pixel_5":   "Google Pixel 5 (393×851, 2.75× DPR, Chrome UA)",
    ...
  }
}`}
      />

      {/* Combining with other params */}
      <SectionHeading>Combining with other parameters</SectionHeading>

      <SubHeading>Device + dark mode</SubHeading>
      <p className="text-gray-700 mb-3 leading-relaxed">
        Device presets and dark mode work together — the browser context sets{' '}
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">prefers-color-scheme: dark</code>{' '}
        in addition to the device-specific settings.
      </p>
      <CodeBlock
        label="curl"
        code={`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-site.com",
    "device": "iphone_13",
    "dark_mode": true
  }'`}
      />

      <SubHeading>Device + custom JavaScript</SubHeading>
      <p className="text-gray-700 mb-3 leading-relaxed">
        Combine device emulation with custom JavaScript for full control — emulate the
        device and manipulate the page in a single request.
      </p>
      <CodeBlock
        label="Node.js"
        code={`const response = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://your-site.com',
    device: 'iphone_13',
    custom_js: \`
      // Remove cookie banner on mobile
      document.querySelector('.cookie-banner')?.remove();
      // Scroll to hero section
      document.querySelector('.hero')?.scrollIntoView();
    \`,
    wait_for_selector: '.hero',
    full_page: false,
  }),
});`}
      />

      <SubHeading>Device + full page</SubHeading>
      <p className="text-gray-700 mb-3 leading-relaxed">
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">full_page: true</code> captures
        the entire scrollable content of the page, at the device's viewport width. This is
        the most common combination for mobile audits.
      </p>
      <CodeBlock
        label="Python"
        code={`response = requests.post(
    'https://api.pixelperfectapi.net/api/v1/screenshot/',
    headers={'Authorization': 'Bearer YOUR_TOKEN'},
    json={
        'url': 'https://your-site.com',
        'device': 'iphone_13',
        'full_page': True,         # capture entire page at mobile width
        'format': 'png',
    }
)`}
      />

      {/* Important behaviours */}
      <SectionHeading>Important behaviours</SectionHeading>
      <div className="space-y-3 mb-8">
        {[
          {
            icon: '📐',
            title: 'Device overrides width and height',
            body: 'If you send both device and width/height in the same request, the device preset wins. The width and height fields are silently ignored when a device is active.',
          },
          {
            icon: '🌐',
            title: 'User-agent affects site behaviour',
            body: 'Many sites serve different HTML, CSS, or content based on user-agent. With a mobile UA active, you\'ll see the same content a real iPhone or Android user sees — including mobile-specific layouts and app-install banners.',
          },
          {
            icon: '🔤',
            title: 'Unknown keys return HTTP 400',
            body: 'If you pass an unrecognised device key, the API returns HTTP 400 with a message listing all valid options. No screenshot is captured.',
          },
          {
            icon: '🔁',
            title: 'device_used in the response',
            body: 'The response always includes a device_used field. It matches the key you sent, confirming which preset was applied.',
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

      {/* Use cases */}
      <SectionHeading>Common use cases</SectionHeading>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: '🧪',
            title: 'Responsive design QA',
            body: 'Automate visual regression checks across your 9 device targets. Catch layout breakages before users do.',
          },
          {
            icon: '📊',
            title: 'Competitive analysis',
            body: 'Screenshot competitor sites as they appear on mobile — the same content their mobile users see.',
          },
          {
            icon: '📸',
            title: 'App store assets',
            body: 'Capture your web app at exact device resolutions for Play Store and App Store screenshot submissions.',
          },
          {
            icon: '📋',
            title: 'Client reports',
            body: 'Show clients how their site looks on the devices their customers actually use.',
          },
          {
            icon: '🤖',
            title: 'Monitoring',
            body: 'Run scheduled checks to detect mobile-specific rendering regressions on each deployment.',
          },
          {
            icon: '🎨',
            title: 'Design sign-off',
            body: 'Generate a grid of device screenshots for design reviews without needing physical devices.',
          },
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
        <div className="text-indigo-800 font-semibold mb-1">📱 Pro tier feature</div>
        <p className="text-indigo-700 text-sm">
          Device emulation is available on Pro, Business, and Premium plans.
          Free tier requests that include a <code className="bg-indigo-100 px-1 rounded">device</code> field receive HTTP 403.
          Use <code className="bg-indigo-100 px-1 rounded">GET /api/v1/screenshot/devices</code> to fetch
          the current device list — that endpoint is also gated to Pro+.
        </p>
      </div>
    </article>
  );
}

// ===== END OF DeviceEmulationGuide.jsx =====