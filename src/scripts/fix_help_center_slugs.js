#!/usr/bin/env node
/* eslint-disable */
// ============================================================================
// PIXELPERFECT HELP CENTER - SLUG RECONCILIATION PATCH
// ============================================================================
// File: scripts/fix_help_center_slugs.js
// Author: OneTechly
// Date:   April 26, 2026
//
// Purpose:
//   The 8 article files for the Security & Privacy and Account Management
//   categories were authored using slugs that didn't match the canonical
//   slugs already registered in helpArticles.js. This script rewrites the
//   internal cross-reference links inside those article files so they
//   match the canonical slugs.
//
//   Without this fix, clicking "Next Steps" or "Related" links inside an
//   article would land on a "Guide Coming Soon" fallback page even though
//   the target article exists.
//
// Usage:
//   1. Make sure your article files are at frontend/src/guides/
//   2. From the repo root:
//        node scripts/fix_help_center_slugs.js
//      Or with the path to your guides folder:
//        node scripts/fix_help_center_slugs.js frontend/src/guides
//   3. Review the diff with `git diff` before committing.
//   4. After running once successfully, you can delete this script.
//
// Safety:
//   - Operates only on the 8 specific files listed in TARGET_FILES below.
//   - Performs literal string replacement — won't touch unrelated href values.
//   - Idempotent: running it twice is harmless (second run finds no
//     occurrences of the OLD slugs).
//
// Slug map (OLD slug used by article cross-links → CANONICAL slug in
// helpArticles.js):
//
//   data-retention-and-privacy   → data-retention-policy
//   api-key-best-practices       → api-key-security-best-practices
//   gdpr-and-compliance          → gdpr-compliance
//   managing-your-profile        → updating-account-details
//   changing-your-password       → password-reset
//
//   (account-security, managing-your-subscription, deleting-your-account
//    keep their original slugs — they were the canonical choices.)
// ============================================================================

const fs   = require('fs');
const path = require('path');

const SLUG_MAP = {
  'data-retention-and-privacy': 'data-retention-policy',
  'api-key-best-practices':     'api-key-security-best-practices',
  'gdpr-and-compliance':        'gdpr-compliance',
  'managing-your-profile':      'updating-account-details',
  'changing-your-password':     'password-reset',
};

const TARGET_FILES = [
  'ApiKeyBestPracticesGuide.jsx',
  'DataRetentionPrivacyGuide.jsx',
  'AccountSecurityGuide.jsx',
  'GdprComplianceGuide.jsx',
  'ManagingYourProfileGuide.jsx',
  'ChangingYourPasswordGuide.jsx',
  'ManagingYourSubscriptionGuide.jsx',
  'DeletingYourAccountGuide.jsx',
];

// Default guides directory; can be overridden by passing a path as argv[2].
const guidesDir = process.argv[2] || 'frontend/src/guides';

if (!fs.existsSync(guidesDir)) {
  console.error(`❌ Guides directory not found: ${guidesDir}`);
  console.error(`   Pass the correct path as the first argument:`);
  console.error(`   node scripts/fix_help_center_slugs.js path/to/guides`);
  process.exit(1);
}

console.log(`🔍 Scanning ${TARGET_FILES.length} article files in: ${guidesDir}`);
console.log('');

let totalReplacements = 0;
let filesTouched      = 0;

for (const filename of TARGET_FILES) {
  const filepath = path.join(guidesDir, filename);

  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  ${filename}  (not found, skipping)`);
    continue;
  }

  let content = fs.readFileSync(filepath, 'utf8');
  let fileReplacements = 0;

  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    // Match the slug only when it appears inside a /help/article/ href.
    // Negative lookbehind/lookahead would be ideal, but we keep it simple:
    // the slugs are distinctive enough that literal replacement is safe.
    const oldHref = `/help/article/${oldSlug}`;
    const newHref = `/help/article/${newSlug}`;

    // Count occurrences before replacing (split returns N+1 chunks for N hits)
    const occurrences = content.split(oldHref).length - 1;

    if (occurrences > 0) {
      content = content.split(oldHref).join(newHref);
      fileReplacements += occurrences;
    }
  }

  if (fileReplacements > 0) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ ${filename}  (${fileReplacements} link${fileReplacements === 1 ? '' : 's'} updated)`);
    totalReplacements += fileReplacements;
    filesTouched++;
  } else {
    console.log(`✓  ${filename}  (no changes needed — already canonical)`);
  }
}

console.log('');
console.log('─────────────────────────────────────────────────────────');
console.log(`Done. ${totalReplacements} cross-reference link${totalReplacements === 1 ? '' : 's'} updated across ${filesTouched} file${filesTouched === 1 ? '' : 's'}.`);
console.log('');
console.log('Next steps:');
console.log('  1. Run `git diff` to review the changes');
console.log('  2. Test in dev: npm start, then click through Next Steps cards');
console.log('  3. Commit when satisfied');
console.log('  4. This script can be deleted after one successful run');