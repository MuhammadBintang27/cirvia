'use client';

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ChevronRight, Play, Star, Users, Clock, Award, BookOpen, Zap, Eye, Target, ArrowRight, CheckCircle, Trophy, Brain } from 'lucide-react'

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      name: "Rizky Pratama",
      role: "Siswa SMA Negeri 1 Jakarta",
      image: "/testimoni/testi1.JPG",
      content: "CIRVIA benar-benar mengubah cara saya memahami fisika! Simulasi rangkaian listriknya sangat realistis dan mudah dipahami.",
      tipePengguna: "Siswa",
    },
    {
      name: "Dr. Sari Wijaya",
      role: "Guru Fisika SMA",
      image: "/testimoni/testi1.JPG",
      content: "Platform pembelajaran terbaik yang pernah saya gunakan. Siswa jadi lebih antusias belajar fisika dengan teknologi AR ini.",
      tipePengguna: "Guru",
    },
    {
      name: "Dr. Susilawati S, Pd. M. Ed.",
      role: "Dosen Pendidikan Fisika Universitas Syiah Kuala",
      image: "/testimoni/testi1.JPG",
      content: "Deteksi gerakan tangannya amazing! Praktikum jadi lebih interaktif dan engaging. Highly recommended!",
      tipePengguna: "Validator Materi Pembelajaran",
    },
    {
      name: "Andriani Putri M. Sc.",
      role: "Dosen Universitas Syiah Kuala",
      image: "/testimoni/testi1.JPG",
      content: "Deteksi gerakan tangannya amazing! Praktikum jadi lebih interaktif dan engaging. Highly recommended!",
      tipePengguna: "Validator Media Pembelajaran",
    }
  ];

  

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    setIsVisible(true);
    
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative mb-8">
              {/* Enhanced Logo with multiple layers */}
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-400/5 to-blue-500/5 animate-pulse delay-500"></div>
                <div className="relative w-[80px] h-[80px] z-10">
                  <Image src="/assets/illustrations/Iconutama.png" alt="CIRVIA Logo" fill className="object-contain drop-shadow-lg" />
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            
            {/* Enhanced Title with Animation */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl block animate-fade-in">
                  CIRVIA
                </span>
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent block text-lg sm:text-2xl md:text-3xl lg:text-5xl mt-2 animate-slide-up">
                  Circuit Virtual Interactive Application
                </span>
              </h1>
              
              {/* Enhanced Tagline */}
              <div className="relative">
                <p className="text-xl sm:text-2xl text-blue-200/90 max-w-4xl mx-auto leading-relaxed mb-4 font-medium">
                Revolusi Pembelajaran Fisika dengan Teknologi AI & Computer Vision
                </p>
                <p className="text-lg text-blue-300/80 max-w-3xl mx-auto leading-relaxed mb-8">
                  Platform pembelajaran fisika yang menggabungkan simulasi rangkaian listrik virtual dengan teknologi computer vision untuk deteksi gerakan tangan, membuat belajar menjadi lebih menyenangkan dan efektif.
                </p>
              </div>
            </div>

            {/* Enhanced Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/practicum" 
                className="group relative bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-10 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-500 transition-all transform hover:scale-105 shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Mulai Praktikum Virtual</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link 
                href="/materials" 
                className="group bg-white/10 text-blue-200 px-10 py-4 rounded-xl font-bold border-2 border-blue-500/30 hover:bg-blue-900/20 hover:border-blue-400/50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Eksplorasi Materi</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/learning-style" 
                className="group bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 px-10 py-4 rounded-xl font-bold border-2 border-purple-400/30 hover:bg-purple-900/20 hover:border-purple-400/50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Brain className="w-5 h-5" />
                <span>Tes Gaya Belajar</span>
              </Link>
            </div>

            
          </div>

          {/* Enhanced Features Section */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Fitur Unggulan
                </span>
              </h2>
              <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
                Teknologi terdepan untuk pengalaman belajar fisika yang tak terlupakan
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {[
                {
                  icon: "📚",
                  title: "Materi Interaktif",
                  description: "Konsep dasar rangkaian listrik dengan animasi 3D dan penjelasan step-by-step",
                  color: "from-blue-500/50 to-indigo-600/50",
                  bgColor: "from-blue-500/10 to-indigo-600/10"
                },
                {
                  icon: "🔬",
                  title: "Lab Virtual",
                  description: "Simulasi rangkaian listrik real-time dengan komponen elektronik autentik", 
                  color: "from-emerald-500/50 to-cyan-600/50",
                  bgColor: "from-emerald-500/10 to-cyan-600/10"
                },
                {
                  icon: "👋",
                  title: "AR Hand Tracking",
                  description: "Kontrol praktikum dengan deteksi gerakan tangan menggunakan AI computer vision",
                  color: "from-purple-500/50 to-pink-600/50", 
                  bgColor: "from-purple-500/10 to-pink-600/10"
                },
                {
                  icon: "🎯",
                  title: "Smart Assessment",
                  description: "Evaluasi adaptif dengan analisis gaya belajar dan progress tracking real-time",
                  color: "from-yellow-500/50 to-orange-600/50",
                  bgColor: "from-yellow-500/10 to-orange-600/10"
                }
              ].map((feature, index) => (
                <div key={index} className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000`}></div>
                  <div className={`relative bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 h-full flex flex-col`}>
                    <div className="text-center flex-grow">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                        <span className="text-4xl">{feature.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-blue-200/80 leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-center text-blue-300 text-sm font-medium group-hover:text-white transition-colors">
                        <span>Pelajari Lebih Lanjut</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Pembelajaran Adaptif</h4>
                </div>
                <p className="text-blue-200/80 text-sm">
                  Sistem AI yang menyesuaikan materi berdasarkan gaya belajar dan kemampuan individual siswa
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Real-time Feedback</h4>
                </div>
                <p className="text-blue-200/80 text-sm">
                  Umpan balik instan untuk setiap interaksi, membantu siswa memahami konsep dengan lebih cepat
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Gamifikasi</h4>
                </div>
                <p className="text-blue-200/80 text-sm">
                  Sistem poin, badge, dan leaderboard untuk membuat pembelajaran lebih menyenangkan dan kompetitif
                </p>
              </div>
            </div>
          </section>

          {/* Enhanced Learning Journey */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                  Jalur Pembelajaran
                </span>
              </h2>
              <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
                Ikuti langkah-langkah pembelajaran yang telah dirancang khusus untuk hasil optimal
              </p>
            </div>

            <div className="relative">
              {/* Learning Path Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-emerald-500/50 transform -translate-y-1/2 z-0"></div>
              
              <div className="grid md:grid-cols-5 gap-6 relative z-10">
                {[
                  {
                    href: "/learning-style",
                    icon: "🧠",
                    title: "Tes Gaya Belajar",
                    description: "Identifikasi gaya belajar personal Anda",
                    color: "from-purple-500/20 to-pink-500/20",
                    borderColor: "border-purple-400/30",
                    number: "1"
                  },
                  {
                    href: "/pretest",
                    icon: "📝",
                    title: "Tes Diagnostik",
                    description: "Evaluasi pengetahuan awal tentang rangkaian listrik",
                    color: "from-blue-500/20 to-indigo-500/20",
                    borderColor: "border-blue-400/30",
                    number: "2"
                  },
                  {
                    href: "/materials",
                    icon: "📚",
                    title: "Materi",
                    description: "Pelajari konsep dasar hingga advanced",
                    color: "from-emerald-500/20 to-cyan-500/20",
                    borderColor: "border-emerald-400/30",
                    number: "3"
                  },
                  {
                    href: "/practicum",
                    icon: "⚡",
                    title: "Praktikum Virtual",
                    description: "Simulasi interaktif dengan CV hand tracking",
                    color: "from-yellow-500/20 to-orange-500/20",
                    borderColor: "border-yellow-400/30",
                    number: "4"
                  },
                  {
                    href: "/posttest",
                    icon: "🏆",
                    title: "Tes Sumatif",
                    description: "Ukur peningkatan pemahaman Anda",
                    color: "from-green-500/20 to-emerald-500/20",
                    borderColor: "border-green-400/30",
                    number: "5"
                  }
                ].map((step, index) => (
                  <Link 
                    key={index}
                    href={step.href} 
                    className="group relative"
                  >
                    {/* Step Number */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold z-20 group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>
                    
                    <div className={`bg-gradient-to-br ${step.color} backdrop-blur-xl rounded-2xl p-6 border-2 ${step.borderColor} hover:border-opacity-100 border-opacity-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 h-full pt-8`}>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                          <span className="text-3xl">{step.icon}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
                        <p className="text-blue-200/80 text-sm leading-relaxed">{step.description}</p>
                        
                        <div className="mt-4 flex items-center justify-center text-blue-300 text-xs font-medium group-hover:text-white transition-colors">
                          <span>Mulai Sekarang</span>
                          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            
          </section>

          {/* Enhanced Testimonials Section - Centered */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Apa Kata Mereka
                </span>
              </h3>
              <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
                Testimoni nyata dari pengguna CIRVIA yang telah merasakan manfaatnya
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                {/* Decorative Quote Icon */}
                <div className="absolute top-6 left-6 text-6xl text-blue-400/20 font-serif">&ldquo;</div>
                
                {/* Testimonial Slider */}
                <div className="relative min-h-[400px]">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === currentTestimonial 
                          ? 'opacity-100 translate-x-0 z-10' 
                          : index < currentTestimonial 
                            ? 'opacity-0 -translate-x-full z-0' 
                            : 'opacity-0 translate-x-full z-0'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center h-full justify-between">
                        {/* Profile Image */}
                        <div className="relative mb-6">
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/50 to-purple-500/50 rounded-full blur-lg"></div>
                          <Image 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            width={120} 
                            height={120} 
                            className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-400/50 shadow-2xl object-cover" 
                          />

                        </div>
                        
                        {/* Testimonial Content */}
                        <div className="flex-1 flex flex-col justify-center max-w-2xl">
                          <blockquote className="text-blue-100 text-lg md:text-xl lg:text-2xl italic leading-relaxed mb-8 font-medium">
                            &ldquo;{testimonial.content}&rdquo;
                          </blockquote>
                          
                          
                          
                          {/* Author Info */}
                          <div className="space-y-1">
                            <h4 className="text-2xl font-bold text-white">{testimonial.name}</h4>
                            <p className="text-blue-300 text-base">{testimonial.role}</p>
                          </div>
                        </div>

                        {/* Footer Badge */}
                        <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-blue-300 text-sm font-medium">{testimonial.tipePengguna}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center transition-all transform hover:scale-110 group"
                >
                  <ChevronRight className="w-6 h-6 text-white rotate-180 group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center transition-all transform hover:scale-110 group"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Testimonial Indicators */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentTestimonial 
                          ? 'bg-blue-400 w-8' 
                          : 'bg-blue-400/30 w-2 hover:bg-blue-400/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          
        </div>
      </div>
    </>
  )
}