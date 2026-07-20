// ========================================
// CAREERS PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/Careers.jsx
// Author: OneTechly
// Created: July 2026
//
// ✅ FIX (July 2026 — Hero icon consistency):
//   Replaced the 🌱 "We're growing" emoji badge + h1 layout with the
//   PixelPerfectLogo centered above the title, matching every other
//   app page (ForgotPassword, Register, Community, DashboardPage, etc.).
//   Pattern: logo → h1 → subtitle → CTAs. No emoji above the title.
//   The inline badge is removed from the hero; the "We're growing"
//   signal is preserved inside the amber status card below.
//
// ✅ FIX (July 2026 — Tech stack completeness):
//   Added "Render" to the "What we're building" section tech stack list.
//   Render is where both the frontend (static site) and backend (Docker)
//   are hosted in production.
//
// Placeholder careers page — shown while OneTechly, LLC is pre-hiring.
// Replace this page with a full job listings component when ready to hire.
// ========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const PERKS = [
  { icon: '🌍', title: 'Remote-first',       desc: "Work from anywhere. We believe the best talent shouldn't be limited by geography." },
  { icon: '🚀', title: 'Early-stage impact', desc: 'Every person who joins early shapes the product, the culture, and the direction.' },
  { icon: '🛠️', title: 'Real engineering',   desc: 'We build production systems — Playwright, FastAPI, React, PostgreSQL, Stripe, Cloudflare, Render.' },
  { icon: '📈', title: 'Equity upside',       desc: 'Early employees participate in the growth they help create.' },
  { icon: '🎯', title: 'Direct ownership',    desc: 'No layers of management. You own your work end-to-end.' },
  { icon: '🤝', title: 'Builder culture',     desc: 'We ship things that work, document what we build, and improve constantly.' },
];

export default function Careers() {
  const navigate = useNavigate();

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

      {/* Hero — logo above title, matching ForgotPassword / Community pattern */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* ✅ FIX: PixelPerfectLogo replaces the 🌱 emoji badge — matches all other pages */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <PixelPerfectLogo size={64} showText={false} />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Come Build With Us
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            We're not actively hiring right now — but we're building something worth
            joining. When we grow the team, this is where we'll post first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Send us a message
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Explore PixelPerfect
            </button>
          </div>
        </div>
      </section>

      {/* Status card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">📋</div>
          <div>
            <h2 className="font-bold text-amber-900 text-lg mb-1">
              🌱 We're growing — no open positions right now
            </h2>
            <p className="text-amber-800 text-sm leading-relaxed">
              OneTechly, LLC is currently founder-led and pre-team. When we open our first
              roles — likely engineering, growth, or developer relations — they'll appear here.
              Follow us on{' '}
              <a
                href="https://www.linkedin.com/in/ambroise-lumanikio-b94578319/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-amber-900"
              >
                LinkedIn
              </a>{' '}
              or watch the{' '}
              <a
                href="https://github.com/Ambro19"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-amber-900"
              >
                GitHub
              </a>{' '}
              to stay in the loop.
            </p>
          </div>
        </div>
      </section>

      {/* Why join section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Why OneTechly?</h2>
        <p className="text-gray-500 text-center mb-10">
          What it means to build here — whenever you join.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PERKS.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The product — ✅ FIX: "Render" added to tech stack */}
      <section className="bg-gray-50 py-12 mt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What we're building</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            PixelPerfect Screenshot API is a developer tool for capturing high-fidelity
            website screenshots via a REST API — with Playwright, FastAPI, Stripe subscriptions,
            Cloudflare R2 storage, a React 18 dashboard, and hosted end-to-end on Render.
            It's live, production-ready, and growing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/docs')}
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              View API Docs
            </button>
            <a
              href="https://github.com/Ambro19"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Interested in the future?</h2>
          <p className="text-blue-100 mb-6 text-sm sm:text-base leading-relaxed">
            Send us a note through the contact form. We read every message and we'll reach
            out when a role that fits opens up.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
          >
            Get in touch →
          </button>
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

// ===== END OF Careers.jsx =====


// // ========================================
// // CAREERS PAGE - PIXELPERFECT
// // ========================================
// // File: frontend/src/pages/Careers.jsx
// // Author: OneTechly
// // Created: July 2026
// //
// // Placeholder careers page — shown while OneTechly, LLC is pre-hiring.
// // Replace this page with a full job listings component when ready to hire.
// // ========================================

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// const PERKS = [
//   { icon: '🌍', title: 'Remote-first',     desc: 'Work from anywhere. We believe the best talent shouldn\'t be limited by geography.' },
//   { icon: '🚀', title: 'Early-stage impact', desc: 'Every person who joins early shapes the product, the culture, and the direction.' },
//   { icon: '🛠️', title: 'Real engineering',  desc: 'We build production systems — Playwright, FastAPI, React, PostgreSQL, Stripe, Cloudflare.' },
//   { icon: '📈', title: 'Equity upside',     desc: 'Early employees participate in the growth they help create.' },
//   { icon: '🎯', title: 'Direct ownership',  desc: 'No layers of management. You own your work end-to-end.' },
//   { icon: '🤝', title: 'Builder culture',   desc: 'We ship things that work, document what we build, and improve constantly.' },
// ];

// export default function Careers() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-white">

//       {/* Header */}
//       <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>
//             <div className="flex items-center gap-3">
//               <button onClick={() => navigate('/login')}    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5">Sign in</button>
//               <button onClick={() => navigate('/register')} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Get Started</button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
//             🌱 We're growing
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
//             Come Build With Us
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
//             We're not actively hiring right now — but we're building something worth
//             joining. When we grow the team, this is where we'll post first.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <button
//               onClick={() => navigate('/contact')}
//               className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//             >
//               Send us a message
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
//             >
//               Explore PixelPerfect
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Status card */}
//       <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
//           <div className="text-3xl flex-shrink-0">📋</div>
//           <div>
//             <h2 className="font-bold text-amber-900 text-lg mb-1">No open positions right now</h2>
//             <p className="text-amber-800 text-sm leading-relaxed">
//               OneTechly, LLC is currently founder-led and pre-team. When we open our first
//               roles — likely engineering, growth, or developer relations — they'll appear here.
//               Follow us on{' '}
//               <a
//                 href="https://www.linkedin.com/in/ambroise-lumanikio-b94578319/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="font-semibold underline hover:text-amber-900"
//               >
//                 LinkedIn
//               </a>{' '}
//               or watch the{' '}
//               <a
//                 href="https://github.com/Ambro19"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="font-semibold underline hover:text-amber-900"
//               >
//                 GitHub
//               </a>{' '}
//               to stay in the loop.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Why join section */}
//       <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Why OneTechly?</h2>
//         <p className="text-gray-500 text-center mb-10">
//           What it means to build here — whenever you join.
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {PERKS.map(({ icon, title, desc }) => (
//             <div key={title} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
//               <div className="text-3xl mb-3">{icon}</div>
//               <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
//               <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* The product */}
//       <section className="bg-gray-50 py-12 mt-4">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">What we're building</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
//             PixelPerfect Screenshot API is a developer tool for capturing high-fidelity
//             website screenshots via a REST API — with Playwright, FastAPI, Stripe subscriptions,
//             Cloudflare R2 storage, and a React 18 dashboard. It's live, production-ready,
//             and growing.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <button
//               onClick={() => navigate('/docs')}
//               className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
//             >
//               View API Docs
//             </button>
//             <a
//               href="https://github.com/Ambro19"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="px-5 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm inline-flex items-center justify-center gap-2"
//             >
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//                 <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
//               </svg>
//               GitHub
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-blue-600 py-12">
//         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Interested in the future?</h2>
//           <p className="text-blue-100 mb-6 text-sm sm:text-base leading-relaxed">
//             Send us a note through the contact form. We read every message and we'll reach
//             out when a role that fits opens up.
//           </p>
//           <button
//             onClick={() => navigate('/contact')}
//             className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
//           >
//             Get in touch →
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="flex flex-col items-center md:items-start gap-1">
//               <PixelPerfectLogo size={28} showText={true} textColor="text-white" />
//               <div className="text-xs text-gray-400">© 2026 OneTechly, LLC. All rights reserved.</div>
//             </div>
//             <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-gray-400">
//               <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
//               <button onClick={() => navigate('/terms')}   className="hover:text-white transition-colors">Terms</button>
//               <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button>
//               <button onClick={() => navigate('/')}        className="hover:text-white transition-colors">Home</button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // ===== END OF Careers.jsx =====
