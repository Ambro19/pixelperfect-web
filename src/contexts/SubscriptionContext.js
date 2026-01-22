// ========================================
// SUBSCRIPTION CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/SubscriptionContext.js
// Author: OneTechly
// Updated: January 2026 - Production-ready
//
// Fixes:
// 1) Unified with AuthContext patterns (useMemo, error handling)
// 2) Improved polling with max attempts and backoff
// 3) Stable refs to prevent stale closures
// 4) Better error messages and logging
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

/**
 * Safely convert string to lowercase with fallback
 */
function safeLower(x, fallback = 'free') {
  return (typeof x === 'string' && x.trim() ? x.trim().toLowerCase() : fallback);
}

/**
 * Check if usage reset is overdue based on next_reset timestamp
 */
function isResetOverdue(nextResetIso) {
  if (!nextResetIso) return false;
  const d = new Date(nextResetIso);
  if (Number.isNaN(d.getTime())) return false;
  return Date.now() >= d.getTime();
}

/**
 * Normalize subscription fetch errors
 */
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

  // Stable refs to prevent stale closures
  const tokenRef = useRef(token);
  const authRef = useRef(isAuthenticated);
  const logoutRef = useRef(logout);
  const isMountedRef = useRef(true);

  // Fetch control refs
  const inFlightRef = useRef(false);
  const fetchAttemptsRef = useRef(0);
  const maxFetchAttempts = 30;

  // Initialize and cleanup mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Keep refs in sync with latest values
  useEffect(() => {
    tokenRef.current = token;
    authRef.current = isAuthenticated;
    logoutRef.current = logout;
  }, [token, isAuthenticated, logout]);

  /**
   * Debug logging (development only)
   */
  const debugLog = useCallback((...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[SubscriptionContext]', ...args);
    }
  }, []);

  /**
   * Get API base URL with fallback
   */
  const getApiBase = useCallback(() => {
    return (currentApiBaseFn() || process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
  }, []);

  /**
   * Build subscription status URL with sync flag
   */
  const buildStatusUrl = useCallback((forceSync) => {
    const base = getApiBase();
    const sync = forceSync ? '1' : '0';
    return `${base}/subscription_status?sync=${sync}&_t=${Date.now()}`;
  }, [getApiBase]);

  /**
   * Refresh subscription status from backend
   * @param {boolean} forceSync - Force Stripe sync (slower but accurate)
   */
  const refreshSubscriptionStatus = useCallback(async (forceSync = true) => {
    const t = tokenRef.current;
    const authed = authRef.current;

    // Not authenticated - reset to free tier
    if (!t || !authed) {
      if (isMountedRef.current) {
        setSubscriptionStatus(null);
        setTier('free');
        setIsLoading(false);
      }
      return;
    }

    // Prevent duplicate concurrent fetches
    if (inFlightRef.current) {
      debugLog('⏳ Fetch already in progress, skipping...');
      return;
    }

    // Prevent infinite polling if backend is down
    if (fetchAttemptsRef.current >= maxFetchAttempts) {
      console.warn('⚠️ Max subscription fetch attempts reached. Polling paused.');
      if (isMountedRef.current) {
        setIsLoading(false);
      }
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

      // Handle 401 - token expired
      if (res.status === 401) {
        console.log('🔒 Subscription fetch: Unauthorized, logging out...');
        try {
          logoutRef.current?.();
        } catch (e) {
          console.error('❌ Logout failed:', e);
        }
        setSubscriptionStatus(null);
        setTier('free');
        setIsLoading(false);
        return;
      }

      // Handle other errors
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const err = normalizeSubscriptionError({ 
          status: res.status, 
          detail: errorData.detail || errorData.message 
        });
        console.error('❌ Failed to fetch subscription status:', err.message);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        return;
      }

      const data = await res.json();

      // Auto-sync if usage reset is overdue
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

      // Reset attempt counter on success
      fetchAttemptsRef.current = 0;
    } catch (e) {
      if (e.name === 'AbortError') {
        console.warn('⏱️ Subscription fetch timed out');
      } else {
        const err = normalizeSubscriptionError(e);
        console.error('❌ Subscription fetch error:', err.message);
      }

      if (isMountedRef.current) {
        setIsLoading(false);
      }
    } finally {
      inFlightRef.current = false;
    }
  }, [buildStatusUrl, debugLog]);

  /**
   * Initial fetch when authentication changes
   */
  useEffect(() => {
    if (isAuthenticated && token) {
      debugLog('🔄 Auth changed, fetching subscription...');
      fetchAttemptsRef.current = 0;
      refreshSubscriptionStatus(true);
    } else {
      if (isMountedRef.current) {
        setSubscriptionStatus(null);
        setTier('free');
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, token, refreshSubscriptionStatus, debugLog]);

  /**
   * Background polling every 60 seconds
   */
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const interval = setInterval(() => {
      if (fetchAttemptsRef.current < maxFetchAttempts) {
        refreshSubscriptionStatus(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, token, refreshSubscriptionStatus]);

  /**
   * Refresh on window focus and tab visibility
   */
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const onFocus = () => {
      debugLog('👁️ Window focused, refreshing subscription...');
      refreshSubscriptionStatus(false);
    };
    
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        debugLog('👁️ Tab visible, refreshing subscription...');
        refreshSubscriptionStatus(false);
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [isAuthenticated, token, refreshSubscriptionStatus, debugLog]);

  /**
   * Start Stripe checkout for a plan
   * @param {string} planType - Plan tier (pro, business, premium)
   */
  const startCheckout = useCallback(async (planType) => {
    const t = tokenRef.current;
    const authed = authRef.current;

    if (!t || !authed) {
      throw new Error('Authentication required');
    }

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

      // Handle 401 - session expired
      if (res.status === 401) {
        try {
          logoutRef.current?.();
        } catch {}
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

      // Reset fetch attempts for fresh subscription data after checkout
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

  /**
   * Format usage display (e.g., "150 / 5000" or "42 / ∞")
   * @param {string} actionType - Usage type to format
   */
  const formatUsage = useCallback((actionType) => {
    const used = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
    const limit = subscriptionStatus?.limits?.[actionType];

    if (limit === 'unlimited' || limit === Infinity || limit === '∞' || limit === 999999999) {
      return `${used.toLocaleString()} / ∞`;
    }

    const numericLimit = Number(limit);
    return `${used.toLocaleString()} / ${Number.isFinite(numericLimit) ? numericLimit.toLocaleString() : 0}`;
  }, [subscriptionStatus]);

  /**
   * Check if user can perform an action based on usage limits
   * @param {string} actionType - Action to check
   */
  const canPerformAction = useCallback((actionType) => {
    const used = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
    const limit = subscriptionStatus?.limits?.[actionType];

    if (limit === 'unlimited' || limit === Infinity || limit === '∞' || limit === 999999999) {
      return true;
    }

    const numericLimit = Number(limit);
    return used < numericLimit;
  }, [subscriptionStatus]);

  /**
   * Get percentage of limit used
   * @param {string} actionType - Action type
   */
  const getUsagePercentage = useCallback((actionType) => {
    const used = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
    const limit = subscriptionStatus?.limits?.[actionType];

    if (limit === 'unlimited' || limit === Infinity || limit === '∞' || limit === 999999999) {
      return 0;
    }

    const numericLimit = Number(limit);
    if (!Number.isFinite(numericLimit) || numericLimit === 0) return 0;

    return Math.min(Math.round((used / numericLimit) * 100), 100);
  }, [subscriptionStatus]);

  // Memoize context value to prevent unnecessary re-renders
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


////////////////////////////////////////////////////////////////////////////////
// // ========================================
// // SUBSCRIPTION CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/SubscriptionContext.js
// // Author: OneTechly
// // Updated: January 2026

// import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
// import { useAuth } from './AuthContext';
// import { currentApiBase as currentApiBaseFn } from '../lib/api';

// const SubscriptionContext = createContext(null);

// function safeLower(x, fallback = 'free') {
//   return (typeof x === 'string' && x.trim() ? x.trim().toLowerCase() : fallback);
// }

// function isResetOverdue(nextResetIso) {
//   if (!nextResetIso) return false;
//   const d = new Date(nextResetIso);
//   if (Number.isNaN(d.getTime())) return false;
//   return Date.now() >= d.getTime();
// }

// export function SubscriptionProvider({ children }) {
//   const { token, isAuthenticated, logout } = useAuth();

//   const [subscriptionStatus, setSubscriptionStatus] = useState(null);
//   const [tier, setTier] = useState('free');
//   const [isLoading, setIsLoading] = useState(true);
//   const [lastFetch, setLastFetch] = useState(null);

//   const tokenRef = useRef(token);
//   const authRef = useRef(isAuthenticated);
//   const logoutRef = useRef(logout);
//   const isMountedRef = useRef(true);

//   useEffect(() => {
//     isMountedRef.current = true;
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   useEffect(() => {
//     tokenRef.current = token;
//     authRef.current = isAuthenticated;
//     logoutRef.current = logout;
//   }, [token, isAuthenticated, logout]);

//   const inFlightRef = useRef(false);
//   const fetchAttemptsRef = useRef(0);
//   const maxFetchAttempts = 30;

//   const debugLog = useCallback((...args) => {
//     if (process.env.NODE_ENV !== 'production') {
//       console.log(...args);
//     }
//   }, []);

//   const getApiBase = useCallback(() => {
//     return (currentApiBaseFn() || process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
//   }, []);

//   const buildStatusUrl = useCallback((forceSync) => {
//     const base = getApiBase();
//     const sync = forceSync ? '1' : '0';
//     return `${base}/subscription_status?sync=${sync}&_t=${Date.now()}`;
//   }, [getApiBase]);

//   const refreshSubscriptionStatus = useCallback(async (forceSync = true) => {
//     const t = tokenRef.current;
//     const authed = authRef.current;

//     if (!t || !authed) {
//       if (isMountedRef.current) {
//         setSubscriptionStatus(null);
//         setTier('free');
//         setIsLoading(false);
//       }
//       return;
//     }

//     if (inFlightRef.current) {
//       debugLog('⏳ Subscription fetch already in progress, skipping...');
//       return;
//     }

//     if (fetchAttemptsRef.current >= maxFetchAttempts) {
//       console.warn('⚠️ Max subscription fetch attempts reached. Polling paused.');
//       if (isMountedRef.current) {
//         setIsLoading(false);
//       }
//       return;
//     }

//     inFlightRef.current = true;
//     fetchAttemptsRef.current += 1;

//     try {
//       const url = buildStatusUrl(forceSync);
//       debugLog('📡 Fetching subscription status...', { forceSync });
      
//       const res = await fetch(url, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${t}`,
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store',
//         signal: AbortSignal.timeout(10000),
//       });

//       if (!isMountedRef.current) return;

//       if (res.status === 401) {
//         console.log('🔒 Subscription fetch: Unauthorized, logging out...');
//         try {
//           logoutRef.current?.();
//         } catch (e) {
//           console.error('Logout failed:', e);
//         }
//         setSubscriptionStatus(null);
//         setTier('free');
//         return;
//       }

//       if (!res.ok) {
//         console.error('❌ Failed to fetch subscription status:', res.status);
//         return;
//       }

//       const data = await res.json();

//       if (!forceSync && isResetOverdue(data?.next_reset)) {
//         debugLog('🔄 Usage reset overdue, forcing sync...');
//         inFlightRef.current = false;
//         await refreshSubscriptionStatus(true);
//         return;
//       }

//       const newTier = safeLower(data?.tier, 'free');

//       if (isMountedRef.current) {
//         setSubscriptionStatus(data);
//         setTier(newTier);
//         setLastFetch(Date.now());
//         setIsLoading(false);
//       }

//       debugLog('✅ Subscription status updated:', {
//         tier: newTier,
//         usage: data?.usage,
//         limits: data?.limits,
//       });

//       fetchAttemptsRef.current = 0;
//     } catch (e) {
//       if (e.name === 'AbortError') {
//         console.warn('⏱️ Subscription fetch timed out');
//       } else {
//         console.error('❌ Subscription fetch error:', e);
//       }
//     } finally {
//       inFlightRef.current = false;
//       if (isMountedRef.current) {
//         setIsLoading(false);
//       }
//     }
//   }, [buildStatusUrl, debugLog]);

//   useEffect(() => {
//     if (isAuthenticated && token) {
//       debugLog('🔄 Auth changed, fetching subscription...');
//       fetchAttemptsRef.current = 0;
//       refreshSubscriptionStatus(true);
//     } else {
//       if (isMountedRef.current) {
//         setSubscriptionStatus(null);
//         setTier('free');
//         setIsLoading(false);
//       }
//     }
//   }, [isAuthenticated, token, refreshSubscriptionStatus]);

//   useEffect(() => {
//     if (!isAuthenticated || !token) return;

//     const interval = setInterval(() => {
//       if (fetchAttemptsRef.current < maxFetchAttempts) {
//         refreshSubscriptionStatus(false);
//       }
//     }, 60000);

//     return () => clearInterval(interval);
//   }, [isAuthenticated, token, refreshSubscriptionStatus]);

//   useEffect(() => {
//     if (!isAuthenticated || !token) return;

//     const onFocus = () => {
//       debugLog('👁️ Window focused, refreshing subscription...');
//       refreshSubscriptionStatus(false);
//     };
    
//     const onVis = () => {
//       if (document.visibilityState === 'visible') {
//         debugLog('👁️ Tab visible, refreshing subscription...');
//         refreshSubscriptionStatus(false);
//       }
//     };

//     window.addEventListener('focus', onFocus);
//     document.addEventListener('visibilitychange', onVis);

//     return () => {
//       window.removeEventListener('focus', onFocus);
//       document.removeEventListener('visibilitychange', onVis);
//     };
//   }, [isAuthenticated, token, refreshSubscriptionStatus]);

//   const startCheckout = useCallback(async (planType) => {
//     const t = tokenRef.current;
//     const authed = authRef.current;

//     if (!t || !authed) throw new Error('Authentication required');

//     const base = getApiBase();
//     debugLog('💳 Starting checkout for plan:', planType);
    
//     const res = await fetch(`${base}/billing/create_checkout_session`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${t}`,
//       },
//       body: JSON.stringify({ plan: planType }),
//     });

//     if (res.status === 401) {
//       try {
//         logoutRef.current?.();
//       } catch {}
//       throw new Error('Session expired. Please log in again.');
//     }

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok || !data?.url) {
//       throw new Error(data?.detail || 'Checkout setup failed');
//     }

//     fetchAttemptsRef.current = 0;
//     debugLog('✅ Redirecting to checkout:', data.url);
//     window.location.href = data.url;
//   }, [getApiBase, debugLog]);

//   const formatUsage = useCallback((actionType) => {
//     const used = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
//     const limit = subscriptionStatus?.limits?.[actionType];

//     if (limit === 'unlimited' || limit === Infinity || limit === '∞') {
//       return `${used} / ∞`;
//     }

//     const numericLimit = Number(limit);
//     return `${used} / ${Number.isFinite(numericLimit) ? numericLimit : 0}`;
//   }, [subscriptionStatus]);

//   const value = {
//     subscriptionStatus,
//     tier,
//     isLoading,
//     refreshSubscriptionStatus,
//     startCheckout,
//     lastFetch,
//     formatUsage,
//   };

//   return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
// }

// export function useSubscription() {
//   const ctx = useContext(SubscriptionContext);
//   if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
//   return ctx;
// }


