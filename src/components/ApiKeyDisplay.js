// ============================================================================
// API KEY DISPLAY COMPONENT - PRODUCTION READY
// ============================================================================
// File: frontend/src/components/ApiKeyDisplay.js
// Author: OneTechly
// Updated: July 2026
//
// ✅ FIX (July 2026 — "You don't have an API key yet" shown to users WITH keys):
//   Root cause: the component gated its display branches on
//   keyInfo.has_api_key — a field the backend NEVER returns.
//   GET /api/keys/current responds with {key_prefix, created_at, ...},
//   so has_api_key was always undefined → both "show key" branches were
//   skipped → every user saw the no-key fallback, even Pro users with
//   active keys. Fix: key existence is now derived from the field the
//   backend actually sends: hasKey = Boolean(keyInfo?.key_prefix).
//
// ✅ FIX (July 2026 — Auto-created full key was silently discarded):
//   When no key exists, the backend AUTO-CREATES one on GET
//   /api/keys/current and returns the full api_key — shown once, never
//   recoverable. The old component ignored that field entirely, losing
//   the key forever. Now: if the fetch response contains api_key, it is
//   displayed in the one-time "Save this key now" panel immediately.
//
// ✅ UX (July 2026 — Three honest states):
//   1. Key exists (normal)   → "Your API key is active" + prefix +
//                              Regenerate button + "shown once" note
//   2. Just created/regenerated → full key + Copy + save-now warning
//   3. No key (rare fallback) → Create API Key button
//   Button labels are state-dependent (Create vs Regenerate) — no
//   dual-purpose buttons.
//
// ✅ UX (July 2026 — Usage example no longer shows the key PREFIX as if it
//   were a usable key; falls back to YOUR_API_KEY placeholder instead.)
//
// ✅ FIREFOX FIXES RETAINED (Feb 2026):
// - Token key: 'auth_token' (was 'token')
// - withCredentials for Firefox CORS
// - useAuth hook integration
// ============================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ✅ CRITICAL: Token key must match AuthContext
const TOKEN_KEY = 'auth_token';

const ApiKeyDisplay = () => {
  const [apiKey, setApiKey] = useState(null);   // Full key (shown once)
  const [keyInfo, setKeyInfo] = useState(null); // Key info (prefix only)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const { token: authToken, getToken } = useAuth();

  // ✅ FIX: key existence derived from what the backend ACTUALLY returns.
  // (has_api_key does not exist in the API response — key_prefix does.)
  const hasKey = Boolean(keyInfo?.key_prefix);

  // Fetch API key info on mount
  useEffect(() => {
    let mounted = true;

    const fetchKeyInfo = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY) || authToken || getToken?.();

        if (!token) {
          console.warn('⚠️ No authentication token found');
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching API key info...');

        const response = await axios.get(`${API_URL}/api/keys/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true, // ✅ CRITICAL for Firefox
        });

        if (!mounted) return;

        setKeyInfo(response.data);

        // ✅ FIX: if the backend just AUTO-CREATED a key, it returns the
        // full api_key exactly once. Surface it immediately so the user
        // can save it — previously this was silently discarded.
        if (response.data?.api_key) {
          setApiKey(response.data.api_key);
          console.log('🔑 New API key auto-created — displaying once');
        }

        setError(null);
        console.log('✅ API key info loaded');
        setLoading(false);
      } catch (err) {
        if (!mounted) return;

        console.error('❌ Failed to load API key info:', err);

        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else {
          setError(err.response?.data?.detail || 'Failed to load API key');
        }

        setLoading(false);
      }
    };

    fetchKeyInfo();

    return () => {
      mounted = false;
    };
  }, [authToken, getToken]);

  const handleCopy = async () => {
    if (!apiKey) return;

    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log('✅ API key copied to clipboard');
    } catch (err) {
      console.error('❌ Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);

    try {
      const token = localStorage.getItem(TOKEN_KEY) || authToken || getToken?.();

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('🔄 Regenerating API key...');

      const response = await axios.post(
        `${API_URL}/api/keys/regenerate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true, // ✅ CRITICAL for Firefox
        }
      );

      // Show the new key (one-time display)
      setApiKey(response.data.api_key);
      setKeyInfo({
        key_prefix: response.data.key_prefix,
        name: response.data.name || 'Default API Key',
        created_at: response.data.created_at,
      });

      setShowRegenerateModal(false);
      console.log('✅ API key regenerated successfully');

      setTimeout(() => {
        alert('⚠️ API key regenerated! Your old key will stop working. Copy the new key now!');
      }, 100);
    } catch (err) {
      console.error('❌ Failed to regenerate API key:', err);

      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to regenerate API key');
      }
    } finally {
      setRegenerating(false);
    }
  };

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          🔑 Your API Key
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading API key...</span>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // ERROR STATE
  // ==========================================================================
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          🔑 Your API Key
        </h3>

        {error.includes('authentication') || error.includes('Session expired') ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-3">
                  <button
                    onClick={() => window.location.replace('/login?next=%2Fdashboard')}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // MAIN DISPLAY — three states:
  //   A) apiKey set        → one-time full key panel (just created/regenerated)
  //   B) hasKey && !apiKey → active key: prefix + metadata + Regenerate
  //   C) !hasKey           → no key yet: Create button (rare — backend
  //                          auto-creates on first fetch, so this is a
  //                          fallback for edge cases/errors)
  // ==========================================================================
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          🔑 Your API Key
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          Use your API key to authenticate requests to the PixelPerfect API.
          Keep it secret and never share it publicly.
        </p>

        {/* ── State A: full key just created/regenerated (shown once) ── */}
        {apiKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-3">
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ Save this key now! You won't be able to see it again.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <code className="flex-1 bg-white px-4 py-3 rounded border border-gray-300 font-mono text-sm break-all">
                {apiKey}
              </code>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        )}

        {/* ── State B: key exists — show prefix + metadata + Regenerate ── */}
        {hasKey && !apiKey && (
          <div className="space-y-4">
            {/* ✅ Active-key confirmation — replaces the old (wrong)
                "You don't have an API key yet" message */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
              <span className="text-sm font-semibold text-green-800">
                Your API key is active
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                API Key (Hidden for Security)
              </label>
              <div className="flex items-center gap-2">
                <code className="bg-gray-200 px-3 py-2 rounded font-mono text-sm">
                  {keyInfo.key_prefix}
                </code>
                <span className="text-xs text-gray-500">•••••••••••••</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                For security, the full key is only shown once — at creation.
                Lost it? Regenerate a new one below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600 font-medium">Name:</span>{' '}
                <span className="text-gray-900">{keyInfo.name || 'Default API Key'}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Created:</span>{' '}
                <span className="text-gray-900">
                  {keyInfo.created_at ? new Date(keyInfo.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {keyInfo.last_used_at && (
                <div className="sm:col-span-2">
                  <span className="text-gray-600 font-medium">Last Used:</span>{' '}
                  <span className="text-gray-900">
                    {new Date(keyInfo.last_used_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowRegenerateModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              disabled={regenerating}
            >
              {regenerating ? '🔄 Regenerating...' : '🔄 Regenerate Key'}
            </button>
          </div>
        )}

        {/* ── State C: no key (rare fallback — backend auto-creates on
               first fetch, so this only appears in edge cases) ── */}
        {!hasKey && !apiKey && (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">You don't have an API key yet.</p>
            <button
              onClick={handleRegenerate}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              disabled={regenerating}
            >
              {regenerating ? '⏳ Creating...' : '➕ Create API Key'}
            </button>
          </div>
        )}

        {/* Usage Example */}
        <details className="mt-6 border border-gray-200 rounded-lg">
          <summary className="cursor-pointer font-semibold text-gray-900 p-3 hover:bg-gray-50 rounded-lg select-none">
            📚 Usage Example
          </summary>
          <div className="p-4 pt-0">
            <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto text-xs sm:text-sm mt-3">
{`# Using your API key in cURL
curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "width": 1920,
    "height": 1080,
    "format": "png"
  }'

# Using your API key in Python
import requests

headers = {
    "Authorization": "Bearer ${apiKey || 'YOUR_API_KEY'}",
    "Content-Type": "application/json"
}

data = {
    "url": "https://example.com",
    "width": 1920,
    "height": 1080,
    "format": "png"
}

response = requests.post(
    "https://api.pixelperfectapi.net/api/v1/screenshot/",
    headers=headers,
    json=data
)

print(response.json())`}
            </pre>
          </div>
        </details>
      </div>

      {/* Regenerate Modal */}
      {showRegenerateModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => !regenerating && setShowRegenerateModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ⚠️ Regenerate API Key?
            </h3>

            <p className="text-gray-600 mb-3">
              This will create a new API key and <strong className="text-red-600">immediately invalidate</strong> your old key.
            </p>

            <p className="text-gray-600 mb-6">
              Any applications using the old key will stop working. Are you sure you want to continue?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                disabled={regenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400"
                disabled={regenerating}
              >
                {regenerating ? 'Regenerating...' : 'Yes, Regenerate Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiKeyDisplay;

