// ========================================
// AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/contexts/AuthContext.js
// Author: OneTechly
// Updated: February 2026 - PRODUCTION READY
//
// ✅ FIXES APPLIED (preserved):
// - Consistent token storage (auth_token)
// - Firefox compatibility (credentials: 'include')
// - Proper error handling
// - localStorage fallback detection
// - Unmount guard
// - StrictMode double-invocation guard (didInit ref)
// - Internal _clearAuth helper
// - AbortController + timeouts + safety-net
//
// ✅ NEW (this patch):
// - Production-safe API_URL fallback => https://api.pixelperfectapi.net
//   (prevents accidental localhost calls in production)
// ========================================

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

const AuthContext = createContext();

function resolveApiUrl() {
  const env = process.env.REACT_APP_API_URL;
  if (env && typeof env === "string" && env.trim()) return env.trim();

  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    // Production domain → production API
    if (host === "pixelperfectapi.net" || host.endsWith(".pixelperfectapi.net")) {
      return "https://api.pixelperfectapi.net";
    }

    // True localhost → localhost backend
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000";
    }

    // ✅ LAN IP (e.g. 192.168.1.185 on mobile) → use same IP for backend
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
      return `http://${host}:8000`;
    }

    // Generic hostname fallback
    return `${window.location.protocol}//${host}:8000`;
  }

  return "http://localhost:8000";
}

// function resolveApiUrl() {
//   const env = process.env.REACT_APP_API_URL;

//   // If env is set, always trust it
//   if (env && typeof env === "string" && env.trim()) return env.trim();

//   // Production-safe fallback (IMPORTANT)
//   if (typeof window !== "undefined") {
//     const host = window.location.hostname;
//     const isLocal =
//       host === "localhost" ||
//       host === "127.0.0.1" ||
//       host.startsWith("192.168.") ||
//       host.endsWith(".local");

//     if (!isLocal) return "https://api.pixelperfectapi.net";
//   }

//   // Local dev fallback
//   return "http://localhost:8000";
// }

const API_URL = resolveApiUrl();
const TOKEN_KEY = "auth_token";

// Timeout for /users/me validation (ms). Must be less than safety net below.
const FETCH_USER_TIMEOUT_MS = 10_000; // 10 seconds

// Absolute safety net: if isLoading is still true after this, force it false.
const LOADING_SAFETY_NET_MS = 15_000; // 15 seconds

// ✅ FIREFOX FIX: Detect if localStorage is available (blocked in private mode)
const isLocalStorageAvailable = () => {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn(
      "⚠️ localStorage not available (Firefox private mode?), using sessionStorage"
    );
    return false;
  }
};

// ✅ Use sessionStorage as fallback
const storage = isLocalStorageAvailable() ? localStorage : sessionStorage;

// Small helper: safe JSON parsing
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Derive isAuthenticated from token + user (prevents "true" before profile)
  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  const [isLoading, setIsLoading] = useState(true);

  // Optional: expose basic api status if you ever want to show it
  const [apiStatus, setApiStatus] = useState("unknown"); // "unknown" | "healthy" | "unreachable"

  // Unmount guard
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // StrictMode guard
  const didInit = useRef(false);

  // ✅ Safety net: force-clear isLoading if still stuck after LOADING_SAFETY_NET_MS.
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading((prev) => {
          if (prev) {
            console.warn(
              `⚠️ AuthContext: isLoading still true after ${LOADING_SAFETY_NET_MS}ms — force-clearing.`
            );
          }
          return false;
        });
      }
    }, LOADING_SAFETY_NET_MS);

    return () => clearTimeout(safetyTimer);
  }, []);

  // Internal clear (stable)
  const _clearAuth = useCallback(() => {
    storage.removeItem(TOKEN_KEY);
    if (isMounted.current) {
      setToken(null);
      setUser(null);
      setApiStatus("unknown");
    }
  }, []);

  // Merge user safely
  const _setUserMerged = useCallback((incoming) => {
    if (!isMounted.current) return;

    setUser((prev) => {
      if (!prev) return incoming || null;
      if (!incoming) return prev;
      return { ...prev, ...incoming };
    });
  }, []);

  // Fetch current user profile and validate token
  const fetchUser = useCallback(
    async (authToken) => {
      if (!authToken) {
        _clearAuth();
        if (isMounted.current) setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        FETCH_USER_TIMEOUT_MS
      );

      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!isMounted.current) return;

        if (response.ok) {
          setApiStatus("healthy");
          const userData = await safeJson(response);

          if (isMounted.current) {
            setToken(authToken);
            _setUserMerged(userData);
          }
        } else {
          console.warn("❌ Token validation failed, clearing auth");
          _clearAuth();
        }
      } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === "AbortError") {
          console.warn(
            `⚠️ fetchUser timed out after ${FETCH_USER_TIMEOUT_MS}ms — backend may be restarting`
          );
        } else {
          console.error("❌ Failed to fetch user:", error);
        }

        if (isMounted.current) setApiStatus("unreachable");
        _clearAuth();
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [_clearAuth, _setUserMerged]
  );

  // Init
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const storedToken = storage.getItem(TOKEN_KEY);

    if (storedToken) {
      fetchUser(storedToken);
    } else {
      if (isMounted.current) setIsLoading(false);
    }
  }, [fetchUser]);

  // Login
  const login = useCallback(
    async (username, password) => {
      if (isMounted.current) setIsLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        FETCH_USER_TIMEOUT_MS
      );

      try {
        const response = await fetch(`${API_URL}/token_json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await safeJson(response);
          const errorMessage =
            errorData.detail || `Login failed: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await safeJson(response);

        const newToken = data.access_token;
        if (!newToken) throw new Error("Login failed: missing access token");

        storage.setItem(TOKEN_KEY, newToken);

        if (!isMounted.current) return;

        setToken(newToken);
        if (data.user) _setUserMerged(data.user);

        await fetchUser(newToken);
      } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === "AbortError") {
          console.warn("⚠️ Login request timed out — backend may be slow");
          _clearAuth();
          if (isMounted.current) setIsLoading(false);
          throw new Error("Login timed out. Please try again.");
        }

        console.error("❌ Login error:", error);
        _clearAuth();
        if (isMounted.current) setIsLoading(false);
        throw error;
      }
    },
    [_clearAuth, _setUserMerged, fetchUser]
  );

  // Register
  const register = useCallback(
    async (username, email, password) => {
      if (isMounted.current) setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
          const errorData = await safeJson(response);
          const errorMessage =
            errorData.detail || `Registration failed: ${response.status}`;
          throw new Error(errorMessage);
        }

        await login(username, password);
      } catch (error) {
        console.error("❌ Registration error:", error);
        if (isMounted.current) setIsLoading(false);
        throw error;
      }
    },
    [login]
  );

  // Logout
  const logout = useCallback(() => {
    _clearAuth();
  }, [_clearAuth]);

  // Helper to get current token
  const getToken = useCallback(() => {
    return token || storage.getItem(TOKEN_KEY);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      isLoading,
      apiStatus,
      login,
      register,
      logout,
      getToken,
    }),
    [
      token,
      user,
      isAuthenticated,
      isLoading,
      apiStatus,
      login,
      register,
      logout,
      getToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthContext;

