// ========================================
// LOGIN PAGE - PRODUCTION READY
// ========================================
// File: frontend/src/pages/LoginPage.js
// Author: OneTechly
// Updated: Feb 2026
//
// Includes:
// - Inline field errors
// - Toast errors (global)
// - Disable submit when invalid
// - Caps lock warning
// ========================================

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";

function safeNextPath(nextRaw) {
  if (!nextRaw || typeof nextRaw !== "string") return "/dashboard";
  const next = nextRaw.trim();
  if (!next.startsWith("/")) return "/dashboard";
  if (next.startsWith("//")) return "/dashboard";
  if (next.toLowerCase().startsWith("/javascript:")) return "/dashboard";
  return next;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return safeNextPath(params.get("next"));
  }, [location.search]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [touched, setTouched] = useState({ username: false, password: false });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validate = (u, p) => {
    const e = { username: "", password: "" };

    if (!u.trim()) e.username = "Username is required.";
    if (!p) e.password = "Password is required.";
    if (p && p.length > 128) e.password = "Password is too long (max 128).";

    return e;
  };

  const currentErrors = useMemo(() => validate(username, password), [username, password]);
  const isValid = !currentErrors.username && !currentErrors.password;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(username, password));
  };

  const handleCapsDetect = (e) => {
    // Works on key events for most browsers
    if (typeof e?.getModifierState === "function") {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate(username, password);
    setErrors(v);
    setTouched({ username: true, password: true });

    if (v.username || v.password) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      toast.success("Welcome back!");
      navigate(nextPath, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText={true} />
            </div>

            <button
              onClick={() => navigate("/register")}
              className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Create account
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6 sm:mb-8">
            <PixelPerfectLogo size={window.innerWidth < 640 ? 56 : 64} showText={false} />
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-sm sm:text-base text-gray-600">Sign in to your PixelPerfect account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (touched.username) setErrors(validate(e.target.value, password));
                  }}
                  onBlur={() => handleBlur("username")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                    touched.username && (errors.username || currentErrors.username)
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                  style={{ fontSize: "16px" }}
                  disabled={loading}
                  autoComplete="username"
                />
                {touched.username && (errors.username || currentErrors.username) ? (
                  <p className="text-xs text-red-600 mt-1">{errors.username || currentErrors.username}</p>
                ) : null}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) setErrors(validate(username, e.target.value));
                    }}
                    onBlur={() => handleBlur("password")}
                    onKeyUp={handleCapsDetect}
                    onKeyDown={handleCapsDetect}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base pr-12 ${
                      touched.password && (errors.password || currentErrors.password)
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    style={{ fontSize: "16px" }}
                    disabled={loading}
                    autoComplete="current-password"
                    maxLength={128}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {capsLockOn ? (
                  <p className="text-xs text-amber-600 mt-1">Caps lock is on.</p>
                ) : null}

                {touched.password && (errors.password || currentErrors.password) ? (
                  <p className="text-xs text-red-600 mt-1">{errors.password || currentErrors.password}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Max 128 characters.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm min-h-[48px]"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
            By signing in, you agree to our{" "}
            <button onClick={() => navigate("/terms")} className="text-blue-600 hover:text-blue-700">
              Terms
            </button>{" "}
            and{" "}
            <button onClick={() => navigate("/privacy")} className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}


