// frontend/src/pages/BatchJobs.js — PixelPerfect Screenshot API
// UPDATED: March 2026
//   ✅ Preset toast notifications (Desktop/Laptop/Mobile) — matches ScreenshotPage.js
//   ✅ Live polling every 2s while processing
//   ✅ Progress bar per job
//   ✅ Per-item screenshot_url resolved to correct absolute URL
//   ✅ File upload (CSV/TXT/TSV) + textarea URL input
//   ✅ Retry failed items + delete job

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
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  return `${API_BASE_URL}${t.startsWith('/') ? '' : '/'}${t}`;
}

// ✅ Viewport presets — same set as ScreenshotPage.js
const VIEWPORT_PRESETS = [
  { label: 'Desktop (1920x1080)', w: 1920, h: 1080 },
  { label: 'Laptop (1366x768)',   w: 1366, h: 768  },
  { label: 'Mobile (375x667)',    w: 375,  h: 667  },
];

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
}[s] || 'bg-gray-100 text-gray-600');

const jobStatusLabel = (j) => ({
  completed:  '✅ Completed',
  partial:    '⚠️ Partial',
  failed:     '❌ Failed',
  processing: '⏳ Processing...',
}[j.status] || '🕐 Queued');

// ── Progress Bar ──────────────────────────────────────────────────────────────
function JobProgressBar({ job }) {
  const total   = job.total || 1;
  const done    = (job.completed || 0) + (job.failed || 0);
  const pct     = Math.round((done / total) * 100);
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
          {job.queued > 0    && `${job.queued} queued`}
          {job.processing > 0 && ` · ${job.processing} processing`}
          {job.failed > 0    && ` · ${job.failed} failed`}
        </span>
        <span className="font-medium text-gray-600">{pct}% done</span>
      </div>
    </div>
  );
}

// ── Single Job Card ───────────────────────────────────────────────────────────
function JobCard({ job, token, onRetry, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {job.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(job.status)}`}>
                {jobStatusLabel(job)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {(job.format || 'png').toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Created: {new Date(job.created_at + 'Z').toLocaleString()}
              {job.completed_at && ` · Finished: ${new Date(job.completed_at + 'Z').toLocaleString()}`}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {hasFailed && !isActive && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg
                           hover:bg-yellow-100 text-xs font-medium transition-colors disabled:opacity-50"
              >
                {retrying ? '↺ Retrying...' : '↺ Retry Failed'}
              </button>
            )}
            <button
              onClick={() => setExpanded(v => !v)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg
                         hover:bg-blue-100 text-xs font-medium transition-colors"
            >
              {expanded ? '▲ Collapse' : '▼ View Items'}
            </button>
            {!isActive && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg
                           hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? '...' : '🗑'}
              </button>
            )}
          </div>
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
                className={`px-5 py-3 flex flex-wrap items-center gap-3 ${
                  item.status === 'failed'    ? 'bg-red-50'      :
                  item.status === 'completed' ? 'bg-green-50/40' : ''
                }`}
              >
                <span className="text-xs text-gray-400 w-6 flex-shrink-0">#{item.idx + 1}</span>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  item.status === 'completed'  ? 'bg-green-500' :
                  item.status === 'failed'     ? 'bg-red-500'   :
                  item.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                  'bg-gray-300'
                }`} />
                <span className="text-sm text-gray-700 flex-1 min-w-0 truncate" title={item.url}>
                  {item.url}
                </span>
                <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-500">
                  {item.file_size       && <span>📏 {formatSize(item.file_size)}</span>}
                  {item.processing_time && <span>⏱ {item.processing_time}s</span>}
                  <span className={`px-2 py-0.5 rounded-full font-medium ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                {viewUrl ? (
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50
                               text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100
                               text-xs font-medium transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View
                  </a>
                ) : item.status === 'failed' ? (
                  <span className="flex-shrink-0 text-xs text-red-500 max-w-xs truncate" title={item.message}>
                    ⚠ {item.message || 'Failed'}
                  </span>
                ) : null}
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

  const [urlText,       setUrlText]       = useState('');
  const [format,        setFormat]        = useState('png');
  const [width,         setWidth]         = useState(1920);
  const [height,        setHeight]        = useState(1080);
  const [fullPage,      setFullPage]      = useState(false);
  const [uploadedFile,  setUploadedFile]  = useState(null);
  const [dragOver,      setDragOver]      = useState(false);
  const fileInputRef = useRef(null);

  const [jobs,          setJobs]          = useState([]);
  const [submitting,    setSubmitting]    = useState(false);
  const [submittedJobId,setSubmittedJobId]= useState(null);
  const [loadingJobs,   setLoadingJobs]   = useState(false);

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

  const parsedUrls = urlText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('http://') || l.startsWith('https://'));

  const urlCount = uploadedFile ? '(from file)' : parsedUrls.length;

  // ✅ Apply viewport preset with toast — identical to ScreenshotPage.js behaviour
  const applyPreset = (preset) => {
    setWidth(preset.w);
    setHeight(preset.h);
    toast.success(`Applied ${preset.label} preset`);
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
      if (uploadedFile) {
        const form = new FormData();
        form.append('file', uploadedFile);
        form.append('format', format);
        form.append('width',  String(width));
        form.append('height', String(height));
        form.append('full_page', String(fullPage));
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
        res = await fetch(`${API_BASE_URL}/api/v1/batch/submit`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: parsedUrls, format, width, height, full_page: fullPage }),
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

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><PixelPerfectLogo size={64} showText={false} /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Screenshot Jobs</h1>
          <p className="text-gray-600">Capture screenshots of multiple websites at once. Process up to {tierLimit} URLs per batch.</p>
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
            <p className="text-sm text-amber-700 mb-3">Batch processing is available on Pro and Business plans.</p>
            <button onClick={() => navigate('/subscription')}
              className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium">
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
                    <input type="number" value={width} min={320} max={7680}
                      onChange={e => setWidth(parseInt(e.target.value) || 1920)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
                    <input type="number" value={height} min={240} max={4320}
                      onChange={e => setHeight(parseInt(e.target.value) || 1080)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  {/* ✅ Preset buttons — each fires toast matching ScreenshotPage.js */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {VIEWPORT_PRESETS.map(p => (
                      <button key={p.label} onClick={() => applyPreset(p)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors">
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Format</h3>
                <select value={format} onChange={e => setFormat(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="png">PNG (lossless)</option>
                  <option value="jpeg">JPEG (compressed)</option>
                  <option value="webp">WebP (best ratio)</option>
                  <option value="pdf">PDF (document)</option>
                </select>

                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input type="checkbox" checked={fullPage} onChange={e => setFullPage(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  <span className="text-sm text-gray-700">Capture full page (scrolling)</span>
                </label>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">URL Preview</span>
                    <span className={`font-semibold ${typeof urlCount === 'number' && urlCount > tierLimit ? 'text-red-600' : 'text-green-600'}`}>
                      {typeof urlCount === 'number' ? `${urlCount}/${tierLimit}` : urlCount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadedFile ? 'Previewing URLs from uploaded file.' : 'Previewing URLs from textarea.'}
                  </p>
                  {parsedUrls[0] && !uploadedFile && (
                    <p className="text-xs text-gray-400 mt-1 truncate">Example: {parsedUrls[0]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URLs (one per line)</label>
              <textarea value={urlText} onChange={e => setUrlText(e.target.value)}
                placeholder={'https://example.com\nhttps://another-site.com'}
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" />
              <p className="text-xs text-gray-500 mt-1">Enter up to {tierLimit} URLs, one per line</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File (CSV/TXT/TSV)</label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                            transition-colors flex flex-col items-center justify-center min-h-[200px]
                            ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
              >
                <input ref={fileInputRef} type="file" accept=".csv,.txt,.tsv" className="hidden"
                  onChange={e => handleFile(e.target.files?.[0])} />
                {uploadedFile ? (
                  <>
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-sm font-medium text-green-700">✓ {uploadedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Size: {(uploadedFile.size / 1024).toFixed(1)} KB · Max: 2.00 MB</p>
                    <button onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
                      className="mt-3 px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs hover:bg-red-100 transition-colors">
                      Clear File
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2 opacity-40">📄</div>
                    <p className="text-sm text-gray-600">Drag & drop a file here</p>
                    <p className="text-xs text-gray-500">or tap to browse</p>
                    <button className="mt-3 px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors">Browse...</button>
                    <p className="text-xs text-gray-400 mt-2">Supported: CSV, TXT, TSV</p>
                    <p className="text-xs text-gray-400">Max size: 2.00 MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button onClick={handleSubmit}
            disabled={submitting || !hasAccess || (!parsedUrls.length && !uploadedFile)}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {submitting ? '⏳ Submitting...' : '🚀 Submit Batch Job'}
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Your Batch Jobs{jobs.length > 0 && <span className="text-gray-400 font-normal text-base"> ({jobs.length})</span>}
            </h2>
            <button onClick={() => fetchJobs()} disabled={loadingJobs}
              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1.5">
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
              <JobCard key={job.id} job={job} token={token} onRetry={handleRetryJob} onDelete={handleDeleteJob} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}


///////////////////////////////////////////////////////////////////////////////////

// // frontend/src/pages/BatchJobs.js — PixelPerfect Screenshot API
// // PURPOSE: Batch screenshot submission + live job progress tracking
// // UPDATED: March 2026
// //   ✅ Live polling: job status updates every 2s while processing
// //   ✅ Progress bar per job (matches ScreenshotPage UI style)
// //   ✅ Per-item screenshot_url resolution (works on mobile + production)
// //   ✅ File upload (CSV/TXT/TSV) + textarea URL input
// //   ✅ Retry failed items

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import { useSubscription } from '../contexts/SubscriptionContext';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// // ── API base resolution (mirrors AuthContext + lib/api.js) ──────────────────
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
//     if (host === 'localhost' || host === '127.0.0.1')
//       return 'http://localhost:8000';
//     if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host))
//       return `http://${host}:8000`;
//     return `${window.location.protocol}//${host}:8000`;
//   }
//   return 'http://localhost:8000';
// }

// const API_BASE_URL = resolveApiBase();
// const POLL_INTERVAL_MS = 2000; // 2 second live updates while processing

// // ── URL resolution for screenshot images (relative → absolute) ──────────────
// function resolveScreenshotUrl(rawUrl) {
//   if (!rawUrl || typeof rawUrl !== 'string') return null;
//   const trimmed = rawUrl.trim();
//   if (!trimmed) return null;
//   if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
//   return `${API_BASE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
// }

// // ── Helpers ──────────────────────────────────────────────────────────────────
// const formatSize = (bytes) => {
//   if (!bytes) return '—';
//   const units = ['B', 'KB', 'MB', 'GB'];
//   let i = 0, n = Number(bytes);
//   while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
//   return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
// };

// const statusColor = (status) => {
//   switch (status) {
//     case 'completed': return 'bg-green-100 text-green-800';
//     case 'processing': return 'bg-blue-100 text-blue-800 animate-pulse';
//     case 'queued':    return 'bg-gray-100 text-gray-600';
//     case 'failed':    return 'bg-red-100 text-red-800';
//     case 'partial':   return 'bg-yellow-100 text-yellow-800';
//     default:          return 'bg-gray-100 text-gray-600';
//   }
// };

// const jobStatusLabel = (job) => {
//   if (job.status === 'completed') return '✅ Completed';
//   if (job.status === 'partial')   return '⚠️ Partial';
//   if (job.status === 'failed')    return '❌ Failed';
//   if (job.status === 'processing') return '⏳ Processing...';
//   return '🕐 Queued';
// };

// // ── Progress Bar ─────────────────────────────────────────────────────────────
// function JobProgressBar({ job }) {
//   const total = job.total || 1;
//   const done  = (job.completed || 0) + (job.failed || 0);
//   const pct   = Math.round((done / total) * 100);
//   const isActive = job.status === 'processing' || job.status === 'queued';

//   return (
//     <div className="mt-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//       {/* Header row */}
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-sm font-semibold text-gray-700">
//           📸 Screenshots Progress
//         </span>
//         <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//           {job.completed} / {job.total}
//         </span>
//       </div>

//       {/* Bar */}
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

//       {/* Footer */}
//       <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
//         <span>
//           {job.queued > 0 && `${job.queued} queued`}
//           {job.processing > 0 && ` · ${job.processing} processing`}
//           {job.failed > 0 && ` · ${job.failed} failed`}
//         </span>
//         <span className="font-medium text-gray-600">{pct}% done</span>
//       </div>
//     </div>
//   );
// }

// // ── Single Job Card ───────────────────────────────────────────────────────────
// function JobCard({ job, token, onRetry, onDelete }) {
//   const [expanded, setExpanded] = useState(false);
//   const [retrying, setRetrying] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const isActive = job.status === 'processing' || job.status === 'queued';
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

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
//       {/* Job header */}
//       <div className="p-5">
//         <div className="flex flex-wrap items-start justify-between gap-3">
//           <div className="flex-1 min-w-0">
//             <div className="flex flex-wrap items-center gap-2 mb-1">
//               <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
//                 {job.id}
//               </span>
//               <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(job.status)}`}>
//                 {jobStatusLabel(job)}
//               </span>
//               <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                 {(job.format || 'png').toUpperCase()}
//               </span>
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               Created: {new Date(job.created_at + 'Z').toLocaleString()}
//               {job.completed_at && ` · Finished: ${new Date(job.completed_at + 'Z').toLocaleString()}`}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-2 flex-shrink-0">
//             {hasFailed && !isActive && (
//               <button
//                 onClick={handleRetry}
//                 disabled={retrying}
//                 className="px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg
//                            hover:bg-yellow-100 text-xs font-medium transition-colors disabled:opacity-50"
//               >
//                 {retrying ? '↺ Retrying...' : '↺ Retry Failed'}
//               </button>
//             )}
//             <button
//               onClick={() => setExpanded(v => !v)}
//               className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg
//                          hover:bg-blue-100 text-xs font-medium transition-colors"
//             >
//               {expanded ? '▲ Collapse' : '▼ View Items'}
//             </button>
//             {!isActive && (
//               <button
//                 onClick={handleDelete}
//                 disabled={deleting}
//                 className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg
//                            hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
//               >
//                 {deleting ? '...' : '🗑'}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Progress bar — always visible */}
//         <JobProgressBar job={job} />
//       </div>

//       {/* Per-item list */}
//       {expanded && (
//         <div className="border-t border-gray-100 divide-y divide-gray-50">
//           {(job.items || []).map((item) => {
//             const viewUrl = resolveScreenshotUrl(item.screenshot_url);
//             return (
//               <div
//                 key={item.idx}
//                 className={`px-5 py-3 flex flex-wrap items-center gap-3 ${
//                   item.status === 'failed' ? 'bg-red-50' :
//                   item.status === 'completed' ? 'bg-green-50/40' : ''
//                 }`}
//               >
//                 {/* Index */}
//                 <span className="text-xs text-gray-400 w-6 flex-shrink-0">#{item.idx + 1}</span>

//                 {/* Status dot */}
//                 <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
//                   item.status === 'completed' ? 'bg-green-500' :
//                   item.status === 'failed'    ? 'bg-red-500' :
//                   item.status === 'processing'? 'bg-blue-500 animate-pulse' :
//                   'bg-gray-300'
//                 }`} />

//                 {/* URL */}
//                 <span className="text-sm text-gray-700 flex-1 min-w-0 truncate" title={item.url}>
//                   {item.url}
//                 </span>

//                 {/* Meta */}
//                 <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-500">
//                   {item.file_size && <span>📏 {formatSize(item.file_size)}</span>}
//                   {item.processing_time && <span>⏱ {item.processing_time}s</span>}
//                   <span className={`px-2 py-0.5 rounded-full font-medium ${statusColor(item.status)}`}>
//                     {item.status}
//                   </span>
//                 </div>

//                 {/* View link — ✅ resolves to correct absolute URL */}
//                 {viewUrl ? (
//                   <a
//                     href={viewUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50
//                                text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100
//                                text-xs font-medium transition-colors"
//                   >
//                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                         d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                     </svg>
//                     View
//                   </a>
//                 ) : item.status === 'failed' ? (
//                   <span className="flex-shrink-0 text-xs text-red-500 max-w-xs truncate" title={item.message}>
//                     ⚠ {item.message || 'Failed'}
//                   </span>
//                 ) : null}
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
//   const navigate = useNavigate();
//   const { token, user, isAuthenticated, logout } = useAuth();
//   const { tier } = useSubscription();

//   // Form state
//   const [urlText, setUrlText]       = useState('');
//   const [format, setFormat]         = useState('png');
//   const [width, setWidth]           = useState(1920);
//   const [height, setHeight]         = useState(1080);
//   const [fullPage, setFullPage]     = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [dragOver, setDragOver]     = useState(false);
//   const fileInputRef = useRef(null);

//   // Jobs state
//   const [jobs, setJobs]             = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [submittedJobId, setSubmittedJobId] = useState(null);
//   const [loadingJobs, setLoadingJobs] = useState(false);

//   // Polling
//   const pollRef = useRef(null);
//   const mountedRef = useRef(true);

//   useEffect(() => {
//     if (!isAuthenticated) navigate('/login');
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     mountedRef.current = true;
//     return () => {
//       mountedRef.current = false;
//       if (pollRef.current) clearInterval(pollRef.current);
//     };
//   }, []);

//   // Check tier access
//   const tierLower = (tier || '').toLowerCase();
//   const hasAccess = tierLower !== 'free';
//   const tierLimit = tierLower === 'business' ? 200 : tierLower === 'premium' ? 1000 : hasAccess ? 50 : 0;

//   // Count valid URLs in textarea
//   const parsedUrls = urlText
//     .split('\n')
//     .map(l => l.trim())
//     .filter(l => l.startsWith('http://') || l.startsWith('https://'));

//   const urlCount = uploadedFile ? '(from file)' : parsedUrls.length;

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

//   // ── Poll a specific job while it's active ───────────────────────────────────
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

//       // Stop polling when done
//       if (!['queued', 'processing'].includes(updated.status)) {
//         if (pollRef.current) clearInterval(pollRef.current);
//         pollRef.current = null;
//         toast.success(
//           updated.status === 'completed'
//             ? `✅ Batch complete: ${updated.completed}/${updated.total} screenshots captured`
//             : updated.status === 'partial'
//             ? `⚠️ Batch partial: ${updated.completed} succeeded, ${updated.failed} failed`
//             : `❌ Batch failed`,
//           { duration: 5000 }
//         );
//       }
//     } catch { /* silent */ }
//   }, [token]);

//   // Start polling when a job is submitted
//   useEffect(() => {
//     if (!submittedJobId) return;
//     if (pollRef.current) clearInterval(pollRef.current);
//     pollRef.current = setInterval(() => pollJob(submittedJobId), POLL_INTERVAL_MS);
//     return () => { if (pollRef.current) clearInterval(pollRef.current); };
//   }, [submittedJobId, pollJob]);

//   // Initial load
//   useEffect(() => {
//     if (isAuthenticated) fetchJobs();
//   }, [isAuthenticated, fetchJobs]);

//   // ── File handling ───────────────────────────────────────────────────────────
//   const handleFile = (file) => {
//     if (!file) return;
//     const name = (file.name || '').toLowerCase();
//     if (!name.endsWith('.csv') && !name.endsWith('.txt') && !name.endsWith('.tsv')) {
//       toast.error('Please upload a .csv, .txt, or .tsv file');
//       return;
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       toast.error('File too large (max 2 MB)');
//       return;
//     }
//     setUploadedFile(file);
//     toast.success(`File loaded: ${file.name}`);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) handleFile(file);
//   };

//   // ── Submit batch ────────────────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (!hasAccess) {
//       toast.error('Batch processing requires a Pro plan or higher');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       let res;

//       if (uploadedFile) {
//         // File upload endpoint
//         const form = new FormData();
//         form.append('file', uploadedFile);
//         form.append('format', format);
//         form.append('width', String(width));
//         form.append('height', String(height));
//         form.append('full_page', String(fullPage));

//         res = await fetch(`${API_BASE_URL}/api/v1/batch/submit_file`, {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${token}` },
//           body: form,
//         });
//       } else {
//         // JSON endpoint
//         if (parsedUrls.length === 0) {
//           toast.error('Please enter at least one valid URL (starting with http:// or https://)');
//           setSubmitting(false);
//           return;
//         }

//         res = await fetch(`${API_BASE_URL}/api/v1/batch/submit`, {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             urls: parsedUrls,
//             format,
//             width,
//             height,
//             full_page: fullPage,
//           }),
//         });
//       }

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.detail || `HTTP ${res.status}`);
//       }

//       const job = await res.json();

//       // Add to jobs list and start polling
//       setJobs(prev => [job, ...prev]);
//       setSubmittedJobId(job.id);

//       // Reset form
//       setUrlText('');
//       setUploadedFile(null);

//       toast.success(`🚀 Batch job submitted! Job ID: ${job.id}`, { duration: 5000 });
//     } catch (err) {
//       toast.error(`Submission failed: ${err.message}`, { duration: 6000 });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRetryJob = (jobId) => {
//     setSubmittedJobId(jobId); // re-enable polling for this job
//   };

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
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
//               >
//                 ← Back to Dashboard
//               </button>
//               <button
//                 onClick={() => navigate('/subscription')}
//                 className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 Manage Subscription
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Page header */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Screenshot Jobs</h1>
//           <p className="text-gray-600">Capture screenshots of multiple websites at once. Process up to {tierLimit} URLs per batch.</p>
//           <p className="text-sm text-gray-500 mt-1">
//             {hasAccess
//               ? `${tier?.charAt(0).toUpperCase() + tier?.slice(1)} · up to ${tierLimit} URLs per batch`
//               : 'Free plan · Batch not available'}
//           </p>
//         </div>

//         {/* Tier gate */}
//         {!hasAccess && (
//           <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
//             <div className="text-3xl mb-2">🔒</div>
//             <h3 className="font-semibold text-amber-800 mb-1">Pro Plan Required</h3>
//             <p className="text-sm text-amber-700 mb-3">Batch processing is available on Pro and Business plans.</p>
//             <button
//               onClick={() => navigate('/subscription')}
//               className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium transition-colors"
//             >
//               Upgrade Now
//             </button>
//           </div>
//         )}

//         {/* Submit form */}
//         <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 ${!hasAccess ? 'opacity-60 pointer-events-none' : ''}`}>
//           {/* Config */}
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <span className="text-gray-400">📐</span> Screenshot Configuration
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Dimensions */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">Dimensions</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">Width (px)</label>
//                     <input
//                       type="number" value={width} min={320} max={7680}
//                       onChange={e => setWidth(parseInt(e.target.value) || 1920)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
//                     <input
//                       type="number" value={height} min={240} max={4320}
//                       onChange={e => setHeight(parseInt(e.target.value) || 1080)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* Presets */}
//                   <div className="flex flex-wrap gap-2 pt-1">
//                     {[
//                       { label: 'Desktop (1920x1080)', w: 1920, h: 1080 },
//                       { label: 'Laptop (1366x768)',   w: 1366, h: 768  },
//                       { label: 'Mobile (375x667)',    w: 375,  h: 667  },
//                     ].map(p => (
//                       <button
//                         key={p.label}
//                         onClick={() => { setWidth(p.w); setHeight(p.h); }}
//                         className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors"
//                       >
//                         {p.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Format + options */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">Format</h3>
//                 <select
//                   value={format}
//                   onChange={e => setFormat(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="png">PNG (lossless)</option>
//                   <option value="jpeg">JPEG (compressed)</option>
//                   <option value="webp">WebP (best ratio)</option>
//                   <option value="pdf">PDF (document)</option>
//                 </select>

//                 <label className="flex items-center gap-2 cursor-pointer mb-4">
//                   <input
//                     type="checkbox" checked={fullPage} onChange={e => setFullPage(e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300 text-blue-600"
//                   />
//                   <span className="text-sm text-gray-700">Capture full page (scrolling)</span>
//                 </label>

//                 {/* URL preview count */}
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

//           {/* URL inputs */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             {/* Textarea */}
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
//               <p className="text-xs text-gray-500 mt-1">Enter up to {tierLimit} URLs, one per line</p>
//             </div>

//             {/* File upload */}
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
//                             transition-colors h-[calc(100%-2rem)] flex flex-col items-center justify-center
//                             ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
//               >
//                 <input
//                   ref={fileInputRef} type="file" accept=".csv,.txt,.tsv" className="hidden"
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
//                       className="mt-3 px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs hover:bg-red-100 transition-colors"
//                     >
//                       Clear File
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-4xl mb-2 opacity-40">📄</div>
//                     <p className="text-sm text-gray-600">Drag & drop a file here</p>
//                     <p className="text-xs text-gray-500">or tap to browse</p>
//                     <button className="mt-3 px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors">
//                       Browse...
//                     </button>
//                     <p className="text-xs text-gray-400 mt-2">Supported: CSV, TXT, TSV</p>
//                     <p className="text-xs text-gray-400">Max size: 2.00 MB</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             onClick={handleSubmit}
//             disabled={submitting || !hasAccess || (!parsedUrls.length && !uploadedFile)}
//             className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700
//                        disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base
//                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             {submitting ? '⏳ Submitting...' : '🚀 Submit Batch Job'}
//           </button>
//         </div>

//         {/* Jobs list */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-900">
//               Your Batch Jobs {jobs.length > 0 && <span className="text-gray-400 font-normal text-base">({jobs.length})</span>}
//             </h2>
//             <button
//               onClick={() => fetchJobs()}
//               disabled={loadingJobs}
//               className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm
//                          hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               {loadingJobs ? '🔄 Loading...' : '🔄 Refresh'}
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

