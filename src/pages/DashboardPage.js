// ============================================================================
// DASHBOARD PAGE - PRODUCTION READY (FIXED AUTH + LOADING + UI CONSISTENCY)
// ============================================================================
// File: frontend/src/pages/DashboardPage.js
// Author: OneTechly
// Updated: January 2026
//
// Fixes:
// - Uses AuthContext + SubscriptionContext as source of truth
// - Removes localStorage("token") mismatch (AuthContext uses "auth_token")
// - Removes duplicate axios calls to /users/me and /subscription_status
// - Prevents long "checking/loading" loops
// - FIXED: Consistent UI design with Activity and Screenshot pages
// - FIXED: Batch Processing disabled for free tier
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

  // If auth is done and user isn't authed, send to login (ProtectedRoute should already do this,
  // but this prevents edge cases if someone mounts Dashboard directly).
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.replace("/login?next=%2Fdashboard");
    }
  }, [authLoading, isAuthenticated]);

  const loading = authLoading || subLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {authLoading ? "Checking session..." : "Loading dashboard..."}
          </p>

          {/* Optional small hint if API is offline/unhealthy */}
          {apiStatus && apiStatus !== "healthy" && (
            <p className="text-xs text-gray-500 mt-2">
              API status: <span className="font-semibold">{apiStatus}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // If we got here and still no user, show a clean fallback (should be rare)
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

  // ✅ Check if batch processing is available
  const isBatchAvailable = tier !== 'free';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============ FIXED: Professional Header with PixelPerfect Logo ============ */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* ✅ FIXED: PixelPerfect Logo (Left) - consistent with other pages */}
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>

            {/* User info (Right) */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.username || 'User'}
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

      {/* ============ Main Content ============ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* ✅ FIXED: Centered Page Header (matching Activity and Screenshot pages) */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Centered logo icon */}
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>

          {/* Page title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          
          {/* Welcome message */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome back, {user?.username || "User"}! 👋
          </h2>
          
          {/* Subtitle */}
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
            <StatCard
              value={usage.screenshots ?? 0}
              label="Screenshots Used"
              limit={limits.screenshots}
              valueClass="text-blue-600"
            />
            <StatCard
              value={usage.batch_requests ?? 0}
              label="Batch Requests"
              limit={limits.batch_requests}
              valueClass="text-purple-600"
            />
            <StatCard
              value={usage.api_calls ?? 0}
              label="API Calls"
              limit={limits.api_calls}
              valueClass="text-green-600"
            />
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
            <QuickAction 
              onClick={() => navigate("/screenshot")} 
              icon="📸" 
              title="Take Screenshot" 
              subtitle="Capture any website" 
            />
            
            {/* ✅ FIXED: Batch Processing disabled for free tier */}
            <QuickAction 
              onClick={isBatchAvailable ? () => navigate("/batch") : undefined}
              icon="📦" 
              title="Batch Processing" 
              subtitle={isBatchAvailable ? "Multiple screenshots" : "Pro plan required"}
              disabled={!isBatchAvailable}
            />
            
            <QuickAction 
              onClick={() => navigate("/documentation")} 
              icon="📚" 
              title="Documentation" 
              subtitle="API reference" 
            />
            <QuickAction 
              onClick={() => navigate("/activity")} 
              icon="📊" 
              title="Activity Log" 
              subtitle="View your history" 
            />
            <QuickAction 
              onClick={() => navigate("/pricing")} 
              icon="💳" 
              title="Pricing Plans" 
              subtitle="View all tiers" 
            />
            <QuickAction 
              onClick={() => navigate("/help")} 
              icon="❓" 
              title="Help Center" 
              subtitle="Get support" 
            />
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">👤 Account Information</h3>

          <div className="space-y-3">
            <InfoRow label="Username" value={user?.username || "—"} />
            <InfoRow label="Email" value={user?.email || "—"} />
            <InfoRow
              label="Member Since"
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
            />
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
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">© 2026 PixelPerfect API. Built by OneTechly.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate("/terms")} className="hover:text-blue-600 transition-colors">
                Terms
              </button>
              <button onClick={() => navigate("/privacy")} className="hover:text-blue-600 transition-colors">
                Privacy
              </button>
              <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">
                Docs
              </button>
              <button onClick={() => navigate("/contact")} className="hover:text-blue-600 transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
  const baseClasses = "flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all";
  const enabledClasses = "border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer";
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
        {disabled && (
          <div className="text-xs text-red-600 mt-1">🔒 Upgrade required</div>
        )}
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

///////////////////////////////////////////////////////////////////////////////////////////
// // ============================================================================
// // DASHBOARD PAGE - PRODUCTION READY (FIXED AUTH + LOADING + UI CONSISTENCY)
// // ============================================================================
// // File: frontend/src/pages/DashboardPage.js
// // Author: OneTechly
// // Updated: January 2026
// //
// // Fixes:
// // - Uses AuthContext + SubscriptionContext as source of truth
// // - Removes localStorage("token") mismatch (AuthContext uses "auth_token")
// // - Removes duplicate axios calls to /users/me and /subscription_status
// // - Prevents long "checking/loading" loops
// // - FIXED: Consistent UI design with Activity and Screenshot pages
// // ============================================================================

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import ApiKeyDisplay from "../components/ApiKeyDisplay";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";
// import { useAuth } from "../contexts/AuthContext";
// import { useSubscription } from "../contexts/SubscriptionContext";

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const { user, isLoading: authLoading, isAuthenticated, logout, apiStatus } = useAuth();
//   const { subscriptionStatus, tier, isLoading: subLoading, refreshSubscriptionStatus } = useSubscription();

//   // If auth is done and user isn't authed, send to login (ProtectedRoute should already do this,
//   // but this prevents edge cases if someone mounts Dashboard directly).
//   React.useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       window.location.replace("/login?next=%2Fdashboard");
//     }
//   }, [authLoading, isAuthenticated]);

//   const loading = authLoading || subLoading;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">
//             {authLoading ? "Checking session..." : "Loading dashboard..."}
//           </p>

//           {/* Optional small hint if API is offline/unhealthy */}
//           {apiStatus && apiStatus !== "healthy" && (
//             <p className="text-xs text-gray-500 mt-2">
//               API status: <span className="font-semibold">{apiStatus}</span>
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // If we got here and still no user, show a clean fallback (should be rare)
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

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ============ FIXED: Professional Header with PixelPerfect Logo ============ */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* ✅ FIXED: PixelPerfect Logo (Left) - consistent with other pages */}
//             <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>

//             {/* User info (Right) */}
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 hidden sm:block">
//                 {user?.username || 'User'}
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

//       {/* ============ Main Content ============ */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
//         {/* ✅ FIXED: Centered Page Header (matching Activity and Screenshot pages) */}
//         <div className="text-center mb-6 sm:mb-8">
//           {/* Centered logo icon */}
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>

//           {/* Page title */}
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          
//           {/* Welcome message */}
//           <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//             Welcome back, {user?.username || "User"}! 👋
//           </h2>
          
//           {/* Subtitle */}
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
//             <StatCard
//               value={usage.screenshots ?? 0}
//               label="Screenshots Used"
//               limit={limits.screenshots}
//               valueClass="text-blue-600"
//             />
//             <StatCard
//               value={usage.batch_requests ?? 0}
//               label="Batch Requests"
//               limit={limits.batch_requests}
//               valueClass="text-purple-600"
//             />
//             <StatCard
//               value={usage.api_calls ?? 0}
//               label="API Calls"
//               limit={limits.api_calls}
//               valueClass="text-green-600"
//             />
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
//             <QuickAction 
//               onClick={() => navigate("/screenshot")} 
//               icon="📸" 
//               title="Take Screenshot" 
//               subtitle="Capture any website" 
//             />
//             <QuickAction 
//               onClick={() => navigate("/batch")} 
//               icon="📦" 
//               title="Batch Processing" 
//               subtitle="Multiple screenshots" 
//             />
//             <QuickAction 
//               onClick={() => navigate("/documentation")} 
//               icon="📚" 
//               title="Documentation" 
//               subtitle="API reference" 
//             />
//             <QuickAction 
//               onClick={() => navigate("/activity")} 
//               icon="📊" 
//               title="Activity Log" 
//               subtitle="View your history" 
//             />
//             <QuickAction 
//               onClick={() => navigate("/pricing")} 
//               icon="💳" 
//               title="Pricing Plans" 
//               subtitle="View all tiers" 
//             />
//             <QuickAction 
//               onClick={() => navigate("/help")} 
//               icon="❓" 
//               title="Help Center" 
//               subtitle="Get support" 
//             />
//           </div>
//         </div>

//         {/* Account Info */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">👤 Account Information</h3>

//           <div className="space-y-3">
//             <InfoRow label="Username" value={user?.username || "—"} />
//             <InfoRow label="Email" value={user?.email || "—"} />
//             <InfoRow
//               label="Member Since"
//               value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
//             />
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
//       <footer className="bg-white border-t border-gray-200 mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//           <div className="text-center text-sm text-gray-600">
//             <p className="mb-2">© 2026 PixelPerfect API. Built by OneTechly.</p>
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
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

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

// function QuickAction({ onClick, icon, title, subtitle }) {
//   return (
//     <button
//       onClick={onClick}
//       className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
//     >
//       <div className="text-3xl">{icon}</div>
//       <div>
//         <div className="font-semibold text-gray-900">{title}</div>
//         <div className="text-sm text-gray-600">{subtitle}</div>
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

