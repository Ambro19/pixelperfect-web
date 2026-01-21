// frontend/src/lib/api.js
// Centralized API client + helper wrappers.
// PROD → https://api.pixelperfectapi.net (or your Render backend URL)
// DEV  → REACT_APP_API_URL (if set) else http://localhost:8000

import axios from "axios";

const TOKEN_KEY = "auth_token";

function resolveBaseURL() {
  const env =
    (process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "").trim();
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

const baseURL = resolveBaseURL();

export const api = axios.create({
  baseURL,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT || 30000),
});

// Attach Bearer token from localStorage if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* ignore */
  }
  return config;
});

// ----- Error normalization
function normalizeError(err) {
  const res = err?.response;
  const data = res?.data;

  const detail =
    data?.detail ||
    data?.message ||
    data?.error ||
    (typeof data === "string" ? data : null);

  const status = res?.status;
  const code = err?.code;

  const msg =
    detail ||
    (status ? `Request failed with status ${status}` : code ? `Network error (${code})` : "Network error");

  const out = new Error(msg);
  out.status = status;
  out.code = code;
  out.data = data;
  return out;
}

async function withRetry(
  fn,
  {
    attempts = Number(process.env.REACT_APP_API_RETRY_ATTEMPTS || 3) + 5, // keeps your previous "strong retry"
    firstDelayMs = 800,
    maxDelayMs = 6000,
    shouldRetry = (error) => {
      const status = error?.response?.status;
      return !error?.response || status === 429 || status === 503 || status === 504;
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
      if (i === attempts - 1 || !shouldRetry(err)) break;

      const currentDelay = delay;
      await new Promise((r) => setTimeout(r, currentDelay));
      delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
    }
  }
  throw normalizeError(lastErr);
}

export async function apiGetJson(path, config = {}) {
  return withRetry(async () => {
    try {
      const res = await api.get(path, config);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  });
}

export async function apiPostJson(path, body, config = {}) {
  return withRetry(async () => {
    try {
      const res = await api.post(path, body, {
        headers: { "Content-Type": "application/json" },
        ...config,
      });
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  });
}

export async function apiPutJson(path, body, config = {}) {
  return withRetry(async () => {
    try {
      const res = await api.put(path, body, {
        headers: { "Content-Type": "application/json" },
        ...config,
      });
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  });
}

export async function apiDelete(path, config = {}) {
  return withRetry(async () => {
    try {
      const res = await api.delete(path, config);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  });
}

export async function wakeApi() {
  try {
    await withRetry(() => api.get("/health", { validateStatus: () => true }), {
      attempts: 6,
      firstDelayMs: 600,
    });
    return true;
  } catch {
    return false;
  }
}

export function currentApiBase() {
  return baseURL;
}

///////////////////////////////////////////////////////////////////////////////////

// // frontend/src/lib/api.js
// // Centralized API client + helper wrappers.
// // PROD → https://api.pixelperfectapi.net (or your Render backend URL)
// // DEV  → REACT_APP_API_URL (if set) else http://localhost:8000

// //Fixes: 
// // 1. Remove onetechly.com fallback, use pixelperfect defaults

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


