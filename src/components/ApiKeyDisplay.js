// ============================================================================
// API KEY DISPLAY COMPONENT - PRODUCTION READY
// ============================================================================
// File: frontend/src/components/ApiKeyDisplay.js
// Author: OneTechly
// Updated: January 2026

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
  const [regenerating, setRegenerating] = useState(false);

  // Fetch API key info on mount
  useEffect(() => {
    let mounted = true;

    const fetchKeyInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching API key info...');
        const response = await axios.get(`${API_URL}/api/keys/current`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!mounted) return;
        
        setKeyInfo(response.data);
        console.log('✅ API key info loaded');
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        
        console.error('❌ Failed to load API key info:', err);
        setError(err.response?.data?.detail || 'Failed to load API key');
        setLoading(false);
      }
    };

    fetchKeyInfo();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCopy = async () => {
    if (!apiKey) return;

    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔄 Regenerating API key...');
      
      const response = await axios.post(
        `${API_URL}/api/keys/regenerate`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show the new key
      setApiKey(response.data.api_key);
      setKeyInfo({
        has_api_key: true,
        key_prefix: response.data.key_prefix,
        name: response.data.name,
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
      setError(err.response?.data?.detail || 'Failed to regenerate API key');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="card mb-6">
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

  if (error) {
    return (
      <div className="card mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          🔑 Your API Key
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card mb-6">
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
                <span className="text-gray-900">{keyInfo.name}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Created:</span>{' '}
                <span className="text-gray-900">
                  {new Date(keyInfo.created_at).toLocaleDateString()}
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

// ################################ IMPORTANT FOR MOBILE: ApiKeyDisplay.js (Enhanced Mobile) #############################


// // ============================================================================
// // API KEY DISPLAY COMPONENT - MOBILE-OPTIMIZED
// // ============================================================================
// // File: frontend/src/components/ApiKeyDisplay.js
// // Author: OneTechly
// // Updated: January 2026

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// const ApiKeyDisplay = () => {
//   const [apiKey, setApiKey] = useState(null);
//   const [keyInfo, setKeyInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [showRegenerateModal, setShowRegenerateModal] = useState(false);
//   const [regenerating, setRegenerating] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     const fetchKeyInfo = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('No authentication token found');
//           setLoading(false);
//           return;
//         }

//         console.log('🔍 Fetching API key info...');
//         const response = await axios.get(`${API_URL}/api/keys/current`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!mounted) return;
        
//         setKeyInfo(response.data);
//         console.log('✅ API key info loaded');
//         setLoading(false);
//       } catch (err) {
//         if (!mounted) return;
        
//         console.error('❌ Failed to load API key info:', err);
//         setError(err.response?.data?.detail || 'Failed to load API key');
//         setLoading(false);
//       }
//     };

//     fetchKeyInfo();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const handleCopy = async () => {
//     if (!apiKey) return;

//     try {
//       await navigator.clipboard.writeText(apiKey);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//       alert('Failed to copy to clipboard');
//     }
//   };

//   const handleRegenerate = async () => {
//     setRegenerating(true);
    
//     try {
//       const token = localStorage.getItem('token');
//       console.log('🔄 Regenerating API key...');
      
//       const response = await axios.post(
//         `${API_URL}/api/keys/regenerate`, 
//         {}, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setApiKey(response.data.api_key);
//       setKeyInfo({
//         has_api_key: true,
//         key_prefix: response.data.key_prefix,
//         name: response.data.name,
//         created_at: response.data.created_at
//       });
      
//       setShowRegenerateModal(false);
//       console.log('✅ API key regenerated successfully');
      
//       setTimeout(() => {
//         alert('⚠️ API key regenerated! Your old key will stop working. Copy the new key now!');
//       }, 100);
//     } catch (err) {
//       console.error('❌ Failed to regenerate API key:', err);
//       setError(err.response?.data?.detail || 'Failed to regenerate API key');
//     } finally {
//       setRegenerating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
//         <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4">
//           🔑 Your API Key
//         </h3>
//         <div className="flex items-center justify-center py-6 sm:py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-3 text-sm sm:text-base text-gray-600">Loading API key...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
//         <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4">
//           🔑 Your API Key
//         </h3>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
//           <p className="text-xs sm:text-sm text-red-800">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
//         <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
//           🔑 Your API Key
//         </h3>
        
//         <p className="text-xs sm:text-sm text-gray-600 mb-4">
//           Use your API key to authenticate requests to the PixelPerfect API.
//           Keep it secret and never share it publicly.
//         </p>

//         {/* Show full key if just generated/regenerated */}
//         {apiKey && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4">
//             <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 sm:p-3 mb-3">
//               <p className="text-xs sm:text-sm font-semibold text-yellow-800">
//                 ⚠️ Save this key now! You won't be able to see it again.
//               </p>
//             </div>
            
//             <div className="flex flex-col gap-2">
//               <div className="bg-white p-3 rounded border border-gray-300 overflow-x-auto">
//                 <code className="font-mono text-xs sm:text-sm break-all">
//                   {apiKey}
//                 </code>
//               </div>
//               <button 
//                 onClick={handleCopy}
//                 className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors active:scale-95 text-sm sm:text-base min-h-[44px]"
//               >
//                 {copied ? '✅ Copied!' : '📋 Copy Key'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Show key info (prefix only) */}
//         {keyInfo && keyInfo.has_api_key && !apiKey && (
//           <div className="space-y-3 sm:space-y-4">
//             <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
//               <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
//                 API Key (Hidden for Security)
//               </label>
//               <div className="flex items-center gap-2 overflow-x-auto">
//                 <code className="bg-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded font-mono text-xs sm:text-sm whitespace-nowrap">
//                   {keyInfo.key_prefix}
//                 </code>
//                 <span className="text-xs text-gray-500 whitespace-nowrap">•••••••••••••</span>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
//               <div>
//                 <span className="text-gray-600 font-medium">Name:</span>{' '}
//                 <span className="text-gray-900 break-all">{keyInfo.name}</span>
//               </div>
//               <div>
//                 <span className="text-gray-600 font-medium">Created:</span>{' '}
//                 <span className="text-gray-900">
//                   {new Date(keyInfo.created_at).toLocaleDateString()}
//                 </span>
//               </div>
//               {keyInfo.last_used_at && (
//                 <div className="sm:col-span-2">
//                   <span className="text-gray-600 font-medium">Last Used:</span>{' '}
//                   <span className="text-gray-900">
//                     {new Date(keyInfo.last_used_at).toLocaleDateString()}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <button 
//               onClick={() => setShowRegenerateModal(true)}
//               className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors active:scale-95 text-sm sm:text-base min-h-[44px]"
//               disabled={regenerating}
//             >
//               {regenerating ? '🔄 Regenerating...' : '🔄 Regenerate Key'}
//             </button>
//           </div>
//         )}

//         {/* No API key yet */}
//         {keyInfo && !keyInfo.has_api_key && (
//           <div className="text-center py-4 sm:py-6">
//             <p className="text-sm sm:text-base text-gray-600 mb-4">You don't have an API key yet.</p>
//             <button 
//               onClick={handleRegenerate}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors active:scale-95 text-sm sm:text-base min-h-[44px]"
//               disabled={regenerating}
//             >
//               {regenerating ? '⏳ Creating...' : '➕ Create API Key'}
//             </button>
//           </div>
//         )}

//         {/* Usage Example - Mobile Optimized */}
//         <details className="mt-4 sm:mt-6 border border-gray-200 rounded-lg">
//           <summary className="cursor-pointer font-semibold text-gray-900 p-3 hover:bg-gray-50 rounded-lg select-none text-sm sm:text-base">
//             📚 Usage Example
//           </summary>
//           <div className="p-3 sm:p-4 pt-0">
//             <div className="bg-gray-900 text-white rounded-lg p-3 sm:p-4 overflow-x-auto mt-3">
//               <pre className="text-[10px] sm:text-xs leading-relaxed">
// {`# cURL Example
// curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
//   -H "Authorization: Bearer ${apiKey || keyInfo?.key_prefix || 'YOUR_API_KEY'}" \\
//   -H "Content-Type: application/json" \\
//   -d '{"url": "https://example.com", "width": 1920, "height": 1080}'

// # Python Example
// import requests

// headers = {"Authorization": "Bearer ${apiKey || keyInfo?.key_prefix || 'YOUR_API_KEY'}"}
// data = {"url": "https://example.com", "width": 1920, "height": 1080}
// response = requests.post(
//     "https://api.pixelperfectapi.net/api/v1/screenshot/",
//     headers=headers, json=data
// )
// print(response.json())`}
//               </pre>
//             </div>
//           </div>
//         </details>
//       </div>

//       {/* Regenerate Modal - Mobile Optimized */}
//       {showRegenerateModal && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//           onClick={() => !regenerating && setShowRegenerateModal(false)}
//         >
//           <div 
//             className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 sm:p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
//               ⚠️ Regenerate API Key?
//             </h3>
            
//             <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">
//               This will create a new API key and <strong className="text-red-600">immediately invalidate</strong> your old key.
//             </p>
            
//             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
//               Any applications using the old key will stop working. Are you sure?
//             </p>
            
//             <div className="flex flex-col gap-2 sm:gap-3">
//               <button 
//                 onClick={() => setShowRegenerateModal(false)}
//                 className="w-full px-4 py-2.5 sm:py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors active:scale-95 text-sm sm:text-base min-h-[44px]"
//                 disabled={regenerating}
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleRegenerate}
//                 className="w-full px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400 active:scale-95 text-sm sm:text-base min-h-[44px]"
//                 disabled={regenerating}
//               >
//                 {regenerating ? 'Regenerating...' : 'Yes, Regenerate Key'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ApiKeyDisplay;






// ###################################################################################

// // =====================================================================================
// // ============================================================================
// // API KEY DISPLAY COMPONENT - REACT
// // ============================================================================
// // File: frontend/src/components/ApiKeyDisplay.js
// // Add this to your Dashboard.js or create as separate component

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// const ApiKeyDisplay = () => {
//   const [apiKey, setApiKey] = useState(null); // Full key (shown once)
//   const [keyInfo, setKeyInfo] = useState(null); // Key info (prefix only)
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [showRegenerateModal, setShowRegenerateModal] = useState(false);

//   // Fetch API key info on mount
//   useEffect(() => {
//     fetchKeyInfo();
//   }, []);

//   const fetchKeyInfo = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_URL}/api/keys/current`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setKeyInfo(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to load API key');
//       setLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     if (apiKey) {
//       navigator.clipboard.writeText(apiKey);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const handleRegenerate = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`${API_URL}/api/keys/regenerate`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       // Show the new key
//       setApiKey(response.data.api_key);
//       setKeyInfo({
//         has_api_key: true,
//         key_prefix: response.data.key_prefix,
//         name: response.data.name,
//         created_at: response.data.created_at
//       });
      
//       setShowRegenerateModal(false);
//       setLoading(false);
      
//       // Alert user
//       alert('⚠️ API key regenerated! Your old key will stop working. Copy the new key now!');
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to regenerate API key');
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="api-key-section">
//         <h3>🔑 Your API Key</h3>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="api-key-section error">
//         <h3>🔑 Your API Key</h3>
//         <p className="error-text">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="api-key-section">
//       <h3>🔑 Your API Key</h3>
      
//       <p className="api-key-description">
//         Use your API key to authenticate requests to the PixelPerfect API.
//         Keep it secret and never share it publicly.
//       </p>

//       {/* Show full key if just generated/regenerated */}
//       {apiKey && (
//         <div className="api-key-reveal">
//           <div className="alert alert-warning">
//             <strong>⚠️ Save this key now!</strong> You won't be able to see it again.
//           </div>
          
//           <div className="api-key-display">
//             <code className="api-key-text">{apiKey}</code>
//             <button 
//               onClick={handleCopy}
//               className="btn btn-copy"
//             >
//               {copied ? '✅ Copied!' : '📋 Copy'}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Show key info (prefix only) */}
//       {keyInfo && keyInfo.has_api_key && !apiKey && (
//         <div className="api-key-info">
//           <div className="key-prefix-display">
//             <label>API Key</label>
//             <code>{keyInfo.key_prefix}</code>
//             <span className="key-hidden-text">(Hidden for security)</span>
//           </div>
          
//           <div className="key-metadata">
//             <p><strong>Name:</strong> {keyInfo.name}</p>
//             <p><strong>Created:</strong> {new Date(keyInfo.created_at).toLocaleDateString()}</p>
//             {keyInfo.last_used_at && (
//               <p><strong>Last Used:</strong> {new Date(keyInfo.last_used_at).toLocaleDateString()}</p>
//             )}
//           </div>

//           <button 
//             onClick={() => setShowRegenerateModal(true)}
//             className="btn btn-danger"
//           >
//             🔄 Regenerate Key
//           </button>
//         </div>
//       )}

//       {/* No API key yet */}
//       {keyInfo && !keyInfo.has_api_key && (
//         <div className="no-api-key">
//           <p>You don't have an API key yet.</p>
//           <button 
//             onClick={handleRegenerate}
//             className="btn btn-primary"
//           >
//             ➕ Create API Key
//           </button>
//         </div>
//       )}

//       {/* Usage Example */}
//       <details className="usage-example">
//         <summary>📚 Usage Example</summary>
//         <pre>
// {`# Using your API key in cURL
// curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
//   -H "Authorization: Bearer ${apiKey || keyInfo?.key_prefix || 'YOUR_API_KEY'}" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://example.com",
//     "width": 1920,
//     "height": 1080,
//     "format": "png"
//   }'

// # Using your API key in Python
// import requests

// headers = {
//     "Authorization": "Bearer ${apiKey || keyInfo?.key_prefix || 'YOUR_API_KEY'}",
//     "Content-Type": "application/json"
// }

// data = {
//     "url": "https://example.com",
//     "width": 1920,
//     "height": 1080,
//     "format": "png"
// }

// response = requests.post(
//     "https://api.pixelperfectapi.net/api/v1/screenshot/",
//     headers=headers,
//     json=data
// )

// print(response.json())`}
//         </pre>
//       </details>

//       {/* Regenerate Modal */}
//       {showRegenerateModal && (
//         <div className="modal-overlay" onClick={() => setShowRegenerateModal(false)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h3>⚠️ Regenerate API Key?</h3>
//             <p>
//               This will create a new API key and <strong>immediately invalidate</strong> your old key.
//               Any applications using the old key will stop working.
//             </p>
//             <p>Are you sure you want to continue?</p>
            
//             <div className="modal-actions">
//               <button 
//                 onClick={() => setShowRegenerateModal(false)}
//                 className="btn btn-secondary"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleRegenerate}
//                 className="btn btn-danger"
//               >
//                 Yes, Regenerate Key
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ApiKeyDisplay;

// // ============================================================================
// // CSS STYLES - Add to your Dashboard.css or global styles
// // ============================================================================

// const styles = `
// .api-key-section {
//   background: #f9f9f9;
//   border: 1px solid #ddd;
//   border-radius: 8px;
//   padding: 20px;
//   margin: 20px 0;
// }

// .api-key-section h3 {
//   margin-top: 0;
// }

// .api-key-description {
//   color: #666;
//   font-size: 14px;
//   margin-bottom: 15px;
// }

// .api-key-reveal {
//   background: #fff3cd;
//   border: 1px solid #ffc107;
//   border-radius: 4px;
//   padding: 15px;
//   margin-bottom: 15px;
// }

// .alert-warning {
//   background: #fff3cd;
//   border-left: 4px solid #ffc107;
//   padding: 10px;
//   margin-bottom: 10px;
// }

// .api-key-display {
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-top: 10px;
// }

// .api-key-text {
//   flex: 1;
//   background: #fff;
//   padding: 10px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   font-family: 'Courier New', monospace;
//   font-size: 14px;
//   word-break: break-all;
// }

// .btn-copy {
//   padding: 8px 16px;
//   background: #28a745;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   white-space: nowrap;
// }

// .btn-copy:hover {
//   background: #218838;
// }

// .key-prefix-display {
//   background: #f8f9fa;
//   padding: 15px;
//   border-radius: 4px;
//   margin-bottom: 15px;
// }

// .key-prefix-display label {
//   display: block;
//   font-weight: bold;
//   margin-bottom: 5px;
//   color: #333;
// }

// .key-prefix-display code {
//   display: inline-block;
//   background: #e9ecef;
//   padding: 5px 10px;
//   border-radius: 3px;
//   font-family: 'Courier New', monospace;
//   margin-right: 10px;
// }

// .key-hidden-text {
//   color: #6c757d;
//   font-size: 12px;
// }

// .key-metadata p {
//   margin: 5px 0;
//   font-size: 14px;
// }

// .btn-danger {
//   padding: 10px 20px;
//   background: #dc3545;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 14px;
// }

// .btn-danger:hover {
//   background: #c82333;
// }

// .btn-primary {
//   padding: 10px 20px;
//   background: #007bff;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 14px;
// }

// .btn-primary:hover {
//   background: #0056b3;
// }

// .usage-example {
//   margin-top: 20px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   padding: 10px;
// }

// .usage-example summary {
//   cursor: pointer;
//   font-weight: bold;
//   padding: 5px;
// }

// .usage-example pre {
//   background: #2d2d2d;
//   color: #f8f8f2;
//   padding: 15px;
//   border-radius: 4px;
//   overflow-x: auto;
//   font-size: 12px;
//   margin-top: 10px;
// }

// .modal-overlay {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// }

// .modal {
//   background: white;
//   padding: 30px;
//   border-radius: 8px;
//   max-width: 500px;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
// }

// .modal h3 {
//   margin-top: 0;
// }

// .modal-actions {
//   display: flex;
//   gap: 10px;
//   justify-content: flex-end;
//   margin-top: 20px;
// }

// .btn-secondary {
//   padding: 10px 20px;
//   background: #6c757d;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
// }

// .btn-secondary:hover {
//   background: #5a6268;
// }

// .no-api-key {
//   text-align: center;
//   padding: 20px;
// }

// .error-text {
//   color: #dc3545;
// }
// `;

