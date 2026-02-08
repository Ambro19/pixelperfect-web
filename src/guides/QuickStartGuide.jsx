// ========================================
// QUICK START GUIDE - PIXELPERFECT
// ========================================
// Guide #1: Get up and running in 5 minutes
// Production-ready guide content

import React from 'react';

const QuickStartGuide = () => {
  return (
    <div className="prose prose-blue max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-1">What you'll learn</h3>
            <p className="text-blue-800 text-sm mb-0">
              In this guide, you'll learn how to capture your first screenshot with PixelPerfect in under 5 minutes.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prerequisites</h2>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>A PixelPerfect account (free tier works fine)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Basic knowledge of making HTTP requests (using curl, Postman, or similar)</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>5 minutes of your time</span>
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Get Your API Key</h2>
      <p className="text-gray-700 leading-relaxed">
        First, you'll need to get your API key from the dashboard:
      </p>
      <ol className="space-y-3 mt-4">
        <li>
          <strong>Sign in</strong> to your PixelPerfect account at{' '}
          <a href="https://pixelperfectapi.net/login" className="text-blue-600 hover:underline">
            pixelperfectapi.net/login
          </a>
        </li>
        <li>
          <strong>Navigate</strong> to the{' '}
          <a href="https://pixelperfectapi.net/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </a>
        </li>
        <li>
          <strong>Click</strong> on the <span className="font-mono bg-gray-100 px-2 py-1 rounded">API Keys</span> section
        </li>
        <li>
          <strong>Copy</strong> your API key (it looks like{' '}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">sk_live_abc123...</span>)
        </li>
      </ol>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Keep your API key secure!</h4>
            <p className="text-yellow-800 text-sm mb-0">
              Never share your API key publicly or commit it to version control. Treat it like a password.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Make Your First Request</h2>
      <p className="text-gray-700 leading-relaxed">
        Now let's capture a screenshot! Here's the simplest example using cURL:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "format": "png",
    "width": 1920,
    "height": 1080
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        <strong>Don't forget</strong> to replace <span className="font-mono bg-gray-100 px-2 py-1 rounded">YOUR_API_KEY</span>{' '}
        with your actual API key!
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Get Your Screenshot</h2>
      <p className="text-gray-700 leading-relaxed">
        The API will respond with a JSON object containing the screenshot URL:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "success": true,
  "screenshot_url": "https://pixelperfectapi.net/screenshots/abc123.png",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "file_size": 245678,
  "processing_time": 2.45
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed">
        You can now download the screenshot using the <span className="font-mono bg-gray-100 px-2 py-1 rounded">screenshot_url</span>!
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Customization Options</h2>
      <p className="text-gray-700 leading-relaxed">
        Want to customize your screenshot? Here are some common options:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Format</h4>
          <p className="text-sm text-gray-700">
            Choose from: <span className="font-mono">png</span>, <span className="font-mono">jpeg</span>,{' '}
            <span className="font-mono">webp</span>, or <span className="font-mono">pdf</span>
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Viewport Size</h4>
          <p className="text-sm text-gray-700">
            Set custom <span className="font-mono">width</span> and <span className="font-mono">height</span> in pixels
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Full Page</h4>
          <p className="text-sm text-gray-700">
            Set <span className="font-mono">"full_page": true</span> to capture entire page
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Quality</h4>
          <p className="text-sm text-gray-700">
            Adjust JPEG/WebP quality (1-100) with <span className="font-mono">quality</span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Congratulations! You've captured your first screenshot with PixelPerfect. Here's what to explore next:
      </p>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/guides/2"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Node.js Integration</h4>
            <p className="text-sm text-blue-700 mb-0">Learn how to use PixelPerfect in your Node.js apps</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/guides/4"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Batch Processing</h4>
            <p className="text-sm text-green-700 mb-0">Capture multiple screenshots efficiently</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/docs"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Full API Documentation</h4>
            <p className="text-sm text-purple-700 mb-0">Explore all available parameters and options</p>
          </div>
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-8 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're all set!</h4>
            <p className="text-green-800 text-sm mb-0">
              You now know how to capture screenshots with PixelPerfect. Happy screenshotting! 📸
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;