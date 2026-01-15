// ========================================
// API STATUS PAGE - PIXELPERFECT
// ========================================
// Real-time API status and system health monitoring
// Production-ready, mobile-responsive

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const ApiStatus = () => {
  const navigate = useNavigate();

  // Mock data - in production, this would be fetched from your monitoring service
  const services = [
    { name: 'Screenshot API', status: 'operational', uptime: '99.97%' },
    { name: 'Batch Processing', status: 'operational', uptime: '99.95%' },
    { name: 'CDN Delivery', status: 'operational', uptime: '99.99%' },
    { name: 'API Authentication', status: 'operational', uptime: '99.98%' },
    { name: 'Webhook Notifications', status: 'operational', uptime: '99.96%' },
  ];

  const incidents = [
    {
      id: 1,
      date: 'Jan 10, 2026',
      title: 'Elevated API Response Times',
      status: 'Resolved',
      duration: '23 minutes',
      severity: 'minor'
    },
    {
      id: 2,
      date: 'Jan 3, 2026',
      title: 'Scheduled Maintenance',
      status: 'Completed',
      duration: '2 hours',
      severity: 'maintenance'
    },
    {
      id: 3,
      date: 'Dec 28, 2025',
      title: 'CDN Performance Degradation',
      status: 'Resolved',
      duration: '45 minutes',
      severity: 'minor'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'outage':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Current Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Systems Operational</h1>
          </div>
          <p className="text-gray-600 ml-7">
            All systems are running smoothly. Last checked: 2 minutes ago
          </p>
        </div>

        {/* Uptime Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Uptime (Last 90 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">99.97%</div>
              <div className="text-gray-600 text-sm">Overall Uptime</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2.1s</div>
              <div className="text-gray-600 text-sm">Avg Response Time</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600 text-sm">Incidents</div>
            </div>
          </div>
        </section>

        {/* Service Status */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Status</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {services.map((service, index) => (
                <div key={index} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500">90-day uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(service.status)}`}>
                    Operational
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{incident.title}</h3>
                    <p className="text-sm text-gray-500">{incident.date} • Duration: {incident.duration}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    incident.severity === 'minor' ? 'bg-yellow-100 text-yellow-700' :
                    incident.severity === 'maintenance' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {incident.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {incident.severity === 'maintenance' 
                    ? 'Scheduled maintenance was completed successfully with no service interruption.'
                    : 'The issue was identified and resolved quickly. All services returned to normal operation.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to receive email notifications about service updates and incidents
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <button
              onClick={() => navigate('/help')}
              className="text-blue-600 hover:underline"
            >
              Visit Help Center →
            </button>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
            <button
              onClick={() => navigate('/docs')}
              className="text-blue-600 hover:underline"
            >
              API Documentation →
            </button>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:underline"
            >
              Get in Touch →
            </button>
          </div>
        </section>

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

export default ApiStatus;