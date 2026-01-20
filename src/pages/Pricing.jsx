// ========================================
// PRICING PAGE - PIXELPERFECT
// ========================================
// Comprehensive pricing page with perfect card alignment
// Production-ready, mobile-responsive

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual

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
                onClick={() => navigate('/about')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                About
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core features. 
            Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Billing Toggle - FIXED */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className={`relative w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ease-in-out ${
              billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
            Annual
          </span>
          {billingCycle === 'annual' && (
            <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Save 20%
            </span>
          )}
        </div>

        {/* Pricing Cards - Using grid with equal heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Free Plan - Current Plan Badge */}
          <div className="bg-white rounded-xl border-2 border-green-500 shadow-lg relative flex flex-col">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-green-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
                CURRENT PLAN
              </span>
            </div>
            <div className="p-6 pt-10 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Free</h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">100 screenshots per month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">All formats (PNG, JPEG, WebP, PDF)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Standard viewport sizes</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Basic screenshot options</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>

              <button
                disabled
                className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed mt-auto"
              >
                ✓ Current Plan
              </button>
            </div>
          </div>

          {/* Pro Plan - Most Popular */}
          <div className="bg-white rounded-xl border-2 border-blue-500 shadow-lg relative flex flex-col">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-blue-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
                MOST POPULAR
              </span>
            </div>
            <div className="p-6 pt-10 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Pro</h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? '49' : '39'}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">5,000 screenshots per month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">All formats + faster processing</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Custom viewport dimensions</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Full-page screenshots</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Priority support (&lt;4h weekdays)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Batch processing (up to 50 URLs)</span>
                </li>
              </ul>

              <button
                onClick={() => navigate('/register?plan=pro')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-auto"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Business</h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? '199' : '159'}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">50,000 screenshots per month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">All Pro features</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Advanced screenshot options</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Dark mode screenshots</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Element removal (CSS selectors)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Priority support (&lt;2h weekdays)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Batch processing (up to 100 URLs)</span>
                </li>
              </ul>

              <button
                onClick={() => navigate('/register?plan=business')}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors mt-auto"
              >
                Upgrade to Business
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Premium</h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? '499' : '399'}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Unlimited screenshots</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">All Business features</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">API access with webhooks</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Custom integrations (S3, Slack, SSO)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Dedicated support (&lt;1h 24/7)</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Unlimited batch processing</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">White-label options</span>
                </li>
              </ul>

              <button
                onClick={() => navigate('/register?plan=premium')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-auto"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        {/* Payment Security Notice */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-700 font-medium">
              Secure payments processed by Stripe • Cancel anytime • No hidden fees
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any charges or credits.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I exceed my limit?</h3>
              <p className="text-gray-600">
                We'll send you an email notification when you reach 80% of your monthly quota. If you 
                exceed your limit, additional screenshots will be charged at $0.02 per screenshot, or 
                you can upgrade to a higher plan.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Our Free plan includes 100 screenshots per month forever - no credit card required. 
                You can upgrade to a paid plan anytime to access advanced features and higher limits.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, 
                contact us within 30 days for a full refund.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express) via Stripe. 
                Enterprise customers can also pay via invoice.
              </p>
            </div>
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need a Custom Plan?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            For enterprise needs with custom integrations, dedicated support, and tailored solutions, 
            contact our sales team.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
          >
            Contact Sales
          </button>
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

export default Pricing;

////////////////////////////////////////////////////////////
// // ========================================
// // PRICING PAGE - PIXELPERFECT
// // ========================================
// // Comprehensive pricing page with perfect card alignment
// // Production-ready, mobile-responsive

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// const Pricing = () => {
//   const navigate = useNavigate();
//   const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             {/* Logo */}
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo 
//                 size={window.innerWidth < 640 ? 32 : 40} 
//                 showText={true} 
//               />
//             </div>
            
//             {/* Navigation */}
//             <nav className="hidden md:flex items-center gap-6">
//               <button
//                 onClick={() => navigate('/features')}
//                 className="text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 Features
//               </button>
//               <button
//                 onClick={() => navigate('/about')}
//                 className="text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 About
//               </button>
//               <button
//                 onClick={() => navigate('/docs')}
//                 className="text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 Documentation
//               </button>
//             </nav>

//             {/* Auth Buttons */}
//             <div className="flex items-center gap-2 sm:gap-3">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//               >
//                 Sign in
//               </button>
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
//         {/* Page Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//             Choose the plan that fits your needs. All plans include our core features. 
//             Upgrade or downgrade anytime.
//           </p>
//         </div>

//         {/* Billing Toggle */}
//         <div className="flex justify-center items-center gap-4 mb-12">
//           <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
//             Monthly
//           </span>
//           <button
//             onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
//             className={`relative w-14 h-7 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-300'}`}
//           >
//             <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'transform translate-x-7' : ''}`} />
//           </button>
//           <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
//             Annual
//           </span>
//           {billingCycle === 'annual' && (
//             <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
//               Save 20%
//             </span>
//           )}
//         </div>

//         {/* Pricing Cards - Using grid with equal heights */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
//           {/* Free Plan - Current Plan Badge */}
//           <div className="bg-white rounded-xl border-2 border-green-500 shadow-lg relative flex flex-col">
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//               <span className="bg-green-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
//                 CURRENT PLAN
//               </span>
//             </div>
//             <div className="p-6 pt-10 flex flex-col flex-grow">
//               <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Free</h3>
//               <div className="text-center mb-6">
//                 <span className="text-4xl font-bold text-gray-900">$0</span>
//               </div>
              
//               <ul className="space-y-3 mb-8 flex-grow">
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">100 screenshots per month</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">All formats (PNG, JPEG, WebP, PDF)</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Standard viewport sizes</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Basic screenshot options</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Community support</span>
//                 </li>
//               </ul>

//               <button
//                 disabled
//                 className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed mt-auto"
//               >
//                 ✓ Current Plan
//               </button>
//             </div>
//           </div>

//           {/* Pro Plan - Most Popular */}
//           <div className="bg-white rounded-xl border-2 border-blue-500 shadow-lg relative flex flex-col">
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//               <span className="bg-blue-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
//                 MOST POPULAR
//               </span>
//             </div>
//             <div className="p-6 pt-10 flex flex-col flex-grow">
//               <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Pro</h3>
//               <div className="text-center mb-6">
//                 <span className="text-4xl font-bold text-gray-900">
//                   ${billingCycle === 'monthly' ? '49' : '39'}
//                 </span>
//                 <span className="text-gray-600">/month</span>
//               </div>
              
//               <ul className="space-y-3 mb-8 flex-grow">
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">5,000 screenshots per month</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">All formats + faster processing</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Custom viewport dimensions</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Full-page screenshots</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Priority support (&lt;4h weekdays)</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Batch processing (up to 50 URLs)</span>
//                 </li>
//               </ul>

//               <button
//                 onClick={() => navigate('/register?plan=pro')}
//                 className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-auto"
//               >
//                 Upgrade to Pro
//               </button>
//             </div>
//           </div>

//           {/* Business Plan */}
//           <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow flex flex-col">
//             <div className="p-6 flex flex-col flex-grow">
//               <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Business</h3>
//               <div className="text-center mb-6">
//                 <span className="text-4xl font-bold text-gray-900">
//                   ${billingCycle === 'monthly' ? '199' : '159'}
//                 </span>
//                 <span className="text-gray-600">/month</span>
//               </div>
              
//               <ul className="space-y-3 mb-8 flex-grow">
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">50,000 screenshots per month</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">All Pro features</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Advanced screenshot options</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Dark mode screenshots</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Element removal (CSS selectors)</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Priority support (&lt;2h weekdays)</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Batch processing (up to 100 URLs)</span>
//                 </li>
//               </ul>

//               <button
//                 onClick={() => navigate('/register?plan=business')}
//                 className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors mt-auto"
//               >
//                 Upgrade to Business
//               </button>
//             </div>
//           </div>

//           {/* Premium Plan */}
//           <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow flex flex-col">
//             <div className="p-6 flex flex-col flex-grow">
//               <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Premium</h3>
//               <div className="text-center mb-6">
//                 <span className="text-4xl font-bold text-gray-900">
//                   ${billingCycle === 'monthly' ? '499' : '399'}
//                 </span>
//                 <span className="text-gray-600">/month</span>
//               </div>
              
//               <ul className="space-y-3 mb-8 flex-grow">
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Unlimited screenshots</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">All Business features</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">API access with webhooks</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Custom integrations (S3, Slack, SSO)</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Dedicated support (&lt;1h 24/7)</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Unlimited batch processing</span>
//                 </li>
//                 <li className="flex items-start gap-2 text-sm">
//                   <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">White-label options</span>
//                 </li>
//               </ul>

//               <button
//                 onClick={() => navigate('/register?plan=premium')}
//                 className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-auto"
//               >
//                 Upgrade to Premium
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Payment Security Notice */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full">
//             <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span className="text-sm text-gray-700 font-medium">
//               Secure payments processed by Stripe • Cancel anytime • No hidden fees
//             </span>
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <section className="mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
//           <div className="max-w-3xl mx-auto space-y-6">
//             <div className="bg-white rounded-lg p-6 border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
//               <p className="text-gray-600">
//                 Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
//                 and we'll prorate any charges or credits.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I exceed my limit?</h3>
//               <p className="text-gray-600">
//                 We'll send you an email notification when you reach 80% of your monthly quota. If you 
//                 exceed your limit, additional screenshots will be charged at $0.02 per screenshot, or 
//                 you can upgrade to a higher plan.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
//               <p className="text-gray-600">
//                 Our Free plan includes 100 screenshots per month forever - no credit card required. 
//                 You can upgrade to a paid plan anytime to access advanced features and higher limits.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
//               <p className="text-gray-600">
//                 Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, 
//                 contact us within 30 days for a full refund.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg p-6 border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
//               <p className="text-gray-600">
//                 We accept all major credit cards (Visa, MasterCard, American Express) via Stripe. 
//                 Enterprise customers can also pay via invoice.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Enterprise CTA */}
//         <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 sm:p-12 text-white text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need a Custom Plan?</h2>
//           <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
//             For enterprise needs with custom integrations, dedicated support, and tailored solutions, 
//             contact our sales team.
//           </p>
//           <button
//             onClick={() => navigate('/contact')}
//             className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
//           >
//             Contact Sales
//           </button>
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

// export default Pricing;

