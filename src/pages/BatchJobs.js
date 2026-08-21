// frontend/src/pages/BatchJobs.js — PixelPerfect Screenshot API
// UPDATED: August 2026
//
// ✅ UI REFRESH (Aug 2026): brought in line with ScreenshotPage.js.
//   - Page background is the same slate→gray gradient
//   - Sticky translucent header
//   - Quick Presets are segmented cards with an explicit ACTIVE state.
//     Previously they were flat grey buttons that fired a toast and gave no
//     visual indication of which preset was applied — you could not tell
//     1366x768 came from "Laptop" or from typing it by hand.
//   - Cards use rounded-2xl, inputs rounded-xl, matching the capture page
//   - Format select, checkboxes and submit button restyled to match
//
// ✅ NEW (Aug 2026): scroll-to-top button, matching History.js.
//   Batch pages get long once several jobs with expanded item lists are on
//   screen, and there was no way back to the submit form except manual
//   scrolling.
//
// ✅ NEW (Aug 2026): example URL cards. The capture page offers one-click
//   example sites; batch had nothing, so a first-time user faced an empty
//   textarea with no idea what valid input looked like.
//
// Previous updates (all retained):
//   ✅ FIX (July 2026 — Delay UX parity with ScreenshotPage.js): <select>
//   ✅ Preset toast notifications
//   ✅ Live polling every 2s while processing
//   ✅ Progress bar per job
//   ✅ Per-item screenshot_url resolved to correct absolute URL
//   ✅ File upload (CSV/TXT/TSV) + textarea URL input
//   ✅ Retry failed items + delete job + cancel job
//   ✅ MOBILE FIX: resolveScreenshotUrl handles localhost URLs on LAN devices
//   ✅ MOBILE UI FIX: JobCard fully stacked layout
//   ✅ MOBILE FIX (Mar 2026): regex URL extraction for Android share-sheet lines
//   ✅ FIX (Apr 2026): Tablet preset added, 2-column grid on mobile

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

// ── ✅ Viewport presets — keyed so the active card can be highlighted ────────
const VIEWPORT_PRESETS = {
  desktop: { label: 'Desktop', sub: '1920×1080', w: 1920, h: 1080, icon: '🖥️' },
  laptop:  { label: 'Laptop',  sub: '1366×768',  w: 1366, h: 768,  icon: '💻' },
  tablet:  { label: 'Tablet',  sub: '768×1024',  w: 768,  h: 1024, icon: '📟' },
  mobile:  { label: 'Mobile',  sub: '375×667',   w: 375,  h: 667,  icon: '📱' },
};

const DELAY_OPTIONS = [
  { value: 0,  label: '0 s — Capture immediately' },
  { value: 1,  label: '1 s' },
  { value: 2,  label: '2 s — Recommended for most sites' },
  { value: 3,  label: '3 s' },
  { value: 5,  label: '5 s — Recommended for heavy pages' },
  { value: 10, label: '10 s — Maximum' },
];

// ✅ NEW (Aug 2026): example batches, mirroring the capture page's example
// cards. A first-time batch user previously faced an empty textarea.
const EXAMPLE_BATCHES = [
  {
    name: 'Two simple sites',
    desc: 'Fast, reliable — good for a first run',
    urls: 'https://example.com\nhttps://github.com',
  },
  {
    name: 'Documentation pages',
    desc: 'Typical real-world content',
    urls: 'https://docs.python.org/3/\nhttps://developer.mozilla.org/en-US/',
  },
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
  completed:  'bg-emerald-100 text-emerald-800',
  processing: 'bg-blue-100 text-blue-800 animate-pulse',
  queued:     'bg-gray-100 text-gray-600',
  failed:     'bg-red-100 text-red-800',
  partial:    'bg-amber-100 text-amber-800',
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
    <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">📸 Screenshots Progress</span>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {job.completed} / {job.total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
            job.failed > 0 && job.completed === 0
              ? 'bg-red-500'
              : job.failed > 0
              ? 'bg-gradient-to-r from-blue-500 to-amber-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          }`}
          style={{ width: `${pct}%` }}
        >
          {isActive && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="p-4 sm:p-5">

        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg
                       truncate max-w-[60%] sm:max-w-none"
            title={job.id}
          >
            {job.id}
          </span>
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-semibold
                           bg-indigo-100 text-indigo-800">
            {(job.format || 'png').toUpperCase()}
          </span>
        </div>

        <div className="mb-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg
                            text-xs font-semibold ${statusColor(job.status)}`}>
            {jobStatusLabel(job)}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Created: {new Date(job.created_at + 'Z').toLocaleString()}
          {job.completed_at && (
            <> · Finished: {new Date(job.completed_at + 'Z').toLocaleString()}</>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {isActive && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                         bg-amber-50 text-amber-700 border border-amber-200
                         hover:bg-amber-100 active:bg-amber-200
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {retrying ? '↺ Retrying...' : '↺ Retry Failed'}
            </button>
          )}

          <button
            onClick={() => setExpanded(v => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                       bg-blue-50 text-blue-700 border border-blue-200
                       hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            {expanded ? '▲ Collapse' : '▼ View Items'}
          </button>

          {!isActive && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm
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
                  item.status === 'failed'    ? 'bg-red-50'         :
                  item.status === 'completed' ? 'bg-emerald-50/40'  : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0 font-mono">
                    #{item.idx + 1}
                  </span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.status === 'completed'  ? 'bg-emerald-500' :
                    item.status === 'failed'     ? 'bg-red-500'     :
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
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${statusColor(item.status)}`}>
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
  const [activePreset,   setActivePreset]   = useState('desktop');   // ✅ NEW
  const [fullPage,       setFullPage]       = useState(false);

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

  // ✅ NEW (Aug 2026): scroll-to-top, matching History.js
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const pollRef    = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  useEffect(() => {
    mountedRef.current = true;
    // ✅ NEW: same 400px threshold History.js uses, so the button appears at
    // the same point on both pages.
    const onScroll = () => setShowScrollToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('scroll', onScroll);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const tierLower = (tier || '').toLowerCase();
  const hasAccess = tierLower !== 'free';
  const tierLimit = tierLower === 'business' ? 200 : tierLower === 'premium' ? 1000 : hasAccess ? 50 : 0;

  const parsedUrls = extractUrls(urlText);
  const urlCount   = uploadedFile ? '(from file)' : parsedUrls.length;

  // ✅ UPDATED: records the active preset so the card can highlight, and drops
  // the toast — the visual active state now communicates it without an
  // interruption on every click.
  const applyPreset = (key, preset) => {
    setWidth(preset.w);
    setHeight(preset.h);
    setActivePreset(key);
  };

  const handleWidthChange  = (v) => { setWidth(v);  setActivePreset(''); };
  const handleHeightChange = (v) => { setHeight(v); setActivePreset(''); };

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

  const handleSubmit = async () => {
    if (!hasAccess) { toast.error('Batch processing requires a Pro plan or higher'); return; }
    setSubmitting(true);
    try {
      let res;

      const parsedRemoveList = removeElements
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (uploadedFile) {
        const form = new FormData();
        form.append('file', uploadedFile);
        form.append('format', format);
        form.append('width',  String(width));
        form.append('height', String(height));
        form.append('full_page', String(fullPage));
        form.append('dark_mode', String(darkMode));
        form.append('delay',     String(delay || 0));
        if (removeElements.trim()) {
          form.append('remove_elements', removeElements.trim());
        }

        res = await fetch(`${API_BASE_URL}/api/v1/batch/submit_file`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      } else {
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

  const submitDisabled = submitting || !hasAccess || (!parsedUrls.length && !uploadedFile);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl
                           hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                Manage Plan
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Batch Screenshot Jobs</h1>
          <p className="text-gray-600">
            Capture screenshots of multiple websites at once.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {hasAccess
              ? `${tier?.charAt(0).toUpperCase() + tier?.slice(1)} plan · up to ${tierLimit} URLs per batch`
              : 'Free plan · Batch not available'}
          </p>
        </div>

        {!hasAccess && (
          <div className="mb-6 bg-white border border-amber-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-bold text-amber-800 mb-1">Pro Plan Required</h3>
            <p className="text-sm text-amber-700 mb-4">
              Batch processing is available on Pro, Business and Premium plans.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-5 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 text-sm font-semibold transition-colors"
            >
              See plans →
            </button>
          </div>
        )}

        {/* ✅ NEW (Aug 2026): example batches — parity with the capture page.
            Each card is a single block with the title and description on
            separate lines, so they never run together. */}
        {hasAccess && (
          <div className="bg-white border border-emerald-200 rounded-2xl p-4 mb-6 shadow-sm">
            <h3 className="text-emerald-800 font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
              Try an example batch
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXAMPLE_BATCHES.map(ex => (
                <button
                  key={ex.name}
                  onClick={() => { setUrlText(ex.urls); setUploadedFile(null); }}
                  className="text-left p-3 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                >
                  <div className="block font-medium text-gray-800 text-sm group-hover:text-emerald-800">
                    {ex.name}
                  </div>
                  <div className="block text-xs text-gray-500 mt-0.5">{ex.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-8 ${!hasAccess ? 'opacity-60 pointer-events-none' : ''}`}>
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base">📐</span>
            Screenshot Configuration
          </h2>

          {/* Quick Presets — segmented cards with an active state */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">Quick Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(VIEWPORT_PRESETS).map(([key, p]) => {
                const isActive = activePreset === key;
                return (
                  <button
                    key={key}
                    onClick={() => applyPreset(key, p)}
                    className={`px-3 py-2.5 rounded-xl text-left transition-all border-2 ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{p.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                        {p.label}
                      </span>
                    </div>
                    <div className={`text-xs mt-0.5 font-mono ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                      {p.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Width (px)</label>
              <input
                type="number" value={width} min={320} max={3840}
                onChange={e => handleWidthChange(parseInt(e.target.value) || 1920)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Height (px)</label>
              <input
                type="number" value={height} min={240} max={2160}
                onChange={e => handleHeightChange(parseInt(e.target.value) || 1080)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="png">PNG — lossless, larger file</option>
              <option value="jpeg">JPEG — lossy, smaller file</option>
              <option value="webp">WebP — best compression</option>
              <option value="pdf">PDF — document format</option>
            </select>
          </div>

          <div className="space-y-2 mb-5">
            {[
              { checked: fullPage, set: setFullPage, label: 'Capture full page (scroll entire page)' },
              { checked: darkMode, set: setDarkMode, label: 'Use dark mode' },
            ].map(o => (
              <label key={o.label} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={o.checked} onChange={e => o.set(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">{o.label}</span>
              </label>
            ))}
          </div>

          {/* Advanced Options */}
          <div className="border-t border-gray-200 pt-5 mb-5">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Advanced Options</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Delay before capture (seconds)</label>
                <select
                  value={delay}
                  onChange={e => setDelay(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {DELAY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1.5">
                  Applied to every URL in the batch
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Remove elements (CSS selectors)</label>
                <input
                  type="text"
                  value={removeElements}
                  onChange={e => setRemoveElements(e.target.value)}
                  placeholder=".cookie-banner, #popup, .ads"
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Applied to every URL. Comma-separated.
                </p>
              </div>
            </div>
          </div>

          {/* URL count pill */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 mb-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">URLs detected</span>
              <span className={`font-bold ${
                typeof urlCount === 'number' && urlCount > tierLimit
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }`}>
                {typeof urlCount === 'number' ? `${urlCount} / ${tierLimit}` : urlCount}
              </span>
            </div>
            {parsedUrls[0] && !uploadedFile && (
              <p className="text-xs text-gray-400 mt-1 truncate font-mono">
                First: {parsedUrls[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website URLs (one per line)
              </label>
              <textarea
                value={urlText}
                onChange={e => setUrlText(e.target.value)}
                placeholder={'https://example.com\nhttps://another-site.com'}
                rows={8}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Up to {tierLimit} URLs per batch
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File (CSV/TXT/TSV)
              </label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                            transition-all flex flex-col items-center justify-center min-h-[210px]
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
                    <p className="text-sm font-medium text-emerald-700">✓ {uploadedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(uploadedFile.size / 1024).toFixed(1)} KB · Max 2.00 MB
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
                      className="mt-3 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200
                                 rounded-lg text-xs hover:bg-red-100 transition-colors"
                    >
                      Clear File
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2 opacity-40">📄</div>
                    <p className="text-sm text-gray-600">Drag &amp; drop a file here</p>
                    <p className="text-xs text-gray-500">or tap to browse</p>
                    <span className="mt-3 px-3 py-1.5 bg-white border border-gray-300 rounded-lg
                                     text-xs text-gray-700">
                      Browse…
                    </span>
                    <p className="text-xs text-gray-400 mt-2">CSV, TXT, TSV · max 2.00 MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitDisabled}
            className={`w-full py-4 font-semibold rounded-xl text-base transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              submitDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-blue-500'
            }`}
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
              className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl
                         text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              🔄 {loadingJobs ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loadingJobs && jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading your batch jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
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

        {/* ✅ NEW (Aug 2026): scroll-to-top — identical to History.js.
            Batch pages get long once several jobs with expanded item lists
            are open; there was previously no way back to the submit form. */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3
                       rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ======= END OF BatchJobs.js ======

// // frontend/src/pages/BatchJobs.js — PixelPerfect Screenshot API
// // UPDATED: July 2026
// //
// // ✅ FIX (July 2026 — Delay UX parity with ScreenshotPage.js):
// //   "Delay before capture" changed from <input type="number"> to <select>
// //   with labelled options (0 s — Capture immediately … 10 s — Maximum).
// //   Same rationale as the ScreenshotPage fix: a number input triggers the
// //   mobile numeric keyboard (tap, type, dismiss — poor touch UX), while a
// //   select gives a native bottom-sheet picker on mobile and a clean
// //   dropdown on desktop. Values 0–10 cover 100% of real use cases.
// //   Both pages now share the identical delay control.
// //
// // Previous updates (all retained):
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
// //   ✅ (Apr 2026): UI parity with ScreenshotPage.js — batch users can now
// //      set dark_mode, delay, and remove_elements from the dashboard.

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
// const VIEWPORT_PRESETS = [
//   { label: 'Desktop',  sub: '1920×1080', w: 1920, h: 1080 },
//   { label: 'Laptop',   sub: '1366×768',  w: 1366, h: 768  },
//   { label: 'Tablet',   sub: '768×1024',  w: 768,  h: 1024 },
//   { label: 'Mobile',   sub: '375×667',   w: 375,  h: 667  },
// ];

// // ── ✅ NEW (July 2026): delay options — identical to ScreenshotPage.js ───────
// const DELAY_OPTIONS = [
//   { value: 0,  label: '0 s — Capture immediately' },
//   { value: 1,  label: '1 s' },
//   { value: 2,  label: '2 s — Recommended for most sites' },
//   { value: 3,  label: '3 s' },
//   { value: 5,  label: '5 s — Recommended for heavy pages' },
//   { value: 10, label: '10 s — Maximum' },
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

//   // Advanced Options — parity with ScreenshotPage.js
//   const [darkMode,       setDarkMode]       = useState(false);
//   const [delay,          setDelay]          = useState(0);
//   const [removeElements, setRemoveElements] = useState('');

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

//       // Parse remove_elements textbox → array (for JSON path)
//       // Same parsing convention as ScreenshotPage.js: split on commas,
//       // strip whitespace, drop empties.
//       const parsedRemoveList = removeElements
//         .split(',')
//         .map(s => s.trim())
//         .filter(Boolean);

//       if (uploadedFile) {
//         // ── File upload path (multipart form) ────────────────────────────────
//         // Backend (batch.py) _parse_remove_elements_form accepts a
//         // comma-separated string OR a JSON array. We send comma-separated
//         // because it matches what the textbox already contains.
//         const form = new FormData();
//         form.append('file', uploadedFile);
//         form.append('format', format);
//         form.append('width',  String(width));
//         form.append('height', String(height));
//         form.append('full_page', String(fullPage));
//         form.append('dark_mode', String(darkMode));
//         form.append('delay',     String(delay || 0));
//         if (removeElements.trim()) {
//           // Send the raw textbox value — backend parses comma-separated
//           form.append('remove_elements', removeElements.trim());
//         }

//         res = await fetch(`${API_BASE_URL}/api/v1/batch/submit_file`, {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${token}` },
//           body: form,
//         });
//       } else {
//         // ── JSON path ────────────────────────────────────────────────────────
//         if (!parsedUrls.length) {
//           toast.error('Please enter at least one valid URL (starting with http:// or https://)');
//           setSubmitting(false);
//           return;
//         }

//         const payload = {
//           urls:      parsedUrls,
//           format,
//           width,
//           height,
//           full_page: fullPage,
//           dark_mode: darkMode,
//           delay:     delay || 0,
//         };
//         // Only include remove_elements when user actually entered something
//         if (parsedRemoveList.length > 0) {
//           payload.remove_elements = parsedRemoveList;
//         }

//         res = await fetch(`${API_BASE_URL}/api/v1/batch/submit`, {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
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
//       // Note: we deliberately keep darkMode/delay/removeElements as-is so that
//       // users submitting multiple batches don't have to re-check their
//       // preferred settings every time. Same UX choice ScreenshotPage makes.
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

//                 <label className="flex items-center gap-2 cursor-pointer mb-2">
//                   <input
//                     type="checkbox" checked={fullPage}
//                     onChange={e => setFullPage(e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300 text-blue-600"
//                   />
//                   <span className="text-sm text-gray-700">Capture full page (scrolling)</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer mb-4">
//                   <input
//                     type="checkbox" checked={darkMode}
//                     onChange={e => setDarkMode(e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300 text-blue-600"
//                   />
//                   <span className="text-sm text-gray-700">Use dark mode</span>
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

//           {/* ── Advanced Options section — parity with ScreenshotPage ── */}
//           <div className="border-t border-gray-200 pt-4 mb-6">
//             <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Options</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Delay before capture (seconds)</label>
//                 {/*
//                   ✅ FIX (July 2026 — Delay UX parity with ScreenshotPage.js):
//                   Changed from <input type="number"> to <select> with the
//                   identical labelled options used on the single screenshot
//                   page. A number input triggers the mobile numeric keyboard
//                   (tap, type, dismiss — poor touch UX); a select gives a
//                   native bottom-sheet picker on mobile and a clean dropdown
//                   on desktop. Values 0–10 cover all real use cases.
//                 */}
//                 <select
//                   value={delay}
//                   onChange={e => setDelay(parseInt(e.target.value) || 0)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white
//                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   {DELAY_OPTIONS.map(opt => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </select>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Wait time per URL to allow page to fully load (0–10s)
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Remove elements (CSS selectors)</label>
//                 <input
//                   type="text"
//                   value={removeElements}
//                   onChange={e => setRemoveElements(e.target.value)}
//                   placeholder=".cookie-banner, #popup, .ads"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
//                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Applied to every URL in the batch. Comma-separated.
//                 </p>
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

// // // ======= END OF BatchJobs.js ======

