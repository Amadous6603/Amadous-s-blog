import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getArchives } from '../api';
import type { Post, ArchiveEntry } from '../types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ArchivePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPosts({ page: 0, size: 999 }),
      getArchives(),
    ]).then(([postsRes, archivesRes]) => {
      setPosts(postsRes.data.content);
      setArchives(archivesRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const postsByYearMonth: Record<string, Post[]> = {};
  for (const post of posts) {
    const d = new Date(post.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (!postsByYearMonth[key]) postsByYearMonth[key] = [];
    postsByYearMonth[key].push(post);
  }

  if (loading) {
    return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-gray-200 border-t-accent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-black mb-3">归档</h1>
      <p className="text-muted italic mb-10">所有的文字，按时间排列。</p>

      {archives.length === 0 ? (
        <div className="text-center py-24"><p className="text-muted italic">还没有文章。</p></div>
      ) : (
        <div className="space-y-12">
          {archives.map((a) => {
            const key = `${a.year}-${a.month}`;
            const monthPosts = postsByYearMonth[key] || [];
            return (
              <section key={key}>
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                  {a.year}年{a.month}月
                  <span className="font-mono text-xs text-muted font-normal">({a.count}篇)</span>
                </h2>
                <div className="space-y-0.5">
                  {monthPosts.map((post) => (
                    <Link to={`/post/${post.id}`} key={post.id}
                      className="flex items-center gap-4 glass px-5 py-3 rounded-lg hover:bg-white/50 transition-all group no-underline">
                      <span className="font-mono text-xs text-muted whitespace-nowrap">{formatDate(post.createdAt)}</span>
                      <span className="font-display text-base text-gray-800 group-hover:text-accent transition-colors truncate">{post.title}</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
