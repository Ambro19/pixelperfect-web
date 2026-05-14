// ========================================
// HELP CENTER ARTICLES DATA - PIXELPERFECT
// ========================================
// File: frontend/src/data/helpArticles.js
// Author: OneTechly
// Updated: May 2026 (Phase 2 + 3 wiring)
//
// ✅ UPDATE (May 2026): Added Category 7 — Advanced Features
//
//   New category added:
//     advanced-features — Pro and Business+ power features across all phases
//
//   Articles added (5):
//     custom-javascript-execution  → JavaScriptExecutionGuide (updated in place)
//     device-emulation-guide       → DeviceEmulationGuide (new)
//     element-selection-guide      → null stub (Phase 2, Business+)
//     webhooks-guide               → null stub (Phase 3, Business+)
//     white-label-guide            → null stub (Phase 4, Premium)
//
//   Article moved:
//     javascript-execution: category 'api-usage' → 'advanced-features'
//     Slug, component, and all other fields unchanged. Zero impact on
//     existing routes or lazy-imports in ArticleDetail.js.
//
// Previous fixes (Apr 29, 2026) remain in place:
//   - understanding-pricing-plans: category 'getting-started' → 'billing'
//   - screenshot-quality-issues: component null → ScreenshotQualityIssuesGuide
//   - api-timeout-errors: component null → ApiTimeoutErrorsGuide
//   - webhook-delivery-failures: component null → WebhookDeliveryFailuresGuide
// ========================================

// Category definitions
export const categories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: '🚀',
    description: 'Learn the basics and get up and running quickly'
  },
  {
    id: 'api-usage',
    name: 'API Usage',
    icon: '💻',
    description: 'Master the PixelPerfect API with detailed guides'
  },
  {
    id: 'billing',
    name: 'Billing & Subscription',
    icon: '💳',
    description: 'Manage your subscription and billing settings'
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    icon: '🔧',
    description: 'Solve common issues and errors'
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    icon: '🔒',
    description: 'Keep your data secure and compliant'
  },
  {
    id: 'account',
    name: 'Account Management',
    icon: '👤',
    description: 'Manage your account settings and preferences'
  },
  // ✅ NEW (May 2026): Category 7 — Advanced Features
  {
    id: 'advanced-features',
    name: 'Advanced Features',
    icon: '⚡',
    description: 'Pro and Business+ features: JavaScript execution, device emulation, element selection, webhooks, and white-label'
  }
];

// Article metadata
// Each article maps to a guide component in frontend/src/guides/
export const articles = [
  // ========================================
  // 1. GETTING STARTED  (4 articles)
  // ========================================
  {
    id: 'quick-start',
    slug: 'quick-start-guide',
    title: 'Quick Start Guide',
    excerpt: 'Get started with PixelPerfect in under 5 minutes. Learn how to capture your first screenshot.',
    category: 'getting-started',
    component: 'QuickStartGuide',
    readTime: '5 min read',
    tags: ['beginner', 'setup', 'getting-started', 'first-steps'],
    popular: true,
    views: 12500
  },
  {
    id: 'create-account',
    slug: 'how-to-create-account',
    title: 'How to create an account',
    excerpt: 'Step-by-step guide to creating your PixelPerfect account and getting your API key.',
    category: 'getting-started',
    component: 'HowToCreateAccountGuide',
    readTime: '3 min read',
    tags: ['account', 'signup', 'registration'],
    popular: false,
    views: 3200
  },
  {
    id: 'api-key',
    slug: 'getting-your-api-key',
    title: 'Getting your API key',
    excerpt: 'Learn how to generate and manage your API keys for authentication.',
    category: 'getting-started',
    component: 'GettingYourApiKeyGuide',
    readTime: '4 min read',
    tags: ['api-key', 'authentication', 'security'],
    popular: false,
    views: 5800
  },
  {
    id: 'first-request',
    slug: 'making-first-api-request',
    title: 'Making your first API request',
    excerpt: 'Send your first screenshot request using the PixelPerfect API.',
    category: 'getting-started',
    component: 'MakingFirstApiRequestGuide',
    readTime: '6 min read',
    tags: ['api', 'request', 'curl', 'getting-started'],
    popular: true,
    views: 8300
  },

  // ========================================
  // 2. API USAGE  (javascript-execution moved to advanced-features)
  // ========================================
  {
    id: 'api-authentication',
    slug: 'api-authentication-methods',
    title: 'API authentication methods',
    excerpt: 'Understand JWT tokens vs API keys and how to authenticate your requests.',
    category: 'api-usage',
    component: 'ApiAuthenticationMethodsGuide',
    readTime: '7 min read',
    tags: ['authentication', 'api-key', 'jwt', 'security'],
    popular: true,
    views: 4200
  },
  {
    id: 'screenshot-parameters',
    slug: 'screenshot-parameters-explained',
    title: 'Screenshot parameters explained',
    excerpt: 'Master all available screenshot parameters: width, height, format, quality, and more.',
    category: 'api-usage',
    component: 'APIProcessingGuide',
    readTime: '10 min read',
    tags: ['parameters', 'api', 'screenshot', 'customization'],
    popular: true,
    views: 8300
  },
  {
    id: 'batch-processing',
    slug: 'batch-processing-guide',
    title: 'Batch processing guide',
    excerpt: 'Capture multiple screenshots efficiently using batch requests.',
    category: 'api-usage',
    component: 'BatchProcessingGuide',
    readTime: '8 min read',
    tags: ['batch', 'bulk', 'automation', 'efficiency'],
    popular: true,
    views: 6700
  },
  {
    id: 'rate-limits',
    slug: 'rate-limits-and-quotas',
    title: 'Rate limits and quotas',
    excerpt: 'Understand rate limits and how to optimize your API usage.',
    category: 'api-usage',
    component: 'OptimizationGuide',
    readTime: '6 min read',
    tags: ['rate-limits', 'quotas', 'optimization', 'limits'],
    popular: false,
    views: 3500
  },
  {
    id: 'node-integration',
    slug: 'node-js-integration',
    title: 'Node.js Integration Guide',
    excerpt: 'Integrate PixelPerfect into your Node.js applications with code examples.',
    category: 'api-usage',
    component: 'NodeIntegrationGuide',
    readTime: '12 min read',
    tags: ['nodejs', 'javascript', 'integration', 'sdk'],
    popular: true,
    views: 7200
  },
  {
    id: 'python-integration',
    slug: 'python-integration',
    title: 'Python Integration Guide',
    excerpt: 'Use PixelPerfect in your Python projects with practical examples.',
    category: 'api-usage',
    component: 'PythonIntegrationGuide',
    readTime: '12 min read',
    tags: ['python', 'integration', 'sdk', 'requests'],
    popular: true,
    views: 6900
  },
  {
    id: 'social-media-preview',
    slug: 'social-media-preview-guide',
    title: 'Social Media Preview Guide',
    excerpt: 'Create perfect social media preview images with PixelPerfect.',
    category: 'api-usage',
    component: 'SocialMediaPreviewGuide',
    readTime: '8 min read',
    tags: ['social-media', 'preview', 'og-image', 'twitter-card'],
    popular: false,
    views: 3100
  },
  {
    id: 'website-monitoring',
    slug: 'website-monitoring-guide',
    title: 'Website Monitoring Guide',
    excerpt: 'Set up automated website monitoring with screenshot alerts.',
    category: 'api-usage',
    component: 'WebsiteMonitorGuide',
    readTime: '15 min read',
    tags: ['monitoring', 'automation', 'alerts', 'cron'],
    popular: true,
    views: 5400
  },

  // ========================================
  // 3. BILLING & SUBSCRIPTION  (5 articles)
  // ========================================
  {
    id: 'upgrade-plan',
    slug: 'how-to-upgrade-plan',
    title: 'How to upgrade your plan',
    excerpt: 'Upgrade to Pro, Business, or Premium to unlock more features.',
    category: 'billing',
    component: 'ManagingYourSubscriptionGuide',
    readTime: '4 min read',
    tags: ['upgrade', 'subscription', 'billing', 'plans'],
    popular: false,
    views: 2800
  },
  {
    id: 'payment-methods',
    slug: 'managing-payment-methods',
    title: 'Managing payment methods',
    excerpt: 'Add, update, or remove payment methods from your account.',
    category: 'billing',
    component: 'ManagingPaymentMethodsGuide',
    readTime: '5 min read',
    tags: ['payment', 'billing', 'credit-card', 'stripe'],
    popular: false,
    views: 1900
  },
  {
    id: 'invoices',
    slug: 'understanding-your-invoice',
    title: 'Understanding your invoice',
    excerpt: 'Learn how to read your PixelPerfect invoices and billing statements.',
    category: 'billing',
    component: 'UnderstandingYourInvoiceGuide',
    readTime: '6 min read',
    tags: ['invoice', 'billing', 'charges', 'statement'],
    popular: false,
    views: 1500
  },
  {
    id: 'cancellation',
    slug: 'cancellation-and-refunds',
    title: 'Cancellation and refunds',
    excerpt: 'Understand our cancellation policy. We do not offer refunds — start with the Free tier to evaluate.',
    category: 'billing',
    component: 'ManagingYourSubscriptionGuide',
    readTime: '5 min read',
    tags: ['cancellation', 'refund', 'policy', 'subscription'],
    popular: false,
    views: 2200
  },
  {
    id: 'pricing-plans',
    slug: 'understanding-pricing-plans',
    title: 'Understanding pricing plans',
    excerpt: 'Compare our pricing tiers and find the plan that fits your needs.',
    category: 'billing',
    component: 'UnderstandingPricingPlansGuide',
    readTime: '5 min read',
    tags: ['pricing', 'plans', 'subscription'],
    popular: false,
    views: 4100
  },

  // ========================================
  // 4. TROUBLESHOOTING  (4 articles, all wired)
  // ========================================
  {
    id: 'common-errors',
    slug: 'common-error-codes',
    title: 'Common error codes',
    excerpt: 'Troubleshoot common error codes and their solutions.',
    category: 'troubleshooting',
    component: 'ErrorsAndSolutionsGuide',
    readTime: '12 min read',
    tags: ['errors', 'troubleshooting', 'debugging', 'solutions'],
    popular: true,
    views: 5900
  },
  {
    id: 'screenshot-quality',
    slug: 'screenshot-quality-issues',
    title: 'Screenshot quality issues',
    excerpt: 'Fix common screenshot quality problems and artifacts.',
    category: 'troubleshooting',
    component: 'ScreenshotQualityIssuesGuide',
    readTime: '7 min read',
    tags: ['quality', 'resolution', 'troubleshooting', 'images'],
    popular: false,
    views: 2400
  },
  {
    id: 'timeout-errors',
    slug: 'api-timeout-errors',
    title: 'API timeout errors',
    excerpt: 'Resolve timeout errors and optimize screenshot capture time.',
    category: 'troubleshooting',
    component: 'ApiTimeoutErrorsGuide',
    readTime: '8 min read',
    tags: ['timeout', 'errors', 'performance', 'troubleshooting'],
    popular: false,
    views: 3600
  },
  {
    id: 'webhook-failures',
    slug: 'webhook-delivery-failures',
    title: 'Webhook delivery failures',
    excerpt: 'Debug webhook delivery issues and ensure reliable notifications.',
    category: 'troubleshooting',
    component: 'WebhookDeliveryFailuresGuide',
    readTime: '10 min read',
    tags: ['webhooks', 'notifications', 'troubleshooting', 'debugging'],
    popular: false,
    views: 1800
  },

  // ========================================
  // 5. SECURITY & PRIVACY  (5 articles)
  // ========================================
  {
    id: 'data-retention',
    slug: 'data-retention-policy',
    title: 'Data retention & privacy',
    excerpt: 'What we store, where it lives, how long we keep it, and your rights.',
    category: 'security',
    component: 'DataRetentionPrivacyGuide',
    readTime: '8 min read',
    tags: ['privacy', 'data', 'retention', 'policy', 'gdpr'],
    popular: false,
    views: 1200
  },
  {
    id: 'api-security',
    slug: 'api-key-security-best-practices',
    title: 'API key best practices',
    excerpt: 'How to store, rotate, and use your API key safely. The patterns that prevent leaks.',
    category: 'security',
    component: 'ApiKeyBestPracticesGuide',
    readTime: '10 min read',
    tags: ['security', 'api-key', 'best-practices', 'safety'],
    popular: false,
    views: 2700
  },
  {
    id: 'account-security-mechanisms',
    slug: 'account-security',
    title: 'How we secure your account',
    excerpt: 'The security mechanisms protecting your account, in plain English.',
    category: 'security',
    component: 'AccountSecurityGuide',
    readTime: '8 min read',
    tags: ['security', 'jwt', 'encryption', 'account', 'authentication'],
    popular: false,
    views: 0
  },
  {
    id: 'gdpr',
    slug: 'gdpr-compliance',
    title: 'GDPR & compliance',
    excerpt: 'Where we stand on GDPR, your data subject rights, and what we don\'t yet have.',
    category: 'security',
    component: 'GdprComplianceGuide',
    readTime: '10 min read',
    tags: ['gdpr', 'compliance', 'privacy', 'regulations'],
    popular: false,
    views: 900
  },
  {
    id: 'soc2',
    slug: 'soc2-certification',
    title: 'SOC 2 status',
    excerpt: 'Our current SOC 2 position and roadmap — covered in our GDPR & Compliance guide.',
    category: 'security',
    component: 'GdprComplianceGuide',
    readTime: '10 min read',
    tags: ['soc2', 'compliance', 'security', 'certification', 'roadmap'],
    popular: false,
    views: 650
  },

  // ========================================
  // 6. ACCOUNT MANAGEMENT  (6 articles)
  // ========================================
  {
    id: 'account-details',
    slug: 'updating-account-details',
    title: 'Managing your profile',
    excerpt: 'Update your username and email. What happens automatically when you do.',
    category: 'account',
    component: 'ManagingYourProfileGuide',
    readTime: '5 min read',
    tags: ['account', 'profile', 'settings', 'update', 'email', 'username'],
    popular: false,
    views: 2100
  },
  {
    id: 'subscription-management',
    slug: 'managing-your-subscription',
    title: 'Managing your subscription',
    excerpt: 'View, upgrade, downgrade, switch billing cadence, or cancel your plan.',
    category: 'account',
    component: 'ManagingYourSubscriptionGuide',
    readTime: '8 min read',
    tags: ['subscription', 'upgrade', 'downgrade', 'cancel', 'billing', 'plan'],
    popular: false,
    views: 0
  },
  {
    id: 'team-management',
    slug: 'team-member-management',
    title: 'Team member management',
    excerpt: 'Add and manage team members on Business and Premium plans.',
    category: 'account',
    component: null,
    readTime: '7 min read',
    tags: ['team', 'collaboration', 'members', 'business'],
    popular: false,
    views: 1300
  },
  {
    id: 'password-reset',
    slug: 'password-reset',
    title: 'Changing your password',
    excerpt: 'Two flows: in-dashboard change (you know your current password) and forgot-password reset email.',
    category: 'account',
    component: 'ChangingYourPasswordGuide',
    readTime: '7 min read',
    tags: ['password', 'reset', 'security', 'account', 'forgot-password'],
    popular: false,
    views: 1700
  },
  {
    id: 'delete-account',
    slug: 'deleting-your-account',
    title: 'Deleting your account',
    excerpt: 'Permanent account deletion. The cascade, what persists, and what to consider first.',
    category: 'account',
    component: 'DeletingYourAccountGuide',
    readTime: '8 min read',
    tags: ['delete', 'account', 'gdpr', 'erasure', 'cancellation'],
    popular: false,
    views: 0
  },
  {
    id: 'two-factor',
    slug: 'two-factor-authentication',
    title: 'Two-factor authentication',
    excerpt: 'Two-factor authentication is on our roadmap — see our account security guide for the full story.',
    category: 'account',
    component: 'AccountSecurityGuide',
    readTime: '8 min read',
    tags: ['2fa', 'security', 'authentication', 'account', 'roadmap'],
    popular: false,
    views: 1100
  },

  // ========================================
  // 7. ADVANCED FEATURES  (5 articles — phased rollout)
  // ========================================

  // ── Phase 1 (shipped May 2026) ──────────────────────────────────────────

  {
    // ✅ MOVED (May 2026): was category 'api-usage'. Moved to 'advanced-features'
    // because Phase 1 shipped full custom JS content — this is now a power-user
    // topic rather than a basic API usage topic.
    // Slug, component, id, and all other fields are UNCHANGED.
    // Zero impact on existing routes or ArticleDetail.js lazy-imports.
    id: 'javascript-execution',
    slug: 'javascript-execution',
    title: 'Custom JavaScript Execution',
    excerpt: 'Execute custom JavaScript before capturing screenshots to manipulate the page, hide elements, trigger interactions, and more. Pro tier and above.',
    category: 'advanced-features',
    component: 'JavaScriptExecutionGuide',
    readTime: '10 min read',
    tags: ['javascript', 'custom-js', 'automation', 'advanced', 'pro'],
    popular: true,
    views: 4800
  },
  {
    id: 'device-emulation',
    slug: 'device-emulation-guide',
    title: 'Device Emulation Guide',
    excerpt: 'Capture screenshots that look exactly as they would on iPhones, Android phones, iPads, and tablets using real Playwright device presets. Pro tier and above.',
    category: 'advanced-features',
    component: 'DeviceEmulationGuide',
    readTime: '8 min read',
    tags: ['device', 'mobile', 'emulation', 'responsive', 'viewport', 'pro'],
    popular: true,
    views: 0
  },

  // ── Phase 2 (Business+ — stub until shipped) ────────────────────────────
  {
    id: 'element-selection',
    slug: 'element-selection-guide',
    title: 'Element Selection & Cropping',
    excerpt: 'Capture specific page elements by CSS selector — automatically crops the screenshot to just that element. Business tier and above.',
    category: 'advanced-features',
    component: 'ElementSelectionGuide',
    readTime: '7 min read',
    tags: ['element', 'css-selector', 'crop', 'advanced', 'business'],
    popular: false,
    views: 0
  },

  // ── Phase 3 (Business+ — stub until shipped) ────────────────────────────
  {
    id: 'webhooks-guide',
    slug: 'webhooks-guide',
    title: 'Webhooks & Notifications',
    excerpt: 'Receive real-time POST notifications when screenshots complete. Includes HMAC-SHA256 payload signing and exponential-backoff retry. Business tier and above.',
    category: 'advanced-features',
    component: 'WebhooksGuide',
    readTime: '10 min read',
    tags: ['webhooks', 'notifications', 'hmac', 'business', 'automation'],
    popular: false,
    views: 0
  },

  // ── Phase 4 (Premium — stub until shipped) ──────────────────────────────
  {
    id: 'white-label-guide',
    slug: 'white-label-guide',
    title: 'White-Label & Custom Domains',
    excerpt: 'Serve screenshots from your own domain with your own branding. Remove all PixelPerfect references from the API response. Premium tier. Coming in Phase 4.',
    category: 'advanced-features',
    component: null,
    readTime: '12 min read',
    tags: ['white-label', 'custom-domain', 'branding', 'premium'],
    popular: false,
    views: 0
  }
];

// ========================================
// HELPER FUNCTIONS  (unchanged)
// ========================================

export function getAllArticles() {
  return articles;
}

export function getArticleBySlug(slug) {
  return articles.find(article => article.slug === slug) || null;
}

export function getArticlesByCategory(categoryId) {
  return articles.filter(article => article.category === categoryId);
}

export function getPopularArticles(limit = 5) {
  return articles
    .filter(article => article.popular)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getCategoryById(categoryId) {
  return categories.find(cat => cat.id === categoryId) || null;
}

export function searchArticles(query) {
  if (!query || query.trim() === '') {
    return articles;
  }

  const searchTerm = query.toLowerCase().trim();

  return articles.filter(article => {
    if (article.title.toLowerCase().includes(searchTerm)) return true;
    if (article.excerpt.toLowerCase().includes(searchTerm)) return true;
    if (article.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
    return false;
  });
}

export function getRecentArticles(limit = 10) {
  return articles
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function formatViews(views) {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

// ===== END OF helpArticles.js =====

//===================================================================
// // ========================================
// // HELP CENTER ARTICLES DATA - PIXELPERFECT
// // ========================================
// // File: frontend/src/data/helpArticles.js
// // Author: OneTechly
// // Updated: May 2026
// //
// // ✅ UPDATE (May 2026): Added Category 7 — Advanced Features
// //
// //   New category added:
// //     advanced-features — Pro and Business+ power features across all phases
// //
// //   Articles added (5):
// //     custom-javascript-execution  → JavaScriptExecutionGuide (updated in place)
// //     device-emulation-guide       → DeviceEmulationGuide (new)
// //     element-selection-guide      → null stub (Phase 2, Business+)
// //     webhooks-guide               → null stub (Phase 3, Business+)
// //     white-label-guide            → null stub (Phase 4, Premium)
// //
// //   Article moved:
// //     javascript-execution: category 'api-usage' → 'advanced-features'
// //     Slug, component, and all other fields unchanged. Zero impact on
// //     existing routes or lazy-imports in ArticleDetail.js.
// //
// // Previous fixes (Apr 29, 2026) remain in place:
// //   - understanding-pricing-plans: category 'getting-started' → 'billing'
// //   - screenshot-quality-issues: component null → ScreenshotQualityIssuesGuide
// //   - api-timeout-errors: component null → ApiTimeoutErrorsGuide
// //   - webhook-delivery-failures: component null → WebhookDeliveryFailuresGuide
// // ========================================

// // Category definitions
// export const categories = [
//   {
//     id: 'getting-started',
//     name: 'Getting Started',
//     icon: '🚀',
//     description: 'Learn the basics and get up and running quickly'
//   },
//   {
//     id: 'api-usage',
//     name: 'API Usage',
//     icon: '💻',
//     description: 'Master the PixelPerfect API with detailed guides'
//   },
//   {
//     id: 'billing',
//     name: 'Billing & Subscription',
//     icon: '💳',
//     description: 'Manage your subscription and billing settings'
//   },
//   {
//     id: 'troubleshooting',
//     name: 'Troubleshooting',
//     icon: '🔧',
//     description: 'Solve common issues and errors'
//   },
//   {
//     id: 'security',
//     name: 'Security & Privacy',
//     icon: '🔒',
//     description: 'Keep your data secure and compliant'
//   },
//   {
//     id: 'account',
//     name: 'Account Management',
//     icon: '👤',
//     description: 'Manage your account settings and preferences'
//   },
//   // ✅ NEW (May 2026): Category 7 — Advanced Features
//   {
//     id: 'advanced-features',
//     name: 'Advanced Features',
//     icon: '⚡',
//     description: 'Pro and Business+ features: JavaScript execution, device emulation, element selection, webhooks, and white-label'
//   }
// ];

// // Article metadata
// // Each article maps to a guide component in frontend/src/guides/
// export const articles = [
//   // ========================================
//   // 1. GETTING STARTED  (4 articles)
//   // ========================================
//   {
//     id: 'quick-start',
//     slug: 'quick-start-guide',
//     title: 'Quick Start Guide',
//     excerpt: 'Get started with PixelPerfect in under 5 minutes. Learn how to capture your first screenshot.',
//     category: 'getting-started',
//     component: 'QuickStartGuide',
//     readTime: '5 min read',
//     tags: ['beginner', 'setup', 'getting-started', 'first-steps'],
//     popular: true,
//     views: 12500
//   },
//   {
//     id: 'create-account',
//     slug: 'how-to-create-account',
//     title: 'How to create an account',
//     excerpt: 'Step-by-step guide to creating your PixelPerfect account and getting your API key.',
//     category: 'getting-started',
//     component: 'HowToCreateAccountGuide',
//     readTime: '3 min read',
//     tags: ['account', 'signup', 'registration'],
//     popular: false,
//     views: 3200
//   },
//   {
//     id: 'api-key',
//     slug: 'getting-your-api-key',
//     title: 'Getting your API key',
//     excerpt: 'Learn how to generate and manage your API keys for authentication.',
//     category: 'getting-started',
//     component: 'GettingYourApiKeyGuide',
//     readTime: '4 min read',
//     tags: ['api-key', 'authentication', 'security'],
//     popular: false,
//     views: 5800
//   },
//   {
//     id: 'first-request',
//     slug: 'making-first-api-request',
//     title: 'Making your first API request',
//     excerpt: 'Send your first screenshot request using the PixelPerfect API.',
//     category: 'getting-started',
//     component: 'MakingFirstApiRequestGuide',
//     readTime: '6 min read',
//     tags: ['api', 'request', 'curl', 'getting-started'],
//     popular: true,
//     views: 8300
//   },

//   // ========================================
//   // 2. API USAGE  (javascript-execution moved to advanced-features)
//   // ========================================
//   {
//     id: 'api-authentication',
//     slug: 'api-authentication-methods',
//     title: 'API authentication methods',
//     excerpt: 'Understand JWT tokens vs API keys and how to authenticate your requests.',
//     category: 'api-usage',
//     component: 'ApiAuthenticationMethodsGuide',
//     readTime: '7 min read',
//     tags: ['authentication', 'api-key', 'jwt', 'security'],
//     popular: true,
//     views: 4200
//   },
//   {
//     id: 'screenshot-parameters',
//     slug: 'screenshot-parameters-explained',
//     title: 'Screenshot parameters explained',
//     excerpt: 'Master all available screenshot parameters: width, height, format, quality, and more.',
//     category: 'api-usage',
//     component: 'APIProcessingGuide',
//     readTime: '10 min read',
//     tags: ['parameters', 'api', 'screenshot', 'customization'],
//     popular: true,
//     views: 8300
//   },
//   {
//     id: 'batch-processing',
//     slug: 'batch-processing-guide',
//     title: 'Batch processing guide',
//     excerpt: 'Capture multiple screenshots efficiently using batch requests.',
//     category: 'api-usage',
//     component: 'BatchProcessingGuide',
//     readTime: '8 min read',
//     tags: ['batch', 'bulk', 'automation', 'efficiency'],
//     popular: true,
//     views: 6700
//   },
//   {
//     id: 'rate-limits',
//     slug: 'rate-limits-and-quotas',
//     title: 'Rate limits and quotas',
//     excerpt: 'Understand rate limits and how to optimize your API usage.',
//     category: 'api-usage',
//     component: 'OptimizationGuide',
//     readTime: '6 min read',
//     tags: ['rate-limits', 'quotas', 'optimization', 'limits'],
//     popular: false,
//     views: 3500
//   },
//   {
//     id: 'node-integration',
//     slug: 'node-js-integration',
//     title: 'Node.js Integration Guide',
//     excerpt: 'Integrate PixelPerfect into your Node.js applications with code examples.',
//     category: 'api-usage',
//     component: 'NodeIntegrationGuide',
//     readTime: '12 min read',
//     tags: ['nodejs', 'javascript', 'integration', 'sdk'],
//     popular: true,
//     views: 7200
//   },
//   {
//     id: 'python-integration',
//     slug: 'python-integration',
//     title: 'Python Integration Guide',
//     excerpt: 'Use PixelPerfect in your Python projects with practical examples.',
//     category: 'api-usage',
//     component: 'PythonIntegrationGuide',
//     readTime: '12 min read',
//     tags: ['python', 'integration', 'sdk', 'requests'],
//     popular: true,
//     views: 6900
//   },
//   {
//     id: 'social-media-preview',
//     slug: 'social-media-preview-guide',
//     title: 'Social Media Preview Guide',
//     excerpt: 'Create perfect social media preview images with PixelPerfect.',
//     category: 'api-usage',
//     component: 'SocialMediaPreviewGuide',
//     readTime: '8 min read',
//     tags: ['social-media', 'preview', 'og-image', 'twitter-card'],
//     popular: false,
//     views: 3100
//   },
//   {
//     id: 'website-monitoring',
//     slug: 'website-monitoring-guide',
//     title: 'Website Monitoring Guide',
//     excerpt: 'Set up automated website monitoring with screenshot alerts.',
//     category: 'api-usage',
//     component: 'WebsiteMonitorGuide',
//     readTime: '15 min read',
//     tags: ['monitoring', 'automation', 'alerts', 'cron'],
//     popular: true,
//     views: 5400
//   },

//   // ========================================
//   // 3. BILLING & SUBSCRIPTION  (5 articles)
//   // ========================================
//   {
//     id: 'upgrade-plan',
//     slug: 'how-to-upgrade-plan',
//     title: 'How to upgrade your plan',
//     excerpt: 'Upgrade to Pro, Business, or Premium to unlock more features.',
//     category: 'billing',
//     component: 'ManagingYourSubscriptionGuide',
//     readTime: '4 min read',
//     tags: ['upgrade', 'subscription', 'billing', 'plans'],
//     popular: false,
//     views: 2800
//   },
//   {
//     id: 'payment-methods',
//     slug: 'managing-payment-methods',
//     title: 'Managing payment methods',
//     excerpt: 'Add, update, or remove payment methods from your account.',
//     category: 'billing',
//     component: 'ManagingPaymentMethodsGuide',
//     readTime: '5 min read',
//     tags: ['payment', 'billing', 'credit-card', 'stripe'],
//     popular: false,
//     views: 1900
//   },
//   {
//     id: 'invoices',
//     slug: 'understanding-your-invoice',
//     title: 'Understanding your invoice',
//     excerpt: 'Learn how to read your PixelPerfect invoices and billing statements.',
//     category: 'billing',
//     component: 'UnderstandingYourInvoiceGuide',
//     readTime: '6 min read',
//     tags: ['invoice', 'billing', 'charges', 'statement'],
//     popular: false,
//     views: 1500
//   },
//   {
//     id: 'cancellation',
//     slug: 'cancellation-and-refunds',
//     title: 'Cancellation and refunds',
//     excerpt: 'Understand our cancellation policy. We do not offer refunds — start with the Free tier to evaluate.',
//     category: 'billing',
//     component: 'ManagingYourSubscriptionGuide',
//     readTime: '5 min read',
//     tags: ['cancellation', 'refund', 'policy', 'subscription'],
//     popular: false,
//     views: 2200
//   },
//   {
//     id: 'pricing-plans',
//     slug: 'understanding-pricing-plans',
//     title: 'Understanding pricing plans',
//     excerpt: 'Compare our pricing tiers and find the plan that fits your needs.',
//     category: 'billing',
//     component: 'UnderstandingPricingPlansGuide',
//     readTime: '5 min read',
//     tags: ['pricing', 'plans', 'subscription'],
//     popular: false,
//     views: 4100
//   },

//   // ========================================
//   // 4. TROUBLESHOOTING  (4 articles, all wired)
//   // ========================================
//   {
//     id: 'common-errors',
//     slug: 'common-error-codes',
//     title: 'Common error codes',
//     excerpt: 'Troubleshoot common error codes and their solutions.',
//     category: 'troubleshooting',
//     component: 'ErrorsAndSolutionsGuide',
//     readTime: '12 min read',
//     tags: ['errors', 'troubleshooting', 'debugging', 'solutions'],
//     popular: true,
//     views: 5900
//   },
//   {
//     id: 'screenshot-quality',
//     slug: 'screenshot-quality-issues',
//     title: 'Screenshot quality issues',
//     excerpt: 'Fix common screenshot quality problems and artifacts.',
//     category: 'troubleshooting',
//     component: 'ScreenshotQualityIssuesGuide',
//     readTime: '7 min read',
//     tags: ['quality', 'resolution', 'troubleshooting', 'images'],
//     popular: false,
//     views: 2400
//   },
//   {
//     id: 'timeout-errors',
//     slug: 'api-timeout-errors',
//     title: 'API timeout errors',
//     excerpt: 'Resolve timeout errors and optimize screenshot capture time.',
//     category: 'troubleshooting',
//     component: 'ApiTimeoutErrorsGuide',
//     readTime: '8 min read',
//     tags: ['timeout', 'errors', 'performance', 'troubleshooting'],
//     popular: false,
//     views: 3600
//   },
//   {
//     id: 'webhook-failures',
//     slug: 'webhook-delivery-failures',
//     title: 'Webhook delivery failures',
//     excerpt: 'Debug webhook delivery issues and ensure reliable notifications.',
//     category: 'troubleshooting',
//     component: 'WebhookDeliveryFailuresGuide',
//     readTime: '10 min read',
//     tags: ['webhooks', 'notifications', 'troubleshooting', 'debugging'],
//     popular: false,
//     views: 1800
//   },

//   // ========================================
//   // 5. SECURITY & PRIVACY  (5 articles)
//   // ========================================
//   {
//     id: 'data-retention',
//     slug: 'data-retention-policy',
//     title: 'Data retention & privacy',
//     excerpt: 'What we store, where it lives, how long we keep it, and your rights.',
//     category: 'security',
//     component: 'DataRetentionPrivacyGuide',
//     readTime: '8 min read',
//     tags: ['privacy', 'data', 'retention', 'policy', 'gdpr'],
//     popular: false,
//     views: 1200
//   },
//   {
//     id: 'api-security',
//     slug: 'api-key-security-best-practices',
//     title: 'API key best practices',
//     excerpt: 'How to store, rotate, and use your API key safely. The patterns that prevent leaks.',
//     category: 'security',
//     component: 'ApiKeyBestPracticesGuide',
//     readTime: '10 min read',
//     tags: ['security', 'api-key', 'best-practices', 'safety'],
//     popular: false,
//     views: 2700
//   },
//   {
//     id: 'account-security-mechanisms',
//     slug: 'account-security',
//     title: 'How we secure your account',
//     excerpt: 'The security mechanisms protecting your account, in plain English.',
//     category: 'security',
//     component: 'AccountSecurityGuide',
//     readTime: '8 min read',
//     tags: ['security', 'jwt', 'encryption', 'account', 'authentication'],
//     popular: false,
//     views: 0
//   },
//   {
//     id: 'gdpr',
//     slug: 'gdpr-compliance',
//     title: 'GDPR & compliance',
//     excerpt: 'Where we stand on GDPR, your data subject rights, and what we don\'t yet have.',
//     category: 'security',
//     component: 'GdprComplianceGuide',
//     readTime: '10 min read',
//     tags: ['gdpr', 'compliance', 'privacy', 'regulations'],
//     popular: false,
//     views: 900
//   },
//   {
//     id: 'soc2',
//     slug: 'soc2-certification',
//     title: 'SOC 2 status',
//     excerpt: 'Our current SOC 2 position and roadmap — covered in our GDPR & Compliance guide.',
//     category: 'security',
//     component: 'GdprComplianceGuide',
//     readTime: '10 min read',
//     tags: ['soc2', 'compliance', 'security', 'certification', 'roadmap'],
//     popular: false,
//     views: 650
//   },

//   // ========================================
//   // 6. ACCOUNT MANAGEMENT  (6 articles)
//   // ========================================
//   {
//     id: 'account-details',
//     slug: 'updating-account-details',
//     title: 'Managing your profile',
//     excerpt: 'Update your username and email. What happens automatically when you do.',
//     category: 'account',
//     component: 'ManagingYourProfileGuide',
//     readTime: '5 min read',
//     tags: ['account', 'profile', 'settings', 'update', 'email', 'username'],
//     popular: false,
//     views: 2100
//   },
//   {
//     id: 'subscription-management',
//     slug: 'managing-your-subscription',
//     title: 'Managing your subscription',
//     excerpt: 'View, upgrade, downgrade, switch billing cadence, or cancel your plan.',
//     category: 'account',
//     component: 'ManagingYourSubscriptionGuide',
//     readTime: '8 min read',
//     tags: ['subscription', 'upgrade', 'downgrade', 'cancel', 'billing', 'plan'],
//     popular: false,
//     views: 0
//   },
//   {
//     id: 'team-management',
//     slug: 'team-member-management',
//     title: 'Team member management',
//     excerpt: 'Add and manage team members on Business and Premium plans.',
//     category: 'account',
//     component: null,
//     readTime: '7 min read',
//     tags: ['team', 'collaboration', 'members', 'business'],
//     popular: false,
//     views: 1300
//   },
//   {
//     id: 'password-reset',
//     slug: 'password-reset',
//     title: 'Changing your password',
//     excerpt: 'Two flows: in-dashboard change (you know your current password) and forgot-password reset email.',
//     category: 'account',
//     component: 'ChangingYourPasswordGuide',
//     readTime: '7 min read',
//     tags: ['password', 'reset', 'security', 'account', 'forgot-password'],
//     popular: false,
//     views: 1700
//   },
//   {
//     id: 'delete-account',
//     slug: 'deleting-your-account',
//     title: 'Deleting your account',
//     excerpt: 'Permanent account deletion. The cascade, what persists, and what to consider first.',
//     category: 'account',
//     component: 'DeletingYourAccountGuide',
//     readTime: '8 min read',
//     tags: ['delete', 'account', 'gdpr', 'erasure', 'cancellation'],
//     popular: false,
//     views: 0
//   },
//   {
//     id: 'two-factor',
//     slug: 'two-factor-authentication',
//     title: 'Two-factor authentication',
//     excerpt: 'Two-factor authentication is on our roadmap — see our account security guide for the full story.',
//     category: 'account',
//     component: 'AccountSecurityGuide',
//     readTime: '8 min read',
//     tags: ['2fa', 'security', 'authentication', 'account', 'roadmap'],
//     popular: false,
//     views: 1100
//   },

//   // ========================================
//   // 7. ADVANCED FEATURES  (5 articles — phased rollout)
//   // ========================================

//   // ── Phase 1 (shipped May 2026) ──────────────────────────────────────────

//   {
//     // ✅ MOVED (May 2026): was category 'api-usage'. Moved to 'advanced-features'
//     // because Phase 1 shipped full custom JS content — this is now a power-user
//     // topic rather than a basic API usage topic.
//     // Slug, component, id, and all other fields are UNCHANGED.
//     // Zero impact on existing routes or ArticleDetail.js lazy-imports.
//     id: 'javascript-execution',
//     slug: 'javascript-execution',
//     title: 'Custom JavaScript Execution',
//     excerpt: 'Execute custom JavaScript before capturing screenshots to manipulate the page, hide elements, trigger interactions, and more. Pro tier and above.',
//     category: 'advanced-features',
//     component: 'JavaScriptExecutionGuide',
//     readTime: '10 min read',
//     tags: ['javascript', 'custom-js', 'automation', 'advanced', 'pro'],
//     popular: true,
//     views: 4800
//   },
//   {
//     id: 'device-emulation',
//     slug: 'device-emulation-guide',
//     title: 'Device Emulation Guide',
//     excerpt: 'Capture screenshots that look exactly as they would on iPhones, Android phones, iPads, and tablets using real Playwright device presets. Pro tier and above.',
//     category: 'advanced-features',
//     component: 'DeviceEmulationGuide',
//     readTime: '8 min read',
//     tags: ['device', 'mobile', 'emulation', 'responsive', 'viewport', 'pro'],
//     popular: true,
//     views: 0
//   },

//   // ── Phase 2 (Business+ — stub until shipped) ────────────────────────────
//   {
//     id: 'element-selection',
//     slug: 'element-selection-guide',
//     title: 'Element Selection & Cropping',
//     excerpt: 'Capture specific page elements by CSS selector — automatically crops the screenshot to just that element. Business tier and above. Coming in Phase 2.',
//     category: 'advanced-features',
//     component: null,
//     readTime: '7 min read',
//     tags: ['element', 'css-selector', 'crop', 'advanced', 'business'],
//     popular: false,
//     views: 0
//   },

//   // ── Phase 3 (Business+ — stub until shipped) ────────────────────────────
//   {
//     id: 'webhooks-guide',
//     slug: 'webhooks-guide',
//     title: 'Webhooks & Notifications',
//     excerpt: 'Receive real-time POST notifications when screenshots complete. Includes HMAC-SHA256 payload signing and exponential-backoff retry. Business tier and above. Coming in Phase 3.',
//     category: 'advanced-features',
//     component: null,
//     readTime: '10 min read',
//     tags: ['webhooks', 'notifications', 'hmac', 'business', 'automation'],
//     popular: false,
//     views: 0
//   },

//   // ── Phase 4 (Premium — stub until shipped) ──────────────────────────────
//   {
//     id: 'white-label-guide',
//     slug: 'white-label-guide',
//     title: 'White-Label & Custom Domains',
//     excerpt: 'Serve screenshots from your own domain with your own branding. Remove all PixelPerfect references from the API response. Premium tier. Coming in Phase 4.',
//     category: 'advanced-features',
//     component: null,
//     readTime: '12 min read',
//     tags: ['white-label', 'custom-domain', 'branding', 'premium'],
//     popular: false,
//     views: 0
//   }
// ];

// // ========================================
// // HELPER FUNCTIONS  (unchanged)
// // ========================================

// export function getAllArticles() {
//   return articles;
// }

// export function getArticleBySlug(slug) {
//   return articles.find(article => article.slug === slug) || null;
// }

// export function getArticlesByCategory(categoryId) {
//   return articles.filter(article => article.category === categoryId);
// }

// export function getPopularArticles(limit = 5) {
//   return articles
//     .filter(article => article.popular)
//     .sort((a, b) => b.views - a.views)
//     .slice(0, limit);
// }

// export function getCategoryById(categoryId) {
//   return categories.find(cat => cat.id === categoryId) || null;
// }

// export function searchArticles(query) {
//   if (!query || query.trim() === '') {
//     return articles;
//   }

//   const searchTerm = query.toLowerCase().trim();

//   return articles.filter(article => {
//     if (article.title.toLowerCase().includes(searchTerm)) return true;
//     if (article.excerpt.toLowerCase().includes(searchTerm)) return true;
//     if (article.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
//     return false;
//   });
// }

// export function getRecentArticles(limit = 10) {
//   return articles
//     .sort((a, b) => b.views - a.views)
//     .slice(0, limit);
// }

// export function formatViews(views) {
//   if (views >= 1000) {
//     return `${(views / 1000).toFixed(1)}K`;
//   }
//   return views.toString();
// }

// // ===== END OF helpArticles.js =====

