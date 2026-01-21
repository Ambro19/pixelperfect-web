// ========================================
// PROTECTED ROUTE - PRODUCTION READY
// ========================================
// File: frontend/src/components/ProtectedRoute.jsx
// Author: OneTechly
// Updated: January 2026
//
// Fixes:
// 1) Preserves intended destination via ?next=
// 2) Smooth loader during auth init
// ========================================

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function FullPageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-sm text-gray-500">Loading…</div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}

// // ========================================================

// // src/components/ProtectedRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// function FullPageLoader() {
//   return (
//     <div className="min-h-[60vh] flex items-center justify-center">
//       <div className="text-sm text-gray-500">Loading…</div>
//     </div>
//   );
// }

// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth(); // Fixed: isLoading instead of loading

//   if (isLoading) return <FullPageLoader />;
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }