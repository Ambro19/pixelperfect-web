// ========================================
// CATEGORY VIEW PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/CategoryView.js
// Author: OneTechly
// Update: April 2026
//
// Shows all articles in a specific category
// Production-ready, mobile-responsive
// ========================================

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import {
  getCategoryById,
  getArticlesByCategory,
  formatViews
} from '../data/helpArticles';

const CategoryView = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  
  // Get category data
  const category = getCategoryById(categoryId);
  const articles = getArticlesByCategory(categoryId);
  
  // 404 if category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">📂</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-6">
            This category doesn't exist or has been removed.
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
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600">
            {category.description}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </p>
        </div>
      </section>

      {/* Articles List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600 mb-6">
              We're working on adding more content to this category
            </p>
            <button
              onClick={() => navigate('/help')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Browse Other Categories
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/help/article/${article.slug}`)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{formatViews(article.views)} views</span>
                      {article.popular && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium text-xs">
                            Popular
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help CTA */}
        <section className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need more help?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Try searching or contact support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/help')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Search Help Center
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            >
              Contact Support
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

export default CategoryView;