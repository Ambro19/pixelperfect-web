// ========================================
// REGISTER PAGE - PRODUCTION READY
// ========================================
// File: frontend/src/pages/Register.js
// Author: OneTechly
// Updated: Feb 2026
//
// Includes:
// - Inline field errors
// - Toast errors (global)
// - Disable submit when invalid
// - Caps lock warning
// - Password strength hints
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

function scorePassword(pw) {
  let score = 0;
  if (!pw) return { score: 0, label: "Enter a password", tips: ["Use at least 8 characters."] };

  const tips = [];
  if (pw.length >= 8) score += 1;
  else tips.push("Use at least 8 characters.");

  if (pw.length >= 12) score += 1;
  else tips.push("12+ characters is stronger.");

  if (/[A-Z]/.test(pw)) score += 1;
  else tips.push("Add an uppercase letter.");

  if (/[a-z]/.test(pw)) score += 1;
  else tips.push("Add a lowercase letter.");

  if (/\d/.test(pw)) score += 1;
  else tips.push("Add a number.");

  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  else tips.push("Add a symbol (e.g., !@#$).");

  let label = "Weak";
  if (score >= 5) label = "Strong";
  else if (score >= 3) label = "Medium";

  return { score, label, tips };
}

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return safeNextPath(params.get("next"));
  }, [location.search]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const validate = (d) => {
    const e = { username: "", email: "", password: "", confirmPassword: "" };

    const u = (d.username || "").trim();
    const mail = (d.email || "").trim();
    const p = d.password || "";
    const cp = d.confirmPassword || "";

    if (!u) e.username = "Username is required.";
    else if (u.length < 3) e.username = "Username must be at least 3 characters.";

    if (!mail) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) e.email = "Enter a valid email address.";

    if (!p) e.password = "Password is required.";
    else if (p.length < 8) e.password = "Password must be at least 8 characters.";
    else if (p.length > 128) e.password = "Password is too long (max 128).";

    if (!cp) e.confirmPassword = "Please confirm your password.";
    else if (p !== cp) e.confirmPassword = "Passwords do not match.";

    return e;
  };

  const currentErrors = useMemo(() => validate(formData), [formData]);
  const isValid =
    !currentErrors.username &&
    !currentErrors.email &&
    !currentErrors.password &&
    !currentErrors.confirmPassword;

  const pwMeta = useMemo(() => scorePassword(formData.password), [formData.password]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleCapsDetect = (e) => {
    if (typeof e?.getModifierState === "function") {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Live update errors after touched
      if (touched[name]) setErrors(validate(next));
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(formData);
    setErrors(v);
    setTouched({ username: true, email: true, password: true, confirmPassword: true });

    if (v.username || v.email || v.password || v.confirmPassword) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.username.trim(),
        formData.email.trim(),
        formData.password
      );
      toast.success("Account created successfully!");
      navigate(nextPath, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
      touched[field] && (errors[field] || currentErrors[field]) ? "border-red-400" : "border-gray-300"
    }`;

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
              onClick={() => navigate(`/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`)}
              className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Sign in
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-sm sm:text-base text-gray-600">Start capturing perfect screenshots today</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => handleBlur("username")}
                  className={fieldClass("username")}
                  style={{ fontSize: "16px" }}
                  disabled={loading}
                  autoComplete="username"
                />
                {touched.username && (errors.username || currentErrors.username) ? (
                  <p className="text-xs text-red-600 mt-1">{errors.username || currentErrors.username}</p>
                ) : null}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={fieldClass("email")}
                  style={{ fontSize: "16px" }}
                  disabled={loading}
                  autoComplete="email"
                />
                {touched.email && (errors.email || currentErrors.email) ? (
                  <p className="text-xs text-red-600 mt-1">{errors.email || currentErrors.email}</p>
                ) : null}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    onKeyUp={handleCapsDetect}
                    onKeyDown={handleCapsDetect}
                    className={`${fieldClass("password")} pr-12`}
                    style={{ fontSize: "16px" }}
                    disabled={loading}
                    autoComplete="new-password"
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

                {capsLockOn ? <p className="text-xs text-amber-600 mt-1">Caps lock is on.</p> : null}

                {touched.password && (errors.password || currentErrors.password) ? (
                  <p className="text-xs text-red-600 mt-1">{errors.password || currentErrors.password}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Min 8 characters, max 128.</p>
                )}

                {/* Password strength */}
                {formData.password ? (
                  <div className="mt-2 text-xs">
                    <p className="text-gray-700">
                      Strength: <span className="font-semibold">{pwMeta.label}</span>
                    </p>
                    {pwMeta.tips?.length ? (
                      <ul className="list-disc ml-5 mt-1 text-gray-500">
                        {pwMeta.tips.slice(0, 3).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={`${fieldClass("confirmPassword")} pr-12`}
                    style={{ fontSize: "16px" }}
                    disabled={loading}
                    autoComplete="new-password"
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {touched.confirmPassword && (errors.confirmPassword || currentErrors.confirmPassword) ? (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.confirmPassword || currentErrors.confirmPassword}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm min-h-[48px] mt-6"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() =>
                    navigate(`/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`)
                  }
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
            By creating an account, you agree to our{" "}
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


