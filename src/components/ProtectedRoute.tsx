'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'teacher' | 'student';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requiredRole,
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Still checking auth status

    if (requireAuth && !user) {
      // User not authenticated, redirect to login
      router.push(redirectTo);
      return;
    }

    if (requiredRole && user && user.role !== requiredRole) {
      // User has wrong role, redirect to appropriate dashboard
      if (user.role === 'teacher') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard/student');
      }
      return;
    }
  }, [user, isLoading, requireAuth, requiredRole, redirectTo, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Don't render if user doesn't meet requirements
  if (requireAuth && !user) return null;
  if (requiredRole && user && user.role !== requiredRole) return null;

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;

// Helper components for common use cases
export const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={true} requiredRole="teacher">
    {children}
  </ProtectedRoute>
);

export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={true} requiredRole="student">
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={true}>
    {children}
  </ProtectedRoute>
);