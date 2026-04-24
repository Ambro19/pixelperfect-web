// ========================================
// ARTICLE DETAIL PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/ArticleDetail.js
// Author: OneTechly
// Updated: April 2026
//
// Renders individual help articles with dynamic loading
// Pulls article data from helpArticles.js via getArticleBySlug
// Dynamically imports guide component for content
// Includes breadcrumb navigation, related articles, and social sharing
// ========================================

import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  Mail,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Info,
} from 'lucide-react';
import { getArticleBySlug, getArticlesByCategory, getCategoryById } from '../data/helpArticles';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ========================================
// GUIDE COMPONENT MAP (category-ordered)
//
// Add new guide components here when introducing a new article.
// Only components in this map will render at runtime; any slug whose
// `component` in helpArticles.js isn't listed here will fall through
// to the "Guide Coming Soon" placeholder.
// ========================================
const guideComponents = {
  // ---------- Getting Started ----------
  QuickStartGuide:                lazy(() => import('../guides/QuickStartGuide')),
  HowToCreateAccountGuide:        lazy(() => import('../guides/HowToCreateAccountGuide')),
  GettingYourApiKeyGuide:         lazy(() => import('../guides/GettingYourApiKeyGuide')),
  MakingFirstApiRequestGuide:     lazy(() => import('../guides/MakingFirstApiRequestGuide')),

  // ---------- API Usage ----------
  ApiAuthenticationMethodsGuide:  lazy(() => import('../guides/ApiAuthenticationMethodsGuide')),
  APIProcessingGuide:             lazy(() => import('../guides/APIProcessingGuide')),
  BatchProcessingGuide:           lazy(() => import('../guides/BatchProcessingGuide')), // ✅ NEW Apr 2026
  OptimizationGuide:              lazy(() => import('../guides/OptimizationGuide')),
  NodeIntegrationGuide:           lazy(() => import('../guides/NodeIntegrationGuide')),
  PythonIntegrationGuide:         lazy(() => import('../guides/PythonIntegrationGuide')),
  JavaScriptExecutionGuide:       lazy(() => import('../guides/JavaScriptExecutionGuide')),
  SocialMediaPreviewGuide:        lazy(() => import('../guides/SocialMediaPreviewGuide')),
  WebsiteMonitorGuide:            lazy(() => import('../guides/WebsiteMonitorGuide')),

  // ---------- Troubleshooting ----------
  ErrorsAndSolutionsGuide:        lazy(() => import('../guides/ErrorsAndSolutionsGuide')),
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

  // If article not found
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-red-500" />
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

  // Get guide component if available
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
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              to={`/help?category=${article.category}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {category?.name}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
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
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
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
              // Placeholder for articles without custom guide components
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg">
                <div className="flex">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
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

            {/* Common CTA Section for articles without full content */}
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

          {/* Article Footer */}
          <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PixelPerfectLogo size={32} showText={false} />
              <div>
                <div className="font-semibold text-gray-900 text-sm">PixelPerfect</div>
                <div className="text-xs text-gray-500">Screenshot API</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/help"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Help Center
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
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
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/help/article/${related.slug}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {related.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{related.readTime}</span>
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
              <Mail className="w-4 h-4" />
              Contact Support
            </Link>
            <Link
              to="/help"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-6 py-2 rounded-lg border border-blue-200 transition-colors flex items-center gap-2 justify-center"
            >
              <BookOpen className="w-4 h-4" />
              Browse More Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

// // ========================================================================================
// // ========================================
// // ARTICLE DETAIL PAGE - PIXELPERFECT
// // ========================================
// // File: frontend/src/pages/ArticleDetail.js
// // Author: OneTechly
// // Update: April 2026
// //
// // Individual help article page
// // Dynamically loads guide components
// // Includes breadcrumb navigation and related articles
// // Production-ready, mobile-responsive
// // ========================================

// import React, { lazy, Suspense } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';
// import {
//   getArticleBySlug,
//   getCategoryById,
//   getArticlesByCategory,
//   formatViews
// } from '../data/helpArticles';

// // ========================================
// // DYNAMIC GUIDE IMPORTS
// // ========================================
// // Update: April 2026
// // Dynamically import guide components based on article metadata
// // Add new guides here as they are created

// const guideComponents = {
//   // Getting Started
//   QuickStartGuide: lazy(() => import('../guides/QuickStartGuide')),
//   HowToCreateAccountGuide: lazy(() => import('../guides/HowToCreateAccountGuide')),
//   GettingYourApiKeyGuide: lazy(() => import('../guides/GettingYourApiKeyGuide')),
//   MakingFirstApiRequestGuide: lazy(() => import('../guides/MakingFirstApiRequestGuide')),

//   // API Usage
//   ApiAuthenticationMethodsGuide: lazy(() => import('../guides/ApiAuthenticationMethodsGuide')), // Update: April 2026 - NEW
//   APIProcessingGuide: lazy(() => import('../guides/APIProcessingGuide')),
//   OptimizationGuide: lazy(() => import('../guides/OptimizationGuide')),
//   NodeIntegrationGuide: lazy(() => import('../guides/NodeIntegrationGuide')),
//   PythonIntegrationGuide: lazy(() => import('../guides/PythonIntegrationGuide')),
//   JavaScriptExecutionGuide: lazy(() => import('../guides/JavaScriptExecutionGuide')),
//   SocialMediaPreviewGuide: lazy(() => import('../guides/SocialMediaPreviewGuide')),
//   WebsiteMonitorGuide: lazy(() => import('../guides/WebsiteMonitorGuide')),

//   // Troubleshooting
//   ErrorsAndSolutionsGuide: lazy(() => import('../guides/ErrorsAndSolutionsGuide')),
// };

// // ========================================
// // LOADING COMPONENT
// // ========================================
// const LoadingSpinner = () => (
//   <div className="flex items-center justify-center py-16">
//     <div className="text-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
//       <p className="text-gray-600">Loading article...</p>
//     </div>
//   </div>
// );

// // ========================================
// // PLACEHOLDER COMPONENT (for articles without guides yet)
// // ========================================
// const ArticlePlaceholder = ({ article }) => (
//   <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12">
//     <div className="max-w-3xl mx-auto">
//       {/* Article Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//           {article.title}
//         </h1>
//         <p className="text-lg text-gray-600 mb-4">
//           {article.excerpt}
//         </p>
//         <div className="flex items-center gap-4 text-sm text-gray-500">
//           <span>{article.readTime}</span>
//           <span>•</span>
//           <span>{formatViews(article.views)} views</span>
//         </div>
//       </div>

//       {/* Placeholder Content */}
//       <div className="prose max-w-none">
//         <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
//           <div className="flex items-start gap-3">
//             <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//             </svg>
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-1">Guide Coming Soon</h3>
//               <p className="text-gray-700">
//                 We're working on this detailed guide. In the meantime, check out our related articles below or contact support for assistance.
//               </p>
//             </div>
//           </div>
//         </div>

//         <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Right Away?</h2>
//         <ul className="space-y-3">
//           <li>
//             <a href="/contact" className="text-blue-600 hover:underline font-medium">
//               Contact our support team
//             </a>
//             {' '}— We're here to help with any questions
//           </li>
//           <li>
//             <a href="/docs" className="text-blue-600 hover:underline font-medium">
//               View full API documentation
//             </a>
//             {' '}— Complete reference and examples
//           </li>
//           <li>
//             <a href="/faq" className="text-blue-600 hover:underline font-medium">
//               Check our FAQ
//             </a>
//             {' '}— Common questions and answers
//           </li>
//         </ul>
//       </div>
//     </div>
//   </div>
// );

// // ========================================
// // MAIN COMPONENT
// // ========================================
// const ArticleDetail = () => {
//   const navigate = useNavigate();
//   const { slug } = useParams();
  
//   // Get article data
//   const article = getArticleBySlug(slug);
  
//   // 404 if article not found
//   if (!article) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center px-4">
//           <div className="text-6xl mb-4">📄</div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Article Not Found</h1>
//           <p className="text-gray-600 mb-6">
//             This help article doesn't exist or has been moved.
//           </p>
//           <button
//             onClick={() => navigate('/help')}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//           >
//             ← Back to Help Center
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Get category and related articles
//   const category = getCategoryById(article.category);
//   const relatedArticles = getArticlesByCategory(article.category)
//     .filter(a => a.id !== article.id)
//     .slice(0, 3);

//   // Get guide component (if it exists)
//   const GuideComponent = article.component ? guideComponents[article.component] : null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo 
//                 size={window.innerWidth < 640 ? 32 : 40} 
//                 showText={true} 
//               />
//             </div>
            
//             <div className="flex items-center gap-2 sm:gap-3">
//               <button
//                 onClick={() => navigate('/help')}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
//               >
//                 ← Help Center
//               </button>
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Breadcrumb Navigation */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <button onClick={() => navigate('/help')} className="hover:text-gray-900">
//               Help Center
//             </button>
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//             <button onClick={() => navigate(`/help/category/${category.id}`)} className="hover:text-gray-900">
//               {category.name}
//             </button>
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//             <span className="text-gray-900 font-medium">{article.title}</span>
//           </div>
//         </div>
//       </div>

//       {/* Article Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
//         {/* Guide Component or Placeholder */}
//         <Suspense fallback={<LoadingSpinner />}>
//           {GuideComponent ? (
//             <GuideComponent />
//           ) : (
//             <ArticlePlaceholder article={article} />
//           )}
//         </Suspense>

//         {/* Related Articles */}
//         {relatedArticles.length > 0 && (
//           <section className="mt-16">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {relatedArticles.map((relatedArticle) => (
//                 <div
//                   key={relatedArticle.id}
//                   onClick={() => navigate(`/help/article/${relatedArticle.slug}`)}
//                   className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
//                 >
//                   <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">
//                     {relatedArticle.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                     {relatedArticle.excerpt}
//                   </p>
//                   <div className="flex items-center gap-2 text-xs text-gray-500">
//                     <span>{relatedArticle.readTime}</span>
//                     <span>•</span>
//                     <span>{formatViews(relatedArticle.views)} views</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Help CTA */}
//         <section className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">
//             Was this article helpful?
//           </h2>
//           <p className="text-gray-600 mb-6">
//             If you still have questions, our support team is here to help
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => navigate('/contact')}
//               className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//             >
//               Contact Support
//             </button>
//             <button
//               onClick={() => navigate('/help')}
//               className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50"
//             >
//               Browse More Articles
//             </button>
//           </div>
//         </section>

//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
//               <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
//             </div>
//             <div className="flex gap-6 text-sm text-gray-400">
//               <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
//               <button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button>
//               <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ArticleDetail;
