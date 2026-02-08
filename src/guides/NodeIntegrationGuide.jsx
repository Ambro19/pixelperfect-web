// import React from 'react';

// const NodeIntegrationGuide = () => (
//   <div className="prose prose-blue max-w-none">
//     <h2 className="text-3xl font-bold mb-4">Node.js Integration Guide</h2>
//     <p className="text-lg text-gray-700 mb-6">
//       Learn how to integrate PixelPerfect Screenshot API with your Node.js applications.
//     </p>
//     <div className="bg-blue-50 p-6 rounded-lg">
//       <p className="text-gray-700 italic mb-0">
//         📚 Full guide content coming soon. Check back later or view our{' '}
//         <a href="/docs" className="text-blue-600 hover:underline">API Documentation</a>{' '}
//         for now.
//       </p>
//     </div>
//   </div>
// );

// export default NodeIntegrationGuide;


// ========================================
// GUIDE CONTENT TEMPLATES - PIXELPERFECT
// ========================================
// Templates for creating the remaining 8 guide content components
// Copy and customize for each guide
// ========================================

/*
INSTRUCTIONS FOR CREATING GUIDE CONTENT COMPONENTS:

1. Create a new file in frontend/src/guides/ for each guide:
   - NodeIntegrationGuide.jsx
   - PythonIntegrationGuide.jsx
   - BatchProcessingGuide.jsx
   - JavaScriptExecutionGuide.jsx
   - OptimizationGuide.jsx
   - WebsiteMonitorGuide.jsx
   - SocialMediaPreviewGuide.jsx
   - ErrorsAndSolutionsGuide.jsx

2. Each file should follow this structure:
*/

// ========================================
// TEMPLATE: Node.js Integration Guide
// ========================================

import React from 'react';

const NodeIntegrationGuide = () => {
  return (
    <div className="prose prose-blue max-w-none">
      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-1">What you'll learn</h3>
            <p className="text-blue-800 text-sm mb-0">
              Complete guide to integrating PixelPerfect Screenshot API with Node.js applications using axios or fetch.
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prerequisites</h2>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Node.js 14+ installed</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>PixelPerfect API key</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Basic JavaScript/Node.js knowledge</span>
        </li>
      </ul>

      {/* Main Content Sections */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Installation</h2>
      <p className="text-gray-700 leading-relaxed">
        First, install the required dependencies:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`npm install axios
# or
npm install node-fetch`}
        </pre>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Basic Example</h2>
      
      <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const axios = require('axios');

async function captureScreenshot(url) {
  try {
    const response = await axios.post(
      'https://api.pixelperfectapi.net/v1/screenshot',
      {
        url: url,
        format: 'png',
        width: 1920,
        height: 1080
      },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Screenshot URL:', response.data.screenshot_url);
    return response.data;
  } catch (error) {
    console.error('Screenshot failed:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
captureScreenshot('https://example.com')
  .then(result => console.log('Success!', result))
  .catch(err => console.error('Error:', err));`}
        </pre>
      </div>

      {/* Add more sections as needed... */}
      
      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>
      <div className="grid grid-cols-1 gap-4">
        <a
          href="/guides/4"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Batch Processing Guide</h4>
            <p className="text-sm text-blue-700 mb-0">Process multiple URLs efficiently</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default NodeIntegrationGuide;