// ========================================
// SUBSCRIPTION CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/SubscriptionContext.js
// Author: OneTechly
// Purpose: Subscription management context with tier handling
// Updated: January 2026 - Production-ready with enhancements

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

export function SubscriptionProvider({ children }) {
  const { token, isAuthenticated, logout } = useAuth();

  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [tier, setTier] = useState('free');
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  // ✅ Use refs to avoid stale closures
  const tokenRef = useRef(token);
  const authRef = useRef(isAuthenticated);
  const logoutRef = useRef(logout);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    tokenRef.current = token;
    authRef.current = isAuthenticated;
    logoutRef.current = logout;
  }, [token, isAuthenticated, logout]);

  const inFlightRef = useRef(false);
  const fetchAttemptsRef = useRef(0);
  const maxFetchAttempts = 30;

  const debugLog = useCallback((...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
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

  const refreshSubscriptionStatus = useCallback(async (forceSync = true) => {
    const t = tokenRef.current;
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
      debugLog('⏳ Subscription fetch already in progress, skipping...');
      return;
    }

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
      debugLog('📡 Fetching subscription status...', { forceSync });
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!isMountedRef.current) return;

      if (res.status === 401) {
        console.log('🔒 Subscription fetch: Unauthorized, logging out...');
        try {
          logoutRef.current?.();
        } catch (e) {
          console.error('Logout failed:', e);
        }
        setSubscriptionStatus(null);
        setTier('free');
        return;
      }

      if (!res.ok) {
        console.error('❌ Failed to fetch subscription status:', res.status);
        return;
      }

      const data = await res.json();

      // If overdue and not forcing sync, force a sync
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
        console.error('❌ Subscription fetch error:', e);
      }
    } finally {
      inFlightRef.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [buildStatusUrl, debugLog]);

  // ✅ Initial fetch on auth change
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
  }, [isAuthenticated, token, refreshSubscriptionStatus]);

  // ✅ Periodic polling (1 minute)
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const interval = setInterval(() => {
      if (fetchAttemptsRef.current < maxFetchAttempts) {
        refreshSubscriptionStatus(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, token, refreshSubscriptionStatus]);

  // ✅ Refresh on window focus/visibility
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
  }, [isAuthenticated, token, refreshSubscriptionStatus]);

  const startCheckout = useCallback(async (planType) => {
    const t = tokenRef.current;
    const authed = authRef.current;

    if (!t || !authed) throw new Error('Authentication required');

    const base = getApiBase();
    debugLog('💳 Starting checkout for plan:', planType);
    
    const res = await fetch(`${base}/billing/create_checkout_session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({ plan: planType }),
    });

    if (res.status === 401) {
      try {
        logoutRef.current?.();
      } catch {}
      throw new Error('Session expired. Please log in again.');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.url) {
      throw new Error(data?.detail || 'Checkout setup failed');
    }

    fetchAttemptsRef.current = 0;
    debugLog('✅ Redirecting to checkout:', data.url);
    window.location.href = data.url;
  }, [getApiBase, debugLog]);

  const formatUsage = useCallback((actionType) => {
    const used = Number(subscriptionStatus?.usage?.[actionType] ?? 0);
    const limit = subscriptionStatus?.limits?.[actionType];

    if (limit === 'unlimited' || limit === Infinity || limit === '∞') {
      return `${used} / ∞`;
    }

    const numericLimit = Number(limit);
    return `${used} / ${Number.isFinite(numericLimit) ? numericLimit : 0}`;
  }, [subscriptionStatus]);

  const value = {
    subscriptionStatus,
    tier,
    isLoading,
    refreshSubscriptionStatus,
    startCheckout,
    lastFetch,
    formatUsage,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}

//===========================================================
// // ========================================
// // SUBSCRIPTION CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/SubscriptionContext.js
// // Author: OneTechly
// // Purpose: Subscription management context with tier handling
// // Updated: January 2026 - Production-ready for PixelPerfect
// //
// // Small improvement:
// // - Use currentApiBase() resolver so API base stays consistent across the app

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
//       // eslint-disable-next-line no-console
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
//       setSubscriptionStatus(null);
//       setTier('free');
//       setIsLoading(false);
//       return;
//     }

//     if (inFlightRef.current) return;

//     if (fetchAttemptsRef.current >= maxFetchAttempts) {
//       // eslint-disable-next-line no-console
//       console.warn('⚠️ Max subscription fetch attempts reached. Polling paused.');
//       setIsLoading(false);
//       return;
//     }

//     inFlightRef.current = true;
//     fetchAttemptsRef.current += 1;

//     try {
//       const url = buildStatusUrl(forceSync);
//       const res = await fetch(url, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${t}`,
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store',
//       });

//       if (res.status === 401) {
//         try {
//           logoutRef.current?.();
//         } catch {}
//         setSubscriptionStatus(null);
//         setTier('free');
//         return;
//       }

//       if (!res.ok) {
//         // eslint-disable-next-line no-console
//         console.error('❌ Failed to fetch subscription status:', res.status);
//         return;
//       }

//       const data = await res.json();

//       if (!forceSync && isResetOverdue(data?.next_reset)) {
//         inFlightRef.current = false;
//         await refreshSubscriptionStatus(true);
//         return;
//       }

//       const newTier = safeLower(data?.tier, 'free');

//       setSubscriptionStatus(data);
//       setTier(newTier);
//       setLastFetch(Date.now());
//       setIsLoading(false);

//       debugLog('🔍 Subscription status updated:', {
//         tier: newTier,
//         usage: data?.usage,
//         limits: data?.limits,
//         next_reset: data?.next_reset,
//       });

//       fetchAttemptsRef.current = 0;
//     } catch (e) {
//       // eslint-disable-next-line no-console
//       console.error('❌ Subscription fetch error:', e);
//     } finally {
//       inFlightRef.current = false;
//       setIsLoading(false);
//     }
//   }, [buildStatusUrl, debugLog]);

//   useEffect(() => {
//     if (isAuthenticated && token) {
//       fetchAttemptsRef.current = 0;
//       refreshSubscriptionStatus(true);
//     } else {
//       setSubscriptionStatus(null);
//       setTier('free');
//       setIsLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated, token]);

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

//     const onFocus = () => refreshSubscriptionStatus(false);
//     const onVis = () => {
//       if (document.visibilityState === 'visible') refreshSubscriptionStatus(false);
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
//     if (!res.ok || !data?.url) throw new Error(data?.detail || 'Checkout setup failed');

//     fetchAttemptsRef.current = 0;
//     window.location.href = data.url;
//   }, [getApiBase]);

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

