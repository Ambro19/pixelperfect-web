// ========================================
// FORGOT PASSWORD PAGE - PRODUCTION READY
// ========================================
// File: frontend/src/pages/ForgotPassword.js
// Author: OneTechly
// Updated: April 2026
//
// Submits to: POST /auth/forgot-password
// Backend always returns { ok: true } regardless of whether the
// email exists (prevents user enumeration). The user always sees
// the "check your email" success state.
// ========================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PixelPerfectLogo from "../components/PixelPerfectLogo";

const API_URL =
  process.env.REACT_APP_API_URL || "https://api.pixelperfectapi.net";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [touched, setTouched]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Validation ────────────────────────────────────────────────
  const emailError =
    !email.trim()
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "Enter a valid email address."
      : "";

  const isValid = !emailError;

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Request failed. Please try again.");
      }

      // Backend always returns { ok: true } — show success regardless
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ─────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader navigate={navigate} />
        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6 sm:mb-8">
              <PixelPerfectLogo
                size={window.innerWidth < 640 ? 56 : 64}
                showText={false}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 text-center">
              {/* Envelope icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Check your email
              </h2>
              <p className="text-gray-600 mb-2">
                If an account exists for{" "}
                <span className="font-semibold text-gray-800">{email}</span>,
                we sent a password reset link.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Didn't receive it? Check your spam folder or wait a few minutes.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { setSubmitted(false); setEmail(""); setTouched(false); }}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Try a different email
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Back to Sign in
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Form state ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader navigate={navigate} />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6 sm:mb-8">
            <PixelPerfectLogo
              size={window.innerWidth < 640 ? 56 : 64}
              showText={false}
            />
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Forgot your password?
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched) setTouched(true);
                  }}
                  onBlur={() => setTouched(true)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                    touched && emailError ? "border-red-400" : "border-gray-300"
                  }`}
                  style={{ fontSize: "16px" }}
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                />
                {touched && emailError ? (
                  <p className="text-xs text-red-600 mt-1">{emailError}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading || (touched && !isValid)}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm min-h-[48px]"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Sign in
              </button>
            </div>
          </div>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create one now
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

// ── Shared header ─────────────────────────────────────────────────────────────
function PageHeader({ navigate }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <PixelPerfectLogo
              size={window.innerWidth < 640 ? 32 : 40}
              showText={true}
            />
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
  );
}

// ===== END OF ForgotPassword.js =============================================