import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPosts, getCategories, getArchives } from '../api';
import type { Post, ArchiveEntry } from '../types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  useEffect(() => {
    getPosts({ page: 0, size: 5 }).then((res) => setRecentPosts(res.data.content)).catch(() => {});
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
    getArchives().then((res) => setArchives(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <button
        className={`sidebar-toggle glass ${collapsed ? 'collapsed' : ''}`}
        onClick={onToggle}
        aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
      >
        {collapsed ? '❯' : '❮'}
      </button>

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} border-l border-white/20`}>
        <div className="sidebar-inner">
          {/* User card */}
          <div className="sidebar-card text-center">
            {user ? (
              <>
                <div className="user-avatar glass-strong border-accent/30">
                  {user.avatar ? <img src={user.avatar} alt="" /> : user.nickname?.charAt(0)}
                </div>
                <div className="user-name">{user.nickname}</div>
                {user.bio && <div className="user-bio">{user.bio}</div>}
              </>
            ) : (
              <>
                <div className="user-avatar glass-strong text-muted">?</div>
                <div className="user-name">游客</div>
                <div className="flex gap-2 justify-center mt-1">
                  <Link to="/login" className="font-mono text-xs uppercase tracking-wider text-accent hover:text-accent-hover">登录</Link>
                  <span className="text-muted text-xs">/</span>
                  <Link to="/register" className="font-mono text-xs uppercase tracking-wider text-accent hover:text-accent-hover">注册</Link>
                </div>
              </>
            )}
          </div>

          {/* Recent posts */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">最近文章</h3>
            {recentPosts.length === 0 ? (
              <p className="sidebar-empty">还没有文章</p>
            ) : (
              <ul className="sidebar-list">
                {recentPosts.map((post) => (
                  <li key={post.id}><Link to={`/post/${post.id}`} className="sidebar-list-link">{post.title}</Link></li>
                ))}
              </ul>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">分类</h3>
              <ul className="sidebar-list">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link to={cat === currentCategory ? '/' : `/?category=${encodeURIComponent(cat)}`}
                      className={`sidebar-list-link ${cat === currentCategory ? 'active' : ''}`}>{cat}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Archives */}
          {archives.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">归档</h3>
              <ul className="sidebar-list">
                {archives.map((a, i) => (
                  <li key={i}><span className="archive-item"><span>{a.year}年{a.month}月</span><span className="archive-count">{a.count}</span></span></li>
                ))}
              </ul>
            </div>
          )}

          <div className="sidebar-card">
            <Link to="/archive" className="sidebar-list-link text-accent">查看全部归档 &rarr;</Link>
          </div>
        </div>
      </aside>
    </>
  );
}
