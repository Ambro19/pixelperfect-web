// ========================================
// MARKETING PAGE
// ========================================
// File: frontend/src/pages/Marketing.jsx
// Author: OneTechly
// Purpose: Fully responsive landing page
// Updated: July 2026
//
// ✅ UPDATED: July 2026 — Hero subheading rewritten. Previous copy ("fastest,
//   most reliable... in under 3 seconds") was generic SaaS boilerplate that
//   didn't differentiate PixelPerfect from any other screenshot API. New copy
//   leads with the concrete technical differentiator (real Playwright/Chromium
//   rendering, not an HTML-to-image hack) so non-technical visitors immediately
//   understand *why* it's more accurate, then a second line hooks developers
//   specifically with the Pro-tier capabilities (device emulation, custom JS,
//   batch) pulled from the RapidAPI Hub listing's "Why PixelPerfect" and
//   "Advanced Features" sections — reused here for consistent messaging
//   across both the marketing site and the RapidAPI listing.
//
// ✅ UPDATED: May 2026 — OneTechly → OneTechly, LLC in copyright/legal (DOS ID 7922759)
//             Note: "From the OneTechly Blog" keeps brand name (not legal entity)
// ✅ UPDATED: June 2026 — Replaced Twitter/X icon with Facebook icon in footer
// ✅ UPDATED: November 2026 (2) — Finished-looking hero and honest claims:
//   - Hero placeholder "[Screenshot preview would be displayed here]" replaced
//     by <HeroApiDemo/>: real request, real response fields, real result.
//   - Speed: "in under 3 seconds" → "in seconds" (hero) and "Most captures
//     finish in under 10 seconds, and simple pages in about 3" (card).
//     Production captures ran 2.6s–20.6s, median ~5.5s (see About.jsx).
//   - "Enterprise-grade security with 99.9% uptime SLA" → the security measures
//     actually in place. An SLA is a contract with credits owed when missed;
//     there is no uptime monitoring behind one yet (same fix as About.jsx).
//   - Footer: "Also from OneTechly: Brief!" cross-link (Brief! links back).
//   - Removed the commented-out copy of the old file from the bottom
//     (it is still in git history).
// ✅ UPDATED: November 2026 — Removed the "From the OneTechly Blog" section
//   (three OneTechly posts) from the landing page. The OneTechly Blog is now a
//   footer link under "PixelPerfect Blog" (Company column). While the blog is
//   being refocused, it opens the in-app "being updated" page (/onetechly-blog,
//   pages/OneTechlyBlog.jsx).

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ============================================================================
// Hero API demo (Nov 2026)
// ----------------------------------------------------------------------------
// Replaces the "[Screenshot preview would be displayed here]" placeholder.
// Everything shown is real: the request matches the Documentation quick start
// (POST /api/v1/screenshot, Bearer API key), the response uses the real field
// names of ScreenshotResponse in the backend. index.css gives every button
// and link a 44px minimum (touch targets); min-h-0/min-w-0 undo that where a
// small inline control is intended. Footer list links get min-w-0 so short
// labels (About, API, FAQ) line up on the left instead of being centred, and the preview on the right is
// what https://example.com actually looks like. Ids and sizes are examples.
// No images or network calls, so it can never break or slow the page down.
// ============================================================================
const DEMO_REQUEST = `curl -X POST \\
  https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "format": "png",
    "width": 1280,
    "height": 800
  }'`;

const DEMO_RESPONSE = [
  ['url', '"https://example.com"'],
  ['screenshot_id', '"8f3c2a91-…"'],
  ['screenshot_url', '"https://…/8f3c2a91.png"'],
  ['width', '1280'],
  ['height', '800'],
  ['format', '"png"'],
  ['size_bytes', '41872'],
];

function HeroApiDemo({ onSignUp }) {
  const [copied, setCopied] = React.useState(false);

  const copyRequest = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_REQUEST);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked (http, old browser): the code is still selectable */
    }
  };

  return (
    <div className="mt-12 sm:mt-16 max-w-5xl mx-auto sm:px-4 text-left">
      <div className="rounded-xl shadow-2xl border border-gray-200 overflow-hidden bg-white">
        {/* Window bar */}
        <div className="flex items-center gap-3 bg-gray-100 px-3 sm:px-4 py-2.5 border-b border-gray-200">
          <div className="flex gap-1.5 flex-shrink-0" aria-hidden="true">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></span>
          </div>
          <div className="flex-1 min-w-0 text-center text-xs sm:text-sm text-gray-500 font-mono truncate">
            POST /api/v1/screenshot
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true"></span>
            200 OK
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: request + response */}
          <div className="bg-gray-900 text-gray-100 min-w-0">
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Request</span>
              <button
                type="button"
                onClick={copyRequest}
                className="min-h-0 min-w-0 text-[11px] font-medium text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded px-2 py-0.5 transition-colors"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <pre className="px-4 pt-2 pb-4 text-[11px] sm:text-xs leading-relaxed font-mono overflow-x-auto"><code>{DEMO_REQUEST}</code></pre>

            <div className="border-t border-gray-800 px-4 pt-3 pb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Response</span>
              <pre className="mt-2 text-[11px] sm:text-xs leading-relaxed font-mono overflow-x-auto"><code>
                <span className="text-gray-500">{'{'}</span>{'\n'}
                {DEMO_RESPONSE.map(([key, value], i) => (
                  <React.Fragment key={key}>
                    {'  '}<span className="text-sky-300">"{key}"</span>
                    <span className="text-gray-500">: </span>
                    <span className={value.startsWith('"') ? 'text-emerald-300' : 'text-amber-300'}>{value}</span>
                    {i < DEMO_RESPONSE.length - 1 ? <span className="text-gray-500">,</span> : null}{'\n'}
                  </React.Fragment>
                ))}
                <span className="text-gray-500">{'}'}</span>
              </code></pre>
            </div>
          </div>

          {/* Right: the image that request returns */}
          <div className="bg-gray-50 p-4 sm:p-6 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Result · 1280×800 PNG</span>
              <span className="text-[11px] text-gray-400 font-mono">example.com</span>
            </div>

            <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* What https://example.com renders as in Chromium */}
              <div className="h-full min-h-[220px] bg-[#f0f0f2] flex items-center justify-center p-6">
                <div className="bg-[#fdfdff] rounded-lg shadow-sm p-5 sm:p-6 max-w-xs w-full">
                  <div className="font-sans text-lg sm:text-xl font-bold text-gray-900 mb-2">Example Domain</div>
                  <p className="font-sans text-[11px] sm:text-xs text-gray-700 leading-relaxed mb-2">
                    This domain is for use in illustrative examples in documents. You may use this
                    domain in literature without prior coordination or asking for permission.
                  </p>
                  <span className="font-sans text-[11px] sm:text-xs text-[#38488f] underline">More information...</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs text-gray-500">Rendered by real Chromium, exactly as Chrome shows it.</p>
              <button
                type="button"
                onClick={onSignUp}
                className="min-h-0 min-w-0 whitespace-nowrap self-start sm:self-auto text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Get your free API key →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Marketing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 36 : 48} showText={true} />
            </div>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <button onClick={() => navigate('/features')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Features</button>
              <button onClick={() => navigate('/pricing')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Pricing</button>
              <button onClick={() => navigate('/docs')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Documentation</button>
              <button onClick={() => navigate('/api')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">API</button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => navigate('/login')} className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Sign in</button>
              <button onClick={() => navigate('/register')} className="px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <PixelPerfectLogo size={window.innerWidth < 640 ? 64 : window.innerWidth < 768 ? 80 : 96} showText={false} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Pixel-Perfect Screenshots,
            <br />
            <span className="text-blue-600">Every Single Time</span>
          </h1>

          {/*
            ✅ UPDATED (July 2026): Hero subheading rewritten to differentiate
            PixelPerfect instead of generic SaaS claims. Structure:
              Line 1 (primary, larger): the concrete technical differentiator
                — real Playwright/Chromium rendering — stated in plain language
                a non-technical visitor understands immediately (accuracy on
                JS-heavy sites), plus the tangible outcome (4 formats, <3s).
              Line 2 (secondary, smaller/muted): a fast hook for developers
                specifically — the Pro-tier capabilities — without bloating
                the primary message or slowing down non-technical readers.
            Content sourced from the RapidAPI Hub listing's "Why PixelPerfect"
            and "Advanced Features" sections for consistent messaging across
            the marketing site and the RapidAPI listing.
          */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4">
            Real headless Chromium rendering via Playwright — not a lightweight HTML-to-image hack — so even the most JavaScript-heavy sites capture exactly as they look in Chrome. One simple API call returns a pixel-perfect PNG, JPEG, WebP, or PDF in seconds.
            <span className="block mt-2 text-sm sm:text-base text-gray-500">
              Developers get device emulation, custom JavaScript execution, and batch processing built in — no browser infrastructure to manage.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
            <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">Get Started Free →</button>
            <button onClick={() => navigate('/docs')} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-base sm:text-lg font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">View Documentation 📄</button>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm px-4">
            {['No credit card required', '100 free screenshots/month', 'Cancel anytime'].map((pill) => (
              <div key={pill} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{pill}</span>
              </div>
            ))}
          </div>

          {/* ✅ NEW (Nov 2026): the "[Screenshot preview would be displayed here]"
              placeholder is replaced by an API demo: the real request (same
              endpoint and auth header as the Documentation quick start), the
              real response fields, and the image that request produces. */}
          <HeroApiDemo onSignUp={() => navigate('/register')} />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Powerful Features</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Everything you need to capture perfect screenshots</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '⚡', title: 'Fast by Default',    desc: 'Most captures finish in under 10 seconds, and simple pages in about 3. No browsers for you to run.', color: 'blue' },
              { icon: '🎨', title: 'Full Customization', desc: 'Control viewport size, format (PNG, JPEG, WebP, PDF), full-page capture, and more.',    color: 'green'  },
              { icon: '🔒', title: 'Secure by Design',   desc: 'HTTPS everywhere, encrypted storage, and API keys you can rotate at any time.', color: 'purple' },
              { icon: '📱', title: 'Mobile Screenshots', desc: 'Capture mobile viewports with device emulation for perfect responsive testing.',          color: 'yellow' },
              { icon: '⚙️', title: 'Batch Processing',   desc: 'Capture multiple screenshots at once with our batch API (Pro plan and above).',          color: 'red'    },
              { icon: '🌙', title: 'Dark Mode Support',  desc: 'Capture screenshots with dark mode enabled for better testing coverage.',                 color: 'indigo' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                  <span className="text-xl sm:text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
           Join developers using PixelPerfect to capture any URL with a single API call. Results in seconds, 100 free screenshots every month, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-base sm:text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">Get Started Free </button>
            <button onClick={() => navigate('/pricing')} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-blue-800 transition-colors border-2 border-white">View Pricing</button>
          </div>
        </div>
      </section>

      {/* Footer — ✅ OneTechly, LLC in copyright */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => navigate('/about')} className="min-w-0 hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => navigate('/careers')} className="min-w-0 hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => navigate('/blog')} className="min-w-0 hover:text-white transition-colors">PixelPerfect Blog</button></li>
                <li><button onClick={() => navigate('/onetechly-blog')} className="min-w-0 hover:text-white transition-colors">OneTechly Blog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => navigate('/features')} className="min-w-0 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/pricing')} className="min-w-0 hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => navigate('/api')} className="min-w-0 hover:text-white transition-colors">API</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => navigate('/docs')} className="min-w-0 hover:text-white transition-colors">Documentation</button></li>
                <li><button onClick={() => navigate('/guides')} className="min-w-0 hover:text-white transition-colors">Guides</button></li>
                <li><button onClick={() => navigate('/api-status')} className="min-w-0 hover:text-white transition-colors">API Status</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => navigate('/help')} className="min-w-0 hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/contact')} className="min-w-0 hover:text-white transition-colors">Contact</button></li>
                <li><button onClick={() => navigate('/faq')} className="min-w-0 hover:text-white transition-colors">FAQ</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center md:items-start gap-2">
                <PixelPerfectLogo size={28} showText={true} textColor="text-white" />
                {/* ✅ Updated: OneTechly, LLC */}
                <div className="text-xs text-gray-400">© 2026 OneTechly, LLC. All rights reserved.</div>
                {/* ✅ NEW (Nov 2026): cross-link to OneTechly's other product */}
                <div className="text-xs text-gray-400 text-center md:text-left">
                  Also from OneTechly:{' '}
                  <a href="https://briefmessage.net" target="_blank" rel="noopener noreferrer" className="min-h-0 min-w-0 inline text-gray-200 underline underline-offset-2 hover:text-white transition-colors">Brief!</a>, a private message board for small teams.
                </div>
              </div>

              <div className="flex items-center gap-5 sm:gap-6">

                {/* ✅ Facebook — replace YOUR_FACEBOOK_PAGE_URL with your actual page URL */}
                <a href="https://www.facebook.com/profile.php?id=61590549488593" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2" aria-label="Facebook">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/ambroise-lumanikio-b94578319/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2" aria-label="LinkedIn">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>

                {/* GitHub */}
                <a href="https://github.com/Ambro19/pixelperfect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2" aria-label="GitHub">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                </a>

              </div>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors p-2">Privacy</button>
                <button onClick={() => navigate('/terms')}   className="hover:text-white transition-colors p-2">Terms</button>
                <button onClick={() => navigate('/cookies')} className="hover:text-white transition-colors p-2">Cookies</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

//============== END OF Marketing.jsx =============
