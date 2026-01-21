// ========================================
// AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/AuthContext.js
// Author: OneTechly
// Updated: January 2026 - Production-ready
//
// Fixes:
// 1) Token key mismatch: supports BOTH "auth_token" (new) and "token" (legacy)
// 2) Stable initialization + token validation
// 3) Consistent axios Authorization header
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
import {
  api,
  apiGetJson,
  apiPostJson,
  wakeApi,
  currentApiBase as currentApiBaseFn,
} from "../lib/api";

const AuthContext = createContext(null);

// ✅ Canonical token key
const TOKEN_KEY = "auth_token";
// ✅ Legacy key (your DashboardPage uses this)
const LEGACY_TOKEN_KEY = "token";

const USER_KEY = "auth_user";
const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function normalizeApiError(err) {
  const out = { status: undefined, detail: undefined, message: "Request failed", raw: err };

  const axiosStatus = err?.response?.status;
  const axiosDetail = err?.response?.data?.detail ?? err?.response?.data?.message;
  if (axiosStatus) {
    out.status = axiosStatus;
    out.detail = axiosDetail;
    out.message = typeof axiosDetail === "string" ? axiosDetail : (err?.message || out.message);
    return out;
  }

  if (typeof err?.message === "string") {
    out.message = err.message;
    return out;
  }

  if (typeof err === "string") {
    out.message = err;
    return out;
  }

  return out;
}

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
    return () => { isMounted.current = false; };
  }, []);

  // ✅ Always keep axios + storage in sync
  const applyToken = useCallback((tok) => {
    try {
      if (tok) {
        api.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
        localStorage.setItem(TOKEN_KEY, tok);
        // ✅ Legacy support so older code keeps working
        localStorage.setItem(LEGACY_TOKEN_KEY, tok);
      } else {
        delete api.defaults.headers.common["Authorization"];
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
      const base = currentApiBaseFn().replace(/\/+$/, "");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${base}/health`, {
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        if (isMounted.current) setApiStatus("healthy");
        return true;
      }

      if (isMounted.current) setApiStatus("unhealthy");
      return false;
    } catch (error) {
      console.error("❌ API health check failed:", error);
      if (isMounted.current) setApiStatus("offline");
      return false;
    }
  }, []);

  // ✅ Initialize from storage once
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeAuth = async () => {
      try {
        // Prefer canonical key, fall back to legacy key
        const savedToken =
          localStorage.getItem(TOKEN_KEY) ||
          localStorage.getItem(LEGACY_TOKEN_KEY) ||
          "";

        const savedUserRaw = localStorage.getItem(USER_KEY);

        // Don’t block UI on health check
        checkApiHealth().catch(() => {});

        if (savedToken) {
          if (!isMounted.current) return;

          setToken(savedToken);
          applyToken(savedToken);

          // Validate token with backend
          try {
            const me = await apiGetJson("/users/me");
            if (!isMounted.current) return;

            if (me) {
              setUser(me);
              try {
                localStorage.setItem(USER_KEY, JSON.stringify(me));
              } catch {}
            } else {
              clearAuth();
            }
          } catch (e) {
            console.error("❌ Token validation failed:", e);
            clearAuth();
          }
        } else {
          // No token, but maybe cached user exists
          const parsed = savedUserRaw ? safeJsonParse(savedUserRaw, null) : null;
          if (parsed && typeof parsed === "object") setUser(parsed);
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };

    initializeAuth();
  }, [applyToken, checkApiHealth, clearAuth]);

  const register = useCallback(
    async (username, email, password) => {
      const u = (username || "").trim();
      const e = (email || "").trim().toLowerCase();
      const p = password || "";

      if (!u || !e || !p) throw new Error("Please fill in all fields");
      if (p.length > PASSWORD_MAX_LEN) throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
      if (p.length < 8) throw new Error("Password must be at least 8 characters");

      try {
        const res = await apiPostJson("/register", { username: u, email: e, password: p });

        if (res?.access_token) {
          applyToken(res.access_token);
          setToken(res.access_token);

          try {
            const me = await apiGetJson("/users/me");
            if (me && isMounted.current) {
              setUser(me);
              localStorage.setItem(USER_KEY, JSON.stringify(me));
            }
          } catch {}
        }

        return res;
      } catch (err) {
        clearAuth();
        const n = normalizeApiError(err);
        const detail = typeof n.detail === "string" ? n.detail : undefined;

        if (n.status === 400) throw new Error(detail || "Username or email already exists");
        if (n.status === 422) throw new Error(detail || "Invalid input data");
        if (n.status === 429) throw new Error("Too many attempts. Please wait and try again.");
        if (n.status >= 500) throw new Error("Server error. Please try again later.");

        throw new Error(detail || n.message || "Registration failed");
      }
    },
    [applyToken, clearAuth]
  );

  const login = useCallback(
    async (username, password) => {
      const u = (username || "").trim();
      const p = password || "";

      if (!u || !p) throw new Error("Please enter both username and password");
      if (p.length > PASSWORD_MAX_LEN) throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);

      try {
        const res = await apiPostJson("/token_json", { username: u, password: p });

        if (!res?.access_token) throw new Error("Invalid login response from server");

        applyToken(res.access_token);
        setToken(res.access_token);

        try {
          const me = await apiGetJson("/users/me");
          if (me && isMounted.current) {
            setUser(me);
            localStorage.setItem(USER_KEY, JSON.stringify(me));
          }
        } catch {}

        return res;
      } catch (err) {
        clearAuth();
        const n = normalizeApiError(err);
        const detail = typeof n.detail === "string" ? n.detail : undefined;

        if (n.status === 401) throw new Error("Invalid username or password");
        if (n.status === 422) throw new Error(detail || "Invalid input data");
        if (n.status === 429) throw new Error("Too many attempts. Please wait and try again.");
        if (n.status >= 500) throw new Error("Server error. Please try again later.");

        throw new Error(detail || n.message || "Login failed");
      }
    },
    [applyToken, clearAuth]
  );

  const logout = useCallback(() => {
    clearAuth();
    toast.success("Signed out successfully");
  }, [clearAuth]);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        await wakeApi();
        await checkApiHealth();
      } catch (error) {
        console.error("API initialization failed:", error);
      }
    };

    initializeApi();
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
      apiFetch: api,
      checkApiHealth,
      // ✅ expose keys in case you want them elsewhere
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


// //========================================================
// // ========================================
// // AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/AuthContext.js
// // Author: OneTechly
// // Updated: January 2026

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
// const PASSWORD_MAX_LEN = Number(process.env.REACT_APP_PASSWORD_MAX_LEN || 128);

// function safeJsonParse(str, fallback = null) {
//   try {
//     return JSON.parse(str);
//   } catch {
//     return fallback;
//   }
// }

// function normalizeApiError(err) {
//   const out = {
//     status: undefined,
//     detail: undefined,
//     message: "Request failed",
//     raw: err,
//   };

//   if (!err) return out;

//   const axiosStatus = err?.response?.status;
//   const axiosDetail = err?.response?.data?.detail ?? err?.response?.data?.message;
//   if (axiosStatus) {
//     out.status = axiosStatus;
//     out.detail = axiosDetail;
//     out.message = typeof axiosDetail === "string" ? axiosDetail : (err.message || out.message);
//     return out;
//   }

//   if (typeof err?.status === "number") {
//     out.status = err.status;
//     const d = err?.detail ?? err?.data?.detail ?? err?.message;
//     out.detail = d;
//     out.message = typeof d === "string" ? d : (err.message || out.message);
//     return out;
//   }

//   if (typeof err?.message === "string") {
//     out.message = err.message;
//     return out;
//   }

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
//         api.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
//         localStorage.setItem(TOKEN_KEY, tok);
//       } else {
//         delete api.defaults.headers.common["Authorization"];
//         localStorage.removeItem(TOKEN_KEY);
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
//       const response = await fetch(`${base}/health`, { 
//         cache: "no-store",
//         signal: AbortSignal.timeout(5000)
//       });
      
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
//   }, []);

//   useEffect(() => {
//     if (isInitialized.current) {
//       console.log("⚠️ Auth already initialized, skipping...");
//       return;
//     }
//     isInitialized.current = true;

//     const initializeAuth = async () => {
//       console.log("🚀 Initializing authentication...");
      
//       try {
//         const savedToken = localStorage.getItem(TOKEN_KEY) || "";
//         const savedUserRaw = localStorage.getItem(USER_KEY);

//         checkApiHealth().catch(e => console.warn("Health check failed:", e));

//         if (savedToken) {
//           if (!isMounted.current) return;
          
//           setToken(savedToken);
//           applyToken(savedToken);

//           try {
//             console.log("🔍 Validating saved token...");
//             const me = await apiGetJson("/users/me");
            
//             if (!isMounted.current) return;
            
//             if (me) {
//               console.log("✅ Token valid, user loaded:", me.username);
//               setUser(me);
//               try {
//                 localStorage.setItem(USER_KEY, JSON.stringify(me));
//               } catch (e) {
//                 console.warn("Failed to save user to storage:", e);
//               }
//             } else {
//               console.log("⚠️ Token validation returned no user");
//               clearAuth();
//             }
//           } catch (e) {
//             console.error("❌ Token validation failed:", e);
//             clearAuth();
//           }
//         } else {
//           console.log("ℹ️ No saved token found");
          
//           if (savedUserRaw) {
//             const parsed = safeJsonParse(savedUserRaw, null);
//             if (parsed && typeof parsed === "object") {
//               setUser(parsed);
//             } else {
//               try {
//                 localStorage.removeItem(USER_KEY);
//               } catch {}
//             }
//           }
//         }
//       } catch (error) {
//         console.error("❌ Auth initialization error:", error);
//       } finally {
//         if (isMounted.current) {
//           console.log("✅ Auth initialization complete");
//           setIsLoading(false);
//         }
//       }
//     };

//     initializeAuth();
//   }, [applyToken, checkApiHealth, clearAuth]);

//   const register = useCallback(
//     async (username, email, password) => {
//       console.log("🔵 Register called:", { username, email });

//       const u = (username || "").trim();
//       const e = (email || "").trim().toLowerCase();
//       const p = (password || "");

//       if (!u || !e || !p) {
//         throw new Error("Please fill in all fields");
//       }

//       if (p.length > PASSWORD_MAX_LEN) {
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
//       }

//       if (p.length < 8) {
//         throw new Error("Password must be at least 8 characters");
//       }

//       const body = { username: u, email: e, password: p };

//       try {
//         console.log("📡 Sending registration request...");
//         const res = await apiPostJson("/register", body);
//         console.log("✅ Registration successful");

//         if (res?.access_token) {
//           applyToken(res.access_token);
//           setToken(res.access_token);

//           try {
//             const me = await apiGetJson("/users/me");
//             if (me && isMounted.current) {
//               setUser(me);
//               localStorage.setItem(USER_KEY, JSON.stringify(me));
//             } else if (res.account || res.user) {
//               const userData = res.account || res.user;
//               setUser(userData);
//               localStorage.setItem(USER_KEY, JSON.stringify(userData));
//             }
//           } catch (e) {
//             console.error("Failed to fetch user after registration:", e);
//             if (res.account || res.user) {
//               const userData = res.account || res.user;
//               setUser(userData);
//               localStorage.setItem(USER_KEY, JSON.stringify(userData));
//             }
//           }
//         }

//         return res;
//       } catch (err) {
//         console.error("❌ Registration error:", err);
//         clearAuth();

//         const n = normalizeApiError(err);
//         const detail = typeof n.detail === "string" ? n.detail : undefined;

//         if (n.status === 400) {
//           throw new Error(detail || "Username or email already exists");
//         }
//         if (n.status === 422) throw new Error(detail || "Invalid input data");
//         if (n.status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (n.status >= 500) throw new Error("Server error. Please try again later.");

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

//   const login = useCallback(
//     async (username, password) => {
//       console.log("🔵 Login called:", { username });

//       const u = (username || "").trim();
//       const p = (password || "");

//       if (!u || !p) {
//         throw new Error("Please enter both username and password");
//       }

//       if (p.length > PASSWORD_MAX_LEN) {
//         throw new Error(`Password must be at most ${PASSWORD_MAX_LEN} characters`);
//       }

//       const body = { username: u, password: p };

//       try {
//         console.log("📡 Sending login request...");
//         const res = await apiPostJson("/token_json", body);
//         console.log("✅ Login successful");

//         if (!res?.access_token) {
//           throw new Error("Invalid login response from server");
//         }

//         applyToken(res.access_token);
//         setToken(res.access_token);

//         try {
//           const me = await apiGetJson("/users/me");
//           if (me && isMounted.current) {
//             setUser(me);
//             localStorage.setItem(USER_KEY, JSON.stringify(me));
//           } else if (res.user) {
//             setUser(res.user);
//             localStorage.setItem(USER_KEY, JSON.stringify(res.user));
//           }
//         } catch (e) {
//           console.error("Failed to fetch user after login:", e);
//           if (res.user) {
//             setUser(res.user);
//             localStorage.setItem(USER_KEY, JSON.stringify(res.user));
//           }
//         }

//         return res;
//       } catch (err) {
//         console.error("❌ Login error:", err);
//         clearAuth();

//         const n = normalizeApiError(err);
//         const detail = typeof n.detail === "string" ? n.detail : undefined;

//         if (n.status === 401) throw new Error("Invalid username or password");
//         if (n.status === 422) throw new Error(detail || "Invalid input data");
//         if (n.status === 429) throw new Error("Too many attempts. Please wait and try again.");
//         if (n.status >= 500) throw new Error("Server error. Please try again later.");

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

//   const logout = useCallback(() => {
//     console.log("👋 Logging out...");
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

