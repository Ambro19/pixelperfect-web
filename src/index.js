// ========================================
// INDEX.JS - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/index.js
// Author: OneTechly
// Purpose: React app entry point with providers
// Updated: February 2026 - Production-ready with debug logging
// ========================================

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import App from "./App";

// ========================================
// DEBUG LOGGING FOR TROUBLESHOOTING
// ========================================
console.log('🚀 PixelPerfect App Starting...');
console.log('📍 Current URL:', window.location.href);
console.log('🔑 Token exists:', !!localStorage.getItem('auth_token'));
console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000');
console.log('🏗️ Environment:', process.env.NODE_ENV);

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
 * 1. React.StrictMode - Development mode checks (double-renders in dev)
 * 2. BrowserRouter - Routing (ONE instance only!)
 * 3. ErrorBoundary - Catches React errors
 * 4. AuthProvider - Authentication state
 * 5. SubscriptionProvider - Subscription/billing state
 * 6. Toaster - Toast notifications (ONE instance only!)
 * 7. App - Main app component with routes
 * 
 * IMPORTANT NOTES:
 * - Do NOT add basename to BrowserRouter in production
 * - Keep BrowserRouter outside providers that use router hooks
 * - Only ONE BrowserRouter instance in entire app
 * - Only ONE Toaster instance in entire app
 * - StrictMode causes double-renders in development (expected behavior)
 * - Context providers must be in correct order for dependencies
 * 
 * WHY THIS ORDER?
 * - BrowserRouter first: routing must wrap everything
 * - ErrorBoundary early: catches errors from all children
 * - AuthProvider before SubscriptionProvider: subscription depends on auth
 * - Toaster inside providers: can be triggered from anywhere in app
 */

root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);

console.log('✅ React app rendered successfully');

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

