/**
 * articleSeo.js — derives SEO metadata for Help Center articles.
 * Place at: frontend/src/lib/articleSeo.js
 *
 * WHY THIS EXISTS
 * ---------------
 * helpArticles.js already carries title, excerpt, category and tags. That is a
 * complete set of SEO metadata for all 37 articles — no copywriting needed.
 * This module turns an article record into props for <SEO />.
 *
 * It also solves two problems that a naive wiring would ship straight to Google:
 *
 * 1. TWO ARTICLES RENDER NOTHING
 *    team-member-management and white-label-guide have component: null.
 *    They are marked noindex here and must stay out of the sitemap, otherwise
 *    they are guaranteed soft 404s.
 *
 * 2. SEVEN URLS RENDER THREE PAGES
 *    Three groups of articles share one component, so they serve byte-identical
 *    content at different URLs:
 *
 *      ManagingYourSubscriptionGuide  <- managing-your-subscription  (canonical)
 *                                       how-to-upgrade-plan
 *                                       cancellation-and-refunds
 *      AccountSecurityGuide          <- account-security             (canonical)
 *                                       two-factor-authentication
 *      GdprComplianceGuide           <- gdpr-compliance              (canonical)
 *                                       soc2-certification
 *
 *    Each secondary URL emits a canonical pointing at its primary, so ranking
 *    signals consolidate onto one page instead of splitting three ways. The
 *    pages stay reachable for users — only the canonical changes.
 *
 * NET RESULT: 37 articles -> 31 unique indexable URLs.
 */

import { getArticleBySlug, getCategoryById } from '../data/helpArticles';

export const ARTICLE_BASE = '/help/article';

/**
 * Secondary slug -> primary slug, for articles sharing a component.
 * The primary is the most comprehensive treatment of the topic.
 */
export const ARTICLE_CANONICAL = {
  'how-to-upgrade-plan': 'managing-your-subscription',
  'cancellation-and-refunds': 'managing-your-subscription',
  'two-factor-authentication': 'account-security',
  'soc2-certification': 'gdpr-compliance',
};

/** Articles with component: null — nothing renders, so never index them. */
export const ARTICLE_NOINDEX = new Set([
  'team-member-management',
  'white-label-guide',
]);

/**
 * Slugs that belong in sitemap.xml: excludes noindex articles and the
 * non-canonical members of each duplicate group.
 * Use this to keep routes.txt honest.
 */
export function indexableArticleSlugs(articles) {
  return articles
    .filter((a) => !ARTICLE_NOINDEX.has(a.slug))
    .filter((a) => !ARTICLE_CANONICAL[a.slug])
    .map((a) => a.slug);
}

/**
 * How category URLs are built for breadcrumbs.
 *
 * App.js declares  /help/category/:categoryId
 * but ArticleDetail.js links to  /help?category=<id>
 *
 * Two URL shapes for one concept. 'path' is the better choice for structured
 * data: a clean path ranks and reports better than a query string, and it
 * matches the declared route. Switch to 'query' only if you confirm that
 * /help/category/<id> does not actually render.
 */
export const CATEGORY_URL_STYLE = 'path';   // 'path' | 'query'

export function categoryUrl(categoryId) {
  return CATEGORY_URL_STYLE === 'query'
    ? `/help?category=${categoryId}`
    : `/help/category/${categoryId}`;
}

/** Title-cases a category id: 'advanced-features' -> 'Advanced Features'. */
function prettyCategory(categoryId) {
  const cat = getCategoryById(categoryId);
  if (cat?.name) return cat.name;
  return String(categoryId || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Builds a <title>. Aims for 50–60 characters.
 * Titles like "Python Integration Guide" are meaningful on their own; short
 * ones like "GDPR & compliance" get a qualifier so they read well in results.
 */
function buildTitle(article) {
  const base = article.title;
  const withSuffix = `${base} | PixelPerfect Help`;
  if (withSuffix.length <= 60) return withSuffix;
  if (base.length <= 60) return base;
  return `${base.slice(0, 57).trimEnd()}…`;
}

/**
 * Meta description. `excerpt` is already written at roughly the right length,
 * so it is used as-is and only truncated on a word boundary if oversized.
 */
function buildDescription(article) {
  const text = (article.excerpt || '').trim();
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/**
 * Main entry point. Returns props to spread into <SEO />.
 *
 *   const seo = getArticleSeo(article);
 *   <SEO {...seo.props} jsonLd={seo.jsonLd} />
 */
export function getArticleSeo(article, { datePublished, dateModified } = {}) {
  if (!article) return null;

  const canonicalSlug = ARTICLE_CANONICAL[article.slug] || article.slug;
  const canonicalArticle =
    canonicalSlug === article.slug ? article : getArticleBySlug(canonicalSlug) || article;

  const path = `${ARTICLE_BASE}/${canonicalSlug}`;
  const noindex = ARTICLE_NOINDEX.has(article.slug);
  const categoryName = prettyCategory(article.category);

  const props = {
    title: buildTitle(article),
    description: buildDescription(article),
    path,
    noindex,
  };

  // No structured data for pages that render nothing.
  const jsonLd = noindex
    ? null
    : {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'TechArticle',
            headline: canonicalArticle.title,
            description: buildDescription(canonicalArticle),
            url: `https://pixelperfectapi.net${path}`,
            articleSection: categoryName,
            keywords: (article.tags || []).join(', '),
            ...(datePublished ? { datePublished } : {}),
            ...(dateModified || datePublished
              ? { dateModified: dateModified || datePublished }
              : {}),
            author: { '@type': 'Organization', name: 'PixelPerfect' },
            publisher: {
              '@type': 'Organization',
              name: 'PixelPerfect',
              logo: {
                '@type': 'ImageObject',
                url: 'https://pixelperfectapi.net/favicons/android-chrome-512x512.png',
              },
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pixelperfectapi.net/' },
              { '@type': 'ListItem', position: 2, name: 'Help Center', item: 'https://pixelperfectapi.net/help' },
              {
                '@type': 'ListItem',
                position: 3,
                name: categoryName,
                item: `https://pixelperfectapi.net${categoryUrl(article.category)}`,
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: article.title,
                item: `https://pixelperfectapi.net${path}`,
              },
            ],
          },
        ],
      };

  return { props, jsonLd };
}

// ====== END OF articleSeo.js =====
