// ========================================
// ABOUT PAGE - PIXELPERFECT
// ========================================
// Professional about page for PixelPerfect Screenshot API
// Production-ready, mobile-responsive

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo 
                size={window.innerWidth < 640 ? 32 : 40} 
                showText={true} 
              />
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/features')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Features
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Documentation
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About PixelPerfect</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Building the most reliable screenshot API for developers worldwide
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
          
          {/* Our Story */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PixelPerfect Screenshot API was born out of frustration with existing screenshot solutions 
              that were either unreliable, too expensive, or lacked the features developers actually needed. 
              Founded in 2025 by OneTechly, we set out to build the screenshot API we wished existed.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              What started as a side project to solve our own needs quickly grew into a full-featured 
              service trusted by thousands of developers and businesses worldwide. Today, PixelPerfect 
              processes millions of screenshots monthly, powering everything from automated testing 
              pipelines to marketing automation and competitive intelligence platforms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We're proud to be a developer-first company, building tools that we ourselves use daily. 
              Every feature we ship is designed with real developer needs in mind, backed by our 
              commitment to reliability, performance, and excellent documentation.
            </p>
          </section>

          {/* Our Mission */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our mission is simple: make website screenshot capture fast, reliable, and accessible to 
              every developer. We believe that capturing pixel-perfect screenshots shouldn't require 
              managing complex infrastructure, dealing with browser quirks, or paying enterprise prices.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 sm:p-6 rounded-r-lg">
              <p className="text-gray-800 font-medium text-lg">
                "We're building the screenshot API that just works, every single time."
              </p>
              <p className="text-gray-600 mt-2">— OneTechly Team</p>
            </div>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PixelPerfect provides a powerful, easy-to-use REST API for capturing screenshots of any 
              website. Our service handles all the complexity of browser automation, rendering engines, 
              and infrastructure management, so you can focus on building your product.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-700">
                  Capture screenshots in under 3 seconds with our optimized infrastructure
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Pixel Perfect</h3>
                <p className="text-sm text-gray-700">
                  Every screenshot is rendered with precision, matching your exact specifications
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-sm text-gray-700">
                  Enterprise-grade security with 99.9% uptime SLA
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-semibold text-gray-900 mb-2">Developer First</h3>
                <p className="text-sm text-gray-700">
                  Clear documentation, helpful support, and tools built for developers
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Values</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Developer Experience First</h3>
                <p className="text-gray-700 leading-relaxed">
                  We obsess over making PixelPerfect easy to integrate and use. From our comprehensive 
                  documentation to our intuitive API design, everything is built with developers in mind.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability Above All</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your applications depend on us, so we've built our infrastructure for maximum uptime 
                  and consistency. We maintain a 99.9% SLA and continuously monitor our service to 
                  catch issues before they impact you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
                <p className="text-gray-700 leading-relaxed">
                  No hidden fees, no surprise charges. Our pricing is straightforward and scales with 
                  your needs. You always know exactly what you're paying for.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuous Innovation</h3>
                <p className="text-gray-700 leading-relaxed">
                  We're constantly improving PixelPerfect based on user feedback and emerging needs. 
                  New features, performance improvements, and enhanced capabilities are shipped regularly.
                </p>
              </div>
            </div>
          </section>

          {/* By The Numbers */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">By The Numbers</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">50M+</div>
                <div className="text-sm sm:text-base text-gray-600">Screenshots Captured</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-sm sm:text-base text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-sm sm:text-base text-gray-600">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">&lt;3s</div>
                <div className="text-sm sm:text-base text-gray-600">Average Response</div>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Technology</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PixelPerfect is built on modern, proven technologies that ensure speed, reliability, 
              and scalability:
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">Headless Chrome:</span>
                  <span className="text-gray-700"> Powered by Playwright for the most accurate web rendering</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">Cloud Infrastructure:</span>
                  <span className="text-gray-700"> Distributed across multiple regions for low latency worldwide</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">CDN Delivery:</span>
                  <span className="text-gray-700"> Screenshots delivered via global CDN for maximum speed</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">RESTful API:</span>
                  <span className="text-gray-700"> Simple, intuitive API design following industry best practices</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">Security First:</span>
                  <span className="text-gray-700"> End-to-end encryption, SOC 2 compliant infrastructure</span>
                </div>
              </li>
            </ul>
          </section>

          {/* Contact CTA */}
          <section className="border-t border-gray-200 pt-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 sm:p-8 text-white text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Join Thousands of Developers</h2>
              <p className="text-blue-100 mb-6 text-sm sm:text-base">
                Start capturing pixel-perfect screenshots today with our free tier
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 sm:px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
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

export default About;