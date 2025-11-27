'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { SupabaseLKPDService, LKPDData } from '@/lib/supabase-lkpd-service';
import { LoadingOverlay } from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { 
  FileText, 
  ArrowLeft, 
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Printer,
  Target,
  FlaskConical,
  Lightbulb,
  BookOpen,
  User
} from 'lucide-react';
import Link from 'next/link';
import { Student } from '@/types/auth';

export default function LKPDResultPage() {
  const { user, isStudent } = useAuth();
  const router = useRouter();
  const [lkpdData, setLkpdData] = useState<LKPDData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLKPDData = async () => {
      if (user && isStudent()) {
        try {
          const data = await SupabaseLKPDService.getLKPDData(user.id);
          setLkpdData(data);
        } catch (error) {
          console.error('Error loading LKPD data:', error);
        }
      }
      setLoading(false);
    };

    loadLKPDData();
  }, [user, isStudent]);

  if (!user || !isStudent()) {
    router.push('/login');
    return null;
  }

  const student = user as Student;

  if (loading) {
    return <LoadingOverlay isVisible={true} text="Memuat hasil E-LKPD..." />;
  }

  if (!lkpdData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
        <Navbar />
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              <FileText className="w-20 h-20 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Belum Ada Data E-LKPD</h2>
              <p className="text-blue-200/70 mb-8">
                Anda belum mengisi E-LKPD. Silakan kerjakan praktikum terlebih dahulu.
              </p>
              <Link
                href="/practicum"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                <FlaskConical className="w-5 h-5 mr-2" />
                Mulai Praktikum
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analysisData = typeof lkpdData.analysis_answers === 'string' 
    ? JSON.parse(lkpdData.analysis_answers) 
    : lkpdData.analysis_answers || {};
  
  const conclusionData = typeof lkpdData.conclusion_answers === 'string'
    ? JSON.parse(lkpdData.conclusion_answers)
    : lkpdData.conclusion_answers || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/student"
              className="inline-flex items-center text-blue-300 hover:text-blue-200 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl">
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black text-white mb-2">Hasil E-LKPD Praktikum</h1>
                      <p className="text-blue-200/70 mb-4">Lembar Kerja Peserta Didik Digital - Rangkaian Listrik</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-blue-200">
                          <User className="w-4 h-4 mr-2" />
                          <span>{student.name} ({student.nis})</span>
                        </div>
                        <div className="flex items-center text-blue-200">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{lkpdData.last_saved_at ? new Date(lkpdData.last_saved_at).toLocaleDateString('id-ID') : '-'}</span>
                        </div>
                        {lkpdData.completed_sections && (
                          <div className="flex items-center text-emerald-300">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            <span>{lkpdData.completed_sections.length}/6 Bagian Selesai</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                      title="Cetak"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Hipotesis Awal */}
            {analysisData.hypothesis && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-2xl blur"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">Hipotesis Awal</h2>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{analysisData.hypothesis}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hasil Pengamatan */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-2xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <FlaskConical className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Hasil Pengamatan</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="border border-white/20 px-4 py-3 text-white font-bold text-left" rowSpan={2}>Jenis Pengamatan</th>
                        <th className="border border-white/20 px-4 py-3 text-white font-bold text-center" colSpan={2}>Rangkaian Seri</th>
                        <th className="border border-white/20 px-4 py-3 text-white font-bold text-center" colSpan={2}>Rangkaian Paralel</th>
                      </tr>
                      <tr className="bg-white/5">
                        <th className="border border-white/20 px-4 py-2 text-blue-200 text-sm">5 Lampu</th>
                        <th className="border border-white/20 px-4 py-2 text-blue-200 text-sm">2 Lampu</th>
                        <th className="border border-white/20 px-4 py-2 text-blue-200 text-sm">5 Lampu</th>
                        <th className="border border-white/20 px-4 py-2 text-blue-200 text-sm">2 Lampu</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/90">
                      <tr>
                        <td className="border border-white/20 px-4 py-2 font-semibold bg-white/5">Tegangan (V)</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.series_5_voltage || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.series_2_voltage || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.parallel_5_voltage || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.parallel_2_voltage || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border border-white/20 px-4 py-2 font-semibold bg-white/5">Arus (A)</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.series_5_current || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.series_2_current || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.parallel_5_current || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.parallel_2_current || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border border-white/20 px-4 py-2 font-semibold bg-white/5">Hambatan (Ω)</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.series_5_resistance || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.series_2_resistance || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.parallel_5_resistance || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center">{lkpdData.parallel_2_resistance || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border border-white/20 px-4 py-2 font-semibold bg-white/5">Kondisi (Semua ON)</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_all_on_series_5 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_all_on_series_2 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_all_on_parallel_5 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_all_on_parallel_2 || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border border-white/20 px-4 py-2 font-semibold bg-white/5">Kondisi (Satu OFF)</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_one_off_series_5 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_one_off_series_2 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_one_off_parallel_5 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_one_off_parallel_2 || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border border-white/20 px-4 py-2 font-semibold bg-white/5">Tingkat Kecerahan</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_brightness_series_5 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_brightness_series_2 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_brightness_parallel_5 || '-'}</td>
                        <td className="border border-white/20 px-4 py-2 text-center text-sm">{lkpdData.lamp_brightness_parallel_2 || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Menguji Hipotesis */}
            {analysisData.hypothesis_testing && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-2xl blur"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Menguji Hipotesis</h2>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{analysisData.hypothesis_testing}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Kesimpulan */}
            {conclusionData.conclusion && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-2xl blur"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">Kesimpulan</h2>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{conclusionData.conclusion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
