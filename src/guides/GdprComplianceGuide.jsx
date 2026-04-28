// ========================================
// GDPR & COMPLIANCE GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/GdprComplianceGuide.jsx
// Author: OneTechly
// Update: April 27, 2026 (revision 2 — tone calibration)
//
// Article #17 in "Security & Privacy" category
// (Slug: gdpr-compliance in helpArticles.js)
//
// Revision 2 changes (per founder review, after Privacy.js / Terms.js /
// Cookies.js tone alignment):
//   - "small company" → "startup" (better growth framing)
//   - Removed every instance of "honest"/"honestly" (was used 8 times in v1).
//     The legal pages don't lean on the word "honest" because they trust
//     their content to do the work. This article should do the same.
//   - Section title "An Honest Starting Position" → "A Starting Position"
//   - Reframed "What We Don't Have" → "On the Compliance Roadmap"
//     (same information, forward-looking voice)
//   - Procurement section: "Common ones we've responded to" was an
//     overclaim of past behavior — corrected to "Common formats we're
//     willing to respond to"
//   - Added orienting cross-links to /features and /pricing in the opening
//     so readers finish the article knowing where to go next, instead of
//     leaving with vague worry
//   - Contact block uses "Albany, New York" to match Privacy.js,
//     Terms.js, and Cookies.js
//   - Tone matches the calm, professional cadence of the three legal
//     pages: state facts, don't apologize, don't keep reassuring
//
// All facts and disclaimers preserved:
//   - Still NOT claiming SOC 2 / ISO 27001 / HIPAA
//   - Still no DPA template ready
//   - Still real data subject rights (GDPR Articles 15-21 with response times)
//   - Still clear sub-processor list (Render / Cloudflare / Stripe / Google)
//   - All canonical /help/article/ slugs preserved
// ========================================

import React from 'react';

const GdprComplianceGuide = () => {
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
              Where PixelPerfect stands on GDPR and other compliance frameworks today, your
              rights as a data subject, and how to exercise them. Written for EU users,
              procurement teams, and legal departments who need a clear paper trail before
              approving us for use.
            </p>
          </div>
        </div>
      </div>

      {/* A Starting Position */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">A Starting Position</h2>
      <p className="text-gray-700 leading-relaxed">
        PixelPerfect is built and operated by OneTechly, a startup based in New York State.
        We take data protection seriously and we've built the product on infrastructure that
        meets a high bar &mdash; while being clear that we're a young company, not a
        multi-thousand-employee enterprise with a compliance team and a wall of audit
        certificates. This article tells you exactly where we stand so you can make an
        informed decision.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        For the full picture of what PixelPerfect can do today, see our{' '}
        <a href="/features" className="text-blue-600 hover:underline">Features page</a> and{' '}
        <a href="/pricing" className="text-blue-600 hover:underline">Pricing page</a>. This
        article focuses specifically on data protection, compliance posture, and your rights.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Three sections below cover, in order: the protections we provide today, what's on
        the compliance roadmap, and the practical mechanics of exercising your rights or
        filing a procurement questionnaire.
      </p>

      {/* What we have today */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Provide Today</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Real data subject rights</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        Whether you live in the EU, California, the UK, or anywhere else, you can exercise
        these rights at any time:
      </p>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">GDPR right</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">How to exercise it</th>
              <th className="text-left p-3 font-semibold text-gray-900">Response time</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Access</strong> (Art. 15)</td>
              <td className="p-3 border-r border-gray-200">Dashboard for live view; email for full JSON export</td>
              <td className="p-3">Within 30 days</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Rectification</strong> (Art. 16)</td>
              <td className="p-3 border-r border-gray-200">Update via Account page</td>
              <td className="p-3">Immediate</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Erasure / "Right to be forgotten"</strong> (Art. 17)</td>
              <td className="p-3 border-r border-gray-200">"Delete Account" in dashboard, or email request</td>
              <td className="p-3">Immediate (with caveats below)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Data portability</strong> (Art. 20)</td>
              <td className="p-3 border-r border-gray-200">Email request &mdash; we provide a JSON export</td>
              <td className="p-3">Within 30 days</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Object to processing</strong> (Art. 21)</td>
              <td className="p-3 border-r border-gray-200">Delete your account (we don't process for marketing)</td>
              <td className="p-3">Immediate</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Restriction of processing</strong> (Art. 18)</td>
              <td className="p-3 border-r border-gray-200">Email request</td>
              <td className="p-3">Within 30 days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        For all email-based requests, write to{' '}
        <a href="mailto:onetechly@gmail.com?subject=GDPR data subject request" className="text-blue-600 hover:underline">
          onetechly@gmail.com
        </a>{' '}
        with subject "GDPR data subject request" or use the{' '}
        <a href="/contact" className="text-blue-600 hover:underline">contact form</a>.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Clear legal basis for processing</h3>
      <p className="text-gray-700 leading-relaxed">
        Under GDPR Article 6, we process your data on these legal bases:
      </p>
      <ul className="space-y-2 mt-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Performance of a contract</strong> (Art. 6(1)(b)) &mdash; we process your account
            data and screenshot requests because you signed up to use the service</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Legitimate interest</strong> (Art. 6(1)(f)) &mdash; we keep server logs (request
            times, errors) for 7 days for service reliability and security</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Legal obligation</strong> (Art. 6(1)(c)) &mdash; Stripe retains billing records
            per applicable tax law</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        We don't rely on consent (Art. 6(1)(a)) for any processing because we don't have any
        optional processing &mdash; everything we do with your data is necessary to provide the
        service. There's no marketing-email opt-in to consider, because we don't send
        marketing emails.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Documented sub-processors</h3>
      <p className="text-gray-700 leading-relaxed">
        Every third party that handles your data is listed publicly. See the full list in the{' '}
        <a href="/help/article/data-retention-policy" className="text-blue-600 hover:underline">
          Data Retention &amp; Privacy guide
        </a>. Summary:
      </p>
      <ul className="space-y-2 mt-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Render</strong> (US, Oregon) &mdash; application hosting and PostgreSQL database</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Cloudflare</strong> (global) &mdash; R2 file storage, CDN, DNS</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Stripe</strong> (US / EU) &mdash; payment processing</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Google (Gmail SMTP)</strong> (US) &mdash; transactional email delivery</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        We commit to notifying registered users by email at least 30 days before adding any new
        sub-processor that handles personal data, so you have time to evaluate the change.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Encryption in transit and at rest</h3>
      <p className="text-gray-700 leading-relaxed">
        All connections use TLS 1.2+. Data at rest is encrypted by our cloud providers
        (Cloudflare R2 uses AES-256; Render encrypts PostgreSQL volumes). API keys and
        passwords are hashed before storage. Details in the{' '}
        <a href="/help/article/account-security" className="text-blue-600 hover:underline">
          Account Security guide
        </a>.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Short retention windows</h3>
      <p className="text-gray-700 leading-relaxed">
        Screenshot files are auto-deleted after 7 days. Server logs roll off after 7 days.
        Account data persists only until you delete your account. We process the minimum data
        for the minimum time. This is a GDPR principle (data minimization, Art. 5(1)(c)) we
        take seriously.
      </p>

      {/* International transfers */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">International Data Transfers</h2>
      <p className="text-gray-700 leading-relaxed">
        We are US-based, and the bulk of our infrastructure is US-based (Render in Oregon,
        Stripe with US legal entity, Gmail/Google in the US). For EU users, this means your
        data is transferred outside the EU.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        The legal basis for these transfers is the <strong>EU&ndash;US Data Privacy Framework</strong>{' '}
        (DPF) where applicable, and the <strong>Standard Contractual Clauses (SCCs)</strong>{' '}
        for sub-processors not certified under the DPF. Each of our sub-processors maintains
        their own GDPR-compliant transfer mechanism:
      </p>
      <ul className="space-y-2 mt-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Cloudflare</strong> publishes its DPA and SCCs at{' '}
            <a href="https://www.cloudflare.com/trust-hub/" className="text-blue-600 hover:underline">
              cloudflare.com/trust-hub
            </a></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Stripe</strong> publishes its DPA at{' '}
            <a href="https://stripe.com/legal/dpa" className="text-blue-600 hover:underline">
              stripe.com/legal/dpa
            </a></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Render</strong> publishes its DPA at{' '}
            <a href="https://render.com/legal/dpa" className="text-blue-600 hover:underline">
              render.com/legal/dpa
            </a></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Google</strong> publishes its DPA at{' '}
            <a href="https://workspace.google.com/terms/dpa_terms.html" className="text-blue-600 hover:underline">
              workspace.google.com/terms/dpa_terms.html
            </a></span>
        </li>
      </ul>

      {/* On the Compliance Roadmap (was: "What We Don't Have") */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">On the Compliance Roadmap</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Procurement teams sometimes ask about specific certifications and frameworks. Here's
        a clear view of where each one sits on our roadmap. We'll update this list as items
        ship.
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border-l-4 border-blue-400 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">SOC 2 Type 2 audit</h4>
          <p className="text-sm text-gray-700 mb-2">
            Currently <strong>not in scope</strong>. SOC 2 is a substantial engagement
            (typically $20,000&ndash;$100,000+ and 6&ndash;12 months) that makes most sense once
            commercial traction justifies the investment.
          </p>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Roadmap:</strong> planned post first paying user. We'll publish the
            attestation report once it lands and notify customers.
          </p>
        </div>

        <div className="bg-white border-l-4 border-blue-400 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">ISO 27001 certification</h4>
          <p className="text-sm text-gray-700 mb-2">
            Currently <strong>not in scope</strong>. Same reasoning as SOC 2 &mdash; substantial
            cost and engagement that fits a later stage of the company.
          </p>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Roadmap:</strong> further out than SOC 2. Most procurement teams accept
            SOC 2 as equivalent for risk evaluation purposes.
          </p>
        </div>

        <div className="bg-white border-l-4 border-blue-400 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">HIPAA compliance / BAA</h4>
          <p className="text-sm text-gray-700 mb-2">
            We <strong>do not currently sign Business Associate Agreements (BAAs)</strong>.
            PixelPerfect should not be used to capture screenshots of pages containing
            Protected Health Information (PHI).
          </p>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Roadmap:</strong> not currently planned. We'll revisit if a healthcare
            customer becomes substantial.
          </p>
        </div>

        <div className="bg-white border-l-4 border-blue-400 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">Pre-signed Data Processing Agreement (DPA)</h4>
          <p className="text-sm text-gray-700 mb-2">
            We're <strong>currently drafting</strong> a standard DPA template for EU customers.
            Until it's published, we can negotiate DPAs on a per-customer basis for those who
            require one before signing up.
          </p>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Roadmap:</strong> standard DPA template targeted for Q3 2026.
          </p>
        </div>

        <div className="bg-white border-l-4 border-blue-400 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">EU data residency option</h4>
          <p className="text-sm text-gray-700 mb-2">
            All data currently lives in US-based infrastructure (Render Oregon for the database;
            Cloudflare's global network for files). EU-only data residency isn't an option
            we offer today.
          </p>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Roadmap:</strong> on the longer-term roadmap, likely as a Premium-tier
            option once there's demand.
          </p>
        </div>

        <div className="bg-white border-l-4 border-green-400 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">PCI DSS</h4>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Not applicable on our side.</strong> We never see your payment card numbers.
            Stripe (which is PCI DSS Level 1 certified) handles all card data through their
            hosted checkout. Card details never touch our servers.
          </p>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Roadmap:</strong> not applicable while we use Stripe.
          </p>
        </div>
      </div>

      {/* Our role under GDPR */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Controller vs Processor</h2>
      <p className="text-gray-700 leading-relaxed">
        GDPR distinguishes between <strong>data controllers</strong> (who decide why and how
        data is processed) and <strong>data processors</strong> (who handle data on a
        controller's behalf). PixelPerfect plays both roles, depending on which data:
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Data</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Our role</th>
              <th className="text-left p-3 font-semibold text-gray-900">What this means</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Your account info (email, password hash)</td>
              <td className="p-3 border-r border-gray-200">Controller</td>
              <td className="p-3">We decide why we collect it (to run the service)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Screenshots you capture of YOUR own sites</td>
              <td className="p-3 border-r border-gray-200">Controller</td>
              <td className="p-3">You're capturing your own content</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200">Screenshots you capture of pages with third-party data</td>
              <td className="p-3 border-r border-gray-200">Processor (you're the controller)</td>
              <td className="p-3">You decide what to capture; we just process it</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        The third row matters for B2B customers. If your application uses PixelPerfect to
        capture pages containing your customers' data, your customers are the data subjects,
        you are the controller, and we're a processor on your behalf. In that case, you may
        need a DPA with us &mdash; see the roadmap section above.
      </p>

      {/* Third-party data subject requests */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">"Someone Screenshotted a Page Containing My Information"</h2>
      <p className="text-gray-700 leading-relaxed">
        If you're an EU resident who discovered that a third party (one of our customers) used
        PixelPerfect to capture a page that contained your personal information, here's how to
        proceed:
      </p>

      <ol className="space-y-3 mt-4 text-gray-700 ml-6 list-decimal">
        <li>
          <strong>Contact the third party first.</strong> They are the data controller for that
          screenshot. They decided which page to capture and what to do with the result. They
          have the primary responsibility for honoring your request.
        </li>
        <li>
          <strong>If they don't respond or you can't identify them,</strong> email us at{' '}
          <a href="mailto:onetechly@gmail.com?subject=Third-party data request" className="text-blue-600 hover:underline">
            onetechly@gmail.com
          </a>{' '}
          with subject "Third-party data request". Provide as much information as you can: the
          URL that was captured, an approximate timeframe, and any context about which third
          party you suspect.
        </li>
        <li>
          <strong>We will investigate</strong> and, where possible, identify and delete the
          relevant captures. Note that screenshots are auto-deleted after 7 days, so older
          captures may already be gone from our infrastructure.
        </li>
      </ol>

      {/* Procurement questionnaires */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Procurement Questionnaires</h2>
      <p className="text-gray-700 leading-relaxed">
        We're happy to fill out vendor security questionnaires. Common formats we're willing
        to respond to include SIG (Standard Information Gathering), CAIQ (Cloud Security
        Alliance Consensus Assessment), and custom questionnaires from individual procurement
        teams.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        <strong>Process:</strong> email the document (PDF, spreadsheet, or web form link) to{' '}
        <a href="mailto:onetechly@gmail.com?subject=Procurement questionnaire" className="text-blue-600 hover:underline">
          onetechly@gmail.com
        </a>. Typical turnaround is 2&ndash;5 business days depending on the questionnaire's length
        and depth.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        We'll answer every question accurately based on what's actually in place today. If
        your procurement process is gated on certifications we're still working toward, we'll
        flag that up front so you can plan accordingly &mdash; rather than discovering it weeks
        into the evaluation.
      </p>

      {/* Contact */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Compliance Contact</h2>
      <p className="text-gray-700 leading-relaxed">
        For all compliance, privacy, and data subject requests:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-4">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Email:</strong>{' '}
          <a href="mailto:onetechly@gmail.com" className="text-blue-600 hover:underline">
            onetechly@gmail.com
          </a>
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <strong>Company:</strong> OneTechly, Albany, New York, United States
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <strong>Web:</strong>{' '}
          <a href="https://pixelperfectapi.net" className="text-blue-600 hover:underline">
            pixelperfectapi.net
          </a>
        </p>
        <p className="text-sm text-gray-700 mb-0">
          <strong>Response time:</strong> 2 business days for compliance questions; up to 30
          days for full data subject requests (per GDPR Article 12(3)).
        </p>
      </div>
      <p className="text-gray-700 leading-relaxed mt-3">
        We don't currently have a designated Data Protection Officer (DPO). Under GDPR
        Article 37, we're not required to appoint one given our current scale and processing
        activities. The compliance contact above is our actual decision-maker on these matters.
      </p>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/data-retention-policy"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Data Retention &amp; Privacy</h4>
            <p className="text-sm text-blue-700 mb-0">What we store, where, and for how long &mdash; with the full sub-processor table</p>
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
            <p className="text-sm text-green-700 mb-0">The security mechanisms protecting your account, in plain English</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You have the full picture 📋</h4>
            <p className="text-green-800 text-sm mb-0">
              You know what compliance protections we provide today, what's on the roadmap,
              how to exercise your data subject rights, the international transfer mechanisms
              protecting your data, and how to file a procurement questionnaire. Reach out
              anytime &mdash; we'd rather walk you through a question than have you guess at the
              answer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GdprComplianceGuide;

// ==============================================================================
// // ========================================
// // GDPR & COMPLIANCE GUIDE - PIXELPERFECT
// // ========================================
// // File: frontend/src/guides/GdprComplianceGuide.jsx
// // Author: OneTechly
// // Update: April 2026
// //
// // Article #17 in "Security & Privacy" category
// // (Slug: gdpr-compliance in helpArticles.js)
// //
// // HONESTY-FIRST article. The audience is procurement teams, legal departments,
// // and EU users who need a clear paper trail. The cardinal sin in this category
// // is overclaiming - saying "we're SOC 2 compliant" when we're not, or "we're
// // fully GDPR compliant" without acknowledging the specific gaps.
// //
// // Key honesty checkpoints maintained:
// //   - We do NOT claim SOC 2 certification (we don't have one)
// //   - We do NOT claim ISO 27001 (we don't have one)
// //   - We do NOT have a DPA template ready (acknowledged honestly)
// //   - We DO have real data subject rights (access, deletion, portability)
// //   - We DO have a clear sub-processor list
// //
// // Verified facts used:
// //   - Sub-processors: Render, Cloudflare, Stripe, Google SMTP
// //   - Render = US (Oregon)
// //   - Cloudflare = global
// //   - Account deletion endpoint exists in main.py
// //   - 7-day file retention (.env.production)
// //
// // CROSS-REFERENCE NOTE: All internal /help/article/ links in this file
// // use the canonical slugs already registered in helpArticles.js. No
// // patching needed.
// // ========================================

// import React from 'react';

// const GdprComplianceGuide = () => {
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
//               Where PixelPerfect stands on GDPR and other compliance frameworks today, the
//               specific gaps we're honest about, your rights as a data subject, and how to
//               exercise them. Written for EU users, procurement teams, and legal departments
//               who need a clear paper trail before approving us for use.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Honest opening */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">An Honest Starting Position</h2>
//       <p className="text-gray-700 leading-relaxed">
//         PixelPerfect is built and operated by a small, US-based company (OneTechly, New York
//         State). We take privacy seriously and have built the product on infrastructure that
//         meets a high bar. We are <strong>not</strong> a multi-million-dollar enterprise with a
//         compliance team and a wall of audit certificates &mdash; and we won't pretend to be.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         This article is honest about three things:
//       </p>
//       <ul className="space-y-2 mt-3 text-gray-700">
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">1.</span>
//           <span>The compliance protections we already provide today (more than you might expect)</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">2.</span>
//           <span>The certifications we don't yet have (and aren't going to fake)</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">3.</span>
//           <span>What's on the roadmap and roughly when</span>
//         </li>
//       </ul>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         If you're evaluating us for a regulated environment (healthcare, finance, government),
//         you'll want to read all three sections carefully. If you're a developer building a
//         side project, you can probably skim.
//       </p>

//       {/* What we have */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Have Today</h2>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Real data subject rights</h3>
//       <p className="text-gray-700 leading-relaxed mb-3">
//         Whether you live in the EU, California, the UK, or anywhere else, you can exercise
//         these rights at any time:
//       </p>
//       <div className="overflow-x-auto my-4">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">GDPR right</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">How to exercise it</th>
//               <th className="text-left p-3 font-semibold text-gray-900">Response time</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200"><strong>Access</strong> (Art. 15)</td>
//               <td className="p-3 border-r border-gray-200">Dashboard for live view; email for full JSON export</td>
//               <td className="p-3">Within 30 days</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200"><strong>Rectification</strong> (Art. 16)</td>
//               <td className="p-3 border-r border-gray-200">Update via Account page</td>
//               <td className="p-3">Immediate</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200"><strong>Erasure / "Right to be forgotten"</strong> (Art. 17)</td>
//               <td className="p-3 border-r border-gray-200">"Delete Account" in dashboard, or email request</td>
//               <td className="p-3">Immediate (with caveats below)</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200"><strong>Data portability</strong> (Art. 20)</td>
//               <td className="p-3 border-r border-gray-200">Email request &mdash; we provide a JSON export</td>
//               <td className="p-3">Within 30 days</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200"><strong>Object to processing</strong> (Art. 21)</td>
//               <td className="p-3 border-r border-gray-200">Delete your account (we don't process for marketing)</td>
//               <td className="p-3">Immediate</td>
//             </tr>
//             <tr>
//               <td className="p-3 border-r border-gray-200"><strong>Restriction of processing</strong> (Art. 18)</td>
//               <td className="p-3 border-r border-gray-200">Email request</td>
//               <td className="p-3">Within 30 days</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <p className="text-gray-700 leading-relaxed mt-3">
//         For all email-based requests, write to{' '}
//         <a href="mailto:onetechly@gmail.com?subject=GDPR data subject request" className="text-blue-600 hover:underline">
//           onetechly@gmail.com
//         </a>{' '}
//         with subject "GDPR data subject request" or use the{' '}
//         <a href="/contact" className="text-blue-600 hover:underline">contact form</a>.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Clear legal basis for processing</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Under GDPR Article 6, we process your data on these legal bases:
//       </p>
//       <ul className="space-y-2 mt-2 text-gray-700">
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Performance of a contract</strong> (Art. 6(1)(b)) &mdash; we process your account
//             data and screenshot requests because you signed up to use the service</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Legitimate interest</strong> (Art. 6(1)(f)) &mdash; we keep server logs (request
//             times, errors) for 7 days for service reliability and security</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Legal obligation</strong> (Art. 6(1)(c)) &mdash; Stripe retains billing records
//             per applicable tax law</span>
//         </li>
//       </ul>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         We do <strong>not</strong> rely on consent (Art. 6(1)(a)) for any processing because we
//         don't have any optional processing &mdash; everything we do with your data is necessary to
//         provide the service. There's no "agree to receive marketing emails" checkbox to think
//         about, because we don't send marketing emails.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Documented sub-processors</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Every third party that handles your data is listed publicly. See the full list in the{' '}
//         <a href="/help/article/data-retention-policy" className="text-blue-600 hover:underline">
//           Data Retention &amp; Privacy guide
//         </a>. Summary:
//       </p>
//       <ul className="space-y-2 mt-2 text-gray-700">
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Render</strong> (US, Oregon) &mdash; application hosting and PostgreSQL database</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Cloudflare</strong> (global) &mdash; R2 file storage, CDN, DNS</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Stripe</strong> (US / EU) &mdash; payment processing</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Google (Gmail SMTP)</strong> (US) &mdash; transactional email delivery</span>
//         </li>
//       </ul>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         We commit to notifying registered users by email at least 30 days before adding any new
//         sub-processor that handles personal data, so you have time to evaluate the change.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Encryption in transit and at rest</h3>
//       <p className="text-gray-700 leading-relaxed">
//         All connections use TLS 1.2+. Data at rest is encrypted by our cloud providers
//         (Cloudflare R2 uses AES-256; Render encrypts PostgreSQL volumes). API keys and
//         passwords are hashed before storage. Details in the{' '}
//         <a href="/help/article/account-security" className="text-blue-600 hover:underline">
//           Account Security guide
//         </a>.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Short retention windows</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Screenshot files are auto-deleted after 7 days. Server logs roll off after 7 days.
//         Account data persists only until you delete your account. We process the minimum data
//         for the minimum time. This is a GDPR principle (data minimization, Art. 5(1)(c)) we
//         take seriously.
//       </p>

//       {/* International transfers */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">International Data Transfers</h2>
//       <p className="text-gray-700 leading-relaxed">
//         We are US-based, and the bulk of our infrastructure is US-based (Render in Oregon,
//         Stripe with US legal entity, Gmail/Google in the US). For EU users, this means your
//         data is transferred outside the EU.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         The legal basis for these transfers is the <strong>EU&ndash;US Data Privacy Framework</strong>{' '}
//         (DPF) where applicable, and the <strong>Standard Contractual Clauses (SCCs)</strong>{' '}
//         for sub-processors not certified under the DPF. Each of our sub-processors maintains
//         their own GDPR-compliant transfer mechanism:
//       </p>
//       <ul className="space-y-2 mt-2 text-gray-700">
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Cloudflare</strong> publishes its DPA and SCCs at{' '}
//             <a href="https://www.cloudflare.com/trust-hub/" className="text-blue-600 hover:underline">
//               cloudflare.com/trust-hub
//             </a></span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Stripe</strong> publishes its DPA at{' '}
//             <a href="https://stripe.com/legal/dpa" className="text-blue-600 hover:underline">
//               stripe.com/legal/dpa
//             </a></span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Render</strong> publishes its DPA at{' '}
//             <a href="https://render.com/legal/dpa" className="text-blue-600 hover:underline">
//               render.com/legal/dpa
//             </a></span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Google</strong> publishes its DPA at{' '}
//             <a href="https://workspace.google.com/terms/dpa_terms.html" className="text-blue-600 hover:underline">
//               workspace.google.com/terms/dpa_terms.html
//             </a></span>
//         </li>
//       </ul>

//       {/* What we don't have - the honest list */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Don't Have (Yet)</h2>
//       <p className="text-gray-700 leading-relaxed mb-4">
//         Things we've seen in procurement questionnaires that we cannot truthfully claim today.
//         Listed honestly so you can make an informed decision:
//       </p>

//       <div className="space-y-4 my-6">
//         <div className="bg-white border-l-4 border-amber-400 border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">SOC 2 Type 2 audit</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             We are <strong>not currently SOC 2 audited</strong>. SOC 2 is a substantial
//             engagement (typically $20,000&ndash;$100,000+ and 6&ndash;12 months) and we will not undertake
//             it before there's commercial traction to justify the cost.
//           </p>
//           <p className="text-sm text-gray-700 mb-0">
//             <strong>Roadmap:</strong> planned post first paying user. We'll publish the
//             attestation report once it lands and notify customers.
//           </p>
//         </div>

//         <div className="bg-white border-l-4 border-amber-400 border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">ISO 27001 certification</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             We are <strong>not ISO 27001 certified</strong>. Same reason as SOC 2 &mdash; substantial
//             cost and engagement that doesn't make sense at our current stage.
//           </p>
//           <p className="text-sm text-gray-700 mb-0">
//             <strong>Roadmap:</strong> further out than SOC 2. Most procurement teams accept
//             SOC 2 as equivalent for risk evaluation purposes.
//           </p>
//         </div>

//         <div className="bg-white border-l-4 border-amber-400 border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">HIPAA compliance / BAA</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             We are <strong>not HIPAA compliant</strong> and we will <strong>not sign a Business
//             Associate Agreement (BAA)</strong>. Do not capture screenshots of pages containing
//             Protected Health Information (PHI) using PixelPerfect.
//           </p>
//           <p className="text-sm text-gray-700 mb-0">
//             <strong>Roadmap:</strong> No specific plan. If a healthcare customer becomes
//             substantial, we'd revisit.
//           </p>
//         </div>

//         <div className="bg-white border-l-4 border-amber-400 border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">Pre-signed Data Processing Agreement (DPA)</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             We are <strong>currently drafting</strong> a standard DPA for EU customers. Until
//             it's published, we negotiate DPAs on a per-customer basis for those who require one.
//           </p>
//           <p className="text-sm text-gray-700 mb-0">
//             <strong>Roadmap:</strong> Standard DPA template targeted for Q3 2026. If you need
//             one before then, email us.
//           </p>
//         </div>

//         <div className="bg-white border-l-4 border-amber-400 border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">EU data residency option</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             All data currently lives in US-based infrastructure (Render Oregon for the database;
//             Cloudflare's global network for files). We <strong>do not currently offer EU-only
//             data residency</strong>.
//           </p>
//           <p className="text-sm text-gray-700 mb-0">
//             <strong>Roadmap:</strong> on the longer-term roadmap, likely as a Premium-tier
//             option once there's demand.
//           </p>
//         </div>

//         <div className="bg-white border-l-4 border-amber-400 border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">PCI DSS</h4>
//           <p className="text-sm text-gray-700 mb-2">
//             We are <strong>not PCI DSS audited</strong> &mdash; and we don't need to be, because we
//             never see your payment card numbers. Stripe (which is PCI DSS Level 1) handles all
//             card data through their hosted checkout. Card details never touch our servers.
//           </p>
//           <p className="text-sm text-gray-700 mb-0">
//             <strong>Roadmap:</strong> not applicable while we use Stripe.
//           </p>
//         </div>
//       </div>

//       {/* Our role under GDPR */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Controller vs Processor</h2>
//       <p className="text-gray-700 leading-relaxed">
//         GDPR distinguishes between <strong>data controllers</strong> (who decide why and how
//         data is processed) and <strong>data processors</strong> (who handle data on a
//         controller's behalf). PixelPerfect plays both roles, depending on which data:
//       </p>

//       <div className="overflow-x-auto my-4">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Data</th>
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Our role</th>
//               <th className="text-left p-3 font-semibold text-gray-900">What this means</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Your account info (email, password hash)</td>
//               <td className="p-3 border-r border-gray-200">Controller</td>
//               <td className="p-3">We decide why we collect it (to run the service)</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Screenshots you capture of YOUR own sites</td>
//               <td className="p-3 border-r border-gray-200">Controller</td>
//               <td className="p-3">You're capturing your own content</td>
//             </tr>
//             <tr>
//               <td className="p-3 border-r border-gray-200">Screenshots you capture of pages with third-party data</td>
//               <td className="p-3 border-r border-gray-200">Processor (you're the controller)</td>
//               <td className="p-3">You decide what to capture; we just process it</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <p className="text-gray-700 leading-relaxed mt-3">
//         The third row matters for B2B customers. If your application uses PixelPerfect to
//         capture pages containing your customers' data, your customers are the data subjects,
//         you are the controller, and we're a processor on your behalf. In that case, you may
//         need a DPA with us &mdash; see the "What We Don't Have" section above.
//       </p>

//       {/* What about my data when other users screenshot pages I'm on? */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">"Someone Screenshotted a Page Containing My Information"</h2>
//       <p className="text-gray-700 leading-relaxed">
//         If you're an EU resident who discovered that a third party (one of our customers) used
//         PixelPerfect to capture a page that contained your personal information, here's how to
//         proceed:
//       </p>

//       <ol className="space-y-3 mt-4 text-gray-700 ml-6 list-decimal">
//         <li>
//           <strong>Contact the third party first.</strong> They are the data controller for that
//           screenshot. They decided which page to capture and what to do with the result. They
//           have the primary responsibility for honoring your request.
//         </li>
//         <li>
//           <strong>If they don't respond or you can't identify them,</strong> email us at{' '}
//           <a href="mailto:onetechly@gmail.com?subject=Third-party data request" className="text-blue-600 hover:underline">
//             onetechly@gmail.com
//           </a>{' '}
//           with subject "Third-party data request". Provide as much information as you can: the
//           URL that was captured, an approximate timeframe, and any context about which third
//           party you suspect.
//         </li>
//         <li>
//           <strong>We will investigate</strong> and, where possible, identify and delete the
//           relevant captures. Note that screenshots are auto-deleted after 7 days, so older
//           captures may already be gone from our infrastructure.
//         </li>
//       </ol>

//       {/* Procurement questionnaires */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Filling Out Procurement Questionnaires</h2>
//       <p className="text-gray-700 leading-relaxed">
//         We're happy to fill out vendor security questionnaires. Common ones we've responded to:
//         SIG (Standard Information Gathering), CAIQ (Cloud Security Alliance Consensus
//         Assessment), and custom questionnaires from individual procurement teams.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         <strong>Process:</strong> email the document (PDF, spreadsheet, or web form link) to{' '}
//         <a href="mailto:onetechly@gmail.com?subject=Procurement questionnaire" className="text-blue-600 hover:underline">
//           onetechly@gmail.com
//         </a>. Typical turnaround is 2&ndash;5 business days depending on the questionnaire's length
//         and depth.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         <strong>What we won't do:</strong> falsely answer "yes" to questions about
//         certifications we don't hold. If your procurement process is gated on SOC 2 or ISO
//         27001 today, we're probably not the right fit yet &mdash; and we'll tell you that up front
//         rather than checking the box.
//       </p>

//       {/* Contact */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Compliance Contact</h2>
//       <p className="text-gray-700 leading-relaxed">
//         For all compliance, privacy, and data subject requests:
//       </p>
//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-4">
//         <p className="text-sm text-gray-700 mb-2">
//           <strong>Email:</strong>{' '}
//           <a href="mailto:onetechly@gmail.com" className="text-blue-600 hover:underline">
//             onetechly@gmail.com
//           </a>
//         </p>
//         <p className="text-sm text-gray-700 mb-2">
//           <strong>Company:</strong> OneTechly, New York State, USA
//         </p>
//         <p className="text-sm text-gray-700 mb-2">
//           <strong>Web:</strong>{' '}
//           <a href="https://pixelperfectapi.net" className="text-blue-600 hover:underline">
//             pixelperfectapi.net
//           </a>
//         </p>
//         <p className="text-sm text-gray-700 mb-0">
//           <strong>Response time:</strong> 2 business days for compliance questions; up to 30
//           days for full data subject requests (per GDPR Article 12(3)).
//         </p>
//       </div>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         We do not currently have a designated Data Protection Officer (DPO). Under GDPR
//         Article 37, we're not required to appoint one given our current scale and processing
//         activities. The compliance contact above is our actual decision-maker on these matters.
//       </p>

//       {/* Next Steps */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

//       <div className="grid grid-cols-1 gap-4">
//         <a
//           href="/help/article/data-retention-policy"
//           className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-blue-900 mb-1">Data Retention &amp; Privacy</h4>
//             <p className="text-sm text-blue-700 mb-0">What we store, where, and for how long &mdash; with the full sub-processor table</p>
//           </div>
//           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/account-security"
//           className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-green-900 mb-1">How We Secure Your Account</h4>
//             <p className="text-sm text-green-700 mb-0">The actual security mechanisms protecting your account</p>
//           </div>
//           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/api-key-security-best-practices"
//           className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-purple-900 mb-1">API Key Best Practices</h4>
//             <p className="text-sm text-purple-700 mb-0">How to handle keys safely on your side</p>
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
//             <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You have the full picture 📋</h4>
//             <p className="text-green-800 text-sm mb-0">
//               You know what compliance protections we provide today, what we don't yet have
//               (and why), how to exercise your data subject rights, the international transfer
//               mechanisms protecting your data, and how to escalate compliance questions.
//               We'd rather lose a sale by being honest than win one by overclaiming &mdash; and you
//               now have what you need to make an informed decision.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GdprComplianceGuide;