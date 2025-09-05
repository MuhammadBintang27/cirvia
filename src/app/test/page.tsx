import Navbar from '@/components/Navbar'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
              <span className="text-3xl">📝</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Test & Evaluasi
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Uji pemahaman Anda tentang rangkaian listrik dengan berbagai jenis tes dan evaluasi
            </p>
          </div>

          {/* Test Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Pre-test */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Pre-Test</h3>
                <p className="text-gray-600 mb-6">
                  Tes awal untuk mengukur pemahaman dasar Anda tentang rangkaian listrik sebelum mulai belajar
                </p>
                <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-all transform hover:scale-105">
                  Mulai Pre-Test
                </button>
              </div>
            </div>

            {/* Post-test */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Post-Test</h3>
                <p className="text-gray-600 mb-6">
                  Tes akhir untuk mengukur peningkatan pemahaman Anda setelah mempelajari semua materi
                </p>
                <button className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105">
                  Mulai Post-Test
                </button>
              </div>
            </div>

            {/* Quiz */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Quiz Interaktif</h3>
                <p className="text-gray-600 mb-6">
                  Kuis singkat untuk menguji pemahaman setiap modul pembelajaran yang telah Anda selesaikan
                </p>
                <button className="w-full bg-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-600 transition-all transform hover:scale-105">
                  Mulai Quiz
                </button>
              </div>
            </div>

            {/* Practice Exercises */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Latihan Soal</h3>
                <p className="text-gray-600 mb-6">
                  Kumpulan soal-soal latihan untuk mengasah kemampuan perhitungan rangkaian listrik
                </p>
                <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105">
                  Mulai Latihan
                </button>
              </div>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sedang Dalam Pengembangan</h3>
            <p className="text-gray-600">
              Fitur tes dan evaluasi sedang dalam tahap pengembangan. 
              Silakan explore materi pembelajaran dan praktikum terlebih dahulu!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
