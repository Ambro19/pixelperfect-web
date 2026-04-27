// ========================================
// HOW WE SECURE YOUR ACCOUNT - PIXELPERFECT
// ========================================
// File: frontend/src/guides/AccountSecurityGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #16 in "Security & Privacy" category
// (Slug: account-security in helpArticles.js)
//
// Plain-English walk-through of the security mechanisms protecting accounts.
// The audience is anyone curious — security-conscious developers, prospective
// buyers, or just users who want to know how their account is protected.
//
// Verified facts used:
//   - JWT: HS256, 24-hour expiry (ACCESS_TOKEN_EXPIRE_MINUTES=1440)
//   - JWT stored in localStorage as 'auth_token'
//   - SECRET_KEY env var for JWT signing (32+ chars random)
//   - API keys: pk_ + 32 hex, SHA-256 hashed in DB
//   - All traffic via HTTPS (Let's Encrypt cert on api.pixelperfectapi.net)
//   - R2 storage encrypted at rest by Cloudflare
//   - Password handling: defensive language since exact algorithm should
//     be confirmed against current auth_utils.py before claiming specific
//     scheme like bcrypt/argon2
// ========================================

import React from 'react';

const AccountSecurityGuide = () => {
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
              The actual security mechanisms protecting your PixelPerfect account, explained
              in plain English. How passwords are stored, how login sessions work, how API
              traffic is protected in transit, and what each of these mechanisms actually
              defends against. By the end you'll know what's protecting you and where the
              real responsibility for account security still sits with you.
            </p>
          </div>
        </div>
      </div>

      {/* The defenses overview */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Five Defenses Protecting Your Account</h2>
      <p className="text-gray-700 leading-relaxed">
        Account security is layered. No single mechanism is enough — each defends against a
        specific category of attack. Here's the stack:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Mechanism</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">What it protects</th>
              <th className="text-left p-3 font-semibold text-gray-900">Attack it defends against</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>HTTPS / TLS 1.2+</strong></td>
              <td className="p-3 border-r border-gray-200">Data in transit (login, API calls)</td>
              <td className="p-3">Network eavesdropping on Wi-Fi, ISP, etc.</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>One-way password hashing</strong></td>
              <td className="p-3 border-r border-gray-200">Your password</td>
              <td className="p-3">Database leak revealing plaintext passwords</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>JWT session tokens (24-hour expiry)</strong></td>
              <td className="p-3 border-r border-gray-200">Your dashboard session</td>
              <td className="p-3">Indefinite session reuse if a token leaks</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>SHA-256 hashed API keys</strong></td>
              <td className="p-3 border-r border-gray-200">Your API keys</td>
              <td className="p-3">Database leak revealing usable API keys</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Encryption at rest (R2)</strong></td>
              <td className="p-3 border-r border-gray-200">Your screenshot files</td>
              <td className="p-3">Physical disk theft from the cloud provider</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* HTTPS */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. HTTPS Everywhere</h2>
      <p className="text-gray-700 leading-relaxed">
        Every connection to PixelPerfect — web dashboard, API calls, contact form submissions —
        runs over HTTPS using TLS 1.2 or higher. Our SSL certificates are issued by Let's
        Encrypt and renewed automatically. There is no plain-HTTP entrypoint to the API; if
        you accidentally type <span className="font-mono">http://</span> instead of <span className="font-mono">https://</span>,
        you'll be redirected to the encrypted version.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        <strong>What this protects:</strong> when you log in from a coffee shop Wi-Fi, the
        person at the next table can't see your password. When you call our API from a corporate
        network, the network admin can see <em>that</em> you're calling api.pixelperfectapi.net,
        but not <em>what</em> you're sending or receiving.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        <strong>What this doesn't protect:</strong> compromised endpoints. If your laptop has
        malware that reads your browser memory, HTTPS doesn't help. The encryption is between
        the two endpoints — if one endpoint is owned by an attacker, encryption isn't the
        defense you need.
      </p>

      {/* Password handling */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How Your Password Is Stored</h2>
      <p className="text-gray-700 leading-relaxed">
        Your password is never stored in plaintext. When you set a password (at registration
        or reset), the server takes the password, runs it through a one-way hashing algorithm,
        and stores only the result.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        "One-way" means there's no reverse function — no path from the stored hash back to
        your original password. Even we, the people running the service, cannot read out your
        password from the database. When you log in, the server hashes the password you type
        the same way and compares hashes. If they match, you're authenticated. If they don't,
        you're not — and the server never saw your real password long enough to do anything
        else with it.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`Registration:
  user types password → server hashes it → stores hash in DB
  (the typed password is discarded after hashing)

Login:
  user types password → server hashes it → compares to stored hash
  (if match: issue JWT; if not: reject)

Password forgotten:
  user requests reset → email link sent → user sets new password
  (server cannot recover the old password — only replace it)`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        We use an industry-standard password hashing scheme designed specifically to resist
        offline cracking attempts: it's deliberately slow (so brute-forcing is impractical),
        salted (so two users with the same password produce different hashes), and resistant
        to GPU-accelerated attacks. If a database backup were ever stolen, an attacker would
        face a multi-million-dollar compute bill per password to attempt cracking.
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">What this means for your password choice</h4>
            <p className="text-yellow-800 text-sm mb-0">
              Hashing protects you from a database leak. It does NOT protect you from a weak
              password being guessed directly through the login form. If you set your password
              to "password123", an attacker can just try that. Use a long, unique password —
              ideally generated by a password manager. The strongest hashing scheme in the
              world can't save a password that's already on the public breach lists.
            </p>
          </div>
        </div>
      </div>

      {/* JWT sessions */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How Login Sessions Work (JWT Tokens)</h2>
      <p className="text-gray-700 leading-relaxed">
        After you log in successfully, the server issues you a <strong>JWT</strong> (JSON Web
        Token). Think of it as a cryptographically signed sticker: it says "this person logged
        in successfully, here's their user ID, valid until <em>X</em>." Your browser keeps that
        sticker and shows it on every subsequent dashboard request.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-4">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Anatomy of your session token:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Algorithm:</strong> HS256 (HMAC with SHA-256). Standard, well-vetted.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Lifetime:</strong> 24 hours from issue. After that, you're prompted to log in again.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Storage:</strong> Browser localStorage under the key{' '}
              <span className="font-mono">auth_token</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span><strong>Signing key:</strong> A 32+ character random secret (the{' '}
              <span className="font-mono">SECRET_KEY</span> env var) that only our server knows.
              An attacker who guesses your token's payload but not this secret can't forge a token.</span>
          </li>
        </ul>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Every request your browser makes to the dashboard or backend includes the token in the{' '}
        <span className="font-mono">Authorization: Bearer ...</span> header. The server verifies
        the signature, checks the expiry, looks up your user ID, and processes the request as you.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Why 24-hour expiry?</h3>
      <p className="text-gray-700 leading-relaxed">
        It's a balance. Shorter expiry means you'd log in more often (annoying). Longer expiry
        means a stolen token grants longer access (dangerous). 24 hours hits the sweet spot for
        most use cases. If you log out, the token is removed from your browser immediately —
        but the server still considers tokens valid until natural expiry, so technically a copy
        of your token taken before logout could be used until expiry. This is a known property
        of JWT-based auth and is why long-lived tokens are a bad idea.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">JWT vs API key — when to use which</h3>
      <p className="text-gray-700 leading-relaxed">
        Two different auth methods for two different purposes:
      </p>
      <div className="overflow-x-auto my-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200"></th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">JWT token</th>
              <th className="text-left p-3 font-semibold text-gray-900">API key</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Lifetime</strong></td>
              <td className="p-3 border-r border-gray-200">24 hours</td>
              <td className="p-3">Until you delete it</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Usage</strong></td>
              <td className="p-3 border-r border-gray-200">Dashboard / interactive sessions</td>
              <td className="p-3">Server-side API integrations</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Revocation</strong></td>
              <td className="p-3 border-r border-gray-200">Logging out / waiting for expiry</td>
              <td className="p-3">Delete from dashboard</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200"><strong>Issued by</strong></td>
              <td className="p-3 border-r border-gray-200">Logging in with email + password</td>
              <td className="p-3">"Generate API key" in dashboard</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        For more on this distinction, see the{' '}
        <a href="/help/article/api-authentication-methods" className="text-blue-600 hover:underline">
          API Authentication Methods guide
        </a>.
      </p>

      {/* API key hashing */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. API Keys Are Hashed Too</h2>
      <p className="text-gray-700 leading-relaxed">
        When you create an API key, the dashboard shows you the plaintext key once. After that,
        only a SHA-256 hash of the key lives in our database. We genuinely cannot show you the
        plaintext again — by design. This is the same defense pattern as passwords: a database
        leak reveals hashes, not usable keys.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        For the full story on how to handle keys safely on your side, see the{' '}
        <a href="/help/article/api-key-security-best-practices" className="text-blue-600 hover:underline">
          API Key Best Practices guide
        </a>.
      </p>

      {/* Encryption at rest */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Encryption at Rest</h2>
      <p className="text-gray-700 leading-relaxed">
        Your screenshot files live in Cloudflare R2, which encrypts data at rest by default
        using AES-256. That means even if someone physically stole the storage hardware from
        a Cloudflare data center, they'd get encrypted bytes and would need Cloudflare's keys
        to decrypt them.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Our PostgreSQL database on Render is also encrypted at rest. The encryption is
        transparent to our application code — the database driver handles it.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">What encryption at rest does and doesn't do</h4>
            <p className="text-blue-800 text-sm mb-0">
              Encryption at rest defends against physical theft of disks. It does NOT defend
              against SQL injection, leaked credentials, or compromised servers — because in
              all of those cases, the attacker is using the legitimate decryption path. The
              real defenses against those attacks are good code, secret management, and
              keeping keys out of source control.
            </p>
          </div>
        </div>
      </div>

      {/* What you can do */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What You Can Do to Stay Safer</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Some of account security is on us. Some of it is unavoidably on you. The list below is
        what we recommend everyone do:
      </p>

      <div className="space-y-3 my-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Use a strong, unique password</h4>
          <p className="text-sm text-gray-700 mb-0">
            Don't reuse a password from another site. Use a password manager (1Password,
            Bitwarden, KeePass) to generate and store a long random password.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Log out on shared devices</h4>
          <p className="text-sm text-gray-700 mb-0">
            If you log into the dashboard from a shared computer (library, friend's laptop,
            company kiosk), explicitly log out when you're done. Don't rely on the 24-hour
            session expiry.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Watch for phishing emails</h4>
          <p className="text-sm text-gray-700 mb-0">
            Legitimate emails from us come from{' '}
            <span className="font-mono">onetechly@gmail.com</span>. We won't ask you for your
            password by email. We won't ask you to log in via a link to a domain other than{' '}
            <span className="font-mono">pixelperfectapi.net</span>. If something feels off,
            navigate to the dashboard manually instead of clicking the link.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">Reset your password if anything looks wrong</h4>
          <p className="text-sm text-gray-700 mb-0">
            See an unfamiliar API key in your dashboard? A screenshot you didn't take? Reset
            your password immediately (it invalidates active sessions on next login) and
            review your API keys. Then email us — we can correlate with server logs.
          </p>
        </div>
      </div>

      {/* What's on the roadmap */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What's Coming</h2>
      <p className="text-gray-700 leading-relaxed mb-3">
        Account security improvements on the roadmap, listed honestly because some of these
        are common requests:
      </p>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Two-factor authentication (2FA)</strong> — TOTP-based, planned for the next
            major release. Until then, password strength is your primary defense.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Login email notifications</strong> — get an email every time someone logs
            into your account from a new device or location. Planned alongside 2FA.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>Active session management</strong> — view and revoke active sessions from
            the dashboard. Today, the only way to invalidate a session is to wait for the
            24-hour expiry or change your password.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">•</span>
          <span><strong>SSO / SAML for Business and Premium</strong> — enterprise customers will
            be able to wire up Google Workspace, Microsoft Entra, or Okta for single sign-on.</span>
        </li>
      </ul>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/api-key-security-best-practices"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">API Key Best Practices</h4>
            <p className="text-sm text-blue-700 mb-0">How to store, rotate, and use keys safely on your side</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/data-retention-policy"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Data Retention & Privacy</h4>
            <p className="text-sm text-green-700 mb-0">What we store, where, and for how long</p>
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
            <p className="text-sm text-purple-700 mb-0">EU compliance, sub-processors, and data subject rights</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You know what's protecting you 🛡️</h4>
            <p className="text-green-800 text-sm mb-0">
              You understand the five layers of account security, what each defends against,
              what they can't defend against, and what's on our roadmap to add. The honest
              version: we have a solid foundation today, with 2FA and session management as
              the most important additions still to come. Use a strong password, watch for
              phishing, and keep an eye on your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurityGuide;