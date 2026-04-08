// ========================================
// ARTICLE DETAIL PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/ArticleDetail.js
// Author: OneTechly
// Update: April 2026
//
// Individual help article page
// Dynamically loads guide components
// Includes breadcrumb navigation and related articles
// Production-ready, mobile-responsive
// ========================================

import React, { lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import {
  getArticleBySlug,
  getCategoryById,
  getArticlesByCategory,
  formatViews
} from '../data/helpArticles';

// ========================================
// DYNAMIC GUIDE IMPORTS
// ========================================
// Update: April 2026
// Dynamically import guide components based on article metadata
// Add new guides here as they are created

const guideComponents = {
  QuickStartGuide: lazy(() => import('../guides/QuickStartGuide')),
  APIProcessingGuide: lazy(() => import('../guides/APIProcessingGuide')),
  ErrorsAndSolutionsGuide: lazy(() => import('../guides/ErrorsAndSolutionsGuide')),
  JavaScriptExecutionGuide: lazy(() => import('../guides/JavaScriptExecutionGuide')),
  OptimizationGuide: lazy(() => import('../guides/OptimizationGuide')),
  PythonIntegrationGuide: lazy(() => import('../guides/PythonIntegrationGuide')),
  NodeIntegrationGuide: lazy(() => import('../guides/NodeIntegrationGuide')),
  SocialMediaPreviewGuide: lazy(() => import('../guides/SocialMediaPreviewGuide')),
  WebsiteMonitorGuide: lazy(() => import('../guides/WebsiteMonitorGuide')),
};

// ========================================
// LOADING COMPONENT
// ========================================
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading article...</p>
    </div>
  </div>
);

// ========================================
// PLACEHOLDER COMPONENT (for articles without guides yet)
// ========================================
const ArticlePlaceholder = ({ article }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12">
    <div className="max-w-3xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{article.readTime}</span>
          <span>•</span>
          <span>{formatViews(article.views)} views</span>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="prose max-w-none">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Guide Coming Soon</h3>
              <p className="text-gray-700">
                We're working on this detailed guide. In the meantime, check out our related articles below or contact support for assistance.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Right Away?</h2>
        <ul className="space-y-3">
          <li>
            <a href="/contact" className="text-blue-600 hover:underline font-medium">
              Contact our support team
            </a>
            {' '}— We're here to help with any questions
          </li>
          <li>
            <a href="/docs" className="text-blue-600 hover:underline font-medium">
              View full API documentation
            </a>
            {' '}— Complete reference and examples
          </li>
          <li>
            <a href="/faq" className="text-blue-600 hover:underline font-medium">
              Check our FAQ
            </a>
            {' '}— Common questions and answers
          </li>
        </ul>
      </div>
    </div>
  </div>
);

// ========================================
// MAIN COMPONENT
// ========================================
const ArticleDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  
  // Get article data
  const article = getArticleBySlug(slug);
  
  // 404 if article not found
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">
            This help article doesn't exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/help')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ← Back to Help Center
          </button>
        </div>
      </div>
    );
  }

  // Get category and related articles
  const category = getCategoryById(article.category);
  const relatedArticles = getArticlesByCategory(article.category)
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  // Get guide component (if it exists)
  const GuideComponent = article.component ? guideComponents[article.component] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo 
                size={window.innerWidth < 640 ? 32 : 40} 
                showText={true} 
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/help')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                ← Help Center
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/help')} className="hover:text-gray-900">
              Help Center
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button onClick={() => navigate(`/help/category/${category.id}`)} className="hover:text-gray-900">
              {category.name}
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{article.title}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Guide Component or Placeholder */}
        <Suspense fallback={<LoadingSpinner />}>
          {GuideComponent ? (
            <GuideComponent />
          ) : (
            <ArticlePlaceholder article={article} />
          )}
        </Suspense>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  onClick={() => navigate(`/help/article/${relatedArticle.slug}`)}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{relatedArticle.readTime}</span>
                    <span>•</span>
                    <span>{formatViews(relatedArticle.views)} views</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Help CTA */}
        <section className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Was this article helpful?
          </h2>
          <p className="text-gray-600 mb-6">
            If you still have questions, our support team is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/help')}
              className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            >
              Browse More Articles
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
              <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button>
              <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticleDetail;