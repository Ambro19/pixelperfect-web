// ============================================================================
// API KEY DISPLAY COMPONENT - REACT
// ============================================================================
// File: frontend/src/components/ApiKeyDisplay.js
// Add this to your Dashboard.js or create as separate component

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ApiKeyDisplay = () => {
  const [apiKey, setApiKey] = useState(null); // Full key (shown once)
  const [keyInfo, setKeyInfo] = useState(null); // Key info (prefix only)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  // Fetch API key info on mount
  useEffect(() => {
    fetchKeyInfo();
  }, []);

  const fetchKeyInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/keys/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKeyInfo(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load API key');
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/keys/regenerate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Show the new key
      setApiKey(response.data.api_key);
      setKeyInfo({
        has_api_key: true,
        key_prefix: response.data.key_prefix,
        name: response.data.name,
        created_at: response.data.created_at
      });
      
      setShowRegenerateModal(false);
      setLoading(false);
      
      // Alert user
      alert('⚠️ API key regenerated! Your old key will stop working. Copy the new key now!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to regenerate API key');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="api-key-section">
        <h3>🔑 Your API Key</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="api-key-section error">
        <h3>🔑 Your API Key</h3>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="api-key-section">
      <h3>🔑 Your API Key</h3>
      
      <p className="api-key-description">
        Use your API key to authenticate requests to the PixelPerfect API.
        Keep it secret and never share it publicly.
      </p>

      {/* Show full key if just generated/regenerated */}
      {apiKey && (
        <div className="api-key-reveal">
          <div className="alert alert-warning">
            <strong>⚠️ Save this key now!</strong> You won't be able to see it again.
          </div>
          
          <div className="api-key-display">
            <code className="api-key-text">{apiKey}</code>
            <button 
              onClick={handleCopy}
              className="btn btn-copy"
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Show key info (prefix only) */}
      {keyInfo && keyInfo.has_api_key && !apiKey && (
        <div className="api-key-info">
          <div className="key-prefix-display">
            <label>API Key</label>
            <code>{keyInfo.key_prefix}</code>
            <span className="key-hidden-text">(Hidden for security)</span>
          </div>
          
          <div className="key-metadata">
            <p><strong>Name:</strong> {keyInfo.name}</p>
            <p><strong>Created:</strong> {new Date(keyInfo.created_at).toLocaleDateString()}</p>
            {keyInfo.last_used_at && (
              <p><strong>Last Used:</strong> {new Date(keyInfo.last_used_at).toLocaleDateString()}</p>
            )}
          </div>

          <button 
            onClick={() => setShowRegenerateModal(true)}
            className="btn btn-danger"
          >
            🔄 Regenerate Key
          </button>
        </div>
      )}

      {/* No API key yet */}
      {keyInfo && !keyInfo.has_api_key && (
        <div className="no-api-key">
          <p>You don't have an API key yet.</p>
          <button 
            onClick={handleRegenerate}
            className="btn btn-primary"
          >
            ➕ Create API Key
          </button>
        </div>
      )}

      {/* Usage Example */}
      <details className="usage-example">
        <summary>📚 Usage Example</summary>
        <pre>
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
      </details>

      {/* Regenerate Modal */}
      {showRegenerateModal && (
        <div className="modal-overlay" onClick={() => setShowRegenerateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Regenerate API Key?</h3>
            <p>
              This will create a new API key and <strong>immediately invalidate</strong> your old key.
              Any applications using the old key will stop working.
            </p>
            <p>Are you sure you want to continue?</p>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowRegenerateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleRegenerate}
                className="btn btn-danger"
              >
                Yes, Regenerate Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyDisplay;

// ============================================================================
// CSS STYLES - Add to your Dashboard.css or global styles
// ============================================================================

const styles = `
.api-key-section {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.api-key-section h3 {
  margin-top: 0;
}

.api-key-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.api-key-reveal {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

.alert-warning {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 10px;
  margin-bottom: 10px;
}

.api-key-display {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.api-key-text {
  flex: 1;
  background: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
}

.btn-copy {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-copy:hover {
  background: #218838;
}

.key-prefix-display {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.key-prefix-display label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.key-prefix-display code {
  display: inline-block;
  background: #e9ecef;
  padding: 5px 10px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  margin-right: 10px;
}

.key-hidden-text {
  color: #6c757d;
  font-size: 12px;
}

.key-metadata p {
  margin: 5px 0;
  font-size: 14px;
}

.btn-danger {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-primary {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #0056b3;
}

.usage-example {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.usage-example summary {
  cursor: pointer;
  font-weight: bold;
  padding: 5px;
}

.usage-example pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  margin-top: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-top: 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-secondary {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #5a6268;
}

.no-api-key {
  text-align: center;
  padding: 20px;
}

.error-text {
  color: #dc3545;
}
`;

// ============================================================================
// INTEGRATION WITH DASHBOARD.JS
// ============================================================================

/*
// In your Dashboard.js, add this component:

import ApiKeyDisplay from './components/ApiKeyDisplay';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Subscription Status *\/}
      <SubscriptionStatus />
      
      {/* API Key Display - NEW! *\/}
      <ApiKeyDisplay />
      
      {/* Quick Actions *\/}
      <QuickActions />
      
      {/* Recent Activity *\/}
      <RecentActivity />
    </div>
  );
}
*/