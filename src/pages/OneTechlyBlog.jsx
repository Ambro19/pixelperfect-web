// ========================================
// ONETECHLY BLOG - "UNDER UPDATE" PAGE
// ========================================
// File: frontend/src/pages/OneTechlyBlog.jsx
// Author: OneTechly
// Purpose: Placeholder for the OneTechly Blog while it is being reworked
// Updated: November 2026
//
// The OneTechly Blog is being refocused on building SaaS products, application
// architecture, and design decisions. Until the new articles are published,
// the footer link "OneTechly Blog" (Marketing.jsx) lands here instead of the
// old Blogspot posts.
//
// Route: /onetechly-blog  (register it in App.js next to the other pages)
// SEO:   adds <meta name="robots" content="noindex"> while mounted, so search
//        engines do not index a placeholder page. Removed again on unmount.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const UPCOMING_TOPICS = [
  { icon: '🚀', title: 'Building SaaS Products',  desc: 'From first commit to paying customers: billing, auth, usage limits, and running in production.' },
  { icon: '🏗️', title: 'Application Architecture', desc: 'How real systems are structured, what breaks under load, and how to design for it.' },
  { icon: '⚖️', title: 'Design Decisions',          desc: 'The trade-offs behind the choices: what we picked, what we rejected, and why.' },
];

export default function OneTechlyBlog() {
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'OneTechly Blog — Being Updated | PixelPerfect';

    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 36 : 48} showText={true} />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => navigate('/login')} className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Sign in</button>
              <button onClick={() => navigate('/register')} className="px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" aria-hidden="true"></span>
            Being updated
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-5">
            The OneTechly Blog is getting a new focus
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-3">
            We're reworking the blog around what we do every day: building and running SaaS
            products. New articles are on the way.
          </p>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mb-10 sm:mb-12">
            Thank you for your patience. Please check back soon.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left mb-10 sm:mb-12">
            {UPCOMING_TOPICS.map((topic) => (
              <div key={topic.title} className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="text-2xl mb-3" aria-hidden="true">{topic.icon}</div>
                <h2 className="text-base font-semibold text-gray-900 mb-1.5">{topic.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button onClick={() => navigate('/')} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              ← Back to PixelPerfect
            </button>
            <button onClick={() => navigate('/blog')} className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
              Read the PixelPerfect Blog
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div>© 2026 OneTechly, LLC. All rights reserved.</div>
          <div className="flex gap-4 sm:gap-6">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

//============== END OF OneTechlyBlog.jsx =============