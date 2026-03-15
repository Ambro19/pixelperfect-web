// ========================================
// PRICING CONFIGURATION - PIXELPERFECT FRONTEND
// ========================================
// File: frontend/src/config/pricing.js
// Author: OneTechly
// Updated: March 2026
//
// ⚠️  THIS IS A PURE DATA/CONFIG FILE — no JSX, no UI.
//     It is imported by frontend/src/pages/Pricing.js and any
//     other page that needs tier data (limits, prices, features).
//
// ✅ KEPT IN SYNC WITH Pricing.js (March 2026):
// - Tier names, prices, and feature lists match exactly what
//   Pricing.js renders in its pricing cards.
// - Yearly prices use the same values shown when user toggles Annual:
//     Pro      → $490/year   (displayed as "$490" in Pricing.js)
//     Business → $1,990/year (displayed as "$1,990")
//     Premium  → $4,990/year (displayed as "$4,990")
// - Free tier badge says "CURRENT PLAN" — matches Pricing.js card badge.
// - Pro tier badge says "MOST POPULAR" — matches Pricing.js card badge.
//
// ✅ PRICING_FAQ removed from active use:
//     The FAQ data below is kept for reference but is no longer
//     rendered inline in the pricing page. All FAQ content lives
//     in the dedicated FAQ page (src/pages/FAQ.js).
// ========================================

/**
 * Centralized pricing configuration for PixelPerfect frontend.
 * This should match backend/config/pricing.py exactly.
 */

export const PRICING_TIERS = {
  FREE:     'free',
  PRO:      'pro',
  BUSINESS: 'business',
  PREMIUM:  'premium',
};

export const PRICING_CONFIG = {
  tiers: {
    free: {
      id:          'free',
      name:        'Free',
      price: {
        monthly:        0,
        yearly:         0,
        displayMonthly: '$0',
        displayYearly:  '$0',
      },
      description: 'Perfect for trying out PixelPerfect',
      screenshots: 100,
      badge:       'CURRENT PLAN',   // shown in Pricing.js card header
      features: [
        '100 screenshots/month',
        'Basic customization',
        'Community support',
      ],
      cta:         'Get Started Free',
      highlighted: false,
      limits: {
        screenshotsPerMonth: 100,
        screenshotsPerDay:   10,
        screenshotsPerHour:  5,
        batchSize:           0,
        maxWidth:            1920,
        maxHeight:           1080,
        formats:             ['PNG', 'JPEG'],
      },
    },

    pro: {
      id:          'pro',
      name:        'Pro',
      price: {
        monthly:        49,
        yearly:         490,    // ~$41/month — shown as "$490" in Pricing.js Annual toggle
        displayMonthly: '$49',
        displayYearly:  '$490',
        savingsPercent: 16,
      },
      description: 'For professionals and small teams',
      screenshots: 5000,
      badge:       'MOST POPULAR',   // shown in Pricing.js card header
      features: [
        '5,000 screenshots/month',
        'Full customization',
        'Batch processing',
        'Priority support',
      ],
      cta:         'Start Pro Trial',
      highlighted: true,
      limits: {
        screenshotsPerMonth: 5000,
        screenshotsPerDay:   500,
        screenshotsPerHour:  100,
        batchSize:           50,
        maxWidth:            3840,
        maxHeight:           2160,
        formats:             ['PNG', 'JPEG', 'WebP'],
      },
    },

    business: {
      id:          'business',
      name:        'Business',
      price: {
        monthly:        199,
        yearly:         1990,   // ~$166/month — shown as "$1,990" in Pricing.js Annual toggle
        displayMonthly: '$199',
        displayYearly:  '$1,990',
        savingsPercent: 16,
      },
      description: 'For agencies and large teams',
      screenshots: 50000,
      badge:       null,
      features: [
        '50,000 screenshots/month',
        'Everything in Pro',
        'Webhooks & change detection',
        'Dedicated support',
      ],
      cta:         'Start Business Trial',
      highlighted: false,
      limits: {
        screenshotsPerMonth: 50000,
        screenshotsPerDay:   5000,
        screenshotsPerHour:  500,
        batchSize:           100,
        maxWidth:            3840,
        maxHeight:           2160,
        formats:             ['PNG', 'JPEG', 'WebP'],
      },
    },

    premium: {
      id:          'premium',
      name:        'Premium',
      price: {
        monthly:        499,
        yearly:         4990,   // ~$416/month — shown as "$4,990" in Pricing.js Annual toggle
        displayMonthly: '$499',
        displayYearly:  '$4,990',
        savingsPercent: 16,
      },
      description: 'For enterprises and high-volume workloads',
      screenshots: 'Unlimited',
      badge:       null,
      features: [
        'Unlimited screenshots',
        'All Business features',
        'White-label options',
        'Custom SLA',
        'Dedicated account manager',
      ],
      cta:         'Contact Sales',
      highlighted: false,
      limits: {
        screenshotsPerMonth: 999999999,
        screenshotsPerDay:   999999999,
        screenshotsPerHour:  999999999,
        batchSize:           999999999,
        maxWidth:            3840,
        maxHeight:           2160,
        formats:             ['PNG', 'JPEG', 'WebP', 'PDF'],
      },
    },
  },

  overage: {
    pricePerScreenshot: 0.002,
    minimumCharge:      5.00,
    description:        'Pay-as-you-go for overages',
  },

  billingCycles: {
    monthly: { id: 'monthly', name: 'Monthly', description: 'Billed monthly'          },
    yearly:  { id: 'yearly',  name: 'Yearly',  description: 'Billed annually (save 16%)' },
  },
};

// ─── Utility functions ────────────────────────────────────────────────────────

/** Get pricing for a specific tier and billing cycle */
export function getTierPricing(tierId, billingCycle = 'monthly') {
  const tier = PRICING_CONFIG.tiers[tierId];
  if (!tier) return null;
  const yearly = billingCycle === 'yearly';
  return {
    ...tier,
    currentPrice:        yearly ? tier.price.yearly        : tier.price.monthly,
    currentPriceDisplay: yearly ? tier.price.displayYearly : tier.price.displayMonthly,
  };
}

/** Get all tier IDs in display order */
export function getTierIds() {
  return Object.keys(PRICING_CONFIG.tiers);
}

/** Get all tiers as an array */
export function getTierComparison() {
  return getTierIds().map(id => PRICING_CONFIG.tiers[id]);
}

/** Format a dollar amount */
export function formatPrice(amount) {
  if (amount === 0) return '$0';
  return `$${amount}`;
}

/** Calculate annual billing savings for a tier */
export function calculateYearlySavings(tierId) {
  const tier = PRICING_CONFIG.tiers[tierId];
  if (!tier || tier.price.monthly === 0) return null;
  const monthlyAnnual  = tier.price.monthly * 12;
  const yearlyPrice    = tier.price.yearly;
  const savings        = monthlyAnnual - yearlyPrice;
  const savingsPercent = Math.round((savings / monthlyAnnual) * 100);
  return {
    amount:    savings,
    percentage: savingsPercent,
    display:   `Save ${formatPrice(savings)} (${savingsPercent}%)`,
  };
}

/** Check if a user tier has access to a named feature */
export function hasFeatureAccess(userTier, feature) {
  const featureMap = {
    batchProcessing:  ['pro', 'business', 'premium'],
    webhooks:         ['business', 'premium'],
    changeDetection:  ['business', 'premium'],
    prioritySupport:  ['pro', 'business', 'premium'],
    dedicatedSupport: ['business', 'premium'],
    darkMode:         ['pro', 'business', 'premium'],
    elementRemoval:   ['pro', 'business', 'premium'],
    customDelays:     ['pro', 'business', 'premium'],
    whiteLabel:       ['premium'],
    customSLA:        ['premium'],
    accountManager:   ['premium'],
    pdfExport:        ['premium'],
  };
  return featureMap[feature]?.includes(userTier) ?? false;
}

// ─── Feature comparison matrix (used by feature tables if needed) ─────────────

export const FEATURE_COMPARISON = {
  'Screenshots per month': { free: '100',              pro: '5,000',   business: '50,000',  premium: 'Unlimited' },
  'Resolution':            { free: 'Up to 1920x1080',  pro: 'Up to 4K', business: 'Up to 4K', premium: 'Up to 4K' },
  'Image formats':         { free: 'PNG, JPEG',         pro: 'PNG, JPEG, WebP', business: 'PNG, JPEG, WebP', premium: 'PNG, JPEG, WebP, PDF' },
  'Batch processing':      { free: '❌', pro: '✅ Up to 50 URLs', business: '✅ Up to 100 URLs', premium: '✅ Unlimited' },
  'Webhooks':              { free: '❌', pro: '❌',   business: '✅',   premium: '✅'      },
  'Change detection':      { free: '❌', pro: '❌',   business: '✅',   premium: '✅'      },
  'Dark mode screenshots': { free: '❌', pro: '✅',   business: '✅',   premium: '✅'      },
  'Element removal':       { free: '❌', pro: '✅',   business: '✅',   premium: '✅'      },
  'White-label options':   { free: '❌', pro: '❌',   business: '❌',   premium: '✅'      },
  'Support':               { free: 'Community', pro: 'Priority', business: 'Dedicated', premium: 'Account Manager' },
  'Rate limits':           { free: '10/min', pro: '100/min', business: '500/min', premium: 'Custom' },
  'SLA':                   { free: '❌', pro: '99% uptime', business: '99.9% uptime', premium: '99.99% custom SLA' },
};

// ─── Marketing copy per tier (used by landing page sections if needed) ────────

export const TIER_MARKETING = {
  free:     { headline: 'Get started for free',     subheadline: 'Perfect for testing and small projects',          benefits: ['No credit card required', 'Full API access', 'Community support'] },
  pro:      { headline: 'Best for professionals',   subheadline: 'Everything you need to build great products',     benefits: ['5,000 screenshots per month', 'Priority support', 'Advanced features', '14-day free trial'] },
  business: { headline: 'Scale with confidence',    subheadline: 'For teams that need enterprise features',         benefits: ['50,000 screenshots per month', 'Webhooks & monitoring', 'Dedicated support', '99.9% uptime SLA', '14-day free trial'] },
  premium:  { headline: 'Enterprise-grade power',   subheadline: 'For organizations with mission-critical needs',   benefits: ['Unlimited screenshots', 'White-label options', 'Custom SLA up to 99.99%', 'Dedicated account manager', 'Priority feature requests'] },
};

// ─── FAQ data (kept for reference — rendered by FAQ.js, NOT by Pricing.js) ───

export const PRICING_FAQ = [
  { question: 'Can I change my plan anytime?',           answer: 'Yes! Upgrades take effect immediately with prorated charges. Downgrades take effect at the start of your next billing cycle.' },
  { question: 'What happens if I exceed my limit?',      answer: "You'll be charged $0.002 per additional screenshot (minimum $5). Premium plans include unlimited screenshots." },
  { question: 'Do you offer annual billing?',            answer: 'Yes — save 16% by paying annually. Pro: $490/yr, Business: $1,990/yr, Premium: $4,990/yr.' },
  { question: 'Is there a free trial?',                  answer: 'Pro and Business include a 14-day free trial. No credit card required for the Free plan.' },
  { question: 'Can I get a refund?',                     answer: "We do not offer refunds. Start with the Free tier to evaluate all features before upgrading." },
  { question: 'What payment methods do you accept?',     answer: 'All major credit cards via Stripe. Enterprise customers can arrange invoice billing.' },
  { question: 'Do unused screenshots roll over?',        answer: 'No — allowances reset monthly and do not roll over.' },
  { question: 'Can I cancel anytime?',                   answer: "Yes. You'll retain access until the end of your current billing period. No cancellation fees." },
  { question: 'What happens to my data if I cancel?',    answer: 'Screenshot history stays accessible for 90 days, then is permanently deleted.' },
];

export default PRICING_CONFIG;

/////////////////////////////////////////////////////////////////////

// // ========================================
// // PRICING CONFIGURATION - PIXELPERFECT FRONTEND
// // ========================================
// // Production-ready pricing display configuration
// // File: frontend/src/config/pricing.js
// // Author: OneTechly
// // Created: January 2026

// /**
//  * Centralized pricing configuration for PixelPerfect frontend
//  * 
//  * This should match backend/config/pricing.py exactly
//  */

// export const PRICING_TIERS = {
//   FREE: 'free',
//   PRO: 'pro',
//   BUSINESS: 'business',
//   PREMIUM: 'premium'
// };

// export const PRICING_CONFIG = {
//   tiers: {
//     free: {
//       id: 'free',
//       name: 'Free',
//       price: {
//         monthly: 0,
//         yearly: 0,
//         displayMonthly: '$0',
//         displayYearly: '$0'
//       },
//       description: 'Perfect for trying out PixelPerfect',
//       screenshots: 100,
//       badge: 'CURRENT PLAN',
//       features: [
//         '100 screenshots/month',
//         'Basic customization',
//         'Community support'
//       ],
//       cta: 'Get Started Free',
//       highlighted: false,
//       limits: {
//         screenshotsPerMonth: 100,
//         screenshotsPerDay: 10,
//         screenshotsPerHour: 5,
//         batchSize: 0,
//         maxWidth: 1920,
//         maxHeight: 1080,
//         formats: ['PNG', 'JPEG']
//       }
//     },
//     pro: {
//       id: 'pro',
//       name: 'Pro',
//       price: {
//         monthly: 49,
//         yearly: 490, // ~$41/month (16% savings)
//         displayMonthly: '$49',
//         displayYearly: '$490',
//         savingsPercent: 16
//       },
//       description: 'For professionals and small teams',
//       screenshots: 5000,
//       badge: 'MOST POPULAR',
//       features: [
//         '5,000 screenshots/month',
//         'Full customization',
//         'Batch processing',
//         'Priority support'
//       ],
//       cta: 'Start Pro Trial',
//       highlighted: true,
//       limits: {
//         screenshotsPerMonth: 5000,
//         screenshotsPerDay: 500,
//         screenshotsPerHour: 100,
//         batchSize: 50,
//         maxWidth: 3840,
//         maxHeight: 2160,
//         formats: ['PNG', 'JPEG', 'WebP']
//       }
//     },
//     business: {
//       id: 'business',
//       name: 'Business',
//       price: {
//         monthly: 199,
//         yearly: 1990, // ~$166/month (16% savings)
//         displayMonthly: '$199',
//         displayYearly: '$1,990',
//         savingsPercent: 16
//       },
//       description: 'For agencies and large teams',
//       screenshots: 50000,
//       badge: null,
//       features: [
//         '50,000 screenshots/month',
//         'Everything in Pro',
//         'Webhooks & change detection',
//         'Dedicated support'
//       ],
//       cta: 'Start Business Trial',
//       highlighted: false,
//       limits: {
//         screenshotsPerMonth: 50000,
//         screenshotsPerDay: 5000,
//         screenshotsPerHour: 500,
//         batchSize: 100,
//         maxWidth: 3840,
//         maxHeight: 2160,
//         formats: ['PNG', 'JPEG', 'WebP']
//       }
//     },
//     premium: {
//       id: 'premium',
//       name: 'Premium',
//       price: {
//         monthly: 499,
//         yearly: 4990, // ~$416/month (16% savings)
//         displayMonthly: '$499',
//         displayYearly: '$4,990',
//         savingsPercent: 16
//       },
//       description: 'For enterprises and high-volume workloads',
//       screenshots: 'Unlimited',
//       badge: null,
//       features: [
//         'Unlimited screenshots',
//         'All Business features',
//         'White-label options',
//         'Custom SLA',
//         'Dedicated account manager'
//       ],
//       cta: 'Contact Sales',
//       highlighted: false,
//       limits: {
//         screenshotsPerMonth: 999999999,
//         screenshotsPerDay: 999999999,
//         screenshotsPerHour: 999999999,
//         batchSize: 999999999,
//         maxWidth: 3840,
//         maxHeight: 2160,
//         formats: ['PNG', 'JPEG', 'WebP', 'PDF']
//       }
//     }
//   },
  
//   overage: {
//     pricePerScreenshot: 0.002,
//     minimumCharge: 5.00,
//     description: 'Pay-as-you-go for overages'
//   },
  
//   billingCycles: {
//     monthly: {
//       id: 'monthly',
//       name: 'Monthly',
//       description: 'Billed monthly'
//     },
//     yearly: {
//       id: 'yearly',
//       name: 'Yearly',
//       description: 'Billed annually (save 16%)'
//     }
//   }
// };

// /**
//  * Get pricing for a specific tier
//  */
// export function getTierPricing(tierId, billingCycle = 'monthly') {
//   const tier = PRICING_CONFIG.tiers[tierId];
//   if (!tier) return null;
  
//   const yearly = billingCycle === 'yearly';
//   return {
//     ...tier,
//     currentPrice: yearly ? tier.price.yearly : tier.price.monthly,
//     currentPriceDisplay: yearly ? tier.price.displayYearly : tier.price.displayMonthly
//   };
// }

// /**
//  * Get all tier IDs
//  */
// export function getTierIds() {
//   return Object.keys(PRICING_CONFIG.tiers);
// }

// /**
//  * Get comparison of all tiers
//  */
// export function getTierComparison() {
//   return getTierIds().map(id => PRICING_CONFIG.tiers[id]);
// }

// /**
//  * Format price for display
//  */
// export function formatPrice(amount) {
//   if (amount === 0) return '$0';
//   return `$${amount}`;
// }

// /**
//  * Calculate savings for yearly billing
//  */
// export function calculateYearlySavings(tierId) {
//   const tier = PRICING_CONFIG.tiers[tierId];
//   if (!tier || tier.price.monthly === 0) return null;
  
//   const monthlyAnnual = tier.price.monthly * 12;
//   const yearlyPrice = tier.price.yearly;
//   const savings = monthlyAnnual - yearlyPrice;
//   const savingsPercent = Math.round((savings / monthlyAnnual) * 100);
  
//   return {
//     amount: savings,
//     percentage: savingsPercent,
//     display: `Save ${formatPrice(savings)} (${savingsPercent}%)`
//   };
// }

// /**
//  * Check if user has access to a feature based on tier
//  */
// export function hasFeatureAccess(userTier, feature) {
//   const features = {
//     batchProcessing: ['pro', 'business', 'premium'],
//     webhooks: ['business', 'premium'],
//     changeDetection: ['business', 'premium'],
//     prioritySupport: ['pro', 'business', 'premium'],
//     dedicatedSupport: ['business', 'premium'],
//     darkMode: ['pro', 'business', 'premium'],
//     elementRemoval: ['pro', 'business', 'premium'],
//     customDelays: ['pro', 'business', 'premium'],
//     whiteLabel: ['premium'],
//     customSLA: ['premium'],
//     accountManager: ['premium'],
//     pdfExport: ['premium']
//   };
  
//   const allowedTiers = features[feature];
//   return allowedTiers ? allowedTiers.includes(userTier) : false;
// }

// /**
//  * Get feature comparison matrix
//  */
// export const FEATURE_COMPARISON = {
//   'Screenshots per month': {
//     free: '100',
//     pro: '5,000',
//     business: '50,000',
//     premium: 'Unlimited'
//   },
//   'Resolution': {
//     free: 'Up to 1920x1080',
//     pro: 'Up to 4K (3840x2160)',
//     business: 'Up to 4K (3840x2160)',
//     premium: 'Up to 4K (3840x2160)'
//   },
//   'Image formats': {
//     free: 'PNG, JPEG',
//     pro: 'PNG, JPEG, WebP',
//     business: 'PNG, JPEG, WebP',
//     premium: 'PNG, JPEG, WebP, PDF'
//   },
//   'Batch processing': {
//     free: '❌',
//     pro: '✅ Up to 50 URLs',
//     business: '✅ Up to 100 URLs',
//     premium: '✅ Unlimited'
//   },
//   'Webhooks': {
//     free: '❌',
//     pro: '❌',
//     business: '✅',
//     premium: '✅'
//   },
//   'Change detection': {
//     free: '❌',
//     pro: '❌',
//     business: '✅',
//     premium: '✅'
//   },
//   'Dark mode screenshots': {
//     free: '❌',
//     pro: '✅',
//     business: '✅',
//     premium: '✅'
//   },
//   'Element removal': {
//     free: '❌',
//     pro: '✅',
//     business: '✅',
//     premium: '✅'
//   },
//   'White-label options': {
//     free: '❌',
//     pro: '❌',
//     business: '❌',
//     premium: '✅'
//   },
//   'Support': {
//     free: 'Community',
//     pro: 'Priority',
//     business: 'Dedicated',
//     premium: 'Account Manager'
//   },
//   'Rate limits': {
//     free: '10/min',
//     pro: '100/min',
//     business: '500/min',
//     premium: 'Custom'
//   },
//   'SLA': {
//     free: '❌',
//     pro: '99% uptime',
//     business: '99.9% uptime',
//     premium: '99.99% custom SLA'
//   }
// };

// /**
//  * Marketing copy for each tier
//  */
// export const TIER_MARKETING = {
//   free: {
//     headline: 'Get started for free',
//     subheadline: 'Perfect for testing and small projects',
//     benefits: [
//       'No credit card required',
//       'Full API access',
//       'Community support'
//     ]
//   },
//   pro: {
//     headline: 'Best for professionals',
//     subheadline: 'Everything you need to build great products',
//     benefits: [
//       '5,000 screenshots per month',
//       'Priority support',
//       'Advanced features',
//       '14-day free trial'
//     ]
//   },
//   business: {
//     headline: 'Scale with confidence',
//     subheadline: 'For teams that need enterprise features',
//     benefits: [
//       '50,000 screenshots per month',
//       'Webhooks & monitoring',
//       'Dedicated support',
//       '99.9% uptime SLA',
//       '14-day free trial'
//     ]
//   },
//   premium: {
//     headline: 'Enterprise-grade power',
//     subheadline: 'For organizations with mission-critical needs',
//     benefits: [
//       'Unlimited screenshots',
//       'White-label options',
//       'Custom SLA up to 99.99%',
//       'Dedicated account manager',
//       'Priority feature requests'
//     ]
//   }
// };

// /**
//  * FAQ about pricing
//  */
// export const PRICING_FAQ = [
//   {
//     question: 'Can I change my plan anytime?',
//     answer: 'Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately with prorated charges. Downgrades take effect at the start of your next billing cycle.'
//   },
//   {
//     question: 'What happens if I exceed my limit?',
//     answer: 'For Pro and Business plans, you\'ll be charged $0.002 per additional screenshot with a minimum charge of $5. Premium plans include unlimited screenshots. You can also upgrade to a higher tier at any time to avoid overage charges.'
//   },
//   {
//     question: 'Do you offer annual billing?',
//     answer: 'Yes! Save 16% by paying annually. For example, Pro is $490/year instead of $588 ($49/month × 12), Business is $1,990/year instead of $2,388, and Premium is $4,990/year instead of $5,988.'
//   },
//   {
//     question: 'Is there a free trial?',
//     answer: 'Pro and Business plans include a 14-day free trial with full access to all features. No credit card required to start the Free plan. Premium plans include a customized trial period - contact sales for details.'
//   },
//   {
//     question: 'Can I get a refund?',
//     answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied within the first 30 days, we\'ll refund your payment in full, no questions asked.'
//   },
//   {
//     question: 'What payment methods do you accept?',
//     answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment processor. Enterprise customers can arrange for invoice-based billing.'
//   },
//   {
//     question: 'Do unused screenshots roll over?',
//     answer: 'No, screenshot allowances reset monthly and do not roll over. However, you can upgrade mid-cycle to get access to more screenshots immediately.'
//   },
//   {
//     question: 'What\'s included in the Premium plan?',
//     answer: 'Premium includes unlimited screenshots, white-label options, custom SLA up to 99.99% uptime, a dedicated account manager, priority feature requests, and all Business features. Contact sales@pixelperfectapi.net for a customized quote.'
//   },
//   {
//     question: 'Do you offer custom enterprise plans?',
//     answer: 'Absolutely! For organizations with unique requirements, we can create custom plans with tailored pricing, features, and support. Contact sales@pixelperfectapi.net to discuss your needs.'
//   },
//   {
//     question: 'How do webhooks work?',
//     answer: 'Business and Premium plans include webhooks that notify your application when screenshots are complete or when page changes are detected. This enables real-time monitoring and automation workflows.'
//   },
//   {
//     question: 'Can I cancel anytime?',
//     answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll retain access to paid features until the end of your current billing period. No cancellation fees.'
//   },
//   {
//     question: 'What happens to my data if I downgrade or cancel?',
//     answer: 'Your screenshot history remains accessible for 90 days after downgrading or canceling. After 90 days, data is permanently deleted. We recommend exporting any important screenshots before canceling.'
//   }
// ];

// export default PRICING_CONFIG;


