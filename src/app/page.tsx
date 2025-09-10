import Link from 'next/link'
import Navbar from '@/components/Navbar'


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Navbar */}
      <Navbar />

      <main className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                <span className="text-6xl relative z-10">⚡</span>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
            </div>
            <h1 className="text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                CIRVIA
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Circuit Virtual Interactive Application
              </span>
            </h1>
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Platform pembelajaran fisika yang menggabungkan simulasi rangkaian listrik virtual dengan teknologi computer vision untuk deteksi gerakan tangan, membuat belajar menjadi lebih menyenangkan dan efektif.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                href="/practicum" 
                className="btn bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all transform hover:scale-105 shadow-lg"
              >
                Mulai Praktikum
              </Link>
              <Link 
                href="/materials" 
                className="btn bg-white/10 text-blue-200 px-8 py-3 rounded-lg font-semibold border-2 border-blue-500/30 hover:bg-blue-900/20 transition-all transform hover:scale-105 shadow-lg"
              >
                Pelajari Materi
              </Link>
            </div>
            <div className="flex justify-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-blue-300 text-sm">Soal Berkualitas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-blue-300 text-sm">Tingkat Akurasi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-300 text-sm">Akses Unlimited</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-indigo-600/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2 text-center">Materi Pembelajaran</h3>
                <p className="text-blue-300 text-center">Konsep dasar rangkaian listrik dengan penjelasan yang mudah dipahami</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-indigo-600/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">🔬</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2 text-center">Praktikum Virtual</h3>
                <p className="text-blue-300 text-center">Simulasi rangkaian listrik interaktif dengan perhitungan real-time</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-indigo-600/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">👋</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2 text-center">Deteksi Gerakan</h3>
                <p className="text-blue-300 text-center">Teknologi computer vision untuk kontrol dengan gerakan tangan</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-indigo-600/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2 text-center">Evaluasi</h3>
                <p className="text-blue-300 text-center">Pre-test, post-test, dan kuis untuk mengukur pemahaman</p>
              </div>
            </div>
          </div>

          {/* Quick Access Menu */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 animate-scale-in mb-16">
            <h3 className="text-2xl font-bold text-blue-200 mb-6 text-center">Menu Pembelajaran</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link 
                href="/pretest" 
                className="group p-6 border-2 border-white/20 rounded-xl hover:border-blue-400/50 hover:bg-blue-900/10 transition-all"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="text-lg font-semibold text-blue-200 mb-2">Pre-Test</h4>
                  <p className="text-blue-300 text-sm">Uji pemahaman awal sebelum belajar</p>
                </div>
              </Link>
              <Link 
                href="/practicum" 
                className="group p-6 border-2 border-white/20 rounded-xl hover:border-blue-400/50 hover:bg-blue-900/10 transition-all"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h4 className="text-lg font-semibold text-blue-200 mb-2">Praktikum</h4>
                  <p className="text-blue-300 text-sm">Simulasi rangkaian listrik interaktif</p>
                </div>
              </Link>
              <Link 
                href="/posttest" 
                className="group p-6 border-2 border-white/20 rounded-xl hover:border-blue-400/50 hover:bg-blue-900/10 transition-all"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h4 className="text-lg font-semibold text-blue-200 mb-2">Post-Test</h4>
                  <p className="text-blue-300 text-sm">Evaluasi pemahaman setelah belajar</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Testimonials & Why CIRVIA Section */}
          <section className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Apa Kata Mereka */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 animate-fade-in">
                <h3 className="text-2xl font-bold text-blue-200 mb-6 text-center">Apa Kata Mereka</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Testimoni 1" className="w-14 h-14 rounded-full border-2 border-blue-400" />
                    <div>
                      <p className="text-blue-300 italic">“Belajar listrik jadi jauh lebih seru dan mudah dipahami. Praktikum virtualnya sangat membantu!”</p>
                      <span className="block text-sm text-blue-200 mt-2 font-semibold">Rizky, Siswa SMA</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Testimoni 2" className="w-14 h-14 rounded-full border-2 border-blue-300" />
                    <div>
                      <p className="text-blue-300 italic">“Teknologi deteksi gerakan tangan bikin simulasi rangkaian listrik jadi interaktif banget!”</p>
                      <span className="block text-sm text-blue-200 mt-2 font-semibold">Dewi, Guru Fisika</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Testimoni 3" className="w-14 h-14 rounded-full border-2 border-blue-200" />
                    <div>
                      <p className="text-blue-300 italic">“CIRVIA sangat membantu saya memahami konsep rangkaian listrik dengan cara yang menyenangkan.”</p>
                      <span className="block text-sm text-blue-200 mt-2 font-semibold">Andi, Mahasiswa</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Kenapa Cirvia */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 animate-fade-in">
                <h3 className="text-2xl font-bold text-blue-200 mb-6 text-center">Kenapa CIRVIA?</h3>
                <ul className="space-y-5 text-lg text-blue-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-2xl">⚡</span>
                    <span>Simulasi rangkaian listrik interaktif & real-time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-300 text-2xl">👋</span>
                    <span>Kontrol praktikum dengan deteksi gerakan tangan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-200 text-2xl">🎓</span>
                    <span>Materi & evaluasi lengkap untuk semua level</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-100 text-2xl">💡</span>
                    <span>Tampilan modern, mudah digunakan, dan responsif</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-8 mt-16 animate-fade-in rounded-t-3xl">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Physics Circuit Simulator</h3>
                <p className="text-blue-200">Platform Pembelajaran Rangkaian Listrik Interaktif</p>
                <p className="text-blue-300 text-sm mt-4">© 2024 Physics Circuit Simulator. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
