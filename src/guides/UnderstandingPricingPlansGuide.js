// ========================================
// UNDERSTANDING PRICING PLANS GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/UnderstandingPricingPlansGuide.jsx
// Author: OneTechly
// Update: April 28, 2026
//
// Article #28 in "Billing & Subscription" category
// (Slug: understanding-pricing-plans in helpArticles.js)
//
// IMPORTANT: This article was previously categorized under Getting Started
// in error. Moved to Billing & Subscription where it belongs.
//
// Verified facts (all from .env.production and code):
//   - Tiers: Free $0 / Pro $49 / Business $199 / Premium $499 (monthly)
//   - Annual discount roughly 20%
//   - Monthly screenshots: 100 / 5,000 / 50,000 / unlimited
//   - Batch URLs per job: — / 50 / 200 / 1,000
//   - Concurrent captures: 2 / 3 / 5 / 5
//
// Tone: helpful decision framework, not a sales pitch. Honest about the
// fact that picking too high a tier wastes money and picking too low
// causes 402s. The job is to help users land on the right tier.
//
// Avoids over-promising on features that are Coming Soon (custom JS,
// webhooks, white-label) — refers to /features for current capabilities.
// ========================================

import React from 'react';

const UnderstandingPricingPlansGuide = () => {
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
              How the four PixelPerfect tiers compare, how to pick the right one for your
              usage, and the trade-offs between monthly and annual billing. Plus a
              decision-framework for when to size up or down.
            </p>
          </div>
        </div>
      </div>

      {/* The four tiers */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Four Tiers</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Tier</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Monthly</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Screenshots / mo</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Batch URLs / job</th>
              <th className="text-left p-3 font-semibold text-gray-900">Concurrent</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200"><strong>Free</strong></td>
              <td className="p-3 border-r border-gray-200">$0</td>
              <td className="p-3 border-r border-gray-200">100</td>
              <td className="p-3 border-r border-gray-200">&mdash;</td>
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
        For the full feature comparison, see the{' '}
        <a href="/pricing" className="text-blue-600 hover:underline">pricing page</a> &mdash;
        this article focuses on the decision-making logic.
      </p>

      {/* Picking the right tier */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Picking the Right Tier</h2>
      <p className="text-gray-700 leading-relaxed">
        Three numbers drive the decision:
      </p>
      <ol className="space-y-3 mt-4 text-gray-700 ml-6 list-decimal">
        <li>
          <strong>How many screenshots will you take per month?</strong> The most reliable
          predictor. If you're under 100, Free covers you. Between 100 and 5,000, Pro. Between
          5,000 and 50,000, Business. Above that, Premium.
        </li>
        <li>
          <strong>Do you need batch processing?</strong> Free doesn't include batch. If you're
          firing many URLs at once (e.g., capturing all pages of a site for monitoring), you
          need at least Pro.
        </li>
        <li>
          <strong>How many captures will you run in parallel?</strong> Free allows 2 at a
          time, Pro allows 3, Business and Premium allow 5. If your application fires 10
          requests in parallel, you'll see 429 errors on lower tiers (see the{' '}
          <a href="/help/article/common-error-codes" className="text-blue-600 hover:underline">
            Common Error Codes guide
          </a>).
        </li>
      </ol>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Decision shortcuts</h3>
      <div className="space-y-3 my-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">"I'm just exploring"</h4>
          <p className="text-sm text-gray-700 mb-0">Start on <strong>Free</strong>. 100 screenshots is enough to evaluate the API and build a small prototype. No card needed.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">"I'm building a side project or small SaaS"</h4>
          <p className="text-sm text-gray-700 mb-0"><strong>Pro</strong> handles most cases. 5,000 captures lets a typical application capture content for hundreds of users with margin to spare.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">"I'm running a real product with paying customers"</h4>
          <p className="text-sm text-gray-700 mb-0"><strong>Business</strong> covers most production workloads. 50,000 monthly captures + 200-URL batches + 5 concurrent lets you scale comfortably without constantly thinking about limits.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">"I have high volume or unpredictable spikes"</h4>
          <p className="text-sm text-gray-700 mb-0"><strong>Premium</strong>. Unlimited screenshots removes the quota worry entirely, and 1,000-URL batches handle large workflows in single jobs.</p>
        </div>
      </div>

      {/* When to size up */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Size Up</h2>
      <p className="text-gray-700 leading-relaxed">
        Sizing up makes sense when any of these are true:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>You're hitting 402 errors before your billing cycle resets.</strong> The quota signal that you've outgrown the tier.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>You're hitting 429 errors regularly.</strong> Concurrent-capture pressure means more parallel users or workers; the higher tier helps.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Your batches are getting truncated.</strong> Pro caps batches at 50 URLs; if you find yourself splitting big batches into multiple smaller jobs, Business or Premium is more efficient.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>You're consistently using more than 60&ndash;70% of your quota.</strong> A safety margin matters &mdash; usage spikes above your quota will surface as 402s and break your application.</span>
        </li>
      </ul>

      {/* When to size down */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Size Down</h2>
      <p className="text-gray-700 leading-relaxed">
        Sizing down makes sense when any of these are true:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>You're using less than 20% of your quota for 2&ndash;3 consecutive months.</strong> You're paying for capacity you don't use.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Your usage pattern has changed permanently.</strong> A product pivot or seasonal slowdown that won't recover.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>You signed up for a higher tier "to be safe" and never grew into it.</strong> Many teams overestimate their initial usage.</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        Downgrading prorates automatically &mdash; you get credit for the unused portion of the
        higher tier. See the{' '}
        <a href="/help/article/understanding-your-invoice" className="text-blue-600 hover:underline">
          Understanding Your Invoice guide
        </a>{' '}
        for how proration appears.
      </p>

      {/* Monthly vs annual */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Monthly vs Annual</h2>
      <p className="text-gray-700 leading-relaxed">
        Each paid tier comes in two billing cadences. Annual saves roughly 20% over monthly.
        The trade-off is liquidity: annual is paid upfront and locked in for 12 months;
        monthly lets you cancel anytime.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">When to pick monthly</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>You're testing whether the tier fits your usage</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Your usage is volatile and you might want to size up or down</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>You can't commit a year of budget upfront</span>
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">When to pick annual</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>You've used the tier for 2&ndash;3 months and confirmed it fits</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>Your usage is stable and predictable</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>You'd rather have one invoice per year for accounting simplicity</span>
        </li>
      </ul>

      <p className="text-gray-700 leading-relaxed mt-3">
        Suggested approach: start monthly, validate the tier fits for 2&ndash;3 cycles, then switch
        to annual once you're sure. The annual savings compound over time.
      </p>

      {/* What's included at every tier */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What's Included at Every Tier</h2>
      <p className="text-gray-700 leading-relaxed">
        Some things don't vary by tier. Every account &mdash; Free included &mdash; gets:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>All four output formats (PNG, JPEG, WebP, PDF)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Full-page screenshots (<code className="font-mono">full_page: true</code>)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Custom viewport (320&ndash;3840 wide, 240&ndash;2160 tall)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Element removal (<code className="font-mono">remove_elements</code>) and capture delay (<code className="font-mono">delay</code>)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Dark mode (<code className="font-mono">dark_mode</code>) support</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>7-day file retention on R2 storage</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>API key authentication, dashboard, history, account management</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        For the complete and current capability list, see the{' '}
        <a href="/features" className="text-blue-600 hover:underline">Features page</a>. Some
        advanced features (custom JavaScript execution, webhooks, white-label options) are
        on our roadmap and marked as Coming Soon &mdash; they'll be tier-gated when they ship.
      </p>

      {/* Common scenarios */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Scenarios</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I'm not sure how many screenshots I'll need"</h4>
          <p className="text-sm text-gray-700">
            Start on Free for a couple of weeks. Watch your dashboard's usage counter. If you
            hit 100 in a week, you're trending toward 400+/month and Pro is the right move.
            If you barely use it, Free continues to fit. There's no rush.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My usage is bursty &mdash; some months I'll capture 30,000, others 200"</h4>
          <p className="text-sm text-gray-700">
            Pick the tier that comfortably fits your <em>peak</em> month, on monthly billing.
            You'll overpay during slow months but never hit 402s during busy ones &mdash; which
            is the worse failure mode for an integration. If the bursts settle into a stable
            average, switch to annual at that point.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My team has multiple developers using the API"</h4>
          <p className="text-sm text-gray-700">
            Each developer can have their own API key under one account, or you can use a
            single shared key. Either way, all usage counts against one quota. If your team
            is hitting concurrency limits, Business or Premium (5 concurrent captures) tends
            to fit better than Pro (3 concurrent).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I outgrew my tier mid-month"</h4>
          <p className="text-sm text-gray-700">
            Upgrade through <a href="/pricing" className="text-blue-600 hover:underline">/pricing</a>.
            Stripe handles the proration: you get a credit for the unused part of your old
            tier and a charge for the new tier from now to the end of the cycle. Tier change
            is effective within seconds. Your existing API key keeps working.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"I want to gift PixelPerfect to a colleague"</h4>
          <p className="text-sm text-gray-700">
            Not currently a self-serve flow. Email{' '}
            <a href="mailto:onetechly@gmail.com?subject=Gift subscription" className="text-blue-600 hover:underline">
              onetechly@gmail.com
            </a>{' '}
            and we'll set it up manually.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/how-to-upgrade-plan"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">How to Upgrade Your Plan</h4>
            <p className="text-sm text-blue-700 mb-0">The exact upgrade flow when you've decided which tier fits</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/rate-limits-and-quotas"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Rate Limits and Quotas</h4>
            <p className="text-sm text-green-700 mb-0">What each tier's limits actually mean in practice</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/managing-your-subscription"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Managing Your Subscription</h4>
            <p className="text-sm text-purple-700 mb-0">View, upgrade, downgrade, switch cadence, or cancel</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Pricing decoded 💰</h4>
            <p className="text-green-800 text-sm mb-0">
              You can compare the four tiers, pick the right one based on monthly volume +
              batch needs + concurrency, and recognize the signals that mean it's time to
              size up or down. Most teams land on Pro or Business; very few need Premium
              from day one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderstandingPricingPlansGuide;

//===== END OF UnderstandingPricingPlansGuide.js =====