'use client';

import React, { useState, useEffect } from 'react';
import { Ico } from '@/components/ui/Ico';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] space-y-2" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-mint-soft border-ink text-emerald-700';
      case 'error':
        return 'bg-coral-soft border-ink text-red-600';
      case 'warning':
        return 'bg-lamp-soft border-ink text-amber-700';
      case 'info':
        return 'bg-brand-soft border-ink text-muted';
      default:
        return 'bg-ink/20 border-ink text-muted';
    }
  };

  const icon = { success: "check", error: "x", warning: "alert", info: "message" }[toast.type] ?? "message";

  return (
    <div
      className={`
        ${getToastStyles()}
        border-2 rounded-xl p-4 max-w-sm shadow-hard
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-lg text-ink"><Ico n={icon} /></span>
          <div className="flex-1">
            <h4 className="font-semibold">{toast.title}</h4>
            {toast.message && (
              <p className="text-sm opacity-90 mt-1">{toast.message}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 text-lg opacity-60 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
}