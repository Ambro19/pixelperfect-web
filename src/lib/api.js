// ========================================
// API CLIENT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/lib/api.js
// Author: OneTechly
// Updated: March 2026 - Production-ready
//
// Single source of truth for all frontend API traffic.
// Long-term production architecture:
// - Env vars first
// - Production domain mapping second
// - Localhost/LAN fallback last
// - Centralized auth, retries, and error normalization
// ========================================

import axios from "axios";

const TOKEN_KEY = "auth_token";
const LEGACY_TOKEN_KEY = "token";

function isIpv4(host) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
}

function stripSlash(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function resolveBaseURL() {
  // 1) Explicit env override (highest priority)
  const envBase = (
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    ""
  ).trim();

  if (envBase) {
    const resolved = stripSlash(envBase);
    console.log("[PixelPerfect API] Using env base URL:", resolved);
    return resolved;
  }

  // 2) Browser-based fallback
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;

    console.log("[PixelPerfect API] Detecting runtime host:", {
      host,
      protocol,
      port,
    });

    // Production site → production API
    if (host === "pixelperfectapi.net" || host.endsWith(".pixelperfectapi.net")) {
      return "https://api.pixelperfectapi.net";
    }

    // Local dev on same machine
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000";
    }

    // LAN fallback for explicit IP access during local testing
    if (isIpv4(host)) {
      return `http://${host}:8000`;
    }

    // Generic HTTP hostname fallback
    if (protocol === "http:") {
      return `http://${host}:8000`;
    }

    // HTTPS fallback
    return `https://${host}:8000`;
  }

  // 3) Safe default
  return "http://localhost:8000";
}

const baseURL = stripSlash(resolveBaseURL());

console.log("[PixelPerfect API] Base URL configured:", baseURL);
console.log("[PixelPerfect API] Environment snapshot:", {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL || "(not set)",
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "(not set)",
  currentPage: typeof window !== "undefined" ? window.location.href : "(no-window)",
});

// ----------------------------------------
// Axios instance
// ----------------------------------------
export const api = axios.create({
  baseURL,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT || 30000),
});

// ----------------------------------------
// Request interceptor
// ----------------------------------------
api.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem(TOKEN_KEY) ||
        localStorage.getItem(LEGACY_TOKEN_KEY);

      if (token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (process.env.REACT_APP_VERBOSE_API_LOGS === "true") {
        console.log(
          `[PixelPerfect API] → ${config.method?.toUpperCase()} ${config.baseURL || ""}${config.url || ""}`
        );
      }
    } catch (err) {
      console.warn("[PixelPerfect API] Failed to attach token:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------
// Response interceptor
// ----------------------------------------
api.interceptors.response.use(
  (response) => {
    if (process.env.REACT_APP_VERBOSE_API_LOGS === "true") {
      console.log(
        `[PixelPerfect API] ← ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`
      );
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const method = error?.config?.method?.toUpperCase() || "UNKNOWN";
    const url = error?.config?.url || "(unknown-url)";

    if (status) {
      console.error(`[PixelPerfect API] ${method} ${url} failed with status ${status}`);
    } else {
      console.error(`[PixelPerfect API] ${method} ${url} failed with network error`);
    }

    return Promise.reject(error);
  }
);

// ----------------------------------------
// Error normalization
// ----------------------------------------
function pickFastApiDetail(data) {
  if (!data) return "";
  if (typeof data === "string") return data;

  const detail = data?.detail ?? data?.message ?? data?.error ?? "";

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message || "")
      .filter(Boolean)
      .join(", ");
  }

  return "";
}

function normalizeError(err) {
  const response = err?.response;
  const data = response?.data;
  const status = response?.status;
  const code = err?.code;

  const detail = pickFastApiDetail(data);
  const message =
    detail ||
    (status
      ? `Request failed with status ${status}`
      : code
      ? `Network error (${code})`
      : "Network error");

  const wrapped = new Error(message);
  wrapped.status = status;
  wrapped.code = code;
  wrapped.data = data;
  wrapped.original = err;
  return wrapped;
}

// ----------------------------------------
// Retry wrapper
// ----------------------------------------
async function withRetry(
  fn,
  {
    attempts = Number(process.env.REACT_APP_API_RETRY_ATTEMPTS || 3),
    firstDelayMs = 800,
    maxDelayMs = 6000,
    shouldRetry = (rawErr) => {
      const status = rawErr?.response?.status;

      // Retry network failures
      if (!rawErr?.response) return true;

      // Retry transient failures only
      return status === 429 || status === 503 || status === 504;
    },
  } = {}
) {
  let delay = firstDelayMs;
  let lastErr;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;

      const retryAllowed = i < attempts - 1 && shouldRetry(err);
      if (!retryAllowed) break;

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
    }
  }

  throw normalizeError(lastErr);
}

// ----------------------------------------
// JSON helpers
// ----------------------------------------
export async function apiGetJson(path, config = {}) {
  return withRetry(async () => {
    const response = await api.get(path, config);
    return response.data;
  });
}

export async function apiPostJson(path, body, config = {}) {
  return withRetry(async () => {
    const response = await api.post(path, body, {
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
      ...config,
    });
    return response.data;
  });
}

export async function apiPutJson(path, body, config = {}) {
  return withRetry(async () => {
    const response = await api.put(path, body, {
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
      ...config,
    });
    return response.data;
  });
}

export async function apiDelete(path, config = {}) {
  return withRetry(async () => {
    const response = await api.delete(path, config);
    return response.data;
  });
}

// ----------------------------------------
// FormData helper (important for file upload)
// ----------------------------------------
export async function apiPostForm(path, formData, config = {}) {
  return withRetry(async () => {
    const response = await api.post(path, formData, {
      headers: {
        ...(config.headers || {}),
      },
      ...config,
    });
    return response.data;
  });
}

// ----------------------------------------
// Wake API
// ----------------------------------------
export async function wakeApi() {
  console.log("[PixelPerfect API] Waking API...");
  try {
    await withRetry(
      () => api.get("/health", { validateStatus: () => true }),
      { attempts: 6, firstDelayMs: 600 }
    );
    console.log("[PixelPerfect API] API is awake");
    return true;
  } catch (err) {
    console.warn("[PixelPerfect API] API wake failed:", err?.message || err);
    return false;
  }
}

// ----------------------------------------
// Debug helper
// ----------------------------------------
export function currentApiBase() {
  return baseURL;
}




// // ========================================
// // API CLIENT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/lib/api.js
// // Author: OneTechly
// // Updated: March 2026 - Production-ready
// //
// // Single source of truth for all frontend API traffic.
// // Long-term production architecture:
// // - Env vars first
// // - Production domain mapping second
// // - Localhost/LAN fallback last
// // - Centralized auth, retries, and error normalization
// // ========================================

// import axios from "axios";

// const TOKEN_KEY = "auth_token";
// const LEGACY_TOKEN_KEY = "token";

// function isIpv4(host) {
//   return /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
// }

// function stripSlash(value) {
//   return String(value || "").trim().replace(/\/+$/, "");
// }

// function resolveBaseURL() {
//   // 1) Explicit env override (highest priority)
//   const envBase = (
//     process.env.REACT_APP_API_BASE_URL ||
//     process.env.REACT_APP_API_URL ||
//     ""
//   ).trim();

//   if (envBase) {
//     const resolved = stripSlash(envBase);
//     console.log("[PixelPerfect API] Using env base URL:", resolved);
//     return resolved;
//   }

//   // 2) Browser-based fallback
//   if (typeof window !== "undefined" && window.location) {
//     const host = window.location.hostname;
//     const protocol = window.location.protocol;
//     const port = window.location.port;

//     console.log("[PixelPerfect API] Detecting runtime host:", {
//       host,
//       protocol,
//       port,
//     });

//     // Production site → production API
//     if (host === "pixelperfectapi.net" || host.endsWith(".pixelperfectapi.net")) {
//       return "https://api.pixelperfectapi.net";
//     }

//     // Local dev on same machine
//     if (host === "localhost" || host === "127.0.0.1") {
//       return "http://localhost:8000";
//     }

//     // LAN fallback for explicit IP access during local testing
//     if (isIpv4(host)) {
//       return `http://${host}:8000`;
//     }

//     // Generic HTTP hostname fallback
//     if (protocol === "http:") {
//       return `http://${host}:8000`;
//     }

//     // HTTPS fallback
//     return `https://${host}:8000`;
//   }

//   // 3) Safe default
//   return "http://localhost:8000";
// }

// const baseURL = stripSlash(resolveBaseURL());

// console.log("[PixelPerfect API] Base URL configured:", baseURL);
// console.log("[PixelPerfect API] Environment snapshot:", {
//   REACT_APP_API_URL: process.env.REACT_APP_API_URL || "(not set)",
//   REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "(not set)",
//   currentPage: typeof window !== "undefined" ? window.location.href : "(no-window)",
// });

// // ----------------------------------------
// // Axios instance
// // ----------------------------------------
// export const api = axios.create({
//   baseURL,
//   timeout: Number(process.env.REACT_APP_API_TIMEOUT || 30000),
// });

// // ----------------------------------------
// // Request interceptor
// // ----------------------------------------
// api.interceptors.request.use(
//   (config) => {
//     try {
//       const token =
//         localStorage.getItem(TOKEN_KEY) ||
//         localStorage.getItem(LEGACY_TOKEN_KEY);

//       if (token && !config.headers?.Authorization) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }

//       if (process.env.REACT_APP_VERBOSE_API_LOGS === "true") {
//         console.log(
//           `[PixelPerfect API] → ${config.method?.toUpperCase()} ${config.baseURL || ""}${config.url || ""}`
//         );
//       }
//     } catch (err) {
//       console.warn("[PixelPerfect API] Failed to attach token:", err);
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ----------------------------------------
// // Response interceptor
// // ----------------------------------------
// api.interceptors.response.use(
//   (response) => {
//     if (process.env.REACT_APP_VERBOSE_API_LOGS === "true") {
//       console.log(
//         `[PixelPerfect API] ← ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`
//       );
//     }
//     return response;
//   },
//   (error) => {
//     const status = error?.response?.status;
//     const method = error?.config?.method?.toUpperCase() || "UNKNOWN";
//     const url = error?.config?.url || "(unknown-url)";

//     if (status) {
//       console.error(`[PixelPerfect API] ${method} ${url} failed with status ${status}`);
//     } else {
//       console.error(`[PixelPerfect API] ${method} ${url} failed with network error`);
//     }

//     return Promise.reject(error);
//   }
// );

// // ----------------------------------------
// // Error normalization
// // ----------------------------------------
// function pickFastApiDetail(data) {
//   if (!data) return "";
//   if (typeof data === "string") return data;

//   const detail = data?.detail ?? data?.message ?? data?.error ?? "";

//   if (typeof detail === "string") return detail;

//   if (Array.isArray(detail)) {
//     return detail
//       .map((item) => item?.msg || item?.message || "")
//       .filter(Boolean)
//       .join(", ");
//   }

//   return "";
// }

// function normalizeError(err) {
//   const response = err?.response;
//   const data = response?.data;
//   const status = response?.status;
//   const code = err?.code;

//   const detail = pickFastApiDetail(data);
//   const message =
//     detail ||
//     (status
//       ? `Request failed with status ${status}`
//       : code
//       ? `Network error (${code})`
//       : "Network error");

//   const wrapped = new Error(message);
//   wrapped.status = status;
//   wrapped.code = code;
//   wrapped.data = data;
//   wrapped.original = err;
//   return wrapped;
// }

// // ----------------------------------------
// // Retry wrapper
// // ----------------------------------------
// async function withRetry(
//   fn,
//   {
//     attempts = Number(process.env.REACT_APP_API_RETRY_ATTEMPTS || 3),
//     firstDelayMs = 800,
//     maxDelayMs = 6000,
//     shouldRetry = (rawErr) => {
//       const status = rawErr?.response?.status;

//       // Retry network failures
//       if (!rawErr?.response) return true;

//       // Retry transient failures only
//       return status === 429 || status === 503 || status === 504;
//     },
//   } = {}
// ) {
//   let delay = firstDelayMs;
//   let lastErr;

//   for (let i = 0; i < attempts; i++) {
//     try {
//       return await fn();
//     } catch (err) {
//       lastErr = err;

//       const retryAllowed = i < attempts - 1 && shouldRetry(err);
//       if (!retryAllowed) break;

//       await new Promise((resolve) => setTimeout(resolve, delay));
//       delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
//     }
//   }

//   throw normalizeError(lastErr);
// }

// // ----------------------------------------
// // JSON helpers
// // ----------------------------------------
// export async function apiGetJson(path, config = {}) {
//   return withRetry(async () => {
//     const response = await api.get(path, config);
//     return response.data;
//   });
// }

// export async function apiPostJson(path, body, config = {}) {
//   return withRetry(async () => {
//     const response = await api.post(path, body, {
//       headers: {
//         "Content-Type": "application/json",
//         ...(config.headers || {}),
//       },
//       ...config,
//     });
//     return response.data;
//   });
// }

// export async function apiPutJson(path, body, config = {}) {
//   return withRetry(async () => {
//     const response = await api.put(path, body, {
//       headers: {
//         "Content-Type": "application/json",
//         ...(config.headers || {}),
//       },
//       ...config,
//     });
//     return response.data;
//   });
// }

// export async function apiDelete(path, config = {}) {
//   return withRetry(async () => {
//     const response = await api.delete(path, config);
//     return response.data;
//   });
// }

// // ----------------------------------------
// // FormData helper (important for file upload)
// // ----------------------------------------
// export async function apiPostForm(path, formData, config = {}) {
//   return withRetry(async () => {
//     const response = await api.post(path, formData, {
//       headers: {
//         ...(config.headers || {}),
//       },
//       ...config,
//     });
//     return response.data;
//   });
// }

// // ----------------------------------------
// // Wake API
// // ----------------------------------------
// export async function wakeApi() {
//   console.log("[PixelPerfect API] Waking API...");
//   try {
//     await withRetry(
//       () => api.get("/health", { validateStatus: () => true }),
//       { attempts: 6, firstDelayMs: 600 }
//     );
//     console.log("[PixelPerfect API] API is awake");
//     return true;
//   } catch (err) {
//     console.warn("[PixelPerfect API] API wake failed:", err?.message || err);
//     return false;
//   }
// }

// // ----------------------------------------
// // Debug helper
// // ----------------------------------------
// export function currentApiBase() {
//   return baseURL;
// }

//============================================================================================================
// // ========================================
// // API CLIENT - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/lib/api.js
// // Author: OneTechly
// // Updated: Feb 2026 - Production-ready
// //
// // Key fixes:
// // ✅ Correct API base when frontend is opened via LAN IP (192.168.x.x)
// // ✅ Env var override still works (REACT_APP_API_URL / REACT_APP_API_BASE_URL)
// // ✅ Enhanced logging for debugging
// // ✅ Keeps your FastAPI error detail parsing + safe retry rules
// // ========================================

// import axios from "axios";

// const TOKEN_KEY = "auth_token";
// const LEGACY_TOKEN_KEY = "token";

// function isIpv4(host) {
//   return /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
// }

// function stripSlash(u) {
//   return String(u || "").trim().replace(/\/+$/, "");
// }

// function resolveBaseURL() {
//   // 1) Explicit env override (preferred for CI/production builds)
//   const env =
//     (process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "").trim();
//   if (env) {
//     const url = stripSlash(env);
//     console.log("[PixelPerfect API] Using env override:", url);
//     return url;
//   }

//   // 2) Browser-derived auto mode
//   if (typeof window !== "undefined" && window.location) {
//     const host = window.location.hostname; // no port
//     const port = window.location.port;
//     const protocol = window.location.protocol; // http: or https:

//     console.log("[PixelPerfect API] Detecting environment:", { host, port, protocol });

//     // Prod domains → prod API
//     if (host === "pixelperfectapi.net" || host.endsWith(".pixelperfectapi.net")) {
//       console.log("[PixelPerfect API] Production domain detected");
//       return "https://api.pixelperfectapi.net";
//     }

//     // ✅ CRITICAL: Localhost detection (127.0.0.1 or localhost)
//     if (host === "localhost" || host === "127.0.0.1") {
//       const apiUrl = "http://localhost:8000";
//       console.log("[PixelPerfect API] Localhost detected →", apiUrl);
//       return apiUrl;
//     }

//     // ✅ CRITICAL: LAN IP → point to SAME host on :8000
//     if (isIpv4(host)) {
//       const apiUrl = `http://${host}:8000`;
//       console.log("[PixelPerfect API] LAN IP detected →", apiUrl);
//       return apiUrl;
//     }

//     // If someone serves frontend on a hostname in a LAN, try same hostname on :8000
//     // (Keeps HTTP to match most local FastAPI dev setups)
//     if (protocol === "http:") {
//       const apiUrl = `http://${host}:8000`;
//       console.log("[PixelPerfect API] HTTP hostname detected →", apiUrl);
//       return apiUrl;
//     }

//     // Fallback for HTTPS on unknown hostname (shouldn't happen)
//     console.warn("[PixelPerfect API] Unknown hostname, using HTTPS fallback");
//     return `https://${host}:8000`;
//   }

//   // 3) Safe dev default (SSR or node environment)
//   console.log("[PixelPerfect API] No window, using default");
//   return "http://localhost:8000";
// }

// const baseURL = stripSlash(resolveBaseURL());

// console.log("[PixelPerfect] ✅ API baseURL configured:", baseURL);
// console.log("[PixelPerfect] Environment check:", {
//   envApiUrl: process.env.REACT_APP_API_URL || "(not set)",
//   envApiBaseUrl: process.env.REACT_APP_API_BASE_URL || "(not set)",
//   currentPage: typeof window !== "undefined" ? window.location.href : "(no-window)",
// });

// // -----------------------
// // Axios instance
// // -----------------------
// export const api = axios.create({
//   baseURL,
//   timeout: Number(process.env.REACT_APP_API_TIMEOUT || 30000),
// });

// // Attach Bearer token from localStorage if present
// api.interceptors.request.use((config) => {
//   try {
//     const token =
//       localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

//     if (token && !config.headers?.Authorization) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log(`[PixelPerfect API] 🔐 Token attached to ${config.method?.toUpperCase()} ${config.url}`);
//     } else if (!token) {
//       console.log(`[PixelPerfect API] 🔓 No token for ${config.method?.toUpperCase()} ${config.url}`);
//     }
//   } catch (e) {
//     console.warn("[PixelPerfect API] Failed to attach token:", e);
//   }
//   return config;
// });

// // Response interceptor for debugging
// api.interceptors.response.use(
//   (response) => {
//     console.log(
//       `[PixelPerfect API] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`
//     );
//     return response;
//   },
//   (error) => {
//     const status = error?.response?.status;
//     const method = error?.config?.method?.toUpperCase();
//     const url = error?.config?.url;
    
//     if (status) {
//       console.error(`[PixelPerfect API] ❌ ${method} ${url} → ${status}`);
//     } else {
//       console.error(`[PixelPerfect API] ❌ ${method} ${url} → Network Error`);
//     }
    
//     return Promise.reject(error);
//   }
// );

// // -----------------------
// // Error normalization
// // -----------------------
// function pickFastApiDetail(data) {
//   if (!data) return "";
//   if (typeof data === "string") return data;

//   const d = data?.detail ?? data?.message ?? data?.error ?? "";
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

// function normalizeError(err) {
//   const res = err?.response;
//   const data = res?.data;

//   const status = res?.status;
//   const code = err?.code;

//   const detail = pickFastApiDetail(data);
//   const msg =
//     detail ||
//     (status
//       ? `Request failed with status ${status}`
//       : code
//       ? `Network error (${code})`
//       : "Network error");

//   const out = new Error(msg);
//   out.status = status;
//   out.code = code;
//   out.data = data;
//   out.original = err;
//   return out;
// }

// // -----------------------
// // Retry wrapper
// // -----------------------
// async function withRetry(
//   fn,
//   {
//     attempts = Number(process.env.REACT_APP_API_RETRY_ATTEMPTS || 3),
//     firstDelayMs = 800,
//     maxDelayMs = 6000,
//     shouldRetry = (rawAxiosErr) => {
//       const status = rawAxiosErr?.response?.status;

//       // No response => network/CORS/DNS/timeout, etc.
//       if (!rawAxiosErr?.response) {
//         console.log("[PixelPerfect API] 🔄 No response, will retry (network/CORS/timeout)");
//         return true;
//       }

//       // Retry only transient cases
//       const canRetry = status === 429 || status === 503 || status === 504;
//       if (canRetry) {
//         console.log(`[PixelPerfect API] 🔄 Status ${status}, will retry`);
//       }
//       return canRetry;
//     },
//   } = {}
// ) {
//   let delay = firstDelayMs;
//   let lastErr;

//   for (let i = 0; i < attempts; i++) {
//     try {
//       if (i > 0) {
//         console.log(`[PixelPerfect API] Retry attempt ${i + 1}/${attempts}`);
//       }
//       return await fn();
//     } catch (err) {
//       lastErr = err;
//       const canRetry = i < attempts - 1 && shouldRetry(err);
//       if (!canRetry) break;

//       console.log(`[PixelPerfect API] ⏱️ Waiting ${delay}ms before retry...`);
//       await new Promise((r) => setTimeout(r, delay));
//       delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
//     }
//   }

//   console.error("[PixelPerfect API] ❌ All retry attempts exhausted");
//   throw normalizeError(lastErr);
// }

// // -----------------------
// // API helpers
// // -----------------------
// export async function apiGetJson(path, config = {}) {
//   return withRetry(async () => {
//     const res = await api.get(path, config);
//     return res.data;
//   });
// }

// export async function apiPostJson(path, body, config = {}) {
//   return withRetry(async () => {
//     const res = await api.post(path, body, {
//       headers: { "Content-Type": "application/json" },
//       ...config,
//     });
//     return res.data;
//   });
// }

// export async function apiPutJson(path, body, config = {}) {
//   return withRetry(async () => {
//     const res = await api.put(path, body, {
//       headers: { "Content-Type": "application/json" },
//       ...config,
//     });
//     return res.data;
//   });
// }

// export async function apiDelete(path, config = {}) {
//   return withRetry(async () => {
//     const res = await api.delete(path, config);
//     return res.data;
//   });
// }

// export async function wakeApi() {
//   console.log("[PixelPerfect API] 🔔 Waking up API...");
//   try {
//     await withRetry(
//       () => api.get("/health", { validateStatus: () => true }),
//       { attempts: 6, firstDelayMs: 600 }
//     );
//     console.log("[PixelPerfect API] ✅ API is awake");
//     return true;
//   } catch (e) {
//     console.warn("[PixelPerfect API] ⚠️ API wake failed:", e.message);
//     return false;
//   }
// }

// export function currentApiBase() {
//   return baseURL;
// }

