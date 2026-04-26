// ========================================
// WEBSITE MONITORING GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/WebsiteMonitorGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #9 in "API Usage" category
// (Slug: website-monitoring-guide in helpArticles.js)
//
// This is a USE-CASE article about building website monitoring on top of
// PixelPerfect. It's honest about the current state:
//   - What you CAN do today: scheduled batch captures, manual diff, archive
//   - What's COMING SOON: built-in webhooks + change detection (see roadmap)
//
// The article guides readers to roll their own monitoring with their own
// scheduler (cron, GitHub Actions, etc.) and their own diff tools — and
// gives them complete working examples to copy.
//
// Verified facts used:
//   - Single endpoint: POST /api/v1/screenshot
//   - Batch endpoints: /api/v1/batch/submit, /jobs, /jobs/{id}
//   - Tier batch limits: Free=0 / Pro=50 / Business=200 / Premium=1000
//   - File retention: 7 days on R2 (must download for long-term archival)
//   - 2-second polling cadence for batch jobs
//   - Webhooks marked "Coming Soon" on Features page (not in code path)
// ========================================

import React from 'react';

const WebsiteMonitorGuide = () => {
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
              How to build a working website monitoring system on top of PixelPerfect: scheduled
              captures via cron, GitHub Actions, or your own scheduler; a long-term storage
              strategy that survives our 7-day retention; and concrete diff tools (perceptual
              hashing, pixel comparison) you can run yourself to detect visual changes.
            </p>
          </div>
        </div>
      </div>

      {/* What this article is honest about */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What's Available Today vs Coming Soon</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Before we dive in, here's an honest map of what you can build today versus what's on
        our roadmap. PixelPerfect is the rendering engine — you bring the schedule, storage,
        and diff logic. We're working on bringing more of this in-house, but the patterns
        below work today and will keep working.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-white border-2 border-green-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✅</span>
            <h4 className="font-semibold text-gray-900 mb-0">Available today</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 mb-0">
            <li>• On-demand screenshot capture</li>
            <li>• Batch processing (Pro+)</li>
            <li>• 7-day Cloudflare R2 storage</li>
            <li>• Multiple formats (PNG, JPEG, WebP, PDF)</li>
            <li>• Custom viewport, full-page, dark mode</li>
            <li>• Element removal for clean comparisons</li>
          </ul>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛠️</span>
            <h4 className="font-semibold text-gray-900 mb-0">Coming soon</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 mb-0">
            <li>• Built-in scheduling (no external cron needed)</li>
            <li>• Webhook notifications on capture</li>
            <li>• Built-in visual change detection</li>
            <li>• Threshold-based alerts</li>
            <li>• Diff-image generation</li>
          </ul>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        For now, you'll handle the schedule and the diff — but PixelPerfect's batch API,
        clean parameters, and reliable rendering make it a solid foundation to build on. The
        patterns below are how teams build production monitoring on top of any screenshot API.
      </p>

      {/* The big picture */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Three-Layer Architecture</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Every website monitoring system has three layers. Think about each one separately:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">1</span>
            Schedule
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            <strong>What:</strong> Decides when to capture. Hourly, daily, on-demand.<br/>
            <strong>You provide:</strong> cron, GitHub Actions, Vercel cron, AWS EventBridge, etc.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">2</span>
            Capture & Store
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            <strong>What:</strong> Actually takes the screenshot and saves it permanently.<br/>
            <strong>PixelPerfect provides:</strong> the capture. <strong>You provide:</strong> long-term storage.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">3</span>
            Compare & Alert
          </h4>
          <p className="text-sm text-gray-700 mb-0">
            <strong>What:</strong> Spots visual differences between captures and notifies you.<br/>
            <strong>You provide:</strong> diff library + alert mechanism (Slack, email, webhook).
          </p>
        </div>
      </div>

      {/* Layer 1: Scheduling */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Layer 1: Scheduling Strategies</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Five practical ways to schedule captures, ordered from simplest to most powerful:
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Option A: GitHub Actions cron (free, easy)</h3>
      <p className="text-gray-700 leading-relaxed">
        If you already use GitHub, this is the lowest-friction path. Free for public repos
        and most private repo workflows.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`# .github/workflows/monitor.yml
name: Website Monitor
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:        # Allow manual triggers

jobs:
  capture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: node scripts/monitor.js
        env:
          PIXELPERFECT_API_KEY: \${{ secrets.PIXELPERFECT_API_KEY }}
          AWS_ACCESS_KEY_ID:    \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SLACK_WEBHOOK_URL:    \${{ secrets.SLACK_WEBHOOK_URL }}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Option B: Vercel Cron (if you're already on Vercel)</h3>
      <p className="text-gray-700 leading-relaxed">
        Define a cron in <span className="font-mono">vercel.json</span> that hits a serverless
        function. Free tier supports daily crons; Pro tier supports more frequent schedules.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// vercel.json
{
  "crons": [
    {
      "path":     "/api/cron/monitor",
      "schedule": "0 */6 * * *"
    }
  ]
}

// pages/api/cron/monitor.js
export default async function handler(req, res) {
  // Verify the cron secret to prevent abuse
  if (req.headers.authorization !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return res.status(401).end();
  }

  await runMonitoringJob();
  return res.json({ ok: true });
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Option C: Render Cron Jobs</h3>
      <p className="text-gray-700 leading-relaxed">
        If your backend is already on Render, add a Cron Job service that runs your monitor
        script on a schedule. Configured in the Render dashboard.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Option D: AWS EventBridge → Lambda</h3>
      <p className="text-gray-700 leading-relaxed">
        For larger workloads or AWS-native shops. EventBridge fires a Lambda on schedule;
        Lambda calls PixelPerfect, stores results in S3, runs the diff. Production-grade,
        more complex setup.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Option E: Old-school crontab on a VPS</h3>
      <p className="text-gray-700 leading-relaxed">
        If you run your own Linux box, the simplest possible option:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`# crontab -e
0 */6 * * * cd /home/you/monitor && /usr/bin/node monitor.js >> /var/log/monitor.log 2>&1`}
        </pre>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">Recommended starting point</h4>
            <p className="text-blue-800 text-sm mb-0">
              For most teams, <strong>GitHub Actions cron</strong> is the right first move.
              It's free, version-controlled, observable, and you can graduate to AWS or
              Vercel later when you actually need to.
            </p>
          </div>
        </div>
      </div>

      {/* Layer 2: Capture & store */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Layer 2: Capture & Long-Term Storage</h2>
      <p className="text-gray-700 leading-relaxed">
        PixelPerfect captures the screenshot — that's the easy part. The harder question is{' '}
        <em>where do the screenshots live for the long haul?</em>
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">7-day retention rule</h4>
            <p className="text-yellow-800 text-sm mb-0">
              PixelPerfect screenshots live on R2 for <strong>7 days</strong>, then they're
              auto-deleted. For monitoring (where you compare today's shot to last week's),
              you <strong>must</strong> download and archive screenshots to your own storage
              immediately after capture. Don't rely on R2 URLs as your archive.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">A complete capture-and-archive function</h3>
      <p className="text-gray-700 leading-relaxed">
        The pattern is: capture → download bytes → upload to your storage → record metadata
        in a database. Here's a Node.js implementation that uses S3 for storage:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// scripts/monitor.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });
const PIXELPERFECT_API = "https://api.pixelperfectapi.net/api/v1/screenshot";

async function captureAndArchive(targetUrl, label) {
  const timestamp = new Date().toISOString();
  const datestamp = timestamp.slice(0, 10);  // 2026-04-25

  // 1. Capture via PixelPerfect
  const captureResp = await fetch(PIXELPERFECT_API, {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      url:       targetUrl,
      width:     1920,
      height:    1080,
      full_page: true,
      delay:     2,
      remove_elements: [
        "#cookie-banner",
        ".gdpr-modal",
        ".chat-widget",
      ],
    }),
  });

  if (!captureResp.ok) {
    throw new Error(\`Capture failed: HTTP \${captureResp.status}\`);
  }

  const result = await captureResp.json();

  // 2. Download the bytes from R2 before they expire
  const imageResp  = await fetch(result.screenshot_url);
  const imageBytes = Buffer.from(await imageResp.arrayBuffer());

  // 3. Upload to YOUR storage with a structured key
  const s3Key = \`monitoring/\${label}/\${datestamp}/\${timestamp}.png\`;
  await s3.send(new PutObjectCommand({
    Bucket:      process.env.S3_BUCKET,
    Key:         s3Key,
    Body:        imageBytes,
    ContentType: "image/png",
  }));

  return {
    label,
    targetUrl,
    timestamp,
    s3Key,
    sizeBytes: imageBytes.length,
  };
}

// Usage
const result = await captureAndArchive(
  "https://competitor.com/pricing",
  "competitor-pricing"
);
console.log(\`Archived: s3://\${process.env.S3_BUCKET}/\${result.s3Key}\`);`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Storage backend options</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        Pick whatever fits your existing infrastructure. PixelPerfect is storage-agnostic:
      </p>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>AWS S3</strong> — most flexible, well-priced for archival, integrates with Glacier for cold storage</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Cloudflare R2</strong> (your own bucket) — same API as S3, no egress fees, very cheap for read-heavy workloads</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Backblaze B2</strong> — even cheaper than R2, S3-compatible API</span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Local disk + git-lfs</strong> — fine for small projects, especially if you're already running on a VPS</span>
        </li>
      </ul>

      {/* Storage key conventions */}
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Storage key conventions matter</h3>
      <p className="text-gray-700 leading-relaxed">
        How you name the files determines how easy it is to compare them later. Two patterns
        that work well:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Time-series pattern</h4>
          <pre className="text-xs text-gray-700 whitespace-pre overflow-x-auto bg-gray-50 p-2 rounded">
{`monitoring/
  competitor-pricing/
    2026-04-23/
      2026-04-23T06:00:00Z.png
      2026-04-23T12:00:00Z.png
    2026-04-24/
      2026-04-24T06:00:00Z.png
      ...`}
          </pre>
          <p className="text-xs text-gray-600 mt-2 mb-0">Best for: full historical archive, "show me every capture from the last 90 days"</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Latest-and-previous pattern</h4>
          <pre className="text-xs text-gray-700 whitespace-pre overflow-x-auto bg-gray-50 p-2 rounded">
{`monitoring/
  competitor-pricing/
    latest.png
    previous.png
    archive/
      2026-04-23T06:00:00Z.png
      ...`}
          </pre>
          <p className="text-xs text-gray-600 mt-2 mb-0">Best for: simple diff loop ("compare latest to previous, archive the old previous")</p>
        </div>
      </div>

      {/* Batch for many URLs */}
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Monitoring many URLs? Use batch</h3>
      <p className="text-gray-700 leading-relaxed">
        If you're tracking 20+ URLs, switch from individual single-screenshot calls to the
        batch API. One batch consumes one concurrency slot regardless of URL count, so it's
        much faster than parallel single-screenshot calls.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`async function captureManyAndArchive(urls, labelMap) {
  // 1. Submit batch job
  const submitResp = await fetch(
    "https://api.pixelperfectapi.net/api/v1/batch/submit",
    {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        urls,
        format:    "png",
        full_page: true,
        delay:     2,
      }),
    },
  );
  const job = await submitResp.json();

  // 2. Poll until done (every 2 seconds)
  const TERMINAL = new Set(["completed", "partial", "failed", "cancelled"]);
  let finalJob = job;
  while (!TERMINAL.has(finalJob.status)) {
    await new Promise(r => setTimeout(r, 2000));
    const pollResp = await fetch(
      \`https://api.pixelperfectapi.net/api/v1/batch/jobs/\${job.id}\`,
      { headers: { "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\` } },
    );
    finalJob = await pollResp.json();
  }

  // 3. Download and archive each successful capture
  for (const item of finalJob.items) {
    if (item.status === "completed") {
      const label = labelMap[item.url] ?? "untitled";
      await archiveScreenshot(item.screenshot_url, label, item.url);
    }
  }
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Tier limits to remember: Pro = 50 URLs per batch, Business = 200, Premium = 1,000.
        See the{' '}
        <a href="/help/article/batch-processing-guide" className="text-blue-600 hover:underline">
          batch processing guide
        </a>{' '}
        for the complete API reference.
      </p>

      {/* Layer 3: Diff & alert */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Layer 3: Detecting Changes</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Now the interesting part: how do you detect when a page actually changed in a way
        that matters? Three approaches, ordered from cheapest to most accurate:
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Approach 1: Perceptual hashing (cheapest, fastest)</h3>
      <p className="text-gray-700 leading-relaxed">
        Compute a small "fingerprint" of each image, compare fingerprints with a similarity
        score. Fast, cheap, surprisingly effective — great for "did anything change at all?"
        questions but doesn't tell you what or where.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`# Python with imagehash library
# pip install imagehash Pillow

from PIL import Image
import imagehash

hash_today     = imagehash.phash(Image.open("today.png"))
hash_yesterday = imagehash.phash(Image.open("yesterday.png"))

# Distance: 0 = identical, higher = more different
distance = hash_today - hash_yesterday

if distance > 5:
    print(f"Significant change detected (distance: {distance})")
    send_slack_alert(f"Page changed! Distance: {distance}")
else:
    print(f"No significant change (distance: {distance})")`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Approach 2: Pixel-by-pixel comparison (more accurate)</h3>
      <p className="text-gray-700 leading-relaxed">
        Compare every pixel between two images, count how many differ. Tells you exactly
        what fraction of the page changed. Slower but more precise.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`# Python with Pillow
from PIL import Image, ImageChops

today     = Image.open("today.png")
yesterday = Image.open("yesterday.png")

# Resize to match if needed
if today.size != yesterday.size:
    yesterday = yesterday.resize(today.size)

# Compute diff
diff = ImageChops.difference(today, yesterday)
bbox = diff.getbbox()  # Bounding box of changed pixels, or None

if bbox is None:
    print("Pixel-perfect identical")
else:
    # Calculate % of pixels that changed
    diff_pixels  = sum(1 for p in diff.getdata() if any(p))
    total_pixels = today.size[0] * today.size[1]
    change_pct   = (diff_pixels / total_pixels) * 100

    print(f"{change_pct:.2f}% of pixels changed")
    print(f"Changed region bounding box: {bbox}")

    if change_pct > 1.0:  # Threshold: more than 1% changed
        # Save the diff image showing what changed
        diff.save("diff.png")
        send_slack_alert(f"Page changed: {change_pct:.2f}% different", attach="diff.png")`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Approach 3: Pixelmatch (industry standard)</h3>
      <p className="text-gray-700 leading-relaxed">
        The library used by browser screenshot diff tools and visual regression frameworks.
        Handles anti-aliasing, sub-pixel rendering differences, and produces a colored diff
        image highlighting exactly what changed.
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// Node.js with pixelmatch
// npm install pixelmatch pngjs

import fs from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const today     = PNG.sync.read(fs.readFileSync("today.png"));
const yesterday = PNG.sync.read(fs.readFileSync("yesterday.png"));
const { width, height } = today;
const diff = new PNG({ width, height });

const numDiffPixels = pixelmatch(
  today.data,
  yesterday.data,
  diff.data,
  width,
  height,
  { threshold: 0.1 },  // 0.0 = strictest, 1.0 = loosest
);

fs.writeFileSync("diff.png", PNG.sync.write(diff));

const totalPixels = width * height;
const changePct = (numDiffPixels / totalPixels) * 100;
console.log(\`\${changePct.toFixed(2)}% of pixels differ\`);

if (changePct > 1.0) {
  await sendSlackAlert(\`Visual change: \${changePct.toFixed(2)}% different\`, "diff.png");
}`}
        </pre>
      </div>

      {/* Threshold tuning */}
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Tuning the alert threshold</h3>
      <p className="text-gray-700 leading-relaxed">
        Picking the right threshold is the difference between useful alerts and alert fatigue:
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Threshold</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">What it catches</th>
              <th className="text-left p-3 font-semibold text-gray-900">Best for</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">{">"}0.1%</td>
              <td className="p-3 border-r border-gray-200">Anything at all (extremely noisy)</td>
              <td className="p-3">Static archive pages where ANY change matters</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">{">"}1%</td>
              <td className="p-3 border-r border-gray-200">Section changes, layout shifts</td>
              <td className="p-3">Most monitoring use cases — start here</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 font-mono">{">"}5%</td>
              <td className="p-3 border-r border-gray-200">Major redesigns, new features</td>
              <td className="p-3">Catching big competitor pivots</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 font-mono">{">"}20%</td>
              <td className="p-3 border-r border-gray-200">Site overhauls only</td>
              <td className="p-3">Long-form sentinel monitoring</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Start at 1% and tune from there based on your false-positive rate over the first
        couple of weeks.
      </p>

      {/* Real use cases */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Monitoring Use Cases</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">🏢 Competitor pricing tracking</h4>
          <p className="text-sm text-gray-700">
            Capture competitor pricing pages every 6 hours. Alert your sales team via Slack
            when a price changes. Threshold: 1%. Bonus: keep the archive forever — useful for
            quarterly competitive analysis.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">🌐 Your own site uptime + visual integrity</h4>
          <p className="text-sm text-gray-700">
            Capture your own homepage every 15 minutes. Alert if the page looks visually
            broken (large blank areas, missing hero, error pages). Catches CDN failures,
            broken deploys, and CSS regressions that traditional uptime monitors miss.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">⚖️ Legal / compliance archiving</h4>
          <p className="text-sm text-gray-700">
            Daily captures of your terms of service, privacy policy, and product pages.
            Required for some regulatory frameworks. PDF format works well for this. No
            change-alerts needed; just keep the dated archive.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">📰 News monitoring</h4>
          <p className="text-sm text-gray-700">
            Track when specific articles or news pages change. Useful for journalism, PR
            monitoring, and stock-relevant news sources. Higher threshold (5%+) since news
            sites change layout constantly.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">🛒 E-commerce stock / availability</h4>
          <p className="text-sm text-gray-700">
            Capture product pages on retailer sites. Alert when "out of stock" changes to
            "available" by detecting visual diff in the product CTA region.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">🎨 Design system / docs site visual regression</h4>
          <p className="text-sm text-gray-700">
            On every deploy, capture key pages, compare against baseline. Block the deploy if
            visual diffs exceed threshold. Lighter-weight alternative to Percy / Chromatic.
          </p>
        </div>
      </div>

      {/* Complete worked example */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Complete Worked Example: GitHub Actions Monitor</h2>
      <p className="text-gray-700 leading-relaxed">
        Putting it all together — a complete monitoring system in two files. Captures every
        6 hours, archives to S3, runs pixelmatch diff, posts to Slack on significant change.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">.github/workflows/monitor.yml</h4>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`name: Visual Monitor
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: node scripts/monitor.js
        env:
          PIXELPERFECT_API_KEY:   \${{ secrets.PIXELPERFECT_API_KEY }}
          AWS_ACCESS_KEY_ID:      \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY:  \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION:             us-east-1
          S3_BUCKET:              your-monitoring-bucket
          SLACK_WEBHOOK_URL:      \${{ secrets.SLACK_WEBHOOK_URL }}
          DIFF_THRESHOLD:         '1.0'`}
        </pre>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">scripts/monitor.js</h4>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`import fs from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET    = process.env.S3_BUCKET;
const THRESHOLD = parseFloat(process.env.DIFF_THRESHOLD || "1.0");

const TARGETS = [
  { label: "competitor-pricing",  url: "https://competitor.com/pricing" },
  { label: "competitor-homepage", url: "https://competitor.com" },
  { label: "competitor-features", url: "https://competitor.com/features" },
];

async function capture(targetUrl) {
  const resp = await fetch(
    "https://api.pixelperfectapi.net/api/v1/screenshot",
    {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        url:       targetUrl,
        width:     1920,
        height:    1080,
        full_page: true,
        delay:     2,
        remove_elements: ["#cookie-banner", ".gdpr-modal", ".chat-widget"],
      }),
    },
  );

  if (!resp.ok) throw new Error(\`Capture failed: HTTP \${resp.status}\`);
  const result   = await resp.json();
  const imageResp = await fetch(result.screenshot_url);
  return Buffer.from(await imageResp.arrayBuffer());
}

async function s3Get(key) {
  try {
    const resp   = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const chunks = [];
    for await (const c of resp.Body) chunks.push(c);
    return Buffer.concat(chunks);
  } catch (e) {
    if (e.name === "NoSuchKey") return null;
    throw e;
  }
}

async function s3Put(key, body) {
  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        body,
    ContentType: "image/png",
  }));
}

async function diffImages(bufA, bufB) {
  const a = PNG.sync.read(bufA);
  const b = PNG.sync.read(bufB);
  if (a.width !== b.width || a.height !== b.height) {
    return { changedPct: 100, diff: null };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const numDiff = pixelmatch(
    a.data, b.data, diff.data, a.width, a.height,
    { threshold: 0.1 },
  );
  return {
    changedPct: (numDiff / (a.width * a.height)) * 100,
    diff:       PNG.sync.write(diff),
  };
}

async function notifySlack(message) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ text: message }),
  });
}

async function monitorOne({ label, url }) {
  const today     = new Date().toISOString();
  const datestamp = today.slice(0, 10);

  console.log(\`[\${label}] capturing \${url}\`);
  const newImage = await capture(url);

  // Save to dated archive (keep history forever)
  await s3Put(\`monitoring/\${label}/archive/\${today}.png\`, newImage);

  // Compare to "latest"
  const latestKey   = \`monitoring/\${label}/latest.png\`;
  const previousImg = await s3Get(latestKey);

  if (previousImg) {
    const { changedPct, diff } = await diffImages(newImage, previousImg);
    console.log(\`[\${label}] changed \${changedPct.toFixed(2)}%\`);

    if (changedPct > THRESHOLD) {
      const diffKey = \`monitoring/\${label}/diffs/\${today}-diff.png\`;
      if (diff) await s3Put(diffKey, diff);

      await notifySlack(
        \`🔔 *\${label}* changed \${changedPct.toFixed(2)}% — \\n\` +
        \`URL: \${url}\\n\` +
        \`Diff: s3://\${BUCKET}/\${diffKey}\`
      );

      // Promote previous "latest" to dated history before overwriting
      await s3Put(\`monitoring/\${label}/previous.png\`, previousImg);
    }
  }

  // Always update latest
  await s3Put(latestKey, newImage);
}

(async () => {
  for (const target of TARGETS) {
    try {
      await monitorOne(target);
    } catch (e) {
      console.error(\`[\${target.label}] error: \${e.message}\`);
      await notifySlack(\`⚠️ Monitor error on \${target.label}: \${e.message}\`);
    }
  }
})();`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Drop those two files in your repo, set the secrets in GitHub Actions, and you have
        a working monitoring system. ~150 lines of code total.
      </p>

      {/* Pitfalls */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Pitfalls</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My monitor alerts on every run"</h4>
          <p className="text-sm text-gray-700">
            Almost always caused by dynamic content: timestamps, ads, "you have N notifications"
            badges, randomized testimonials. Add the dynamic elements to{' '}
            <span className="font-mono">remove_elements</span> so they're hidden before
            capture. The diff will then ignore the parts that always change.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My alerts are too quiet — I miss real changes"</h4>
          <p className="text-sm text-gray-700">
            Threshold too high. Drop from 5% to 1% and watch what comes through. If you get
            too many false positives, add specific dynamic elements to{' '}
            <span className="font-mono">remove_elements</span> rather than raising the
            threshold again.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Captures are different sizes from one run to the next"</h4>
          <p className="text-sm text-gray-700">
            Happens with <span className="font-mono">full_page: true</span> on pages whose
            content changes height (new posts, comments, etc.). Either: capture a fixed
            viewport (<span className="font-mono">full_page: false</span> with explicit{' '}
            <span className="font-mono">height</span>), or resize images to a common size
            before diffing.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"The site I'm monitoring blocks my requests"</h4>
          <p className="text-sm text-gray-700">
            Some sites detect headless browsers and serve different content (or block
            entirely). PixelPerfect uses a real Chromium instance, but sophisticated bot
            detection can still flag it. There's no perfect solution; if a target site
            actively prevents capture, monitoring it is unreliable by design.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My quota is getting eaten faster than expected"</h4>
          <p className="text-sm text-gray-700">
            Pro tier is 5,000 screenshots/month. If you're capturing 10 URLs every hour,
            that's 7,200 screenshots/month — over the limit. Reduce frequency, monitor fewer
            URLs, or upgrade to Business (50,000/month). Use batch endpoints for efficiency
            once you go past 20 URLs.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My GitHub Actions cron isn't running"</h4>
          <p className="text-sm text-gray-700">
            GitHub Actions cron has a known quirk: scheduled workflows can be delayed by 15+
            minutes during high-load periods, and they're disabled automatically after 60
            days of repo inactivity. For mission-critical monitoring, use a paid scheduler
            (Vercel Pro, AWS EventBridge) instead.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="/help/article/batch-processing-guide"
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Batch processing guide</h4>
            <p className="text-sm text-blue-700 mb-0">Capture many monitoring targets efficiently in one job</p>
          </div>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/social-media-preview-guide"
          className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Social media preview guide</h4>
            <p className="text-sm text-green-700 mb-0">A different use case — the same automation patterns</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/rate-limits-and-quotas"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Rate limits and quotas</h4>
            <p className="text-sm text-purple-700 mb-0">Plan capacity for monitoring at scale before you hit limits</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">You're set up to monitor 🛰️</h4>
            <p className="text-green-800 text-sm mb-0">
              You have the three-layer model, the scheduling options, the storage strategy
              that survives our 7-day retention, the diff toolkit, and a complete working
              GitHub Actions example. Webhooks and built-in change detection are coming
              soon — until then, this pattern delivers the same outcome with full control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteMonitorGuide;
