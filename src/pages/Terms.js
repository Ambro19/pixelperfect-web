// ========================================
// TERMS OF SERVICE PAGE - PIXELPERFECT
// ========================================
// ✅ VERIFIED PRODUCTION READY - February 2026
// ✅ Guaranteed proper export statement
// ✅ Business plan added
// ✅ All links clickable
// ========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const Terms = () => {
  const navigate = useNavigate();
  
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo 
                size={window.innerWidth < 640 ? 32 : 40} 
                showText={true} 
              />
            </div>
            
            <nav className="flex items-center gap-3 sm:gap-6">
              <button onClick={() => navigate('/docs')} className="hidden md:block text-gray-600 hover:text-gray-900 font-medium text-sm">
                Documentation
              </button>
              <button onClick={() => navigate('/pricing')} className="hidden md:block text-gray-600 hover:text-gray-900 font-medium text-sm">
                Pricing
              </button>
              <button onClick={() => navigate('/login')} className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Sign in
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ✅ Centered Logo + Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Section 1: Agreement to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and PixelPerfect Screenshot API ("PixelPerfect," "we," "us," or "our"), operated by OneTechly, regarding your access to and use of our screenshot API service at{' '}
              <a href="https://pixelperfectapi.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                pixelperfectapi.net
              </a>.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By accessing or using PixelPerfect, you agree to be bound by these Terms. If you do not agree with these Terms, you may not access or use our service.
            </p>
          </section>

          {/* Section 2: Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              PixelPerfect provides a programmatic screenshot API service at{' '}
              <a href="https://pixelperfectapi.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                pixelperfectapi.net
              </a>{' '}
              that allows developers to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Capture screenshots of web pages via RESTful API</li>
              <li>Customize screenshot parameters (dimensions, format, viewport)</li>
              <li>Process screenshots in multiple formats (PNG, JPEG, WebP, PDF)</li>
              <li>Access batch screenshot processing (Pro, Business, and Premium tiers)</li>
              <li>Utilize advanced features based on subscription tier</li>
            </ul>
          </section>

          {/* Section 3: Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration and Security</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Account Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-3">To use PixelPerfect, you must:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Account Responsibility</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to maintain account security.
            </p>
          </section>

          {/* ✅ Section 4: Subscription Plans (UPDATED WITH BUSINESS TIER) */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription Plans and Payment</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Subscription Tiers</h3>
            <p className="text-gray-700 leading-relaxed mb-3">PixelPerfect offers four subscription tiers:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Free Tier:</strong> 100 screenshots per month, basic customization, community support</li>
              <li><strong>Pro Tier ($49/month):</strong> 5,000 screenshots per month, full customization, batch processing, priority support</li>
              <li><strong>Business Tier ($199/month):</strong> 50,000 screenshots per month, everything in Pro, webhooks & change detection, dedicated support</li>
              <li><strong>Premium Tier ($499/month):</strong> Unlimited screenshots, all Business features, white-label options, custom SLA, dedicated account manager</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Billing and Payments</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Subscription fees are billed monthly or annually in advance</li>
              <li>Payments are processed securely through Stripe</li>
              <li>All fees are non-refundable unless required by law</li>
              <li>You authorize us to charge your payment method on recurring basis</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Cancellation and Refunds</h3>
            <p className="text-gray-700 leading-relaxed">
              You may cancel your subscription at any time. Your service will remain active until the end of your current billing period.
            </p>
          </section>

          {/* ✅ Section 5: API Usage (UPDATED WITH ALL TIERS) */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. API Usage and Limitations</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.1 Usage Limits by Tier</h3>
            <p className="text-gray-700 leading-relaxed mb-3">Your API usage is subject to the limits of your subscription tier:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Free:</strong> 100 screenshots/month, basic features, community support</li>
              <li><strong>Pro:</strong> 5,000 screenshots/month, batch processing, priority support</li>
              <li><strong>Business:</strong> 50,000 screenshots/month, webhooks, dedicated support</li>
              <li><strong>Premium:</strong> Unlimited screenshots, all features, white-label, account manager</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.2 Fair Use Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              You agree to use our service reasonably and not exceed your tier limits or impact other users.
            </p>
          </section>

          {/* Section 6: Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">You may NOT use PixelPerfect to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Scrape or harvest personal data without authorization</li>
              <li>Engage in fraudulent or malicious activities</li>
              <li>Overload or disrupt our infrastructure</li>
            </ul>
          </section>

          {/* Section 7-15: Additional Standard Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content, features, and functionality of PixelPerfect are owned by OneTechly and protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data and Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of PixelPerfect is governed by our{' '}
              <button onClick={() => navigate('/privacy')} className="text-blue-600 hover:underline">
                Privacy Policy
              </button>
              , which describes how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless PixelPerfect and OneTechly from any claims arising from your use of the service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Modifications to Service</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your access immediately, without prior notice, for any violation of these Terms or for any other reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of the State of New York, United States, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes via email or through the service.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700"><strong>PixelPerfect Screenshot API</strong></p>
              <p className="text-gray-700">OneTechly</p>
              <p className="text-gray-700">Albany, NY, United States</p>
              <p className="text-gray-700 mt-3">
                Website:{' '}
                <a href="https://pixelperfectapi.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  pixelperfectapi.net
                </a>
              </p>
              <p className="text-gray-700">
                Legal:{' '}
                <a href="mailto:legal@pixelperfectapi.net" className="text-blue-600 hover:underline">
                  legal@pixelperfectapi.net
                </a>
              </p>
              <p className="text-gray-700">
                Support:{' '}
                <a href="mailto:support@pixelperfectapi.net" className="text-blue-600 hover:underline">
                  support@pixelperfectapi.net
                </a>
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t pt-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              BY CREATING AN ACCOUNT OR USING PIXELPERFECT SCREENSHOT API, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
            </p>
          </section>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 font-medium">
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

// ✅ CRITICAL: Export statement
export default Terms;


