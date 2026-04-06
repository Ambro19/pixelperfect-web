// ========================================
// SUBSCRIPTION CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/SubscriptionContext.js
// Author: OneTechly
// Updated: April 2026
//
// Fixes:
// 1) Unified with AuthContext patterns (useMemo, error handling)
// 2) Improved polling with max attempts and backoff
// 3) Stable refs to prevent stale closures
// 4) Better error messages and logging
// ✅ FIX (Apr 2026): Removed focus/visibilitychange listeners from context.
//
//    Root cause of Stripe API flood visible in production logs:
//      Both SubscriptionContext AND DashboardPage registered window.focus +
//      visibilitychange listeners independently. On every tab switch:
//        • Context listener fired → refreshSubscriptionStatus(false) → sync=0
//        • Dashboard listener fired → refreshSubscriptionStatus() → forceSync
//          defaults to TRUE → sync=1 → Stripe API call
//      Result: every tab switch hit Stripe. With rapid switching this produced
//      4+ Stripe calls per second as seen in logs (22:39:48–22:39:51).
//
//    Fix:
//      Removed focus/visibilitychange listeners from this context entirely.
//      DashboardPage.js owns those listeners, has a proper 5s debounce, and
//      explicitly passes forceSync=false so Stripe is never called on focus.
//      Stripe sync only happens when the user manually clicks "Refresh Usage".
// ========================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { currentApiBase as currentApiBaseFn } from '../lib/api';

const SubscriptionContext = createContext(null);

function safeLower(x, fallback = 'free') {
  return (typeof x === 'string' && x.trim() ? x.trim().toLowerCase() : fallback);
}

function isResetOverdue(nextResetIso) {
  if (!nextResetIso) return false;
  const d = new Date(nextResetIso);
  if (Number.isNaN(d.getTime())) return false;
  return Date.now() >= d.getTime();
}

function normalizeSubscriptionError(err) {
  const out = {
    status: undefined,
    detail: undefined,
    message: 'Subscription fetch failed',
    raw: err
  };

  const status = err?.response?.status || err?.status;
  const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.detail;

  if (status) {
    out.status = status;
    out.detail = detail;
    out.message = typeof detail === 'string' ? detail : (err?.message || out.message);
    return out;
  }

  if (typeof err?.message === 'string') {
    out.message = err.message;
    return out;
  }

  if (typeof err === 'string') {
    out.message = err;
    return out;
  }

  return out;
}

export function SubscriptionProvider({ children }) {
  const { token, isAuthenticated, logout } = useAuth();

  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [tier, setTier] = useState('free');
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  const tokenRef    = useRef(token);
  const authRef     = useRef(isAuthenticated);
  const logoutRef   = useRef(logout);
  const isMountedRef = useRef(true);

  const inFlightRef       = useRef(false);
  const fetchAttemptsRef  = useRef(0);
  const maxFetchAttempts  = 30;

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    tokenRef.current  = token;
    authRef.current   = isAuthenticated;
    logoutRef.current = logout;
  }, [token, isAuthenticated, logout]);

  const debugLog = useCallback((...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[SubscriptionContext]', ...args);
    }
  }, []);

  const getApiBase = useCallback(() => {
    return (currentApiBaseFn() || process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
  }, []);

  const buildStatusUrl = useCallback((forceSync) => {
    const base = getApiBase();
    const sync = forceSync ? '1' : '0';
    return `${base}/subscription_status?sync=${sync}&_t=${Date.now()}`;
  }, [getApiBase]);

  /**
   * Refresh subscription status from backend.
   * @param {boolean} forceSync - When true, syncs from Stripe (slower).
   *   Only pass true for deliberate user actions (e.g. manual refresh button).
   *   Automated triggers (focus, visibility, polling) should pass false.
   */
  const refreshSubscriptionStatus = useCallback(async (forceSync = false) => {
    const t     = tokenRef.current;
    const authed = authRef.current;

    if (!t || !authed) {
      if (isMountedRef.current) {
        setSubscriptionStatus(null);
        setTier('free');
        setIsLoading(false);
      }
      return;
    }

    if (inFlightRef.current) {
      debugLog('⏳ Fetch already in progress, skipping...');
      return;
    }

    if (fetchAttemptsRef.current >= maxFetchAttempts) {
      console.warn('⚠️ Max subscription fetch attempts reached. Polling paused.');
      if (isMountedRef.current) setIsLoading(false);
      return;
    }

    inFlightRef.current = true;
    fetchAttemptsRef.current += 1;

    try {
      const url = buildStatusUrl(forceSync);
      debugLog('📡 Fetching subscription status...', { forceSync, attempt: fetchAttemptsRef.current });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!isMountedRef.current) return;

      if (res.status === 401) {
        console.log('🔒 Subscription fetch: Unauthorized, logging out...');
        try { logoutRef.current?.(); } catch (e) { console.error('❌ Logout failed:', e); }
        setSubscriptionStatus(null);
        setTier('free');
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const err = normalizeSubscriptionError({
          status: res.status,
          detail: errorData.detail || errorData.message
        });
        console.error('❌ Failed to fetch subscription status:', err.message);
        if (isMountedRef.current) setIsLoading(false);
        return;
      }

      const data = await res.json();

      if (!forceSync && isResetOverdue(data?.next_reset)) {
        debugLog('🔄 Usage reset overdue, forcing sync...');
        inFlightRef.current = false;
        await refreshSubscriptionStatus(true);
        return;
      }

      const newTier = safeLower(data?.tier, 'free');

      if (isMountedRef.current) {
        setSubscriptionStatus(data);
        setTier(newTier);
        setLastFetch(Date.now());
        setIsLoading(false);
      }

      debugLog('✅ Subscription status updated:', {
        tier: newTier,
        usage: data?.usage,
        limits: data?.limits,
      });

      fetchAttemptsRef.current = 0;
    } catch (e) {
      if (e.name === 'AbortError') {
        console.warn('⏱️ Subscription fetch timed out');
      } else {
        const err = normalizeSubscriptionError(e);
        console.error('❌ Subscription fetch error:', err.message);
      }
      if (isMountedRef.current) setIsLoading(false);
    } finally {
      inFlightRef.current = false;
    }
  }, [buildStatusUrl, debugLog]);

  // ── Initial fetch on auth change (fast DB read, no Stripe) ──────────────────
  useEffect(() => {
    if (isAuthenticated && token) {
      debugLog('🔄 Auth changed, fetching subscription (sync=false)...');
      fetchAttemptsRef.current = 0;
      refreshSubscriptionStatus(false);
    } else {
      if (isMountedRef.current) {
        setSubscriptionStatus(null);
        setTier('free');
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  // ── Background polling every 60 seconds (fast DB read, no Stripe) ───────────
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const interval = setInterval(() => {
      if (fetchAttemptsRef.current < maxFetchAttempts) {
        refreshSubscriptionStatus(false);
      }
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  // ── ✅ FIX: focus/visibilitychange listeners REMOVED from this context. ──────
  //
  // These listeners now live ONLY in DashboardPage.js, which:
  //   • Has a proper 5-second debounce
  //   • Explicitly passes forceSync=false so tab switching never hits Stripe
  //   • Keeps Stripe calls exclusively behind the manual "Refresh Usage" button
  //
  // Having listeners in both places caused every tab switch to fire TWO calls,
  // one of which always used forceSync=true (the default), flooding Stripe.

  const startCheckout = useCallback(async (planType) => {
    const t     = tokenRef.current;
    const authed = authRef.current;

    if (!t || !authed) throw new Error('Authentication required');

    const base = getApiBase();
    debugLog('💳 Starting checkout for plan:', planType);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${base}/billing/create_checkout_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({ plan: planType }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 401) {
        try { logoutRef.current?.(); } catch {}
        throw new Error('Session expired. Please log in again.');
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.url) {
        const err = normalizeSubscriptionError({
          status: res.status,
          detail: data?.detail || data?.message
        });
        throw new Error(err.detail || err.message || 'Checkout setup failed');
      }

      fetchAttemptsRef.current = 0;
      debugLog('✅ Redirecting to checkout:', data.url);
      window.location.href = data.url;
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new Error('Checkout request timed out. Please try again.');
      }
      throw e;
    }
  }, [getApiBase, debugLog]);

  const formatUsage = useCallback((actionType) => {
    const used  = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
    const limit = subscriptionStatus?.limits?.[actionType];
    if (limit === 'unlimited' || limit === Infinity || limit === '∞' || limit === 999999999) {
      return `${used.toLocaleString()} / ∞`;
    }
    const numericLimit = Number(limit);
    return `${used.toLocaleString()} / ${Number.isFinite(numericLimit) ? numericLimit.toLocaleString() : 0}`;
  }, [subscriptionStatus]);

  const canPerformAction = useCallback((actionType) => {
    const used  = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
    const limit = subscriptionStatus?.limits?.[actionType];
    if (limit === 'unlimited' || limit === Infinity || limit === '∞' || limit === 999999999) return true;
    const numericLimit = Number(limit);
    return used < numericLimit;
  }, [subscriptionStatus]);

  const getUsagePercentage = useCallback((actionType) => {
    const used  = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
    const limit = subscriptionStatus?.limits?.[actionType];
    if (limit === 'unlimited' || limit === Infinity || limit === '∞' || limit === 999999999) return 0;
    const numericLimit = Number(limit);
    if (!Number.isFinite(numericLimit) || numericLimit === 0) return 0;
    return Math.min(Math.round((used / numericLimit) * 100), 100);
  }, [subscriptionStatus]);

  const value = useMemo(
    () => ({
      subscriptionStatus,
      tier,
      isLoading,
      lastFetch,
      refreshSubscriptionStatus,
      startCheckout,
      formatUsage,
      canPerformAction,
      getUsagePercentage,
    }),
    [
      subscriptionStatus,
      tier,
      isLoading,
      lastFetch,
      refreshSubscriptionStatus,
      startCheckout,
      formatUsage,
      canPerformAction,
      getUsagePercentage,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return ctx;
}

