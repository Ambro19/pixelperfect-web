// ========================================
// DATA RETENTION & PRIVACY GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/DataRetentionPrivacyGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #15 in "Security & Privacy" category
// (Slug: data-retention-and-privacy in helpArticles.js)
//
// This article is for buyers (often non-technical procurement / legal) who
// need clear, honest answers to "what data do you store, for how long, and
// where?" The bar is honesty - we don't make claims we can't back.
//
// Verified facts used:
//   - FILE_RETENTION_DAYS=7 from .env.production
//   - R2 bucket: pixelperfect-screenshots (Cloudflare R2)
//   - DB: PostgreSQL on Render
//   - Sub-processors: Render, Cloudflare, Stripe, Google (SMTP)
//   - Account deletion endpoint exists in main.py
//   - No third-party trackers / analytics on captured pages (we use Playwright,
//     not embedded JS)
// ========================================

import React from 'react';

const DataRetentionPrivacyGuide = () => {
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
              Plain-English answers to the questions you'd ask before trusting a service with
              your data: what we store, where it lives, how long we keep it, who else handles
              it, and how to get it deleted. Written so you can paste relevant sections into
              your own privacy policy if you're building on top of us.
            </p>
          </div>
        </div>
      </div>

      {/* The TL;DR */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Short Version</h2>
      <p className="text-gray-700 leading-relaxed">
        We store the minimum data needed to run the service. Screenshot files are deleted
        after 7 days. Your account data lives until you delete it. We don't sell data, we
        don't use customer data to train AI models, and we don't embed third-party trackers
        in captured screenshots.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        If you read nothing else, read the table below. The rest of the article expands on
        each row.
      </p>

      {/* The big table */}
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Data type</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Where it lives</th>
              <th className="text-left p-3 font-semibold text-gray-900">Retention</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Account info</strong> (email, name)</td>
              <td className="p-3 border-r border-gray-200">PostgreSQL (Render)</td>
              <td className="p-3">Until you delete your account</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Password hash</strong></td>
              <td className="p-3 border-r border-gray-200">PostgreSQL (Render)</td>
              <td className="p-3">Until you delete your account</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>API key hashes</strong> (SHA-256)</td>
              <td className="p-3 border-r border-gray-200">PostgreSQL (Render)</td>
              <td className="p-3">Until you delete the key</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Screenshot metadata</strong> (URL, timestamp, params)</td>
              <td className="p-3 border-r border-gray-200">PostgreSQL (Render)</td>
              <td className="p-3">Until you delete your account</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Screenshot files</strong> (PNG/JPEG/PDF bytes)</td>
              <td className="p-3 border-r border-gray-200">Cloudflare R2 (encrypted at rest)</td>
              <td className="p-3"><strong>7 days</strong>, then auto-deleted</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Billing info</strong> (card details, invoices)</td>
              <td className="p-3 border-r border-gray-200">Stripe (PCI-DSS Level 1 — we never see card numbers)</td>
              <td className="p-3">Stripe's policy</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Server logs</strong> (request times, error traces)</td>
              <td className="p-3 border-r border-gray-200">Render's log retention</td>
              <td className="p-3">7 days rolling window</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Support emails</strong></td>
              <td className="p-3 border-r border-gray-200">Gmail (onetechly@gmail.com)</td>
              <td className="p-3">Indefinitely (until manually purged)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Screenshot data lifecycle */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Screenshot Data Lifecycle</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        When you submit a URL to be screenshotted, here's exactly what happens to that data:
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Capture (seconds)</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            A headless Chromium browser visits the URL you submitted. The browser session is
            ephemeral — it lives only long enough to render your page, take the screenshot,
            and shut down. We don't keep cookies, local storage, or any other browser state
            between captures. Each capture starts from a clean browser context.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Storage (seconds)</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The image bytes are uploaded to a Cloudflare R2 bucket (pixelperfect-screenshots).
            R2 encrypts data at rest. A row is written to PostgreSQL with the metadata: the URL
            you submitted, the timestamp, the parameters used (viewport, format, etc.), and
            the storage path of the file. The actual image bytes do NOT live in our database —
            only metadata.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Available to you (7 days)</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            We return a public R2 URL that you can use to fetch the image. The URL is{' '}
            <em>obscure</em> (contains a randomized identifier) but not <em>secret</em> — anyone
            with the URL can view the image. If you need durable access or stricter access
            control, download the bytes within 7 days and host them yourself.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">4</span>
            <h4 className="font-semibold text-gray-900 mb-0">Auto-deletion (after 7 days)</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            After 7 days, the image file is automatically deleted from R2. The metadata row in
            PostgreSQL remains — that's how your dashboard can still show "you took a screenshot
            of example.com on April 15" — but the file URL returns 404.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">5</span>
            <h4 className="font-semibold text-gray-900 mb-0">Metadata cleanup (account deletion)</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The metadata persists until either you delete the screenshot record from your
            dashboard, or you delete your account entirely. Account deletion cascades through
            all your screenshot records.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">If you screenshot pages with personal data</h4>
            <p className="text-blue-800 text-sm mb-0">
              The image we capture is whatever was visible on the page. If you screenshot a
              page containing your customers' personal information, that information lives
              briefly in our R2 bucket. Two practical implications: (1) the 7-day retention
              applies, so it's not long-term; (2) treat the R2 URL as sensitive — don't share
              it in places where you wouldn't share the underlying data.
            </p>
          </div>
        </div>
      </div>

      {/* What we don't do */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Don't Do</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Statements that customers reasonably worry about, with our actual position:
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🚫</span>
            We don't sell your data
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            We make money from subscriptions. We don't sell, license, or share customer data
            with advertisers, data brokers, or any third party that wants to monetize it. The
            only third parties who handle your data are the infrastructure providers we use to
            run the service (listed in the sub-processors section below).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🚫</span>
            We don't use customer data to train AI models
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            Your screenshots, the URLs you capture, and your usage patterns are not used as
            training data for any machine learning model — ours or anyone else's.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🚫</span>
            We don't embed trackers in captured pages
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            We use Playwright (a server-side browser automation framework). When we visit a URL
            to screenshot it, we visit it like any other browser — we don't inject JavaScript,
            tracking pixels, or other code into the captured page. The image you receive
            reflects what the page actually shows.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🚫</span>
            We don't keep screenshots longer than the retention window
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            Some services advertise a short retention window but quietly archive data
            internally for "analytics" or "model improvement." We don't. After 7 days, the
            screenshot file is gone from our infrastructure. We can't show it to you, we can't
            show it to a court order, we can't recover it from backups.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🚫</span>
            We don't read your screenshots
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            We don't OCR, classify, or otherwise programmatically inspect the contents of
            screenshots you capture. The only automated processes that touch your image bytes
            are the capture pipeline (Playwright → R2) and the retention sweeper (delete after
            7 days).
          </p>
        </div>
      </div>

      {/* Sub-processors */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sub-Processors</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        We rely on these third-party infrastructure providers to deliver the service. Each
        has its own published privacy practices and security certifications. Anyone vetting
        us for a procurement process should also vet these:
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Provider</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Role</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Data they hold</th>
              <th className="text-left p-3 font-semibold text-gray-900">Region</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Render</strong></td>
              <td className="p-3 border-r border-gray-200">App hosting + PostgreSQL</td>
              <td className="p-3 border-r border-gray-200">Account info, screenshot metadata, server logs</td>
              <td className="p-3">US (Oregon)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Cloudflare</strong></td>
              <td className="p-3 border-r border-gray-200">R2 file storage, CDN, DNS</td>
              <td className="p-3 border-r border-gray-200">Screenshot image bytes (7 days)</td>
              <td className="p-3">Global</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Stripe</strong></td>
              <td className="p-3 border-r border-gray-200">Payment processing</td>
              <td className="p-3 border-r border-gray-200">Card details, billing address, invoices</td>
              <td className="p-3">US / EU</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Google (Gmail SMTP)</strong></td>
              <td className="p-3 border-r border-gray-200">Transactional email delivery</td>
              <td className="p-3 border-r border-gray-200">Email recipient + email body (in transit)</td>
              <td className="p-3">US</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed">
        We're working on migrating transactional email from Gmail SMTP to a dedicated provider
        (SendGrid or AWS SES). The rest of the stack is intentional — Render and Cloudflare in
        particular are well-regarded for security, and Stripe is the standard for payment
        processing. Each provider's data handling is governed by their own terms; we recommend
        reviewing them as part of your procurement process.
      </p>

      {/* Your rights */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
      <p className="text-gray-700 leading-relaxed">
        Regardless of where you live, you can do all of the following at any time:
      </p>

      <div className="space-y-3 my-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Access your data</h4>
          <p className="text-sm text-gray-700 mb-0">
            Your dashboard shows everything we store about you: account details, API keys,
            screenshot history. For a machine-readable export of all your data, email{' '}
            <a href="mailto:onetechly@gmail.com?subject=Data export request" className="text-blue-600 hover:underline">
              onetechly@gmail.com
            </a>{' '}
            with subject "Data export request" — we'll respond within 30 days with a JSON dump.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Correct your data</h4>
          <p className="text-sm text-gray-700 mb-0">
            Update your email and profile info from the Account page in your dashboard.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Delete your data</h4>
          <p className="text-sm text-gray-700 mb-0">
            Use the "Delete Account" option in your dashboard, or email us. Account deletion
            cascades through all your screenshot records, API keys, and metadata. The only
            things that persist after deletion are: (1) Stripe billing records (required for
            tax/legal compliance, retained per Stripe's policy), and (2) anonymized aggregate
            usage stats (e.g., "100,000 screenshots captured in March 2026").
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Object to processing</h4>
          <p className="text-sm text-gray-700 mb-0">
            We process your data only to provide the service. There's no marketing-list
            sign-up to opt out of (we don't have one). If you don't want us to process your
            data anymore, the answer is to delete your account.
          </p>
        </div>
      </div>

      {/* Account deletion */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Account Deletion Works</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        When you click "Delete Account" in the dashboard:
      </p>
      <ol className="space-y-2 text-gray-700 ml-6 list-decimal">
        <li>You're prompted to confirm with your password (so a stolen session can't delete your account)</li>
        <li>The system marks your account for deletion immediately</li>
        <li>All API keys are revoked within seconds — any integrations using them stop working</li>
        <li>All your screenshot metadata rows are deleted from PostgreSQL</li>
        <li>Any remaining screenshot files in R2 are deleted on the next retention sweep (within 24 hours)</li>
        <li>Your Stripe subscription is canceled (no further charges)</li>
        <li>Stripe billing records are retained per Stripe's policy and applicable tax law</li>
      </ol>

      <p className="text-gray-700 leading-relaxed mt-4">
        Account deletion is <strong>permanent and immediate</strong>. There's no undo, no grace
        period, no recovery. If you delete and then want to come back, you'll start fresh with
        a new account.
      </p>

      {/* Security incident reporting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reporting Security Issues</h2>
      <p className="text-gray-700 leading-relaxed">
        If you believe you've found a security vulnerability — in our service, our website, or
        the way we handle data — please email{' '}
        <a href="mailto:onetechly@gmail.com?subject=Security report" className="text-blue-600 hover:underline">
          onetechly@gmail.com
        </a>{' '}
        with the subject "Security report". We'll acknowledge within 48 hours and work with you
        on disclosure timing. We don't currently have a formal bug bounty program, but we
        appreciate responsible disclosure and will publicly credit researchers who help us
        improve.
      </p>

      <p className="text-gray-700 leading-relaxed mt-3">
        For data breach notifications affecting you specifically, we follow applicable law
        (GDPR Article 34 for EU users — notification within 72 hours of becoming aware, by
        email to your registered address). At our current scale we have no breach history to
        report.
      </p>

      {/* Things we're working on */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">On Our Security Roadmap</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Things we don't have yet but plan to add as the company grows. We list them here so
        procurement teams can see honestly where we are on the security maturity curve:
      </p>

      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>SOC 2 Type 2 audit</strong> — planned post first paying user. We'll publish the report once it lands.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Two-factor authentication</strong> — on the roadmap. Currently password-based only.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>SSO / SAML</strong> — planned for Business and Premium tiers.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Custom retention windows</strong> — currently 7 days for everyone. Premium customers may eventually choose 30 / 90 days.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Data Processing Agreement (DPA) template</strong> — being drafted for EU customers. Until it ships, email us and we'll work through your requirements.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Migration off Gmail SMTP</strong> — to a dedicated transactional email provider for stronger reliability and audit trail.</span>
        </li>
      </ul>

      {/* Contact */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy Questions?</h2>
      <p className="text-gray-700 leading-relaxed">
        Email{' '}
        <a href="mailto:onetechly@gmail.com?subject=Privacy question" className="text-blue-600 hover:underline">
          onetechly@gmail.com
        </a>{' '}
        with the subject "Privacy question" or use the{' '}
        <a href="/contact" className="text-blue-600 hover:underline">contact form</a>.
        For procurement questionnaires (SIG, CAIQ, custom security questionnaires), include the
        document — we'll fill it out and return it. We try to respond to privacy and compliance
        questions within 2 business days.
      </p>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/account-security"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">How We Secure Your Account</h4>
            <p className="text-sm text-blue-700 mb-0">Password hashing, JWT tokens, and HTTPS in plain English</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/gdpr-compliance"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">GDPR & Compliance</h4>
            <p className="text-sm text-green-700 mb-0">EU compliance position, data subject rights, what we have and don't yet</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/api-key-security-best-practices"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">API Key Best Practices</h4>
            <p className="text-sm text-purple-700 mb-0">How to handle keys safely on your side</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Now you can vouch for us 🛡️</h4>
            <p className="text-green-800 text-sm mb-0">
              You know what data we collect, where it lives, how long we keep it, who else
              touches it, and what we deliberately don't do with it. If you're building on top
              of PixelPerfect and need to update your own privacy policy, the sub-processor
              table and retention table above are written to be paste-friendly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRetentionPrivacyGuide;

// ===== END OF DataRetentionPrivacyGuide.JSX =====