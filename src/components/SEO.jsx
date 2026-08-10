/**
 * SEO.jsx — per-page title, description, canonical, OG/Twitter, and JSON-LD.
 * Place at: frontend/src/components/SEO.jsx
 *
 * WHY THIS EXISTS
 * ---------------
 * Every route serves the same public/index.html. That file used to hardcode
 * <link rel="canonical" href="https://pixelperfectapi.net/">, so every page
 * told Google "I'm a duplicate of the homepage." Google obeyed — hence
 * Indexed: 1 in Search Console.
 *
 * SETUP (once)
 *   1. npm install react-helmet-async            [done]
 *   2. Wrap the app in <HelmetProvider> in src/index.js
 *   3. Remove canonical / og:url / twitter:url from public/index.html [done]
 *   4. Add <SEO ... /> as the first child of each page component
 *
 * ALIAS HANDLING
 * --------------
 * Four routes render the same component at two URLs:
 *     /documentation -> /docs      /help-center -> /help
 *     /api-status    -> /status    /signup      -> /register
 * Pass the ALIAS path and this component resolves it to the canonical target
 * automatically, so both URLs emit the same canonical and link equity merges.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

export const ORIGIN = 'https://pixelperfectapi.net';
const DEFAULT_OG = `${ORIGIN}/favicons/social-media/pixelperfect-og-image.png`;
const DEFAULT_TW = `${ORIGIN}/favicons/social-media/pixelperfect-twitter-card.png`;

/** Alias route -> canonical route. Verified against App.js. */
export const CANONICAL_ALIASES = {
  '/documentation': '/docs',
  '/help-center': '/help',
  '/api-status': '/status',
  '/signup': '/register',
};

export function canonicalPath(path) {
  const clean = path !== '/' ? path.replace(/\/+$/, '') : '/';
  return CANONICAL_ALIASES[clean] || clean;
}

export default function SEO({
  title,
  description,
  path = '/',
  image = DEFAULT_OG,
  twitterImage = DEFAULT_TW,
  noindex = false,
  jsonLd = null,
}) {
  const canonical = `${ORIGIN}${canonicalPath(path)}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow'}
      />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="PixelPerfect" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

/* ==========================================================================
   PAGE_SEO — every static route's copy in one place.
   Import into each page: <SEO {...PAGE_SEO['/pricing']} />
   Titles 50–60 chars; descriptions ~155 chars. Lead with the search term,
   not the brand name — "PixelPerfect" collides with generic category copy
   used by ScreenshotOne, ApiFlash, Restpack and Context.dev.
   ========================================================================== */

export const PAGE_SEO = {
  '/': {
    path: '/',
    title: 'Website Screenshot API — Capture Any URL as an Image | PixelPerfect',
    description:
      'Take full-page website screenshots with a single HTTP request. No Puppeteer to maintain, no headless browser cluster to run. Free tier available.',
  },
  '/pricing': {
    path: '/pricing',
    title: 'Screenshot API Pricing — Plans from $49/mo | PixelPerfect',
    description:
      'Compare PixelPerfect screenshot API plans. Pro $49/mo, Business $149/mo, Premium $499/mo. Save 16% on annual billing. Free tier included.',
  },
  '/features': {
    path: '/features',
    title: 'Screenshot API Features — Full Page, Element & Batch Capture',
    description:
      'Full-page and viewport capture, element selection, batch jobs, custom viewports and configurable formats. Everything the PixelPerfect API supports.',
  },
  '/docs': {
    path: '/docs',
    title: 'Screenshot API Documentation — Endpoints & Parameters',
    description:
      'Complete REST reference for the PixelPerfect screenshot API: authentication, request parameters, response formats, rate limits and error codes.',
  },
  '/api': {
    path: '/api',
    title: 'REST Screenshot API — Capture Websites Programmatically',
    description:
      'A simple REST API for website screenshots. Send a URL, get an image back. Works from any language that can make an HTTP request.',
  },
  '/guides': {
    path: '/guides',
    title: 'Screenshot API Guides & Tutorials | PixelPerfect',
    description:
      'Step-by-step guides for capturing website screenshots in Python, Node.js and other languages, plus common integration patterns.',
  },
  '/status': {
    path: '/status',
    title: 'API Status & Uptime | PixelPerfect',
    description:
      'Live operational status and uptime for the PixelPerfect screenshot API.',
  },
  '/help': {
    path: '/help',
    title: 'Help Center — Screenshot API Support | PixelPerfect',
    description:
      'Answers on API keys, billing, screenshot options, storage and troubleshooting for the PixelPerfect screenshot API.',
  },
  '/faq': {
    path: '/faq',
    title: 'Screenshot API FAQ — Common Questions Answered',
    description:
      'How long screenshots are stored, what the free tier includes, supported formats, rate limits and billing — answered.',
  },
  '/contact': {
    path: '/contact',
    title: 'Contact PixelPerfect — Screenshot API Support',
    description:
      'Get in touch about the PixelPerfect screenshot API: technical questions, billing help or enterprise enquiries.',
  },
  '/blog': {
    path: '/blog',
    title: 'PixelPerfect Blog — Screenshot API Engineering Notes',
    description:
      'Practical writing on headless browser automation, screenshot capture at scale and building on the PixelPerfect API.',
  },
  '/about': {
    path: '/about',
    title: 'About PixelPerfect — Screenshot API by OneTechly',
    description:
      'PixelPerfect is a screenshot API built by OneTechly, LLC for developers who would rather not run their own browser fleet.',
  },
  '/community': {
    path: '/community',
    title: 'Community | PixelPerfect Screenshot API',
    description:
      'Connect with other developers building on the PixelPerfect screenshot API.',
  },
  '/careers': {
    path: '/careers',
    title: 'Careers at OneTechly | PixelPerfect',
    description: 'Open roles at OneTechly, LLC, makers of the PixelPerfect screenshot API.',
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy | PixelPerfect',
    description: 'How PixelPerfect collects, stores and handles your data.',
  },
  '/terms': {
    path: '/terms',
    title: 'Terms of Service | PixelPerfect',
    description: 'Terms governing use of the PixelPerfect screenshot API, including refund policy.',
  },
  '/cookies': {
    path: '/cookies',
    title: 'Cookie Policy | PixelPerfect',
    description: 'How PixelPerfect uses cookies and similar technologies.',
  },
  '/login': {
    path: '/login',
    title: 'Sign In | PixelPerfect Screenshot API',
    description: 'Sign in to your PixelPerfect account to manage API keys and usage.',
  },
  '/register': {
    path: '/register',
    title: 'Create a Free Account | PixelPerfect Screenshot API',
    description:
      'Sign up free and start capturing website screenshots in minutes. No credit card required for the free tier.',
  },
};

/* ==========================================================================
   JSON-LD BUILDERS — validate at https://validator.schema.org before shipping
   ========================================================================== */

/** Site-wide identity. Homepage only. Distinguishes the PixelPerfect entity
 *  from the generic phrase "pixel perfect". */
export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PixelPerfect',
  legalName: 'OneTechly, LLC',
  url: ORIGIN,
  logo: `${ORIGIN}/favicons/android-chrome-512x512.png`,
  description:
    'Screenshot API for developers. Capture any URL as an image with a single HTTP request.',
  sameAs: [
    // Only list profiles you actually control — these are strong entity signals.
    'https://github.com/Ambro19',
    // 'https://rapidapi.com/...',
    // 'https://www.linkedin.com/company/...',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'onetechly@gmail.com',
    url: `${ORIGIN}/contact`,
  },
};

/** The product. Homepage and pricing page.
 *  VERIFY these prices against config/pricing.js before shipping — mismatched
 *  structured data is worse than none. */
export const softwareApplicationLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PixelPerfect Screenshot API',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any (REST API)',
  url: ORIGIN,
  description:
    'REST API that captures full-page and viewport screenshots of any website. ' +
    'Replaces self-managed Puppeteer and headless Chrome clusters.',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', url: `${ORIGIN}/pricing` },
    { '@type': 'Offer', name: 'Pro', price: '49.00', priceCurrency: 'USD', url: `${ORIGIN}/pricing` },
    { '@type': 'Offer', name: 'Business', price: '149.00', priceCurrency: 'USD', url: `${ORIGIN}/pricing` },
    { '@type': 'Offer', name: 'Premium', price: '499.00', priceCurrency: 'USD', url: `${ORIGIN}/pricing` },
  ],
  // Do NOT add aggregateRating without genuine public reviews — manual-action risk.
};

/** FAQ blocks can earn expandable search results.
 *  Only use where the Q&A is genuinely visible on the page. */
export function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

/** Breadcrumbs for /help/article/:slug, /help/category/:categoryId, /guides/:guideId */
export function breadcrumbLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(({ name, path }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${ORIGIN}${path}`,
    })),
  };
}

/** Help articles, guides and blog posts. */
export function articleLd({ headline, description, path, datePublished, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url: `${ORIGIN}${path}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: 'PixelPerfect' },
    publisher: {
      '@type': 'Organization',
      name: 'PixelPerfect',
      logo: {
        '@type': 'ImageObject',
        url: `${ORIGIN}/favicons/android-chrome-512x512.png`,
      },
    },
  };
}