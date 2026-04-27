// ========================================
// MANAGING YOUR SUBSCRIPTION GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ManagingYourSubscriptionGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #20 in "Account Management" category
// (Slug: managing-your-subscription in helpArticles.js)
//
// Verified facts:
//   - Tiers: Free / Pro / Business / Premium
//   - Pricing: Free $0 / Pro $49/mo / Business $199/mo / Premium $499/mo
//   - Both monthly and annual billing supported (annual = ~20% discount)
//   - Stripe Checkout for upgrades
//   - POST /subscription/cancel (requires active paid sub)
//   - Stripe webhook /webhook/stripe handles tier changes with idempotency
//   - DashboardPage has subscription cancellation modal with typed
//     "CANCEL MY SUBSCRIPTION" confirmation
//
// SCOPE NOTE: This article focuses on USER ACTIONS (how do I upgrade?
// where do I see my plan?). The financial mechanics (proration, refunds,
// invoice access, tax) belong in the upcoming Billing category articles.
// I cross-reference appropriately without duplicating content.
// ========================================

import React from 'react';

const ManagingYourSubscriptionGuide = () => {
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
              How to view your current subscription, upgrade to a higher tier, switch between
              monthly and annual billing, and cancel when you need to. The differences between
              the four tiers, what happens at each step of an upgrade or cancel, and where to
              find your invoices.
            </p>
          </div>
        </div>
      </div>

      {/* Where to find subscription info */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Where to See Your Current Subscription</h2>
      <p className="text-gray-700 leading-relaxed">
        Your subscription details live on the dashboard. From any page, look at the top of
        the dashboard for the Subscription card — it shows your current tier, your usage this
        month against the tier's quota, and the date your billing cycle resets.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        For more detail, navigate to <a href="/pricing" className="text-blue-600 hover:underline">/pricing</a>{' '}
        — the same comparison table the public sees, but with your current tier highlighted.
        From there, you can upgrade, downgrade, or cancel.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Programmatically, hit <span className="font-mono">GET /users/me</span> with your JWT
        token. The response includes a <span className="font-mono">subscription_tier</span>{' '}
        field with the value <span className="font-mono">free</span>,{' '}
        <span className="font-mono">pro</span>, <span className="font-mono">business</span>, or{' '}
        <span className="font-mono">premium</span>.
      </p>

      {/* The four tiers */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Four Tiers at a Glance</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Tier</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Monthly</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Screenshots / month</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Batch URLs / job</th>
              <th className="text-left p-3 font-semibold text-gray-900">Concurrent captures</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Free</strong></td>
              <td className="p-3 border-r border-gray-200">$0</td>
              <td className="p-3 border-r border-gray-200">100</td>
              <td className="p-3 border-r border-gray-200">— (no batch)</td>
              <td className="p-3">2</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Pro</strong></td>
              <td className="p-3 border-r border-gray-200">$49</td>
              <td className="p-3 border-r border-gray-200">5,000</td>
              <td className="p-3 border-r border-gray-200">50</td>
              <td className="p-3">3</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Business</strong></td>
              <td className="p-3 border-r border-gray-200">$199</td>
              <td className="p-3 border-r border-gray-200">50,000</td>
              <td className="p-3 border-r border-gray-200">200</td>
              <td className="p-3">5</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Premium</strong></td>
              <td className="p-3 border-r border-gray-200">$499</td>
              <td className="p-3 border-r border-gray-200">Unlimited</td>
              <td className="p-3 border-r border-gray-200">1,000</td>
              <td className="p-3">5</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        For the full feature comparison (parameters, formats, support level), see the{' '}
        <a href="/pricing" className="text-blue-600 hover:underline">pricing page</a>. For
        the technical details on what each limit means in practice, see the{' '}
        <a href="/help/article/rate-limits-and-quotas" className="text-blue-600 hover:underline">
          Rate Limits and Quotas guide
        </a>.
      </p>

      {/* Monthly vs annual */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Monthly vs. Annual Billing</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Every paid tier comes in two billing cadences. The trade-offs:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-3 text-base">Monthly billing</h4>
          <ul className="space-y-2 text-sm text-gray-700 mb-0">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">+</span>
              <span>Cancel anytime, only pay for what you used</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">+</span>
              <span>No commitment beyond the current month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">+</span>
              <span>Easy to test a tier before committing long-term</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">−</span>
              <span>~20% more expensive over a year</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-3 text-base">Annual billing</h4>
          <ul className="space-y-2 text-sm text-gray-700 mb-0">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">+</span>
              <span>Roughly 20% discount vs. monthly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">+</span>
              <span>One invoice per year instead of twelve</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">+</span>
              <span>Predictable cost for budget planning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">−</span>
              <span>Paid upfront, locked in for 12 months</span>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        <strong>Suggested approach:</strong> start monthly to validate the tier fits your
        usage, then switch to annual once you're sure. The pricing page has a Monthly/Annual
        toggle that lets you see both prices before committing.
      </p>

      {/* Upgrading */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Upgrading Your Tier</h2>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Open the pricing page</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Navigate to <a href="/pricing" className="text-blue-600 hover:underline">/pricing</a>.
            Toggle between Monthly and Annual at the top to compare prices. Your current tier
            is highlighted with a "Current" badge.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Click "Upgrade" on the tier you want</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            We redirect you to a Stripe Checkout page. The card details, billing address, and
            tax info are entered there — they never touch our servers. We never see your
            payment card number.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Complete checkout</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            After payment succeeds, Stripe redirects you back to your dashboard. Your tier
            changes <strong>immediately</strong> — within a couple of seconds, you have access
            to the higher quota, more concurrent captures, and any tier-gated features. No
            need to log out and back in.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">4</span>
            <h4 className="font-semibold text-gray-900 mb-0">Receipt arrives by email</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Stripe sends a receipt to your account email within a minute. Future invoices for
            recurring charges land at the same address.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Why your tier updates instantly</h4>
            <p className="text-blue-800 text-sm mb-0">
              Stripe sends us a webhook event as soon as a checkout completes. Our webhook
              handler updates your <span className="font-mono">subscription_tier</span> in
              the database before your browser is even redirected back. By the time the
              dashboard reloads, the new tier is already in effect.
            </p>
          </div>
        </div>
      </div>

      {/* Downgrading */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Downgrading to a Lower Tier</h2>
      <p className="text-gray-700 leading-relaxed">
        Downgrades use the same flow as upgrades — visit the pricing page, click the lower
        tier, complete checkout. Stripe handles the proration automatically: you'll get a
        credit for the unused portion of your current tier, and that credit is applied to
        the lower tier's price.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        For the financial details on how proration is calculated and applied, see the{' '}
        upcoming Billing category articles. Practically: if you downgrade mid-month from Pro
        to Free, you stop being charged immediately and your tier drops at the end of the
        current paid period.
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Downgrade quota implications</h4>
            <p className="text-yellow-800 text-sm mb-0">
              If you downgrade in the middle of a billing month and you've already used more
              screenshots than the new tier's quota allows, the API will start rejecting new
              capture requests until your billing cycle resets. Your existing screenshots and
              data are unaffected.
            </p>
          </div>
        </div>
      </div>

      {/* Switching billing cadence */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Switching Between Monthly and Annual</h2>
      <p className="text-gray-700 leading-relaxed">
        Same tier, different billing cadence — the cleanest path is to cancel your current
        subscription and start a new one with the desired cadence. Stripe handles the
        transition with appropriate proration. We're working on a one-click cadence switch
        button for the dashboard, but until that ships, the cancel-and-resubscribe approach
        is what works today.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        If this matters to you and the manual flow is awkward, email us at{' '}
        <a href="mailto:onetechly@gmail.com?subject=Switch monthly to annual" className="text-blue-600 hover:underline">
          onetechly@gmail.com
        </a>{' '}
        and we'll do the switch for you on the Stripe side.
      </p>

      {/* Canceling */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Canceling Your Subscription</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Canceling drops you back to the Free tier. Your account stays active — only the paid
        access ends. If you want to delete your account entirely instead of just canceling,
        see the <a href="/help/article/deleting-your-account" className="text-blue-600 hover:underline">
          Deleting Your Account guide
        </a>.
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Open the dashboard</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            From the main dashboard, look for the Subscription section. If you're on a paid
            tier, you'll see a "Cancel Subscription" button at the bottom of that card.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Confirm by typing the phrase</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            A confirmation modal asks you to type{' '}
            <span className="font-mono">CANCEL MY SUBSCRIPTION</span> exactly (uppercase, with
            spaces). This typed confirmation is the safety net against accidental clicks. The
            modal also lays out exactly what happens — what you keep, what you lose.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Cancellation processes immediately</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            We hit Stripe to cancel your subscription. Your tier drops back to Free within a
            few seconds. You can immediately re-upgrade if you change your mind — no waiting
            period.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">What you keep after canceling</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Your account, login, and password</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Your API keys (still functional, but rate-limited to Free tier)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Your screenshot history (metadata persists; files still subject to 7-day retention)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Past invoices (accessible via Stripe's customer portal link from your dashboard)</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">What you lose after canceling</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">×</span>
          <span>Higher monthly screenshot quota — drops to 100/month</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">×</span>
          <span>Batch processing access (Free tier doesn't include batch)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">×</span>
          <span>Higher concurrent capture limit — drops from 3 or 5 back to 2</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">×</span>
          <span>Any tier-gated features (when those ship — see the Features page roadmap)</span>
        </li>
      </ul>

      {/* The financial mechanics deferral */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refunds, Invoices, and Billing Mechanics</h2>
      <p className="text-gray-700 leading-relaxed">
        The financial details — proration calculations, refund policy, accessing past
        invoices, tax handling, payment method updates — get their own dedicated articles in
        the Billing category. Until those ship, here are the short answers:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Past invoices</strong> are accessible via the Stripe customer portal
            link in your dashboard's Subscription section</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Refund requests</strong> — email{' '}
            <a href="mailto:onetechly@gmail.com?subject=Refund request" className="text-blue-600 hover:underline">
              onetechly@gmail.com
            </a>{' '}
            within 14 days of a charge for a full refund, no questions asked. After 14 days
            we evaluate case by case</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Update your payment method</strong> via the Stripe customer portal link</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Tax / VAT</strong> — Stripe handles tax calculation and collection
            based on your billing address</span>
        </li>
      </ul>

      {/* Common scenarios */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Scenarios</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I upgraded but my dashboard still shows the old tier"</h4>
          <p className="text-sm text-gray-700">
            Refresh the dashboard. The webhook usually updates your tier within 1–2 seconds,
            but the dashboard caches your account info — a hard reload (Ctrl+Shift+R or
            Cmd+Shift+R) clears the cache and shows the new tier. If after a refresh it still
            shows the old tier, log out and back in. If it's still wrong after that, email
            us with your Stripe receipt ID — there may be a webhook delivery issue.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My card was declined at checkout"</h4>
          <p className="text-sm text-gray-700">
            Stripe shows a specific decline reason on the checkout page. Most common: an
            anti-fraud block triggered by an unusual purchase pattern, or a card-level
            international transaction restriction. Try a different card, or call your bank
            and tell them you're attempting a legitimate charge from "OneTechly" or
            "PixelPerfect."
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want to upgrade but use a different email for billing"</h4>
          <p className="text-sm text-gray-700">
            On the Stripe Checkout page, you can enter any billing email — it doesn't have to
            match your PixelPerfect account email. Receipts will go to the email you enter at
            checkout. The PixelPerfect account remains tied to your account email.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I'm canceling because of a problem — can you help instead?"</h4>
          <p className="text-sm text-gray-700">
            Yes please — email{' '}
            <a href="mailto:onetechly@gmail.com?subject=Pre-cancellation help" className="text-blue-600 hover:underline">
              onetechly@gmail.com
            </a>{' '}
            with what's going wrong. Most cancellations we hear about turn out to be fixable
            (rate limit confusion, account email mix-up, integration bug). We'd much rather
            help you stay than have you leave with an unsolved problem.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Can I pause my subscription instead of canceling?"</h4>
          <p className="text-sm text-gray-700">
            Not yet — we don't have a self-serve pause feature. If you need to step away for
            a known period (e.g., a 2-month maternity leave), email us and we can apply a
            manual pause on the Stripe side. Otherwise, cancel and re-upgrade when you come
            back — your account, screenshot history, and API keys all wait for you.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/rate-limits-and-quotas"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Rate Limits and Quotas</h4>
            <p className="text-sm text-blue-700 mb-0">What each tier's limits actually mean in practice</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/deleting-your-account"
          className="flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Deleting Your Account</h4>
            <p className="text-sm text-amber-700 mb-0">Different from canceling — full data removal</p>
          </div>
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/understanding-pricing-plans"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Understanding Pricing Plans</h4>
            <p className="text-sm text-purple-700 mb-0">Pick the right tier for your usage pattern</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Subscription handled 💳</h4>
            <p className="text-green-800 text-sm mb-0">
              You know how to view, upgrade, downgrade, switch billing cadence, and cancel.
              Tier changes apply within seconds via Stripe webhooks. Receipts and past
              invoices live in Stripe's customer portal. Refunds within 14 days are a quick
              email away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingYourSubscriptionGuide;