import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          <span className="text-white/50 text-sm">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Demo user — to'lovsiz kirishi mumkin
  const isDemo = localStorage.getItem('cv_is_demo') === '1';
  // Tarif to'langan foydalanuvchi
  const hasPlan = localStorage.getItem('cv_plan_active') === '1';

  if (!isDemo && !hasPlan) {
    return <Navigate to="/login#tariflar" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
