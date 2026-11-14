// ========================================
// PAID PLANS PAUSED NOTICE — PixelPerfect
// ========================================
// File: frontend/src/components/PaidPlansPausedNotice.jsx
// Shown on the Pricing and Subscription pages while PAID_PLANS_PAUSED is true
// (see config/billingStatus.js). Renders nothing otherwise.
// ========================================
import React from 'react';
import { PAID_PLANS_PAUSED, PAUSED_TITLE, PAUSED_NOTICE } from '../config/billingStatus';

export default function PaidPlansPausedNotice({ className = '' }) {
  if (!PAID_PLANS_PAUSED) return null;
  return (
    <div
      role="status"
      className={`max-w-3xl mx-auto mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:px-5 sm:py-4 text-left ${className}`}
    >
      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-amber-900">{PAUSED_TITLE}</p>
        <p className="text-sm text-amber-800 mt-1">
          {PAUSED_NOTICE} Questions? Email{' '}
          <a href="mailto:support@pixelperfectapi.net" className="min-h-0 min-w-0 inline font-medium underline underline-offset-2">
            support@pixelperfectapi.net
          </a>.
        </p>
      </div>
    </div>
  );
}

//=========== END OF PaidPlansPausedNotice.jsx ===========
