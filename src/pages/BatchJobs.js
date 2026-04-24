// frontend/src/pages/BatchJobs.js — PixelPerfect Screenshot API
// UPDATED: April 2026
//   ✅ Preset toast notifications (Desktop/Laptop/Mobile) — matches ScreenshotPage.js
//   ✅ Live polling every 2s while processing
//   ✅ Progress bar per job
//   ✅ Per-item screenshot_url resolved to correct absolute URL
//   ✅ File upload (CSV/TXT/TSV) + textarea URL input
//   ✅ Retry failed items + delete job
//   ✅ Cancel button for queued/processing jobs
//   ✅ MOBILE FIX: resolveScreenshotUrl handles localhost URLs on LAN devices
//   ✅ MOBILE UI FIX: JobCard fully stacked layout — no overlapping badges/buttons
//   ✅ MOBILE FIX (Mar 2026): URL parser uses regex extraction instead of
//      line-start filter so URLs embedded in Android share-sheet lines
//      (e.g. "Page Title https://...") are correctly counted and submitted.
//   ✅ FIX (Apr 2026): Added Tablet (768x1024) viewport preset.
//      Preset buttons now use a 2-column grid on mobile/tablet so all four
//      presets (Desktop, Laptop, Tablet, Mobile) fit without overflow.
//
//   ✅ NEW (Apr 2026): UI parity with ScreenshotPage.js — batch users can now
//      set dark_mode, delay, and remove_elements from the dashboard.
//
//      Background:
//         The backend (batch.py) accepts dark_mode / delay / remove_elements
//         on both /submit and /submit_file endpoints. But the batch dashboard
//         UI didn't expose these fields, so only API users could use them.
//         Now dashboard users have the same power — same visual design as
//         ScreenshotPage.js (checkbox + Advanced Options section).
//
//      What's new:
//         - "Use dark mode" checkbox next to "Capture full page"
//         - "Advanced Options" section with:
//             • Delay before capture (seconds) — number input, 0–10
//             • Remove elements (CSS selectors) — text input
//         - Both paths (JSON + file upload) send the new fields to the backend
//         - remove_elements is sent as an array on JSON; as a comma-separated
//           string on multipart form uploads (backend parses both).

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ── API base (mirrors AuthContext + lib/api.js) ───────────────────────────────
function resolveApiBase() {
  const env = (
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    ''
  ).trim().replace(/\/+$/, '');
  if (env) return env;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'pixelperfectapi.net' || host.endsWith('.pixelperfectapi.net'))
      return 'https://api.pixelperfectapi.net';
    if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:8000';
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) return `http://${host}:8000`;
    return `${window.location.protocol}//${host}:8000`;
  }
  return 'http://localhost:8000';
}

const API_BASE_URL = resolveApiBase();
const POLL_INTERVAL_MS = 2000;

function resolveScreenshotUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const t = rawUrl.trim();
  if (!t) return null;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(t)) {
    return t.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, API_BASE_URL.replace(/\/$/, ''));
  }
  if (t.startsWith('https://')) return t;
  if (t.startsWith('http://')) return t;
  return `${API_BASE_URL}${t.startsWith('/') ? '' : '/'}${t}`;
}

// ── ✅ Viewport presets — Desktop / Laptop / Tablet / Mobile ─────────────────
const VIEWPORT_PRESETS = [
  { label: 'Desktop',  sub: '1920×1080', w: 1920, h: 1080 },
  { label: 'Laptop',   sub: '1366×768',  w: 1366, h: 768  },
  { label: 'Tablet',   sub: '768×1024',  w: 768,  h: 1024 },
  { label: 'Mobile',   sub: '375×667',   w: 375,  h: 667  },
];

// ── URL extraction (regex-based — works with Android share-sheet content) ─────
function extractUrls(text) {
  const matches = text.match(/https?:\/\/[^\s\n\r\t,;"'<>[\]{}|\\^`]+/g) || [];
  const seen = new Set();
  return matches
    .map(u => u.replace(/[.,;:!?)\]}>]+$/, '').trim())
    .filter(u => {
      if (!u || seen.has(u)) return false;
      seen.add(u);
      return true;
    });
}

const formatSize = (bytes) => {
  if (!bytes) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0, n = Number(bytes);
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
};

const statusColor = (s) => ({
  completed:  'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800 animate-pulse',
  queued:     'bg-gray-100 text-gray-600',
  failed:     'bg-red-100 text-red-800',
  partial:    'bg-yellow-100 text-yellow-800',
  cancelled:  'bg-gray-100 text-gray-500',
}[s] || 'bg-gray-100 text-gray-600');

const jobStatusLabel = (j) => ({
  completed:  '✅ Completed',
  partial:    '⚠️ Partial',
  failed:     '❌ Failed',
  cancelled:  '🚫 Cancelled',
  processing: '⏳ Processing...',
}[j.status] || '🕐 Queued');

// ── Progress Bar ──────────────────────────────────────────────────────────────
function JobProgressBar({ job }) {
  const total    = job.total || 1;
  const done     = (job.completed || 0) + (job.failed || 0);
  const pct      = Math.round((done / total) * 100);
  const isActive = job.status === 'processing' || job.status === 'queued';

  return (
    <div className="mt-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">📸 Screenshots Progress</span>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {job.completed} / {job.total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out relative ${
            job.failed > 0 && job.completed === 0
              ? 'bg-red-500'
              : job.failed > 0
              ? 'bg-gradient-to-r from-blue-500 to-yellow-500'
              : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600'
          }`}
          style={{ width: `${pct}%` }}
        >
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>
          {job.queued > 0     && `${job.queued} queued`}
          {job.processing > 0 && ` · ${job.processing} processing`}
          {job.failed > 0     && ` · ${job.failed} failed`}
        </span>
        <span className="font-medium text-gray-600">{pct}% done</span>
      </div>
    </div>
  );
}

// ── Single Job Card ───────────────────────────────────────────────────────────
function JobCard({ job, token, onRetry, onDelete }) {
  const [expanded,   setExpanded]   = useState(false);
  const [retrying,   setRetrying]   = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isActive  = job.status === 'processing' || job.status === 'queued';
  const hasFailed = job.failed > 0;

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${job.id}/retry_failed`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success('Retrying failed items...');
      onRetry(job.id);
    } catch (err) {
      toast.error(`Retry failed: ${err.message}`);
    } finally {
      setRetrying(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this batch job? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${job.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success('Batch job deleted');
      onDelete(job.id);
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`);
      setDeleting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this batch job? Screenshots already captured will be kept.')) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${job.id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success('Batch job cancelled');
      onRetry(job.id);
    } catch (err) {
      toast.error(`Cancel failed: ${err.message}`);
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="p-4 sm:p-5">

        {/* Row 1: Job ID + Format pill */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded
                       truncate max-w-[60%] sm:max-w-none"
            title={job.id}
          >
            {job.id}
          </span>
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold
                           bg-indigo-100 text-indigo-800">
            {(job.format || 'png').toUpperCase()}
          </span>
        </div>

        {/* Row 2: Status badge */}
        <div className="mb-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full
                            text-xs font-semibold ${statusColor(job.status)}`}>
            {jobStatusLabel(job)}
          </span>
        </div>

        {/* Row 3: Timestamps */}
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Created: {new Date(job.created_at + 'Z').toLocaleString()}
          {job.completed_at && (
            <> · Finished: {new Date(job.completed_at + 'Z').toLocaleString()}</>
          )}
        </p>

        {/* Row 4: Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isActive && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                         bg-red-50 text-red-600 border border-red-200
                         hover:bg-red-100 active:bg-red-200
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelling ? '⏳ Cancelling…' : '✕ Cancel'}
            </button>
          )}

          {hasFailed && !isActive && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                         bg-yellow-50 text-yellow-700 border border-yellow-200
                         hover:bg-yellow-100 active:bg-yellow-200
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {retrying ? '↺ Retrying...' : '↺ Retry Failed'}
            </button>
          )}

          <button
            onClick={() => setExpanded(v => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                       bg-blue-50 text-blue-700 border border-blue-200
                       hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            {expanded ? '▲ Collapse' : '▼ View Items'}
          </button>

          {!isActive && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm
                         bg-red-50 text-red-600 border border-red-200
                         hover:bg-red-100 active:bg-red-200
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Delete this batch job"
            >
              {deleting ? '…' : '🗑'}
            </button>
          )}
        </div>

        <JobProgressBar job={job} />
      </div>

      {expanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-50">
          {(job.items || []).map((item) => {
            const viewUrl = resolveScreenshotUrl(item.screenshot_url);
            return (
              <div
                key={item.idx}
                className={`px-4 sm:px-5 py-3 ${
                  item.status === 'failed'    ? 'bg-red-50'      :
                  item.status === 'completed' ? 'bg-green-50/40' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0 font-mono">
                    #{item.idx + 1}
                  </span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.status === 'completed'  ? 'bg-green-500' :
                    item.status === 'failed'     ? 'bg-red-500'   :
                    item.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                    'bg-gray-300'
                  }`} />
                  <span
                    className="text-sm text-gray-700 flex-1 min-w-0 truncate"
                    title={item.url}
                  >
                    {item.url}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pl-8">
                  {item.file_size && (
                    <span className="text-xs text-gray-400">📏 {formatSize(item.file_size)}</span>
                  )}
                  {item.processing_time && (
                    <span className="text-xs text-gray-400">⏱ {item.processing_time}s</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
                    {item.status}
                  </span>

                  {viewUrl ? (
                    <a
                      href={viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1
                                 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg
                                 hover:bg-blue-100 text-xs font-medium transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View
                    </a>
                  ) : item.status === 'failed' ? (
                    <span
                      className="text-xs text-red-500 max-w-[200px] truncate"
                      title={item.message}
                    >
                      ⚠ {item.message || 'Failed'}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BatchJobs() {
  const navigate  = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { tier }  = useSubscription();

  const [urlText,        setUrlText]        = useState('');
  const [format,         setFormat]         = useState('png');
  const [width,          setWidth]          = useState(1920);
  const [height,         setHeight]         = useState(1080);
  const [fullPage,       setFullPage]       = useState(false);

  // ✅ NEW (Apr 2026): parity with ScreenshotPage.js Advanced Options
  const [darkMode,       setDarkMode]       = useState(false);
  const [delay,          setDelay]          = useState(0);
  const [removeElements, setRemoveElements] = useState('');

  const [uploadedFile,   setUploadedFile]   = useState(null);
  const [dragOver,       setDragOver]       = useState(false);
  const fileInputRef = useRef(null);

  const [jobs,           setJobs]           = useState([]);
  const [submitting,     setSubmitting]     = useState(false);
  const [submittedJobId, setSubmittedJobId] = useState(null);
  const [loadingJobs,    setLoadingJobs]    = useState(false);

  const pollRef    = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const tierLower = (tier || '').toLowerCase();
  const hasAccess = tierLower !== 'free';
  const tierLimit = tierLower === 'business' ? 200 : tierLower === 'premium' ? 1000 : hasAccess ? 50 : 0;

  const parsedUrls = extractUrls(urlText);
  const urlCount   = uploadedFile ? '(from file)' : parsedUrls.length;

  // ── Apply viewport preset with toast ───────────────────────────────────────
  const applyPreset = (preset) => {
    setWidth(preset.w);
    setHeight(preset.h);
    toast.success(`Applied ${preset.label} (${preset.sub}) preset`);
  };

  // ── Fetch all jobs ──────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoadingJobs(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (mountedRef.current) setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!silent) toast.error(`Failed to load jobs: ${err.message}`);
    } finally {
      if (!silent && mountedRef.current) setLoadingJobs(false);
    }
  }, [token]);

  // ── Poll active job ─────────────────────────────────────────────────────────
  const pollJob = useCallback(async (jobId) => {
    if (!token || !jobId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const updated = await res.json();
      if (!mountedRef.current) return;

      setJobs(prev => prev.map(j => j.id === jobId ? updated : j));

      if (!['queued', 'processing'].includes(updated.status)) {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;

        if (updated.status === 'completed') {
          toast.success(
            `✅ Batch complete: ${updated.completed}/${updated.total} screenshots captured`,
            { duration: 5000 }
          );
        } else if (updated.status === 'partial') {
          toast(`⚠️ Batch partial: ${updated.completed} succeeded, ${updated.failed} failed`, {
            duration: 6000, icon: '⚠️',
          });
        } else {
          toast.error('❌ Batch failed — click "View Items" for error details', { duration: 6000 });
        }
      }
    } catch { /* silent */ }
  }, [token]);

  useEffect(() => {
    if (!submittedJobId) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => pollJob(submittedJobId), POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [submittedJobId, pollJob]);

  useEffect(() => { if (isAuthenticated) fetchJobs(); }, [isAuthenticated, fetchJobs]);

  // ── File handling ───────────────────────────────────────────────────────────
  const handleFile = (file) => {
    if (!file) return;
    const name = (file.name || '').toLowerCase();
    if (!name.endsWith('.csv') && !name.endsWith('.txt') && !name.endsWith('.tsv')) {
      toast.error('Please upload a .csv, .txt, or .tsv file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { toast.error('File too large (max 2 MB)'); return; }
    setUploadedFile(file);
    toast.success(`📄 File loaded: ${file.name}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ── Submit batch ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!hasAccess) { toast.error('Batch processing requires a Pro plan or higher'); return; }
    setSubmitting(true);
    try {
      let res;

      // ✅ NEW: parse remove_elements textbox → array (for JSON path)
      // Same parsing convention as ScreenshotPage.js: split on commas,
      // strip whitespace, drop empties.
      const parsedRemoveList = removeElements
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (uploadedFile) {
        // ── File upload path (multipart form) ────────────────────────────────
        // Backend (batch.py) _parse_remove_elements_form accepts a
        // comma-separated string OR a JSON array. We send comma-separated
        // because it matches what the textbox already contains.
        const form = new FormData();
        form.append('file', uploadedFile);
        form.append('format', format);
        form.append('width',  String(width));
        form.append('height', String(height));
        form.append('full_page', String(fullPage));
        form.append('dark_mode', String(darkMode));
        form.append('delay',     String(delay || 0));
        if (removeElements.trim()) {
          // Send the raw textbox value — backend parses comma-separated
          form.append('remove_elements', removeElements.trim());
        }

        res = await fetch(`${API_BASE_URL}/api/v1/batch/submit_file`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      } else {
        // ── JSON path ────────────────────────────────────────────────────────
        if (!parsedUrls.length) {
          toast.error('Please enter at least one valid URL (starting with http:// or https://)');
          setSubmitting(false);
          return;
        }

        const payload = {
          urls:      parsedUrls,
          format,
          width,
          height,
          full_page: fullPage,
          dark_mode: darkMode,
          delay:     delay || 0,
        };
        // Only include remove_elements when user actually entered something
        if (parsedRemoveList.length > 0) {
          payload.remove_elements = parsedRemoveList;
        }

        res = await fetch(`${API_BASE_URL}/api/v1/batch/submit`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const job = await res.json();
      setJobs(prev => [job, ...prev]);
      setSubmittedJobId(job.id);
      setUrlText('');
      setUploadedFile(null);
      // Note: we deliberately keep darkMode/delay/removeElements as-is so that
      // users submitting multiple batches don't have to re-check their
      // preferred settings every time. Same UX choice ScreenshotPage makes.
      toast.success(`🚀 Batch job submitted! Job ID: ${job.id}`, { duration: 5000 });
    } catch (err) {
      toast.error(`Submission failed: ${err.message}`, { duration: 6000 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryJob  = (jobId) => setSubmittedJobId(jobId);
  const handleDeleteJob = (jobId) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    if (submittedJobId === jobId) {
      setSubmittedJobId(null);
      if (pollRef.current) clearInterval(pollRef.current);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm rounded-lg
                           hover:bg-blue-700 font-medium transition-colors"
              >
                Manage Plan
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Screenshot Jobs</h1>
          <p className="text-gray-600">
            Capture screenshots of multiple websites at once.
            Process up to {tierLimit} URLs per batch.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {hasAccess
              ? `${tier?.charAt(0).toUpperCase() + tier?.slice(1)} · up to ${tierLimit} URLs per batch`
              : 'Free plan · Batch not available'}
          </p>
        </div>

        {!hasAccess && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-amber-800 mb-1">Pro Plan Required</h3>
            <p className="text-sm text-amber-700 mb-3">
              Batch processing is available on Pro and Business plans.
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
            >
              Upgrade Now
            </button>
          </div>
        )}

        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 ${!hasAccess ? 'opacity-60 pointer-events-none' : ''}`}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-gray-400">📐</span> Screenshot Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Dimensions</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Width (px)</label>
                    <input
                      type="number" value={width} min={320} max={7680}
                      onChange={e => setWidth(parseInt(e.target.value) || 1920)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
                    <input
                      type="number" value={height} min={240} max={4320}
                      onChange={e => setHeight(parseInt(e.target.value) || 1080)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                    {VIEWPORT_PRESETS.map(p => (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p)}
                        className="flex flex-col items-center px-2 py-2 bg-gray-100
                                   hover:bg-blue-50 hover:border-blue-300
                                   border border-transparent rounded-lg text-center
                                   transition-colors group"
                      >
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 leading-tight">
                          {p.label}
                        </span>
                        <span className="text-[10px] text-gray-400 group-hover:text-blue-500 mt-0.5 leading-tight">
                          {p.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Format</h3>
                <select
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="png">PNG (lossless)</option>
                  <option value="jpeg">JPEG (compressed)</option>
                  <option value="webp">WebP (best ratio)</option>
                  <option value="pdf">PDF (document)</option>
                </select>

                {/* ── ✅ NEW (Apr 2026): dark mode checkbox — parity with ScreenshotPage ── */}
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox" checked={fullPage}
                    onChange={e => setFullPage(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Capture full page (scrolling)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input
                    type="checkbox" checked={darkMode}
                    onChange={e => setDarkMode(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Use dark mode</span>
                </label>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">URL Preview</span>
                    <span className={`font-semibold ${
                      typeof urlCount === 'number' && urlCount > tierLimit
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {typeof urlCount === 'number' ? `${urlCount}/${tierLimit}` : urlCount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadedFile ? 'Previewing URLs from uploaded file.' : 'Previewing URLs from textarea.'}
                  </p>
                  {parsedUrls[0] && !uploadedFile && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      Example: {parsedUrls[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── ✅ NEW (Apr 2026): Advanced Options section — parity with ScreenshotPage ── */}
          {/*                                                                                 */}
          {/* Mirrors the Advanced Options layout from ScreenshotPage.js exactly so           */}
          {/* users moving between single and batch pages get a consistent mental model.      */}
          {/* Settings persist across submissions (they don't reset) — matches ScreenshotPage.*/}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Delay before capture (seconds)</label>
                <input
                  type="number"
                  value={delay}
                  onChange={e => setDelay(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0" max="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Wait time per URL to allow page to fully load (0–10s)
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Remove elements (CSS selectors)</label>
                <input
                  type="text"
                  value={removeElements}
                  onChange={e => setRemoveElements(e.target.value)}
                  placeholder=".cookie-banner, #popup, .ads"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Applied to every URL in the batch. Comma-separated.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URLs (one per line)
              </label>
              <textarea
                value={urlText}
                onChange={e => setUrlText(e.target.value)}
                placeholder={'https://example.com\nhttps://another-site.com'}
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter up to {tierLimit} URLs, one per line
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (CSV/TXT/TSV)
              </label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                            transition-colors flex flex-col items-center justify-center min-h-[200px]
                            ${dragOver
                              ? 'border-blue-400 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,.tsv"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0])}
                />
                {uploadedFile ? (
                  <>
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-sm font-medium text-green-700">✓ {uploadedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(uploadedFile.size / 1024).toFixed(1)} KB · Max: 2.00 MB
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
                      className="mt-3 px-3 py-1 bg-red-50 text-red-600 border border-red-200
                                 rounded text-xs hover:bg-red-100 transition-colors"
                    >
                      Clear File
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2 opacity-40">📄</div>
                    <p className="text-sm text-gray-600">Drag & drop a file here</p>
                    <p className="text-xs text-gray-500">or tap to browse</p>
                    <button className="mt-3 px-3 py-1 bg-white border border-gray-300 rounded
                                       text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                      Browse...
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Supported: CSV, TXT, TSV</p>
                    <p className="text-xs text-gray-400">Max size: 2.00 MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !hasAccess || (!parsedUrls.length && !uploadedFile)}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl
                       hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors text-base
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {submitting ? '⏳ Submitting...' : '🚀 Submit Batch Job'}
          </button>
        </div>

        {/* ── Jobs list ── */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Your Batch Jobs
              {jobs.length > 0 && (
                <span className="text-gray-400 font-normal text-base"> ({jobs.length})</span>
              )}
            </h2>
            <button
              onClick={() => fetchJobs()}
              disabled={loadingJobs}
              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg
                         text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1.5"
            >
              🔄 {loadingJobs ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loadingJobs && jobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading your batch jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No batch jobs yet</h3>
              <p className="text-gray-600 text-sm">Submit a batch job above to get started.</p>
            </div>
          ) : (
            jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                token={token}
                onRetry={handleRetryJob}
                onDelete={handleDeleteJob}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// // ======= END OF BatchJobs.js ==============

// // =======================================================================================================

// // frontend/src/pages/BatchJobs.js — PixelPerfect Screenshot API
// // UPDATED: April 2026
// //   ✅ Preset toast notifications (Desktop/Laptop/Mobile) — matches ScreenshotPage.js
// //   ✅ Live polling every 2s while processing
// //   ✅ Progress bar per job
// //   ✅ Per-item screenshot_url resolved to correct absolute URL
// //   ✅ File upload (CSV/TXT/TSV) + textarea URL input
// //   ✅ Retry failed items + delete job
// //   ✅ Cancel button for queued/processing jobs
// //   ✅ MOBILE FIX: resolveScreenshotUrl handles localhost URLs on LAN devices
// //   ✅ MOBILE UI FIX: JobCard fully stacked layout — no overlapping badges/buttons
// //   ✅ MOBILE FIX (Mar 2026): URL parser uses regex extraction instead of
// //      line-start filter so URLs embedded in Android share-sheet lines
// //      (e.g. "Page Title https://...") are correctly counted and submitted.
// //   ✅ FIX (Apr 2026): Added Tablet (768x1024) viewport preset.
// //      Preset buttons now use a 2-column grid on mobile/tablet so all four
// //      presets (Desktop, Laptop, Tablet, Mobile) fit without overflow.

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import { useSubscription } from '../contexts/SubscriptionContext';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// // ── API base (mirrors AuthContext + lib/api.js) ───────────────────────────────
// function resolveApiBase() {
//   const env = (
//     process.env.REACT_APP_API_BASE_URL ||
//     process.env.REACT_APP_API_URL ||
//     ''
//   ).trim().replace(/\/+$/, '');
//   if (env) return env;
//   if (typeof window !== 'undefined') {
//     const host = window.location.hostname;
//     if (host === 'pixelperfectapi.net' || host.endsWith('.pixelperfectapi.net'))
//       return 'https://api.pixelperfectapi.net';
//     if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:8000';
//     if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) return `http://${host}:8000`;
//     return `${window.location.protocol}//${host}:8000`;
//   }
//   return 'http://localhost:8000';
// }

// const API_BASE_URL = resolveApiBase();
// const POLL_INTERVAL_MS = 2000;

// function resolveScreenshotUrl(rawUrl) {
//   if (!rawUrl || typeof rawUrl !== 'string') return null;
//   const t = rawUrl.trim();
//   if (!t) return null;
//   if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(t)) {
//     return t.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, API_BASE_URL.replace(/\/$/, ''));
//   }
//   if (t.startsWith('https://')) return t;
//   if (t.startsWith('http://')) return t;
//   return `${API_BASE_URL}${t.startsWith('/') ? '' : '/'}${t}`;
// }

// // ── ✅ Viewport presets — Desktop / Laptop / Tablet / Mobile ─────────────────
// //
// // Added: Tablet (768x1024) between Laptop and Mobile.
// // This matches the standard iPad portrait viewport and is the most commonly
// // used tablet breakpoint for screenshot testing.
// //
// // Layout note: with 4 presets the buttons use a 2×2 grid on narrow screens
// // (grid-cols-2) and a single row (grid-cols-4) on md+ screens, so they never
// // overflow or wrap awkwardly on any device.
// const VIEWPORT_PRESETS = [
//   { label: 'Desktop',  sub: '1920×1080', w: 1920, h: 1080 },
//   { label: 'Laptop',   sub: '1366×768',  w: 1366, h: 768  },
//   { label: 'Tablet',   sub: '768×1024',  w: 768,  h: 1024 },
//   { label: 'Mobile',   sub: '375×667',   w: 375,  h: 667  },
// ];

// // ── URL extraction (regex-based — works with Android share-sheet content) ─────
// function extractUrls(text) {
//   const matches = text.match(/https?:\/\/[^\s\n\r\t,;"'<>[\]{}|\\^`]+/g) || [];
//   const seen = new Set();
//   return matches
//     .map(u => u.replace(/[.,;:!?)\]}>]+$/, '').trim())
//     .filter(u => {
//       if (!u || seen.has(u)) return false;
//       seen.add(u);
//       return true;
//     });
// }

// const formatSize = (bytes) => {
//   if (!bytes) return '—';
//   const units = ['B', 'KB', 'MB', 'GB'];
//   let i = 0, n = Number(bytes);
//   while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
//   return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
// };

// const statusColor = (s) => ({
//   completed:  'bg-green-100 text-green-800',
//   processing: 'bg-blue-100 text-blue-800 animate-pulse',
//   queued:     'bg-gray-100 text-gray-600',
//   failed:     'bg-red-100 text-red-800',
//   partial:    'bg-yellow-100 text-yellow-800',
//   cancelled:  'bg-gray-100 text-gray-500',
// }[s] || 'bg-gray-100 text-gray-600');

// const jobStatusLabel = (j) => ({
//   completed:  '✅ Completed',
//   partial:    '⚠️ Partial',
//   failed:     '❌ Failed',
//   cancelled:  '🚫 Cancelled',
//   processing: '⏳ Processing...',
// }[j.status] || '🕐 Queued');

// // ── Progress Bar ──────────────────────────────────────────────────────────────
// function JobProgressBar({ job }) {
//   const total    = job.total || 1;
//   const done     = (job.completed || 0) + (job.failed || 0);
//   const pct      = Math.round((done / total) * 100);
//   const isActive = job.status === 'processing' || job.status === 'queued';

//   return (
//     <div className="mt-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-sm font-semibold text-gray-700">📸 Screenshots Progress</span>
//         <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//           {job.completed} / {job.total}
//         </span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//         <div
//           className={`h-3 rounded-full transition-all duration-500 ease-out relative ${
//             job.failed > 0 && job.completed === 0
//               ? 'bg-red-500'
//               : job.failed > 0
//               ? 'bg-gradient-to-r from-blue-500 to-yellow-500'
//               : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600'
//           }`}
//           style={{ width: `${pct}%` }}
//         >
//           {isActive && (
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
//           )}
//         </div>
//       </div>
//       <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
//         <span>
//           {job.queued > 0     && `${job.queued} queued`}
//           {job.processing > 0 && ` · ${job.processing} processing`}
//           {job.failed > 0     && ` · ${job.failed} failed`}
//         </span>
//         <span className="font-medium text-gray-600">{pct}% done</span>
//       </div>
//     </div>
//   );
// }

// // ── Single Job Card ───────────────────────────────────────────────────────────
// function JobCard({ job, token, onRetry, onDelete }) {
//   const [expanded,   setExpanded]   = useState(false);
//   const [retrying,   setRetrying]   = useState(false);
//   const [deleting,   setDeleting]   = useState(false);
//   const [cancelling, setCancelling] = useState(false);

//   const isActive  = job.status === 'processing' || job.status === 'queued';
//   const hasFailed = job.failed > 0;

//   const handleRetry = async () => {
//     setRetrying(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${job.id}/retry_failed`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       toast.success('Retrying failed items...');
//       onRetry(job.id);
//     } catch (err) {
//       toast.error(`Retry failed: ${err.message}`);
//     } finally {
//       setRetrying(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm('Delete this batch job? This cannot be undone.')) return;
//     setDeleting(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${job.id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       toast.success('Batch job deleted');
//       onDelete(job.id);
//     } catch (err) {
//       toast.error(`Delete failed: ${err.message}`);
//       setDeleting(false);
//     }
//   };

//   const handleCancel = async () => {
//     if (!window.confirm('Cancel this batch job? Screenshots already captured will be kept.')) return;
//     setCancelling(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${job.id}/cancel`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       toast.success('Batch job cancelled');
//       onRetry(job.id);
//     } catch (err) {
//       toast.error(`Cancel failed: ${err.message}`);
//       setCancelling(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
//       <div className="p-4 sm:p-5">

//         {/* Row 1: Job ID + Format pill */}
//         <div className="flex items-center justify-between gap-2 mb-2">
//           <span
//             className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded
//                        truncate max-w-[60%] sm:max-w-none"
//             title={job.id}
//           >
//             {job.id}
//           </span>
//           <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold
//                            bg-indigo-100 text-indigo-800">
//             {(job.format || 'png').toUpperCase()}
//           </span>
//         </div>

//         {/* Row 2: Status badge */}
//         <div className="mb-2">
//           <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full
//                             text-xs font-semibold ${statusColor(job.status)}`}>
//             {jobStatusLabel(job)}
//           </span>
//         </div>

//         {/* Row 3: Timestamps */}
//         <p className="text-xs text-gray-500 mb-3 leading-relaxed">
//           Created: {new Date(job.created_at + 'Z').toLocaleString()}
//           {job.completed_at && (
//             <> · Finished: {new Date(job.completed_at + 'Z').toLocaleString()}</>
//           )}
//         </p>

//         {/* Row 4: Action buttons */}
//         <div className="flex flex-wrap items-center gap-2">
//           {isActive && (
//             <button
//               onClick={handleCancel}
//               disabled={cancelling}
//               className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
//                          bg-red-50 text-red-600 border border-red-200
//                          hover:bg-red-100 active:bg-red-200
//                          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {cancelling ? '⏳ Cancelling…' : '✕ Cancel'}
//             </button>
//           )}

//           {hasFailed && !isActive && (
//             <button
//               onClick={handleRetry}
//               disabled={retrying}
//               className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
//                          bg-yellow-50 text-yellow-700 border border-yellow-200
//                          hover:bg-yellow-100 active:bg-yellow-200
//                          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {retrying ? '↺ Retrying...' : '↺ Retry Failed'}
//             </button>
//           )}

//           <button
//             onClick={() => setExpanded(v => !v)}
//             className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
//                        bg-blue-50 text-blue-700 border border-blue-200
//                        hover:bg-blue-100 active:bg-blue-200 transition-colors"
//           >
//             {expanded ? '▲ Collapse' : '▼ View Items'}
//           </button>

//           {!isActive && (
//             <button
//               onClick={handleDelete}
//               disabled={deleting}
//               className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm
//                          bg-red-50 text-red-600 border border-red-200
//                          hover:bg-red-100 active:bg-red-200
//                          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               title="Delete this batch job"
//             >
//               {deleting ? '…' : '🗑'}
//             </button>
//           )}
//         </div>

//         <JobProgressBar job={job} />
//       </div>

//       {expanded && (
//         <div className="border-t border-gray-100 divide-y divide-gray-50">
//           {(job.items || []).map((item) => {
//             const viewUrl = resolveScreenshotUrl(item.screenshot_url);
//             return (
//               <div
//                 key={item.idx}
//                 className={`px-4 sm:px-5 py-3 ${
//                   item.status === 'failed'    ? 'bg-red-50'      :
//                   item.status === 'completed' ? 'bg-green-50/40' : ''
//                 }`}
//               >
//                 <div className="flex items-center gap-2 mb-1.5">
//                   <span className="text-xs text-gray-400 w-6 flex-shrink-0 font-mono">
//                     #{item.idx + 1}
//                   </span>
//                   <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
//                     item.status === 'completed'  ? 'bg-green-500' :
//                     item.status === 'failed'     ? 'bg-red-500'   :
//                     item.status === 'processing' ? 'bg-blue-500 animate-pulse' :
//                     'bg-gray-300'
//                   }`} />
//                   <span
//                     className="text-sm text-gray-700 flex-1 min-w-0 truncate"
//                     title={item.url}
//                   >
//                     {item.url}
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-2 pl-8">
//                   {item.file_size && (
//                     <span className="text-xs text-gray-400">📏 {formatSize(item.file_size)}</span>
//                   )}
//                   {item.processing_time && (
//                     <span className="text-xs text-gray-400">⏱ {item.processing_time}s</span>
//                   )}
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
//                     {item.status}
//                   </span>

//                   {viewUrl ? (
//                     <a
//                       href={viewUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1 px-2.5 py-1
//                                  bg-blue-50 text-blue-700 border border-blue-200 rounded-lg
//                                  hover:bg-blue-100 text-xs font-medium transition-colors"
//                     >
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                           d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                       </svg>
//                       View
//                     </a>
//                   ) : item.status === 'failed' ? (
//                     <span
//                       className="text-xs text-red-500 max-w-[200px] truncate"
//                       title={item.message}
//                     >
//                       ⚠ {item.message || 'Failed'}
//                     </span>
//                   ) : null}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function BatchJobs() {
//   const navigate  = useNavigate();
//   const { token, isAuthenticated } = useAuth();
//   const { tier }  = useSubscription();

//   const [urlText,        setUrlText]        = useState('');
//   const [format,         setFormat]         = useState('png');
//   const [width,          setWidth]          = useState(1920);
//   const [height,         setHeight]         = useState(1080);
//   const [fullPage,       setFullPage]       = useState(false);
//   const [uploadedFile,   setUploadedFile]   = useState(null);
//   const [dragOver,       setDragOver]       = useState(false);
//   const fileInputRef = useRef(null);

//   const [jobs,           setJobs]           = useState([]);
//   const [submitting,     setSubmitting]     = useState(false);
//   const [submittedJobId, setSubmittedJobId] = useState(null);
//   const [loadingJobs,    setLoadingJobs]    = useState(false);

//   const pollRef    = useRef(null);
//   const mountedRef = useRef(true);

//   useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     mountedRef.current = true;
//     return () => {
//       mountedRef.current = false;
//       if (pollRef.current) clearInterval(pollRef.current);
//     };
//   }, []);

//   const tierLower = (tier || '').toLowerCase();
//   const hasAccess = tierLower !== 'free';
//   const tierLimit = tierLower === 'business' ? 200 : tierLower === 'premium' ? 1000 : hasAccess ? 50 : 0;

//   const parsedUrls = extractUrls(urlText);
//   const urlCount   = uploadedFile ? '(from file)' : parsedUrls.length;

//   // ── Apply viewport preset with toast ───────────────────────────────────────
//   const applyPreset = (preset) => {
//     setWidth(preset.w);
//     setHeight(preset.h);
//     toast.success(`Applied ${preset.label} (${preset.sub}) preset`);
//   };

//   // ── Fetch all jobs ──────────────────────────────────────────────────────────
//   const fetchJobs = useCallback(async (silent = false) => {
//     if (!token) return;
//     if (!silent) setLoadingJobs(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       if (mountedRef.current) setJobs(Array.isArray(data) ? data : []);
//     } catch (err) {
//       if (!silent) toast.error(`Failed to load jobs: ${err.message}`);
//     } finally {
//       if (!silent && mountedRef.current) setLoadingJobs(false);
//     }
//   }, [token]);

//   // ── Poll active job ─────────────────────────────────────────────────────────
//   const pollJob = useCallback(async (jobId) => {
//     if (!token || !jobId) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/batch/jobs/${jobId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) return;
//       const updated = await res.json();
//       if (!mountedRef.current) return;

//       setJobs(prev => prev.map(j => j.id === jobId ? updated : j));

//       if (!['queued', 'processing'].includes(updated.status)) {
//         if (pollRef.current) clearInterval(pollRef.current);
//         pollRef.current = null;

//         if (updated.status === 'completed') {
//           toast.success(
//             `✅ Batch complete: ${updated.completed}/${updated.total} screenshots captured`,
//             { duration: 5000 }
//           );
//         } else if (updated.status === 'partial') {
//           toast(`⚠️ Batch partial: ${updated.completed} succeeded, ${updated.failed} failed`, {
//             duration: 6000, icon: '⚠️',
//           });
//         } else {
//           toast.error('❌ Batch failed — click "View Items" for error details', { duration: 6000 });
//         }
//       }
//     } catch { /* silent */ }
//   }, [token]);

//   useEffect(() => {
//     if (!submittedJobId) return;
//     if (pollRef.current) clearInterval(pollRef.current);
//     pollRef.current = setInterval(() => pollJob(submittedJobId), POLL_INTERVAL_MS);
//     return () => { if (pollRef.current) clearInterval(pollRef.current); };
//   }, [submittedJobId, pollJob]);

//   useEffect(() => { if (isAuthenticated) fetchJobs(); }, [isAuthenticated, fetchJobs]);

//   // ── File handling ───────────────────────────────────────────────────────────
//   const handleFile = (file) => {
//     if (!file) return;
//     const name = (file.name || '').toLowerCase();
//     if (!name.endsWith('.csv') && !name.endsWith('.txt') && !name.endsWith('.tsv')) {
//       toast.error('Please upload a .csv, .txt, or .tsv file');
//       return;
//     }
//     if (file.size > 2 * 1024 * 1024) { toast.error('File too large (max 2 MB)'); return; }
//     setUploadedFile(file);
//     toast.success(`📄 File loaded: ${file.name}`);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) handleFile(file);
//   };

//   // ── Submit batch ────────────────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (!hasAccess) { toast.error('Batch processing requires a Pro plan or higher'); return; }
//     setSubmitting(true);
//     try {
//       let res;
//       if (uploadedFile) {
//         const form = new FormData();
//         form.append('file', uploadedFile);
//         form.append('format', format);
//         form.append('width',  String(width));
//         form.append('height', String(height));
//         form.append('full_page', String(fullPage));
//         res = await fetch(`${API_BASE_URL}/api/v1/batch/submit_file`, {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${token}` },
//           body: form,
//         });
//       } else {
//         if (!parsedUrls.length) {
//           toast.error('Please enter at least one valid URL (starting with http:// or https://)');
//           setSubmitting(false);
//           return;
//         }
//         res = await fetch(`${API_BASE_URL}/api/v1/batch/submit`, {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//           body: JSON.stringify({ urls: parsedUrls, format, width, height, full_page: fullPage }),
//         });
//       }
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.detail || `HTTP ${res.status}`);
//       }
//       const job = await res.json();
//       setJobs(prev => [job, ...prev]);
//       setSubmittedJobId(job.id);
//       setUrlText('');
//       setUploadedFile(null);
//       toast.success(`🚀 Batch job submitted! Job ID: ${job.id}`, { duration: 5000 });
//     } catch (err) {
//       toast.error(`Submission failed: ${err.message}`, { duration: 6000 });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRetryJob  = (jobId) => setSubmittedJobId(jobId);
//   const handleDeleteJob = (jobId) => {
//     setJobs(prev => prev.filter(j => j.id !== jobId));
//     if (submittedJobId === jobId) {
//       setSubmittedJobId(null);
//       if (pollRef.current) clearInterval(pollRef.current);
//     }
//   };

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>
//             <div className="flex items-center gap-3 sm:gap-4">
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="text-sm text-gray-600 hover:text-gray-900"
//               >
//                 ← Back
//               </button>
//               <button
//                 onClick={() => navigate('/subscription')}
//                 className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm rounded-lg
//                            hover:bg-blue-700 font-medium transition-colors"
//               >
//                 Manage Plan
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Screenshot Jobs</h1>
//           <p className="text-gray-600">
//             Capture screenshots of multiple websites at once.
//             Process up to {tierLimit} URLs per batch.
//           </p>
//           <p className="text-sm text-gray-500 mt-1">
//             {hasAccess
//               ? `${tier?.charAt(0).toUpperCase() + tier?.slice(1)} · up to ${tierLimit} URLs per batch`
//               : 'Free plan · Batch not available'}
//           </p>
//         </div>

//         {!hasAccess && (
//           <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
//             <div className="text-3xl mb-2">🔒</div>
//             <h3 className="font-semibold text-amber-800 mb-1">Pro Plan Required</h3>
//             <p className="text-sm text-amber-700 mb-3">
//               Batch processing is available on Pro and Business plans.
//             </p>
//             <button
//               onClick={() => navigate('/subscription')}
//               className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
//             >
//               Upgrade Now
//             </button>
//           </div>
//         )}

//         <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 ${!hasAccess ? 'opacity-60 pointer-events-none' : ''}`}>
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <span className="text-gray-400">📐</span> Screenshot Configuration
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">Dimensions</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">Width (px)</label>
//                     <input
//                       type="number" value={width} min={320} max={7680}
//                       onChange={e => setWidth(parseInt(e.target.value) || 1920)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
//                                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
//                     <input
//                       type="number" value={height} min={240} max={4320}
//                       onChange={e => setHeight(parseInt(e.target.value) || 1080)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
//                                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* ── ✅ Viewport preset buttons — 2×2 grid on mobile/tablet, 4-col on md+ ── */}
//                   {/*                                                                            */}
//                   {/* With 4 presets, a single flex-wrap row causes overflow on 375px screens.  */}
//                   {/* grid-cols-2 keeps two buttons per row on narrow viewports; grid-cols-4    */}
//                   {/* restores a single row on medium screens and wider.                        */}
//                   {/* Each button shows the device name in bold + resolution as a muted sub-    */}
//                   {/* label, making it clear at a glance what each preset does.                 */}
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
//                     {VIEWPORT_PRESETS.map(p => (
//                       <button
//                         key={p.label}
//                         onClick={() => applyPreset(p)}
//                         className="flex flex-col items-center px-2 py-2 bg-gray-100
//                                    hover:bg-blue-50 hover:border-blue-300
//                                    border border-transparent rounded-lg text-center
//                                    transition-colors group"
//                       >
//                         <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 leading-tight">
//                           {p.label}
//                         </span>
//                         <span className="text-[10px] text-gray-400 group-hover:text-blue-500 mt-0.5 leading-tight">
//                           {p.sub}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">Format</h3>
//                 <select
//                   value={format}
//                   onChange={e => setFormat(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3
//                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="png">PNG (lossless)</option>
//                   <option value="jpeg">JPEG (compressed)</option>
//                   <option value="webp">WebP (best ratio)</option>
//                   <option value="pdf">PDF (document)</option>
//                 </select>

//                 <label className="flex items-center gap-2 cursor-pointer mb-4">
//                   <input
//                     type="checkbox" checked={fullPage}
//                     onChange={e => setFullPage(e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300 text-blue-600"
//                   />
//                   <span className="text-sm text-gray-700">Capture full page (scrolling)</span>
//                 </label>

//                 <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">URL Preview</span>
//                     <span className={`font-semibold ${
//                       typeof urlCount === 'number' && urlCount > tierLimit
//                         ? 'text-red-600'
//                         : 'text-green-600'
//                     }`}>
//                       {typeof urlCount === 'number' ? `${urlCount}/${tierLimit}` : urlCount}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {uploadedFile ? 'Previewing URLs from uploaded file.' : 'Previewing URLs from textarea.'}
//                   </p>
//                   {parsedUrls[0] && !uploadedFile && (
//                     <p className="text-xs text-gray-400 mt-1 truncate">
//                       Example: {parsedUrls[0]}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Website URLs (one per line)
//               </label>
//               <textarea
//                 value={urlText}
//                 onChange={e => setUrlText(e.target.value)}
//                 placeholder={'https://example.com\nhttps://another-site.com'}
//                 rows={8}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono
//                            focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Enter up to {tierLimit} URLs, one per line
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Upload File (CSV/TXT/TSV)
//               </label>
//               <div
//                 onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={handleDrop}
//                 onClick={() => fileInputRef.current?.click()}
//                 className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
//                             transition-colors flex flex-col items-center justify-center min-h-[200px]
//                             ${dragOver
//                               ? 'border-blue-400 bg-blue-50'
//                               : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
//               >
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".csv,.txt,.tsv"
//                   className="hidden"
//                   onChange={e => handleFile(e.target.files?.[0])}
//                 />
//                 {uploadedFile ? (
//                   <>
//                     <div className="text-4xl mb-2">📄</div>
//                     <p className="text-sm font-medium text-green-700">✓ {uploadedFile.name}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Size: {(uploadedFile.size / 1024).toFixed(1)} KB · Max: 2.00 MB
//                     </p>
//                     <button
//                       onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
//                       className="mt-3 px-3 py-1 bg-red-50 text-red-600 border border-red-200
//                                  rounded text-xs hover:bg-red-100 transition-colors"
//                     >
//                       Clear File
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-4xl mb-2 opacity-40">📄</div>
//                     <p className="text-sm text-gray-600">Drag & drop a file here</p>
//                     <p className="text-xs text-gray-500">or tap to browse</p>
//                     <button className="mt-3 px-3 py-1 bg-white border border-gray-300 rounded
//                                        text-xs text-gray-700 hover:bg-gray-50 transition-colors">
//                       Browse...
//                     </button>
//                     <p className="text-xs text-gray-400 mt-2">Supported: CSV, TXT, TSV</p>
//                     <p className="text-xs text-gray-400">Max size: 2.00 MB</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={submitting || !hasAccess || (!parsedUrls.length && !uploadedFile)}
//             className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl
//                        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
//                        transition-colors text-base
//                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             {submitting ? '⏳ Submitting...' : '🚀 Submit Batch Job'}
//           </button>
//         </div>

//         {/* ── Jobs list ── */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-900">
//               Your Batch Jobs
//               {jobs.length > 0 && (
//                 <span className="text-gray-400 font-normal text-base"> ({jobs.length})</span>
//               )}
//             </h2>
//             <button
//               onClick={() => fetchJobs()}
//               disabled={loadingJobs}
//               className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg
//                          text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1.5"
//             >
//               🔄 {loadingJobs ? 'Loading...' : 'Refresh'}
//             </button>
//           </div>

//           {loadingJobs && jobs.length === 0 ? (
//             <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
//               <p className="text-gray-600">Loading your batch jobs...</p>
//             </div>
//           ) : jobs.length === 0 ? (
//             <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
//               <div className="text-5xl mb-3">📦</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-1">No batch jobs yet</h3>
//               <p className="text-gray-600 text-sm">Submit a batch job above to get started.</p>
//             </div>
//           ) : (
//             jobs.map(job => (
//               <JobCard
//                 key={job.id}
//                 job={job}
//                 token={token}
//                 onRetry={handleRetryJob}
//                 onDelete={handleDeleteJob}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // // ======= END OF BatchJobs.js ==============

