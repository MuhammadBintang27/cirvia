'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Teacher, Student, LoginCredentials, RegisterTeacherData, AuthContextType, AuthResponse } from '@/types/auth';
import { SupabaseAuthService } from '@/lib/supabase-auth-service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Teacher | Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    // Create default teacher account for demo
    SupabaseAuthService.createDefaultTeacher();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const sessionId = localStorage.getItem('cirvia_session');
      if (sessionId) {
        const session = await SupabaseAuthService.validateSession(sessionId);
        if (session) {
          // Load user data based on session
          const userData = await SupabaseAuthService.getUserById(session.userId, session.userRole);
          if (userData) {
            setUser(userData);
          }
        } else {
          localStorage.removeItem('cirvia_session');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true);

      if (credentials.userType === 'teacher') {
        if (!credentials.email || !credentials.password) {
          return { success: false, message: 'Email dan password harus diisi' };
        }

        const teacher = await SupabaseAuthService.validateTeacherPassword(credentials.email, credentials.password);
        if (!teacher) {
          return { success: false, message: 'Email atau password salah' };
        }

        // Create session
        const sessionId = await SupabaseAuthService.createSession(teacher);
        localStorage.setItem('cirvia_session', sessionId);
        
        setUser(teacher);
        return { success: true, user: teacher, token: sessionId };

      } else {
        if (!credentials.name || !credentials.nis) {
          return { success: false, message: 'Nama dan NIS harus diisi' };
        }

        const student = await SupabaseAuthService.findStudentByNameAndNis(credentials.name, credentials.nis);
        if (!student) {
          return { success: false, message: 'Nama atau NIS tidak ditemukan. Hubungi guru Anda.' };
        }

        // Create session
        const sessionId = await SupabaseAuthService.createSession(student);
        localStorage.setItem('cirvia_session', sessionId);
        
        setUser(student);
        return { success: true, user: student, token: sessionId };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat login' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterTeacherData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);

      // Validate data
      if (!data.email || !data.password || !data.name) {
        return { success: false, message: 'Nama, email, dan password harus diisi' };
      }

      if (data.password.length < 6) {
        return { success: false, message: 'Password minimal 6 karakter' };
      }

      const teacher = await SupabaseAuthService.createTeacher(data);
      
      // Auto login after registration
      const sessionId = await SupabaseAuthService.createSession(teacher);
      localStorage.setItem('cirvia_session', sessionId);
      
      setUser(teacher);
      return { success: true, user: teacher, token: sessionId };

    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true); // Show loading during logout
    
    const sessionId = localStorage.getItem('cirvia_session');
    if (sessionId) {
      SupabaseAuthService.destroySession(sessionId);
      localStorage.removeItem('cirvia_session');
    }
    setUser(null);
    
    // Add small delay to show loading, then redirect
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }, 500);
  };

  const isTeacher = (): boolean => {
    return user?.role === 'teacher';
  };

  const isStudent = (): boolean => {
    return user?.role === 'student';
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    isTeacher,
    isStudent,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Custom hooks for role-based access
export function useTeacher() {
  const { user, isTeacher } = useAuth();
  return isTeacher() ? (user as Teacher) : null;
}

export function useStudent() {
  const { user, isStudent } = useAuth();
  return isStudent() ? (user as Student) : null;
}