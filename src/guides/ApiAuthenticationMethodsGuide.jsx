// ========================================
// API AUTHENTICATION METHODS GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ApiAuthenticationMethodsGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #1 in "API Usage" category
// Verified against:
//   - backend/api_key_system.py
//   - backend/auth_deps.py
//   - backend/auth_utils.py
//   - frontend/src/contexts/AuthContext.js
// ========================================

import React from 'react';

const ApiAuthenticationMethodsGuide = () => {
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
              PixelPerfect uses two authentication systems — JWT tokens for the web app, and API
              keys for your code. This guide explains what each one is, when to use which, and how
              to authenticate your requests securely.
            </p>
          </div>
        </div>
      </div>

      {/* TL;DR */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">TL;DR — Which Should I Use?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌐</span>
            <h4 className="font-semibold text-gray-900 mb-0">Using the web app?</h4>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Don't worry about it. The web app handles a <strong>JWT token</strong> for you
            automatically when you log in. You never see it or touch it.
          </p>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💻</span>
            <h4 className="font-semibold text-gray-900 mb-0">Calling the API from code?</h4>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Use your <strong>API key</strong> (starts with <span className="font-mono">pk_</span>).
            You can see and generate it on your dashboard. Include it in the{' '}
            <span className="font-mono">Authorization</span> header.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        If you need more depth — read on. If you just need the practical "how do I call the API" bit,
        jump to <a href="#authenticating-api-calls" className="text-blue-600 hover:underline">Authenticating Your API Calls</a>.
      </p>

      {/* Two systems */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Two Systems</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Neither system is better than the other — they're designed for different jobs. Here's
        how they compare at a glance:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 text-sm font-semibold text-gray-900 border-r border-gray-200"></th>
              <th className="text-left p-3 text-sm font-semibold text-blue-900 border-r border-gray-200">
                🎫 JWT Token
              </th>
              <th className="text-left p-3 text-sm font-semibold text-purple-900">
                🔑 API Key
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900 border-r border-gray-200 bg-gray-50">Who uses it</td>
              <td className="p-3 border-r border-gray-200">Web app (you, logging in)</td>
              <td className="p-3">Your code (scripts, apps, integrations)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900 border-r border-gray-200 bg-gray-50">Lifetime</td>
              <td className="p-3 border-r border-gray-200">Short-lived (expires after 24 hours)</td>
              <td className="p-3">Long-lived (persists until you regenerate it)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900 border-r border-gray-200 bg-gray-50">How you get it</td>
              <td className="p-3 border-r border-gray-200">Auto-issued when you log in</td>
              <td className="p-3">Generated manually from the dashboard</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900 border-r border-gray-200 bg-gray-50">Format</td>
              <td className="p-3 border-r border-gray-200"><span className="font-mono">eyJhbGci...</span> (encoded JSON)</td>
              <td className="p-3"><span className="font-mono">pk_7708ff42f...</span> (35 chars)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900 border-r border-gray-200 bg-gray-50">Visible to user</td>
              <td className="p-3 border-r border-gray-200">No — hidden in browser storage</td>
              <td className="p-3">Yes — shown once on creation, then hashed</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-gray-900 border-r border-gray-200 bg-gray-50">Best for</td>
              <td className="p-3 border-r border-gray-200">Session-based browser access</td>
              <td className="p-3">Server-side code, CI/CD, automations</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* System 1: JWT */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">System 1: JWT Tokens (For the Web App)</h2>
      <p className="text-gray-700 leading-relaxed">
        A <strong>JWT</strong> (JSON Web Token) is a short-lived, digitally signed string that
        proves you're logged in. When you sign in at{' '}
        <a href="https://pixelperfectapi.net/login" className="text-blue-600 hover:underline">
          pixelperfectapi.net/login
        </a>, the backend:
      </p>
      <ol className="space-y-2 mt-4 list-decimal list-inside text-gray-700">
        <li>Verifies your username and password</li>
        <li>Issues a JWT that's valid for <strong>24 hours</strong></li>
        <li>The web app stores it under the key <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">auth_token</span> in your browser</li>
        <li>Every request the web app makes includes it automatically</li>
      </ol>

      <p className="text-gray-700 leading-relaxed mt-4">
        You never see or copy the JWT yourself. It's entirely internal to the web app — the
        browser handles it for you.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">What a JWT request looks like</h3>
      <p className="text-gray-700 leading-relaxed">
        When the web app loads your dashboard, it sends something like this behind the scenes:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`GET /users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json`}
        </pre>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">What happens when a JWT expires?</h4>
            <p className="text-blue-800 text-sm mb-0">
              After 24 hours, your JWT expires and the web app will ask you to log in again. This
              is by design — short-lived tokens limit the damage if one is ever stolen. You don't
              need to do anything to refresh it; just sign back in.
            </p>
          </div>
        </div>
      </div>

      {/* System 2: API Keys */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">System 2: API Keys (For Your Code)</h2>
      <p className="text-gray-700 leading-relaxed">
        An API key is a long-lived secret designed to be used outside the web app — from scripts,
        backend services, CI/CD pipelines, or anything else that needs to call the PixelPerfect API
        programmatically.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Key format</h3>
      <p className="text-gray-700 leading-relaxed">
        PixelPerfect API keys always follow this pattern:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <code className="text-green-400 text-sm font-mono break-all">
          pk_7708ff42f3a9b2c1d4e5f6a8b9c0d1e2
        </code>
      </div>
      <ul className="space-y-2 mt-3">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">Always starts with <span className="font-mono">pk_</span> (easy to spot in logs and config files)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">Followed by 32 hexadecimal characters (128 bits of entropy) — total length 35 characters</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">Stored as a SHA-256 hash in our database — we never see the plain text after creation</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">A shortened prefix (e.g. <span className="font-mono">pk_7708ff42f...</span>) is displayed on the dashboard so you can identify keys without exposing them</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Key lifecycle</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Unlike a JWT, an API key has no expiry date. It stays valid until one of two things happens:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">🔄 You regenerate it</h4>
          <p className="text-sm text-gray-700">
            Clicking <strong>🔄 Regenerate Key</strong> on the dashboard immediately deactivates
            the old key and creates a new one. Any code using the old key will start getting{' '}
            <span className="font-mono">401 Unauthorized</span> errors.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">🚫 You revoke it</h4>
          <p className="text-sm text-gray-700">
            Revoking marks the key inactive in our database. The key string itself still exists,
            but any request using it will be rejected.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Every time your key authenticates a request, we update its <span className="font-mono">last_used_at</span>{' '}
        timestamp — visible on your dashboard. That's your early-warning signal for unauthorized
        use: if the timestamp changes when you're not running anything, it's time to regenerate.
      </p>

      {/* Authenticating API calls */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" id="authenticating-api-calls">
        Authenticating Your API Calls
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Every authenticated PixelPerfect API call works the same way: include an{' '}
        <span className="font-mono">Authorization: Bearer &lt;key&gt;</span> header. The backend
        inspects the token — if it starts with <span className="font-mono">pk_</span>, it's
        validated as an API key; otherwise it's treated as a JWT.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Using an API key — the right way</h3>
      <p className="text-gray-700 leading-relaxed">
        For code, <strong>always use your API key</strong>, not a JWT. JWTs are session-scoped and
        expire — they're not meant to sit in your server environment for weeks.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">cURL</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "Authorization: Bearer pk_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://example.com" }'`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Python</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import os
import requests

API_KEY = os.environ["PIXELPERFECT_API_KEY"]  # never hardcode

response = requests.post(
    "https://api.pixelperfectapi.net/api/v1/screenshot",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    },
    json={"url": "https://example.com"},
)

response.raise_for_status()
print(response.json()["screenshot_url"])`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Node.js</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const API_KEY = process.env.PIXELPERFECT_API_KEY; // never hardcode

const response = await fetch(
  "https://api.pixelperfectapi.net/api/v1/screenshot",
  {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: "https://example.com" }),
  }
);

const data = await response.json();
console.log(data.screenshot_url);`}
        </pre>
      </div>

      {/* Security best practices */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Security Best Practices</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Use the right tool for the job</h4>
          <p className="text-sm text-gray-700">
            JWT for browser sessions, API key for everything else. Don't try to use a JWT in a
            background script (it'll expire in 24 hours), and don't embed an API key in frontend
            code (it's visible to anyone with DevTools).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Environment variables only</h4>
          <p className="text-sm text-gray-700">
            Never hardcode API keys. Read them from environment variables (<span className="font-mono">os.environ</span>,{' '}
            <span className="font-mono">process.env</span>) or a dedicated secrets manager. This way
            keys never end up in git history.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Monitor Last Used</h4>
          <p className="text-sm text-gray-700">
            Check the <span className="font-mono">last_used_at</span> timestamp on your dashboard
            periodically. If it updates when you weren't running anything, regenerate immediately.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Rotate on a schedule</h4>
          <p className="text-sm text-gray-700">
            Even without a breach, rotating your API key every 60–90 days is good hygiene. It limits
            the blast radius of any key that may have leaked without your knowledge.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Use HTTPS only</h4>
          <p className="text-sm text-gray-700">
            Always call PixelPerfect over HTTPS (<span className="font-mono">https://api.pixelperfectapi.net</span>).
            Sending an API key over plain HTTP exposes it to anyone on the network path.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Frequently Asked Questions</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">Why doesn't my account have an API key automatically?</h4>
          <p className="text-sm text-gray-700">
            API keys are opt-in. You need to generate one from your dashboard the first time. Most
            users only need to use the web app, so we don't create keys automatically — it keeps
            your account surface area smaller until you actually need one.{' '}
            <a href="/help/article/getting-your-api-key" className="text-blue-600 hover:underline">
              See how to generate one
            </a>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">Can I use my JWT from a Python script?</h4>
          <p className="text-sm text-gray-700">
            Technically yes — the API accepts both. But it's a bad idea. JWTs expire every 24 hours
            and there's no refresh mechanism outside the web app, so your script would break daily.
            Use an API key instead.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">Does regenerating my API key log me out of the web app?</h4>
          <p className="text-sm text-gray-700">
            No. JWT and API key are independent. Regenerating your API key invalidates the old key
            for programmatic access only — your web session stays intact until your JWT expires or
            you log out.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">Can I have multiple API keys?</h4>
          <p className="text-sm text-gray-700">
            Right now each account gets one active API key at a time. Regenerating replaces it.
            Multi-key support (separate keys per environment — dev, staging, prod) is on our roadmap.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">What happens if someone gets my API key?</h4>
          <p className="text-sm text-gray-700">
            They can make requests to PixelPerfect as you, consuming your quota and accessing your
            screenshot history. They cannot change your password, access billing details, or
            perform account-level actions — those require the JWT from a live login session.
            Regenerate the key immediately if you suspect it's been exposed.
          </p>
        </div>
      </div>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Not authenticated. Provide either JWT token or API key."</h4>
          <p className="text-sm text-gray-700">
            The <span className="font-mono">Authorization</span> header is missing entirely. Make
            sure you're sending it and that the value starts with <span className="font-mono">Bearer </span>
            (with a space).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Invalid or expired API key"</h4>
          <p className="text-sm text-gray-700 mb-2">
            The key you're sending doesn't match any active key on your account. Check:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• You copied the entire 35-character key (easy to truncate long strings)</li>
            <li>• The key hasn't been regenerated since you copied it</li>
            <li>• There are no extra spaces, line breaks, or quotes in the value</li>
            <li>• You're sending the plain key, not a URL-encoded or base64-encoded version</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Token has expired"</h4>
          <p className="text-sm text-gray-700">
            You're using a JWT that's more than 24 hours old. If this is the web app, log out and
            log back in. If this is your own code, switch to an API key instead — JWTs aren't
            designed for long-lived programmatic access.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Invalid token"</h4>
          <p className="text-sm text-gray-700">
            The server couldn't decode the token you sent. This usually means the string got
            corrupted in transit — a truncation, an extra character, or the wrong value entirely.
            Double-check that you're passing the full, unmodified token string.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/getting-your-api-key"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Getting your API key</h4>
            <p className="text-sm text-blue-700 mb-0">Step-by-step guide to generating and managing your key</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/api-key-security-best-practices"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">API key security best practices</h4>
            <p className="text-sm text-green-700 mb-0">Deeper security guidance for production deployments</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/making-first-api-request"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Making your first API request</h4>
            <p className="text-sm text-purple-700 mb-0">Put your API key to work and capture a screenshot</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Authentication is sorted 🔐</h4>
            <p className="text-green-800 text-sm mb-0">
              You know the two systems, when each applies, and how to authenticate your requests
              securely. Everything else in the API builds on this foundation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiAuthenticationMethodsGuide;