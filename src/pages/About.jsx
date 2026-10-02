// ========================================
// ABOUT PAGE - PIXELPERFECT
// ========================================
// File: frontend/src/pages/About.jsx
// Author: OneTechly
// Updated: October 2026
//
// ✅ FIX (Oct 2026 — unverifiable metrics removed from "By The Numbers"):
//   The page claimed 50M+ screenshots captured and 10K+ active users. Neither
//   is true: the product launched commercially in late July 2026 and the
//   largest account on record has taken ~600 captures. Published figures a
//   customer could later discover to be invented are a credibility problem
//   first and an FTC §5 / NY GBL §349 problem second — they are advertising
//   claims about a paid service, not marketing colour.
//
//   Replaced with four figures that are true today and verifiable from the
//   product itself: output formats, device presets, maximum capture width,
//   and the free-tier allowance. They are also more useful to the developer
//   actually evaluating the API than a user count would be.
//
// ✅ FIX (Oct 2026 — "99.9% Uptime SLA" → "99.9% uptime target"):
//   An SLA is a contractual commitment, normally with service credits owed
//   when it is missed. 99.9% permits 43 minutes of downtime per month. The
//   service runs on a single Render instance with no redundancy, so one
//   deploy, one restart, or one capture-engine incident (see OTSR v11 §2.2)
//   can spend that budget in a single afternoon — and there is no uptime
//   monitoring in place to measure it either way.
//
//   Stated as a target rather than an SLA, this is an honest engineering
//   goal. If you want to advertise an SLA later: add uptime monitoring,
//   collect 3–6 months of real data, then write the credit terms into the
//   Terms of Service and link them from here.
//
// ✅ FIX (Oct 2026 — "<3s Average Response" → honest range):
//   Captures observed in production this period ran 2.6s–20.6s, median ~5.5s;
//   a 1366px full-page capture of a job board took 8.5s. "Under 3 seconds" is
//   a best case, not an average. "Most captures in under 10 seconds" is true
//   and still competitive — and it will not generate a support ticket from a
//   customer timing their own requests.
//
// ✅ FIX (Oct 2026 — SOC 2 claim removed):
//   "SOC 2 compliant infrastructure" asserts a completed third-party audit
//   that does not exist. This is the single highest-risk sentence that was on
//   the page: enterprise buyers request the report, and stating it falsely
//   can void contracts. Replaced with the security measures actually in
//   place, which are real and worth stating.
//
// ✅ FIX (Oct 2026 — "multiple regions" → what is actually deployed):
//   Capture runs in one Render region. Cloudflare R2 + CDN genuinely does
//   deliver the finished images globally, so the delivery claim stays and the
//   multi-region capture claim goes.
//
// ✅ FIX (Oct 2026 — founding years corrected to 2024–2026):
//   Was "Founded in 2025–26". Development began in 2024; commercial launch
//   was 2026.
//
// ✅ FIX (Oct 2026 — "thousands of developers" / "millions of screenshots"):
//   Removed from Our Story, and "Join Thousands of Developers" from the CTA.
//   An early-stage product saying so plainly reads as confident; the same
//   product claiming a user base it does not have reads as desperate the
//   moment anyone checks.
//
// Previous updates (retained):
// ✅ Professional about page with centered logo
// ✅ Mobile-responsive design
// ✅ UPDATED: May 2026 — OneTechly → OneTechly, LLC in legal/company contexts
//    (DOS ID 7922759). Note: "OneTechly Team" quote attribution keeps the
//    brand name, not the legal entity.
// ========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

// ✅ NEW (Oct 2026): the figures in "By The Numbers", in one place.
//
// RULE FOR THIS ARRAY: every value must be checkable against the product in
// under a minute, by anyone, without access to your database. If a proposed
// figure needs a private dashboard to verify, it does not belong here.
//
//   formats        — SUPPORTED_FORMATS in services/screenshot_service.py
//   device presets — SUPPORTED_DEVICES in services/screenshot_service.py
//   max width      — TIER_MAX_WIDTH in routers/screenshot.py (paid tiers)
//   free tier      — FREE_SCREENSHOTS_LIMIT in .env
const STATS = [
  { value: '4',      label: 'Output formats',      detail: 'PNG, JPEG, WebP, PDF' },
  { value: '9',      label: 'Device presets',      detail: 'iPhone, Pixel, iPad, Galaxy' },
  { value: '3440px', label: 'Max capture width',   detail: 'Ultrawide supported' },
  { value: '100',    label: 'Free screenshots',    detail: 'Every month, no card' },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText={true} />
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/features')} className="text-gray-600 hover:text-gray-900 font-medium">Features</button>
              <button onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-gray-900 font-medium">Pricing</button>
              <button onClick={() => navigate('/docs')} className="text-gray-600 hover:text-gray-900 font-medium">Documentation</button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => navigate('/login')} className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Sign in</button>
              <button onClick={() => navigate('/register')} className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About PixelPerfect</h1>
          <p className="text-lg sm:text-xl text-gray-600">Building the most reliable screenshot API for developers worldwide</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-8">

          {/* Our Story — ✅ founding years and scale claims corrected (Oct 2026) */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PixelPerfect Screenshot API was born out of frustration with existing screenshot solutions
              that were either unreliable, too expensive, or lacked the features developers actually needed.
              Built between 2024 and 2026 by OneTechly, LLC, we set out to make the screenshot API we
              wished existed.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              What started as a side project to solve our own needs became a production service in 2026 —
              element-level capture, device emulation, batch jobs, webhooks, and a REST API that behaves
              the same way on the hundredth request as it did on the first. We're early, and we'd rather
              say so than pretend otherwise.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We're proud to be a developer-first company, building tools that we ourselves use daily.
              Every feature we ship is designed with real developer needs in mind, backed by our
              commitment to reliability, performance, and excellent documentation.
            </p>
          </section>

          {/* Our Mission — quote attr stays "OneTechly Team" (brand, not legal entity) */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our mission is simple: make website screenshot capture fast, reliable, and accessible to
              every developer. We believe that capturing pixel-perfect screenshots shouldn't require
              managing complex infrastructure, dealing with browser quirks, or paying enterprise prices.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 sm:p-6 rounded-r-lg">
              <p className="text-gray-800 font-medium text-lg">
                "We're building the screenshot API that just works, every single time."
              </p>
              <p className="text-gray-600 mt-2">— OneTechly Team</p>
            </div>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PixelPerfect provides a powerful, easy-to-use REST API for capturing screenshots of any
              website. Our service handles all the complexity of browser automation, rendering engines,
              and infrastructure management, so you can focus on building your product.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* ✅ FIX (Oct 2026): "under 3 seconds" was a best case, not a
                  typical one. Observed production captures ran 2.6s–20.6s. */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-2">Fast by Default</h3>
                <p className="text-sm text-gray-700">Most captures finish in under 10 seconds — simple pages in under 3</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Pixel Perfect</h3>
                <p className="text-sm text-gray-700">Every screenshot is rendered with precision, matching your exact specifications</p>
              </div>
              {/* ✅ FIX (Oct 2026): "99.9% uptime SLA" removed — an SLA is a
                  contractual promise, and there is no monitoring behind it. */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure by Design</h3>
                <p className="text-sm text-gray-700">TLS in transit, encrypted object storage, and API keys you can rotate at any time</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-semibold text-gray-900 mb-2">Developer First</h3>
                <p className="text-sm text-gray-700">Clear documentation, helpful support, and tools built for developers</p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Developer Experience First</h3>
                <p className="text-gray-700 leading-relaxed">
                  We obsess over making PixelPerfect easy to integrate and use. From our comprehensive
                  documentation to our intuitive API design, everything is built with developers in mind.
                </p>
              </div>
              {/* ✅ FIX (Oct 2026): was "We maintain a 99.9% SLA". Stated as the
                  engineering target it actually is, with the honest reason the
                  number is a goal rather than a guarantee. */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability Above All</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your applications depend on us, so we build for uptime and consistency. We target
                  99.9% availability and treat every capture failure as a defect worth tracing to its
                  root cause, not a number to absorb. When something does break, we'd rather tell you
                  what happened than quietly retry.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
                <p className="text-gray-700 leading-relaxed">
                  No hidden fees, no surprise charges. Our pricing is straightforward and scales with
                  your needs. You always know exactly what you're paying for.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuous Innovation</h3>
                <p className="text-gray-700 leading-relaxed">
                  We're constantly improving PixelPerfect based on user feedback and emerging needs.
                  New features, performance improvements, and enhanced capabilities are shipped regularly.
                </p>
              </div>
            </div>
          </section>

          {/* By The Numbers — ✅ REWRITTEN (Oct 2026). See STATS above. */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">By The Numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{s.value}</div>
                  <div className="text-sm sm:text-base font-medium text-gray-800">{s.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.detail}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-5 text-center">
              Capture speed depends on the page. Simple pages return in under 3 seconds; large
              full-page captures take longer.
            </p>
          </section>

          {/* Technology Stack — ✅ SOC 2 and multi-region claims corrected (Oct 2026) */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Technology</h2>
            <p className="text-gray-700 leading-relaxed mb-4">PixelPerfect is built on modern, proven technologies that ensure speed, reliability, and scalability:</p>
            <ul className="space-y-3">
              {[
                { label: 'Headless Chrome:', desc: 'Powered by Playwright for the most accurate web rendering' },
                { label: 'Cloud Infrastructure:', desc: 'Managed hosting with automated deploys and health checks' },
                { label: 'CDN Delivery:', desc: 'Screenshots stored in Cloudflare R2 and delivered over a global CDN' },
                { label: 'RESTful API:', desc: 'Simple, intuitive API design following industry best practices' },
                { label: 'Security First:', desc: 'TLS in transit, encryption at rest, and hashed API keys you can rotate at any time' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <div><span className="font-semibold text-gray-900">{item.label}</span><span className="text-gray-700"> {item.desc}</span></div>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact CTA — ✅ "Join Thousands of Developers" corrected (Oct 2026) */}
          <section className="border-t border-gray-200 pt-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 sm:p-8 text-white text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Start Capturing in Minutes</h2>
              <p className="text-blue-100 mb-6 text-sm sm:text-base">100 free screenshots every month. No credit card required.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigate('/register')} className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">Get Started Free</button>
                <button onClick={() => navigate('/contact')} className="px-6 sm:px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white">Contact Us</button>
              </div>
            </div>
          </section>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 font-medium">← Back to Home</button>
        </div>
      </main>

      {/* Footer — ✅ OneTechly, LLC */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
              <p className="text-xs text-gray-400 mt-2">© 2026 OneTechly, LLC. All rights reserved.</p>
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

export default About;

// ====== END OF About.jsx =====


// // ========================================
// // ABOUT PAGE - PIXELPERFECT
// // ========================================
// // ✅ PRODUCTION READY - February 2026
// // ✅ Professional about page with centered logo
// // ✅ Updated founding year to 2025-26
// // ✅ Mobile-responsive design
// // ✅ UPDATED: May 2026 — OneTechly → OneTechly, LLC in legal/company contexts (DOS ID 7922759)
// //             Note: "OneTechly Team" quote attribution keeps brand name (not legal entity)
// // ========================================

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';

// const About = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText={true} />
//             </div>
            
//             <nav className="hidden md:flex items-center gap-6">
//               <button onClick={() => navigate('/features')} className="text-gray-600 hover:text-gray-900 font-medium">Features</button>
//               <button onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-gray-900 font-medium">Pricing</button>
//               <button onClick={() => navigate('/docs')} className="text-gray-600 hover:text-gray-900 font-medium">Documentation</button>
//             </nav>

//             <div className="flex items-center gap-2 sm:gap-3">
//               <button onClick={() => navigate('/login')} className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Sign in</button>
//               <button onClick={() => navigate('/register')} className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Get Started</button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center mb-8">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About PixelPerfect</h1>
//           <p className="text-lg sm:text-xl text-gray-600">Building the most reliable screenshot API for developers worldwide</p>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
          
//           {/* Our Story — ✅ OneTechly, LLC */}
//           <section>
//             <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Story</h2>
//             <p className="text-gray-700 leading-relaxed mb-4">
//               PixelPerfect Screenshot API was born out of frustration with existing screenshot solutions 
//               that were either unreliable, too expensive, or lacked the features developers actually needed. 
//               Founded in 2025–26 by OneTechly, LLC, we set out to build the screenshot API we wished existed.
//             </p>
//             <p className="text-gray-700 leading-relaxed mb-4">
//               What started as a side project to solve our own needs quickly grew into a full-featured 
//               service trusted by thousands of developers and businesses worldwide. Today, PixelPerfect 
//               processes millions of screenshots monthly, powering everything from automated testing 
//               pipelines to marketing automation and competitive intelligence platforms.
//             </p>
//             <p className="text-gray-700 leading-relaxed">
//               We're proud to be a developer-first company, building tools that we ourselves use daily. 
//               Every feature we ship is designed with real developer needs in mind, backed by our 
//               commitment to reliability, performance, and excellent documentation.
//             </p>
//           </section>

//           {/* Our Mission — quote attr stays "OneTechly Team" (brand, not legal entity) */}
//           <section>
//             <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Mission</h2>
//             <p className="text-gray-700 leading-relaxed mb-4">
//               Our mission is simple: make website screenshot capture fast, reliable, and accessible to 
//               every developer. We believe that capturing pixel-perfect screenshots shouldn't require 
//               managing complex infrastructure, dealing with browser quirks, or paying enterprise prices.
//             </p>
//             <div className="bg-blue-50 border-l-4 border-blue-600 p-4 sm:p-6 rounded-r-lg">
//               <p className="text-gray-800 font-medium text-lg">
//                 "We're building the screenshot API that just works, every single time."
//               </p>
//               <p className="text-gray-600 mt-2">— OneTechly Team</p>
//             </div>
//           </section>

//           {/* What We Do */}
//           <section>
//             <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">What We Do</h2>
//             <p className="text-gray-700 leading-relaxed mb-4">
//               PixelPerfect provides a powerful, easy-to-use REST API for capturing screenshots of any 
//               website. Our service handles all the complexity of browser automation, rendering engines, 
//               and infrastructure management, so you can focus on building your product.
//             </p>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
//               <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg">
//                 <div className="text-3xl mb-3">⚡</div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
//                 <p className="text-sm text-gray-700">Capture screenshots in under 3 seconds with our optimized infrastructure</p>
//               </div>
//               <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg">
//                 <div className="text-3xl mb-3">🎯</div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Pixel Perfect</h3>
//                 <p className="text-sm text-gray-700">Every screenshot is rendered with precision, matching your exact specifications</p>
//               </div>
//               <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg">
//                 <div className="text-3xl mb-3">🔒</div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
//                 <p className="text-sm text-gray-700">Enterprise-grade security with 99.9% uptime SLA</p>
//               </div>
//               <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg">
//                 <div className="text-3xl mb-3">📚</div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Developer First</h3>
//                 <p className="text-sm text-gray-700">Clear documentation, helpful support, and tools built for developers</p>
//               </div>
//             </div>
//           </section>

//           {/* Our Values */}
//           <section>
//             <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Values</h2>
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Developer Experience First</h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   We obsess over making PixelPerfect easy to integrate and use. From our comprehensive 
//                   documentation to our intuitive API design, everything is built with developers in mind.
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability Above All</h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   Your applications depend on us, so we've built our infrastructure for maximum uptime 
//                   and consistency. We maintain a 99.9% SLA and continuously monitor our service to 
//                   catch issues before they impact you.
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   No hidden fees, no surprise charges. Our pricing is straightforward and scales with 
//                   your needs. You always know exactly what you're paying for.
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuous Innovation</h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   We're constantly improving PixelPerfect based on user feedback and emerging needs. 
//                   New features, performance improvements, and enhanced capabilities are shipped regularly.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* By The Numbers */}
//           <section>
//             <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">By The Numbers</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
//               <div className="text-center"><div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">50M+</div><div className="text-sm sm:text-base text-gray-600">Screenshots Captured</div></div>
//               <div className="text-center"><div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">10K+</div><div className="text-sm sm:text-base text-gray-600">Active Users</div></div>
//               <div className="text-center"><div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">99.9%</div><div className="text-sm sm:text-base text-gray-600">Uptime SLA</div></div>
//               <div className="text-center"><div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">&lt;3s</div><div className="text-sm sm:text-base text-gray-600">Average Response</div></div>
//             </div>
//           </section>

//           {/* Technology Stack */}
//           <section>
//             <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Our Technology</h2>
//             <p className="text-gray-700 leading-relaxed mb-4">PixelPerfect is built on modern, proven technologies that ensure speed, reliability, and scalability:</p>
//             <ul className="space-y-3">
//               {[
//                 { label: 'Headless Chrome:', desc: 'Powered by Playwright for the most accurate web rendering' },
//                 { label: 'Cloud Infrastructure:', desc: 'Distributed across multiple regions for low latency worldwide' },
//                 { label: 'CDN Delivery:', desc: 'Screenshots delivered via global CDN for maximum speed' },
//                 { label: 'RESTful API:', desc: 'Simple, intuitive API design following industry best practices' },
//                 { label: 'Security First:', desc: 'End-to-end encryption, SOC 2 compliant infrastructure' },
//               ].map((item, i) => (
//                 <li key={i} className="flex items-start gap-3">
//                   <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
//                   <div><span className="font-semibold text-gray-900">{item.label}</span><span className="text-gray-700"> {item.desc}</span></div>
//                 </li>
//               ))}
//             </ul>
//           </section>

//           {/* Contact CTA */}
//           <section className="border-t border-gray-200 pt-8">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 sm:p-8 text-white text-center">
//               <h2 className="text-2xl sm:text-3xl font-bold mb-3">Join Thousands of Developers</h2>
//               <p className="text-blue-100 mb-6 text-sm sm:text-base">Start capturing pixel-perfect screenshots today with our free tier</p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                 <button onClick={() => navigate('/register')} className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">Get Started Free</button>
//                 <button onClick={() => navigate('/contact')} className="px-6 sm:px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white">Contact Us</button>
//               </div>
//             </div>
//           </section>

//         </div>

//         <div className="mt-8 text-center">
//           <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 font-medium">← Back to Home</button>
//         </div>
//       </main>

//       {/* Footer — ✅ OneTechly, LLC */}
//       <footer className="bg-gray-900 text-white py-12 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
//               <p className="text-xs text-gray-400 mt-2">© 2026 OneTechly, LLC. All rights reserved.</p>
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

// export default About;
