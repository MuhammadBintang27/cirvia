'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingOverlay } from './LoadingSpinner';

interface AuthLoaderProps {
  children: React.ReactNode;
}

export default function AuthLoader({ children }: AuthLoaderProps) {
  const { isLoading } = useAuth();

  // Use the new LoadingOverlay component
  return (
    <>
      <LoadingOverlay isVisible={isLoading} text="Memproses autentikasi..." />
      {children}
    </>
  );
}