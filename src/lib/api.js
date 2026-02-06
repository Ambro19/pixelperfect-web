// ========================================
// API CLIENT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/lib/api.js
// Author: OneTechly
// Updated: Feb 2026 - Production-ready
//
// Key fixes:
// ✅ Correct API base when frontend is opened via LAN IP (192.168.x.x)
// ✅ Env var override still works (REACT_APP_API_URL / REACT_APP_API_BASE_URL)
// ✅ Enhanced logging for debugging
// ✅ Keeps your FastAPI error detail parsing + safe retry rules
// ========================================

import axios from "axios";

const TOKEN_KEY = "auth_token";
const LEGACY_TOKEN_KEY = "token";

function isIpv4(host) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
}

function stripSlash(u) {
  return String(u || "").trim().replace(/\/+$/, "");
}

function resolveBaseURL() {
  // 1) Explicit env override (preferred for CI/production builds)
  const env =
    (process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "").trim();
  if (env) {
    const url = stripSlash(env);
    console.log("[PixelPerfect API] Using env override:", url);
    return url;
  }

  // 2) Browser-derived auto mode
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname; // no port
    const port = window.location.port;
    const protocol = window.location.protocol; // http: or https:

    console.log("[PixelPerfect API] Detecting environment:", { host, port, protocol });

    // Prod domains → prod API
    if (host === "pixelperfectapi.net" || host.endsWith(".pixelperfectapi.net")) {
      console.log("[PixelPerfect API] Production domain detected");
      return "https://api.pixelperfectapi.net";
    }

    // ✅ CRITICAL: Localhost detection (127.0.0.1 or localhost)
    if (host === "localhost" || host === "127.0.0.1") {
      const apiUrl = "http://localhost:8000";
      console.log("[PixelPerfect API] Localhost detected →", apiUrl);
      return apiUrl;
    }

    // ✅ CRITICAL: LAN IP → point to SAME host on :8000
    if (isIpv4(host)) {
      const apiUrl = `http://${host}:8000`;
      console.log("[PixelPerfect API] LAN IP detected →", apiUrl);
      return apiUrl;
    }

    // If someone serves frontend on a hostname in a LAN, try same hostname on :8000
    // (Keeps HTTP to match most local FastAPI dev setups)
    if (protocol === "http:") {
      const apiUrl = `http://${host}:8000`;
      console.log("[PixelPerfect API] HTTP hostname detected →", apiUrl);
      return apiUrl;
    }

    // Fallback for HTTPS on unknown hostname (shouldn't happen)
    console.warn("[PixelPerfect API] Unknown hostname, using HTTPS fallback");
    return `https://${host}:8000`;
  }

  // 3) Safe dev default (SSR or node environment)
  console.log("[PixelPerfect API] No window, using default");
  return "http://localhost:8000";
}

const baseURL = stripSlash(resolveBaseURL());

console.log("[PixelPerfect] ✅ API baseURL configured:", baseURL);
console.log("[PixelPerfect] Environment check:", {
  envApiUrl: process.env.REACT_APP_API_URL || "(not set)",
  envApiBaseUrl: process.env.REACT_APP_API_BASE_URL || "(not set)",
  currentPage: typeof window !== "undefined" ? window.location.href : "(no-window)",
});

// -----------------------
// Axios instance
// -----------------------
export const api = axios.create({
  baseURL,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT || 30000),
});

// Attach Bearer token from localStorage if present
api.interceptors.request.use((config) => {
  try {
    const token =
      localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[PixelPerfect API] 🔐 Token attached to ${config.method?.toUpperCase()} ${config.url}`);
    } else if (!token) {
      console.log(`[PixelPerfect API] 🔓 No token for ${config.method?.toUpperCase()} ${config.url}`);
    }
  } catch (e) {
    console.warn("[PixelPerfect API] Failed to attach token:", e);
  }
  return config;
});

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(
      `[PixelPerfect API] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`
    );
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const method = error?.config?.method?.toUpperCase();
    const url = error?.config?.url;
    
    if (status) {
      console.error(`[PixelPerfect API] ❌ ${method} ${url} → ${status}`);
    } else {
      console.error(`[PixelPerfect API] ❌ ${method} ${url} → Network Error`);
    }
    
    return Promise.reject(error);
  }
);

// -----------------------
// Error normalization
// -----------------------
function pickFastApiDetail(data) {
  if (!data) return "";
  if (typeof data === "string") return data;

  const d = data?.detail ?? data?.message ?? data?.error ?? "";
  if (typeof d === "string") return d;

  if (Array.isArray(d)) {
    const msg = d
      .map((x) => x?.msg || x?.message || "")
      .filter(Boolean)
      .join(", ");
    return msg || "";
  }
  return "";
}

function normalizeError(err) {
  const res = err?.response;
  const data = res?.data;

  const status = res?.status;
  const code = err?.code;

  const detail = pickFastApiDetail(data);
  const msg =
    detail ||
    (status
      ? `Request failed with status ${status}`
      : code
      ? `Network error (${code})`
      : "Network error");

  const out = new Error(msg);
  out.status = status;
  out.code = code;
  out.data = data;
  out.original = err;
  return out;
}

// -----------------------
// Retry wrapper
// -----------------------
async function withRetry(
  fn,
  {
    attempts = Number(process.env.REACT_APP_API_RETRY_ATTEMPTS || 3),
    firstDelayMs = 800,
    maxDelayMs = 6000,
    shouldRetry = (rawAxiosErr) => {
      const status = rawAxiosErr?.response?.status;

      // No response => network/CORS/DNS/timeout, etc.
      if (!rawAxiosErr?.response) {
        console.log("[PixelPerfect API] 🔄 No response, will retry (network/CORS/timeout)");
        return true;
      }

      // Retry only transient cases
      const canRetry = status === 429 || status === 503 || status === 504;
      if (canRetry) {
        console.log(`[PixelPerfect API] 🔄 Status ${status}, will retry`);
      }
      return canRetry;
    },
  } = {}
) {
  let delay = firstDelayMs;
  let lastErr;

  for (let i = 0; i < attempts; i++) {
    try {
      if (i > 0) {
        console.log(`[PixelPerfect API] Retry attempt ${i + 1}/${attempts}`);
      }
      return await fn();
    } catch (err) {
      lastErr = err;
      const canRetry = i < attempts - 1 && shouldRetry(err);
      if (!canRetry) break;

      console.log(`[PixelPerfect API] ⏱️ Waiting ${delay}ms before retry...`);
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
    }
  }

  console.error("[PixelPerfect API] ❌ All retry attempts exhausted");
  throw normalizeError(lastErr);
}

// -----------------------
// API helpers
// -----------------------
export async function apiGetJson(path, config = {}) {
  return withRetry(async () => {
    const res = await api.get(path, config);
    return res.data;
  });
}

export async function apiPostJson(path, body, config = {}) {
  return withRetry(async () => {
    const res = await api.post(path, body, {
      headers: { "Content-Type": "application/json" },
      ...config,
    });
    return res.data;
  });
}

export async function apiPutJson(path, body, config = {}) {
  return withRetry(async () => {
    const res = await api.put(path, body, {
      headers: { "Content-Type": "application/json" },
      ...config,
    });
    return res.data;
  });
}

export async function apiDelete(path, config = {}) {
  return withRetry(async () => {
    const res = await api.delete(path, config);
    return res.data;
  });
}

export async function wakeApi() {
  console.log("[PixelPerfect API] 🔔 Waking up API...");
  try {
    await withRetry(
      () => api.get("/health", { validateStatus: () => true }),
      { attempts: 6, firstDelayMs: 600 }
    );
    console.log("[PixelPerfect API] ✅ API is awake");
    return true;
  } catch (e) {
    console.warn("[PixelPerfect API] ⚠️ API wake failed:", e.message);
    return false;
  }
}

export function currentApiBase() {
  return baseURL;
}

// // ============================================

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
//   if (env) return stripSlash(env);

//   // 2) Browser-derived auto mode
//   if (typeof window !== "undefined" && window.location) {
//     const host = window.location.hostname; // no port
//     const protocol = window.location.protocol; // http: or https:

//     // Prod domains → prod API
//     if (host === "pixelperfectapi.net" || host.endsWith(".pixelperfectapi.net")) {
//       return "https://api.pixelperfectapi.net";
//     }

//     // LAN IP → point to SAME host on :8000
//     if (isIpv4(host)) {
//       return `http://${host}:8000`;
//     }

//     // Localhost
//     if (host === "localhost" || host === "127.0.0.1") {
//       return "http://localhost:8000";
//     }

//     // If someone serves frontend on a hostname in a LAN, try same hostname on :8000
//     // (Keeps HTTP to match most local FastAPI dev setups)
//     if (protocol === "http:") {
//       return `http://${host}:8000`;
//     }
//   }

//   // 3) Safe dev default
//   return "http://localhost:8000";
// }

// const baseURL = stripSlash(resolveBaseURL());

// console.log("[PixelPerfect] API baseURL =", baseURL, {
//   envApiUrl: process.env.REACT_APP_API_URL,
//   envApiBaseUrl: process.env.REACT_APP_API_BASE_URL,
//   page: typeof window !== "undefined" ? window.location.href : "(no-window)",
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
//     }
//   } catch {
//     /* ignore */
//   }
//   return config;
// });

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
//       if (!rawAxiosErr?.response) return true;

//       // Retry only transient cases
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
//       const canRetry = i < attempts - 1 && shouldRetry(err);
//       if (!canRetry) break;

//       await new Promise((r) => setTimeout(r, delay));
//       delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
//     }
//   }

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
//   try {
//     await withRetry(
//       () => api.get("/health", { validateStatus: () => true }),
//       { attempts: 6, firstDelayMs: 600 }
//     );
//     return true;
//   } catch {
//     return false;
//   }
// }

// export function currentApiBase() {
//   return baseURL;
// }

