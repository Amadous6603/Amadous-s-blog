import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', password2: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) { setError('两次密码不一致'); return; }
    if (form.password.length < 6) { setError('密码至少6位'); return; }
    setLoading(true);
    register({ username: form.username, password: form.password, nickname: form.nickname })
      .then(() => navigate('/')).catch((err) => setError(err.response?.data?.error || '注册失败')).finally(() => setLoading(false));
  };

  return (
    <div className="max-w-sm mx-auto py-10">
      <div className="glass-strong rounded-2xl p-10">
        <h1 className="font-display text-2xl font-bold text-center mb-2">注册</h1>
        <p className="text-center text-muted italic mb-7">在小屋留下你的痕迹</p>
        {error && <div className="bg-danger/5 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm text-center mb-5">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-5"><label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">用户名</label><input className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/30 text-gray-800 font-body outline-none focus:border-accent transition-colors" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required autoFocus /></div>
          <div className="mb-5"><label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">昵称</label><input className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/30 text-gray-800 font-body outline-none focus:border-accent transition-colors" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="给自己起个名字" /></div>
          <div className="mb-5"><label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">密码</label><input type="password" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/30 text-gray-800 font-body outline-none focus:border-accent transition-colors" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <div className="mb-5"><label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">确认密码</label><input type="password" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/30 text-gray-800 font-body outline-none focus:border-accent transition-colors" value={form.password2} onChange={(e) => setForm({ ...form, password2: e.target.value })} required /></div>
          <button type="submit" disabled={loading} className="w-full font-mono text-xs uppercase tracking-wider py-3 rounded-lg border border-accent/50 text-accent hover:bg-accent hover:text-white transition-all cursor-pointer disabled:opacity-50 mt-2">{loading ? '注册中...' : '注册'}</button>
        </form>
        <p className="text-center mt-6 text-sm text-muted">已有账号？<Link to="/login" className="text-accent hover:text-accent-hover ml-1">去登录</Link></p>
      </div>
    </div>
  );
}
