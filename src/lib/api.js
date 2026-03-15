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


