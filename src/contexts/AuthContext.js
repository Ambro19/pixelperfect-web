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

// // ===========================================================================
// // ========================================
// // AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/AuthContext.js
// // Author: OneTechly
// // Purpose: Authentication context provider with token management
// // Updated: January 2026 - PRODUCTION READY (Fixed infinite loop)

// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import toast from "react-hot-toast";
// import {
//   api,
//   apiGetJson,
//   apiPostJson,
//   wakeApi,
//   currentApiBase as currentApiBaseFn,
// } from "../lib/api";

// const AuthContext = createContext(null);

// const TOKEN_KEY = "auth_token";
// const USER_KEY = "auth_user";

// // Frontend guardrails (optional, matches .env we added)
// const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

// function safeJsonParse(str, fallback = null) {
//   try {
//     return JSON.parse(str);
//   } catch {
//     return fallback;
//   }
// }

// /**
//  * Normalize errors coming from:
//  * - axios (error.response / error.request)
//  * - fetch wrappers (Error with .status / .data)
//  * - custom api libs
//  */
// function normalizeApiError(err) {
//   const out = {
//     status: undefined,
//     detail: undefined,
//     message: "Request failed",
//     raw: err,
//   };

//   if (!err) return out;

//   // Axios-style
//   const axiosStatus = err?.response?.status;
//   const axiosDetail = err?.response?.data?.detail ?? err?.response?.data?.message;
//   if (axiosStatus) {
//     out.status = axiosStatus;
//     out.detail = axiosDetail;
//     out.message = typeof axiosDetail === "string" ? axiosDetail : (err.message || out.message);
//     return out;
//   }

//   // Fetch-like "Response" accidentally thrown/passed
//   if (typeof err?.status === "number") {
//     out.status = err.status;
//     const d = err?.detail ?? err?.data?.detail ?? err?.message;
//     out.detail = d;
//     out.message = typeof d === "string" ? d : (err.message || out.message);
//     return out;
//   }

//   // Plain error
//   if (typeof err?.message === "string") {
//     out.message = err.message;
//     return out;
//   }

//   // String
//   if (typeof err === "string") {
//     out.message = err;
//     return out;
//   }

//   return out;
// }

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState("");
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [apiStatus, setApiStatus] = useState("checking");
  
//   // ✅ Use ref to prevent re-initialization
//   const isInitialized = useRef(false);

//   const isAuthenticated = !!token;

//   // ✅ Stable function - no dependencies
//   const applyToken = useCallback((tok) => {
//     try {
//       if (tok) {
//         api.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
//         localStorage.setItem(TOKEN_KEY, tok);
//       } else {
//         delete api.defaults.headers.common["Authorization"];
//         localStorage.removeItem(TOKEN_KEY);
//       }
//     } catch {
//       /* ignore storage errors */
//     }
//   }, []); // ✅ Empty deps - stable

//   // ✅ Stable function - only depends on applyToken
//   const clearAuth = useCallback(() => {
//     setToken("");
//     setUser(null);
//     applyToken("");
//     try {
//       localStorage.removeItem(USER_KEY);
//     } catch {
//       /* ignore */
//     }
//   }, [applyToken]); // ✅ Only depends on stable applyToken

//   // ✅ Check API connectivity - stable function
//   const checkApiHealth = useCallback(async () => {
//     try {
//       const base = currentApiBaseFn().replace(/\/+$/, "");
//       console.log("🔍 Checking API health at:", `${base}/health`);
//       const response = await fetch(`${base}/health`, { cache: "no-store" });
//       console.log("📡 Health check response:", response.status, response.ok);
//       if (response.ok) {
//         setApiStatus("healthy");
//         return true;
//       }
//       setApiStatus("unhealthy");
//       return false;
//     } catch (error) {
//       console.error("❌ API health check failed:", error);
//       setApiStatus("offline");
//       return false;
//     }
//   }, []); // ✅ Empty deps - stable

//   // ✅ Boot: load token+user from storage - RUNS ONCE ONLY
//   useEffect(() => {
//     // ✅ Prevent double initialization in React StrictMode
//     if (isInitialized.current) return;
//     isInitialized.current = true;

//     const initializeAuth = async () => {
//       console.log("🚀 Initializing auth...");
      
//       const savedToken = localStorage.getItem(TOKEN_KEY) || "";
//       const savedUserRaw = localStorage.getItem(USER_KEY);

//       // Always attempt health check, but don't block UI forever on it
//       await checkApiHealth();

//       if (savedToken) {
//         setToken(savedToken);
//         applyToken(savedToken);

//         // Verify token is still valid
//         try {
//           console.log("🔍 Validating saved token...");
//           const me = await apiGetJson("/users/me");
//           if (me) {
//             console.log("✅ Token valid, user loaded:", me);
//             setUser(me);
//             try {
//               localStorage.setItem(USER_KEY, JSON.stringify(me));
//             } catch {
//               /* ignore storage errors */
//             }
//           } else {
//             console.log("⚠️ Token validation returned no user");
//             clearAuth();
//           }
//         } catch (e) {
//           console.error("❌ Token validation failed:", e);
//           clearAuth();
//         }
//       } else {
//         console.log("ℹ️ No saved token found");
//         // No token -> do NOT treat saved user as authenticated.
//         if (savedUserRaw) {
//           const parsed = safeJsonParse(savedUserRaw, null);
//           if (parsed && typeof parsed === "object") {
//             setUser(parsed);
//           } else {
//             try {
//               localStorage.removeItem(USER_KEY);
//             } catch {}
//           }
//         }
//       }

//       console.log("✅ Auth initialization complete");
//       setIsLoading(false);
//     };

//     initializeAuth();
//   }, []); // ✅ EMPTY DEPS - runs once on mount only

//   // ========================================
//   // ✅ REGISTER FUNCTION - NEW USER REGISTRATION
//   // ========================================
//   const register = useCallback(
//     async (username, email, password) => {
//       console.log("🔵 Register called with:", { username, email });
//       console.log("🌐 API Base URL:", currentApiBaseFn());

//       const u = (username || "").trim();
//       const e = (email || "").trim().toLowerCase();
//       const p = (password || "");

//       if (!u || !e || !p) {
//         throw new Error("Please fill in all fields");
//       }

//       // Guard against accidental huge pastes
//       if (p.length > PASSWORD_MAX_LEN) {
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
//       }

//       if (p.length < 8) {
//         throw new Error("Password must be at least 8 characters");
//       }

//       const body = { username: u, email: e, password: p };

//       try {
//         console.log("📡 Sending registration request to /register");
//         const res = await apiPostJson("/register", body);
//         console.log("✅ Registration response:", res);

//         // If registration returns a token, auto-login
//         if (res?.access_token) {
//           applyToken(res.access_token);
//           setToken(res.access_token);

//           // Try to fetch user profile
//           try {
//             const me = await apiGetJson("/users/me");
//             if (me) {
//               setUser(me);
//               try {
//                 localStorage.setItem(USER_KEY, JSON.stringify(me));
//               } catch {
//                 /* ignore */
//               }
//             } else if (res.account || res.user) {
//               const userData = res.account || res.user;
//               setUser(userData);
//               try {
//                 localStorage.setItem(USER_KEY, JSON.stringify(userData));
//               } catch {}
//             }
//           } catch (e) {
//             console.error("Failed to fetch /users/me after registration:", e);
//             if (res.account || res.user) {
//               const userData = res.account || res.user;
//               setUser(userData);
//               try {
//                 localStorage.setItem(USER_KEY, JSON.stringify(userData));
//               } catch {}
//             }
//           }
//         }

//         return res;
//       } catch (err) {
//         console.error("❌ Registration error:", err);
//         // Ensure we don't leave half-auth state
//         clearAuth();

//         const n = normalizeApiError(err);
//         const status = n.status;

//         // Prefer backend "detail" string when present
//         const detail = typeof n.detail === "string" ? n.detail : undefined;

//         if (status === 400) {
//           // Backend returns 400 for duplicate username/email
//           throw new Error(detail || "Username or email already exists");
//         }
//         if (status === 422) throw new Error(detail || "Invalid input data");
//         if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (status >= 500) throw new Error("Server error. Please try again later.");

//         // Network / connectivity
//         if (
//           n.message?.toLowerCase().includes("network") ||
//           n.message?.toLowerCase().includes("connect") ||
//           n.message?.toLowerCase().includes("failed to fetch")
//         ) {
//           throw new Error("Cannot connect to server. Please check your connection.");
//         }

//         throw new Error(detail || n.message || "Registration failed");
//       }
//     },
//     [applyToken, clearAuth]
//   );

//   // ========================================
//   // LOGIN FUNCTION (ROBUST)
//   // ========================================
//   const login = useCallback(
//     async (username, password) => {
//       console.log("🔵 Login called with username:", username);
//       console.log("🌐 API Base URL:", currentApiBaseFn());

//       const u = (username || "").trim();
//       const p = (password || "");

//       if (!u || !p) {
//         throw new Error("Please enter both username and password");
//       }

//       // Guard against accidental huge pastes
//       if (p.length > PASSWORD_MAX_LEN) {
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
//       }

//       // PixelPerfect backend uses /token_json
//       const body = { username: u, password: p };

//       try {
//         console.log("📡 Sending login request to /token_json");
//         const res = await apiPostJson("/token_json", body);
//         console.log("✅ Login response:", res);

//         if (!res?.access_token) {
//           throw new Error("Invalid login response from server");
//         }

//         // Set token first
//         applyToken(res.access_token);
//         setToken(res.access_token);

//         // Fetch user profile
//         try {
//           const me = await apiGetJson("/users/me");
//           if (me) {
//             setUser(me);
//             try {
//               localStorage.setItem(USER_KEY, JSON.stringify(me));
//             } catch {
//               /* ignore */
//             }
//           } else if (res.user) {
//             setUser(res.user);
//             try {
//               localStorage.setItem(USER_KEY, JSON.stringify(res.user));
//             } catch {
//               /* ignore */
//             }
//           }
//         } catch (e) {
//           // Don't fail login if profile fetch fails — just log it.
//           console.error("Failed to fetch /users/me after login:", e);
//           if (res.user) {
//             setUser(res.user);
//             try {
//               localStorage.setItem(USER_KEY, JSON.stringify(res.user));
//             } catch {}
//           }
//         }

//         return res;
//       } catch (err) {
//         console.error("❌ Login error:", err);
//         // Ensure we don't leave half-auth state
//         clearAuth();

//         const n = normalizeApiError(err);
//         const status = n.status;

//         // Prefer backend "detail" string when present
//         const detail = typeof n.detail === "string" ? n.detail : undefined;

//         if (status === 401) throw new Error("Invalid username or password");
//         if (status === 422) throw new Error(detail || "Invalid input data");
//         if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (status >= 500) throw new Error("Server error. Please try again later.");

//         // Network / connectivity
//         if (
//           n.message?.toLowerCase().includes("network") ||
//           n.message?.toLowerCase().includes("connect") ||
//           n.message?.toLowerCase().includes("failed to fetch")
//         ) {
//           throw new Error("Cannot connect to server. Please check your connection.");
//         }

//         throw new Error(detail || n.message || "Login failed");
//       }
//     },
//     [applyToken, clearAuth]
//   );

//   // ========================================
//   // LOGOUT FUNCTION
//   // ========================================
//   const logout = useCallback(() => {
//     clearAuth();
//     toast.success("Signed out");
//   }, [clearAuth]);

//   // ✅ Wake API and check health periodically - SEPARATE EFFECT
//   useEffect(() => {
//     const initializeApi = async () => {
//       try {
//         await wakeApi();
//         await checkApiHealth();
//       } catch (error) {
//         console.error("API initialization failed:", error);
//       }
//     };

//     initializeApi();

//     // periodic health check every 5 minutes
//     const interval = setInterval(checkApiHealth, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [checkApiHealth]); // ✅ checkApiHealth is now stable

//   const value = useMemo(
//     () => ({
//       token,
//       user,
//       isAuthenticated,
//       isLoading,
//       apiStatus,
//       register,
//       login,
//       logout,
//       setToken,
//       setUser,
//       apiBaseUrl: currentApiBaseFn(),
//       apiFetch: api,
//       checkApiHealth,
//     }),
//     [token, user, isAuthenticated, isLoading, apiStatus, register, login, logout, checkApiHealth]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
//   return ctx;
// }

