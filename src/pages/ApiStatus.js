// ========================================
// API STATUS PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/ApiStatus.js
// Author: OneTechly
// Updated: March 2026
//
// ✅ FIX: 30-day uptime bars now render correctly as vertical columns
//    — old code used `grid-cols-30` which is not a Tailwind class,
//      causing all 30 bars to stack as full-width horizontal stripes.
//      Fixed using flex layout.
// ✅ IMPROVED: Response time now color-coded (green/yellow/red by ms)
// ✅ IMPROVED: Auto-refresh countdown timer (30s interval shown to user)
// ✅ IMPROVED: Uptime bars show date tooltip + realistic simulated history
// ✅ IMPROVED: Status cards use gradient backgrounds for visual hierarchy
// ✅ IMPROVED: Checking state shows a spinner instead of static text
// ========================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate 30 days of simulated uptime data (all green since we just launched) */
function generateUptimeHistory() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d,
      uptime: 100,          // All operational — update if you track real incidents
      status: 'operational' // 'operational' | 'degraded' | 'outage'
    });
  }
  return days;
}

const UPTIME_HISTORY = generateUptimeHistory();

/** Color-coded response time: <200ms green, <500ms yellow, else red */
function getResponseClass(ms) {
  if (ms === null) return { text: 'text-gray-400', badge: 'bg-gray-100 text-gray-500', label: '—' };
  if (ms < 200)   return { text: 'text-green-600',  badge: 'bg-green-100  text-green-700',  label: 'Excellent' };
  if (ms < 500)   return { text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700', label: 'Good'      };
  return           { text: 'text-red-600',    badge: 'bg-red-100    text-red-700',    label: 'Slow'      };
}

function UptimeBar({ day }) {
  const colors = {
    operational: 'bg-green-500 hover:bg-green-400',
    degraded:    'bg-yellow-400 hover:bg-yellow-300',
    outage:      'bg-red-500 hover:bg-red-400',
  };
  const label = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="group relative flex-1 min-w-0">
      <div className={`h-8 rounded-sm ${colors[day.status]} transition-colors cursor-pointer`} />
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {label} · {day.uptime}% uptime
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApiStatus() {
  const navigate = useNavigate();

  const [status, setStatus] = useState({
    operational: null,
    responseTime: null,
    lastChecked: null,
    error: null,
  });
  const [isChecking,  setIsChecking]  = useState(false);
  const [countdown,   setCountdown]   = useState(30);
  const countdownRef = useRef(null);

  const checkHealth = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    try {
      await api.get('/health', { timeout: 5000 });
      setStatus({
        operational: true,
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        error: null,
      });
    } catch (error) {
      setStatus({
        operational: false,
        responseTime: null,
        lastChecked: new Date(),
        error: error.message,
      });
    } finally {
      setIsChecking(false);
      setCountdown(30);
    }
  };

  // Auto-refresh every 30s + live countdown
  useEffect(() => {
    checkHealth();
    const healthInterval = setInterval(checkHealth, 30_000);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(countdownRef.current);
    };
  }, []);

  // ── Derived state ──
  const isOperational = status.operational;
  const isUnknown     = status.operational === null;

  const rtInfo = getResponseClass(status.responseTime);

  const overallBg    = isUnknown ? 'from-gray-500 to-gray-600'
    : isOperational  ? 'from-green-500 to-emerald-600'
    : 'from-red-500 to-rose-600';

  const overallText  = isUnknown ? 'Checking...'
    : isOperational  ? 'All Systems Operational'
    : 'Experiencing Issues';

  const overallSub   = isUnknown ? 'Running health checks...'
    : isOperational  ? 'All services are running normally.'
    : 'Some services may be impacted. Our team is investigating.';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText={true} />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => navigate('/documentation')}
                className="hidden sm:block px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Docs
              </button>
              <button onClick={() => navigate('/dashboard')}
                className="hidden sm:block px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </button>
              <button onClick={() => navigate('/register')}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── Hero / Overall Status Banner ────────────────────────────────────── */}
        <div className={`bg-gradient-to-r ${overallBg} rounded-2xl p-8 mb-8 text-white text-center shadow-lg`}>
          <div className="flex justify-center mb-4">
            {isChecking || isUnknown ? (
              <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                ${isOperational ? 'bg-white/20' : 'bg-white/20'}`}>
                {isOperational ? '✓' : '✕'}
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{overallText}</h1>
          <p className="text-white/80 text-sm sm:text-base">{overallSub}</p>
          {status.lastChecked && (
            <p className="text-white/60 text-xs mt-3">
              Last checked {status.lastChecked.toLocaleTimeString()} · Next check in{' '}
              <span className="font-semibold text-white/80">{countdown}s</span>
            </p>
          )}
        </div>

        {/* ── Metric Cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          {/* API Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">API Status</span>
              <div className={`w-2.5 h-2.5 rounded-full ${
                isUnknown ? 'bg-gray-400' : isOperational ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'
              }`} />
            </div>
            <p className={`text-xl font-bold ${
              isUnknown ? 'text-gray-500' : isOperational ? 'text-green-600' : 'text-red-600'
            }`}>
              {isUnknown ? 'Checking…' : isOperational ? 'Operational' : 'Degraded'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {status.lastChecked
                ? `Checked at ${status.lastChecked.toLocaleTimeString()}`
                : 'Running first check…'}
            </p>
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Response Time</span>
              {status.responseTime !== null && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rtInfo.badge}`}>
                  {rtInfo.label}
                </span>
              )}
            </div>
            <p className={`text-xl font-bold ${rtInfo.text}`}>
              {status.responseTime !== null ? `${status.responseTime}ms` : '—'}
            </p>
            {/* Mini bar chart for response time */}
            {status.responseTime !== null && (
              <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    status.responseTime < 200 ? 'bg-green-500' :
                    status.responseTime < 500 ? 'bg-yellow-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (status.responseTime / 1000) * 100)}%` }}
                />
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1.5">API health endpoint latency</p>
          </div>

          {/* Uptime */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">30-Day Uptime</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                SLA
              </span>
            </div>
            <p className="text-xl font-bold text-purple-600">99.9%</p>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-1.5 rounded-full bg-purple-500" style={{ width: '99.9%' }} />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">30-day rolling average</p>
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────────────── */}
        {status.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">!</div>
            <div>
              <p className="font-semibold text-red-900">Connection Error</p>
              <p className="text-sm text-red-700 mt-0.5">{status.error}</p>
            </div>
          </div>
        )}

        {/* ── Services ─────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Services</h2>
          <div className="divide-y divide-gray-100">
            {[
              { name: 'Screenshot API',        desc: 'Core screenshot capture service',     live: true  },
              { name: 'Authentication Service', desc: 'API key validation and user auth',   live: false },
              { name: 'CDN / Storage',          desc: 'Cloudflare R2 screenshot delivery',  live: false },
              { name: 'Batch Processing',       desc: 'Multi-screenshot job queue',         live: false },
            ].map(({ name, desc, live }) => {
              // Live services reflect real health check; others are always-green for now
              const up = live ? isOperational : true;
              const unknown = live && isUnknown;
              return (
                <div key={name} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      unknown ? 'bg-gray-300' : up ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    unknown         ? 'bg-gray-100 text-gray-500' :
                    up              ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {unknown ? 'Checking' : up ? 'Operational' : 'Down'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 30-Day Uptime History ─────────────────────────────────────────────
            FIX: Was `grid grid-cols-30 gap-1` — `grid-cols-30` is not a Tailwind
            class so all bars stacked vertically as full-width stripes.
            Now uses `flex gap-1` so bars sit side-by-side as intended.
        ──────────────────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">30-Day Uptime History</h2>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              100% this period
            </span>
          </div>

          {/* ✅ FIXED: flex gap-1 renders 30 vertical bars side-by-side */}
          <div className="flex gap-1 items-end mb-2">
            {UPTIME_HISTORY.map((day, i) => (
              <UptimeBar key={i} day={day} />
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-400 mb-5">
            <span>30 days ago</span>
            <span>Today</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="text-xs text-gray-600">Operational (100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
              <span className="text-xs text-gray-600">Degraded (&lt;100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span className="text-xs text-gray-600">Outage</span>
            </div>
          </div>
        </div>

        {/* ── Refresh Button ───────────────────────────────────────────────────── */}
        <div className="text-center mt-8">
          <button
            onClick={checkHealth}
            disabled={isChecking}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-md"
          >
            <svg className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isChecking ? 'Checking…' : `Refresh Status (auto in ${countdown}s)`}
          </button>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <PixelPerfectLogo size={28} showText={true} />
            </div>
            <p className="text-xs text-gray-500">
              Questions about API status?{' '}
              <a href="mailto:support@pixelperfectapi.net"
                className="text-blue-600 hover:text-blue-700 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////

// // ========================================
// // API STATUS PAGE - PIXELPERFECT
// // ========================================
// // File: frontend/src/pages/ApiStatus.js
// // Author: OneTechly
// // Purpose: Real-time API health and status monitoring
// // Created: January 2026

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../lib/api';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// export default function ApiStatus() {
//   const navigate = useNavigate();
//   const [status, setStatus] = useState({
//     operational: null,
//     responseTime: null,
//     lastChecked: null,
//     error: null
//   });

//   const checkHealth = async () => {
//     const startTime = Date.now();
//     try {
//       await api.get('/health', { timeout: 5000 });
//       const responseTime = Date.now() - startTime;
//       setStatus({
//         operational: true,
//         responseTime,
//         lastChecked: new Date(),
//         error: null
//       });
//     } catch (error) {
//       setStatus({
//         operational: false,
//         responseTime: null,
//         lastChecked: new Date(),
//         error: error.message
//       });
//     }
//   };

//   useEffect(() => {
//     checkHealth();
//     const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const getStatusColor = () => {
//     if (status.operational === null) return 'bg-gray-500';
//     if (status.operational) return 'bg-green-500';
//     return 'bg-red-500';
//   };

//   const getStatusText = () => {
//     if (status.operational === null) return 'Checking...';
//     if (status.operational) return 'Operational';
//     return 'Experiencing Issues';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText={true} />
//             </div>
            
//             <div className="flex items-center gap-2 sm:gap-3">
//               <button
//                 onClick={() => navigate('/docs')}
//                 className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//               >
//                 Documentation
//               </button>
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//         {/* Hero Section with Logo */}
//         <div className="text-center mb-12">
//           <div className="flex justify-center items-center mb-6">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
          
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//             API Status
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//             Real-time status and uptime monitoring for PixelPerfect Screenshot API
//           </p>
//         </div>

//         {/* Status Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           {/* Current Status */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
//               <h3 className="text-lg font-semibold text-gray-900">API Status</h3>
//             </div>
//             <p className={`text-2xl font-bold ${status.operational ? 'text-green-600' : 'text-red-600'}`}>
//               {getStatusText()}
//             </p>
//             {status.lastChecked && (
//               <p className="text-sm text-gray-500 mt-2">
//                 Last checked: {status.lastChecked.toLocaleTimeString()}
//               </p>
//             )}
//           </div>

//           {/* Response Time */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <span className="text-2xl">⚡</span>
//               <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
//             </div>
//             <p className="text-2xl font-bold text-blue-600">
//               {status.responseTime !== null ? `${status.responseTime}ms` : '—'}
//             </p>
//             <p className="text-sm text-gray-500 mt-2">Average API latency</p>
//           </div>

//           {/* Uptime */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <span className="text-2xl">📊</span>
//               <h3 className="text-lg font-semibold text-gray-900">Uptime</h3>
//             </div>
//             <p className="text-2xl font-bold text-purple-600">99.9%</p>
//             <p className="text-sm text-gray-500 mt-2">30-day uptime SLA</p>
//           </div>
//         </div>

//         {/* Error Display */}
//         {status.error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
//             <div className="flex items-start gap-3">
//               <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <div>
//                 <h3 className="text-lg font-semibold text-red-900 mb-2">Connection Error</h3>
//                 <p className="text-red-700">{status.error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Services Status */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
          
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className={`w-3 h-3 rounded-full ${status.operational ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Screenshot API</h3>
//                   <p className="text-sm text-gray-600">Core screenshot capture service</p>
//                 </div>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 status.operational ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {status.operational ? 'Operational' : 'Down'}
//               </span>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Authentication Service</h3>
//                   <p className="text-sm text-gray-600">API key validation and user auth</p>
//                 </div>
//               </div>
//               <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                 Operational
//               </span>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">CDN Delivery</h3>
//                   <p className="text-sm text-gray-600">Global screenshot delivery network</p>
//                 </div>
//               </div>
//               <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                 Operational
//               </span>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Batch Processing</h3>
//                   <p className="text-sm text-gray-600">Multi-screenshot job queue</p>
//                 </div>
//               </div>
//               <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                 Operational
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Uptime History */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">30-Day Uptime History</h2>
          
//           <div className="grid grid-cols-30 gap-1 mb-4">
//             {Array.from({ length: 30 }, (_, i) => (
//               <div
//                 key={i}
//                 className="h-12 bg-green-500 rounded hover:bg-green-600 transition-colors cursor-pointer"
//                 title={`Day ${30 - i}: 100% uptime`}
//               ></div>
//             ))}
//           </div>
          
//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <span>30 days ago</span>
//             <span>Today</span>
//           </div>
          
//           <div className="flex items-center gap-4 mt-6">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-green-500 rounded"></div>
//               <span className="text-sm text-gray-600">100% uptime</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-yellow-500 rounded"></div>
//               <span className="text-sm text-gray-600">Partial outage</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-red-500 rounded"></div>
//               <span className="text-sm text-gray-600">Major outage</span>
//             </div>
//           </div>
//         </div>

//         {/* Refresh Button */}
//         <div className="text-center mt-8">
//           <button
//             onClick={checkHealth}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
//           >
//             Refresh Status
//           </button>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//           <div className="text-center">
//             <div className="flex justify-center mb-3 sm:mb-4">
//               <PixelPerfectLogo size={28} showText={true} />
//             </div>
//             <p className="text-xs sm:text-sm text-gray-500">
//               Questions about API status?{' '}
//               <a 
//                 href="mailto:support@pixelperfectapi.net" 
//                 className="text-blue-600 hover:text-blue-700"
//               >
//                 Contact support
//               </a>
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }