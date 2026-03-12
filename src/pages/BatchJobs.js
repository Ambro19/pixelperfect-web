// ================================================================
// BATCH JOBS PAGE - PRODUCTION READY
// ================================================================
// File: frontend/src/pages/BatchJobs.js
// Author: OneTechly
// Updated: March 2026
//
// Uses centralized API client from src/lib/api.js
// - No duplicate base URL logic
// - No raw axios bypass
// - Proper multipart/form-data upload handling
// - Better diagnostics
//
// FIXES APPLIED:
// - Removed premature auto-redirect to /activity
// - Keeps user on batch page after submit so background processing can continue
// - Adds clear post-submit navigation actions
// ================================================================

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";
import { api, currentApiBase } from "../lib/api";

const MAX_URLS = 50;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_EXTS = [".txt", ".csv", ".tsv"];

const PRESETS = [
  { label: "Desktop (1920x1080)", width: 1920, height: 1080 },
  { label: "Laptop (1366x768)", width: 1366, height: 768 },
  { label: "Mobile (375x667)", width: 375, height: 667 },
];

function getExt(name = "") {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function isAllowedFile(file) {
  return !!file && ALLOWED_EXTS.includes(getExt(file.name));
}

function parseUrlsFromText(text) {
  if (!text) return [];

  const raw = text
    .split(/\r?\n|,|\t/g)
    .map((s) => (s || "").trim())
    .filter(Boolean);

  const seen = new Set();
  const urls = [];

  for (const item of raw) {
    if (!/^https?:\/\//i.test(item)) continue;
    if (!seen.has(item)) {
      seen.add(item);
      urls.push(item);
    }
  }

  return urls;
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export default function BatchJobs() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const fileInputRef = useRef(null);
  const simulateTimerRef = useRef(null);

  const [urlsText, setUrlsText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreviewText, setFilePreviewText] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [format, setFormat] = useState("png");
  const [fullPage, setFullPage] = useState(true);

  const [loading, setLoading] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submittedJobId, setSubmittedJobId] = useState(null);

  const previewUrls = useMemo(() => {
    const source = file ? filePreviewText : urlsText;
    return parseUrlsFromText(source);
  }, [file, filePreviewText, urlsText]);

  const urlCount = previewUrls.length;
  const exceedsLimit = urlCount > MAX_URLS;

  useEffect(() => {
    return () => {
      if (simulateTimerRef.current) {
        clearInterval(simulateTimerRef.current);
      }
    };
  }, []);

  const openFileDialog = () => fileInputRef.current?.click();

  const clearFile = () => {
    setFile(null);
    setFilePreviewText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setProgressPct(0);
  };

  const validateAndSetFile = async (incomingFile) => {
    setError("");
    setMessage("");
    setSubmittedJobId(null);

    if (!incomingFile) return;

    if (!isAllowedFile(incomingFile)) {
      const msg = "Invalid file type. Upload a .txt, .csv, or .tsv file.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (incomingFile.size > MAX_FILE_BYTES) {
      const msg = `File too large (${formatBytes(incomingFile.size)}). Max allowed is ${formatBytes(MAX_FILE_BYTES)}.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    setFile(incomingFile);
    setUrlsText("");
    setProgressPct(0);
    toast.success(`📄 File loaded: ${incomingFile.name}`);

    try {
      const text = await incomingFile.text();
      setFilePreviewText(text || "");
    } catch {
      setFilePreviewText("");
    }
  };

  const onFileChange = async (e) => {
    const incoming = e.target.files?.[0];
    await validateAndSetFile(incoming);
  };

  const applyPreset = ({ label, width: w, height: h }) => {
    setWidth(w);
    setHeight(h);
    toast.success(`Applied ${label} preset`);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer?.files?.[0];
    await validateAndSetFile(dropped);
  };

  const startSimulatedProgress = () => {
    setProgressPct(10);

    if (simulateTimerRef.current) {
      clearInterval(simulateTimerRef.current);
    }

    simulateTimerRef.current = setInterval(() => {
      setProgressPct((prev) =>
        prev >= 92 ? prev : Math.min(92, prev + Math.max(1, Math.round((100 - prev) * 0.06)))
      );
    }, 180);
  };

  const stopSimulatedProgress = (finalValue = 100) => {
    if (simulateTimerRef.current) {
      clearInterval(simulateTimerRef.current);
      simulateTimerRef.current = null;
    }
    setProgressPct(finalValue);
  };

  const resetFormAfterSubmit = () => {
    setUrlsText("");
    clearFile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmittedJobId(null);
    setProgressPct(0);

    const token = getToken();
    if (!token) {
      const msg = "Authentication required. Please log in again.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!file && !urlsText.trim()) {
      const msg = "Please upload a file or paste URLs (one per line).";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (urlCount === 0) {
      const msg = "No valid URLs found. Use full URLs starting with http:// or https://";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (exceedsLimit) {
      const msg = `Too many URLs (${urlCount}). Maximum is ${MAX_URLS} URLs per batch.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading(`⏳ Submitting batch of ${urlCount} URLs…`);

    try {
      let data;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", format);
        formData.append("width", String(width));
        formData.append("height", String(height));
        formData.append("full_page", String(fullPage));

        const response = await api.post("/api/v1/batch/submit_file", formData, {
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setProgressPct(Math.max(5, Math.min(100, pct)));
          },
        });

        data = response.data;
      } else {
        startSimulatedProgress();

        const response = await api.post("/api/v1/batch/submit", {
          urls: parseUrlsFromText(urlsText),
          format,
          width: Number(width),
          height: Number(height),
          full_page: fullPage,
        });

        stopSimulatedProgress(100);
        data = response.data;
      }

      toast.dismiss(loadingToastId);

      const jobId = data?.id || null;
      setSubmittedJobId(jobId);

      const successMsg = jobId
        ? `✅ Batch job submitted successfully. Job ID: ${jobId}`
        : "✅ Batch job submitted successfully.";

      setMessage(successMsg);
      toast.success("📦 Batch job submitted successfully!", { duration: 4000 });

      // IMPORTANT:
      // Do NOT auto-redirect to /activity here.
      // The batch job continues in the background, and navigating too early
      // makes it look like nothing was processed yet.
      resetFormAfterSubmit();
    } catch (err) {
      toast.dismiss(loadingToastId);
      stopSimulatedProgress(0);

      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      const requestPath = err?.config?.url || "(unknown-path)";
      const requestUrl = `${currentApiBase()}${requestPath}`;

      let errorMsg;

      if (status === 405) {
        errorMsg =
          `Method Not Allowed (405).\n` +
          `Request URL: ${requestUrl}\n` +
          `The frontend reached a valid server, but POST is not registered for this backend route.`;
      } else if (status === 403) {
        errorMsg = detail || "Batch processing requires a Pro plan or higher.";
      } else if (status === 429) {
        errorMsg = detail || "Batch request limit exceeded. Upgrade your plan to continue.";
      } else if (status === 401) {
        errorMsg = "Session expired. Please log in again.";
      } else {
        errorMsg = detail || `Failed to submit batch job (${status || "network error"}).`;
      }

      setError(errorMsg);
      toast.error(errorMsg.split("\n")[0], { duration: 6000 });

      console.error("❌ Batch submit error:", {
        status,
        detail,
        requestUrl,
        raw: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Batch Screenshot Jobs
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Capture screenshots of multiple websites at once. Process up to {MAX_URLS} URLs per batch.
          </p>
          <p className="text-sm text-gray-500 mt-2">Pro · up to {MAX_URLS} URLs per batch</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📐</span> Screenshot Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Dimensions</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Format</h3>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-3"
                  >
                    <option value="png">PNG (lossless)</option>
                    <option value="jpeg">JPEG (compressed)</option>
                    <option value="webp">WebP (modern)</option>
                    <option value="pdf">PDF (document)</option>
                  </select>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fullPage}
                      onChange={(e) => setFullPage(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Capture full page (scrolling)
                    </span>
                  </label>

                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">URL Preview</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          exceedsLimit ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {urlCount}/{MAX_URLS}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {file ? "Previewing URLs from uploaded file." : "Previewing URLs from textarea."}
                    </p>
                    {urlCount > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Example: <span className="font-mono break-all">{previewUrls[0]}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URLs (one per line)
                  </label>
                  <textarea
                    value={urlsText}
                    onChange={(e) => {
                      setUrlsText(e.target.value);
                      if (file) clearFile();
                    }}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
                    placeholder={"https://example.com\nhttps://another-site.com"}
                    disabled={!!file}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter up to {MAX_URLS} URLs, one per line
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File (CSV/TXT/TSV)
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"
                    }`}
                    onClick={openFileDialog}
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openFileDialog()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={onFileChange}
                      accept=".txt,.csv,.tsv,text/plain,text/csv,text/tab-separated-values"
                      className="hidden"
                    />

                    <div className="text-4xl mb-2">📄</div>

                    {file ? (
                      <>
                        <div className="text-sm font-medium text-green-600">✓ {file.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Size: {formatBytes(file.size)} · Max: {formatBytes(MAX_FILE_BYTES)}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFile();
                            toast.success("File cleared");
                          }}
                          className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          Clear File
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-gray-800">Drag & drop a file here</div>
                        <div className="text-sm text-gray-600 mt-1">or tap to browse</div>
                        <div className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                          Browse…
                        </div>
                        <div className="mt-4 text-xs text-gray-500 space-y-1">
                          <p>Supported: CSV, TXT, TSV</p>
                          <p>Max size: {formatBytes(MAX_FILE_BYTES)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {(loading || progressPct > 0) && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">Submission Progress</span>
                  <span className="text-sm text-gray-600">{progressPct}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-blue-600 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 whitespace-pre-line">
                <p className="text-red-600 font-medium">❌ {error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-semibold">{message}</p>
                <p className="text-green-600 text-sm mt-2">
                  Your batch job is now processing in the background. Activity results may appear gradually as screenshots finish.
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/activity")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Recent Activity
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/history")}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    View Full History
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMessage("");
                      setSubmittedJobId(null);
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Stay Here
                  </button>
                </div>

                {submittedJobId && (
                  <p className="text-xs text-green-700 mt-3 font-mono break-all">
                    Job ID: {submittedJobId}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || urlCount === 0 || exceedsLimit}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Processing…" : "🚀 Submit Batch Job"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

/////////////////////////////  FROM CHATGPT FIXES /////////////////////////////////////////////////////

// // ================================================================
// // BATCH JOBS PAGE - PRODUCTION READY
// // ================================================================
// // File: frontend/src/pages/BatchJobs.js
// // Author: OneTechly
// // Updated: March 2026
// //
// // Uses centralized API client from src/lib/api.js
// // - No duplicate base URL logic
// // - No raw axios bypass
// // - Proper multipart/form-data upload handling
// // - Better diagnostics
// // ================================================================

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";
// import { useAuth } from "../contexts/AuthContext";
// import { api, currentApiBase } from "../lib/api";

// const MAX_URLS = 50;
// const MAX_FILE_BYTES = 2 * 1024 * 1024;
// const ALLOWED_EXTS = [".txt", ".csv", ".tsv"];

// const PRESETS = [
//   { label: "Desktop (1920x1080)", width: 1920, height: 1080 },
//   { label: "Laptop (1366x768)", width: 1366, height: 768 },
//   { label: "Mobile (375x667)", width: 375, height: 667 },
// ];

// function getExt(name = "") {
//   const i = name.lastIndexOf(".");
//   return i >= 0 ? name.slice(i).toLowerCase() : "";
// }

// function isAllowedFile(file) {
//   return !!file && ALLOWED_EXTS.includes(getExt(file.name));
// }

// function parseUrlsFromText(text) {
//   if (!text) return [];

//   const raw = text
//     .split(/\r?\n|,|\t/g)
//     .map((s) => (s || "").trim())
//     .filter(Boolean);

//   const seen = new Set();
//   const urls = [];

//   for (const item of raw) {
//     if (!/^https?:\/\//i.test(item)) continue;
//     if (!seen.has(item)) {
//       seen.add(item);
//       urls.push(item);
//     }
//   }

//   return urls;
// }

// function formatBytes(bytes) {
//   if (!bytes) return "0 B";
//   if (bytes < 1024) return `${bytes} B`;
//   const kb = bytes / 1024;
//   if (kb < 1024) return `${kb.toFixed(1)} KB`;
//   const mb = kb / 1024;
//   return `${mb.toFixed(2)} MB`;
// }

// export default function BatchJobs() {
//   const navigate = useNavigate();
//   const { getToken } = useAuth();

//   const fileInputRef = useRef(null);
//   const simulateTimerRef = useRef(null);

//   const [urlsText, setUrlsText] = useState("");
//   const [file, setFile] = useState(null);
//   const [filePreviewText, setFilePreviewText] = useState("");
//   const [dragActive, setDragActive] = useState(false);

//   const [width, setWidth] = useState(1920);
//   const [height, setHeight] = useState(1080);
//   const [format, setFormat] = useState("png");
//   const [fullPage, setFullPage] = useState(true);

//   const [loading, setLoading] = useState(false);
//   const [progressPct, setProgressPct] = useState(0);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const previewUrls = useMemo(() => {
//     const source = file ? filePreviewText : urlsText;
//     return parseUrlsFromText(source);
//   }, [file, filePreviewText, urlsText]);

//   const urlCount = previewUrls.length;
//   const exceedsLimit = urlCount > MAX_URLS;

//   useEffect(() => {
//     return () => {
//       if (simulateTimerRef.current) {
//         clearInterval(simulateTimerRef.current);
//       }
//     };
//   }, []);

//   const openFileDialog = () => fileInputRef.current?.click();

//   const clearFile = () => {
//     setFile(null);
//     setFilePreviewText("");
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//     setProgressPct(0);
//   };

//   const validateAndSetFile = async (incomingFile) => {
//     setError("");
//     setMessage("");

//     if (!incomingFile) return;

//     if (!isAllowedFile(incomingFile)) {
//       const msg = "Invalid file type. Upload a .txt, .csv, or .tsv file.";
//       setError(msg);
//       toast.error(msg);
//       return;
//     }

//     if (incomingFile.size > MAX_FILE_BYTES) {
//       const msg = `File too large (${formatBytes(incomingFile.size)}). Max allowed is ${formatBytes(MAX_FILE_BYTES)}.`;
//       setError(msg);
//       toast.error(msg);
//       return;
//     }

//     setFile(incomingFile);
//     setUrlsText("");
//     setProgressPct(0);
//     toast.success(`📄 File loaded: ${incomingFile.name}`);

//     try {
//       const text = await incomingFile.text();
//       setFilePreviewText(text || "");
//     } catch {
//       setFilePreviewText("");
//     }
//   };

//   const onFileChange = async (e) => {
//     const incoming = e.target.files?.[0];
//     await validateAndSetFile(incoming);
//   };

//   const applyPreset = ({ label, width: w, height: h }) => {
//     setWidth(w);
//     setHeight(h);
//     toast.success(`Applied ${label} preset`);
//   };

//   const onDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(true);
//   };

//   const onDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(true);
//   };

//   const onDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//   };

//   const onDrop = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     const dropped = e.dataTransfer?.files?.[0];
//     await validateAndSetFile(dropped);
//   };

//   const startSimulatedProgress = () => {
//     setProgressPct(10);

//     if (simulateTimerRef.current) {
//       clearInterval(simulateTimerRef.current);
//     }

//     simulateTimerRef.current = setInterval(() => {
//       setProgressPct((prev) =>
//         prev >= 92 ? prev : Math.min(92, prev + Math.max(1, Math.round((100 - prev) * 0.06)))
//       );
//     }, 180);
//   };

//   const stopSimulatedProgress = (finalValue = 100) => {
//     if (simulateTimerRef.current) {
//       clearInterval(simulateTimerRef.current);
//       simulateTimerRef.current = null;
//     }
//     setProgressPct(finalValue);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setProgressPct(0);

//     const token = getToken();
//     if (!token) {
//       const msg = "Authentication required. Please log in again.";
//       setError(msg);
//       toast.error(msg);
//       return;
//     }

//     if (!file && !urlsText.trim()) {
//       const msg = "Please upload a file or paste URLs (one per line).";
//       setError(msg);
//       toast.error(msg);
//       return;
//     }

//     if (urlCount === 0) {
//       const msg = "No valid URLs found. Use full URLs starting with http:// or https://";
//       setError(msg);
//       toast.error(msg);
//       return;
//     }

//     if (exceedsLimit) {
//       const msg = `Too many URLs (${urlCount}). Maximum is ${MAX_URLS} URLs per batch.`;
//       setError(msg);
//       toast.error(msg);
//       return;
//     }

//     setLoading(true);
//     const loadingToastId = toast.loading(`⏳ Submitting batch of ${urlCount} URLs…`);

//     try {
//       let data;

//       if (file) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("format", format);
//         formData.append("width", String(width));
//         formData.append("height", String(height));
//         formData.append("full_page", String(fullPage));

//         const response = await api.post("/api/v1/batch/submit_file", formData, {
//           onUploadProgress: (evt) => {
//             if (!evt.total) return;
//             const pct = Math.round((evt.loaded / evt.total) * 100);
//             setProgressPct(Math.max(5, Math.min(100, pct)));
//           },
//         });

//         data = response.data;
//       } else {
//         startSimulatedProgress();

//         const response = await api.post("/api/v1/batch/submit", {
//           urls: parseUrlsFromText(urlsText),
//           format,
//           width: Number(width),
//           height: Number(height),
//           full_page: fullPage,
//         });

//         stopSimulatedProgress(100);
//         data = response.data;
//       }

//       toast.dismiss(loadingToastId);

//       const successMsg = `✅ Batch job submitted! Job ID: ${data?.id || "created"}`;
//       setMessage(successMsg);
//       toast.success("📦 Batch job submitted successfully!", { duration: 4000 });

//       setTimeout(() => navigate("/activity"), 1200);
//     } catch (err) {
//       toast.dismiss(loadingToastId);
//       stopSimulatedProgress(0);

//       const status = err?.response?.status;
//       const detail = err?.response?.data?.detail;
//       const requestPath = err?.config?.url || "(unknown-path)";
//       const requestUrl = `${currentApiBase()}${requestPath}`;

//       let errorMsg;

//       if (status === 405) {
//         errorMsg =
//           `Method Not Allowed (405).\n` +
//           `Request URL: ${requestUrl}\n` +
//           `The frontend reached a valid server, but POST is not registered for this backend route.`;
//       } else if (status === 403) {
//         errorMsg = detail || "Batch processing requires a Pro plan or higher.";
//       } else if (status === 429) {
//         errorMsg = detail || "Batch request limit exceeded. Upgrade your plan to continue.";
//       } else if (status === 401) {
//         errorMsg = "Session expired. Please log in again.";
//       } else {
//         errorMsg = detail || `Failed to submit batch job (${status || "network error"}).`;
//       }

//       setError(errorMsg);
//       toast.error(errorMsg.split("\n")[0], { duration: 6000 });

//       console.error("❌ Batch submit error:", {
//         status,
//         detail,
//         requestUrl,
//         raw: err,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => navigate("/dashboard")}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//               >
//                 ← Back to Dashboard
//               </button>
//               <button
//                 onClick={() => navigate("/pricing")}
//                 className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Manage Subscription
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center mb-8">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
//             Batch Screenshot Jobs
//           </h1>
//           <p className="text-gray-600 text-sm sm:text-base">
//             Capture screenshots of multiple websites at once. Process up to {MAX_URLS} URLs per batch.
//           </p>
//           <p className="text-sm text-gray-500 mt-2">Pro · up to {MAX_URLS} URLs per batch</p>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <span>📐</span> Screenshot Configuration
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-3">Dimensions</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
//                       <input
//                         type="number"
//                         value={width}
//                         onChange={(e) => setWidth(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
//                       <input
//                         type="number"
//                         value={height}
//                         onChange={(e) => setHeight(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2 mt-3">
//                     {PRESETS.map((preset) => (
//                       <button
//                         key={preset.label}
//                         type="button"
//                         onClick={() => applyPreset(preset)}
//                         className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                       >
//                         {preset.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-3">Format</h3>
//                   <select
//                     value={format}
//                     onChange={(e) => setFormat(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-3"
//                   >
//                     <option value="png">PNG (lossless)</option>
//                     <option value="jpeg">JPEG (compressed)</option>
//                     <option value="webp">WebP (modern)</option>
//                     <option value="pdf">PDF (document)</option>
//                   </select>

//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={fullPage}
//                       onChange={(e) => setFullPage(e.target.checked)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
//                     />
//                     <span className="text-sm font-medium text-gray-700">
//                       Capture full page (scrolling)
//                     </span>
//                   </label>

//                   <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-semibold text-gray-900">URL Preview</span>
//                       <span
//                         className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                           exceedsLimit ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
//                         }`}
//                       >
//                         {urlCount}/{MAX_URLS}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-600 mt-1">
//                       {file ? "Previewing URLs from uploaded file." : "Previewing URLs from textarea."}
//                     </p>
//                     {urlCount > 0 && (
//                       <p className="text-xs text-gray-500 mt-2">
//                         Example: <span className="font-mono break-all">{previewUrls[0]}</span>
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Website URLs (one per line)
//                   </label>
//                   <textarea
//                     value={urlsText}
//                     onChange={(e) => {
//                       setUrlsText(e.target.value);
//                       if (file) clearFile();
//                     }}
//                     rows={10}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
//                     placeholder={"https://example.com\nhttps://another-site.com"}
//                     disabled={!!file}
//                   />
//                   <p className="text-xs text-gray-500 mt-2">
//                     Enter up to {MAX_URLS} URLs, one per line
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Upload File (CSV/TXT/TSV)
//                   </label>

//                   <div
//                     className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                       dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"
//                     }`}
//                     onClick={openFileDialog}
//                     onDragEnter={onDragEnter}
//                     onDragOver={onDragOver}
//                     onDragLeave={onDragLeave}
//                     onDrop={onDrop}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openFileDialog()}
//                   >
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={onFileChange}
//                       accept=".txt,.csv,.tsv,text/plain,text/csv,text/tab-separated-values"
//                       className="hidden"
//                     />

//                     <div className="text-4xl mb-2">📄</div>

//                     {file ? (
//                       <>
//                         <div className="text-sm font-medium text-green-600">✓ {file.name}</div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Size: {formatBytes(file.size)} · Max: {formatBytes(MAX_FILE_BYTES)}
//                         </div>
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             clearFile();
//                             toast.success("File cleared");
//                           }}
//                           className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
//                         >
//                           Clear File
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <div className="text-sm font-semibold text-gray-800">Drag & drop a file here</div>
//                         <div className="text-sm text-gray-600 mt-1">or tap to browse</div>
//                         <div className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
//                           Browse…
//                         </div>
//                         <div className="mt-4 text-xs text-gray-500 space-y-1">
//                           <p>Supported: CSV, TXT, TSV</p>
//                           <p>Max size: {formatBytes(MAX_FILE_BYTES)}</p>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {(loading || progressPct > 0) && (
//               <div className="bg-white rounded-xl border border-gray-200 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-semibold text-gray-900">Submission Progress</span>
//                   <span className="text-sm text-gray-600">{progressPct}%</span>
//                 </div>
//                 <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-3 bg-blue-600 rounded-full transition-all"
//                     style={{ width: `${progressPct}%` }}
//                   />
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 whitespace-pre-line">
//                 <p className="text-red-600 font-medium">❌ {error}</p>
//               </div>
//             )}

//             {message && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                 <p className="text-green-600 font-medium">{message}</p>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading || urlCount === 0 || exceedsLimit}
//               className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
//             >
//               {loading ? "Processing…" : "🚀 Submit Batch Job"}
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }

