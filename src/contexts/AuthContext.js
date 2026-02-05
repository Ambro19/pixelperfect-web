// ========================================
// AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/AuthContext.js
// Author: OneTechly
// Updated: Feb 2026 - Production-ready
//
// Fixes:
// ✅ Works in LAN + localhost + production
// ✅ Storage fallback: localStorage -> sessionStorage
// ✅ Clear + consistent token/user persistence
// ✅ Keeps FastAPI detail parsing
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

const TOKEN_KEY = "auth_token";
const LEGACY_TOKEN_KEY = "token";
const USER_KEY = "auth_user";
const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

// ------------------------
// Storage helpers (fallback-safe)
// ------------------------
function getStorage() {
  // Some browsers/contexts can block localStorage. Use sessionStorage fallback.
  try {
    const t = "__pp_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch {
    try {
      const t = "__pp_test__";
      window.sessionStorage.setItem(t, "1");
      window.sessionStorage.removeItem(t);
      return window.sessionStorage;
    } catch {
      return null;
    }
  }
}

function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function pickDetailFromBody(body) {
  if (!body) return "";
  if (typeof body === "string") return body;

  const d = body.detail ?? body.message ?? body.error ?? "";
  if (typeof d === "string") return d;

  if (Array.isArray(d)) {
    return (
      d
        .map((x) => x?.msg || x?.message || "")
        .filter(Boolean)
        .join(", ") || ""
    );
  }
  return "";
}

function currentBase() {
  return String(currentApiBaseFn() || "").replace(/\/+$/, "");
}

async function fetchJson(path, { method = "GET", token = "", body, timeoutMs = 15000 } = {}) {
  const base = currentBase();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = { "Content-Type": "application/json" };
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
    const storage = getStorage();
    if (!storage) return;

    try {
      if (tok) {
        storage.setItem(TOKEN_KEY, tok);
        storage.setItem(LEGACY_TOKEN_KEY, tok);
      } else {
        storage.removeItem(TOKEN_KEY);
        storage.removeItem(LEGACY_TOKEN_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const applyUser = useCallback((u) => {
    const storage = getStorage();
    if (!storage) return;

    try {
      if (u) storage.setItem(USER_KEY, JSON.stringify(u));
      else storage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  }, []);

  const clearStoredAuth = useCallback(() => {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.removeItem(TOKEN_KEY);
      storage.removeItem(LEGACY_TOKEN_KEY);
      storage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  }, []);

  const clearAuth = useCallback(() => {
    if (!isMounted.current) return;
    setToken("");
    setUser(null);
    applyToken("");
    applyUser(null);
  }, [applyToken, applyUser]);

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

  const loadMe = useCallback(async (tok) => {
    const me = await fetchJson("/users/me", { method: "GET", token: tok });
    if (!isMounted.current) return null;

    if (me && typeof me === "object") {
      setUser(me);
      applyUser(me);
      return me;
    }
    return null;
  }, [applyUser]);

  // Initialize from storage once
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const init = async () => {
      try {
        const storage = getStorage();

        // Kick health checks (non-blocking)
        checkApiHealth().catch(() => {});
        wakeApi?.().catch(() => {});

        if (!storage) return;

        const savedToken = storage.getItem(TOKEN_KEY) || storage.getItem(LEGACY_TOKEN_KEY) || "";
        const savedUserRaw = storage.getItem(USER_KEY);

        if (savedToken) {
          setToken(savedToken);
          applyToken(savedToken);

          try {
            await loadMe(savedToken);
          } catch {
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

  const register = useCallback(
    async (username, email, password) => {
      const u = (username || "").trim();
      const e = (email || "").trim().toLowerCase();
      const p = password || "";

      if (!u || !e || !p) throw new Error("Please fill in all fields.");
      if (p.length > PASSWORD_MAX_LEN)
        throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters.`);
      if (p.length < 8) throw new Error("Password must be at least 8 characters.");

      try {
        // Backend: /register (no token returned)
        return await fetchJson("/register", {
          method: "POST",
          body: { username: u, email: e, password: p },
        });
      } catch (err) {
        const status = err?.status;
        const msg = err?.message || "Registration failed.";

        if (status === 400) throw new Error(msg);
        if (status === 422) throw new Error(msg || "Invalid input data.");
        if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
        if (status >= 500) throw new Error("Server error. Please try again later.");
        throw new Error(msg);
      }
    },
    []
  );

  const login = useCallback(
    async (username, password) => {
      const u = (username || "").trim();
      const p = password || "";

      if (!u || !p) throw new Error("Please enter both username and password.");
      if (p.length > PASSWORD_MAX_LEN)
        throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters.`);

      try {
        const res = await fetchJson("/token_json", {
          method: "POST",
          body: { username: u, password: p },
        });

        if (!res?.access_token) throw new Error("Invalid login response from server.");

        applyToken(res.access_token);
        setToken(res.access_token);

        try {
          await loadMe(res.access_token);
        } catch {
          clearAuth();
          throw new Error("Login succeeded, but session validation failed. Please try again.");
        }

        return res;
      } catch (err) {
        clearAuth();

        const status = err?.status;
        const msg = err?.message || "Login failed.";

        if (status === 401) throw new Error(msg);
        if (status === 422) throw new Error(msg || "Invalid input data.");
        if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
        if (status >= 500) throw new Error("Server error. Please try again later.");
        throw new Error(msg);
      }
    },
    [applyToken, clearAuth, loadMe]
  );

  const logout = useCallback(() => {
    clearAuth();
    toast.success("Signed out successfully.");
  }, [clearAuth]);

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
      clearStoredAuth, // helpful for debugging
      apiBaseUrl: currentApiBaseFn(),
      tokenStorageKey: TOKEN_KEY,
      legacyTokenStorageKey: LEGACY_TOKEN_KEY,
      userStorageKey: USER_KEY,
    }),
    [token, user, isAuthenticated, isLoading, apiStatus, register, login, logout, clearStoredAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export default AuthProvider;


// // ========================================
// // AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/AuthContext.js
// // Author: OneTechly
// // Updated: Feb 2026 - Production-ready (fixed)
// //
// // Fixes added:
// // ✅ Auto-login after register (prevents "register worked but I can't access dashboard")
// // ✅ Better debug visibility (only when REACT_APP_DEBUG=true)
// // ✅ Keeps token keys: auth_token + token (legacy)
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
// const DEBUG = String(process.env.REACT_APP_DEBUG || "").toLowerCase() === "true";

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
//     const msg = d
//       .map((x) => x?.msg || x?.message || "")
//       .filter(Boolean)
//       .join(", ");
//     return msg || "";
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
//     try {
//       if (tok) {
//         localStorage.setItem(TOKEN_KEY, tok);
//         localStorage.setItem(LEGACY_TOKEN_KEY, tok);
//         if (DEBUG) console.log("[Auth] token saved to localStorage keys:", TOKEN_KEY, LEGACY_TOKEN_KEY);
//       } else {
//         localStorage.removeItem(TOKEN_KEY);
//         localStorage.removeItem(LEGACY_TOKEN_KEY);
//         if (DEBUG) console.log("[Auth] token cleared from localStorage");
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
//     } catch {}
//   }, [applyToken]);

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
//       try {
//         localStorage.setItem(USER_KEY, JSON.stringify(me));
//       } catch {}
//       return me;
//     }
//     return null;
//   }, []);

//   useEffect(() => {
//     if (isInitialized.current) return;
//     isInitialized.current = true;

//     const init = async () => {
//       try {
//         const savedToken =
//           localStorage.getItem(TOKEN_KEY) ||
//           localStorage.getItem(LEGACY_TOKEN_KEY) ||
//           "";

//         const savedUserRaw = localStorage.getItem(USER_KEY);

//         checkApiHealth().catch(() => {});
//         wakeApi?.().catch(() => {});

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

//   const login = useCallback(
//     async (username, password) => {
//       const u = (username || "").trim();
//       const p = password || "";

//       if (!u || !p) throw new Error("Please enter both username and password");
//       if (p.length > PASSWORD_MAX_LEN) throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);

//       try {
//         const res = await fetchJson("/token_json", {
//           method: "POST",
//           body: { username: u, password: p },
//         });

//         if (!res?.access_token) throw new Error("Invalid login response from server");

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
//         const msg = err?.message || "Login failed";

//         if (status === 401) throw new Error(msg);
//         if (status === 422) throw new Error(msg || "Invalid input data");
//         if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (status >= 500) throw new Error("Server error. Please try again later.");
//         throw new Error(msg);
//       }
//     },
//     [applyToken, clearAuth, loadMe]
//   );

//   const register = useCallback(
//     async (username, email, password) => {
//       const u = (username || "").trim();
//       const e = (email || "").trim().toLowerCase();
//       const p = password || "";

//       if (!u || !e || !p) throw new Error("Please fill in all fields");
//       if (p.length > PASSWORD_MAX_LEN) throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
//       if (p.length < 8) throw new Error("Password must be at least 8 characters");

//       try {
//         // Create account
//         await fetchJson("/register", {
//           method: "POST",
//           body: { username: u, email: e, password: p },
//         });

//         // ✅ Auto-login after register (critical fix)
//         await login(u, p);

//         return true;
//       } catch (err) {
//         clearAuth();

//         const status = err?.status;
//         const msg = err?.message || "Registration failed";

//         if (status === 400) throw new Error(msg);
//         if (status === 422) throw new Error(msg || "Invalid input data");
//         if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (status >= 500) throw new Error("Server error. Please try again later.");
//         throw new Error(msg);
//       }
//     },
//     [clearAuth, login]
//   );

//   const logout = useCallback(() => {
//     clearAuth();
//     toast.success("Signed out successfully");
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
//       setToken,
//       setUser,
//       apiBaseUrl: currentApiBaseFn(),
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

// export default AuthProvider;


//////////////////////////////////////////////////////////////////
// // ========================================
// // AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/AuthContext.js
// // Author: OneTechly
// // Updated: Feb 2026 - Production-ready
// //
// // Fixes:
// // ✅ Exports named: AuthProvider, useAuth (and default AuthProvider)
// // ✅ Does NOT swallow HTTP 400/401 errors (parses FastAPI `detail`)
// // ✅ Produces professional login/register messages
// // ✅ Token key mismatch: supports BOTH "auth_token" (new) and "token" (legacy)
// // ✅ Keeps Authorization header consistent (for libs that use fetch via this context)
// //
// // NOTE:
// // This file intentionally does NOT depend on apiPostJson/apiGetJson because many wrappers
// // accidentally treat 400/401 as "network errors" and hide FastAPI's detail message.
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

// // ✅ Canonical token key
// const TOKEN_KEY = "auth_token";
// // ✅ Legacy key (some older pages might still read this)
// const LEGACY_TOKEN_KEY = "token";

// const USER_KEY = "auth_user";
// const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

// // ------------------------
// // Helpers
// // ------------------------
// function safeJsonParse(str, fallback = null) {
//   try {
//     return JSON.parse(str);
//   } catch {
//     return fallback;
//   }
// }

// function pickDetailFromBody(body) {
//   // FastAPI commonly returns: { detail: "..." } or { detail: [...] }
//   if (!body) return "";
//   if (typeof body === "string") return body;

//   const d = body.detail ?? body.message ?? body.error ?? "";
//   if (typeof d === "string") return d;

//   // Handle Pydantic validation list: [{loc, msg, type}, ...]
//   if (Array.isArray(d)) {
//     const msg = d
//       .map((x) => x?.msg || x?.message || "")
//       .filter(Boolean)
//       .join(", ");
//     return msg || "";
//   }

//   return "";
// }

// function currentBase() {
//   // Normalize: no trailing slash
//   return String(currentApiBaseFn() || "").replace(/\/+$/, "");
// }

// async function fetchJson(path, { method = "GET", token = "", body, timeoutMs = 15000 } = {}) {
//   const base = currentBase();
//   const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

//   const controller = new AbortController();
//   const t = setTimeout(() => controller.abort(), timeoutMs);

//   try {
//     const headers = {
//       "Content-Type": "application/json",
//     };
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
//       // Sometimes errors come back as text
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
//     // Distinguish abort/network from HTTP errors we already threw above
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
//     try {
//       if (tok) {
//         localStorage.setItem(TOKEN_KEY, tok);
//         localStorage.setItem(LEGACY_TOKEN_KEY, tok); // legacy support
//       } else {
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

//   const loadMe = useCallback(
//     async (tok) => {
//       const me = await fetchJson("/users/me", { method: "GET", token: tok });
//       if (!isMounted.current) return null;

//       if (me && typeof me === "object") {
//         setUser(me);
//         try {
//           localStorage.setItem(USER_KEY, JSON.stringify(me));
//         } catch {}
//         return me;
//       }
//       return null;
//     },
//     []
//   );

//   // ✅ Initialize from storage once
//   useEffect(() => {
//     if (isInitialized.current) return;
//     isInitialized.current = true;

//     const init = async () => {
//       try {
//         // Prefer canonical, fall back to legacy
//         const savedToken =
//           localStorage.getItem(TOKEN_KEY) ||
//           localStorage.getItem(LEGACY_TOKEN_KEY) ||
//           "";

//         const savedUserRaw = localStorage.getItem(USER_KEY);

//         // Don’t block UI
//         checkApiHealth().catch(() => {});
//         wakeApi?.().catch(() => {});

//         if (savedToken) {
//           setToken(savedToken);
//           applyToken(savedToken);

//           try {
//             await loadMe(savedToken);
//           } catch {
//             // token invalid/expired
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

//   // ------------------------
//   // register/login/logout
//   // ------------------------
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
//         // Your backend returns 400 with detail "Username already exists." / "Email already exists."
//         const res = await fetchJson("/register", {
//           method: "POST",
//           body: { username: u, email: e, password: p },
//         });

//         // Your /register does NOT return token; user must login after register (current backend behavior)
//         return res;
//       } catch (err) {
//         clearAuth();

//         // Professional message mapping
//         const status = err?.status;
//         const msg = err?.message || "Registration failed";

//         if (status === 400) throw new Error(msg); // already clean from FastAPI detail
//         if (status === 422) throw new Error(msg || "Invalid input data");
//         if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (status >= 500) throw new Error("Server error. Please try again later.");
//         throw new Error(msg);
//       }
//     },
//     [clearAuth]
//   );

//   const login = useCallback(
//     async (username, password) => {
//       const u = (username || "").trim();
//       const p = password || "";

//       if (!u || !p) throw new Error("Please enter both username and password");
//       if (p.length > PASSWORD_MAX_LEN)
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);

//       try {
//         const res = await fetchJson("/token_json", {
//           method: "POST",
//           body: { username: u, password: p },
//         });

//         if (!res?.access_token) throw new Error("Invalid login response from server");

//         applyToken(res.access_token);
//         setToken(res.access_token);

//         try {
//           await loadMe(res.access_token);
//         } catch {
//           // If /users/me fails after login, treat as auth failure
//           clearAuth();
//           throw new Error("Login succeeded, but session validation failed. Please try again.");
//         }

//         return res;
//       } catch (err) {
//         clearAuth();

//         const status = err?.status;
//         const msg = err?.message || "Login failed";

//         // Your backend uses: 401 detail="Incorrect username or password"
//         if (status === 401) throw new Error(msg);
//         if (status === 422) throw new Error(msg || "Invalid input data");
//         if (status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (status >= 500) throw new Error("Server error. Please try again later.");
//         throw new Error(msg);
//       }
//     },
//     [applyToken, clearAuth, loadMe]
//   );

//   const logout = useCallback(() => {
//     clearAuth();
//     toast.success("Signed out successfully");
//   }, [clearAuth]);

//   // Keep health updated
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
//       setToken,
//       setUser,
//       apiBaseUrl: currentApiBaseFn(),
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

// // ✅ ALSO export default so older default-imports won't crash
// export default AuthProvider;



