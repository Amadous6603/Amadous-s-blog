import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { getPost } from '../api';
import TableOfContents from '../components/TableOfContents';
import type { Post, TocItem } from '../types';

marked.setOptions({ breaks: true, gfm: true });

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([2-3])\s+id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    items.push({ id: match[2], text: match[3].replace(/<[^>]*>/g, ''), level: parseInt(match[1]) });
  }
  return items;
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getPost(id!)
      .then((res) => {
        setPost(res.data);
        const isMarkdown = !/<[a-zA-Z][\s\S]*?>/.test(res.data.content);
        const html = isMarkdown ? marked.parse(res.data.content) as string : res.data.content;
        setToc(extractToc(html));
      })
      .catch((err) => {
        if (err.response?.status === 404) setError('not_found');
        else setError('加载文章失败');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center py-24 gap-5">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-accent rounded-full animate-spin" />
      <span className="font-mono text-xs uppercase tracking-widest text-muted">翻开书页...</span>
    </div>
  );

  if (error === 'not_found') return (
    <div className="text-center py-32">
      <div className="font-display text-8xl font-black text-gray-200 leading-none mb-[-20px]">404</div>
      <h2 className="font-display text-2xl font-bold mb-3">这一页不在此处</h2>
      <p className="text-muted mb-8">书架里没有这本书。</p>
      <Link to="/" className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded border border-accent/30 text-muted hover:text-accent hover:bg-accent-glow transition-all no-underline">&larr; 返回书架</Link>
    </div>
  );

  if (error) return (
    <div className="text-center py-24">
      <h2 className="font-display text-2xl mb-2">出错了</h2>
      <p className="text-muted mb-6">{error}</p>
      <Link to="/" className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded border border-accent/30 text-muted hover:text-accent hover:bg-accent-glow transition-all no-underline">&larr; 返回</Link>
    </div>
  );

  if (!post) return null;

  const isMarkdown = !/<[a-zA-Z][\s\S]*?>/.test(post.content);
  const renderedContent = isMarkdown ? marked.parse(post.content) as string : post.content;

  return (
    <>
      {toc.length > 0 && <TableOfContents items={toc} contentRef={contentRef} />}
      <article className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-accent transition-colors mb-12 no-underline">&larr; 返回书架</Link>
        <header className="text-center mb-12">
          {post.category && <div className="inline-block font-mono text-xs uppercase tracking-wider text-accent px-3 py-1 border border-accent/20 rounded mb-4">{post.category}</div>}
          <div className="font-mono text-xs uppercase tracking-widest text-muted mb-5">{formatDate(post.createdAt)}</div>
          <h1 className="font-display text-4xl font-black text-gray-800 leading-tight mb-5">{post.title}</h1>
          <div className="text-sm italic text-gray-500">By {post.author}</div>
        </header>
        <div className="w-16 h-px bg-accent/40 mx-auto mb-12" />
        <div ref={contentRef} className="prose-article" dangerouslySetInnerHTML={{ __html: renderedContent }} />
      </article>
    </>
  );
}
