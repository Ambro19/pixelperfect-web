// ========================================
// GUIDE DETAIL PAGE - PIXELPERFECT
// ========================================
// Individual guide display component
// Renders guide content based on guide ID
// Production-ready, mobile-responsive

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// Import guide content components
import QuickStartGuide from '../guides/QuickStartGuide';
import NodeIntegrationGuide from '../guides/NodeIntegrationGuide';
import PythonIntegrationGuide from '../guides/PythonIntegrationGuide';
import BatchProcessingGuide from '../guides/BatchProcessingGuide';
import JavaScriptExecutionGuide from '../guides/JavaScriptExecutionGuide';
import OptimizationGuide from '../guides/OptimizationGuide';
import WebsiteMonitorGuide from '../guides/WebsiteMonitorGuide';
import SocialMediaPreviewGuide from '../guides/SocialMediaPreviewGuide';
import ErrorsAndSolutionsGuide from '../guides/ErrorsAndSolutionsGuide';

const GuideDetail = () => {
  const navigate = useNavigate();
  const { guideId } = useParams();

  // Map guide IDs to components
  const guideComponents = {
    '1': QuickStartGuide,
    '2': NodeIntegrationGuide,
    '3': PythonIntegrationGuide,
    '4': BatchProcessingGuide,
    '5': JavaScriptExecutionGuide,
    '6': OptimizationGuide,
    '7': WebsiteMonitorGuide,
    '8': SocialMediaPreviewGuide,
    '9': ErrorsAndSolutionsGuide,
  };

  // Get guide metadata
  const guideMetadata = {
    '1': { title: 'Quick Start Guide', category: 'Getting Started', level: 'Beginner', duration: '5 min read' },
    '2': { title: 'Integrating with Node.js', category: 'Integration', level: 'Intermediate', duration: '10 min read' },
    '3': { title: 'Python Integration Guide', category: 'Integration', level: 'Intermediate', duration: '10 min read' },
    '4': { title: 'Batch Screenshot Processing', category: 'Advanced', level: 'Advanced', duration: '15 min read' },
    '5': { title: 'Custom JavaScript Execution', category: 'Advanced', level: 'Advanced', duration: '12 min read' },
    '6': { title: 'Optimization Best Practices', category: 'Best Practices', level: 'Intermediate', duration: '8 min read' },
    '7': { title: 'Building a Website Monitor', category: 'Use Cases', level: 'Advanced', duration: '20 min read' },
    '8': { title: 'Social Media Preview Generator', category: 'Use Cases', level: 'Intermediate', duration: '15 min read' },
    '9': { title: 'Common Errors and Solutions', category: 'Troubleshooting', level: 'Beginner', duration: '10 min read' },
  };

  const GuideComponent = guideComponents[guideId];
  const metadata = guideMetadata[guideId];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [guideId]);

  // 404 if guide not found
  if (!GuideComponent || !metadata) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <p className="text-gray-600 mb-8">The guide you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/guides')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            ← Back to Guides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo 
                size={window.innerWidth < 640 ? 32 : 40} 
                showText={true} 
              />
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/guides')} className="text-gray-600 hover:text-gray-900 font-medium">
                All Guides
              </button>
              <button onClick={() => navigate('/docs')} className="text-gray-600 hover:text-gray-900 font-medium">
                Documentation
              </button>
              <button onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Guide Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/guides')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Guides
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              metadata.level === 'Beginner' ? 'bg-green-100 text-green-700' :
              metadata.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {metadata.level}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{metadata.duration}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{metadata.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {metadata.title}
          </h1>
        </div>
      </div>

      {/* Guide Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12">
          <GuideComponent />
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
          <p className="text-gray-700 mb-6">
            Sign up for a free account and start capturing pixel-perfect screenshots today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/docs')}
              className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            >
              Read Full Documentation
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between pt-8 border-t border-gray-200">
          <button
            onClick={() => navigate('/guides')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Guides
          </button>

          <button
            onClick={() => navigate('/help')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Need Help? →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
              <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button>
              <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuideDetail;