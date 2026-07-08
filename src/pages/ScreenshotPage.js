// frontend/src/pages/ScreenshotPage.js — PixelPerfect Screenshot API
// UPDATED: July 2026
//
// ✅ FIX (July 2026 — Mount Effect Runs Only at Login, Not on Re-navigation):
//   Changed mount useEffect dependency from [isAuthenticated, refreshSubscriptionStatus]
//   to [] (empty array). Previously the effect only ran when isAuthenticated
//   changed — once at login, never on re-navigation in the SPA.
//   With [], React Router v6's unmount+remount on navigation triggers a fresh
//   fetch every time the user visits ScreenshotPage. Ensures usage is current.
//
// ✅ FIX (July 2026 — Billing Cycle Reset Date):
//   Added "Resets on [date]" display under the progress bar.
//   Reads subscriptionStatus.next_reset from the backend subscription_status
//   endpoint. Users now see exactly when their counter will reset — tied to
//   billing cycle, not the calendar 1st of the month. No more surprise 0s.
//
// ✅ CONSISTENCY FIX (July 2026 — Tier Badge Colors):
//   Extracted tier badge colors into TIER_BADGE_CLASSES: PRO=blue,
//   BUSINESS=purple, FREE=yellow, PREMIUM=green. Matches DashboardPage.js.
//
// ⚠️  BACKEND NOTE (models.py — now fixed separately):
//   Business batch_requests changed 500 → 200. models.py now reads all
//   limits from .env so there is only one source of truth.
//
// Previous fixes (all retained):
// ✅ FIX (May 2026 — Phase 2): Element Selection (Business+) with CSS crop
// ✅ FIX (May 2026 — Phase 1): Device emulation, Custom JS, Wait for selector
// ✅ FIX (Apr 2026): friendlyError() translates raw Playwright errors
// ✅ FIX (Mar 2026): resolveApiBase() replaces build-time env var fallback
// ✅ FIX: break-all on error/URL boxes for mobile overflow
// ✅ FIX: URL display — long URLs no longer overflow the green confirmation box

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ── Tier color map — single source of truth ───────────────────────────────
// Must match DashboardPage.js: PRO=blue, BUSINESS=purple, FREE=yellow, PREMIUM=green
const TIER_BADGE_CLASSES = {
  free:     'bg-yellow-100 text-yellow-800 border border-yellow-300',
  pro:      'bg-blue-100   text-blue-800   border border-blue-300',
  business: 'bg-purple-100 text-purple-800 border border-purple-300',
  premium:  'bg-green-100  text-green-800  border border-green-300',
};

function tierBadgeClass(tier) {
  return TIER_BADGE_CLASSES[(tier || 'free').toLowerCase()] ?? TIER_BADGE_CLASSES.free;
}

// ── Runtime API base resolution (mobile/LAN safe) ────────────────────────────
function resolveApiBase() {
  const env = (
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    ''
  ).trim().replace(/\/+$/, '');
  if (env) return env;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'pixelperfectapi.net' || host.endsWith('.pixelperfectapi.net')) {
      return 'https://api.pixelperfectapi.net';
    }
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
      return `http://${host}:8000`;
    }
    return `${window.location.protocol}//${host}:8000`;
  }
  return 'http://localhost:8000';
}

const API_BASE_URL = resolveApiBase();

function friendlyError(msg) {
  if (!msg) return 'Screenshot capture failed. Please try again.';
  const m = msg.toLowerCase();
  if (m.includes('err_name_not_resolved') || m.includes('name not resolved') ||
      m.includes('getaddrinfo') || m.includes('nodename nor servname')) {
    return 'The website address could not be found. Please check that the URL is spelled correctly and the domain exists (e.g. https://example.com — not https://exampel.com).';
  }
  if (m.includes('err_connection_refused') || m.includes('connection refused')) {
    return 'The website refused the connection. The server may be down or blocking automated requests. Please try a different URL.';
  }
  if (m.includes('err_connection_timed_out') || m.includes('err_timed_out') ||
      m.includes('timed out after all retry')) {
    return 'The website took too long to respond. It may be slow or temporarily unavailable. Try adding a delay in Advanced Options, or try again later.';
  }
  if (m.includes('err_cert') || m.includes('ssl') || m.includes('certificate')) {
    return 'The website has an SSL certificate problem (expired or self-signed certificate). The site may not be publicly accessible.';
  }
  if (m.includes('err_access_denied') || m.includes('access denied') || m.includes('forbidden')) {
    return 'Access to this website was denied. The site may be blocking automated access.';
  }
  if (m.includes('element not found')) return msg;
  if (m.includes('zero size') || m.includes('zero width') || m.includes('zero height')) return msg;
  if (m.includes('page.goto')) {
    const codeMatch = msg.match(/net::(ERR_[A-Z_]+)/);
    if (codeMatch) return `Failed to load the website (${codeMatch[1]}). Please check the URL is correct and the site is publicly accessible.`;
    return 'Failed to load the website. Please check the URL is correct and the site is publicly accessible.';
  }
  if (m.includes('limit exceeded') || m.includes('upgrade')) return msg;
  return msg;
}

const VIEWPORT_PRESETS = {
  desktop:   { width: 1920, height: 1080, name: 'Desktop (1920x1080)'   },
  laptop:    { width: 1366, height: 768,  name: 'Laptop (1366x768)'     },
  tablet:    { width: 768,  height: 1024, name: 'Tablet (768x1024)'     },
  mobile:    { width: 375,  height: 667,  name: 'Mobile (375x667)'      },
  ultrawide: { width: 3440, height: 1440, name: 'Ultrawide (3440x1440)' },
};

const DEVICE_PRESETS = [
  { key: '',                  label: '— No device preset (use width/height) —'     },
  { key: 'iphone_13',         label: '📱 iPhone 13 (390×844, Safari)'              },
  { key: 'iphone_13_pro_max', label: '📱 iPhone 13 Pro Max (428×926, Safari)'      },
  { key: 'iphone_se',         label: '📱 iPhone SE (375×667, Safari)'              },
  { key: 'pixel_5',           label: '📱 Google Pixel 5 (393×851, Chrome)'         },
  { key: 'pixel_7',           label: '📱 Google Pixel 7 (412×915, Chrome)'         },
  { key: 'ipad_pro',          label: '📟 iPad Pro 11" (1024×1366, Safari)'         },
  { key: 'ipad_mini',         label: '📟 iPad Mini (768×1024, Safari)'             },
  { key: 'galaxy_s9',         label: '📱 Samsung Galaxy S9+ (320×658, Chrome)'    },
  { key: 'galaxy_tab_s4',     label: '📟 Samsung Galaxy Tab S4 (712×1138, Chrome)' },
];

const JS_PLACEHOLDER = `// Examples:
// Hide a cookie banner:
// document.querySelector('.cookie-banner')?.remove();
//
// Click a button before capture:
// document.querySelector('#accept-all')?.click();
//
// Scroll to bottom:
// window.scrollTo(0, document.body.scrollHeight);`;

export default function ScreenshotPage() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated, logout } = useAuth();
  const { subscriptionStatus, tier, refreshSubscriptionStatus } = useSubscription();

  const isPro      = ['pro', 'business', 'premium'].includes((tier || '').toLowerCase());
  const isBusiness = ['business', 'premium'].includes((tier || '').toLowerCase());

  const [websiteUrl,     setWebsiteUrl]     = useState('');
  const [width,          setWidth]          = useState(1920);
  const [height,         setHeight]         = useState(1080);
  const [format,         setFormat]         = useState('png');
  const [fullPage,       setFullPage]       = useState(false);
  const [darkMode,       setDarkMode]       = useState(false);
  const [delay,          setDelay]          = useState(0);
  const [removeElements, setRemoveElements] = useState('');

  const [screenshotUrl,       setScreenshotUrl]       = useState('');
  const [screenshotData,      setScreenshotData]      = useState(null);
  const [isLoading,           setIsLoading]           = useState(false);
  const [error,               setError]               = useState('');
  const [screenshotCompleted, setScreenshotCompleted] = useState(false);
  const [isRefreshingSubscription, setIsRefreshingSubscription] = useState(false);

  const [advancedProOpen, setAdvancedProOpen] = useState(false);
  const [device,          setDevice]          = useState('');
  const [customJs,        setCustomJs]        = useState('');
  const [waitForSelector, setWaitForSelector] = useState('');
  const [jsWarning,       setJsWarning]       = useState('');

  const [targetElement,   setTargetElement]   = useState('');
  const [elementCaptured, setElementCaptured] = useState('');

  const pollStopRef = useRef(false);

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  const isValidUrl = (url) => {
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch { return false; }
  };

  const xUiValidUrl = isValidUrl(websiteUrl);

  const limits      = useMemo(() => subscriptionStatus?.limits || {}, [subscriptionStatus]);
  const usage       = useMemo(() => subscriptionStatus?.usage  || {}, [subscriptionStatus]);
  const isUnlimited = (l) => l === 'unlimited' || l === Infinity;
  const getUsed     = useCallback((k) => Number(usage?.[k] ?? 0), [usage]);
  const getLimit    = useCallback((k) => limits?.[k],             [limits]);
  const atLimit     = (k) => {
    const lim = getLimit(k);
    if (isUnlimited(lim) || lim === undefined || lim === null) return false;
    return getUsed(k) >= Number(lim);
  };

  const safeFormatUsage = (k) => {
    const u = getUsed(k), l = getLimit(k);
    if (isUnlimited(l)) return `${u} / ∞`;
    return `${Math.min(Number(u || 0), Number(l || 0))} / ${l ?? 0}`;
  };

  const xUiPrimaryDisabled = isLoading || !xUiValidUrl || atLimit('screenshots');

  const xUiDisabledReason = () => {
    if (!xUiValidUrl)           return 'Enter a valid website URL starting with http:// or https://';
    if (atLimit('screenshots')) return 'Monthly screenshot limit reached. Please upgrade your plan.';
    return '';
  };

  const isResetOverdue = useMemo(() => {
    if (!subscriptionStatus?.next_reset) return false;
    const d = new Date(subscriptionStatus.next_reset);
    return !Number.isNaN(d.getTime()) && Date.now() > d.getTime();
  }, [subscriptionStatus]);

  const forceRefreshIfNeeded = useCallback(async () => {
    if (!isAuthenticated || !refreshSubscriptionStatus) return;
    try { await refreshSubscriptionStatus(); } catch {}
  }, [isAuthenticated, refreshSubscriptionStatus]);

  // ✅ FIX: dependency [] → runs on every mount (every navigation to this page)
  useEffect(() => {
    if (isAuthenticated && refreshSubscriptionStatus) {
      refreshSubscriptionStatus().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← empty: run on every mount

  useEffect(() => {
    const onFocus = () => forceRefreshIfNeeded();
    const onVis   = () => { if (document.visibilityState === 'visible') forceRefreshIfNeeded(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [forceRefreshIfNeeded]);

  const pollUsageSync = useCallback(async (beforeUsageMap, key) => {
    for (let i = 0; i < 6 && !pollStopRef.current; i++) {
      try { await refreshSubscriptionStatus(); } catch {}
      await new Promise(r => setTimeout(r, 450));
      if (getUsed(key) > Number(beforeUsageMap?.[key] ?? 0)) return true;
    }
    return false;
  }, [refreshSubscriptionStatus, getUsed]);

  const screenshotsUsed  = getUsed('screenshots');
  const screenshotsLimit = getLimit('screenshots');

  const screenshotsPercent = useMemo(() => {
    if (isUnlimited(screenshotsLimit)) return 0;
    const lim = Number(screenshotsLimit ?? 0);
    if (!lim || Number.isNaN(lim)) return 0;
    return Math.min(100, (screenshotsUsed / lim) * 100);
  }, [screenshotsLimit, screenshotsUsed]);

  const screenshotsRemainingLabel = useMemo(() => {
    if (isUnlimited(screenshotsLimit)) return 'Unlimited screenshots';
    const lim = Number(screenshotsLimit ?? 0);
    if (!lim || Number.isNaN(lim)) return '0 remaining';
    return `${Math.max(0, lim - screenshotsUsed)} remaining`;
  }, [screenshotsLimit, screenshotsUsed]);

  const screenshotsPercentLabel = useMemo(() => {
    if (isUnlimited(screenshotsLimit)) return 'Unlimited';
    const lim = Number(screenshotsLimit ?? 0);
    if (!lim || Number.isNaN(lim)) return '0.0% used';
    return `${screenshotsPercent.toFixed(1)}% used`;
  }, [screenshotsLimit, screenshotsPercent]);

  // ✅ Billing cycle reset date for display
  const resetDateLabel = useMemo(() => {
    if (!subscriptionStatus?.next_reset) return null;
    try {
      const d = new Date(subscriptionStatus.next_reset);
      if (Number.isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return null; }
  }, [subscriptionStatus]);

  const handleCapture = async () => {
    try {
      setIsLoading(true);
      setError('');
      setScreenshotUrl('');
      setScreenshotData(null);
      setScreenshotCompleted(false);
      setJsWarning('');
      setElementCaptured('');
      pollStopRef.current = false;

      if (isResetOverdue) await forceRefreshIfNeeded();

      if (!isValidUrl(websiteUrl)) {
        throw new Error('Please enter a valid website URL starting with http:// or https://');
      }

      // ✅ FIX (July 2026): PDF requires Pro+, not Business-only.
      if (format === 'pdf' && !isPro) {
        throw new Error('PDF generation requires Pro tier or higher. Please upgrade.');
      }
      if (device && !isPro)          throw new Error('Device emulation requires Pro tier or higher. Upgrade to use this feature.');
      if (customJs.trim() && !isPro) throw new Error('Custom JavaScript requires Pro tier or higher. Upgrade to use this feature.');
      if (targetElement.trim() && !isBusiness) throw new Error('Element selection requires Business tier or higher. Upgrade to use this feature.');

      const beforeUsage = { screenshots: getUsed('screenshots') };

      const payload = { url: websiteUrl, width, height, format, full_page: fullPage, dark_mode: darkMode, delay };
      if (removeElements.trim()) payload.remove_elements = removeElements.split(',').map(s => s.trim()).filter(Boolean);
      if (device)                 payload.device            = device;
      if (customJs.trim())        payload.custom_js         = customJs.trim();
      if (waitForSelector.trim()) payload.wait_for_selector = waitForSelector.trim();
      if (targetElement.trim())   payload.target_element    = targetElement.trim();

      const res = await fetch(`${API_BASE_URL}/api/v1/screenshot/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail || 'Screenshot capture failed');
      }

      const data = await res.json();
      if (data.js_warning)       setJsWarning(data.js_warning);
      if (data.element_selector) setElementCaptured(data.element_selector);

      setScreenshotUrl(data.screenshot_url || '');
      setScreenshotData({
        id:         data.screenshot_id,
        url:        websiteUrl,
        width:      data.width,
        height:     data.height,
        format:     data.format,
        size:       data.size_bytes,
        created_at: data.created_at,
      });
      setScreenshotCompleted(true);
      toast.success('📸 Screenshot captured!');

      await pollUsageSync(beforeUsage, 'screenshots');

    } catch (err) {
      const friendly = friendlyError(err.message);
      setError(friendly);
      toast.error(friendly);
    } finally {
      setIsLoading(false);
      try { await refreshSubscriptionStatus(); } catch {}
    }
  };

  const handleDownload = () => {
    if (!screenshotUrl) return;
    const a = document.createElement('a');
    a.href     = screenshotUrl;
    a.download = `screenshot_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('💾 Screenshot downloaded!');
  };

  const applyPreset = (preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    toast.success(`Applied ${preset.name} preset`);
  };

  const primaryBtnClass = `flex-1 py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    xUiPrimaryDisabled
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
  }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">{user?.username || 'User'}</span>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    logout();
                    toast.success('👋 Logged out successfully!');
                    navigate('/login');
                  }
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Capture Website Screenshot</h1>
          <div className="text-sm text-gray-600 mb-2">
            Logged in as{' '}
            <span className="font-semibold text-blue-600">{user?.username || 'User'}</span>{' '}
            ({user?.email})
          </div>

          {/* Subscription card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 mt-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">
                <span className="font-semibold">Current Plan:</span>{' '}
                <span className={`ml-1 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${tierBadgeClass(tier)}`}>
                  {(tier || 'free').toUpperCase()}
                </span>
              </div>
              <button
                onClick={async () => {
                  setIsRefreshingSubscription(true);
                  try {
                    await refreshSubscriptionStatus();
                    toast.success('Subscription status refreshed!', { duration: 1600 });
                  } catch { toast.error('Failed to refresh subscription status'); }
                  finally { setIsRefreshingSubscription(false); }
                }}
                disabled={isRefreshingSubscription}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center transition-colors"
              >
                <svg className={`w-3 h-3 mr-1 ${isRefreshingSubscription ? 'animate-spin' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefreshingSubscription ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-2 text-xs">
              <div className="font-medium">📸 Screenshots: {safeFormatUsage('screenshots')}</div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">📸 Screenshots Used This Month</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {safeFormatUsage('screenshots')}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${screenshotsPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{screenshotsRemainingLabel}</span>
                <span className="text-xs font-medium text-gray-600">{screenshotsPercentLabel}</span>
              </div>
              {/* ✅ NEW: Billing cycle reset date */}
              {resetDateLabel && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Resets on <span className="font-medium text-gray-500 ml-1">{resetDateLabel}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Example websites */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-green-800 font-semibold mb-2">✅ Try These Example Websites:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-green-700">Example.com</div>
              <div className="text-green-600">Simple test website</div>
              <button onClick={() => setWebsiteUrl('https://example.com')} className="text-xs text-green-500 hover:text-green-700 underline mt-1">Use this URL</button>
            </div>
            <div>
              <div className="font-medium text-green-700">GitHub.com</div>
              <div className="text-green-600">Popular code hosting site</div>
              <button onClick={() => setWebsiteUrl('https://github.com')} className="text-xs text-green-500 hover:text-green-700 underline mt-1">Use this URL</button>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Website URL:</label>
          <input
            type="text"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={e => setWebsiteUrl(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Valid URL pill */}
        {websiteUrl && xUiValidUrl && (() => {
          let displayDomain = websiteUrl;
          try { displayDomain = new URL(websiteUrl).hostname; } catch {}
          return (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-green-100 border-b border-green-200">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
                <span className="text-sm font-semibold text-green-800">Valid URL detected</span>
                <span className="ml-auto text-xs font-medium text-green-700 bg-green-200 px-2 py-0.5 rounded-full truncate max-w-[180px]" title={displayDomain}>{displayDomain}</span>
              </div>
              <div className="px-4 py-2.5" title={websiteUrl}>
                <p className="text-xs font-mono text-green-700 break-all leading-relaxed">{websiteUrl}</p>
              </div>
            </div>
          );
        })()}

        {/* Screenshot Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">📐 Screenshot Configuration</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {Object.entries(VIEWPORT_PRESETS).map(([key, preset]) => (
                <button key={key} onClick={() => applyPreset(preset)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">{preset.name}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
              <input type="number" value={width} onChange={e => setWidth(parseInt(e.target.value) || 1920)} className="w-full border border-gray-300 rounded px-3 py-2" min="320" max="3840" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
              <input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 1080)} className="w-full border border-gray-300 rounded px-3 py-2" min="240" max="2160" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            {/*
              ✅ FIX (July 2026 — PDF Tier Gate: Pro+ only):
              PDF is now available on Pro, Business, and Premium plans.
              Free tier users: PDF option is visually labelled as Pro+.
              Selecting PDF on Free tier shows an upgrade prompt and
              resets the format to PNG — no hard disable since native
              <select disabled> on option is unreliable across browsers.
              The backend also enforces this at 403 level.
            */}
            <select
              value={format}
              onChange={e => {
                const next = e.target.value;
                if (next === 'pdf' && !isPro) {
                  toast.error('PDF format requires Pro tier or higher.', {
                    duration: 4000,
                    icon: '🔒',
                  });
                  navigate('/pricing');
                  return;           // Don't change format — stay on PNG/JPEG/WebP
                }
                setFormat(next);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="png">PNG (lossless, larger file)</option>
              <option value="jpeg">JPEG (lossy, smaller file)</option>
              <option value="webp">WebP (best compression)</option>
              <option value="pdf">{isPro ? 'PDF (document format)' : 'PDF (document format) 🔒 Pro+ required'}</option>
            </select>
            {!isPro && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <span>🔒</span> PDF format requires Pro tier or higher.{' '}
                <button
                  type="button"
                  onClick={() => navigate('/pricing')}
                  className="underline font-semibold hover:text-amber-800"
                >
                  Upgrade →
                </button>
              </p>
            )}
          </div>

          <div className="space-y-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={fullPage} onChange={e => setFullPage(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm text-gray-700">Capture full page (scroll entire page)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm text-gray-700">Use dark mode</span>
            </label>
          </div>

          {/* Standard Advanced Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Options</h4>
            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1">Delay before capture (seconds)</label>
              {/*
                ✅ FIX (July 2026 — Mobile Delay UX):
                Changed from <input type="number"> to <select>.
                A number input triggers the mobile numeric keyboard, forcing
                users to tap, type, and dismiss — poor UX on touch screens.
                A select gives a native bottom-sheet picker on mobile and a
                clean dropdown on desktop. Practical values 0–10 cover 100%
                of real use cases; free-form entry was rarely needed.
              */}
              <select
                value={delay}
                onChange={e => setDelay(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value={0}>0 s — Capture immediately</option>
                <option value={1}>1 s</option>
                <option value={2}>2 s — Recommended for most sites</option>
                <option value={3}>3 s</option>
                <option value={5}>5 s — Recommended for heavy pages</option>
                <option value={10}>10 s — Maximum</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Extra wait time after page load before capture begins</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Remove elements (CSS selectors)</label>
              <input type="text" value={removeElements} onChange={e => setRemoveElements(e.target.value)} placeholder=".cookie-banner, #popup, .ads" className="w-full border border-gray-300 rounded px-3 py-2" />
              <p className="text-xs text-gray-500 mt-1">Comma-separated CSS selectors to hide before capture</p>
            </div>
          </div>

          {/* Pro & Business features */}
          <div className="border-t border-gray-200 mt-4 pt-4">
            <button type="button" onClick={() => setAdvancedProOpen(o => !o)} className="w-full flex items-center justify-between py-1 mb-1 hover:opacity-80 transition-opacity">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                ⚡ Pro & Business Features
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">Pro+</span>
              </h4>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${advancedProOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {advancedProOpen && (
              <div className="space-y-5 mt-3">
                {!isPro && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
                    🔒 Device emulation, Custom JavaScript, and Wait for selector require <strong>Pro tier or higher</strong>.{' '}
                    <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-purple-900">Upgrade →</button>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-700 mb-1">📱 Device Preset <span className="text-xs text-purple-600 font-semibold">(Pro+)</span></label>
                  <select value={device} onChange={e => setDevice(e.target.value)} disabled={!isPro} className={`w-full border border-gray-300 rounded px-3 py-2 text-sm ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}>
                    {DEVICE_PRESETS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                  </select>
                  {device && isPro && <p className="text-xs text-gray-500 mt-1">Device preset overrides the width/height fields above.</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">⏳ Wait for CSS Selector <span className="text-xs text-purple-600 font-semibold">(Pro+)</span></label>
                  <input type="text" value={waitForSelector} onChange={e => setWaitForSelector(e.target.value)} disabled={!isPro} placeholder="#main-content  or  .hero-section" className={`w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`} />
                  <p className="text-xs text-gray-500 mt-1">Waits up to 10 seconds for this element to appear before capturing.</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">{'</>'} Custom JavaScript <span className="text-xs text-purple-600 font-semibold">(Pro+)</span></label>
                  <textarea value={customJs} onChange={e => setCustomJs(e.target.value)} disabled={!isPro} placeholder={JS_PLACEHOLDER} maxLength={10000} rows={6}
                    className={`w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono resize-y ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-gray-900 text-green-400'}`}
                    style={isPro ? { lineHeight: '1.6' } : {}} />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">Executes after page load, before capture. Errors are non-fatal.</p>
                    <p className={`text-xs flex-shrink-0 ml-2 ${customJs.length > 9500 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>{customJs.length.toLocaleString()} / 10,000</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-700">🏢 Business Features</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">Business+</span>
                  </div>
                  {isPro && !isBusiness && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800 mb-3">
                      🔒 Element selection requires <strong>Business tier or higher</strong>.{' '}
                      <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-indigo-900">Upgrade →</button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">✂️ Element Selection — Crop to CSS Selector <span className="text-xs text-indigo-600 font-semibold">(Business+)</span></label>
                    <input type="text" value={targetElement} onChange={e => setTargetElement(e.target.value)} disabled={!isBusiness} placeholder="#hero  or  .pricing-table  or  main > article"
                      className={`w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono ${!isBusiness ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`} />
                    <p className="text-xs text-gray-500 mt-1">Captures the full page, then automatically crops to this element's bounding box. Returns HTTP 400 if the selector matches nothing.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {atLimit('screenshots') && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
            ⚠️ Monthly screenshot limit reached. Please upgrade your plan.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg mb-4 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-100 border-b border-red-200">
              <span className="flex-shrink-0 text-red-600 font-bold">⚠️</span>
              <span className="text-sm font-semibold text-red-800">Screenshot failed</span>
            </div>
            <div className="px-4 py-2.5">
              <p className="text-sm text-red-700 leading-relaxed break-words">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button onClick={handleCapture} disabled={xUiPrimaryDisabled} aria-disabled={xUiPrimaryDisabled} title={xUiDisabledReason()} className={primaryBtnClass}>
            {isLoading ? '⏳ Capturing…' : '📸 Capture Screenshot'}
          </button>
          <button
            onClick={() => {
              setWebsiteUrl(''); setScreenshotUrl(''); setScreenshotData(null);
              setError(''); setScreenshotCompleted(false);
              setJsWarning(''); setElementCaptured('');
              setDevice(''); setCustomJs(''); setWaitForSelector('');
              setTargetElement('');
              pollStopRef.current = true;
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            🗑️ Clear
          </button>
        </div>

        {jsWarning && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg mb-4 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 border-b border-amber-200">
              <span className="text-amber-600 font-bold">⚠️</span>
              <span className="text-sm font-semibold text-amber-800">JavaScript Warning — screenshot still captured</span>
            </div>
            <div className="px-4 py-2.5">
              <p className="text-xs font-mono text-amber-700 break-all leading-relaxed">{jsWarning}</p>
            </div>
          </div>
        )}

        {elementCaptured && (
          <div className="bg-green-50 border border-green-300 rounded-lg mb-4 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-green-100 border-b border-green-200">
              <span className="text-green-600 font-bold">✂️</span>
              <span className="text-sm font-semibold text-green-800">Element captured — cropped to selector</span>
            </div>
            <div className="px-4 py-2.5">
              <p className="text-xs font-mono text-green-700 break-all leading-relaxed">{elementCaptured}</p>
            </div>
          </div>
        )}

        {screenshotUrl && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              {format === 'pdf' ? '📄' : '🖼️'} Screenshot Result
              {screenshotCompleted && <span className="ml-2 text-green-600 text-sm font-normal">✅ Capture Complete</span>}
            </h2>
            {format === 'pdf' ? (
              <div className="mb-4">
                <div className="rounded-lg overflow-hidden border border-gray-300 shadow-lg bg-gray-100" style={{ height: '500px' }}>
                  <iframe src={screenshotUrl} title="PDF preview" className="w-full h-full" style={{ border: 'none' }} />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">📱 If the PDF doesn't display above, use the buttons below to download or open it.</p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <img src={screenshotUrl} alt="Screenshot preview" className="max-w-full h-auto border border-gray-300 rounded shadow-lg mx-auto" />
              </div>
            )}
            {screenshotData && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4 border border-green-200">
                <div className="font-semibold text-gray-800 mb-1">{format === 'pdf' ? '📄 PDF Details' : '✅ Screenshot Details'}</div>
                <div className="text-sm text-gray-800 break-all">URL: {screenshotData.url}</div>
                <div className="text-sm text-gray-800">Dimensions: {screenshotData.width}×{screenshotData.height}</div>
                <div className="text-sm text-gray-800">Format: {screenshotData.format?.toUpperCase()}</div>
                {elementCaptured && <div className="text-sm text-gray-800">Element: <code className="bg-gray-100 px-1 rounded text-xs font-mono">{elementCaptured}</code></div>}
                {screenshotData.size && <div className="text-sm text-gray-800">Size: {(screenshotData.size / 1024).toFixed(2)} KB</div>}
              </div>
            )}
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                {format === 'pdf' ? '📥 Download PDF' : '💾 Download'}
              </button>
              <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                {format === 'pdf' ? '📄 Open PDF' : '🔗 Open in New Tab'}
              </a>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/dashboard')} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">← Back to Dashboard</button>
            <button onClick={() => navigate('/history')}   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">📚 View History</button>
            <button onClick={() => navigate('/activity')}  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">📋 Recent Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== END OF ScreenshotPage.js ==============

// // frontend/src/pages/ScreenshotPage.js — PixelPerfect Screenshot API
// // UPDATED: July 2026
// //
// // ✅ FIX (July 2026 — Mount Effect Runs Only at Login, Not on Re-navigation):
// //   Changed mount useEffect dependency from [isAuthenticated, refreshSubscriptionStatus]
// //   to [] (empty array). Previously the effect only ran when isAuthenticated
// //   changed — once at login, never on re-navigation in the SPA.
// //   With [], React Router v6's unmount+remount on navigation triggers a fresh
// //   fetch every time the user visits ScreenshotPage. Ensures usage is current.
// //
// // ✅ FIX (July 2026 — Billing Cycle Reset Date):
// //   Added "Resets on [date]" display under the progress bar.
// //   Reads subscriptionStatus.next_reset from the backend subscription_status
// //   endpoint. Users now see exactly when their counter will reset — tied to
// //   billing cycle, not the calendar 1st of the month. No more surprise 0s.
// //
// // ✅ CONSISTENCY FIX (July 2026 — Tier Badge Colors):
// //   Extracted tier badge colors into TIER_BADGE_CLASSES: PRO=blue,
// //   BUSINESS=purple, FREE=yellow, PREMIUM=green. Matches DashboardPage.js.
// //
// // ⚠️  BACKEND NOTE (models.py — now fixed separately):
// //   Business batch_requests changed 500 → 200. models.py now reads all
// //   limits from .env so there is only one source of truth.
// //
// // Previous fixes (all retained):
// // ✅ FIX (May 2026 — Phase 2): Element Selection (Business+) with CSS crop
// // ✅ FIX (May 2026 — Phase 1): Device emulation, Custom JS, Wait for selector
// // ✅ FIX (Apr 2026): friendlyError() translates raw Playwright errors
// // ✅ FIX (Mar 2026): resolveApiBase() replaces build-time env var fallback
// // ✅ FIX: break-all on error/URL boxes for mobile overflow
// // ✅ FIX: URL display — long URLs no longer overflow the green confirmation box

// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import { useSubscription } from '../contexts/SubscriptionContext';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// // ── Tier color map — single source of truth ───────────────────────────────
// // Must match DashboardPage.js: PRO=blue, BUSINESS=purple, FREE=yellow, PREMIUM=green
// const TIER_BADGE_CLASSES = {
//   free:     'bg-yellow-100 text-yellow-800 border border-yellow-300',
//   pro:      'bg-blue-100   text-blue-800   border border-blue-300',
//   business: 'bg-purple-100 text-purple-800 border border-purple-300',
//   premium:  'bg-green-100  text-green-800  border border-green-300',
// };

// function tierBadgeClass(tier) {
//   return TIER_BADGE_CLASSES[(tier || 'free').toLowerCase()] ?? TIER_BADGE_CLASSES.free;
// }

// // ── Runtime API base resolution (mobile/LAN safe) ────────────────────────────
// function resolveApiBase() {
//   const env = (
//     process.env.REACT_APP_API_URL ||
//     process.env.REACT_APP_API_BASE_URL ||
//     ''
//   ).trim().replace(/\/+$/, '');
//   if (env) return env;

//   if (typeof window !== 'undefined') {
//     const host = window.location.hostname;
//     if (host === 'pixelperfectapi.net' || host.endsWith('.pixelperfectapi.net')) {
//       return 'https://api.pixelperfectapi.net';
//     }
//     if (host === 'localhost' || host === '127.0.0.1') {
//       return 'http://localhost:8000';
//     }
//     if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
//       return `http://${host}:8000`;
//     }
//     return `${window.location.protocol}//${host}:8000`;
//   }
//   return 'http://localhost:8000';
// }

// const API_BASE_URL = resolveApiBase();

// function friendlyError(msg) {
//   if (!msg) return 'Screenshot capture failed. Please try again.';
//   const m = msg.toLowerCase();
//   if (m.includes('err_name_not_resolved') || m.includes('name not resolved') ||
//       m.includes('getaddrinfo') || m.includes('nodename nor servname')) {
//     return 'The website address could not be found. Please check that the URL is spelled correctly and the domain exists (e.g. https://example.com — not https://exampel.com).';
//   }
//   if (m.includes('err_connection_refused') || m.includes('connection refused')) {
//     return 'The website refused the connection. The server may be down or blocking automated requests. Please try a different URL.';
//   }
//   if (m.includes('err_connection_timed_out') || m.includes('err_timed_out') ||
//       m.includes('timed out after all retry')) {
//     return 'The website took too long to respond. It may be slow or temporarily unavailable. Try adding a delay in Advanced Options, or try again later.';
//   }
//   if (m.includes('err_cert') || m.includes('ssl') || m.includes('certificate')) {
//     return 'The website has an SSL certificate problem (expired or self-signed certificate). The site may not be publicly accessible.';
//   }
//   if (m.includes('err_access_denied') || m.includes('access denied') || m.includes('forbidden')) {
//     return 'Access to this website was denied. The site may be blocking automated access.';
//   }
//   if (m.includes('element not found')) return msg;
//   if (m.includes('zero size') || m.includes('zero width') || m.includes('zero height')) return msg;
//   if (m.includes('page.goto')) {
//     const codeMatch = msg.match(/net::(ERR_[A-Z_]+)/);
//     if (codeMatch) return `Failed to load the website (${codeMatch[1]}). Please check the URL is correct and the site is publicly accessible.`;
//     return 'Failed to load the website. Please check the URL is correct and the site is publicly accessible.';
//   }
//   if (m.includes('limit exceeded') || m.includes('upgrade')) return msg;
//   return msg;
// }

// const VIEWPORT_PRESETS = {
//   desktop:   { width: 1920, height: 1080, name: 'Desktop (1920x1080)'   },
//   laptop:    { width: 1366, height: 768,  name: 'Laptop (1366x768)'     },
//   tablet:    { width: 768,  height: 1024, name: 'Tablet (768x1024)'     },
//   mobile:    { width: 375,  height: 667,  name: 'Mobile (375x667)'      },
//   ultrawide: { width: 3440, height: 1440, name: 'Ultrawide (3440x1440)' },
// };

// const DEVICE_PRESETS = [
//   { key: '',                  label: '— No device preset (use width/height) —'     },
//   { key: 'iphone_13',         label: '📱 iPhone 13 (390×844, Safari)'              },
//   { key: 'iphone_13_pro_max', label: '📱 iPhone 13 Pro Max (428×926, Safari)'      },
//   { key: 'iphone_se',         label: '📱 iPhone SE (375×667, Safari)'              },
//   { key: 'pixel_5',           label: '📱 Google Pixel 5 (393×851, Chrome)'         },
//   { key: 'pixel_7',           label: '📱 Google Pixel 7 (412×915, Chrome)'         },
//   { key: 'ipad_pro',          label: '📟 iPad Pro 11" (1024×1366, Safari)'         },
//   { key: 'ipad_mini',         label: '📟 iPad Mini (768×1024, Safari)'             },
//   { key: 'galaxy_s9',         label: '📱 Samsung Galaxy S9+ (320×658, Chrome)'    },
//   { key: 'galaxy_tab_s4',     label: '📟 Samsung Galaxy Tab S4 (712×1138, Chrome)' },
// ];

// const JS_PLACEHOLDER = `// Examples:
// // Hide a cookie banner:
// // document.querySelector('.cookie-banner')?.remove();
// //
// // Click a button before capture:
// // document.querySelector('#accept-all')?.click();
// //
// // Scroll to bottom:
// // window.scrollTo(0, document.body.scrollHeight);`;

// export default function ScreenshotPage() {
//   const navigate = useNavigate();
//   const { token, user, isAuthenticated, logout } = useAuth();
//   const { subscriptionStatus, tier, refreshSubscriptionStatus } = useSubscription();

//   const isPro      = ['pro', 'business', 'premium'].includes((tier || '').toLowerCase());
//   const isBusiness = ['business', 'premium'].includes((tier || '').toLowerCase());

//   const [websiteUrl,     setWebsiteUrl]     = useState('');
//   const [width,          setWidth]          = useState(1920);
//   const [height,         setHeight]         = useState(1080);
//   const [format,         setFormat]         = useState('png');
//   const [fullPage,       setFullPage]       = useState(false);
//   const [darkMode,       setDarkMode]       = useState(false);
//   const [delay,          setDelay]          = useState(0);
//   const [removeElements, setRemoveElements] = useState('');

//   const [screenshotUrl,       setScreenshotUrl]       = useState('');
//   const [screenshotData,      setScreenshotData]      = useState(null);
//   const [isLoading,           setIsLoading]           = useState(false);
//   const [error,               setError]               = useState('');
//   const [screenshotCompleted, setScreenshotCompleted] = useState(false);
//   const [isRefreshingSubscription, setIsRefreshingSubscription] = useState(false);

//   const [advancedProOpen, setAdvancedProOpen] = useState(false);
//   const [device,          setDevice]          = useState('');
//   const [customJs,        setCustomJs]        = useState('');
//   const [waitForSelector, setWaitForSelector] = useState('');
//   const [jsWarning,       setJsWarning]       = useState('');

//   const [targetElement,   setTargetElement]   = useState('');
//   const [elementCaptured, setElementCaptured] = useState('');

//   const pollStopRef = useRef(false);

//   useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

//   const isValidUrl = (url) => {
//     try {
//       const u = new URL(url);
//       return u.protocol === 'http:' || u.protocol === 'https:';
//     } catch { return false; }
//   };

//   const xUiValidUrl = isValidUrl(websiteUrl);

//   const limits      = useMemo(() => subscriptionStatus?.limits || {}, [subscriptionStatus]);
//   const usage       = useMemo(() => subscriptionStatus?.usage  || {}, [subscriptionStatus]);
//   const isUnlimited = (l) => l === 'unlimited' || l === Infinity;
//   const getUsed     = useCallback((k) => Number(usage?.[k] ?? 0), [usage]);
//   const getLimit    = useCallback((k) => limits?.[k],             [limits]);
//   const atLimit     = (k) => {
//     const lim = getLimit(k);
//     if (isUnlimited(lim) || lim === undefined || lim === null) return false;
//     return getUsed(k) >= Number(lim);
//   };

//   const safeFormatUsage = (k) => {
//     const u = getUsed(k), l = getLimit(k);
//     if (isUnlimited(l)) return `${u} / ∞`;
//     return `${Math.min(Number(u || 0), Number(l || 0))} / ${l ?? 0}`;
//   };

//   const xUiPrimaryDisabled = isLoading || !xUiValidUrl || atLimit('screenshots');

//   const xUiDisabledReason = () => {
//     if (!xUiValidUrl)           return 'Enter a valid website URL starting with http:// or https://';
//     if (atLimit('screenshots')) return 'Monthly screenshot limit reached. Please upgrade your plan.';
//     return '';
//   };

//   const isResetOverdue = useMemo(() => {
//     if (!subscriptionStatus?.next_reset) return false;
//     const d = new Date(subscriptionStatus.next_reset);
//     return !Number.isNaN(d.getTime()) && Date.now() > d.getTime();
//   }, [subscriptionStatus]);

//   const forceRefreshIfNeeded = useCallback(async () => {
//     if (!isAuthenticated || !refreshSubscriptionStatus) return;
//     try { await refreshSubscriptionStatus(); } catch {}
//   }, [isAuthenticated, refreshSubscriptionStatus]);

//   // ✅ FIX: dependency [] → runs on every mount (every navigation to this page)
//   useEffect(() => {
//     if (isAuthenticated && refreshSubscriptionStatus) {
//       refreshSubscriptionStatus().catch(() => {});
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // ← empty: run on every mount

//   useEffect(() => {
//     const onFocus = () => forceRefreshIfNeeded();
//     const onVis   = () => { if (document.visibilityState === 'visible') forceRefreshIfNeeded(); };
//     window.addEventListener('focus', onFocus);
//     document.addEventListener('visibilitychange', onVis);
//     return () => {
//       window.removeEventListener('focus', onFocus);
//       document.removeEventListener('visibilitychange', onVis);
//     };
//   }, [forceRefreshIfNeeded]);

//   const pollUsageSync = useCallback(async (beforeUsageMap, key) => {
//     for (let i = 0; i < 6 && !pollStopRef.current; i++) {
//       try { await refreshSubscriptionStatus(); } catch {}
//       await new Promise(r => setTimeout(r, 450));
//       if (getUsed(key) > Number(beforeUsageMap?.[key] ?? 0)) return true;
//     }
//     return false;
//   }, [refreshSubscriptionStatus, getUsed]);

//   const screenshotsUsed  = getUsed('screenshots');
//   const screenshotsLimit = getLimit('screenshots');

//   const screenshotsPercent = useMemo(() => {
//     if (isUnlimited(screenshotsLimit)) return 0;
//     const lim = Number(screenshotsLimit ?? 0);
//     if (!lim || Number.isNaN(lim)) return 0;
//     return Math.min(100, (screenshotsUsed / lim) * 100);
//   }, [screenshotsLimit, screenshotsUsed]);

//   const screenshotsRemainingLabel = useMemo(() => {
//     if (isUnlimited(screenshotsLimit)) return 'Unlimited screenshots';
//     const lim = Number(screenshotsLimit ?? 0);
//     if (!lim || Number.isNaN(lim)) return '0 remaining';
//     return `${Math.max(0, lim - screenshotsUsed)} remaining`;
//   }, [screenshotsLimit, screenshotsUsed]);

//   const screenshotsPercentLabel = useMemo(() => {
//     if (isUnlimited(screenshotsLimit)) return 'Unlimited';
//     const lim = Number(screenshotsLimit ?? 0);
//     if (!lim || Number.isNaN(lim)) return '0.0% used';
//     return `${screenshotsPercent.toFixed(1)}% used`;
//   }, [screenshotsLimit, screenshotsPercent]);

//   // ✅ Billing cycle reset date for display
//   const resetDateLabel = useMemo(() => {
//     if (!subscriptionStatus?.next_reset) return null;
//     try {
//       const d = new Date(subscriptionStatus.next_reset);
//       if (Number.isNaN(d.getTime())) return null;
//       return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
//     } catch { return null; }
//   }, [subscriptionStatus]);

//   const handleCapture = async () => {
//     try {
//       setIsLoading(true);
//       setError('');
//       setScreenshotUrl('');
//       setScreenshotData(null);
//       setScreenshotCompleted(false);
//       setJsWarning('');
//       setElementCaptured('');
//       pollStopRef.current = false;

//       if (isResetOverdue) await forceRefreshIfNeeded();

//       if (!isValidUrl(websiteUrl)) {
//         throw new Error('Please enter a valid website URL starting with http:// or https://');
//       }

//       if (device && !isPro)          throw new Error('Device emulation requires Pro tier or higher. Upgrade to use this feature.');
//       if (customJs.trim() && !isPro) throw new Error('Custom JavaScript requires Pro tier or higher. Upgrade to use this feature.');
//       if (targetElement.trim() && !isBusiness) throw new Error('Element selection requires Business tier or higher. Upgrade to use this feature.');

//       const beforeUsage = { screenshots: getUsed('screenshots') };

//       const payload = { url: websiteUrl, width, height, format, full_page: fullPage, dark_mode: darkMode, delay };
//       if (removeElements.trim()) payload.remove_elements = removeElements.split(',').map(s => s.trim()).filter(Boolean);
//       if (device)                 payload.device            = device;
//       if (customJs.trim())        payload.custom_js         = customJs.trim();
//       if (waitForSelector.trim()) payload.wait_for_selector = waitForSelector.trim();
//       if (targetElement.trim())   payload.target_element    = targetElement.trim();

//       const res = await fetch(`${API_BASE_URL}/api/v1/screenshot/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const e = await res.json().catch(() => ({}));
//         throw new Error(e.detail || 'Screenshot capture failed');
//       }

//       const data = await res.json();
//       if (data.js_warning)       setJsWarning(data.js_warning);
//       if (data.element_selector) setElementCaptured(data.element_selector);

//       setScreenshotUrl(data.screenshot_url || '');
//       setScreenshotData({
//         id:         data.screenshot_id,
//         url:        websiteUrl,
//         width:      data.width,
//         height:     data.height,
//         format:     data.format,
//         size:       data.size_bytes,
//         created_at: data.created_at,
//       });
//       setScreenshotCompleted(true);
//       toast.success('📸 Screenshot captured!');

//       await pollUsageSync(beforeUsage, 'screenshots');

//     } catch (err) {
//       const friendly = friendlyError(err.message);
//       setError(friendly);
//       toast.error(friendly);
//     } finally {
//       setIsLoading(false);
//       try { await refreshSubscriptionStatus(); } catch {}
//     }
//   };

//   const handleDownload = () => {
//     if (!screenshotUrl) return;
//     const a = document.createElement('a');
//     a.href     = screenshotUrl;
//     a.download = `screenshot_${Date.now()}.${format}`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     toast.success('💾 Screenshot downloaded!');
//   };

//   const applyPreset = (preset) => {
//     setWidth(preset.width);
//     setHeight(preset.height);
//     toast.success(`Applied ${preset.name} preset`);
//   };

//   const primaryBtnClass = `flex-1 py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//     xUiPrimaryDisabled
//       ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
//       : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
//   }`;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 hidden sm:block">{user?.username || 'User'}</span>
//               <button
//                 onClick={() => {
//                   if (window.confirm('Are you sure you want to logout?')) {
//                     logout();
//                     toast.success('👋 Logged out successfully!');
//                     navigate('/login');
//                   }
//                 }}
//                 className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto p-6">
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Capture Website Screenshot</h1>
//           <div className="text-sm text-gray-600 mb-2">
//             Logged in as{' '}
//             <span className="font-semibold text-blue-600">{user?.username || 'User'}</span>{' '}
//             ({user?.email})
//           </div>

//           {/* Subscription card */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 mt-4 shadow-sm">
//             <div className="flex items-center justify-between mb-2">
//               <div className="text-sm">
//                 <span className="font-semibold">Current Plan:</span>{' '}
//                 <span className={`ml-1 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${tierBadgeClass(tier)}`}>
//                   {(tier || 'free').toUpperCase()}
//                 </span>
//               </div>
//               <button
//                 onClick={async () => {
//                   setIsRefreshingSubscription(true);
//                   try {
//                     await refreshSubscriptionStatus();
//                     toast.success('Subscription status refreshed!', { duration: 1600 });
//                   } catch { toast.error('Failed to refresh subscription status'); }
//                   finally { setIsRefreshingSubscription(false); }
//                 }}
//                 disabled={isRefreshingSubscription}
//                 className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center transition-colors"
//               >
//                 <svg className={`w-3 h-3 mr-1 ${isRefreshingSubscription ? 'animate-spin' : ''}`}
//                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 {isRefreshingSubscription ? 'Refreshing...' : 'Refresh'}
//               </button>
//             </div>

//             <div className="grid grid-cols-1 gap-2 mt-2 text-xs">
//               <div className="font-medium">📸 Screenshots: {safeFormatUsage('screenshots')}</div>
//             </div>

//             {/* Progress bar */}
//             <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-semibold text-gray-700">📸 Screenshots Used This Month</span>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   {safeFormatUsage('screenshots')}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                 <div
//                   className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative"
//                   style={{ width: `${screenshotsPercent}%` }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
//                 </div>
//               </div>
//               <div className="flex justify-between items-center mt-2">
//                 <span className="text-xs text-gray-500">{screenshotsRemainingLabel}</span>
//                 <span className="text-xs font-medium text-gray-600">{screenshotsPercentLabel}</span>
//               </div>
//               {/* ✅ NEW: Billing cycle reset date */}
//               {resetDateLabel && (
//                 <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
//                   <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   Resets on <span className="font-medium text-gray-500 ml-1">{resetDateLabel}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Example websites */}
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm">
//           <h3 className="text-green-800 font-semibold mb-2">✅ Try These Example Websites:</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//             <div>
//               <div className="font-medium text-green-700">Example.com</div>
//               <div className="text-green-600">Simple test website</div>
//               <button onClick={() => setWebsiteUrl('https://example.com')} className="text-xs text-green-500 hover:text-green-700 underline mt-1">Use this URL</button>
//             </div>
//             <div>
//               <div className="font-medium text-green-700">GitHub.com</div>
//               <div className="text-green-600">Popular code hosting site</div>
//               <button onClick={() => setWebsiteUrl('https://github.com')} className="text-xs text-green-500 hover:text-green-700 underline mt-1">Use this URL</button>
//             </div>
//           </div>
//         </div>

//         {/* URL Input */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Enter Website URL:</label>
//           <input
//             type="text"
//             placeholder="https://example.com"
//             value={websiteUrl}
//             onChange={e => setWebsiteUrl(e.target.value)}
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           />
//         </div>

//         {/* Valid URL pill */}
//         {websiteUrl && xUiValidUrl && (() => {
//           let displayDomain = websiteUrl;
//           try { displayDomain = new URL(websiteUrl).hostname; } catch {}
//           return (
//             <div className="mb-5 rounded-lg border border-green-200 bg-green-50 overflow-hidden shadow-sm">
//               <div className="flex items-center gap-2 px-4 py-2.5 bg-green-100 border-b border-green-200">
//                 <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
//                 <span className="text-sm font-semibold text-green-800">Valid URL detected</span>
//                 <span className="ml-auto text-xs font-medium text-green-700 bg-green-200 px-2 py-0.5 rounded-full truncate max-w-[180px]" title={displayDomain}>{displayDomain}</span>
//               </div>
//               <div className="px-4 py-2.5" title={websiteUrl}>
//                 <p className="text-xs font-mono text-green-700 break-all leading-relaxed">{websiteUrl}</p>
//               </div>
//             </div>
//           );
//         })()}

//         {/* Screenshot Configuration */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg font-semibold mb-4">📐 Screenshot Configuration</h3>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets:</label>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
//               {Object.entries(VIEWPORT_PRESETS).map(([key, preset]) => (
//                 <button key={key} onClick={() => applyPreset(preset)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">{preset.name}</button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
//               <input type="number" value={width} onChange={e => setWidth(parseInt(e.target.value) || 1920)} className="w-full border border-gray-300 rounded px-3 py-2" min="320" max="3840" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
//               <input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 1080)} className="w-full border border-gray-300 rounded px-3 py-2" min="240" max="2160" />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
//             <select value={format} onChange={e => setFormat(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
//               <option value="png">PNG (lossless, larger file)</option>
//               <option value="jpeg">JPEG (lossy, smaller file)</option>
//               <option value="webp">WebP (best compression)</option>
//               <option value="pdf">PDF (document format)</option>
//             </select>
//           </div>

//           <div className="space-y-3 mb-4">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" checked={fullPage} onChange={e => setFullPage(e.target.checked)} className="w-4 h-4" />
//               <span className="text-sm text-gray-700">Capture full page (scroll entire page)</span>
//             </label>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} className="w-4 h-4" />
//               <span className="text-sm text-gray-700">Use dark mode</span>
//             </label>
//           </div>

//           {/* Standard Advanced Options */}
//           <div className="border-t border-gray-200 pt-4">
//             <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Options</h4>
//             <div className="mb-3">
//               <label className="block text-sm text-gray-700 mb-1">Delay before capture (seconds)</label>
//               <input type="number" value={delay} onChange={e => setDelay(parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded px-3 py-2" min="0" max="10" />
//               <p className="text-xs text-gray-500 mt-1">Wait time to allow page to fully load</p>
//             </div>
//             <div>
//               <label className="block text-sm text-gray-700 mb-1">Remove elements (CSS selectors)</label>
//               <input type="text" value={removeElements} onChange={e => setRemoveElements(e.target.value)} placeholder=".cookie-banner, #popup, .ads" className="w-full border border-gray-300 rounded px-3 py-2" />
//               <p className="text-xs text-gray-500 mt-1">Comma-separated CSS selectors to hide before capture</p>
//             </div>
//           </div>

//           {/* Pro & Business features */}
//           <div className="border-t border-gray-200 mt-4 pt-4">
//             <button type="button" onClick={() => setAdvancedProOpen(o => !o)} className="w-full flex items-center justify-between py-1 mb-1 hover:opacity-80 transition-opacity">
//               <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 ⚡ Pro & Business Features
//                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">Pro+</span>
//               </h4>
//               <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${advancedProOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {advancedProOpen && (
//               <div className="space-y-5 mt-3">
//                 {!isPro && (
//                   <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
//                     🔒 Device emulation, Custom JavaScript, and Wait for selector require <strong>Pro tier or higher</strong>.{' '}
//                     <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-purple-900">Upgrade →</button>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">📱 Device Preset <span className="text-xs text-purple-600 font-semibold">(Pro+)</span></label>
//                   <select value={device} onChange={e => setDevice(e.target.value)} disabled={!isPro} className={`w-full border border-gray-300 rounded px-3 py-2 text-sm ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}>
//                     {DEVICE_PRESETS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
//                   </select>
//                   {device && isPro && <p className="text-xs text-gray-500 mt-1">Device preset overrides the width/height fields above.</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">⏳ Wait for CSS Selector <span className="text-xs text-purple-600 font-semibold">(Pro+)</span></label>
//                   <input type="text" value={waitForSelector} onChange={e => setWaitForSelector(e.target.value)} disabled={!isPro} placeholder="#main-content  or  .hero-section" className={`w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`} />
//                   <p className="text-xs text-gray-500 mt-1">Waits up to 10 seconds for this element to appear before capturing.</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">{'</>'} Custom JavaScript <span className="text-xs text-purple-600 font-semibold">(Pro+)</span></label>
//                   <textarea value={customJs} onChange={e => setCustomJs(e.target.value)} disabled={!isPro} placeholder={JS_PLACEHOLDER} maxLength={10000} rows={6}
//                     className={`w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono resize-y ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-gray-900 text-green-400'}`}
//                     style={isPro ? { lineHeight: '1.6' } : {}} />
//                   <div className="flex justify-between mt-1">
//                     <p className="text-xs text-gray-500">Executes after page load, before capture. Errors are non-fatal.</p>
//                     <p className={`text-xs flex-shrink-0 ml-2 ${customJs.length > 9500 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>{customJs.length.toLocaleString()} / 10,000</p>
//                   </div>
//                 </div>

//                 <div className="border-t border-dashed border-gray-300 pt-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="text-sm font-semibold text-gray-700">🏢 Business Features</span>
//                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">Business+</span>
//                   </div>
//                   {isPro && !isBusiness && (
//                     <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800 mb-3">
//                       🔒 Element selection requires <strong>Business tier or higher</strong>.{' '}
//                       <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-indigo-900">Upgrade →</button>
//                     </div>
//                   )}
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1">✂️ Element Selection — Crop to CSS Selector <span className="text-xs text-indigo-600 font-semibold">(Business+)</span></label>
//                     <input type="text" value={targetElement} onChange={e => setTargetElement(e.target.value)} disabled={!isBusiness} placeholder="#hero  or  .pricing-table  or  main > article"
//                       className={`w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono ${!isBusiness ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`} />
//                     <p className="text-xs text-gray-500 mt-1">Captures the full page, then automatically crops to this element's bounding box. Returns HTTP 400 if the selector matches nothing.</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {atLimit('screenshots') && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
//             ⚠️ Monthly screenshot limit reached. Please upgrade your plan.
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-red-100 border-b border-red-200">
//               <span className="flex-shrink-0 text-red-600 font-bold">⚠️</span>
//               <span className="text-sm font-semibold text-red-800">Screenshot failed</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-sm text-red-700 leading-relaxed break-words">{error}</p>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-4 mb-6">
//           <button onClick={handleCapture} disabled={xUiPrimaryDisabled} aria-disabled={xUiPrimaryDisabled} title={xUiDisabledReason()} className={primaryBtnClass}>
//             {isLoading ? '⏳ Capturing…' : '📸 Capture Screenshot'}
//           </button>
//           <button
//             onClick={() => {
//               setWebsiteUrl(''); setScreenshotUrl(''); setScreenshotData(null);
//               setError(''); setScreenshotCompleted(false);
//               setJsWarning(''); setElementCaptured('');
//               setDevice(''); setCustomJs(''); setWaitForSelector('');
//               setTargetElement('');
//               pollStopRef.current = true;
//             }}
//             className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//           >
//             🗑️ Clear
//           </button>
//         </div>

//         {jsWarning && (
//           <div className="bg-amber-50 border border-amber-300 rounded-lg mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 border-b border-amber-200">
//               <span className="text-amber-600 font-bold">⚠️</span>
//               <span className="text-sm font-semibold text-amber-800">JavaScript Warning — screenshot still captured</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-xs font-mono text-amber-700 break-all leading-relaxed">{jsWarning}</p>
//             </div>
//           </div>
//         )}

//         {elementCaptured && (
//           <div className="bg-green-50 border border-green-300 rounded-lg mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-green-100 border-b border-green-200">
//               <span className="text-green-600 font-bold">✂️</span>
//               <span className="text-sm font-semibold text-green-800">Element captured — cropped to selector</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-xs font-mono text-green-700 break-all leading-relaxed">{elementCaptured}</p>
//             </div>
//           </div>
//         )}

//         {screenshotUrl && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
//               {format === 'pdf' ? '📄' : '🖼️'} Screenshot Result
//               {screenshotCompleted && <span className="ml-2 text-green-600 text-sm font-normal">✅ Capture Complete</span>}
//             </h2>
//             {format === 'pdf' ? (
//               <div className="mb-4">
//                 <div className="rounded-lg overflow-hidden border border-gray-300 shadow-lg bg-gray-100" style={{ height: '500px' }}>
//                   <iframe src={screenshotUrl} title="PDF preview" className="w-full h-full" style={{ border: 'none' }} />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2 text-center">📱 If the PDF doesn't display above, use the buttons below to download or open it.</p>
//               </div>
//             ) : (
//               <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <img src={screenshotUrl} alt="Screenshot preview" className="max-w-full h-auto border border-gray-300 rounded shadow-lg mx-auto" />
//               </div>
//             )}
//             {screenshotData && (
//               <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4 border border-green-200">
//                 <div className="font-semibold text-gray-800 mb-1">{format === 'pdf' ? '📄 PDF Details' : '✅ Screenshot Details'}</div>
//                 <div className="text-sm text-gray-800 break-all">URL: {screenshotData.url}</div>
//                 <div className="text-sm text-gray-800">Dimensions: {screenshotData.width}×{screenshotData.height}</div>
//                 <div className="text-sm text-gray-800">Format: {screenshotData.format?.toUpperCase()}</div>
//                 {elementCaptured && <div className="text-sm text-gray-800">Element: <code className="bg-gray-100 px-1 rounded text-xs font-mono">{elementCaptured}</code></div>}
//                 {screenshotData.size && <div className="text-sm text-gray-800">Size: {(screenshotData.size / 1024).toFixed(2)} KB</div>}
//               </div>
//             )}
//             <div className="flex gap-3 flex-wrap">
//               <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
//                 {format === 'pdf' ? '📥 Download PDF' : '💾 Download'}
//               </button>
//               <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                 {format === 'pdf' ? '📄 Open PDF' : '🔗 Open in New Tab'}
//               </a>
//             </div>
//           </div>
//         )}

//         <div className="text-center mb-6">
//           <div className="flex gap-4 justify-center flex-wrap">
//             <button onClick={() => navigate('/dashboard')} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">← Back to Dashboard</button>
//             <button onClick={() => navigate('/history')}   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">📚 View History</button>
//             <button onClick={() => navigate('/activity')}  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">📋 Recent Activity</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===== END OF ScreenshotPage.js =====


