// ============================================================================
// DASHBOARD PAGE - REACT COMPONENT
// ============================================================================
// File: frontend/src/pages/DashboardPage.js
// Author: OneTechly
// Purpose: Main dashboard with API key management
// Updated: January 2026

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiKeyDisplay from '../components/ApiKeyDisplay';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user info
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userResponse.data);

      // Fetch subscription status
      const subResponse = await axios.get(`${API_URL}/subscription_status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscription(subResponse.data);

      setLoading(false);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.detail || 'Failed to load dashboard data');
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-large mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchDashboardData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header-sticky">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <svg 
                data-app-logo 
                className="w-10 h-10 sm:w-12 sm:h-12" 
                viewBox="0 0 200 200" 
                fill="none"
              >
                <rect width="200" height="200" rx="40" fill="#3B82F6"/>
                <path d="M60 100L90 70L120 100L150 70" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="100" cy="140" r="8" fill="white"/>
              </svg>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  PixelPerfect
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Dashboard</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="btn-ghost text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-responsive py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'User'}! 👋
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your API keys, view usage, and configure your account.
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              📊 Subscription Status
            </h3>
            <span className={`badge ${
              subscription?.tier === 'free' ? 'badge-blue' : 
              subscription?.tier === 'pro' ? 'badge-purple' : 
              'badge-yellow'
            }`}>
              {subscription?.tier?.toUpperCase() || 'FREE'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                {subscription?.usage?.screenshots || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Screenshots Used
              </div>
              {subscription?.limits?.screenshots && (
                <div className="text-xs text-gray-500 mt-1">
                  of {subscription.limits.screenshots} limit
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                {subscription?.usage?.batch_requests || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Batch Requests
              </div>
              {subscription?.limits?.batch_requests && (
                <div className="text-xs text-gray-500 mt-1">
                  of {subscription.limits.batch_requests} limit
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                {subscription?.usage?.api_calls || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                API Calls
              </div>
              {subscription?.limits?.api_calls && (
                <div className="text-xs text-gray-500 mt-1">
                  of {subscription.limits.api_calls} limit
                </div>
              )}
            </div>
          </div>

          {subscription?.tier === 'free' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => navigate('/pricing')}
                className="btn-primary w-full sm:w-auto"
              >
                ⬆️ Upgrade to Pro
              </button>
            </div>
          )}
        </div>

        {/* API Key Display - NEW! */}
        <ApiKeyDisplay />

        {/* Quick Actions */}
        <div className="card mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            ⚡ Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button 
              onClick={() => navigate('/screenshot')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="text-3xl">📸</div>
              <div>
                <div className="font-semibold text-gray-900">Take Screenshot</div>
                <div className="text-sm text-gray-600">Capture any website</div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/batch')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
            >
              <div className="text-3xl">📦</div>
              <div>
                <div className="font-semibold text-gray-900">Batch Processing</div>
                <div className="text-sm text-gray-600">Multiple screenshots</div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/documentation')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
            >
              <div className="text-3xl">📚</div>
              <div>
                <div className="font-semibold text-gray-900">Documentation</div>
                <div className="text-sm text-gray-600">API reference</div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/activity')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left"
            >
              <div className="text-3xl">📊</div>
              <div>
                <div className="font-semibold text-gray-900">Activity Log</div>
                <div className="text-sm text-gray-600">View your history</div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              <div className="text-3xl">💳</div>
              <div>
                <div className="font-semibold text-gray-900">Pricing Plans</div>
                <div className="text-sm text-gray-600">View all tiers</div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/help')}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all text-left"
            >
              <div className="text-3xl">❓</div>
              <div>
                <div className="font-semibold text-gray-900">Help Center</div>
                <div className="text-sm text-gray-600">Get support</div>
              </div>
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="card">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            👤 Account Information
          </h3>
          
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">Username</span>
              <span className="text-gray-900 font-semibold">{user?.username}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">Email</span>
              <span className="text-gray-900 font-semibold">{user?.email}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">Member Since</span>
              <span className="text-gray-900 font-semibold">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">Account Status</span>
              <span className="badge badge-green">Active</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate('/settings')}
              className="btn-secondary flex-1"
            >
              ⚙️ Account Settings
            </button>
            <button 
              onClick={() => navigate('/change-password')}
              className="btn-secondary flex-1"
            >
              🔑 Change Password
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container-responsive py-6 sm:py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              © 2026 PixelPerfect API. Built by OneTechly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/terms')} className="hover:text-blue-600">
                Terms
              </button>
              <button onClick={() => navigate('/privacy')} className="hover:text-blue-600">
                Privacy
              </button>
              <button onClick={() => navigate('/documentation')} className="hover:text-blue-600">
                Docs
              </button>
              <button onClick={() => navigate('/contact')} className="hover:text-blue-600">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;

//===========================================================
// // ========================================
// // DASHBOARD PAGE - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/pages/DashboardPage.js
// // Author: OneTechly
// // Purpose: Main dashboard landing page after login
// // Updated: January 2026 - Fixed logo consistency (removed AppBrand, using PixelPerfectLogo)

// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { useSubscription } from '../contexts/SubscriptionContext';
// import { getDisplayEmail, getDisplayName } from '../utils/userDisplay';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';
// import toast from 'react-hot-toast';

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   'http://localhost:8000';

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const { user, token, logout, isAuthenticated } = useAuth();
//   const { subscriptionStatus, tier, refreshSubscriptionStatus } = useSubscription();

//   const [recentActivity, setRecentActivity] = useState([]);
//   const [isLoadingActivity, setIsLoadingActivity] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const userEmail = getDisplayEmail(user);
//   const userName = getDisplayName(user);
//   const planTier = (tier || 'free').toLowerCase();
//   const isActive = planTier !== 'free';

//   const clampCount = (usage, limit) => {
//     if (limit === 'unlimited' || limit === Infinity || limit == null) return usage ?? 0;
//     return Math.min(Number(usage || 0), Number(limit || 0));
//   };

//   const fetchRecentActivity = useCallback(async () => {
//     if (!token) return;
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/user/recent-activity`, {
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setRecentActivity(data.activities || []);
//       }
//     } catch (error) {
//       console.error('Error fetching recent activity:', error);
//     } finally {
//       setIsLoadingActivity(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }
//     (async () => {
//       await refreshSubscriptionStatus({ force: true, sync: false });
//       fetchRecentActivity();
//     })();
//   }, [isAuthenticated, navigate, refreshSubscriptionStatus, fetchRecentActivity, user?.username]);

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     try {
//       await Promise.all([fetchRecentActivity(), refreshSubscriptionStatus({ force: true, sync: true })]);
//       toast.success('Dashboard refreshed!');
//     } catch (e) {
//       console.error('Error in Dashboard refresh:', e);
//       toast.error('Failed to refresh dashboard');
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   const formatUsage = () => {
//     const usage = subscriptionStatus?.usage?.screenshots ?? 0;
//     const limit = subscriptionStatus?.limits?.screenshots;
//     if (limit === 'unlimited' || limit === Infinity) return `${usage} / ∞`;
//     return `${clampCount(usage, limit)} / ${limit ?? 0}`;
//   };

//   const getUsageColor = () => {
//     const usage = subscriptionStatus?.usage?.screenshots ?? 0;
//     const limit = subscriptionStatus?.limits?.screenshots;
//     if (limit === 'unlimited' || limit === Infinity) return 'text-green-600';
//     const safe = clampCount(usage, limit);
//     const percentage = (Number(limit || 1) === 0) ? 0 : (safe / Number(limit || 1)) * 100;
//     if (percentage >= 100) return 'text-red-600';
//     if (percentage >= 80) return 'text-yellow-600';
//     return 'text-green-600';
//   };

//   const formatResetDate = () => {
//     if (!subscriptionStatus || !subscriptionStatus.next_reset) return null;
//     const d = new Date(subscriptionStatus.next_reset);
//     const opts = { month: 'short', day: 'numeric' };
//     return d.toLocaleDateString(undefined, opts);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ============ FIXED: Professional Header with PixelPerfect Logo (Top-Left) ============ */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* ✅ FIXED: PixelPerfect Logo (Left) - clickable to dashboard */}
//             <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>

//             {/* User info (Right) */}
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 hidden sm:block">
//                 {userName}
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
//       <div className="max-w-6xl mx-auto p-6">

//         {/* ============ Centered Page Header ============ */}
//         <div className="flex flex-col items-center text-center mb-6">
//           {/* Centered logo icon */}
//           <div className="mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>

//           <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Dashboard</h1>
//           <p className="text-sm text-gray-600">
//             Logged in as: <span className="font-medium text-blue-700">{userName}</span>{' '}
//             (<span className="font-mono">{userEmail}</span>)
//           </p>
//         </div>

//         {/* ============ Subscription Status ============ */}
//         <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Subscription Status</h2>
//             <button
//               onClick={handleRefresh}
//               disabled={isRefreshing}
//               className="text-blue-600 hover:text-blue-800 transition-colors text-sm disabled:opacity-50 flex items-center gap-1"
//             >
//               <svg
//                 className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                 />
//               </svg>
//               {isRefreshing ? 'Refreshing...' : 'Refresh'}
//             </button>
//           </div>

//           <div className="bg-gray-50 rounded-lg p-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//               <div className="text-center">
//                 <div className="text-sm text-gray-600">
//                   Email: <span className="font-mono">{userEmail}</span>
//                 </div>
//                 <div className="text-sm text-gray-600 mt-1">
//                   Current Plan:{' '}
//                   <span className="font-semibold capitalize text-blue-600">{planTier || 'free'}</span>
//                 </div>
//                 <div className={`text-sm mt-1 ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
//                   {isActive ? '✅ Active Subscription' : 'Inactive'}
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-sm text-gray-600 mb-2">Usage Overview</div>
//                 <div className="text-xs space-y-1">
//                   <div>
//                     📸 <span className={getUsageColor()}>Screenshots: {formatUsage()}</span>
//                   </div>
//                 </div>
//                 {subscriptionStatus?.next_reset && (
//                   <div className="mt-2 text-xs text-gray-500">Resets {formatResetDate()}</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ============ Quick Actions ============ */}
//         <section className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <button
//               onClick={() => navigate('/screenshot')}
//               className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
//             >
//               <div className="text-2xl mb-2">📸</div>
//               <div className="font-semibold">Capture Screenshot</div>
//               <div className="text-sm opacity-90">Take a screenshot of any website</div>
//             </button>
//             <button
//               onClick={() => navigate('/history')}
//               className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors shadow-sm"
//             >
//               <div className="text-2xl mb-2">📚</div>
//               <div className="font-semibold">History</div>
//               <div className="text-sm opacity-90">View your screenshot history</div>
//             </button>
//             <button
//               onClick={() => navigate('/subscription')}
//               className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
//             >
//               <div className="text-2xl mb-2">💳</div>
//               <div className="font-semibold">Subscription</div>
//               <div className="text-sm opacity-90">Manage your plan and billing</div>
//             </button>
//           </div>

//           {(planTier === 'pro' || planTier === 'business' || planTier === 'premium') && (
//             <div className="mt-4">
//               <button
//                 onClick={() => navigate('/batch')}
//                 className="w-full bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
//               >
//                 <div className="text-2xl mb-2">⚙️</div>
//                 <div className="font-semibold">Batch Screenshots</div>
//                 <div className="text-sm opacity-90">Process multiple website screenshots at once</div>
//               </button>
//             </div>
//           )}
//         </section>

//         {/* ============ Recent Activity ============ */}
//         <section className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-5 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
//               <button
//                 onClick={() => navigate('/activity')}
//                 className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
//               >
//                 View All
//               </button>
//             </div>
//           </div>
//           <div className="p-5">
//             {isLoadingActivity ? (
//               <div className="text-center py-8">
//                 <div className="text-2xl mb-2">⏳</div>
//                 <div className="text-sm text-gray-600">Loading recent activity...</div>
//               </div>
//             ) : recentActivity.length === 0 ? (
//               <div className="text-center py-8">
//                 <div className="text-4xl mb-2">📸</div>
//                 <div className="text-sm text-gray-600">No recent activity</div>
//                 <div className="text-xs text-gray-500 mt-1">Start capturing screenshots to see your activity here</div>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {recentActivity.slice(0, 5).map((activity, index) => (
//                   <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//                     <div className="text-lg">{activity.icon || '📸'}</div>
//                     <div className="flex-1 min-w-0">
//                       <div className="font-medium text-gray-900 text-sm">{activity.action || 'Activity'}</div>
//                       <div className="text-xs text-gray-600 truncate">{activity.description}</div>
//                       <div className="text-xs text-gray-500 mt-1">{activity.timestamp || 'Just now'}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>

//         {/* ============ Footer ============ */}
//         <footer className="text-center mt-8 text-sm text-gray-500">
//           🚀 Ready to capture? • {planTier === 'premium' ? 'Unlimited' : planTier === 'pro' ? 'Pro' : planTier === 'business' ? 'Business' : 'Free'} Plan
//         </footer>
//       </div>
//     </div>
//   );
// }

