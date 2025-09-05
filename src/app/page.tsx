import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            CIRVIA - Circuit Virtual Interactive Application
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              {' '}Teknologi Interaktif
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform pembelajaran fisika yang menggabungkan simulasi rangkaian listrik virtual dengan teknologi computer vision 
            untuk deteksi gerakan tangan, membuat belajar menjadi lebih menyenangkan dan efektif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/practicum" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Mulai Praktikum
            </Link>
            <Link 
              href="/materials" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Pelajari Materi
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Materi Pembelajaran</h3>
            <p className="text-gray-600">Konsep dasar rangkaian listrik dengan penjelasan yang mudah dipahami</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Praktikum Virtual</h3>
            <p className="text-gray-600">Simulasi rangkaian listrik interaktif dengan perhitungan real-time</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Deteksi Gerakan</h3>
            <p className="text-gray-600">Teknologi computer vision untuk kontrol dengan gerakan tangan</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Evaluasi</h3>
            <p className="text-gray-600">Pre-test, post-test, dan kuis untuk mengukur pemahaman</p>
          </div>
        </div>

        {/* Quick Access Menu */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Menu Pembelajaran</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              href="/pretest" 
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Pre-Test</h4>
                <p className="text-gray-600 text-sm">Uji pemahaman awal sebelum belajar</p>
              </div>
            </Link>

            <Link 
              href="/practicum" 
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Praktikum</h4>
                <p className="text-gray-600 text-sm">Simulasi rangkaian listrik interaktif</p>
              </div>
            </Link>

            <Link 
              href="/posttest" 
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">✅</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Post-Test</h4>
                <p className="text-gray-600 text-sm">Evaluasi pemahaman setelah belajar</p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Physics Circuit Simulator</h3>
            <p className="text-gray-300">Platform Pembelajaran Rangkaian Listrik Interaktif</p>
            <p className="text-gray-400 text-sm mt-4">© 2024 Physics Circuit Simulator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
