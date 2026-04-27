// ========================================
// API KEY BEST PRACTICES GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ApiKeyBestPracticesGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #14 in "Security & Privacy" category
// (Slug: api-key-best-practices in helpArticles.js)
//
// This is the security article a developer reads RIGHT BEFORE pasting their
// API key into a project. The bar for accuracy is high — every claim is
// verifiable against backend/api_key_system.py.
//
// Verified facts used:
//   - API key format: pk_ + 32 hex chars = 35 total
//   - Storage: SHA-256 hashed in DB (api_key_system.py:hash_api_key)
//   - Plaintext shown ONCE at creation, never recoverable
//   - Multiple keys per user supported, named, deletable
//   - Auth flow: Authorization: Bearer <key> header
// ========================================

import React from 'react';

const ApiKeyBestPracticesGuide = () => {
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
              How to store, rotate, and use your PixelPerfect API key safely. The mistakes that
              get keys leaked on GitHub, the pattern for separating dev/staging/production keys,
              and the exact steps to take if your key is exposed. By the end you'll know how
              we store the key on our side too — and why that matters when you're deciding
              whether to trust us with it.
            </p>
          </div>
        </div>
      </div>

      {/* Why this matters */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why API Key Hygiene Matters</h2>
      <p className="text-gray-700 leading-relaxed">
        An API key is a password. Anyone who has it can act as you — capture screenshots from
        your account, burn through your quota, and depending on the service, run up real money.
        The most common way API keys leak isn't sophisticated hacking; it's developers
        accidentally committing them to public GitHub repos, pasting them in Stack Overflow
        questions, or hard-coding them in mobile apps that get reverse-engineered.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        This article is the playbook for not making those mistakes. The patterns below take
        five extra minutes to set up the first time, then save you from waking up to a quota
        exhaustion email a month later.
      </p>

      {/* How keys are stored on our side */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Store Your Key</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Before we get to your responsibilities, here's what happens on our side when you
        generate a key. This is verifiable from our codebase:
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">We generate a random key</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Each key is the prefix <span className="font-mono">pk_</span> followed by 32
            hexadecimal characters generated from a cryptographically secure random source —
            <span className="font-mono"> pk_a1b2c3d4e5f6...</span>. That's 128 bits of entropy.
            Brute-forcing it would take longer than the heat death of the universe.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">We show you the key once, then hash it</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The plaintext key appears in your dashboard exactly once, at creation time. After
            that, only a SHA-256 hash of the key is stored in our database. We literally cannot
            show you your key again — if you lose it, the only path forward is to revoke it
            and create a new one. This is by design.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Each request re-hashes and compares</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            When you send a request with{' '}
            <span className="font-mono">Authorization: Bearer pk_...</span>, we hash the key
            on receipt and compare against what's in the database. If a database backup ever
            leaked, an attacker would get hashes — not usable keys.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Why "show once, never again" is a feature</h4>
            <p className="text-blue-800 text-sm mb-0">
              Some services let you view your API key in the dashboard at any time. That's
              convenient — and it's a security weakness. If your dashboard session is ever
              hijacked (XSS, stolen cookie, lost laptop), the attacker can read out every key
              you've ever made. Our model means a compromised dashboard session can revoke
              your keys but can't read them. That's the right trade-off.
            </p>
          </div>
        </div>
      </div>

      {/* The big rules */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Five Rules</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Rule 1: Never put a key in source code</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        This is the rule that fails most often. Hard-coding a key in a file feels harmless
        until that file ends up in a public repo, a screenshot in a tweet, or a dependency
        that gets published to npm. Use environment variables instead.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2 text-sm flex items-center gap-2">
            <span className="text-lg">❌</span> Don't do this
          </h4>
          <pre className="text-xs bg-white p-2 rounded border border-red-200 overflow-x-auto"><code>{`// app.js
const API_KEY = "pk_a1b2c3d4e5f67890...";

fetch("https://api.pixelperfectapi.net/api/v1/screenshot", {
  headers: { Authorization: \`Bearer \${API_KEY}\` },
  ...
});`}</code></pre>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2 text-sm flex items-center gap-2">
            <span className="text-lg">✅</span> Do this instead
          </h4>
          <pre className="text-xs bg-white p-2 rounded border border-green-200 overflow-x-auto"><code>{`// app.js
const API_KEY = process.env.PIXELPERFECT_API_KEY;

fetch("https://api.pixelperfectapi.net/api/v1/screenshot", {
  headers: { Authorization: \`Bearer \${API_KEY}\` },
  ...
});

// .env (gitignored)
PIXELPERFECT_API_KEY=pk_a1b2c3d4...`}</code></pre>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Make sure <span className="font-mono">.env</span> is in your <span className="font-mono">.gitignore</span>.
        Add an <span className="font-mono">.env.example</span> file with empty placeholder
        values so teammates know which variables to set without seeing real keys.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Rule 2: Never call the API from the browser</h3>
      <p className="text-gray-700 leading-relaxed">
        This trips up developers building single-page apps. If your React, Vue, or Angular code
        calls the PixelPerfect API directly with a key, that key is in the browser's network
        tab — anyone can copy it. <strong>Always proxy through your own backend.</strong>
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-4">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">The right pattern:</h4>
        <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto"><code>{`Browser  →  YOUR backend  →  PixelPerfect API
            (key lives here)
            (auth your user first)
            (rate-limit per user)
            (return result to browser)`}</code></pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Your backend holds the PixelPerfect key, authenticates your own user, and forwards the
        screenshot request. The browser never sees the PixelPerfect key. Bonus: you can now
        rate-limit per user, log usage, and add features without changing what the browser does.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Rule 3: One key per environment</h3>
      <p className="text-gray-700 leading-relaxed">
        Don't use the same key for development, staging, and production. Generate a separate
        key for each, name them clearly in the dashboard, and store each in the matching
        environment's secret store.
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Environment</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Key name (dashboard)</th>
              <th className="text-left p-3 font-semibold text-gray-900">Storage location</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Local dev</strong></td>
              <td className="p-3 border-r border-gray-200 font-mono text-xs">myapp-dev-alice</td>
              <td className="p-3">.env file (gitignored)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Staging</strong></td>
              <td className="p-3 border-r border-gray-200 font-mono text-xs">myapp-staging</td>
              <td className="p-3">Render / Vercel / Heroku env vars</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Production</strong></td>
              <td className="p-3 border-r border-gray-200 font-mono text-xs">myapp-production</td>
              <td className="p-3">Cloud secret manager (recommended)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Why the effort? If a developer's laptop is stolen, you only need to revoke the dev key,
        not your production key. If a staging server is compromised, production keeps working.
        Per-environment keys make incident response much smaller in scope.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Rule 4: Use a real secret manager in production</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        Environment variables are fine for staging. For production, graduate to a real secret
        manager when you can. They give you encryption at rest, audit logs of every read, and
        rotation tooling.
      </p>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>AWS Secrets Manager</strong> — best fit if you're already on AWS</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>HashiCorp Vault</strong> — cloud-agnostic, fine-grained access policies</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Doppler / Infisical</strong> — developer-friendly, sync across environments</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>1Password Secrets / Bitwarden</strong> — works well for small teams</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Rule 5: Rotate keys periodically</h3>
      <p className="text-gray-700 leading-relaxed">
        Even with perfect hygiene, rotating keys every 6–12 months is good practice. It limits
        the blast radius of an undetected leak and forces you to verify your secret-management
        process still works.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        The PixelPerfect dashboard supports multiple active keys per account, so rotation is
        zero-downtime: create the new key, deploy it everywhere, verify, then revoke the old one.
      </p>

      {/* Detecting a leak */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">If You Think Your Key Has Leaked</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Don't panic. The fix is fast, and the worst-case outcome (someone burns through your
        free quota) is recoverable. Move quickly through these steps:
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Revoke the leaked key</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Go to the API Keys page in your dashboard, find the affected key by name, and click
            Delete. The key stops working within seconds across our entire infrastructure.
            Do this <strong>first</strong>, before you fix the leak — kill the access first,
            clean up second.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Generate a replacement and deploy it</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Create a new key with a clear name. Update your secret manager, redeploy your
            services, verify they work. Don't forget background workers and cron jobs.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Find and remove the leak source</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            If the key was on GitHub, removing the file isn't enough — git history still has it.
            You need to rewrite history with{' '}
            <a href="https://github.com/newren/git-filter-repo" className="text-blue-600 hover:underline">
              git-filter-repo
            </a>{' '}
            and force-push, then notify anyone who cloned. (The key is already revoked at this
            point, so this is mainly cleanup.)
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">4</span>
            <h4 className="font-semibold text-gray-900 mb-0">Review usage during the exposure window</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Check the dashboard's usage counter for the affected period. If you see a spike that
            doesn't match your real traffic, contact{' '}
            <a href="/contact?subject=security-incident" className="text-blue-600 hover:underline">
              support
            </a>{' '}
            with the timeframe — we can help correlate which IPs hit the API.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">GitHub's secret scanning</h4>
            <p className="text-yellow-800 text-sm mb-0">
              Public commits to GitHub are scanned for known API key patterns within minutes of
              being pushed. Many providers integrate with GitHub's Secret Scanning to receive
              automatic notifications when their keys are leaked. We're working on this
              integration as part of our security roadmap. Until then, treat any commit with
              a key as exposed within the first minute.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile and edge cases */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Special Cases</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Mobile apps</h3>
      <p className="text-gray-700 leading-relaxed">
        Never put your PixelPerfect key in a mobile app binary. Decompiling apps to extract
        embedded secrets is trivial and well-documented. The right pattern is the same as the
        browser case: your mobile app talks to your backend, your backend talks to PixelPerfect.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">CI/CD pipelines</h3>
      <p className="text-gray-700 leading-relaxed">
        Use your CI provider's encrypted secrets feature (GitHub Actions Secrets, GitLab CI/CD
        variables, CircleCI contexts). Don't echo them in build logs — most providers
        auto-redact known secret names, but commands like <span className="font-mono">echo $API_KEY</span>{' '}
        in a debug step will leak it. Use a dedicated CI key, separate from production.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Sharing access with teammates</h3>
      <p className="text-gray-700 leading-relaxed">
        Don't share keys via Slack, email, or shared docs. Either:
      </p>
      <ul className="space-y-2 mt-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span>Have each developer create their own dev key (best for small teams)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span>Use a shared secret manager that handles access control (best for larger teams)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span>If you must share manually, use 1Password's "share" feature or similar one-time
            secret tools — never persistent chat or email</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Logs and error reports</h3>
      <p className="text-gray-700 leading-relaxed">
        When debugging API errors, be careful what you log. Logging the full request including
        the <span className="font-mono">Authorization</span> header writes your key into log
        files (and Sentry, DataDog, CloudWatch, or whatever else ingests them). Strip auth
        headers before logging:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// Before logging a request that failed
const safeHeaders = { ...request.headers };
delete safeHeaders.authorization;
delete safeHeaders.Authorization;
logger.error("Screenshot failed", { url, headers: safeHeaders, status });`}
        </pre>
      </div>

      {/* Quick checklist */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pre-Deploy Checklist</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Before pushing any code that uses a PixelPerfect API key, walk this checklist:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">☐</span>
            <span>The key is in an environment variable, not source code</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">☐</span>
            <span><span className="font-mono">.env</span> is in <span className="font-mono">.gitignore</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">☐</span>
            <span>The key is server-side only — never exposed to browsers or mobile apps</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">☐</span>
            <span>This environment uses its own key, distinct from other environments</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">☐</span>
            <span>The key has a descriptive name in the PixelPerfect dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">☐</span>
            <span>Logging code strips the <span className="font-mono">Authorization</span> header before writing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">☐</span>
            <span>You know how to rotate this key without downtime if needed</span>
          </li>
        </ul>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/data-retention-and-privacy"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Data Retention & Privacy</h4>
            <p className="text-sm text-blue-700 mb-0">What we store, where, and for how long</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/account-security"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">How We Secure Your Account</h4>
            <p className="text-sm text-green-700 mb-0">Password hashing, JWT tokens, and HTTPS in plain English</p>
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
            <p className="text-sm text-purple-700 mb-0">When to use API keys vs JWT tokens</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're set up safely 🔐</h4>
            <p className="text-green-800 text-sm mb-0">
              You know how we store keys, the five rules for handling them on your side, what
              to do if one leaks, and the special cases for browsers, mobile, CI, and team
              sharing. Run the pre-deploy checklist before every release and you'll stay out
              of the trouble that catches most teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyBestPracticesGuide;

// ===== END OF ApiKeyBestPracticesGuide =====