// ========================================
// ERROR BOUNDARY COMPONENT - PRODUCTION READY
// ========================================
// File: frontend/src/components/ErrorBoundary.jsx
// Author: OneTechly
// Updated: January 2026

import React from "react";
import PixelPerfectLogo from "./PixelPerfectLogo";

const AUTH_KEYS_TO_CLEAR = [
  "auth_token",
  "auth_user",
  // if you ever stored alternates:
  "token",
  "user",
];

function safeReload() {
  try {
    window.location.reload();
  } catch {
    window.location.href = window.location.href;
  }
}

function safeAssign(path) {
  try {
    window.location.assign(path);
  } catch {
    window.location.href = path;
  }
}

function safeReplace(path) {
  try {
    window.location.replace(path);
  } catch {
    window.location.href = path;
  }
}

function clearAuthStorage() {
  try {
    AUTH_KEYS_TO_CLEAR.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to clear localStorage auth keys:", e);
  }

  try {
    sessionStorage.clear();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to clear sessionStorage:", e);
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error("❌ ErrorBoundary caught error:", error);
    // eslint-disable-next-line no-console
    console.error("📍 Component stack:", errorInfo?.componentStack);

    this.setState({
      error,
      errorInfo,
    });
  }

  resetState = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleRefresh = () => {
    this.resetState();
    safeReload();
  };

  handleGoHome = () => {
    this.resetState();
    safeAssign("/");
  };

  handleClearAndRetry = () => {
    this.resetState();
    clearAuthStorage();
    safeReplace("/"); // go clean to home
  };

  handleResetAuthToLogin = () => {
    this.resetState();
    clearAuthStorage();
    safeReplace("/login");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <PixelPerfectLogo size={64} showText={false} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Try one of the options below.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleRefresh}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white
                           px-6 py-3 rounded-lg font-semibold
                           hover:from-blue-700 hover:to-blue-900
                           transition-all shadow-md hover:shadow-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="button"
              >
                🔄 Refresh Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold
                           border-2 border-blue-600 hover:bg-blue-50 transition-all
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="button"
              >
                🏠 Go to Home
              </button>

              <button
                onClick={this.handleResetAuthToLogin}
                className="w-full bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold
                           border border-indigo-300 hover:bg-indigo-50 transition-all
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="button"
              >
                🔐 Reset Auth & Go to Login
              </button>

              <button
                onClick={this.handleClearAndRetry}
                className="w-full bg-white text-gray-600 px-6 py-3 rounded-lg font-medium
                           border border-gray-300 hover:bg-gray-50 transition-all text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                type="button"
              >
                🧹 Clear Cache & Retry
              </button>
            </div>

            {/* Dev Details */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-semibold select-none">
                  🔍 View Error Details (Dev Only)
                </summary>
                <div className="mt-3 p-4 bg-gray-900 rounded-lg overflow-hidden">
                  <div className="mb-3">
                    <p className="text-red-400 font-mono text-xs mb-1 font-bold">Error:</p>
                    <p className="text-red-300 font-mono text-xs break-all">
                      {String(this.state.error)}
                    </p>
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <p className="text-green-400 font-mono text-xs mb-1 font-bold">
                        Component Stack:
                      </p>
                      <pre className="text-green-300 font-mono text-xs overflow-x-auto max-h-60">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Help */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">If this problem persists, contact support:</p>
              <a
                href="mailto:support@pixelperfectapi.net"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-block mt-1"
              >
                support@pixelperfectapi.net
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


////////////////////////////////////////////////////////////////////////
// // ========================================
// // ERROR BOUNDARY COMPONENT - PRODUCTION READY
// // ========================================
// // Catches React errors and displays a friendly message
// // File: frontend/src/components/ErrorBoundary.jsx
// // Author: OneTechly
// // Updated: January 2026

// import React from 'react';
// import { PixelPerfectLogo } from './PixelPerfectLogos';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { 
//       hasError: false, 
//       error: null,
//       errorInfo: null 
//     };
//   }

//   static getDerivedStateFromError(_error) {
//     // Return state update to trigger error UI
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     // Log error to console in development
//     console.error('❌ ErrorBoundary caught error:', error);
//     console.error('📍 Component stack:', errorInfo?.componentStack);
    
//     this.setState({
//       error: error,
//       errorInfo: errorInfo
//     });

//     // In production, you could send to error tracking service (Sentry, etc.)
//     if (process.env.NODE_ENV === 'production') {
//       // Example: Send to error tracking
//       // logErrorToService(error, errorInfo);
//     }
//   }

//   handleRefresh = () => {
//     // Clear error state and reload
//     this.setState({ hasError: false, error: null, errorInfo: null });
//     window.location.reload();
//   };

//   handleGoHome = () => {
//     // Clear error and redirect to home
//     this.setState({ hasError: false, error: null, errorInfo: null });
//     window.location.href = '/';
//   };

//   handleClearAndRetry = () => {
//     // Clear local storage and reload (nuclear option)
//     try {
//       localStorage.clear();
//       sessionStorage.clear();
//     } catch (e) {
//       console.error('Failed to clear storage:', e);
//     }
//     window.location.reload();
//   };

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
//           <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
//             {/* Logo */}
//             <div className="flex justify-center mb-6">
//               <PixelPerfectLogo size={64} showText={false} />
//             </div>

//             {/* Error Message */}
//             <h1 className="text-2xl font-bold text-gray-900 mb-4">
//               Oops! Something went wrong
//             </h1>
            
//             <p className="text-gray-600 mb-6">
//               We encountered an unexpected error. Please try one of the options below.
//             </p>

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <button
//                 onClick={this.handleRefresh}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white 
//                           px-6 py-3 rounded-lg font-semibold 
//                           hover:from-blue-700 hover:to-blue-900 
//                           transition-all shadow-md hover:shadow-lg
//                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 type="button"
//               >
//                 🔄 Refresh Page
//               </button>
              
//               <button
//                 onClick={this.handleGoHome}
//                 className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold 
//                           border-2 border-blue-600 hover:bg-blue-50 transition-all
//                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 type="button"
//               >
//                 🏠 Go to Home
//               </button>

//               <button
//                 onClick={this.handleClearAndRetry}
//                 className="w-full bg-white text-gray-600 px-6 py-3 rounded-lg font-medium 
//                           border border-gray-300 hover:bg-gray-50 transition-all text-sm
//                           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//                 type="button"
//               >
//                 🧹 Clear Cache & Retry
//               </button>
//             </div>

//             {/* Error Details (development only) */}
//             {process.env.NODE_ENV === 'development' && this.state.error && (
//               <details className="mt-6 text-left">
//                 <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-semibold select-none">
//                   🔍 View Error Details (Dev Only)
//                 </summary>
//                 <div className="mt-3 p-4 bg-gray-900 rounded-lg overflow-hidden">
//                   <div className="mb-3">
//                     <p className="text-red-400 font-mono text-xs mb-1 font-bold">Error:</p>
//                     <p className="text-red-300 font-mono text-xs break-all">
//                       {this.state.error.toString()}
//                     </p>
//                   </div>
//                   {this.state.errorInfo?.componentStack && (
//                     <div>
//                       <p className="text-green-400 font-mono text-xs mb-1 font-bold">Component Stack:</p>
//                       <pre className="text-green-300 font-mono text-xs overflow-x-auto max-h-60">
//                         {this.state.errorInfo.componentStack}
//                       </pre>
//                     </div>
//                   )}
//                 </div>
//               </details>
//             )}

//             {/* Help Text */}
//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <p className="text-xs text-gray-500">
//                 If this problem persists, please contact support:
//               </p>
//               <a 
//                 href="mailto:support@pixelperfectapi.net" 
//                 className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-block mt-1"
//               >
//                 support@pixelperfectapi.net
//               </a>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;

