// ========================================
// WEBHOOK DELIVERY FAILURES GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/WebhookDeliveryFailuresGuide.jsx
// Author: OneTechly
// Update: April 27, 2026
//
// Article #25 in "Troubleshooting" category
// (Slug: webhook-delivery-failures in helpArticles.js)
//
// HONEST TREATMENT: Webhooks are a Coming Soon feature on the Features page.
// They are NOT in the active code path (active path is screenshot_endpoints.py
// and batch.py; webhook code lives in routers/screenshot.py which isn't wired
// up in main.py).
//
// This article does NOT pretend webhooks work today. Instead it:
//   1. Acknowledges webhooks as a roadmap feature
//   2. Documents the planned behavior (so when they ship, the article evolves)
//   3. Provides a complete polling-pattern alternative with working code
//   4. Routes interested users to the contact form's feature-request flow
//
// Same pattern we used for JavaScriptExecutionGuide.
//
// Verified facts used (for the polling-alternative code):
//   - Batch endpoints: /api/v1/batch/submit, /jobs, /jobs/{id}
//   - Job status values: pending, processing, completed, failed
//   - 2-second polling cadence is reasonable for our system
// ========================================

import React from 'react';

const WebhookDeliveryFailuresGuide = () => {
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
              Where webhooks stand on our roadmap, and the polling pattern you can use today
              while we finish them. By the end you'll have a working notification approach
              that doesn't require waiting for the webhooks feature to ship.
            </p>
          </div>
        </div>
      </div>

      {/* Honest status */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Status Today</h2>
      <p className="text-gray-700 leading-relaxed">
        Webhook delivery isn't yet available in the active API. We list webhooks on the{' '}
        <a href="/features" className="text-blue-600 hover:underline">Features page</a> as
        Coming Soon for that reason. If you're here because you're trying to debug webhook
        delivery failures &mdash; the honest answer is that there's no delivery happening yet, so
        there's nothing to debug.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        That said, this article is useful for two groups:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>People who need the <em>functional outcome</em> webhooks would provide (notification when a screenshot finishes) and want to use the polling pattern available today</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span>People building integrations who want to know what the webhook contract <em>will</em> look like when it ships, so they can design for it now</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        Both groups are addressed below.
      </p>

      {/* Get notified */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-5 my-6 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Want to be notified when webhooks ship?</h4>
            <p className="text-sm text-purple-800 mb-3">
              We're tracking interest as a signal for prioritization. Drop us a note and we'll
              email you the day webhooks go live, including the deployment notes and any
              integration tips.
            </p>
            <a
              href="/contact?subject=feature-request-webhooks"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm no-underline"
            >
              Get notified
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* The polling alternative */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Polling Pattern (Available Today)</h2>
      <p className="text-gray-700 leading-relaxed">
        For batch jobs, our API supports polling: submit the job, then check its status
        periodically until it completes. This is the pattern we recommend until webhooks
        ship, and it's actually robust enough that some teams keep using it even when
        webhooks are available.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">The pattern</h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-3">
        <ol className="space-y-2 text-sm text-gray-700 ml-5 list-decimal">
          <li>Submit a batch job &mdash; you get back a <code className="font-mono">job_id</code></li>
          <li>Poll <code className="font-mono">GET /api/v1/batch/jobs/{'{'}job_id{'}'}</code> every 2 seconds</li>
          <li>When status becomes <code className="font-mono">completed</code> or <code className="font-mono">failed</code>, stop polling</li>
          <li>Download the results from the URLs in the response</li>
        </ol>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Working example (Node.js)</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const API_BASE = 'https://api.pixelperfectapi.net/api/v1';
const API_KEY  = process.env.PIXELPERFECT_API_KEY;

async function captureBatchAndWait(urls) {
  // 1. Submit the batch job
  const submitResponse = await fetch(\`\${API_BASE}/batch/submit\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ urls, width: 1280, height: 800 }),
  });
  const { job_id } = await submitResponse.json();
  console.log(\`Job submitted: \${job_id}\`);

  // 2. Poll until done
  while (true) {
    await new Promise(r => setTimeout(r, 2000));

    const statusResponse = await fetch(
      \`\${API_BASE}/batch/jobs/\${job_id}\`,
      { headers: { 'Authorization': \`Bearer \${API_KEY}\` } }
    );
    const job = await statusResponse.json();

    console.log(
      \`Status: \${job.status} \` +
      \`(\${job.completed_count}/\${job.total_count})\`
    );

    if (job.status === 'completed' || job.status === 'failed') {
      return job;
    }
  }
}

// Usage
const result = await captureBatchAndWait([
  'https://example.com',
  'https://example.org',
]);

console.log('Done:', result.screenshots);`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Working example (Python)</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import os
import time
import requests

API_BASE = 'https://api.pixelperfectapi.net/api/v1'
API_KEY  = os.environ['PIXELPERFECT_API_KEY']
HEADERS  = {'Authorization': f'Bearer {API_KEY}'}

def capture_batch_and_wait(urls):
    # 1. Submit
    resp = requests.post(
        f'{API_BASE}/batch/submit',
        headers={**HEADERS, 'Content-Type': 'application/json'},
        json={'urls': urls, 'width': 1280, 'height': 800},
    )
    resp.raise_for_status()
    job_id = resp.json()['job_id']
    print(f'Job submitted: {job_id}')

    # 2. Poll
    while True:
        time.sleep(2)
        resp = requests.get(
            f'{API_BASE}/batch/jobs/{job_id}',
            headers=HEADERS,
        )
        resp.raise_for_status()
        job = resp.json()

        print(
            f"Status: {job['status']} "
            f"({job['completed_count']}/{job['total_count']})"
        )

        if job['status'] in ('completed', 'failed'):
            return job

# Usage
result = capture_batch_and_wait([
    'https://example.com',
    'https://example.org',
])
print('Done:', result['screenshots'])`}
        </pre>
      </div>

      {/* Polling best practices */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Polling Best Practices</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Pick a sensible cadence</h3>
      <p className="text-gray-700 leading-relaxed">
        2 seconds between polls works well for most batch sizes. Polling more often (every
        100ms, every second) doesn't make jobs finish faster &mdash; it just generates noise. For
        very large batches, every 5 seconds is fine.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Set a maximum wait time</h3>
      <p className="text-gray-700 leading-relaxed">
        Don't poll forever. A reasonable ceiling is 10 minutes for a typical batch &mdash; if a
        job hasn't completed in that time, something's wrong, and you want to know rather
        than have the polling loop hang indefinitely.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`const MAX_WAIT_SECONDS = 600;  // 10 minutes
const POLL_INTERVAL    = 2;    // seconds
const MAX_POLLS        = MAX_WAIT_SECONDS / POLL_INTERVAL;

for (let i = 0; i < MAX_POLLS; i++) {
  await new Promise(r => setTimeout(r, POLL_INTERVAL * 1000));
  const job = await fetchJobStatus(job_id);
  if (job.status === 'completed' || job.status === 'failed') return job;
}
throw new Error(\`Job \${job_id} did not complete within \${MAX_WAIT_SECONDS}s\`);`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Handle network errors gracefully</h3>
      <p className="text-gray-700 leading-relaxed">
        Polling makes many requests over a long-running operation. Any one of them might hit
        a transient network blip. Don't fail the whole operation on a single error &mdash; catch,
        log, wait the normal interval, then retry. The job is still running on our side; only
        your check-in failed.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Polling vs. webhooks: trade-offs</h3>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Aspect</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Polling</th>
              <th className="text-left p-3 font-semibold text-gray-900">Webhooks (when shipped)</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Latency</td>
              <td className="p-3 border-r border-gray-200">Up to one poll interval</td>
              <td className="p-3">Near-instant</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Setup complexity</td>
              <td className="p-3 border-r border-gray-200">Just code on your side</td>
              <td className="p-3">Need a public endpoint to receive POSTs</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Reliability</td>
              <td className="p-3 border-r border-gray-200">Self-healing &mdash; just retry the next poll</td>
              <td className="p-3">Depends on your endpoint being up and our retry logic</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200">Network usage</td>
              <td className="p-3 border-r border-gray-200">Many small requests over time</td>
              <td className="p-3">One delivery per event</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200">Best for</td>
              <td className="p-3 border-r border-gray-200">Batch jobs of any size, simple integrations</td>
              <td className="p-3">High-volume real-time pipelines, serverless functions</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Forward-looking section */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Webhooks Will Look Like (When They Ship)</h2>
      <p className="text-gray-700 leading-relaxed">
        For developers planning ahead: this is the contract we're targeting. Treat it as a
        design preview, not a guarantee &mdash; final shapes may differ slightly when implementation
        completes.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Configuration</h3>
      <p className="text-gray-700 leading-relaxed">
        You'll register a webhook URL in your dashboard, or pass <code className="font-mono">webhook_url</code>{' '}
        in your screenshot/batch request. We'll deliver an event to that URL when the
        operation finishes (success or failure).
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned event payload (subject to change)</h3>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`POST https://your-app.com/webhooks/pixelperfect
Content-Type: application/json
X-PixelPerfect-Signature: sha256=abc123...
X-PixelPerfect-Event: screenshot.completed
X-PixelPerfect-Delivery-Id: evt_xyz789

{
  "event":         "screenshot.completed",
  "screenshot_id": "ss_abc123",
  "url":           "https://example.com",
  "screenshot_url": "https://pub-xxx.r2.dev/...",
  "format":        "png",
  "size_bytes":    245678,
  "created_at":    "2026-04-27T10:30:00Z"
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Planned anti-failure features</h3>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>HMAC signatures</strong> in the <code className="font-mono">X-PixelPerfect-Signature</code> header so you can verify the webhook genuinely came from us</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Retry with exponential backoff</strong> if your endpoint returns non-2xx (planned: 3 retries at 2s/4s/8s)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Delivery history</strong> in your dashboard so you can see what was attempted, what succeeded, and what failed</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
          <span><strong>Manual re-delivery</strong> for failed webhooks, so you can re-fire after fixing your endpoint</span>
        </li>
      </ul>

      {/* When this article will fully apply */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When This Article Becomes Fully Applicable</h2>
      <p className="text-gray-700 leading-relaxed">
        Once webhooks ship, this article will expand to cover the actual delivery-failure
        scenarios: signature mismatches, your endpoint returning non-2xx, dropped retries,
        out-of-order delivery, replay-attack defenses. For now, the polling pattern above
        gives you the same functional outcome.
      </p>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/batch-processing-guide"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Batch Processing Guide</h4>
            <p className="text-sm text-blue-700 mb-0">Where the polling pattern actually applies &mdash; with full request and response shapes</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/website-monitoring-guide"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Website Monitoring Guide</h4>
            <p className="text-sm text-green-700 mb-0">Notification-style use cases you can build today with cron + polling</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/contact?subject=feature-request-webhooks"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Get notified when webhooks ship</h4>
            <p className="text-sm text-purple-700 mb-0">We'll email you the day they go live</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're not blocked 🔔</h4>
            <p className="text-green-800 text-sm mb-0">
              Webhooks aren't shipped yet, but the polling pattern gives you the same outcome
              with working code today. When webhooks land, your existing polling integration
              will keep working &mdash; no rewrites required. Switching to webhooks later is a
              clean upgrade, not a breaking change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookDeliveryFailuresGuide;

// ===== END OF WebhookDeliveryFailuresGuide.jsx =====