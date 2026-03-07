// ============================================================================
// DASHBOARD PAGE - PRODUCTION READY
// ============================================================================
// File: frontend/src/pages/DashboardPage.js
// Author: OneTechly
// Updated: February 2026
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
// ✅ UPDATED (Mar 2026):
// - Blog section moved to Marketing.jsx (public-facing, better for SEO)
// ============================================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import ApiKeyDisplay from "../components/ApiKeyDisplay";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, logout, apiStatus } = useAuth();
  const { subscriptionStatus, tier, isLoading: subLoading, refreshSubscriptionStatus } = useSubscription();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.replace("/login?next=%2Fdashboard");
    }
  }, [authLoading, isAuthenticated]);

  const loading = authLoading || subLoading;

  // ✅ Member Since (robust + avoids "N/A" flash)
  const memberSince = React.useMemo(() => {
    const raw =
      user?.created_at ||
      user?.createdAt ||
      user?.created ||
      user?.member_since ||
      user?.memberSince;

    if (!raw) return null;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString();
  }, [user]);

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

  const usage = subscriptionStatus?.usage || {};
  const limits = subscriptionStatus?.limits || {};
  const isBatchAvailable = tier !== "free";

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">📊 Subscription Status</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                tier === "free"
                  ? "bg-blue-100 text-blue-800"
                  : tier === "pro"
                  ? "bg-purple-100 text-purple-800"
                  : tier === "business"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {(tier || "free").toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard value={usage.screenshots ?? 0}    label="Screenshots Used"  limit={limits.screenshots}   valueClass="text-blue-600"   />
            <StatCard value={usage.batch_requests ?? 0} label="Batch Requests"    limit={limits.batch_requests} valueClass="text-purple-600" />
            <StatCard value={usage.api_calls ?? 0}      label="API Calls"         limit={limits.api_calls}      valueClass="text-green-600"  />
          </div>


          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => refreshSubscriptionStatus(true)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              🔄 Refresh Usage
            </button>
            {tier === "free" && (
              <button
                onClick={() => navigate("/pricing")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                ⬆️ Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* API Key Display */}
        <ApiKeyDisplay />

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <QuickAction onClick={() => navigate("/screenshot")}    icon="📸" title="Take Screenshot"    subtitle="Capture any website" />
            <QuickAction
              onClick={isBatchAvailable ? () => navigate("/batch") : undefined}
              icon="📦"
              title="Batch Processing"
              subtitle={isBatchAvailable ? "Multiple screenshots" : "Pro plan required"}
              disabled={!isBatchAvailable}
            />
            <QuickAction onClick={() => navigate("/documentation")} icon="📚" title="Documentation"      subtitle="API reference" />
            <QuickAction onClick={() => navigate("/activity")}      icon="📊" title="Activity Log"       subtitle="View your history" />
            <QuickAction onClick={() => navigate("/pricing")}       icon="💳" title="Pricing Plans"      subtitle="View all tiers" />
            <QuickAction onClick={() => navigate("/help")}          icon="❓" title="Help Center"        subtitle="Get support" />
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">👤 Account Information</h3>
          <div className="space-y-3">
            <InfoRow label="Username"     value={user?.username || "—"} />
            <InfoRow label="Email"        value={user?.email || "—"} />
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
                OneTechly
              </button>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate("/terms")}         className="hover:text-blue-600 transition-colors">Terms</button>
              <button onClick={() => navigate("/privacy")}       className="hover:text-blue-600 transition-colors">Privacy</button>
              <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">Docs</button>
              <button onClick={() => navigate("/contact")}       className="hover:text-blue-600 transition-colors">Contact</button>
              <button onClick={() => navigate("/blog")} className="hover:text-blue-600 transition-colors">Blog</button>
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

function StatCard({ value, label, limit, valueClass }) {
  const showLimit = limit !== undefined && limit !== null && limit !== "" && limit !== "unlimited";
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className={`text-2xl sm:text-3xl font-bold mb-1 ${valueClass}`}>{value}</div>
      <div className="text-xs sm:text-sm text-gray-600">{label}</div>
      {showLimit && <div className="text-xs text-gray-500 mt-1">of {String(limit)} limit</div>}
    </div>
  );
}

function QuickAction({ onClick, icon, title, subtitle, disabled = false }) {
  const baseClasses     = "flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all";
  const enabledClasses  = "border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer";
  const disabledClasses = "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
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

// // ============================================================================

// // DASHBOARD PAGE - PRODUCTION READY (RELIABLE DATA DISPLAY)
// // ============================================================================
// // File: frontend/src/pages/DashboardPage.js
// // Author: OneTechly
// // Updated: March 2026
// //
// // ✅ Fixes & Improvements:
// // - Robust tier normalization: "starter" and "free" treated as Free plan
// // - Reliable usage rendering (handles Infinity / huge limits / missing keys)
// // - No flicker: caches last dashboard snapshot in localStorage
// // - Professional API error handling + retry actions
// // - Keeps your existing layout + OneTechly blog section
// // ============================================================================

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import ApiKeyDisplay from "../components/ApiKeyDisplay";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";
// import { useAuth } from "../contexts/AuthContext";
// import { useSubscription } from "../contexts/SubscriptionContext";

// // ============================================================================
// // OneTechly blog posts (static to render instantly + indexable links)
// // ============================================================================
// const BLOG_POSTS = [
//   {
//     title: "Peer-to-Peer (P2P) Technology: Powering Decentralization Across Industries",
//     excerpt:
//       "Explore how P2P systems underpin everything from BitTorrent to blockchain, and why decentralized architectures are reshaping the web.",
//     tag: "Architecture",
//     tagColor: "bg-purple-100 text-purple-700",
//     url: "https://onetechlyambr19.blogspot.com/2024/11/peer-to-peer-peer-to-peer-p2p.html",
//     date: "Nov 02, 2024",
//     icon: "🔗",
//   },
//   {
//     title: "Implementing AdSense and Google Analytics: A Complete Guide to Website Monetization and Tracking",
//     excerpt:
//       "Learn how to integrate Google AdSense and GA4 into any web project to monetize and understand your audience.",
//     tag: "Analytics",
//     tagColor: "bg-orange-100 text-orange-700",
//     url: "https://onetechlyambr19.blogspot.com/2025/12/blog-post_29.html",
//     date: "Dec 29, 2025",
//     icon: "📊",
//   },
//   {
//     title: "Cross-Platform npm Scripts: Why Your Windows Commands Fail on macOS/Linux (and How to Fix Them)",
//     excerpt:
//       "Why Windows-style npm scripts break on macOS/Linux and how cross-env fixes it. Write truly portable scripts.",
//     tag: "Node.js",
//     tagColor: "bg-lime-100 text-lime-700",
//     url: "https://onetechlyambr19.blogspot.com/2026/02/blog-post.html",
//     date: "Feb 04, 2026",
//     icon: "⚙️",
//   },
// ];

// // ============================================================================
// // Local cache keys
// // ============================================================================
// const DASH_CACHE_KEY = "pp_dashboard_cache_v1";

// // ============================================================================
// // Helpers
// // ============================================================================
// function normalizeTier(raw) {
//   const t = String(raw || "").trim().toLowerCase();
//   if (!t) return "free";
//   // Backend may return "starter" for free tier normalization.
//   if (t === "starter" || t === "basic" || t === "free") return "free";
//   if (t === "pro" || t === "premium") return "pro";
//   if (t === "business" || t === "enterprise") return "business";
//   return t;
// }

// function prettyTierLabel(tier) {
//   const t = normalizeTier(tier);
//   if (t === "free") return "FREE";
//   if (t === "pro") return "PRO";
//   if (t === "business") return "BUSINESS";
//   return t.toUpperCase();
// }

// function tierPillClass(tier) {
//   const t = normalizeTier(tier);
//   if (t === "free") return "bg-blue-100 text-blue-800";
//   if (t === "pro") return "bg-purple-100 text-purple-800";
//   if (t === "business") return "bg-yellow-100 text-yellow-800";
//   return "bg-green-100 text-green-800";
// }

// function isUnlimited(limit) {
//   // Accept backend variants: Infinity, "unlimited", null, huge numbers, etc.
//   if (limit === undefined || limit === null || limit === "") return false;
//   if (typeof limit === "string") {
//     const s = limit.trim().toLowerCase();
//     if (s === "unlimited" || s === "infinity" || s === "inf") return true;
//     const n = Number(s);
//     if (!Number.isNaN(n) && !Number.isFinite(n)) return true;
//     if (!Number.isNaN(n) && n >= 999999999) return true;
//     return false;
//   }
//   if (typeof limit === "number") {
//     if (!Number.isFinite(limit)) return true;
//     if (limit >= 999999999) return true;
//   }
//   return false;
// }

// function safeNumber(n, fallback = 0) {
//   const v = Number(n);
//   return Number.isFinite(v) ? v : fallback;
// }

// function safeDateString(raw) {
//   if (!raw) return null;
//   const d = new Date(raw);
//   if (Number.isNaN(d.getTime())) return null;
//   return d.toLocaleDateString();
// }

// function clampInt(n, min = 0) {
//   const v = safeNumber(n, min);
//   return Math.max(min, Math.floor(v));
// }

// function tryLoadCache() {
//   try {
//     const raw = localStorage.getItem(DASH_CACHE_KEY);
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     // basic shape validation
//     if (!parsed || typeof parsed !== "object") return null;
//     return parsed;
//   } catch {
//     return null;
//   }
// }

// function trySaveCache(payload) {
//   try {
//     localStorage.setItem(DASH_CACHE_KEY, JSON.stringify(payload));
//   } catch {
//     // ignore
//   }
// }

// // ============================================================================
// // Component
// // ============================================================================
// export default function DashboardPage() {
//   const navigate = useNavigate();

//   const { user, isLoading: authLoading, isAuthenticated, logout, apiStatus } = useAuth();
//   const { subscriptionStatus, tier, isLoading: subLoading, refreshSubscriptionStatus } = useSubscription();

//   // Cache-backed snapshot to prevent flicker / inconsistent UI
//   const [cached, setCached] = React.useState(() => tryLoadCache());
//   const [subError, setSubError] = React.useState(null);

//   // Redirect if unauthenticated
//   React.useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       window.location.replace("/login?next=%2Fdashboard");
//     }
//   }, [authLoading, isAuthenticated]);

//   // Track subscription status reliability and cache it
//   React.useEffect(() => {
//     // If we have a subscriptionStatus, clear any prior error and cache it
//     if (subscriptionStatus && typeof subscriptionStatus === "object") {
//       setSubError(null);

//       const snap = {
//         at: Date.now(),
//         tier: subscriptionStatus.tier ?? tier ?? null,
//         usage: subscriptionStatus.usage ?? null,
//         limits: subscriptionStatus.limits ?? null,
//         next_reset: subscriptionStatus.next_reset ?? null,
//         tier_concurrency_limit: subscriptionStatus.tier_concurrency_limit ?? null,
//       };

//       setCached(snap);
//       trySaveCache(snap);
//     }
//   }, [subscriptionStatus, tier]);

//   // Member since (robust)
//   const memberSince = React.useMemo(() => {
//     const raw =
//       user?.created_at ||
//       user?.createdAt ||
//       user?.created ||
//       user?.member_since ||
//       user?.memberSince;

//     return safeDateString(raw);
//   }, [user]);

//   // Effective tier:
//   // prefer live `tier` from SubscriptionContext, then subscriptionStatus.tier, then cached tier.
//   const effectiveTier = React.useMemo(() => {
//     return normalizeTier(tier || subscriptionStatus?.tier || cached?.tier || "free");
//   }, [tier, subscriptionStatus?.tier, cached?.tier]);

//   const loading = authLoading || subLoading;

//   // Data source selection (live > cache > defaults)
//   const usage = subscriptionStatus?.usage || cached?.usage || {};
//   const limits = subscriptionStatus?.limits || cached?.limits || {};

//   // Free plan should NEVER enable batch
//   const isBatchAvailable = effectiveTier !== "free";

//   // Safer usage numbers
//   const screenshotsUsed = clampInt(usage.screenshots ?? usage.screenshot_count ?? usage.screenshots_used ?? 0);
//   const batchUsed = clampInt(usage.batch_requests ?? usage.batch ?? usage.batch_used ?? 0);
//   const apiCallsUsed = clampInt(usage.api_calls ?? usage.api ?? (screenshotsUsed + batchUsed));

//   // Limits might be missing, Infinity, "unlimited", etc.
//   const screenshotsLimit = limits.screenshots ?? limits.screenshot_limit ?? null;
//   const batchLimit = limits.batch_requests ?? limits.batch_limit ?? null;
//   const apiCallsLimit = limits.api_calls ?? limits.api_limit ?? null;

//   async function handleRefreshUsage(hardSync = false) {
//     setSubError(null);
//     try {
//       // Your SubscriptionContext already knows how to call /subscription_status
//       // (with optional sync=1 if hardSync is true)
//       await refreshSubscriptionStatus(Boolean(hardSync));
//     } catch (e) {
//       setSubError("Failed to refresh usage. Please try again.");
//     }
//   }

//   if (loading) {
//     // While loading, show cached snapshot if present (professional + stable)
//     if (cached && user) {
//       return (
//         <div className="min-h-screen bg-gray-50">
//           <header className="bg-white border-b border-gray-200">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex justify-between items-center h-16">
//                 <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
//                   <PixelPerfectLogo size={40} showText={true} />
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <span className="text-sm text-gray-600 hidden sm:block">
//                     {user?.username || "User"}
//                   </span>
//                   <button
//                     onClick={logout}
//                     className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </header>

//           <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//             <div className="text-center mb-6 sm:mb-8">
//               <div className="flex justify-center items-center mb-4">
//                 <PixelPerfectLogo size={64} showText={false} />
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//                 Welcome back, {user?.username || "User"}! 👋
//               </h2>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 Loading latest usage… showing last known snapshot for now.
//               </p>
//               {apiStatus && apiStatus !== "healthy" && (
//                 <p className="text-xs text-gray-500 mt-2">
//                   API status: <span className="font-semibold">{apiStatus}</span>
//                 </p>
//               )}
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-900">📊 Subscription Status</h3>
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tierPillClass(effectiveTier)}`}>
//                   {prettyTierLabel(effectiveTier)}
//                 </span>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <StatCard
//                   value={screenshotsUsed}
//                   label="Screenshots Used"
//                   limit={screenshotsLimit}
//                   valueClass="text-blue-600"
//                 />
//                 <StatCard
//                   value={batchUsed}
//                   label="Batch Requests"
//                   limit={batchLimit}
//                   valueClass="text-purple-600"
//                 />
//                 <StatCard
//                   value={apiCallsUsed}
//                   label="API Calls"
//                   limit={apiCallsLimit}
//                   valueClass="text-green-600"
//                 />
//               </div>

//               <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
//                 <button
//                   onClick={() => handleRefreshUsage(false)}
//                   className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                 >
//                   🔄 Refresh Usage
//                 </button>
//                 {effectiveTier === "free" && (
//                   <button
//                     onClick={() => navigate("/pricing")}
//                     className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
//                   >
//                     ⬆️ Upgrade to Pro
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center gap-3">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
//                 <p className="text-gray-700 font-medium">Finalizing dashboard…</p>
//               </div>
//             </div>
//           </main>
//         </div>
//       );
//     }

//     // Normal loading screen if no cache
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

//   // If subscriptionStatus is missing and we also have no cache, show warning (but still professional)
//   const showSubWarning = !subscriptionStatus && !cached;

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
//         {/* Page Header */}
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

//           {showSubWarning && (
//             <div className="mt-4 max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 text-sm">
//               Usage data is not available yet. You can still use the dashboard — try refreshing.
//             </div>
//           )}

//           {subError && (
//             <div className="mt-4 max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
//               {subError}
//             </div>
//           )}
//         </div>

//         {/* Subscription Status */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900">📊 Subscription Status</h3>
//             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tierPillClass(effectiveTier)}`}>
//               {prettyTierLabel(effectiveTier)}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <StatCard
//               value={screenshotsUsed}
//               label="Screenshots Used"
//               limit={screenshotsLimit}
//               valueClass="text-blue-600"
//             />
//             <StatCard
//               value={batchUsed}
//               label="Batch Requests"
//               limit={batchLimit}
//               valueClass="text-purple-600"
//             />
//             <StatCard
//               value={apiCallsUsed}
//               label="API Calls"
//               limit={apiCallsLimit}
//               valueClass="text-green-600"
//             />
//           </div>

//           <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() => handleRefreshUsage(false)}
//               className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//             >
//               🔄 Refresh Usage
//             </button>
//             <button
//               onClick={() => handleRefreshUsage(true)}
//               className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//               title="Forces server-side sync (if your SubscriptionContext uses ?sync=1)"
//             >
//               🧩 Hard Sync
//             </button>
//             {effectiveTier === "free" && (
//               <button
//                 onClick={() => navigate("/pricing")}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
//               >
//                 ⬆️ Upgrade to Pro
//               </button>
//             )}
//           </div>
//         </div>

//         {/* API Key Display */}
//         <ApiKeyDisplay />

//         {/* Quick Actions */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             <QuickAction onClick={() => navigate("/screenshot")} icon="📸" title="Take Screenshot" subtitle="Capture any website" />
//             <QuickAction
//               onClick={isBatchAvailable ? () => navigate("/batch") : undefined}
//               icon="📦"
//               title="Batch Processing"
//               subtitle={isBatchAvailable ? "Multiple screenshots" : "Pro plan required"}
//               disabled={!isBatchAvailable}
//             />
//             <QuickAction onClick={() => navigate("/documentation")} icon="📚" title="Documentation" subtitle="API reference" />
//             <QuickAction onClick={() => navigate("/activity")} icon="📊" title="Activity Log" subtitle="View your history" />
//             <QuickAction onClick={() => navigate("/pricing")} icon="💳" title="Pricing Plans" subtitle="View all tiers" />
//             <QuickAction onClick={() => navigate("/help")} icon="❓" title="Help Center" subtitle="Get support" />
//           </div>
//         </div>

//         {/* Account Info */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">👤 Account Information</h3>
//           <div className="space-y-3">
//             <InfoRow label="Username" value={user?.username || "—"} />
//             <InfoRow label="Email" value={user?.email || "—"} />
//             <InfoRow label="Member Since" value={memberSince ?? "—"} />
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
//               <span className="text-gray-600 font-medium mb-1 sm:mb-0">Account Status</span>
//               <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
//                 Active
//               </span>
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

//         {/* OneTechly Blog Section */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex items-center justify-between mb-5">
//             <div>
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
//                 ✍️ From the OneTechly Blog
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 Developer insights, guides, and real-world engineering articles
//               </p>
//             </div>

//             <button
//               onClick={() => navigate("/blog")}
//               className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Visit Blog
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {BLOG_POSTS.map((post) => (
//               <a
//                 key={post.url}
//                 href={post.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex flex-col border border-gray-200 rounded-xl p-4 hover:border-blue-400
//                            hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.tagColor}`}>
//                     {post.tag}
//                   </span>
//                   <span className="text-xs text-gray-400">{post.date}</span>
//                 </div>

//                 <div className="flex items-start gap-2 mb-2">
//                   <span className="text-xl flex-shrink-0">{post.icon}</span>
//                   <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
//                     {post.title}
//                   </h4>
//                 </div>

//                 <p className="text-xs text-gray-600 leading-relaxed flex-1 line-clamp-3 mb-3">
//                   {post.excerpt}
//                 </p>

//                 <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-1 mt-auto">
//                   Read article
//                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </span>
//               </a>
//             ))}
//           </div>

//           <div className="mt-4 sm:hidden">
//             <button
//               onClick={() => navigate("/blog")}
//               className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Visit Blog
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
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
//                 OneTechly
//               </button>
//               .
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button onClick={() => navigate("/terms")} className="hover:text-blue-600 transition-colors">
//                 Terms
//               </button>
//               <button onClick={() => navigate("/privacy")} className="hover:text-blue-600 transition-colors">
//                 Privacy
//               </button>
//               <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">
//                 Docs
//               </button>
//               <button onClick={() => navigate("/contact")} className="hover:text-blue-600 transition-colors">
//                 Contact
//               </button>
//               <button onClick={() => navigate("/blog")} className="hover:text-blue-600 transition-colors">
//                 Blog
//               </button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // ============================================================================
// // UI Helper Components
// // ============================================================================
// function StatCard({ value, label, limit, valueClass }) {
//   const unlimited = isUnlimited(limit);
//   const showLimit = limit !== undefined && limit !== null && limit !== "" && !unlimited;

//   return (
//     <div className="bg-gray-50 rounded-lg p-4">
//       <div className={`text-2xl sm:text-3xl font-bold mb-1 ${valueClass}`}>{value}</div>
//       <div className="text-xs sm:text-sm text-gray-600">{label}</div>
//       {unlimited && <div className="text-xs text-gray-500 mt-1">unlimited</div>}
//       {showLimit && <div className="text-xs text-gray-500 mt-1">of {String(limit)} limit</div>}
//     </div>
//   );
// }

// function QuickAction({ onClick, icon, title, subtitle, disabled = false }) {
//   const baseClasses = "flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all";
//   const enabledClasses = "border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer";
//   const disabledClasses = "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60";

//   return (
//     <button
//       onClick={disabled ? undefined : onClick}
//       disabled={disabled}
//       className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
//       title={disabled ? subtitle : ""}
//       type="button"
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


//////////////////////////////////////////////////////////////////////////
// // ============================================================================
// // DASHBOARD PAGE - PRODUCTION READY
// // ============================================================================
// // File: frontend/src/pages/DashboardPage.js
// // Author: OneTechly
// // Updated: February 2026
// //
// // ✅ PRODUCTION FEATURES:
// // - Centered PixelPerfect logo in page header
// // - AuthContext + SubscriptionContext as source of truth
// // - Batch Processing correctly disabled for free tier
// // - Consistent UI design with Activity and Screenshot pages
// // - Professional loading states and error handling
// //
// // ✅ FIX (Member Since flash):
// // - No more "N/A" on first load while user profile hydrates
// // - Robust parsing across common field names
// //
// // ✅ NEW (Feb 2026):
// // - OneTechly blog section with featured posts
// //   Cross-promotes the blog for Google Analytics + AdSense exposure
// // ============================================================================

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import ApiKeyDisplay from "../components/ApiKeyDisplay";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";
// import { useAuth } from "../contexts/AuthContext";
// import { useSubscription } from "../contexts/SubscriptionContext";

// // ============================================================================
// // OneTechly blog posts — update URLs / titles / excerpts as new posts publish
// // These are hardcoded intentionally so the section is fast (no API call needed)
// // and benefits from Google's indexing of static outbound links.
// // ============================================================================
// const BLOG_POSTS = [
//   {
//     title: "Peer-to-Peer (P2P) Technology: Powering Decentralization Across Industries",
//     excerpt: "Explore how P2P systems underpin everything from BitTorrent to blockchain, and why decentralized architectures are reshaping the web.",
//     tag: "Architecture",
//     tagColor: "bg-purple-100 text-purple-700",
//     url: "https://onetechlyambr19.blogspot.com/2024/11/peer-to-peer-peer-to-peer-p2p.html",
//     date: "Nov 02, 2024",
//     icon: "🔗",
//   },
//   {
//     title: "Implementing AdSense and Google Analytics: A Complete Guide to Website Monetization and Tracking",
//     excerpt: "Understanding your audience and generating revenue are two pillars of a successful online presence. Learn how to integrate Google AdSense and GA4 into any web project.",
//     tag: "Analytics",
//     tagColor: "bg-orange-100 text-orange-700",
//     url: "https://onetechlyambr19.blogspot.com/2025/12/blog-post_29.html",
//     date: "Dec 29, 2025",
//     icon: "📊",
//   },
//   {
//     title: "Cross-Platform npm Scripts: Why Your Windows Commands Fail on macOS/Linux (and How to Fix Them)",
//     excerpt: "npm scripts using Windows-style 'set VARIABLE=value &&' break on macOS and Linux. Discover how cross-env solves this and how to write truly cross-platform build scripts.",
//     tag: "Node.js",
//     tagColor: "bg-lime-100 text-lime-700",
//     url: "https://onetechlyambr19.blogspot.com/2026/02/blog-post.html",
//     date: "Feb 04, 2026",
//     icon: "⚙️",
//   },
// ];

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const { user, isLoading: authLoading, isAuthenticated, logout, apiStatus } = useAuth();
//   const { subscriptionStatus, tier, isLoading: subLoading, refreshSubscriptionStatus } = useSubscription();

//   React.useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       window.location.replace("/login?next=%2Fdashboard");
//     }
//   }, [authLoading, isAuthenticated]);

//   const loading = authLoading || subLoading;

//   // ✅ Member Since (robust + avoids "N/A" flash)
//   const memberSince = React.useMemo(() => {
//     const raw =
//       user?.created_at ||
//       user?.createdAt ||
//       user?.created ||
//       user?.member_since ||
//       user?.memberSince;

//     if (!raw) return null;
//     const d = new Date(raw);
//     if (Number.isNaN(d.getTime())) return null;
//     return d.toLocaleDateString();
//   }, [user]);

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

//   const usage = subscriptionStatus?.usage || {};
//   const limits = subscriptionStatus?.limits || {};
//   const isBatchAvailable = tier !== "free";

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

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         {/* Page Header */}
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
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900">📊 Subscription Status</h3>
//             <span
//               className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                 tier === "free"
//                   ? "bg-blue-100 text-blue-800"
//                   : tier === "pro"
//                   ? "bg-purple-100 text-purple-800"
//                   : tier === "business"
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-green-100 text-green-800"
//               }`}
//             >
//               {(tier || "free").toUpperCase()}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <StatCard value={usage.screenshots ?? 0}    label="Screenshots Used"  limit={limits.screenshots}   valueClass="text-blue-600"   />
//             <StatCard value={usage.batch_requests ?? 0} label="Batch Requests"    limit={limits.batch_requests} valueClass="text-purple-600" />
//             <StatCard value={usage.api_calls ?? 0}      label="API Calls"         limit={limits.api_calls}      valueClass="text-green-600"  />
//           </div>


//           <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() => refreshSubscriptionStatus(true)}
//               className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//             >
//               🔄 Refresh Usage
//             </button>
//             {tier === "free" && (
//               <button
//                 onClick={() => navigate("/pricing")}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
//               >
//                 ⬆️ Upgrade to Pro
//               </button>
//             )}
//           </div>
//         </div>

//         {/* API Key Display */}
//         <ApiKeyDisplay />

//         {/* Quick Actions */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             <QuickAction onClick={() => navigate("/screenshot")}    icon="📸" title="Take Screenshot"    subtitle="Capture any website" />
//             <QuickAction
//               onClick={isBatchAvailable ? () => navigate("/batch") : undefined}
//               icon="📦"
//               title="Batch Processing"
//               subtitle={isBatchAvailable ? "Multiple screenshots" : "Pro plan required"}
//               disabled={!isBatchAvailable}
//             />
//             <QuickAction onClick={() => navigate("/documentation")} icon="📚" title="Documentation"      subtitle="API reference" />
//             <QuickAction onClick={() => navigate("/activity")}      icon="📊" title="Activity Log"       subtitle="View your history" />
//             <QuickAction onClick={() => navigate("/pricing")}       icon="💳" title="Pricing Plans"      subtitle="View all tiers" />
//             <QuickAction onClick={() => navigate("/help")}          icon="❓" title="Help Center"        subtitle="Get support" />
//           </div>
//         </div>

//         {/* Account Info */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">👤 Account Information</h3>
//           <div className="space-y-3">
//             <InfoRow label="Username"     value={user?.username || "—"} />
//             <InfoRow label="Email"        value={user?.email || "—"} />
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

//         {/* ====================================================================
//             ✅ NEW: OneTechly Blog Section
//             Cross-promotes the blog for Google Analytics + AdSense
//             Static links = fast render + indexable by Google
//         ===================================================================== */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           {/* Section header */}
//           <div className="flex items-center justify-between mb-5">
//             <div>
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
//                 ✍️ From the OneTechly Blog
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 Developer insights, guides, and real-world engineering articles
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/blog")}
//               className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Visit Blog
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>

//           {/* Blog post cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {BLOG_POSTS.map((post) => (
//               <a
//                 key={post.url}
//                 href={post.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex flex-col border border-gray-200 rounded-xl p-4 hover:border-blue-400
//                            hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white"
//               >
//                 {/* Tag + date */}
//                 <div className="flex items-center justify-between mb-3">
//                   <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.tagColor}`}>
//                     {post.tag}
//                   </span>
//                   <span className="text-xs text-gray-400">{post.date}</span>
//                 </div>

//                 {/* Icon + title */}
//                 <div className="flex items-start gap-2 mb-2">
//                   <span className="text-xl flex-shrink-0">{post.icon}</span>
//                   <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
//                     {post.title}
//                   </h4>
//                 </div>

//                 {/* Excerpt */}
//                 <p className="text-xs text-gray-600 leading-relaxed flex-1 line-clamp-3 mb-3">
//                   {post.excerpt}
//                 </p>

//                 {/* CTA */}
//                 <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-1 mt-auto">
//                   Read article
//                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </span>
//               </a>
//             ))}
//           </div>

//           {/* Mobile "Visit Blog" button */}
//           <div className="mt-4 sm:hidden">
//             <button
//               onClick={() => navigate("/blog")}
//               className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Visit Blog
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>
//         {/* === END OneTechly Blog Section === */}

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
//                 OneTechly
//               </button>.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button onClick={() => navigate("/terms")}         className="hover:text-blue-600 transition-colors">Terms</button>
//               <button onClick={() => navigate("/privacy")}       className="hover:text-blue-600 transition-colors">Privacy</button>
//               <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">Docs</button>
//               <button onClick={() => navigate("/contact")}       className="hover:text-blue-600 transition-colors">Contact</button>
//               <button onClick={() => navigate("/blog")} className="hover:text-blue-600 transition-colors">Blog</button>
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

// function StatCard({ value, label, limit, valueClass }) {
//   const showLimit = limit !== undefined && limit !== null && limit !== "" && limit !== "unlimited";
//   return (
//     <div className="bg-gray-50 rounded-lg p-4">
//       <div className={`text-2xl sm:text-3xl font-bold mb-1 ${valueClass}`}>{value}</div>
//       <div className="text-xs sm:text-sm text-gray-600">{label}</div>
//       {showLimit && <div className="text-xs text-gray-500 mt-1">of {String(limit)} limit</div>}
//     </div>
//   );
// }

// function QuickAction({ onClick, icon, title, subtitle, disabled = false }) {
//   const baseClasses     = "flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all";
//   const enabledClasses  = "border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer";
//   const disabledClasses = "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60";

//   return (
//     <button
//       onClick={disabled ? undefined : onClick}
//       disabled={disabled}
//       className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
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

