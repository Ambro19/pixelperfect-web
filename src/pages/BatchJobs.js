// ============================================================================
// BATCH JOB PAGE - PRODUCTION READY
// ============================================================================
// File: frontend/src/pages/BatchJob.js
// Author: OneTechly
// Updated: February 2026
//
// ✅ PRODUCTION FEATURES:
// - Centered PixelPerfect logo (replaces camera emoji)
// - Professional file upload functionality
// - CSV/TXT/TSV file support
// - Batch processing up to 50 URLs
// - Consistent UI design with other pages
// - PDF format support added to dropdown
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function BatchJob() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [urls, setUrls] = useState('');
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [format, setFormat] = useState('png');
  const [fullPage, setFullPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['text/plain', 'text/csv', 'text/tab-separated-values'];
      const validExtensions = ['.txt', '.csv', '.tsv'];
      const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
      
      if (validTypes.includes(selectedFile.type) || validExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        setError('');
        
        // Read file and populate URLs
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setUrls(content);
        };
        reader.readAsText(selectedFile);
      } else {
        setError('Invalid file type. Please upload a .txt, .csv, or .tsv file.');
        setFile(null);
      }
    }
  };

  // Handle batch submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Parse URLs from textarea
      const urlList = urls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      if (urlList.length === 0) {
        setError('Please enter at least one URL');
        setLoading(false);
        return;
      }

      if (urlList.length > 50) {
        setError('Maximum 50 URLs per batch. Please reduce the number of URLs.');
        setLoading(false);
        return;
      }

      const payload = {
        urls: urlList,
        width: parseInt(width),
        height: parseInt(height),
        format: format,
        full_page: fullPage
      };

      const response = await axios.post(
        `${API_URL}/api/v1/batch/submit`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(`✅ Batch job submitted successfully! Job ID: ${response.data.id}`);
      
      // Clear form after 2 seconds
      setTimeout(() => {
        setUrls('');
        setFile(null);
        navigate('/activity');
      }, 2000);

    } catch (err) {
      console.error('Batch submission error:', err);
      setError(err.response?.data?.detail || 'Failed to submit batch job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Centered Page Header with PixelPerfect Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Batch Screenshot Jobs
          </h1>
          
          <p className="text-gray-600 text-sm sm:text-base">
            Capture screenshots of multiple websites at once. Process up to 50 URLs per batch.
          </p>
          
          <p className="text-sm text-gray-500 mt-2">
            Pro · up to 50 URLs per batch
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Screenshot Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📐</span> Screenshot Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dimensions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Dimensions</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Preset buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => { setWidth(1920); setHeight(1080); }}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Desktop (1920x1080)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setWidth(1366); setHeight(768); }}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Laptop (1366x768)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setWidth(375); setHeight(667); }}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Mobile (375x667)
                    </button>
                  </div>
                </div>

                {/* Format */}
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

                  {/* Quality hint for JPEG/WebP */}
                  {(format === 'jpeg' || format === 'webp') && (
                    <p className="text-xs text-blue-600 mb-3">
                      💡 {format.toUpperCase()} uses optimized quality settings automatically.
                    </p>
                  )}

                  {/* PDF hint */}
                  {format === 'pdf' && (
                    <p className="text-xs text-blue-600 mb-3">
                      💡 PDF captures the full page as a printable document.
                    </p>
                  )}

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
                </div>
              </div>
            </div>

            {/* URL Input Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Manual URL Entry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URLs (one per line)
                  </label>
                  <textarea
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
                    placeholder="https://example.com&#10;https://another-site.com&#10;https://third-site.com"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter up to 50 URLs, one per line
                  </p>
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File (CSV/TXT/TSV)
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".txt,.csv,.tsv,text/plain,text/csv,text/tab-separated-values"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="text-4xl">📄</div>
                      {file ? (
                        <>
                          <div className="text-sm font-medium text-green-600">
                            ✓ {file.name}
                          </div>
                          <p className="text-xs text-gray-500">
                            File loaded successfully
                          </p>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                          >
                            Browse...
                          </button>
                          <div className="text-sm text-gray-600">
                            No file selected
                          </div>
                        </>
                      )}
                    </label>
                    
                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                      <p>Upload any text file containing website URLs.</p>
                      <p>Supports CSV, TXT, TSV formats.</p>
                      <p className="text-blue-600 font-medium">
                        We'll automatically detect URLs in any column or format.
                      </p>
                    </div>
                  </div>

                  {file && (
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setUrls('');
                        document.getElementById('file-upload').value = '';
                      }}
                      className="mt-3 w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      Clear File
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 font-medium">❌ {error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 font-medium">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (!urls && !file)}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Batch...
                </span>
              ) : (
                '🚀 Submit Batch Job'
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">© 2026 PixelPerfect API. Built by OneTechly.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/terms')} className="hover:text-blue-600 transition-colors">
                Terms
              </button>
              <button onClick={() => navigate('/privacy')} className="hover:text-blue-600 transition-colors">
                Privacy
              </button>
              <button onClick={() => navigate('/documentation')} className="hover:text-blue-600 transition-colors">
                Docs
              </button>
              <button onClick={() => navigate('/contact')} className="hover:text-blue-600 transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////////////
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

//       setMessage(`✅ Batch job submitted successfully! Job ID: ${response.data.job_id}`);
      
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
        
//         {/* ✅ Centered Page Header with PixelPerfect Logo */}
//         <div className="text-center mb-8">
//           {/* Centered PixelPerfect logo - REPLACES camera emoji */}
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>

//           {/* Page title */}
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
//             Batch Screenshot Jobs
//           </h1>
          
//           {/* Subtitle */}
//           <p className="text-gray-600 text-sm sm:text-base">
//             Capture screenshots of multiple websites at once. Process up to 50 URLs per batch.
//           </p>
          
//           <p className="text-sm text-gray-500 mt-2">
//             Pro-up to 50 URLs per batch
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
//                     <option value="jpg">JPG (compressed)</option>
//                     <option value="webp">WebP (modern)</option>
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

//                 {/* File Upload Section - IMPROVED */}
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

