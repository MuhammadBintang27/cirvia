'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TeacherLoginProps {
  onSwitchToRegister: () => void;
}

const TeacherLogin: React.FC<TeacherLoginProps> = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        userType: 'teacher',
      });

      if (!result.success) {
        setError(result.message || 'Login gagal');
      }
      // If successful, the AuthContext will handle the redirect
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Form Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Login Guru</h1>
        <p className="text-sm text-muted mt-1">Masuk ke dashboard guru untuk mengelola siswa</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={error ? 'true' : 'false'}
              className="w-full pl-10 pr-4 py-3 border-2 border-ink/15 rounded-xl text-ink placeholder-muted focus:border-ink focus:outline-none focus:ring-4 focus:ring-brand/25 transition-all"
              placeholder="guru@sekolah.sch.id"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={error ? 'true' : 'false'}
              className="w-full pl-10 pr-12 py-3 border-2 border-ink/15 rounded-xl text-ink placeholder-muted focus:border-ink focus:outline-none focus:ring-4 focus:ring-brand/25 transition-all"
              placeholder="Masukkan password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-muted transition-colors"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-coral-soft border-2 border-ink rounded-xl p-3 flex items-start" role="alert">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Memproses...
            </span>
          ) : (
            'Masuk'
          )}
        </button>

        {/* Register Link */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted">
            Belum punya akun guru?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-brand hover:text-brand font-medium hover:underline"
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default TeacherLogin;