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
      rating: 5
    },
    {
      name: "Dr. Sari Wijaya",
      role: "Guru Fisika SMA",
      image: "/testimoni/testi1.JPG",
      content: "Platform pembelajaran terbaik yang pernah saya gunakan. Siswa jadi lebih antusias belajar fisika dengan teknologi AR ini.",
      rating: 5
    },
    {
      name: "Ahmad Fauzi",
      role: "Mahasiswa Teknik Elektro",
      image: "/testimoni/testi1.JPG",
      content: "Deteksi gerakan tangannya amazing! Praktikum jadi lebih interaktif dan engaging. Highly recommended!",
      rating: 5
    }
  ];

  const achievements = [
    { number: "15,000+", label: "Siswa Aktif", icon: Users },
    { number: "98%", label: "Tingkat Kepuasan", icon: Star },
    { number: "500+", label: "Sekolah Partner", icon: Award },
    { number: "24/7", label: "Dukungan Online", icon: Clock }
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
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-400/5 to-blue-500/5 animate-pulse delay-500"></div>
                <Image src="/logo.png" alt="CIRVIA Logo" width={100} height={100} className="relative z-10 w-24 h-24 object-contain drop-shadow-lg" />
              </div>
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
            
            {/* Enhanced Title with Animation */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 leading-tight">
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
                  🚀 Revolusi Pembelajaran Fisika dengan Teknologi AR & Computer Vision
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

            {/* Enhanced Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all transform hover:scale-105">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{achievement.number}</div>
                      <div className="text-blue-300 text-sm font-medium text-center">{achievement.label}</div>
                    </div>
                  </div>
                );
              })}
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
                    title: "Pre-Test",
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
                    description: "Simulasi interaktif dengan AR hand tracking",
                    color: "from-yellow-500/20 to-orange-500/20",
                    borderColor: "border-yellow-400/30",
                    number: "4"
                  },
                  {
                    href: "/posttest",
                    icon: "🏆",
                    title: "Post-Test",
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

            {/* Quick Stats */}
            <div className="mt-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-400 mb-2">15 Menit</div>
                  <div className="text-blue-200/80">Rata-rata waktu per modul</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">89%</div>
                  <div className="text-blue-200/80">Tingkat penyelesaian</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">4.8/5</div>
                  <div className="text-blue-200/80">Rating kepuasan</div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Testimonials & Benefits Section */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Interactive Testimonials */}
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                      Apa Kata Mereka
                    </span>
                  </h3>
                  <p className="text-blue-200/80">Testimoni nyata dari pengguna CIRVIA</p>
                </div>

                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 min-h-[350px] max-h-[400px]">
                  {/* Testimonial Slider */}
                  <div className="relative h-full">
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-500 flex ${
                          index === currentTestimonial 
                            ? 'opacity-100 translate-x-0 z-10' 
                            : index < currentTestimonial 
                              ? 'opacity-0 -translate-x-full z-0' 
                              : 'opacity-0 translate-x-full z-0'
                        }`}
                      >
                        {/* Large Profile Image */}
                        <div className="flex-shrink-0 mr-6">
                          <div className="relative">
                            <Image 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              width={120} 
                              height={120} 
                              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-400/50 shadow-xl object-cover" 
                            />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Content Area */}
                        <div className="flex-1 flex flex-col justify-between min-h-0">
                          {/* Profile Info */}
                          <div className="mb-4">
                            <h4 className="text-xl font-bold text-white mb-1">{testimonial.name}</h4>
                            <p className="text-blue-300 text-sm mb-2">{testimonial.role}</p>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          
                          {/* Testimonial Content */}
                          <blockquote className="text-blue-200 text-base md:text-lg italic leading-relaxed flex-grow mb-4">
                            &ldquo;{testimonial.content}&rdquo;
                          </blockquote>
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div className="text-blue-400 text-sm font-medium">Verified User</div>
                            <div className="text-yellow-400 text-sm font-bold">⭐ {testimonial.rating}.0</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentTestimonial 
                            ? 'bg-blue-400 w-8' 
                            : 'bg-blue-400/30 hover:bg-blue-400/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Benefits */}
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    <span className="bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent">
                      Mengapa CIRVIA?
                    </span>
                  </h3>
                  <p className="text-blue-200/80">Keunggulan yang membuat pembelajaran lebih efektif</p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: Zap,
                      title: "Teknologi AR Terdepan",
                      description: "Simulasi rangkaian listrik dengan teknologi Augmented Reality dan hand tracking untuk pengalaman immersive",
                      color: "text-yellow-400",
                      bgColor: "bg-yellow-500/10"
                    },
                    {
                      icon: Eye,
                      title: "Computer Vision AI",
                      description: "Deteksi gerakan tangan real-time menggunakan AI untuk kontrol praktikum yang natural dan intuitif",
                      color: "text-purple-400",
                      bgColor: "bg-purple-500/10"
                    },
                    {
                      icon: Target,
                      title: "Pembelajaran Adaptif",
                      description: "Sistem AI yang menyesuaikan materi berdasarkan gaya belajar dan kemampuan individual siswa",
                      color: "text-green-400",
                      bgColor: "bg-green-500/10"
                    },
                    {
                      icon: Users,
                      title: "Collaborative Learning",
                      description: "Platform kolaborasi yang memungkinkan pembelajaran berkelompok dan berbagi progress dengan teman",
                      color: "text-blue-400",
                      bgColor: "bg-blue-500/10"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="group">
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${benefit.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                              {benefit.title}
                            </h4>
                            <p className="text-blue-200/80 leading-relaxed">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                
              </div>
            </div>
          </section>

          {/* Call-to-Action Section */}
          <section className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Siap Revolusi Cara Belajar Fisika?
              </h2>
              <p className="text-xl text-blue-200/90 max-w-3xl mx-auto mb-8">
                Bergabunglah dengan ribuan siswa yang telah merasakan pengalaman belajar fisika yang tak terlupakan
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link 
                  href="/login" 
                  className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-2xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Mulai Gratis Sekarang</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                <Link 
                  href="/about" 
                  className="group bg-white/10 text-blue-200 px-10 py-4 rounded-xl font-bold border-2 border-blue-500/30 hover:bg-blue-900/20 hover:border-blue-400/50 transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Pelajari Lebih Lanjut</span>
                    <Eye className="w-5 h-5" />
                  </div>
                </Link>
              </div>

              
            </div>
          </section>
        </div>
      </div>
    </>
  )
}