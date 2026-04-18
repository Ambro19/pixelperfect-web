// ========================================
// HOW TO CREATE AN ACCOUNT GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/HowToCreateAccountGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Guide #2 in "Getting Started" category
// Walks new users through creating a PixelPerfect account
// ========================================

import React from 'react';

const HowToCreateAccountGuide = () => {
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
              In this guide, you'll learn how to create your PixelPerfect account in under 3 minutes
              and access your dashboard to start capturing screenshots.
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Before You Begin</h2>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>A valid email address you can access</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>A strong password (minimum 8 characters)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>About 3 minutes of your time</span>
        </li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Good news — the Free tier is generous</h4>
            <p className="text-blue-800 text-sm mb-0">
              Every new account starts on our <strong>Free plan</strong> at no cost. No credit card is
              required during signup. You can upgrade to Pro, Business, or Premium whenever you're ready.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Go to the Registration Page</h2>
      <p className="text-gray-700 leading-relaxed">
        Open your web browser and navigate to:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <code className="text-green-400 text-sm font-mono">
          https://pixelperfectapi.net/register
        </code>
      </div>
      <p className="text-gray-700 leading-relaxed">
        You can also click <strong>Get Started</strong> from any page on our site, or <strong>Create
        account</strong> from the Sign In page.
      </p>

      {/* Step 2 */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Fill In Your Account Details</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The registration form has four fields. Here's what each one requires:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">1</span>
            Username
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Your unique identifier on PixelPerfect.
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Minimum 3 characters</li>
            <li>• Shown on your dashboard and invoices</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">2</span>
            Email
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Must be a valid, accessible email address.
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Used for password reset emails</li>
            <li>• Used for billing receipts and account notices</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">3</span>
            Password
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Between 8 and 128 characters.
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Strength meter shows <strong>Weak</strong>, <strong>Medium</strong>, or <strong>Strong</strong></li>
            <li>• Click 👁️ to reveal what you typed</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">4</span>
            Confirm Password
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            Re-enter the same password to prevent typos.
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Must match the password field exactly</li>
            <li>• Form will highlight a mismatch in red</li>
          </ul>
        </div>
      </div>

      {/* Password strength tip */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Aim for a Strong password</h4>
            <p className="text-yellow-800 text-sm mb-0">
              For the best security, use at least 12 characters and combine uppercase letters,
              lowercase letters, numbers, and a symbol (like <span className="font-mono">!@#$</span>).
              The live strength meter will guide you.
            </p>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Create Your Account</h2>
      <p className="text-gray-700 leading-relaxed">
        Once all four fields are filled in correctly, the <strong>Create account</strong> button
        becomes active. Click it to submit the form.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        The button will briefly show <em>"Creating account..."</em> while we set up your profile.
        On success, you'll see a confirmation toast reading <strong>"Account created successfully!"</strong>
      </p>

      {/* Step 4 */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 4: You're In — Welcome to Your Dashboard</h2>
      <p className="text-gray-700 leading-relaxed">
        That's it! You'll be taken straight to your <strong>Dashboard</strong>, where you can:
      </p>
      <ul className="space-y-2 mt-4">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Generate your first API key</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Capture your first screenshot right from the browser</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>View your usage counters and subscription status</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Browse your screenshot history</span>
        </li>
      </ul>

      {/* Troubleshooting */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        If something goes wrong during signup, here's what the most common issues look like and how
        to resolve them:
      </p>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Please fix the highlighted fields"</h4>
          <p className="text-sm text-gray-700 mb-2">
            One or more fields have inline errors shown in red beneath them. Common causes:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• Username is shorter than 3 characters</li>
            <li>• Email is missing the <span className="font-mono">@</span> or domain</li>
            <li>• Password is shorter than 8 characters</li>
            <li>• Password and Confirm Password don't match</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Username already taken" or "Email already registered"</h4>
          <p className="text-sm text-gray-700">
            That identifier is in use. Try a different username, or if you already have an account,{' '}
            <a href="/login" className="text-blue-600 hover:underline">sign in instead</a>. Forgot your
            password?{' '}
            <a href="/forgot-password" className="text-blue-600 hover:underline">Reset it here</a>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">Caps lock warning appears</h4>
          <p className="text-sm text-gray-700">
            If you see <em>"Caps lock is on"</em> under the password field, turn off Caps Lock before
            typing. Passwords are case-sensitive, so a mismatch here is the most common cause of
            "passwords don't match" errors.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">The "Create account" button is greyed out</h4>
          <p className="text-sm text-gray-700">
            The button only activates when all four fields pass validation. Scroll up and check each
            field — any with red text below it needs to be corrected before you can submit.
          </p>
        </div>
      </div>

      {/* Security Note with PDF guide link */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-8 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Keep your credentials safe</h4>
            <p className="text-yellow-800 text-sm mb-2">
              Your password gives full access to your account, including your API keys and billing.
              Never share it, and avoid reusing passwords from other services. If you ever suspect
              your account is compromised, reset your password immediately from{' '}
              <a href="/forgot-password" className="text-yellow-900 underline font-medium">
                pixelperfectapi.net/forgot-password
              </a>.
            </p>
            <p className="text-yellow-800 text-sm mb-0">
              Need a walkthrough?{' '}
              <a
                href="/guides/PixelPerfect_ResetPassword_Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-900 underline font-medium inline-flex items-center gap-1"
              >
                Download our step-by-step Reset Password Guide (PDF)
                <svg className="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Now that your account is ready, here's what to do next:
      </p>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/getting-your-api-key"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Get your API key</h4>
            <p className="text-sm text-blue-700 mb-0">Generate the API key you'll use to authenticate requests</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/quick-start-guide"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Quick Start Guide</h4>
            <p className="text-sm text-green-700 mb-0">Capture your first screenshot in under 5 minutes</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/understanding-pricing-plans"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Understanding pricing plans</h4>
            <p className="text-sm text-purple-700 mb-0">Compare Free, Pro, Business, and Premium tiers</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Welcome aboard! 🎉</h4>
            <p className="text-green-800 text-sm mb-0">
              Your PixelPerfect account is ready to go. Head to your dashboard to grab your API key
              and start capturing screenshots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToCreateAccountGuide;