// frontend/src/pages/ScreenshotPage.js — PixelPerfect Screenshot API
// UPDATED: August 2026
//
// ============================================================================
// ✅ FIX (Aug 2026 — Device Preset reported the wrong dimensions)
// ============================================================================
//   Reproduction: choose Quick Preset "Laptop (1366x768)", then choose Device
//   Preset "iPad Pro 11\"". Capture. Screenshot Details reported 1366×768 —
//   the Quick Preset — even though the capture actually used the iPad
//   viewport (1024×1366).
//
//   Root cause: when a device preset is supplied, Playwright's device
//   descriptor overrides viewport/user-agent/DPR inside the browser context,
//   but the width/height carried back through the response were still the
//   request's width/height fields. The user was shown values that had been
//   overridden and discarded.
//
//   Fix, in three parts:
//     1. DEVICE_PRESETS now carries the real viewport of every device, so the
//        UI knows the true dimensions without waiting for the API.
//     2. Screenshot Details reports the device viewport (and names the device)
//        whenever a device preset was used, falling back to the API response
//        and then the request fields.
//     3. The UI now makes the override visible BEFORE capture: selecting a
//        device dims the Quick Presets and the Width/Height inputs and shows
//        an inline banner. The old behaviour let a user set 1366×768 with no
//        signal that it would be ignored.
//
// ✅ FIX (Aug 2026 — Example cards ran together):
//   The two lines inside each example-website button rendered as
//   "Example.comSimple test website" with no separation. Both lines are now
//   explicit `block` elements with a margin between them. See the inline
//   comment at the Example websites section.
//
// ✅ UI REFRESH (Aug 2026 — Screenshot Configuration):
//   Quick Presets were flat grey buttons with no selected state — you could
//   not tell which preset was active. They are now segmented cards with an
//   explicit active state (blue ring + tint), an icon per device class, and
//   the dimensions on a second line. Format select, section headers and the
//   capture button were given matching treatment. No logic changed.
//
// Previous fixes (all retained):
// ✅ FIX (July 2026 — "Resets on [date]" Not Displaying): resolveNextReset()
//   checks next_reset, nextReset, reset_date, resetDate, current_period_end,
//   currentPeriodEnd, usage.next_reset.
// ✅ FIX (July 2026 — Mount effect runs on every navigation): dependency []
// ✅ FIX (July 2026 — Billing cycle reset date display)
// ✅ CONSISTENCY FIX (July 2026 — Tier badge colors)
// ✅ FIX (May 2026 — Phase 2): Element Selection (Business+) with CSS crop
// ✅ FIX (May 2026 — Phase 1): Device emulation, Custom JS, Wait for selector
// ✅ FIX (Apr 2026): friendlyError() translates raw Playwright errors
// ✅ FIX (Mar 2026): resolveApiBase() replaces build-time env var fallback

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

function resolveNextReset(subscriptionStatus) {
  if (!subscriptionStatus) return null;
  const candidates = [
    subscriptionStatus.next_reset,
    subscriptionStatus.nextReset,
    subscriptionStatus.reset_date,
    subscriptionStatus.resetDate,
    subscriptionStatus.current_period_end,
    subscriptionStatus.currentPeriodEnd,
    subscriptionStatus.usage?.next_reset,
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    const d = typeof raw === 'number'
      ? new Date(raw < 1e12 ? raw * 1000 : raw)
      : new Date(raw);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

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

// ── Quick Presets — now carry an icon for the segmented card UI ──────────────
const VIEWPORT_PRESETS = {
  desktop:   { width: 1920, height: 1080, name: 'Desktop',   icon: '🖥️' },
  laptop:    { width: 1366, height: 768,  name: 'Laptop',    icon: '💻' },
  tablet:    { width: 768,  height: 1024, name: 'Tablet',    icon: '📟' },
  mobile:    { width: 375,  height: 667,  name: 'Mobile',    icon: '📱' },
  ultrawide: { width: 3440, height: 1440, name: 'Ultrawide', icon: '🖥️' },
};

// ── Device Presets ───────────────────────────────────────────────────────────
// ✅ FIX (Aug 2026): each preset now carries its REAL viewport. Previously the
// dimensions existed only inside the label string, so the UI had no way to
// report what a device capture actually produced — it fell back to the
// width/height inputs, which the device descriptor had already overridden.
// These values match Playwright's device registry (see SUPPORTED_DEVICES in
// screenshot_service.py). If Playwright updates a descriptor, update here too.
const DEVICE_PRESETS = [
  { key: '',                  label: '— No device preset (use width/height) —', width: null, height: null, icon: '' },
  { key: 'iphone_13',         label: 'iPhone 13 (390×844, Safari)',              width: 390,  height: 844,  icon: '📱' },
  { key: 'iphone_13_pro_max', label: 'iPhone 13 Pro Max (428×926, Safari)',      width: 428,  height: 926,  icon: '📱' },
  { key: 'iphone_se',         label: 'iPhone SE (375×667, Safari)',              width: 375,  height: 667,  icon: '📱' },
  { key: 'pixel_5',           label: 'Google Pixel 5 (393×851, Chrome)',         width: 393,  height: 851,  icon: '📱' },
  { key: 'pixel_7',           label: 'Google Pixel 7 (412×915, Chrome)',         width: 412,  height: 915,  icon: '📱' },
  { key: 'ipad_pro',          label: 'iPad Pro 11" (1024×1366, Safari)',         width: 1024, height: 1366, icon: '📟' },
  { key: 'ipad_mini',         label: 'iPad Mini (768×1024, Safari)',             width: 768,  height: 1024, icon: '📟' },
  { key: 'galaxy_s9',         label: 'Samsung Galaxy S9+ (320×658, Chrome)',     width: 320,  height: 658,  icon: '📱' },
  { key: 'galaxy_tab_s4',     label: 'Samsung Galaxy Tab S4 (712×1138, Chrome)', width: 712,  height: 1138, icon: '📟' },
];

function deviceByKey(key) {
  return DEVICE_PRESETS.find(d => d.key === key) || null;
}

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
  const [activePreset,   setActivePreset]   = useState('desktop');   // ✅ NEW: selected-state tracking
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

  // ✅ NEW (Aug 2026): a device preset overrides width/height inside the
  // browser context, so the UI treats it as the authoritative source and
  // visibly disables the fields it supersedes.
  const selectedDevice   = useMemo(() => (device ? deviceByKey(device) : null), [device]);
  const deviceOverriding = Boolean(selectedDevice && selectedDevice.key);

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

  const nextResetDate = useMemo(
    () => resolveNextReset(subscriptionStatus),
    [subscriptionStatus]
  );

  const isResetOverdue = useMemo(() => {
    if (!nextResetDate) return false;
    return Date.now() > nextResetDate.getTime();
  }, [nextResetDate]);

  const forceRefreshIfNeeded = useCallback(async () => {
    if (!isAuthenticated || !refreshSubscriptionStatus) return;
    try { await refreshSubscriptionStatus(); } catch {}
  }, [isAuthenticated, refreshSubscriptionStatus]);

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

  const resetDateLabel = useMemo(() => {
    if (!nextResetDate) return null;
    try {
      return nextResetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return null; }
  }, [nextResetDate]);

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

      // ✅ FIX (Aug 2026 — Device Preset dimensions):
      // Resolution order for the dimensions we report back to the user:
      //   1. The device preset's real viewport, when a device was used. The
      //      descriptor overrides viewport/UA/DPR inside the browser context,
      //      so the width/height inputs were never applied and must not be
      //      shown. This is the case that was previously wrong — it displayed
      //      the Quick Preset the user had also set.
      //   2. Whatever the API reported.
      //   3. The requested width/height, as a last resort.
      const usedDevice = device ? deviceByKey(device) : null;
      const reportedWidth  = usedDevice?.width  ?? data.width  ?? width;
      const reportedHeight = usedDevice?.height ?? data.height ?? height;

      setScreenshotUrl(data.screenshot_url || '');
      setScreenshotData({
        id:          data.screenshot_id,
        url:         websiteUrl,
        width:       reportedWidth,
        height:      reportedHeight,
        format:      data.format,
        size:        data.size_bytes,
        created_at:  data.created_at,
        // ✅ NEW: carried through so Details can name the device explicitly
        deviceKey:   usedDevice?.key   || '',
        deviceLabel: usedDevice?.label || '',
        deviceIcon:  usedDevice?.icon  || '',
        fullPage,
        darkMode,
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

  // ✅ UPDATED: also records which preset is active so the card can highlight.
  const applyPreset = (key, preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setActivePreset(key);
  };

  // ✅ NEW: manual width/height edits clear the active preset highlight,
  // so the UI never claims a preset is applied when it no longer matches.
  const handleWidthChange = (v) => { setWidth(v); setActivePreset(''); };
  const handleHeightChange = (v) => { setHeight(v); setActivePreset(''); };

  const primaryBtnClass = `flex-1 py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    xUiPrimaryDisabled
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-blue-500'
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
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

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Capture Website Screenshot</h1>
          <div className="text-sm text-gray-600 mb-2">
            Logged in as{' '}
            <span className="font-semibold text-blue-600">{user?.username || 'User'}</span>{' '}
            ({user?.email})
          </div>

          {/* Subscription card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 mt-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm flex items-center gap-2">
                <span className="font-semibold text-gray-700">Current Plan:</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${tierBadgeClass(tier)}`}>
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

            {/* Progress */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">📸 Screenshots Used This Month</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {safeFormatUsage('screenshots')}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${screenshotsPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{screenshotsRemainingLabel}</span>
                <span className="text-xs font-medium text-gray-600">{screenshotsPercentLabel}</span>
              </div>
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
        <div className="bg-white border border-emerald-200 rounded-2xl p-4 mb-6 shadow-sm">
          <h3 className="text-emerald-800 font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
            Try these example websites
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { url: 'https://example.com', name: 'Example.com', desc: 'Simple test website' },
              { url: 'https://github.com',  name: 'GitHub.com',  desc: 'Popular code hosting site' },
            ].map(x => (
              <button
                key={x.url}
                onClick={() => setWebsiteUrl(x.url)}
                className="text-left p-3 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
              >
                {/* ✅ FIX (Aug 2026): explicit block + margin. These rendered as
                    "Example.comSimple test website" with no separation in
                    full-page captures and at narrow widths. `block` and an
                    explicit top margin guarantee the break regardless of the
                    parent's display context. */}
                <span className="block font-medium text-gray-800 text-sm group-hover:text-emerald-800">
                  {x.name}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {x.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* URL Input */}
        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Website URL</label>
          <input
            type="text"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={e => setWebsiteUrl(e.target.value)}
            className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Valid URL pill */}
        {websiteUrl && xUiValidUrl && (() => {
          let displayDomain = websiteUrl;
          try { displayDomain = new URL(websiteUrl).hostname; } catch {}
          return (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 border-b border-emerald-200">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
                <span className="text-sm font-semibold text-emerald-800">Valid URL detected</span>
                <span className="ml-auto text-xs font-medium text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full truncate max-w-[180px]" title={displayDomain}>{displayDomain}</span>
              </div>
              <div className="px-4 py-2.5" title={websiteUrl}>
                <p className="text-xs font-mono text-emerald-700 break-all leading-relaxed">{websiteUrl}</p>
              </div>
            </div>
          );
        })()}

        {/* Screenshot Configuration */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base">📐</span>
            Screenshot Configuration
          </h3>

          {/*
            ✅ FIX (Aug 2026 — Device Preset precedence, part 3 of 3):
            When a device preset is active it overrides viewport entirely, so
            the Quick Presets and Width/Height inputs are visibly disabled and
            explained. Previously a user could set "Laptop 1366x768" AND a
            device, with nothing indicating the first would be discarded — and
            the result screen then reported the discarded value.
          */}
          {deviceOverriding && (
            <div className="mb-5 flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
              <span className="text-lg leading-none mt-0.5">{selectedDevice.icon}</span>
              <div className="text-sm text-purple-900">
                <span className="font-semibold">Device preset active — {selectedDevice.label}</span>
                <p className="text-xs text-purple-700 mt-0.5">
                  Quick Presets and Width/Height are ignored while a device is selected.
                  This capture will use {selectedDevice.width}×{selectedDevice.height}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDevice('')}
                className="ml-auto flex-shrink-0 text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Quick Presets — segmented cards with an explicit active state */}
          <div className={`mb-5 transition-opacity ${deviceOverriding ? 'opacity-40 pointer-events-none' : ''}`}>
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">Quick Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {Object.entries(VIEWPORT_PRESETS).map(([key, preset]) => {
                const isActive = activePreset === key && !deviceOverriding;
                return (
                  <button
                    key={key}
                    onClick={() => applyPreset(key, preset)}
                    disabled={deviceOverriding}
                    className={`px-3 py-2.5 rounded-xl text-left transition-all border-2 ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{preset.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                        {preset.name}
                      </span>
                    </div>
                    <div className={`text-xs mt-0.5 font-mono ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                      {preset.width}×{preset.height}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 transition-opacity ${deviceOverriding ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Width (px)</label>
              <input type="number" value={width} disabled={deviceOverriding}
                onChange={e => handleWidthChange(parseInt(e.target.value) || 1920)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50"
                min="320" max="3840" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Height (px)</label>
              <input type="number" value={height} disabled={deviceOverriding}
                onChange={e => handleHeightChange(parseInt(e.target.value) || 1080)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50"
                min="240" max="2160" />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
            <select
              value={format}
              onChange={e => {
                const next = e.target.value;
                if (next === 'pdf' && !isPro) {
                  toast.error('PDF format requires Pro tier or higher.', { duration: 4000, icon: '🔒' });
                  navigate('/pricing');
                  return;
                }
                setFormat(next);
              }}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="png">PNG — lossless, larger file</option>
              <option value="jpeg">JPEG — lossy, smaller file</option>
              <option value="webp">WebP — best compression</option>
              <option value="pdf">{isPro ? 'PDF — document format' : 'PDF — document format 🔒 Pro+ required'}</option>
            </select>
            {!isPro && (
              <p className="text-xs text-amber-700 mt-2 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <span>🔒</span> PDF format requires Pro tier or higher.{' '}
                <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-amber-900">
                  Upgrade →
                </button>
              </p>
            )}
          </div>

          <div className="space-y-2 mb-5">
            {[
              { checked: fullPage, set: setFullPage, label: 'Capture full page (scroll entire page)' },
              { checked: darkMode, set: setDarkMode, label: 'Use dark mode' },
            ].map(o => (
              <label key={o.label} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={o.checked} onChange={e => o.set(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">{o.label}</span>
              </label>
            ))}
          </div>

          {/* Standard Advanced Options */}
          <div className="border-t border-gray-200 pt-5">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Advanced Options</h4>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1.5">Delay before capture (seconds)</label>
              <select value={delay} onChange={e => setDelay(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option value={0}>0 s — Capture immediately</option>
                <option value={1}>1 s</option>
                <option value={2}>2 s — Recommended for most sites</option>
                <option value={3}>3 s</option>
                <option value={5}>5 s — Recommended for heavy pages</option>
                <option value={10}>10 s — Maximum</option>
              </select>
              <p className="text-xs text-gray-500 mt-1.5">Extra wait time after page load before capture begins</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Remove elements (CSS selectors)</label>
              <input type="text" value={removeElements} onChange={e => setRemoveElements(e.target.value)}
                placeholder=".cookie-banner, #popup, .ads"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
              <p className="text-xs text-gray-500 mt-1.5">Comma-separated CSS selectors to hide before capture</p>
            </div>
          </div>

          {/* Pro & Business features */}
          <div className="border-t border-gray-200 mt-5 pt-5">
            <button type="button" onClick={() => setAdvancedProOpen(o => !o)}
              className="w-full flex items-center justify-between py-1 hover:opacity-80 transition-opacity">
              <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                ⚡ Pro &amp; Business Features
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">Pro+</span>
                {deviceOverriding && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                    Device active
                  </span>
                )}
              </h4>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${advancedProOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {advancedProOpen && (
              <div className="space-y-5 mt-4">
                {!isPro && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-sm text-purple-800">
                    🔒 Device emulation, Custom JavaScript, and Wait for selector require <strong>Pro tier or higher</strong>.{' '}
                    <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-purple-900">Upgrade →</button>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    📱 Device Preset <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
                  </label>
                  <select value={device} onChange={e => setDevice(e.target.value)} disabled={!isPro}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                      !isPro ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300'
                             : deviceOverriding ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-500/20'
                             : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}>
                    {DEVICE_PRESETS.map(d => (
                      <option key={d.key} value={d.key}>{d.icon ? `${d.icon} ${d.label}` : d.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Device presets override Width/Height and set the correct user-agent and pixel ratio.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    ⏳ Wait for CSS Selector <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
                  </label>
                  <input type="text" value={waitForSelector} onChange={e => setWaitForSelector(e.target.value)}
                    disabled={!isPro} placeholder="#main-content  or  .hero-section"
                    className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono transition-all ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`} />
                  <p className="text-xs text-gray-500 mt-1.5">Waits up to 10 seconds for this element to appear before capturing.</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    {'</>'} Custom JavaScript <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
                  </label>
                  <textarea value={customJs} onChange={e => setCustomJs(e.target.value)} disabled={!isPro}
                    placeholder={JS_PLACEHOLDER} maxLength={10000} rows={6}
                    className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono resize-y transition-all ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-slate-900 text-emerald-400 border-slate-700 focus:ring-2 focus:ring-blue-500'}`}
                    style={isPro ? { lineHeight: '1.6' } : {}} />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-gray-500">Executes after page load, before capture. Errors are non-fatal.</p>
                    <p className={`text-xs flex-shrink-0 ml-2 ${customJs.length > 9500 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                      {customJs.length.toLocaleString()} / 10,000
                    </p>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-bold text-gray-700">🏢 Business Features</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">Business+</span>
                  </div>
                  {isPro && !isBusiness && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-sm text-indigo-800 mb-3">
                      🔒 Element selection requires <strong>Business tier or higher</strong>.{' '}
                      <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-indigo-900">Upgrade →</button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      ✂️ Element Selection — Crop to CSS Selector <span className="text-xs text-indigo-600 font-semibold">(Business+)</span>
                    </label>
                    <input type="text" value={targetElement} onChange={e => setTargetElement(e.target.value)}
                      disabled={!isBusiness} placeholder="#hero  or  .pricing-table  or  main > article"
                      className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono transition-all ${!isBusiness ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`} />
                    <p className="text-xs text-gray-500 mt-1.5">
                      Captures the full page, then automatically crops to this element's bounding box. Returns HTTP 400 if the selector matches nothing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {atLimit('screenshots') && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 shadow-sm">
            ⚠️ Monthly screenshot limit reached. Please upgrade your plan.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl mb-4 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-100 border-b border-red-200">
              <span className="flex-shrink-0 text-red-600 font-bold">⚠️</span>
              <span className="text-sm font-semibold text-red-800">Screenshot failed</span>
            </div>
            <div className="px-4 py-2.5">
              <p className="text-sm text-red-700 leading-relaxed break-words">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <button onClick={handleCapture} disabled={xUiPrimaryDisabled} aria-disabled={xUiPrimaryDisabled}
            title={xUiDisabledReason()} className={primaryBtnClass}>
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
            className="px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            🗑️ Clear
          </button>
        </div>

        {jsWarning && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl mb-4 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 border-b border-amber-200">
              <span className="text-amber-600 font-bold">⚠️</span>
              <span className="text-sm font-semibold text-amber-800">JavaScript warning — screenshot still captured</span>
            </div>
            <div className="px-4 py-2.5">
              <p className="text-xs font-mono text-amber-700 break-all leading-relaxed">{jsWarning}</p>
            </div>
          </div>
        )}

        {elementCaptured && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl mb-4 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 border-b border-emerald-200">
              <span className="text-emerald-600 font-bold">✂️</span>
              <span className="text-sm font-semibold text-emerald-800">Element captured — cropped to selector</span>
            </div>
            <div className="px-4 py-2.5">
              <p className="text-xs font-mono text-emerald-700 break-all leading-relaxed">{elementCaptured}</p>
            </div>
          </div>
        )}

        {screenshotUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              {format === 'pdf' ? '📄' : '🖼️'} Screenshot Result
              {screenshotCompleted && (
                <span className="ml-1 inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                  ✅ Capture complete
                </span>
              )}
            </h2>
            {format === 'pdf' ? (
              <div className="mb-4">
                <div className="rounded-xl overflow-hidden border border-gray-300 shadow-lg bg-gray-100" style={{ height: '500px' }}>
                  <iframe src={screenshotUrl} title="PDF preview" className="w-full h-full" style={{ border: 'none' }} />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">📱 If the PDF doesn't display above, use the buttons below to download or open it.</p>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
                <img src={screenshotUrl} alt="Screenshot preview" className="max-w-full h-auto border border-gray-300 rounded-lg shadow-md mx-auto" />
              </div>
            )}

            {/*
              ✅ FIX (Aug 2026 — Device Preset dimensions, part 2 of 3):
              Details now report the DEVICE viewport when a device preset was
              used, and name the device explicitly. Previously this row showed
              the Quick Preset's width/height, which the device descriptor had
              already overridden and discarded — so the user was told 1366×768
              for a capture actually taken at 1024×1366.
            */}
            {screenshotData && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl mb-4 border border-emerald-200">
                <div className="font-bold text-gray-800 mb-2 text-sm">
                  {format === 'pdf' ? '📄 PDF Details' : '✅ Screenshot Details'}
                </div>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-gray-500 flex-shrink-0 w-24">URL</dt>
                    <dd className="text-gray-800 break-all">{screenshotData.url}</dd>
                  </div>

                  {screenshotData.deviceLabel && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 flex-shrink-0 w-24">Device</dt>
                      <dd className="text-gray-800 font-medium">
                        {screenshotData.deviceIcon} {screenshotData.deviceLabel}
                      </dd>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <dt className="text-gray-500 flex-shrink-0 w-24">Dimensions</dt>
                    <dd className="text-gray-800 font-mono">
                      {screenshotData.width}×{screenshotData.height}
                      {screenshotData.deviceLabel && (
                        <span className="ml-2 text-xs text-purple-600 font-sans font-medium">
                          (device viewport)
                        </span>
                      )}
                    </dd>
                  </div>

                  <div className="flex gap-2">
                    <dt className="text-gray-500 flex-shrink-0 w-24">Format</dt>
                    <dd className="text-gray-800">{screenshotData.format?.toUpperCase()}</dd>
                  </div>

                  {(screenshotData.fullPage || screenshotData.darkMode) && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 flex-shrink-0 w-24">Options</dt>
                      <dd className="text-gray-800 flex flex-wrap gap-1.5">
                        {screenshotData.fullPage && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Full page</span>}
                        {screenshotData.darkMode && <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded">Dark mode</span>}
                      </dd>
                    </div>
                  )}

                  {elementCaptured && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 flex-shrink-0 w-24">Element</dt>
                      <dd><code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200">{elementCaptured}</code></dd>
                    </div>
                  )}

                  {screenshotData.size && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 flex-shrink-0 w-24">Size</dt>
                      <dd className="text-gray-800 font-mono">{(screenshotData.size / 1024).toFixed(2)} KB</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <button onClick={handleDownload}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                {format === 'pdf' ? '📥 Download PDF' : '💾 Download'}
              </button>
              <a href={screenshotUrl} target="_blank" rel="noopener noreferrer"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
                {format === 'pdf' ? '📄 Open PDF' : '🔗 Open in New Tab'}
              </a>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate('/dashboard')} className="bg-gray-700 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">← Back to Dashboard</button>
            <button onClick={() => navigate('/history')}   className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">📚 View History</button>
            <button onClick={() => navigate('/activity')}  className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors">📋 Recent Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== END OF ScreenshotPage.js ==============


// // frontend/src/pages/ScreenshotPage.js — PixelPerfect Screenshot API
// // UPDATED: August 2026
// //
// // ============================================================================
// // ✅ FIX (Aug 2026 — Device Preset reported the wrong dimensions)
// // ============================================================================
// //   Reproduction: choose Quick Preset "Laptop (1366x768)", then choose Device
// //   Preset "iPad Pro 11\"". Capture. Screenshot Details reported 1366×768 —
// //   the Quick Preset — even though the capture actually used the iPad
// //   viewport (1024×1366).
// //
// //   Root cause: when a device preset is supplied, Playwright's device
// //   descriptor overrides viewport/user-agent/DPR inside the browser context,
// //   but the width/height carried back through the response were still the
// //   request's width/height fields. The user was shown values that had been
// //   overridden and discarded.
// //
// //   Fix, in three parts:
// //     1. DEVICE_PRESETS now carries the real viewport of every device, so the
// //        UI knows the true dimensions without waiting for the API.
// //     2. Screenshot Details reports the device viewport (and names the device)
// //        whenever a device preset was used, falling back to the API response
// //        and then the request fields.
// //     3. The UI now makes the override visible BEFORE capture: selecting a
// //        device dims the Quick Presets and the Width/Height inputs and shows
// //        an inline banner. The old behaviour let a user set 1366×768 with no
// //        signal that it would be ignored.
// //
// // ✅ FIX (Aug 2026 — Example cards ran together):
// //   The two lines inside each example-website button rendered as
// //   "Example.comSimple test website" with no separation. Both lines are now
// //   explicit `block` elements with a margin between them. See the inline
// //   comment at the Example websites section.
// //
// // ✅ UI REFRESH (Aug 2026 — Screenshot Configuration):
// //   Quick Presets were flat grey buttons with no selected state — you could
// //   not tell which preset was active. They are now segmented cards with an
// //   explicit active state (blue ring + tint), an icon per device class, and
// //   the dimensions on a second line. Format select, section headers and the
// //   capture button were given matching treatment. No logic changed.
// //
// // Previous fixes (all retained):
// // ✅ FIX (July 2026 — "Resets on [date]" Not Displaying): resolveNextReset()
// //   checks next_reset, nextReset, reset_date, resetDate, current_period_end,
// //   currentPeriodEnd, usage.next_reset.
// // ✅ FIX (July 2026 — Mount effect runs on every navigation): dependency []
// // ✅ FIX (July 2026 — Billing cycle reset date display)
// // ✅ CONSISTENCY FIX (July 2026 — Tier badge colors)
// // ✅ FIX (May 2026 — Phase 2): Element Selection (Business+) with CSS crop
// // ✅ FIX (May 2026 — Phase 1): Device emulation, Custom JS, Wait for selector
// // ✅ FIX (Apr 2026): friendlyError() translates raw Playwright errors
// // ✅ FIX (Mar 2026): resolveApiBase() replaces build-time env var fallback

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

// function resolveNextReset(subscriptionStatus) {
//   if (!subscriptionStatus) return null;
//   const candidates = [
//     subscriptionStatus.next_reset,
//     subscriptionStatus.nextReset,
//     subscriptionStatus.reset_date,
//     subscriptionStatus.resetDate,
//     subscriptionStatus.current_period_end,
//     subscriptionStatus.currentPeriodEnd,
//     subscriptionStatus.usage?.next_reset,
//   ];
//   for (const raw of candidates) {
//     if (!raw) continue;
//     const d = typeof raw === 'number'
//       ? new Date(raw < 1e12 ? raw * 1000 : raw)
//       : new Date(raw);
//     if (!Number.isNaN(d.getTime())) return d;
//   }
//   return null;
// }

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

// // ── Quick Presets — now carry an icon for the segmented card UI ──────────────
// const VIEWPORT_PRESETS = {
//   desktop:   { width: 1920, height: 1080, name: 'Desktop',   icon: '🖥️' },
//   laptop:    { width: 1366, height: 768,  name: 'Laptop',    icon: '💻' },
//   tablet:    { width: 768,  height: 1024, name: 'Tablet',    icon: '📟' },
//   mobile:    { width: 375,  height: 667,  name: 'Mobile',    icon: '📱' },
//   ultrawide: { width: 3440, height: 1440, name: 'Ultrawide', icon: '🖥️' },
// };

// // ── Device Presets ───────────────────────────────────────────────────────────
// // ✅ FIX (Aug 2026): each preset now carries its REAL viewport. Previously the
// // dimensions existed only inside the label string, so the UI had no way to
// // report what a device capture actually produced — it fell back to the
// // width/height inputs, which the device descriptor had already overridden.
// // These values match Playwright's device registry (see SUPPORTED_DEVICES in
// // screenshot_service.py). If Playwright updates a descriptor, update here too.
// const DEVICE_PRESETS = [
//   { key: '',                  label: '— No device preset (use width/height) —', width: null, height: null, icon: '' },
//   { key: 'iphone_13',         label: 'iPhone 13 (390×844, Safari)',              width: 390,  height: 844,  icon: '📱' },
//   { key: 'iphone_13_pro_max', label: 'iPhone 13 Pro Max (428×926, Safari)',      width: 428,  height: 926,  icon: '📱' },
//   { key: 'iphone_se',         label: 'iPhone SE (375×667, Safari)',              width: 375,  height: 667,  icon: '📱' },
//   { key: 'pixel_5',           label: 'Google Pixel 5 (393×851, Chrome)',         width: 393,  height: 851,  icon: '📱' },
//   { key: 'pixel_7',           label: 'Google Pixel 7 (412×915, Chrome)',         width: 412,  height: 915,  icon: '📱' },
//   { key: 'ipad_pro',          label: 'iPad Pro 11" (1024×1366, Safari)',         width: 1024, height: 1366, icon: '📟' },
//   { key: 'ipad_mini',         label: 'iPad Mini (768×1024, Safari)',             width: 768,  height: 1024, icon: '📟' },
//   { key: 'galaxy_s9',         label: 'Samsung Galaxy S9+ (320×658, Chrome)',     width: 320,  height: 658,  icon: '📱' },
//   { key: 'galaxy_tab_s4',     label: 'Samsung Galaxy Tab S4 (712×1138, Chrome)', width: 712,  height: 1138, icon: '📟' },
// ];

// function deviceByKey(key) {
//   return DEVICE_PRESETS.find(d => d.key === key) || null;
// }

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
//   const [activePreset,   setActivePreset]   = useState('desktop');   // ✅ NEW: selected-state tracking
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

//   // ✅ NEW (Aug 2026): a device preset overrides width/height inside the
//   // browser context, so the UI treats it as the authoritative source and
//   // visibly disables the fields it supersedes.
//   const selectedDevice   = useMemo(() => (device ? deviceByKey(device) : null), [device]);
//   const deviceOverriding = Boolean(selectedDevice && selectedDevice.key);

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

//   const nextResetDate = useMemo(
//     () => resolveNextReset(subscriptionStatus),
//     [subscriptionStatus]
//   );

//   const isResetOverdue = useMemo(() => {
//     if (!nextResetDate) return false;
//     return Date.now() > nextResetDate.getTime();
//   }, [nextResetDate]);

//   const forceRefreshIfNeeded = useCallback(async () => {
//     if (!isAuthenticated || !refreshSubscriptionStatus) return;
//     try { await refreshSubscriptionStatus(); } catch {}
//   }, [isAuthenticated, refreshSubscriptionStatus]);

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

//   const resetDateLabel = useMemo(() => {
//     if (!nextResetDate) return null;
//     try {
//       return nextResetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
//     } catch { return null; }
//   }, [nextResetDate]);

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

//       if (format === 'pdf' && !isPro) {
//         throw new Error('PDF generation requires Pro tier or higher. Please upgrade.');
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

//       // ✅ FIX (Aug 2026 — Device Preset dimensions):
//       // Resolution order for the dimensions we report back to the user:
//       //   1. The device preset's real viewport, when a device was used. The
//       //      descriptor overrides viewport/UA/DPR inside the browser context,
//       //      so the width/height inputs were never applied and must not be
//       //      shown. This is the case that was previously wrong — it displayed
//       //      the Quick Preset the user had also set.
//       //   2. Whatever the API reported.
//       //   3. The requested width/height, as a last resort.
//       const usedDevice = device ? deviceByKey(device) : null;
//       const reportedWidth  = usedDevice?.width  ?? data.width  ?? width;
//       const reportedHeight = usedDevice?.height ?? data.height ?? height;

//       setScreenshotUrl(data.screenshot_url || '');
//       setScreenshotData({
//         id:          data.screenshot_id,
//         url:         websiteUrl,
//         width:       reportedWidth,
//         height:      reportedHeight,
//         format:      data.format,
//         size:        data.size_bytes,
//         created_at:  data.created_at,
//         // ✅ NEW: carried through so Details can name the device explicitly
//         deviceKey:   usedDevice?.key   || '',
//         deviceLabel: usedDevice?.label || '',
//         deviceIcon:  usedDevice?.icon  || '',
//         fullPage,
//         darkMode,
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

//   // ✅ UPDATED: also records which preset is active so the card can highlight.
//   const applyPreset = (key, preset) => {
//     setWidth(preset.width);
//     setHeight(preset.height);
//     setActivePreset(key);
//   };

//   // ✅ NEW: manual width/height edits clear the active preset highlight,
//   // so the UI never claims a preset is applied when it no longer matches.
//   const handleWidthChange = (v) => { setWidth(v); setActivePreset(''); };
//   const handleHeightChange = (v) => { setHeight(v); setActivePreset(''); };

//   const primaryBtnClass = `flex-1 py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//     xUiPrimaryDisabled
//       ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//       : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-blue-500'
//   }`;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
//       <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
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

//       <div className="max-w-4xl mx-auto p-4 sm:p-6">
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Capture Website Screenshot</h1>
//           <div className="text-sm text-gray-600 mb-2">
//             Logged in as{' '}
//             <span className="font-semibold text-blue-600">{user?.username || 'User'}</span>{' '}
//             ({user?.email})
//           </div>

//           {/* Subscription card */}
//           <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 mt-4 shadow-sm">
//             <div className="flex items-center justify-between mb-3">
//               <div className="text-sm flex items-center gap-2">
//                 <span className="font-semibold text-gray-700">Current Plan:</span>
//                 <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${tierBadgeClass(tier)}`}>
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

//             {/* Progress */}
//             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-semibold text-gray-700">📸 Screenshots Used This Month</span>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   {safeFormatUsage('screenshots')}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//                 <div
//                   className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
//                   style={{ width: `${screenshotsPercent}%` }}
//                 />
//               </div>
//               <div className="flex justify-between items-center mt-2">
//                 <span className="text-xs text-gray-500">{screenshotsRemainingLabel}</span>
//                 <span className="text-xs font-medium text-gray-600">{screenshotsPercentLabel}</span>
//               </div>
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
//         <div className="bg-white border border-emerald-200 rounded-2xl p-4 mb-6 shadow-sm">
//           <h3 className="text-emerald-800 font-semibold mb-3 text-sm flex items-center gap-2">
//             <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
//             Try these example websites
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {[
//               { url: 'https://example.com', name: 'Example.com', desc: 'Simple test website' },
//               { url: 'https://github.com',  name: 'GitHub.com',  desc: 'Popular code hosting site' },
//             ].map(x => (
//               <button
//                 key={x.url}
//                 onClick={() => setWebsiteUrl(x.url)}
//                 className="text-left p-3 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
//               >
//                 {/* ✅ FIX (Aug 2026): explicit block + margin. These rendered as
//                     "Example.comSimple test website" with no separation in
//                     full-page captures and at narrow widths. `block` and an
//                     explicit top margin guarantee the break regardless of the
//                     parent's display context. */}
//                 <span className="block font-medium text-gray-800 text-sm group-hover:text-emerald-800">
//                   {x.name}
//                 </span>
//                 <span className="block text-xs text-gray-500 mt-0.5">
//                   {x.desc}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* URL Input */}
//         <div className="mb-3">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Website URL</label>
//           <input
//             type="text"
//             placeholder="https://example.com"
//             value={websiteUrl}
//             onChange={e => setWebsiteUrl(e.target.value)}
//             className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
//           />
//         </div>

//         {/* Valid URL pill */}
//         {websiteUrl && xUiValidUrl && (() => {
//           let displayDomain = websiteUrl;
//           try { displayDomain = new URL(websiteUrl).hostname; } catch {}
//           return (
//             <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden shadow-sm">
//               <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 border-b border-emerald-200">
//                 <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
//                 <span className="text-sm font-semibold text-emerald-800">Valid URL detected</span>
//                 <span className="ml-auto text-xs font-medium text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full truncate max-w-[180px]" title={displayDomain}>{displayDomain}</span>
//               </div>
//               <div className="px-4 py-2.5" title={websiteUrl}>
//                 <p className="text-xs font-mono text-emerald-700 break-all leading-relaxed">{websiteUrl}</p>
//               </div>
//             </div>
//           );
//         })()}

//         {/* Screenshot Configuration */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
//             <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base">📐</span>
//             Screenshot Configuration
//           </h3>

//           {/*
//             ✅ FIX (Aug 2026 — Device Preset precedence, part 3 of 3):
//             When a device preset is active it overrides viewport entirely, so
//             the Quick Presets and Width/Height inputs are visibly disabled and
//             explained. Previously a user could set "Laptop 1366x768" AND a
//             device, with nothing indicating the first would be discarded — and
//             the result screen then reported the discarded value.
//           */}
//           {deviceOverriding && (
//             <div className="mb-5 flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
//               <span className="text-lg leading-none mt-0.5">{selectedDevice.icon}</span>
//               <div className="text-sm text-purple-900">
//                 <span className="font-semibold">Device preset active — {selectedDevice.label}</span>
//                 <p className="text-xs text-purple-700 mt-0.5">
//                   Quick Presets and Width/Height are ignored while a device is selected.
//                   This capture will use {selectedDevice.width}×{selectedDevice.height}.
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setDevice('')}
//                 className="ml-auto flex-shrink-0 text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
//               >
//                 Clear
//               </button>
//             </div>
//           )}

//           {/* Quick Presets — segmented cards with an explicit active state */}
//           <div className={`mb-5 transition-opacity ${deviceOverriding ? 'opacity-40 pointer-events-none' : ''}`}>
//             <label className="block text-sm font-semibold text-gray-700 mb-2.5">Quick Presets</label>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
//               {Object.entries(VIEWPORT_PRESETS).map(([key, preset]) => {
//                 const isActive = activePreset === key && !deviceOverriding;
//                 return (
//                   <button
//                     key={key}
//                     onClick={() => applyPreset(key, preset)}
//                     disabled={deviceOverriding}
//                     className={`px-3 py-2.5 rounded-xl text-left transition-all border-2 ${
//                       isActive
//                         ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-sm'
//                         : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-sm">{preset.icon}</span>
//                       <span className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
//                         {preset.name}
//                       </span>
//                     </div>
//                     <div className={`text-xs mt-0.5 font-mono ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
//                       {preset.width}×{preset.height}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 transition-opacity ${deviceOverriding ? 'opacity-40 pointer-events-none' : ''}`}>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Width (px)</label>
//               <input type="number" value={width} disabled={deviceOverriding}
//                 onChange={e => handleWidthChange(parseInt(e.target.value) || 1920)}
//                 className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50"
//                 min="320" max="3840" />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Height (px)</label>
//               <input type="number" value={height} disabled={deviceOverriding}
//                 onChange={e => handleHeightChange(parseInt(e.target.value) || 1080)}
//                 className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50"
//                 min="240" max="2160" />
//             </div>
//           </div>

//           <div className="mb-5">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
//             <select
//               value={format}
//               onChange={e => {
//                 const next = e.target.value;
//                 if (next === 'pdf' && !isPro) {
//                   toast.error('PDF format requires Pro tier or higher.', { duration: 4000, icon: '🔒' });
//                   navigate('/pricing');
//                   return;
//                 }
//                 setFormat(next);
//               }}
//               className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//             >
//               <option value="png">PNG — lossless, larger file</option>
//               <option value="jpeg">JPEG — lossy, smaller file</option>
//               <option value="webp">WebP — best compression</option>
//               <option value="pdf">{isPro ? 'PDF — document format' : 'PDF — document format 🔒 Pro+ required'}</option>
//             </select>
//             {!isPro && (
//               <p className="text-xs text-amber-700 mt-2 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
//                 <span>🔒</span> PDF format requires Pro tier or higher.{' '}
//                 <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-amber-900">
//                   Upgrade →
//                 </button>
//               </p>
//             )}
//           </div>

//           <div className="space-y-2 mb-5">
//             {[
//               { checked: fullPage, set: setFullPage, label: 'Capture full page (scroll entire page)' },
//               { checked: darkMode, set: setDarkMode, label: 'Use dark mode' },
//             ].map(o => (
//               <label key={o.label} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
//                 <input type="checkbox" checked={o.checked} onChange={e => o.set(e.target.checked)}
//                   className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
//                 <span className="text-sm text-gray-700">{o.label}</span>
//               </label>
//             ))}
//           </div>

//           {/* Standard Advanced Options */}
//           <div className="border-t border-gray-200 pt-5">
//             <h4 className="text-sm font-bold text-gray-700 mb-3">Advanced Options</h4>
//             <div className="mb-4">
//               <label className="block text-sm text-gray-700 mb-1.5">Delay before capture (seconds)</label>
//               <select value={delay} onChange={e => setDelay(parseInt(e.target.value) || 0)}
//                 className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
//                 <option value={0}>0 s — Capture immediately</option>
//                 <option value={1}>1 s</option>
//                 <option value={2}>2 s — Recommended for most sites</option>
//                 <option value={3}>3 s</option>
//                 <option value={5}>5 s — Recommended for heavy pages</option>
//                 <option value={10}>10 s — Maximum</option>
//               </select>
//               <p className="text-xs text-gray-500 mt-1.5">Extra wait time after page load before capture begins</p>
//             </div>
//             <div>
//               <label className="block text-sm text-gray-700 mb-1.5">Remove elements (CSS selectors)</label>
//               <input type="text" value={removeElements} onChange={e => setRemoveElements(e.target.value)}
//                 placeholder=".cookie-banner, #popup, .ads"
//                 className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
//               <p className="text-xs text-gray-500 mt-1.5">Comma-separated CSS selectors to hide before capture</p>
//             </div>
//           </div>

//           {/* Pro & Business features */}
//           <div className="border-t border-gray-200 mt-5 pt-5">
//             <button type="button" onClick={() => setAdvancedProOpen(o => !o)}
//               className="w-full flex items-center justify-between py-1 hover:opacity-80 transition-opacity">
//               <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
//                 ⚡ Pro &amp; Business Features
//                 <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">Pro+</span>
//                 {deviceOverriding && (
//                   <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
//                     Device active
//                   </span>
//                 )}
//               </h4>
//               <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${advancedProOpen ? 'rotate-180' : ''}`}
//                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {advancedProOpen && (
//               <div className="space-y-5 mt-4">
//                 {!isPro && (
//                   <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-sm text-purple-800">
//                     🔒 Device emulation, Custom JavaScript, and Wait for selector require <strong>Pro tier or higher</strong>.{' '}
//                     <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-purple-900">Upgrade →</button>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     📱 Device Preset <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
//                   </label>
//                   <select value={device} onChange={e => setDevice(e.target.value)} disabled={!isPro}
//                     className={`w-full border rounded-xl px-3.5 py-2.5 text-sm transition-all ${
//                       !isPro ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300'
//                              : deviceOverriding ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-500/20'
//                              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
//                     }`}>
//                     {DEVICE_PRESETS.map(d => (
//                       <option key={d.key} value={d.key}>{d.icon ? `${d.icon} ${d.label}` : d.label}</option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1.5">
//                     Device presets override Width/Height and set the correct user-agent and pixel ratio.
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     ⏳ Wait for CSS Selector <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
//                   </label>
//                   <input type="text" value={waitForSelector} onChange={e => setWaitForSelector(e.target.value)}
//                     disabled={!isPro} placeholder="#main-content  or  .hero-section"
//                     className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono transition-all ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`} />
//                   <p className="text-xs text-gray-500 mt-1.5">Waits up to 10 seconds for this element to appear before capturing.</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     {'</>'} Custom JavaScript <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
//                   </label>
//                   <textarea value={customJs} onChange={e => setCustomJs(e.target.value)} disabled={!isPro}
//                     placeholder={JS_PLACEHOLDER} maxLength={10000} rows={6}
//                     className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono resize-y transition-all ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-slate-900 text-emerald-400 border-slate-700 focus:ring-2 focus:ring-blue-500'}`}
//                     style={isPro ? { lineHeight: '1.6' } : {}} />
//                   <div className="flex justify-between mt-1.5">
//                     <p className="text-xs text-gray-500">Executes after page load, before capture. Errors are non-fatal.</p>
//                     <p className={`text-xs flex-shrink-0 ml-2 ${customJs.length > 9500 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
//                       {customJs.length.toLocaleString()} / 10,000
//                     </p>
//                   </div>
//                 </div>

//                 <div className="border-t border-dashed border-gray-300 pt-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="text-sm font-bold text-gray-700">🏢 Business Features</span>
//                     <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">Business+</span>
//                   </div>
//                   {isPro && !isBusiness && (
//                     <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-sm text-indigo-800 mb-3">
//                       🔒 Element selection requires <strong>Business tier or higher</strong>.{' '}
//                       <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-indigo-900">Upgrade →</button>
//                     </div>
//                   )}
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1.5">
//                       ✂️ Element Selection — Crop to CSS Selector <span className="text-xs text-indigo-600 font-semibold">(Business+)</span>
//                     </label>
//                     <input type="text" value={targetElement} onChange={e => setTargetElement(e.target.value)}
//                       disabled={!isBusiness} placeholder="#hero  or  .pricing-table  or  main > article"
//                       className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono transition-all ${!isBusiness ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`} />
//                     <p className="text-xs text-gray-500 mt-1.5">
//                       Captures the full page, then automatically crops to this element's bounding box. Returns HTTP 400 if the selector matches nothing.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {atLimit('screenshots') && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 shadow-sm">
//             ⚠️ Monthly screenshot limit reached. Please upgrade your plan.
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-red-100 border-b border-red-200">
//               <span className="flex-shrink-0 text-red-600 font-bold">⚠️</span>
//               <span className="text-sm font-semibold text-red-800">Screenshot failed</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-sm text-red-700 leading-relaxed break-words">{error}</p>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-3 mb-6">
//           <button onClick={handleCapture} disabled={xUiPrimaryDisabled} aria-disabled={xUiPrimaryDisabled}
//             title={xUiDisabledReason()} className={primaryBtnClass}>
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
//             className="px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
//           >
//             🗑️ Clear
//           </button>
//         </div>

//         {jsWarning && (
//           <div className="bg-amber-50 border border-amber-300 rounded-xl mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 border-b border-amber-200">
//               <span className="text-amber-600 font-bold">⚠️</span>
//               <span className="text-sm font-semibold text-amber-800">JavaScript warning — screenshot still captured</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-xs font-mono text-amber-700 break-all leading-relaxed">{jsWarning}</p>
//             </div>
//           </div>
//         )}

//         {elementCaptured && (
//           <div className="bg-emerald-50 border border-emerald-300 rounded-xl mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 border-b border-emerald-200">
//               <span className="text-emerald-600 font-bold">✂️</span>
//               <span className="text-sm font-semibold text-emerald-800">Element captured — cropped to selector</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-xs font-mono text-emerald-700 break-all leading-relaxed">{elementCaptured}</p>
//             </div>
//           </div>
//         )}

//         {screenshotUrl && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
//             <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
//               {format === 'pdf' ? '📄' : '🖼️'} Screenshot Result
//               {screenshotCompleted && (
//                 <span className="ml-1 inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
//                   ✅ Capture complete
//                 </span>
//               )}
//             </h2>
//             {format === 'pdf' ? (
//               <div className="mb-4">
//                 <div className="rounded-xl overflow-hidden border border-gray-300 shadow-lg bg-gray-100" style={{ height: '500px' }}>
//                   <iframe src={screenshotUrl} title="PDF preview" className="w-full h-full" style={{ border: 'none' }} />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2 text-center">📱 If the PDF doesn't display above, use the buttons below to download or open it.</p>
//               </div>
//             ) : (
//               <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
//                 <img src={screenshotUrl} alt="Screenshot preview" className="max-w-full h-auto border border-gray-300 rounded-lg shadow-md mx-auto" />
//               </div>
//             )}

//             {/*
//               ✅ FIX (Aug 2026 — Device Preset dimensions, part 2 of 3):
//               Details now report the DEVICE viewport when a device preset was
//               used, and name the device explicitly. Previously this row showed
//               the Quick Preset's width/height, which the device descriptor had
//               already overridden and discarded — so the user was told 1366×768
//               for a capture actually taken at 1024×1366.
//             */}
//             {screenshotData && (
//               <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl mb-4 border border-emerald-200">
//                 <div className="font-bold text-gray-800 mb-2 text-sm">
//                   {format === 'pdf' ? '📄 PDF Details' : '✅ Screenshot Details'}
//                 </div>
//                 <dl className="space-y-1.5 text-sm">
//                   <div className="flex gap-2">
//                     <dt className="text-gray-500 flex-shrink-0 w-24">URL</dt>
//                     <dd className="text-gray-800 break-all">{screenshotData.url}</dd>
//                   </div>

//                   {screenshotData.deviceLabel && (
//                     <div className="flex gap-2">
//                       <dt className="text-gray-500 flex-shrink-0 w-24">Device</dt>
//                       <dd className="text-gray-800 font-medium">
//                         {screenshotData.deviceIcon} {screenshotData.deviceLabel}
//                       </dd>
//                     </div>
//                   )}

//                   <div className="flex gap-2">
//                     <dt className="text-gray-500 flex-shrink-0 w-24">Dimensions</dt>
//                     <dd className="text-gray-800 font-mono">
//                       {screenshotData.width}×{screenshotData.height}
//                       {screenshotData.deviceLabel && (
//                         <span className="ml-2 text-xs text-purple-600 font-sans font-medium">
//                           (device viewport)
//                         </span>
//                       )}
//                     </dd>
//                   </div>

//                   <div className="flex gap-2">
//                     <dt className="text-gray-500 flex-shrink-0 w-24">Format</dt>
//                     <dd className="text-gray-800">{screenshotData.format?.toUpperCase()}</dd>
//                   </div>

//                   {(screenshotData.fullPage || screenshotData.darkMode) && (
//                     <div className="flex gap-2">
//                       <dt className="text-gray-500 flex-shrink-0 w-24">Options</dt>
//                       <dd className="text-gray-800 flex flex-wrap gap-1.5">
//                         {screenshotData.fullPage && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Full page</span>}
//                         {screenshotData.darkMode && <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded">Dark mode</span>}
//                       </dd>
//                     </div>
//                   )}

//                   {elementCaptured && (
//                     <div className="flex gap-2">
//                       <dt className="text-gray-500 flex-shrink-0 w-24">Element</dt>
//                       <dd><code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200">{elementCaptured}</code></dd>
//                     </div>
//                   )}

//                   {screenshotData.size && (
//                     <div className="flex gap-2">
//                       <dt className="text-gray-500 flex-shrink-0 w-24">Size</dt>
//                       <dd className="text-gray-800 font-mono">{(screenshotData.size / 1024).toFixed(2)} KB</dd>
//                     </div>
//                   )}
//                 </dl>
//               </div>
//             )}

//             <div className="flex gap-3 flex-wrap">
//               <button onClick={handleDownload}
//                 className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm">
//                 {format === 'pdf' ? '📥 Download PDF' : '💾 Download'}
//               </button>
//               <a href={screenshotUrl} target="_blank" rel="noopener noreferrer"
//                 className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
//                 {format === 'pdf' ? '📄 Open PDF' : '🔗 Open in New Tab'}
//               </a>
//             </div>
//           </div>
//         )}

//         <div className="text-center mb-6">
//           <div className="flex gap-3 justify-center flex-wrap">
//             <button onClick={() => navigate('/dashboard')} className="bg-gray-700 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">← Back to Dashboard</button>
//             <button onClick={() => navigate('/history')}   className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">📚 View History</button>
//             <button onClick={() => navigate('/activity')}  className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors">📋 Recent Activity</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===== END OF ScreenshotPage.js ========


// // frontend/src/pages/ScreenshotPage.js — PixelPerfect Screenshot API
// // UPDATED: August 2026
// //
// // ============================================================================
// // ✅ FIX (Aug 2026 — Device Preset reported the wrong dimensions)
// // ============================================================================
// //   Reproduction: choose Quick Preset "Laptop (1366x768)", then choose Device
// //   Preset "iPad Pro 11\"". Capture. Screenshot Details reported 1366×768 —
// //   the Quick Preset — even though the capture actually used the iPad
// //   viewport (1024×1366).
// //
// //   Root cause: when a device preset is supplied, Playwright's device
// //   descriptor overrides viewport/user-agent/DPR inside the browser context,
// //   but the width/height carried back through the response were still the
// //   request's width/height fields. The user was shown values that had been
// //   overridden and discarded.
// //
// //   Fix, in three parts:
// //     1. DEVICE_PRESETS now carries the real viewport of every device, so the
// //        UI knows the true dimensions without waiting for the API.
// //     2. Screenshot Details reports the device viewport (and names the device)
// //        whenever a device preset was used, falling back to the API response
// //        and then the request fields.
// //     3. The UI now makes the override visible BEFORE capture: selecting a
// //        device dims the Quick Presets and the Width/Height inputs and shows
// //        an inline banner. The old behaviour let a user set 1366×768 with no
// //        signal that it would be ignored.
// //
// // ✅ UI REFRESH (Aug 2026 — Screenshot Configuration):
// //   Quick Presets were flat grey buttons with no selected state — you could
// //   not tell which preset was active. They are now segmented cards with an
// //   explicit active state (blue ring + tint), an icon per device class, and
// //   the dimensions on a second line. Format select, section headers and the
// //   capture button were given matching treatment. No logic changed.
// //
// // Previous fixes (all retained):
// // ✅ FIX (July 2026 — "Resets on [date]" Not Displaying): resolveNextReset()
// //   checks next_reset, nextReset, reset_date, resetDate, current_period_end,
// //   currentPeriodEnd, usage.next_reset.
// // ✅ FIX (July 2026 — Mount effect runs on every navigation): dependency []
// // ✅ FIX (July 2026 — Billing cycle reset date display)
// // ✅ CONSISTENCY FIX (July 2026 — Tier badge colors)
// // ✅ FIX (May 2026 — Phase 2): Element Selection (Business+) with CSS crop
// // ✅ FIX (May 2026 — Phase 1): Device emulation, Custom JS, Wait for selector
// // ✅ FIX (Apr 2026): friendlyError() translates raw Playwright errors
// // ✅ FIX (Mar 2026): resolveApiBase() replaces build-time env var fallback

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

// function resolveNextReset(subscriptionStatus) {
//   if (!subscriptionStatus) return null;
//   const candidates = [
//     subscriptionStatus.next_reset,
//     subscriptionStatus.nextReset,
//     subscriptionStatus.reset_date,
//     subscriptionStatus.resetDate,
//     subscriptionStatus.current_period_end,
//     subscriptionStatus.currentPeriodEnd,
//     subscriptionStatus.usage?.next_reset,
//   ];
//   for (const raw of candidates) {
//     if (!raw) continue;
//     const d = typeof raw === 'number'
//       ? new Date(raw < 1e12 ? raw * 1000 : raw)
//       : new Date(raw);
//     if (!Number.isNaN(d.getTime())) return d;
//   }
//   return null;
// }

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

// // ── Quick Presets — now carry an icon for the segmented card UI ──────────────
// const VIEWPORT_PRESETS = {
//   desktop:   { width: 1920, height: 1080, name: 'Desktop',   icon: '🖥️' },
//   laptop:    { width: 1366, height: 768,  name: 'Laptop',    icon: '💻' },
//   tablet:    { width: 768,  height: 1024, name: 'Tablet',    icon: '📟' },
//   mobile:    { width: 375,  height: 667,  name: 'Mobile',    icon: '📱' },
//   ultrawide: { width: 3440, height: 1440, name: 'Ultrawide', icon: '🖥️' },
// };

// // ── Device Presets ───────────────────────────────────────────────────────────
// // ✅ FIX (Aug 2026): each preset now carries its REAL viewport. Previously the
// // dimensions existed only inside the label string, so the UI had no way to
// // report what a device capture actually produced — it fell back to the
// // width/height inputs, which the device descriptor had already overridden.
// // These values match Playwright's device registry (see SUPPORTED_DEVICES in
// // screenshot_service.py). If Playwright updates a descriptor, update here too.
// const DEVICE_PRESETS = [
//   { key: '',                  label: '— No device preset (use width/height) —', width: null, height: null, icon: '' },
//   { key: 'iphone_13',         label: 'iPhone 13 (390×844, Safari)',              width: 390,  height: 844,  icon: '📱' },
//   { key: 'iphone_13_pro_max', label: 'iPhone 13 Pro Max (428×926, Safari)',      width: 428,  height: 926,  icon: '📱' },
//   { key: 'iphone_se',         label: 'iPhone SE (375×667, Safari)',              width: 375,  height: 667,  icon: '📱' },
//   { key: 'pixel_5',           label: 'Google Pixel 5 (393×851, Chrome)',         width: 393,  height: 851,  icon: '📱' },
//   { key: 'pixel_7',           label: 'Google Pixel 7 (412×915, Chrome)',         width: 412,  height: 915,  icon: '📱' },
//   { key: 'ipad_pro',          label: 'iPad Pro 11" (1024×1366, Safari)',         width: 1024, height: 1366, icon: '📟' },
//   { key: 'ipad_mini',         label: 'iPad Mini (768×1024, Safari)',             width: 768,  height: 1024, icon: '📟' },
//   { key: 'galaxy_s9',         label: 'Samsung Galaxy S9+ (320×658, Chrome)',     width: 320,  height: 658,  icon: '📱' },
//   { key: 'galaxy_tab_s4',     label: 'Samsung Galaxy Tab S4 (712×1138, Chrome)', width: 712,  height: 1138, icon: '📟' },
// ];

// function deviceByKey(key) {
//   return DEVICE_PRESETS.find(d => d.key === key) || null;
// }

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
//   const [activePreset,   setActivePreset]   = useState('desktop');   // ✅ NEW: selected-state tracking
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

//   // ✅ NEW (Aug 2026): a device preset overrides width/height inside the
//   // browser context, so the UI treats it as the authoritative source and
//   // visibly disables the fields it supersedes.
//   const selectedDevice   = useMemo(() => (device ? deviceByKey(device) : null), [device]);
//   const deviceOverriding = Boolean(selectedDevice && selectedDevice.key);

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

//   const nextResetDate = useMemo(
//     () => resolveNextReset(subscriptionStatus),
//     [subscriptionStatus]
//   );

//   const isResetOverdue = useMemo(() => {
//     if (!nextResetDate) return false;
//     return Date.now() > nextResetDate.getTime();
//   }, [nextResetDate]);

//   const forceRefreshIfNeeded = useCallback(async () => {
//     if (!isAuthenticated || !refreshSubscriptionStatus) return;
//     try { await refreshSubscriptionStatus(); } catch {}
//   }, [isAuthenticated, refreshSubscriptionStatus]);

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

//   const resetDateLabel = useMemo(() => {
//     if (!nextResetDate) return null;
//     try {
//       return nextResetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
//     } catch { return null; }
//   }, [nextResetDate]);

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

//       if (format === 'pdf' && !isPro) {
//         throw new Error('PDF generation requires Pro tier or higher. Please upgrade.');
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

//       // ✅ FIX (Aug 2026 — Device Preset dimensions):
//       // Resolution order for the dimensions we report back to the user:
//       //   1. The device preset's real viewport, when a device was used. The
//       //      descriptor overrides viewport/UA/DPR inside the browser context,
//       //      so the width/height inputs were never applied and must not be
//       //      shown. This is the case that was previously wrong — it displayed
//       //      the Quick Preset the user had also set.
//       //   2. Whatever the API reported.
//       //   3. The requested width/height, as a last resort.
//       const usedDevice = device ? deviceByKey(device) : null;
//       const reportedWidth  = usedDevice?.width  ?? data.width  ?? width;
//       const reportedHeight = usedDevice?.height ?? data.height ?? height;

//       setScreenshotUrl(data.screenshot_url || '');
//       setScreenshotData({
//         id:          data.screenshot_id,
//         url:         websiteUrl,
//         width:       reportedWidth,
//         height:      reportedHeight,
//         format:      data.format,
//         size:        data.size_bytes,
//         created_at:  data.created_at,
//         // ✅ NEW: carried through so Details can name the device explicitly
//         deviceKey:   usedDevice?.key   || '',
//         deviceLabel: usedDevice?.label || '',
//         deviceIcon:  usedDevice?.icon  || '',
//         fullPage,
//         darkMode,
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

//   // ✅ UPDATED: also records which preset is active so the card can highlight.
//   const applyPreset = (key, preset) => {
//     setWidth(preset.width);
//     setHeight(preset.height);
//     setActivePreset(key);
//   };

//   // ✅ NEW: manual width/height edits clear the active preset highlight,
//   // so the UI never claims a preset is applied when it no longer matches.
//   const handleWidthChange = (v) => { setWidth(v); setActivePreset(''); };
//   const handleHeightChange = (v) => { setHeight(v); setActivePreset(''); };

//   const primaryBtnClass = `flex-1 py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//     xUiPrimaryDisabled
//       ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//       : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-blue-500'
//   }`;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
//       <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
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

//       <div className="max-w-4xl mx-auto p-4 sm:p-6">
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Capture Website Screenshot</h1>
//           <div className="text-sm text-gray-600 mb-2">
//             Logged in as{' '}
//             <span className="font-semibold text-blue-600">{user?.username || 'User'}</span>{' '}
//             ({user?.email})
//           </div>

//           {/* Subscription card */}
//           <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 mt-4 shadow-sm">
//             <div className="flex items-center justify-between mb-3">
//               <div className="text-sm flex items-center gap-2">
//                 <span className="font-semibold text-gray-700">Current Plan:</span>
//                 <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${tierBadgeClass(tier)}`}>
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

//             {/* Progress */}
//             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-semibold text-gray-700">📸 Screenshots Used This Month</span>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   {safeFormatUsage('screenshots')}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//                 <div
//                   className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
//                   style={{ width: `${screenshotsPercent}%` }}
//                 />
//               </div>
//               <div className="flex justify-between items-center mt-2">
//                 <span className="text-xs text-gray-500">{screenshotsRemainingLabel}</span>
//                 <span className="text-xs font-medium text-gray-600">{screenshotsPercentLabel}</span>
//               </div>
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
//         <div className="bg-white border border-emerald-200 rounded-2xl p-4 mb-6 shadow-sm">
//           <h3 className="text-emerald-800 font-semibold mb-3 text-sm flex items-center gap-2">
//             <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
//             Try these example websites
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {[
//               { url: 'https://example.com', name: 'Example.com', desc: 'Simple test website' },
//               { url: 'https://github.com',  name: 'GitHub.com',  desc: 'Popular code hosting site' },
//             ].map(x => (
//               <button
//                 key={x.url}
//                 onClick={() => setWebsiteUrl(x.url)}
//                 className="text-left p-3 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
//               >
//                 <div className="font-medium text-gray-800 text-sm group-hover:text-emerald-800">{x.name}</div>
//                 <div className="text-xs text-gray-500">{x.desc}</div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* URL Input */}
//         <div className="mb-3">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Website URL</label>
//           <input
//             type="text"
//             placeholder="https://example.com"
//             value={websiteUrl}
//             onChange={e => setWebsiteUrl(e.target.value)}
//             className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
//           />
//         </div>

//         {/* Valid URL pill */}
//         {websiteUrl && xUiValidUrl && (() => {
//           let displayDomain = websiteUrl;
//           try { displayDomain = new URL(websiteUrl).hostname; } catch {}
//           return (
//             <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden shadow-sm">
//               <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 border-b border-emerald-200">
//                 <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
//                 <span className="text-sm font-semibold text-emerald-800">Valid URL detected</span>
//                 <span className="ml-auto text-xs font-medium text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full truncate max-w-[180px]" title={displayDomain}>{displayDomain}</span>
//               </div>
//               <div className="px-4 py-2.5" title={websiteUrl}>
//                 <p className="text-xs font-mono text-emerald-700 break-all leading-relaxed">{websiteUrl}</p>
//               </div>
//             </div>
//           );
//         })()}

//         {/* Screenshot Configuration */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
//             <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base">📐</span>
//             Screenshot Configuration
//           </h3>

//           {/*
//             ✅ FIX (Aug 2026 — Device Preset precedence, part 3 of 3):
//             When a device preset is active it overrides viewport entirely, so
//             the Quick Presets and Width/Height inputs are visibly disabled and
//             explained. Previously a user could set "Laptop 1366x768" AND a
//             device, with nothing indicating the first would be discarded — and
//             the result screen then reported the discarded value.
//           */}
//           {deviceOverriding && (
//             <div className="mb-5 flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
//               <span className="text-lg leading-none mt-0.5">{selectedDevice.icon}</span>
//               <div className="text-sm text-purple-900">
//                 <span className="font-semibold">Device preset active — {selectedDevice.label}</span>
//                 <p className="text-xs text-purple-700 mt-0.5">
//                   Quick Presets and Width/Height are ignored while a device is selected.
//                   This capture will use {selectedDevice.width}×{selectedDevice.height}.
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setDevice('')}
//                 className="ml-auto flex-shrink-0 text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
//               >
//                 Clear
//               </button>
//             </div>
//           )}

//           {/* Quick Presets — segmented cards with an explicit active state */}
//           <div className={`mb-5 transition-opacity ${deviceOverriding ? 'opacity-40 pointer-events-none' : ''}`}>
//             <label className="block text-sm font-semibold text-gray-700 mb-2.5">Quick Presets</label>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
//               {Object.entries(VIEWPORT_PRESETS).map(([key, preset]) => {
//                 const isActive = activePreset === key && !deviceOverriding;
//                 return (
//                   <button
//                     key={key}
//                     onClick={() => applyPreset(key, preset)}
//                     disabled={deviceOverriding}
//                     className={`px-3 py-2.5 rounded-xl text-left transition-all border-2 ${
//                       isActive
//                         ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-sm'
//                         : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-sm">{preset.icon}</span>
//                       <span className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
//                         {preset.name}
//                       </span>
//                     </div>
//                     <div className={`text-xs mt-0.5 font-mono ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
//                       {preset.width}×{preset.height}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 transition-opacity ${deviceOverriding ? 'opacity-40 pointer-events-none' : ''}`}>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Width (px)</label>
//               <input type="number" value={width} disabled={deviceOverriding}
//                 onChange={e => handleWidthChange(parseInt(e.target.value) || 1920)}
//                 className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50"
//                 min="320" max="3840" />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Height (px)</label>
//               <input type="number" value={height} disabled={deviceOverriding}
//                 onChange={e => handleHeightChange(parseInt(e.target.value) || 1080)}
//                 className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50"
//                 min="240" max="2160" />
//             </div>
//           </div>

//           <div className="mb-5">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
//             <select
//               value={format}
//               onChange={e => {
//                 const next = e.target.value;
//                 if (next === 'pdf' && !isPro) {
//                   toast.error('PDF format requires Pro tier or higher.', { duration: 4000, icon: '🔒' });
//                   navigate('/pricing');
//                   return;
//                 }
//                 setFormat(next);
//               }}
//               className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//             >
//               <option value="png">PNG — lossless, larger file</option>
//               <option value="jpeg">JPEG — lossy, smaller file</option>
//               <option value="webp">WebP — best compression</option>
//               <option value="pdf">{isPro ? 'PDF — document format' : 'PDF — document format 🔒 Pro+ required'}</option>
//             </select>
//             {!isPro && (
//               <p className="text-xs text-amber-700 mt-2 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
//                 <span>🔒</span> PDF format requires Pro tier or higher.{' '}
//                 <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-amber-900">
//                   Upgrade →
//                 </button>
//               </p>
//             )}
//           </div>

//           <div className="space-y-2 mb-5">
//             {[
//               { checked: fullPage, set: setFullPage, label: 'Capture full page (scroll entire page)' },
//               { checked: darkMode, set: setDarkMode, label: 'Use dark mode' },
//             ].map(o => (
//               <label key={o.label} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
//                 <input type="checkbox" checked={o.checked} onChange={e => o.set(e.target.checked)}
//                   className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
//                 <span className="text-sm text-gray-700">{o.label}</span>
//               </label>
//             ))}
//           </div>

//           {/* Standard Advanced Options */}
//           <div className="border-t border-gray-200 pt-5">
//             <h4 className="text-sm font-bold text-gray-700 mb-3">Advanced Options</h4>
//             <div className="mb-4">
//               <label className="block text-sm text-gray-700 mb-1.5">Delay before capture (seconds)</label>
//               <select value={delay} onChange={e => setDelay(parseInt(e.target.value) || 0)}
//                 className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
//                 <option value={0}>0 s — Capture immediately</option>
//                 <option value={1}>1 s</option>
//                 <option value={2}>2 s — Recommended for most sites</option>
//                 <option value={3}>3 s</option>
//                 <option value={5}>5 s — Recommended for heavy pages</option>
//                 <option value={10}>10 s — Maximum</option>
//               </select>
//               <p className="text-xs text-gray-500 mt-1.5">Extra wait time after page load before capture begins</p>
//             </div>
//             <div>
//               <label className="block text-sm text-gray-700 mb-1.5">Remove elements (CSS selectors)</label>
//               <input type="text" value={removeElements} onChange={e => setRemoveElements(e.target.value)}
//                 placeholder=".cookie-banner, #popup, .ads"
//                 className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
//               <p className="text-xs text-gray-500 mt-1.5">Comma-separated CSS selectors to hide before capture</p>
//             </div>
//           </div>

//           {/* Pro & Business features */}
//           <div className="border-t border-gray-200 mt-5 pt-5">
//             <button type="button" onClick={() => setAdvancedProOpen(o => !o)}
//               className="w-full flex items-center justify-between py-1 hover:opacity-80 transition-opacity">
//               <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
//                 ⚡ Pro &amp; Business Features
//                 <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">Pro+</span>
//                 {deviceOverriding && (
//                   <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
//                     Device active
//                   </span>
//                 )}
//               </h4>
//               <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${advancedProOpen ? 'rotate-180' : ''}`}
//                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {advancedProOpen && (
//               <div className="space-y-5 mt-4">
//                 {!isPro && (
//                   <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-sm text-purple-800">
//                     🔒 Device emulation, Custom JavaScript, and Wait for selector require <strong>Pro tier or higher</strong>.{' '}
//                     <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-purple-900">Upgrade →</button>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     📱 Device Preset <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
//                   </label>
//                   <select value={device} onChange={e => setDevice(e.target.value)} disabled={!isPro}
//                     className={`w-full border rounded-xl px-3.5 py-2.5 text-sm transition-all ${
//                       !isPro ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300'
//                              : deviceOverriding ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-500/20'
//                              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
//                     }`}>
//                     {DEVICE_PRESETS.map(d => (
//                       <option key={d.key} value={d.key}>{d.icon ? `${d.icon} ${d.label}` : d.label}</option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1.5">
//                     Device presets override Width/Height and set the correct user-agent and pixel ratio.
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     ⏳ Wait for CSS Selector <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
//                   </label>
//                   <input type="text" value={waitForSelector} onChange={e => setWaitForSelector(e.target.value)}
//                     disabled={!isPro} placeholder="#main-content  or  .hero-section"
//                     className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono transition-all ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`} />
//                   <p className="text-xs text-gray-500 mt-1.5">Waits up to 10 seconds for this element to appear before capturing.</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     {'</>'} Custom JavaScript <span className="text-xs text-purple-600 font-semibold">(Pro+)</span>
//                   </label>
//                   <textarea value={customJs} onChange={e => setCustomJs(e.target.value)} disabled={!isPro}
//                     placeholder={JS_PLACEHOLDER} maxLength={10000} rows={6}
//                     className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono resize-y transition-all ${!isPro ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-slate-900 text-emerald-400 border-slate-700 focus:ring-2 focus:ring-blue-500'}`}
//                     style={isPro ? { lineHeight: '1.6' } : {}} />
//                   <div className="flex justify-between mt-1.5">
//                     <p className="text-xs text-gray-500">Executes after page load, before capture. Errors are non-fatal.</p>
//                     <p className={`text-xs flex-shrink-0 ml-2 ${customJs.length > 9500 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
//                       {customJs.length.toLocaleString()} / 10,000
//                     </p>
//                   </div>
//                 </div>

//                 <div className="border-t border-dashed border-gray-300 pt-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="text-sm font-bold text-gray-700">🏢 Business Features</span>
//                     <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">Business+</span>
//                   </div>
//                   {isPro && !isBusiness && (
//                     <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-sm text-indigo-800 mb-3">
//                       🔒 Element selection requires <strong>Business tier or higher</strong>.{' '}
//                       <button type="button" onClick={() => navigate('/pricing')} className="underline font-semibold hover:text-indigo-900">Upgrade →</button>
//                     </div>
//                   )}
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1.5">
//                       ✂️ Element Selection — Crop to CSS Selector <span className="text-xs text-indigo-600 font-semibold">(Business+)</span>
//                     </label>
//                     <input type="text" value={targetElement} onChange={e => setTargetElement(e.target.value)}
//                       disabled={!isBusiness} placeholder="#hero  or  .pricing-table  or  main > article"
//                       className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono transition-all ${!isBusiness ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`} />
//                     <p className="text-xs text-gray-500 mt-1.5">
//                       Captures the full page, then automatically crops to this element's bounding box. Returns HTTP 400 if the selector matches nothing.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {atLimit('screenshots') && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 shadow-sm">
//             ⚠️ Monthly screenshot limit reached. Please upgrade your plan.
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-red-100 border-b border-red-200">
//               <span className="flex-shrink-0 text-red-600 font-bold">⚠️</span>
//               <span className="text-sm font-semibold text-red-800">Screenshot failed</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-sm text-red-700 leading-relaxed break-words">{error}</p>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-3 mb-6">
//           <button onClick={handleCapture} disabled={xUiPrimaryDisabled} aria-disabled={xUiPrimaryDisabled}
//             title={xUiDisabledReason()} className={primaryBtnClass}>
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
//             className="px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
//           >
//             🗑️ Clear
//           </button>
//         </div>

//         {jsWarning && (
//           <div className="bg-amber-50 border border-amber-300 rounded-xl mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 border-b border-amber-200">
//               <span className="text-amber-600 font-bold">⚠️</span>
//               <span className="text-sm font-semibold text-amber-800">JavaScript warning — screenshot still captured</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-xs font-mono text-amber-700 break-all leading-relaxed">{jsWarning}</p>
//             </div>
//           </div>
//         )}

//         {elementCaptured && (
//           <div className="bg-emerald-50 border border-emerald-300 rounded-xl mb-4 shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 border-b border-emerald-200">
//               <span className="text-emerald-600 font-bold">✂️</span>
//               <span className="text-sm font-semibold text-emerald-800">Element captured — cropped to selector</span>
//             </div>
//             <div className="px-4 py-2.5">
//               <p className="text-xs font-mono text-emerald-700 break-all leading-relaxed">{elementCaptured}</p>
//             </div>
//           </div>
//         )}

//         {screenshotUrl && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
//             <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
//               {format === 'pdf' ? '📄' : '🖼️'} Screenshot Result
//               {screenshotCompleted && (
//                 <span className="ml-1 inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
//                   ✅ Capture complete
//                 </span>
//               )}
//             </h2>
//             {format === 'pdf' ? (
//               <div className="mb-4">
//                 <div className="rounded-xl overflow-hidden border border-gray-300 shadow-lg bg-gray-100" style={{ height: '500px' }}>
//                   <iframe src={screenshotUrl} title="PDF preview" className="w-full h-full" style={{ border: 'none' }} />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2 text-center">📱 If the PDF doesn't display above, use the buttons below to download or open it.</p>
//               </div>
//             ) : (
//               <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
//                 <img src={screenshotUrl} alt="Screenshot preview" className="max-w-full h-auto border border-gray-300 rounded-lg shadow-md mx-auto" />
//               </div>
//             )}

//             {/*
//               ✅ FIX (Aug 2026 — Device Preset dimensions, part 2 of 3):
//               Details now report the DEVICE viewport when a device preset was
//               used, and name the device explicitly. Previously this row showed
//               the Quick Preset's width/height, which the device descriptor had
//               already overridden and discarded — so the user was told 1366×768
//               for a capture actually taken at 1024×1366.
//             */}
//             {screenshotData && (
//               <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl mb-4 border border-emerald-200">
//                 <div className="font-bold text-gray-800 mb-2 text-sm">
//                   {format === 'pdf' ? '📄 PDF Details' : '✅ Screenshot Details'}
//                 </div>
//                 <dl className="space-y-1.5 text-sm">
//                   <div className="flex gap-2">
//                     <dt className="text-gray-500 flex-shrink-0 w-24">URL</dt>
//                     <dd className="text-gray-800 break-all">{screenshotData.url}</dd>
//                   </div>

//                   {screenshotData.deviceLabel && (
//                     <div className="flex gap-2">
//                       <dt className="text-gray-500 flex-shrink-0 w-24">Device</dt>
//                       <dd className="text-gray-800 font-medium">
//                         {screenshotData.deviceIcon} {screenshotData.deviceLabel}
//                       </dd>
//                     </div>
//                   )}

//                   <div className="flex gap-2">
//                     <dt className="text-gray-500 flex-shrink-0 w-24">Dimensions</dt>
//                     <dd className="text-gray-800 font-mono">
//                       {screenshotData.width}×{screenshotData.height}
//                       {screenshotData.deviceLabel && (
//                         <span className="ml-2 text-xs text-purple-600 font-sans font-medium">
//                           (device viewport)
//                         </span>
//                       )}
//                     </dd>
//                   </div>

//                   <div className="flex gap-2">
//                     <dt className="text-gray-500 flex-shrink-0 w-24">Format</dt>
//                     <dd className="text-gray-800">{screenshotData.format?.toUpperCase()}</dd>
//                   </div>

//                   {(screenshotData.fullPage || screenshotData.darkMode) && (
//                     <div className="flex gap-2">
//                       <dt className="text-gray-500 flex-shrink-0 w-24">Options</dt>
//                       <dd className="text-gray-800 flex flex-wrap gap-1.5">
//                         {screenshotData.fullPage && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Full page</span>}
//                         {screenshotData.darkMode && <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded">Dark mode</span>}
//                       </dd>
//                     </div>
//                   )}

//                   {elementCaptured && (
//                     <div className="flex gap-2">
//                       <dt className="text-gray-500 flex-shrink-0 w-24">Element</dt>
//                       <dd><code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200">{elementCaptured}</code></dd>
//                     </div>
//                   )}

//                   {screenshotData.size && (
//                     <div className="flex gap-2">
//                       <dt className="text-gray-500 flex-shrink-0 w-24">Size</dt>
//                       <dd className="text-gray-800 font-mono">{(screenshotData.size / 1024).toFixed(2)} KB</dd>
//                     </div>
//                   )}
//                 </dl>
//               </div>
//             )}

//             <div className="flex gap-3 flex-wrap">
//               <button onClick={handleDownload}
//                 className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm">
//                 {format === 'pdf' ? '📥 Download PDF' : '💾 Download'}
//               </button>
//               <a href={screenshotUrl} target="_blank" rel="noopener noreferrer"
//                 className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
//                 {format === 'pdf' ? '📄 Open PDF' : '🔗 Open in New Tab'}
//               </a>
//             </div>
//           </div>
//         )}

//         <div className="text-center mb-6">
//           <div className="flex gap-3 justify-center flex-wrap">
//             <button onClick={() => navigate('/dashboard')} className="bg-gray-700 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">← Back to Dashboard</button>
//             <button onClick={() => navigate('/history')}   className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">📚 View History</button>
//             <button onClick={() => navigate('/activity')}  className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors">📋 Recent Activity</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===== END OF ScreenshotPage.js ==============

