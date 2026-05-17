// ========================================
// FEATURES PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/Features.jsx
// Author: OneTechly
// Updated: May 2026 — Phase 1/2/3 feature alignment
//
// ✅ UPDATE (May 2026): Aligned with shipped Phase 1, 2, and 3 features.
//
//    Phase 1 (shipped — Pro+):
//      - Custom JavaScript Execution   → Pro+  (was "Coming Soon")
//      - Device Emulation              → Pro+  (new, was not listed)
//      - Wait for Selector             → Pro+  (new, was not listed)
//
//    Phase 2 (shipped — Business+):
//      - Element Selection (crop)      → Business+  (was "Coming Soon" as "Element Removal Free+")
//
//    Phase 3 (shipped — Business+):
//      - Webhooks & Notifications      → Business+  (was "Coming Soon")
//
//    Phase 4 (roadmap — Premium):
//      - White-Label & Custom Domains  → still "Coming Soon"
//
//    Other corrections:
//      - "Element Removal" (remove_elements) kept as Free+ — correct
//      - "Full Page Screenshots" kept as Free+ — correct
//      - Device Emulation added under Pro+ Advanced Features section
// ========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo
                size={window.innerWidth < 640 ? 32 : 40}
                showText={true}
              />
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/about')}   className="text-gray-600 hover:text-gray-900 font-medium">About</button>
              <button onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-gray-900 font-medium">Pricing</button>
              <button onClick={() => navigate('/docs')}    className="text-gray-600 hover:text-gray-900 font-medium">Documentation</button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-6">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Powerful Screenshot Features
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to capture, customize, and deliver pixel-perfect screenshots at scale
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Core Features ──────────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Core Features</h2>
            <p className="text-gray-600 text-lg">The foundation of our screenshot API — available on all plans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

            {/* Lightning Fast */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Capture screenshots in under 3 seconds with our optimized Playwright-powered
                infrastructure. Global CDN delivery ensures low latency wherever you are.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon /><span>Average response time under 3 seconds</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Cloudflare R2 CDN for instant delivery</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Optimized Playwright rendering pipeline</span></li>
              </ul>
            </div>

            {/* Full Customization */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Full Customization</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Control every aspect of your screenshots. From viewport dimensions to output
                formats and dark mode — you're in complete control.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon /><span>Custom viewport sizes (320–3840 × 240–2160)</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>PNG, JPEG, WebP, and PDF formats</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Delay 0–10s, full-page, dark mode, element removal</span></li>
              </ul>
            </div>

            {/* Secure & Reliable */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Enterprise-grade security with industry-standard encryption. Your data and
                requests are protected at every step of the capture pipeline.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon /><span>SSL/TLS encryption for all requests</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>API keys hashed with SHA-256</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Cloudflare R2 storage with secure URLs</span></li>
              </ul>
            </div>

            {/* Batch Processing */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Batch Processing</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Capture multiple screenshots in a single API call with async job processing.
                Scale from 50 URLs on Pro to 1,000 on Premium.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon /><span>Async job processing with polling</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Up to 1,000 URLs per batch (Premium)</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Available on Pro tier and above</span></li>
              </ul>
            </div>

            {/* Dark Mode */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌙</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dark Mode Support</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Capture screenshots with dark mode forced on. Essential for testing dark themes
                and verifying your site looks great in any color scheme.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon /><span>Force dark color scheme via prefers-color-scheme</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Available on all tiers</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Theme testing made easy</span></li>
              </ul>
            </div>

            {/* Full Page */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Full Page Screenshots</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Capture entire web pages from top to bottom regardless of height. Perfect for
                documenting long-form content, articles, and landing pages.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon /><span>Automatic scroll and full-page capture</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>No height limitations</span></li>
                <li className="flex items-start gap-2"><CheckIcon /><span>Available on all tiers</span></li>
              </ul>
            </div>

          </div>
        </section>

        {/* ── Advanced Features ───────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Advanced Features</h2>
            <p className="text-gray-600 text-lg">Pro, Business, and Premium capabilities — live in production</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ✅ Custom JavaScript — Pro+ (SHIPPED Phase 1) */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border border-purple-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💻</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-gray-900">Custom JavaScript Execution</h3>
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">Pro+</span>
                  </div>
                  <p className="text-gray-700">
                    Execute custom JavaScript before capturing screenshots. Interact with the page,
                    fill forms, click buttons, or modify content programmatically — all server-side
                    in our headless Playwright browser.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 ml-16">
                <li>• Run any JavaScript code before capture</li>
                <li>• Non-fatal execution — screenshot still captured on JS errors</li>
                <li>• js_warning field reports any execution issues</li>
              </ul>
            </div>

            {/* ✅ Device Emulation — Pro+ (SHIPPED Phase 1) */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-gray-900">Device Emulation</h3>
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">Pro+</span>
                  </div>
                  <p className="text-gray-700">
                    Capture screenshots using real device profiles with accurate viewport sizes,
                    pixel density (DPR), and user agent strings for iPhone, Android, and iPad devices.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 ml-16">
                <li>• 9 device presets: iPhone 13, Pixel 7, iPad Pro, and more</li>
                <li>• Accurate DPR scaling (up to 4.5×) for retina-quality crops</li>
                <li>• Correct user agent strings for responsive design testing</li>
              </ul>
            </div>

            {/* ✅ Element Selection — Business+ (SHIPPED Phase 2) */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-gray-900">Element Selection</h3>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">Business+</span>
                  </div>
                  <p className="text-gray-700">
                    Crop screenshots to any element using CSS selectors. The full page is captured
                    first, then Pillow crops precisely to the element's bounding box — accounting
                    for device pixel ratio for crisp results on retina displays.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 ml-16">
                <li>• CSS selector targeting: <code className="bg-green-200 px-1 rounded text-xs">h1</code>, <code className="bg-green-200 px-1 rounded text-xs">#hero</code>, <code className="bg-green-200 px-1 rounded text-xs">.card</code>, any valid selector</li>
                <li>• DPR-aware Pillow crop — pixel-perfect on high-density displays</li>
                <li>• Combinable with device emulation, custom JS, and webhooks</li>
              </ul>
            </div>

            {/* ✅ Webhooks — Business+ (SHIPPED Phase 3) */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔔</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-gray-900">Webhooks & Notifications</h3>
                    <span className="px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded">Business+</span>
                  </div>
                  <p className="text-gray-700">
                    Receive real-time POST notifications the moment a screenshot completes.
                    Optional HMAC-SHA256 signing lets you verify every delivery is genuine.
                    The API returns instantly — your server is notified asynchronously.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 ml-16">
                <li>• Instant async completion notification to your endpoint</li>
                <li>• Optional HMAC-SHA256 signing via <code className="bg-orange-200 px-1 rounded text-xs">webhook_secret</code></li>
                <li>• Exponential backoff retry (3 attempts: 2s → 4s → 8s)</li>
              </ul>
            </div>

            {/* ✅ Element Removal — Free+ */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl border border-teal-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🧹</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-gray-900">Element Removal</h3>
                    <span className="px-2 py-1 bg-teal-600 text-white text-xs font-semibold rounded">Free+</span>
                  </div>
                  <p className="text-gray-700">
                    Hide specific elements using CSS selectors before capture. Remove cookie banners,
                    popups, ads, or any unwanted content to get clean, distraction-free screenshots.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 ml-16">
                <li>• Up to 20 CSS selectors per request</li>
                <li>• Hides banners, popups, overlays, and ads</li>
                <li>• Applied automatically before each capture</li>
              </ul>
            </div>

            {/* White-Label — Coming Soon (Phase 4) */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl border border-yellow-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold uppercase tracking-wide rounded-bl-lg">
                Coming Soon
              </div>
              <div className="flex items-start gap-4 mb-4 mt-2">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 opacity-90">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-gray-900">White-Label & Custom Domains</h3>
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded">Premium</span>
                  </div>
                  <p className="text-gray-700">
                    Rebrand the API under your own domain. Custom domain support, branded responses,
                    and dedicated infrastructure for enterprises who want PixelPerfect under their brand.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 ml-16 mb-4">
                <li>• Custom domain support (api.yourdomain.com)</li>
                <li>• Branded API responses</li>
                <li>• Dedicated infrastructure on Premium</li>
              </ul>
              <div className="ml-16 pt-3 border-t border-yellow-200">
                <button
                  onClick={() => navigate('/contact?subject=feature-request-white-label')}
                  className="text-sm font-semibold text-orange-700 hover:text-orange-900 inline-flex items-center gap-1"
                >
                  Get notified when this ships
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          {/* Dedicated Support */}
          <div className="mt-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl border border-indigo-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-gray-900">Dedicated Support & Custom SLA</h3>
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded">Premium</span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Get a dedicated point of contact, priority email support, and custom SLA
                    agreements tailored to your business needs.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <li>• Dedicated account contact</li>
                    <li>• Priority email support</li>
                    <li>• Custom SLA agreements available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tier Summary Table ──────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Feature Availability</h2>
            <p className="text-gray-600 text-lg">What's included at each tier</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 font-semibold text-gray-900 w-1/3">Feature</th>
                    <th className="text-center px-4 py-4 font-semibold text-gray-600">Free</th>
                    <th className="text-center px-4 py-4 font-semibold text-purple-700">Pro</th>
                    <th className="text-center px-4 py-4 font-semibold text-blue-700">Business</th>
                    <th className="text-center px-4 py-4 font-semibold text-orange-700">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: "Screenshots / month",   free: "100",   pro: "5,000",  biz: "50,000",  prem: "Unlimited" },
                    { name: "Batch processing",       free: "—",     pro: "50 URLs",biz: "200 URLs",prem: "1,000 URLs" },
                    { name: "All output formats",     free: "✅",    pro: "✅",     biz: "✅",      prem: "✅" },
                    { name: "Full page screenshots",  free: "✅",    pro: "✅",     biz: "✅",      prem: "✅" },
                    { name: "Dark mode",              free: "✅",    pro: "✅",     biz: "✅",      prem: "✅" },
                    { name: "Element removal",        free: "✅",    pro: "✅",     biz: "✅",      prem: "✅" },
                    { name: "Custom JavaScript",      free: "—",     pro: "✅",     biz: "✅",      prem: "✅" },
                    { name: "Device emulation",       free: "—",     pro: "✅",     biz: "✅",      prem: "✅" },
                    { name: "Wait for selector",      free: "—",     pro: "✅",     biz: "✅",      prem: "✅" },
                    { name: "Element selection",      free: "—",     pro: "—",      biz: "✅",      prem: "✅" },
                    { name: "Webhooks",               free: "—",     pro: "—",      biz: "✅",      prem: "✅" },
                    { name: "White-label / domain",   free: "—",     pro: "—",      biz: "—",       prem: "Soon" },
                    { name: "Dedicated support",      free: "—",     pro: "—",      biz: "—",       prem: "✅" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-6 py-3 font-medium text-gray-800">{row.name}</td>
                      <td className="px-4 py-3 text-center text-gray-500">{row.free}</td>
                      <td className="px-4 py-3 text-center text-purple-700 font-medium">{row.pro}</td>
                      <td className="px-4 py-3 text-center text-blue-700 font-medium">{row.biz}</td>
                      <td className="px-4 py-3 text-center text-orange-700 font-medium">{row.prem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Use Cases ───────────────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Common Use Cases</h2>
            <p className="text-gray-600 text-lg">See how developers use PixelPerfect</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Automated Testing",     desc: "Capture visual snapshots for regression testing and QA workflows" },
              { title: "Social Media Preview",  desc: "Generate Open Graph images and social media thumbnails automatically" },
              { title: "Website Monitoring",    desc: "Track visual changes and monitor competitor websites over time" },
              { title: "Documentation",         desc: "Create visual documentation and tutorials with accurate screenshots" },
              { title: "Content Archiving",     desc: "Archive web pages for compliance, legal, or historical purposes" },
              { title: "Email Marketing",       desc: "Generate visual previews of landing pages for email campaigns" },
            ].map((uc, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{uc.title}</h3>
                <p className="text-gray-600 text-sm">{uc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start capturing pixel-perfect screenshots today. Free tier included — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white text-lg"
            >
              View Pricing
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
              <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
              <button onClick={() => navigate('/terms')}   className="hover:text-white">Terms</button>
              <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ── Shared icon ───────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

export default Features;

// ===== END OF Features.jsx =====
