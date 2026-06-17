import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts, getCategories } from '../api';
import type { Post, PostListResponse } from '../types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<PostListResponse>({ content: [], page: 0, totalPages: 1, totalElements: 0, last: false });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  const page = parseInt(searchParams.get('page') || '0');
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const fetchPosts = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, size: 10 };
    if (q) params.q = q;
    if (category) params.category = category;
    getPosts(params).then((res) => setData(res.data)).catch(() => setError('加载文章失败')).finally(() => setLoading(false));
  }, [page, q, category]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { getCategories().then((res) => setCategories(res.data)).catch(() => {}); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set('q', trimmed);
    if (category) params.set('category', category);
    setSearchParams(params);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    if (p <= 0) params.delete('page'); else params.set('page', String(p));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat) params.set('category', cat); else params.delete('category');
    params.delete('page');
    setSearchParams(params);
  };

  if (error) {
    return <div className="text-center py-24"><h2 className="font-display text-2xl mb-2">出错了</h2><p className="text-muted">{error}</p></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <p className="font-body text-base italic text-muted mb-10">在这里，记录一些值得被留下的瞬间。</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex mb-4 rounded-md overflow-hidden border border-white/20 focus-within:border-accent transition-colors glass">
        <input type="text" className="flex-1 bg-transparent border-none px-4 py-3 text-gray-800 placeholder:text-muted outline-none font-body"
          placeholder="搜索文章..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        <button type="submit" className="bg-transparent border-none border-l border-white/20 px-4 text-muted hover:text-accent font-mono cursor-pointer transition-colors">&rarr;</button>
      </form>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setCategory('')}
            className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded border transition-all cursor-pointer ${!category ? 'border-accent text-accent bg-accent-glow' : 'border-white/20 text-muted hover:border-accent/30 hover:text-gray-600'}`}>全部</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded border transition-all cursor-pointer ${category === cat ? 'border-accent text-accent bg-accent-glow' : 'border-white/20 text-muted hover:border-accent/30 hover:text-gray-600'}`}>{cat}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-24 gap-5">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-accent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted">整理书架...</span>
        </div>
      ) : data.content.length === 0 ? (
        <div className="text-center py-24">
          <h2 className="font-display text-xl font-bold mb-2">{q || category ? '没有找到匹配的文章' : '书架空空'}</h2>
          <p className="text-muted italic mb-6">{q || category ? '换一个关键词或分类试试。' : '文字会在某个深夜来临。'}</p>
          {(q || category) && (
            <button onClick={() => setSearchParams({})} className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded border border-accent/30 text-muted hover:text-accent hover:bg-accent-glow transition-all cursor-pointer">清除筛选</button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-0.5">
            {data.content.map((post, i) => (
              <Link to={`/post/${post.id}`} key={post.id}
                className="block glass hover:bg-white/50 transition-all duration-300 px-9 py-8 relative group"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="font-mono text-xs uppercase tracking-widest text-muted mb-3 flex items-center gap-3">
                  {formatDate(post.createdAt)}
                  {post.category && <span className="text-accent px-2 py-0.5 border border-accent/20 rounded text-[0.6rem]">{post.category}</span>}
                </div>
                <h2 className="font-display text-xl font-bold text-gray-800 mb-3 group-hover:text-accent transition-colors">{post.title}</h2>
                {post.summary && <p className="text-sm text-gray-500 line-clamp-2">{post.summary}</p>}
                <span className="absolute right-9 top-1/2 -translate-y-1/2 font-mono text-sm text-muted opacity-0 group-hover:opacity-100 group-hover:right-7 transition-all">&rarr;</span>
              </Link>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 mt-12 pb-8">
              <button className="font-mono text-xs min-w-[36px] h-9 flex items-center justify-center border border-transparent rounded text-muted hover:text-accent hover:border-accent/20 transition-all cursor-pointer disabled:opacity-25 disabled:cursor-default"
                disabled={page === 0} onClick={() => goToPage(page - 1)}>&larr;</button>
              {Array.from({ length: data.totalPages }, (_, i) => {
                if (i === 0 || i === data.totalPages - 1 || Math.abs(i - page) <= 1) {
                  return <button key={i} onClick={() => goToPage(i)}
                    className={`font-mono text-xs min-w-[36px] h-9 flex items-center justify-center rounded border transition-all cursor-pointer ${i === page ? 'border-accent text-accent bg-accent-glow' : 'border-transparent text-muted hover:text-accent hover:border-accent/20'}`}>{i + 1}</button>;
                }
                if (Math.abs(i - page) === 2) return <span key={i} className="font-mono text-xs text-muted px-2">&hellip;</span>;
                return null;
              })}
              <button className="font-mono text-xs min-w-[36px] h-9 flex items-center justify-center border border-transparent rounded text-muted hover:text-accent hover:border-accent/20 transition-all cursor-pointer disabled:opacity-25 disabled:cursor-default"
                disabled={data.last} onClick={() => goToPage(page + 1)}>&rarr;</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
