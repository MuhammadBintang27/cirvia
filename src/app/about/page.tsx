'use client';
import { Ico } from "@/components/ui/Ico";

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
    <div className="min-h-screen bg-transparent relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-soft rounded-full hidden animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-100 rounded-full hidden animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-soft rounded-full hidden animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-soft rounded-full animate-float"
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
              <span className="text-ink">
                Who is
              </span>
              <br />
              <span className="text-ink">
                Developer?
              </span>
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Tim berdedikasi di balik CIRVIA yang menghadirkan inovasi pembelajaran fisika
            </p>
          </div>

          {/* Team Members with Real Photos */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-brand-soft rounded-3xl hidden"></div>
            
            <div className="relative bg-paper rounded-3xl shadow-hard p-10 border-2 border-ink">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Muhammad Bintang Indra Hidayat */}
                <div className="group relative h-full">
                  <div className="absolute -inset-1 bg-brand-soft rounded-2xl hidden opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-paper rounded-2xl p-6 border border-ink/20 transform transition-all h-full flex flex-col">
                    <div className="text-center flex flex-col h-full">
                      <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden border-4 border-ink group-hover:border-ink transition-all">
                        <Image
                          src="/assets/team/bintang.png"
                          alt="Muhammad Bintang Indra Hidayat"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-2xl text-ink mb-2">
                        Muhammad Bintang Indra Hidayat
                      </h4>
                      <p className="text-amber-700 text-sm font-semibold mb-3">
                        Full Stack Developer
                      </p>
                      <p className="text-muted text-sm italic mt-auto">
                        &ldquo;I commit, I push, I build. Just like I do in life.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ahmad Syah Ramadhan */}
                <div className="group relative h-full">
                  <div className="absolute -inset-1 bg-purple-100 rounded-2xl hidden opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-paper rounded-2xl p-6 border border-ink/20 transform transition-all h-full flex flex-col">
                    <div className="text-center flex flex-col h-full">
                      <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden border-4 border-ink group-hover:border-ink transition-all">
                        <Image
                          src="/assets/team/ahmad.png"
                          alt="Ahmad Syah Ramadhan"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-2xl text-ink mb-2">
                        Ahmad Syah Ramadhan
                      </h4>
                      <p className="text-amber-700 text-sm font-semibold mb-3">
                        Virtual Lab & CV Developer
                      </p>
                      <p className="text-muted text-sm italic mt-auto">
                        &ldquo;Many think the mistake is taking a wrong step, but the real problem is whether they dare to take the next one&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alhusna Hanifah */}
                <div className="group relative h-full">
                  <div className="absolute -inset-1 bg-mint-soft rounded-2xl hidden opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-paper rounded-2xl p-6 border border-ink/20 transform transition-all h-full flex flex-col">
                    <div className="text-center flex flex-col h-full">
                      <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden border-4 border-ink group-hover:border-ink transition-all">
                        <Image
                          src="/assets/team/husna.png"
                          alt="Alhusna Hanifah"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-2xl text-ink mb-2">
                        Alhusna Hanifah
                      </h4>
                      <p className="text-amber-700 text-sm font-semibold mb-3">
                        Content & Learning Material Designer
                      </p>
                      <p className="text-muted text-sm italic mt-auto">
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
              <div className="absolute -inset-1 bg-brand-soft rounded-2xl hidden opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative bg-paper rounded-2xl shadow-hard p-8 border-2 border-ink h-full transform transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-soft rounded-full hidden"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-brand-soft rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform">
                    <span className="text-4xl"><Ico n="target" /></span>
                  </div>
                  <h3 className="text-3xl font-bold text-ink mb-4">
                    Misi Kami
                  </h3>
                  <p className="text-muted leading-relaxed text-lg">
                    Menyediakan platform pembelajaran fisika yang inovatif dan interaktif untuk membantu siswa memahami konsep rangkaian listrik melalui 
                    <span className="text-brand font-semibold"> simulasi virtual</span> dan 
                    <span className="text-brand font-semibold"> teknologi computer vision</span> yang memungkinkan kontrol dengan gerakan tangan.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-mint-soft rounded-2xl hidden opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative bg-paper rounded-2xl shadow-hard p-8 border-2 border-ink h-full transform transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-mint-soft rounded-full hidden"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-mint-soft rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform">
                    <span className="text-4xl"><Ico n="sparkles" /></span>
                  </div>
                  <h3 className="text-3xl font-bold text-ink mb-4">
                    Visi Kami
                  </h3>
                  <p className="text-emerald-700 leading-relaxed text-lg">
                    Menjadi platform pembelajaran fisika virtual terdepan yang menggabungkan teknologi modern dengan metodologi pendidikan yang efektif, menciptakan generasi yang memahami konsep rangkaian listrik dengan lebih baik melalui 
                    <span className="text-emerald-700 font-semibold"> CIRVIA</span>.
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
    { src: '/assets/galeri/foto bersama.jpg', title: 'Foto Bersama Siswa', description: 'Uji Coba Penerapan bersama Siswa SMA Negeri 5 Banda Aceh' },
    { src: '/assets/galeri/validasi materi.jpg', title: 'Validasi Materi', description: 'Uji Validasi Materi bersama Ibu Dr. Susilawati, S.Pd., M.Ed' },
    { src: '/assets/galeri/validasi media.jpg', title: 'Validasi Media', description: 'Uji Validasi Media bersama Ibu Andriani Putri, M.Sc' },
    { src: '/assets/galeri/validasi praktisi.jpg', title: 'Validasi Praktisi Lapangan', description: 'Uji Validasi Praktisi Lapangan bersama Cut Mardiana, S.Pd' },
    { src: '/assets/galeri/menulis LKPD.png', title: 'Proses Pembelajaran Siswa', description: 'Dokumentasi aktivitas siswa saat mengerjakan LKPD' },
    { src: '/assets/galeri/Praktikum virtual computer vision.png', title: 'Praktikum Virtual', description: 'Siswa melakukan praktikum rangkaian listrik dengan teknologi Computer Vision' },
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
      <div className="absolute inset-0 bg-purple-100 rounded-3xl hidden"></div>
      
      <div className="relative bg-paper rounded-3xl shadow-hard p-10 border-2 border-ink">
        {/* Header */}
        <div className="text-center mb-8">
          
          <h3 className="text-4xl font-black text-ink mb-3">
            Lens Of Us
          </h3>
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
            Momen berharga dalam perjalanan pengembangan CIRVIA bersama tim
          </p>
          <div className="flex justify-center items-center gap-3 mt-3">
            <div className="h-1 w-16 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="h-1 w-16 rounded-full"></div>
          </div>
        </div>

        {/* Main Slider */}
        <div className="relative group mb-6 px-2 sm:px-4 md:px-8 lg:px-16">
          {/* Enhanced Glow Effect */}
          <div className="absolute -inset-2 bg-purple-100 rounded-3xl hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Image Container */}
          <div className="relative bg-paper rounded-2xl md:rounded-3xl overflow-hidden border-2 border-ink shadow-hard">
            <div className="relative h-[280px] sm:h-[320px] md:h-[350px] lg:h-[420px]">
              {/* Current Image with Animation */}
              <div className="relative w-full h-full">
                <Image
                  src={galleryImages[currentIndex].src}
                  alt={galleryImages[currentIndex].title}
                  fill
                  className="object-cover transition-transform duration-700"
                  priority
                />
              </div>

              {/* Enhanced Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 bg-paper">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="h-0.5 sm:h-1 w-6 sm:w-10 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-700 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                        {currentIndex + 1} / {galleryImages.length}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-ink mb-1 sm:mb-2 leading-tight">
                      {galleryImages[currentIndex].title}
                    </h4>
                    <p className="text-xs sm:text-sm md:text-base text-muted leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
                      {galleryImages[currentIndex].description}
                    </p>
                  </div>
                  
                  {/* Image Counter Badge */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-purple-100 border-2 border-ink">
                    <span className="text-lg lg:text-xl font-bold text-ink">
                      {currentIndex + 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-100 hover:bg-purple-100 border-2 border-ink hover:border-ink rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 group/btn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-ink group-hover/btn:text-muted transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-100 hover:bg-purple-100 border-2 border-ink hover:border-ink rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 group/btn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-ink group-hover/btn:text-muted transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-paper">
                <div 
                  className="h-full bg-purple-500 transition-all duration-500"
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
                    ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ring-2 sm:ring-3 md:ring-4 ring-brand scale-105'
                    : 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ring-1 sm:ring-2 ring-brand hover:ring-brand opacity-70 hover:opacity-100'
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
                    ? 'bg-transparent' 
                    : 'bg-ink/30 hover:bg-ink/10'
                }`}></div>
                
                {/* Index Badge */}
                <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-paper rounded-full flex items-center justify-center border-2 border-ink">
                  <span className="text-[10px] sm:text-xs font-bold text-ink">{index + 1}</span>
                </div>
                
                {/* Active Indicator */}
                {currentIndex === index && (
                  <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
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
                  ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-purple-500'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-paper hover:bg-purple-100'
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
