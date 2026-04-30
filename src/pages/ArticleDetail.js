// ========================================
// ARTICLE DETAIL PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/ArticleDetail.js
// Author: OneTechly
// Updated: April 29, 2026
//
// Renders individual help articles with dynamic loading
// Pulls article data from helpArticles.js via getArticleBySlug
// Dynamically imports guide component for content
//
// ✅ FIX (Apr 2026): Removed lucide-react dependency.
//    All icons replaced with inline SVGs.
//
// ✅ FIX (Apr 2026 - Round 2): Polished bottom layout.
//
// ✅ UPDATE (Apr 26, 2026 - Round 3): Wired 8 Security & Privacy and
//    Account Management guide components.
//
// ✅ UPDATE (Apr 28, 2026 - Round 4): Wired 3 Billing components.
//
// ✅ FIX (Apr 29, 2026 - Round 5): Added the 3 missing Troubleshooting
//    lazy-imports that caused the crash on /help/article/webhook-delivery-failures
//    (Images 1 & 2 in the bug report). The guideComponents map previously had
//    only ErrorsAndSolutionsGuide in the Troubleshooting section; the other
//    three (ScreenshotQualityIssuesGuide, ApiTimeoutErrorsGuide,
//    WebhookDeliveryFailuresGuide) were missing entirely.
//
//    Also confirmed: Billing section (Round 4 entries) is intact.
// ========================================

import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticleBySlug, getArticlesByCategory, getCategoryById } from '../data/helpArticles';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ========================================
// INLINE SVG ICONS (replaces lucide-react)
// ========================================

const IconArrowLeft = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconMail = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconBookOpen = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconHelpCircle = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconInfo = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ========================================
// GUIDE COMPONENT MAP (category-ordered)
// ========================================
const guideComponents = {
  // ---------- 1. Getting Started ----------
  QuickStartGuide:                lazy(() => import('../guides/QuickStartGuide')),
  HowToCreateAccountGuide:        lazy(() => import('../guides/HowToCreateAccountGuide')),
  GettingYourApiKeyGuide:         lazy(() => import('../guides/GettingYourApiKeyGuide')),
  MakingFirstApiRequestGuide:     lazy(() => import('../guides/MakingFirstApiRequestGuide')),

  // ---------- 2. API Usage ----------
  ApiAuthenticationMethodsGuide:  lazy(() => import('../guides/ApiAuthenticationMethodsGuide')),
  APIProcessingGuide:             lazy(() => import('../guides/APIProcessingGuide')),
  BatchProcessingGuide:           lazy(() => import('../guides/BatchProcessingGuide')),
  OptimizationGuide:              lazy(() => import('../guides/OptimizationGuide')),
  NodeIntegrationGuide:           lazy(() => import('../guides/NodeIntegrationGuide')),
  PythonIntegrationGuide:         lazy(() => import('../guides/PythonIntegrationGuide')),
  JavaScriptExecutionGuide:       lazy(() => import('../guides/JavaScriptExecutionGuide')),
  SocialMediaPreviewGuide:        lazy(() => import('../guides/SocialMediaPreviewGuide')),
  WebsiteMonitorGuide:            lazy(() => import('../guides/WebsiteMonitorGuide')),

  // ---------- 3. Billing & Subscription ----------
  ManagingPaymentMethodsGuide:    lazy(() => import('../guides/ManagingPaymentMethodsGuide')),
  UnderstandingYourInvoiceGuide:  lazy(() => import('../guides/UnderstandingYourInvoiceGuide')),
  UnderstandingPricingPlansGuide: lazy(() => import('../guides/UnderstandingPricingPlansGuide')),

  // ---------- 4. Troubleshooting ----------
  // ✅ FIX (Apr 29, 2026): Added the 3 missing imports below.
  // ErrorsAndSolutionsGuide was already present; the other three were not,
  // which caused React to receive `undefined` as the lazy component and throw:
  // "Element type is invalid. Received a promise that resolves to: undefined.
  //  Lazy element type must resolve to a class or function."
  ErrorsAndSolutionsGuide:        lazy(() => import('../guides/ErrorsAndSolutionsGuide')),
  ScreenshotQualityIssuesGuide:   lazy(() => import('../guides/ScreenshotQualityIssuesGuide')),
  ApiTimeoutErrorsGuide:          lazy(() => import('../guides/ApiTimeoutErrorsGuide')),
  WebhookDeliveryFailuresGuide:   lazy(() => import('../guides/WebhookDeliveryFailuresGuide')),

  // ---------- 5. Security & Privacy ----------
  ApiKeyBestPracticesGuide:       lazy(() => import('../guides/ApiKeyBestPracticesGuide')),
  DataRetentionPrivacyGuide:      lazy(() => import('../guides/DataRetentionPrivacyGuide')),
  AccountSecurityGuide:           lazy(() => import('../guides/AccountSecurityGuide')),
  GdprComplianceGuide:            lazy(() => import('../guides/GdprComplianceGuide')),

  // ---------- 6. Account Management ----------
  ManagingYourProfileGuide:       lazy(() => import('../guides/ManagingYourProfileGuide')),
  ChangingYourPasswordGuide:      lazy(() => import('../guides/ChangingYourPasswordGuide')),
  ManagingYourSubscriptionGuide:  lazy(() => import('../guides/ManagingYourSubscriptionGuide')),
  DeletingYourAccountGuide:       lazy(() => import('../guides/DeletingYourAccountGuide')),
};

// Loading component
const GuideLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading guide...</span>
  </div>
);

// ========================================
// MAIN COMPONENT
// ========================================
const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article  = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconHelpCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/help')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Help Center
          </button>
        </div>
      </div>
    );
  }

  const category         = getCategoryById(article.category);
  const relatedArticles  = getArticlesByCategory(article.category)
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  const GuideComponent = article.component ? guideComponents[article.component] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/help" className="text-blue-600 hover:text-blue-700 font-medium">
              Help Center
            </Link>
            <IconChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              to={`/help?category=${article.category}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {category?.name}
            </Link>
            <IconChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <IconArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <IconClock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div>•</div>
              <div>{(article.views || 0).toLocaleString()} views</div>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8">
            {GuideComponent ? (
              <Suspense fallback={<GuideLoader />}>
                <GuideComponent />
              </Suspense>
            ) : (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg">
                <div className="flex">
                  <IconInfo className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Guide Coming Soon</h3>
                    <p className="text-blue-700">
                      We're working on this detailed guide. In the meantime, check out our
                      related articles below or contact support for assistance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!GuideComponent && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help Right Away?</h3>
                <ul className="space-y-2 mb-6">
                  <li>
                    • <Link to="/contact" className="text-blue-600 hover:text-blue-700 underline">
                      Contact our support team
                    </Link> - We're here to help with any questions
                  </li>
                  <li>
                    • <Link to="/api-docs" className="text-blue-600 hover:text-blue-700 underline">
                      View full API documentation
                    </Link> - Complete reference and examples
                  </li>
                  <li>
                    • <Link to="/help?category=troubleshooting" className="text-blue-600 hover:text-blue-700 underline">
                      Check our FAQ
                    </Link> - Common questions and answers
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Responsive footer */}
          <div className="bg-gray-50 px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <PixelPerfectLogo size={32} showText={false} />
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">PixelPerfect</div>
                <div className="text-xs text-gray-500 truncate">Screenshot API</div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/help"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
              >
                ← Help Center
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-4 items-stretch">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/help/article/${related.slug}`}
                  className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <h3
                    className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 leading-snug line-clamp-2"
                    title={related.title}
                  >
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                    {related.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <IconClock className="w-3 h-3" />
                      {related.readTime}
                    </span>
                    <span>•</span>
                    <span>{(related.views || 0).toLocaleString()} views</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Was this article helpful?</h3>
          <p className="text-gray-600 mb-4">
            If you still have questions, our support team is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center"
            >
              <IconMail className="w-4 h-4" />
              Contact Support
            </Link>
            <Link
              to="/help"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-6 py-2 rounded-lg border border-blue-200 transition-colors flex items-center gap-2 justify-center"
            >
              <IconBookOpen className="w-4 h-4" />
              Browse More Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

// =======================================================
// // ========================================
// // ARTICLE DETAIL PAGE - PIXELPERFECT
// // ========================================
// // File: frontend/src/pages/ArticleDetail.js
// // Author: OneTechly
// // Updated: April 28, 2026
// //
// // Renders individual help articles with dynamic loading
// // Pulls article data from helpArticles.js via getArticleBySlug
// // Dynamically imports guide component for content
// //
// // ✅ FIX (Apr 2026): Removed lucide-react dependency.
// //    All icons replaced with inline SVGs matching the style used by every
// //    guide component in this codebase. No new package install required.
// //
// // ✅ FIX (Apr 2026 - Round 2): Polished bottom layout:
// //    - Footer block is now responsive: stacks vertically on mobile,
// //      balanced side-by-side on desktop with proper padding
// //    - Related Articles card titles clamp to 2 lines
// //    - Card excerpts clamp to 3 lines for consistent card heights
// //    - Metadata row uses flex-wrap so tight layouts don't overflow
// //    - All three related-article cards now have identical visual weight
// //
// // ✅ UPDATE (Apr 26, 2026 - Round 3): Wired up 8 new guide components
// //    for Security & Privacy and Account Management categories.
// //
// // ✅ UPDATE (Apr 28, 2026 - Round 4): Wired up the 3 new
// //    Billing & Subscription components. The "MISSING LAZY" placeholder
// //    section is now filled in. Section ordering preserved.
// //      - ManagingPaymentMethodsGuide
// //      - UnderstandingYourInvoiceGuide
// //      - UnderstandingPricingPlansGuide
// // ========================================

// import React, { Suspense, lazy } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { getArticleBySlug, getArticlesByCategory, getCategoryById } from '../data/helpArticles';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// // ========================================
// // INLINE SVG ICONS (replaces lucide-react)
// // ========================================

// const IconArrowLeft = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//   </svg>
// );

// const IconClock = ({ className = "w-4 h-4" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const IconChevronRight = ({ className = "w-4 h-4" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//   </svg>
// );

// const IconMail = ({ className = "w-4 h-4" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );

// const IconBookOpen = ({ className = "w-4 h-4" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//       d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//   </svg>
// );

// const IconHelpCircle = ({ className = "w-8 h-8" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//       d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const IconInfo = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//       d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// // ========================================
// // GUIDE COMPONENT MAP (category-ordered)
// // ========================================
// const guideComponents = {
//   // ---------- 1. Getting Started ----------
//   QuickStartGuide:                lazy(() => import('../guides/QuickStartGuide')),
//   HowToCreateAccountGuide:        lazy(() => import('../guides/HowToCreateAccountGuide')),
//   GettingYourApiKeyGuide:         lazy(() => import('../guides/GettingYourApiKeyGuide')),
//   MakingFirstApiRequestGuide:     lazy(() => import('../guides/MakingFirstApiRequestGuide')),

//   // ---------- 2. API Usage ----------
//   ApiAuthenticationMethodsGuide:  lazy(() => import('../guides/ApiAuthenticationMethodsGuide')),
//   APIProcessingGuide:             lazy(() => import('../guides/APIProcessingGuide')),
//   BatchProcessingGuide:           lazy(() => import('../guides/BatchProcessingGuide')),
//   OptimizationGuide:              lazy(() => import('../guides/OptimizationGuide')),
//   NodeIntegrationGuide:           lazy(() => import('../guides/NodeIntegrationGuide')),
//   PythonIntegrationGuide:         lazy(() => import('../guides/PythonIntegrationGuide')),
//   JavaScriptExecutionGuide:       lazy(() => import('../guides/JavaScriptExecutionGuide')),
//   SocialMediaPreviewGuide:        lazy(() => import('../guides/SocialMediaPreviewGuide')),
//   WebsiteMonitorGuide:            lazy(() => import('../guides/WebsiteMonitorGuide')),

//   // ---------- 3. Billing & Subscription (✅ NEW: Apr 28, 2026) ----------
//   ManagingPaymentMethodsGuide:    lazy(() => import('../guides/ManagingPaymentMethodsGuide')),
//   UnderstandingYourInvoiceGuide:  lazy(() => import('../guides/UnderstandingYourInvoiceGuide')),
//   UnderstandingPricingPlansGuide: lazy(() => import('../guides/UnderstandingPricingPlansGuide')),

//   // ---------- 4. Troubleshooting (✅ NEW: Apr 28, 2026) ----------
//   ErrorsAndSolutionsGuide:        lazy(() => import('../guides/ErrorsAndSolutionsGuide')),
//   ScreenshotQualityIssuesGuide:   lazy(() => import('../guides/ScreenshotQualityIssuesGuide')),
//   ApiTimeoutErrorsGuide:          lazy(() => import('../guides/ApiTimeoutErrorsGuide')),
//   WebhookDeliveryFailuresGuide:   lazy(() => import('../guides/WebhookDeliveryFailuresGuide')),

//   // ---------- 5. Security & Privacy (✅ NEW: Apr 26, 2026) ----------
//   ApiKeyBestPracticesGuide:       lazy(() => import('../guides/ApiKeyBestPracticesGuide')),
//   DataRetentionPrivacyGuide:      lazy(() => import('../guides/DataRetentionPrivacyGuide')),
//   AccountSecurityGuide:           lazy(() => import('../guides/AccountSecurityGuide')),
//   GdprComplianceGuide:            lazy(() => import('../guides/GdprComplianceGuide')),

//   // ---------- 6. Account Management (✅ NEW: Apr 26, 2026) ----------
//   ManagingYourProfileGuide:       lazy(() => import('../guides/ManagingYourProfileGuide')),
//   ChangingYourPasswordGuide:      lazy(() => import('../guides/ChangingYourPasswordGuide')),
//   ManagingYourSubscriptionGuide:  lazy(() => import('../guides/ManagingYourSubscriptionGuide')),
//   DeletingYourAccountGuide:       lazy(() => import('../guides/DeletingYourAccountGuide')),
// };

// // Loading component
// const GuideLoader = () => (
//   <div className="flex items-center justify-center py-20">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//     <span className="ml-3 text-gray-600">Loading guide...</span>
//   </div>
// );

// // ========================================
// // MAIN COMPONENT
// // ========================================
// const ArticleDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const article  = getArticleBySlug(slug);

//   if (!article) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <IconHelpCircle className="w-8 h-8 text-red-500" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
//           <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
//           <button
//             onClick={() => navigate('/help')}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
//           >
//             ← Back to Help Center
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const category         = getCategoryById(article.category);
//   const relatedArticles  = getArticlesByCategory(article.category)
//     .filter(a => a.id !== article.id)
//     .slice(0, 3);

//   const GuideComponent = article.component ? guideComponents[article.component] : null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Breadcrumb Navigation */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <nav className="flex items-center space-x-2 text-sm">
//             <Link to="/help" className="text-blue-600 hover:text-blue-700 font-medium">
//               Help Center
//             </Link>
//             <IconChevronRight className="w-4 h-4 text-gray-400" />
//             <Link
//               to={`/help?category=${article.category}`}
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               {category?.name}
//             </Link>
//             <IconChevronRight className="w-4 h-4 text-gray-400" />
//             <span className="text-gray-600 truncate">{article.title}</span>
//           </nav>
//         </div>
//       </div>

//       {/* Article Content */}
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           {/* Article Header */}
//           <div className="p-8 border-b border-gray-200">
//             <div className="flex items-start justify-between mb-4">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//               >
//                 <IconArrowLeft className="w-5 h-5" />
//                 Back
//               </button>
//             </div>

//             <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
//             <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>

//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               <div className="flex items-center gap-1">
//                 <IconClock className="w-4 h-4" />
//                 <span>{article.readTime}</span>
//               </div>
//               <div>•</div>
//               <div>{(article.views || 0).toLocaleString()} views</div>
//             </div>
//           </div>

//           {/* Article Body */}
//           <div className="p-8">
//             {GuideComponent ? (
//               <Suspense fallback={<GuideLoader />}>
//                 <GuideComponent />
//               </Suspense>
//             ) : (
//               <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg">
//                 <div className="flex">
//                   <IconInfo className="w-5 h-5 text-blue-400 mt-0.5" />
//                   <div className="ml-3">
//                     <h3 className="text-lg font-semibold text-blue-800 mb-2">Guide Coming Soon</h3>
//                     <p className="text-blue-700">
//                       We're working on this detailed guide. In the meantime, check out our
//                       related articles below or contact support for assistance.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {!GuideComponent && (
//               <div className="mt-8">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help Right Away?</h3>
//                 <ul className="space-y-2 mb-6">
//                   <li>
//                     • <Link to="/contact" className="text-blue-600 hover:text-blue-700 underline">
//                       Contact our support team
//                     </Link> - We're here to help with any questions
//                   </li>
//                   <li>
//                     • <Link to="/api-docs" className="text-blue-600 hover:text-blue-700 underline">
//                       View full API documentation
//                     </Link> - Complete reference and examples
//                   </li>
//                   <li>
//                     • <Link to="/help?category=troubleshooting" className="text-blue-600 hover:text-blue-700 underline">
//                       Check our FAQ
//                     </Link> - Common questions and answers
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Responsive footer */}
//           <div className="bg-gray-50 px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-3 min-w-0">
//               <PixelPerfectLogo size={32} showText={false} />
//               <div className="min-w-0">
//                 <div className="font-semibold text-gray-900 text-sm truncate">PixelPerfect</div>
//                 <div className="text-xs text-gray-500 truncate">Screenshot API</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 flex-shrink-0">
//               <Link
//                 to="/help"
//                 className="text-sm text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
//               >
//                 ← Help Center
//               </Link>
//               <Link
//                 to="/register"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
//               >
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Related Articles */}
//         {relatedArticles.length > 0 && (
//           <div className="mt-8">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h2>
//             <div className="grid md:grid-cols-3 gap-4 items-stretch">
//               {relatedArticles.map((related) => (
//                 <Link
//                   key={related.id}
//                   to={`/help/article/${related.slug}`}
//                   className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
//                 >
//                   <h3
//                     className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 leading-snug line-clamp-2"
//                     title={related.title}
//                   >
//                     {related.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
//                     {related.excerpt}
//                   </p>
//                   <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
//                     <span className="inline-flex items-center gap-1">
//                       <IconClock className="w-3 h-3" />
//                       {related.readTime}
//                     </span>
//                     <span>•</span>
//                     <span>{(related.views || 0).toLocaleString()} views</span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Help Section */}
//         <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Was this article helpful?</h3>
//           <p className="text-gray-600 mb-4">
//             If you still have questions, our support team is here to help
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Link
//               to="/contact"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center"
//             >
//               <IconMail className="w-4 h-4" />
//               Contact Support
//             </Link>
//             <Link
//               to="/help"
//               className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-6 py-2 rounded-lg border border-blue-200 transition-colors flex items-center gap-2 justify-center"
//             >
//               <IconBookOpen className="w-4 h-4" />
//               Browse More Articles
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArticleDetail;

// //===== END OF ArticleDetail.js =====


