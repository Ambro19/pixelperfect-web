// ========================================
// RATE LIMITS AND QUOTAS GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/OptimizationGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #4 in "API Usage" category
// (Slug: rate-limits-and-quotas in helpArticles.js)
//
// ✅ VERIFIED Apr 2026 against backend/.env.production:
//   FREE_SCREENSHOTS_LIMIT     = 100
//   FREE_BATCH_LIMIT           = 0
//   PRO_SCREENSHOTS_LIMIT      = 5,000
//   PRO_BATCH_LIMIT            = 50
//   BUSINESS_SCREENSHOTS_LIMIT = 50,000  (was incorrectly 25,000 in earlier draft)
//   BUSINESS_BATCH_LIMIT       = 200
//   PREMIUM_SCREENSHOTS_LIMIT  = 999,999,999  (effectively unlimited)
//   PREMIUM_BATCH_LIMIT        = 999,999,999  (effectively unlimited)
//   FILE_RETENTION_DAYS        = 7  (screenshots auto-deleted after 7 days)
//   ACCESS_TOKEN_EXPIRE_MINUTES= 1440  (JWT lifetime: 24 hours)
//   ALGORITHM                  = HS256  (JWT signing algorithm)
//
// ✅ Verified facts from code:
//   - Concurrency limits (main.py):    starter=2, pro=3, business=5
//   - Request timeout (Render):        120s
//   - Playwright worst case:           ~100s (3-tier fallback)
//   - Viewport bounds (single):        320-3840w / 240-2160h
//   - Viewport bounds (batch):         320-7680w / 240-4320h
//   - Delay range:                     0-10 seconds
//   - remove_elements cap:             20 selectors, 200 chars each
//   - Batch file upload max:           2 MB
// ========================================

import React from 'react';

const OptimizationGuide = () => {
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
              How PixelPerfect's three limit systems work — monthly quotas, concurrency, and
              input validation — and six concrete strategies to get more out of your plan
              without upgrading.
            </p>
          </div>
        </div>
      </div>

      {/* The three systems intro */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Three Different Limit Systems</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Users often lump "limits" together, but PixelPerfect enforces three separate systems that
        answer three different questions:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📅</span>
            <h4 className="font-semibold text-gray-900 mb-0">Monthly quotas</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0">
            "How many screenshots can I take this month?" Reset on the first of each month.
          </p>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            <h4 className="font-semibold text-gray-900 mb-0">Concurrency</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0">
            "How many requests can I run at the same time?" Per-moment, not per-month.
          </p>
        </div>
        <div className="bg-white border-2 border-amber-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📏</span>
            <h4 className="font-semibold text-gray-900 mb-0">Validation bounds</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0">
            "What values can each parameter accept?" Per-request, per-field.
          </p>
        </div>
      </div>

      {/* Monthly quotas */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Monthly Quotas by Plan</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Every plan has two counters that reset monthly: screenshots captured, and batch requests
        submitted. Here's what each plan includes:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Plan</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Price / month</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Screenshots / month</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Batch requests / month</th>
              <th className="text-left p-3 font-semibold text-gray-900">URLs per batch</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Free</strong></td>
              <td className="p-3 border-r border-gray-200">$0</td>
              <td className="p-3 border-r border-gray-200">100</td>
              <td className="p-3 border-r border-gray-200 text-gray-500">Not included</td>
              <td className="p-3 text-gray-500">—</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Pro</strong></td>
              <td className="p-3 border-r border-gray-200">$49</td>
              <td className="p-3 border-r border-gray-200">5,000</td>
              <td className="p-3 border-r border-gray-200">100</td>
              <td className="p-3">Up to 50</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Business</strong></td>
              <td className="p-3 border-r border-gray-200">$199</td>
              <td className="p-3 border-r border-gray-200">50,000</td>
              <td className="p-3 border-r border-gray-200">500</td>
              <td className="p-3">Up to 200</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Premium</strong></td>
              <td className="p-3 border-r border-gray-200">$499</td>
              <td className="p-3 border-r border-gray-200">Unlimited</td>
              <td className="p-3 border-r border-gray-200">Unlimited</td>
              <td className="p-3">Up to 1,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">How batch counts against your quotas</h4>
            <p className="text-yellow-800 text-sm mb-0">
              A batch of 50 URLs consumes <strong>50 screenshots</strong> from the screenshots
              counter <em>and</em> <strong>1 batch request</strong> from the batch-requests
              counter. The two counters are independent. So if you're on Pro and you run two
              50-URL batches, you've used 100 screenshots and 2 batch requests.
            </p>
          </div>
        </div>
      </div>

      {/* Quota resets */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">When quotas reset</h3>
      <p className="text-gray-700 leading-relaxed">
        Quotas reset at the <strong>first of each month, 00:00 UTC</strong>. If it's April 30th
        and you've used 4,987/5,000 screenshots on Pro, you have 13 screenshots until midnight UTC
        — then 5,000 again. The reset is a hard rollover; unused capacity does not carry forward.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Your next reset time is shown in the subscription status panel on the dashboard and in
        the <span className="font-mono">next_reset</span> field of{' '}
        <span className="font-mono">GET /subscription_status</span>.
      </p>

      {/* File retention */}
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Captured screenshots are kept for 7 days</h3>
      <p className="text-gray-700 leading-relaxed">
        Every screenshot you capture is stored on Cloudflare R2 for <strong>7 days</strong>, then
        automatically deleted. The 7-day window applies regardless of plan — Premium does not
        extend retention. Plan accordingly:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            If you need long-term archival, download or upload to your own storage immediately
            after capture
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            Database records (with metadata + URL) persist longer; only the image files are
            cleaned up
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            For an ongoing pipeline, treat PixelPerfect as the renderer and your own storage as
            the archive
          </span>
        </li>
      </ul>

      {/* Checking usage */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Checking Your Usage</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Three ways to see where you stand, from easiest to most programmatic:
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1. Dashboard</h3>
      <p className="text-gray-700 leading-relaxed">
        Sign in to{' '}
        <a href="https://pixelperfectapi.net/dashboard" className="text-blue-600 hover:underline">
          pixelperfectapi.net/dashboard
        </a>
        . The subscription card shows screenshots used this month, remaining, and a progress bar.
        The Batch page shows the same for batch requests.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2. /subscription_status endpoint</h3>
      <p className="text-gray-700 leading-relaxed">
        For programmatic monitoring, call the status endpoint with your JWT:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl https://api.pixelperfectapi.net/subscription_status \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        </pre>
      </div>
      <p className="text-gray-700 leading-relaxed mt-3">Response:</p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "tier": "pro",
  "usage": {
    "screenshots":    2847,
    "batch_requests": 12,
    "api_calls":      2859
  },
  "limits": {
    "screenshots":    5000,
    "batch_requests": 100
  },
  "next_reset": "2026-05-01T00:00:00",
  "tier_concurrency_limit": 3
}`}
        </pre>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <p className="text-sm text-gray-700 mb-0">
          <strong>Note:</strong> <span className="font-mono">/subscription_status</span> uses JWT
          auth (not API key). Get a JWT by calling <span className="font-mono">POST /token_json</span>{' '}
          with your username and password. JWTs expire after 24 hours, so refresh as needed. This
          endpoint is primarily for the dashboard; for code monitoring, consider polling it every
          few minutes rather than per-request.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">3. Per-request response (implicit)</h3>
      <p className="text-gray-700 leading-relaxed">
        When you hit your screenshot limit, the next request returns HTTP 403 with a message
        like: <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">"Screenshot limit exceeded (5000/month). Upgrade your plan to continue."</span>{' '}
        That's your signal to either wait for the reset or upgrade.
      </p>

      {/* Rate limits */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Quota-Exceeded Responses</h2>
      <p className="text-gray-700 leading-relaxed">
        When you exhaust a monthly quota, the API returns an HTTP error with a clear message.
        There are no surprise charges and no silent failures.
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">403</span>
            Monthly screenshot limit reached
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            You've used all screenshots in your monthly allowance. Wait until the next reset
            (first of the next month UTC) or upgrade your plan. Partial usage does carry — you
            can use your full new quota on day one of the new cycle.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">403</span>
            Batch processing not available on free tier
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            Free tier cannot submit batch jobs at all. Upgrade to Pro or higher to access the
            batch endpoints.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono font-bold">403</span>
            Batch size exceeds tier limit
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            You submitted more URLs in a single batch than your plan allows (e.g. 60 URLs on Pro
            when the cap is 50). Split into multiple batches or upgrade.
          </p>
        </div>
      </div>

      {/* Concurrency */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Concurrency Limits</h2>
      <p className="text-gray-700 leading-relaxed">
        Monthly quotas answer "how much can I do this month?" — but concurrency answers "how many
        requests can I run <em>at the exact same moment?</em>" This matters if your code fires
        parallel requests or if multiple users share one account.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Plan</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Concurrent captures</th>
              <th className="text-left p-3 font-semibold text-gray-900">What it means</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Free</strong></td>
              <td className="p-3 border-r border-gray-200">2</td>
              <td className="p-3">Up to 2 parallel single-screenshot requests</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Pro</strong></td>
              <td className="p-3 border-r border-gray-200">3</td>
              <td className="p-3">Sweet spot for most API integrations</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Business</strong></td>
              <td className="p-3 border-r border-gray-200">5</td>
              <td className="p-3">Parallel workflows, multiple developers sharing credentials</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">When you hit the concurrency cap</h4>
            <p className="text-blue-800 text-sm mb-0">
              Requests beyond your concurrent cap wait up to 5 seconds for a slot. If nothing
              frees up, you get HTTP 429 with a <span className="font-mono">Retry-After: 1</span>{' '}
              header. The error message reads: "Too many concurrent screenshots for your plan
              (tier=pro, limit=3). Please retry in a moment or upgrade for higher concurrency."
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 my-4">
        <h4 className="font-semibold text-gray-900 mb-2">Batch vs. single concurrency</h4>
        <p className="text-sm text-gray-700 mb-2">
          Concurrency applies to single-screenshot calls (<span className="font-mono">POST /api/v1/screenshot</span>).
          Batch jobs process URLs sequentially on the server side — submitting a 50-URL batch
          doesn't consume 50 concurrency slots, it consumes one. This makes batch a great fit
          when you don't want to orchestrate parallel requests yourself.
        </p>
      </div>

      {/* Validation limits */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Input Validation Limits</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Per-request bounds on what each parameter can accept. Exceed these and you get HTTP 422
        with a validation error.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Parameter</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Single endpoint</th>
              <th className="text-left p-3 font-semibold text-gray-900">Batch endpoint</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">width</td>
              <td className="p-3 border-r border-gray-200">320 – 3,840</td>
              <td className="p-3">320 – 7,680</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">height</td>
              <td className="p-3 border-r border-gray-200">240 – 2,160</td>
              <td className="p-3">240 – 4,320</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">delay</td>
              <td className="p-3 border-r border-gray-200">0 – 10 seconds</td>
              <td className="p-3">0 – 10 seconds</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">remove_elements</td>
              <td className="p-3 border-r border-gray-200">≤20 selectors, ≤200 chars each</td>
              <td className="p-3">≤20 selectors, ≤200 chars each</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">Request timeout</td>
              <td className="p-3 border-r border-gray-200">120 seconds</td>
              <td className="p-3">Per-URL 120 seconds (async)</td>
            </tr>
            <tr>
              <td className="p-3 font-mono text-xs border-r border-gray-200 bg-gray-50">Batch file upload size</td>
              <td className="p-3 border-r border-gray-200 text-gray-400">—</td>
              <td className="p-3">2 MB</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed">
        These validation bounds are the same for every plan — a Premium user can't take a 10,000px
        screenshot either. They reflect the practical limits of headless browser rendering, not
        pricing tiers.
      </p>

      {/* Optimization strategies */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Six Strategies to Get More From Your Plan</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Before upgrading, see if these techniques get you where you need to go.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1. Cache aggressively</h3>
      <p className="text-gray-700 leading-relaxed">
        If you're capturing the same URL multiple times in a short window, cache the result.
        A landing page captured at 9:00 AM is the same landing page at 9:05 AM — call the API
        once and serve the cached image from your CDN. R2 URLs are public and cacheable by
        default. Combine this with the 7-day retention reality: download once, archive in your
        own storage, then serve from there indefinitely.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2. Use WebP instead of PNG</h3>
      <p className="text-gray-700 leading-relaxed">
        WebP is 25–35% smaller than PNG with no visible quality loss. Doesn't save you any
        screenshots against quota, but saves bandwidth when serving them to end users — which
        matters at scale.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">3. Batch everything you can</h3>
      <p className="text-gray-700 leading-relaxed">
        Batch endpoints consume one concurrency slot regardless of URL count. If you have 50
        URLs to capture, one 50-URL batch uses one concurrency slot and one batch-request quota
        unit, versus 50 single-endpoint calls that serially consume concurrency.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4. Deduplicate before submitting</h3>
      <p className="text-gray-700 leading-relaxed">
        Batch auto-deduplicates, but the single endpoint doesn't. If your source data might have
        duplicates (CSV exports often do), use a <span className="font-mono">Set</span> in your
        code before firing requests.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">5. Skip full-page unless you need it</h3>
      <p className="text-gray-700 leading-relaxed">
        Full-page captures take longer (more scrolling, more rendering) and produce bigger files.
        If you only need the above-the-fold view, leave <span className="font-mono">full_page: false</span>{' '}
        (the default). For social media previews, this is always correct.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6. Only use delay when needed</h3>
      <p className="text-gray-700 leading-relaxed">
        Every second of <span className="font-mono">delay</span> adds a second to request time.
        On a batch of 200 URLs, a 5-second delay adds ~17 minutes of total processing time
        relative to the same batch with no delay. If the pages you're capturing are static,
        keep delay at 0.
      </p>

      {/* What counts */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Counts and What Doesn't</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The precise accounting rules — worth understanding before you build automated workflows.
      </p>

      <div className="space-y-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">✅ Counts as a screenshot</h4>
          <p className="text-sm text-gray-700 mb-0">
            Every successful capture — whether single or inside a batch — increments your
            screenshots counter by 1.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">❌ Does NOT count</h4>
          <p className="text-sm text-gray-700 mb-0">
            Failed captures (HTTP 5xx, DNS failures, timeouts) don't consume quota. Validation
            errors (HTTP 422) don't consume quota. Rate-limit rejections (HTTP 429) don't
            consume quota. You only pay for successful pixels.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">⚠️  Retries DO count</h4>
          <p className="text-sm text-gray-700 mb-0">
            When you use <span className="font-mono">retry_failed</span> on a batch and the retry
            succeeds, that's a fresh successful capture — counted. A retry that fails again
            doesn't count.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">🚫 Cancellation is free</h4>
          <p className="text-sm text-gray-700 mb-0">
            Cancelling a batch doesn't refund or penalize you — it just stops processing.
            Screenshots already captured are kept and counted; items that were queued but
            not yet captured are not charged.
          </p>
        </div>
      </div>

      {/* When to upgrade */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">When to Upgrade</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        A rough decision guide. Upgrade if any of these match you:
      </p>

      <div className="space-y-3 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Free → Pro ($49/month)</h4>
          <p className="text-sm text-gray-700 mb-0">
            You're hitting the 100-screenshot monthly cap, or you need batch processing at all.
            Pro is a 50× jump in monthly capacity.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Pro → Business ($199/month)</h4>
          <p className="text-sm text-gray-700 mb-0">
            You need more than 50 URLs per batch, or you're hitting the 5,000/month screenshot
            cap consistently, or you want 5 concurrent captures instead of 3. Business is a 10×
            jump in monthly capacity (50,000/month).
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Business → Premium ($499/month)</h4>
          <p className="text-sm text-gray-700 mb-0">
            You need unlimited screenshots, or 1,000+ URLs per batch for large-scale workflows.
          </p>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Upgrades are prorated</h4>
            <p className="text-green-800 text-sm mb-0">
              Upgrading mid-month credits the unused portion of your current plan against the new
              one. Downgrades take effect at the next billing cycle, so you keep your higher
              quota until then.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Troubleshooting</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My usage seems higher than I expect"</h4>
          <p className="text-sm text-gray-700">
            Check if you're running batch jobs — each URL inside a batch counts as a screenshot.
            A 50-URL batch is 50 screenshots, not 1. Also check for accidental duplicate calls
            in loops, or automated tests running against production credentials.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I got HTTP 429 even though I have quota left"</h4>
          <p className="text-sm text-gray-700">
            That's a concurrency error, not a quota error. You hit the concurrent-requests cap
            (2 on Free, 3 on Pro, 5 on Business). Add small delays between parallel calls, or
            upgrade for more concurrent slots.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My quota didn't reset on the 1st"</h4>
          <p className="text-sm text-gray-700">
            Quotas reset at 00:00 UTC. If you're in a timezone that's behind UTC (like Eastern
            US), your "1st" starts at 7-8 PM the evening before UTC midnight. Your new quota
            arrives earlier than you might expect, not later.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My screenshot URL stopped working"</h4>
          <p className="text-sm text-gray-700">
            Screenshots are kept on R2 storage for 7 days, then automatically deleted. If your URL
            returns 404, the file has aged out. Recapture the URL, or build a workflow that
            archives images to your own storage immediately after capture.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"How do I monitor usage programmatically?"</h4>
          <p className="text-sm text-gray-700">
            Poll <span className="font-mono">GET /subscription_status</span> with a JWT token.
            Don't poll per-request — every few minutes is plenty. For alerts, set a threshold
            (e.g. "warn me at 80% used") and send yourself a notification from your monitoring
            system.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"What happens to my unused quota at month-end?"</h4>
          <p className="text-sm text-gray-700">
            Unused capacity resets to zero — it doesn't carry forward. If you used 1,000 out of
            5,000 on Pro, you start the next month with 5,000, not 9,000. Plan accordingly.
          </p>
        </div>
      </div>

      {/* Next steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/batch-processing-guide"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Batch processing guide</h4>
            <p className="text-sm text-blue-700 mb-0">Use batch to get more out of concurrency limits</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/screenshot-parameters-explained"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Screenshot parameters explained</h4>
            <p className="text-sm text-green-700 mb-0">Understand every validation bound in depth</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/how-to-upgrade-plan"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">How to upgrade your plan</h4>
            <p className="text-sm text-purple-700 mb-0">Step-by-step upgrade process and billing details</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">
              Limits, understood 🎯
            </h4>
            <p className="text-green-800 text-sm mb-0">
              You know the three limit systems, how to check usage, what triggers each error
              code, and how to stretch your current plan before upgrading. Build confidently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationGuide;