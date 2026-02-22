// ============================================================================
// NOT FOUND PAGE - PIXELPERFECT (PRODUCTION READY)
// ============================================================================
// File: frontend/src/pages/NotFoundPage.jsx
// Author: OneTechly
// Updated: Feb 2026
//
// ✅ Fixes:
// - Uses React Router navigation (NO hard reloads)
// - Dashboard button routes to /dashboard if logged in, else /login?next=...
// - Preserves the current path in `next` so user returns after login
// ============================================================================

import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const currentPath = useMemo(() => {
    const path = location?.pathname || "/";
    const search = location?.search || "";
    return `${path}${search}`;
  }, [location]);

  const goHome = () => navigate("/", { replace: true });

  const goDashboard = () => {
    // If auth is still loading, behave safely: send to login with next
    if (isLoading) {
      const next = encodeURIComponent(currentPath || "/dashboard");
      navigate(`/login?next=${next}`, { replace: true });
      return;
    }

    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
      // Send them to login; after login you can use the `next` param
      const next = encodeURIComponent(currentPath || "/dashboard");
      navigate(`/login?next=${next}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <PixelPerfectLogo size={64} showText={false} />
        </div>

        <div className="text-5xl mb-2">📸</div>
        <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
        <p className="text-gray-600 mt-2">Page not found</p>

        <p className="text-xs text-gray-400 mt-2 break-all">
          {location?.pathname || "/"}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={goHome}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>

          <button
            onClick={goDashboard}
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}