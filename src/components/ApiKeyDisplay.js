// ============================================================================
// API KEY DISPLAY COMPONENT - PRODUCTION READY
// ============================================================================
// File: frontend/src/components/ApiKeyDisplay.js
// Author: OneTechly
// Updated: February 2026
//
// ✅ FIREFOX FIXES INTEGRATED:
// - Fixed token key: 'auth_token' (was 'token')
// - Added withCredentials for Firefox CORS
// - Added useAuth hook integration
// - Preserved all original UI features
// ============================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ✅ CRITICAL: Token key must match AuthContext
const TOKEN_KEY = 'auth_token';  // Was 'token' - THIS WAS THE BUG!

const ApiKeyDisplay = () => {
  const [apiKey, setApiKey] = useState(null); // Full key (shown once)
  const [keyInfo, setKeyInfo] = useState(null); // Key info (prefix only)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // ✅ NEW: Get auth context for better token management
  const { token: authToken, getToken } = useAuth();

  // Fetch API key info on mount
  useEffect(() => {
    let mounted = true;

    const fetchKeyInfo = async () => {
      try {
        // ✅ FIXED: Use auth_token key + fallback to AuthContext
        const token = localStorage.getItem(TOKEN_KEY) || authToken || getToken?.();
        
        if (!token) {
          console.warn('⚠️ No authentication token found');
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching API key info...');
        
        // ✅ FIREFOX FIX: Added withCredentials for CORS
        const response = await axios.get(`${API_URL}/api/keys/current`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,  // ✅ CRITICAL for Firefox
        });

        if (!mounted) return;
        
        setKeyInfo(response.data);
        setError(null);  // ✅ Clear any previous errors
        console.log('✅ API key info loaded');
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        
        console.error('❌ Failed to load API key info:', err);
        
        // ✅ IMPROVED: Better error messages
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
  }, [authToken, getToken]);  // ✅ Added dependencies

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
    setError(null);  // ✅ Clear previous errors
    
    try {
      // ✅ FIXED: Use auth_token key + fallback
      const token = localStorage.getItem(TOKEN_KEY) || authToken || getToken?.();
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('🔄 Regenerating API key...');
      
      // ✅ FIREFOX FIX: Added withCredentials
      const response = await axios.post(
        `${API_URL}/api/keys/regenerate`, 
        {}, 
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,  // ✅ CRITICAL for Firefox
        }
      );
      
      // Show the new key
      setApiKey(response.data.api_key);
      setKeyInfo({
        has_api_key: true,
        key_prefix: response.data.key_prefix,
        name: response.data.name || 'Default API Key',
        created_at: response.data.created_at
      });
      
      setShowRegenerateModal(false);
      console.log('✅ API key regenerated successfully');
      
      // Show alert
      setTimeout(() => {
        alert('⚠️ API key regenerated! Your old key will stop working. Copy the new key now!');
      }, 100);
    } catch (err) {
      console.error('❌ Failed to regenerate API key:', err);
      
      // ✅ IMPROVED: Better error messages
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to regenerate API key');
      }
    } finally {
      setRegenerating(false);
    }
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================
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

  // ============================================================================
  // ERROR STATE
  // ============================================================================
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          🔑 Your API Key
        </h3>
        
        {/* ✅ IMPROVED: Different UI for auth errors vs general errors */}
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

  // ============================================================================
  // MAIN DISPLAY
  // ============================================================================
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

        {/* Show full key if just generated/regenerated */}
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

        {/* Show key info (prefix only) */}
        {keyInfo && keyInfo.has_api_key && !apiKey && (
          <div className="space-y-4">
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

        {/* No API key yet */}
        {keyInfo && !keyInfo.has_api_key && (
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
  -H "Authorization: Bearer ${apiKey || keyInfo?.key_prefix || 'YOUR_API_KEY'}" \\
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
    "Authorization": "Bearer ${apiKey || keyInfo?.key_prefix || 'YOUR_API_KEY'}",
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