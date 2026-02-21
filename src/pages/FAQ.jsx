// ========================================
// FAQ PAGE - PIXELPERFECT
// ========================================
// Comprehensive FAQ with expandable questions
// Production-ready, mobile-responsive
//
// ✅ UPDATE (Feb 2026):
// - Added OFFICIAL PixelPerfect logo centered above the main page title
//   (matches ScreenshotPage.js layout)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const FAQ = () => {
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState(null);

  // Safer than reading window.innerWidth during render (works cleanly on hydration too)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const faqCategories = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I get started with PixelPerfect?',
          a: "Getting started is easy! Simply sign up for a free account, get your API key from the dashboard, and make your first API request. Our Quick Start guide walks you through the entire process in under 5 minutes."
        },
        {
          q: 'Do I need a credit card to sign up?',
          a: 'No! Our Free tier includes 100 screenshots per month with no credit card required. You can upgrade to a paid plan anytime if you need more features or higher limits.'
        },
        {
          q: 'What programming languages do you support?',
          a: 'PixelPerfect works with any programming language that can make HTTP requests. We provide official SDKs and code examples for JavaScript/Node.js, Python, Ruby, PHP, and Go.'
        }
      ]
    },
    {
      category: 'Pricing & Billing',
      questions: [
        {
          q: 'Can I change my plan anytime?',
          a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits to your account."
        },
        {
          q: 'What happens if I exceed my monthly limit?',
          a: "We'll send you an email notification when you reach 80% of your quota. If you exceed your limit, additional screenshots are charged at $0.02 per screenshot, or you can upgrade to a higher tier."
        },
        // ✅ UPDATED REFUND POLICY (NO REFUNDS)
        {
          q: 'Do you offer refunds?',
          a: "We do not offer refunds, which is why we encourage users to start with our Free tier before upgrading. This allows you to test all features and capabilities risk-free with 100 screenshots per month. Once you upgrade to a paid plan (Pro, Business, or Premium), your subscription remains active until the end of your current billing period, and you can continue using all paid features and your remaining screenshot quota throughout that time. You can cancel anytime, and you'll retain access until your paid period expires."
        },
        // ✅ ADDED / UPDATED CANCELATION POLICY QUESTION
        {
          q: 'What happens if I cancel my subscription?',
          a: "If you cancel your paid subscription, you'll retain full access to your paid tier features until the end of your current billing period. After that, your account will automatically downgrade to the Free tier (100 screenshots/month). All your API keys, settings, and screenshot history will be preserved. You can re-upgrade at any time."
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) via Stripe. Enterprise customers can also pay via invoice with NET-30 terms.'
        }
      ]
    },
    {
      category: 'API Usage',
      questions: [
        {
          q: 'What are the rate limits?',
          a: 'Rate limits depend on your plan: Free tier allows 10 requests per minute, Pro allows 60 requests per minute, Business allows 300 requests per minute, and Premium has no rate limits.'
        },
        {
          q: 'How long are screenshots stored?',
          a: 'Screenshots are stored for 30 days by default. After 30 days, they are automatically deleted. You can delete screenshots earlier through the API or dashboard if needed.'
        },
        {
          q: 'Can I capture screenshots of password-protected sites?',
          a: 'Yes! You can pass authentication credentials in your API request. We support Basic Auth, Bearer tokens, and custom cookies for authenticated pages.'
        },
        {
          q: 'Do you support full-page screenshots?',
          a: 'Yes! Full-page screenshots are available on Pro tier and above. Simply set the full_page parameter to true in your API request to capture the entire page length.'
        }
      ]
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'What browsers do you use for rendering?',
          a: 'We use headless Chromium (via Playwright) to ensure the most accurate rendering of modern websites. This matches how users see sites in Chrome, Edge, and other Chromium-based browsers.'
        },
        {
          q: 'Can I execute custom JavaScript before capturing?',
          a: 'Yes! Premium and Business plans support custom JavaScript execution. You can interact with the page, fill forms, click buttons, or modify content before capturing the screenshot.'
        },
        {
          q: 'How long does it take to capture a screenshot?',
          a: 'Average response time is under 3 seconds for standard screenshots. Complex pages with lots of JavaScript may take slightly longer. Batch requests are processed in parallel for optimal speed.'
        },
        {
          q: 'Do you support webhooks?',
          a: "Yes! Webhook notifications are available on Premium and Business plans. You'll receive real-time notifications when screenshots are ready, perfect for asynchronous workflows."
        }
      ]
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          q: 'Is my data secure?',
          a: 'Absolutely! We use enterprise-grade encryption (TLS/SSL) for all requests, store passwords with bcrypt hashing, and maintain SOC 2 Type II compliance. Your data is always protected.'
        },
        {
          q: 'Do you store the websites I screenshot?',
          a: 'We only store the screenshot images themselves, not the underlying HTML or source code. Screenshots are stored for 30 days then automatically deleted.'
        },
        {
          q: 'Are you GDPR compliant?',
          a: "Yes! We're fully GDPR compliant. We provide data export, deletion requests, and maintain transparent data handling practices. See our Privacy Policy for complete details."
        }
      ]
    },
    {
      category: 'Support',
      questions: [
        {
          q: 'What kind of support do you offer?',
          a: 'Support varies by plan: Free users get community support, Pro gets priority email support (<4h weekdays), Business gets faster support (<2h weekdays), and Premium gets dedicated 24/7 support (<1h).'
        },
        {
          q: 'Do you have a status page?',
          a: 'Yes! Visit status.pixelperfectapi.net to see real-time system status, historical uptime, and any ongoing incidents. You can also subscribe to receive email notifications.'
        },
        {
          q: 'Where can I find the documentation?',
          a: 'Our complete API documentation is available at pixelperfectapi.net/docs. It includes detailed endpoint references, code examples, and integration guides.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIdx, questionIdx) => {
    const key = `${categoryIdx}-${questionIdx}`;
    setOpenQuestion(openQuestion === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={isMobile ? 32 : 40} showText={true} />
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/help')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Help Center
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Documentation
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* ✅ NEW: Centered official PixelPerfect logo icon (matches ScreenshotPage.js) */}
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Find answers to common questions about PixelPerfect
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {faqCategories.map((category, catIdx) => (
          <section key={catIdx} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((item, qIdx) => {
                const isOpen = openQuestion === `${catIdx}-${qIdx}`;
                return (
                  <div key={qIdx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleQuestion(catIdx, qIdx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <p className="text-gray-700 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Still Have Questions CTA */}
        <section className="mt-16 bg-blue-50 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-lg text-gray-600 mb-8">Can't find what you're looking for? We're here to help!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/help')}
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            >
              Visit Help Center
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
              <button onClick={() => navigate('/privacy')} className="hover:text-white">
                Privacy
              </button>
              <button onClick={() => navigate('/terms')} className="hover:text-white">
                Terms
              </button>
              <button onClick={() => navigate('/cookies')} className="hover:text-white">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
// END of FAQ

