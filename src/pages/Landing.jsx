// ========================================
// LANDING PAGE - FULLY MOBILE RESPONSIVE
// ========================================
// File: frontend/src/pages/Landing.jsx
// Author: OneTechly
// Purpose: Mobile-first landing page
// Updated: January 2026 - MOBILE OPTIMIZED

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile Optimized */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo - Responsive sizing */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo 
                size={window.innerWidth < 640 ? 36 : 48} 
                showText={true} 
              />
            </div>

            {/* Navigation - Hidden on mobile, shown on tablet+ */}
            <nav className="hidden md:flex items-center gap-6">
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
                Docs
              </button>
            </nav>

            {/* Auth Buttons - Mobile Optimized */}
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

      {/* Hero Section - Mobile First */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            {/* Large Logo - Responsive sizing */}
            <div className="mb-6 sm:mb-8 flex justify-center">
              <PixelPerfectLogo 
                size={window.innerWidth < 640 ? 64 : window.innerWidth < 768 ? 72 : 80} 
                showText={true} 
              />
            </div>

            {/* Headline - Mobile Optimized Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Pixel-Perfect Screenshots,
              <br />
              <span className="text-blue-600">Every Time</span>
            </h1>

            {/* Subheadline - Responsive text size */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Lightning-fast screenshot API for developers. 
              Capture any website with full customization in under 3 seconds.
            </p>

            {/* CTA Buttons - Mobile Stacked, Desktop Side-by-side */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </button>
              <button 
                onClick={() => navigate('/docs')}
                className="w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all"
              >
                View Documentation
              </button>
            </div>

            {/* Feature Pills - Responsive Grid */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm mt-6 sm:mt-8 px-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">100 free screenshots/month</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Cancel anytime</span>
              </div>
            </div>

            {/* Screenshot Example - Mobile Responsive */}
            <div className="mt-10 sm:mt-12 md:mt-16 max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-lg shadow-2xl p-1.5 sm:p-2 border border-gray-200">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-t">
                  <div className="flex gap-1 sm:gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center text-xs sm:text-sm text-gray-600 font-mono truncate px-2">
                    https://pixelperfectapi.net/screenshot?url=example.com
                  </div>
                </div>
                {/* Preview Area */}
                <div className="bg-gray-50 p-6 sm:p-8 md:p-12 rounded-b text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 italic text-sm sm:text-base">
                    [Screenshot preview would be displayed here]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Everything you need to capture perfect screenshots
            </p>
          </div>

          {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Capture screenshots in under 3 seconds. Powered by optimized cloud infrastructure.', color: 'blue' },
              { icon: '🎨', title: 'Full Customization', desc: 'Control viewport size, format (PNG, JPEG, WebP, PDF), full-page capture, and more.', color: 'green' },
              { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade security with 99.9% uptime SLA. Your data is always protected.', color: 'purple' },
              { icon: '📱', title: 'Mobile Screenshots', desc: 'Capture mobile viewports with device emulation for perfect responsive testing.', color: 'yellow' },
              { icon: '⚙️', title: 'Batch Processing', desc: 'Capture multiple screenshots at once with our batch API (Pro plan and above).', color: 'red' },
              { icon: '🌙', title: 'Dark Mode Support', desc: 'Capture screenshots with dark mode enabled for better testing coverage.', color: 'indigo' },
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

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-4">
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

      {/* Footer - Mobile Optimized */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              {/* Logo and Copyright */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <PixelPerfectLogo size={28} showText={true} textColor="text-white" />
                <div className="text-xs text-gray-400">© 2026 PixelPerfect. All rights reserved.</div>
              </div>

              {/* Legal Links - Mobile: Full width, Desktop: Inline */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <button 
                  onClick={() => navigate('/privacy')} 
                  className="hover:text-white transition-colors p-2"
                >
                  Privacy
                </button>
                <button 
                  onClick={() => navigate('/terms')} 
                  className="hover:text-white transition-colors p-2"
                >
                  Terms
                </button>
                <button 
                  onClick={() => navigate('/docs')} 
                  className="hover:text-white transition-colors p-2"
                >
                  Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

//////////////////////////////////////////////////////////////
// // frontend/src/pages/Landing.jsx
// import React from 'react';
// import { PixelPerfectLogo } from '../components/PixelPerfectLogos';
// import Header from '../components/Header';

// export default function Landing() {
//   return (
//     <>
//       <Header />
      
//       {/* Hero Section */}
//       <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
            
//             {/* Large Logo for Hero */}
//             <div className="mb-8 flex justify-center">
//               <PixelPerfectLogo size={80} showText={true} />
//             </div>

//             <h1 className="text-5xl font-bold text-gray-900 mb-6">
//               Pixel-Perfect Screenshots,
//               <br />
//               <span className="text-blue-600">Every Time</span>
//             </h1>

//             <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//               Lightning-fast screenshot API for developers. 
//               Capture any website with full customization in under 3 seconds.
//             </p>

//             <div className="flex justify-center gap-4">
//               <button className="bg-gradient-to-r from-blue-600 to-blue-800 
//                                 text-white px-8 py-4 rounded-lg text-lg font-semibold 
//                                 hover:from-blue-700 hover:to-blue-900 transition-all 
//                                 shadow-lg hover:shadow-xl">
//                 Get Started Free
//               </button>
//               <button className="bg-white text-blue-600 px-8 py-4 rounded-lg 
//                                 text-lg font-semibold border-2 border-blue-600 
//                                 hover:bg-blue-50 transition-all">
//                 View Documentation
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features, etc. */}
//     </>
//   );
// }