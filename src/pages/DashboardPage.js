// ============================================================================
// DASHBOARD PAGE - PRODUCTION READY
// ============================================================================
// File: frontend/src/pages/DashboardPage.js
// Author: OneTechly
// Updated: March 2026
//
// ✅ PRODUCTION FEATURES:
// - Centered PixelPerfect logo in page header
// - AuthContext + SubscriptionContext as source of truth
// - Batch Processing correctly disabled for free tier
// - Consistent UI design with Activity and Screenshot pages
// - Professional loading states and error handling
//
// ✅ FIX (Member Since flash):
// - No more "N/A" on first load while user profile hydrates
// - Robust parsing across common field names
//
// ✅ FIX (Mar 2026 — Stale Usage Data):
// - refreshSubscriptionStatus() now called on mount → counts always current
// - Added window focus + visibilitychange listeners → auto-refreshes when
//   user returns to this tab after taking screenshots elsewhere
// - Progress bars added to stat cards (consistent with ScreenshotPage.js)
// - "Refresh Usage" button now shows spinner + last-updated timestamp
// - Stripe sync triggered on manual refresh (sync=1 via API)
// ============================================================================

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiKeyDisplay from "../components/ApiKeyDisplay";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, logout, apiStatus } = useAuth();
  const {
    subscriptionStatus,
    tier,
    isLoading: subLoading,
    refreshSubscriptionStatus,
  } = useSubscription();

  const [isRefreshing, setIsRefreshing]   = useState(false);
  const [lastUpdated,  setLastUpdated]    = useState(null);

  // ─── Redirect if not authenticated ──────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.replace("/login?next=%2Fdashboard");
    }
  }, [authLoading, isAuthenticated]);

  // ─── Auto-refresh on mount ───────────────────────────────────────────────────
  // This is the primary fix: without this the dashboard shows stale context data.
  const silentRefresh = useCallback(async () => {
    if (!isAuthenticated || !refreshSubscriptionStatus) return;
    try {
      await refreshSubscriptionStatus();
      setLastUpdated(new Date());
    } catch {}
  }, [isAuthenticated, refreshSubscriptionStatus]);

  useEffect(() => {
    silentRefresh();
  }, [silentRefresh]);

  // ─── Refresh when user returns to this tab ────────────────────────────────────
  useEffect(() => {
    const onFocus = () => silentRefresh();
    const onVis   = () => { if (document.visibilityState === "visible") silentRefresh(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [silentRefresh]);

  // ─── Manual refresh (with Stripe sync) ───────────────────────────────────────
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSubscriptionStatus();
      setLastUpdated(new Date());
    } catch {}
    finally { setIsRefreshing(false); }
  };

  // ─── Member Since (robust — avoids "N/A" flash) ───────────────────────────
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

  // ─── Loading screen ──────────────────────────────────────────────────────────
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

  // ─── Session-expired fallback ─────────────────────────────────────────────
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

  const usage           = subscriptionStatus?.usage  || {};
  const limits          = subscriptionStatus?.limits || {};
  const isBatchAvailable = tier !== "free";

  const screenshotsUsed  = usage.screenshots    ?? 0;
  const screenshotsLimit = limits.screenshots;
  const batchUsed        = usage.batch_requests ?? 0;
  const batchLimit       = limits.batch_requests;
  const apiCallsUsed     = usage.api_calls      ?? 0;
  const apiCallsLimit    = limits.api_calls;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
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

      {/* ── Main ──────────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

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

        {/* ── Subscription Status ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">📊 Subscription Status</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              tier === "free"     ? "bg-yellow-100 text-yellow-800" :
              tier === "pro"      ? "bg-purple-100 text-purple-800" :
              tier === "business" ? "bg-blue-100   text-blue-800"   :
              "bg-green-100 text-green-800"
            }`}>
              {(tier || "free").toUpperCase()}
            </span>
          </div>

          {/* Stat cards with progress bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
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

          {/* Refresh row */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3">
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

            {tier === "free" && (
              <button
                onClick={() => navigate("/pricing")}
                className="sm:ml-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                ⬆️ Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* ── API Key ─────────────────────────────────────────────────────────── */}
        <ApiKeyDisplay />

        {/* ── Quick Actions ───────────────────────────────────────────────────── */}
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

        {/* ── Account Info ────────────────────────────────────────────────────── */}
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

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              © 2026 PixelPerfect API. Built by{" "}
              <button
                onClick={() => navigate("/about")}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                OneTechly
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
  const isUnlimited = limit === "unlimited" || limit === Infinity || limit === undefined || limit === null || limit === "";
  const numLimit    = isUnlimited ? null : Number(limit);
  const percent     = (!isUnlimited && numLimit > 0)
    ? Math.min(100, (Number(value) / numLimit) * 100)
    : 0;

  const barColor = percent >= 90 ? "from-red-400 to-red-600"
    : percent >= 70              ? "from-orange-400 to-orange-500"
    : barClass;

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className={`text-2xl sm:text-3xl font-bold mb-0.5 ${valueClass}`}>{value}</div>
      <div className="text-xs sm:text-sm text-gray-600 mb-3">{label}</div>

      {/* Progress bar */}
      {!isUnlimited && numLimit > 0 && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1.5">
            <div
              className={`bg-gradient-to-r ${barColor} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{Math.max(0, numLimit - Number(value))} remaining</span>
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

