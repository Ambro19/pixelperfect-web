// ========================================
// MANAGING YOUR PROFILE GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ManagingYourProfileGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #18 in "Account Management" category
// (Slug: managing-your-profile in helpArticles.js)
//
// Verified facts (from backend/main.py update_profile_endpoint):
//   - Endpoint: PUT /user/update_profile
//   - Updates username and/or email (both optional, at least one required)
//   - Username uniqueness check (excluding current user)
//   - Email uniqueness check (excluding current user)
//   - Email is normalized to lowercase + stripped of whitespace
//   - Stripe customer email is updated automatically when email changes
//     (non-fatal if Stripe API call fails — logged as warning)
//   - Returns canonical_account(user) with all fields
//   - 400 on empty/duplicate; 500 on db error
// ========================================

import React from 'react';

const ManagingYourProfileGuide = () => {
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
              How to update your profile information from the dashboard or via the API.
              What each field controls (especially email — which has implications beyond
              just login). The validation rules we enforce, and what to do when an update
              fails. By the end you'll know exactly what your profile contains and how to
              keep it accurate.
            </p>
          </div>
        </div>
      </div>

      {/* What's in your profile */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What's in Your Profile</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Your profile is intentionally minimal. We only collect what we actually need to run
        the service. Two fields are editable, three are derived, and a few are read-only:
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Field</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Editable?</th>
              <th className="text-left p-3 font-semibold text-gray-900">Notes</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Username</strong></td>
              <td className="p-3 border-r border-gray-200">Yes</td>
              <td className="p-3">Used as your login identifier. Must be unique across all accounts.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Email</strong></td>
              <td className="p-3 border-r border-gray-200">Yes</td>
              <td className="p-3">Where password resets and Stripe receipts are sent. Must be unique.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Subscription tier</strong></td>
              <td className="p-3 border-r border-gray-200">No (managed by Stripe)</td>
              <td className="p-3">Free / Pro / Business / Premium. Change via the upgrade flow.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>API keys</strong></td>
              <td className="p-3 border-r border-gray-200">Manage separately</td>
              <td className="p-3">Each key is a separate object. See the API Keys page.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Usage counter</strong></td>
              <td className="p-3 border-r border-gray-200">No (auto-tracked)</td>
              <td className="p-3">Resets monthly on your billing date.</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Account creation date</strong></td>
              <td className="p-3 border-r border-gray-200">No</td>
              <td className="p-3">Set at registration; immutable.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Updating from the dashboard */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Updating Your Profile From the Dashboard</h2>
      <p className="text-gray-700 leading-relaxed">
        For most users, the dashboard is the simplest path. Here's the flow:
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Open the Settings page</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            From any page in the dashboard, click your username in the top-right corner and
            choose Settings. Or navigate directly to{' '}
            <a href="/settings" className="text-blue-600 hover:underline">/settings</a>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Edit the field you want to change</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The Profile section has two text inputs: Username and Email. You can change one or
            both. Fields you don't touch are left as-is — there's no need to re-enter your
            current value just to change one field.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Click Save</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The change applies immediately. You'll see a confirmation toast at the top of the
            screen listing which fields were updated. If the new value conflicts with another
            account (username or email already taken), you'll see a clear error and the field
            will stay editable so you can try a different value.
          </p>
        </div>
      </div>

      {/* Updating via API */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Updating Your Profile via API</h2>
      <p className="text-gray-700 leading-relaxed mb-3">
        For programmatic updates (automation scripts, custom dashboards built on top of
        PixelPerfect), use the <span className="font-mono">PUT /user/update_profile</span>{' '}
        endpoint. This requires JWT authentication — the API key is for screenshot operations,
        not account management.
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X PUT https://api.pixelperfectapi.net/user/update_profile \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "new_username",
    "email":    "new@example.com"
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Both fields are optional, but at least one must be provided. Sending an empty body
        returns a 400 error.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Successful response</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "ok": true,
  "message": "Profile updated successfully (username, email)",
  "account": {
    "id":                123,
    "username":          "new_username",
    "email":             "new@example.com",
    "subscription_tier": "pro",
    "usage_count":       42,
    "created_at":        "2026-01-15T10:30:00Z"
  }
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Possible errors</h3>
      <div className="overflow-x-auto my-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Status</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Detail</th>
              <th className="text-left p-3 font-semibold text-gray-900">Cause</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">400</td>
              <td className="p-3 border-r border-gray-200">Username cannot be empty</td>
              <td className="p-3">You sent <span className="font-mono">"username": ""</span> or whitespace</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">400</td>
              <td className="p-3 border-r border-gray-200">Username already taken</td>
              <td className="p-3">Another account already has that username</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">400</td>
              <td className="p-3 border-r border-gray-200">Email already taken</td>
              <td className="p-3">Another account already has that email</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">400</td>
              <td className="p-3 border-r border-gray-200">No fields to update</td>
              <td className="p-3">You sent neither <span className="font-mono">username</span> nor <span className="font-mono">email</span></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">401</td>
              <td className="p-3 border-r border-gray-200">Could not validate credentials</td>
              <td className="p-3">JWT missing, expired, or invalid</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 font-mono">500</td>
              <td className="p-3 border-r border-gray-200">Failed to update profile</td>
              <td className="p-3">Database error — try again, then contact support</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* What happens behind the scenes */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Happens Behind the Scenes</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">When you change your username</h3>
      <p className="text-gray-700 leading-relaxed">
        The change is purely cosmetic from the API's perspective. Your existing JWT token
        becomes invalid as soon as the username changes (the token's <span className="font-mono">sub</span>{' '}
        claim references the username), so you'll need to log in again. Your API keys are
        unaffected — they reference your account by ID, not username, so all your scripts and
        integrations keep working without changes.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">When you change your email</h3>
      <p className="text-gray-700 leading-relaxed">
        A few things happen automatically:
      </p>
      <ul className="space-y-2 mt-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Email is normalized.</strong> We trim whitespace and lowercase the
            address before storing. <span className="font-mono">JOHN@Example.com</span>{' '}
            becomes <span className="font-mono">john@example.com</span>. This means email
            comparison is case-insensitive — you can't have one account at <span className="font-mono">john@example.com</span>{' '}
            and another at <span className="font-mono">John@Example.com</span>.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Stripe customer record is updated.</strong> If you have a Stripe
            customer record (because you've ever upgraded to a paid tier), we update your
            Stripe email at the same time. Future invoices and receipts go to the new address.
            If the Stripe API call fails, we log a warning but don't fail your profile update —
            your PixelPerfect account email is the source of truth.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Future password reset emails go to the new address.</strong> Any reset
            email you requested before the change is still valid, but new ones go to the new
            address.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>The old email is now available for someone else to register with.</strong>{' '}
            We don't reserve old addresses. If you want to come back later, you'll need to
            register a fresh account.</span>
        </li>
      </ul>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">No email verification (yet)</h4>
            <p className="text-yellow-800 text-sm mb-0">
              We don't currently send a verification email when you change your address. The
              new email is trusted as soon as you set it. This means: don't typo your email,
              and don't change it to an address you don't actually control. If you mistype,
              you'll lock yourself out of password resets. Email verification is on our
              roadmap.
            </p>
          </div>
        </div>
      </div>

      {/* Reading your profile */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reading Your Current Profile</h2>
      <p className="text-gray-700 leading-relaxed">
        To programmatically check what's currently stored on your account, hit the{' '}
        <span className="font-mono">/users/me</span> endpoint:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl https://api.pixelperfectapi.net/users/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        </pre>
      </div>
      <p className="text-gray-700 leading-relaxed mt-3">
        This returns the full user object — same shape as the <span className="font-mono">account</span>{' '}
        field in the update response. Useful for syncing your local state after a profile
        change, or for verifying that an update actually landed.
      </p>

      {/* Common scenarios */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Scenarios</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want to change just my email, not my username"</h4>
          <p className="text-sm text-gray-700">
            Send only the <span className="font-mono">email</span> field in the request body.
            Don't include <span className="font-mono">username</span> at all. Your username
            stays exactly as it is.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I changed my email but my Stripe receipts still go to the old one"</h4>
          <p className="text-sm text-gray-700">
            This usually means the Stripe sync step failed silently. Check your dashboard —
            does your account email show the new value? If yes, but Stripe still shows the
            old one, contact us at{' '}
            <a href="mailto:onetechly@gmail.com?subject=Stripe email out of sync" className="text-blue-600 hover:underline">
              onetechly@gmail.com
            </a>{' '}
            and we'll resync the Stripe customer record manually.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I changed my username and now my CI scripts fail to log in"</h4>
          <p className="text-sm text-gray-700">
            Your scripts are using the old username. Update them to use the new one. (Better
            long-term: have your CI scripts use API keys for screenshot operations rather than
            JWT tokens — API keys are not tied to your username and don't expire.)
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I'm getting Username already taken, but the account I'm thinking of is mine"</h4>
          <p className="text-sm text-gray-700">
            You may have created a second account at some point and forgotten about it. Email
            us — we can identify accounts associated with your email address and help you
            consolidate.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want to change my username back to one I used before"</h4>
          <p className="text-sm text-gray-700">
            Old usernames are not reserved — once released, anyone can claim them. If your
            previous username is still available, you can take it. If someone else has claimed
            it, you'll need to pick something different.
          </p>
        </div>
      </div>

      {/* What you can't change */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What You Can't Change Through This Endpoint</h2>
      <p className="text-gray-700 leading-relaxed mb-3">
        Some account properties have their own dedicated flows or aren't user-changeable at all:
      </p>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Password</strong> — use{' '}
            <a href="/help/article/password-reset" className="text-blue-600 hover:underline">
              the password change flow
            </a>{' '}
            (separate endpoint with current-password verification)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Subscription tier</strong> — use the upgrade/downgrade flow, see{' '}
            <a href="/help/article/managing-your-subscription" className="text-blue-600 hover:underline">
              Managing Your Subscription
            </a></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Account creation date</strong> — immutable</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>User ID</strong> — immutable, internal identifier</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Usage count</strong> — automatically tracked, resets monthly</span>
        </li>
      </ul>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/password-reset"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Changing Your Password</h4>
            <p className="text-sm text-blue-700 mb-0">In-dashboard change vs. forgot-password reset flow</p>
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
            <p className="text-sm text-green-700 mb-0">View, upgrade, downgrade, or cancel your plan</p>
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
            <p className="text-sm text-purple-700 mb-0">Why CI scripts should use API keys instead of JWT tokens</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Profile under control 👤</h4>
            <p className="text-green-800 text-sm mb-0">
              You know what's in your profile, what you can change, what happens automatically
              when you change it (Stripe email sync, JWT invalidation), and how to handle the
              common edge cases. Profile changes are immediate — no email verification step,
              no waiting period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingYourProfileGuide;