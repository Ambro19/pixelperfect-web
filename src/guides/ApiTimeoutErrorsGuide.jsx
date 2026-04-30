// ========================================
// API TIMEOUT ERRORS GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/ApiTimeoutErrorsGuide.jsx
// Author: OneTechly
// Update: April 29, 2026
//
// ✅ FIX (Apr 29, 2026): The 120-Second Budget phase table was rendering
//    as a plain text block. Replaced with a styled dark code block matching
//    the design of the "Step 3: Strip heavy elements" section (and every
//    other code block in the codebase). The content is identical — only the
//    presentation changed.
// ========================================

import React from 'react';

const ApiTimeoutErrorsGuide = () => {
  return (
    <div className="prose prose-blue max-w-none">
      {/* What you'll learn callout */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-1">What you'll learn</h3>
            <p className="text-blue-800 text-sm mb-0">
              Why some screenshot requests time out, what 504 actually means in our system,
              and the practical playbook to mitigate timeouts. By the end you'll be able to
              identify which sites are at risk and pick the right strategy for each.
            </p>
          </div>
        </div>
      </div>

      {/* The 120s budget */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The 120-Second Budget</h2>
      <p className="text-gray-700 leading-relaxed">
        Every screenshot request has a hard 120-second budget. If the capture takes longer
        than that, the platform layer (in front of our application) terminates the request
        and returns a <strong>504 Gateway Timeout</strong>. This is a fixed constraint &mdash; we can't
        extend it per-request.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Inside that budget, the capture pipeline runs a three-phase wait strategy: it waits
        for the page to reach a quiet network state, then falls back to waiting for the DOM
        to be parsed, then falls back to waiting for the load event. Each phase has its own
        timeout:
      </p>

      {/* ✅ FIXED: dark code block, matches the rest of the guide */}
      <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono leading-relaxed">
{`Phase 1  networkidle   ──  wait_until="networkidle"   limit  30 s
Phase 2  domcontent    ──  wait_until="domcontentloaded"  limit  35 s
Phase 3  load          ──  wait_until="load"           limit  35 s
                                                       ─────────────
                                                 worst case  100 s
                                            platform hard cap  120 s`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        For most sites, phase 1 succeeds well under 30 seconds. For some sites, every
        phase runs to its limit and the request hits the ceiling. The next section covers
        why.
      </p>

      {/* The "always busy" problem */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The "Always Busy" Problem</h2>
      <p className="text-gray-700 leading-relaxed">
        Some sites are written in a way that keeps the browser's network activity open
        indefinitely. Common culprits include:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">&bull;</span>
          <span><strong>Long-polling connections</strong> for chat, notifications, or live updates that never naturally close</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">&bull;</span>
          <span><strong>Analytics scripts that beacon continuously</strong> &mdash; some heavyweight analytics platforms send a steady stream of events</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">&bull;</span>
          <span><strong>WebSockets that stay open</strong> for real-time features (multiplayer games, collaboration tools, financial dashboards)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">&bull;</span>
          <span><strong>Auto-refreshing widgets</strong> that fetch new content every few seconds</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-500 font-bold mt-0.5">&bull;</span>
          <span><strong>Embedded video players</strong> that prefetch chunks aggressively</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        From the browser's perspective, the page is "still loading" because data is still
        coming in. Phase 1 (<code className="font-mono">networkidle</code>) waits for a quiet network and never
        gets one. Phase 2 and 3 are smarter (they don't depend on quiet network), but on
        heavy pages they can also reach their limits before the page fully renders.
      </p>

      {/* Quick diagnosis */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quick Diagnosis</h2>
      <p className="text-gray-700 leading-relaxed">Before changing your code, figure out which case you're in:</p>

      <div className="space-y-3 my-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Case 1: It's a one-time hiccup</h4>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Test:</strong> retry the same request 30 seconds later. If it succeeds, you hit a transient
            slowdown &mdash; could be temporary congestion on the target site, a slow CDN edge, or a blip on
            our infrastructure. No code changes needed.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Case 2: This URL always times out</h4>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Test:</strong> retry the same request 3&ndash;4 times spread over a few minutes. If it
            consistently fails, the URL itself is the problem &mdash; it falls into the "always busy"
            category above. Apply the mitigation playbook below.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Case 3: Some URLs in a batch time out, others don't</h4>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Test:</strong> isolate the failing URLs and retry them individually. If individual
            retries succeed, you're hitting concurrency pressure &mdash; the batch is saturating
            our Chromium pool. Reduce your batch concurrency or spread requests over time.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Case 4: All requests are timing out suddenly</h4>
          <p className="text-sm text-gray-700 mb-0">
            <strong>Test:</strong> check{' '}
            <a href="/api-status" className="text-blue-600 hover:underline">pixelperfectapi.net/api-status</a> for
            an active incident. Infrastructure-wide timeouts are usually caught and posted within a few
            minutes. If the status page is green and you're still seeing 504s, email us.
          </p>
        </div>
      </div>

      {/* Mitigation playbook */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Mitigation Playbook</h2>
      <p className="text-gray-700 leading-relaxed">
        These steps are ordered by impact &mdash; try the cheapest option first.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 1: Add a capture delay</h3>
      <p className="text-gray-700 leading-relaxed">
        Give the page extra time to settle after the DOM events fire. This helps with pages that
        lazy-load content right after the load event:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "delay": 3000       // wait 3 s after page events before capturing
}`}
        </pre>
      </div>
      <p className="text-gray-700 text-sm mt-2">
        Start at 2&ndash;3 seconds. Going above 8&ndash;10 seconds rarely helps further and eats into
        your 120-second budget.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 2: Reduce viewport size</h3>
      <p className="text-gray-700 leading-relaxed">
        Smaller viewports can reduce the number of off-screen resources the page pre-fetches:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "width": 1280,
  "height": 800       // drop from 1920×1080 default
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 3: Strip heavy elements with <code className="font-mono text-base">remove_elements</code></h3>
      <p className="text-gray-700 leading-relaxed">
        CSS-selector list of elements to remove before capture. Removes ad iframes, live chat
        widgets, and video players that are keeping the network busy:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "remove_elements": [
    "#live-chat-widget",
    ".ad-container",
    "iframe[src*='youtube']",
    "[data-testid='video-player']"
  ]
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 4: Switch to a lighter output format</h3>
      <p className="text-gray-700 leading-relaxed">
        PNG is the default. For large pages, switching to JPEG reduces the post-capture
        encoding work and slightly lowers the chance of hitting the time ceiling:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`{
  "url": "https://example.com",
  "format": "jpeg",
  "quality": 85       // 80–90 is the sweet spot for size vs clarity
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 5: Implement retry logic on your side</h3>
      <p className="text-gray-700 leading-relaxed">
        Even after applying the above, some pages will occasionally time out due to
        transient load on the target server. A simple exponential-backoff retry loop
        handles this:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// Node.js example
async function captureWithRetry(params, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot', {
        method: 'POST',
        headers: { 'X-API-Key': process.env.PIXELPERFECT_API_KEY,
                   'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.status === 504 && attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, attempt * 2000)); // 2 s, 4 s
        continue;
      }
      return res;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await new Promise(r => setTimeout(r, attempt * 2000));
    }
  }
}`}
        </pre>
      </div>

      {/* Anti-patterns */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Anti-Patterns (Things That Won't Help)</h2>
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-1 text-sm">"I'll just set a very long delay"</h4>
          <p className="text-sm text-red-800 mb-0">
            Delays above 8&ndash;10 seconds consume your 120-second budget without helping. If the page
            is "always busy," no delay will fix it &mdash; the network activity never stops. Use
            <code className="font-mono"> remove_elements</code> instead to stop the source.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-1 text-sm">"I'll fire the same request 10 times in parallel"</h4>
          <p className="text-sm text-red-800 mb-0">
            Parallel retries saturate your concurrent-capture allocation (2&ndash;5 slots depending on
            tier) and will cause 429 errors on top of the 504s. Retry sequentially with backoff.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-1 text-sm">"I'll set full_page: true to get more content"</h4>
          <p className="text-sm text-red-800 mb-0">
            Full-page screenshots capture the entire scrollable document and take proportionally
            longer to render and encode. On an already-slow page, enabling <code className="font-mono">full_page</code> can
            push it over the 120-second limit. Disable it when troubleshooting timeouts.
          </p>
        </div>
      </div>

      {/* Batch timeouts */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Timeouts in Batch Jobs</h2>
      <p className="text-gray-700 leading-relaxed">
        Batch jobs are processed differently from single-URL requests. Individual URLs within
        a job have their own 120-second budget, but the job itself doesn't fail if one URL
        times out &mdash; it records a <code className="font-mono">failed</code> status for that item and continues
        processing the rest.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        After polling the job to completion, check <code className="font-mono">items[n].status</code>:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// Poll result — partial success example (documented Apr 14 incident)
{
  "status": "completed",
  "total": 6,
  "completed": 4,
  "failed": 2,          // ← 2 URLs timed out
  "items": [
    { "idx": 0, "status": "completed", "url": "..." },
    { "idx": 1, "status": "failed",    "url": "...", "message": "504 timeout" },
    ...
  ]
}`}
        </pre>
      </div>
      <p className="text-gray-700 leading-relaxed mt-3">
        Collect the failed URLs and retry them as a smaller batch or individually with the
        mitigation parameters above. This is documented behaviour &mdash; partial success is
        preferable to failing the entire job when a subset of URLs are always-busy pages.
      </p>

      {/* Infrastructure note */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Infrastructure note</h4>
            <p className="text-yellow-800 text-sm mb-0">
              We run Playwright on Render's infrastructure. The current plan allocates 512 MB RAM
              per Chromium instance. Memory-constrained instances have less headroom for heavy pages,
              which can increase timeout frequency on very large or JavaScript-heavy sites. Upgrading
              the Render plan is on the roadmap &mdash; this constraint will improve as the service scales.
            </p>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>
      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/common-error-codes"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Common Error Codes</h4>
            <p className="text-sm text-blue-700 mb-0">Complete reference for every HTTP status code our API returns</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="/help/article/batch-processing-guide"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Batch Processing Guide</h4>
            <p className="text-sm text-green-700 mb-0">How to handle partial failures and retry failed items in batch jobs</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="/help/article/screenshot-quality-issues"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Screenshot Quality Issues</h4>
            <p className="text-sm text-purple-700 mb-0">Fix blurry, cut-off, or otherwise incorrect screenshots</p>
          </div>
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Success footer */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-8 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Timeouts demystified ⏱️</h4>
            <p className="text-green-800 text-sm mb-0">
              You understand the 120-second budget, the three-phase wait strategy, and why
              "always busy" pages cause chronic timeouts. The mitigation playbook (delay →
              viewport → remove_elements → format → retry) gives you five escalating levers
              to pull. For batch jobs, partial success is expected and recoverable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTimeoutErrorsGuide;

//===== END OF ApiTimeoutErrorsGuide.JSX =====

// =============================================================================
// // ========================================
// // API TIMEOUT ERRORS GUIDE - PIXELPERFECT
// // ========================================
// // File: frontend/src/guides/ApiTimeoutErrorsGuide.jsx
// // Author: OneTechly
// // Update: April 27, 2026
// //
// // Article #24 in "Troubleshooting" category
// // (Slug: api-timeout-errors in helpArticles.js)
// //
// // Verified facts (from OTSR v4 + screenshot_service.py):
// //   - Render Request Timeout: 120 seconds
// //   - Playwright fallback chain (worst case 100s):
// //     networkidle 30s → domcontentloaded 35s → load 35s = 100s
// //   - The "gnu.org-class" problem: pages with aggressive JavaScript that
// //     keep network activity open indefinitely. Real example documented.
// //   - Render free tier (512 MB RAM) constrains Playwright's Chromium
// //     instance, reducing resilience on heavy pages.
// //   - Batch jobs return partial success (4/6 succeeded, 2 timed out is the
// //     documented April 14 example).
// //
// // Tone: confident about the constraint, not apologetic. This is an
// // infrastructure constraint, not a bug. The article explains the mental
// // model and gives a real mitigation playbook.
// // ========================================

// import React from 'react';

// const ApiTimeoutErrorsGuide = () => {
//   return (
//     <div className="prose prose-blue max-w-none">
//       {/* What you'll learn callout */}
//       <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h3 className="text-lg font-semibold text-blue-900 mt-0 mb-1">What you'll learn</h3>
//             <p className="text-blue-800 text-sm mb-0">
//               Why some screenshot requests time out, what 504 actually means in our system,
//               and the practical playbook to mitigate timeouts. By the end you'll be able to
//               identify which sites are at risk and pick the right strategy for each.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* The 120s budget */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The 120-Second Budget</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Every screenshot request has a hard 120-second budget. If the capture takes longer
//         than that, the platform layer (in front of our application) terminates the request
//         and returns a 504 Gateway Timeout. This is a fixed constraint &mdash; we can't extend it
//         per-request.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         Inside that budget, the capture pipeline runs a three-phase wait strategy: it waits
//         for the page to reach a quiet network state, then falls back to waiting for the DOM
//         to be parsed, then falls back to waiting for the load event. Each phase has its own
//         timeout:
//       </p>

//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-4">
//         <pre className="text-gray-700 text-sm font-mono whitespace-pre-wrap">
// {`Phase 1 (preferred):  networkidle        ── 30 seconds
// Phase 2 (fallback):   domcontentloaded   ── 35 seconds
// Phase 3 (last try):   load               ── 35 seconds
//                                             ─────────
//                       Worst case total:    100 seconds
//                       Plus screenshot:    +20 seconds
//                                             ─────────
//                       Hard ceiling:        120 seconds`}
//         </pre>
//       </div>

//       <p className="text-gray-700 leading-relaxed">
//         For most sites, phase 1 succeeds well under 30 seconds. For some sites, every phase
//         runs to its limit and the request hits the ceiling. The next section covers why.
//       </p>

//       {/* The gnu.org-class problem */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The "Always Busy" Problem</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Some sites are written in a way that keeps the browser's network activity open
//         indefinitely. Common culprits include:
//       </p>
//       <ul className="space-y-2 mt-3 text-gray-700">
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Long-polling connections</strong> for chat, notifications, or live updates that never naturally close</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Analytics scripts that beacon continuously</strong> &mdash; some heavyweight analytics platforms send a steady stream of events</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>WebSockets that stay open</strong> for real-time features (multiplayer games, collaboration tools, financial dashboards)</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Auto-refreshing widgets</strong> that fetch new content every few seconds</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span><strong>Embedded video players</strong> that prefetch chunks aggressively</span>
//         </li>
//       </ul>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         From the browser's perspective, the page is "still loading" because data is still
//         coming in. Phase 1 (networkidle) waits for a quiet network and never gets one. Phase
//         2 and 3 are smarter (they don't depend on quiet network), but on heavy pages they
//         can also reach their limits before the page fully renders.
//       </p>

//       {/* How to identify the issue */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quick Diagnosis</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Before changing your code, figure out which case you're in:
//       </p>

//       <div className="space-y-4 my-6">
//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">Case 1: It's a one-time hiccup</h4>
//           <p className="text-sm text-gray-700">
//             <strong>Test:</strong> retry the same request 30 seconds later. If it succeeds,
//             you hit a transient slowdown &mdash; could be temporary congestion on the target
//             site, a slow CDN edge, or a blip on our infrastructure. No code changes needed.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">Case 2: This URL always times out</h4>
//           <p className="text-sm text-gray-700">
//             <strong>Test:</strong> retry the same request 3-4 times spread over a few
//             minutes. If it consistently fails, the URL itself is the problem &mdash; it falls
//             into the "always busy" category above. Apply the mitigation playbook below.
//           </p>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-5">
//           <h4 className="font-semibold text-gray-900 mb-2">Case 3: Many URLs are timing out at once</h4>
//           <p className="text-sm text-gray-700">
//             <strong>Test:</strong> try a small, well-known URL like <code className="font-mono">https://example.com</code>.
//             If even that times out, there's an active incident on our side &mdash; check our
//             status (when announced) or email{' '}
//             <a href="mailto:onetechly@gmail.com?subject=Widespread timeouts" className="text-blue-600 hover:underline">
//               onetechly@gmail.com
//             </a>.
//           </p>
//         </div>
//       </div>

//       {/* The mitigation playbook */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Mitigation Playbook</h2>
//       <p className="text-gray-700 leading-relaxed">
//         For URLs that consistently time out, try these in order. Most cases resolve at step 2
//         or 3.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 1: Reduce the viewport</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Smaller viewports render faster and use less memory. If you're capturing at 1920x1080
//         and timing out, try 1280x800. The visual difference is minor; the memory and render
//         savings can be significant.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 2: Drop full_page if you don't need it</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Full-page mode scrolls the entire page and stitches the result. On heavy pages this
//         can multiply the capture time. If you only need the visible viewport, set <code className="font-mono">"full_page": false</code>.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 3: Strip heavy elements with remove_elements</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Remove the elements that drive the network activity &mdash; live chat widgets, embedded
//         videos, social media embeds, analytics overlays. The page still loads, but the
//         elements that were keeping the network busy never render.
//       </p>

//       <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
//         <pre className="text-green-400 text-sm font-mono">
// {`{
//   "url": "https://example.com/heavy-page",
//   "width": 1280,
//   "height": 800,
//   "remove_elements": [
//     "iframe[src*='youtube']",
//     "iframe[src*='vimeo']",
//     ".intercom-launcher",
//     ".drift-widget",
//     "[data-analytics]"
//   ]
// }`}
//         </pre>
//       </div>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 4: Use batch jobs for resilience</h3>
//       <p className="text-gray-700 leading-relaxed">
//         Single-screenshot endpoints fail-fast on timeout. Batch jobs are different: each URL
//         in the batch is captured independently, and the job returns a partial result with
//         per-URL success/failure status. If one URL times out, the rest still complete.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         For workflows that capture many URLs (some of which may be flaky), batch jobs are
//         more resilient than firing single requests in a loop. See the{' '}
//         <a href="/help/article/batch-processing-guide" className="text-blue-600 hover:underline">
//           Batch Processing Guide
//         </a>.
//       </p>

//       <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step 5: Retry timed-out batch URLs</h3>
//       <p className="text-gray-700 leading-relaxed">
//         For batch jobs, the <code className="font-mono">retry_failed</code> endpoint
//         re-attempts only the URLs that failed. The retry preserves your original parameters
//         (viewport, format, etc.). Useful when you want to try again later when the target
//         site is less busy.
//       </p>

//       {/* Anti-patterns */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Doesn't Help</h2>
//       <p className="text-gray-700 leading-relaxed">
//         These approaches feel intuitive but don't actually fix timeouts:
//       </p>

//       <ul className="space-y-3 mt-4 text-gray-700">
//         <li>
//           <strong>Adding a longer delay parameter.</strong> The <code className="font-mono">delay</code>{' '}
//           parameter pauses <em>after</em> the page loads. If the page never reaches a loaded
//           state, delay doesn't help &mdash; we never get to the wait.
//         </li>
//         <li>
//           <strong>Retrying immediately on failure.</strong> If the URL is "always busy," the
//           retry will hit the same wall. Either change parameters before retrying, or wait
//           long enough that the target site might be in a different state.
//         </li>
//         <li>
//           <strong>Capturing at a higher resolution to "see more."</strong> Higher viewports
//           take more memory and longer to render. They make timeouts more likely, not less.
//         </li>
//         <li>
//           <strong>Splitting one URL into multiple requests.</strong> The same page is the same
//           page &mdash; capturing it twice doesn't make it faster.
//         </li>
//       </ul>

//       {/* Single vs batch decision */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Single Endpoint vs. Batch: When to Use Which</h2>

//       <div className="overflow-x-auto my-4">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b-2 border-gray-200">
//               <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Situation</th>
//               <th className="text-left p-3 font-semibold text-gray-900">Recommended approach</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Single URL, you trust it loads fast</td>
//               <td className="p-3">Single endpoint &mdash; fastest path</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Single URL, prone to timeouts</td>
//               <td className="p-3">Batch with one URL; queues the request and gives you partial-success semantics</td>
//             </tr>
//             <tr className="border-b border-gray-200">
//               <td className="p-3 border-r border-gray-200">Many URLs, all reliable</td>
//               <td className="p-3">Batch endpoint &mdash; one API call instead of many</td>
//             </tr>
//             <tr>
//               <td className="p-3 border-r border-gray-200">Many URLs, mixed reliability</td>
//               <td className="p-3">Batch endpoint, then <code className="font-mono">retry_failed</code> for stragglers</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* What if even batch fails? */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">"Even Batch Mode Times Out"</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Each URL in a batch still has the same 120-second budget &mdash; batch mode protects you
//         from cascading failures, but it doesn't change the per-URL ceiling. If a URL fails in
//         batch, applying steps 1-3 of the playbook above is still the right move.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         For URLs that consistently fail every approach, the honest answer is that the target
//         site exceeds what our current infrastructure can capture. Site-specific optimization
//         (or a future custom-JavaScript feature for advanced control) is on our roadmap. See
//         the <a href="/features" className="text-blue-600 hover:underline">Features page</a>{' '}
//         for current capabilities.
//       </p>

//       {/* Infrastructure constraints */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">A Note on Infrastructure</h2>
//       <p className="text-gray-700 leading-relaxed">
//         We currently run on a free-tier compute plan (512 MB RAM), which constrains the
//         headless browser's resilience on heavy pages. A planned plan upgrade will give the
//         browser more headroom and reduce timeouts on memory-heavy sites &mdash; though the 120s
//         ceiling is a platform-level constraint that's separate from the memory question.
//       </p>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         We mention this so you have an accurate mental model: timeouts on lightweight sites
//         usually mean the URL is in the "always busy" category. Timeouts on memory-heavy
//         sites (long pages with hundreds of images, complex SPAs) can also reflect our current
//         plan's memory ceiling.
//       </p>

//       {/* When to contact support */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Contact Support</h2>
//       <p className="text-gray-700 leading-relaxed">
//         Email us if any of these are true:
//       </p>
//       <ul className="space-y-2 mt-3 text-gray-700">
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>A simple URL like <code className="font-mono">https://example.com</code> times out (signals an incident on our side)</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>You've worked through the entire playbook above and the URL still times out, and you have a business need to capture it</span>
//         </li>
//         <li className="flex items-start gap-2">
//           <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
//           <span>You're on a paid tier and timeout rate is materially worse than what you're seeing on Free</span>
//         </li>
//       </ul>
//       <p className="text-gray-700 leading-relaxed mt-3">
//         Email <a href="mailto:onetechly@gmail.com?subject=Persistent timeouts" className="text-blue-600 hover:underline">onetechly@gmail.com</a> with: the URL, your full request body, the timestamp of the most recent timeout, and a brief description of what you've already tried from the playbook.
//       </p>

//       {/* Next Steps */}
//       <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>

//       <div className="grid grid-cols-1 gap-4">
//         <a
//           href="/help/article/batch-processing-guide"
//           className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-blue-900 mb-1">Batch Processing Guide</h4>
//             <p className="text-sm text-blue-700 mb-0">The resilient way to capture many URLs at once</p>
//           </div>
//           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/screenshot-quality-issues"
//           className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-green-900 mb-1">Screenshot Quality Issues</h4>
//             <p className="text-sm text-green-700 mb-0">When the request succeeds but the image isn't right</p>
//           </div>
//           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>

//         <a
//           href="/help/article/common-error-codes"
//           className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
//         >
//           <div>
//             <h4 className="font-semibold text-purple-900 mb-1">Common Error Codes</h4>
//             <p className="text-sm text-purple-700 mb-0">Other status codes you might encounter</p>
//           </div>
//           <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </a>
//       </div>

//       {/* Success footer */}
//       <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-8 rounded">
//         <div className="flex items-start gap-3">
//           <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Timeouts handled ⏱️</h4>
//             <p className="text-green-800 text-sm mb-0">
//               You know the 120-second budget, the three-phase fallback chain, the "always busy"
//               pattern, and the five-step playbook to mitigate timeouts. Most timeouts resolve
//               with a smaller viewport plus targeted <code className="font-mono">remove_elements</code>;
//               for the rest, batch mode keeps the failure isolated to a single URL.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApiTimeoutErrorsGuide;

// // ===== END OF ApiTimeoutErrorsGuide.jsx =====