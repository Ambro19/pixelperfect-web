// ============================================================================
// DASHBOARD PAGE - PRODUCTION READY (FIXED AUTH + LOADING)
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

import React from "react";
import { useNavigate } from "react-router-dom";
import ApiKeyDisplay from "../components/ApiKeyDisplay";
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 200 200" fill="none">
                <rect width="200" height="200" rx="40" fill="#3B82F6" />
                <path
                  d="M60 100L90 70L120 100L150 70"
                  stroke="white"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="100" cy="140" r="8" fill="white" />
              </svg>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">PixelPerfect</h1>
                <p className="text-xs sm:text-sm text-gray-600">Dashboard</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
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
                  : "bg-yellow-100 text-yellow-800"
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
            <QuickAction onClick={() => navigate("/screenshot")} icon="📸" title="Take Screenshot" subtitle="Capture any website" />
            <QuickAction onClick={() => navigate("/batch")} icon="📦" title="Batch Processing" subtitle="Multiple screenshots" />
            <QuickAction onClick={() => navigate("/documentation")} icon="📚" title="Documentation" subtitle="API reference" />
            <QuickAction onClick={() => navigate("/activity")} icon="📊" title="Activity Log" subtitle="View your history" />
            <QuickAction onClick={() => navigate("/pricing")} icon="💳" title="Pricing Plans" subtitle="View all tiers" />
            <QuickAction onClick={() => navigate("/help")} icon="❓" title="Help Center" subtitle="Get support" />
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
              <button onClick={() => navigate("/terms")} className="hover:text-blue-600 transition-colors">Terms</button>
              <button onClick={() => navigate("/privacy")} className="hover:text-blue-600 transition-colors">Privacy</button>
              <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">Docs</button>
              <button onClick={() => navigate("/contact")} className="hover:text-blue-600 transition-colors">Contact</button>
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

function QuickAction({ onClick, icon, title, subtitle }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
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



// ############################# IMPORTANT FOR MOBILE ALIGNEMENT: DashboardPage.js (Enhanced Mobile) #########################

// ============================================================================
// DASHBOARD PAGE - MOBILE-OPTIMIZED
// ============================================================================
// File: frontend/src/pages/DashboardPage.js
// Author: OneTechly
// Updated: January 2026 - Enhanced mobile responsiveness

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ApiKeyDisplay from '../components/ApiKeyDisplay';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [subscription, setSubscription] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           console.log('⚠️ No token found, redirecting to login');
//           navigate('/login');
//           return;
//         }

//         console.log('📊 Fetching dashboard data...');

//         // Fetch user info
//         const userResponse = await axios.get(`${API_URL}/users/me`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!mounted) return;
//         setUser(userResponse.data);
//         console.log('✅ User data loaded:', userResponse.data);

//         // Fetch subscription status
//         const subResponse = await axios.get(`${API_URL}/subscription_status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!mounted) return;
//         setSubscription(subResponse.data);
//         console.log('✅ Subscription data loaded:', subResponse.data);

//         setLoading(false);
//       } catch (err) {
//         console.error('❌ Dashboard data fetch error:', err);
        
//         if (!mounted) return;

//         if (err.response?.status === 401) {
//           console.log('🔒 Unauthorized - clearing token and redirecting');
//           localStorage.removeItem('token');
//           navigate('/login');
//         } else {
//           setError(err.response?.data?.detail || 'Failed to load dashboard data');
//           setLoading(false);
//         }
//       }
//     };

//     fetchDashboardData();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const handleLogout = () => {
//     console.log('👋 Logging out...');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-sm sm:text-base">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 sm:p-8 text-center">
//           <div className="text-red-600 text-4xl sm:text-5xl mb-4">⚠️</div>
//           <h2 className="text-lg sm:text-xl font-bold mb-2">Error Loading Dashboard</h2>
//           <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors active:scale-95"
//           >
//             Reload Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - Mobile Optimized */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-3 sm:py-4">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <svg 
//                 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" 
//                 viewBox="0 0 200 200" 
//                 fill="none"
//               >
//                 <rect width="200" height="200" rx="40" fill="#3B82F6"/>
//                 <path d="M60 100L90 70L120 100L150 70" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
//                 <circle cx="100" cy="140" r="8" fill="white"/>
//               </svg>
//               <div>
//                 <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
//                   PixelPerfect
//                 </h1>
//                 <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Dashboard</p>
//               </div>
//             </div>

//             <button 
//               onClick={handleLogout}
//               className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors active:scale-95"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Mobile Optimized */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//         {/* Welcome Section */}
//         <div className="mb-4 sm:mb-6 lg:mb-8">
//           <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, {user?.username || 'User'}! 👋
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600">
//             Manage your API keys, view usage, and configure your account.
//           </p>
//         </div>

//         {/* Subscription Status Card - Mobile Optimized */}
//         <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
//             <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
//               📊 Subscription Status
//             </h3>
//             <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
//               subscription?.tier === 'free' ? 'bg-blue-100 text-blue-800' : 
//               subscription?.tier === 'pro' ? 'bg-purple-100 text-purple-800' : 
//               'bg-yellow-100 text-yellow-800'
//             }`}>
//               {subscription?.tier?.toUpperCase() || 'FREE'}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//             <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
//               <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
//                 {subscription?.usage?.screenshots || 0}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600">
//                 Screenshots Used
//               </div>
//               {subscription?.limits?.screenshots && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   of {subscription.limits.screenshots} limit
//                 </div>
//               )}
//             </div>

//             <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
//               <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
//                 {subscription?.usage?.batch_requests || 0}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600">
//                 Batch Requests
//               </div>
//               {subscription?.limits?.batch_requests && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   of {subscription.limits.batch_requests} limit
//                 </div>
//               )}
//             </div>

//             <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
//               <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
//                 {subscription?.usage?.api_calls || 0}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600">
//                 API Calls
//               </div>
//               {subscription?.limits?.api_calls && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   of {subscription.limits.api_calls} limit
//                 </div>
//               )}
//             </div>
//           </div>

//           {subscription?.tier === 'free' && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <button 
//                 onClick={() => navigate('/pricing')}
//                 className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md active:scale-95 text-sm sm:text-base"
//               >
//                 ⬆️ Upgrade to Pro
//               </button>
//             </div>
//           )}
//         </div>

//         {/* API Key Display */}
//         <ApiKeyDisplay />

//         {/* Quick Actions - Mobile Optimized Grid */}
//         <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
//           <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
//             ⚡ Quick Actions
//           </h3>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
//             {[
//               { icon: '📸', title: 'Take Screenshot', desc: 'Capture any website', path: '/screenshot', color: 'blue' },
//               { icon: '📦', title: 'Batch Processing', desc: 'Multiple screenshots', path: '/batch', color: 'purple' },
//               { icon: '📚', title: 'Documentation', desc: 'API reference', path: '/documentation', color: 'green' },
//               { icon: '📊', title: 'Activity Log', desc: 'View your history', path: '/activity', color: 'yellow' },
//               { icon: '💳', title: 'Pricing Plans', desc: 'View all tiers', path: '/pricing', color: 'indigo' },
//               { icon: '❓', title: 'Help Center', desc: 'Get support', path: '/help', color: 'red' },
//             ].map((action) => (
//               <button 
//                 key={action.path}
//                 onClick={() => navigate(action.path)}
//                 className={`flex items-center gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all text-left active:scale-95 min-h-[80px] sm:min-h-[88px]`}
//               >
//                 <div className="text-2xl sm:text-3xl flex-shrink-0">{action.icon}</div>
//                 <div className="min-w-0">
//                   <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{action.title}</div>
//                   <div className="text-xs sm:text-sm text-gray-600 truncate">{action.desc}</div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Account Info - Mobile Optimized */}
//         <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//           <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
//             👤 Account Information
//           </h3>
          
//           <div className="space-y-2 sm:space-y-3">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-gray-200">
//               <span className="text-sm sm:text-base text-gray-600 font-medium mb-1 sm:mb-0">Username</span>
//               <span className="text-sm sm:text-base text-gray-900 font-semibold break-all">{user?.username}</span>
//             </div>
            
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-gray-200">
//               <span className="text-sm sm:text-base text-gray-600 font-medium mb-1 sm:mb-0">Email</span>
//               <span className="text-sm sm:text-base text-gray-900 font-semibold break-all">{user?.email}</span>
//             </div>
            
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-gray-200">
//               <span className="text-sm sm:text-base text-gray-600 font-medium mb-1 sm:mb-0">Member Since</span>
//               <span className="text-sm sm:text-base text-gray-900 font-semibold">
//                 {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
//               </span>
//             </div>
            
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3">
//               <span className="text-sm sm:text-base text-gray-600 font-medium mb-1 sm:mb-0">Account Status</span>
//               <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold w-fit">
//                 Active
//               </span>
//             </div>
//           </div>

//           <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-3">
//             <button 
//               onClick={() => navigate('/settings')}
//               className="flex-1 px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors active:scale-95 text-sm sm:text-base min-h-[44px]"
//             >
//               ⚙️ Account Settings
//             </button>
//             <button 
//               onClick={() => navigate('/change-password')}
//               className="flex-1 px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors active:scale-95 text-sm sm:text-base min-h-[44px]"
//             >
//               🔑 Change Password
//             </button>
//           </div>
//         </div>
//       </main>

//       {/* Footer - Mobile Optimized */}
//       <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//           <div className="text-center text-xs sm:text-sm text-gray-600">
//             <p className="mb-2">
//               © 2026 PixelPerfect API. Built by OneTechly.
//             </p>
//             <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
//               {[
//                 { label: 'Terms', path: '/terms' },
//                 { label: 'Privacy', path: '/privacy' },
//                 { label: 'Docs', path: '/documentation' },
//                 { label: 'Contact', path: '/contact' },
//               ].map((link) => (
//                 <button 
//                   key={link.path}
//                   onClick={() => navigate(link.path)} 
//                   className="hover:text-blue-600 transition-colors active:scale-95 min-h-[44px] px-2"
//                 >
//                   {link.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default DashboardPage;



//###################################################################################


// // ============================================================================== 
// // ============================================================================
// // DASHBOARD PAGE - REACT COMPONENT
// // ============================================================================
// // File: frontend/src/pages/DashboardPage.js
// // Author: OneTechly
// // Purpose: Main dashboard with API key management
// // Updated: January 2026

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ApiKeyDisplay from '../components/ApiKeyDisplay';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [subscription, setSubscription] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true; // ✅ Prevent state updates after unmount

//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         console.log('📊 Fetching dashboard data...'); // Debug log

//         // Fetch user info
//         const userResponse = await axios.get(`${API_URL}/users/me`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!mounted) return; // ✅ Don't update if unmounted
//         setUser(userResponse.data);
//         console.log('✅ User data loaded:', userResponse.data);

//         // Fetch subscription status
//         const subResponse = await axios.get(`${API_URL}/subscription_status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!mounted) return; // ✅ Don't update if unmounted
//         setSubscription(subResponse.data);
//         console.log('✅ Subscription data loaded:', subResponse.data);

//         setLoading(false);
//       } catch (err) {
//         console.error('❌ Dashboard data fetch error:', err);
        
//         if (!mounted) return; // ✅ Don't update if unmounted

//         if (err.response?.status === 401) {
//           localStorage.removeItem('token');
//           navigate('/login');
//         } else {
//           setError(err.response?.data?.detail || 'Failed to load dashboard data');
//           setLoading(false);
//         }
//       }
//     };

//     fetchDashboardData();

//     // ✅ Cleanup function
//     return () => {
//       mounted = false;
//     };
//   }, [navigate]); // ✅ Only re-run if navigate changes (it won't)

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="spinner-large mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="card max-w-md w-full text-center">
//           <div className="text-red-600 text-5xl mb-4">⚠️</div>
//           <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="btn-primary"
//           >
//             Reload Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="header-sticky">
//         <div className="container-responsive">
//           <div className="flex items-center justify-between py-4">
//             <div className="flex items-center gap-3">
//               <svg 
//                 data-app-logo 
//                 className="w-10 h-10 sm:w-12 sm:h-12" 
//                 viewBox="0 0 200 200" 
//                 fill="none"
//               >
//                 <rect width="200" height="200" rx="40" fill="#3B82F6"/>
//                 <path d="M60 100L90 70L120 100L150 70" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
//                 <circle cx="100" cy="140" r="8" fill="white"/>
//               </svg>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//                   PixelPerfect
//                 </h1>
//                 <p className="text-xs sm:text-sm text-gray-600">Dashboard</p>
//               </div>
//             </div>

//             <button 
//               onClick={handleLogout}
//               className="btn-ghost text-sm sm:text-base"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container-responsive py-6 sm:py-8">
//         {/* Welcome Section */}
//         <div className="mb-6 sm:mb-8">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, {user?.username || 'User'}! 👋
//           </h2>
//           <p className="text-gray-600 text-sm sm:text-base">
//             Manage your API keys, view usage, and configure your account.
//           </p>
//         </div>

//         {/* Subscription Status Card */}
//         <div className="card mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//               📊 Subscription Status
//             </h3>
//             <span className={`badge ${
//               subscription?.tier === 'free' ? 'badge-blue' : 
//               subscription?.tier === 'pro' ? 'badge-purple' : 
//               'badge-yellow'
//             }`}>
//               {subscription?.tier?.toUpperCase() || 'FREE'}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
//                 {subscription?.usage?.screenshots || 0}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600">
//                 Screenshots Used
//               </div>
//               {subscription?.limits?.screenshots && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   of {subscription.limits.screenshots} limit
//                 </div>
//               )}
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
//                 {subscription?.usage?.batch_requests || 0}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600">
//                 Batch Requests
//               </div>
//               {subscription?.limits?.batch_requests && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   of {subscription.limits.batch_requests} limit
//                 </div>
//               )}
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
//                 {subscription?.usage?.api_calls || 0}
//               </div>
//               <div className="text-xs sm:text-sm text-gray-600">
//                 API Calls
//               </div>
//               {subscription?.limits?.api_calls && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   of {subscription.limits.api_calls} limit
//                 </div>
//               )}
//             </div>
//           </div>

//           {subscription?.tier === 'free' && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <button 
//                 onClick={() => navigate('/pricing')}
//                 className="btn-primary w-full sm:w-auto"
//               >
//                 ⬆️ Upgrade to Pro
//               </button>
//             </div>
//           )}
//         </div>

//         {/* API Key Display */}
//         <ApiKeyDisplay />

//         {/* Quick Actions */}
//         <div className="card mb-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
//             ⚡ Quick Actions
//           </h3>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             <button 
//               onClick={() => navigate('/screenshot')}
//               className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
//             >
//               <div className="text-3xl">📸</div>
//               <div>
//                 <div className="font-semibold text-gray-900">Take Screenshot</div>
//                 <div className="text-sm text-gray-600">Capture any website</div>
//               </div>
//             </button>

//             <button 
//               onClick={() => navigate('/batch')}
//               className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
//             >
//               <div className="text-3xl">📦</div>
//               <div>
//                 <div className="font-semibold text-gray-900">Batch Processing</div>
//                 <div className="text-sm text-gray-600">Multiple screenshots</div>
//               </div>
//             </button>

//             <button 
//               onClick={() => navigate('/documentation')}
//               className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
//             >
//               <div className="text-3xl">📚</div>
//               <div>
//                 <div className="font-semibold text-gray-900">Documentation</div>
//                 <div className="text-sm text-gray-600">API reference</div>
//               </div>
//             </button>

//             <button 
//               onClick={() => navigate('/activity')}
//               className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left"
//             >
//               <div className="text-3xl">📊</div>
//               <div>
//                 <div className="font-semibold text-gray-900">Activity Log</div>
//                 <div className="text-sm text-gray-600">View your history</div>
//               </div>
//             </button>

//             <button 
//               onClick={() => navigate('/pricing')}
//               className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
//             >
//               <div className="text-3xl">💳</div>
//               <div>
//                 <div className="font-semibold text-gray-900">Pricing Plans</div>
//                 <div className="text-sm text-gray-600">View all tiers</div>
//               </div>
//             </button>

//             <button 
//               onClick={() => navigate('/help')}
//               className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all text-left"
//             >
//               <div className="text-3xl">❓</div>
//               <div>
//                 <div className="font-semibold text-gray-900">Help Center</div>
//                 <div className="text-sm text-gray-600">Get support</div>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Account Info */}
//         <div className="card">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
//             👤 Account Information
//           </h3>
          
//           <div className="space-y-3">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
//               <span className="text-gray-600 font-medium mb-1 sm:mb-0">Username</span>
//               <span className="text-gray-900 font-semibold">{user?.username}</span>
//             </div>
            
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
//               <span className="text-gray-600 font-medium mb-1 sm:mb-0">Email</span>
//               <span className="text-gray-900 font-semibold">{user?.email}</span>
//             </div>
            
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
//               <span className="text-gray-600 font-medium mb-1 sm:mb-0">Member Since</span>
//               <span className="text-gray-900 font-semibold">
//                 {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
//               </span>
//             </div>
            
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
//               <span className="text-gray-600 font-medium mb-1 sm:mb-0">Account Status</span>
//               <span className="badge badge-green">Active</span>
//             </div>
//           </div>

//           <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
//             <button 
//               onClick={() => navigate('/settings')}
//               className="btn-secondary flex-1"
//             >
//               ⚙️ Account Settings
//             </button>
//             <button 
//               onClick={() => navigate('/change-password')}
//               className="btn-secondary flex-1"
//             >
//               🔑 Change Password
//             </button>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-12">
//         <div className="container-responsive py-6 sm:py-8">
//           <div className="text-center text-sm text-gray-600">
//             <p className="mb-2">
//               © 2026 PixelPerfect API. Built by OneTechly.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button onClick={() => navigate('/terms')} className="hover:text-blue-600">
//                 Terms
//               </button>
//               <button onClick={() => navigate('/privacy')} className="hover:text-blue-600">
//                 Privacy
//               </button>
//               <button onClick={() => navigate('/documentation')} className="hover:text-blue-600">
//                 Docs
//               </button>
//               <button onClick={() => navigate('/contact')} className="hover:text-blue-600">
//                 Contact
//               </button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default DashboardPage;

