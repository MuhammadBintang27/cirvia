'use client';

import React, { useState } from 'react';
import { User, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  testType: 'pretest' | 'posttest';
}

const StudentLoginModal: React.FC<StudentLoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  testType 
}) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    nis: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login({
        name: formData.name,
        nis: formData.nis,
        userType: 'student'
      });

      if (response.success) {
        onLoginSuccess();
        onClose();
      } else {
        setError(response.message || 'Login gagal');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
            <User className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Login Siswa</h2>
          <p className="text-blue-200/80">
            Login diperlukan untuk menyimpan hasil {testType === 'pretest' ? 'Pre-Test' : 'Post-Test'} Anda
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-400/30 mb-6">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-300 font-medium">Kenapa perlu login?</span>
            </div>
            <ul className="text-blue-200/80 text-sm space-y-1 ml-7">
              <li>• Menyimpan hasil tes Anda secara permanen</li>
              <li>• Melacak progress pembelajaran</li>
              <li>• Membandingkan skor sebelum & sesudah belajar</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-blue-200 font-medium mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:border-blue-400 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* NIS Field */}
            <div>
              <label className="block text-blue-200 font-medium mb-2">
                NIS (Nomor Induk Siswa)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  name="nis"
                  value={formData.nis}
                  onChange={handleInputChange}
                  placeholder="Masukkan NIS Anda"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:border-blue-400 focus:outline-none transition-colors"
                  required
                />
              </div>
              <p className="text-blue-300/60 text-xs mt-1">
                *NIS digunakan sebagai password
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-400/30">
              <p className="text-amber-300 text-sm font-medium mb-1">💡 Demo Credentials:</p>
              <p className="text-amber-200/80 text-xs">
                Nama: Ahmad Budi | NIS: 220001
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-xl text-gray-300 hover:text-white font-medium transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.name || !formData.nis}
                className="flex-1 py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Login & Mulai Tes'}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-blue-300/60 text-xs">
              Belum terdaftar? Hubungi guru untuk mendaftarkan akun Anda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginModal;