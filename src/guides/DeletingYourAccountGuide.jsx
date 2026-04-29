// ========================================
// DELETING YOUR ACCOUNT GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/DeletingYourAccountGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #21 (final article in "Account Management" category)
// (Slug: deleting-your-account in helpArticles.js)
//
// Verified facts:
//   - Endpoint: DELETE /user/delete-account (Authorization: Bearer <token>)
//   - DashboardPage has account deletion modal with typed
//     "DELETE MY ACCOUNT" confirmation (red theme)
//   - Cascade: API keys, screenshot metadata, Stripe subscription cancellation
//   - Persistence: Stripe billing records (legal/tax obligation),
//     anonymized aggregate stats
//
// SCOPE NOTE: This article is the "how to delete" article. The "what
// happens to my data" question is more thoroughly answered in Article #15
// (Data Retention & Privacy). I cross-reference deliberately rather than
// duplicating that content — readers come to this article for the action,
// they go to #15 for the policy depth.
// ========================================

import React from 'react';

const DeletingYourAccountGuide = () => {
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
              How to permanently delete your PixelPerfect account, exactly what happens when
              you do, what data persists for legal reasons, and the alternatives if you're
              not sure deletion is what you want. Account deletion is permanent — no undo,
              no grace period — so this article is worth a careful read before clicking the
              button.
            </p>
          </div>
        </div>
      </div>

      {/* Are you sure? */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Before You Delete: Is This What You Actually Want?</h2>
      <p className="text-gray-700 leading-relaxed">
        Account deletion is the strongest action available. Before you run it, take 30
        seconds to check whether one of the lighter alternatives is what you're actually
        looking for:
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I just want to stop being charged"</h4>
          <p className="text-sm text-gray-700 mb-2">
            You probably want to <strong>cancel your subscription</strong>, not delete your
            account. Canceling drops you to the Free tier — no more charges, but your account,
            API keys, and screenshot history stay intact. You can re-upgrade later without
            starting over.
          </p>
          <p className="text-sm text-blue-700 mb-0">
            → See <a href="/help/article/managing-your-subscription" className="text-blue-700 underline">
              Managing Your Subscription
            </a> for the cancel flow
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I'm worried about a leaked API key"</h4>
          <p className="text-sm text-gray-700 mb-2">
            You want to <strong>revoke and regenerate the affected key</strong>. Account
            deletion is overkill — it'll fix the problem but takes everything else with it.
          </p>
          <p className="text-sm text-blue-700 mb-0">
            → See <a href="/help/article/api-key-security-best-practices" className="text-blue-700 underline">
              API Key Best Practices
            </a> for the leak response flow
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want to take a break for a few months"</h4>
          <p className="text-sm text-gray-700">
            <strong>Cancel your subscription</strong> and let your account sit on the Free
            tier. Free tier accounts don't cost anything and don't expire from inactivity. When
            you come back, just upgrade and you're back to where you were — same account,
            same API keys, same history.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want my data exported before I leave"</h4>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Request the export first, then delete.</strong> Once your account is gone,
            we cannot reconstruct it from backups. Email{' '}
            <a href="mailto:onetechly@gmail.com?subject=Data export request" className="text-blue-600 hover:underline">
              onetechly@gmail.com
            </a>{' '}
            with subject "Data export request" — we'll send you a JSON dump within 30 days.
            Then come back here to delete.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I'm done. Delete it."</h4>
          <p className="text-sm text-gray-700">
            Skip ahead to the deletion procedure below.
          </p>
        </div>
      </div>

      {/* The deletion procedure */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Delete Your Account</h2>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Open the dashboard</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            From the main dashboard, scroll to the bottom of the page. You'll see a "Danger
            Zone" section with a "Delete Account" button styled in red — deliberately separated
            from the rest of the dashboard so it's hard to click by accident.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Click "Delete Account"</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            A confirmation modal opens. It lays out exactly what's about to happen and asks
            for typed confirmation. Read this modal — it's the last clear stop before the
            point of no return.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Type the confirmation phrase</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The modal asks you to type{' '}
            <span className="font-mono">DELETE MY ACCOUNT</span> exactly (uppercase, with
            spaces). The Confirm button stays disabled until the phrase is typed correctly.
            This typed confirmation is the safety net against autofill, accidental clicks,
            and rage-clicks during frustrating moments.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-red-100 text-red-700 rounded-full text-sm font-bold">4</span>
            <h4 className="font-semibold text-gray-900 mb-0">Click Confirm</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Deletion processes immediately. Within seconds, your account is gone, your API
            keys are revoked, and your active subscription (if any) is canceled in Stripe.
            You'll be redirected to the homepage. Attempting to log in with your old
            credentials will fail.
          </p>
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-red-900 mt-0 mb-1">No undo. No grace period. No support recovery.</h4>
            <p className="text-red-800 text-sm mb-0">
              Account deletion is irreversible. There's no 30-day grace period where we hold
              your data "just in case." There's no support flow to restore a deleted account
              from backups. The cascade fires the moment you click Confirm, and we cannot
              walk it back. This is intentional — it's how data deletion is supposed to work
              under privacy regulations, and it's how we'd want our own accounts handled.
            </p>
          </div>
        </div>
      </div>

      {/* Via API */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Via API</h2>
      <p className="text-gray-700 leading-relaxed mb-3">
        For programmatic deletion (rare, but possible), use the{' '}
        <span className="font-mono">DELETE /user/delete-account</span> endpoint with your JWT
        token:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X DELETE https://api.pixelperfectapi.net/user/delete-account \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        </pre>
      </div>
      <p className="text-gray-700 leading-relaxed mt-3">
        Returns 200 on success, 401 if the JWT is missing or invalid. The API call has no
        typed-confirmation gate — that's a UX safeguard for the dashboard. If you're calling
        the API directly, we assume you know what you're doing and have your own confirmation
        flow appropriate to your context.
      </p>

      {/* What happens behind the scenes */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Happens When You Click Confirm</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The deletion cascade runs in this order. If any step fails, we still try to complete
        the rest — partial cleanup is better than no cleanup. Failures get logged for review:
      </p>

      <div className="space-y-3 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">1. Subscription cancellation</h4>
          <p className="text-sm text-gray-700 mb-0">
            We call Stripe to cancel your active subscription. No further charges. Stripe
            sends you a final cancellation email.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">2. API key revocation</h4>
          <p className="text-sm text-gray-700 mb-0">
            All your API keys stop working immediately. Any integration using them starts
            getting 401 errors within seconds. (If you've shared keys with a teammate or
            embedded them in CI, give them a heads-up before deleting.)
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">3. Screenshot metadata deletion</h4>
          <p className="text-sm text-gray-700 mb-0">
            All your screenshot history rows are removed from PostgreSQL. Your dashboard
            history page would be empty if you could still log in.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">4. Batch job records deletion</h4>
          <p className="text-sm text-gray-700 mb-0">
            Active and historical batch jobs are deleted. Any batch currently in progress is
            cancelled mid-flight — items already captured stay in R2 until the 7-day retention
            sweep, but the job record is gone.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">5. Account row deletion</h4>
          <p className="text-sm text-gray-700 mb-0">
            Your user record is deleted from the database. Email, password hash, profile
            fields — all gone. Your username is now available for someone else to register.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">6. R2 file cleanup (within 24 hours)</h4>
          <p className="text-sm text-gray-700 mb-0">
            Any screenshot files still in R2 from your account are eligible for deletion in
            the next retention sweep (within 24 hours). Files that were already past the 7-day
            window are gone anyway.
          </p>
        </div>
      </div>

      {/* What persists */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Persists After Deletion</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Two things persist intentionally, neither of which we can do anything about:
      </p>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">Stripe billing records</h4>
          <p className="text-sm text-gray-700 mb-0">
            If you ever made a payment, Stripe retains the invoice, transaction history, and
            associated metadata per their own retention policy and applicable tax law. We
            cannot make Stripe forget your payment history — that's required for tax
            compliance, financial audits, and chargeback handling. Stripe's policy is at{' '}
            <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline">
              stripe.com/privacy
            </a>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">Anonymized aggregate statistics</h4>
          <p className="text-sm text-gray-700 mb-0">
            We track aggregate metrics like "total screenshots captured this month across all
            users" and "total active accounts on each tier." These don't reference your
            account specifically — by the time the aggregate is computed, your individual
            data isn't recoverable from it. They're not personal data under GDPR.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mt-4">
        Everything else — your account, your screenshots, your API keys, your screenshot
        history, your usage counter, your profile fields — is gone within seconds of clicking
        Confirm.
      </p>

      <p className="text-gray-700 leading-relaxed mt-3">
        For the full data retention picture (what we collect, where it lives, who else has
        access), see the{' '}
        <a href="/help/article/data-retention-policy" className="text-blue-600 hover:underline">
          Data Retention & Privacy guide
        </a>.
      </p>

      {/* Coming back */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">If You Want to Come Back Later</h2>
      <p className="text-gray-700 leading-relaxed">
        You're welcome to. Just create a new account from the registration page like a
        first-time user. Note these specifics:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Your old username might be available.</strong> If no one else has
            taken it in the meantime, you can re-register with the same username.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Your old email is available.</strong> We don't reserve old addresses.
            You can re-register with the same email.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>It's a fresh start.</strong> New API keys, empty screenshot history,
            usage counter at 0, no subscription. You'll have to upgrade again if you want a
            paid tier.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>The new account is unrelated to the old one</strong> from a data
            perspective. We don't link them, we don't migrate anything, we don't recognize
            you as a returning customer.</span>
        </li>
      </ul>

      {/* Common scenarios */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Scenarios</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I deleted my account by accident"</h4>
          <p className="text-sm text-gray-700">
            We genuinely cannot recover it. The typed confirmation phrase exists specifically
            to make this scenario as rare as possible. If it still happens, the only path
            forward is to register fresh and rebuild. Email us if you had a paid subscription
            in flight — we may be able to apply a credit on the new account based on your
            recent Stripe history.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I need a paper trail showing my data was deleted"</h4>
          <p className="text-sm text-gray-700">
            For regulated environments where you need documentation: email us at{' '}
            <a href="mailto:onetechly@gmail.com?subject=Account deletion confirmation request" className="text-blue-600 hover:underline">
              onetechly@gmail.com
            </a>{' '}
            within 7 days of the deletion, and we'll send you a written confirmation
            including the deletion timestamp and a summary of what was removed.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My screenshot R2 URLs still resolve after I deleted"</h4>
          <p className="text-sm text-gray-700">
            R2 file deletion happens in the next retention sweep, which runs daily — so
            screenshot URLs may still work for up to 24 hours after account deletion (and
            only for files that hadn't already aged out of the 7-day window). After that,
            they 404 like any other expired file. If you need same-second URL revocation
            for compliance reasons, email us and we'll trigger a manual sweep.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want to delete an account I can't log into"</h4>
          <p className="text-sm text-gray-700">
            If you can't log in (forgotten password and lost access to the email),{' '}
            first try the <a href="/forgot-password" className="text-blue-600 hover:underline">
              forgot password flow
            </a>. If that path is also broken, email us from the email associated with the
            account (if you can) with proof of identity — we can manually verify and process
            the deletion. We will not delete an account based on an email from a different
            address claiming to be the owner.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Can I delete just one screenshot, not my whole account?"</h4>
          <p className="text-sm text-gray-700">
            Yes — from the screenshot history page in your dashboard, each row has a delete
            action. That removes both the metadata row and triggers immediate R2 file
            deletion. No account-level action needed.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/data-retention-policy"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Data Retention & Privacy</h4>
            <p className="text-sm text-blue-700 mb-0">The full picture of what we store and what gets deleted</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/managing-your-subscription"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Managing Your Subscription</h4>
            <p className="text-sm text-green-700 mb-0">Cancel without deleting — keep your account on the Free tier</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/gdpr-compliance"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">GDPR & Compliance</h4>
            <p className="text-sm text-purple-700 mb-0">Your data subject rights, including the right to erasure</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You have a clean exit path 👋</h4>
            <p className="text-green-800 text-sm mb-0">
              You know which alternatives to consider before deleting, the typed-confirmation
              flow, the cascade of what gets removed, and what persists for legal reasons.
              You also know that deletion is permanent — and that's by design. If you ever
              want to come back, the door is open.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletingYourAccountGuide;

//===== END OF DeletingYourAccountGuide.jsx =====