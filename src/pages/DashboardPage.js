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
// ✅ NEW (Feb 2026):
// - OneTechly blog section with featured posts
//   Cross-promotes the blog for Google Analytics + AdSense exposure
// ============================================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import ApiKeyDisplay from "../components/ApiKeyDisplay";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";

// ============================================================================
// OneTechly blog posts — update URLs / titles / excerpts as new posts publish
// These are hardcoded intentionally so the section is fast (no API call needed)
// and benefits from Google's indexing of static outbound links.
// ============================================================================
const BLOG_POSTS = [
  {
    title: "Peer-to-Peer (P2P) Technology: Powering Decentralization Across Industries",
    excerpt: "Explore how P2P systems underpin everything from BitTorrent to blockchain, and why decentralized architectures are reshaping the web.",
    tag: "Architecture",
    tagColor: "bg-purple-100 text-purple-700",
    url: "https://onetechlyambr19.blogspot.com/2024/11/peer-to-peer-peer-to-peer-p2p.html",
    date: "Nov 02, 2024",
    icon: "🔗",
  },
  {
    title: "SPA Routing Problems: Why Your React App Returns 404 on Refresh",
    excerpt: "The definitive guide to fixing client-side routing on Netlify, Render, Nginx, and Apache — with production-ready config examples.",
    tag: "React",
    tagColor: "bg-blue-100 text-blue-700",
    url: "https://onetechly.com/spa-routing-404-fix",
    date: "Dec 10, 2024",
    icon: "⚛️",
  },
  {
    title: "FastAPI + PostgreSQL on Render: Database Configuration Guide",
    excerpt: "From SQLite to PostgreSQL in production — environment variables, connection strings, migrations, and common pitfalls explained.",
    tag: "Backend",
    tagColor: "bg-green-100 text-green-700",
    url: "https://onetechly.com/fastapi-postgresql-render-guide",
    date: "Jan 15, 2025",
    icon: "🐍",
  },
];

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

        {/* ====================================================================
            ✅ NEW: OneTechly Blog Section
            Cross-promotes the blog for Google Analytics + AdSense
            Static links = fast render + indexable by Google
        ===================================================================== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                ✍️ From the OneTechly Blog
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Developer insights, guides, and real-world engineering articles
              </p>
            </div>
            <a
              href="https://onetechly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Visit Blog
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Blog post cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BLOG_POSTS.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col border border-gray-200 rounded-xl p-4 hover:border-blue-400
                           hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                {/* Tag + date */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.tagColor}`}>
                    {post.tag}
                  </span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>

                {/* Icon + title */}
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl flex-shrink-0">{post.icon}</span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </div>

                {/* Excerpt */}
                <p className="text-xs text-gray-600 leading-relaxed flex-1 line-clamp-3 mb-3">
                  {post.excerpt}
                </p>

                {/* CTA */}
                <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-1 mt-auto">
                  Read article
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            ))}
          </div>

          {/* Mobile "Visit Blog" button */}
          <div className="mt-4 sm:hidden">
            <a
              href="https://pixelperfectapi.net"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Visit OneTechly Blog
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        {/* === END OneTechly Blog Section === */}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              © 2026 PixelPerfect API. Built by{" "}
              <a
                href="https://onetechly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                OneTechly
              </a>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate("/terms")}         className="hover:text-blue-600 transition-colors">Terms</button>
              <button onClick={() => navigate("/privacy")}       className="hover:text-blue-600 transition-colors">Privacy</button>
              <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">Docs</button>
              <button onClick={() => navigate("/contact")}       className="hover:text-blue-600 transition-colors">Contact</button>
              <a
                href="https://onetechly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Blog
              </a>
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

// ===========================================================================================


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
//     url: "https://onetechly.com/p2p-technology-powering-decentralization",
//     date: "Nov 02, 2024",
//     icon: "🔗",
//   },
//   {
//     title: "SPA Routing Problems: Why Your React App Returns 404 on Refresh",
//     excerpt: "The definitive guide to fixing client-side routing on Netlify, Render, Nginx, and Apache — with production-ready config examples.",
//     tag: "React",
//     tagColor: "bg-blue-100 text-blue-700",
//     url: "https://onetechly.com/spa-routing-404-fix",
//     date: "Dec 10, 2024",
//     icon: "⚛️",
//   },
//   {
//     title: "FastAPI + PostgreSQL on Render: Database Configuration Guide",
//     excerpt: "From SQLite to PostgreSQL in production — environment variables, connection strings, migrations, and common pitfalls explained.",
//     tag: "Backend",
//     tagColor: "bg-green-100 text-green-700",
//     url: "https://onetechly.com/fastapi-postgresql-render-guide",
//     date: "Jan 15, 2025",
//     icon: "🐍",
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
//             <a
//               href="https://onetechly.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Visit Blog
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//               </svg>
//             </a>
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
//             <a
//               href="https://onetechly.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Visit OneTechly Blog
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//               </svg>
//             </a>
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
//               <a
//                 href="https://onetechly.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
//               >
//                 OneTechly
//               </a>.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button onClick={() => navigate("/terms")}         className="hover:text-blue-600 transition-colors">Terms</button>
//               <button onClick={() => navigate("/privacy")}       className="hover:text-blue-600 transition-colors">Privacy</button>
//               <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">Docs</button>
//               <button onClick={() => navigate("/contact")}       className="hover:text-blue-600 transition-colors">Contact</button>
//               <a
//                 href="https://onetechly.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hover:text-blue-600 transition-colors"
//               >
//                 Blog
//               </a>
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

