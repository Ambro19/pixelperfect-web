// ========================================
// MANAGING PAYMENT METHODS GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ManagingPaymentMethodsGuide.jsx
// Author: OneTechly
// Update: April 28, 2026
//
// Article #26 in "Billing & Subscription" category
// (Slug: managing-payment-methods in helpArticles.js)
//
// Verified facts:
//   - Card data NEVER touches our servers (Stripe hosted checkout)
//   - We use Stripe's Customer Portal for payment method management
//   - Stripe webhook /webhook/stripe handles tier changes
//   - Stripe handles dunning (retry logic on failed payments) automatically
//   - We support all card types Stripe supports (Visa, MC, Amex, Discover,
//     plus regional cards in supported markets)
//
// Tone: confident and direct. Most management happens in Stripe's portal,
// so the article is shorter and clearer than pretending we have a full
// payment-method surface in our own UI.
// ========================================

import React from 'react';

const ManagingPaymentMethodsGuide = () => {
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
              How to add, update, or remove payment methods on your account. What happens
              when a charge fails, how the retry flow works, and what to do if your card is
              declined.
            </p>
          </div>
        </div>
      </div>

      {/* The mental model */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Short Answer</h2>
      <p className="text-gray-700 leading-relaxed">
        Payment methods are managed through Stripe's Customer Portal &mdash; a hosted page that
        Stripe runs on our behalf. We don't store your card number on our servers (we never
        see it), so we redirect you to Stripe whenever you need to add, update, or remove a
        card. This is a feature, not a limitation: Stripe's portal is more secure than
        anything we could build ourselves and it's PCI DSS Level 1 certified out of the box.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Opening the Customer Portal</h2>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Open your dashboard</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Navigate to your dashboard and find the Subscription section. If you're on a paid
            tier, you'll see a "Manage Billing" link or button.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Click "Manage Billing"</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            We'll redirect you to a Stripe-hosted page that's pre-authenticated for your
            account. You won't need to log in again &mdash; the redirect carries a short-lived
            session token.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Make your changes in Stripe</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Add cards, set a default, remove old cards, update billing address &mdash; everything
            you'd expect. Changes take effect immediately on Stripe's side.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">4</span>
            <h4 className="font-semibold text-gray-900 mb-0">Return to PixelPerfect</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Click the "Return to PixelPerfect" link at the top of the Stripe portal. Your
            dashboard reflects any changes immediately &mdash; no refresh needed for billing-related
            updates.
          </p>
        </div>
      </div>

      {/* Free tier note */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">On the Free tier?</h4>
            <p className="text-yellow-800 text-sm mb-0">
              The "Manage Billing" link only appears once you've upgraded to a paid tier.
              Free accounts don't have a Stripe customer record yet &mdash; we create one when you
              upgrade. To add a payment method now, the simplest path is to go through the
              upgrade flow at <a href="/pricing" className="text-yellow-900 underline">/pricing</a>;
              your card will be saved automatically as part of checkout.
            </p>
          </div>
        </div>
      </div>

      {/* What you can do */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What You Can Do in the Customer Portal</h2>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Add a new card</strong> &mdash; Visa, Mastercard, Amex, Discover, plus regional methods supported in your country</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Set a default card</strong> &mdash; the card we'll charge for the next renewal</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Remove an old card</strong> &mdash; e.g., one that has expired or been canceled by your bank</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Update your billing address</strong> &mdash; affects tax calculation and the address on your invoices</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Update your billing email</strong> &mdash; the address where receipts go (this can be different from your PixelPerfect login email)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Download past invoices and receipts</strong> &mdash; PDF copies for your records (see <a href="/help/article/understanding-your-invoice" className="text-blue-600 hover:underline">Understanding Your Invoice</a>)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Cancel your subscription</strong> &mdash; though we recommend doing this from your PixelPerfect dashboard for the typed-confirmation safety check</span>
        </li>
      </ul>

      {/* Failed payments */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When a Payment Fails</h2>
      <p className="text-gray-700 leading-relaxed">
        Cards fail for a variety of reasons &mdash; expiration, insufficient funds, anti-fraud
        block, bank issuing a new card without telling you. Here's exactly what happens when
        a renewal charge fails:
      </p>

      <div className="space-y-3 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Day 0: First attempt fails</h4>
          <p className="text-sm text-gray-700 mb-0">
            Stripe emails you with the failure reason and a link to update your card. Your
            account stays active &mdash; nothing changes on the PixelPerfect side yet.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Days 3, 5, 7: Stripe retries</h4>
          <p className="text-sm text-gray-700 mb-0">
            Stripe automatically retries the charge on a built-in dunning schedule. If your
            bank had a temporary issue, this often succeeds without you doing anything.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Day 7+: Subscription pauses</h4>
          <p className="text-sm text-gray-700 mb-0">
            If all retries fail, Stripe marks the subscription as past-due. We get a webhook
            and downgrade your account to the Free tier until you update your card. Your
            account, API keys, and screenshot history are unaffected &mdash; just the rate limits
            drop back to Free.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">After you update your card</h4>
          <p className="text-sm text-gray-700 mb-0">
            Stripe immediately retries the failed charge. If it succeeds, your tier upgrades
            back automatically within seconds. No need to email us.
          </p>
        </div>
      </div>

      {/* Common scenarios */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Scenarios</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My card was declined at upgrade time"</h4>
          <p className="text-sm text-gray-700">
            Stripe shows the specific decline reason on the checkout page. Most common: an
            anti-fraud block triggered by an unusual transaction pattern, an
            international-transaction restriction on your card, or insufficient funds. Try a
            different card, or call your bank and tell them you're attempting a legitimate
            charge from "OneTechly" (our DBA on Stripe).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My card expired and I missed the email"</h4>
          <p className="text-sm text-gray-700">
            No problem. Visit your dashboard, click "Manage Billing," add a new card, and set
            it as default. Stripe will retry the failed renewal charge within a few minutes
            of the new card being saved. Your tier upgrades back automatically.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My bank sent me a new card with a new number"</h4>
          <p className="text-sm text-gray-700">
            Major card networks (Visa, Mastercard, Amex) participate in account-updater
            services that can quietly route the new number to Stripe in some cases. But not
            always &mdash; and not for every card type. The safe move is to add the new card to
            your Stripe portal and remove the old one.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want to use a corporate card going forward"</h4>
          <p className="text-sm text-gray-700">
            Add the corporate card in the Stripe portal, set it as default, and (optionally)
            remove the personal card. Future charges will go to the corporate card. Past
            invoices stay on your account regardless of which card paid them.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Can I pay by ACH bank transfer or invoice?"</h4>
          <p className="text-sm text-gray-700">
            Not currently. We accept the credit and debit cards that Stripe Checkout supports.
            If you have a procurement requirement that demands ACH or invoicing, email{' '}
            <a href="mailto:onetechly@gmail.com?subject=Alternative payment method" className="text-blue-600 hover:underline">
              onetechly@gmail.com
            </a>{' '}
            and we'll see what we can do on a case-by-case basis.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I have multiple cards saved &mdash; which one will be charged?"</h4>
          <p className="text-sm text-gray-700">
            The card you marked as default in the Stripe portal. If you haven't explicitly
            set a default, Stripe uses the most recently added card. You can verify and
            change this any time in the portal.
          </p>
        </div>
      </div>

      {/* Security */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">A Note on Card Security</h2>
      <p className="text-gray-700 leading-relaxed">
        Card numbers, CVVs, and expiration dates never touch our servers. Stripe's hosted
        checkout and Customer Portal handle that data directly. From our side, we only see
        a tokenized reference (e.g., <code className="font-mono">card_1ABCxyz</code>) and
        the last four digits, which we use to display "ending in 4242" on your invoices.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        This means: even if our database were somehow leaked, your full card number is not
        in it. For more on our security posture, see the{' '}
        <a href="/help/article/account-security" className="text-blue-600 hover:underline">
          Account Security guide
        </a>{' '}
        and the{' '}
        <a href="/help/article/gdpr-compliance" className="text-blue-600 hover:underline">
          GDPR &amp; Compliance guide
        </a>.
      </p>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/understanding-your-invoice"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Understanding Your Invoice</h4>
            <p className="text-sm text-blue-700 mb-0">How to read the invoice itself, including line items, tax, and proration</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/cancellation-and-refunds"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Cancellation and Refunds</h4>
            <p className="text-sm text-green-700 mb-0">If you want to stop being billed, here's the clean exit</p>
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
            <h4 className="font-semibold text-purple-900 mb-1">How to Upgrade Your Plan</h4>
            <p className="text-sm text-purple-700 mb-0">Move to a higher tier &mdash; Free accounts add a card during this flow</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Payment methods sorted 💳</h4>
            <p className="text-green-800 text-sm mb-0">
              You know how to manage cards through Stripe's Customer Portal, what happens
              when a charge fails (Stripe retries on a 3-5-7 day schedule), and how to
              recover after an expired card. The portal is the source of truth &mdash; bookmark
              the "Manage Billing" link from your dashboard for fast access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingPaymentMethodsGuide;

//===== END OF ManagingPaymentMethodsGuide.JS =====