import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-6 py-16 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                <span className="text-5xl relative z-10">ℹ️</span>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
            </div>
            <h2 className="text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
              CIRVIA - Circuit Virtual Interactive Application
            </h2>
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Platform pembelajaran fisika inovatif yang menggabungkan teknologi computer vision dengan simulasi rangkaian listrik virtual untuk pengalaman belajar yang interaktif dan menyenangkan.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-white/10 to-blue-100/10 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20 animate-slide-in">
              <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-100 mb-4">Misi Kami</h3>
              <p className="text-blue-200 leading-relaxed">
                CIRVIA menyediakan platform pembelajaran fisika yang inovatif dan interaktif untuk membantu siswa memahami konsep rangkaian listrik melalui simulasi virtual dan teknologi computer vision yang memungkinkan kontrol dengan gerakan tangan.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-blue-100/10 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20 animate-slide-in">
              <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">👁️</span>
              </div>
              <h3 className="text-2xl font-bold text-green-300 mb-4">Visi Kami</h3>
              <p className="text-blue-200 leading-relaxed">
                Menjadi platform pembelajaran fisika virtual terdepan yang menggabungkan teknologi modern dengan metodologi pendidikan yang efektif, menciptakan generasi yang memahami konsep rangkaian listrik dengan lebih baik dan menyenangkan melalui CIRVIA.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-white/10 to-blue-100/10 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-white/20">
            <h3 className="text-2xl font-bold text-blue-100 mb-8 text-center">Fitur Unggulan</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">Simulasi Real-time</h4>
                <p className="text-blue-200 text-sm">Perhitungan arus, tegangan, dan resistansi secara real-time</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👋</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">Computer Vision</h4>
                <p className="text-blue-200 text-sm">Kontrol dengan gerakan tangan menggunakan teknologi AI</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">Pembelajaran Adaptif</h4>
                <p className="text-blue-200 text-sm">Materi yang disesuaikan dengan tingkat pemahaman siswa</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">Evaluasi Komprehensif</h4>
                <p className="text-blue-200 text-sm">Pre-test, post-test, dan kuis untuk mengukur progress</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-cyan-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">Praktikum Virtual</h4>
                <p className="text-blue-200 text-sm">Laboratorium virtual yang aman dan mudah diakses</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-pink-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">Responsif</h4>
                <p className="text-blue-200 text-sm">Dapat diakses dari berbagai perangkat</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-gradient-to-br from-white/10 to-blue-100/10 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-16 border border-white/20">
            <h3 className="text-2xl font-bold text-blue-100 mb-8 text-center">Tim Pengembang</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">👨‍💻</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">Tim Pengembang</h4>
                <p className="text-blue-200 text-sm">Ahli dalam pengembangan web dan computer vision</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">👩‍🏫</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">Konsultan Pendidikan</h4>
                <p className="text-blue-200 text-sm">Pakar pendidikan fisika dan metodologi pembelajaran</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">🎨</span>
                </div>
                <h4 className="font-semibold text-blue-100 mb-2">UI/UX Designer</h4>
                <p className="text-blue-200 text-sm">Spesialis dalam desain interface yang user-friendly</p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-gradient-to-br from-white/10 to-blue-100/10 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-blue-100 mb-8 text-center">Teknologi yang Digunakan</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 border border-white/20 rounded-lg">
                <div className="text-2xl mb-2">⚛️</div>
                <h4 className="font-semibold text-blue-100">React & Next.js</h4>
                <p className="text-blue-200 text-sm">Frontend framework modern</p>
              </div>
              <div className="text-center p-4 border border-white/20 rounded-lg">
                <div className="text-2xl mb-2">🎨</div>
                <h4 className="font-semibold text-blue-100">Tailwind CSS</h4>
                <p className="text-blue-200 text-sm">Styling yang responsif</p>
              </div>
              <div className="text-center p-4 border border-white/20 rounded-lg">
                <div className="text-2xl mb-2">🤖</div>
                <h4 className="font-semibold text-blue-100">TensorFlow.js</h4>
                <p className="text-blue-200 text-sm">Computer vision & AI</p>
              </div>
              <div className="text-center p-4 border border-white/20 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <h4 className="font-semibold text-blue-100">Progressive Web App</h4>
                <p className="text-blue-200 text-sm">Aksesibilitas optimal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
