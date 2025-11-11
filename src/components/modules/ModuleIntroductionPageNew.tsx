"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle, Trophy, Star, Zap, Lightbulb, Info, Clock, Play, Pause } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Audio timestamps untuk auto-scroll (dalam detik)
const AUDIO_TIMESTAMPS = {
  section1Start: 80,
  section2Start: 145,    // Mulai Section 2 di detik 145
  section3Start: 300,    // Mulai Section 3 di detik 300
  section4Start: 540,    // Mulai Section 4 di detik 540
  completion: 969        // Selesai di detik 969
};

interface ModuleIntroductionPageProps {
  isCompleted?: boolean;
  onMarkComplete?: () => void;
}

// Audio Player Component dengan Auto-Scroll
interface AudioPlayerProps {
  onTimestampReached?: (timestamp: keyof typeof AUDIO_TIMESTAMPS) => void;
}

const AudioPlayer = ({ onTimestampReached }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [lastTriggeredTimestamp, setLastTriggeredTimestamp] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Jika belum pernah diputar, mulai dari detik 80
        if (audioRef.current.currentTime === 0) {
          audioRef.current.currentTime = 80;
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Initialize audio ke detik 80 saat component mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 80;
    }
  }, []);

  // Handle progress bar click to seek (range 45-969)
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const START_TIME = 45;
    const END_TIME = 969;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = START_TIME + (percent * (END_TIME - START_TIME));
    audioRef.current.currentTime = seekTime;
  };

  // Handle time update dan auto-scroll
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // Stop audio otomatis di detik 969
      if (audio.currentTime >= 969) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = 969;
      }

      // Check timestamps dan trigger scroll
      Object.entries(AUDIO_TIMESTAMPS).forEach(([key, timestamp]) => {
        if (
          Math.abs(audio.currentTime - timestamp) < 0.5 &&
          lastTriggeredTimestamp !== key
        ) {
          setLastTriggeredTimestamp(key);
          if (onTimestampReached) {
            onTimestampReached(key as keyof typeof AUDIO_TIMESTAMPS);
          }
        }
      });
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [lastTriggeredTimestamp, onTimestampReached, isPlaying]);

  // Progress bar dimulai dari detik ke 45, berakhir di detik ke 969
  const START_TIME = 45;
  const END_TIME = 969;
  const ACTIVE_DURATION = END_TIME - START_TIME; // 924 detik
  const adjustedCurrentTime = Math.max(0, currentTime - START_TIME);
  const progressPercent = adjustedCurrentTime > 0 ? (adjustedCurrentTime / ACTIVE_DURATION) * 100 : 0;

  return (
    <>
      {/* Audio Element - Hidden - Using Supabase Storage */}
      <audio
        ref={audioRef}
        src="https://hczgbjgcolqxejtmaffn.supabase.co/storage/v1/object/public/audio-materials/modul-pengantar.mp3"
        preload="auto"
      />

      {/* Audio Toggle Button with Hover Popup - Fixed Position */}
      <div
        ref={buttonRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="fixed top-80 right-8 z-50 pointer-events-auto group"
      >
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
        
        {/* Animated Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-purple-300/30 animate-spin" style={{ animationDuration: '3s' }}></div>

        {/* Main Button */}
        <button
          onClick={handlePlayPause}
          className="relative p-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 shadow-2xl shadow-purple-500/50 transform hover:scale-125 transition-all duration-300 z-10 group-hover:shadow-purple-500/80 border border-purple-300/50"
          title={isPlaying ? "Matikan Audio" : "Nyalakan Audio"}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-white animate-pulse drop-shadow-lg" />
          ) : (
            <Play className="w-7 h-7 text-white drop-shadow-lg" />
          )}
        </button>
        
        {/* Floating Label */}
        {!isHovering && (
          <div className="absolute -top-10 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            🎧 Audio
          </div>
        )}

        {/* Hover Popup - Audio Control Panel */}
        {isHovering && (
          <div 
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="absolute bottom-full right-0 mb-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl p-4 shadow-2xl w-64 opacity-0 animate-fade-in backdrop-blur-sm z-50 pointer-events-auto"
          >
            {/* Title */}
            <div className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-widest">
              🎧 Audio Pembelajaran
            </div>

            {/* Time Display */}
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-cyan-300 font-semibold">{formatTime(currentTime)}</span>
              <span className="text-purple-300/60">/</span>
              <span className="text-purple-300/80">{formatTime(duration)}</span>
            </div>

            {/* Progress Bar - Clickable */}
            <div
              onClick={handleSeek}
              className="relative w-full bg-slate-700/50 rounded-full h-1.5 cursor-pointer group mb-4 hover:h-2 transition-all"
            >
              <div
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1.5 rounded-full transition-all group-hover:h-2"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Seek Indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progressPercent}%`, transform: "translateX(-50%)" }}
              />
            </div>

            {/* Quick Timestamps */}
            <div className="text-xs text-purple-200/70 mb-2 font-semibold">Quick Jump:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 80;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-300 transition-all"
              >
                S1 (0:80)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 145;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg text-cyan-300 transition-all"
              >
                S2 (2:25)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 300;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-300 transition-all"
              >
                S3 (5:00)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 540;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-yellow-500/20 hover:bg-yellow-500/40 rounded-lg text-yellow-300 transition-all"
              >
                S4 (9:00)
              </button>
            </div>

            {/* Pointer Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-gradient-to-br from-slate-900 to-slate-800 border-r border-b border-purple-500/30 transform rotate-45"></div>
          </div>
        )}
      </div>
    </>
  );
};

// Custom hook untuk scroll animation
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, isVisible };
};

// Section 1: Dark Room Component
const Section1DarkRoom = () => {
  const [isLightOn, setIsLightOn] = useState(false);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all duration-1000 border-2 ${
        isLightOn
          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300/50 shadow-2xl shadow-yellow-500/20"
          : "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 shadow-xl"
      }`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <div className="w-full h-full flex items-center justify-center relative">
            {/* Background wall */}
            <div className={`absolute inset-0 transition-all duration-1000 ${
              isLightOn 
                ? "bg-gradient-to-b from-slate-400 to-slate-600" 
                : "bg-gradient-to-b from-slate-800 to-slate-950"
            }`}></div>

            {/* Child sitting at desk - ENLARGED */}
            <div className="absolute bottom-30 right-1/2 transform -translate-x-1/2 flex flex-col items-center">
              {/* Head */}
              <div className={`w-16 h-16 rounded-full shadow-lg border-2 transition-all duration-1000 relative ${
                isLightOn
                  ? "bg-gradient-to-b from-yellow-200 to-yellow-300 border-yellow-100"
                  : "bg-gradient-to-b from-slate-600 to-slate-700 border-slate-500"
              }`}>
                {/* Hair */}
                <div className={`absolute -top-3 left-0 right-0 w-full h-5 rounded-t-full transition-all duration-1000 ${
                  isLightOn
                    ? "bg-gradient-to-b from-amber-700 to-amber-600"
                    : "bg-gradient-to-b from-slate-700 to-slate-800"
                }`}></div>
                {/* Eyes */}
                <div className={`absolute top-5 left-4 w-2 h-2 rounded-full transition-all duration-1000 ${
                  isLightOn ? "bg-black" : "bg-slate-500"
                }`}></div>
                <div className={`absolute top-5 right-4 w-2 h-2 rounded-full transition-all duration-1000 ${
                  isLightOn ? "bg-black" : "bg-slate-500"
                }`}></div>
                {/* Smile */}
                {isLightOn && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-800 rounded-full"></div>
                )}
              </div>
              
              {/* Body */}
              <div className={`w-12 h-14 rounded-sm shadow-md relative transition-all duration-1000 ${
                isLightOn
                  ? "bg-gradient-to-b from-blue-400 to-blue-500"
                  : "bg-gradient-to-b from-slate-700 to-slate-800"
              }`}>
                {/* Arms */}
                <div className={`absolute left-0 top-3 w-2 h-8 transform -rotate-12 origin-top-right rounded-full shadow-sm transition-all duration-1000 ${
                  isLightOn ? "bg-yellow-200" : "bg-slate-600"
                }`}></div>
                <div className={`absolute right-0 top-3 w-2 h-8 transform rotate-12 origin-top-left rounded-full shadow-sm transition-all duration-1000 ${
                  isLightOn ? "bg-yellow-200" : "bg-slate-600"
                }`}></div>
              </div>
            </div>

            {/* Desk */}
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/3 rounded-t-3xl shadow-2xl transition-all duration-1000 ${
              isLightOn
                ? "bg-gradient-to-t from-amber-700/90 to-amber-600/70"
                : "bg-gradient-to-t from-slate-700/80 to-slate-800/70"
            }`}></div>

            {/* Lamp on desk */}
            <div className="absolute bottom-8 right-1/4 transform translate-x-1/2">
              {/* Lamp base/stand on desk - positioned at bottom */}
              <div className={`w-12 h-2 rounded-full shadow-lg transition-all duration-1000 mx-auto relative z-10 ${
                isLightOn
                  ? "bg-gradient-to-b from-gray-700 to-gray-900"
                  : "bg-gradient-to-b from-slate-700 to-slate-900"
              }`}></div>

              {/* Lamp arm - melengkung dari base ke atas dan miring ke arah anak */}
              <div className="relative w-24 h-40">
                <svg 
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-full h-full" 
                  viewBox="0 0 100 160" 
                  preserveAspectRatio="none"
                  style={{ overflow: 'visible' }}
                >
                  <path
                    d="M 50 150 Q 40 100, 30 60 Q 20 40, 15 10"
                    stroke={isLightOn ? "#4B5563" : "#3F4652"}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>

              {/* Lamp head - besar dan bulat menghadap ke anak */}
              <div className="relative w-full h-32 flex justify-start items-start" style={{ marginTop: '-140px', marginLeft: '-20px' }}>
                <div
                  className={`w-20 h-14 rounded-full transition-all duration-1000 relative shadow-xl flex-shrink-0 ${
                    isLightOn
                      ? "bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-2xl shadow-yellow-400/70"
                      : "bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg"
                  }`}
                  style={{ 
                    filter: isLightOn ? 'drop-shadow(0 0 20px rgba(255, 200, 0, 0.5))' : 'none',
                    transform: 'rotate(-30deg)'
                  }}
                >
                  {/* Inner light source */}
                  {isLightOn && (
                    <>
                      <div className="absolute inset-3 rounded-full bg-yellow-50 opacity-80"></div>
                      <div className="absolute inset-0 rounded-full bg-yellow-100 opacity-20 blur-lg"></div>
                    </>
                  )}
                </div>

                {/* Light rays - menyinar ke arah anak */}
                {isLightOn && (
                  <>
                    <div className="absolute -left-20 top-2 w-48 h-32 bg-yellow-300 opacity-15 blur-2xl rounded-full pointer-events-none" style={{ transform: 'rotate(-30deg)' }}></div>
                    <div className="absolute -left-24 top-6 w-56 h-40 bg-yellow-200 opacity-10 blur-3xl rounded-full pointer-events-none" style={{ transform: 'rotate(-30deg)' }}></div>
                  </>
                )}
              </div>
            </div>

            {/* Books on desk */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className={`w-7 h-9 rounded-sm shadow-md transform -rotate-6 transition-all duration-1000 ${
                isLightOn
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : "bg-gradient-to-r from-slate-600 to-slate-700"
              }`}></div>
              <div className={`w-7 h-9 rounded-sm shadow-md transform rotate-3 transition-all duration-1000 ${
                isLightOn
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : "bg-gradient-to-r from-slate-600 to-slate-700"
              }`}></div>
              <div className={`w-7 h-9 rounded-sm shadow-md transform -rotate-2 transition-all duration-1000 ${
                isLightOn
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-slate-600 to-slate-700"
              }`}></div>
            </div>

            {/* Switch Button */}
            <button
              onClick={() => setIsLightOn(!isLightOn)}
              className={`absolute top-8 right-8 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-110 active:scale-95 shadow-2xl ${
                isLightOn
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:shadow-yellow-400/50"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 text-yellow-300 border border-yellow-400/30"
              }`}
            >
              {isLightOn ? "❌ Matikan" : "✓ Nyalakan"}
            </button>

            {/* Status */}
            <div className="absolute top-8 left-8">
              <p className={`text-xl font-bold transition-all duration-1000 ${isLightOn ? "text-yellow-400" : "text-gray-500"}`}>
                {isLightOn ? "💡Lampu Menyala" : "🌙 Kamar yang Gelap"}
              </p>
            </div>
      </div>
    </div>
  );
};

// Section 2: Electron Animation
const Section2ElectronAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationTime, setAnimationTime] = useState(0);

  // Smooth animation loop
  useEffect(() => {
    if (!isAnimating) return;
    
    let frameId: NodeJS.Timeout;
    const animate = () => {
      setAnimationTime(prev => (prev + 1) % 1600);
      frameId = setTimeout(animate, 16); // ~60fps
    };
    
    frameId = setTimeout(animate, 16);
    
    return () => clearTimeout(frameId);
  }, [isAnimating]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>

      {/* Right: Text Content (order will be first) */}
      <div className="space-y-6 lg:order-2">
        <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
          Arus Listrik Searah (DC)
        </h2>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Sebelum memahami lebih jauh tentang rangkaian, kita perlu tahu dulu apa itu arus listrik searah (DC).
          </p>
          <p className="text-lg text-slate-200 leading-relaxed">
            <span className="font-bold text-cyan-400">Arus listrik searah</span> adalah arus yang bergerak dalam satu arah tetap melalui penghantar.
          </p>
        </div>

        {/* Key points */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl p-4 border border-red-400/30">
            <div className="text-3xl mb-2 font-bold text-red-400">+</div>
            <h3 className="text-lg font-bold text-red-300 mb-2">Kutub Positif</h3>
            <p className="text-red-200 text-sm">Tempat Arus mulai bergerak keluar.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-4 border border-blue-400/30">
            <div className="text-3xl mb-2 font-bold text-blue-400">−</div>
            <h3 className="text-lg font-bold text-blue-300 mb-2">Kutub Negatif</h3>
            <p className="text-blue-200 text-sm">Tempat Arus akhirnya sampai.</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-400/30">
          <p className="text-center text-cyan-200 font-semibold leading-relaxed">
            <strong>⚡ Arus mengalir dari kutub positif ke kutub negatif.</strong>
            <br />
            <span className="text-cyan-300 text-sm mt-2 block">
              Aliran ini disebut <strong>arus listrik</strong>.
            </span>
          </p>
        </div>
      </div>

      {/* Left: Visual (order will be reversed) */}
      <div className="relative group lg:order-1">
        <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
        <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border-2 border-cyan-400/30 p-12 shadow-2xl overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          {/* Battery Visual (Kiri) - Berdempet */}
          <div className="absolute left-12 top-1/2 pt-10 transform -translate-y-1/2 flex flex-col items-center gap-0 z-20">
            {/* Battery Negatif (Atas) */}
            <div className="w-12 h-20 bg-gradient-to-b from-red-500 to-red-700 rounded-t-lg border-2 border-red-600 flex items-center justify-center shadow-lg shadow-red-500/50">
              <span className="text-white text-sm font-bold">+</span>
            </div>
            {/* Battery Positif (Bawah) - Berdempet */}
            <div className="w-12 h-20 bg-gradient-to-b from-blue-500 to-blue-700 rounded-b-lg border-2 border-t-0 border-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <span className="text-white text-sm font-bold">-</span>
            </div>
            <div className="text-xs font-bold text-blue-300 mt-2 text-center">Baterai</div>
          </div>

          {/* Wire path with flowing animation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500">
            <defs>
              {/* Wire gradient */}
              <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="50%" stopColor="rgba(100, 200, 255, 0.8)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Rectangular circuit path */}
            <g>
              {/* TOP WIRE - dari negatif (kiri atas) ke kanan atas */}
              <line x1="130" y1="130" x2="850" y2="130" stroke="rgba(100, 200, 255, 1)" strokeWidth="18" strokeLinecap="round" />
              <line x1="130" y1="130" x2="850" y2="130" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="32" strokeLinecap="round" filter="url(#glow)" opacity="0.8" />

              {/* RIGHT WIRE - dari atas (kanan atas) ke bawah (kanan bawah) - SOLID DAN TERANG */}
              <line x1="850" y1="130" x2="850" y2="400" stroke="rgba(100, 200, 255, 0.9)" strokeWidth="18" strokeLinecap="round" />
              <line x1="850" y1="130" x2="850" y2="400" stroke="rgba(100, 200, 255, 0.2)" strokeWidth="32" strokeLinecap="round" filter="url(#glow)" opacity="0.7" />

              {/* BOTTOM WIRE - dari kanan bawah ke kiri bawah (return) */}
              <line x1="850" y1="400" x2="130" y2="400" stroke="rgba(100, 150, 255, 0.6)" strokeWidth="18" strokeLinecap="round" strokeDasharray="10,5" />
              <line x1="850" y1="400" x2="130" y2="400" stroke="rgba(100, 150, 255, 0.15)" strokeWidth="32" strokeLinecap="round" filter="url(#glow)" opacity="0.5" strokeDasharray="10,5" />

              {/* LEFT WIRE - dari positif ke negatif (upward) */}
              <line x1="130" y1="400" x2="130" y2="130" stroke="rgba(100, 150, 255, 0.6)" strokeWidth="18" strokeLinecap="round" strokeDasharray="10,5" />
              <line x1="130" y1="400" x2="130" y2="130" stroke="rgba(100, 150, 255, 0.15)" strokeWidth="32" strokeLinecap="round" filter="url(#glow)" opacity="0.5" strokeDasharray="10,5" />

              {/* Corner connection dots */}
              <circle cx="130" cy="130" r="8" fill="rgba(100, 200, 255, 0.9)" filter="url(#glow)" />
              <circle cx="850" cy="130" r="8" fill="rgba(100, 200, 255, 0.9)" filter="url(#glow)" />
              <circle cx="850" cy="400" r="8" fill="rgba(100, 150, 255, 0.7)" />
              <circle cx="130" cy="400" r="8" fill="rgba(100, 150, 255, 0.7)" />
            </g>

            {/* Direction arrows on wires */}
            {isAnimating && (
              <g>
                {/* Top arrow - arah arus dari negatif ke positif */}
                <path d="M 200 75 L 215 85 L 200 95 Z" fill="rgba(255, 215, 0, 0.7)" filter="url(#glow)" />
                <path d="M 400 75 L 415 85 L 400 95 Z" fill="rgba(255, 215, 0, 0.7)" filter="url(#glow)" />
                <path d="M 600 75 L 615 85 L 600 95 Z" fill="rgba(255, 215, 0, 0.7)" filter="url(#glow)" />
                <path d="M 800 75 L 815 85 L 800 95 Z" fill="rgba(255, 215, 0, 0.7)" filter="url(#glow)" />

                {/* Right arrow - arah ke bawah */}
                <path d="M 875 150 L 895 165 L 865 165 Z" fill="rgba(255, 215, 0, 0.5)" filter="url(#glow)" />
                <path d="M 875 300 L 895 315 L 865 315 Z" fill="rgba(255, 215, 0, 0.5)" filter="url(#glow)" />

                {/* Bottom arrow - arah kembali dari kanan ke kiri (return) */}
                <path d="M 800 425 L 785 435 L 800 445 Z" fill="rgba(255, 150, 150, 0.4)" filter="url(#glow)" />
                <path d="M 400 425 L 385 435 L 400 445 Z" fill="rgba(255, 150, 150, 0.4)" filter="url(#glow)" />

                {/* Left arrow - arah ke atas ke negatif (return) */}
                <path d="M 125 350 L 105 335 L 135 335 Z" fill="rgba(255, 150, 150, 0.4)" filter="url(#glow)" />
              </g>
            )}

            {/* Animated electrons flowing around the circuit */}
            {isAnimating && [0, 1, 2, 3, 4, 5, 6].map((i) => {
              const offset = (animationTime + i * 280) % 1600;
              const progress = offset / 1600;
              
              let x, y;
              
              if (progress < 0.25) {
                // Top: dari negatif (kiri atas) ke lampu (kanan atas)
                const t = progress / 0.25;
                x = 130 + (720 * t);
                y = 130;
              } else if (progress < 0.5) {
                // Right: dari atas ke bawah
                const t = (progress - 0.25) / 0.25;
                x = 850;
                y = 130 + (270 * t);
              } else if (progress < 0.75) {
                // Bottom: kembali dari kanan ke kiri
                const t = (progress - 0.5) / 0.25;
                x = 850 - (720 * t);
                y = 400;
              } else {
                // Left: kembali ke atas ke negatif
                const t = (progress - 0.75) / 0.25;
                x = 130;
                y = 400 - (270 * t);
              }

              return (
                <g key={`electron-${i}`}>
                  {/* Outer glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill="rgba(255, 215, 0, 0.15)"
                    filter="url(#glow)"
                  />
                  {/* Middle glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r="11"
                    fill="rgba(255, 215, 0, 0.3)"
                  />
                  {/* Core electron */}
                  <circle
                    cx={x}
                    cy={y}
                    r="7"
                    fill="rgba(255, 230, 0, 1)"
                    filter="drop-shadow(0 0 10px rgba(255, 215, 0, 1))"
                  />
                </g>
              );
            })}

            {/* Main title label */}
            {isAnimating && (
              <text x="500" y="45" textAnchor="middle" fill="rgba(100, 200, 255, 0.8)" fontSize="26" fontWeight="bold">
                ⚡ ALIRAN ELEKTRON
              </text>
            )}
          </svg>


          {/* Flowing animation indicator */}
          {isAnimating && (
            <div className="absolute top-16 left-8 flex flex-col items-center gap-2">
              <div className="text-sm font-bold text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/40">
                ⚡ Mengalir
              </div>
              <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Controls */}
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg z-30 ${
              isAnimating
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
            }`}
          >
            {isAnimating ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Section 3: Circuit Components
const Section3CircuitComponents = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [circuitClosed, setCircuitClosed] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Smooth animation loop untuk elektron
  useEffect(() => {
    if (!circuitClosed) return;
    
    let frameId: NodeJS.Timeout;
    const animate = () => {
      setAnimationTime(prev => (prev + 1) % 2000);
      frameId = setTimeout(animate, 16); // ~60fps
    };
    
    frameId = setTimeout(animate, 16);
    
    return () => clearTimeout(frameId);
  }, [circuitClosed]);

  const components = [
    { id: "battery", name: "Sumber Daya (Baterai)", icon: "🔋", description: "Memberi energi listrik yang menggerakkan elektron melalui rangkaian.", color: "from-red-500 to-orange-500" },
    { id: "wire", name: "Konduktor (Kabel)", icon: "🔌", description: "Tempat arus listrik mengalir. Biasanya terbuat dari logam seperti tembaga.", color: "from-yellow-500 to-amber-500" },
    { id: "switch", name: "Sakelar (Switch)", icon: "🔘", description: "Alat untuk menghubungkan atau memutus arus. Ketika ON, rangkaian tertutup.", color: "from-blue-500 to-cyan-500" },
    { id: "load", name: "Beban (Lampu)", icon: "💡", description: "Tempat energi listrik diubah menjadi energi lain seperti cahaya.", color: "from-yellow-400 to-yellow-600" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Left: Text Content */}
      <div className="space-y-6">
        <h2 className="text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
          Komponen Rangkaian Listrik
        </h2>
        
        <p className="text-lg text-slate-200 leading-relaxed">
          <span className="font-bold text-green-400">Rangkaian listrik</span> adalah susunan dari beberapa komponen listrik yang saling terhubung sehingga arus listrik dapat mengalir.
        </p>

        {/* Components */}
        <div className="grid grid-cols-1 gap-4">
          {components.map((component) => (
            <button
              key={component.id}
              onClick={() => setSelectedComponent(selectedComponent === component.id ? null : component.id)}
              className={`p-5 rounded-xl text-left transition-all hover:scale-[1.02] ${
                selectedComponent === component.id
                  ? `bg-gradient-to-br ${component.color} shadow-2xl border-2 border-white/30`
                  : "bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-600/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{component.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    {component.name}
                    {selectedComponent === component.id && <Info className="w-5 h-5 animate-pulse" />}
                  </h3>
                  {selectedComponent === component.id && (
                    <p className="text-white/90 text-sm">{component.description}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Visual */}
      <div className="space-y-8">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
          
          <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border-2 border-green-400/30 p-8 shadow-2xl">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Battery */}
              <circle cx="100" cy="250" r="30" fill="none" stroke="rgba(255, 100, 100, 0.8)" strokeWidth="3" />
              <text x="100" y="260" textAnchor="middle" fill="rgba(255, 150, 150, 0.9)" fontSize="40">🔋</text>

              {/* Wires with dynamic positioning */}
              {/* Wire 1: Battery to Switch - moves when circuit closes */}
              <line 
                x1="130" 
                y1="250" 
                x2={circuitClosed ? 320 : 300} 
                y2="150" 
                stroke={circuitClosed ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.4)"} 
                strokeWidth="4"
                style={{ transition: 'x2 0.5s ease-in-out' }}
              />
              <line x1="375" y1="150" x2="570" y2="150" stroke={circuitClosed ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.4)"} strokeWidth="4" />
              <line x1="600" y1="180" x2="600" y2="350" stroke={circuitClosed ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.4)"} strokeWidth="4" />
              <line x1="100" y1="350" x2="600" y2="350" stroke={circuitClosed ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.4)"} strokeWidth="4" />
              <line x1="100" y1="280" x2="100" y2="350" stroke={circuitClosed ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.4)"} strokeWidth="4" />

              {/* Switch */}
              <circle cx="350" cy="150" r="25" fill="none" stroke={circuitClosed ? "rgba(100, 255, 100, 0.8)" : "rgba(255, 100, 100, 0.8)"} strokeWidth="3" />
              <text x="350" y="165" textAnchor="middle" fill={circuitClosed ? "rgba(150, 255, 150, 0.9)" : "rgba(255, 150, 150, 0.9)"} fontSize="40">🔘</text>

              {/* Lamp */}
              <circle cx="600" cy="150" r="30" fill="none" stroke={circuitClosed ? "rgba(255, 215, 0, 0.8)" : "rgba(100, 100, 100, 0.4)"} strokeWidth="3" />
              <text x="600" y="160" textAnchor="middle" fill={circuitClosed ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="40">💡</text>
              
              {circuitClosed && (
                <circle cx="600" cy="150" r="35" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2" opacity="0.5">
                  <animate attributeName="r" from="35" to="50" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Electrons flowing when circuit is closed */}
              {circuitClosed && [0, 1, 2, 3].map((i) => {
                const offset = (animationTime + i * 500) % 2000;
                let x, y;
                
                // Path: Battery → Switch → Lamp → Bottom → Back to Battery
                if (offset < 250) {
                  // Segment 1: Battery (130,250) → Switch (350,150)
                  const t = offset / 250;
                  x = 130 + t * 190;
                  y = 250 - t * 100;
                } else if (offset < 500) {
                  // Segment 2: Switch (350,150) → Lamp (600,150)
                  const t = (offset - 250) / 250;
                  x = 350 + t * 250;
                  y = 150;
                } else if (offset < 750) {
                  // Segment 3: Lamp (600,150) → Bottom right (600,350)
                  const t = (offset - 500) / 250;
                  x = 600;
                  y = 150 + t * 200;
                } else {
                  // Segment 4: Bottom (600,350) → Battery (100,350) → Up (100,250)
                  const t = (offset - 750) / 1250;
                  if (t < 0.4) {
                    // Horizontal return
                    x = 600 - (t / 0.4) * 500;
                    y = 350;
                  } else {
                    // Vertical return
                    x = 100;
                    y = 350 - ((t - 0.4) / 0.6) * 100;
                  }
                }
                
                return (
                  <g key={`electron-s3-${i}`}>
                    {/* Electron glow */}
                    <circle cx={x} cy={y} r="8" fill="rgba(255, 215, 0, 0.2)" filter="drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))" />
                    {/* Electron core */}
                    <circle cx={x} cy={y} r="4" fill="rgba(255, 230, 0, 0.95)" filter="drop-shadow(0 0 3px rgba(255, 215, 0, 0.9))" />
                  </g>
                );
              })}
            </svg>

            <button
              onClick={() => setCircuitClosed(!circuitClosed)}
              className="absolute bottom-6 right-6 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-white/20"
            >
              {circuitClosed ? "❌ Buka" : "✓ Tutup"} Rangkaian
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30">
          <h3 className="text-xl font-bold text-green-300 mb-3">🎮 Coba Sekarang!</h3>
          <ul className="space-y-2 text-green-200 text-sm">
            <li>✅ <strong>Klik komponen</strong> di sebelah kiri untuk detail</li>
            <li>⚡ <strong>Klik tombol</strong> untuk menghubungkan rangkaian</li>
            <li>💡 <strong>Lihat lampu menyala</strong> ketika tertutup</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Section 4: Ohm's Law
const Section4OhmsLaw = () => {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(40);
  const current = voltage / resistance;
  const particleCount = Math.max(3, Math.min(15, Math.ceil(current * 2)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>

      {/* Right: Text Content (will be on left) */}
      <div className="space-y-6 lg:order-2">
        <h2 className="text-5xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Hukum Ohm
        </h2>

        <p className="text-lg text-slate-200 leading-relaxed">
          <span className="font-bold text-orange-400">💡 Hukum Ohm</span> menyatakan bahwa tegangan, arus, dan hambatan saling berhubungan melalui rumus sederhana.
        </p>

        {/* Formula */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border-2 border-orange-400/30">
          <div className="text-center">
            <div className="text-5xl font-black text-orange-300 mb-2">V = I × R</div>
            <p className="text-orange-200 text-base">Tegangan = Arus × Hambatan</p>
          </div>
        </div>

        {/* Key Messages */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl p-6 border-2 border-green-400/30">
            <h4 className="text-xl font-bold text-green-300 mb-3">📈 Naik Tegangan?</h4>
            <p className="text-green-200 text-sm">
              Jika tegangan (V) naik dan hambatan (R) tetap, maka arus (I) akan <strong>bertambah</strong>.
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-600/10 rounded-2xl p-6 border-2 border-red-400/30">
            <h4 className="text-xl font-bold text-red-300 mb-3">📉 Naik Hambatan?</h4>
            <p className="text-red-200 text-sm">
              Jika hambatan (R) naik, maka arus (I) akan <strong>berkurang</strong>.
            </p>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border-2 border-purple-400/30">
          <h3 className="text-2xl font-bold text-purple-300 mb-3">✨ Kesimpulan</h3>
          <p className="text-purple-200 text-base leading-relaxed mb-3">
            <strong>Hukum Ohm membantu kita memahami</strong> kenapa lampu bisa terang atau redup, dan bagaimana arus listrik dikendalikan.
          </p>
          <p className="text-purple-300 font-semibold text-sm">
            🎯 Semakin paham Hukum Ohm, semakin mudah memahami rangkaian listrik!
          </p>
        </div>
      </div>
      {/* Left: Visual (will be on right) */}
      <div className="space-y-8 lg:order-1">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
          
          <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-10 border-2 border-orange-400/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-orange-300 mb-8">⚡ Coba Ubah Nilai!</h3>

            {/* Voltage Slider */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-orange-200">Tegangan (V)</label>
                <div className="text-3xl font-bold text-orange-400">{voltage}V</div>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-3 bg-orange-900/30 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Resistance Slider */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-red-200">Hambatan (R)</label>
                <div className="text-3xl font-bold text-red-400">{resistance}Ω</div>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full h-3 bg-red-900/30 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Formula */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border-2 border-yellow-400/30 mb-6">
              <div className="text-center">
                <p className="text-yellow-200 text-sm mb-3 font-semibold">Formula:</p>
                <div className="text-4xl font-black text-yellow-300 mb-3">
                  {voltage} = {current.toFixed(2)} × {resistance}
                </div>
                <p className="text-yellow-300 text-lg font-bold">I (Arus) = {current.toFixed(2)} A</p>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-6 border-2 border-orange-400/30 text-center">
                <div className="text-2xl font-bold text-orange-300 mb-2">{voltage}</div>
                <div className="text-sm text-orange-200 font-semibold">Tegangan (V)</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 rounded-xl p-6 border-2 border-cyan-400/30 text-center">
                <div className="text-2xl font-bold text-cyan-300 mb-2">{current.toFixed(2)}</div>
                <div className="text-sm text-cyan-200 font-semibold">Arus (A)</div>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-6 border-2 border-red-400/30 text-center">
                <div className="text-2xl font-bold text-red-300 mb-2">{resistance}</div>
                <div className="text-sm text-red-200 font-semibold">Hambatan (Ω)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ModuleIntroductionPage = ({ isCompleted = false, onMarkComplete }: ModuleIntroductionPageProps) => {
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Refs untuk sections
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const completionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle auto-scroll berdasarkan audio timestamp
  const handleTimestampReached = (timestamp: keyof typeof AUDIO_TIMESTAMPS) => {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: "smooth",
      block: "start",
    };

    switch (timestamp) {
      case "section1Start":
        section1Ref.current?.scrollIntoView(scrollOptions);
        break;
      case "section2Start":
        section2Ref.current?.scrollIntoView(scrollOptions);
        break;
      case "section3Start":
        section3Ref.current?.scrollIntoView(scrollOptions);
        break;
      case "section4Start":
        section4Ref.current?.scrollIntoView(scrollOptions);
        break;
      case "completion":
        completionRef.current?.scrollIntoView(scrollOptions);
        break;
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Audio Player */}
      {isClient && <AudioPlayer onTimestampReached={handleTimestampReached} />}

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Hero Section + Section 1 Combined */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white py-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          
          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
              
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex items-start justify-between gap-8 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm font-bold">Modul Pengantar</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
                    Apa itu Rangkaian Listrik?
                  </h1>
                  <p className="text-lg text-blue-200">Pelajari dasar-dasar rangkaian listrik dan komponen-komponennya</p>
                </div>

                <div className="flex flex-col items-center px-6 py-4 rounded-2xl shadow-lg border border-white/20 backdrop-blur-xl bg-white/10">
                  <Clock className="w-8 h-8 mb-2 text-blue-300" />
                  <span className="font-bold text-sm text-blue-100">4 Sections</span>
                </div>
              </div>
            </div>
          </div>

      {/* Section 1 */}
      <div className="relative py-16" ref={section1Ref}>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main Grid: Text + Interactive Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {/* Left: Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
                Lampu Meja Belajarmu
              </h2>
              
              <div className="space-y-4">
                <p className="text-lg text-slate-200 leading-relaxed">
                  Bayangkan kamu berada di kamar yang gelap. Kamu ingin menyalakan lampu kecil di meja belajarmu.
                </p>
                <p className="text-lg text-slate-200 leading-relaxed">
                  Kamu memasang baterai, menyambungkan kabel, dan… <span className="font-bold text-yellow-400">klik! 💡</span> lampu menyala!
                </p>
                <p className="text-lg text-slate-200 leading-relaxed">
                  Nah, itulah salah satu contoh <span className="font-bold text-yellow-400">rangkaian listrik sederhana</span>.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>

              <p className="text-xl text-orange-400 font-semibold">
                ⚡ Tapi… kenapa lampunya bisa menyala? Apa yang sebenarnya terjadi di balik kabel itu?
              </p>

              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-400/30 backdrop-blur-sm">
                <p className="text-yellow-200 text-center font-semibold">
                  👉 Klik tombol di sebelah kanan untuk melihat apa yang terjadi ketika rangkaian tertutup dan terbuka!
                </p>
              </div>
            </div>

            {/* Right: Interactive Visual - Section 1 Component */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
              
              <Section1DarkRoom />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex justify-center py-12">
        <div className="flex items-center gap-6">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent w-32"></div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-full shadow-xl border border-white/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent w-32"></div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="py-20 relative bg-gradient-to-b from-transparent via-slate-800/30 to-transparent" ref={section2Ref}>
        <div className="max-w-7xl mx-auto px-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Section2ElectronAnimation />
        </div>
      </div>

      {/* Divider */}
      <div className="flex justify-center py-12">
        <div className="flex items-center gap-6">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-32"></div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-full shadow-xl border border-white/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-32"></div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="py-20 relative" ref={section3Ref}>
        <div className="max-w-7xl mx-auto px-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Section3CircuitComponents />
        </div>
      </div>

      {/* Divider */}
      <div className="flex justify-center py-12">
        <div className="flex items-center gap-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent w-32"></div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-full shadow-xl border border-white/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent w-32"></div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="py-20 relative bg-gradient-to-b from-transparent via-slate-800/30 to-transparent" ref={section4Ref}>
        <div className="max-w-7xl mx-auto px-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Section4OhmsLaw />
        </div>
      </div>

      {/* Completion Section - Extended dengan Footer */}
      <div className="relative text-white py-32 px-6 overflow-hidden mt-20 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }} ref={completionRef}>
        {/* Background yang sama dengan section */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"></div>
        
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Completion Card */}
          <div className="group relative mb-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 via-orange-500/20 to-blue-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-slate-900/80 to-blue-950/80 backdrop-blur-xl rounded-3xl border-2 border-yellow-400/30 p-12 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Main Message */}
                <div className="md:col-span-2 flex flex-col justify-center">
                  <h2 className="text-5xl md:text-5xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
                    {isModuleCompleted ? "✨ Selesai!" : "🚀 Hampir Selesai!"}
                  </h2>
                  <p className="text-lg text-yellow-100/90 mb-8 leading-relaxed max-w-xl">
                    {isModuleCompleted
                      ? "Anda telah menguasai fondasi rangkaian listrik dengan sempurna. Siap melanjutkan ke materi lebih dalam?"
                      : "Anda telah menyelesaikan semua 4 section fundamental. Tandai modul ini sebagai selesai untuk melanjutkan!"}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-black text-yellow-400">4</div>
                      <p className="text-xs text-yellow-300 font-semibold mt-1">Sections</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-orange-400">100%</div>
                      <p className="text-xs text-orange-300 font-semibold mt-1">Selesai</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-yellow-300">✓</div>
                      <p className="text-xs text-yellow-200 font-semibold mt-1">Terpahami</p>
                    </div>
                  </div>
                </div>

                {/* Right: Visual Status */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl border-2 transition-all duration-1000 ${
                    isModuleCompleted
                      ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50 shadow-yellow-400/30"
                      : "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-yellow-400/50 shadow-yellow-400/30"
                  }`}>
                    {isModuleCompleted ? (
                      <Trophy className="w-16 h-16 text-yellow-300 fill-yellow-300" />
                    ) : (
                      <CheckCircle className="w-16 h-16 text-yellow-300" />
                    )}
                  </div>
                  <p className="text-sm font-bold tracking-widest text-yellow-300">
                    {isModuleCompleted ? "ACHIEVEMENT" : "DALAM PROGRESS"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-end">
                {!isModuleCompleted && (
                  <button
                    onClick={() => {
                      setIsModuleCompleted(true);
                      if (onMarkComplete) onMarkComplete();
                    }}
                    className="group flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-2xl border border-yellow-300/30"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>Tandai Selesai</span>
                  </button>
                )}

                <button
                  onClick={() => window.history.back()}
                  className="group flex items-center justify-center gap-3 px-10 py-4 bg-white/10 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Kembali</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Section - Integrated dengan theme yellow */}
          <Footer theme="yellow" />
        </div>
      </div>
    </div>
  );
};

export default ModuleIntroductionPage;