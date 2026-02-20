// ========================================
// API PAGE - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/pages/API.js
// Author: OneTechly
// Purpose: API playground and interactive documentation
// Updated: February 2026 - ✅ Mobile layout aligned with Documentation.jsx
//                         ✅ PHP, Ruby, Go language support

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

export default function API() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedEndpoint, setSelectedEndpoint] = useState('screenshot');
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [copied, setCopied] = useState(false);

  const endpoints = {
    screenshot: {
      method: 'POST',
      path: '/v1/screenshot',
      description: 'Capture a screenshot of any website',
      parameters: {
        url:       { type: 'string',  required: true,  description: 'Website URL to screenshot' },
        width:     { type: 'integer', required: false, default: 1920,  description: 'Viewport width in pixels' },
        height:    { type: 'integer', required: false, default: 1080,  description: 'Viewport height in pixels' },
        format:    { type: 'string',  required: false, default: 'png', enum: ['png', 'jpeg', 'webp', 'pdf'], description: 'Output format' },
        full_page: { type: 'boolean', required: false, default: false, description: 'Capture full page height' },
        dark_mode: { type: 'boolean', required: false, default: false, description: 'Enable dark mode' },
      }
    },
    batch: {
      method: 'POST',
      path: '/v1/batch/submit',
      description: 'Capture multiple screenshots in one request (Pro+ only)',
      parameters: {
        urls:   { type: 'array',   required: true,  description: 'Array of URLs to screenshot' },
        width:  { type: 'integer', required: false, default: 1920,  description: 'Viewport width' },
        height: { type: 'integer', required: false, default: 1080,  description: 'Viewport height' },
        format: { type: 'string',  required: false, default: 'png', enum: ['png', 'jpeg', 'webp', 'pdf'], description: 'Output format' },
      }
    }
  };

  const languages = [
    { id: 'curl',       label: 'cURL'       },
    { id: 'python',     label: 'Python'     },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'php',        label: 'PHP'        },
    { id: 'ruby',       label: 'Ruby'       },
    { id: 'go',         label: 'Go'         },
  ];

  const codeExamples = {
    curl: {
      screenshot: `curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "format": "png",
    "width": 1920,
    "height": 1080,
    "full_page": false,
    "dark_mode": false
  }'`,
      batch: `curl -X POST https://api.pixelperfectapi.net/v1/batch/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      "https://example.com",
      "https://github.com",
      "https://google.com"
    ],
    "width": 1920,
    "height": 1080,
    "format": "png"
  }'`
    },
    python: {
      screenshot: `import requests

response = requests.post(
    'https://api.pixelperfectapi.net/v1/screenshot',
    json={
        'url': 'https://example.com',
        'width': 1920,
        'height': 1080,
        'format': 'png',
        'full_page': False,
        'dark_mode': False
    },
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(data['screenshot_url'])`,
      batch: `import requests

response = requests.post(
    'https://api.pixelperfectapi.net/v1/batch/submit',
    json={
        'urls': [
            'https://example.com',
            'https://github.com',
            'https://google.com'
        ],
        'width': 1920,
        'height': 1080,
        'format': 'png'
    },
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(data['batch_id'])`
    },
    javascript: {
      screenshot: `const axios = require('axios');

const screenshot = await axios.post(
  'https://api.pixelperfectapi.net/v1/screenshot',
  {
    url: 'https://example.com',
    width: 1920,
    height: 1080,
    format: 'png',
    full_page: false,
    dark_mode: false
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

console.log(screenshot.data.screenshot_url);`,
      batch: `const axios = require('axios');

const batch = await axios.post(
  'https://api.pixelperfectapi.net/v1/batch/submit',
  {
    urls: [
      'https://example.com',
      'https://github.com',
      'https://google.com'
    ],
    width: 1920,
    height: 1080,
    format: 'png'
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

console.log(batch.data.batch_id);`
    },
    php: {
      screenshot: `<?php
require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->post(
  'https://api.pixelperfectapi.net/v1/screenshot',
  [
    'headers' => [
      'Authorization' => 'Bearer YOUR_API_KEY',
      'Content-Type'  => 'application/json'
    ],
    'json' => [
      'url'    => 'https://example.com',
      'width'  => 1920,
      'height' => 1080,
      'format' => 'png'
    ]
  ]
);

$data = json_decode($response->getBody(), true);
echo $data['screenshot_url'];`,
      batch: `<?php
$response = $client->post(
  'https://api.pixelperfectapi.net/v1/batch/submit',
  [
    'headers' => [
      'Authorization' => 'Bearer YOUR_API_KEY',
      'Content-Type'  => 'application/json'
    ],
    'json' => [
      'urls' => [
        'https://example.com',
        'https://github.com',
        'https://google.com'
      ],
      'width'  => 1920,
      'height' => 1080,
      'format' => 'png'
    ]
  ]
);

$data = json_decode($response->getBody(), true);
echo $data['batch_id'];`
    },
    ruby: {
      screenshot: `require 'httparty'

response = HTTParty.post(
  'https://api.pixelperfectapi.net/v1/screenshot',
  headers: {
    'Authorization' => 'Bearer YOUR_API_KEY',
    'Content-Type'  => 'application/json'
  },
  body: {
    url:    'https://example.com',
    width:  1920,
    height: 1080,
    format: 'png'
  }.to_json
)

data = JSON.parse(response.body)
puts data['screenshot_url']`,
      batch: `response = HTTParty.post(
  'https://api.pixelperfectapi.net/v1/batch/submit',
  headers: {
    'Authorization' => 'Bearer YOUR_API_KEY',
    'Content-Type'  => 'application/json'
  },
  body: {
    urls: [
      'https://example.com',
      'https://github.com',
      'https://google.com'
    ],
    width:  1920,
    height: 1080,
    format: 'png'
  }.to_json
)

data = JSON.parse(response.body)
puts data['batch_id']`
    },
    go: {
      screenshot: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

func main() {
    apiURL := "https://api.pixelperfectapi.net/v1/screenshot"

    payload := map[string]interface{}{
        "url":    "https://example.com",
        "width":  1920,
        "height": 1080,
        "format": "png",
    }

    jsonData, _ := json.Marshal(payload)

    req, _ := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)

    var result map[string]interface{}
    json.Unmarshal(body, &result)
    fmt.Println(result["screenshot_url"])
}`,
      batch: `payload := map[string]interface{}{
    "urls": []string{
        "https://example.com",
        "https://github.com",
        "https://google.com",
    },
    "width":  1920,
    "height": 1080,
    "format": "png",
}

jsonData, _ := json.Marshal(payload)

req, _ := http.NewRequest("POST",
    "https://api.pixelperfectapi.net/v1/batch/submit",
    bytes.NewBuffer(jsonData))
req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
req.Header.Set("Content-Type", "application/json")

client := &http.Client{}
resp, _ := client.Do(req)
defer resp.Body.Close()

body, _ := io.ReadAll(resp.Body)

var result map[string]interface{}
json.Unmarshal(body, &result)
fmt.Println(result["batch_id"])`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[selectedLanguage][selectedEndpoint]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ========================================
          HEADER — matches Documentation.jsx exactly
          ======================================== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">

            {/* Logo */}
            <div className="cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
              <PixelPerfectLogo
                size={window.innerWidth < 640 ? 32 : 40}
                showText={true}
              />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Get API Key
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================
          MAIN CONTENT
          ======================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ========================================
            HERO SECTION
            ======================================== */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <PixelPerfectLogo size={window.innerWidth < 640 ? 48 : 64} showText={false} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            PixelPerfect API
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            Programmatic screenshot API for developers. Capture any website with full customization.
          </p>
          {!isAuthenticated && (
            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base shadow-sm"
              >
                Get Your API Key →
              </button>
            </div>
          )}
        </div>

        {/* ========================================
            API PLAYGROUND
            ======================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">

          {/* LEFT: Endpoint Selector */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              API Endpoints
            </h2>

            {/* Endpoint Tabs */}
            <div className="space-y-2 mb-6">
              {[
                { id: 'screenshot', path: '/v1/screenshot',   label: 'Capture a single screenshot' },
                { id: 'batch',      path: '/v1/batch/submit', label: 'Batch processing (Pro+)' },
              ].map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-2 ${
                    selectedEndpoint === ep.id
                      ? 'bg-blue-50 border-blue-600'
                      : 'bg-gray-50 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex-shrink-0 bg-green-100 text-green-800 px-2.5 py-1 rounded font-mono text-xs sm:text-sm font-semibold">
                      POST
                    </span>
                    <code className="font-mono text-xs sm:text-sm text-gray-900 break-all">
                      {ep.path}
                    </code>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
                    {ep.label}
                  </p>
                </button>
              ))}
            </div>

            {/* Parameters */}
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                {endpoints[selectedEndpoint].description}
              </h3>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Parameters</h4>
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(endpoints[selectedEndpoint].parameters).map(([key, param]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <code className="text-sm font-mono text-blue-600">{key}</code>
                      <span className="text-xs text-gray-500">({param.type})</span>
                      {param.required ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">
                          required
                        </span>
                      ) : (
                        param.default !== undefined && (
                          <span className="text-xs text-gray-500">
                            default: {String(param.default)}
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{param.description}</p>
                    {param.enum && (
                      <p className="text-xs text-gray-500 mt-1">
                        Options: {param.enum.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Code Example */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Code Example
            </h2>

            {/* Language Tabs — scrollable on mobile, never wraps */}
            <div className="overflow-x-auto -mx-1 px-1 mb-4">
              <div className="flex gap-2 pb-1 min-w-max">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedLanguage === lang.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block — matches Documentation.jsx pattern exactly */}
            <div className="mb-6">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex justify-end px-3 sm:px-4 pt-3 pb-0">
                  <button
                    onClick={handleCopy}
                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded border border-gray-700 hover:border-gray-500"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div className="overflow-x-auto p-3 sm:p-4 pt-2">
                  <pre className="text-xs sm:text-sm text-gray-100 whitespace-pre">
                    <code>{codeExamples[selectedLanguage][selectedEndpoint]}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Response Example */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Response
              </h3>
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm text-gray-100">
{`{
  "screenshot_id": "abc123",
  "screenshot_url": "https://cdn.pixelperfectapi.net/abc123.png",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "size_bytes": 245678,
  "created_at": "2026-01-07T12:00:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            FEATURES — 1 col mobile, 3 col desktop
            ======================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            {
              icon:  '⚡',
              bg:    'bg-blue-100',
              title: 'Lightning Fast',
              desc:  'Capture screenshots in under 3 seconds with our optimized infrastructure.',
            },
            {
              icon:  '🎨',
              bg:    'bg-green-100',
              title: 'Full Customization',
              desc:  'Control viewport size, format, full-page capture, dark mode, and more.',
            },
            {
              icon:  '🔒',
              bg:    'bg-purple-100',
              title: 'Enterprise Ready',
              desc:  '99.9% uptime SLA, secure API, and dedicated support for enterprise customers.',
            },
          ].map((feature) => (
            <div key={feature.title} className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white">
              <div className={`w-11 h-11 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-xl">{feature.icon}</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* ========================================
            CTA SECTION
            ======================================== */}
        {!isAuthenticated && (
          <div className="bg-blue-600 rounded-lg p-6 sm:p-8 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Ready to get started?
            </h2>
            <p className="text-base sm:text-xl mb-5 sm:mb-6 opacity-90">
              Sign up for free and get 100 screenshots per month.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 rounded-lg text-sm sm:text-lg font-semibold hover:bg-gray-100 shadow-lg transition-colors"
            >
              Get Your API Key
            </button>
          </div>
        )}
      </div>

      {/* ========================================
          FOOTER — matches Documentation.jsx exactly
          ======================================== */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <PixelPerfectLogo size={28} showText={true} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Need help?{' '}
              <a
                href="mailto:support@pixelperfectapi.net"
                className="text-blue-600 hover:text-blue-700"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}




// // ========================================
// // API PAGE - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/pages/API.js
// // Author: OneTechly
// // Purpose: API playground and interactive documentation
// // Updated: February 2026 - ✅ Mobile layout fixed + PHP, Ruby, Go language support

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// export default function API() {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const [selectedEndpoint, setSelectedEndpoint] = useState('screenshot');
//   const [selectedLanguage, setSelectedLanguage] = useState('curl');
//   const [copied, setCopied] = useState(false);

//   const endpoints = {
//     screenshot: {
//       method: 'POST',
//       path: '/v1/screenshot',
//       description: 'Capture a screenshot of any website',
//       parameters: {
//         url: { type: 'string', required: true, description: 'Website URL to screenshot' },
//         width: { type: 'integer', required: false, default: 1920, description: 'Viewport width in pixels' },
//         height: { type: 'integer', required: false, default: 1080, description: 'Viewport height in pixels' },
//         format: { type: 'string', required: false, default: 'png', enum: ['png', 'jpeg', 'webp', 'pdf'], description: 'Output format' },
//         full_page: { type: 'boolean', required: false, default: false, description: 'Capture full page height' },
//         dark_mode: { type: 'boolean', required: false, default: false, description: 'Enable dark mode' },
//       }
//     },
//     batch: {
//       method: 'POST',
//       path: '/v1/batch/submit',
//       description: 'Capture multiple screenshots in one request (Pro+ only)',
//       parameters: {
//         urls: { type: 'array', required: true, description: 'Array of URLs to screenshot' },
//         width: { type: 'integer', required: false, default: 1920, description: 'Viewport width' },
//         height: { type: 'integer', required: false, default: 1080, description: 'Viewport height' },
//         format: { type: 'string', required: false, default: 'png', enum: ['png', 'jpeg', 'webp', 'pdf'], description: 'Output format' },
//       }
//     }
//   };

//   const languages = [
//     { id: 'curl', label: 'cURL' },
//     { id: 'python', label: 'Python' },
//     { id: 'javascript', label: 'JavaScript' },
//     { id: 'php', label: 'PHP' },
//     { id: 'ruby', label: 'Ruby' },
//     { id: 'go', label: 'Go' },
//   ];

//   const getCodeExample = () => {
//     const examples = {
//       curl: {
//         screenshot: `curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://example.com",
//     "format": "png",
//     "width": 1920,
//     "height": 1080,
//     "full_page": false,
//     "dark_mode": false
//   }'`,
//         batch: `curl -X POST https://api.pixelperfectapi.net/v1/batch/submit \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "urls": [
//       "https://example.com",
//       "https://github.com",
//       "https://google.com"
//     ],
//     "width": 1920,
//     "height": 1080,
//     "format": "png"
//   }'`
//       },
//       python: {
//         screenshot: `import requests

// response = requests.post(
//     'https://api.pixelperfectapi.net/v1/screenshot',
//     json={
//         'url': 'https://example.com',
//         'width': 1920,
//         'height': 1080,
//         'format': 'png',
//         'full_page': False,
//         'dark_mode': False
//     },
//     headers={
//         'Authorization': 'Bearer YOUR_API_KEY',
//         'Content-Type': 'application/json'
//     }
// )

// data = response.json()
// print(data['screenshot_url'])`,
//         batch: `import requests

// response = requests.post(
//     'https://api.pixelperfectapi.net/v1/batch/submit',
//     json={
//         'urls': [
//             'https://example.com',
//             'https://github.com',
//             'https://google.com'
//         ],
//         'width': 1920,
//         'height': 1080,
//         'format': 'png'
//     },
//     headers={
//         'Authorization': 'Bearer YOUR_API_KEY',
//         'Content-Type': 'application/json'
//     }
// )

// data = response.json()
// print(data['batch_id'])`
//       },
//       javascript: {
//         screenshot: `const axios = require('axios');

// const screenshot = await axios.post(
//   'https://api.pixelperfectapi.net/v1/screenshot',
//   {
//     url: 'https://example.com',
//     width: 1920,
//     height: 1080,
//     format: 'png',
//     full_page: false,
//     dark_mode: false
//   },
//   {
//     headers: {
//       'Authorization': 'Bearer YOUR_API_KEY',
//       'Content-Type': 'application/json'
//     }
//   }
// );

// console.log(screenshot.data.screenshot_url);`,
//         batch: `const axios = require('axios');

// const batch = await axios.post(
//   'https://api.pixelperfectapi.net/v1/batch/submit',
//   {
//     urls: [
//       'https://example.com',
//       'https://github.com',
//       'https://google.com'
//     ],
//     width: 1920,
//     height: 1080,
//     format: 'png'
//   },
//   {
//     headers: {
//       'Authorization': 'Bearer YOUR_API_KEY',
//       'Content-Type': 'application/json'
//     }
//   }
// );

// console.log(batch.data.batch_id);`
//       },
//       php: {
//         screenshot: `<?php
// require 'vendor/autoload.php';

// use GuzzleHttp\\Client;

// $client = new Client();
// $response = $client->post(
//   'https://api.pixelperfectapi.net/v1/screenshot',
//   [
//     'headers' => [
//       'Authorization' => 'Bearer YOUR_API_KEY',
//       'Content-Type' => 'application/json'
//     ],
//     'json' => [
//       'url' => 'https://example.com',
//       'width' => 1920,
//       'height' => 1080,
//       'format' => 'png'
//     ]
//   ]
// );

// $data = json_decode($response->getBody(), true);
// echo $data['screenshot_url'];`,
//         batch: `<?php
// $response = $client->post(
//   'https://api.pixelperfectapi.net/v1/batch/submit',
//   [
//     'headers' => [
//       'Authorization' => 'Bearer YOUR_API_KEY',
//       'Content-Type' => 'application/json'
//     ],
//     'json' => [
//       'urls' => [
//         'https://example.com',
//         'https://github.com',
//         'https://google.com'
//       ],
//       'width' => 1920,
//       'height' => 1080,
//       'format' => 'png'
//     ]
//   ]
// );

// $data = json_decode($response->getBody(), true);
// echo $data['batch_id'];`
//       },
//       ruby: {
//         screenshot: `require 'httparty'

// response = HTTParty.post(
//   'https://api.pixelperfectapi.net/v1/screenshot',
//   headers: {
//     'Authorization' => 'Bearer YOUR_API_KEY',
//     'Content-Type' => 'application/json'
//   },
//   body: {
//     url: 'https://example.com',
//     width: 1920,
//     height: 1080,
//     format: 'png'
//   }.to_json
// )

// data = JSON.parse(response.body)
// puts data['screenshot_url']`,
//         batch: `response = HTTParty.post(
//   'https://api.pixelperfectapi.net/v1/batch/submit',
//   headers: {
//     'Authorization' => 'Bearer YOUR_API_KEY',
//     'Content-Type' => 'application/json'
//   },
//   body: {
//     urls: [
//       'https://example.com',
//       'https://github.com',
//       'https://google.com'
//     ],
//     width: 1920,
//     height: 1080,
//     format: 'png'
//   }.to_json
// )

// data = JSON.parse(response.body)
// puts data['batch_id']`
//       },
//       go: {
//         screenshot: `package main

// import (
//     "bytes"
//     "encoding/json"
//     "fmt"
//     "io"
//     "net/http"
// )

// func main() {
//     url := "https://api.pixelperfectapi.net/v1/screenshot"

//     payload := map[string]interface{}{
//         "url":    "https://example.com",
//         "width":  1920,
//         "height": 1080,
//         "format": "png",
//     }

//     jsonData, _ := json.Marshal(payload)

//     req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
//     req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
//     req.Header.Set("Content-Type", "application/json")

//     client := &http.Client{}
//     resp, _ := client.Do(req)
//     defer resp.Body.Close()

//     body, _ := io.ReadAll(resp.Body)

//     var result map[string]interface{}
//     json.Unmarshal(body, &result)
//     fmt.Println(result["screenshot_url"])
// }`,
//         batch: `payload := map[string]interface{}{
//     "urls": []string{
//         "https://example.com",
//         "https://github.com",
//         "https://google.com",
//     },
//     "width":  1920,
//     "height": 1080,
//     "format": "png",
// }

// jsonData, _ := json.Marshal(payload)

// req, _ := http.NewRequest("POST",
//     "https://api.pixelperfectapi.net/v1/batch/submit",
//     bytes.NewBuffer(jsonData))
// req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
// req.Header.Set("Content-Type", "application/json")

// client := &http.Client{}
// resp, _ := client.Do(req)
// defer resp.Body.Close()

// body, _ := io.ReadAll(resp.Body)

// var result map[string]interface{}
// json.Unmarshal(body, &result)
// fmt.Println(result["batch_id"])`
//       }
//     };

//     return examples[selectedLanguage][selectedEndpoint];
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(getCodeExample()).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ========================================
//           HEADER - Sticky, mobile-responsive
//           ======================================== */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">

//             {/* Logo */}
//             <div className="cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
//               <PixelPerfectLogo size={36} showText={true} />
//             </div>

//             {/* Desktop Nav */}
//             <nav className="hidden md:flex items-center gap-6">
//               <button onClick={() => navigate('/docs')} className="text-gray-700 hover:text-gray-900 font-medium">
//                 Documentation
//               </button>
//               <button onClick={() => navigate('/pricing')} className="text-gray-700 hover:text-gray-900 font-medium">
//                 Pricing
//               </button>
//             </nav>

//             {/* Auth Buttons */}
//             <div className="flex items-center gap-2 sm:gap-3">
//               {isAuthenticated ? (
//                 <button
//                   onClick={() => navigate('/dashboard')}
//                   className="px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//                 >
//                   Dashboard
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => navigate('/login')}
//                     className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium hidden sm:block"
//                   >
//                     Sign in
//                   </button>
//                   <button
//                     onClick={() => navigate('/register')}
//                     className="px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
//                   >
//                     Get API Key
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ========================================
//           MAIN CONTENT
//           ======================================== */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

//         {/* ========================================
//             HERO SECTION
//             ======================================== */}
//         <div className="text-center mb-8 sm:mb-12">
//           <div className="flex justify-center items-center mb-4 sm:mb-6">
//             <PixelPerfectLogo size={56} showText={false} />
//           </div>
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
//             PixelPerfect API
//           </h1>
//           <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
//             Programmatic screenshot API for developers. Capture any website with full customization.
//           </p>
//           {!isAuthenticated && (
//             <div className="mt-6 sm:mt-8">
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 shadow-lg transition-colors"
//               >
//                 Get Your API Key →
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ========================================
//             API PLAYGROUND — Stacks on mobile, side-by-side on desktop
//             ======================================== */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">

//           {/* LEFT: Endpoint Selector */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">API Endpoints</h2>

//             {/* Endpoint Tabs */}
//             <div className="space-y-2 mb-6">
//               {[
//                 { id: 'screenshot', path: '/v1/screenshot', label: 'Capture a single screenshot' },
//                 { id: 'batch', path: '/v1/batch/submit', label: 'Batch processing (Pro+)' },
//               ].map((ep) => (
//                 <button
//                   key={ep.id}
//                   onClick={() => setSelectedEndpoint(ep.id)}
//                   className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-2 ${
//                     selectedEndpoint === ep.id
//                       ? 'bg-blue-50 border-blue-600'
//                       : 'bg-gray-50 border-transparent hover:bg-gray-100'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <span className="flex-shrink-0 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-mono font-semibold">
//                       POST
//                     </span>
//                     <span className="font-mono text-xs sm:text-sm truncate">{ep.path}</span>
//                   </div>
//                   <p className="text-xs sm:text-sm text-gray-600 mt-1 ml-0 sm:ml-14 pl-0">
//                     {ep.label}
//                   </p>
//                 </button>
//               ))}
//             </div>

//             {/* Parameters */}
//             <div className="border-t border-gray-200 pt-5">
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
//                 {endpoints[selectedEndpoint].description}
//               </h3>
//               <h4 className="text-sm font-semibold text-gray-700 mb-3">Parameters</h4>
//               <div className="space-y-2 sm:space-y-3">
//                 {Object.entries(endpoints[selectedEndpoint].parameters).map(([key, param]) => (
//                   <div key={key} className="bg-gray-50 p-3 rounded-lg">
//                     <div className="flex flex-wrap items-center gap-2 mb-1">
//                       <code className="text-sm font-mono text-blue-600">{key}</code>
//                       <span className="text-xs text-gray-500">({param.type})</span>
//                       {param.required && (
//                         <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">
//                           required
//                         </span>
//                       )}
//                       {!param.required && param.default !== undefined && (
//                         <span className="text-xs text-gray-500">
//                           default: {String(param.default)}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-xs sm:text-sm text-gray-600">{param.description}</p>
//                     {param.enum && (
//                       <p className="text-xs text-gray-500 mt-1">
//                         Options: {param.enum.join(', ')}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: Code Example */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">Code Example</h2>

//             {/* ========================================
//                 LANGUAGE TABS — Horizontally scrollable on mobile
//                 ======================================== */}
//             <div className="overflow-x-auto -mx-1 px-1 mb-4">
//               <div className="flex gap-2 pb-1 min-w-max">
//                 {languages.map((lang) => (
//                   <button
//                     key={lang.id}
//                     onClick={() => setSelectedLanguage(lang.id)}
//                     className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
//                       selectedLanguage === lang.id
//                         ? 'bg-gray-900 text-white'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {lang.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Code Block */}
//             <div className="relative mb-6">
//               <div className="bg-gray-900 rounded-lg overflow-hidden">
//                 {/* Copy button */}
//                 <div className="flex justify-end px-4 pt-3 pb-0">
//                   <button
//                     onClick={handleCopy}
//                     className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded border border-gray-700 hover:border-gray-500"
//                   >
//                     {copied ? '✓ Copied' : 'Copy'}
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto p-4 pt-2">
//                   <pre className="text-xs sm:text-sm text-gray-100 leading-relaxed">
//                     <code>{getCodeExample()}</code>
//                   </pre>
//                 </div>
//               </div>
//             </div>

//             {/* Response Example */}
//             <div>
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Response</h3>
//               <div className="bg-gray-900 rounded-lg overflow-x-auto p-4">
//                 <pre className="text-xs sm:text-sm text-gray-100 leading-relaxed">
// {`{
//   "screenshot_id": "abc123",
//   "screenshot_url": "https://cdn.pixelperfectapi.net/abc123.png",
//   "width": 1920,
//   "height": 1080,
//   "format": "png",
//   "size_bytes": 245678,
//   "created_at": "2026-01-07T12:00:00Z"
// }`}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ========================================
//             FEATURES GRID — 1 col mobile, 3 col desktop
//             ======================================== */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
//           {[
//             {
//               icon: '⚡',
//               bg: 'bg-blue-100',
//               title: 'Lightning Fast',
//               desc: 'Capture screenshots in under 3 seconds with our optimized infrastructure.',
//             },
//             {
//               icon: '🎨',
//               bg: 'bg-green-100',
//               title: 'Full Customization',
//               desc: 'Control viewport size, format, full-page capture, dark mode, and more.',
//             },
//             {
//               icon: '🔒',
//               bg: 'bg-purple-100',
//               title: 'Enterprise Ready',
//               desc: '99.9% uptime SLA, secure API, and dedicated support for enterprise customers.',
//             },
//           ].map((feature) => (
//             <div key={feature.title} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
//               <div className={`w-11 h-11 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
//                 <span className="text-xl">{feature.icon}</span>
//               </div>
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
//               <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
//             </div>
//           ))}
//         </div>

//         {/* ========================================
//             CTA SECTION
//             ======================================== */}
//         {!isAuthenticated && (
//           <div className="bg-blue-600 rounded-xl p-6 sm:p-8 text-center text-white">
//             <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to get started?</h2>
//             <p className="text-base sm:text-xl mb-5 sm:mb-6 opacity-90">
//               Sign up for free and get 100 screenshots per month.
//             </p>
//             <button
//               onClick={() => navigate('/register')}
//               className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 shadow-lg transition-colors"
//             >
//               Get Your API Key
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


//=========================================================
// // ========================================
// // API PAGE - PIXELPERFECT SCREENSHOT API
// // ========================================
// // File: frontend/src/pages/API.js
// // Author: OneTechly
// // Purpose: API playground and interactive documentation
// // Updated: February 2026 - ✅ Added PHP, Ruby, Go language support

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// export default function API() {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const [selectedEndpoint, setSelectedEndpoint] = useState('screenshot');
//   const [selectedLanguage, setSelectedLanguage] = useState('curl'); // curl, python, javascript, php, ruby, go

//   const endpoints = {
//     screenshot: {
//       method: 'POST',
//       path: '/v1/screenshot',
//       description: 'Capture a screenshot of any website',
//       parameters: {
//         url: { type: 'string', required: true, description: 'Website URL to screenshot' },
//         width: { type: 'integer', required: false, default: 1920, description: 'Viewport width in pixels' },
//         height: { type: 'integer', required: false, default: 1080, description: 'Viewport height in pixels' },
//         format: { type: 'string', required: false, default: 'png', enum: ['png', 'jpeg', 'webp', 'pdf'], description: 'Output format' },
//         full_page: { type: 'boolean', required: false, default: false, description: 'Capture full page height' },
//         dark_mode: { type: 'boolean', required: false, default: false, description: 'Enable dark mode' },
//       }
//     },
//     batch: {
//       method: 'POST',
//       path: '/v1/batch/submit',
//       description: 'Capture multiple screenshots in one request (Pro+ only)',
//       parameters: {
//         urls: { type: 'array', required: true, description: 'Array of URLs to screenshot' },
//         width: { type: 'integer', required: false, default: 1920, description: 'Viewport width' },
//         height: { type: 'integer', required: false, default: 1080, description: 'Viewport height' },
//         format: { type: 'string', required: false, default: 'png', enum: ['png', 'jpeg', 'webp', 'pdf'], description: 'Output format' },
//       }
//     }
//   };

//   // Code examples for each language - ✅ NOW WITH PHP, RUBY, GO!
//   const getCodeExample = () => {
//     const examples = {
//       curl: {
//         screenshot: `curl -X POST https://api.pixelperfectapi.net/v1/screenshot \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "url": "https://example.com",
//     "format": "png",
//     "width": 1920,
//     "height": 1080,
//     "full_page": false,
//     "dark_mode": false
//   }'`,
//         batch: `curl -X POST https://api.pixelperfectapi.net/v1/batch/submit \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "urls": [
//       "https://example.com",
//       "https://github.com",
//       "https://google.com"
//     ],
//     "width": 1920,
//     "height": 1080,
//     "format": "png"
//   }'`
//       },
//       python: {
//         screenshot: `import requests

// response = requests.post(
//     'https://api.pixelperfectapi.net/v1/screenshot',
//     json={
//         'url': 'https://example.com',
//         'width': 1920,
//         'height': 1080,
//         'format': 'png',
//         'full_page': False,
//         'dark_mode': False
//     },
//     headers={
//         'Authorization': 'Bearer YOUR_API_KEY',
//         'Content-Type': 'application/json'
//     }
// )

// data = response.json()
// print(data['screenshot_url'])`,
//         batch: `import requests

// response = requests.post(
//     'https://api.pixelperfectapi.net/v1/batch/submit',
//     json={
//         'urls': [
//             'https://example.com',
//             'https://github.com',
//             'https://google.com'
//         ],
//         'width': 1920,
//         'height': 1080,
//         'format': 'png'
//     },
//     headers={
//         'Authorization': 'Bearer YOUR_API_KEY',
//         'Content-Type': 'application/json'
//     }
// )

// data = response.json()
// print(data['batch_id'])`
//       },
//       javascript: {
//         screenshot: `const axios = require('axios');

// const screenshot = await axios.post(
//   'https://api.pixelperfectapi.net/v1/screenshot',
//   {
//     url: 'https://example.com',
//     width: 1920,
//     height: 1080,
//     format: 'png',
//     full_page: false,
//     dark_mode: false
//   },
//   {
//     headers: {
//       'Authorization': 'Bearer YOUR_API_KEY',
//       'Content-Type': 'application/json'
//     }
//   }
// );

// console.log(screenshot.data.screenshot_url);`,
//         batch: `const axios = require('axios');

// const batch = await axios.post(
//   'https://api.pixelperfectapi.net/v1/batch/submit',
//   {
//     urls: [
//       'https://example.com',
//       'https://github.com',
//       'https://google.com'
//     ],
//     width: 1920,
//     height: 1080,
//     format: 'png'
//   },
//   {
//     headers: {
//       'Authorization': 'Bearer YOUR_API_KEY',
//       'Content-Type': 'application/json'
//     }
//   }
// );

// console.log(batch.data.batch_id);`
//       },
//       // ========================================
//       // ✅ NEW: PHP CODE EXAMPLES
//       // ========================================
//       php: {
//         screenshot: `<?php
// require 'vendor/autoload.php';

// use GuzzleHttp\\Client;

// $client = new Client();
// $response = $client->post('https://api.pixelperfectapi.net/v1/screenshot', [
//     'headers' => [
//         'Authorization' => 'Bearer YOUR_API_KEY',
//         'Content-Type' => 'application/json'
//     ],
//     'json' => [
//         'url' => 'https://example.com',
//         'width' => 1920,
//         'height' => 1080,
//         'format' => 'png'
//     ]
// ]);

// $data = json_decode($response->getBody(), true);
// echo $data['screenshot_url'];`,
//         batch: `<?php
// $response = $client->post('https://api.pixelperfectapi.net/v1/batch/submit', [
//     'headers' => [
//         'Authorization' => 'Bearer YOUR_API_KEY',
//         'Content-Type' => 'application/json'
//     ],
//     'json' => [
//         'urls' => [
//             'https://example.com',
//             'https://github.com',
//             'https://google.com'
//         ],
//         'width' => 1920,
//         'height' => 1080,
//         'format' => 'png'
//     ]
// ]);

// $data = json_decode($response->getBody(), true);
// echo $data['batch_id'];`
//       },
//       // ========================================
//       // ✅ NEW: RUBY CODE EXAMPLES
//       // ========================================
//       ruby: {
//         screenshot: `require 'httparty'

// response = HTTParty.post(
//   'https://api.pixelperfectapi.net/v1/screenshot',
//   headers: {
//     'Authorization' => 'Bearer YOUR_API_KEY',
//     'Content-Type' => 'application/json'
//   },
//   body: {
//     url: 'https://example.com',
//     width: 1920,
//     height: 1080,
//     format: 'png'
//   }.to_json
// )

// data = JSON.parse(response.body)
// puts data['screenshot_url']`,
//         batch: `response = HTTParty.post(
//   'https://api.pixelperfectapi.net/v1/batch/submit',
//   headers: {
//     'Authorization' => 'Bearer YOUR_API_KEY',
//     'Content-Type' => 'application/json'
//   },
//   body: {
//     urls: [
//       'https://example.com',
//       'https://github.com',
//       'https://google.com'
//     ],
//     width: 1920,
//     height: 1080,
//     format: 'png'
//   }.to_json
// )

// data = JSON.parse(response.body)
// puts data['batch_id']`
//       },
//       // ========================================
//       // ✅ NEW: GO CODE EXAMPLES
//       // ========================================
//       go: {
//         screenshot: `package main

// import (
//     "bytes"
//     "encoding/json"
//     "fmt"
//     "io"
//     "net/http"
// )

// func main() {
//     url := "https://api.pixelperfectapi.net/v1/screenshot"
    
//     payload := map[string]interface{}{
//         "url":    "https://example.com",
//         "width":  1920,
//         "height": 1080,
//         "format": "png",
//     }
    
//     jsonData, _ := json.Marshal(payload)
    
//     req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
//     req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
//     req.Header.Set("Content-Type", "application/json")
    
//     client := &http.Client{}
//     resp, _ := client.Do(req)
//     defer resp.Body.Close()
    
//     body, _ := io.ReadAll(resp.Body)
    
//     var result map[string]interface{}
//     json.Unmarshal(body, &result)
//     fmt.Println(result["screenshot_url"])
// }`,
//         batch: `payload := map[string]interface{}{
//     "urls": []string{
//         "https://example.com",
//         "https://github.com",
//         "https://google.com",
//     },
//     "width":  1920,
//     "height": 1080,
//     "format": "png",
// }

// jsonData, _ := json.Marshal(payload)

// req, _ := http.NewRequest("POST", 
//     "https://api.pixelperfectapi.net/v1/batch/submit", 
//     bytes.NewBuffer(jsonData))
// req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
// req.Header.Set("Content-Type", "application/json")

// client := &http.Client{}
// resp, _ := client.Do(req)
// defer resp.Body.Close()

// body, _ := io.ReadAll(resp.Body)

// var result map[string]interface{}
// json.Unmarshal(body, &result)
// fmt.Println(result["batch_id"])`
//       }
//     };
    
//     return examples[selectedLanguage][selectedEndpoint];
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>

//             {/* Navigation */}
//             <nav className="hidden md:flex items-center gap-6">
//               <button
//                 onClick={() => navigate('/docs')}
//                 className="text-gray-700 hover:text-gray-900 font-medium"
//               >
//                 Documentation
//               </button>
//               <button
//                 onClick={() => navigate('/pricing')}
//                 className="text-gray-700 hover:text-gray-900 font-medium"
//               >
//                 Pricing
//               </button>
//             </nav>

//             {/* Auth Buttons */}
//             <div className="flex items-center gap-3">
//               {isAuthenticated ? (
//                 <button
//                   onClick={() => navigate('/dashboard')}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
//                 >
//                   Dashboard
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => navigate('/login')}
//                     className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
//                   >
//                     Sign in
//                   </button>
//                   <button
//                     onClick={() => navigate('/register')}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
//                   >
//                     Get API Key
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Hero Section with Logo */}
//         <div className="text-center mb-12">
//           {/* Logo at top center */}
//           <div className="flex justify-center items-center mb-6">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
          
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             PixelPerfect API
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Programmatic screenshot API for developers. Capture any website with full customization.
//           </p>

//           {!isAuthenticated && (
//             <div className="mt-8">
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg"
//               >
//                 Get Your API Key →
//               </button>
//             </div>
//           )}
//         </div>

//         {/* API Playground */}
//         <div className="grid lg:grid-cols-2 gap-8 mb-12">
//           {/* Left: Endpoint Selector */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">API Endpoints</h2>

//             {/* Endpoint Tabs */}
//             <div className="space-y-2 mb-6">
//               <button
//                 onClick={() => setSelectedEndpoint('screenshot')}
//                 className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
//                   selectedEndpoint === 'screenshot'
//                     ? 'bg-blue-50 border-2 border-blue-600'
//                     : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono font-semibold">
//                     POST
//                   </span>
//                   <span className="font-mono text-sm">/v1/screenshot</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-1 ml-14">
//                   Capture a single screenshot
//                 </p>
//               </button>

//               <button
//                 onClick={() => setSelectedEndpoint('batch')}
//                 className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
//                   selectedEndpoint === 'batch'
//                     ? 'bg-blue-50 border-2 border-blue-600'
//                     : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono font-semibold">
//                     POST
//                   </span>
//                   <span className="font-mono text-sm">/v1/batch/submit</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-1 ml-14">
//                   Batch screenshot processing (Pro+)
//                 </p>
//               </button>
//             </div>

//             {/* Endpoint Details */}
//             <div className="border-t border-gray-200 pt-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 {endpoints[selectedEndpoint].description}
//               </h3>

//               <h4 className="text-sm font-semibold text-gray-700 mb-3">Parameters:</h4>
//               <div className="space-y-3">
//                 {Object.entries(endpoints[selectedEndpoint].parameters).map(([key, param]) => (
//                   <div key={key} className="bg-gray-50 p-3 rounded">
//                     <div className="flex items-center gap-2 mb-1">
//                       <code className="text-sm font-mono text-blue-600">{key}</code>
//                       <span className="text-xs text-gray-500">({param.type})</span>
//                       {param.required && (
//                         <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
//                           required
//                         </span>
//                       )}
//                       {param.default && (
//                         <span className="text-xs text-gray-500">
//                           default: {param.default}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-sm text-gray-600">{param.description}</p>
//                     {param.enum && (
//                       <p className="text-xs text-gray-500 mt-1">
//                         Options: {param.enum.join(', ')}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right: Code Example */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Example</h2>

//             {/* ========================================
//                 LANGUAGE TABS - ✅ NOW WITH 6 LANGUAGES!
//                 ======================================== */}
//             <div className="flex flex-wrap gap-2 mb-4">
//               <button 
//                 onClick={() => setSelectedLanguage('curl')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   selectedLanguage === 'curl' 
//                     ? 'bg-gray-900 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 cURL
//               </button>
//               <button 
//                 onClick={() => setSelectedLanguage('python')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   selectedLanguage === 'python' 
//                     ? 'bg-gray-900 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Python
//               </button>
//               <button 
//                 onClick={() => setSelectedLanguage('javascript')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   selectedLanguage === 'javascript' 
//                     ? 'bg-gray-900 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 JavaScript
//               </button>
//               {/* ✅ NEW: PHP BUTTON */}
//               <button 
//                 onClick={() => setSelectedLanguage('php')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   selectedLanguage === 'php' 
//                     ? 'bg-gray-900 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 PHP
//               </button>
//               {/* ✅ NEW: RUBY BUTTON */}
//               <button 
//                 onClick={() => setSelectedLanguage('ruby')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   selectedLanguage === 'ruby' 
//                     ? 'bg-gray-900 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Ruby
//               </button>
//               {/* ✅ NEW: GO BUTTON */}
//               <button 
//                 onClick={() => setSelectedLanguage('go')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   selectedLanguage === 'go' 
//                     ? 'bg-gray-900 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Go
//               </button>
//             </div>

//             {/* Code Block - Now displays all 6 languages! */}
//             <div className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto mb-6">
//               <pre className="text-sm">
//                 <code>{getCodeExample()}</code>
//               </pre>
//             </div>

//             {/* Response Example */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">Response:</h3>
//               <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
//                 <pre className="text-sm text-gray-100">
// {`{
//   "screenshot_id": "abc123",
//   "screenshot_url": "https://cdn.pixelperfectapi.net/abc123.png",
//   "width": 1920,
//   "height": 1080,
//   "format": "png",
//   "size_bytes": 245678,
//   "created_at": "2026-01-07T12:00:00Z"
// }`}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Features Grid */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           <div className="bg-white p-6 rounded-xl shadow-sm">
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-2xl">⚡</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
//             <p className="text-gray-600">
//               Capture screenshots in under 3 seconds with our optimized infrastructure.
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-2xl">🎨</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Customization</h3>
//             <p className="text-gray-600">
//               Control viewport size, format, full-page capture, dark mode, and more.
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
//               <span className="text-2xl">🔒</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Ready</h3>
//             <p className="text-gray-600">
//               99.9% uptime SLA, secure API, and dedicated support for enterprise customers.
//             </p>
//           </div>
//         </div>

//         {/* CTA Section */}
//         {!isAuthenticated && (
//           <div className="bg-blue-600 rounded-xl p-8 text-center text-white">
//             <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
//             <p className="text-xl mb-6 opacity-90">
//               Sign up for free and get 100 screenshots per month.
//             </p>
//             <button
//               onClick={() => navigate('/register')}
//               className="px-8 py-3 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 shadow-lg"
//             >
//               Get Your API Key
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


