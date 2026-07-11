// ============================================================================
// DASHBOARD PAGE - PRODUCTION READY
// ============================================================================
// File: frontend/src/pages/DashboardPage.js
// Author: OneTechly
// Updated: July 2026
//
// ✅ FIX (July 2026 — Dashboard Stays on FREE After Successful Stripe Checkout):
//   Root cause: Stripe checkout redirects to /dashboard?checkout=success, but
//   the mount refresh calls refreshSubscriptionStatus(false) — a fast DB-only
//   read with NO Stripe sync (the Apr 2026 anti-flood fix). If the Stripe
//   webhook hasn't been processed yet at that moment, the DB still says
//   "free" and the dashboard renders stale FREE data. Nothing ever forces
//   a sync, so the user sees FREE until they click "Refresh Usage".
//   Fix: New checkout-verification effect. When ?checkout=success is present:
//     1. Shows a "Confirming your upgrade…" banner immediately.
//     2. Polls refreshSubscriptionStatus(true) — forceSync=true, which hits
//        GET /subscription_status?sync=1 → sync_user_subscription_from_stripe.
//        Up to 6 attempts, 2.5s apart (~15s window for webhook/Stripe lag).
//     3. On tier change away from "free": green success banner (auto-dismisses).
//     4. If still free after all attempts: yellow "payment received, still
//        processing" banner with a manual verify button — never leaves the
//        user staring at silent stale data.
//     5. Strips ?checkout=success via history.replaceState (no re-render,
//        no reload loop, no re-trigger on navigation).
//   The forceSync anti-flood rule is preserved: forced syncs happen ONLY in
//   this checkout flow and on the explicit manual refresh button.
//
// ✅ FIX (July 2026 — Dashboard Shows Stale 0 After Screenshots Were Taken):
//   Root cause: The mount useEffect had [isAuthenticated] as its dependency.
//   In a React SPA, isAuthenticated doesn't change when navigating between
//   pages — it stays true. So the mount refresh ONLY ran once at login and
//   never again when the user navigated back to Dashboard.
//   Fix: Changed dependency to [] (empty array). In React Router v6,
//   navigating away and back causes a full component unmount + remount.
//   With [], the effect runs on every mount = every navigation to Dashboard.
//
// ✅ FIX (July 2026 — Billing Cycle Reset Transparency):
//   Added "Resets on [date]" display in the subscription status card.
//
// ✅ FIX (July 2026 — Tier Badge Color Inconsistency):
//   PRO=blue, BUSINESS=purple — matches ScreenshotPage.js.
//
// ✅ FIX (July 2026 — FREE Tier Batch Requests Empty State):
//   UsageCard now shows "Not available on this plan" for limit=0.
//
// Previous fixes (retained):
// ✅ FIX (May 2026 — Usage Field Name Mismatch)
// ✅ FIX (May 2026 — Manage Subscription & Billing / Stripe Portal)
// ✅ FIX (Apr 2026 — Stripe API flood): forceSync=false on mount/focus
// ✅ FIX (Mar 2026 — Stale Usage Data)
// ✅ FIX (Member Since flash)
// ============================================================================

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiKeyDisplay from "../components/ApiKeyDisplay";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";

// ── Tier color map — single source of truth ───────────────────────────────
// PRO=blue, BUSINESS=purple, PREMIUM=green, FREE=yellow
// Must match ScreenshotPage.js and all other pages.
const TIER_BADGE_CLASSES = {
  free:     "bg-yellow-100 text-yellow-800",
  pro:      "bg-blue-100   text-blue-800",
  business: "bg-purple-100 text-purple-800",
  premium:  "bg-green-100  text-green-800",
};

function tierBadgeClass(tier) {
  return TIER_BADGE_CLASSES[(tier || "free").toLowerCase()] ?? TIER_BADGE_CLASSES.free;
}

// ── Format a reset date for display ──────────────────────────────────────
function formatResetDate(isoString) {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      month: "long",
      day:   "numeric",
      year:  "numeric",
    });
  } catch {
    return null;
  }
}

// ── Checkout verification tuning ──────────────────────────────────────────
// ~15 second window: 6 forced-sync attempts, 2.5s apart. Stripe webhooks
// usually land within 1–5 seconds; the sync endpoint also pulls directly
// from Stripe, so the first attempt succeeds in the common case.
const CHECKOUT_POLL_ATTEMPTS   = 6;
const CHECKOUT_POLL_INTERVAL_MS = 2500;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, logout, apiStatus } = useAuth();
  const {
    subscriptionStatus,
    tier,
    isLoading: subLoading,
    refreshSubscriptionStatus,
  } = useSubscription();

  const [isRefreshing,    setIsRefreshing]    = useState(false);
  const [lastUpdated,     setLastUpdated]     = useState(null);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  // ── Checkout verification state ───────────────────────────────────────────
  // null       → no checkout in progress (normal dashboard)
  // "verifying" → polling Stripe for the new tier
  // "upgraded"  → tier confirmed, success banner (auto-dismisses)
  // "pending"   → payment likely succeeded but sync hasn't reflected it yet
  const [checkoutState, setCheckoutState] = useState(null);
  const checkoutHandledRef = useRef(false);

  // Keep the latest tier readable inside async polling loops without
  // re-triggering effects (context updates asynchronously after each sync).
  const tierRef = useRef(tier);
  useEffect(() => { tierRef.current = tier; }, [tier]);

  // ── Redirect if not authenticated ────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.replace("/login?next=%2Fdashboard");
    }
  }, [authLoading, isAuthenticated]);

  const debounceRef = useRef(null);

  // ── Was this navigation a Stripe checkout return? ─────────────────────────
  // Read once per mount; the param is stripped after handling.
  const isCheckoutReturn = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get("checkout") === "success";
    } catch {
      return false;
    }
  }, []);

  // ── ✅ NEW: Checkout verification — force Stripe sync until tier updates ──
  // Runs when the user lands on /dashboard?checkout=success. Waits for auth
  // to resolve, then polls with forceSync=true. This is the ONLY automatic
  // path that forces a Stripe sync — the anti-flood rule for normal
  // mount/focus refreshes (forceSync=false) is fully preserved.
  useEffect(() => {
    if (!isCheckoutReturn) return;
    if (authLoading || !isAuthenticated || !refreshSubscriptionStatus) return;
    if (checkoutHandledRef.current) return;
    checkoutHandledRef.current = true;

    // Strip ?checkout=success without a React Router navigation, so this
    // effect isn't cancelled/re-run and a page refresh won't re-trigger it.
    try {
      window.history.replaceState({}, "", "/dashboard");
    } catch {}

    let cancelled = false;
    setCheckoutState("verifying");

    const startingTier = (tierRef.current || "free").toLowerCase();

    const poll = async () => {
      for (let attempt = 1; attempt <= CHECKOUT_POLL_ATTEMPTS; attempt++) {
        try {
          // forceSync=true → backend GET /subscription_status?sync=1
          // → sync_user_subscription_from_stripe (pulls live from Stripe)
          const result = await refreshSubscriptionStatus(true);
          if (cancelled) return;
          setLastUpdated(new Date());

          // Prefer the direct return value if the context provides one;
          // otherwise read the freshly-updated context tier via the ref.
          const newTier = (
            (result && (result.tier || result?.subscriptionStatus?.tier)) ||
            tierRef.current ||
            "free"
          ).toLowerCase();

          if (newTier !== "free" && newTier !== startingTier) {
            setCheckoutState("upgraded");
            return;
          }
          // Edge case: user was already paid and changed plans (e.g. Pro →
          // Business). startingTier equals a paid tier; any non-free result
          // after a forced sync is authoritative — accept it.
          if (newTier !== "free" && startingTier !== "free") {
            setCheckoutState("upgraded");
            return;
          }
        } catch {
          // Network/transient error — fall through to the next attempt.
        }
        if (cancelled) return;
        if (attempt < CHECKOUT_POLL_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, CHECKOUT_POLL_INTERVAL_MS));
          if (cancelled) return;
        }
      }
      // All attempts exhausted and tier still free → show pending banner.
      // Payment almost certainly succeeded (Stripe redirected here); the
      // webhook or sync just hasn't landed. Give the user a clear path.
      setCheckoutState("pending");
    };

    poll();
    return () => { cancelled = true; };
  }, [isCheckoutReturn, authLoading, isAuthenticated, refreshSubscriptionStatus]);

  // ── Auto-dismiss the success banner after 8 seconds ───────────────────────
  useEffect(() => {
    if (checkoutState !== "upgraded") return;
    const t = setTimeout(() => setCheckoutState(null), 8000);
    return () => clearTimeout(t);
  }, [checkoutState]);

  // ── Mount refresh: runs on EVERY navigation to Dashboard ─────────────────
  // ✅ FIX: dependency changed from [isAuthenticated] to [].
  //   [] runs on every mount = every time the user navigates to Dashboard.
  //   forceSync=false → fast DB read, no Stripe call (prevents API flood).
  //   Skipped on checkout returns — the checkout verifier above owns the
  //   refresh in that case (and forces a real Stripe sync).
  useEffect(() => {
    if (isCheckoutReturn) return; // checkout verifier handles refresh
    if (!isAuthenticated || !refreshSubscriptionStatus) return;
    let cancelled = false;
    const run = async () => {
      try {
        await refreshSubscriptionStatus(false);
        if (!cancelled) setLastUpdated(new Date());
      } catch {}
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← empty: run on every mount

  // ── Focus/visibility: fast DB read only — no Stripe ──────────────────────
  useEffect(() => {
    if (!isAuthenticated || !refreshSubscriptionStatus) return;
    const trigger = () => {
      if (debounceRef.current) return;
      debounceRef.current = setTimeout(() => { debounceRef.current = null; }, 5000);
      refreshSubscriptionStatus(false)
        .then(() => setLastUpdated(new Date()))
        .catch(() => {});
    };
    const onFocus = () => trigger();
    const onVis   = () => { if (document.visibilityState === "visible") trigger(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ── Manual refresh: explicit Stripe sync ─────────────────────────────────
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSubscriptionStatus(true);
      setLastUpdated(new Date());
      // If a checkout was pending and the manual sync flipped the tier,
      // upgrade the banner accordingly.
      if (
        checkoutState === "pending" &&
        (tierRef.current || "free").toLowerCase() !== "free"
      ) {
        setCheckoutState("upgraded");
      }
    } catch {}
    finally { setIsRefreshing(false); }
  };

  // ── Open Stripe Customer Portal ───────────────────────────────────────────
  const handleManageBilling = async () => {
    setIsOpeningPortal(true);
    try {
      const token   = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/billing/create_portal_session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ return_url: window.location.href }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to open billing portal");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error("Billing portal error:", err);
      alert(err.message || "Could not open billing portal. Please try again.");
    } finally {
      setIsOpeningPortal(false);
    }
  };

  // ── Member Since (robust) ─────────────────────────────────────────────────
  const memberSince = useMemo(() => {
    const raw =
      user?.created_at  || user?.createdAt   ||
      user?.created     || user?.member_since ||
      user?.memberSince;
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
  }, [user]);

  const loading = authLoading || subLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {authLoading ? "Checking session..." : "Loading dashboard..."}
          </p>
          {apiStatus && apiStatus !== "healthy" && (
            <p className="text-xs text-gray-500 mt-2">
              API status: <span className="font-semibold">{apiStatus}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Unable to Load Account</h2>
          <p className="text-gray-600 mb-4">
            Your session may have expired or the API is unreachable.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.replace("/login?next=%2Fdashboard")}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Usage data — tries multiple field name variants ───────────────────────
  const usage  = subscriptionStatus?.usage  || {};
  const limits = subscriptionStatus?.limits || {};

  const isBatchAvailable = tier !== "free";
  const isPaidTier       = tier && tier !== "free";

  const screenshotsUsed = (
    usage.screenshots          ??
    usage.screenshots_used     ??
    usage.screenshot_count     ??
    usage.total_screenshots    ??
    subscriptionStatus?.screenshots_used ??
    0
  );
  const screenshotsLimit = (
    limits.screenshots           ??
    limits.screenshots_per_month ??
    limits.max_screenshots       ??
    subscriptionStatus?.screenshot_limit ??
    undefined
  );

  const batchUsed = (
    usage.batch_requests   ??
    usage.batch_jobs       ??
    usage.batch_count      ??
    usage.total_batch      ??
    subscriptionStatus?.batch_jobs_used ??
    0
  );
  const batchLimit = (
    limits.batch_requests  ??
    limits.batch_jobs      ??
    limits.max_batch       ??
    subscriptionStatus?.batch_limit ??
    undefined
  );

  const apiCallsUsed = (
    usage.api_calls            ??
    usage.api_calls_this_month ??
    usage.api_call_count       ??
    usage.total_api_calls      ??
    subscriptionStatus?.api_calls_used ??
    0
  );
  const apiCallsLimit = (
    limits.api_calls           ??
    limits.api_calls_per_month ??
    limits.max_api_calls       ??
    subscriptionStatus?.api_call_limit ??
    undefined
  );

  // ── Billing cycle reset date ──────────────────────────────────────────────
  const resetDate = formatResetDate(subscriptionStatus?.next_reset);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.username || "User"}
              </span>
              <button
                onClick={logout}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ✅ NEW: Checkout verification banners */}
        {checkoutState === "verifying" && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Payment received — confirming your upgrade with Stripe…
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                This usually takes a few seconds. Your new plan will appear automatically.
              </p>
            </div>
          </div>
        )}

        {checkoutState === "upgraded" && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-green-900">
                  Upgrade confirmed! Welcome to the {(tier || "").toUpperCase()} plan. 🎉
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Your new limits and features are active now.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCheckoutState(null)}
              className="text-green-400 hover:text-green-600 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {checkoutState === "pending" && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-900">
                  Your payment went through, but the upgrade is still processing.
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  This occasionally takes a minute on Stripe's side. Click below to
                  check again, or contact support if it doesn't update shortly.
                </p>
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold rounded-lg disabled:opacity-60 transition-colors"
                >
                  {isRefreshing ? "Checking…" : "Check Upgrade Status"}
                </button>
              </div>
              <button
                onClick={() => setCheckoutState(null)}
                className="text-yellow-400 hover:text-yellow-600 transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Page header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome back, {user?.username || "User"}! 👋
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your API keys, view usage, and configure your account.
          </p>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">📊 Subscription Status</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tierBadgeClass(tier)}`}>
              {(tier || "free").toUpperCase()}
            </span>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <UsageCard
              value={screenshotsUsed}
              label="Screenshots Used"
              limit={screenshotsLimit}
              valueClass="text-blue-600"
              barClass="from-blue-400 to-blue-600"
            />
            <UsageCard
              value={batchUsed}
              label="Batch Requests"
              limit={batchLimit}
              valueClass="text-purple-600"
              barClass="from-purple-400 to-purple-600"
            />
            <UsageCard
              value={apiCallsUsed}
              label="API Calls"
              limit={apiCallsLimit}
              valueClass="text-green-600"
              barClass="from-green-400 to-green-600"
            />
          </div>

          {/* Billing cycle reset date */}
          {resetDate && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Usage resets on <span className="font-medium text-gray-500">{resetDate}</span>
              &nbsp;(billing cycle)
            </div>
          )}

          {/* Refresh + billing row */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-60 transition-colors"
            >
              <svg className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? "Refreshing…" : "🔄 Refresh Usage"}
            </button>

            {lastUpdated && !isRefreshing && (
              <span className="text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}

            {isPaidTier ? (
              <button
                onClick={handleManageBilling}
                disabled={isOpeningPortal}
                className="sm:ml-auto flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-60 transition-colors shadow-sm"
              >
                {isOpeningPortal ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Opening…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    💳 Manage Subscription &amp; Billing
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate("/pricing")}
                className="sm:ml-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                ⬆️ Upgrade to Pro
              </button>
            )}
          </div>

          {isPaidTier && (
            <p className="text-xs text-gray-400 mt-3">
              Use "Manage Subscription &amp; Billing" to update payment methods, download invoices,
              switch billing cadence, or cancel your subscription.
            </p>
          )}
        </div>

        {/* API Key */}
        <ApiKeyDisplay />

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <QuickAction onClick={() => navigate("/screenshot")}    icon="📸" title="Take Screenshot"  subtitle="Capture any website" />
            <QuickAction
              onClick={isBatchAvailable ? () => navigate("/batch") : undefined}
              icon="📦"
              title="Batch Processing"
              subtitle={isBatchAvailable ? "Multiple screenshots" : "Pro plan required"}
              disabled={!isBatchAvailable}
            />
            <QuickAction onClick={() => navigate("/documentation")} icon="📚" title="Documentation"    subtitle="API reference" />
            <QuickAction onClick={() => navigate("/activity")}      icon="📊" title="Activity Log"     subtitle="View your history" />
            <QuickAction onClick={() => navigate("/pricing")}       icon="💳" title="Pricing Plans"    subtitle="View all tiers" />
            <QuickAction onClick={() => navigate("/help")}          icon="❓" title="Help Center"      subtitle="Get support" />
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">👤 Account Information</h3>
          <div className="space-y-3">
            <InfoRow label="Username"     value={user?.username || "—"} />
            <InfoRow label="Email"        value={user?.email    || "—"} />
            <InfoRow label="Member Since" value={memberSince ?? "Loading…"} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">Account Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/settings")}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              ⚙️ Account Settings
            </button>
            <button
              onClick={() => navigate("/change-password")}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              🔑 Change Password
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              © 2026 PixelPerfect API. Built by{" "}
              <button
                onClick={() => navigate("/about")}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                OneTechly, LLC
              </button>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate("/terms")}         className="hover:text-blue-600 transition-colors">Terms</button>
              <button onClick={() => navigate("/privacy")}       className="hover:text-blue-600 transition-colors">Privacy</button>
              <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">Docs</button>
              <button onClick={() => navigate("/contact")}       className="hover:text-blue-600 transition-colors">Contact</button>
              <button onClick={() => navigate("/blog")}          className="hover:text-blue-600 transition-colors">Blog</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function UsageCard({ value, label, limit, valueClass, barClass }) {
  const numValue = Number(value) || 0;
  const numLimit = Number(limit);
  const isZero   = !Number.isNaN(numLimit) && numLimit === 0;
  const isUnlimited =
    limit === "unlimited" ||
    limit === Infinity    ||
    limit === undefined   ||
    limit === null        ||
    limit === "";

  // ✅ Zero-limit: batch not available on free tier
  if (isZero) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="text-2xl sm:text-3xl font-bold mb-0.5 text-gray-300">—</div>
        <div className="text-xs sm:text-sm text-gray-500 mb-2">{label}</div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd" />
          </svg>
          Not available on this plan
        </div>
      </div>
    );
  }

  const percent  = (!isUnlimited && numLimit > 0)
    ? Math.min(100, (numValue / numLimit) * 100)
    : 0;

  const barColor = percent >= 90 ? "from-red-400 to-red-600"
    : percent >= 70              ? "from-orange-400 to-orange-500"
    : barClass;

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className={`text-2xl sm:text-3xl font-bold mb-0.5 ${valueClass}`}>{numValue}</div>
      <div className="text-xs sm:text-sm text-gray-600 mb-3">{label}</div>

      {!isUnlimited && numLimit > 0 && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1.5">
            <div
              className={`bg-gradient-to-r ${barColor} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{Math.max(0, numLimit - numValue)} remaining</span>
            <span>of {numLimit}</span>
          </div>
        </>
      )}

      {isUnlimited && (
        <div className="text-xs text-gray-400">Unlimited</div>
      )}
    </div>
  );
}

function QuickAction({ onClick, icon, title, subtitle, disabled = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all ${
        disabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
          : "border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
      }`}
      title={disabled ? subtitle : ""}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
        {disabled && <div className="text-xs text-red-600 mt-1">🔒 Upgrade required</div>}
      </div>
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
      <span className="text-gray-600 font-medium mb-1 sm:mb-0">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}

// ====== END OF DashboardPage.js =====



// // ============================================================================
// // DASHBOARD PAGE - PRODUCTION READY
// // ============================================================================
// // File: frontend/src/pages/DashboardPage.js
// // Author: OneTechly
// // Updated: July 2026
// //
// // ✅ FIX (July 2026 — Dashboard Shows Stale 0 After Screenshots Were Taken):
// //   Root cause: The mount useEffect had [isAuthenticated] as its dependency.
// //   In a React SPA, isAuthenticated doesn't change when navigating between
// //   pages — it stays true. So the mount refresh ONLY ran once at login and
// //   never again when the user navigated back to Dashboard.
// //   Observed: Screenshot page showed 3/100, user navigated to Dashboard,
// //   Dashboard showed 0/100 (stale). The refresh simply didn't re-run.
// //   Fix: Changed dependency to [] (empty array). In React Router v6,
// //   navigating away and back causes a full component unmount + remount.
// //   With [], the effect runs on every mount = every navigation to Dashboard.
// //   Dashboard now always fetches fresh usage data when the user arrives.
// //
// // ✅ FIX (July 2026 — Billing Cycle Reset Transparency):
// //   Added "Resets on [date]" display in the subscription status card.
// //   Reads subscriptionStatus.next_reset from the backend response.
// //   Users can now see exactly when their counters reset — no more surprise
// //   "collapses" to 0. Reset is tied to billing cycle, not calendar month.
// //
// // ✅ FIX (July 2026 — Tier Badge Color Inconsistency):
// //   PRO=blue, BUSINESS=purple — matches ScreenshotPage.js.
// //
// // ✅ FIX (July 2026 — FREE Tier Batch Requests Empty State):
// //   UsageCard now shows "Not available on this plan" for limit=0.
// //
// // ⚠️  BACKEND NOTE (models.py — now fixed):
// //   batch_requests for Business tier changed from 500 → 200.
// //   models.py now reads all limits from .env (single source of truth).
// //
// // Previous fixes (retained):
// // ✅ FIX (May 2026 — Usage Field Name Mismatch)
// // ✅ FIX (May 2026 — Manage Subscription & Billing / Stripe Portal)
// // ✅ FIX (Apr 2026 — Stripe API flood): forceSync=false on mount/focus
// // ✅ FIX (Mar 2026 — Stale Usage Data)
// // ✅ FIX (Member Since flash)
// // ============================================================================

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ApiKeyDisplay from "../components/ApiKeyDisplay";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";
// import { useAuth } from "../contexts/AuthContext";
// import { useSubscription } from "../contexts/SubscriptionContext";

// // ── Tier color map — single source of truth ───────────────────────────────
// // PRO=blue, BUSINESS=purple, PREMIUM=green, FREE=yellow
// // Must match ScreenshotPage.js and all other pages.
// const TIER_BADGE_CLASSES = {
//   free:     "bg-yellow-100 text-yellow-800",
//   pro:      "bg-blue-100   text-blue-800",
//   business: "bg-purple-100 text-purple-800",
//   premium:  "bg-green-100  text-green-800",
// };

// function tierBadgeClass(tier) {
//   return TIER_BADGE_CLASSES[(tier || "free").toLowerCase()] ?? TIER_BADGE_CLASSES.free;
// }

// // ── Format a reset date for display ──────────────────────────────────────
// function formatResetDate(isoString) {
//   if (!isoString) return null;
//   try {
//     const d = new Date(isoString);
//     if (Number.isNaN(d.getTime())) return null;
//     return d.toLocaleDateString("en-US", {
//       month: "long",
//       day:   "numeric",
//       year:  "numeric",
//     });
//   } catch {
//     return null;
//   }
// }

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const { user, isLoading: authLoading, isAuthenticated, logout, apiStatus } = useAuth();
//   const {
//     subscriptionStatus,
//     tier,
//     isLoading: subLoading,
//     refreshSubscriptionStatus,
//   } = useSubscription();

//   const [isRefreshing,    setIsRefreshing]    = useState(false);
//   const [lastUpdated,     setLastUpdated]     = useState(null);
//   const [isOpeningPortal, setIsOpeningPortal] = useState(false);

//   // ── Redirect if not authenticated ────────────────────────────────────────
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       window.location.replace("/login?next=%2Fdashboard");
//     }
//   }, [authLoading, isAuthenticated]);

//   const debounceRef = useRef(null);

//   // ── Mount refresh: runs on EVERY navigation to Dashboard ─────────────────
//   // ✅ FIX: dependency changed from [isAuthenticated] to [].
//   //   [isAuthenticated] only ran once at login — never on re-navigation.
//   //   [] runs on every mount = every time the user navigates to Dashboard.
//   //   This is safe because React Router v6 fully unmounts + remounts the
//   //   page component on navigation, so [] gives us "on every page visit".
//   //   forceSync=false → fast DB read, no Stripe call (prevents API flood).
//   useEffect(() => {
//     if (!isAuthenticated || !refreshSubscriptionStatus) return;
//     let cancelled = false;
//     const run = async () => {
//       try {
//         await refreshSubscriptionStatus(false);
//         if (!cancelled) setLastUpdated(new Date());
//       } catch {}
//     };
//     run();
//     return () => { cancelled = true; };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // ← empty: run on every mount

//   // ── Focus/visibility: fast DB read only — no Stripe ──────────────────────
//   useEffect(() => {
//     if (!isAuthenticated || !refreshSubscriptionStatus) return;
//     const trigger = () => {
//       if (debounceRef.current) return;
//       debounceRef.current = setTimeout(() => { debounceRef.current = null; }, 5000);
//       refreshSubscriptionStatus(false)
//         .then(() => setLastUpdated(new Date()))
//         .catch(() => {});
//     };
//     const onFocus = () => trigger();
//     const onVis   = () => { if (document.visibilityState === "visible") trigger(); };
//     window.addEventListener("focus", onFocus);
//     document.addEventListener("visibilitychange", onVis);
//     return () => {
//       window.removeEventListener("focus", onFocus);
//       document.removeEventListener("visibilitychange", onVis);
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated]);

//   // ── Manual refresh: explicit Stripe sync ─────────────────────────────────
//   const handleManualRefresh = async () => {
//     setIsRefreshing(true);
//     try {
//       await refreshSubscriptionStatus(true);
//       setLastUpdated(new Date());
//     } catch {}
//     finally { setIsRefreshing(false); }
//   };

//   // ── Open Stripe Customer Portal ───────────────────────────────────────────
//   const handleManageBilling = async () => {
//     setIsOpeningPortal(true);
//     try {
//       const token   = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
//       const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
//       const res = await fetch(`${API_URL}/billing/create_portal_session`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify({ return_url: window.location.href }),
//       });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.detail || "Failed to open billing portal");
//       }
//       const { url } = await res.json();
//       window.location.href = url;
//     } catch (err) {
//       console.error("Billing portal error:", err);
//       alert(err.message || "Could not open billing portal. Please try again.");
//     } finally {
//       setIsOpeningPortal(false);
//     }
//   };

//   // ── Member Since (robust) ─────────────────────────────────────────────────
//   const memberSince = useMemo(() => {
//     const raw =
//       user?.created_at  || user?.createdAt   ||
//       user?.created     || user?.member_since ||
//       user?.memberSince;
//     if (!raw) return null;
//     const d = new Date(raw);
//     return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
//   }, [user]);

//   const loading = authLoading || subLoading;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">
//             {authLoading ? "Checking session..." : "Loading dashboard..."}
//           </p>
//           {apiStatus && apiStatus !== "healthy" && (
//             <p className="text-xs text-gray-500 mt-2">
//               API status: <span className="font-semibold">{apiStatus}</span>
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
//           <div className="text-red-600 text-5xl mb-4">⚠️</div>
//           <h2 className="text-xl font-bold mb-2">Unable to Load Account</h2>
//           <p className="text-gray-600 mb-4">
//             Your session may have expired or the API is unreachable.
//           </p>
//           <div className="flex flex-col gap-3">
//             <button
//               onClick={() => window.location.replace("/login?next=%2Fdashboard")}
//               className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Go to Login
//             </button>
//             <button
//               onClick={() => window.location.reload()}
//               className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//             >
//               Reload
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Usage data — tries multiple field name variants ───────────────────────
//   const usage  = subscriptionStatus?.usage  || {};
//   const limits = subscriptionStatus?.limits || {};

//   const isBatchAvailable = tier !== "free";
//   const isPaidTier       = tier && tier !== "free";

//   const screenshotsUsed = (
//     usage.screenshots          ??
//     usage.screenshots_used     ??
//     usage.screenshot_count     ??
//     usage.total_screenshots    ??
//     subscriptionStatus?.screenshots_used ??
//     0
//   );
//   const screenshotsLimit = (
//     limits.screenshots           ??
//     limits.screenshots_per_month ??
//     limits.max_screenshots       ??
//     subscriptionStatus?.screenshot_limit ??
//     undefined
//   );

//   const batchUsed = (
//     usage.batch_requests   ??
//     usage.batch_jobs       ??
//     usage.batch_count      ??
//     usage.total_batch      ??
//     subscriptionStatus?.batch_jobs_used ??
//     0
//   );
//   const batchLimit = (
//     limits.batch_requests  ??
//     limits.batch_jobs      ??
//     limits.max_batch       ??
//     subscriptionStatus?.batch_limit ??
//     undefined
//   );

//   const apiCallsUsed = (
//     usage.api_calls            ??
//     usage.api_calls_this_month ??
//     usage.api_call_count       ??
//     usage.total_api_calls      ??
//     subscriptionStatus?.api_calls_used ??
//     0
//   );
//   const apiCallsLimit = (
//     limits.api_calls           ??
//     limits.api_calls_per_month ??
//     limits.max_api_calls       ??
//     subscriptionStatus?.api_call_limit ??
//     undefined
//   );

//   // ── Billing cycle reset date ──────────────────────────────────────────────
//   const resetDate = formatResetDate(subscriptionStatus?.next_reset);

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* Header */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 hidden sm:block">
//                 {user?.username || "User"}
//               </span>
//               <button
//                 onClick={logout}
//                 className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

//         {/* Page header */}
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//             Welcome back, {user?.username || "User"}! 👋
//           </h2>
//           <p className="text-gray-600 text-sm sm:text-base">
//             Manage your API keys, view usage, and configure your account.
//           </p>
//         </div>

//         {/* Subscription Status */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex items-center justify-between mb-5">
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900">📊 Subscription Status</h3>
//             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tierBadgeClass(tier)}`}>
//               {(tier || "free").toUpperCase()}
//             </span>
//           </div>

//           {/* Stat cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <UsageCard
//               value={screenshotsUsed}
//               label="Screenshots Used"
//               limit={screenshotsLimit}
//               valueClass="text-blue-600"
//               barClass="from-blue-400 to-blue-600"
//             />
//             <UsageCard
//               value={batchUsed}
//               label="Batch Requests"
//               limit={batchLimit}
//               valueClass="text-purple-600"
//               barClass="from-purple-400 to-purple-600"
//             />
//             <UsageCard
//               value={apiCallsUsed}
//               label="API Calls"
//               limit={apiCallsLimit}
//               valueClass="text-green-600"
//               barClass="from-green-400 to-green-600"
//             />
//           </div>

//           {/* ✅ NEW: Billing cycle reset date */}
//           {resetDate && (
//             <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
//               <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               Usage resets on <span className="font-medium text-gray-500">{resetDate}</span>
//               &nbsp;(billing cycle)
//             </div>
//           )}

//           {/* Refresh + billing row */}
//           <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
//             <button
//               onClick={handleManualRefresh}
//               disabled={isRefreshing}
//               className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-60 transition-colors"
//             >
//               <svg className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
//                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               {isRefreshing ? "Refreshing…" : "🔄 Refresh Usage"}
//             </button>

//             {lastUpdated && !isRefreshing && (
//               <span className="text-xs text-gray-400">
//                 Last updated: {lastUpdated.toLocaleTimeString()}
//               </span>
//             )}

//             {isPaidTier ? (
//               <button
//                 onClick={handleManageBilling}
//                 disabled={isOpeningPortal}
//                 className="sm:ml-auto flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-60 transition-colors shadow-sm"
//               >
//                 {isOpeningPortal ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                     Opening…
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                         d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                     </svg>
//                     💳 Manage Subscription &amp; Billing
//                   </>
//                 )}
//               </button>
//             ) : (
//               <button
//                 onClick={() => navigate("/pricing")}
//                 className="sm:ml-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
//               >
//                 ⬆️ Upgrade to Pro
//               </button>
//             )}
//           </div>

//           {isPaidTier && (
//             <p className="text-xs text-gray-400 mt-3">
//               Use "Manage Subscription &amp; Billing" to update payment methods, download invoices,
//               switch billing cadence, or cancel your subscription.
//             </p>
//           )}
//         </div>

//         {/* API Key */}
//         <ApiKeyDisplay />

//         {/* Quick Actions */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             <QuickAction onClick={() => navigate("/screenshot")}    icon="📸" title="Take Screenshot"  subtitle="Capture any website" />
//             <QuickAction
//               onClick={isBatchAvailable ? () => navigate("/batch") : undefined}
//               icon="📦"
//               title="Batch Processing"
//               subtitle={isBatchAvailable ? "Multiple screenshots" : "Pro plan required"}
//               disabled={!isBatchAvailable}
//             />
//             <QuickAction onClick={() => navigate("/documentation")} icon="📚" title="Documentation"    subtitle="API reference" />
//             <QuickAction onClick={() => navigate("/activity")}      icon="📊" title="Activity Log"     subtitle="View your history" />
//             <QuickAction onClick={() => navigate("/pricing")}       icon="💳" title="Pricing Plans"    subtitle="View all tiers" />
//             <QuickAction onClick={() => navigate("/help")}          icon="❓" title="Help Center"      subtitle="Get support" />
//           </div>
//         </div>

//         {/* Account Info */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">👤 Account Information</h3>
//           <div className="space-y-3">
//             <InfoRow label="Username"     value={user?.username || "—"} />
//             <InfoRow label="Email"        value={user?.email    || "—"} />
//             <InfoRow label="Member Since" value={memberSince ?? "Loading…"} />
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
//               <span className="text-gray-600 font-medium mb-1 sm:mb-0">Account Status</span>
//               <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
//             </div>
//           </div>
//           <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() => navigate("/settings")}
//               className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//             >
//               ⚙️ Account Settings
//             </button>
//             <button
//               onClick={() => navigate("/change-password")}
//               className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//             >
//               🔑 Change Password
//             </button>
//           </div>
//         </div>

//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-4">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//           <div className="text-center text-sm text-gray-600">
//             <p className="mb-2">
//               © 2026 PixelPerfect API. Built by{" "}
//               <button
//                 onClick={() => navigate("/about")}
//                 className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
//               >
//                 OneTechly, LLC
//               </button>.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button onClick={() => navigate("/terms")}         className="hover:text-blue-600 transition-colors">Terms</button>
//               <button onClick={() => navigate("/privacy")}       className="hover:text-blue-600 transition-colors">Privacy</button>
//               <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">Docs</button>
//               <button onClick={() => navigate("/contact")}       className="hover:text-blue-600 transition-colors">Contact</button>
//               <button onClick={() => navigate("/blog")}          className="hover:text-blue-600 transition-colors">Blog</button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // ============================================================================
// // HELPER COMPONENTS
// // ============================================================================

// function UsageCard({ value, label, limit, valueClass, barClass }) {
//   const numValue = Number(value) || 0;
//   const numLimit = Number(limit);
//   const isZero   = !Number.isNaN(numLimit) && numLimit === 0;
//   const isUnlimited =
//     limit === "unlimited" ||
//     limit === Infinity    ||
//     limit === undefined   ||
//     limit === null        ||
//     limit === "";

//   // ✅ Zero-limit: batch not available on free tier
//   if (isZero) {
//     return (
//       <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//         <div className="text-2xl sm:text-3xl font-bold mb-0.5 text-gray-300">—</div>
//         <div className="text-xs sm:text-sm text-gray-500 mb-2">{label}</div>
//         <div className="flex items-center gap-1.5 text-xs text-gray-400">
//           <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd"
//               d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//               clipRule="evenodd" />
//           </svg>
//           Not available on this plan
//         </div>
//       </div>
//     );
//   }

//   const percent  = (!isUnlimited && numLimit > 0)
//     ? Math.min(100, (numValue / numLimit) * 100)
//     : 0;

//   const barColor = percent >= 90 ? "from-red-400 to-red-600"
//     : percent >= 70              ? "from-orange-400 to-orange-500"
//     : barClass;

//   return (
//     <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//       <div className={`text-2xl sm:text-3xl font-bold mb-0.5 ${valueClass}`}>{numValue}</div>
//       <div className="text-xs sm:text-sm text-gray-600 mb-3">{label}</div>

//       {!isUnlimited && numLimit > 0 && (
//         <>
//           <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1.5">
//             <div
//               className={`bg-gradient-to-r ${barColor} h-2 rounded-full transition-all duration-500`}
//               style={{ width: `${percent}%` }}
//             />
//           </div>
//           <div className="flex justify-between text-xs text-gray-400">
//             <span>{Math.max(0, numLimit - numValue)} remaining</span>
//             <span>of {numLimit}</span>
//           </div>
//         </>
//       )}

//       {isUnlimited && (
//         <div className="text-xs text-gray-400">Unlimited</div>
//       )}
//     </div>
//   );
// }

// function QuickAction({ onClick, icon, title, subtitle, disabled = false }) {
//   return (
//     <button
//       onClick={disabled ? undefined : onClick}
//       disabled={disabled}
//       className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all ${
//         disabled
//           ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
//           : "border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
//       }`}
//       title={disabled ? subtitle : ""}
//     >
//       <div className="text-3xl">{icon}</div>
//       <div>
//         <div className="font-semibold text-gray-900">{title}</div>
//         <div className="text-sm text-gray-600">{subtitle}</div>
//         {disabled && <div className="text-xs text-red-600 mt-1">🔒 Upgrade required</div>}
//       </div>
//     </button>
//   );
// }

// function InfoRow({ label, value }) {
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
//       <span className="text-gray-600 font-medium mb-1 sm:mb-0">{label}</span>
//       <span className="text-gray-900 font-semibold">{value}</span>
//     </div>
//   );
// }

// // ====== END OF DashboardPage.js =====

