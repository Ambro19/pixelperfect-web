// ========================================
// BILLING STATUS — PixelPerfect
// ========================================
// File: frontend/src/config/billingStatus.js
// Author: OneTechly
// Updated: November 2026
//
// One switch for pausing NEW paid subscriptions.
//
// Why (Nov 2026): OneTechly, LLC must hold a New York Certificate of Authority
// before it can collect sales tax, and paid plans will be sold as price + tax
// (Stripe Tax). Until both are in place, nobody can start a paid plan.
//
// While PAID_PLANS_PAUSED is true:
//   - Pricing and Subscription pages show PAUSED_NOTICE and the paid-plan
//     buttons are disabled ("Temporarily unavailable").
//   - Every code path that opens Stripe Checkout refuses before calling the
//     server.
// The backend enforces the same rule (PAID_CHECKOUT_PAUSED=true on Render), so
// old cached pages and direct API calls are refused too.
//
// TO RE-ENABLE: set this to false, AND remove PAID_CHECKOUT_PAUSED on Render
// (or set it to false), AND only after Stripe Tax is turned on in checkout.
// ========================================

export const PAID_PLANS_PAUSED = true;

export const PAUSED_TITLE = 'Paid plans are temporarily unavailable';

export const PAUSED_NOTICE =
  "New paid subscriptions are paused for a short time while we finish a billing update. " +
  'Your Free plan keeps working as normal, with 100 screenshots every month. ' +
  'Please check back soon.';

export const PAUSED_BUTTON_LABEL = 'Temporarily unavailable';

//=========== END OF billingStatus.js ===========
