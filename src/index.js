// ========================================
// INDEX.JS - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/index.js
// Author: OneTechly
// Purpose: React app entry point with providers
// Updated: January 2026 - Production-ready with debug logging

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import App from "./App";

// ✅ Debug logging for troubleshooting
console.log('🚀 PixelPerfect App Starting...');
console.log('📍 Current URL:', window.location.href);
console.log('🔑 Token exists:', !!localStorage.getItem('auth_token'));
console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000');
console.log('🏗️ Environment:', process.env.NODE_ENV);

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
 * Provider Hierarchy:
 * 1. React.StrictMode - Development mode checks (double-renders in dev)
 * 2. BrowserRouter - Routing (ONE instance only!)
 * 3. ErrorBoundary - Catches React errors
 * 4. AuthProvider - Authentication state
 * 5. SubscriptionProvider - Subscription/billing state
 * 6. Toaster - Toast notifications (ONE instance only!)
 * 7. App - Main app component with routes
 * 
 * IMPORTANT:
 * - Do NOT add basename to BrowserRouter in production
 * - Keep BrowserRouter outside providers that use router hooks
 * - Only ONE BrowserRouter instance in entire app
 * - Only ONE Toaster instance in entire app
 * - StrictMode causes double-renders in development (expected behavior)
 */

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <SubscriptionProvider>
            {/* Toast Notifications - Global instance */}
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
            
            {/* Main App Component */}
            <App />
          </SubscriptionProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

console.log('✅ React app rendered successfully');

/////////////////////////////////////////////////////////
// // ========================================
// // INDEX.JS - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/index.js
// // Author: OneTechly
// // Updated: January 2026 - Production-ready
// //
// // Notes:
// // - Single BrowserRouter instance
// // - Single ErrorBoundary (top-level)
// // - Single Toaster instance
// // - Debug logs only in development

// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { Toaster } from "react-hot-toast";

// import "./index.css";

// import ErrorBoundary from "./components/ErrorBoundary";
// import { AuthProvider } from "./contexts/AuthContext";
// import { SubscriptionProvider } from "./contexts/SubscriptionContext";
// import App from "./App";

// // ✅ Debug logging (DEV only)
// if (process.env.NODE_ENV !== "production") {
//   // eslint-disable-next-line no-console
//   console.log("🚀 PixelPerfect App Starting...");
//   // eslint-disable-next-line no-console
//   console.log("📍 Current URL:", window.location.href);
//   // eslint-disable-next-line no-console
//   console.log("🔑 Token exists:", !!localStorage.getItem("auth_token"));
//   // eslint-disable-next-line no-console
//   console.log("🌐 API URL:", process.env.REACT_APP_API_URL || "http://localhost:8000");
//   // eslint-disable-next-line no-console
//   console.log("🏗️ Environment:", process.env.NODE_ENV);
// }

// const rootEl = document.getElementById("root");
// if (!rootEl) {
//   // eslint-disable-next-line no-console
//   console.error("❌ Root element not found! Check public/index.html");
//   throw new Error("Root element #root not found in DOM");
// }

// const root = createRoot(rootEl);

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ErrorBoundary>
//         <AuthProvider>
//           <SubscriptionProvider>
//             {/* ✅ Toast Notifications - ONE global instance */}
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 4000,
//                 style: {
//                   background: "#363636",
//                   color: "#fff",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   padding: "12px 16px",
//                 },
//                 success: {
//                   duration: 3000,
//                   iconTheme: {
//                     primary: "#10b981",
//                     secondary: "#fff",
//                   },
//                 },
//                 error: {
//                   duration: 5000,
//                   iconTheme: {
//                     primary: "#ef4444",
//                     secondary: "#fff",
//                   },
//                 },
//                 loading: {
//                   duration: Infinity,
//                 },
//               }}
//             />

//             <App />
//           </SubscriptionProvider>
//         </AuthProvider>
//       </ErrorBoundary>
//     </BrowserRouter>
//   </React.StrictMode>
// );

// if (process.env.NODE_ENV !== "production") {
//   // eslint-disable-next-line no-console
//   console.log("✅ React app rendered successfully");
// }


