'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const useStudentAuth = () => {
  const { user, isStudent } = useAuth();
  const router = useRouter();

  const requireStudentLogin = (testType: 'pretest' | 'posttest', redirectPath?: string) => {
    if (user && isStudent()) {
      // User sudah login sebagai student, redirect ke path yang diinginkan
      if (redirectPath) {
        router.push(redirectPath);
      }
    } else {
      // User belum login, redirect ke halaman login student dengan parameter
      const currentPath = redirectPath || window.location.pathname;
      const loginUrl = `/login/student?redirect=${encodeURIComponent(currentPath)}&testType=${testType}`;
      router.push(loginUrl);
    }
  };

  const checkStudentAuth = () => {
    return user && isStudent();
  };

  return {
    requireStudentLogin,
    checkStudentAuth,
    isLoggedInStudent: user && isStudent(),
  };
};

export default useStudentAuth;