// ========================================
// AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/AuthContext.js
// Author: OneTechly
// Updated: Feb 2026 - Production-ready
//
// Fixes:
// ✅ Exports named: AuthProvider, useAuth (and default AuthProvider)
// ✅ Does NOT swallow HTTP 400/401 errors (parses FastAPI `detail`)
// ✅ Produces professional login/register messages
// ✅ Token key mismatch: supports BOTH "auth_token" (new) and "token" (legacy)
// ✅ Keeps Authorization header consistent (for libs that use fetch via this context)
//
// NOTE:
// This file intentionally does NOT depend on apiPostJson/apiGetJson because many wrappers
// accidentally treat 400/401 as "network errors" and hide FastAPI's detail message.
// ========================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { wakeApi, currentApiBase as currentApiBaseFn } from "../lib/api";

const AuthContext = createContext(null);

// ✅ Canonical token key
const TOKEN_KEY = "auth_token";
// ✅ Legacy key (some older pages might still read this)
const LEGACY_TOKEN_KEY = "token";

const USER_KEY = "auth_user";
const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

// ------------------------
// Helpers
// ------------------------
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function pickDetailFromBody(body) {
  // FastAPI commonly returns: { detail: "..." } or { detail: [...] }
  if (!body) return "";
  if (typeof body === "string") return body;

  const d = body.detail ?? body.message ?? body.error ?? "";
  if (typeof d === "string") return d;

  // Handle Pydantic validation list: [{loc, msg, type}, ...]
  if (Array.isArray(d)) {
    const msg = d
      .map((x) => x?.msg || x?.message || "")
      .filter(Boolean)
      .join(", ");
    return msg || "";
  }

  return "";
}

function currentBase() {
  // Normalize: no trailing slash
  return String(currentApiBaseFn() || "").replace(/\/+$/, "");
}

async function fetchJson(path, { method = "GET", token = "", body, timeoutMs = 15000 } = {}) {
  const base = currentBase();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });

    let data = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      // Sometimes errors come back as text
      try {
        const txt = await res.text();
        data = txt || null;
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      const detail = pickDetailFromBody(data);
      const message = detail || `Request failed (${res.status})`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (e) {
    // Distinguish abort/network from HTTP errors we already threw above
    if (e?.status) throw e;

    const msg =
      e?.name === "AbortError"
        ? "Request timed out. Please try again."
        : "Cannot reach the server. Please check your connection and try again.";
    const err = new Error(msg);
    err.status = 0;
    throw err;
  } finally {
    clearTimeout(t);
  }
}

// ------------------------
// Auth Provider
// ------------------------
export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("checking");

  const isInitialized = useRef(false);
  const isMounted = useRef(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const applyToken = useCallback((tok) => {
    try {
      if (tok) {
        localStorage.setItem(TOKEN_KEY, tok);
        localStorage.setItem(LEGACY_TOKEN_KEY, tok); // legacy support
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(LEGACY_TOKEN_KEY);
      }
    } catch (e) {
      console.warn("Storage operation failed:", e);
    }
  }, []);

  const clearAuth = useCallback(() => {
    if (!isMounted.current) return;
    setToken("");
    setUser(null);
    applyToken("");
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn("Failed to clear user storage:", e);
    }
  }, [applyToken]);

  const checkApiHealth = useCallback(async () => {
    try {
      const base = currentBase();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${base}/health`, {
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        if (isMounted.current) setApiStatus("healthy");
        return true;
      }
      if (isMounted.current) setApiStatus("unhealthy");
      return false;
    } catch {
      if (isMounted.current) setApiStatus("offline");
      return false;
    }
  }, []);

  const loadMe = useCallback(
    async (tok) => {
      const me = await fetchJson("/users/me", { method: "GET", token: tok });
      if (!isMounted.current) return null;

      if (me && typeof me === "object") {
        setUser(me);
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(me));
        } catch {}
        return me;
      }
      return null;
    },
    []
  );

  // ✅ Initialize from storage once
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const init = async () => {
      try {
        // Prefer canonical, fall back to legacy
        const savedToken =
          localStorage.getItem(TOKEN_KEY) ||
          localStorage.getItem(LEGACY_TOKEN_KEY) ||
          "";

        const savedUserRaw = localStorage.getItem(USER_KEY);

        // Don’t block UI
        checkApiHealth().catch(() => {});
        wakeApi?.().catch(() => {});

        if (savedToken) {
          setToken(savedToken);
          applyToken(savedToken);

          try {
            await loadMe(savedToken);
          } catch {
            // token invalid/expired
            clearAuth();
          }
        } else {
          const parsed = savedUserRaw ? safeJsonParse(savedUserRaw, null) : null;
          if (parsed && typeof parsed === "object") setUser(parsed);
        }
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };

    init();
  }, [applyToken, checkApiHealth, clearAuth, loadMe]);

  // ------------------------
  // register/login/logout
  // ------------------------
  const register = useCallback(
    async (username, email, password) => {
      const u = (username || "").trim();
      const e = (email || "").trim().toLowerCase();
      const p = password || "";

      if (!u || !e || !p) throw new Error("Please fill in all fields");
      if (p.length > PASSWORD_MAX_LEN)
        throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
      if (p.length < 8) throw new Error("Password must be at least 8 characters");

      try {
        // Your backend returns 400 with detail "Username already exists." / "Email already exists."
        const res = await fetchJson("/register", {
          method: "POST",
          body: { username: u, email: e, password: p },
        });

        // Your /register does NOT return token; user must login after register (current backend behavior)
        return res;
      } catch (err) {
        clearAuth();

        // Professional message mapping
        const status = err?.status;
        const msg = err?.message || "Registration failed";

        if (status === 400) throw new Error(msg); // already clean from FastAPI detail
        if (status === 422) throw new Error(msg || "Invalid input data");
        if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
        if (status >= 500) throw new Error("Server error. Please try again later.");
        throw new Error(msg);
      }
    },
    [clearAuth]
  );

  const login = useCallback(
    async (username, password) => {
      const u = (username || "").trim();
      const p = password || "";

      if (!u || !p) throw new Error("Please enter both username and password");
      if (p.length > PASSWORD_MAX_LEN)
        throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);

      try {
        const res = await fetchJson("/token_json", {
          method: "POST",
          body: { username: u, password: p },
        });

        if (!res?.access_token) throw new Error("Invalid login response from server");

        applyToken(res.access_token);
        setToken(res.access_token);

        try {
          await loadMe(res.access_token);
        } catch {
          // If /users/me fails after login, treat as auth failure
          clearAuth();
          throw new Error("Login succeeded, but session validation failed. Please try again.");
        }

        return res;
      } catch (err) {
        clearAuth();

        const status = err?.status;
        const msg = err?.message || "Login failed";

        // Your backend uses: 401 detail="Incorrect username or password"
        if (status === 401) throw new Error(msg);
        if (status === 422) throw new Error(msg || "Invalid input data");
        if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
        if (status >= 500) throw new Error("Server error. Please try again later.");
        throw new Error(msg);
      }
    },
    [applyToken, clearAuth, loadMe]
  );

  const logout = useCallback(() => {
    clearAuth();
    toast.success("Signed out successfully");
  }, [clearAuth]);

  // Keep health updated
  useEffect(() => {
    checkApiHealth().catch(() => {});
    const interval = setInterval(checkApiHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkApiHealth]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      isLoading,
      apiStatus,
      register,
      login,
      logout,
      setToken,
      setUser,
      apiBaseUrl: currentApiBaseFn(),
      checkApiHealth,
      tokenStorageKey: TOKEN_KEY,
      legacyTokenStorageKey: LEGACY_TOKEN_KEY,
    }),
    [token, user, isAuthenticated, isLoading, apiStatus, register, login, logout, checkApiHealth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ✅ ALSO export default so older default-imports won't crash
export default AuthProvider;


///////////////////////////////////////////
// // ========================================
// // AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/AuthContext.js
// // Author: OneTechly
// // Updated: Feb 2026 - Production-ready
// //
// // Fixes/Upgrades:
// // 1) Token key mismatch: supports BOTH "auth_token" (new) and "token" (legacy)
// // 2) Stable initialization + token validation (/users/me)
// // 3) Consistent axios Authorization header
// // 4) Professional error mapping (login/register use cases)
// // 5) Network/timeout/offline-safe errors
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
// import {
//   api,
//   apiGetJson,
//   apiPostJson,
//   wakeApi,
//   currentApiBase as currentApiBaseFn,
// } from "../lib/api";

// const AuthContext = createContext(null);

// // ✅ Canonical token key
// const TOKEN_KEY = "auth_token";
// // ✅ Legacy key (your DashboardPage uses this)
// const LEGACY_TOKEN_KEY = "token";

// const USER_KEY = "auth_user";
// const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

// function safeJsonParse(str, fallback = null) {
//   try {
//     return JSON.parse(str);
//   } catch {
//     return fallback;
//   }
// }

// /**
//  * Normalize axios/fetch-like errors into a consistent shape:
//  * { status, detail, message, raw }
//  */
// function normalizeApiError(err) {
//   const out = { status: undefined, detail: undefined, message: "Request failed", raw: err };

//   // Axios style error
//   const axiosStatus = err?.response?.status;
//   const axiosData = err?.response?.data;
//   const axiosDetail = axiosData?.detail ?? axiosData?.message ?? axiosData?.error;

//   if (axiosStatus) {
//     out.status = axiosStatus;
//     out.detail = axiosDetail;
//     out.message =
//       typeof axiosDetail === "string" && axiosDetail.trim()
//         ? axiosDetail
//         : (err?.message || out.message);
//     return out;
//   }

//   // Fetch aborted timeout often has name AbortError
//   if (err?.name === "AbortError") {
//     out.status = 0;
//     out.message = "Request timed out. Please try again.";
//     return out;
//   }

//   // Generic JS error
//   if (typeof err?.message === "string" && err.message.trim()) {
//     out.message = err.message;
//     // Many network errors don't have status
//     out.status = out.status ?? 0;
//     return out;
//   }

//   // Plain string
//   if (typeof err === "string" && err.trim()) {
//     out.message = err;
//     out.status = out.status ?? 0;
//     return out;
//   }

//   // Default
//   out.status = out.status ?? 0;
//   return out;
// }

// /**
//  * Extract a clean detail message from FastAPI validation formats:
//  * - detail: "string"
//  * - detail: [{loc, msg, type}, ...]
//  */
// function normalizeDetail(detail) {
//   if (!detail) return "";
//   if (typeof detail === "string") return detail;
//   if (Array.isArray(detail)) {
//     const first = detail[0];
//     if (first?.msg) return String(first.msg);
//     return "Invalid input. Please review your fields.";
//   }
//   if (typeof detail === "object") {
//     if (detail.msg) return String(detail.msg);
//   }
//   return "";
// }

// /**
//  * Professional, user-safe messaging.
//  * Note:
//  * - Login should NOT reveal whether the user exists (security best practice)
//  * - Register can say "already exists" (standard UX), but you can make it generic if you prefer.
//  */
// function mapAuthError({ action, status, payload, fallbackMessage }) {
//   const detailRaw =
//     payload?.code ||
//     payload?.message ||
//     normalizeDetail(payload?.detail) ||
//     payload?.error ||
//     "";

//   const detail = String(detailRaw || "").trim();
//   const lower = detail.toLowerCase();

//   // Network/offline
//   if (!status || status === 0) {
//     // CORS/Server down/No internet
//     return "Cannot reach the server. Please check your connection and try again.";
//   }

//   // Rate limit
//   if (status === 429) {
//     return "Too many attempts. Please wait a moment and try again.";
//   }

//   // Server errors
//   if (status >= 500) {
//     return "Server error. Please try again in a moment.";
//   }

//   // LOGIN
//   if (action === "login") {
//     if (status === 401) return "Incorrect username or password.";
//     if (status === 403) return "Your account is not allowed to sign in right now.";
//     if (status === 422) return "Invalid login input. Please check your fields.";

//     // Fallback (safe)
//     if (lower.includes("invalid") || lower.includes("credential") || lower.includes("unauthorized")) {
//       return "Incorrect username or password.";
//     }

//     return fallbackMessage || "Login failed. Please try again.";
//   }

//   // REGISTER
//   if (action === "register") {
//     if (status === 409) return "An account with that username or email already exists.";
//     if (status === 400) {
//       if (lower.includes("email")) return "Please enter a valid email address.";
//       if (lower.includes("password")) return "Password does not meet requirements.";
//       if (lower.includes("username")) return "Please choose a valid username.";
//       return "Please check your details and try again.";
//     }
//     if (status === 422) return "Some fields are invalid. Please review and try again.";

//     // Heuristic fallback
//     if (lower.includes("exists") || lower.includes("taken") || lower.includes("already")) {
//       return "An account with that username or email already exists.";
//     }

//     return fallbackMessage || "Registration failed. Please try again.";
//   }

//   return fallbackMessage || "Request failed. Please try again.";
// }

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

//   // ✅ Always keep axios + storage in sync
//   const applyToken = useCallback((tok) => {
//     try {
//       if (tok) {
//         api.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
//         localStorage.setItem(TOKEN_KEY, tok);
//         // ✅ Legacy support
//         localStorage.setItem(LEGACY_TOKEN_KEY, tok);
//       } else {
//         delete api.defaults.headers.common["Authorization"];
//         localStorage.removeItem(TOKEN_KEY);
//         localStorage.removeItem(LEGACY_TOKEN_KEY);
//       }
//     } catch (e) {
//       console.warn("Storage operation failed:", e);
//     }
//   }, []);

//   const clearAuth = useCallback(() => {
//     if (!isMounted.current) return;
//     setToken("");
//     setUser(null);
//     applyToken("");
//     try {
//       localStorage.removeItem(USER_KEY);
//     } catch (e) {
//       console.warn("Failed to clear user storage:", e);
//     }
//   }, [applyToken]);

//   const checkApiHealth = useCallback(async () => {
//     try {
//       const base = currentApiBaseFn().replace(/\/+$/, "");
//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), 5000);

//       const response = await fetch(`${base}/health`, {
//         cache: "no-store",
//         signal: controller.signal,
//       });

//       clearTimeout(timeout);

//       if (response.ok) {
//         if (isMounted.current) setApiStatus("healthy");
//         return true;
//       }

//       if (isMounted.current) setApiStatus("unhealthy");
//       return false;
//     } catch (error) {
//       console.error("❌ API health check failed:", error);
//       if (isMounted.current) setApiStatus("offline");
//       return false;
//     }
//   }, []);

//   // ✅ Initialize from storage once
//   useEffect(() => {
//     if (isInitialized.current) return;
//     isInitialized.current = true;

//     const initializeAuth = async () => {
//       try {
//         const savedToken =
//           localStorage.getItem(TOKEN_KEY) ||
//           localStorage.getItem(LEGACY_TOKEN_KEY) ||
//           "";

//         const savedUserRaw = localStorage.getItem(USER_KEY);

//         // Don’t block UI on health check
//         checkApiHealth().catch(() => {});

//         if (savedToken) {
//           if (!isMounted.current) return;

//           setToken(savedToken);
//           applyToken(savedToken);

//           // Validate token with backend
//           try {
//             const me = await apiGetJson("/users/me");
//             if (!isMounted.current) return;

//             if (me) {
//               setUser(me);
//               try {
//                 localStorage.setItem(USER_KEY, JSON.stringify(me));
//               } catch {}
//             } else {
//               clearAuth();
//             }
//           } catch (e) {
//             console.error("❌ Token validation failed:", e);
//             clearAuth();
//           }
//         } else {
//           // No token, but maybe cached user exists
//           const parsed = savedUserRaw ? safeJsonParse(savedUserRaw, null) : null;
//           if (parsed && typeof parsed === "object") setUser(parsed);
//         }
//       } catch (error) {
//         console.error("❌ Auth initialization error:", error);
//       } finally {
//         if (isMounted.current) setIsLoading(false);
//       }
//     };

//     initializeAuth();
//   }, [applyToken, checkApiHealth, clearAuth]);

//   const register = useCallback(
//     async (username, email, password) => {
//       const u = (username || "").trim();
//       const e = (email || "").trim().toLowerCase();
//       const p = password || "";

//       if (!u || !e || !p) throw new Error("Please fill in all fields");
//       if (p.length > PASSWORD_MAX_LEN)
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
//       if (p.length < 8) throw new Error("Password must be at least 8 characters");

//       try {
//         const res = await apiPostJson("/register", { username: u, email: e, password: p });

//         // If your backend auto-logs-in on register:
//         if (res?.access_token) {
//           applyToken(res.access_token);
//           if (isMounted.current) setToken(res.access_token);

//           try {
//             const me = await apiGetJson("/users/me");
//             if (me && isMounted.current) {
//               setUser(me);
//               localStorage.setItem(USER_KEY, JSON.stringify(me));
//             }
//           } catch {}
//         }

//         return res;
//       } catch (err) {
//         clearAuth();
//         const n = normalizeApiError(err);
//         const payload = err?.response?.data || {};
//         const message = mapAuthError({
//           action: "register",
//           status: n.status,
//           payload,
//           fallbackMessage: n.message,
//         });
//         throw new Error(message);
//       }
//     },
//     [applyToken, clearAuth]
//   );

//   const login = useCallback(
//     async (username, password) => {
//       const u = (username || "").trim();
//       const p = password || "";

//       if (!u || !p) throw new Error("Please enter both username and password");
//       if (p.length > PASSWORD_MAX_LEN)
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);

//       try {
//         const res = await apiPostJson("/token_json", { username: u, password: p });

//         if (!res?.access_token) throw new Error("Invalid login response from server");

//         applyToken(res.access_token);
//         if (isMounted.current) setToken(res.access_token);

//         try {
//           const me = await apiGetJson("/users/me");
//           if (me && isMounted.current) {
//             setUser(me);
//             localStorage.setItem(USER_KEY, JSON.stringify(me));
//           }
//         } catch {}

//         return res;
//       } catch (err) {
//         clearAuth();
//         const n = normalizeApiError(err);
//         const payload = err?.response?.data || {};
//         const message = mapAuthError({
//           action: "login",
//           status: n.status,
//           payload,
//           fallbackMessage: n.message,
//         });
//         throw new Error(message);
//       }
//     },
//     [applyToken, clearAuth]
//   );

//   const logout = useCallback(() => {
//     clearAuth();
//     toast.success("Signed out successfully");
//   }, [clearAuth]);

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
//       setToken,
//       setUser,
//       apiBaseUrl: currentApiBaseFn(),
//       apiFetch: api,
//       checkApiHealth,
//       tokenStorageKey: TOKEN_KEY,
//       legacyTokenStorageKey: LEGACY_TOKEN_KEY,
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

