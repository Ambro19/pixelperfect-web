// ========================================
// APP.JS - UPDATED WITH BLOG ROUTES
// ========================================
// File: frontend/src/App.js
// Author: OneTechly
// Updated: January 2026
// ✅ NEW: Added PixelPerfect Blog routes (/blog, /blog/:slug)

import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Pages (existing imports)
import Marketing from './pages/Marketing';
import Documentation from './pages/Documentation';
import API from './pages/API';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Guides from './pages/Guides';
import ApiStatus from './pages/ApiStatus';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import ScreenshotPage from './pages/ScreenshotPage';
import Activity from './pages/Activity';
import History from './pages/History';
import BatchJobs from './pages/BatchJobs';
import SubscriptionPage from './pages/SubscriptionPage';
import AccountSettings from './pages/AccountSettings';

// ✅ NEW: Blog pages
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';

// Loading spinner component
function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
}

// --- Safe hard redirect (no History API usage) ---
function hardReplace(path) {
  if (typeof window === 'undefined') return;
  try {
    const target = path.startsWith('http')
      ? path
      : `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
    window.location.replace(target);
  } catch {
    window.location.href = path;
  }
}

// ✅ Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (didRedirect.current) return;
    if (!isLoading && !isAuthenticated) {
      didRedirect.current = true;
      const next = encodeURIComponent(location.pathname + location.search);
      hardReplace(`/login?next=${next}`);
    }
  }, [isAuthenticated, isLoading, location]);

  if (isLoading) return <LoadingSpinner label="Checking session..." />;
  if (!isAuthenticated) return <LoadingSpinner label="Redirecting to login..." />;

  return <ErrorBoundary>{children}</ErrorBoundary>;
}

// ✅ Public Route
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (didRedirect.current) return;
    if (!isLoading && isAuthenticated) {
      didRedirect.current = true;
      hardReplace('/dashboard');
    }
  }, [isAuthenticated, isLoading, location]);

  if (isLoading) return <LoadingSpinner label="Loading..." />;
  if (isAuthenticated) return <LoadingSpinner label="Redirecting to dashboard..." />;

  return children;
}

// Change Password Page Component
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to change password');

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => hardReplace('/dashboard'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        <div className="card max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">🔑 Change Password</h1>
          <p className="text-gray-600 mb-6">Update your password to keep your account secure.</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">✅ Password changed successfully! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
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
              <button type="button" onClick={() => window.history.back()} className="btn-secondary flex-1" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
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
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Marketing />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/status" element={<ApiStatus />} />
        <Route path="/api-status" element={<ApiStatus />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/api" element={<API />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />

        {/* ✅ NEW: Blog Routes */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/screenshot" element={<ProtectedRoute><ScreenshotPage /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/batch" element={<ProtectedRoute><BatchJobs /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

        {/* 404 Route */}
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
                    onClick={() => hardReplace('/')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Go Home
                  </button>
                  <button
                    onClick={() => hardReplace('/dashboard')}
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
    </ErrorBoundary>
  );
}

export default App;

