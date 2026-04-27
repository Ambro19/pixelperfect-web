// ========================================
// HELP CENTER ARTICLES DATA - PIXELPERFECT
// ========================================
// File: frontend/src/data/helpArticles.js
// Author: OneTechly
// Update: April 2026
//
// Article metadata for Help Center Hub
// Maps article titles to actual guide components
// Provides searchable keywords and categorization
//
// ✅ FIX (Apr 26, 2026): Wired up 8 new article components from the
//    Security & Privacy and Account Management categories.
//
//    Wiring summary:
//      - Updated existing slugs to map their `component` field to the
//        new guide files instead of `null`:
//          api-key-security-best-practices → ApiKeyBestPracticesGuide
//          data-retention-policy           → DataRetentionPrivacyGuide
//          gdpr-compliance                 → GdprComplianceGuide
//          updating-account-details        → ManagingYourProfileGuide
//          password-reset                  → ChangingYourPasswordGuide
//
//      - Added 3 net-new entries for articles the data file didn't yet have:
//          account-security                → AccountSecurityGuide
//          managing-your-subscription      → ManagingYourSubscriptionGuide
//          deleting-your-account           → DeletingYourAccountGuide
//
//      - Honestly reconciled two entries that previously over-claimed:
//          soc2-certification: kept the slug for backwards compatibility
//            but redirected to GdprComplianceGuide (which honestly states
//            we are NOT yet SOC 2 audited). Excerpt rewritten.
//          two-factor-authentication: kept the slug but redirected to
//            AccountSecurityGuide which covers 2FA in its roadmap section.
//            Excerpt rewritten to reflect that 2FA isn't shipped yet.
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
  }
];

// Article metadata
// Each article maps to a guide component in frontend/src/guides/
export const articles = [
  // ========================================
  // GETTING STARTED
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
  {
    id: 'pricing-plans',
    slug: 'understanding-pricing-plans',
    title: 'Understanding pricing plans',
    excerpt: 'Compare our pricing tiers and find the plan that fits your needs.',
    category: 'getting-started',
    component: null,
    readTime: '5 min read',
    tags: ['pricing', 'plans', 'subscription'],
    popular: false,
    views: 4100
  },

  // ========================================
  // API USAGE
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
    id: 'javascript-execution',
    slug: 'javascript-execution',
    title: 'JavaScript Execution Guide',
    excerpt: 'Execute custom JavaScript before capturing screenshots.',
    category: 'api-usage',
    component: 'JavaScriptExecutionGuide',
    readTime: '10 min read',
    tags: ['javascript', 'custom-js', 'automation', 'advanced'],
    popular: false,
    views: 4800
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
  // BILLING & SUBSCRIPTION
  // ========================================
  {
    id: 'upgrade-plan',
    slug: 'how-to-upgrade-plan',
    title: 'How to upgrade your plan',
    excerpt: 'Upgrade to Pro, Business, or Premium to unlock more features.',
    category: 'billing',
    // ✅ Apr 26, 2026: Pointed to ManagingYourSubscriptionGuide which covers
    // upgrade flow plus all related actions (downgrade, cancel, billing cadence).
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
    component: null,
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
    component: null,
    readTime: '6 min read',
    tags: ['invoice', 'billing', 'charges', 'statement'],
    popular: false,
    views: 1500
  },
  {
    id: 'cancellation',
    slug: 'cancellation-and-refunds',
    title: 'Cancellation and refunds',
    excerpt: 'Understand our cancellation policy and how to request refunds.',
    category: 'billing',
    // ✅ Apr 26, 2026: Pointed to ManagingYourSubscriptionGuide which covers
    // cancellation flow with the 14-day refund policy explicitly stated.
    component: 'ManagingYourSubscriptionGuide',
    readTime: '5 min read',
    tags: ['cancellation', 'refund', 'policy', 'subscription'],
    popular: false,
    views: 2200
  },

  // ========================================
  // TROUBLESHOOTING
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
    component: null,
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
    component: null,
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
    component: null,
    readTime: '10 min read',
    tags: ['webhooks', 'notifications', 'troubleshooting', 'debugging'],
    popular: false,
    views: 1800
  },

  // ========================================
  // SECURITY & PRIVACY
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
    // ✅ Apr 26, 2026: Honest excerpt. We are NOT currently SOC 2 audited.
    // The full position is documented in the GDPR & Compliance guide.
    excerpt: 'Our current SOC 2 position and roadmap — covered in our GDPR & Compliance guide.',
    category: 'security',
    component: 'GdprComplianceGuide',
    readTime: '10 min read',
    tags: ['soc2', 'compliance', 'security', 'certification', 'roadmap'],
    popular: false,
    views: 650
  },

  // ========================================
  // ACCOUNT MANAGEMENT
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
    // ✅ Apr 26, 2026: Honest excerpt. 2FA is on the roadmap, not shipped.
    // The full security model and 2FA roadmap context lives in
    // AccountSecurityGuide.
    excerpt: 'Two-factor authentication is on our roadmap — see our account security guide for the full story.',
    category: 'account',
    component: 'AccountSecurityGuide',
    readTime: '8 min read',
    tags: ['2fa', 'security', 'authentication', 'account', 'roadmap'],
    popular: false,
    views: 1100
  }
];

// ========================================
// HELPER FUNCTIONS
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

//// ====== END of helpArticles.js ============

// //================================================================================
// // ========================================
// // HELP CENTER ARTICLES DATA - PIXELPERFECT
// // ========================================
// // File: frontend/src/data/helpArticles.js
// // Author: OneTechly
// // Update: April 2026
// //
// // Article metadata for Help Center Hub
// // Maps article titles to actual guide components
// // Provides searchable keywords and categorization
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
//   }
// ];

// // Article metadata
// // Each article maps to a guide component in frontend/src/guides/
// export const articles = [
//   // ========================================
//   // GETTING STARTED
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
//   {
//     id: 'pricing-plans',
//     slug: 'understanding-pricing-plans',
//     title: 'Understanding pricing plans',
//     excerpt: 'Compare our pricing tiers and find the plan that fits your needs.',
//     category: 'getting-started',
//     component: null,
//     readTime: '5 min read',
//     tags: ['pricing', 'plans', 'subscription'],
//     popular: false,
//     views: 4100
//   },

//   // ========================================
//   // API USAGE
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
//     component: 'BatchProcessingGuide', // Update: April 2026 - NEW - Maps to frontend/src/guides/BatchProcessingGuide.jsx
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
//     id: 'javascript-execution',
//     slug: 'javascript-execution',
//     title: 'JavaScript Execution Guide',
//     excerpt: 'Execute custom JavaScript before capturing screenshots.',
//     category: 'api-usage',
//     component: 'JavaScriptExecutionGuide',
//     readTime: '10 min read',
//     tags: ['javascript', 'custom-js', 'automation', 'advanced'],
//     popular: false,
//     views: 4800
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
//   // BILLING & SUBSCRIPTION
//   // ========================================
//   {
//     id: 'upgrade-plan',
//     slug: 'how-to-upgrade-plan',
//     title: 'How to upgrade your plan',
//     excerpt: 'Upgrade to Pro, Business, or Premium to unlock more features.',
//     category: 'billing',
//     component: null,
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
//     component: null,
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
//     component: null,
//     readTime: '6 min read',
//     tags: ['invoice', 'billing', 'charges', 'statement'],
//     popular: false,
//     views: 1500
//   },
//   {
//     id: 'cancellation',
//     slug: 'cancellation-and-refunds',
//     title: 'Cancellation and refunds',
//     excerpt: 'Understand our cancellation policy and how to request refunds.',
//     category: 'billing',
//     component: null,
//     readTime: '5 min read',
//     tags: ['cancellation', 'refund', 'policy', 'subscription'],
//     popular: false,
//     views: 2200
//   },

//   // ========================================
//   // TROUBLESHOOTING
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
//     component: null,
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
//     component: null,
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
//     component: null,
//     readTime: '10 min read',
//     tags: ['webhooks', 'notifications', 'troubleshooting', 'debugging'],
//     popular: false,
//     views: 1800
//   },

//   // ========================================
//   // SECURITY & PRIVACY
//   // ========================================
//   {
//     id: 'data-retention',
//     slug: 'data-retention-policy',
//     title: 'Data retention policy',
//     excerpt: 'Understand how long we store your screenshots and data.',
//     category: 'security',
//     component: null,
//     readTime: '5 min read',
//     tags: ['privacy', 'data', 'retention', 'policy'],
//     popular: false,
//     views: 1200
//   },
//   {
//     id: 'api-security',
//     slug: 'api-key-security-best-practices',
//     title: 'API key security best practices',
//     excerpt: 'Keep your API keys secure with these essential practices.',
//     category: 'security',
//     component: null,
//     readTime: '8 min read',
//     tags: ['security', 'api-key', 'best-practices', 'safety'],
//     popular: false,
//     views: 2700
//   },
//   {
//     id: 'gdpr',
//     slug: 'gdpr-compliance',
//     title: 'GDPR compliance',
//     excerpt: 'Learn how PixelPerfect complies with GDPR regulations.',
//     category: 'security',
//     component: null,
//     readTime: '10 min read',
//     tags: ['gdpr', 'compliance', 'privacy', 'regulations'],
//     popular: false,
//     views: 900
//   },
//   {
//     id: 'soc2',
//     slug: 'soc2-certification',
//     title: 'SOC 2 certification',
//     excerpt: 'Details about our SOC 2 Type II certification and security controls.',
//     category: 'security',
//     component: null,
//     readTime: '6 min read',
//     tags: ['soc2', 'compliance', 'security', 'certification'],
//     popular: false,
//     views: 650
//   },

//   // ========================================
//   // ACCOUNT MANAGEMENT
//   // ========================================
//   {
//     id: 'account-details',
//     slug: 'updating-account-details',
//     title: 'Updating account details',
//     excerpt: 'Change your email, username, and other account information.',
//     category: 'account',
//     component: null,
//     readTime: '4 min read',
//     tags: ['account', 'profile', 'settings', 'update'],
//     popular: false,
//     views: 2100
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
//     title: 'Password reset',
//     excerpt: 'Reset your password if you have forgotten it or want to change it.',
//     category: 'account',
//     component: null,
//     readTime: '3 min read',
//     tags: ['password', 'reset', 'security', 'account'],
//     popular: false,
//     views: 1700
//   },
//   {
//     id: 'two-factor',
//     slug: 'two-factor-authentication',
//     title: 'Two-factor authentication',
//     excerpt: 'Enable 2FA to add an extra layer of security to your account.',
//     category: 'account',
//     component: null,
//     readTime: '6 min read',
//     tags: ['2fa', 'security', 'authentication', 'account'],
//     popular: false,
//     views: 1100
//   }
// ];

// // ========================================
// // HELPER FUNCTIONS
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

// //// ====== END of helpArticles/js ============
