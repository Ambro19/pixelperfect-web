// ========================================
// INDEX.JS - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/index.js
// Author: OneTechly
// Purpose: React app entry point with providers
// Updated: August 2026 - Added HelmetProvider for per-page SEO
// ========================================

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";   // ✅ NEW (SEO)
import { Toaster } from "react-hot-toast";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import App from "./App";

// ========================================
// DEBUG LOGGING FOR TROUBLESHOOTING
// ========================================
// ✅ CHANGED (Aug 2026): gated behind NODE_ENV. These previously ran in
// production, where they printed the API URL and whether an auth token exists
// into the console of every visitor — including crawlers and anyone opening
// DevTools. Harmless individually, but it is free information for an attacker
// probing the app, and it clutters the console for no benefit in prod.
if (process.env.NODE_ENV === "development") {
  console.log('🚀 PixelPerfect App Starting...');
  console.log('📍 Current URL:', window.location.href);
  console.log('🔑 Token exists:', !!localStorage.getItem('auth_token'));
  console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000');
  console.log('🏗️ Environment:', process.env.NODE_ENV);
}

// ========================================
// ROOT ELEMENT VALIDATION
// ========================================
const rootEl = document.getElementById("root");

if (!rootEl) {
  console.error('❌ Root element not found! Check your public/index.html');
  throw new Error('Root element #root not found in DOM');
}

const root = createRoot(rootEl);

/**
 * ========================================
 * PIXELPERFECT REACT APP STRUCTURE
 * ========================================
 *
 * Provider Hierarchy (order matters!):
 * 1. React.StrictMode     - Development mode checks (double-renders in dev)
 * 2. HelmetProvider       - ✅ NEW: per-page <title>, description, canonical,
 *                           OG/Twitter tags and JSON-LD via <SEO />
 * 3. BrowserRouter        - Routing (ONE instance only!)
 * 4. ErrorBoundary        - Catches React errors
 * 5. AuthProvider         - Authentication state
 * 6. SubscriptionProvider - Subscription/billing state
 * 7. Toaster              - Toast notifications (ONE instance only!)
 * 8. App                  - Main app component with routes
 *
 * IMPORTANT NOTES:
 * - Do NOT add basename to BrowserRouter in production
 * - Keep BrowserRouter outside providers that use router hooks
 * - Only ONE BrowserRouter instance in entire app
 * - Only ONE Toaster instance in entire app
 * - Only ONE HelmetProvider instance in entire app
 * - StrictMode causes double-renders in development (expected behavior)
 * - Context providers must be in correct order for dependencies
 *
 * WHY HELMETPROVIDER SITS ABOVE BROWSERROUTER:
 * - It only supplies context, so it must be an ancestor of every component
 *   that renders <SEO /> — which is every page inside <App />.
 * - Placing it outermost means route-level and layout-level components can
 *   both use Helmet without a second provider.
 * - It renders no DOM of its own, so it cannot affect layout or styling.
 */

root.render(
  <React.StrictMode>
    <HelmetProvider>                {/* ✅ NEW (SEO) */}
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
            <SubscriptionProvider>
              {/* ========================================
                  TOAST NOTIFICATIONS - GLOBAL INSTANCE
                  ======================================== */}
              <Toaster
                position="top-right"
                toastOptions={{
                  // Default options for all toasts
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "12px 16px",
                  },
                  // Success toasts (green)
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#10b981", // Green-500
                      secondary: "#fff",
                    },
                  },
                  // Error toasts (red)
                  error: {
                    duration: 5000, // ✅ Slightly longer for errors
                    iconTheme: {
                      primary: "#ef4444", // Red-500
                      secondary: "#fff",
                    },
                  },
                  // Loading toasts
                  loading: {
                    duration: Infinity, // Don't auto-dismiss
                  },
                }}
              />

              {/* ========================================
                  MAIN APP COMPONENT
                  ======================================== */}
              <App />
            </SubscriptionProvider>
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>               {/* ✅ NEW (SEO) */}
  </React.StrictMode>
);

if (process.env.NODE_ENV === "development") {
  console.log('✅ React app rendered successfully');
}

// ========================================
// ERROR HANDLING FOR UNHANDLED REJECTIONS
// ========================================
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled Promise Rejection:', event.reason);
  // Optionally send to error tracking service
});

// ========================================
// PERFORMANCE MONITORING (OPTIONAL)
// ========================================
if (process.env.NODE_ENV === 'development') {
  // Log component render times in development
  if (window.performance && window.performance.measure) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('⚡ Performance Metrics:', {
            'DOM Content Loaded': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
            'Load Complete': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
            'Total Time': `${perfData.loadEventEnd - perfData.fetchStart}ms`
          });
        }
      }, 0);
    });
  }
}

//======== END Index.js =========

// // ========================================
// // INDEX.JS - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/index.js
// // Author: OneTechly
// // Purpose: React app entry point with providers
// // Updated: August 2026 - Added HelmetProvider for per-page SEO
// // ========================================

// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { HelmetProvider } from "react-helmet-async";   // ✅ NEW (SEO)
// import { Toaster } from "react-hot-toast";
// import "./index.css";
// import ErrorBoundary from "./components/ErrorBoundary";
// import { AuthProvider } from "./contexts/AuthContext";
// import { SubscriptionProvider } from "./contexts/SubscriptionContext";
// import App from "./App";

// // ========================================
// // DEBUG LOGGING FOR TROUBLESHOOTING
// // ========================================
// // ✅ CHANGED (Aug 2026): gated behind NODE_ENV. These previously ran in
// // production, where they printed the API URL and whether an auth token exists
// // into the console of every visitor — including crawlers and anyone opening
// // DevTools. Harmless individually, but it is free information for an attacker
// // probing the app, and it clutters the console for no benefit in prod.
// if (process.env.NODE_ENV === "development") {
//   console.log('🚀 PixelPerfect App Starting...');
//   console.log('📍 Current URL:', window.location.href);
//   console.log('🔑 Token exists:', !!localStorage.getItem('auth_token'));
//   console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000');
//   console.log('🏗️ Environment:', process.env.NODE_ENV);
// }

// // ========================================
// // ROOT ELEMENT VALIDATION
// // ========================================
// const rootEl = document.getElementById("root");

// if (!rootEl) {
//   console.error('❌ Root element not found! Check your public/index.html');
//   throw new Error('Root element #root not found in DOM');
// }

// const root = createRoot(rootEl);

// /**
//  * ========================================
//  * PIXELPERFECT REACT APP STRUCTURE
//  * ========================================
//  *
//  * Provider Hierarchy (order matters!):
//  * 1. React.StrictMode     - Development mode checks (double-renders in dev)
//  * 2. HelmetProvider       - ✅ NEW: per-page <title>, description, canonical,
//  *                           OG/Twitter tags and JSON-LD via <SEO />
//  * 3. BrowserRouter        - Routing (ONE instance only!)
//  * 4. ErrorBoundary        - Catches React errors
//  * 5. AuthProvider         - Authentication state
//  * 6. SubscriptionProvider - Subscription/billing state
//  * 7. Toaster              - Toast notifications (ONE instance only!)
//  * 8. App                  - Main app component with routes
//  *
//  * IMPORTANT NOTES:
//  * - Do NOT add basename to BrowserRouter in production
//  * - Keep BrowserRouter outside providers that use router hooks
//  * - Only ONE BrowserRouter instance in entire app
//  * - Only ONE Toaster instance in entire app
//  * - Only ONE HelmetProvider instance in entire app
//  * - StrictMode causes double-renders in development (expected behavior)
//  * - Context providers must be in correct order for dependencies
//  *
//  * WHY HELMETPROVIDER SITS ABOVE BROWSERROUTER:
//  * - It only supplies context, so it must be an ancestor of every component
//  *   that renders <SEO /> — which is every page inside <App />.
//  * - Placing it outermost means route-level and layout-level components can
//  *   both use Helmet without a second provider.
//  * - It renders no DOM of its own, so it cannot affect layout or styling.
//  */

// root.render(
//   <React.StrictMode>
//     <HelmetProvider>                {/* ✅ NEW (SEO) */}
//       <BrowserRouter>
//         <ErrorBoundary>
//           <AuthProvider>
//             <SubscriptionProvider>
//               {/* ========================================
//                   TOAST NOTIFICATIONS - GLOBAL INSTANCE
//                   ======================================== */}
//               <Toaster
//                 position="top-right"
//                 toastOptions={{
//                   // Default options for all toasts
//                   duration: 4000,
//                   style: {
//                     background: "#363636",
//                     color: "#fff",
//                     borderRadius: "8px",
//                     fontSize: "14px",
//                     padding: "12px 16px",
//                   },
//                   // Success toasts (green)
//                   success: {
//                     duration: 3000,
//                     iconTheme: {
//                       primary: "#10b981", // Green-500
//                       secondary: "#fff",
//                     },
//                   },
//                   // Error toasts (red)
//                   error: {
//                     duration: 5000, // ✅ Slightly longer for errors
//                     iconTheme: {
//                       primary: "#ef4444", // Red-500
//                       secondary: "#fff",
//                     },
//                   },
//                   // Loading toasts
//                   loading: {
//                     duration: Infinity, // Don't auto-dismiss
//                   },
//                 }}
//               />

//               {/* ========================================
//                   MAIN APP COMPONENT
//                   ======================================== */}
//               <App />
//             </SubscriptionProvider>
//           </AuthProvider>
//         </ErrorBoundary>
//       </BrowserRouter>
//     </HelmetProvider>               {/* ✅ NEW (SEO) */}
//   </React.StrictMode>
// );

// if (process.env.NODE_ENV === "development") {
//   console.log('✅ React app rendered successfully');
// }

// // ========================================
// // ERROR HANDLING FOR UNHANDLED REJECTIONS
// // ========================================
// window.addEventListener('unhandledrejection', (event) => {
//   console.error('❌ Unhandled Promise Rejection:', event.reason);
//   // Optionally send to error tracking service
// });

// // ========================================
// // PERFORMANCE MONITORING (OPTIONAL)
// // ========================================
// if (process.env.NODE_ENV === 'development') {
//   // Log component render times in development
//   if (window.performance && window.performance.measure) {
//     window.addEventListener('load', () => {
//       setTimeout(() => {
//         const perfData = window.performance.getEntriesByType('navigation')[0];
//         if (perfData) {
//           console.log('⚡ Performance Metrics:', {
//             'DOM Content Loaded': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
//             'Load Complete': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
//             'Total Time': `${perfData.loadEventEnd - perfData.fetchStart}ms`
//           });
//         }
//       }, 0);
//     });
//   }
// }

// //======== END Index.js =========
