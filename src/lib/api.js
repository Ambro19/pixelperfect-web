// ========================================
// API CLIENT - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/lib/api.js
// Author: OneTechly
// Updated: Feb 2026 - Production-ready
//
// Fixes:
// ✅ Preserves FastAPI error messages (400/401 detail) instead of "Network error"
// ✅ Retry logic only retries on real network/429/503/504 (NOT 400/401)
// ✅ Supports BOTH token keys: "auth_token" (new) and "token" (legacy)
// ✅ Better FastAPI/Pydantic error parsing (detail string or detail array)
// ✅ Keeps centralized axios client + wrappers (Get/Post/Put/Delete)
//
// Notes:
// - We DO NOT normalize inside apiGetJson/apiPostJson before retry.
//   Normalization happens ONLY at the end so status/detail is preserved.
// ========================================

import axios from "axios";

const TOKEN_KEY = "auth_token";
const LEGACY_TOKEN_KEY = "token";

function resolveBaseURL() {
  const env = (
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    ""
  ).trim();
  if (env) return env;

  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;

    // If you're serving the frontend from pixelperfectapi.net, default to api.pixelperfectapi.net
    if (host === "pixelperfectapi.net" || host.endsWith(".pixelperfectapi.net")) {
      return "https://api.pixelperfectapi.net";
    }
  }

  // Safe dev default
  return "http://localhost:8000";
}

const baseURL = resolveBaseURL().replace(/\/+$/, "");

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
    }
  } catch {
    /* ignore */
  }
  return config;
});

// -----------------------
// Error normalization
// -----------------------
function pickFastApiDetail(data) {
  // FastAPI often returns: { detail: "..." } OR { detail: [ {msg: "..."} ] }
  if (!data) return "";

  if (typeof data === "string") return data;

  const d = data?.detail ?? data?.message ?? data?.error ?? "";
  if (typeof d === "string") return d;

  // Pydantic validation list
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
  // Axios error shape: err.response?.status, err.response?.data, err.code, err.message
  const res = err?.response;
  const data = res?.data;

  const status = res?.status;
  const code = err?.code;

  const detail = pickFastApiDetail(data);
  const msg =
    detail ||
    (status ? `Request failed with status ${status}` : code ? `Network error (${code})` : "Network error");

  const out = new Error(msg);
  out.status = status;      // number | undefined
  out.code = code;          // e.g. ERR_NETWORK, ECONNABORTED
  out.data = data;          // server payload (if any)
  out.original = err;       // keep raw error for debugging
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
      // IMPORTANT: this function receives the RAW axios error, not a normalized Error.
      const status = rawAxiosErr?.response?.status;

      // If there's no response, it's likely a network error, DNS, CORS block, timeout, etc.
      if (!rawAxiosErr?.response) return true;

      // Retry only on transient server/rate limit cases
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

      const canRetry = i < attempts - 1 && shouldRetry(err);
      if (!canRetry) break;

      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
    }
  }

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

// Wake /health without throwing on non-2xx
export async function wakeApi() {
  try {
    await withRetry(
      () => api.get("/health", { validateStatus: () => true }),
      { attempts: 6, firstDelayMs: 600 }
    );
    return true;
  } catch {
    return false;
  }
}

export function currentApiBase() {
  return baseURL;
}



// // frontend/src/lib/api.js
// // Centralized API client + helper wrappers.
// // PROD → https://api.pixelperfectapi.net (or your Render backend URL)
// // DEV  → REACT_APP_API_URL (if set) else http://localhost:8000

// import axios from "axios";

// const TOKEN_KEY = "auth_token";

// function resolveBaseURL() {
//   const env =
//     (process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "").trim();
//   if (env) return env;

//   if (typeof window !== "undefined" && window.location?.hostname) {
//     const host = window.location.hostname;

//     // If you're serving the frontend from pixelperfectapi.net, default to api.pixelperfectapi.net
//     if (host === "pixelperfectapi.net" || host.endsWith(".pixelperfectapi.net")) {
//       return "https://api.pixelperfectapi.net";
//     }
//   }

//   // Safe dev default
//   return "http://localhost:8000";
// }

// const baseURL = resolveBaseURL();

// export const api = axios.create({
//   baseURL,
//   timeout: Number(process.env.REACT_APP_API_TIMEOUT || 30000),
// });

// // Attach Bearer token from localStorage if present
// api.interceptors.request.use((config) => {
//   try {
//     const token = localStorage.getItem(TOKEN_KEY);
//     if (token && !config.headers?.Authorization) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch {
//     /* ignore */
//   }
//   return config;
// });

// // ----- Error normalization
// function normalizeError(err) {
//   const res = err?.response;
//   const data = res?.data;

//   const detail =
//     data?.detail ||
//     data?.message ||
//     data?.error ||
//     (typeof data === "string" ? data : null);

//   const status = res?.status;
//   const code = err?.code;

//   const msg =
//     detail ||
//     (status ? `Request failed with status ${status}` : code ? `Network error (${code})` : "Network error");

//   const out = new Error(msg);
//   out.status = status;
//   out.code = code;
//   out.data = data;
//   return out;
// }

// async function withRetry(
//   fn,
//   {
//     attempts = Number(process.env.REACT_APP_API_RETRY_ATTEMPTS || 3) + 5, // keeps your previous "strong retry"
//     firstDelayMs = 800,
//     maxDelayMs = 6000,
//     shouldRetry = (error) => {
//       const status = error?.response?.status;
//       return !error?.response || status === 429 || status === 503 || status === 504;
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
//       if (i === attempts - 1 || !shouldRetry(err)) break;

//       const currentDelay = delay;
//       await new Promise((r) => setTimeout(r, currentDelay));
//       delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
//     }
//   }
//   throw normalizeError(lastErr);
// }

// export async function apiGetJson(path, config = {}) {
//   return withRetry(async () => {
//     try {
//       const res = await api.get(path, config);
//       return res.data;
//     } catch (err) {
//       throw normalizeError(err);
//     }
//   });
// }

// export async function apiPostJson(path, body, config = {}) {
//   return withRetry(async () => {
//     try {
//       const res = await api.post(path, body, {
//         headers: { "Content-Type": "application/json" },
//         ...config,
//       });
//       return res.data;
//     } catch (err) {
//       throw normalizeError(err);
//     }
//   });
// }

// export async function apiPutJson(path, body, config = {}) {
//   return withRetry(async () => {
//     try {
//       const res = await api.put(path, body, {
//         headers: { "Content-Type": "application/json" },
//         ...config,
//       });
//       return res.data;
//     } catch (err) {
//       throw normalizeError(err);
//     }
//   });
// }

// export async function apiDelete(path, config = {}) {
//   return withRetry(async () => {
//     try {
//       const res = await api.delete(path, config);
//       return res.data;
//     } catch (err) {
//       throw normalizeError(err);
//     }
//   });
// }

// export async function wakeApi() {
//   try {
//     await withRetry(() => api.get("/health", { validateStatus: () => true }), {
//       attempts: 6,
//       firstDelayMs: 600,
//     });
//     return true;
//   } catch {
//     return false;
//   }
// }

// export function currentApiBase() {
//   return baseURL;
// }
