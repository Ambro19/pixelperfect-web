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


////////////////////////////////////////////////////////////////////
// // ========================================
// // LOGIN PAGE - PRODUCTION READY (NEXT REDIRECT FIXED)
// // ========================================
// // File: frontend/src/pages/LoginPage.js
// // Author: OneTechly
// // Purpose: Mobile-first login page
// // Updated: January 2026 - Supports ?next=/path redirects safely

// import React, { useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import toast from "react-hot-toast";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";

// function safeNextPath(nextRaw) {
//   // Allow ONLY internal paths like "/dashboard"
//   // Block absolute URLs, protocol-relative, javascript:, etc.
//   if (!nextRaw || typeof nextRaw !== "string") return "/dashboard";
//   const next = nextRaw.trim();

//   if (!next.startsWith("/")) return "/dashboard";
//   if (next.startsWith("//")) return "/dashboard"; // protocol-relative
//   if (next.toLowerCase().startsWith("/javascript:")) return "/dashboard";

//   return next;
// }

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Read ?next=/something from query string
//   const nextPath = useMemo(() => {
//     const params = new URLSearchParams(location.search);
//     return safeNextPath(params.get("next"));
//   }, [location.search]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!username.trim() || !password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       await login(username, password);
//       toast.success("Welcome back!");

//       // ✅ After login, go to `next` if provided, otherwise /dashboard
//       navigate(nextPath, { replace: true });
//     } catch (error) {
//       toast.error(error?.message || "Login failed");
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
//             <div className="cursor-pointer" onClick={() => navigate("/")}>
//               <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText={true} />
//             </div>

//             {/* "New to PixelPerfect?" text - Responsive */}
//             <div className="flex items-center gap-2 sm:gap-3">
//               <span className="text-xs sm:text-sm text-gray-600 hidden xs:block">
//                 New to PixelPerfect?
//               </span>
//               <button
//                 onClick={() => navigate("/register")}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
//               >
//                 Create account
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
//             <PixelPerfectLogo size={window.innerWidth < 640 ? 56 : 64} showText={false} />
//           </div>

//           {/* Welcome Text */}
//           <div className="text-center mb-6 sm:mb-8">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
//             <p className="text-sm sm:text-base text-gray-600">
//               Sign in to your PixelPerfect account
//             </p>
//           </div>

//           {/* Login Card - Mobile Optimized */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
//             {/* Features List - Responsive */}
//             <div className="bg-blue-50 rounded-lg p-4 mb-6">
//               <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
//                 PixelPerfect Screenshot API
//               </h3>
//               <ul className="space-y-2 text-xs sm:text-sm">
//                 <li className="flex items-start gap-2">
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="text-gray-700">Capture screenshots in multiple formats</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="text-gray-700">Full-page &amp; viewport captures</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="text-gray-700">Batch processing (Pro+)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="text-gray-700">
//                     Advanced options (dark mode, custom dimensions)
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             {/* Login Form - Mobile Optimized */}
//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//               {/* Username Field */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Enter your username"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
//                   style={{ fontSize: "16px" }} // Prevents iOS zoom
//                   disabled={loading}
//                   autoComplete="username"
//                 />
//               </div>

//               {/* Password Field */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => navigate("/forgot-password")}
//                     className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     Forgot password?
//                   </button>
//                 </div>

//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base pr-12"
//                     style={{ fontSize: "16px" }} // Prevents iOS zoom
//                     disabled={loading}
//                     autoComplete="current-password"
//                     maxLength={128}
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? (
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                         />
//                       </svg>
//                     ) : (
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                         />
//                       </svg>
//                     )}
//                   </button>
//                 </div>

//                 <p className="text-xs text-gray-500 mt-1">Max 128 characters.</p>
//               </div>

//               {/* Submit Button - Touch-friendly */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm min-h-[48px]"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Signing in...
//                   </span>
//                 ) : (
//                   "Sign in"
//                 )}
//               </button>
//             </form>

//             {/* Register Link - Mobile Optimized */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 Don&apos;t have an account?{" "}
//                 <button
//                   onClick={() => navigate("/register")}
//                   className="text-blue-600 hover:text-blue-700 font-semibold"
//                 >
//                   Create one now
//                 </button>
//               </p>
//             </div>
//           </div>

//           {/* Help Text - Mobile Friendly */}
//           <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
//             By signing in, you agree to our{" "}
//             <button onClick={() => navigate("/terms")} className="text-blue-600 hover:text-blue-700">
//               Terms
//             </button>{" "}
//             and{" "}
//             <button onClick={() => navigate("/privacy")} className="text-blue-600 hover:text-blue-700">
//               Privacy Policy
//             </button>
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// }


