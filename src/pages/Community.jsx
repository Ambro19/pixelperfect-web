// ========================================
// COMMUNITY PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/Community.jsx
// Author: OneTechly
// Created: July 2026
//
// Community hub page — replaces the broken community.pixelperfapi.net link
// that was returning DNS_PROBE_FINISHED_NXDOMAIN.
// The /community route now renders this page instead of hitting a missing subdomain.
//
// TO FIX THE HELP CENTER LINK:
//   In frontend/src/pages/HelpCenter.js, find the "Join Community" button/link
//   and change its href or onClick to navigate to '/community' instead of
//   'https://community.pixelperfapi.net'.
//   Example: onClick={() => navigate('/community')}
// ========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const CHANNELS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
    color:       'bg-blue-600',
    hoverColor:  'hover:bg-blue-700',
    textColor:   'text-white',
    borderColor: 'border-blue-600',
    label:       'Facebook Community',
    description: 'Join our Facebook page to stay updated on new features, releases, and developer tips from the PixelPerfect team.',
    cta:         'Join on Facebook →',
    href:        'https://www.facebook.com/profile.php?id=61590549488593',
    external:    true,
    badge:       'Primary',
    badgeColor:  'bg-blue-100 text-blue-700',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
      </svg>
    ),
    color:       'bg-gray-900',
    hoverColor:  'hover:bg-gray-800',
    textColor:   'text-white',
    borderColor: 'border-gray-900',
    label:       'GitHub',
    description: 'Browse the public repository, open issues, follow releases, and see what\'s being built next.',
    cta:         'View on GitHub →',
    href:        'https://github.com/Ambro19',
    external:    true,
    badge:       'Developers',
    badgeColor:  'bg-gray-100 text-gray-700',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color:       'bg-blue-700',
    hoverColor:  'hover:bg-blue-800',
    textColor:   'text-white',
    borderColor: 'border-blue-700',
    label:       'LinkedIn',
    description: 'Connect professionally, follow OneTechly updates, and stay informed about product announcements.',
    cta:         'Connect on LinkedIn →',
    href:        'https://www.linkedin.com/in/ambroise-lumanikio-b94578319/',
    external:    true,
    badge:       'Professional',
    badgeColor:  'bg-blue-100 text-blue-700',
  },
  {
    icon: <span className="text-3xl">✍️</span>,
    color:       'bg-orange-500',
    hoverColor:  'hover:bg-orange-600',
    textColor:   'text-white',
    borderColor: 'border-orange-500',
    label:       'OneTechly Blog',
    description: 'Developer insights, engineering deep-dives, and real-world articles from the team behind PixelPerfect.',
    cta:         'Read the Blog →',
    href:        null,
    route:       '/blog',
    external:    false,
    badge:       'Articles',
    badgeColor:  'bg-orange-100 text-orange-700',
  },
];

export default function Community() {
  const navigate = useNavigate();

  const handleChannelClick = (channel) => {
    if (channel.external && channel.href) {
      window.open(channel.href, '_blank', 'noopener,noreferrer');
    } else if (channel.route) {
      navigate(channel.route);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')}    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5">Sign in</button>
              <button onClick={() => navigate('/register')} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-5">💬</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Join the Community
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Connect with developers using PixelPerfect, follow product updates, and
            share how you're using the API in your own projects.
          </p>
        </div>
      </section>

      {/* Channel cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CHANNELS.map((ch) => (
            <div
              key={ch.label}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${ch.color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                  {ch.icon}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ch.badgeColor}`}>
                  {ch.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{ch.label}</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                {ch.description}
              </p>
              <button
                onClick={() => handleChannelClick(ch)}
                className={`w-full py-2.5 px-4 ${ch.color} ${ch.hoverColor} ${ch.textColor} rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2`}
              >
                {ch.cta}
                {ch.external && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Direct support CTA */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Need direct support?</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            For technical issues, billing questions, or API help — our support team
            responds to every message through the contact form.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/help')}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Browse Help Center
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <PixelPerfectLogo size={28} showText={true} textColor="text-white" />
              <div className="text-xs text-gray-400">© 2026 OneTechly, LLC. All rights reserved.</div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-gray-400">
              <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => navigate('/terms')}   className="hover:text-white transition-colors">Terms</button>
              <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button>
              <button onClick={() => navigate('/')}        className="hover:text-white transition-colors">Home</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===== END OF Community.jsx =====
