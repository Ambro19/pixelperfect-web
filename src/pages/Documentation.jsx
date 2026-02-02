// ========================================
// DOCUMENTATION PAGE - FULLY MOBILE RESPONSIVE
// ========================================
// File: frontend/src/pages/Documentation.jsx
// Author: OneTechly
// Purpose: Mobile-first API documentation
// ✅ FIXED: Corrected URL from cdn.pixelperfect.com to cdn.pixelperfectapi.net
// Updated: January 2026 - FIXED API ENDPOINTS WITH EXACT CODE EXAMPLES STYLING

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

export default function Documentation() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking a link (mobile)
  const handleNavClick = (hash) => {
    setSidebarOpen(false);
    window.location.hash = hash;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Mobile: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              {/* Hamburger Menu (Mobile Only) */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Logo - Responsive sizing */}
              <div className="cursor-pointer" onClick={() => navigate('/')}>
                <PixelPerfectLogo 
                  size={window.innerWidth < 640 ? 32 : 40} 
                  showText={true} 
                />
              </div>
            </div>

            {/* Navigation Buttons - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Dashboard
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex gap-4 lg:gap-8 relative">
          {/* Sidebar - Mobile: Slide-in overlay, Desktop: Fixed */}
          <aside 
            className={`
              fixed lg:static inset-y-0 left-0 z-40
              w-64 lg:w-64 flex-shrink-0
              bg-white lg:bg-transparent
              border-r lg:border-0 border-gray-200
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              overflow-y-auto
              pt-20 lg:pt-0
              pb-6 lg:pb-0
            `}
          >
            <nav className="space-y-1 px-4 lg:px-0">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                API Docs
              </div>
              <a 
                href="#getting-started" 
                onClick={() => handleNavClick('#getting-started')}
                className="block px-3 py-2.5 text-blue-600 bg-blue-50 rounded-lg font-medium text-sm"
              >
                Getting Started
              </a>
              <a 
                href="#authentication"
                onClick={() => handleNavClick('#authentication')}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                Authentication
              </a>
              <a 
                href="#endpoints"
                onClick={() => handleNavClick('#endpoints')}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                API Endpoints
              </a>
              <a 
                href="#examples"
                onClick={() => handleNavClick('#examples')}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                Code Examples
              </a>
              <a 
                href="#errors"
                onClick={() => handleNavClick('#errors')}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                Error Codes
              </a>

              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">
                Resources
              </div>
              <button
                onClick={() => { navigate('/pricing'); setSidebarOpen(false); }}
                className="block w-full text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                Pricing
              </button>
              <button
                onClick={() => { navigate('/api-status'); setSidebarOpen(false); }}
                className="block w-full text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                API Status
              </button>
              <a 
                href="#support"
                onClick={() => handleNavClick('#support')}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                Support
              </a>
            </nav>
          </aside>

          {/* Main Content - Mobile Optimized */}
          <main className="flex-1 min-w-0">
            {/* Getting Started Section */}
            <div id="getting-started" className="mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Getting Started
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                Welcome to the PixelPerfect API documentation. Get started capturing 
                pixel-perfect screenshots in minutes.
              </p>

              {/* Quick Start Section - Mobile Optimized */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Quick Start
                </h2>
                
                {/* Step 1 */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    1. Get Your API Key
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    Sign up for a free account and grab your API key from the dashboard.
                  </p>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Get API Key
                  </button>
                </div>

                {/* Step 2 - Code Block with Horizontal Scroll */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    2. Make your first request
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                    <pre className="text-xs sm:text-sm text-gray-100 whitespace-pre">
                      <code>{`curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "format": "png",
    "width": 1920,
    "height": 1080
  }'`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Success Box */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2 text-green-800">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <span className="font-semibold text-sm sm:text-base">Success!</span>
                    <p className="text-green-700 mt-1 text-sm">
                      You'll receive a JSON response with the screenshot URL. That's it!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Section */}
            <div id="authentication" className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Authentication
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                All API requests require authentication using a Bearer token. Include your 
                API key in the Authorization header:
              </p>
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4 mb-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm text-gray-100">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs sm:text-sm text-yellow-800">
                  <strong>⚠️ Keep your API key secure!</strong> Never expose it in 
                  client-side code or public repositories.
                </p>
              </div>
            </div>

            {/* API Endpoints Section - USING EXACT CODE EXAMPLES STYLING */}
            <div id="endpoints" className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                API Endpoints
              </h2>
              
              {/* Screenshot Endpoint */}
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded font-mono text-xs sm:text-sm font-semibold">
                    POST
                  </span>
                  <code className="text-sm sm:text-lg font-mono break-all text-gray-900">/v1/screenshot</code>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  Capture a screenshot of any website.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  Request Body:
                </h4>
                {/* ✅ EXACT STYLING FROM CODE EXAMPLES SECTION */}
                <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto mb-4">
                  <pre className="text-xs sm:text-sm text-gray-100">
{`{
  "url": "https://example.com",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "full_page": false,
  "dark_mode": false
}`}
                  </pre>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  Response:
                </h4>
                {/* ✅ FIXED: Changed URL from cdn.pixelperfect.com to cdn.pixelperfectapi.net */}
                <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-gray-100">
{`{
  "screenshot_id": "abc123",
  "screenshot_url": "https://cdn.pixelperfectapi.net/abc123.png",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "size_bytes": 245678,
  "created_at": "2026-01-07T12:00:00Z"
}`}
                  </pre>
                </div>
              </div>

              {/* Batch Endpoint */}
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded font-mono text-xs sm:text-sm font-semibold">
                    POST
                  </span>
                  <code className="text-sm sm:text-lg font-mono break-all text-gray-900">/v1/batch/submit</code>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  Capture multiple screenshots in one request (Pro+ only).
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  Request Body:
                </h4>
                {/* ✅ EXACT STYLING FROM CODE EXAMPLES SECTION */}
                <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-gray-100">
{`{
  "urls": [
    "https://example.com",
    "https://github.com",
    "https://google.com"
  ],
  "width": 1920,
  "height": 1080,
  "format": "png"
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Code Examples Section */}
            <div id="examples" className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Code Examples
              </h2>
              
              {/* JavaScript Example */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  JavaScript / Node.js
                </h3>
                <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-gray-100">
{`const axios = require('axios');

const screenshot = await axios.post(
  'https://api.pixelperfectapi.net/v1/screenshot',
  {
    url: 'https://example.com',
    width: 1920,
    height: 1080,
    format: 'png'
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

console.log(screenshot.data.screenshot_url);`}
                  </pre>
                </div>
              </div>

              {/* Python Example */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  Python
                </h3>
                <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-gray-100">
{`import requests

response = requests.post(
    'https://api.pixelperfectapi.net/v1/screenshot',
    json={
        'url': 'https://example.com',
        'width': 1920,
        'height': 1080,
        'format': 'png'
    },
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(data['screenshot_url'])`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Error Codes Section */}
            <div id="errors" className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Error Codes
              </h2>
              
              {/* Mobile: Card view, Desktop: Table */}
              <div className="hidden sm:block border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">400</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Bad Request - Invalid parameters</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">401</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Unauthorized - Invalid or missing API key</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">429</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Too Many Requests - Rate limit exceeded</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">500</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Internal Server Error - Something went wrong</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3">
                {[
                  { code: '400', desc: 'Bad Request - Invalid parameters' },
                  { code: '401', desc: 'Unauthorized - Invalid or missing API key' },
                  { code: '429', desc: 'Too Many Requests - Rate limit exceeded' },
                  { code: '500', desc: 'Internal Server Error - Something went wrong' }
                ].map((error) => (
                  <div key={error.code} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="font-mono text-sm font-semibold text-gray-900 mb-1">
                      {error.code}
                    </div>
                    <div className="text-sm text-gray-700">
                      {error.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <PixelPerfectLogo size={28} showText={true} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Need help?{' '}
              <a 
                href="mailto:support@pixelperfectapi.net" 
                className="text-blue-600 hover:text-blue-700"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


