// ========================================
// APP.JS - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/App.js
// Author: OneTechly
// Purpose: Main application router
// Updated: January 2026 - ALL PAGES INTEGRATED + API KEY MANAGEMENT
//
// IMPORTANT: BrowserRouter and Toaster are in index.js
//            Do NOT add them here!

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// ========================================
// PUBLIC PAGES - Marketing & Information
// ========================================
import Marketing from './pages/Marketing';
import Documentation from './pages/Documentation';
import API from './pages/API';

// Company Section
import About from './pages/About';

// Product Section
import Features from './pages/Features';
import Pricing from './pages/Pricing';

// Resources Section
import Guides from './pages/Guides';
import ApiStatus from './pages/ApiStatus';

// Support Section
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Legal Pages
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

// ========================================
// AUTH PAGES
// ========================================
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';

// ========================================
// PROTECTED PAGES - Dashboard & Features
// ========================================
import DashboardPage from './pages/DashboardPage';
import ScreenshotPage from './pages/ScreenshotPage';
import Activity from './pages/Activity';
import History from './pages/History';
import BatchJobs from './pages/BatchJobs';
import SubscriptionPage from './pages/SubscriptionPage';

// ========================================
// ROUTE PROTECTION COMPONENTS
// ========================================

// Protected Route - Requires authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route - Redirects to dashboard if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ========================================
// TEMPORARY PLACEHOLDER COMPONENTS
// ========================================
// These will be replaced with actual components when created

const SettingsPage = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container-responsive py-8">
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">⚙️ Account Settings</h1>
        <p className="text-gray-600 mb-4">
          Manage your account settings, preferences, and profile information.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Coming Soon:</strong> Full settings page with profile editing,
            notification preferences, and more.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_URL}/user/change_password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to change password');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        <div className="card max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">🔑 Change Password</h1>
          <p className="text-gray-600 mb-6">
            Update your password to keep your account secure.
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Password changed successfully! Redirecting...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ========================================
// MAIN APP COMPONENT
// ========================================
function App() {
  return (
    <Routes>
      {/* ========================================
          MARKETING & PUBLIC ROUTES
          ======================================== */}
      
      {/* Home / Marketing */}
      <Route path="/" element={<Marketing />} />
      
      {/* Company Section */}
      <Route path="/about" element={<About />} />
      
      {/* Product Section */}
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      
      {/* Resources Section */}
      <Route path="/docs" element={<Documentation />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/status" element={<ApiStatus />} />
      <Route path="/api-status" element={<ApiStatus />} />
      
      {/* Support Section */}
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      
      {/* API Reference */}
      <Route path="/api" element={<API />} />

      {/* ========================================
          LEGAL ROUTES
          ======================================== */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />

      {/* ========================================
          AUTHENTICATION ROUTES
          ======================================== */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* ========================================
          PROTECTED DASHBOARD ROUTES
          ======================================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/screenshot"
        element={
          <ProtectedRoute>
            <ScreenshotPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <Activity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/batch"
        element={
          <ProtectedRoute>
            <BatchJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <SubscriptionPage />
          </ProtectedRoute>
        }
      />

      {/* ========================================
          ACCOUNT MANAGEMENT ROUTES - NEW!
          ======================================== */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* ========================================
          404 NOT FOUND ROUTE
          ======================================== */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
              <div className="text-6xl mb-4">📸</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page not found</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = '/')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go Home
                </button>
                <button
                  onClick={() => (window.location.href = '/dashboard')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;

// //============================================================
// // ========================================
// // APP.JS - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/App.js
// // Author: OneTechly
// // Purpose: Main application router
// // Updated: January 2026 - ALL PAGES INTEGRATED
// //
// // IMPORTANT: BrowserRouter and Toaster are in index.js
// //            Do NOT add them here!

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';

// // ========================================
// // PUBLIC PAGES - Marketing & Information
// // ========================================
// import Marketing from './pages/Marketing';
// import Documentation from './pages/Documentation';
// import API from './pages/API';

// // Company Section
// import About from './pages/About';

// // Product Section
// import Features from './pages/Features';
// import Pricing from './pages/Pricing';

// // Resources Section
// import Guides from './pages/Guides';
// import ApiStatus from './pages/ApiStatus';

// // Support Section
// import HelpCenter from './pages/HelpCenter';
// import Contact from './pages/Contact';
// import FAQ from './pages/FAQ';

// // Legal Pages
// import Privacy from './pages/Privacy';
// import Terms from './pages/Terms';
// import Cookies from './pages/Cookies';

// // ========================================
// // AUTH PAGES
// // ========================================
// import LoginPage from './pages/LoginPage';
// import Register from './pages/Register';

// // ========================================
// // PROTECTED PAGES - Dashboard & Features
// // ========================================
// import DashboardPage from './pages/DashboardPage';
// import ScreenshotPage from './pages/ScreenshotPage';
// import Activity from './pages/Activity';
// import History from './pages/History';
// import BatchJobs from './pages/BatchJobs';
// import SubscriptionPage from './pages/SubscriptionPage';

// // ========================================
// // ROUTE PROTECTION COMPONENTS
// // ========================================

// // Protected Route - Requires authentication
// function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// // Public Route - Redirects to dashboard if already logged in
// function PublicRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// }

// // ========================================
// // MAIN APP COMPONENT
// // ========================================
// function App() {
//   return (
//     <Routes>
//       {/* ========================================
//           MARKETING & PUBLIC ROUTES
//           ======================================== */}
      
//       {/* Home / Marketing */}
//       <Route path="/" element={<Marketing />} />
      
//       {/* Company Section */}
//       <Route path="/about" element={<About />} />
      
//       {/* Product Section */}
//       <Route path="/features" element={<Features />} />
//       <Route path="/pricing" element={<Pricing />} />
      
//       {/* Resources Section */}
//       <Route path="/docs" element={<Documentation />} />
//       <Route path="/documentation" element={<Documentation />} />
//       <Route path="/guides" element={<Guides />} />
//       <Route path="/status" element={<ApiStatus />} />
//       <Route path="/api-status" element={<ApiStatus />} />
      
//       {/* Support Section */}
//       <Route path="/help" element={<HelpCenter />} />
//       <Route path="/help-center" element={<HelpCenter />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/faq" element={<FAQ />} />
      
//       {/* API Reference */}
//       <Route path="/api" element={<API />} />

//       {/* ========================================
//           LEGAL ROUTES
//           ======================================== */}
//       <Route path="/privacy" element={<Privacy />} />
//       <Route path="/terms" element={<Terms />} />
//       <Route path="/cookies" element={<Cookies />} />

//       {/* ========================================
//           AUTHENTICATION ROUTES
//           ======================================== */}
//       <Route
//         path="/login"
//         element={
//           <PublicRoute>
//             <LoginPage />
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/register"
//         element={
//           <PublicRoute>
//             <Register />
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/signup"
//         element={
//           <PublicRoute>
//             <Register />
//           </PublicRoute>
//         }
//       />

//       {/* ========================================
//           PROTECTED DASHBOARD ROUTES
//           ======================================== */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/screenshot"
//         element={
//           <ProtectedRoute>
//             <ScreenshotPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/activity"
//         element={
//           <ProtectedRoute>
//             <Activity />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/history"
//         element={
//           <ProtectedRoute>
//             <History />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/batch"
//         element={
//           <ProtectedRoute>
//             <BatchJobs />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/subscription"
//         element={
//           <ProtectedRoute>
//             <SubscriptionPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* ========================================
//           404 NOT FOUND ROUTE
//           ======================================== */}
//       <Route
//         path="*"
//         element={
//           <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="text-center px-4">
//               <div className="text-6xl mb-4">📸</div>
//               <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
//               <p className="text-xl text-gray-600 mb-6">Page not found</p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={() => (window.location.href = '/')}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//                 >
//                   Go Home
//                 </button>
//                 <button
//                   onClick={() => (window.location.href = '/dashboard')}
//                   className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//                 >
//                   Dashboard
//                 </button>
//               </div>
//             </div>
//           </div>
//         }
//       />
//     </Routes>
//   );
// }

// export default App;

