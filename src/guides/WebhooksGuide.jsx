// ========================================
// GUIDE: Webhooks & Notifications
// ========================================
// File: frontend/src/guides/WebhooksGuide.jsx
// Author: OneTechly
// Created: May 2026 — Phase 3
//
// Tier: Business+
// Phase: 3 (shipped May 2026)
// Note: The webhook backend was fully implemented in Phase 1 alongside
//       the router. This guide documents the live, working feature.
// ========================================

import React, { useState } from 'react';

const TierBadge = ({ tier }) => {
  const styles = {
    business: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    premium:  'bg-green-100 text-green-800 border border-green-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[tier] || styles.business}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}+
    </span>
  );
};

const CalloutBox = ({ type = 'info', title, children }) => {
  const styles = {
    info:    { wrapper: 'bg-blue-50 border-blue-300',   icon: '💡', titleColor: 'text-blue-800',  bodyColor: 'text-blue-700'  },
    warning: { wrapper: 'bg-amber-50 border-amber-300', icon: '⚠️', titleColor: 'text-amber-800', bodyColor: 'text-amber-700' },
    success: { wrapper: 'bg-green-50 border-green-300', icon: '✅', titleColor: 'text-green-800', bodyColor: 'text-green-700' },
    tip:     { wrapper: 'bg-purple-50 border-purple-300', icon: '⚡', titleColor: 'text-purple-800', bodyColor: 'text-purple-700' },
  };
  const s = styles[type] || styles.info;
  return (
    <div className={`border-l-4 rounded-r-lg p-4 mb-6 ${s.wrapper}`}>
      {title && (
        <div className={`font-semibold mb-1 flex items-center gap-2 ${s.titleColor}`}>
          <span>{s.icon}</span> {title}
        </div>
      )}
      <div className={`text-sm leading-relaxed ${s.bodyColor}`}>{children}</div>
    </div>
  );
};

const CodeBlock = ({ code, label }) => (
  <div className="mb-6">
    {label && (
      <div className="bg-gray-700 text-gray-300 text-xs font-mono px-4 py-2 rounded-t-lg">
        {label}
      </div>
    )}
    <pre className={`bg-gray-900 text-green-400 text-sm font-mono p-4 overflow-x-auto leading-relaxed ${label ? 'rounded-b-lg' : 'rounded-lg'}`}>
      <code>{code.trim()}</code>
    </pre>
  </div>
);

const SectionHeading = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
    {children}
  </h2>
);

const SubHeading = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
);

export default function WebhooksGuide() {
  const [activeTab, setActiveTab] = useState('basic');

  const requestExamples = {
    basic: `curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "webhook_url": "https://your-server.com/webhook"
  }'`,
    signed: `curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot/ \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "webhook_url": "https://your-server.com/webhook",
    "webhook_secret": "your-hmac-secret"
  }'`,
    node: `const response = await fetch('https://api.pixelperfectapi.net/api/v1/screenshot/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    webhook_url: 'https://your-server.com/webhook',
    webhook_secret: 'your-hmac-secret',
  }),
});

// The API returns immediately (HTTP 200) before the webhook fires.
// Webhooks are delivered in the background.
const data = await response.json();
console.log('Screenshot ID:', data.screenshot_id);`,
    python: `import requests

response = requests.post(
    'https://api.pixelperfectapi.net/api/v1/screenshot/',
    headers={'Authorization': 'Bearer YOUR_TOKEN'},
    json={
        'url': 'https://example.com',
        'webhook_url': 'https://your-server.com/webhook',
        'webhook_secret': 'your-hmac-secret',
    }
)

# API returns synchronously — webhook fires in the background
data = response.json()
print('Screenshot ID:', data['screenshot_id'])`,
  };

  return (
    <article className="prose-custom max-w-none">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">🔔</div>
          <TierBadge tier="business" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Webhooks & Notifications</h1>
        <p className="text-violet-100 text-sm leading-relaxed">
          Receive a real-time HTTP POST to your server the moment a screenshot completes.
          Includes HMAC-SHA256 payload signing for security, exponential-backoff retry
          for reliability, and timestamp headers to prevent replay attacks.
        </p>
      </div>

      {/* Quick reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Parameter',   value: 'webhook_url'    },
          { label: 'Tier',        value: 'Business+'      },
          { label: 'Delivery',    value: 'Background'     },
          { label: 'Retry',       value: '3 attempts'     },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="font-semibold text-gray-900 text-sm">{value}</div>
          </div>
        ))}
      </div>

      <CalloutBox type="info" title="Synchronous API, asynchronous webhook">
        The screenshot API call returns <strong>immediately</strong> with HTTP 200 and the
        screenshot URL — you don't have to wait for the webhook. The webhook is fired
        in a background task after the API response is sent. This means your API call
        always completes quickly, regardless of whether your webhook server is fast or slow.
      </CalloutBox>

      {/* Basic usage */}
      <SectionHeading>Basic usage</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Add <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">webhook_url</code> to
        any screenshot request. PixelPerfect will POST the completion payload to that URL
        after the screenshot is captured and stored.
      </p>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { key: 'basic',  label: 'Basic (curl)' },
            { key: 'signed', label: 'Signed (curl)' },
            { key: 'node',   label: 'Node.js' },
            { key: 'python', label: 'Python' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <CodeBlock code={requestExamples[activeTab]} label={
          activeTab === 'basic'  ? 'curl — basic'  :
          activeTab === 'signed' ? 'curl — with HMAC signing' :
          activeTab === 'node'   ? 'Node.js' : 'Python'
        } />
      </div>

      {/* Webhook payload */}
      <SectionHeading>Webhook payload</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        PixelPerfect sends a JSON POST body with the following structure:
      </p>

      <CodeBlock
        label="POST body (JSON)"
        code={`{
  "event": "screenshot.completed",
  "timestamp": "2026-05-14T12:00:00.000000",
  "data": {
    "screenshot_id":   "abc123",
    "url":             "https://example.com",
    "screenshot_url":  "https://pub-xxx.r2.dev/screenshots/1/abc.png",
    "format":          "png",
    "size_bytes":      142857,
    "processing_time_ms": 2340,
    "js_warning":      null
  }
}`}
      />

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Field</th>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Type</th>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['event',               'string',      '"screenshot.completed" — the only event type currently'],
              ['timestamp',           'ISO 8601',    'UTC time the webhook was dispatched'],
              ['data.screenshot_id',  'string',      'Unique ID for the screenshot record'],
              ['data.url',            'string',      'The URL that was captured'],
              ['data.screenshot_url', 'string',      'Public URL to the captured image or PDF'],
              ['data.format',         'string',      'png | jpeg | webp | pdf'],
              ['data.size_bytes',     'integer',     'File size of the captured screenshot'],
              ['data.processing_time_ms', 'integer', 'End-to-end capture time in milliseconds'],
              ['data.js_warning',     'string | null', 'Non-null if custom_js threw an error'],
            ].map(([field, type, desc]) => (
              <tr key={field} className="border-b border-gray-100 last:border-0">
                <td className="p-3 font-mono text-xs text-violet-700">{field}</td>
                <td className="p-3 text-xs text-gray-600 font-mono">{type}</td>
                <td className="p-3 text-gray-700 text-xs">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request headers */}
      <SectionHeading>Request headers</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Every webhook request includes the following headers:
      </p>

      <CodeBlock
        label="HTTP headers sent by PixelPerfect"
        code={`Content-Type: application/json
User-Agent: PixelPerfect-Webhook/1.0
X-PixelPerfect-Timestamp: 1747224000
X-PixelPerfect-Signature: sha256=a1b2c3d4...   ← only when webhook_secret is set`}
      />

      {/* HMAC signing */}
      <SectionHeading>HMAC-SHA256 payload signing</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Set <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">webhook_secret</code> in
        your request to enable payload signing. PixelPerfect signs the body with your secret
        and includes the signature in <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">X-PixelPerfect-Signature</code>.
        Verify it on your server to confirm the request is genuine.
      </p>

      <CalloutBox type="warning" title="Signature input format">
        The signature is computed over{' '}
        <code className="text-xs bg-amber-100 px-1 rounded">"{"{timestamp}"}." + body_bytes</code>,
        not just the body. This binds the signature to a specific timestamp,
        making replayed requests from old signatures invalid.
      </CalloutBox>

      <SubHeading>Verifying in Node.js</SubHeading>
      <CodeBlock
        label="Node.js (Express)"
        code={`const crypto = require('crypto');

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const secret    = process.env.PIXELPERFECT_WEBHOOK_SECRET;
  const signature = req.headers['x-pixelperfect-signature'];
  const timestamp = req.headers['x-pixelperfect-timestamp'];
  const body      = req.body; // raw Buffer

  if (!signature || !timestamp) {
    return res.status(400).send('Missing headers');
  }

  // Reject requests older than 5 minutes (replay attack protection)
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp));
  if (age > 300) {
    return res.status(400).send('Timestamp too old');
  }

  // Reconstruct the signed input: "{timestamp}." + body
  const sigInput  = Buffer.concat([
    Buffer.from(\`\${timestamp}.\`),
    body,
  ]);
  const expected  = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(sigInput)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).send('Invalid signature');
  }

  // Signature valid — process the event
  const event = JSON.parse(body);
  console.log('Screenshot complete:', event.data.screenshot_url);
  res.status(200).send('OK');
});`}
      />

      <SubHeading>Verifying in Python</SubHeading>
      <CodeBlock
        label="Python (FastAPI)"
        code={`import hmac
import hashlib
import time
from fastapi import Request, HTTPException

WEBHOOK_SECRET = os.environ['PIXELPERFECT_WEBHOOK_SECRET']

@app.post("/webhook")
async def handle_webhook(request: Request):
    body      = await request.body()
    signature = request.headers.get('x-pixelperfect-signature', '')
    timestamp = request.headers.get('x-pixelperfect-timestamp', '')

    if not signature or not timestamp:
        raise HTTPException(status_code=400, detail="Missing headers")

    # Reject requests older than 5 minutes
    age = abs(time.time() - int(timestamp))
    if age > 300:
        raise HTTPException(status_code=400, detail="Timestamp too old")

    # Reconstruct signed input: "{timestamp}." + body
    sig_input = f"{timestamp}.".encode() + body
    expected  = "sha256=" + hmac.new(
        WEBHOOK_SECRET.encode(), sig_input, hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Signature valid — process the event
    import json
    event = json.loads(body)
    print("Screenshot complete:", event["data"]["screenshot_url"])
    return {"status": "ok"}`}
      />

      {/* Retry policy */}
      <SectionHeading>Retry policy</SectionHeading>
      <p className="text-gray-700 mb-4 leading-relaxed">
        If your server is unavailable or returns a non-2xx status, PixelPerfect retries
        with exponential backoff:
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Attempt</th>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Delay before attempt</th>
              <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Timeout per request</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['1 (initial)', 'Immediately after screenshot',   '10 seconds'],
              ['2',           '2 seconds after attempt 1 fails', '10 seconds'],
              ['3',           '4 seconds after attempt 2 fails', '10 seconds'],
            ].map(([attempt, delay, timeout]) => (
              <tr key={attempt} className="border-b border-gray-100 last:border-0">
                <td className="p-3 font-semibold text-gray-900">{attempt}</td>
                <td className="p-3 text-gray-700">{delay}</td>
                <td className="p-3 text-gray-700">{timeout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CalloutBox type="warning" title="After 3 failed attempts">
        If all 3 attempts fail, the failure is logged on our end but no further retries
        are made. The screenshot itself is not affected — it was already captured and
        stored successfully before the webhook fired. You can retrieve it at any time
        via the <code className="text-xs bg-amber-100 px-1 rounded">GET /api/v1/screenshot/{'{screenshot_id}'}</code> endpoint.
      </CalloutBox>

      {/* Best practices */}
      <SectionHeading>Best practices</SectionHeading>

      <div className="space-y-3 mb-8">
        {[
          {
            icon: '⚡',
            title: 'Respond immediately, process async',
            body: 'Return HTTP 200 as fast as possible — ideally before doing any processing. Put the event in a queue and process it in a background worker. If your handler takes too long, PixelPerfect may count the request as failed and retry.',
          },
          {
            icon: '🔒',
            title: 'Always verify the signature in production',
            body: 'Set webhook_secret on every request and verify X-PixelPerfect-Signature on every incoming webhook. Without verification, anyone who knows your webhook URL can POST fake events.',
          },
          {
            icon: '⏱️',
            title: 'Enforce timestamp freshness',
            body: 'Reject webhooks with a timestamp older than 5 minutes. This prevents replay attacks where an attacker resends a captured request hours later.',
          },
          {
            icon: '🔁',
            title: 'Design for idempotency',
            body: 'Retries mean your endpoint may receive the same event more than once. Use screenshot_id as the idempotency key — check whether you\'ve already processed it before acting.',
          },
          {
            icon: '🌐',
            title: 'Use a publicly accessible URL',
            body: 'Your webhook URL must be reachable from the internet — localhost and private network addresses will always fail. Use a tunnelling tool like ngrok for local development.',
          },
          {
            icon: '🧪',
            title: 'Test with a free service first',
            body: 'Use webhook.site or pipedream.com to inspect the exact payload and headers before building your handler.',
          },
        ].map(({ icon, title, body }) => (
          <div key={title} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl flex-shrink-0">{icon}</div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">{title}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Use cases */}
      <SectionHeading>Common use cases</SectionHeading>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { icon: '💬', title: 'Slack / Teams alerts',    body: 'Post the screenshot URL to a Slack channel the moment it\'s ready.' },
          { icon: '🗄️', title: 'Database updates',        body: 'Mark a record as "screenshot_ready" in your DB without polling.' },
          { icon: '📧', title: 'Email pipelines',          body: 'Trigger transactional emails with the embedded screenshot the instant it\'s captured.' },
          { icon: '🔄', title: 'Multi-step automation',   body: 'Chain captures — the webhook from step 1 triggers step 2.' },
          { icon: '🧪', title: 'CI/CD visual tests',      body: 'Fail a build when the webhook reports a js_warning, indicating a script regression.' },
          { icon: '📦', title: 'S3 / storage sync',       body: 'Re-upload the screenshot to your own storage bucket on receipt.' },
        ].map(({ icon, title, body }) => (
          <div key={title} className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{icon}</span>
              <span className="font-semibold text-gray-900">{title}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Tier note */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 text-center">
        <div className="text-violet-800 font-semibold mb-1">🔔 Business tier feature</div>
        <p className="text-violet-700 text-sm">
          Webhook delivery is available on Business and Premium plans.
          Requests that include <code className="bg-violet-100 px-1 rounded">webhook_url</code> from
          Free or Pro accounts receive HTTP 403.
          The <code className="bg-violet-100 px-1 rounded">webhook_secret</code> field is optional
          but strongly recommended for production use.
        </p>
      </div>
    </article>
  );
}

// ===== END OF WebhooksGuide.jsx =====