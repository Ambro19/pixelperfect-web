// ========================================
// CHANGING YOUR PASSWORD GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ChangingYourPasswordGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #19 in "Account Management" category
// (Slug: changing-your-password in helpArticles.js)
//
// Two distinct flows documented here, both verified against main.py:
//
// FLOW 1: In-dashboard change (you know your current password)
//   - Endpoint: POST /user/change_password
//   - Requires: current_password, new_password
//   - Validation: new_password >= 8 chars, must differ from current
//   - Returns: { ok: true, message: "Password changed successfully" }
//   - Frontend: /change-password route (ChangePasswordPage component)
//
// FLOW 2: Forgot-password reset (you don't know your current password)
//   - Endpoint 1: POST /auth/forgot-password (sends email)
//   - Endpoint 2: POST /auth/reset-password (consumes token from email)
//   - Token TTL: RESET_TOKEN_TTL_SECONDS (URLSafeTimedSerializer)
//   - Frontend: /forgot-password and /reset routes
//   - Email delivery: Gmail SMTP (verified April 13, 2026 in OTSR v4)
//
// IMPORTANT NOTE ON PASSWORD HASHING: Same defensive language as Article #16.
// We say "industry-standard hashing" rather than naming bcrypt/argon2
// specifically since I haven't re-verified the exact algorithm in this thread.
// ========================================

import React from 'react';

const ChangingYourPasswordGuide = () => {
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
              The two ways to change your password depending on whether you remember the old
              one. The validation rules we enforce, what happens to your sessions and API keys
              when the password changes, and the troubleshooting flow if a reset email
              doesn't arrive.
            </p>
          </div>
        </div>
      </div>

      {/* Two flows summary */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Two Flows, One Decision</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Pick the flow that matches your situation:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔑</span>
            <h4 className="font-semibold text-gray-900 mb-0">I know my current password</h4>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Use the in-dashboard change flow. Requires your current password as a security
            check. Takes about 30 seconds.
          </p>
          <p className="text-sm text-blue-700 mb-0 font-medium">
            → Jump to "In-Dashboard Change" below
          </p>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📧</span>
            <h4 className="font-semibold text-gray-900 mb-0">I don't know my current password</h4>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Use the forgot-password email flow. We send you a reset link. No need to remember
            anything except your email address.
          </p>
          <p className="text-sm text-amber-700 mb-0 font-medium">
            → Jump to "Forgot Password Reset" below
          </p>
        </div>
      </div>

      {/* FLOW 1: In-dashboard change */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Flow 1: In-Dashboard Change (You Know Your Current Password)</h2>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Open the change password page</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            From the dashboard, navigate to{' '}
            <a href="/change-password" className="text-blue-600 hover:underline">
              /change-password
            </a>{' '}
            or click your username in the top-right corner and choose Change Password.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Enter your current password</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            This is the security check that prevents someone with a hijacked dashboard session
            from changing your password without knowing the original. If you can't get past
            this step, use the forgot-password flow instead.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Enter and confirm the new password</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Type the new password twice. The form shows a strength indicator as you type
            (weak / medium / strong). Aim for "strong" — at least 12 characters, mixed case,
            numbers, and a symbol or two.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">4</span>
            <h4 className="font-semibold text-gray-900 mb-0">Submit</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The change applies immediately. You'll see a success message and be redirected
            back to the dashboard. There's no email confirmation step — the password is live
            now.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Validation rules</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        We enforce three rules on the new password:
      </p>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>At least 8 characters.</strong> A floor, not a ceiling. Longer is better.</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Must differ from the current password.</strong> No-op changes are rejected with a 400.</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Current password must be correct.</strong> Three wrong attempts in a short window will not lock you out (yet — that's roadmap), but each wrong attempt is logged.</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Via API</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        For programmatic password changes (e.g., automated rotation in a CI/CD setup), use the{' '}
        <span className="font-mono">POST /user/change_password</span> endpoint:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/user/change_password \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "current_password": "old-password-here",
    "new_password":     "new-password-here"
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Returns <span className="font-mono">{'{ "ok": true, "message": "Password changed successfully" }'}</span>{' '}
        on success. Possible errors:
      </p>
      <div className="overflow-x-auto my-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Status</th>
              <th className="text-left p-3 font-semibold text-gray-900">Detail</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">400</td>
              <td className="p-3">Current password is incorrect</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">400</td>
              <td className="p-3">New password must be at least 8 characters</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">400</td>
              <td className="p-3">New password must be different from current password</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 font-mono">401</td>
              <td className="p-3">JWT missing, expired, or invalid</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FLOW 2: Forgot password */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Flow 2: Forgot Password Reset (You Don't Know Your Current Password)</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        If you can't remember your current password, the forgot-password flow lets you reset
        it via an email link. This is the only way to recover access to a locked-out account
        — there is no support backdoor, no security questions, no recovery codes (yet).
      </p>

      <div className="space-y-4 my-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">1</span>
            <h4 className="font-semibold text-gray-900 mb-0">Click "Forgot password?" on the login page</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            On the{' '}
            <a href="/login" className="text-blue-600 hover:underline">login page</a>, the
            link appears next to the Password field. Or navigate directly to{' '}
            <a href="/forgot-password" className="text-blue-600 hover:underline">/forgot-password</a>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">2</span>
            <h4 className="font-semibold text-gray-900 mb-0">Enter your email address</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            Use the email associated with your account. Enter it carefully — typos here are
            the #1 reason reset emails don't arrive.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">3</span>
            <h4 className="font-semibold text-gray-900 mb-0">Check your inbox</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            We send the reset email immediately via Gmail SMTP. The subject line is{' '}
            <strong>"Reset your PixelPerfect password"</strong> and the sender is{' '}
            <span className="font-mono">onetechly@gmail.com</span>. If you don't see it within
            a minute, check your spam folder.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">4</span>
            <h4 className="font-semibold text-gray-900 mb-0">Click the reset link</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The link looks like{' '}
            <span className="font-mono">https://pixelperfectapi.net/reset?token=...</span>. The
            token is single-use and time-limited — once you complete the reset (or after the
            TTL expires), the link stops working.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">5</span>
            <h4 className="font-semibold text-gray-900 mb-0">Set a new password</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0 ml-9">
            The reset page asks for a new password (twice, to catch typos) and shows a strength
            indicator. After submitting, you'll see a success screen with a Login button — you
            can sign in with the new password right away.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">"I didn't get the email"</h4>
            <p className="text-blue-800 text-sm mb-0">
              First, check spam. Then verify the email address is correct (the one we have
              on file, not a similar one). If it's still missing after 5 minutes, the most
              likely causes are: (1) typo in the email you entered, (2) the email associated
              with your account is different from what you're checking, or (3) your email
              provider is blocking us. For #1 or #2, retry with the correct address. For #3,
              email{' '}
              <a href="mailto:onetechly@gmail.com?subject=Password reset email not delivered" className="text-blue-700 underline">
                support
              </a>{' '}
              from a different address — we can manually trigger a reset.
            </p>
          </div>
        </div>
      </div>

      {/* What happens to sessions */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Happens to Sessions and API Keys</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">JWT sessions</h3>
      <p className="text-gray-700 leading-relaxed">
        When you change your password, your existing JWT token <strong>does not</strong> get
        immediately invalidated. JWTs are stateless — they're cryptographically signed assertions
        that include an expiry time, and there's no central registry to revoke them. They expire
        naturally 24 hours after issue.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        In practice, the dashboard logs you out and prompts a fresh login after a successful
        password change in most flows. But if someone had a copy of your token before the
        change, they could technically use it until expiry. This is a known property of
        JWT-based auth and the reason short token lifetimes matter.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        <strong>If you suspect your account is compromised</strong> (not just rotating a
        password as housekeeping), do these in order: (1) change the password, (2) revoke and
        regenerate every API key, (3) log out from every device you have open, (4) wait 24
        hours before considering the account fully clean.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">API keys</h3>
      <p className="text-gray-700 leading-relaxed">
        API keys are completely independent of your password. Changing your password{' '}
        <strong>does not</strong> revoke your API keys. This is intentional — your CI scripts
        and production integrations should keep working without redeployment when you rotate
        your account password.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        If you want to revoke API keys too (e.g., as part of an incident response), you have
        to do that explicitly from the API Keys page in your dashboard.
      </p>

      {/* Choosing a strong password */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Choosing a Strong Password</h2>
      <p className="text-gray-700 leading-relaxed mb-3">
        Quick guidance because this matters more than the hashing algorithm we use on our side:
      </p>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Use a password manager.</strong> 1Password, Bitwarden, KeePass — pick
            one. Let it generate a long random password for each account, including this one.
            Don't try to memorize it.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Don't reuse passwords.</strong> If your PixelPerfect password is also
            your email password and your bank password, a breach of any one of those services
            compromises all three.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Length beats complexity.</strong> A 20-character random string is
            stronger than an 8-character one with weird symbols. The math doesn't care
            whether the characters are friendly to type.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Avoid common patterns.</strong> "Spring2026!" passes our 8-character
            check but appears on common-password lists. Random is the only safe path.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Check{' '}
            <a href="https://haveibeenpwned.com" className="text-blue-600 hover:underline">
              haveibeenpwned.com
            </a></strong> if you suspect a password has been in a breach. Free, run by Troy
            Hunt, doesn't store what you type.</span>
        </li>
      </ul>

      {/* Common scenarios */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Scenarios</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I get 'Current password is incorrect' but I'm sure it's right"</h4>
          <p className="text-sm text-gray-700">
            Double-check for caps lock and trailing spaces (when copy-pasting from a password
            manager, sometimes a stray space sneaks in). If you're certain it's right and it's
            still failing, use the forgot-password flow — it's faster than debugging.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"The reset link says 'expired'"</h4>
          <p className="text-sm text-gray-700">
            Reset tokens have a TTL — typically 1 hour. If the link was sitting in your inbox
            longer than that, it's no longer valid. Just request another one from the
            forgot-password page. Old tokens become invalid as soon as a new one is issued.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"The reset link says 'invalid'"</h4>
          <p className="text-sm text-gray-700">
            Either the token was already used (you already completed a reset with it), or it
            was tampered with in transit. Request a fresh one. If this happens repeatedly,
            you may have a browser extension rewriting URLs — try in incognito mode or a
            different browser.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I changed my password but my forgot-password email still goes to the old address"</h4>
          <p className="text-sm text-gray-700">
            Password change and email change are separate actions. Update your email via{' '}
            <a href="/help/article/updating-account-details" className="text-blue-600 hover:underline">
              the profile update flow
            </a>, then request another reset (which will go to the new address).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Should I rotate my password regularly?"</h4>
          <p className="text-sm text-gray-700">
            Modern guidance (NIST SP 800-63B) is: <strong>no, rotate only when there's a
            reason</strong>. Forced rotation tends to lead to weaker passwords (people append
            "1", "2", "3"). Better practice: use a strong unique password and only change it
            when you suspect compromise or after a known breach.
          </p>
        </div>
      </div>

      {/* What's coming */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What's on the Roadmap</h2>
      <p className="text-gray-700 leading-relaxed mb-3">
        Password and authentication features that aren't shipped yet but are planned:
      </p>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Two-factor authentication (TOTP)</strong> — adds a code from your
            authenticator app on top of your password. Highest-leverage account security
            improvement we can make.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Login email notifications</strong> — get an email every time someone
            logs in from a new device or unusual location.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Active session management</strong> — view and terminate active sessions
            from your dashboard. Today, the only way to invalidate a session is to wait for
            JWT expiry.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Brute-force protection on login attempts</strong> — temporary lockouts
            after a few failed attempts. Today we log failures but don't block.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Password breach checking</strong> — block passwords known to be in
            public breach lists (HaveIBeenPwned k-anonymity API).</span>
        </li>
      </ul>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/account-security"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">How We Secure Your Account</h4>
            <p className="text-sm text-blue-700 mb-0">Password hashing, JWT sessions, encryption — the full picture</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/updating-account-details"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Managing Your Profile</h4>
            <p className="text-sm text-green-700 mb-0">Update your username and email address</p>
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
            <p className="text-sm text-purple-700 mb-0">Why and when to rotate API keys (independent of your password)</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Password handled 🔑</h4>
            <p className="text-green-800 text-sm mb-0">
              You know which flow to use depending on whether you remember your current
              password, the validation rules we enforce, what happens to your sessions and
              API keys when the password changes, and how to handle the common edge cases.
              The forgot-password reset email flow is verified working end-to-end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangingYourPasswordGuide;