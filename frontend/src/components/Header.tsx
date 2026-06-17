import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const linkClass = (path: string) =>
    `text-xs uppercase tracking-widest px-3 py-1.5 rounded border border-transparent transition-all duration-150 ${
      location.pathname === path
        ? 'border-accent text-accent bg-accent-glow'
        : 'text-white/80 hover:text-white hover:border-white/30'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.45)' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-white no-underline hover:text-accent transition-colors">
          Amadous的小屋
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/" className={`font-mono ${linkClass('/')}`}>首页</Link>
          {user ? (
            <>
              <Link to="/admin" className={`font-mono ${linkClass('/admin')}`}>管理</Link>
              <span className="text-sm text-white/70 italic px-2">{user.nickname}</span>
              <button onClick={logout} className="font-mono text-xs uppercase tracking-widest text-white/70 hover:text-danger px-3 py-1.5 rounded border border-transparent hover:border-danger/20 transition-all cursor-pointer">
                退出
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`font-mono ${linkClass('/login')}`}>登录</Link>
              <Link to="/register" className={`font-mono ${linkClass('/register')}`}>注册</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
