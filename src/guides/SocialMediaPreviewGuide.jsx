// ========================================
// SOCIAL MEDIA PREVIEW GUIDE - PIXELPERFECT
// ========================================
// File: frontend/src/guides/SocialMediaPreviewGuide.jsx
// Author: OneTechly
// Update: April 2026
//
// Article #8 in "API Usage" category
// (Slug: social-media-preview-guide in helpArticles.js)
//
// This is a USE-CASE article — readers are content creators, marketers,
// and developers who need to generate Open Graph and Twitter Card images
// at scale. It's not a feature reference; it's a "how to ship this"
// playbook with concrete dimensions, working code, and CMS automation
// patterns.
//
// Verified facts used in this article:
//   - Single endpoint: POST /api/v1/screenshot
//   - Viewport bounds (single): 320–3840w / 240–2160h
//   - All required dimensions (1200×630, 1200×675, 1080×1080) fit easily
//   - File retention: 7 days on R2 (.env.production: FILE_RETENTION_DAYS=7)
//   - Format options: png, jpeg, webp, pdf
//   - delay parameter (0–10s) — useful for late-loading hero images
//   - remove_elements parameter — kills cookie banners that ruin OG previews
//   - dark_mode parameter
// ========================================

import React from 'react';

const SocialMediaPreviewGuide = () => {
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
              How to generate professional Open Graph and Twitter Card preview images
              automatically, the exact dimensions each platform expects, the gotchas that ruin
              previews (cookie banners, lazy-loaded heroes, late-loading fonts), and how to
              wire this into your CMS so every published post gets a perfect preview without
              manual work.
            </p>
          </div>
        </div>
      </div>

      {/* Why this matters */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Preview Images Matter</h2>
      <p className="text-gray-700 leading-relaxed">
        When someone shares your URL on Twitter, LinkedIn, Slack, Discord, iMessage, or any
        modern app, the platform fetches your page and looks for an Open Graph image to
        display. Get it right and your link looks professional and clickable. Get it wrong —
        or skip it — and you get a blank rectangle that nobody clicks.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        The problem is that creating preview images manually doesn't scale. If you publish 50
        blog posts a year, that's 50 design tasks. PixelPerfect lets you generate them
        automatically by pointing at a URL — either your live page, or a special preview-only
        page you render specifically for OG capture.
      </p>

      {/* The dimensions that matter */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Dimensions Cheat Sheet</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Each platform has its own preferred aspect ratio. The good news: you don't need a
        different image for each. <strong>1200×630 covers Open Graph, Facebook, LinkedIn, and
        Slack.</strong> Twitter has its own slightly different size for large-card layouts.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Platform</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Dimensions</th>
              <th className="text-left p-3 font-semibold text-gray-900 border-r border-gray-200">Aspect ratio</th>
              <th className="text-left p-3 font-semibold text-gray-900">Use case</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Open Graph</strong> (universal)</td>
              <td className="p-3 border-r border-gray-200 font-mono">1200 × 630</td>
              <td className="p-3 border-r border-gray-200">1.91:1</td>
              <td className="p-3">Default. Used by Facebook, LinkedIn, Slack, Discord, iMessage</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Twitter</strong> (large card)</td>
              <td className="p-3 border-r border-gray-200 font-mono">1200 × 675</td>
              <td className="p-3 border-r border-gray-200">16:9</td>
              <td className="p-3">Best engagement on Twitter / X</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Twitter</strong> (summary card)</td>
              <td className="p-3 border-r border-gray-200 font-mono">1200 × 600</td>
              <td className="p-3 border-r border-gray-200">2:1</td>
              <td className="p-3">Smaller, more compact card</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>LinkedIn</strong></td>
              <td className="p-3 border-r border-gray-200 font-mono">1200 × 627</td>
              <td className="p-3 border-r border-gray-200">1.91:1</td>
              <td className="p-3">Almost identical to OG — use 1200×630</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Pinterest</strong></td>
              <td className="p-3 border-r border-gray-200 font-mono">1000 × 1500</td>
              <td className="p-3 border-r border-gray-200">2:3 (portrait)</td>
              <td className="p-3">Vertical format. Different from OG</td>
            </tr>
            <tr>
              <td className="p-3 border-r border-gray-200 bg-gray-50"><strong>Instagram</strong> (square post)</td>
              <td className="p-3 border-r border-gray-200 font-mono">1080 × 1080</td>
              <td className="p-3 border-r border-gray-200">1:1</td>
              <td className="p-3">Square format for IG sharing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mt-0 mb-1">The 80/20 rule</h4>
            <p className="text-blue-800 text-sm mb-0">
              If you only generate one image per page, make it <strong>1200×630</strong>. It
              renders correctly on every major platform. Twitter slightly crops the top and
              bottom, but the result still looks good. Don't burn engineering time generating
              5 different sizes if 1 will do the job.
            </p>
          </div>
        </div>
      </div>

      {/* The simple recipe */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recipe 1: The Simple One-Liner</h2>
      <p className="text-gray-700 leading-relaxed">
        Capture any URL at OG dimensions. This is the minimum viable preview generator:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url":    "https://example.com/blog/my-post",
    "width":  1200,
    "height": 630,
    "format": "jpeg"
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-4">
        The response includes a <span className="font-mono">screenshot_url</span> pointing to
        a Cloudflare R2-hosted image. You can drop that URL straight into your{' '}
        <span className="font-mono">&lt;meta&gt;</span> tags:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`<!-- Standard Open Graph -->
<meta property="og:image"        content="https://pub-xxx.r2.dev/screenshots/screenshot_xxx.jpeg" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta name="twitter:card"  content="summary_large_image" />
<meta name="twitter:image" content="https://pub-xxx.r2.dev/screenshots/screenshot_xxx.jpeg" />`}
        </pre>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mt-0 mb-1">Don't link directly to R2 URLs in production</h4>
            <p className="text-yellow-800 text-sm mb-0">
              R2 URLs work for <strong>7 days</strong>, then the file is automatically deleted.
              For permanent OG images, download the screenshot at publish time and host it on
              your own CDN. We'll cover the workflow in the "CDN strategy" section below.
            </p>
          </div>
        </div>
      </div>

      {/* The realistic recipe */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recipe 2: The Realistic Recipe</h2>
      <p className="text-gray-700 leading-relaxed">
        The simple recipe works for static pages. But real pages have cookie banners, late-
        loading hero images, and animations that aren't done by capture time. Here's what
        production-grade preview generation looks like:
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url":    "https://example.com/blog/my-post",
    "width":  1200,
    "height": 630,
    "format": "jpeg",

    "delay": 2,

    "remove_elements": [
      "#cookie-banner",
      "#onetrust-consent-sdk",
      ".gdpr-modal",
      ".newsletter-popup",
      ".chat-widget",
      "#sticky-header"
    ]
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-4">
        Two changes from the simple version:
      </p>
      <ul className="space-y-2 mt-3 text-gray-700">
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            <strong><span className="font-mono">delay: 2</span></strong> — gives the page 2
            extra seconds to finish lazy-loading hero images and font swaps. For most pages,
            2 seconds is the sweet spot. Sites with heavier animations may want 3–5.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">
            <strong><span className="font-mono">remove_elements</span></strong> — hides the
            three biggest preview killers: cookie banners (especially OneTrust), newsletter
            popups, and chat widgets. Whatever shows up on first visit needs to be hidden,
            because that's what social previews capture too.
          </span>
        </li>
      </ul>

      {/* The dynamic OG image trick */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recipe 3: The Dynamic OG Image</h2>
      <p className="text-gray-700 leading-relaxed">
        Instead of capturing your live blog post, build a dedicated{' '}
        <span className="font-mono">/og-preview/[slug]</span> page that renders an
        OG-optimized version: the article title, hero image, author, and your branding —
        no header, no sidebar, no comments section. Then point PixelPerfect at that page.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        This pattern is how Vercel, Linear, GitHub, and Stripe generate their preview images.
        The advantage: you control the exact composition. No surprises.
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">Example: a Next.js OG preview route</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// pages/og-preview/[slug].tsx
export default function OgPreview({ post }) {
  return (
    <div style={{
      width:      1200,
      height:     630,
      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      color:      'white',
      padding:    '60px',
      display:    'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div>
        <p style={{ fontSize: 24, opacity: 0.7 }}>{post.category}</p>
        <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
          {post.title}
        </h1>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <img src={post.author.avatar} width={64} height={64} style={{ borderRadius: 32 }} />
        <p style={{ fontSize: 24 }}>{post.author.name}</p>
      </div>
    </div>
  );
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-4">
        Then capture it from your CMS publish hook:
      </p>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url":    "https://example.com/og-preview/my-post-slug",
    "width":  1200,
    "height": 630,
    "format": "jpeg"
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Because the preview page has nothing but your designed content, you don't need{' '}
        <span className="font-mono">remove_elements</span> or a delay — capture is instant
        and predictable. This is the highest-quality approach.
      </p>

      {/* CDN strategy */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The CDN Caching Strategy</h2>
      <p className="text-gray-700 leading-relaxed">
        Don't link to PixelPerfect's R2 URLs from your <span className="font-mono">&lt;meta&gt;</span>{' '}
        tags in production. Two reasons:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-white border-2 border-red-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚠️</span>
            <h4 className="font-semibold text-gray-900 mb-0">7-day retention</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0">
            R2 files are auto-deleted after 7 days. If your blog post lives forever, your
            preview image needs to live forever too.
          </p>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💸</span>
            <h4 className="font-semibold text-gray-900 mb-0">Quota usage</h4>
          </div>
          <p className="text-sm text-gray-700 mb-0">
            Every social share triggers a fetch. If 10,000 people share your post, that's
            10,000 R2 reads — fine for R2, but every recapture costs you a screenshot from
            your monthly quota.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        The right pattern: <strong>capture once at publish time, store the result in your own
        CDN/storage forever.</strong>
      </p>

      <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">The capture-and-archive workflow</h4>
      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// Run this from your CMS "post published" webhook
import { writeFile } from "node:fs/promises";

async function captureAndStoreOgImage(postSlug) {
  // 1. Generate the screenshot
  const captureResp = await fetch(
    "https://api.pixelperfectapi.net/api/v1/screenshot",
    {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        url:    \`https://example.com/og-preview/\${postSlug}\`,
        width:  1200,
        height: 630,
        format: "jpeg",
      }),
    },
  );
  const result = await captureResp.json();

  // 2. Download the image bytes
  const imageResp  = await fetch(result.screenshot_url);
  const imageBytes = Buffer.from(await imageResp.arrayBuffer());

  // 3. Upload to YOUR CDN (S3, Cloudinary, R2, whatever you use)
  const permanentUrl = await uploadToYourCdn(
    \`og-images/\${postSlug}.jpeg\`,
    imageBytes,
    "image/jpeg",
  );

  // 4. Save the permanent URL on the post record
  await db.post.update({
    where: { slug: postSlug },
    data:  { og_image_url: permanentUrl },
  });

  return permanentUrl;
}`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Now your <span className="font-mono">&lt;meta property="og:image"&gt;</span> tag points
        to a URL you control, on storage that doesn't expire, and you only paid for one
        screenshot capture regardless of how many times the post is shared.
      </p>

      {/* Batch generation */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bulk Generation for Existing Content</h2>
      <p className="text-gray-700 leading-relaxed">
        Already have 200 published posts that need OG images? Use the batch endpoint to
        generate them all at once. This requires Pro tier or higher.
      </p>

      <div className="bg-gray-900 rounded-lg p-6 my-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`curl -X POST https://api.pixelperfectapi.net/api/v1/batch/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      "https://example.com/og-preview/post-1",
      "https://example.com/og-preview/post-2",
      "... 48 more URLs ..."
    ],
    "format": "jpeg",
    "width":  1200,
    "height": 630
  }'`}
        </pre>
      </div>

      <p className="text-gray-700 leading-relaxed mt-3">
        Pro tier processes up to 50 URLs per batch, Business handles 200, Premium handles
        1,000. See the{' '}
        <a href="/help/article/batch-processing-guide" className="text-blue-600 hover:underline">
          batch processing guide
        </a>{' '}
        for the full polling and result-handling pattern.
      </p>

      {/* Format choice */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">PNG vs JPEG vs WebP for OG Images</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Quick guide on which format to use:
      </p>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">JPEG — recommended default</h4>
          <p className="text-sm text-gray-700 mb-0">
            Smaller file size than PNG, broadly supported by every social platform, no
            transparency issues. <strong>Use this for OG images unless you have a specific
            reason not to.</strong> Files typically run 80–200 KB.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">PNG — when you need pixel-perfect text</h4>
          <p className="text-sm text-gray-700 mb-0">
            Lossless, larger files (300–600 KB typical), preserves crisp text and screenshot
            quality. Use if your preview has small fonts that JPEG compression makes blurry.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">WebP — don't use for OG (yet)</h4>
          <p className="text-sm text-gray-700 mb-0">
            WebP is 25–35% smaller than JPEG, but as of 2026 some social platforms still
            don't render WebP previews reliably. Stick with JPEG for OG. Use WebP for your
            own site's regular images.
          </p>
        </div>
      </div>

      {/* CMS integration patterns */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CMS Integration Patterns</h2>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">WordPress (publish hook)</h3>
      <p className="text-gray-700 leading-relaxed">
        Use the <span className="font-mono">save_post</span> action. Generate on publish,
        store the URL in post meta, output it from your theme's <span className="font-mono">&lt;head&gt;</span>:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`add_action('save_post', function($post_id) {
    if (wp_is_post_revision($post_id) || get_post_status($post_id) !== 'publish') {
        return;
    }

    $url = home_url("/og-preview/{$post_id}");
    $response = wp_remote_post('https://api.pixelperfectapi.net/api/v1/screenshot', [
        'headers' => [
            'Authorization' => 'Bearer ' . PIXELPERFECT_API_KEY,
            'Content-Type'  => 'application/json',
        ],
        'body' => json_encode([
            'url'    => $url,
            'width'  => 1200,
            'height' => 630,
            'format' => 'jpeg',
        ]),
    ]);

    if (!is_wp_error($response)) {
        $body = json_decode(wp_remote_retrieve_body($response), true);
        update_post_meta($post_id, '_og_image_url', $body['screenshot_url']);
    }
});`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Next.js (API route + ISR)</h3>
      <p className="text-gray-700 leading-relaxed">
        Generate at build time or via on-demand revalidation. Store the URL in your headless
        CMS or database, fetch it in <span className="font-mono">getStaticProps</span>:
      </p>
      <div className="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono">
{`// pages/api/regenerate-og.js
export default async function handler(req, res) {
  const { slug } = req.body;

  const captureResp = await fetch(
    'https://api.pixelperfectapi.net/api/v1/screenshot',
    {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.PIXELPERFECT_API_KEY}\`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        url:    \`\${process.env.SITE_URL}/og-preview/\${slug}\`,
        width:  1200,
        height: 630,
        format: 'jpeg',
      }),
    },
  );

  const { screenshot_url } = await captureResp.json();

  // Save to your DB / CMS / blob storage
  await savePermanentOgImage(slug, screenshot_url);

  // Trigger ISR for the post page
  await res.revalidate(\`/blog/\${slug}\`);
  return res.json({ ok: true });
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Static site generators (Hugo, Astro, Eleventy)</h3>
      <p className="text-gray-700 leading-relaxed">
        Generate at build time. Run a Node script before <span className="font-mono">npm run build</span>{' '}
        that captures all OG images, saves them to your <span className="font-mono">/static/</span> folder,
        and updates a JSON manifest your templates read from. Output the URLs at build time.
      </p>

      {/* Common pitfalls */}
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Pitfalls</h2>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My preview shows a cookie banner"</h4>
          <p className="text-sm text-gray-700">
            Add the banner's CSS selector to <span className="font-mono">remove_elements</span>.
            Inspect the page in Chrome DevTools to find the right selector. Common ones:{' '}
            <span className="font-mono">#onetrust-banner-sdk</span>,{' '}
            <span className="font-mono">#cookie-banner</span>,{' '}
            <span className="font-mono">.gdpr-modal</span>,{' '}
            <span className="font-mono">[id*="cookie"]</span>.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My hero image is missing from the preview"</h4>
          <p className="text-sm text-gray-700">
            The image was lazy-loading and hadn't appeared yet at capture time. Add a{' '}
            <span className="font-mono">delay: 3</span> to give the page time to load. Or
            switch to a dedicated <span className="font-mono">/og-preview/</span> page that
            doesn't lazy-load anything.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My fonts look wrong in the preview"</h4>
          <p className="text-sm text-gray-700">
            Custom fonts hadn't finished loading when the screenshot was captured. Add{' '}
            <span className="font-mono">delay: 2</span> to give the browser time to swap from
            fallback fonts to your real fonts. If using Google Fonts or a font CDN, this is
            almost always the cause.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"Twitter shows a different preview than Facebook"</h4>
          <p className="text-sm text-gray-700">
            Twitter caches OG previews aggressively. Use the{' '}
            <a href="https://cards-dev.twitter.com/validator" className="text-blue-600 hover:underline">
              Card Validator
            </a>{' '}
            to force a re-fetch. Facebook has a{' '}
            <a href="https://developers.facebook.com/tools/debug/" className="text-blue-600 hover:underline">
              similar debugger
            </a>. After updating your OG image URL, run both validators to refresh the platform caches.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My OG image changes when I update the post"</h4>
          <p className="text-sm text-gray-700">
            If you're regenerating the OG image every time the post updates AND using a stable
            URL on your CDN (e.g., <span className="font-mono">/og-images/post-slug.jpeg</span>),
            social platforms may continue showing the cached old version. Solutions: (1) include
            a content hash in the OG image URL so it changes when content changes, or
            (2) trigger Twitter Card Validator + Facebook Debugger after every update.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-2">"My preview is too dark / too light"</h4>
          <p className="text-sm text-gray-700">
            If your site uses <span className="font-mono">prefers-color-scheme</span>, the
            preview captures whatever Playwright's default is (light by default). Add{' '}
            <span className="font-mono">"dark_mode": true</span> if you want the dark version,
            or build a dedicated preview page that's design-locked to one theme.
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
            <p className="text-sm text-blue-700 mb-0">Generate previews for hundreds of posts in one API call</p>
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
            <h4 className="font-semibold text-green-900 mb-1">Website monitoring guide</h4>
            <p className="text-sm text-green-700 mb-0">Combine batch + scheduling for automated visual monitoring</p>
          </div>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="/help/article/screenshot-parameters-explained"
          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors no-underline"
        >
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Screenshot parameters explained</h4>
            <p className="text-sm text-purple-700 mb-0">Full reference for delay, remove_elements, and viewport tuning</p>
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
            <h4 className="text-sm font-semibold text-green-900 mt-0 mb-1">Ready to ship 📤</h4>
            <p className="text-green-800 text-sm mb-0">
              You know the right dimensions, the realistic recipe with delay and element
              removal, the dynamic OG-page pattern used by the best companies, the CDN
              caching strategy, and how to wire it all into your CMS. Time to make every
              shared link look great.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPreviewGuide;

// ===== END OF SocialMediaPreviewGuide.JSX =====