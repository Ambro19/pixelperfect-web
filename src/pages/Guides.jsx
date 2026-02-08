// ========================================
// GUIDES PAGE - PIXELPERFECT
// ========================================
// Comprehensive integration guides and tutorials
// Production-ready, mobile-responsive
// ✅ FIXED: Added PixelPerfect logo (centered at top)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const Guides = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const guides = [
    {
      id: 1,
      category: 'getting-started',
      title: 'Quick Start Guide',
      description: 'Get up and running with PixelPerfect in under 5 minutes',
      duration: '5 min read',
      level: 'Beginner'
    },
    {
      id: 2,
      category: 'integration',
      title: 'Integrating with Node.js',
      description: 'Complete guide to using PixelPerfect in your Node.js applications',
      duration: '10 min read',
      level: 'Intermediate'
    },
    {
      id: 3,
      category: 'integration',
      title: 'Python Integration Guide',
      description: 'Step-by-step Python integration with code examples',
      duration: '10 min read',
      level: 'Intermediate'
    },
    {
      id: 4,
      category: 'advanced',
      title: 'Batch Screenshot Processing',
      description: 'Learn how to efficiently process multiple screenshots in parallel',
      duration: '15 min read',
      level: 'Advanced'
    },
    {
      id: 5,
      category: 'advanced',
      title: 'Custom JavaScript Execution',
      description: 'Execute custom scripts before capturing screenshots',
      duration: '12 min read',
      level: 'Advanced'
    },
    {
      id: 6,
      category: 'best-practices',
      title: 'Optimization Best Practices',
      description: 'Tips and tricks to get the best performance from our API',
      duration: '8 min read',
      level: 'Intermediate'
    },
    {
      id: 7,
      category: 'use-cases',
      title: 'Building a Website Monitor',
      description: 'Create a visual website monitoring system with PixelPerfect',
      duration: '20 min read',
      level: 'Advanced'
    },
    {
      id: 8,
      category: 'use-cases',
      title: 'Social Media Preview Generator',
      description: 'Automatically generate Open Graph images for your content',
      duration: '15 min read',
      level: 'Intermediate'
    },
    {
      id: 9,
      category: 'troubleshooting',
      title: 'Common Errors and Solutions',
      description: 'Troubleshoot common issues and error codes',
      duration: '10 min read',
      level: 'Beginner'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Guides', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'integration', name: 'Integration', icon: '🔌' },
    { id: 'advanced', name: 'Advanced', icon: '⚙️' },
    { id: 'use-cases', name: 'Use Cases', icon: '💡' },
    { id: 'best-practices', name: 'Best Practices', icon: '✨' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' }
  ];

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

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

      {/* Hero - ✅ WITH CENTERED LOGO */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* ✅ PixelPerfect Logo - Centered at top */}
          <div className="flex justify-center items-center mb-6">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Guides & Tutorials
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to integrate and optimize PixelPerfect for your use case
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer p-6"
              onClick={() => navigate(`/guides/${guide.id}`)}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  guide.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                  guide.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {guide.level}
                </span>
                <span className="text-sm text-gray-500">{guide.duration}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                Read guide →
              </div>
            </div>
          ))}
        </div>

        {/* Popular Topics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Authentication</h3>
              <p className="text-gray-700 mb-4">
                Learn how to securely authenticate your API requests and manage your API keys
              </p>
              <button
                onClick={() => navigate('/docs#authentication')}
                className="text-blue-600 font-semibold hover:underline"
              >
                View Documentation →
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Rate Limiting</h3>
              <p className="text-gray-700 mb-4">
                Understand our rate limits and how to optimize your API usage
              </p>
              <button
                onClick={() => navigate('/docs#rate-limits')}
                className="text-green-600 font-semibold hover:underline"
              >
                View Documentation →
              </button>
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="mb-16 bg-gray-900 rounded-2xl p-8 sm:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Video Tutorials Coming Soon</h2>
            <p className="text-gray-300">
              We're creating video tutorials to make integration even easier
            </p>
          </div>
          <div className="flex justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100">
              Notify Me
            </button>
          </div>
        </section>

        {/* Need Help CTA */}
        <section className="text-center bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you get the most out of PixelPerfect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/help')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Visit Help Center
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            >
              Contact Support
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

export default Guides;

/////////////////////////////////////////////////////////////
// // ========================================
// // GUIDES PAGE - PIXELPERFECT
// // ========================================
// // Comprehensive integration guides and tutorials
// // Production-ready, mobile-responsive

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// const Guides = () => {
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   const guides = [
//     {
//       id: 1,
//       category: 'getting-started',
//       title: 'Quick Start Guide',
//       description: 'Get up and running with PixelPerfect in under 5 minutes',
//       duration: '5 min read',
//       level: 'Beginner'
//     },
//     {
//       id: 2,
//       category: 'integration',
//       title: 'Integrating with Node.js',
//       description: 'Complete guide to using PixelPerfect in your Node.js applications',
//       duration: '10 min read',
//       level: 'Intermediate'
//     },
//     {
//       id: 3,
//       category: 'integration',
//       title: 'Python Integration Guide',
//       description: 'Step-by-step Python integration with code examples',
//       duration: '10 min read',
//       level: 'Intermediate'
//     },
//     {
//       id: 4,
//       category: 'advanced',
//       title: 'Batch Screenshot Processing',
//       description: 'Learn how to efficiently process multiple screenshots in parallel',
//       duration: '15 min read',
//       level: 'Advanced'
//     },
//     {
//       id: 5,
//       category: 'advanced',
//       title: 'Custom JavaScript Execution',
//       description: 'Execute custom scripts before capturing screenshots',
//       duration: '12 min read',
//       level: 'Advanced'
//     },
//     {
//       id: 6,
//       category: 'best-practices',
//       title: 'Optimization Best Practices',
//       description: 'Tips and tricks to get the best performance from our API',
//       duration: '8 min read',
//       level: 'Intermediate'
//     },
//     {
//       id: 7,
//       category: 'use-cases',
//       title: 'Building a Website Monitor',
//       description: 'Create a visual website monitoring system with PixelPerfect',
//       duration: '20 min read',
//       level: 'Advanced'
//     },
//     {
//       id: 8,
//       category: 'use-cases',
//       title: 'Social Media Preview Generator',
//       description: 'Automatically generate Open Graph images for your content',
//       duration: '15 min read',
//       level: 'Intermediate'
//     },
//     {
//       id: 9,
//       category: 'troubleshooting',
//       title: 'Common Errors and Solutions',
//       description: 'Troubleshoot common issues and error codes',
//       duration: '10 min read',
//       level: 'Beginner'
//     }
//   ];

//   const categories = [
//     { id: 'all', name: 'All Guides', icon: '📚' },
//     { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
//     { id: 'integration', name: 'Integration', icon: '🔌' },
//     { id: 'advanced', name: 'Advanced', icon: '⚙️' },
//     { id: 'use-cases', name: 'Use Cases', icon: '💡' },
//     { id: 'best-practices', name: 'Best Practices', icon: '✨' },
//     { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' }
//   ];

//   const filteredGuides = selectedCategory === 'all' 
//     ? guides 
//     : guides.filter(guide => guide.category === selectedCategory);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo 
//                 size={window.innerWidth < 640 ? 32 : 40} 
//                 showText={true} 
//               />
//             </div>
            
//             <nav className="hidden md:flex items-center gap-6">
//               <button onClick={() => navigate('/docs')} className="text-gray-600 hover:text-gray-900 font-medium">
//                 Documentation
//               </button>
//               <button onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-gray-900 font-medium">
//                 Pricing
//               </button>
//             </nav>

//             <div className="flex items-center gap-2 sm:gap-3">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
//               >
//                 Sign in
//               </button>
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
//             Guides & Tutorials
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
//             Learn how to integrate and optimize PixelPerfect for your use case
//           </p>
//         </div>
//       </section>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
//         {/* Category Filter */}
//         <div className="mb-12">
//           <div className="flex flex-wrap gap-3 justify-center">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   selectedCategory === category.id
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600'
//                 }`}
//               >
//                 <span className="mr-2">{category.icon}</span>
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Guides Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
//           {filteredGuides.map((guide) => (
//             <div
//               key={guide.id}
//               className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer p-6"
//               onClick={() => navigate(`/guides/${guide.id}`)}
//             >
//               <div className="flex items-center gap-2 mb-3">
//                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                   guide.level === 'Beginner' ? 'bg-green-100 text-green-700' :
//                   guide.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
//                   'bg-purple-100 text-purple-700'
//                 }`}>
//                   {guide.level}
//                 </span>
//                 <span className="text-sm text-gray-500">{guide.duration}</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
//               <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
//               <div className="flex items-center text-blue-600 font-medium text-sm">
//                 Read guide →
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Popular Topics */}
//         <section className="mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Topics</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
//               <h3 className="text-2xl font-semibold text-gray-900 mb-3">Authentication</h3>
//               <p className="text-gray-700 mb-4">
//                 Learn how to securely authenticate your API requests and manage your API keys
//               </p>
//               <button
//                 onClick={() => navigate('/docs#authentication')}
//                 className="text-blue-600 font-semibold hover:underline"
//               >
//                 View Documentation →
//               </button>
//             </div>

//             <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
//               <h3 className="text-2xl font-semibold text-gray-900 mb-3">Rate Limiting</h3>
//               <p className="text-gray-700 mb-4">
//                 Understand our rate limits and how to optimize your API usage
//               </p>
//               <button
//                 onClick={() => navigate('/docs#rate-limits')}
//                 className="text-green-600 font-semibold hover:underline"
//               >
//                 View Documentation →
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Video Tutorials */}
//         <section className="mb-16 bg-gray-900 rounded-2xl p-8 sm:p-12 text-white">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold mb-4">Video Tutorials Coming Soon</h2>
//             <p className="text-gray-300">
//               We're creating video tutorials to make integration even easier
//             </p>
//           </div>
//           <div className="flex justify-center">
//             <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100">
//               Notify Me
//             </button>
//           </div>
//         </section>

//         {/* Need Help CTA */}
//         <section className="text-center bg-blue-50 rounded-xl p-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Can't find what you're looking for?</h2>
//           <p className="text-gray-600 mb-6">
//             Our support team is here to help you get the most out of PixelPerfect
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => navigate('/help')}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//             >
//               Visit Help Center
//             </button>
//             <button
//               onClick={() => navigate('/contact')}
//               className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50"
//             >
//               Contact Support
//             </button>
//           </div>
//         </section>

//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
//               <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
//             </div>
//             <div className="flex gap-6 text-sm text-gray-400">
//               <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
//               <button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button>
//               <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Guides;