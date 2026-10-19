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
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-paper rounded-3xl p-12 border-2 border-ink">
              <FileText className="w-20 h-20 text-brand mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-ink mb-4">Belum Ada Data E-LKPD</h2>
              <p className="text-muted mb-8">
                Anda belum mengisi E-LKPD. Silakan kerjakan praktikum terlebih dahulu.
              </p>
              <Link
                href="/practicum"
                className="inline-flex items-center px-6 py-3 bg-brand border-2 border-ink text-white rounded-xl font-bold hover:bg-brand transition-all"
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
    <div className="min-h-screen bg-transparent">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/student"
              className="inline-flex items-center text-brand hover:text-muted mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>

            <div className="relative">
              <div className="absolute -inset-1 bg-brand-soft rounded-3xl hidden"></div>
              <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-soft rounded-xl">
                      <FileText className="w-8 h-8 text-brand" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black text-ink mb-2">Hasil E-LKPD Praktikum</h1>
                      <p className="text-muted mb-4">Lembar Kerja Peserta Didik Digital - Rangkaian Listrik</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-muted">
                          <User className="w-4 h-4 mr-2" />
                          <span>{student.name} ({student.nis})</span>
                        </div>
                        <div className="flex items-center text-muted">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{lkpdData.last_saved_at ? new Date(lkpdData.last_saved_at).toLocaleDateString('id-ID') : '-'}</span>
                        </div>
                        {lkpdData.completed_sections && (
                          <div className="flex items-center text-emerald-700">
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
                      className="p-3 bg-paper hover:bg-lamp-soft text-ink rounded-xl transition-all"
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
                <div className="absolute -inset-1 bg-lamp-soft rounded-2xl hidden"></div>
                <div className="relative bg-paper rounded-2xl p-6 border-2 border-ink">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-amber-700" />
                    <h2 className="text-xl font-bold text-ink">Hipotesis Awal</h2>
                  </div>
                  <div className="bg-paper rounded-lg p-4 border border-ink/20">
                    <p className="text-ink whitespace-pre-wrap leading-relaxed">{analysisData.hypothesis}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hasil Pengamatan */}
            <div className="relative">
              <div className="absolute -inset-1 bg-brand-soft rounded-2xl hidden"></div>
              <div className="relative bg-paper rounded-2xl p-6 border-2 border-ink">
                <div className="flex items-center gap-3 mb-6">
                  <FlaskConical className="w-6 h-6 text-brand" />
                  <h2 className="text-xl font-bold text-ink">Hasil Pengamatan</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-paper">
                        <th className="border-2 border-ink px-4 py-3 text-ink font-bold text-left" rowSpan={2}>Jenis Pengamatan</th>
                        <th className="border-2 border-ink px-4 py-3 text-ink font-bold text-center" colSpan={2}>Rangkaian Seri</th>
                        <th className="border-2 border-ink px-4 py-3 text-ink font-bold text-center" colSpan={2}>Rangkaian Paralel</th>
                      </tr>
                      <tr className="bg-paper">
                        <th className="border-2 border-ink px-4 py-2 text-muted text-sm">5 Lampu</th>
                        <th className="border-2 border-ink px-4 py-2 text-muted text-sm">2 Lampu</th>
                        <th className="border-2 border-ink px-4 py-2 text-muted text-sm">5 Lampu</th>
                        <th className="border-2 border-ink px-4 py-2 text-muted text-sm">2 Lampu</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink">
                      <tr>
                        <td className="border-2 border-ink px-4 py-2 font-semibold bg-paper">Tegangan (V)</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.series_5_voltage || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.series_2_voltage || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.parallel_5_voltage || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.parallel_2_voltage || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-ink px-4 py-2 font-semibold bg-paper">Arus (A)</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.series_5_current || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.series_2_current || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.parallel_5_current || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.parallel_2_current || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-ink px-4 py-2 font-semibold bg-paper">Hambatan (Ω)</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.series_5_resistance || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.series_2_resistance || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.parallel_5_resistance || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center">{lkpdData.parallel_2_resistance || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-ink px-4 py-2 font-semibold bg-paper">Kondisi (Semua ON)</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_all_on_series_5 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_all_on_series_2 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_all_on_parallel_5 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_all_on_parallel_2 || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-ink px-4 py-2 font-semibold bg-paper">Kondisi (Satu OFF)</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_one_off_series_5 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_one_off_series_2 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_one_off_parallel_5 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_one_off_parallel_2 || '-'}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-ink px-4 py-2 font-semibold bg-paper">Tingkat Kecerahan</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_brightness_series_5 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_brightness_series_2 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_brightness_parallel_5 || '-'}</td>
                        <td className="border-2 border-ink px-4 py-2 text-center text-sm">{lkpdData.lamp_brightness_parallel_2 || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Menguji Hipotesis */}
            {analysisData.hypothesis_testing && (
              <div className="relative">
                <div className="absolute -inset-1 bg-purple-100 rounded-2xl hidden"></div>
                <div className="relative bg-paper rounded-2xl p-6 border-2 border-ink">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-purple-700" />
                    <h2 className="text-xl font-bold text-ink">Menguji Hipotesis</h2>
                  </div>
                  <div className="bg-paper rounded-lg p-4 border border-ink/20">
                    <p className="text-ink whitespace-pre-wrap leading-relaxed">{analysisData.hypothesis_testing}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Kesimpulan */}
            {conclusionData.conclusion && (
              <div className="relative">
                <div className="absolute -inset-1 bg-mint-soft rounded-2xl hidden"></div>
                <div className="relative bg-paper rounded-2xl p-6 border-2 border-ink">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-6 h-6 text-emerald-700" />
                    <h2 className="text-xl font-bold text-ink">Kesimpulan</h2>
                  </div>
                  <div className="bg-paper rounded-lg p-4 border border-ink/20">
                    <p className="text-ink whitespace-pre-wrap leading-relaxed">{conclusionData.conclusion}</p>
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
