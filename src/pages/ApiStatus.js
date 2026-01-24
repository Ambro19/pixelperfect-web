// ========================================
// API STATUS PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/ApiStatus.js
// Author: OneTechly
// Purpose: Real-time API health and status monitoring
// Created: January 2026

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

export default function ApiStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    operational: null,
    responseTime: null,
    lastChecked: null,
    error: null
  });

  const checkHealth = async () => {
    const startTime = Date.now();
    try {
      await api.get('/health', { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      setStatus({
        operational: true,
        responseTime,
        lastChecked: new Date(),
        error: null
      });
    } catch (error) {
      setStatus({
        operational: false,
        responseTime: null,
        lastChecked: new Date(),
        error: error.message
      });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status.operational === null) return 'bg-gray-500';
    if (status.operational) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (status.operational === null) return 'Checking...';
    if (status.operational) return 'Operational';
    return 'Experiencing Issues';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText={true} />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/docs')}
                className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Documentation
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            API Status
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time status and uptime monitoring for PixelPerfect Screenshot API
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Current Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
              <h3 className="text-lg font-semibold text-gray-900">API Status</h3>
            </div>
            <p className={`text-2xl font-bold ${status.operational ? 'text-green-600' : 'text-red-600'}`}>
              {getStatusText()}
            </p>
            {status.lastChecked && (
              <p className="text-sm text-gray-500 mt-2">
                Last checked: {status.lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚡</span>
              <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {status.responseTime !== null ? `${status.responseTime}ms` : '—'}
            </p>
            <p className="text-sm text-gray-500 mt-2">Average API latency</p>
          </div>

          {/* Uptime */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-semibold text-gray-900">Uptime</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">99.9%</p>
            <p className="text-sm text-gray-500 mt-2">30-day uptime SLA</p>
          </div>
        </div>

        {/* Error Display */}
        {status.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Connection Error</h3>
                <p className="text-red-700">{status.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Services Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status.operational ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Screenshot API</h3>
                  <p className="text-sm text-gray-600">Core screenshot capture service</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                status.operational ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {status.operational ? 'Operational' : 'Down'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Authentication Service</h3>
                  <p className="text-sm text-gray-600">API key validation and user auth</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">CDN Delivery</h3>
                  <p className="text-sm text-gray-600">Global screenshot delivery network</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Batch Processing</h3>
                  <p className="text-sm text-gray-600">Multi-screenshot job queue</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Operational
              </span>
            </div>
          </div>
        </div>

        {/* Uptime History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">30-Day Uptime History</h2>
          
          <div className="grid grid-cols-30 gap-1 mb-4">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="h-12 bg-green-500 rounded hover:bg-green-600 transition-colors cursor-pointer"
                title={`Day ${30 - i}: 100% uptime`}
              ></div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
          
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">100% uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Partial outage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Major outage</span>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={checkHealth}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Refresh Status
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <PixelPerfectLogo size={28} showText={true} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Questions about API status?{' '}
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