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
// - Unmount guard (prevents setState on unmounted component)
// - StrictMode double-invocation guard (didInit ref)
// - Internal _clearAuth helper decouples logout from fetchUser
//
// ✅ IMPORTANT FIX (Member Since / user hydration):
// - isLoading stays true until /users/me has returned (or failed)
// - user is merged safely to avoid partial/undefined fields (created_at)
// ========================================

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from "react";

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const TOKEN_KEY = "auth_token";

// ✅ FIREFOX FIX: Detect if localStorage is available (blocked in private mode)
const isLocalStorageAvailable = () => {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn("⚠️ localStorage not available (Firefox private mode?), using sessionStorage");
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

  // Internal clear (stable)
  const _clearAuth = useCallback(() => {
    storage.removeItem(TOKEN_KEY);
    if (isMounted.current) {
      setToken(null);
      setUser(null);
    }
  }, []);

  // Merge user safely (prevents losing created_at if response is partial)
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

      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!isMounted.current) return;

        if (response.ok) {
          const userData = await safeJson(response);

          // ✅ Set token (confirmed valid) + merge user
          if (isMounted.current) {
            setToken(authToken);
            _setUserMerged(userData);
          }
        } else {
          // Token invalid/expired
          console.warn("❌ Token validation failed, clearing auth");
          _clearAuth();
        }
      } catch (error) {
        console.error("❌ Failed to fetch user:", error);
        _clearAuth();
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [_clearAuth, _setUserMerged]
  );

  // Init: load stored token and validate it (keeps loading true until done)
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const storedToken = storage.getItem(TOKEN_KEY);

    if (storedToken) {
      // Keep isLoading true until fetchUser finishes
      fetchUser(storedToken);
    } else {
      if (isMounted.current) setIsLoading(false);
    }
  }, [fetchUser]);

  // Login
  const login = useCallback(
    async (username, password) => {
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/token_json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          const errorData = await safeJson(response);
          const errorMessage = errorData.detail || `Login failed: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await safeJson(response);

        // Expect: data.access_token and (maybe) data.user
        const newToken = data.access_token;
        if (!newToken) throw new Error("Login failed: missing access token");

        storage.setItem(TOKEN_KEY, newToken);

        if (isMounted.current) {
          setToken(newToken);

          // If backend returns user, store it immediately (fast UI),
          // BUT still optionally refresh via /users/me for canonical profile.
          if (data.user) {
            _setUserMerged(data.user);
            // If created_at sometimes missing, fetch canonical profile in background
            fetchUser(newToken);
          } else {
            await fetchUser(newToken);
          }
        }
      } catch (error) {
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
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
          const errorData = await safeJson(response);
          const errorMessage = errorData.detail || `Registration failed: ${response.status}`;
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

  const value = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    getToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthContext;

//===========================================================
// // ========================================
// // AUTH CONTEXT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/contexts/AuthContext.js
// // Author: OneTechly
// // Updated: February 2026 - PRODUCTION READY
// //
// // ✅ FIXES APPLIED:
// // - Consistent token storage (auth_token)
// // - Firefox compatibility (credentials: 'include')
// // - Proper error handling
// // - Token validation before redirect
// // - localStorage fallback detection
// // - ✅ NEW: Unmount guard (prevents setState on unmounted component)
// // - ✅ NEW: StrictMode double-invocation guard (didInit ref)
// // - ✅ NEW: Fixed circular dependency in fetchUser/logout useCallback
// // - ✅ NEW: Internal _clearAuth helper decouples logout from fetchUser
// // ========================================

// import React, {
//   createContext,
//   useState,
//   useContext,
//   useEffect,
//   useRef,
//   useCallback,
// } from 'react';

// const AuthContext = createContext();

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// // ✅ Consistent token key across the entire app
// const TOKEN_KEY = 'auth_token';

// // ✅ FIREFOX FIX: Detect if localStorage is available (blocked in private mode)
// const isLocalStorageAvailable = () => {
//   try {
//     const test = '__test__';
//     localStorage.setItem(test, test);
//     localStorage.removeItem(test);
//     return true;
//   } catch (e) {
//     console.warn('⚠️ localStorage not available (Firefox private mode?), using sessionStorage');
//     return false;
//   }
// };

// // ✅ FIREFOX FIX: Use sessionStorage as fallback
// const storage = isLocalStorageAvailable() ? localStorage : sessionStorage;

// export function AuthProvider({ children }) {
//   const [token, setToken]               = useState(null);
//   const [user, setUser]                 = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading]       = useState(true);

//   // ✅ FIX 1: Unmount guard — prevents setState after component unmounts
//   //    (critical on mobile where navigations happen before slow fetches resolve)
//   const isMounted = useRef(true);
//   useEffect(() => {
//     isMounted.current = true;
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   // ✅ FIX 2: StrictMode guard — prevents double-init in React.StrictMode
//   //    (StrictMode runs effects twice in development, causing two concurrent fetchUser calls)
//   const didInit = useRef(false);

//   // ✅ FIX 3: Internal _clearAuth — used by fetchUser and logout
//   //    Decouples the two functions so neither depends on the other in useCallback deps.
//   //    Using useRef so it's always stable and never stale.
//   const _clearAuth = useCallback(() => {
//     storage.removeItem(TOKEN_KEY);
//     if (isMounted.current) {
//       setToken(null);
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   }, []);

//   // ✅ FIX 4: fetchUser no longer calls logout() directly — uses _clearAuth instead
//   //    This eliminates the missing dependency in the original useCallback array.
//   const fetchUser = useCallback(async (authToken) => {
//     console.log('👤 Fetching user info...');

//     try {
//       const response = await fetch(`${API_URL}/users/me`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${authToken}`,
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // ✅ CRITICAL for Firefox
//       });

//       // Guard: don't update state if component unmounted during async fetch
//       if (!isMounted.current) return;

//       if (response.ok) {
//         const userData = await response.json();
//         console.log('✅ User verified:', userData.username);
//         if (isMounted.current) {
//           setUser(userData);
//           setIsAuthenticated(true);
//         }
//       } else {
//         // Token invalid or expired — clear silently
//         console.warn('❌ Token validation failed, clearing auth');
//         _clearAuth();
//       }
//     } catch (error) {
//       console.error('❌ Failed to fetch user:', error);
//       if (isMounted.current) {
//         _clearAuth();
//       }
//     } finally {
//       // Always mark loading as done, even if unmounted (safe — React ignores it)
//       if (isMounted.current) {
//         setIsLoading(false);
//       }
//     }
//   }, [_clearAuth]);

//   // ✅ FIX 5: didInit ref prevents StrictMode from running init twice
//   useEffect(() => {
//     if (didInit.current) return;
//     didInit.current = true;

//     console.log('🔐 AuthContext: Initializing...');
//     const storedToken = storage.getItem(TOKEN_KEY);

//     if (storedToken) {
//       console.log('✅ Found stored token, verifying...');
//       setToken(storedToken);
//       fetchUser(storedToken);
//     } else {
//       console.log('ℹ️ No stored token found');
//       setIsLoading(false);
//     }
//   }, [fetchUser]);

//   // ✅ Login — unchanged logic, just with isMounted guard added
//   const login = useCallback(async (username, password) => {
//     console.log('🔐 Attempting login:', username);

//     try {
//       const response = await fetch(`${API_URL}/token_json`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // ✅ CRITICAL for Firefox
//         body: JSON.stringify({ username, password }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         const errorMessage = errorData.detail || `Login failed: ${response.status}`;
//         console.error('❌ Login failed:', errorMessage);
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       console.log('✅ Login response received');

//       storage.setItem(TOKEN_KEY, data.access_token);
//       console.log('💾 Token saved to storage');

//       if (isMounted.current) {
//         setToken(data.access_token);
//         setUser(data.user);
//         setIsAuthenticated(true);
//       }

//       console.log('✅ Login successful:', data.user?.username);
//     } catch (error) {
//       console.error('❌ Login error:', error);
//       _clearAuth();
//       throw error;
//     }
//   }, [_clearAuth]);

//   // ✅ Register — unchanged logic
//   const register = useCallback(async (username, email, password) => {
//     console.log('📝 Attempting registration:', username);

//     try {
//       const response = await fetch(`${API_URL}/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // ✅ CRITICAL for Firefox
//         body: JSON.stringify({ username, email, password }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         const errorMessage = errorData.detail || `Registration failed: ${response.status}`;
//         console.error('❌ Registration failed:', errorMessage);
//         throw new Error(errorMessage);
//       }

//       console.log('✅ Registration successful, logging in...');
//       await login(username, password);
//     } catch (error) {
//       console.error('❌ Registration error:', error);
//       throw error;
//     }
//   }, [login]);

//   // ✅ Public logout — calls _clearAuth, keeps same API surface for consumers
//   const logout = useCallback(() => {
//     console.log('🚪 Logging out...');
//     _clearAuth();
//   }, [_clearAuth]);

//   // ✅ Helper to get current token
//   const getToken = useCallback(() => {
//     return token || storage.getItem(TOKEN_KEY);
//   }, [token]);

//   const value = {
//     token,
//     user,
//     isAuthenticated,
//     isLoading,
//     login,
//     register,
//     logout,
//     getToken,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }

// export default AuthContext;

