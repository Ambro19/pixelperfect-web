// ========================================
// APP.JS - UPDATED WITH HELP CENTER ROUTING
// ========================================
// File: frontend/src/App.js
// Author: OneTechly
// Update: April 2026
//
// ✅ CHANGES IN THIS VERSION:
// - Added Help Center article detail routing
// - Added Help Center category view routing
// - Integrated ArticleDetail and CategoryView components
// - Maintained all existing routes and functionality
// ========================================

import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// ========================================
// PUBLIC PAGES
// ========================================
import Marketing from './pages/Marketing';
import Documentation from './pages/Documentation';
import API from './pages/API';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import ApiStatus from './pages/ApiStatus';
import HelpCenter from './pages/HelpCenter';
import ArticleDetail from './pages/ArticleDetail'; // Update: April 2026 - NEW
import CategoryView from './pages/CategoryView'; // Update: April 2026 - NEW
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

// ========================================
// AUTH PAGES
// ========================================
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';

// ========================================
// PROTECTED PAGES
// ========================================
import DashboardPage from './pages/DashboardPage';
import ScreenshotPage from './pages/ScreenshotPage';
import Activity from './pages/Activity';
import History from './pages/History';
import BatchJobs from './pages/BatchJobs';
import SubscriptionPage from './pages/SubscriptionPage';
import AccountSettings from './pages/AccountSettings';
import ChangePassword from './pages/ChangePassword';

// ========================================
// BLOG PAGES
// ========================================
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';

// ========================================
// SYSTEM PAGES
// ========================================
import NotFoundPage from './pages/NotFoundPage';

// ========================================
// HELPER COMPONENTS
// ========================================

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

// Safe hard redirect (no History API usage)
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

// ========================================
// ROUTE PROTECTION COMPONENTS
// ========================================

// Protected Route - Requires authentication
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

// Public Route - Redirects to dashboard if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (didRedirect.current) return;
    if (!isLoading && isAuthenticated) {
      didRedirect.current = true;
      hardReplace('/dashboard');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingSpinner label="Loading..." />;
  if (isAuthenticated) return <LoadingSpinner label="Redirecting to dashboard..." />;

  return children;
}

// ========================================
// MAIN APP COMPONENT
// ========================================
function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* ========================================
            PUBLIC ROUTES
            ======================================== */}
        
        {/* Marketing & Company */}
        <Route path="/" element={<Marketing />} />
        <Route path="/about" element={<About />} />
        
        {/* Product */}
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Resources */}
        <Route path="/docs" element={<Documentation />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/guides/:guideId" element={<GuideDetail />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/status" element={<ApiStatus />} />
        <Route path="/api-status" element={<ApiStatus />} />
        
        {/* Support & Help Center - Update: April 2026 */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/help/article/:slug" element={<ArticleDetail />} />
        <Route path="/help/category/:categoryId" element={<CategoryView />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* API Reference */}
        <Route path="/api" element={<API />} />
        
        {/* Legal */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />

        {/* ========================================
            BLOG ROUTES
            ======================================== */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* ========================================
            AUTH ROUTES
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
            PROTECTED ROUTES
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
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account-settings" 
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } 
        />
        
        {/* Change Password */}
        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } 
        />

        {/* ========================================
            404 NOT FOUND
            ======================================== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;

//============= END OF App.js ============

///////////////////////////////////////////=======================
// // ========================================
// // APP.JS - UPDATED WITH STANDALONE CHANGE PASSWORD
// // ========================================
// // File: frontend/src/App.js
// // Author: OneTechly
// // Updated: April 2026
// //
// // ✅ CHANGES IN THIS VERSION:
// // - Removed inline ChangePasswordPage component
// // - Now imports ChangePassword from pages folder
// // - Cleaner, more maintainable code structure
// // ========================================

// import React, { useEffect, useRef } from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';
// import ErrorBoundary from './components/ErrorBoundary';

// // ========================================
// // PUBLIC PAGES
// // ========================================
// import Marketing from './pages/Marketing';
// import Documentation from './pages/Documentation';
// import API from './pages/API';
// import About from './pages/About';
// import Features from './pages/Features';
// import Pricing from './pages/Pricing';
// import Guides from './pages/Guides';
// import GuideDetail from './pages/GuideDetail';
// import ApiStatus from './pages/ApiStatus';
// import HelpCenter from './pages/HelpCenter';
// import Contact from './pages/Contact';
// import FAQ from './pages/FAQ';
// import Privacy from './pages/Privacy';
// import Terms from './pages/Terms';
// import Cookies from './pages/Cookies';

// // ========================================
// // AUTH PAGES
// // ========================================
// import LoginPage from './pages/LoginPage';
// import Register from './pages/Register';

// // ========================================
// // PROTECTED PAGES
// // ========================================
// import DashboardPage from './pages/DashboardPage';
// import ScreenshotPage from './pages/ScreenshotPage';
// import Activity from './pages/Activity';
// import History from './pages/History';
// import BatchJobs from './pages/BatchJobs';
// import SubscriptionPage from './pages/SubscriptionPage';
// import AccountSettings from './pages/AccountSettings';
// import ChangePassword from './pages/ChangePassword'; // ✅ NEW: Standalone component

// // ========================================
// // BLOG PAGES
// // ========================================
// import BlogList from './pages/BlogList';
// import BlogPost from './pages/BlogPost';

// // ========================================
// // SYSTEM PAGES
// // ========================================
// import NotFoundPage from './pages/NotFoundPage';

// // ========================================
// // HELPER COMPONENTS
// // ========================================

// // Loading spinner component
// function LoadingSpinner({ label = 'Loading...' }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
//         <p className="text-gray-600">{label}</p>
//       </div>
//     </div>
//   );
// }

// // Safe hard redirect (no History API usage)
// function hardReplace(path) {
//   if (typeof window === 'undefined') return;
//   try {
//     const target = path.startsWith('http')
//       ? path
//       : `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
//     window.location.replace(target);
//   } catch {
//     window.location.href = path;
//   }
// }

// // ========================================
// // ROUTE PROTECTION COMPONENTS
// // ========================================

// // Protected Route - Requires authentication
// function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth();
//   const location = useLocation();
//   const didRedirect = useRef(false);

//   useEffect(() => {
//     if (didRedirect.current) return;
//     if (!isLoading && !isAuthenticated) {
//       didRedirect.current = true;
//       const next = encodeURIComponent(location.pathname + location.search);
//       hardReplace(`/login?next=${next}`);
//     }
//   }, [isAuthenticated, isLoading, location]);

//   if (isLoading) return <LoadingSpinner label="Checking session..." />;
//   if (!isAuthenticated) return <LoadingSpinner label="Redirecting to login..." />;

//   return <ErrorBoundary>{children}</ErrorBoundary>;
// }

// // Public Route - Redirects to dashboard if already logged in
// function PublicRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth();
//   const didRedirect = useRef(false);

//   useEffect(() => {
//     if (didRedirect.current) return;
//     if (!isLoading && isAuthenticated) {
//       didRedirect.current = true;
//       hardReplace('/dashboard');
//     }
//   }, [isAuthenticated, isLoading]);

//   if (isLoading) return <LoadingSpinner label="Loading..." />;
//   if (isAuthenticated) return <LoadingSpinner label="Redirecting to dashboard..." />;

//   return children;
// }

// // ========================================
// // MAIN APP COMPONENT
// // ========================================
// function App() {
//   return (
//     <ErrorBoundary>
//       <Routes>
//         {/* ========================================
//             PUBLIC ROUTES
//             ======================================== */}
        
//         {/* Marketing & Company */}
//         <Route path="/" element={<Marketing />} />
//         <Route path="/about" element={<About />} />
        
//         {/* Product */}
//         <Route path="/features" element={<Features />} />
//         <Route path="/pricing" element={<Pricing />} />
        
//         {/* Resources */}
//         <Route path="/docs" element={<Documentation />} />
//         <Route path="/documentation" element={<Documentation />} />
//         <Route path="/guides/:guideId" element={<GuideDetail />} />
//         <Route path="/guides" element={<Guides />} />
//         <Route path="/status" element={<ApiStatus />} />
//         <Route path="/api-status" element={<ApiStatus />} />
        
//         {/* Support */}
//         <Route path="/help" element={<HelpCenter />} />
//         <Route path="/help-center" element={<HelpCenter />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/faq" element={<FAQ />} />
        
//         {/* API Reference */}
//         <Route path="/api" element={<API />} />
        
//         {/* Legal */}
//         <Route path="/privacy" element={<Privacy />} />
//         <Route path="/terms" element={<Terms />} />
//         <Route path="/cookies" element={<Cookies />} />

//         {/* ========================================
//             BLOG ROUTES
//             ======================================== */}
//         <Route path="/blog" element={<BlogList />} />
//         <Route path="/blog/:slug" element={<BlogPost />} />

//         {/* ========================================
//             AUTH ROUTES
//             ======================================== */}
//         <Route 
//           path="/login" 
//           element={
//             <PublicRoute>
//               <LoginPage />
//             </PublicRoute>
//           } 
//         />
//         <Route 
//           path="/register" 
//           element={
//             <PublicRoute>
//               <Register />
//             </PublicRoute>
//           } 
//         />
//         <Route 
//           path="/signup" 
//           element={
//             <PublicRoute>
//               <Register />
//             </PublicRoute>
//           } 
//         />

//         {/* ========================================
//             PROTECTED ROUTES
//             ======================================== */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <DashboardPage />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/screenshot" 
//           element={
//             <ProtectedRoute>
//               <ScreenshotPage />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/activity" 
//           element={
//             <ProtectedRoute>
//               <Activity />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/history" 
//           element={
//             <ProtectedRoute>
//               <History />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/batch" 
//           element={
//             <ProtectedRoute>
//               <BatchJobs />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/subscription" 
//           element={
//             <ProtectedRoute>
//               <SubscriptionPage />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/settings" 
//           element={
//             <ProtectedRoute>
//               <AccountSettings />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/account-settings" 
//           element={
//             <ProtectedRoute>
//               <AccountSettings />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* ✅ Change Password - Now using standalone component */}
//         <Route 
//           path="/change-password" 
//           element={
//             <ProtectedRoute>
//               <ChangePassword />
//             </ProtectedRoute>
//           } 
//         />

//         {/* ========================================
//             404 NOT FOUND
//             ======================================== */}
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//     </ErrorBoundary>
//   );
// }

// export default App;

////==== END OF App.js =========