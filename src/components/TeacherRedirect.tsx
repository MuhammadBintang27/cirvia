'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Component to redirect teachers to dashboard if they try to access student pages
 * Teachers can only access /dashboard/teacher and /login routes
 */
export default function TeacherRedirect() {
  const { user, isTeacher, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Only redirect if user is a teacher
    if (!isTeacher() || !user) return;

    // Allow access to teacher dashboard and login pages
    const allowedPaths = [
      '/dashboard/teacher',
      '/login',
      '/about', // Allow teachers to view about page
    ];

    // Check if current path starts with any allowed path
    const isAllowed = allowedPaths.some(path => pathname.startsWith(path));

    // If not allowed, redirect to teacher dashboard
    if (!isAllowed) {
      console.log('Teacher attempting to access restricted page, redirecting to dashboard');
      router.push('/dashboard/teacher');
    }
  }, [user, isTeacher, isLoading, pathname, router]);

  return null; // This component doesn't render anything
}
