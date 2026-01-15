// ========================================
// HELP CENTER PAGE - PIXELPERFECT
// ========================================
// Comprehensive help center with searchable articles
// Production-ready, mobile-responsive

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 1,
      name: 'Getting Started',
      icon: '🚀',
      articles: [
        'How to create an account',
        'Getting your API key',
        'Making your first API request',
        'Understanding pricing plans'
      ]
    },
    {
      id: 2,
      name: 'API Usage',
      icon: '💻',
      articles: [
        'API authentication methods',
        'Screenshot parameters explained',
        'Batch processing guide',
        'Rate limits and quotas'
      ]
    },
    {
      id: 3,
      name: 'Billing & Subscription',
      icon: '💳',
      articles: [
        'How to upgrade your plan',
        'Managing payment methods',
        'Understanding your invoice',
        'Cancellation and refunds'
      ]
    },
    {
      id: 4,
      name: 'Troubleshooting',
      icon: '🔧',
      articles: [
        'Common error codes',
        'Screenshot quality issues',
        'API timeout errors',
        'Webhook delivery failures'
      ]
    },
    {
      id: 5,
      name: 'Security & Privacy',
      icon: '🔒',
      articles: [
        'Data retention policy',
        'API key security best practices',
        'GDPR compliance',
        'SOC 2 certification'
      ]
    },
    {
      id: 6,
      name: 'Account Management',
      icon: '👤',
      articles: [
        'Updating account details',
        'Team member management',
        'Password reset',
        'Two-factor authentication'
      ]
    }
  ];

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
            
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/docs')} className="text-gray-600 hover:text-gray-900 font-medium">
                Documentation
              </button>
              <button onClick={() => navigate('/guides')} className="text-gray-600 hover:text-gray-900 font-medium">
                Guides
              </button>
              <button onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
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

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            Search our knowledge base or browse categories below
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="w-full px-6 py-4 pr-12 rounded-lg text-lg border-2 border-transparent focus:border-blue-300 focus:ring-4 focus:ring-blue-200 transition-all"
            />
            <svg 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article, idx) => (
                    <li key={idx}>
                      <button 
                        className="text-sm text-gray-600 hover:text-blue-600 text-left transition-colors"
                        onClick={() => navigate(`/help/article/${category.id}-${idx}`)}
                      >
                        • {article}
                      </button>
                    </li>
                  ))}
                </ul>
                <button 
                  className="mt-4 text-blue-600 font-medium text-sm hover:underline"
                  onClick={() => navigate(`/help/category/${category.id}`)}
                >
                  View all articles →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Articles
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
            {[
              { title: 'How to get started with PixelPerfect API', views: '12.5K' },
              { title: 'Understanding screenshot parameters', views: '8.3K' },
              { title: 'Batch processing best practices', views: '6.7K' },
              { title: 'Troubleshooting common errors', views: '5.9K' },
              { title: 'API authentication guide', views: '4.2K' }
            ].map((article, idx) => (
              <div 
                key={idx}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/help/article/${idx}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{article.title}</h3>
                  <span className="text-sm text-gray-500">{article.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Complete API reference and technical guides</p>
            <button
              onClick={() => navigate('/docs')}
              className="text-blue-600 font-semibold hover:underline"
            >
              View Documentation →
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 mb-4">Connect with other developers</p>
            <button
              onClick={() => window.open('https://community.pixelperfectapi.net', '_blank')}
              className="text-green-600 font-semibold hover:underline"
            >
              Join Community →
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">API Status</h3>
            <p className="text-gray-600 mb-4">Real-time system status and uptime</p>
            <button
              onClick={() => navigate('/status')}
              className="text-purple-600 font-semibold hover:underline"
            >
              Check Status →
            </button>
          </div>
        </section>

        {/* Contact Support CTA */}
        <section className="bg-blue-50 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Still need help?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our support team is ready to assist you with any questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/faq')}
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            >
              View FAQ
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

export default HelpCenter;