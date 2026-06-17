import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-accent rounded-full animate-spin" />
    </div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
