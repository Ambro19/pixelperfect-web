// ========================================
// LOGIN PAGE - FULLY MOBILE RESPONSIVE
// ========================================
// File: frontend/src/pages/LoginPage.js
// Author: OneTechly
// Purpose: Mobile-first login page
// Updated: January 2026 - MOBILE OPTIMIZED

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Mobile Optimized */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo - Responsive sizing */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo 
                size={window.innerWidth < 640 ? 32 : 40} 
                showText={true} 
              />
            </div>

            {/* "New to PixelPerfect?" text - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-gray-600 hidden xs:block">
                New to PixelPerfect?
              </span>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Logo Icon - Responsive sizing */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <PixelPerfectLogo 
              size={window.innerWidth < 640 ? 56 : 64} 
              showText={false} 
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Sign in to your PixelPerfect account
            </p>
          </div>

          {/* Login Card - Mobile Optimized */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            {/* Features List - Responsive */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                PixelPerfect Screenshot API
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Capture screenshots in multiple formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Full-page & viewport captures</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Batch processing (Pro+)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Advanced options (dark mode, custom dimensions)</span>
                </li>
              </ul>
            </div>

            {/* Login Form - Mobile Optimized */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                  style={{ fontSize: '16px' }} // Prevents iOS zoom
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base pr-12"
                    style={{ fontSize: '16px' }} // Prevents iOS zoom
                    disabled={loading}
                    autoComplete="current-password"
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Max 128 characters.</p>
              </div>

              {/* Submit Button - Touch-friendly */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base shadow-sm min-h-[48px]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Register Link - Mobile Optimized */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>

          {/* Help Text - Mobile Friendly */}
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
            By signing in, you agree to our{' '}
            <button onClick={() => navigate('/terms')} className="text-blue-600 hover:text-blue-700">
              Terms
            </button>
            {' '}and{' '}
            <button onClick={() => navigate('/privacy')} className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

/////////////////////////////////////////////////////////////
// // ========================================
// // LOGIN PAGE - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/pages/LoginPage.js
// // Author: OneTechly
// // Purpose: User authentication/login page
// // Updated: January 2026 - Production-ready (password cap + safer error handling)

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'password' && value.length > PASSWORD_MAX_LEN) {
//       setFormData((prev) => ({ ...prev, password: value.slice(0, PASSWORD_MAX_LEN) }));
//       setError(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const username = formData.username.trim();
//     const password = formData.password;

//     if (!username || !password) {
//       setError('Please enter both username and password');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await login(username, password);
//       toast.success('Welcome back!');
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err);

//       const msg = err?.message || 'Login failed';

//       if (msg.includes('Invalid username or password')) {
//         setError('Invalid username or password. Please try again.');
//       } else if (msg.toLowerCase().includes('connect')) {
//         setError('Cannot connect to server. Please check your internet connection.');
//       } else if (msg.toLowerCase().includes('unavailable')) {
//         setError('Service is temporarily unavailable. Please try again later.');
//       } else {
//         setError(msg);
//       }

//       toast.error(msg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header with Logo */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* PixelPerfect Logo (Left) - clickable to home */}
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>

//             {/* Navigation (Right) */}
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600">New to PixelPerfect?</span>
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//               >
//                 Create account
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
//         <div className="w-full max-w-md">
//           {/* Login Form Card */}
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             {/* Logo & Title */}
//             <div className="text-center mb-8">
//               <div className="flex justify-center mb-4">
//                 <PixelPerfectLogo size={64} showText={false} />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
//               <p className="text-gray-600">Sign in to your PixelPerfect account</p>
//             </div>

//             {/* Feature Highlights */}
//             <div className="bg-blue-50 rounded-lg p-4 mb-6">
//               <p className="text-sm font-semibold text-gray-900 mb-2">
//                 PixelPerfect Screenshot API
//               </p>
//               <ul className="text-sm text-gray-700 space-y-1">
//                 <li className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Capture screenshots in multiple formats
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Full-page & viewport captures
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Batch processing (Pro+)
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Advanced options (dark mode, custom dimensions)
//                 </li>
//               </ul>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Username */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your username"
//                   required
//                   disabled={isLoading}
//                   autoComplete="username"
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <a href="#forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
//                     Forgot password?
//                   </a>
//                 </div>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     maxLength={PASSWORD_MAX_LEN}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
//                     placeholder="Enter your password"
//                     required
//                     disabled={isLoading}
//                     autoComplete="current-password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                     aria-label="Toggle password visibility"
//                   >
//                     {showPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//                 <p className="mt-1 text-xs text-gray-500">Max {PASSWORD_MAX_LEN} characters.</p>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                         fill="none"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Signing in...
//                   </span>
//                 ) : (
//                   'Sign in'
//                 )}
//               </button>
//             </form>

//             {/* Create Account Link */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 Don't have an account?{' '}
//                 <button
//                   onClick={() => navigate('/register')}
//                   className="text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   Create new account
//                 </button>
//               </p>
//             </div>
//           </div>

//           {/* Additional Links */}
//           <div className="mt-6 text-center space-y-2">
//             <p className="text-sm text-gray-500">
//               <button onClick={() => navigate('/docs')} className="text-blue-600 hover:text-blue-700">
//                 View Documentation
//               </button>
//               {' | '}
//               <button
//                 onClick={() => navigate('/pricing')}
//                 className="text-blue-600 hover:text-blue-700"
//               >
//                 See Pricing
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

