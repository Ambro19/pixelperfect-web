// ========================================
// CONTACT PAGE - PIXELPERFECT
// ========================================
// Author: OneTechly
// Updated: April 2026
//
// ✅ PRODUCTION READY
// ✅ Real email submission via backend /contact endpoint
// ✅ Synchronous send — SMTP failures return HTTP 503 to user
// ✅ Loading, success, and error states (no browser alert())
// ✅ Error banner with direct email fallback
// ✅ Disabled fields + spinner during submission
// ✅ Form reset on success
// ✅ Success screen has proper header + footer matching main page
// ✅ Mobile-responsive design
// ✅ SUPPORT_EMAIL constant — change one line to switch email addresses
// ========================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ── Single source of truth for the support email displayed in the UI ──────
// When switching to support@pixelperfectapi.net, change only this one line.
const SUPPORT_EMAIL = 'onetechly@gmail.com';

// ── Shared header component ───────────────────────────────────────────────
// Extracted so both the form page AND the success screen use identical markup.
const PageHeader = ({ navigate }) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-14 sm:h-16">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <PixelPerfectLogo
            size={window.innerWidth < 640 ? 32 : 40}
            showText={true}
          />
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('/help')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Help Center
          </button>
          <button
            onClick={() => navigate('/docs')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Documentation
          </button>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  </header>
);

// ── Shared footer component ───────────────────────────────────────────────
const PageFooter = ({ navigate }) => (
  <footer className="bg-gray-900 text-white py-12 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
          <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
          <button onClick={() => navigate('/terms')}   className="hover:text-white">Terms</button>
          <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
        </div>
      </div>
    </div>
  </footer>
);

// ── Main component ────────────────────────────────────────────────────────
const Contact = () => {
  const navigate = useNavigate();

  const emptyForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  };

  const [formData,     setFormData]     = useState(emptyForm);
  const [status,       setStatus]       = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const apiUrl =
        process.env.REACT_APP_API_URL || 'https://api.pixelperfectapi.net';

      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Backend returned 4xx/5xx — surface the detail message to the user.
        // A 503 here means SMTP failed on the server side (wrong password, etc.)
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail ||
            `Server error (${response.status}). Please email us directly at ${SUPPORT_EMAIL}.`
        );
      }

      setStatus('success');
      setFormData(emptyForm);
    } catch (err) {
      setStatus('error');
      // Covers both HTTP errors (thrown above) and network failures
      // (fetch() itself throws a TypeError when the server is unreachable)
      setErrorMessage(
        err.message ||
          `Something went wrong. Please email us directly at ${SUPPORT_EMAIL}.`
      );
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  // FIX: Wraps in the full page layout so PageHeader (with PixelPerfect logo
  // top-left) and PageFooter appear, matching the rest of the site.
  // Previously this rendered a bare centered card with no header at all.
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PageHeader navigate={navigate} />

        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">

            {/* Green checkmark */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-600 mb-8">
              Thanks for reaching out. We'll get back to you within 24 hours
              at the email you provided.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Another
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        <PageFooter navigate={navigate} />
      </div>
    );
  }

  // ── Main page ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      <PageHeader navigate={navigate} />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-6">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            We're here to help! Choose the best way to reach us
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Contact Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a message
              </h2>

              {/* Error banner — only shown when backend returns an error */}
              {status === 'error' && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
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
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange('name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                      placeholder="John Doe"
                      disabled={status === 'loading'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange('email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                      placeholder="john@company.com"
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={handleChange('category')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                    disabled={status === 'loading'}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="enterprise">Enterprise Sales</option>
                    <option value="partnership">Partnership</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="How can we help?"
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange('message')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="Tell us more about your question or request..."
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Support Channels */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Support Channels
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📧</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {SUPPORT_EMAIL}
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 pl-13">
                    Response time: Within 24 hours
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💬</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Live Chat</div>
                      <div className="text-sm text-gray-600">
                        Available for Pro+ customers
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 pl-13">
                    Mon–Fri, 9am–5pm EST
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <div className="text-sm text-blue-600">
                        Enterprise customers only
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 pl-13">
                    Dedicated support line
                  </p>
                </div>
              </div>
            </div>

            {/* Office */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Office</h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">PixelPerfect API</p>
                <p>OneTechly</p>
                <p>Albany, NY</p>
                <p>United States</p>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Response Times
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { plan: 'Free',     time: 'Within 72 hours' },
                  { plan: 'Pro',      time: 'Within 4 hours (weekdays)' },
                  { plan: 'Business', time: 'Within 2 hours (weekdays)' },
                  { plan: 'Premium',  time: 'Within 1 hour (24/7)' },
                ].map(({ plan, time }) => (
                  <li key={plan} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span><strong>{plan}:</strong> {time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Additional Resources ── */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📚', title: 'Documentation', desc: 'Find answers in our comprehensive docs',  label: 'Browse Docs →',       path: '/docs'   },
            { icon: '💡', title: 'Help Center',   desc: 'Search our knowledge base',               label: 'Visit Help Center →', path: '/help'   },
            { icon: '📊', title: 'Status Page',   desc: 'Check system status and uptime',          label: 'View Status →',       path: '/status' },
          ].map(({ icon, title, desc, label, path }) => (
            <div
              key={title}
              className="text-center p-6 bg-white rounded-xl border border-gray-200"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">{desc}</p>
              <button
                onClick={() => navigate(path)}
                className="text-blue-600 font-medium hover:underline"
              >
                {label}
              </button>
            </div>
          ))}
        </section>
      </main>

      <PageFooter navigate={navigate} />
    </div>
  );
};

export default Contact;

// ======= END OF Contact.js ===============================================

/////////////////////////////////////////////////////////////
// // ========================================
// // CONTACT PAGE - PIXELPERFECT
// // ========================================
// // Author: OneTechly
// // Updated: April 2026
// //
// // ✅ PRODUCTION READY
// // ✅ Real email submission via backend /contact endpoint
// // ✅ Synchronous send — SMTP failures return HTTP 503 to user
// // ✅ Loading, success, and error states (no browser alert())
// // ✅ Error banner with direct email fallback
// // ✅ Disabled fields + spinner during submission
// // ✅ Form reset on success
// // ✅ Mobile-responsive design
// // ✅ Email shown: onetechly@gmail.com (update to support@pixelperfectapi.net when ready)
// // ========================================

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// const SUPPORT_EMAIL = 'onetechly@gmail.com';

// const Contact = () => {
//   const navigate = useNavigate();

//   const emptyForm = {
//     name: '',
//     email: '',
//     subject: '',
//     message: '',
//     category: 'general',
//   };

//   const [formData, setFormData] = useState(emptyForm);
//   const [status, setStatus] = useState('idle'); // idle | loading | success | error
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleChange = (field) => (e) =>
//     setFormData((prev) => ({ ...prev, [field]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus('loading');
//     setErrorMessage('');

//     try {
//       const apiUrl =
//         process.env.REACT_APP_API_URL || 'https://api.pixelperfectapi.net';

//       const response = await fetch(`${apiUrl}/contact`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         // Backend returned 4xx/5xx — surface the detail message to the user
//         const data = await response.json().catch(() => ({}));
//         throw new Error(
//           data.detail ||
//             `Server error (${response.status}). Please try again or email us at ${SUPPORT_EMAIL}.`
//         );
//       }

//       setStatus('success');
//       setFormData(emptyForm);
//     } catch (err) {
//       setStatus('error');
//       // err.message covers both HTTP errors (above) and network failures (fetch throws TypeError)
//       setErrorMessage(
//         err.message ||
//           `Something went wrong. Please email us directly at ${SUPPORT_EMAIL}.`
//       );
//     }
//   };

//   // ── Success screen ────────────────────────────────────────────────────────
//   if (status === 'success') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg
//               className="w-8 h-8 text-green-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
//           <p className="text-gray-600 mb-8">
//             Thanks for reaching out. We'll get back to you within 24 hours at
//             the email you provided.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <button
//               onClick={() => setStatus('idle')}
//               className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Send Another
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Main page ─────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ── Header ── */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo
//                 size={window.innerWidth < 640 ? 32 : 40}
//                 showText={true}
//               />
//             </div>
//             <nav className="hidden md:flex items-center gap-6">
//               <button
//                 onClick={() => navigate('/help')}
//                 className="text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 Help Center
//               </button>
//               <button
//                 onClick={() => navigate('/docs')}
//                 className="text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 Documentation
//               </button>
//             </nav>
//             <div className="flex items-center gap-2 sm:gap-3">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
//               >
//                 Sign in
//               </button>
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ── Hero ── */}
//       <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="flex justify-center items-center mb-6">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
//             Get in Touch
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-600">
//             We're here to help! Choose the best way to reach us
//           </p>
//         </div>
//       </section>

//       {/* ── Main Content ── */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* ── Contact Form ── */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl border border-gray-200 p-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Send us a message
//               </h2>

//               {/* Error banner — only shown on failure */}
//               {status === 'error' && (
//                 <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
//                   <svg
//                     className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <p className="text-sm text-red-700">{errorMessage}</p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">

//                 {/* Name + Email row */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Full Name *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={handleChange('name')}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
//                       placeholder="John Doe"
//                       disabled={status === 'loading'}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       required
//                       value={formData.email}
//                       onChange={handleChange('email')}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
//                       placeholder="john@company.com"
//                       disabled={status === 'loading'}
//                     />
//                   </div>
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category *
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={handleChange('category')}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
//                     disabled={status === 'loading'}
//                   >
//                     <option value="general">General Inquiry</option>
//                     <option value="technical">Technical Support</option>
//                     <option value="billing">Billing Question</option>
//                     <option value="enterprise">Enterprise Sales</option>
//                     <option value="partnership">Partnership</option>
//                     <option value="bug">Bug Report</option>
//                   </select>
//                 </div>

//                 {/* Subject */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Subject *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.subject}
//                     onChange={handleChange('subject')}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
//                     placeholder="How can we help?"
//                     disabled={status === 'loading'}
//                   />
//                 </div>

//                 {/* Message */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Message *
//                   </label>
//                   <textarea
//                     required
//                     rows={6}
//                     value={formData.message}
//                     onChange={handleChange('message')}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
//                     placeholder="Tell us more about your question or request..."
//                     disabled={status === 'loading'}
//                   />
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={status === 'loading'}
//                   className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {status === 'loading' ? (
//                     <>
//                       <svg
//                         className="animate-spin h-5 w-5 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                         />
//                       </svg>
//                       Sending...
//                     </>
//                   ) : (
//                     'Send Message'
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* ── Sidebar ── */}
//           <div className="space-y-6">

//             {/* Support Channels */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Support Channels
//               </h3>
//               <div className="space-y-4">

//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <span className="text-xl">📧</span>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">Email</div>
//                       <a
//                         href={`mailto:${SUPPORT_EMAIL}`}
//                         className="text-sm text-blue-600 hover:underline"
//                       >
//                         {SUPPORT_EMAIL}
//                       </a>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 pl-13">
//                     Response time: Within 24 hours
//                   </p>
//                 </div>

//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                       <span className="text-xl">💬</span>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">Live Chat</div>
//                       <div className="text-sm text-gray-600">
//                         Available for Pro+ customers
//                       </div>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 pl-13">
//                     Mon–Fri, 9am–5pm EST
//                   </p>
//                 </div>

//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                       <span className="text-xl">📱</span>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">Phone</div>
//                       <div className="text-sm text-blue-600">
//                         Enterprise customers only
//                       </div>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 pl-13">
//                     Dedicated support line
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Office */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Office</h3>
//               <div className="text-gray-600 space-y-1">
//                 <p className="font-medium text-gray-900">PixelPerfect API</p>
//                 <p>OneTechly</p>
//                 <p>Albany, NY</p>
//                 <p>United States</p>
//               </div>
//             </div>

//             {/* Response Times */}
//             <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Response Times
//               </h3>
//               <ul className="space-y-3 text-sm">
//                 {[
//                   { plan: 'Free',     time: 'Within 72 hours' },
//                   { plan: 'Pro',      time: 'Within 4 hours (weekdays)' },
//                   { plan: 'Business', time: 'Within 2 hours (weekdays)' },
//                   { plan: 'Premium',  time: 'Within 1 hour (24/7)' },
//                 ].map(({ plan, time }) => (
//                   <li key={plan} className="flex items-start gap-2">
//                     <svg
//                       className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <span>
//                       <strong>{plan}:</strong> {time}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* ── Additional Resources ── */}
//         <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             {
//               icon: '📚',
//               title: 'Documentation',
//               desc: 'Find answers in our comprehensive docs',
//               label: 'Browse Docs →',
//               path: '/docs',
//             },
//             {
//               icon: '💡',
//               title: 'Help Center',
//               desc: 'Search our knowledge base',
//               label: 'Visit Help Center →',
//               path: '/help',
//             },
//             {
//               icon: '📊',
//               title: 'Status Page',
//               desc: 'Check system status and uptime',
//               label: 'View Status →',
//               path: '/status',
//             },
//           ].map(({ icon, title, desc, label, path }) => (
//             <div
//               key={title}
//               className="text-center p-6 bg-white rounded-xl border border-gray-200"
//             >
//               <div className="text-3xl mb-3">{icon}</div>
//               <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
//               <p className="text-sm text-gray-600 mb-4">{desc}</p>
//               <button
//                 onClick={() => navigate(path)}
//                 className="text-blue-600 font-medium hover:underline"
//               >
//                 {label}
//               </button>
//             </div>
//           ))}
//         </section>
//       </main>

//       {/* ── Footer ── */}
//       <footer className="bg-gray-900 text-white py-12 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
//               <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
//             </div>
//             <div className="flex gap-6 text-sm text-gray-400">
//               <button onClick={() => navigate('/privacy')} className="hover:text-white">
//                 Privacy
//               </button>
//               <button onClick={() => navigate('/terms')} className="hover:text-white">
//                 Terms
//               </button>
//               <button onClick={() => navigate('/cookies')} className="hover:text-white">
//                 Cookies
//               </button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Contact;

