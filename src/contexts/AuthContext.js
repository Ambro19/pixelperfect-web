// ========================================
// AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/AuthContext.js
// Author: OneTechly
// Updated: February 2026 - PRODUCTION READY
//
// ✅ FIXES APPLIED:
// - Consistent token storage (auth_token)
// - Firefox compatibility (credentials: 'include')
// - Proper error handling
// - Token validation before redirect
// - localStorage fallback detection
// ========================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ✅ CRITICAL: Consistent token key (matches index.js check)
const TOKEN_KEY = 'auth_token';

// ✅ FIREFOX FIX: Detect if localStorage is available (blocked in private mode)
const isLocalStorageAvailable = () => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('⚠️ localStorage not available (Firefox private mode?), using sessionStorage');
    return false;
  }
};

// ✅ FIREFOX FIX: Use sessionStorage as fallback
const storage = isLocalStorageAvailable() ? localStorage : sessionStorage;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load token from storage on mount
  useEffect(() => {
    console.log('🔐 AuthContext: Initializing...');
    const storedToken = storage.getItem(TOKEN_KEY);
    
    if (storedToken) {
      console.log('✅ Found stored token, verifying...');
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      console.log('ℹ️ No stored token found');
      setIsLoading(false);
    }
  }, []);

  // ✅ Fetch user info with proper error handling
  const fetchUser = useCallback(async (authToken) => {
    console.log('👤 Fetching user info...');
    
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // ✅ CRITICAL for Firefox
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User verified:', userData.username);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token invalid or expired
        console.warn('❌ Token validation failed, clearing auth');
        logout();
      }
    } catch (error) {
      console.error('❌ Failed to fetch user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Login function with proper error handling
  const login = useCallback(async (username, password) => {
    console.log('🔐 Attempting login:', username);
    
    try {
      const response = await fetch(`${API_URL}/token_json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // ✅ CRITICAL for Firefox
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Login failed: ${response.status}`;
        console.error('❌ Login failed:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Login response received');

      // ✅ CRITICAL: Save with consistent key
      storage.setItem(TOKEN_KEY, data.access_token);
      console.log('💾 Token saved to storage');
      
      setToken(data.access_token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      console.log('✅ Login successful:', data.user?.username);
    } catch (error) {
      console.error('❌ Login error:', error);
      // Clear any partial state
      logout();
      throw error;
    }
  }, []);

  // ✅ Register function with auto-login
  const register = useCallback(async (username, email, password) => {
    console.log('📝 Attempting registration:', username);
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // ✅ CRITICAL for Firefox
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Registration failed: ${response.status}`;
        console.error('❌ Registration failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Registration successful, logging in...');
      
      // After successful registration, log in automatically
      await login(username, password);
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }, [login]);

  // ✅ Logout function
  const logout = useCallback(() => {
    console.log('🚪 Logging out...');
    storage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ✅ Helper to get current token
  const getToken = useCallback(() => {
    return token || storage.getItem(TOKEN_KEY);
  }, [token]);

  const value = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;

/////////////////////////////////////////////////////////////////////////////////////
// // ========================================
// // AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/AuthContext.js
// // Author: OneTechly
// // Updated: Feb 2026 - Production-ready
// //
// // Fixes:
// // ✅ Works in LAN + localhost + production
// // ✅ Storage fallback: localStorage -> sessionStorage
// // ✅ Clear + consistent token/user persistence
// // ✅ Keeps FastAPI detail parsing
// // ========================================

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
// import { wakeApi, currentApiBase as currentApiBaseFn } from "../lib/api";

// const AuthContext = createContext(null);

// const TOKEN_KEY = "auth_token";
// const LEGACY_TOKEN_KEY = "token";
// const USER_KEY = "auth_user";
// const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

// // ------------------------
// // Storage helpers (fallback-safe)
// // ------------------------
// function getStorage() {
//   // Some browsers/contexts can block localStorage. Use sessionStorage fallback.
//   try {
//     const t = "__pp_test__";
//     window.localStorage.setItem(t, "1");
//     window.localStorage.removeItem(t);
//     return window.localStorage;
//   } catch {
//     try {
//       const t = "__pp_test__";
//       window.sessionStorage.setItem(t, "1");
//       window.sessionStorage.removeItem(t);
//       return window.sessionStorage;
//     } catch {
//       return null;
//     }
//   }
// }

// function safeJsonParse(str, fallback = null) {
//   try {
//     return JSON.parse(str);
//   } catch {
//     return fallback;
//   }
// }

// function pickDetailFromBody(body) {
//   if (!body) return "";
//   if (typeof body === "string") return body;

//   const d = body.detail ?? body.message ?? body.error ?? "";
//   if (typeof d === "string") return d;

//   if (Array.isArray(d)) {
//     return (
//       d
//         .map((x) => x?.msg || x?.message || "")
//         .filter(Boolean)
//         .join(", ") || ""
//     );
//   }
//   return "";
// }

// function currentBase() {
//   return String(currentApiBaseFn() || "").replace(/\/+$/, "");
// }

// async function fetchJson(path, { method = "GET", token = "", body, timeoutMs = 15000 } = {}) {
//   const base = currentBase();
//   const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

//   const controller = new AbortController();
//   const t = setTimeout(() => controller.abort(), timeoutMs);

//   try {
//     const headers = { "Content-Type": "application/json" };
//     if (token) headers.Authorization = `Bearer ${token}`;

//     const res = await fetch(url, {
//       method,
//       headers,
//       body: body !== undefined ? JSON.stringify(body) : undefined,
//       signal: controller.signal,
//       cache: "no-store",
//     });

//     let data = null;
//     const ct = res.headers.get("content-type") || "";
//     if (ct.includes("application/json")) {
//       try {
//         data = await res.json();
//       } catch {
//         data = null;
//       }
//     } else {
//       try {
//         const txt = await res.text();
//         data = txt || null;
//       } catch {
//         data = null;
//       }
//     }

//     if (!res.ok) {
//       const detail = pickDetailFromBody(data);
//       const message = detail || `Request failed (${res.status})`;
//       const err = new Error(message);
//       err.status = res.status;
//       err.data = data;
//       throw err;
//     }

//     return data;
//   } catch (e) {
//     if (e?.status) throw e;

//     const msg =
//       e?.name === "AbortError"
//         ? "Request timed out. Please try again."
//         : "Cannot reach the server. Please check your connection and try again.";
//     const err = new Error(msg);
//     err.status = 0;
//     throw err;
//   } finally {
//     clearTimeout(t);
//   }
// }

// // ------------------------
// // Auth Provider
// // ------------------------
// export function AuthProvider({ children }) {
//   const [token, setToken] = useState("");
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [apiStatus, setApiStatus] = useState("checking");

//   const isInitialized = useRef(false);
//   const isMounted = useRef(true);

//   const isAuthenticated = !!token;

//   useEffect(() => {
//     isMounted.current = true;
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   const applyToken = useCallback((tok) => {
//     const storage = getStorage();
//     if (!storage) return;

//     try {
//       if (tok) {
//         storage.setItem(TOKEN_KEY, tok);
//         storage.setItem(LEGACY_TOKEN_KEY, tok);
//       } else {
//         storage.removeItem(TOKEN_KEY);
//         storage.removeItem(LEGACY_TOKEN_KEY);
//       }
//     } catch {
//       // ignore
//     }
//   }, []);

//   const applyUser = useCallback((u) => {
//     const storage = getStorage();
//     if (!storage) return;

//     try {
//       if (u) storage.setItem(USER_KEY, JSON.stringify(u));
//       else storage.removeItem(USER_KEY);
//     } catch {
//       // ignore
//     }
//   }, []);

//   const clearStoredAuth = useCallback(() => {
//     const storage = getStorage();
//     if (!storage) return;
//     try {
//       storage.removeItem(TOKEN_KEY);
//       storage.removeItem(LEGACY_TOKEN_KEY);
//       storage.removeItem(USER_KEY);
//     } catch {
//       // ignore
//     }
//   }, []);

//   const clearAuth = useCallback(() => {
//     if (!isMounted.current) return;
//     setToken("");
//     setUser(null);
//     applyToken("");
//     applyUser(null);
//   }, [applyToken, applyUser]);

//   const checkApiHealth = useCallback(async () => {
//     try {
//       const base = currentBase();
//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), 5000);

//       const res = await fetch(`${base}/health`, {
//         cache: "no-store",
//         signal: controller.signal,
//       });

//       clearTimeout(timeout);

//       if (res.ok) {
//         if (isMounted.current) setApiStatus("healthy");
//         return true;
//       }
//       if (isMounted.current) setApiStatus("unhealthy");
//       return false;
//     } catch {
//       if (isMounted.current) setApiStatus("offline");
//       return false;
//     }
//   }, []);

//   const loadMe = useCallback(async (tok) => {
//     const me = await fetchJson("/users/me", { method: "GET", token: tok });
//     if (!isMounted.current) return null;

//     if (me && typeof me === "object") {
//       setUser(me);
//       applyUser(me);
//       return me;
//     }
//     return null;
//   }, [applyUser]);

//   // Initialize from storage once
//   useEffect(() => {
//     if (isInitialized.current) return;
//     isInitialized.current = true;

//     const init = async () => {
//       try {
//         const storage = getStorage();

//         // Kick health checks (non-blocking)
//         checkApiHealth().catch(() => {});
//         wakeApi?.().catch(() => {});

//         if (!storage) return;

//         const savedToken = storage.getItem(TOKEN_KEY) || storage.getItem(LEGACY_TOKEN_KEY) || "";
//         const savedUserRaw = storage.getItem(USER_KEY);

//         if (savedToken) {
//           setToken(savedToken);
//           applyToken(savedToken);

//           try {
//             await loadMe(savedToken);
//           } catch {
//             clearAuth();
//           }
//         } else {
//           const parsed = savedUserRaw ? safeJsonParse(savedUserRaw, null) : null;
//           if (parsed && typeof parsed === "object") setUser(parsed);
//         }
//       } finally {
//         if (isMounted.current) setIsLoading(false);
//       }
//     };

//     init();
//   }, [applyToken, checkApiHealth, clearAuth, loadMe]);

//   const register = useCallback(
//     async (username, email, password) => {
//       const u = (username || "").trim();
//       const e = (email || "").trim().toLowerCase();
//       const p = password || "";

//       if (!u || !e || !p) throw new Error("Please fill in all fields.");
//       if (p.length > PASSWORD_MAX_LEN)
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters.`);
//       if (p.length < 8) throw new Error("Password must be at least 8 characters.");

//       try {
//         // Backend: /register (no token returned)
//         return await fetchJson("/register", {
//           method: "POST",
//           body: { username: u, email: e, password: p },
//         });
//       } catch (err) {
//         const status = err?.status;
//         const msg = err?.message || "Registration failed.";

//         if (status === 400) throw new Error(msg);
//         if (status === 422) throw new Error(msg || "Invalid input data.");
//         if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (status >= 500) throw new Error("Server error. Please try again later.");
//         throw new Error(msg);
//       }
//     },
//     []
//   );

//   const login = useCallback(
//     async (username, password) => {
//       const u = (username || "").trim();
//       const p = password || "";

//       if (!u || !p) throw new Error("Please enter both username and password.");
//       if (p.length > PASSWORD_MAX_LEN)
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters.`);

//       try {
//         const res = await fetchJson("/token_json", {
//           method: "POST",
//           body: { username: u, password: p },
//         });

//         if (!res?.access_token) throw new Error("Invalid login response from server.");

//         applyToken(res.access_token);
//         setToken(res.access_token);

//         try {
//           await loadMe(res.access_token);
//         } catch {
//           clearAuth();
//           throw new Error("Login succeeded, but session validation failed. Please try again.");
//         }

//         return res;
//       } catch (err) {
//         clearAuth();

//         const status = err?.status;
//         const msg = err?.message || "Login failed.";

//         if (status === 401) throw new Error(msg);
//         if (status === 422) throw new Error(msg || "Invalid input data.");
//         if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (status >= 500) throw new Error("Server error. Please try again later.");
//         throw new Error(msg);
//       }
//     },
//     [applyToken, clearAuth, loadMe]
//   );

//   const logout = useCallback(() => {
//     clearAuth();
//     toast.success("Signed out successfully.");
//   }, [clearAuth]);

//   useEffect(() => {
//     checkApiHealth().catch(() => {});
//     const interval = setInterval(checkApiHealth, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [checkApiHealth]);

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
//       clearStoredAuth, // helpful for debugging
//       apiBaseUrl: currentApiBaseFn(),
//       tokenStorageKey: TOKEN_KEY,
//       legacyTokenStorageKey: LEGACY_TOKEN_KEY,
//       userStorageKey: USER_KEY,
//     }),
//     [token, user, isAuthenticated, isLoading, apiStatus, register, login, logout, clearStoredAuth]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
//   return ctx;
// }

// export default AuthProvider;


