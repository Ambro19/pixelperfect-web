// // ========================================
// MARKETING PAGE - FULLY WIRED WITH BLOG
// ========================================
// File: frontend/src/pages/Marketing.jsx
// Author: OneTechly
// Purpose: Fully responsive landing page
// Updated: March 2026

// ✅ FIXED: All footer links now properly wired with navigate()
// ✅ FIXED: Blog link now points to /blog route
// ✅ FIXED: Consistent styling (no more blue vs white links)
// ✅ FIXED: GitHub link updated to official repo: Ambro19/pixelperfect
// ✅ ADDED: "From the OneTechly Blog" section (moved from DashboardPage.js)
//           — now public-facing so visitors can discover blog posts before signup

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ============================================================================
// OneTechly blog posts — update URLs / titles / excerpts as new posts publish
// ============================================================================
const BLOG_POSTS = [
  {
    title: "Peer-to-Peer (P2P) Technology: Powering Decentralization Across Industries",
    excerpt:
      "Explore how P2P systems underpin everything from BitTorrent to blockchain, and why decentralized architectures are reshaping the web.",
    tag: "Architecture",
    tagColor: "bg-purple-100 text-purple-700",
    url: "https://onetechlyambr19.blogspot.com/2024/11/peer-to-peer-peer-to-peer-p2p.html",
    date: "Nov 02, 2024",
    icon: "🔗",
  },
  {
    title: "Implementing AdSense and Google Analytics: A Complete Guide to Website Monetization and Tracking",
    excerpt:
      "Understanding your audience and generating revenue are two pillars of a successful online presence. Learn how to integrate Google AdSense and GA4 into any web project.",
    tag: "Analytics",
    tagColor: "bg-orange-100 text-orange-700",
    url: "https://onetechlyambr19.blogspot.com/2025/12/blog-post_29.html",
    date: "Dec 29, 2025",
    icon: "📊",
  },
  {
    title: "Cross-Platform npm Scripts: Why Your Windows Commands Fail on macOS/Linux (and How to Fix Them)",
    excerpt:
      "npm scripts using Windows-style 'set VARIABLE=value &&' break on macOS and Linux. Discover how cross-env solves this and how to write truly cross-platform build scripts.",
    tag: "Node.js",
    tagColor: "bg-lime-100 text-lime-700",
    url: "https://onetechlyambr19.blogspot.com/2026/02/blog-post.html",
    date: "Feb 04, 2026",
    icon: "⚙️",
  },
];

export default function Marketing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* ================================================================
          Header / Navigation — Mobile Optimized
      ================================================================ */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo
                size={window.innerWidth < 640 ? 36 : 48}
                showText={true}
              />
            </div>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <button
                onClick={() => navigate('/features')}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Documentation
              </button>
              <button
                onClick={() => navigate('/api')}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                API
              </button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================
          Hero Section — Mobile First
      ================================================================ */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <PixelPerfectLogo
              size={window.innerWidth < 640 ? 64 : window.innerWidth < 768 ? 80 : 96}
              showText={false}
            />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Pixel-Perfect Screenshots,
            <br />
            <span className="text-blue-600">Every Single Time</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4">
            The fastest, most reliable screenshot API for developers. Capture any website with full
            customization in under 3 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start Free Trial →
            </button>
            <button
              onClick={() => navigate('/docs')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-base sm:text-lg font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              View Documentation 📄
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm px-4">
            {[
              'No credit card required',
              '100 free screenshots/month',
              'Cancel anytime',
            ].map((pill) => (
              <div key={pill} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{pill}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-1.5 sm:p-2 border border-gray-200">
              <div className="flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-t">
                <div className="flex gap-1 sm:gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-xs sm:text-sm text-gray-600 font-mono truncate">
                  pixelperfectapi.net/screenshot
                </div>
              </div>
              <div className="bg-gray-50 p-6 sm:p-8 rounded-b text-gray-500 italic text-sm sm:text-base">
                [Screenshot preview would be displayed here]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Features Section — Mobile Grid
      ================================================================ */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Powerful Features</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Everything you need to capture perfect screenshots</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '⚡', title: 'Lightning Fast',       desc: 'Capture screenshots in under 3 seconds. Powered by optimized cloud infrastructure.',               color: 'blue'   },
              { icon: '🎨', title: 'Full Customization',   desc: 'Control viewport size, format (PNG, JPEG, WebP, PDF), full-page capture, and more.',               color: 'green'  },
              { icon: '🔒', title: 'Secure & Reliable',    desc: 'Enterprise-grade security with 99.9% uptime SLA. Your data is always protected.',                  color: 'purple' },
              { icon: '📱', title: 'Mobile Screenshots',   desc: 'Capture mobile viewports with device emulation for perfect responsive testing.',                    color: 'yellow' },
              { icon: '⚙️', title: 'Batch Processing',     desc: 'Capture multiple screenshots at once with our batch API (Pro plan and above).',                     color: 'red'    },
              { icon: '🌙', title: 'Dark Mode Support',    desc: 'Capture screenshots with dark mode enabled for better testing coverage.',                           color: 'indigo' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                  <span className="text-xl sm:text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA Section
      ================================================================ */}
      <section className="py-12 sm:py-16 md:py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
            Join thousands of developers using PixelPerfect to capture perfect screenshots.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-base sm:text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-blue-800 transition-colors border-2 border-white"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================
          ✅ NEW: From the OneTechly Blog
          Moved here from DashboardPage.js so all visitors — not just
          logged-in users — can discover articles before they sign up.
          Cards link externally to Blogspot; "Visit Blog" routes internally.
      ================================================================ */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                ✍️ From the OneTechly Blog
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Developer insights, guides, and real-world engineering articles
              </p>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              Visit Blog
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col border border-gray-200 rounded-xl p-5 hover:border-blue-400
                           hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${post.tagColor}`}>
                    {post.tag}
                  </span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl flex-shrink-0">{post.icon}</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed flex-1 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-1 mt-auto">
                  Read article
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            ))}
          </div>

          {/* Mobile "Visit Blog" button */}
          <div className="mt-6 sm:hidden">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Visit Blog
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================
          Footer — Mobile Optimized — ✅ ALL LINKS WIRED
      ================================================================ */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About</button>
                </li>
                <li>
                  <button onClick={() => navigate('/careers')} className="hover:text-white transition-colors">Careers</button>
                </li>
                <li>
                  <button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">PixelPerfect Blog</button>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => navigate('/features')} className="hover:text-white transition-colors">Features</button>
                </li>
                <li>
                  <button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">Pricing</button>
                </li>
                <li>
                  <button onClick={() => navigate('/api')} className="hover:text-white transition-colors">API</button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors">Documentation</button>
                </li>
                <li>
                  <button onClick={() => navigate('/guides')} className="hover:text-white transition-colors">Guides</button>
                </li>
                <li>
                  <button onClick={() => navigate('/api-status')} className="hover:text-white transition-colors">API Status</button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => navigate('/help')} className="hover:text-white transition-colors">Help Center</button>
                </li>
                <li>
                  <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button>
                </li>
                <li>
                  <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">FAQ</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center md:items-start gap-2">
                <PixelPerfectLogo size={28} showText={true} textColor="text-white" />
                <div className="text-xs text-gray-400">© 2026 All rights reserved</div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-5 sm:gap-6">
                <a href="https://twitter.com/pixelperfect" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2" aria-label="Twitter">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/pixelperfect" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2" aria-label="LinkedIn">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com/Ambro19/pixelperfect" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2" aria-label="GitHub">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors p-2">Privacy</button>
                <button onClick={() => navigate('/terms')}   className="hover:text-white transition-colors p-2">Terms</button>
                <button onClick={() => navigate('/cookies')} className="hover:text-white transition-colors p-2">Cookies</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

