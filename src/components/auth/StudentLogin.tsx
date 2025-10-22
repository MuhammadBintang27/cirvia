'use client';

import React, { useState } from 'react';
import { User, Hash, GraduationCap, AlertCircle, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StudentLoginProps {
  onSwitchToTeacher: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onSwitchToTeacher }) => {
  const [formData, setFormData] = useState({
    name: '',
    nis: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({
        name: formData.name,
        nis: formData.nis,
        userType: 'student',
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
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full mb-4 border border-emerald-400/30">
          <BookOpen className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Login Siswa</h2>
        <p className="text-emerald-200/80">Masuk untuk mulai belajar rangkaian listrik</p>
      </div>

      {/* Information Box */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-400/30 mb-6">
        <h4 className="text-emerald-300 font-medium mb-2">ℹ️ Informasi Login Siswa:</h4>
        <div className="text-sm text-emerald-200/80 space-y-1">
          <div>• Gunakan nama lengkap sesuai data dari guru</div>
          <div>• Password adalah Nomor Induk Siswa (NIS) Anda</div>
          <div>• Jika belum bisa login, hubungi guru kelas Anda</div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-emerald-200 mb-2">
            Nama Lengkap
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all"
              placeholder="Contoh: Ahmad Budi Santoso"
              required
            />
          </div>
          <p className="text-xs text-emerald-200/60 mt-1">
            Masukkan nama persis seperti yang didaftarkan guru
          </p>
        </div>

        {/* NIS Field */}
        <div>
          <label className="block text-sm font-medium text-emerald-200 mb-2">
            Nomor Induk Siswa (NIS)
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
            <input
              type="text"
              name="nis"
              value={formData.nis}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all"
              placeholder="Contoh: 220001"
              required
            />
          </div>
          <p className="text-xs text-emerald-200/60 mt-1">
            NIS berfungsi sebagai password Anda
          </p>
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
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Masuk...' : 'Masuk'}
        </button>

        {/* Help Text */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-400/30">
          <h4 className="text-blue-300 font-medium mb-2">🆘 Butuh Bantuan?</h4>
          <div className="text-sm text-blue-200/80 space-y-1">
            <div>• Pastikan nama dan NIS sudah benar</div>
            <div>• Data siswa diinput oleh guru kelas</div>
            <div>• Hubungi guru jika masih tidak bisa masuk</div>
          </div>
        </div>

        {/* Switch to Teacher */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-emerald-200/70 text-sm mb-3">Anda seorang guru?</p>
          <button
            type="button"
            onClick={onSwitchToTeacher}
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-emerald-300 hover:text-white transition-all"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Login Guru
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentLogin;