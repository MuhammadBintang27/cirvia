'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, School, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TeacherRegisterProps {
  onSwitchToLogin: () => void;
}

const TeacherRegister: React.FC<TeacherRegisterProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    school: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Nama harus diisi';
    if (!formData.email.trim()) return 'Email harus diisi';
    if (!formData.password) return 'Password harus diisi';
    if (formData.password.length < 6) return 'Password minimal 6 karakter';
    if (formData.password !== formData.confirmPassword) return 'Konfirmasi password tidak cocok';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Format email tidak valid';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        school: formData.school.trim() || undefined,
      });

      if (!result.success) {
        setError(result.message || 'Registrasi gagal');
      }
      // If successful, the AuthContext will handle the redirect
    } catch (err) {
      setError('Terjadi kesalahan saat registrasi');
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

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Lemah', color: 'text-red-400' };
    if (password.length < 10) return { strength: 2, text: 'Sedang', color: 'text-yellow-400' };
    return { strength: 3, text: 'Kuat', color: 'text-green-400' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full mb-4 border border-purple-400/30">
          <User className="w-10 h-10 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Daftar Guru</h2>
        <p className="text-purple-200/80">Buat akun guru untuk mengelola pembelajaran siswa</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Nama Lengkap <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
              placeholder="Masukkan nama lengkap Anda"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Email <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
              placeholder="guru@sekolah.sch.id"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
              placeholder="Minimal 6 karakter"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {formData.password && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-6 rounded-full ${
                      level <= passwordStrength.strength
                        ? passwordStrength.strength === 1
                          ? 'bg-red-400'
                          : passwordStrength.strength === 2
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                        : 'bg-white/20'
                    }`}
                  ></div>
                ))}
              </div>
              <span className={`text-xs ${passwordStrength.color}`}>
                {passwordStrength.text}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Konfirmasi Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
              placeholder="Ulangi password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {formData.confirmPassword && (
            <div className="mt-1 flex items-center space-x-2">
              {formData.password === formData.confirmPassword ? (
                <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-xs text-green-400">Password cocok</span></>
              ) : (
                <><AlertCircle className="w-4 h-4 text-red-400" /><span className="text-xs text-red-400">Password tidak cocok</span></>
              )}
            </div>
          )}
        </div>

        {/* Phone Number Field (Optional) */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Nomor Telepon
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
              placeholder="081234567890 (opsional)"
            />
          </div>
        </div>

        {/* School Field (Optional) */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Nama Sekolah
          </label>
          <div className="relative">
            <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
              placeholder="SMA Negeri 1 Jakarta (opsional)"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Mendaftar...' : 'Daftar'}
        </button>

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-purple-200/70 text-sm">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-purple-300 hover:text-purple-200 font-medium underline underline-offset-2 hover:underline-offset-4 transition-all"
            >
              Login di sini
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default TeacherRegister;