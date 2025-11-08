'use client';

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <Navbar />
      <div className="container mx-auto px-6 py-16 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section - Enhanced */}
          <div className="text-center mb-20 relative">
            <div className="relative mb-8 inline-block">
              {/* Glowing Ring Animation */}
              <div className="absolute -inset-8 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 blur-2xl"></div>
              </div>
              
              {/* Main Icon */}
              <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border-2 border-blue-400/30 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 animate-pulse"></div>
                <span className="text-6xl relative z-10 animate-bounce-slow">⚡</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="inline-block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-gradient">
                CIRVIA
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-bold text-blue-200 mb-4 tracking-wide">
              Circuit Virtual Interactive Application
            </p>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-blue-200/90 leading-relaxed mb-8">
                Platform pembelajaran fisika inovatif yang menggabungkan teknologi 
                <span className="text-cyan-300 font-semibold"> Computer Vision </span> 
                dengan simulasi rangkaian listrik virtual untuk pengalaman belajar yang 
                <span className="text-purple-300 font-semibold"> interaktif </span> 
                dan 
                <span className="text-pink-300 font-semibold"> menyenangkan</span>.
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all hover:scale-105">
                  <div className="text-3xl font-bold text-blue-300">100+</div>
                  <div className="text-sm text-blue-200/70">Siswa</div>
                </div>
                <div className="bg-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-400/20 hover:border-purple-400/40 transition-all hover:scale-105">
                  <div className="text-3xl font-bold text-purple-300">50+</div>
                  <div className="text-sm text-purple-200/70">Soal</div>
                </div>
                <div className="bg-cyan-500/10 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/20 hover:border-cyan-400/40 transition-all hover:scale-105">
                  <div className="text-3xl font-bold text-cyan-300">95%</div>
                  <div className="text-sm text-cyan-200/70">Kepuasan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision - Enhanced */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-blue-400/30 h-full transform group-hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4">
                    Misi Kami
                  </h3>
                  <p className="text-blue-200/90 leading-relaxed text-lg">
                    Menyediakan platform pembelajaran fisika yang inovatif dan interaktif untuk membantu siswa memahami konsep rangkaian listrik melalui 
                    <span className="text-cyan-300 font-semibold"> simulasi virtual</span> dan 
                    <span className="text-blue-300 font-semibold"> teknologi computer vision</span> yang memungkinkan kontrol dengan gerakan tangan.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative bg-gradient-to-br from-slate-800/80 to-emerald-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-emerald-400/30 h-full transform group-hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform">
                    <span className="text-4xl">🌟</span>
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent mb-4">
                    Visi Kami
                  </h3>
                  <p className="text-emerald-200/90 leading-relaxed text-lg">
                    Menjadi platform pembelajaran fisika virtual terdepan yang menggabungkan teknologi modern dengan metodologi pendidikan yang efektif, menciptakan generasi yang memahami konsep rangkaian listrik dengan lebih baik melalui 
                    <span className="text-green-300 font-semibold"> CIRVIA</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features - Enhanced Grid */}
          <div className="relative mb-16">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-purple-400/20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-3">
                  Fitur Unggulan
                </h3>
                <p className="text-purple-200/70 max-w-2xl mx-auto">
                  Teknologi terkini untuk pengalaman belajar yang optimal
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: '⚡', title: 'Simulasi Real-time', desc: 'Perhitungan I, V, R secara langsung', color: 'blue' },
                  { icon: '👋', title: 'Computer Vision', desc: 'Kontrol dengan gesture tangan AI', color: 'purple' },
                  { icon: '🎓', title: 'Pembelajaran Adaptif', desc: 'Materi sesuai tingkat pemahaman', color: 'emerald' },
                  { icon: '📊', title: 'Evaluasi Lengkap', desc: 'Pre-test, post-test, dan kuis', color: 'orange' },
                  { icon: '🔧', title: 'Lab Virtual', desc: 'Praktikum aman dan mudah', color: 'cyan' },
                  { icon: '📱', title: 'Multi-Platform', desc: 'Akses dari berbagai device', color: 'pink' },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`group relative bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/10 backdrop-blur-sm rounded-2xl p-6 border border-${feature.color}-400/20 hover:border-${feature.color}-400/50 transition-all hover:scale-105 hover:-translate-y-1`}
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r from-${feature.color}-500/20 to-${feature.color}-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="relative">
                      <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <span className="text-3xl">{feature.icon}</span>
                      </div>
                      <h4 className={`font-bold text-${feature.color}-100 text-lg mb-2`}>
                        {feature.title}
                      </h4>
                      <p className={`text-${feature.color}-200/80 text-sm leading-relaxed`}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team - Enhanced */}
          <div className="relative mb-16">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-slate-800/60 to-cyan-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-cyan-400/20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl mb-4">
                  <span className="text-3xl">�</span>
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-3">
                  Tim Pengembang
                </h3>
                <p className="text-cyan-200/70 max-w-2xl mx-auto">
                  Dibangun oleh tim berpengalaman dan berdedikasi
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  { name: 'Tim Pengembang', role: 'Ahli web & computer vision', avatar: '👨‍💻', color: 'blue' },
                  { name: 'Konsultan Pendidikan', role: 'Pakar fisika & metodologi', avatar: '👩‍🏫', color: 'emerald' },
                  { name: 'UI/UX Designer', role: 'Spesialis interface design', avatar: '🎨', color: 'purple' },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r from-${member.color}-500/30 to-${member.color}-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transform group-hover:scale-105 transition-all">
                      <div className="text-center">
                        <div className={`w-24 h-24 bg-gradient-to-br from-${member.color}-500/20 to-${member.color}-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-${member.color}-400/30 group-hover:border-${member.color}-400/60 transition-all group-hover:rotate-6`}>
                          <span className="text-5xl">{member.avatar}</span>
                        </div>
                        <h4 className={`font-bold text-xl bg-gradient-to-r from-${member.color}-300 to-${member.color}-400 bg-clip-text text-transparent mb-2`}>
                          {member.name}
                        </h4>
                        <p className="text-slate-300 text-sm font-medium">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Stack - Enhanced */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-slate-800/60 to-orange-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-orange-400/20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl mb-4">
                  <span className="text-3xl">⚙️</span>
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-300 via-amber-300 to-orange-300 bg-clip-text text-transparent mb-3">
                  Teknologi yang Digunakan
                </h3>
                <p className="text-orange-200/70 max-w-2xl mx-auto">
                  Stack teknologi modern untuk performa optimal
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '⚛️', name: 'React & Next.js', desc: 'Frontend framework modern', color: 'blue' },
                  { icon: '🎨', name: 'Tailwind CSS', desc: 'Styling yang responsif', color: 'cyan' },
                  { icon: '🤖', name: 'TensorFlow.js', desc: 'Computer vision & AI', color: 'purple' },
                  { icon: '📱', name: 'Progressive Web App', desc: 'Aksesibilitas optimal', color: 'emerald' },
                ].map((tech, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r from-${tech.color}-500/30 to-${tech.color}-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    <div className={`relative bg-gradient-to-br from-${tech.color}-500/10 to-${tech.color}-600/10 backdrop-blur-sm rounded-2xl p-6 border border-${tech.color}-400/20 hover:border-${tech.color}-400/50 transform group-hover:scale-105 transition-all`}>
                      <div className="text-center">
                        <div className={`w-16 h-16 bg-${tech.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform`}>
                          <span className="text-4xl">{tech.icon}</span>
                        </div>
                        <h4 className={`font-bold text-lg bg-gradient-to-r from-${tech.color}-300 to-${tech.color}-400 bg-clip-text text-transparent mb-2`}>
                          {tech.name}
                        </h4>
                        <p className={`text-${tech.color}-200/80 text-sm`}>
                          {tech.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <GallerySection />
        </div>
      </div>
    </div>
  )
}

// Gallery Component with Slider
function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = [
    { src: '/galeri/gambar1.png', title: 'Tim Pengembang CIRVIA', description: 'Kolaborasi tim dalam mengembangkan platform' },
    { src: '/galeri/gambar2.png', title: 'Workshop Pembelajaran', description: 'Sesi pelatihan penggunaan CIRVIA' },
    { src: '/galeri/gambar3.png', title: 'Praktikum Virtual', description: 'Siswa menggunakan fitur computer vision' },
    { src: '/galeri/gambar4.png', title: 'Presentasi Project', description: 'Demonstrasi fitur-fitur unggulan' },
    { src: '/galeri/gambar5.png', title: 'Sesi Diskusi', description: 'Evaluasi dan pengembangan platform' },
    { src: '/galeri/gambar6.png', title: 'Testing & Quality', description: 'Pengujian kualitas pembelajaran' },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-purple-100/10 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20 overflow-hidden">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-400/30 mb-4">
          <span className="text-3xl">📸</span>
        </div>
        <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text mb-3">
          Galeri Kami
        </h3>
        <p className="text-blue-200/80 max-w-2xl mx-auto">
          Dokumentasi perjalanan pengembangan CIRVIA dan aktivitas tim
        </p>
      </div>

      {/* Main Slider */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
        
        {/* Image Container */}
        <div className="relative bg-gradient-to-br from-slate-900/80 to-purple-950/80 rounded-2xl overflow-hidden border-2 border-purple-400/30">
          <div className="relative h-96 md:h-[500px]">
            {/* Current Image */}
            <div className="relative w-full h-full">
              <Image
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].title}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900 to-transparent">
              <h4 className="text-2xl font-bold text-white mb-2">
                {galleryImages[currentIndex].title}
              </h4>
              <p className="text-blue-200/90">
                {galleryImages[currentIndex].description}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-6 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all ${
              currentIndex === index
                ? 'ring-4 ring-purple-400 scale-105'
                : 'ring-2 ring-white/20 hover:ring-purple-300 opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={image.src}
              alt={image.title}
              fill
              className="object-cover"
            />
            {currentIndex === index && (
              <div className="absolute inset-0 bg-purple-500/20"></div>
            )}
          </button>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              currentIndex === index
                ? 'w-8 h-2 bg-gradient-to-r from-purple-400 to-pink-400'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            } rounded-full`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="text-center mt-4">
        <span className="text-purple-200/70 text-sm font-medium">
          {currentIndex + 1} / {galleryImages.length}
        </span>
      </div>
    </div>
  );
}
