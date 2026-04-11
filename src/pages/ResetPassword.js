// ========================================
// RESET PASSWORD PAGE - PRODUCTION READY
// ========================================
// File: frontend/src/pages/ResetPassword.js
// Author: OneTechly
// Updated: April 2026
//
// Reads ?token= from URL query string.
// Submits to: POST /auth/reset-password
// On success: redirects to /login with a success toast.
// On token error (expired / invalid): shows actionable message
// with a link back to /forgot-password to get a new link.
// ========================================

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PixelPerfectLogo from "../components/PixelPerfectLogo";

const API_URL =
  process.env.REACT_APP_API_URL || "https://api.pixelperfectapi.net";

const MIN_PW = Number(process.env.REACT_APP_PASSWORD_MIN_LEN) || 8;
const MAX_PW = Number(process.env.REACT_APP_PASSWORD_MAX_LEN) || 128;

function scorePassword(pw) {
  if (!pw) return { score: 0, label: "Enter a password", tips: [] };
  let score = 0;
  const tips = [];
  if (pw.length >= 8)           score += 1; else tips.push("Use at least 8 characters.");
  if (pw.length >= 12)          score += 1; else tips.push("12+ characters is stronger.");
  if (/[A-Z]/.test(pw))         score += 1; else tips.push("Add an uppercase letter.");
  if (/[a-z]/.test(pw))         score += 1; else tips.push("Add a lowercase letter.");
  if (/\d/.test(pw))            score += 1; else tips.push("Add a number.");
  if (/[^A-Za-z0-9]/.test(pw)) score += 1; else tips.push("Add a symbol (e.g. !@#$).");
  const label = score >= 5 ? "Strong" : score >= 3 ? "Medium" : "Weak";
  return { score, label, tips };
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Extract token from URL (?token=...) ───────────────────────
  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search]);

  const [formData, setFormData] = useState({
    newPassword:     "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    newPassword:     false,
    confirmPassword: false,
  });
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn,          setCapsLockOn]          = useState(false);
  const [loading,             setLoading]             = useState(false);
  const [tokenErr,            setTokenErr]            = useState("");

  // ── Validation ────────────────────────────────────────────────
  const validate = (d) => {
    const e = { newPassword: "", confirmPassword: "" };
    if (!d.newPassword)
      e.newPassword = "Password is required.";
    else if (d.newPassword.length < MIN_PW)
      e.newPassword = `Password must be at least ${MIN_PW} characters.`;
    else if (d.newPassword.length > MAX_PW)
      e.newPassword = `Password is too long (max ${MAX_PW}).`;

    if (!d.confirmPassword)
      e.confirmPassword = "Please confirm your new password.";
    else if (d.newPassword !== d.confirmPassword)
      e.confirmPassword = "Passwords do not match.";

    return e;
  };

  const currentErrors = useMemo(() => validate(formData), [formData]);
  const isValid = !currentErrors.newPassword && !currentErrors.confirmPassword;
  const pwMeta  = useMemo(() => scorePassword(formData.newPassword), [formData.newPassword]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleCapsDetect = (e) => {
    if (typeof e?.getModifierState === "function")
      setCapsLockOn(e.getModifierState("CapsLock"));
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ newPassword: true, confirmPassword: true });

    if (!isValid) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (!token) {
      setTokenErr("Missing reset token. Please request a new reset link.");
      return;
    }

    setLoading(true);
    setTokenErr("");
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          token:        token,
          new_password: formData.newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = (data.detail || "").toLowerCase();
        if (msg.includes("expired")) {
          setTokenErr(
            "This reset link has expired. Reset links are valid for 1 hour."
          );
        } else if (msg.includes("invalid")) {
          setTokenErr(
            "This reset link is invalid. It may have already been used."
          );
        } else {
          throw new Error(data.detail || "Failed to reset password.");
        }
        return;
      }

      toast.success("Password reset successfully! Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Missing token guard ───────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader navigate={navigate} />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Invalid reset link
            </h2>
            <p className="text-gray-600 mb-6">
              No reset token was found. Please request a new password reset.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Request new reset link
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────
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
              Set a new password
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Choose a strong password for your account
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">

            {/* Token error banner */}
            {tokenErr && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm text-red-700">{tokenErr}</p>
                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-red-700 underline font-medium mt-1"
                  >
                    Request a new reset link →
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange("newPassword")}
                    onBlur={() => handleBlur("newPassword")}
                    onKeyUp={handleCapsDetect}
                    onKeyDown={handleCapsDetect}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base pr-12 ${
                      touched.newPassword && currentErrors.newPassword
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    style={{ fontSize: "16px" }}
                    disabled={loading}
                    autoComplete="new-password"
                    maxLength={MAX_PW}
                    autoFocus
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

                {capsLockOn && (
                  <p className="text-xs text-amber-600 mt-1">Caps lock is on.</p>
                )}
                {touched.newPassword && currentErrors.newPassword ? (
                  <p className="text-xs text-red-600 mt-1">
                    {currentErrors.newPassword}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Min {MIN_PW} characters, max {MAX_PW}.
                  </p>
                )}

                {/* Password strength meter */}
                {formData.newPassword && (
                  <div className="mt-2 text-xs">
                    <p className="text-gray-700">
                      Strength:{" "}
                      <span
                        className={`font-semibold ${
                          pwMeta.label === "Strong"
                            ? "text-green-600"
                            : pwMeta.label === "Medium"
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {pwMeta.label}
                      </span>
                    </p>
                    {pwMeta.tips?.length > 0 && (
                      <ul className="list-disc ml-5 mt-1 text-gray-500">
                        {pwMeta.tips.slice(0, 3).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base pr-12 ${
                      touched.confirmPassword && currentErrors.confirmPassword
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    style={{ fontSize: "16px" }}
                    disabled={loading}
                    autoComplete="new-password"
                    maxLength={MAX_PW}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {touched.confirmPassword && currentErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    {currentErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm min-h-[48px] mt-2"
              >
                {loading ? "Resetting password..." : "Reset password"}
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
        </div>
      </main>
    </div>
  );
}

// ===== END OF ResetPassword.js ======================