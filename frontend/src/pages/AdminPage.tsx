import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getPosts, createPost, updatePost, deletePost } from '../api';
import type { Post } from '../types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

interface PostForm {
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
}

const emptyForm: PostForm = { title: '', summary: '', content: '', author: 'Admin', category: '' };

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'blockquote', 'code-block',
  'list', 'bullet', 'link', 'image',
];

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const fetchPosts = () => {
    setLoading(true);
    getPosts({ page: 0, size: 999 }).then((res) => setPosts(res.data.content)).catch(() => setError('加载失败')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => { setEditingPost(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (post: Post) => {
    setEditingPost(post);
    setForm({ title: post.title, summary: post.summary || '', content: post.content, author: post.author || 'Admin', category: post.category || '' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingPost(null); setForm(emptyForm); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const request = editingPost ? updatePost(editingPost.id, form) : createPost(form);
    request.then(() => { closeModal(); fetchPosts(); }).catch(() => alert('保存失败')).finally(() => setSaving(false));
  };

  const handleDelete = (post: Post) => {
    if (!window.confirm(`确定删除 "${post.title}"？`)) return;
    deletePost(post.id).then(() => setPosts((prev) => prev.filter((p) => p.id !== post.id))).catch(() => alert('删除失败'));
  };

  if (loading && posts.length === 0) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-gray-200 border-t-accent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl font-bold">文章管理</h1>
        <button onClick={openCreate} className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded border border-accent/50 text-accent hover:bg-accent hover:text-white transition-all cursor-pointer">+ 写文章</button>
      </div>

      {error && <p className="text-danger mb-6">{error}</p>}

      {posts.length === 0 ? (
        <div className="text-center py-24"><h2 className="font-display text-xl font-bold mb-2">还没有文章</h2><p className="text-muted">写下第一篇文章吧。</p></div>
      ) : (
        <table className="w-full border-collapse glass rounded-xl overflow-hidden">
          <thead><tr className="border-b-2 border-white/20">
            <th className="font-mono text-xs uppercase tracking-wider text-muted p-4 text-left font-normal">标题</th>
            <th className="font-mono text-xs uppercase tracking-wider text-muted p-4 text-left font-normal">分类</th>
            <th className="font-mono text-xs uppercase tracking-wider text-muted p-4 text-left font-normal">日期</th>
            <th className="font-mono text-xs uppercase tracking-wider text-muted p-4 text-left font-normal">操作</th>
          </tr></thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-white/20">
                <td className="p-4 font-display text-base">{post.title}</td>
                <td className="p-4 text-sm text-gray-500">{post.category || '—'}</td>
                <td className="p-4 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(post)} className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded border border-white/20 text-muted hover:text-accent hover:border-accent/30 transition-all cursor-pointer">编辑</button>
                    <Link to={`/post/${post.id}`} className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded border border-white/20 text-muted hover:text-accent hover:border-accent/30 transition-all no-underline">查看</Link>
                    <button onClick={() => handleDelete(post)} className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded border border-transparent text-danger hover:border-danger/20 hover:bg-danger/5 transition-all cursor-pointer">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={closeModal}>
          <div className="glass-strong rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-10" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-bold mb-7">{editingPost ? '编辑文章' : '写文章'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">标题</label>
                <input name="title" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/30 text-gray-800 font-body outline-none focus:border-accent transition-colors" value={form.title} onChange={handleChange} required autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">作者</label>
                  <input name="author" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/30 text-gray-800 font-body outline-none focus:border-accent transition-colors" value={form.author} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">分类</label>
                  <input name="category" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/30 text-gray-800 font-body outline-none focus:border-accent transition-colors" value={form.category} onChange={handleChange} placeholder="如：技术、随笔、日记" />
                </div>
              </div>
              <div className="mb-5">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">摘要</label>
                <input name="summary" className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/30 text-gray-800 font-body outline-none focus:border-accent transition-colors" value={form.summary} onChange={handleChange} placeholder="简短描述..." />
              </div>
              <div className="mb-5">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">正文</label>
                <ReactQuill ref={quillRef} theme="snow" value={form.content} onChange={(val) => setForm({ ...form, content: val })} modules={quillModules} formats={quillFormats} className="ql-editor-wrapper" placeholder="开始写作..." />
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={closeModal} className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded border border-white/20 text-muted hover:text-accent hover:border-accent/30 transition-all cursor-pointer">取消</button>
                <button type="submit" disabled={saving} className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded border border-accent/50 text-accent hover:bg-accent hover:text-white transition-all cursor-pointer disabled:opacity-50">{saving ? '保存中...' : editingPost ? '更新' : '发布'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
