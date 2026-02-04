// ========================================
// BLOG POST PAGE - PIXELPERFECT (PRO)
// ========================================
// Individual blog article page
// ✅ Professional Markdown renderer (NO dangerouslySetInnerHTML)
// ✅ VSCode-style code blocks with language label + copy button
// ✅ Uses your existing .code-block CSS in index.css

import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import { getPostBySlug, getAllPosts } from '../data/blogData';

function CodeBlock({ language = 'text', code = '' }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback for older browsers / restrictive contexts
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="code-block">
      {/* top bar */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
          {language}
        </span>

        <button
          onClick={onCopy}
          className={`text-xs font-semibold px-3 py-1 rounded-md border transition-colors ${
            copied
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-600'
          }`}
          type="button"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* code */}
      <pre className="m-0 bg-transparent p-0 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Inline({ text }) {
  // Renders **bold**, `inline code`, and [links](url) safely as React nodes.
  // This is a minimal parser (fast + predictable) designed for marketing docs.
  const nodes = useMemo(() => {
    if (!text) return [];

    // Split by backticks first to preserve inline code segments
    const parts = text.split(/(`[^`]+`)/g);

    return parts.flatMap((part, idx) => {
      // Inline code: `something`
      if (part.startsWith('`') && part.endsWith('`')) {
        const inner = part.slice(1, -1);
        return (
          <code key={`code-${idx}`} className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">
            {inner}
          </code>
        );
      }

      // For non-code text: handle **bold** and [links](url)
      const out = [];
      let cursor = 0;

      const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
      let match;

      while ((match = regex.exec(part)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;

        if (start > cursor) {
          out.push(part.slice(cursor, start));
        }

        const token = match[0];

        // **bold**
        if (token.startsWith('**') && token.endsWith('**')) {
          out.push(
            <strong key={`b-${idx}-${start}`} className="text-gray-900 font-semibold">
              {token.slice(2, -2)}
            </strong>
          );
        }

        // [text](url)
        if (token.startsWith('[')) {
          const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (m) {
            const label = m[1];
            const href = m[2];
            const isInternal = href.startsWith('/');

            out.push(
              <a
                key={`a-${idx}-${start}`}
                href={href}
                onClick={(e) => {
                  if (isInternal) {
                    e.preventDefault();
                    window.history.pushState({}, '', href);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="text-blue-600 hover:underline"
              >
                {label}
              </a>
            );
          } else {
            out.push(token);
          }
        }

        cursor = end;
      }

      if (cursor < part.length) out.push(part.slice(cursor));
      return <React.Fragment key={`t-${idx}`}>{out}</React.Fragment>;
    });
  }, [text]);

  return <>{nodes}</>;
}

function renderMarkdown(md) {
  const lines = (md || '').replace(/\r\n/g, '\n').split('\n');

  const blocks = [];
  let i = 0;

  let inCode = false;
  let codeLang = 'text';
  let codeLines = [];

  let listMode = null; // 'ul' | 'ol'
  let listItems = [];

  const flushList = () => {
    if (!listMode || listItems.length === 0) return;
    const key = `list-${blocks.length}`;
    blocks.push(
      listMode === 'ul' ? (
        <ul key={key} className="my-4 list-disc pl-6 space-y-2">
          {listItems.map((t, idx) => (
            <li key={`${key}-${idx}`} className="text-gray-700">
              <Inline text={t} />
            </li>
          ))}
        </ul>
      ) : (
        <ol key={key} className="my-4 list-decimal pl-6 space-y-2">
          {listItems.map((t, idx) => (
            <li key={`${key}-${idx}`} className="text-gray-700">
              <Inline text={t} />
            </li>
          ))}
        </ol>
      )
    );
    listMode = null;
    listItems = [];
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw?.trimEnd() ?? '';

    // Code fences
    const fence = line.trim();
    if (fence.startsWith('```')) {
      const fenceLang = fence.replace('```', '').trim();

      if (!inCode) {
        flushList();
        inCode = true;
        codeLang = fenceLang || 'text';
        codeLines = [];
      } else {
        // closing fence
        blocks.push(
          <CodeBlock
            key={`code-${blocks.length}`}
            language={codeLang}
            code={codeLines.join('\n').trimEnd()}
          />
        );
        inCode = false;
        codeLang = 'text';
        codeLines = [];
      }

      i += 1;
      continue;
    }

    if (inCode) {
      codeLines.push(raw); // preserve exact spacing
      i += 1;
      continue;
    }

    // Blank line => paragraph break / list flush
    if (!line.trim()) {
      flushList();
      i += 1;
      continue;
    }

    // Headings
    if (line.startsWith('## ')) {
      flushList();
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          {line.slice(3)}
        </h2>
      );
      i += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="text-xl font-bold text-gray-900 mt-6 mb-3">
          {line.slice(4)}
        </h3>
      );
      i += 1;
      continue;
    }

    // Unordered list "- "
    if (line.startsWith('- ')) {
      if (listMode && listMode !== 'ul') flushList();
      listMode = 'ul';
      listItems.push(line.slice(2).trim());
      i += 1;
      continue;
    }

    // Ordered list "1. "
    if (/^\d+\.\s/.test(line)) {
      if (listMode && listMode !== 'ol') flushList();
      listMode = 'ol';
      listItems.push(line.replace(/^\d+\.\s/, '').trim());
      i += 1;
      continue;
    }

    // Paragraph
    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-gray-700 leading-relaxed mb-4">
        <Inline text={line} />
      </p>
    );
    i += 1;
  }

  flushList();

  // If someone forgets to close a fence, still render it
  if (inCode && codeLines.length) {
    blocks.push(
      <CodeBlock
        key={`code-${blocks.length}`}
        language={codeLang}
        code={codeLines.join('\n').trimEnd()}
      />
    );
  }

  return blocks;
}

const BlogPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();

  const relatedPosts = allPosts.filter((p) => p.id !== post?.id).slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Post Not Found</h1>
          <button onClick={() => navigate('/blog')} className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const categoryColors = {
    Monitoring: 'bg-purple-100 text-purple-800',
    Tutorial: 'bg-blue-100 text-blue-800',
    Guide: 'bg-green-100 text-green-800',
    News: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText={true} />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/blog')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                ← Back to Blog
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                categoryColors[post.category] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{post.author}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 lg:p-12">
          {/* Clean, deterministic Markdown rendering */}
          <div className="max-w-none">{renderMarkdown(post.content)}</div>

          {/* Social Share */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex gap-3 flex-wrap">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Twitter
              </button>
              <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm font-medium">
                LinkedIn
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(window.location.href);
                  } catch {
                    // ignore
                  }
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.id}
                onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 h-32 flex items-center justify-center">
                  <div className="text-white text-4xl">
                    {relatedPost.category === 'Monitoring' && '📊'}
                    {relatedPost.category === 'Tutorial' && '💻'}
                    {relatedPost.category === 'Guide' && '📖'}
                    {relatedPost.category === 'News' && '📰'}
                  </div>
                </div>
                <div className="p-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[relatedPost.category]}`}>
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2">{relatedPost.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-600 py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6 text-sm sm:text-base">
            Join thousands of developers using PixelPerfect to capture perfect screenshots.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
              <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <button onClick={() => navigate('/privacy')} className="hover:text-white">
                Privacy
              </button>
              <button onClick={() => navigate('/terms')} className="hover:text-white">
                Terms
              </button>
              <button onClick={() => navigate('/cookies')} className="hover:text-white">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;

