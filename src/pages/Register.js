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


////////////////////////////////////////////////////////////////////
// // ========================================
// // REGISTER PAGE - FULLY MOBILE RESPONSIVE
// // ========================================
// // File: frontend/src/pages/Register.js
// // Author: OneTechly
// // Purpose: Mobile-first registration page
// // Updated: January 2026 - MOBILE OPTIMIZED

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
//       toast.error('Please fill in all fields');
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 8) {
//       toast.error('Password must be at least 8 characters');
//       return;
//     }

//     setLoading(true);
//     try {
//       await register(formData.username, formData.email, formData.password);
//       toast.success('Account created successfully!');
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(error.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header - Mobile Optimized */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             {/* Logo - Responsive sizing */}
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo 
//                 size={window.innerWidth < 640 ? 32 : 40} 
//                 showText={true} 
//               />
//             </div>

//             {/* "Already have account?" text - Responsive */}
//             <div className="flex items-center gap-2 sm:gap-3">
//               <span className="text-xs sm:text-sm text-gray-600 hidden xs:block">
//                 Already have an account?
//               </span>
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
//               >
//                 Sign in
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Mobile First */}
//       <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
//         <div className="w-full max-w-md">
//           {/* Logo Icon - Responsive sizing */}
//           <div className="flex justify-center mb-6 sm:mb-8">
//             <PixelPerfectLogo 
//               size={window.innerWidth < 640 ? 56 : 64} 
//               showText={false} 
//             />
//           </div>

//           {/* Welcome Text */}
//           <div className="text-center mb-6 sm:mb-8">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//               Create your account
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600">
//               Start capturing perfect screenshots today
//             </p>
//           </div>

//           {/* Register Card - Mobile Optimized */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
//             {/* Features List - Responsive */}
//             <div className="bg-green-50 rounded-lg p-4 mb-6">
//               <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
//                 ✨ Free Plan Includes:
//               </h3>
//               <ul className="space-y-2 text-xs sm:text-sm">
//                 <li className="flex items-start gap-2">
//                   <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700"><strong>100 free screenshots</strong> per month</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Multiple formats (PNG, JPEG, WebP, PDF)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">No credit card required</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="text-gray-700">Cancel anytime</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Register Form - Mobile Optimized */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Username Field */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   placeholder="Choose a username"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
//                   style={{ fontSize: '16px' }} // Prevents iOS zoom
//                   disabled={loading}
//                   autoComplete="username"
//                 />
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="your.email@example.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
//                   style={{ fontSize: '16px' }} // Prevents iOS zoom
//                   disabled={loading}
//                   autoComplete="email"
//                 />
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Create a strong password"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base pr-12"
//                     style={{ fontSize: '16px' }} // Prevents iOS zoom
//                     disabled={loading}
//                     autoComplete="new-password"
//                     maxLength={128}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
//                     aria-label={showPassword ? 'Hide password' : 'Show password'}
//                   >
//                     {showPassword ? (
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     ) : (
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Min 8 characters, max 128 characters
//                 </p>
//               </div>

//               {/* Confirm Password Field */}
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Confirm your password"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base pr-12"
//                     style={{ fontSize: '16px' }} // Prevents iOS zoom
//                     disabled={loading}
//                     autoComplete="new-password"
//                     maxLength={128}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
//                     aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
//                   >
//                     {showConfirmPassword ? (
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     ) : (
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit Button - Touch-friendly */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm min-h-[48px] mt-6"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Creating account...
//                   </span>
//                 ) : (
//                   'Create account'
//                 )}
//               </button>
//             </form>

//             {/* Sign In Link - Mobile Optimized */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 Already have an account?{' '}
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="text-blue-600 hover:text-blue-700 font-semibold"
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </div>
//           </div>

//           {/* Help Text - Mobile Friendly */}
//           <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
//             By creating an account, you agree to our{' '}
//             <button onClick={() => navigate('/terms')} className="text-blue-600 hover:text-blue-700">
//               Terms
//             </button>
//             {' '}and{' '}
//             <button onClick={() => navigate('/privacy')} className="text-blue-600 hover:text-blue-700">
//               Privacy Policy
//             </button>
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// }

