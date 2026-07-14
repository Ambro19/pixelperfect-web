// ========================================
// FORGOT USERNAME PAGE - PRODUCTION READY
// ========================================
// File: frontend/src/pages/ForgotUsername.js
// Author: OneTechly
// Updated: July 2026
//
// Allows users to recover their username via email.
// POST /auth/forgot-username → backend emails the username.
// Always returns success (security: never reveals account existence).
// Style matches ForgotPassword.js exactly for UX consistency.
// ========================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PixelPerfectLogo from "../components/PixelPerfectLogo";

const API_URL = process.env.REACT_APP_API_URL || "https://api.pixelperfectapi.net";

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
            onClick={() => navigate("/login")}
            className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}

export default function ForgotUsername() {
  const navigate = useNavigate();
  const [email, setEmail]         = useState("");
  const [touched, setTouched]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailError =
    !email.trim()
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "Enter a valid email address."
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (emailError) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await fetch(`${API_URL}/auth/forgot-username`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      // Always show success — never reveal whether account exists.
      setSubmitted(true);
    } catch {
      // Network error — still show success to avoid account enumeration.
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────
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
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Check your email
              </h1>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Check your inbox</h2>
              <p className="text-gray-600 mb-1">
                If an account exists for{" "}
                <span className="font-semibold text-gray-900">{email}</span>,
                we sent your username to that address.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive it? Check your spam folder or wait a few minutes.
              </p>
              <div className="flex flex-col gap-3">
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

  // ── Main form ──────────────────────────────────────────────────
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
              Forgot your username?
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your account email and we'll send your username.
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
                  onChange={(e) => setEmail(e.target.value)}
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
                {touched && emailError && (
                  <p className="text-xs text-red-600 mt-1">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm min-h-[48px]"
              >
                {loading ? "Sending…" : "Send my username"}
              </button>
            </form>

            <div className="mt-6 space-y-2 text-center">
              <div>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot your password instead?
                </button>
              </div>
              <div>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Back to Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== END OF ForgotUsername.js =====