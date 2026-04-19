// ========================================
// GETTING YOUR API KEY GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/GettingYourApiKeyGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Guide #3 in "Getting Started" category
// Walks users through generating and managing their API key
// ========================================

import React from 'react';

const GettingYourApiKeyGuide = () => {
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
              In this guide, you'll learn how to generate your PixelPerfect API key, copy it safely,
              and manage it afterwards — including regenerating it if it's ever compromised.
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Before You Begin</h2>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            A PixelPerfect account (don't have one yet?{' '}
            <a href="/help/article/how-to-create-account" className="text-blue-600 hover:underline">
              Create one here
            </a>)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">A safe place to store your API key — a password manager works best</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">About 4 minutes of your time</span>
        </li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">What is an API key?</h4>
            <p className="text-blue-800 text-sm mb-0">
              Your API key is a secret token that authenticates your requests to PixelPerfect.
              Think of it as a password for your code — every time your application asks for a
              screenshot, it sends the key so we know the request is really from you.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Go to Your Dashboard</h2>
      <p className="text-gray-700 leading-relaxed">
        After signing in at{' '}
        <a href="https://pixelperfectapi.net/login" className="text-blue-600 hover:underline">
          pixelperfectapi.net/login
        </a>, you'll be taken to your Dashboard automatically. If you're already logged in, navigate to:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <code className="text-green-400 text-sm font-mono">
          https://pixelperfectapi.net/dashboard
        </code>
      </div>

      {/* Step 2 */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Find the "Your API Key" Section</h2>
      <p className="text-gray-700 leading-relaxed">
        Scroll down past the <strong>Subscription Status</strong> panel. You'll see a card titled
        {' '}<strong>🔑 Your API Key</strong>.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        If this is your first time, you'll see the message <em>"You don't have an API key yet."</em>
        {' '}along with a blue <strong>➕ Create API Key</strong> button. That's what you'll click next.
      </p>

      {/* Step 3 */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Create Your API Key</h2>
      <p className="text-gray-700 leading-relaxed">
        Click the <strong>➕ Create API Key</strong> button. The button will briefly show
        {' '}<em>"⏳ Creating..."</em> while we generate a fresh, unique key for your account.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Within a second or two, your new API key will appear in a yellow warning card. It will look
        something like this:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <code className="text-green-400 text-sm font-mono break-all">
          pk_7708ff42f3a9b2c1d4e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c
        </code>
      </div>

      {/* Step 4 — The critical moment */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 4: Copy and Save It Immediately</h2>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">This is the only time you'll see the full key</h4>
            <p className="text-yellow-800 text-sm mb-0">
              For security, PixelPerfect never stores your key in readable form — only a secure hash.
              After you leave this page or refresh it, only the key's prefix (e.g.{' '}
              <span className="font-mono">pk_7708ff42f...</span>) will be visible. Copy it now.
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Click the green <strong>📋 Copy</strong> button next to your key. You'll see it change to
        {' '}<strong>✅ Copied!</strong> for about 2 seconds, confirming the key is now on your clipboard.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Immediately paste it somewhere safe. Good options include:
      </p>
      <ul className="space-y-2 mt-3">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">A password manager (1Password, Bitwarden, LastPass, Apple Keychain)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">A <span className="font-mono">.env</span> file in your project (and make sure it's in <span className="font-mono">.gitignore</span>)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">Your hosting provider's secrets manager (AWS Secrets Manager, Render environment variables, Vercel environment variables)</span>
        </li>
      </ul>

      {/* Step 5 — Quick test */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 5: Test Your API Key</h2>
      <p className="text-gray-700 leading-relaxed">
        Let's make sure your key works. Open your terminal and run this cURL command — just replace
        {' '}<span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">YOUR_API_KEY</span>{' '}
        with the key you just copied:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "width": 1920,
    "height": 1080,
    "format": "png"
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        If your key is valid, you'll get back a JSON response with a <span className="font-mono">screenshot_url</span>.
        That's your first authenticated API call — congratulations!
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">No terminal handy?</h4>
            <p className="text-blue-800 text-sm mb-0">
              You can also test your key right from your dashboard — head to the{' '}
              <strong>Take Screenshot</strong> tile under Quick Actions and capture any URL from the
              browser. No setup required.
            </p>
          </div>
        </div>
      </div>

      {/* Managing your key */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Your Key Afterwards</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Once you refresh the dashboard or come back later, the full key is hidden for security.
        Here's what you'll see and what each piece means:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Key Prefix</h4>
          <p className="text-sm text-gray-700 mb-2">
            Only the first few characters are shown (e.g. <span className="font-mono">pk_7708ff42f...</span>).
          </p>
          <p className="text-xs text-gray-600">
            Useful for identifying which key is in use without exposing the full secret.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Name</h4>
          <p className="text-sm text-gray-700 mb-2">
            The label for this key — defaults to <em>"Default API Key"</em>.
          </p>
          <p className="text-xs text-gray-600">
            Helpful when you have keys for different environments later on.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Created</h4>
          <p className="text-sm text-gray-700 mb-2">
            The date your key was generated.
          </p>
          <p className="text-xs text-gray-600">
            Good to know when planning rotation (e.g., rotate every 90 days).
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Last Used</h4>
          <p className="text-sm text-gray-700 mb-2">
            The most recent date this key authenticated a request.
          </p>
          <p className="text-xs text-gray-600">
            A sudden change here can be an early sign of unauthorized use.
          </p>
        </div>
      </div>

      {/* Regenerating */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regenerating Your Key</h2>
      <p className="text-gray-700 leading-relaxed">
        If you ever suspect your key has leaked — for example, you accidentally committed it to a
        public GitHub repo or shared it in a screenshot — regenerate it immediately.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        On your dashboard, click the red <strong>🔄 Regenerate Key</strong> button. A confirmation
        modal will appear warning you that this action will <strong>immediately invalidate</strong>
        {' '}your old key. Click <strong>Yes, Regenerate Key</strong> to proceed.
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Regeneration is instant and irreversible</h4>
            <p className="text-yellow-800 text-sm mb-0">
              The moment you confirm, your old key stops working. Any application, script, or
              integration still using it will start returning <span className="font-mono">401 Unauthorized</span>
              {' '}errors. Make sure you're ready to update your deployed code before you regenerate.
            </p>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Security Best Practices</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Your API key is as sensitive as a password. Follow these basics to keep it safe:
      </p>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Store keys in environment variables</h4>
          <p className="text-sm text-gray-700">
            Never hardcode your key directly in source code. Use a{' '}
            <span className="font-mono">.env</span> file locally, and your hosting provider's
            environment variables in production.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Add <span className="font-mono">.env</span> to <span className="font-mono">.gitignore</span></h4>
          <p className="text-sm text-gray-700">
            Before you commit anything, make sure <span className="font-mono">.env</span> is listed
            in your <span className="font-mono">.gitignore</span>. Accidentally pushing a key to a
            public repo is one of the most common ways keys get compromised.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Never expose your key in frontend code</h4>
          <p className="text-sm text-gray-700">
            API keys belong on the server, not the browser. If you need to call PixelPerfect from a
            web app, proxy the request through your own backend — that way the key stays on the server.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Rotate periodically</h4>
          <p className="text-sm text-gray-700">
            Even if nothing is wrong, rotating your key every 60–90 days is good hygiene. It limits
            the damage from any key that may have leaked without you noticing.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">✅ Revoke immediately if compromised</h4>
          <p className="text-sm text-gray-700">
            If you think your key has leaked — regenerate it right away. Don't wait to confirm,
            regenerate first and investigate after.
          </p>
        </div>
      </div>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Session expired. Please log in again."</h4>
          <p className="text-sm text-gray-700">
            Your login session has timed out. Click <strong>Go to Login</strong> and sign in again.
            Your API key is unaffected — once you log back in, you'll see it on the dashboard exactly
            as before.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Failed to copy to clipboard"</h4>
          <p className="text-sm text-gray-700">
            Some browsers block clipboard access on insecure connections or when the tab isn't
            focused. Select the key manually with your mouse and press{' '}
            <span className="font-mono">Ctrl+C</span> (or <span className="font-mono">Cmd+C</span> on Mac).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I forgot to copy my key — can you show it again?"</h4>
          <p className="text-sm text-gray-700">
            Unfortunately, no. For security, PixelPerfect never stores your key in readable form.
            If you've lost it, the solution is to regenerate — click <strong>🔄 Regenerate Key</strong>,
            which creates a new one and invalidates the old one at the same time.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">My API requests return 401 Unauthorized</h4>
          <p className="text-sm text-gray-700 mb-2">
            This means the server didn't accept your key. Check the following:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• You copied the <strong>entire</strong> key (they're long — easy to truncate)</li>
            <li>• Your request header uses <span className="font-mono">Authorization: Bearer &lt;key&gt;</span> — the word "Bearer" and the space are required</li>
            <li>• The key hasn't been regenerated since you copied it</li>
            <li>• There are no extra spaces or line breaks in the key</li>
          </ul>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Now that your API key is ready, here's what to do next:
      </p>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/making-first-api-request"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Make your first API request</h4>
            <p className="text-sm text-blue-700 mb-0">Send a complete screenshot request and explore the response</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/quick-start-guide"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Quick Start Guide</h4>
            <p className="text-sm text-green-700 mb-0">Capture your first screenshot in under 5 minutes</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/api-authentication-methods"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">API Authentication Methods</h4>
            <p className="text-sm text-purple-700 mb-0">Understand JWT tokens vs API keys for different use cases</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're authenticated! 🔑</h4>
            <p className="text-green-800 text-sm mb-0">
              Your API key is set up and ready to authenticate every request you make to PixelPerfect.
              Keep it secret, keep it safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingYourApiKeyGuide;

// // ========================================
// // GETTING YOUR API KEY GUIDE - PIXELPERFECT
// // ========================================
// // File: frontend/src/guides/GettingYourApiKeyGuide.jsx
// // Author: OneTechly
// // Update: April 2026
// //
// // Guide #3 in "Getting Started" category
// // Walks users through generating and managing their API key
// // ========================================

// import React from 'react';

// const GettingYourApiKeyGuide = () => {
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
//               In this guide, you'll learn how to generate your PixelPerfect API key, copy it safely,
//               and manage it afterwards — including regenerating it if it's ever compromised.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Prerequisites */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Before You Begin</h2>
//       <ul className="space-y-2">
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span>
//             A PixelPerfect account (don't have one yet?{' '}
//             <a href="/help/article/how-to-create-account" className="text-blue-600 hover:underline">
//               Create one here
//             </a>)
//           </span>
//         </li>
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span>A safe place to store your API key — a password manager works best</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span>About 4 minutes of your time</span>
//         </li>
//       </ul>

//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">What is an API key?</h4>
//             <p className="text-blue-800 text-sm mb-0">
//               Your API key is a secret token that authenticates your requests to PixelPerfect.
//               Think of it as a password for your code — every time your application asks for a
//               screenshot, it sends the key so we know the request is really from you.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Step 1 */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Go to Your Dashboard</h2>
//       <p className="text-gray-700 leading-relaxed">
//         After signing in at{' '}
//         <a href="https://pixelperfectapi.net/login" className="text-blue-600 hover:underline">
//           pixelperfectapi.net/login
//         </a>, you'll be taken to your Dashboard automatically. If you're already logged in, navigate to:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <code className="text-green-400 text-sm font-mono">
//           https://pixelperfectapi.net/dashboard
//         </code>
//       </div>

//       {/* Step 2 */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Find the "Your API Key" Section</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Scroll down past the <strong>Subscription Status</strong> panel. You'll see a card titled
//         {' '}<strong>🔑 Your API Key</strong>.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         If this is your first time, you'll see the message <em>"You don't have an API key yet."</em>
//         {' '}along with a blue <strong>➕ Create API Key</strong> button. That's what you'll click next.
//       </p>

//       {/* Step 3 */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Create Your API Key</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Click the <strong>➕ Create API Key</strong> button. The button will briefly show
//         {' '}<em>"⏳ Creating..."</em> while we generate a fresh, unique key for your account.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         Within a second or two, your new API key will appear in a yellow warning card. It will look
//         something like this:
//       </p>
//       <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
//         <code className="text-green-400 text-sm font-mono break-all">
//           pp_live_7f3a9b2c1d4e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e
//         </code>
//       </div>

//       {/* Step 4 — The critical moment */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 4: Copy and Save It Immediately</h2>

//       <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">This is the only time you'll see the full key</h4>
//             <p className="text-yellow-800 text-sm mb-0">
//               For security, PixelPerfect never stores your key in readable form — only a secure hash.
//               After you leave this page or refresh it, only the key's prefix (e.g.{' '}
//               <span className="font-mono">pp_live_7f3a9b2c...</span>) will be visible. Copy it now.
//             </p>
//           </div>
//         </div>
//       </div>

//       <p className="text-gray-700 leading-relaxed">
//         Click the green <strong>📋 Copy</strong> button next to your key. You'll see it change to
//         {' '}<strong>✅ Copied!</strong> for about 2 seconds, confirming the key is now on your clipboard.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         Immediately paste it somewhere safe. Good options include:
//       </p>
//       <ul className="space-y-2 mt-3">
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span>A password manager (1Password, Bitwarden, LastPass, Apple Keychain)</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span>A <span className="font-mono">.env</span> file in your project (and make sure it's in <span className="font-mono">.gitignore</span>)</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span>Your hosting provider's secrets manager (AWS Secrets Manager, Render environment variables, Vercel environment variables)</span>
//         </li>
//       </ul>

//       {/* Step 5 — Quick test */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 5: Test Your API Key</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Let's make sure your key works. Open your terminal and run this cURL command — just replace
//         {' '}<span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">YOUR_API_KEY</span>{' '}
//         with the key you just copied:
//       </p>

//       <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://example.com",
//     "width": 1920,
//     "height": 1080,
//     "format": "png"
//   }'`}
//         </pre>
//       </div>

//       <p className="text-gray-700 leading-relaxed">
//         If your key is valid, you'll get back a JSON response with a <span className="font-mono">screenshot_url</span>.
//         That's your first authenticated API call — congratulations!
//       </p>

//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">No terminal handy?</h4>
//             <p className="text-blue-800 text-sm mb-0">
//               You can also test your key right from your dashboard — head to the{' '}
//               <strong>Take Screenshot</strong> tile under Quick Actions and capture any URL from the
//               browser. No setup required.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Managing your key */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Your Key Afterwards</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Once you refresh the dashboard or come back later, the full key is hidden for security.
//         Here's what you'll see and what each piece means:
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2">Key Prefix</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             Only the first few characters are shown (e.g. <span className="font-mono">pp_live_7f3a9b2c...</span>).
//           </p>
//           <p className="text-xs text-gray-600">
//             Useful for identifying which key is in use without exposing the full secret.
//           </p>
//         </div>

//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2">Name</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             The label for this key — defaults to <em>"Default API Key"</em>.
//           </p>
//           <p className="text-xs text-gray-600">
//             Helpful when you have keys for different environments later on.
//           </p>
//         </div>

//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2">Created</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             The date your key was generated.
//           </p>
//           <p className="text-xs text-gray-600">
//             Good to know when planning rotation (e.g., rotate every 90 days).
//           </p>
//         </div>

//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-2">Last Used</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             The most recent date this key authenticated a request.
//           </p>
//           <p className="text-xs text-gray-600">
//             A sudden change here can be an early sign of unauthorized use.
//           </p>
//         </div>
//       </div>

//       {/* Regenerating */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regenerating Your Key</h2>
//       <p className="text-gray-700 leading-relaxed">
//         If you ever suspect your key has leaked — for example, you accidentally committed it to a
//         public GitHub repo or shared it in a screenshot — regenerate it immediately.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         On your dashboard, click the red <strong>🔄 Regenerate Key</strong> button. A confirmation
//         modal will appear warning you that this action will <strong>immediately invalidate</strong>
//         {' '}your old key. Click <strong>Yes, Regenerate Key</strong> to proceed.
//       </p>

//       <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Regeneration is instant and irreversible</h4>
//             <p className="text-yellow-800 text-sm mb-0">
//               The moment you confirm, your old key stops working. Any application, script, or
//               integration still using it will start returning <span className="font-mono">401 Unauthorized</span>
//               {' '}errors. Make sure you're ready to update your deployed code before you regenerate.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Security Best Practices */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Security Best Practices</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Your API key is as sensitive as a password. Follow these basics to keep it safe:
//       </p>

//       <div className="space-y-4">
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">✅ Store keys in environment variables</h4>
//           <p className="text-sm text-gray-700">
//             Never hardcode your key directly in source code. Use a{' '}
//             <span className="font-mono">.env</span> file locally, and your hosting provider's
//             environment variables in production.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">✅ Add <span className="font-mono">.env</span> to <span className="font-mono">.gitignore</span></h4>
//           <p className="text-sm text-gray-700">
//             Before you commit anything, make sure <span className="font-mono">.env</span> is listed
//             in your <span className="font-mono">.gitignore</span>. Accidentally pushing a key to a
//             public repo is one of the most common ways keys get compromised.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">✅ Never expose your key in frontend code</h4>
//           <p className="text-sm text-gray-700">
//             API keys belong on the server, not the browser. If you need to call PixelPerfect from a
//             web app, proxy the request through your own backend — that way the key stays on the server.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">✅ Rotate periodically</h4>
//           <p className="text-sm text-gray-700">
//             Even if nothing is wrong, rotating your key every 60–90 days is good hygiene. It limits
//             the damage from any key that may have leaked without you noticing.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">✅ Revoke immediately if compromised</h4>
//           <p className="text-sm text-gray-700">
//             If you think your key has leaked — regenerate it right away. Don't wait to confirm,
//             regenerate first and investigate after.
//           </p>
//         </div>
//       </div>

//       {/* Troubleshooting */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>

//       <div className="space-y-4">
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"Session expired. Please log in again."</h4>
//           <p className="text-sm text-gray-700">
//             Your login session has timed out. Click <strong>Go to Login</strong> and sign in again.
//             Your API key is unaffected — once you log back in, you'll see it on the dashboard exactly
//             as before.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"Failed to copy to clipboard"</h4>
//           <p className="text-sm text-gray-700">
//             Some browsers block clipboard access on insecure connections or when the tab isn't
//             focused. Select the key manually with your mouse and press{' '}
//             <span className="font-mono">Ctrl+C</span> (or <span className="font-mono">Cmd+C</span> on Mac).
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">"I forgot to copy my key — can you show it again?"</h4>
//           <p className="text-sm text-gray-700">
//             Unfortunately, no. For security, PixelPerfect never stores your key in readable form.
//             If you've lost it, the solution is to regenerate — click <strong>🔄 Regenerate Key</strong>,
//             which creates a new one and invalidates the old one at the same time.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">My API requests return 401 Unauthorized</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             This means the server didn't accept your key. Check the following:
//           </p>
//           <ul className="text-sm text-gray-600 space-y-1 ml-4">
//             <li>• You copied the <strong>entire</strong> key (they're long — easy to truncate)</li>
//             <li>• Your request header uses <span className="font-mono">Authorization: Bearer &lt;key&gt;</span> — the word "Bearer" and the space are required</li>
//             <li>• The key hasn't been regenerated since you copied it</li>
//             <li>• There are no extra spaces or line breaks in the key</li>
//           </ul>
//         </div>
//       </div>

//       {/* Next Steps */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Now that your API key is ready, here's what to do next:
//       </p>

//       <div className="grid grid-cols-1 gap-4">
//         <a
//           href="/help/article/making-first-api-request"
//           className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-blue-900 mb-1">Make your first API request</h4>
//             <p className="text-sm text-blue-700 mb-0">Send a complete screenshot request and explore the response</p>
//           </div>
//           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/quick-start-guide"
//           className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-green-900 mb-1">Quick Start Guide</h4>
//             <p className="text-sm text-green-700 mb-0">Capture your first screenshot in under 5 minutes</p>
//           </div>
//           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/api-authentication-methods"
//           className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-purple-900 mb-1">API Authentication Methods</h4>
//             <p className="text-sm text-purple-700 mb-0">Understand JWT tokens vs API keys for different use cases</p>
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
//             <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're authenticated! 🔑</h4>
//             <p className="text-green-800 text-sm mb-0">
//               Your API key is set up and ready to authenticate every request you make to PixelPerfect.
//               Keep it secret, keep it safe.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GettingYourApiKeyGuide;