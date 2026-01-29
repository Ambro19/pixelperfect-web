// ========================================
// BLOG LIST PAGE - PIXELPERFECT
// ========================================
// Main blog page showing all articles
// Mobile-responsive, production-ready

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import { getAllPosts } from '../data/blogData';

const BlogList = () => {
  const navigate = useNavigate();
  const blogPosts = getAllPosts();

  // Category colors
  const categoryColors = {
    'Monitoring': 'bg-purple-100 text-purple-800',
    'Tutorial': 'bg-blue-100 text-blue-800',
    'Guide': 'bg-green-100 text-green-800',
    'News': 'bg-yellow-100 text-yellow-800'
  };

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
              <button onClick={() => navigate('/features')} className="text-gray-600 hover:text-gray-900 font-medium">
                Features
              </button>
              <button onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </button>
              <button onClick={() => navigate('/docs')} className="text-gray-600 hover:text-gray-900 font-medium">
                Documentation
              </button>
              <button onClick={() => navigate('/blog')} className="text-blue-600 font-semibold">
                Blog
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
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            PixelPerfect Blog
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to our central hub for all digital content, announcements, and key developments. 
            Explore the full spectrum of our expert insights, industry analysis, and community updates.
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 h-48 flex items-center justify-center relative">
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
                    {post.category}
                  </span>
                </div>
                
                {/* Illustration Placeholder */}
                <div className="text-white text-6xl">
                  {post.category === 'Monitoring' && '📊'}
                  {post.category === 'Tutorial' && '💻'}
                  {post.category === 'Guide' && '📖'}
                  {post.category === 'News' && '📰'}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">{post.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State (if no posts) */}
        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600">Check back soon for updates!</p>
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="bg-blue-600 py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-6 text-sm sm:text-base">
            Join thousands of developers using PixelPerfect to capture perfect screenshots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-white">About</button></li>
                <li><button onClick={() => navigate('/careers')} className="hover:text-white">Careers</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white">Blog</button></li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/features')} className="hover:text-white">Features</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-white">Pricing</button></li>
                <li><button onClick={() => navigate('/api')} className="hover:text-white">API</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/docs')} className="hover:text-white">Documentation</button></li>
                <li><button onClick={() => navigate('/guides')} className="hover:text-white">Guides</button></li>
                <li><button onClick={() => navigate('/api-status')} className="hover:text-white">API Status</button></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/help')} className="hover:text-white">Help Center</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white">Contact</button></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-white">FAQ</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
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

export default BlogList;