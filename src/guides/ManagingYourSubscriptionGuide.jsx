// ========================================
// MANAGING YOUR SUBSCRIPTION GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ManagingYourSubscriptionGuide.jsx
// Author: OneTechly
// Update: April 29, 2026
//
// ✅ FIX (Apr 29, 2026): Corrected refund policy. A previous version of
//    this guide stated a "14-day refund window." That is WRONG. Our actual
//    policy (Terms of Service §4.3, FAQ) is: we do NOT offer refunds.
//    Users are encouraged to start with the Free tier to evaluate before
//    upgrading. All paid subscriptions remain active until the end of the
//    billing period after cancellation. No money back.
//
// Article serves both:
//   - /help/article/how-to-upgrade-plan  (billing category, upgrade intent)
//   - /help/article/cancellation-and-refunds (billing category, cancel intent)
//   - /help/article/managing-your-subscription (account category)
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

      {/* Where to see your subscription */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Where to See Your Current Subscription</h2>
      <p className="text-gray-700 leading-relaxed">
        Your subscription details live on the dashboard. From any page, look at the top of
        the dashboard for the <strong>Subscription card</strong> &mdash; it shows your current tier, your
        usage this month against the tier's quota, and the date your billing cycle resets.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        For more detail, navigate to <a href="/pricing" className="text-blue-600 hover:underline">/pricing</a> &mdash;
        the same comparison table the public sees, but with your current tier highlighted.
        From there, you can upgrade, downgrade, or cancel.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Programmatically, hit <code className="font-mono">GET /users/me</code> with your JWT token. The response
        includes a <code className="font-mono">subscription_tier</code> field with the value <code className="font-mono">free</code>,{' '}
        <code className="font-mono">pro</code>, <code className="font-mono">business</code>, or <code className="font-mono">premium</code>.
      </p>

      {/* The four tiers */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Four Tiers at a Glance</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Tier</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Monthly</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Screenshots / mo</th>
              <th className="text-left p-3 font-semibold text-gray-900">Batch</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Free</strong></td>
              <td className="p-3 border-r border-gray-200">$0</td>
              <td className="p-3 border-r border-gray-200">100</td>
              <td className="p-3">&mdash;</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Pro</strong></td>
              <td className="p-3 border-r border-gray-200">$49</td>
              <td className="p-3 border-r border-gray-200">5,000</td>
              <td className="p-3">Up to 50 URLs/job</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Business</strong></td>
              <td className="p-3 border-r border-gray-200">$199</td>
              <td className="p-3 border-r border-gray-200">50,000</td>
              <td className="p-3">Up to 200 URLs/job</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Premium</strong></td>
              <td className="p-3 border-r border-gray-200">$499</td>
              <td className="p-3 border-r border-gray-200">Unlimited</td>
              <td className="p-3">Up to 1,000 URLs/job</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 text-sm mt-2">
        Annual billing is available for each paid tier at roughly a 20% discount. See{' '}
        <a href="/pricing" className="text-blue-600 hover:underline">/pricing</a> for the current annual rates.
      </p>

      {/* Upgrading */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Upgrading Your Plan</h2>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Go to the pricing page</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Navigate to <a href="/pricing" className="text-blue-600 hover:underline">/pricing</a>. Your
            current tier is highlighted. Click the upgrade button on the tier you want.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Complete the Stripe checkout</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            You'll be redirected to a Stripe-hosted checkout page. Enter your card details
            and confirm. Stripe processes the payment and sends a webhook back to us.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Tier updates immediately</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Within 1&ndash;2 seconds of checkout completing, the webhook updates your account.
            Your dashboard will show the new tier and the higher quota. Your existing API
            key keeps working — no need to regenerate it.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">"My dashboard still shows the old tier"</h4>
            <p className="text-yellow-800 text-sm mb-0">
              Refresh the dashboard. The webhook usually updates your tier within 1&ndash;2 seconds,
              but the dashboard caches your account info &mdash; a hard reload (Ctrl+Shift+R or
              Cmd+Shift+R) clears the cache and shows the new tier. If after a refresh it still
              shows the old tier, log out and back in. If it's still wrong after that, email us
              with your Stripe receipt ID &mdash; there may be a webhook delivery issue.
            </p>
          </div>
        </div>
      </div>

      {/* Downgrading */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Downgrading Your Plan</h2>
      <p className="text-gray-700 leading-relaxed">
        Downgrades are handled through the Stripe Customer Portal. From your dashboard, click
        <strong> Manage Billing</strong> to open the portal, then select a lower tier. Stripe prorates
        the change &mdash; you receive a credit for the unused portion of your current tier and a
        charge for the new tier through to the end of the period.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        After a downgrade, your quota drops to the new tier's level immediately. If you've
        already used more screenshots this month than the new tier allows, the counter will
        show as over-limit until the cycle resets. You won't be blocked from your account,
        but new screenshot requests will return 402 until the reset.
      </p>

      {/* Switching billing cadence */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Switching Between Monthly and Annual</h2>
      <p className="text-gray-700 leading-relaxed">
        You can switch from monthly to annual billing (or vice versa) in the Stripe Customer
        Portal. Annual billing saves roughly 20% compared to 12 months of monthly billing.
        The switch prorates the same way as a tier change &mdash; unused monthly time is credited,
        and the annual plan is charged for the remainder.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Suggested approach: start on monthly billing until you've confirmed the tier fits your
        usage for 2&ndash;3 billing cycles, then switch to annual to lock in the savings.
      </p>

      {/* Cancellation */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cancelling Your Subscription</h2>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Open your dashboard</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Navigate to your dashboard's Subscription section. You'll see a cancel button
            next to your current tier.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Confirm cancellation</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            A confirmation dialog will ask you to type <code className="font-mono">CANCEL MY SUBSCRIPTION</code>.
            This prevents accidental cancellations. Once confirmed, Stripe schedules the
            cancellation for the end of your current billing period.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Service continues until the period ends</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            You retain full access to your paid tier &mdash; features, quota, and API key &mdash; until the
            billing period expires. After that, your account downgrades to the Free tier
            automatically (100 screenshots/month). Nothing is deleted.
          </p>
        </div>
      </div>

      {/* ✅ CORRECTED REFUND POLICY — replaces the previous 14-day refund language */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refunds, Invoices, and Billing Mechanics</h2>
      <p className="text-gray-700 leading-relaxed">
        The financial details &mdash; proration calculations, refund policy, accessing past invoices,
        tax handling, payment method updates &mdash; get their own dedicated articles in the Billing
        category. Until those ship, here are the short answers:
      </p>
      <ul className="space-y-3 mt-4 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Past invoices</strong> are accessible via the Stripe customer portal link in your
            dashboard's Subscription section
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-orange-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Refund requests</strong> &mdash; email{' '}
            <a href="mailto:onetechly@gmail.com" className="text-blue-600 hover:underline">onetechly@gmail.com</a>.
            We do not offer automatic refunds. We encourage all users to start with the
            Free tier (100 screenshots/month, no card required) to evaluate the service before
            upgrading. Once you subscribe to a paid plan, that subscription fee is non-refundable.
            Requests for exceptions are considered case by case &mdash; email us if you believe your
            situation warrants one.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Update your payment method</strong> via the Stripe customer portal link
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>
            <strong>Tax / VAT</strong> &mdash; Stripe handles tax calculation and collection based on
            your billing address
          </span>
        </li>
      </ul>

      {/* Common scenarios */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Scenarios</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I upgraded but my dashboard still shows the old tier"</h4>
          <p className="text-sm text-gray-700">
            Refresh the dashboard. The webhook usually updates your tier within 1&ndash;2 seconds, but
            the dashboard caches your account info &mdash; a hard reload (Ctrl+Shift+R or Cmd+Shift+R)
            clears the cache and shows the new tier. If after a refresh it still shows the old tier,
            log out and back in. If it's still wrong after that, email us with your Stripe receipt
            ID &mdash; there may be a webhook delivery issue.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My card was declined at checkout"</h4>
          <p className="text-sm text-gray-700">
            Stripe shows a specific decline reason on the checkout page. Most common: an anti-fraud
            block triggered by an unusual purchase pattern, or a card-level international transaction
            restriction. Try a different card, or call your bank and tell them you're attempting a
            legitimate charge from "OneTechly" or "PixelPerfect."
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I cancelled — what happens to my screenshots?"</h4>
          <p className="text-sm text-gray-700">
            Your screenshot history and API key are preserved. After the billing period ends and
            your account downgrades to Free, you'll have access to the last 7 days of screenshots
            in storage (our retention window). Historical job records remain in your dashboard.
            Nothing is permanently deleted at the moment of cancellation.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want to pause my subscription, not cancel it"</h4>
          <p className="text-sm text-gray-700">
            We don't currently support subscription pausing. The options are: stay subscribed,
            downgrade to a lower paid tier, or cancel and re-subscribe later. If you cancel, your
            account drops to Free until you re-subscribe &mdash; which you can do at any time with the
            same API key.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I signed up for the wrong tier by mistake"</h4>
          <p className="text-sm text-gray-700">
            Email <a href="mailto:onetechly@gmail.com?subject=Wrong tier at signup" className="text-blue-600 hover:underline">onetechly@gmail.com</a> as
            soon as possible explaining what happened. We don't guarantee a refund &mdash; our policy
            is no refunds &mdash; but we'll review each situation individually and do our best to help.
            The fastest prevention is to start on the Free tier and upgrade once you've confirmed
            the service meets your needs.
          </p>
        </div>
      </div>

      {/* Next steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>
      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/understanding-pricing-plans"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Understanding Pricing Plans</h4>
            <p className="text-sm text-blue-700 mb-0">Compare tiers and decide which one fits your usage</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="/help/article/managing-payment-methods"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Managing Payment Methods</h4>
            <p className="text-sm text-green-700 mb-0">Add, update, or remove cards through the Stripe Customer Portal</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="/help/article/understanding-your-invoice"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Understanding Your Invoice</h4>
            <p className="text-sm text-purple-700 mb-0">Read your Stripe invoice line by line, including proration</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Subscription managed ✅</h4>
            <p className="text-green-800 text-sm mb-0">
              You know how to upgrade (Stripe checkout → webhook → instant tier change), downgrade
              (Stripe portal → proration), switch billing cadence (monthly ↔ annual), and cancel
              (service continues until period ends, no refunds). If you run into trouble, email
              onetechly@gmail.com with your Stripe receipt ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingYourSubscriptionGuide;

// ===== END OF ManagingYourSubscriptionGuide.JSX =====

