import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import SakuraEffect from './components/SakuraEffect';
import BackToTop from './components/BackToTop';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import ArchivePage from './pages/ArchivePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import type { ReactNode } from 'react';

function LayoutWithSidebar({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex max-w-[calc(960px+280px)] mx-auto px-6 relative">
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BackgroundSlideshow />
      <SakuraEffect />
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <Routes>
          <Route path="/" element={<LayoutWithSidebar><HomePage /></LayoutWithSidebar>} />
          <Route path="/post/:id" element={<LayoutWithSidebar><PostPage /></LayoutWithSidebar>} />
          <Route path="/archive" element={<LayoutWithSidebar><ArchivePage /></LayoutWithSidebar>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
