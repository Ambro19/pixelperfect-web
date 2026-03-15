// ========================================
// SUBSCRIPTION PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/SubscriptionPage.js
// Author: OneTechly
// Updated: March 2026
//
// ✅ PRODUCTION FEATURES:
// - PixelPerfect logo: top-left header + centered above title
// - Billing toggle: pill button style (Monthly | Annual) — matches Pricing.js
// - Pricing cards: same colored-border design as Pricing.js
//     Free → green border, Pro → blue border,
//     Business → purple border, Premium → orange border
// - CTA buttons: color-coded per tier (matches Pricing.js)
// - Stripe checkout: uses /billing/create_checkout_session with
//     { plan, billing_cycle } — same endpoint + payload as Pricing.js
// - Shows "CURRENT PLAN" badge on active tier (dynamic, from SubscriptionContext)
// - Back to Dashboard link in header
// - No FAQ section — see FAQ.js for all pricing/billing questions
//
// ✅ CHANGES (Mar 2026):
// - Added PixelPerfect logo (was a 💎 emoji)
// - Replaced colored borders — Business and Premium now match Pricing.js
//   (purple border + orange border instead of plain gray)
// - Stripe endpoint changed from /create-checkout-session (lookup_key) to
//   /billing/create_checkout_session (plan + billing_cycle) — matches Pricing.js
// - Billing cycle key standardized: 'annual' → 'yearly' to match backend
// - FAQ section removed (3 inline FAQ blocks)
// - Toggle style already matched Pricing.js (kept as-is)
// - Dynamic origin for Stripe success/cancel URLs preserved
// ========================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import { currentApiBase as currentApiBaseFn } from '../lib/api';

export default function SubscriptionPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, token, isAuthenticated } = useAuth();
  const { subscriptionStatus, tier: currentTier, refreshSubscriptionStatus } = useSubscription();

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [loadingPlan,  setLoadingPlan]  = useState(null);

  const yearly = billingCycle === 'yearly';

  // ─── Handle Stripe redirect query params ───────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      toast.success('🎉 Subscription activated! Welcome aboard!');
      refreshSubscriptionStatus?.();
      navigate('/subscription', { replace: true });
    }
    if (params.get('canceled') === 'true') {
      toast('Checkout canceled. No charges were made.', { icon: 'ℹ️' });
      navigate('/subscription', { replace: true });
    }
  }, [location.search]);

  // ─── Plan definitions ──────────────────────────────────────────────────────
  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice:  0,
      features: ['100 screenshots/month', 'Basic customization', 'Community support'],
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 49,
      yearlyPrice:  490,
      yearlySavings: 'Save $98/year',
      popular: true,
      features: ['5,000 screenshots/month', 'Full customization', 'Batch processing', 'Priority support'],
    },
    {
      id: 'business',
      name: 'Business',
      monthlyPrice: 199,
      yearlyPrice:  1990,
      yearlySavings: 'Save $398/year',
      features: ['50,000 screenshots/month', 'Everything in Pro', 'Webhooks & change detection', 'Dedicated support'],
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 499,
      yearlyPrice:  4990,
      yearlySavings: 'Save $998/year',
      features: ['Unlimited screenshots', 'All Business features', 'White-label options', 'Custom SLA', 'Dedicated account manager'],
    },
  ];

  // ─── Stripe checkout ───────────────────────────────────────────────────────
  // ✅ Uses same endpoint + payload structure as Pricing.js:
  //    POST /billing/create_checkout_session { plan, billing_cycle }
  const handleUpgrade = async (planId) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to upgrade');
      navigate('/login?next=/subscription');
      return;
    }
    if (planId === 'free' || planId === currentTier) {
      toast('You are already on this plan', { icon: 'ℹ️' });
      return;
    }

    setLoadingPlan(planId);
    try {
      const apiBase = currentApiBaseFn().replace(/\/+$/, '');
      const origin  = typeof window !== 'undefined' ? window.location.origin : '';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${apiBase}/billing/create_checkout_session`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // ✅ Same payload as Pricing.js: plan + billing_cycle (not lookup_key)
        // billing_cycle uses 'yearly' (not 'annual') to match backend expectation
        body: JSON.stringify({
          plan:          planId,
          billing_cycle: billingCycle,   // 'monthly' | 'yearly'
          success_url:   `${origin}/subscription?success=true`,
          cancel_url:    `${origin}/subscription?canceled=true`,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || err.message || `Server error (${response.status})`);
      }

      const data = await response.json();
      if (!data?.url) throw new Error('No checkout URL returned');

      window.location.href = data.url;
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error(error.message || 'Failed to start checkout. Please try again.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {/* ✅ NEW: Branded header with PP logo top-left (was missing) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          {/* ✅ NEW: PP logo centered above title (was 💎 emoji) */}
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core features.
            Upgrade or downgrade anytime.
          </p>
          {currentTier && (
            <p className="text-sm text-gray-500 mt-3">
              Your current plan:{' '}
              <span className={`font-semibold ${
                currentTier === 'free'     ? 'text-green-600'  :
                currentTier === 'pro'      ? 'text-blue-600'   :
                currentTier === 'business' ? 'text-purple-600' :
                'text-orange-600'
              }`}>
                {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
              </span>
            </p>
          )}
        </div>

        {/* ── Billing Toggle — pill style, matches Pricing.js ─────────────── */}
        <div className="flex justify-center items-center mb-12">
          <div className="bg-white rounded-full p-1 border border-gray-200 shadow-sm inline-flex gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                !yearly ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                yearly ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Annual
            </button>
          </div>
          {yearly && (
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Save 16%
            </span>
          )}
        </div>

        {/* ── Pricing Cards ──────────────────────────────────────────────────── */}
        {/* ✅ UPDATED: Same colored-border design as Pricing.js */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const price       = yearly ? plan.yearlyPrice  : plan.monthlyPrice;
            const isCurrentPlan = plan.id === currentTier;

            // ✅ Border matches Pricing.js exactly
            const cardBorder =
              plan.id === 'free'
                ? 'border-2 border-green-500 shadow-lg'
                : plan.id === 'pro'
                ? 'border-2 border-blue-500 shadow-lg'
                : plan.id === 'business'
                ? 'border-2 border-purple-400 shadow-md hover:shadow-lg'
                : 'border-2 border-orange-400 shadow-md hover:shadow-lg';

            // Badge: current plan takes priority
            const badge = isCurrentPlan
              ? { label: 'CURRENT PLAN', cls: 'bg-green-500' }
              : plan.popular && !isCurrentPlan
              ? { label: 'MOST POPULAR',  cls: 'bg-blue-500'  }
              : null;

            // ✅ CTA button style matches Pricing.js exactly
            const btnCls =
              plan.id === 'pro'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : plan.id === 'business'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : plan.id === 'premium'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                : '';

            return (
              <div key={plan.id}
                className={`bg-white rounded-xl relative flex flex-col transition-shadow ${cardBorder}`}>

                {/* Badge */}
                {badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className={`${badge.cls} text-white px-5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap tracking-wide`}>
                      {badge.label}
                    </span>
                  </div>
                )}

                <div className={`p-6 ${badge ? 'pt-10' : ''} flex flex-col flex-grow`}>
                  {/* Tier name */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">${price.toLocaleString()}</span>
                    {plan.id !== 'free' && (
                      <span className="text-gray-500 text-sm">/{yearly ? 'year' : 'month'}</span>
                    )}
                    {yearly && plan.id !== 'free' && plan.yearlySavings && (
                      <div className="text-xs text-green-600 font-medium mt-1">{plan.yearlySavings}</div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrentPlan ? (
                    <button disabled
                      className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed mt-auto">
                      ✓ Current Plan
                    </button>
                  ) : plan.id === 'free' ? (
                    <button disabled
                      className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed mt-auto">
                      Free Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={loadingPlan === plan.id}
                      className={`w-full py-3 rounded-lg font-semibold transition-all mt-auto
                        disabled:opacity-50 disabled:cursor-not-allowed ${btnCls}`}
                    >
                      {loadingPlan === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing…
                        </span>
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 px-6 py-3 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-700 font-medium">
              Secure payments processed by Stripe · Cancel anytime · No hidden fees
            </span>
          </div>
        </div>

        {/*
          ✅ FAQ REMOVED — 3 inline FAQ blocks deleted.
          All pricing/billing questions live in FAQ.js.
          Link below lets users find it if needed.
        */}

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-gray-500">
            Questions?{' '}
            <button onClick={() => navigate('/faq')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Visit our FAQ
            </button>
            {' '}or{' '}
            <a href="mailto:support@pixelperfectapi.net"
              className="text-blue-600 hover:text-blue-700 font-medium">
              contact support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

