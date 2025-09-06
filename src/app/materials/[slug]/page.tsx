'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AudioPlayer from '@/components/AudioPlayer'
import InteractiveCircuitDemo from '@/components/InteractiveCircuitDemo'
import { useProgressTracking } from '@/hooks/useProgressTracking'
import { CheckCircle, Clock, BookOpen, Volume2, Zap } from 'lucide-react'

// Data modules
const modulesData = {
  'konsep-dasar-listrik': {
    id: 'module-1',
    title: 'Konsep Dasar Listrik',
    subtitle: 'Memahami arus, tegangan, dan resistansi',
    description: 'Pelajari dasar-dasar listrik dengan cara yang mudah dipahami',
      content: `
        <h4>Pengenalan Arus Searah</h4>
        <p>Arus listrik searah (Direct Current/DC) adalah aliran listrik yang mengalir dalam satu arah konstan dalam suatu rangkaian tertutup. Arus ini memiliki polaritas tetap, artinya arah alirannya selalu sama.</p>
        <h4>Rangkaian Listrik</h4>
        <p>Rangkaian listrik adalah susunan dari beberapa komponen listrik (seperti sumber listrik, kabel, saklar, dan beban) yang saling terhubung sehingga arus listrik bisa mengalir. Komponen-komponen listrik meliputi:</p>
        <ul>
          <li>Sumber daya (Baterai atau generator DC)</li>
          <li>Konduktor (Kabel dan kawat)</li>
          <li>Sakelar</li>
          <li>Beban (lampu, resistor, atau motor)</li>
        </ul>
        <h4>Contoh Kontekstual</h4>
        <p>Bayangkan kamu punya sebuah senter. Di dalam senter ada baterai sebagai sumber listrik, kabel kecil sebagai penghantar, tombol on/off sebagai saklar, dan lampu kecil sebagai bebannya. Saat tombol ditekan, arus listrik mengalir dari baterai melalui kabel ke lampu, sehingga lampu menyala. Kalau tombol dilepas, aliran listrik terputus dan lampu pun mati.</p>
        <h4>Hukum Ohm</h4>
        <p>Karena polaritas pada rangkaian arus searah adalah tetap, maka prinsip Hukum Ohm berlaku. Hukum Ohm menghubungkan tegangan, kuat arus, dan hambatan dalam suatu rangkaian listrik:</p>
        <p><strong>V = I × R</strong></p>
        <ul>
          <li>I = kuat arus listrik (A)</li>
          <li>V = tegangan listrik (V)</li>
          <li>R = hambatan listrik (Ω)</li>
        </ul>
      `,
    audioData: {
      title: 'Audio: Konsep Dasar Listrik',
      description: 'Penjelasan sederhana tentang arus, tegangan, dan resistansi',
      chapters: [
        { title: 'Pengenalan Listrik', startTime: 0, duration: 120 },
        { title: 'Arus Listrik', startTime: 120, duration: 90 },
        { title: 'Tegangan', startTime: 210, duration: 90 },
        { title: 'Resistansi', startTime: 300, duration: 90 },
        { title: 'Hukum Ohm', startTime: 390, duration: 120 }
      ]
    },
    demoData: {
      voltage: 12,
      resistance: 100,
      title: 'Demo: Hukum Ohm'
    },
    gradientColors: 'from-blue-500 to-cyan-500'
  },
  'rangkaian-seri': {
    id: 'module-2',
    title: 'Rangkaian Seri',
    subtitle: 'Komponen tersusun berurutan',
    description: 'Pelajari bagaimana komponen listrik disusun berurutan',
      content: `
        <h4>Rangkaian Listrik Seri</h4>
        <p>Rangkaian listrik seri adalah jenis rangkaian listrik yang semua komponennya disusun secara berurutan atau berderet dalam satu jalur tunggal, tanpa ada percabangan.</p>
        <h4>Ciri-ciri Rangkaian Seri</h4>
        <ul>
          <li>Kuat arus total sama dengan kuat arus di setiap hambatan: <strong>I<sub>tot</sub> = I<sub>1</sub> = I<sub>2</sub> = ...</strong></li>
          <li>Tegangan total adalah jumlah tegangan di tiap hambatan: <strong>V<sub>tot</sub> = V<sub>1</sub> + V<sub>2</sub> + ...</strong></li>
          <li>Hambatan total adalah jumlah seluruh hambatan: <strong>R<sub>tot</sub> = R<sub>1</sub> + R<sub>2</sub> + ...</strong></li>
          <li>Jika salah satu komponen diputus, arus listrik berhenti.</li>
        </ul>
        <h4>Contoh Kontekstual</h4>
        <p>Bayangkan kamu menghias pohon natal dengan lampu hias warna-warni yang disusun berderet panjang (seri). Jika satu lampu putus, semua lampu lain ikut padam.</p>
        <ul>
          <li>Arus listrik sama besar di semua lampu.</li>
          <li>Tegangan terbagi-bagi sesuai jumlah lampu.</li>
          <li>Jika satu lampu putus, semua padam.</li>
        </ul>
        <h4>Contoh Soal</h4>
        <p>Tiga buah hambatan disusun seri dan dihubungkan dengan baterai 12 V. Nilai hambatan masing-masing adalah R1 = 2 Ω, R2 = 4 Ω, R3 = 6 Ω.</p>
        <ol>
          <li>Hambatan total: R<sub>tot</sub> = R1 + R2 + R3 = 2 + 4 + 6 = 12 Ω</li>
          <li>Arus listrik: I = V/R<sub>tot</sub> = 12/12 = 1 A</li>
          <li>Tegangan pada masing-masing hambatan:
            <ul>
              <li>V1 = I × R1 = 1 × 2 = 2 V</li>
              <li>V2 = I × R2 = 1 × 4 = 4 V</li>
              <li>V3 = I × R3 = 1 × 6 = 6 V</li>
            </ul>
          </li>
        </ol>
        <p>Cek: V1 + V2 + V3 = 2 + 4 + 6 = 12 V (sesuai sumber tegangan).</p>
      `,
    audioData: {
      title: 'Audio: Rangkaian Seri',
      description: 'Memahami karakteristik dan perhitungan rangkaian seri',
      chapters: [
        { title: 'Konsep Rangkaian Seri', startTime: 0, duration: 120 },
        { title: 'Ciri-ciri Seri', startTime: 120, duration: 100 },
        { title: 'Rumus Perhitungan', startTime: 220, duration: 110 },
        { title: 'Contoh Soal', startTime: 330, duration: 90 }
      ]
    },
    demoData: {
      voltage: 9,
      resistance: 150,
      title: 'Demo: Rangkaian Seri'
    },
    gradientColors: 'from-green-500 to-blue-500'
  },
  'daya-listrik': {
    id: 'module-3',
    title: 'Rangkaian Paralel',
    subtitle: 'Komponen tersusun bercabang',
    description: 'Pelajari konsep rangkaian listrik paralel dan cara menghitungnya',
    content: `
      <h4>Rangkaian Listrik Paralel</h4>
      <p>Rangkaian listrik paralel adalah susunan komponen listrik di mana terdapat lebih dari satu jalur untuk arus listrik mengalir, sehingga setiap komponen mendapatkan tegangan yang sama.</p>
      <h4>Ciri-ciri Rangkaian Paralel</h4>
      <ul>
        <li>Kuat arus total adalah jumlah arus di tiap cabang: <strong>I<sub>tot</sub> = I<sub>1</sub> + I<sub>2</sub> + ...</strong></li>
        <li>Tegangan di setiap cabang sama dengan tegangan sumber: <strong>V<sub>tot</sub> = V<sub>1</sub> = V<sub>2</sub> = ...</strong></li>
        <li>Hambatan total: <strong>1/R<sub>tot</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + ...</strong></li>
        <li>Jika satu komponen dicabut, komponen lain tetap menyala.</li>
      </ul>
      <h4>Contoh Kontekstual</h4>
      <p>Bayangkan di rumah ada stop kontak dengan beberapa lubang colokan. Karena susunannya paralel, tegangan sama besar untuk semua alat, arus terbagi sesuai kebutuhan, dan tidak saling bergantung.</p>
      <h4>Contoh Soal</h4>
      <p>Sebuah rangkaian paralel terdiri dari 2 lampu identik, masing-masing hambatan 6 Ω, dihubungkan ke sumber tegangan 12 V.</p>
      <ol>
        <li>Tegangan pada tiap lampu: V<sub>total</sub> = V1 = V2 = 12 V</li>
        <li>Arus pada masing-masing lampu:
          <ul>
            <li>I1 = V/R1 = 12/6 = 2 A</li>
            <li>I2 = V/R2 = 12/6 = 2 A</li>
          </ul>
        </li>
        <li>Arus total: I<sub>total</sub> = I1 + I2 = 2 + 2 = 4 A</li>
      </ol>
    `,
    audioData: {
      title: 'Audio: Daya Listrik',
      description: 'Memahami konsep daya listrik dan aplikasinya',
      chapters: [
        { title: 'Konsep Daya', startTime: 0, duration: 110 },
        { title: 'Rumus Daya', startTime: 110, duration: 100 },
        { title: 'Contoh Perhitungan', startTime: 210, duration: 120 },
        { title: 'Aplikasi Sehari-hari', startTime: 330, duration: 90 }
      ]
    },
    demoData: {
      voltage: 15,
      resistance: 75,
      title: 'Demo: Daya Listrik'
    },
    gradientColors: 'from-purple-500 to-pink-500'
  }
}

export default function ModuleDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const { markModuleComplete, isModuleCompleted } = useProgressTracking()
  
  // Get module data based on slug
  const moduleData = modulesData[slug as keyof typeof modulesData]
  
  // If module not found, show 404
  if (!moduleData) {
    notFound()
  }

  const handleMarkComplete = () => {
    markModuleComplete(moduleData.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navbar */}
      <Navbar showBackButton backUrl="/materials" backText="Kembali ke Materi" />

      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Module Header */}
          <div className={`bg-gradient-to-r ${moduleData.gradientColors} rounded-2xl text-white p-8 mb-8 relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3">{moduleData.title}</h1>
                  <p className="text-xl opacity-90 mb-2">{moduleData.subtitle}</p>
                  <p className="text-sm opacity-80">{moduleData.description}</p>
                </div>
                
                {/* Status Badge */}
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  isModuleCompleted(moduleData.id) 
                    ? 'bg-green-500 bg-opacity-20 text-green-100' 
                    : 'bg-white bg-opacity-20 text-white'
                }`}>
                  {isModuleCompleted(moduleData.id) ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Selesai</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Belum Selesai</span>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Materi Lengkap</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Audio Learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Demo Interaktif</span>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full translate-y-16 -translate-x-16"></div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Audio Learning Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <Volume2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Audio Pembelajaran</h3>
                  <p className="text-gray-600">Dengarkan penjelasan dengan gaya podcast edukatif</p>
                </div>
              </div>
              <AudioPlayer 
                title={moduleData.audioData.title}
                description={moduleData.audioData.description}
                chapters={moduleData.audioData.chapters}
              />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Materi Pembelajaran</h3>
                  <p className="text-gray-600">Penjelasan lengkap dan mudah dipahami</p>
                </div>
              </div>
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: moduleData.content }}
                style={{
                  lineHeight: '1.8',
                }}
              />
            </div>

            {/* Interactive Demo */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Demo Interaktif</h3>
                  <p className="text-gray-600">Simulasi rangkaian untuk pemahaman lebih baik</p>
                </div>
              </div>
              <InteractiveCircuitDemo
                voltage={moduleData.demoData.voltage}
                resistance={moduleData.demoData.resistance}
                title={moduleData.demoData.title}
              />
            </div>

            {/* Completion Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="text-center">
                {!isModuleCompleted(moduleData.id) ? (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Selesaikan Modul Ini</h3>
                    <p className="text-gray-600 mb-6">
                      Tandai modul sebagai selesai setelah memahami semua materi
                    </p>
                    <button
                      onClick={handleMarkComplete}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      ✅ Tandai Selesai
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">Modul Selesai! 🎉</h3>
                    <p className="text-green-600">
                      Selamat! Anda telah menyelesaikan modul ini dengan baik.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
            <Link 
              href="/materials" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
            >
              <span>←</span>
              <span>Kembali ke Daftar Materi</span>
            </Link>
            
            <Link 
              href="/practicum" 
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <span>Lanjut ke Praktikum</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
