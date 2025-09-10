import Navbar from '../../components/Navbar'
import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-6 shadow-lg">
              <span className="text-3xl">📝</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 drop-shadow-sm">
              <span className="text-primary-800">Test &</span>{' '}
              <span className="text-accent-500">Evaluasi</span>
            </h1>
            <p className="text-xl text-primary-700 max-w-2xl mx-auto leading-relaxed">
              Uji pemahaman Anda tentang rangkaian listrik dengan berbagai jenis tes dan evaluasi
            </p>
          </div>

          {/* Test Options - Clean & Simple */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Pre-test */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-100 hover:shadow-xl transition-all duration-300 animate-slide-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-primary-800 mb-3">Pre-Test</h3>
                <p className="text-primary-600 mb-6">
                  Tes awal untuk mengukur pemahaman dasar Anda tentang rangkaian listrik sebelum mulai belajar
                </p>
                <Link href="/pretest" passHref legacyBehavior>
                  <button className="w-full bg-primary-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-600 transition-all transform hover:scale-105 shadow-md">
                    Mulai Pre-Test
                  </button>
                </Link>
              </div>
            </div>

            {/* Post-test */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-success-200 hover:shadow-xl transition-all duration-300 animate-slide-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-success-700 mb-3">Post-Test</h3>
                <p className="text-primary-600 mb-6">
                  Tes akhir untuk mengukur peningkatan pemahaman Anda setelah mempelajari semua materi
                </p>
                <Link href="/posttest" passHref legacyBehavior>
                  <button className="w-full bg-success-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-success-600 transition-all transform hover:scale-105 shadow-md">
                    Mulai Post-Test
                  </button>
                </Link>
              </div>
            </div>

            {/* Quiz */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-200 hover:shadow-xl transition-all duration-300 animate-scale-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-2xl font-bold text-purple-700 mb-3">Quiz Interaktif</h3>
                <p className="text-primary-600 mb-6">
                  Kuis singkat untuk menguji pemahaman setiap modul pembelajaran yang telah Anda selesaikan
                </p>
                <Link href="/quiz" passHref legacyBehavior>
                  <button className="w-full bg-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-600 transition-all transform hover:scale-105 shadow-md">
                    Mulai Quiz
                  </button>
                </Link>
              </div>
            </div>

            {/* Practice Exercises */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-200 hover:shadow-xl transition-all duration-300 animate-scale-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-orange-700 mb-3">Latihan Soal</h3>
                <p className="text-primary-600 mb-6">
                  Kumpulan soal-soal latihan untuk mengasah kemampuan perhitungan rangkaian listrik
                </p>
                <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md">
                  Mulai Latihan
                </button>
              </div>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-2xl p-8 border border-accent-200 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h3 className="text-xl font-bold text-primary-800 mb-2">Sedang Dalam Pengembangan</h3>
            <p className="text-primary-600">
              Fitur tes dan evaluasi sedang dalam tahap pengembangan. 
              Silakan explore materi pembelajaran dan praktikum terlebih dahulu!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
