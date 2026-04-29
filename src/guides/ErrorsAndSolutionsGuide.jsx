// ========================================
// COMMON ERROR CODES GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ErrorsAndSolutionsGuide.jsx
// Author: OneTechly
// Update: April 27, 2026 (full rewrite from stub)
//
// Article #22 in "Troubleshooting" category
// (Slug: common-error-codes in helpArticles.js)
//
// This article replaces the 398-byte stub that previously existed.
//
// Verified facts used (from backend code):
//   - 400 errors: validation failures from Pydantic models in
//     screenshot_endpoints.py (viewport bounds, format, etc.)
//   - 401 errors: auth_deps.py raises on missing/invalid JWT or API key
//   - 402: returned when monthly quota exceeded (tier limits in
//     .env.production: free=100, pro=5000, business=50000, premium=unlimited)
//   - 403: returned for tier-gated features (e.g., batch on free tier)
//   - 422: Pydantic validation errors with structured detail field
//   - 429: rate limiter in main.py (concurrency caps: free=2, pro=3, business=5)
//   - 500: unexpected server errors
//   - 502/503/504: Cloudflare/Render infrastructure layer errors
//
// Tone: calm and direct. Frustrated readers want symptom → fix, not theory.
// ========================================

import React from 'react';

const ErrorsAndSolutionsGuide = () => {
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
              Every error code our API returns, what each one means, and the most likely fix
              for each. Use Ctrl+F (or Cmd+F) to jump straight to the status code you got.
            </p>
          </div>
        </div>
      </div>

      {/* Quick reference */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quick Reference</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Status</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">What it means</th>
              <th className="text-left p-3 font-semibold text-gray-900">Most common cause</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-400" className="text-blue-600 hover:underline">400</a></td>
              <td className="p-3 border-r border-gray-200">Bad Request</td>
              <td className="p-3">Invalid parameter value (viewport, format, URL)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-401" className="text-blue-600 hover:underline">401</a></td>
              <td className="p-3 border-r border-gray-200">Unauthorized</td>
              <td className="p-3">API key missing, invalid, or revoked</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-402" className="text-blue-600 hover:underline">402</a></td>
              <td className="p-3 border-r border-gray-200">Payment Required</td>
              <td className="p-3">Monthly quota exhausted on your tier</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-403" className="text-blue-600 hover:underline">403</a></td>
              <td className="p-3 border-r border-gray-200">Forbidden</td>
              <td className="p-3">Feature requires a higher tier</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-404" className="text-blue-600 hover:underline">404</a></td>
              <td className="p-3 border-r border-gray-200">Not Found</td>
              <td className="p-3">Endpoint URL typo, or batch/screenshot ID doesn't exist</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-422" className="text-blue-600 hover:underline">422</a></td>
              <td className="p-3 border-r border-gray-200">Unprocessable Entity</td>
              <td className="p-3">Malformed JSON or missing required field</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-429" className="text-blue-600 hover:underline">429</a></td>
              <td className="p-3 border-r border-gray-200">Too Many Requests</td>
              <td className="p-3">Concurrent capture limit exceeded</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-500" className="text-blue-600 hover:underline">500</a></td>
              <td className="p-3 border-r border-gray-200">Internal Server Error</td>
              <td className="p-3">Capture pipeline crashed (rare; we get notified)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-502" className="text-blue-600 hover:underline">502</a></td>
              <td className="p-3 border-r border-gray-200">Bad Gateway</td>
              <td className="p-3">Backend restarting (deploys, infrastructure)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-503" className="text-blue-600 hover:underline">503</a></td>
              <td className="p-3 border-r border-gray-200">Service Unavailable</td>
              <td className="p-3">Temporary overload or maintenance</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 font-mono"><a href="#err-504" className="text-blue-600 hover:underline">504</a></td>
              <td className="p-3 border-r border-gray-200">Gateway Timeout</td>
              <td className="p-3">Capture took longer than 120 seconds</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-blue-800 text-sm mb-0">
              <strong>One pattern across all error codes:</strong> our API always returns
              JSON with a <code className="font-mono">detail</code> field describing what went
              wrong. Read that field first &mdash; it usually tells you exactly what to fix.
            </p>
          </div>
        </div>
      </div>

      {/* 400 */}
      <h2 id="err-400" className="text-2xl font-bold text-gray-900 mt-10 mb-4">400 &mdash; Bad Request</h2>
      <p className="text-gray-700 leading-relaxed">
        Your request reached us, but a parameter value was rejected by our validation rules.
        The <code className="font-mono">detail</code> field tells you which one.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Common causes</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Viewport out of range.</strong> Width must be 320&ndash;3840, height must be 240&ndash;2160.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Invalid format.</strong> Allowed values: <code className="font-mono">png</code>, <code className="font-mono">jpeg</code>, <code className="font-mono">webp</code>, <code className="font-mono">pdf</code>.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Malformed URL.</strong> Must include <code className="font-mono">https://</code> or <code className="font-mono">http://</code>. Localhost and private IPs are rejected.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Delay out of range.</strong> Must be 0&ndash;10 seconds.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Too many remove_elements selectors.</strong> Maximum 20 per request, each &le;200 characters.</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Example response</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "detail": "Width must be between 320 and 3840"
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        Read the <code className="font-mono">detail</code> field, correct the parameter, retry.
        For the full parameter reference, see the{' '}
        <a href="/help/article/screenshot-parameters-explained" className="text-blue-600 hover:underline">
          Screenshot Parameters guide
        </a>.
      </p>

      {/* 401 */}
      <h2 id="err-401" className="text-2xl font-bold text-gray-900 mt-10 mb-4">401 &mdash; Unauthorized</h2>
      <p className="text-gray-700 leading-relaxed">
        We couldn't authenticate your request. Either there's no credential, or the one you
        sent isn't recognized.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Common causes</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Missing Authorization header.</strong> Every API request must include <code className="font-mono">Authorization: Bearer pk_...</code>.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Wrong header format.</strong> The <code className="font-mono">Bearer</code> prefix is required. <code className="font-mono">Authorization: pk_...</code> alone won't work.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>API key was deleted.</strong> Check your dashboard's API Keys page &mdash; if it's not there, generate a new one.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Typo or truncation.</strong> A valid key is exactly 35 characters: <code className="font-mono">pk_</code> + 32 hex characters. Anything shorter or longer is rejected.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>JWT expired.</strong> Dashboard sessions last 24 hours. If you're calling backend endpoints with a JWT, log in again to get a fresh token.</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Example response</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "detail": "Invalid or missing API key"
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        Open your dashboard, copy the API key fresh, paste it into your code (or update your
        environment variable), retry. If the key was lost, generate a new one &mdash; we can't
        recover the plaintext of an existing key. See the{' '}
        <a href="/help/article/api-key-security-best-practices" className="text-blue-600 hover:underline">
          API Key Best Practices guide
        </a>.
      </p>

      {/* 402 */}
      <h2 id="err-402" className="text-2xl font-bold text-gray-900 mt-10 mb-4">402 &mdash; Payment Required (Quota Exhausted)</h2>
      <p className="text-gray-700 leading-relaxed">
        You've used all the screenshots included in your tier this month. The 402 isn't a
        billing failure &mdash; it's a quota signal.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Tier quotas</h3>
      <div className="overflow-x-auto my-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Tier</th>
              <th className="text-left p-3 font-semibold text-gray-900">Screenshots / month</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Free</td>
              <td className="p-3">100</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Pro</td>
              <td className="p-3">5,000</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Business</td>
              <td className="p-3">50,000</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200">Premium</td>
              <td className="p-3">Unlimited</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Wait for your monthly cycle to reset (the dashboard shows the reset date)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Or upgrade to a higher tier &mdash; takes 30 seconds, applies instantly. See <a href="/help/article/managing-your-subscription" className="text-blue-600 hover:underline">Managing Your Subscription</a></span>
        </li>
      </ul>

      {/* 403 */}
      <h2 id="err-403" className="text-2xl font-bold text-gray-900 mt-10 mb-4">403 &mdash; Forbidden (Tier-Gated Feature)</h2>
      <p className="text-gray-700 leading-relaxed">
        Authentication worked, but the feature you're trying to use requires a higher tier
        than your current one.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Common causes</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Batch processing on Free tier.</strong> Batch is Pro and above (50 URLs on Pro, 200 on Business, 1,000 on Premium).</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Premium-only feature.</strong> Some operations (when they ship) are gated to specific tiers.</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        The <code className="font-mono">detail</code> field tells you which tier the feature
        requires. Upgrade through{' '}
        <a href="/pricing" className="text-blue-600 hover:underline">/pricing</a>, then retry.
        Tier changes apply within seconds.
      </p>

      {/* 404 */}
      <h2 id="err-404" className="text-2xl font-bold text-gray-900 mt-10 mb-4">404 &mdash; Not Found</h2>
      <p className="text-gray-700 leading-relaxed">
        The endpoint or resource you requested doesn't exist on our side.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Common causes</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Endpoint URL typo.</strong> The base URL is <code className="font-mono">https://api.pixelperfectapi.net</code>. Common path mistakes: <code className="font-mono">/v1/screenshot</code> instead of <code className="font-mono">/api/v1/screenshot</code>.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Batch job ID doesn't exist.</strong> Either the ID is wrong, or the job belonged to a different account.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Screenshot URL expired.</strong> R2-hosted screenshots are deleted after 7 days. The metadata still exists in your dashboard, but the file is gone.</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        For endpoint typos, check the{' '}
        <a href="/help/article/making-first-api-request" className="text-blue-600 hover:underline">
          Making Your First API Request guide
        </a>{' '}
        for canonical URLs. For expired screenshots, retake the screenshot &mdash; or download
        and self-host the bytes within the 7-day window next time.
      </p>

      {/* 422 */}
      <h2 id="err-422" className="text-2xl font-bold text-gray-900 mt-10 mb-4">422 &mdash; Unprocessable Entity</h2>
      <p className="text-gray-700 leading-relaxed">
        The request body couldn't be parsed or was missing required fields. Different from a
        400: 400 means "I parsed it, but a value is invalid"; 422 means "I couldn't even parse
        it cleanly."
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Common causes</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Missing required field.</strong> Most commonly the <code className="font-mono">url</code> field on a screenshot request.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Wrong content type.</strong> Send <code className="font-mono">Content-Type: application/json</code> for the standard endpoints.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Malformed JSON.</strong> Trailing commas, unquoted keys, or smart quotes from a copy-paste are common culprits.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Wrong type.</strong> Sending <code className="font-mono">"true"</code> (a string) where we expect <code className="font-mono">true</code> (a boolean).</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Example response</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        422 responses include a structured <code className="font-mono">detail</code> array
        showing exactly which fields failed validation:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "detail": [
    {
      "loc": ["body", "url"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <p className="text-gray-700 leading-relaxed">
        The <code className="font-mono">loc</code> array in the response tells you exactly
        which field is wrong. Fix that field and retry. If you're constructing JSON manually,
        validate it through a linter before sending.
      </p>

      {/* 429 */}
      <h2 id="err-429" className="text-2xl font-bold text-gray-900 mt-10 mb-4">429 &mdash; Too Many Requests</h2>
      <p className="text-gray-700 leading-relaxed">
        You're trying to capture more screenshots simultaneously than your tier allows.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Concurrent capture limits</h3>
      <div className="overflow-x-auto my-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Tier</th>
              <th className="text-left p-3 font-semibold text-gray-900">Concurrent captures</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Free</td>
              <td className="p-3">2</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Pro</td>
              <td className="p-3">3</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200">Business / Premium</td>
              <td className="p-3">5</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Add backoff and retry.</strong> Wait 1&ndash;2 seconds and retry &mdash; usually one of your in-flight captures will have completed by then.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Use batch processing.</strong> If you're firing off many requests in parallel, batch jobs handle the concurrency for you. See <a href="/help/article/batch-processing-guide" className="text-blue-600 hover:underline">Batch Processing Guide</a>.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Or upgrade.</strong> Higher tiers allow more concurrent captures.</span>
        </li>
      </ul>

      {/* 500 */}
      <h2 id="err-500" className="text-2xl font-bold text-gray-900 mt-10 mb-4">500 &mdash; Internal Server Error</h2>
      <p className="text-gray-700 leading-relaxed">
        Something on our side crashed during the capture pipeline. We get notified
        automatically when this happens. 500 errors are rare and almost always transient.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Wait a few seconds and retry the same request</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>If you see 500s repeatedly on the same URL, it may be triggering a bug &mdash; email <a href="mailto:onetechly@gmail.com?subject=Repeated 500 errors" className="text-blue-600 hover:underline">onetechly@gmail.com</a> with the URL and timestamp</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Check our status page (when announced) for active incidents</span>
        </li>
      </ul>

      {/* 502 / 503 / 504 */}
      <h2 id="err-502" className="text-2xl font-bold text-gray-900 mt-10 mb-4">502 / 503 / 504 &mdash; Infrastructure Layer Errors</h2>
      <p className="text-gray-700 leading-relaxed">
        These come from the layer in front of our application (Cloudflare or Render's
        platform), not from our application code itself. They mean different things:
      </p>

      <ul className="space-y-3 text-gray-700 mt-4">
        <li>
          <strong className="font-mono" id="err-502-tag">502 Bad Gateway:</strong> our backend
          couldn't be reached at the moment of the request. Most often happens during a deploy
          (a new version is starting up) or a brief platform hiccup. Almost always resolves in
          under 30 seconds.
        </li>
        <li>
          <strong className="font-mono" id="err-503">503 Service Unavailable:</strong> the
          backend reached its capacity or is in a brief maintenance window. Same fix as 502 &mdash;
          retry with a short backoff.
        </li>
        <li>
          <strong className="font-mono" id="err-504">504 Gateway Timeout:</strong> the request
          ran longer than 120 seconds and the platform killed it. This is the most common
          symptom for sites that hang on slow scripts. See the{' '}
          <a href="/help/article/api-timeout-errors" className="text-blue-600 hover:underline">
            API Timeout Errors guide
          </a>{' '}
          for the full mitigation playbook.
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix for 502 and 503</h3>
      <p className="text-gray-700 leading-relaxed">
        Retry with exponential backoff: wait 1 second, then 2, then 4. If you still see 502 or
        503 after three attempts, there's likely an active incident on our end &mdash; email us.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Fix for 504</h3>
      <p className="text-gray-700 leading-relaxed">
        Don't just retry &mdash; the same URL will time out again. See the{' '}
        <a href="/help/article/api-timeout-errors" className="text-blue-600 hover:underline">
          API Timeout Errors guide
        </a>{' '}
        for what actually works (delay tuning, viewport reduction, batch jobs).
      </p>

      {/* When to contact support */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">When to Contact Support</h2>
      <p className="text-gray-700 leading-relaxed">
        Most error codes are self-explanatory once you read the <code className="font-mono">detail</code>{' '}
        field. Email{' '}
        <a href="mailto:onetechly@gmail.com?subject=API error help" className="text-blue-600 hover:underline">
          onetechly@gmail.com
        </a>{' '}
        if any of the following are true:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>You see 500/502/503 errors persisting for more than a few minutes on a stable URL</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>An error code's <code className="font-mono">detail</code> field doesn't match anything in this guide</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>You believe you've been billed for failed captures (we don't bill for them &mdash; we want to know if it happens)</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        Include in your email: the request URL, request body, full response body, timestamp,
        and (if applicable) your batch job ID. The more details you send, the faster we can
        help.
      </p>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/api-timeout-errors"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">API Timeout Errors</h4>
            <p className="text-sm text-blue-700 mb-0">The 504-specific playbook: when retrying alone won't work</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/screenshot-quality-issues"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Screenshot Quality Issues</h4>
            <p className="text-sm text-green-700 mb-0">When the request succeeds but the image isn't right</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/rate-limits-and-quotas"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Rate Limits and Quotas</h4>
            <p className="text-sm text-purple-700 mb-0">Per-tier limits explained, with optimization tips</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You have a complete error reference 🛠️</h4>
            <p className="text-green-800 text-sm mb-0">
              Every status code our API returns, the most common cause for each, and the fix.
              Bookmark this page &mdash; it's the fastest way to get unstuck when something
              unexpected comes back.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorsAndSolutionsGuide;

//===== END OF ErrorAnd SolutionGuide.jsx =====
