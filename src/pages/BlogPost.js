// ========================================
// BLOG POST PAGE - PIXELPERFECT
// ========================================
// Individual blog article page
// Mobile-responsive, production-ready
// ✅ FIXED: Prose classes now allow custom code blocks to render properly

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import { getPostBySlug, getAllPosts } from '../data/blogData';

const BlogPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();
  
  // Get related posts (exclude current post)
  const relatedPosts = allPosts
    .filter(p => p.id !== post?.id)
    .slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Post Not Found</h1>
          <button
            onClick={() => navigate('/blog')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Category colors
  const categoryColors = {
    'Monitoring': 'bg-purple-100 text-purple-800',
    'Tutorial': 'bg-blue-100 text-blue-800',
    'Guide': 'bg-green-100 text-green-800',
    'News': 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo 
                size={window.innerWidth < 640 ? 32 : 40} 
                showText={true} 
              />
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
          {/* Category Badge */}
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 lg:p-12">
          {/* ========================================
              ARTICLE BODY - CRITICAL FIX
              ========================================
              ✅ prose-code:bg-transparent - Don't override inline code
              ✅ prose-code:p-0 - Remove default padding
              ✅ prose-code:text-inherit - Use custom colors
              ✅ prose-pre:bg-transparent - Don't override code blocks
              ✅ prose-pre:p-0 - Remove default padding
              ✅ prose-pre:m-0 - Remove default margin
              
              This allows our custom .code-block styling to work properly!
          */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
              prose-li:text-gray-700 prose-li:mb-2
              prose-code:bg-transparent prose-code:p-0 prose-code:text-inherit
              prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .split('\n')
                .map(line => {
                  // Convert markdown-style headers
                  if (line.startsWith('## ')) {
                    return `<h2>${line.substring(3)}</h2>`;
                  }
                  if (line.startsWith('### ')) {
                    return `<h3>${line.substring(4)}</h3>`;
                  }
                  // Convert bold text
                  line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  // Convert inline code (but not if it's inside a code block)
                  line = line.replace(/`([^`]+)`/g, '<code>$1</code>');
                  // Convert links
                  line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
                  // Convert code blocks - but leave HTML pre tags alone
                  if (line.startsWith('```')) {
                    return line.includes('```') && line.length > 3 ? '<pre><code>' : '</code></pre>';
                  }
                  return line ? `<p>${line}</p>` : '';
                })
                .join('')
            }}
          />

          {/* Social Share */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Twitter
              </button>
              <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm font-medium">
                LinkedIn
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">
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
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-600 py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
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

export default BlogPost;

////////////////////////////////////////////////////////////////////////
// // ========================================
// // BLOG POST PAGE - PIXELPERFECT
// // ========================================
// // Individual blog article page
// // Mobile-responsive, production-ready

// import React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';
// import { getPostBySlug, getAllPosts } from '../data/blogData';

// const BlogPost = () => {
//   const navigate = useNavigate();
//   const { slug } = useParams();
//   const post = getPostBySlug(slug);
//   const allPosts = getAllPosts();
  
//   // Get related posts (exclude current post)
//   const relatedPosts = allPosts
//     .filter(p => p.id !== post?.id)
//     .slice(0, 3);

//   if (!post) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Post Not Found</h1>
//           <button
//             onClick={() => navigate('/blog')}
//             className="text-blue-600 hover:text-blue-700 font-semibold"
//           >
//             ← Back to Blog
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Category colors
//   const categoryColors = {
//     'Monitoring': 'bg-purple-100 text-purple-800',
//     'Tutorial': 'bg-blue-100 text-blue-800',
//     'Guide': 'bg-green-100 text-green-800',
//     'News': 'bg-yellow-100 text-yellow-800'
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/')}>
//               <PixelPerfectLogo 
//                 size={window.innerWidth < 640 ? 32 : 40} 
//                 showText={true} 
//               />
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3">
//               <button
//                 onClick={() => navigate('/blog')}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
//               >
//                 ← Back to Blog
//               </button>
//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Article Header */}
//       <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Category Badge */}
//           <div className="mb-4">
//             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
//               {post.category}
//             </span>
//           </div>

//           {/* Title */}
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
//             {post.title}
//           </h1>

//           {/* Meta Information */}
//           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//             <div className="flex items-center gap-2">
//               <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//               </svg>
//               <span className="font-medium">{post.author}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//               </svg>
//               <span>{post.date}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//               </svg>
//               <span>{post.readTime}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Article Content */}
//       <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 lg:p-12">
//           {/* Article Body */}
//           <div 
//             className="prose prose-lg max-w-none
//               prose-headings:font-bold prose-headings:text-gray-900
//               prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
//               prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
//               prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
//               prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
//               prose-strong:text-gray-900 prose-strong:font-semibold
//               prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
//               prose-li:text-gray-700 prose-li:mb-2
//               prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
//               prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
//             dangerouslySetInnerHTML={{ 
//               __html: post.content
//                 .split('\n')
//                 .map(line => {
//                   // Convert markdown-style headers
//                   if (line.startsWith('## ')) {
//                     return `<h2>${line.substring(3)}</h2>`;
//                   }
//                   if (line.startsWith('### ')) {
//                     return `<h3>${line.substring(4)}</h3>`;
//                   }
//                   // Convert bold text
//                   line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//                   // Convert inline code
//                   line = line.replace(/`([^`]+)`/g, '<code>$1</code>');
//                   // Convert links
//                   line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
//                   // Convert code blocks
//                   if (line.startsWith('```')) {
//                     return line.includes('```') && line.length > 3 ? '<pre><code>' : '</code></pre>';
//                   }
//                   return line ? `<p>${line}</p>` : '';
//                 })
//                 .join('')
//             }}
//           />

//           {/* Social Share */}
//           <div className="mt-12 pt-8 border-t border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
//             <div className="flex gap-3">
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
//                 Twitter
//               </button>
//               <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm font-medium">
//                 LinkedIn
//               </button>
//               <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">
//                 Copy Link
//               </button>
//             </div>
//           </div>
//         </div>
//       </article>

//       {/* Related Posts */}
//       {relatedPosts.length > 0 && (
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {relatedPosts.map((relatedPost) => (
//               <article 
//                 key={relatedPost.id}
//                 onClick={() => navigate(`/blog/${relatedPost.slug}`)}
//                 className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
//               >
//                 <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 h-32 flex items-center justify-center">
//                   <div className="text-white text-4xl">
//                     {relatedPost.category === 'Monitoring' && '📊'}
//                     {relatedPost.category === 'Tutorial' && '💻'}
//                     {relatedPost.category === 'Guide' && '📖'}
//                     {relatedPost.category === 'News' && '📰'}
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[relatedPost.category]}`}>
//                     {relatedPost.category}
//                   </span>
//                   <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2">
//                     {relatedPost.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 line-clamp-2">
//                     {relatedPost.excerpt}
//                   </p>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* CTA Section */}
//       <section className="bg-blue-600 py-12 mt-16">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
//             Ready to Get Started?
//           </h2>
//           <p className="text-blue-100 mb-6 text-sm sm:text-base">
//             Join thousands of developers using PixelPerfect to capture perfect screenshots.
//           </p>
//           <button
//             onClick={() => navigate('/register')}
//             className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
//           >
//             Start Free Trial
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
//               <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
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

// export default BlogPost;