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
      <div className="container mx-auto px-4 md:px-8 py-16 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Hero Section - Who is Developer */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                Who is
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Developer?
              </span>
            </h1>
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto leading-relaxed">
              Tim berdedikasi di balik CIRVIA yang menghadirkan inovasi pembelajaran fisika
            </p>
          </div>

          {/* Team Members with Real Photos */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-slate-800/60 to-cyan-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-cyan-400/20">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Muhammad Bintang Indra Hidayat */}
                <div className="group relative h-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transform group-hover:scale-105 transition-all h-full flex flex-col">
                    <div className="text-center flex flex-col h-full">
                      <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden border-4 border-blue-400/30 group-hover:border-blue-400/60 transition-all">
                        <Image
                          src="/assets/team/bintang.png"
                          alt="Muhammad Bintang Indra Hidayat"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-2xl bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent mb-2">
                        Muhammad Bintang Indra Hidayat
                      </h4>
                      <p className="text-orange-400 text-sm font-semibold mb-3">
                        Full Stack Developer
                      </p>
                      <p className="text-slate-300 text-sm italic mt-auto">
                        &ldquo;I commit, I push, I build. Just like I do in life.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ahmad Syah Ramadhan */}
                <div className="group relative h-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transform group-hover:scale-105 transition-all h-full flex flex-col">
                    <div className="text-center flex flex-col h-full">
                      <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden border-4 border-purple-400/30 group-hover:border-purple-400/60 transition-all">
                        <Image
                          src="/assets/team/bintang.png"
                          alt="Ahmad Syah Ramadhan"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-2xl bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent mb-2">
                        Ahmad Syah Ramadhan
                      </h4>
                      <p className="text-orange-400 text-sm font-semibold mb-3">
                        Virtual Lab & CV Developer
                      </p>
                      <p className="text-slate-300 text-sm italic mt-auto">
                        &ldquo;Many think the mistake is taking a wrong step, but the real problem is whether they dare to take the next one&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alhusna Hanifah */}
                <div className="group relative h-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-green-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transform group-hover:scale-105 transition-all h-full flex flex-col">
                    <div className="text-center flex flex-col h-full">
                      <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden border-4 border-emerald-400/30 group-hover:border-emerald-400/60 transition-all">
                        <Image
                          src="/assets/team/bintang.png"
                          alt="Alhusna Hanifah"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-2xl bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent mb-2">
                        Alhusna Hanifah
                      </h4>
                      <p className="text-orange-400 text-sm font-semibold mb-3">
                        Content & Learning Material Designer
                      </p>
                      <p className="text-slate-300 text-sm italic mt-auto">
                        &ldquo;Don&apos;t let what you cannot do interfere with what you can do&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision - Enhanced */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
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
    { src: '/assets/galeri/gambar2.JPEG', title: 'Tim Pengembang CIRVIA', description: 'Kolaborasi tim dalam mengembangkan platform' },
    { src: '/assets/galeri/gambar2.JPEG', title: 'Workshop Pembelajaran', description: 'Sesi pelatihan penggunaan CIRVIA' },
    { src: '/assets/galeri/gambar2.JPEG', title: 'Praktikum Virtual', description: 'Siswa menggunakan fitur computer vision' },
    { src: '/assets/galeri/gambar2.JPEG', title: 'Presentasi Project', description: 'Demonstrasi fitur-fitur unggulan' },
    { src: '/assets/galeri/gambar2.JPEG', title: 'Sesi Diskusi', description: 'Evaluasi dan pengembangan platform' },
    { src: '/assets/galeri/gambar2.JPEG', title: 'Testing & Quality', description: 'Pengujian kualitas pembelajaran' },
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
    <div className="relative mb-16">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
      
      <div className="relative bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-purple-400/20">
        {/* Header */}
        <div className="text-center mb-8">
          
          <h3 className="text-4xl font-black bg-gradient-to-r from-purple-200 via-pink-300 to-purple-200 bg-clip-text text-transparent mb-3 drop-shadow-lg">
            Lens Of Us
          </h3>
          <p className="text-lg text-purple-200/80 max-w-3xl mx-auto leading-relaxed">
            Momen berharga dalam perjalanan pengembangan CIRVIA bersama tim
          </p>
          <div className="flex justify-center items-center gap-3 mt-3">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Main Slider */}
        <div className="relative group mb-6 px-2 sm:px-4 md:px-8 lg:px-16">
          {/* Enhanced Glow Effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-purple-500/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Image Container */}
          <div className="relative bg-gradient-to-br from-slate-900/90 to-purple-950/90 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-purple-400/40 shadow-2xl">
            <div className="relative h-[280px] sm:h-[320px] md:h-[350px] lg:h-[420px]">
              {/* Current Image with Animation */}
              <div className="relative w-full h-full">
                <Image
                  src={galleryImages[currentIndex].src}
                  alt={galleryImages[currentIndex].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                {/* Multi-layer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20"></div>
              </div>

              {/* Enhanced Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="h-0.5 sm:h-1 w-6 sm:w-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="text-purple-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                        {currentIndex + 1} / {galleryImages.length}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight">
                      {galleryImages[currentIndex].title}
                    </h4>
                    <p className="text-xs sm:text-sm md:text-base text-blue-200/90 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
                      {galleryImages[currentIndex].description}
                    </p>
                  </div>
                  
                  {/* Image Counter Badge */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-purple-400/30">
                    <span className="text-lg lg:text-xl font-bold text-white">
                      {currentIndex + 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 backdrop-blur-xl border-2 border-white/30 hover:border-purple-400/60 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-x-1 shadow-lg group/btn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover/btn:text-purple-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 backdrop-blur-xl border-2 border-white/30 hover:border-purple-400/60 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:translate-x-1 shadow-lg group/btn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover/btn:text-purple-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / galleryImages.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Thumbnail Navigation */}
        <div className="relative mb-6 px-2 sm:px-4">
          <div className="flex gap-2 sm:gap-3 justify-start md:justify-center pb-3 pt-3 overflow-x-auto scrollbar-hide">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ring-2 sm:ring-3 md:ring-4 ring-purple-400 scale-105 shadow-xl shadow-purple-500/50'
                    : 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ring-1 sm:ring-2 ring-white/20 hover:ring-purple-300 opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover"
                />
                {/* Overlay */}
                <div className={`absolute inset-0 transition-opacity ${
                  currentIndex === index 
                    ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30' 
                    : 'bg-slate-900/40 hover:bg-slate-900/20'
                }`}></div>
                
                {/* Index Badge */}
                <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <span className="text-[10px] sm:text-xs font-bold text-white">{index + 1}</span>
                </div>
                
                {/* Active Indicator */}
                {currentIndex === index && (
                  <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Dots Indicator */}
        <div className="flex justify-center items-center gap-1.5 sm:gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentIndex === index
                  ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 shadow-lg shadow-purple-500/50'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/30 hover:bg-purple-400/50 hover:scale-125'
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
