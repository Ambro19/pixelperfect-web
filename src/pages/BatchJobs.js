// ================================================================
// BATCH JOB PAGE - ENTERPRISE PRODUCTION READY
// ================================================================

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function BatchJob() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const fileInputRef = useRef(null);

  const [urls, setUrls] = useState('');
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [format, setFormat] = useState('png');
  const [fullPage, setFullPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validExtensions = ['.txt', '.csv', '.tsv'];
    const ext = selected.name.toLowerCase().slice(selected.name.lastIndexOf('.'));

    if (!validExtensions.includes(ext)) {
      setError('Please upload a .txt, .csv, or .tsv file.');
      return;
    }

    setFile(selected);
    setUrls('');
    setError('');
  };

  const clearFile = () => {
    setFile(null);
    setUrls('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = getToken();
      if (!token) throw new Error('Authentication required.');

      // =====================================================
      // IF FILE EXISTS → USE BACKEND FILE UPLOAD ENDPOINT
      // =====================================================
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);
        formData.append('width', width);
        formData.append('height', height);
        formData.append('full_page', fullPage);

        const response = await axios.post(
          `${API_URL}/api/v1/batch/submit_file`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setMessage(`✅ Batch job created. Job ID: ${response.data.id}`);
      }
      // =====================================================
      // ELSE → USE DIRECT URL LIST ENDPOINT
      // =====================================================
      else {
        const urlList = urls
          .split('\n')
          .map((u) => u.trim())
          .filter(Boolean);

        if (!urlList.length) {
          throw new Error('Enter at least one URL.');
        }

        const response = await axios.post(
          `${API_URL}/api/v1/batch/submit`,
          {
            urls: urlList,
            format,
            width,
            height,
            full_page: fullPage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(`✅ Batch job created. Job ID: ${response.data.id}`);
      }

      setTimeout(() => navigate('/activity'), 1500);

    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Batch submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-4xl mx-auto py-10 px-4">

        <div className="text-center mb-8">
          <PixelPerfectLogo size={64} showText={false} />
          <h1 className="text-3xl font-bold mt-4">Batch Screenshot Jobs</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* FILE UPLOAD AREA */}
          <div
            onClick={openFileDialog}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.csv,.tsv"
              className="hidden"
            />

            {file ? (
              <>
                <p className="text-green-600 font-medium">✓ {file.name}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="mt-3 text-sm text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-700">Click to upload file</p>
                <p className="text-sm text-gray-500 mt-1">
                  CSV, TXT, or TSV supported
                </p>
              </>
            )}
          </div>

          {/* MANUAL URL ENTRY */}
          {!file && (
            <textarea
              rows={8}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-4 border rounded-lg font-mono"
            />
          )}

          {/* MESSAGES */}
          {error && <div className="bg-red-50 p-3 text-red-600 rounded">{error}</div>}
          {message && <div className="bg-green-50 p-3 text-green-600 rounded">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : '🚀 Submit Batch Job'}
          </button>
        </form>
      </main>
    </div>
  );
}
////////////////////////==============================/////////////////////////===========
// // ================================================================
// // BATCH JOBS PAGE - ENTERPRISE UI/UX (PRODUCTION READY)
// // ================================================================
// // File: frontend/src/pages/BatchJobs.js  (or BatchJob.js)
// // Author: OneTechly
// // Updated: Feb 2026
// //
// // ✅ Adds:
// // - Drag & drop support (desktop) + tap-to-upload (mobile)
// // - File size validation
// // - URL count preview (textarea + file preview parsing)
// // - Batch job progress bar (real upload progress for file)
// // - Uses /api/v1/batch/submit_file when file provided
// // - Uses /api/v1/batch/submit when using textarea URLs
// // ================================================================

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";
// import { useAuth } from "../contexts/AuthContext";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// // ---- Tuning knobs (safe defaults) ----
// const MAX_URLS = 50;
// // 2 MB is plenty for CSV/TXT/TSV URL lists; increase if you want
// const MAX_FILE_BYTES = 2 * 1024 * 1024;
// const ALLOWED_EXTS = [".txt", ".csv", ".tsv"];

// // ---------------------------
// // Helpers
// // ---------------------------
// function getExt(name = "") {
//   const i = name.lastIndexOf(".");
//   return i >= 0 ? name.slice(i).toLowerCase() : "";
// }

// function isAllowedFile(file) {
//   if (!file) return false;
//   const ext = getExt(file.name);
//   return ALLOWED_EXTS.includes(ext);
// }

// function parseUrlsFromText(text) {
//   if (!text) return [];
//   const raw = text
//     .split(/\r?\n|,|\t/g) // newlines OR csv OR tsv
//     .map((s) => (s || "").trim())
//     .filter(Boolean);

//   const seen = new Set();
//   const urls = [];

//   for (const item of raw) {
//     if (!/^https?:\/\//i.test(item)) continue;
//     const normalized = item.trim();
//     if (!seen.has(normalized)) {
//       seen.add(normalized);
//       urls.push(normalized);
//     }
//   }

//   return urls;
// }

// function formatBytes(bytes) {
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

//   // URL preview source: file (if present) else textarea
//   const previewUrls = useMemo(() => {
//     const source = file ? filePreviewText : urlsText;
//     return parseUrlsFromText(source);
//   }, [file, filePreviewText, urlsText]);

//   const urlCount = previewUrls.length;
//   const exceedsLimit = urlCount > MAX_URLS;

//   useEffect(() => {
//     return () => {
//       if (simulateTimerRef.current) clearInterval(simulateTimerRef.current);
//     };
//   }, []);

//   const openFileDialog = () => {
//     fileInputRef.current?.click();
//   };

//   const resetProgress = () => setProgressPct(0);

//   const clearFile = () => {
//     setFile(null);
//     setFilePreviewText("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     resetProgress();
//   };

//   const validateAndSetFile = async (incomingFile) => {
//     setError("");
//     setMessage("");

//     if (!incomingFile) return;

//     if (!isAllowedFile(incomingFile)) {
//       setError("Invalid file type. Upload a .txt, .csv, or .tsv file.");
//       return;
//     }

//     if (incomingFile.size > MAX_FILE_BYTES) {
//       setError(
//         `File too large (${formatBytes(incomingFile.size)}). Max allowed is ${formatBytes(
//           MAX_FILE_BYTES
//         )}.`
//       );
//       return;
//     }

//     setFile(incomingFile);
//     setUrlsText(""); // file becomes source-of-truth
//     resetProgress();

//     // Read file for PREVIEW ONLY (we still upload the file to backend)
//     try {
//       const text = await incomingFile.text();
//       setFilePreviewText(text || "");
//     } catch {
//       setFilePreviewText("");
//       // Not fatal — user can still upload file
//     }
//   };

//   const onFileChange = async (e) => {
//     const f = e.target.files?.[0];
//     await validateAndSetFile(f);
//   };

//   // ---------------------------
//   // Drag & Drop
//   // ---------------------------
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

//   // ---------------------------
//   // Progress
//   // ---------------------------
//   const startSimulatedProgress = () => {
//     // Simulated progress used when sending JSON (no upload progress available)
//     setProgressPct(10);
//     if (simulateTimerRef.current) clearInterval(simulateTimerRef.current);

//     simulateTimerRef.current = setInterval(() => {
//       setProgressPct((p) => {
//         if (p >= 92) return p; // cap until response returns
//         const next = p + Math.max(1, Math.round((100 - p) * 0.06));
//         return Math.min(next, 92);
//       });
//     }, 180);
//   };

//   const stopSimulatedProgress = (final = 100) => {
//     if (simulateTimerRef.current) clearInterval(simulateTimerRef.current);
//     simulateTimerRef.current = null;
//     setProgressPct(final);
//   };

//   // ---------------------------
//   // Submit
//   // ---------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     resetProgress();

//     const token = getToken();
//     if (!token) {
//       setError("Authentication required. Please log in again.");
//       return;
//     }

//     // Must have input
//     if (!file && !urlsText.trim()) {
//       setError("Please upload a file or paste URLs (one per line).");
//       return;
//     }

//     // Validate URL count using preview
//     if (urlCount === 0) {
//       setError("No valid URLs found. Use full URLs starting with http:// or https://");
//       return;
//     }

//     if (exceedsLimit) {
//       setError(`Too many URLs (${urlCount}). Maximum is ${MAX_URLS} URLs per batch.`);
//       return;
//     }

//     setLoading(true);

//     try {
//       let response;

//       // FILE UPLOAD PATH (real progress)
//       if (file) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("format", format);
//         formData.append("width", String(width));
//         formData.append("height", String(height));
//         formData.append("full_page", String(fullPage));

//         response = await axios.post(`${API_URL}/api/v1/batch/submit_file`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//           onUploadProgress: (evt) => {
//             if (!evt.total) return;
//             const pct = Math.round((evt.loaded / evt.total) * 100);
//             setProgressPct(Math.max(5, Math.min(100, pct)));
//           },
//         });
//       }
//       // TEXTAREA PATH (simulate progress)
//       else {
//         startSimulatedProgress();

//         const urlList = parseUrlsFromText(urlsText);

//         response = await axios.post(
//           `${API_URL}/api/v1/batch/submit`,
//           {
//             urls: urlList,
//             format,
//             width: Number(width),
//             height: Number(height),
//             full_page: fullPage,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         stopSimulatedProgress(100);
//       }

//       const jobId = response?.data?.id;
//       setMessage(`✅ Batch job submitted successfully! Job ID: ${jobId || "created"}`);

//       // Small pause so user sees success + 100% progress
//       setTimeout(() => navigate("/activity"), 1200);
//     } catch (err) {
//       if (simulateTimerRef.current) stopSimulatedProgress(0);
//       setProgressPct(0);
//       setError(err.response?.data?.detail || "Failed to submit batch job. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
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

//       {/* Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Centered Header */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>

//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Batch Screenshot Jobs</h1>

//           <p className="text-gray-600 text-sm sm:text-base">
//             Capture screenshots of multiple websites at once. Process up to {MAX_URLS} URLs per batch.
//           </p>

//           <p className="text-sm text-gray-500 mt-2">Pro · up to {MAX_URLS} URLs per batch</p>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Screenshot Configuration */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <span>📐</span> Screenshot Configuration
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Dimensions */}
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
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setWidth(1920);
//                         setHeight(1080);
//                       }}
//                       className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       Desktop (1920x1080)
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setWidth(1366);
//                         setHeight(768);
//                       }}
//                       className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       Laptop (1366x768)
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setWidth(375);
//                         setHeight(667);
//                       }}
//                       className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       Mobile (375x667)
//                     </button>
//                   </div>
//                 </div>

//                 {/* Format */}
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
//                     <span className="text-sm font-medium text-gray-700">Capture full page (scrolling)</span>
//                   </label>

//                   {/* URL count preview */}
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
//                     {exceedsLimit && (
//                       <p className="text-xs text-red-600 mt-2">
//                         Too many URLs. Reduce to {MAX_URLS} or fewer.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Input Section */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Manual URLs */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Website URLs (one per line)
//                   </label>

//                   <textarea
//                     value={urlsText}
//                     onChange={(e) => {
//                       setUrlsText(e.target.value);
//                       // If user types, they’re using textarea mode
//                       if (file) clearFile();
//                     }}
//                     rows={10}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
//                     placeholder="https://example.com&#10;https://another-site.com&#10;https://third-site.com"
//                     disabled={!!file}
//                   />

//                   <p className="text-xs text-gray-500 mt-2">Enter up to {MAX_URLS} URLs, one per line</p>
//                 </div>

//                 {/* File Upload (Drag & Drop + Mobile tap) */}
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
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" || e.key === " ") openFileDialog();
//                     }}
//                     aria-label="Upload URLs file"
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
//                           <p className="text-blue-600 font-medium">We’ll parse URLs for preview and upload the file.</p>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Progress Bar */}
//             {(loading || progressPct > 0) && (
//               <div className="bg-white rounded-xl border border-gray-200 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-semibold text-gray-900">Batch Submission Progress</span>
//                   <span className="text-sm text-gray-600">{progressPct}%</span>
//                 </div>
//                 <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-3 bg-blue-600 rounded-full transition-all"
//                     style={{ width: `${progressPct}%` }}
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   {file ? "Uploading file to server…" : "Submitting URLs…"}
//                 </p>
//               </div>
//             )}

//             {/* Messages */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                 <p className="text-red-600 font-medium">❌ {error}</p>
//               </div>
//             )}

//             {message && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                 <p className="text-green-600 font-medium">{message}</p>
//               </div>
//             )}

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading || urlCount === 0 || exceedsLimit}
//               className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   Processing Batch…
//                 </span>
//               ) : (
//                 "🚀 Submit Batch Job"
//               )}
//             </button>
//           </form>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="text-center text-sm text-gray-600">
//             <p className="mb-2">© 2026 PixelPerfect API. Built by OneTechly.</p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button onClick={() => navigate("/terms")} className="hover:text-blue-600 transition-colors">
//                 Terms
//               </button>
//               <button onClick={() => navigate("/privacy")} className="hover:text-blue-600 transition-colors">
//                 Privacy
//               </button>
//               <button onClick={() => navigate("/documentation")} className="hover:text-blue-600 transition-colors">
//                 Docs
//               </button>
//               <button onClick={() => navigate("/contact")} className="hover:text-blue-600 transition-colors">
//                 Contact
//               </button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

/////////////////////////////////////////////////////////////////////////////////////

// // ============================================================================
// // BATCH JOB PAGE - PRODUCTION READY
// // ============================================================================
// // File: frontend/src/pages/BatchJob.js
// // Author: OneTechly
// // Updated: February 2026
// //
// // ✅ PRODUCTION FEATURES:
// // - Centered PixelPerfect logo (replaces camera emoji)
// // - Professional file upload functionality
// // - CSV/TXT/TSV file support
// // - Batch processing up to 50 URLs
// // - Consistent UI design with other pages
// // - PDF format support added to dropdown
// // ============================================================================

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';
// import { useAuth } from '../contexts/AuthContext';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// export default function BatchJob() {
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const [urls, setUrls] = useState('');
//   const [file, setFile] = useState(null);
//   const [width, setWidth] = useState(1920);
//   const [height, setHeight] = useState(1080);
//   const [format, setFormat] = useState('png');
//   const [fullPage, setFullPage] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       const validTypes = ['text/plain', 'text/csv', 'text/tab-separated-values'];
//       const validExtensions = ['.txt', '.csv', '.tsv'];
//       const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
      
//       if (validTypes.includes(selectedFile.type) || validExtensions.includes(fileExtension)) {
//         setFile(selectedFile);
//         setError('');
        
//         // Read file and populate URLs
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           const content = event.target.result;
//           setUrls(content);
//         };
//         reader.readAsText(selectedFile);
//       } else {
//         setError('Invalid file type. Please upload a .txt, .csv, or .tsv file.');
//         setFile(null);
//       }
//     }
//   };

//   // Handle batch submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     setError('');

//     try {
//       // Parse URLs from textarea
//       const urlList = urls
//         .split('\n')
//         .map(url => url.trim())
//         .filter(url => url.length > 0);

//       if (urlList.length === 0) {
//         setError('Please enter at least one URL');
//         setLoading(false);
//         return;
//       }

//       if (urlList.length > 50) {
//         setError('Maximum 50 URLs per batch. Please reduce the number of URLs.');
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         urls: urlList,
//         width: parseInt(width),
//         height: parseInt(height),
//         format: format,
//         full_page: fullPage
//       };

//       const response = await axios.post(
//         `${API_URL}/api/v1/batch/submit`,
//         payload,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setMessage(`✅ Batch job submitted successfully! Job ID: ${response.data.id}`);
      
//       // Clear form after 2 seconds
//       setTimeout(() => {
//         setUrls('');
//         setFile(null);
//         navigate('/activity');
//       }, 2000);

//     } catch (err) {
//       console.error('Batch submission error:', err);
//       setError(err.response?.data?.detail || 'Failed to submit batch job. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//               >
//                 ← Back to Dashboard
//               </button>
//               <button
//                 onClick={() => navigate('/pricing')}
//                 className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Manage Subscription
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Centered Page Header with PixelPerfect Logo */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>

//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
//             Batch Screenshot Jobs
//           </h1>
          
//           <p className="text-gray-600 text-sm sm:text-base">
//             Capture screenshots of multiple websites at once. Process up to 50 URLs per batch.
//           </p>
          
//           <p className="text-sm text-gray-500 mt-2">
//             Pro · up to 50 URLs per batch
//           </p>
//         </div>

//         {/* Form */}
//         <div className="max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             {/* Screenshot Configuration */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <span>📐</span> Screenshot Configuration
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Dimensions */}
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-3">Dimensions</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Width (px)
//                       </label>
//                       <input
//                         type="number"
//                         value={width}
//                         onChange={(e) => setWidth(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Height (px)
//                       </label>
//                       <input
//                         type="number"
//                         value={height}
//                         onChange={(e) => setHeight(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   {/* Preset buttons */}
//                   <div className="flex flex-wrap gap-2 mt-3">
//                     <button
//                       type="button"
//                       onClick={() => { setWidth(1920); setHeight(1080); }}
//                       className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       Desktop (1920x1080)
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => { setWidth(1366); setHeight(768); }}
//                       className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       Laptop (1366x768)
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => { setWidth(375); setHeight(667); }}
//                       className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       Mobile (375x667)
//                     </button>
//                   </div>
//                 </div>

//                 {/* Format */}
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

//                   {/* Quality hint for JPEG/WebP */}
//                   {(format === 'jpeg' || format === 'webp') && (
//                     <p className="text-xs text-blue-600 mb-3">
//                       💡 {format.toUpperCase()} uses optimized quality settings automatically.
//                     </p>
//                   )}

//                   {/* PDF hint */}
//                   {format === 'pdf' && (
//                     <p className="text-xs text-blue-600 mb-3">
//                       💡 PDF captures the full page as a printable document.
//                     </p>
//                   )}

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
//                 </div>
//               </div>
//             </div>

//             {/* URL Input Section */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
//                 {/* Manual URL Entry */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Website URLs (one per line)
//                   </label>
//                   <textarea
//                     value={urls}
//                     onChange={(e) => setUrls(e.target.value)}
//                     rows={10}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
//                     placeholder="https://example.com&#10;https://another-site.com&#10;https://third-site.com"
//                   />
//                   <p className="text-xs text-gray-500 mt-2">
//                     Enter up to 50 URLs, one per line
//                   </p>
//                 </div>

//                 {/* File Upload Section */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Upload File (CSV/TXT/TSV)
//                   </label>
                  
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
//                     <input
//                       type="file"
//                       id="file-upload"
//                       accept=".txt,.csv,.tsv,text/plain,text/csv,text/tab-separated-values"
//                       onChange={handleFileChange}
//                       className="hidden"
//                     />
//                     <label
//                       htmlFor="file-upload"
//                       className="cursor-pointer flex flex-col items-center gap-3"
//                     >
//                       <div className="text-4xl">📄</div>
//                       {file ? (
//                         <>
//                           <div className="text-sm font-medium text-green-600">
//                             ✓ {file.name}
//                           </div>
//                           <p className="text-xs text-gray-500">
//                             File loaded successfully
//                           </p>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             type="button"
//                             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
//                           >
//                             Browse...
//                           </button>
//                           <div className="text-sm text-gray-600">
//                             No file selected
//                           </div>
//                         </>
//                       )}
//                     </label>
                    
//                     <div className="mt-4 text-xs text-gray-500 space-y-1">
//                       <p>Upload any text file containing website URLs.</p>
//                       <p>Supports CSV, TXT, TSV formats.</p>
//                       <p className="text-blue-600 font-medium">
//                         We'll automatically detect URLs in any column or format.
//                       </p>
//                     </div>
//                   </div>

//                   {file && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFile(null);
//                         setUrls('');
//                         document.getElementById('file-upload').value = '';
//                       }}
//                       className="mt-3 w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
//                     >
//                       Clear File
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                 <p className="text-red-600 font-medium">❌ {error}</p>
//               </div>
//             )}

//             {message && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                 <p className="text-green-600 font-medium">{message}</p>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading || (!urls && !file)}
//               className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   Processing Batch...
//                 </span>
//               ) : (
//                 '🚀 Submit Batch Job'
//               )}
//             </button>
//           </form>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="text-center text-sm text-gray-600">
//             <p className="mb-2">© 2026 PixelPerfect API. Built by OneTechly.</p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button onClick={() => navigate('/terms')} className="hover:text-blue-600 transition-colors">
//                 Terms
//               </button>
//               <button onClick={() => navigate('/privacy')} className="hover:text-blue-600 transition-colors">
//                 Privacy
//               </button>
//               <button onClick={() => navigate('/documentation')} className="hover:text-blue-600 transition-colors">
//                 Docs
//               </button>
//               <button onClick={() => navigate('/contact')} className="hover:text-blue-600 transition-colors">
//                 Contact
//               </button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

