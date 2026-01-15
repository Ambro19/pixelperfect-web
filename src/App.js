// ========================================
// APP.JS - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/App.js
// Author: OneTechly
// Purpose: Main application router
// Updated: January 2026 - ALL PAGES INTEGRATED
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

//============================================================
// // ========================================
// // APP.JS - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/App.js
// // Author: OneTechly
// // Purpose: Main application router
// // Updated: January 2026
// //
// // IMPORTANT: BrowserRouter and Toaster are in index.js
// //            Do NOT add them here!

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';

// // Pages
// import Marketing from './pages/Marketing';
// import Documentation from './pages/Documentation';
// import API from './pages/API';
// import LoginPage from './pages/LoginPage';
// import Register from './pages/Register';
// import DashboardPage from './pages/DashboardPage';
// import ScreenshotPage from './pages/ScreenshotPage';
// import Activity from './pages/Activity';
// import History from './pages/History';
// import BatchJobs from './pages/BatchJobs';
// import SubscriptionPage from './pages/SubscriptionPage';

// // Legal Pages (ADDED)
// import Privacy from './pages/Privacy';
// import Terms from './pages/Terms';
// import Cookies from './pages/Cookies';

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

// // Main App Component
// function App() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Marketing />} />
//       <Route path="/docs" element={<Documentation />} />
//       <Route path="/documentation" element={<Documentation />} />
//       <Route path="/api" element={<API />} />
//       <Route path="/features" element={<Marketing />} />
//       <Route path="/pricing" element={<Marketing />} />

//       {/* Legal Routes (ADDED) */}
//       <Route path="/privacy" element={<Privacy />} />
//       <Route path="/terms" element={<Terms />} />
//       <Route path="/cookies" element={<Cookies />} />

//       {/* Auth Routes */}
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

//       {/* Protected Routes */}
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

//       {/* 404 Route */}
//       <Route
//         path="*"
//         element={
//           <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="text-center">
//               <div className="text-6xl mb-4">📸</div>
//               <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
//               <p className="text-xl text-gray-600 mb-6">Page not found</p>
//               <div className="flex gap-4 justify-center">
//                 <button
//                   onClick={() => (window.location.href = '/')}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//                 >
//                   Go Home
//                 </button>
//                 <button
//                   onClick={() => (window.location.href = '/dashboard')}
//                   className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
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

