"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle, Trophy, Star, Zap, Info, Lightbulb, Clock, Play, Pause } from "lucide-react";
import Navbar from "@/components/Navbar";

// Audio timestamps untuk auto-scroll (dalam detik)
const AUDIO_TIMESTAMPS = {
  section1Start: 68,
  section2Start: 153,
  section3Start: 258,
  section4Start: 409,
  section5Start: 540,
  section6Start: 644,
  section7Start: 768,
  completion: 923
};

interface ModuleSeriesPageProps {
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
          audioRef.current.currentTime = 0;
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Initialize audio ke detik 80 saat component mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
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
      {/* Audio Element - Hidden */}
      <audio
        ref={audioRef}
        src="/audio/modul-seri.mp3"
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
                    audioRef.current.currentTime = 68;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-300 transition-all"
              >
                S1 (1:08)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 153;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg text-cyan-300 transition-all"
              >
                S2 (2:33)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 258;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-300 transition-all"
              >
                S3 (4:18)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 409;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-yellow-500/20 hover:bg-yellow-500/40 rounded-lg text-yellow-300 transition-all"
              >
                S4 (6:49)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 540;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-orange-500/20 hover:bg-orange-500/40 rounded-lg text-orange-300 transition-all"
              >
                S5 (9:00)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 644;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-pink-500/20 hover:bg-pink-500/40 rounded-lg text-pink-300 transition-all"
              >
                S6 (10:44)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 768;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg text-purple-300 transition-all"
              >
                S7 (12:48)
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

// Section 1: Pengenalan Rangkaian Seri
const Section1Introduction = () => {
  const [activeLamp, setActiveLamp] = useState<number | null>(null);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => (prev + 16) % 2000);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Left: Text Content */}
      <div className="space-y-6">
        <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
          Apa itu Rangkaian Seri?
        </h2>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Bayangkan kamu menyalakan <span className="font-bold text-purple-400">tiga lampu kecil</span> dengan satu baterai. Kamu sambungkan kabel dari kutub positif baterai ke lampu pertama, lanjut ke lampu kedua, kemudian ke lampu ketiga, dan akhirnya kembali ke kutub negatif baterai.
          </p>
          <p className="text-lg text-slate-200 leading-relaxed">
            <span className="font-bold text-purple-400">Tidak ada cabang.</span> Semua lampu terhubung berderet satu jalur. Inilah yang disebut <span className="font-bold text-pink-400">rangkaian seri</span>.
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/30 backdrop-blur-sm">
          <h3 className="font-bold text-purple-300 mb-3">📌 Definisi:</h3>
          <p className="text-purple-200 font-semibold">
            Rangkaian listrik seri adalah rangkaian di mana semua komponen dihubungkan berurutan dalam <span className="text-pink-400">satu jalur, tanpa percabangan</span>.
          </p>
          <p className="text-purple-200 text-sm mt-3">
            ⚡ Arus listrik hanya memiliki satu jalan untuk mengalir — dari sumber listrik, melewati satu komponen ke komponen berikutnya, lalu kembali ke sumber.
          </p>
        </div>
      </div>

      {/* Right: Interactive Visual */}
      <div className="space-y-8">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
          
          <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border-2 border-purple-400/30 p-8 shadow-2xl">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Electrons flowing through circuit - Segment 1: Battery to Lamp 1 */}
              {activeLamp === null && [0, 1, 2, 3].map((i) => {
                const offset = (animationTime + i * 500) % 2000;
                let ex, ey;
                
                if (offset < 200) {
                  const t = offset / 200;
                  ex = 130 + t * 90;
                  ey = 250 - t * 100;
                } else if (offset < 400) {
                  const t = (offset - 200) / 200;
                  ex = 220 + t * 25;
                  ey = 150 - t * 30;
                } else if (offset < 600) {
                  const t = (offset - 400) / 200;
                  ex = 245 + t * 175;
                  ey = 120;
                } else if (offset < 800) {
                  const t = (offset - 600) / 200;
                  ex = 420 + t * 260;
                  ey = 120 + t * 30;
                } else if (offset < 1000) {
                  const t = (offset - 800) / 200;
                  ex = 680 + t * 20;
                  ey = 150 + t * 50;
                } else if (offset < 1200) {
                  const t = (offset - 1000) / 200;
                  ex = 700;
                  ey = 200 + t * 150;
                } else if (offset < 1400) {
                  const t = (offset - 1200) / 200;
                  ex = 700 - t * 600;
                  ey = 350;
                } else {
                  const t = (offset - 1400) / 600;
                  ex = 100;
                  ey = 350 - t * 100;
                }

                return (
                  <g key={`electron-s1-${i}`}>
                    <circle cx={ex} cy={ey} r="8" fill="rgba(255, 215, 0, 0.2)" filter="drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))" />
                    <circle cx={ex} cy={ey} r="4" fill="rgba(255, 230, 0, 0.95)" filter="drop-shadow(0 0 3px rgba(255, 215, 0, 0.9))" />
                  </g>
                );
              })}

              {/* Battery */}
              <circle cx="100" cy="250" r="30" fill="none" stroke="rgba(255, 100, 100, 0.8)" strokeWidth="3" />
              <text x="100" y="265" textAnchor="middle" fill="rgba(255, 150, 150, 0.9)" fontSize="35" fontWeight="bold">🔋</text>

              {/* Wires - Changes color based on circuit state */}
              {/* Wire 1: Battery to Lamp 1 */}
              <line x1="130" y1="250" x2={activeLamp === 1 ? 200 : 220}  y2="140" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
              
              {/* Wire 2: Lamp 1 to Lamp 2 */}
              <line x1="275" y1="120" x2={activeLamp === 2 ? 370 : 390}  y2="120" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
              
              {/* Wire 3: Lamp 2 to Lamp 3 */}
              <line x1="450" y1="120" x2={activeLamp === 3 ? 650 : 670}  y2="150" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
              
              {/* Wire 4: Lamp 3 down */}
              <line x1="700" y1="178" x2="700" y2="350" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
              
              {/* Wire 5: Bottom return */}
              <line x1="700" y1="350" x2="100" y2="350" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
              
              {/* Wire 6: Battery bottom return */}
              <line x1="100" y1="280" x2="100" y2="350" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />

              {/* Lamp 1 - Clickable */}
              <g onClick={() => setActiveLamp(activeLamp === 1 ? null : 1)} style={{ cursor: 'pointer' }}>
                <circle cx="245" cy="120" r="30" fill="none" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.4)"} strokeWidth="3" />
                <text x="245" y="135" textAnchor="middle" fill={activeLamp === null ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="35" fontWeight="bold">💡</text>
                {activeLamp === null && (
                  <circle cx="245" cy="120" r="36" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2">
                    <animate attributeName="r" from="36" to="50" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>

              {/* Lamp 2 - Clickable */}
              <g onClick={() => setActiveLamp(activeLamp === 2 ? null : 2)} style={{ cursor: 'pointer' }}>
                <circle cx="420" cy="120" r="30" fill="none" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.4)"} strokeWidth="3" />
                <text x="420" y="135" textAnchor="middle" fill={activeLamp === null ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="35" fontWeight="bold">💡</text>
                {activeLamp === null && (
                  <circle cx="420" cy="120" r="36" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2">
                    <animate attributeName="r" from="36" to="50" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>

              {/* Lamp 3 - Clickable */}
              <g onClick={() => setActiveLamp(activeLamp === 3 ? null : 3)} style={{ cursor: 'pointer' }}>
                <circle cx="700" cy="150" r="30" fill="none" stroke={activeLamp === null ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.4)"} strokeWidth="3" />
                <text x="700" y="165" textAnchor="middle" fill={activeLamp === null ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="35" fontWeight="bold">💡</text>
                {activeLamp === null && (
                  <circle cx="700" cy="150" r="36" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2">
                    <animate attributeName="r" from="36" to="50" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            </svg>

            {/* Info Box */}
            <div className={`rounded-lg p-4 transition-all -mt-8 ${
              activeLamp === null
                ? "bg-yellow-500/20 border border-yellow-400/50 text-yellow-200" 
                : "bg-red-500/20 border border-red-400/50 text-red-200"
            }`}>
              <p className="text-sm font-semibold text-center">
                {activeLamp === null 
                  ? "✓ Semua lampu menyala - Rangkaian tertutup" 
                  : "❌ Lampu " + activeLamp + " PUTUS! Semua lampu padam karena rangkaian seri terputus"}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3 justify-center mt-4 flex-wrap">
              <button
                onClick={() => setActiveLamp(activeLamp === 1 ? null : 1)}
                className={`absolute top-8 left-40 px-4 py-2 rounded-xl font-bold text-lg transition-all transform hover:scale-110 active:scale-95 shadow-2xl ${
                activeLamp === 1
                  ? "bg-gradient-to-r from-gray-700 to-gray-800 text-yellow-300 border border-yellow-400/30"
                  : "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:shadow-yellow-400/50"
              }`}>
              <text x="600" y="160" textAnchor="middle" fill={activeLamp === 1 ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="40">💡</text>
                      L1 
              </button>    
              <button
                onClick={() => setActiveLamp(activeLamp === 2 ? null : 2)}
                className={`absolute top-8 center px-4 py-2 rounded-xl font-bold text-lg transition-all transform hover:scale-110 active:scale-95 shadow-2xl ${
                activeLamp === 2
                  ? "bg-gradient-to-r from-gray-700 to-gray-800 text-yellow-300 border border-yellow-400/30"
                  : "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:shadow-yellow-400/50"
              }`}>
              <text x="600" y="160" textAnchor="middle" fill={activeLamp === 2 ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="40">💡</text>
                      L2 
              </button>
              <button
                onClick={() => setActiveLamp(activeLamp === 3 ? null : 3)}
                className={`absolute top-8 right-16 px-4 py-2 rounded-xl font-bold text-lg transition-all transform hover:scale-110 active:scale-95 shadow-2xl ${
                activeLamp === 3
                  ? "bg-gradient-to-r from-gray-700 to-gray-800 text-yellow-300 border border-yellow-400/30"
                  : "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:shadow-yellow-400/50"
              }`}>
              <text x="600" y="160" textAnchor="middle" fill={activeLamp === 3 ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="40">💡</text>
                      L3 
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-xl font-bold text-purple-300 mb-3">🎮 Interaktif Demo:</h3>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li>✅ <strong>Ketiga lampu menyala</strong> saat rangkaian tertutup</li>
            <li>⚡ <strong>Lihat aliran elektron</strong> (titik kuning) mengalir di kabel</li>
            <li>💡 <strong>Klik salah satu lampu</strong> untuk mematikannya</li>
            <li>� <strong>Semua lampu padam</strong> ketika satu terputus - ini rangkaian seri!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Section 2: Arus dalam Rangkaian Seri
const Section2Current = () => {
  const [carFlow, setCarFlow] = useState(3);
  const [tunnelWidth, setTunnelWidth] = useState(100);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => (prev + 20) % 3000);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Calculate the actual flow rate based on tunnel width
  const actualFlow = Math.max(1, Math.round((carFlow * tunnelWidth) / 100));
  const flowSpeed = (100 - tunnelWidth) * 0.5 + 500; // Slower when tunnel is narrow

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Right: Text Content */}
      <div className="space-y-6 lg:order-2">
        <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
          Arus dalam Rangkaian Seri
        </h2>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Dalam rangkaian seri, arus listrik hanya punya <span className="font-bold text-cyan-400">satu jalan</span>. Artinya, arus yang melewati setiap lampu/hambatan <span className="font-bold text-cyan-400">sama besar</span>. <br />Besarnya arus ditentukan oleh <span className="font-bold text-cyan-400">besar hambatan </span>dalam lintasan tersebut.
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-400/30">
          <h3 className="font-bold text-cyan-300 mb-3">📐 Rumus:</h3>
          <p className="text-cyan-200 font-mono text-lg font-bold">
            I<sub>tot</sub> = I<sub>1</sub> = I<sub>2</sub> = I<sub>3</sub> = ...
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/30">
          <h3 className="font-bold text-blue-300 mb-3">🚗 Analogi:</h3>
          <p className="text-blue-200 text-sm leading-relaxed">
            Arus bisa kamu bayangkan seperti <span className="font-bold">jumlah mobil yang melintasi terowongan setiap detik</span>. Semakin banyak mobil yang bisa lewat, semakin besar arus listriknya. Kalau jalan sempit atau banyak rintangan, tentu mobil yang bisa lewat jadi lebih sedikit — artinya arusnya mengecil.
          </p>
        </div>
        
      </div>

      {/* Left: Visual */}
      <div className="relative group lg:order-1">
        <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-400/30 p-8 shadow-2xl">
          {/* Scenario 1: Wide Tunnel (Normal Flow) */}
          <div className="mb-8 pb-8 border-b border-slate-700/50">
            <p className="text-cyan-300 font-bold text-sm mb-4">✅ Jalan Lebar - Arus Lancar</p>
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-4 border border-cyan-500/30 mb-3 h-20 overflow-hidden relative">
              {/* Road representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 80">
                  {/* Road */}
                  <rect x="0" y="20" width="400" height="40" fill="rgba(100, 150, 200, 0.1)" stroke="rgba(100, 150, 200, 0.3)" strokeWidth="2" rx="5"/>
                  {/* Road markings */}
                  {[...Array(8)].map((_, i) => (
                    <line key={i} x1={i * 50} y1="40" x2={i * 50 + 30} y2="40" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  ))}
                  {/* Cars */}
                  {[...Array(carFlow)].map((_, i) => {
                    const carPos = (animationTime / flowSpeed * 400) % 400;
                    const spacing = 400 / carFlow;
                    const xPos = (carPos + i * spacing) % 400;
                    return (
                      <g key={i} transform={`translate(${xPos}, 35)`}>
                        <rect x="-15" y="-8" width="30" height="16" fill="rgba(255, 200, 0, 0.8)" rx="2" />
                        <circle cx="-8" cy="6" r="3" fill="rgba(0,0,0,0.5)" />
                        <circle cx="8" cy="6" r="3" fill="rgba(0,0,0,0.5)" />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <p className="text-cyan-200 text-sm text-center font-bold">
              Arus: <span className="text-green-400">{carFlow} A</span> (Cepat ⚡)
            </p>
          </div>

          {/* Scenario 2: Adjustable Tunnel Width */}
          <div className="mb-6">
            <p className="text-cyan-300 font-bold text-sm mb-4">🛣️ Atur Lebar Terowongan</p>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4 h-32 overflow-hidden relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Tunnel walls */}
                <rect x="0" y={60 - tunnelWidth/2} width="400" height={tunnelWidth} fill="rgba(100, 150, 200, 0.15)" stroke="rgba(100, 150, 200, 0.4)" strokeWidth="2" rx="3"/>
                {/* Road markings */}
                {[...Array(8)].map((_, i) => (
                  <line key={i} x1={i * 50} y1="60" x2={i * 50 + 30} y2="60" stroke="rgba(255, 215, 0, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
                ))}
                {/* Cars flowing through */}
                {[...Array(Math.ceil(actualFlow))].map((_, i) => {
                  const carPos = (animationTime / flowSpeed * 400) % 400;
                  const spacing = 400 / Math.ceil(actualFlow);
                  const xPos = (carPos + i * spacing) % 400;
                  const carSize = Math.min(tunnelWidth * 0.6, 20);
                  return (
                    <g key={i} transform={`translate(${xPos}, 60)`} opacity={actualFlow > 0 ? 1 : 0.3}>
                      <rect x={-carSize/2} y={-carSize/2} width={carSize} height={carSize * 0.6} fill={tunnelWidth < 30 ? "rgba(255, 100, 100, 0.8)" : "rgba(255, 200, 0, 0.8)"} rx="2" />
                      <circle cx={-carSize/4} cy={carSize/4} r={carSize/6} fill="rgba(0,0,0,0.5)" />
                      <circle cx={carSize/4} cy={carSize/4} r={carSize/6} fill="rgba(0,0,0,0.5)" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="space-y-2">
              <label className="text-cyan-300 font-bold text-sm">Lebar Terowongan: {tunnelWidth}%</label>
              <input
                type="range"
                min="20"
                max="100"
                value={tunnelWidth}
                onChange={(e) => setTunnelWidth(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Current Flow Info */}
          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-cyan-300 text-xs font-bold mb-1">ARUS</p>
                <p className="text-2xl font-black text-cyan-200">{actualFlow}A</p>
              </div>
              <div className="text-center">
                <p className="text-cyan-300 text-xs font-bold mb-1">STATUS</p>
                <p className={`text-lg font-bold ${tunnelWidth < 40 ? "text-red-400" : tunnelWidth < 70 ? "text-yellow-400" : "text-green-400"}`}>
                  {tunnelWidth < 40 ? "🐌 Lambat" : tunnelWidth < 70 ? "⚠️ Terhambat" : "⚡ Lancar"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-cyan-200 text-xs mt-4 text-center">
            📌 Semakin sempit terowongan → semakin sedikit mobil yang lewat → arus berkurang
          </p>
        </div>
      </div>
    </div>
  );
};

// Section 3: Tegangan dalam Rangkaian Seri
const Section3Voltage = () => {
  const [lampCount, setLampCount] = useState(3);
  const [carPosition, setCarPosition] = useState(0);
  const totalVoltage = 12;
  const voltagePerLamp = Math.round((totalVoltage / lampCount) * 10) / 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setCarPosition((prev) => (prev + 0.5) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Calculate car's remaining energy
  const slopesPass = Math.floor((carPosition / 100) * lampCount);
  const remainingEnergy = Math.max(0, 100 - (slopesPass * voltagePerLamp * 8.33));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Left: Text Content */}
      <div className="space-y-6">
        <h2 className="text-4xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
          Tegangan dalam Rangkaian Seri
        </h2>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Meskipun arusnya sama, <span className="font-bold text-green-400">tegangan tidak sama</span>. Karena hanya satu lintasan, tegangan dari sumber listrik <span className="font-bold text-green-400">terbagi ke tiap komponen</span> di rangkaian.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30">
          <h3 className="font-bold text-green-300 mb-3">📐 Rumus:</h3>
          <p className="text-green-200 font-mono text-lg font-bold">
            V<sub>tot</sub> = V<sub>1</sub> + V<sub>2</sub> + V<sub>3</sub> + ...
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-400/30">
          <h3 className="font-bold text-emerald-300 mb-3">🚙 Analogi Tanjakan:</h3>
          <p className="text-emerald-200 text-sm leading-relaxed">
            Bayangkan listrik seperti mobil di jalan dengan tiga tanjakan. Mobil punya tenaga dari mesin (tegangan). Setiap kali naik tanjakan, tenaganya berkurang sedikit. Jadi tegangan terbagi ke tiga tanjakan, sama seperti tegangan listrik terbagi ke tiga lampu.
            <br /><br /><span className="font-bold">Tegangan diibaratkan seperti gaya dorong 💨 yang membuat arus bisa mengalir di dalam rangkaian.</span>
          </p>
        </div>
      </div>

      {/* Right: Interactive Visual */}
      <div className="relative group">
        <div className="absolute -inset-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-400/30 p-8 shadow-2xl">
          {/* Mountain Road Visualization */}
          <div className="space-y-6">
            <p className="text-green-300 font-bold text-sm mb-4">🚗 Mobil Menanjak - Tenaga Berkurang</p>
            
            {/* Interactive Mountain Road */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-4 border border-green-500/20 mb-4 h-40 overflow-hidden relative">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                {/* Sky */}
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "rgba(100, 150, 200, 0.1)" }} />
                    <stop offset="100%" style={{ stopColor: "rgba(50, 100, 150, 0.05)" }} />
                  </linearGradient>
                </defs>
                <rect width="400" height="150" fill="url(#skyGrad)" />

                {/* Draw slopes and calculate positions */}
                {[...Array(lampCount)].map((_, i) => {
                  const slopeWidth = 400 / lampCount;
                  const slopeX = i * slopeWidth;
                  const slopeHeight = 35; // Sama untuk semua tanjakan
                  const groundY = 120 - slopeHeight;
                  
                  return (
                    <g key={i}>
                      {/* Slope/Hill - Bentuk sama untuk semua */}
                      <path
                        d={`M ${slopeX} 120 L ${slopeX + slopeWidth * 0.8} ${groundY} L ${slopeX + slopeWidth} 120 Z`}
                        fill="rgba(100, 180, 100, 0.3)"
                        stroke="rgba(100, 220, 100, 0.6)"
                        strokeWidth="2"
                      />
                      {/* Slope label with voltage drop */}
                      <text
                        x={slopeX + slopeWidth / 2}
                        y="135"
                        textAnchor="middle"
                        fill="rgba(100, 200, 100, 0.7)"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        -{voltagePerLamp}V
                      </text>
                    </g>
                  );
                })}

                {/* Moving car */}
                {(() => {
                  const currentSlopeIndex = Math.floor((carPosition / 100) * lampCount);
                  const slopeWidth = 400 / lampCount;
                  const localPosition = (carPosition % (100 / lampCount)) / (100 / lampCount);
                  const slopeX = currentSlopeIndex * slopeWidth;
                  const slopeHeight = 35; // Sama untuk semua
                  const groundY = 120 - slopeHeight;
                  
                  const carX = slopeX + localPosition * slopeWidth;
                  const carY = 120 - (localPosition * slopeHeight);
                  
                  return (
                    <g transform={`translate(${carX}, ${carY})`}>
                      {/* Car body with gradient based on energy */}
                      <rect 
                        x="-12" 
                        y="-6" 
                        width="24" 
                        height="12" 
                        fill={remainingEnergy > 66 ? "rgba(0, 255, 0, 0.9)" : remainingEnergy > 33 ? "rgba(255, 200, 0, 0.9)" : "rgba(255, 100, 0, 0.9)"}
                        rx="3"
                      />
                      {/* Wheels */}
                      <circle cx="-7" cy="6" r="3" fill="rgba(0,0,0,0.6)" />
                      <circle cx="7" cy="6" r="3" fill="rgba(0,0,0,0.6)" />
                      {/* Energy bar above car */}
                      <rect x="-10" y="-14" width="20" height="4" fill="rgba(100, 100, 100, 0.4)" rx="2" />
                      <rect 
                        x="-10" 
                        y="-14" 
                        width={remainingEnergy / 5} 
                        height="4" 
                        fill={remainingEnergy > 66 ? "rgba(0, 255, 0, 0.9)" : remainingEnergy > 33 ? "rgba(255, 200, 0, 0.9)" : "rgba(255, 100, 0, 0.9)"}
                        rx="2"
                      />
                    </g>
                  );
                })()}

                {/* Start and End markers */}
                <text x="5" y="20" fill="rgba(100, 200, 100, 0.6)" fontSize="10" fontWeight="bold">START</text>
                <text x="360" y="20" fill="rgba(200, 100, 100, 0.6)" fontSize="10" fontWeight="bold">END</text>
              </svg>
            </div>

            {/* Voltage Distribution Bar */}
            <div>
              <p className="text-green-300 font-bold text-sm mb-2">Pembagian Tegangan</p>
              <div className="bg-slate-800 h-8 rounded-lg border border-green-500/50 overflow-hidden">
                <div className="flex h-full">
                  {[...Array(lampCount)].map((_, i) => (
                    <div
                      key={i}
                      className="border-r border-slate-900 flex items-center justify-center font-bold text-white text-xs"
                      style={{
                        width: `${100 / lampCount}%`,
                        background: `linear-gradient(to right, rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 0.5))`
                      }}
                    >
                      {voltagePerLamp}V
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider untuk mengubah jumlah tanjakan */}
            <div className="space-y-2">
              <label className="text-green-300 font-bold text-sm">Jumlah Tanjakan/Lampu: {lampCount}</label>
              <input
                type="range"
                min="1"
                max="6"
                value={lampCount}
                onChange={(e) => setLampCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <p className="text-green-200 text-xs">
                📌 Semakin banyak tanjakan → tegangan per tanjakan semakin kecil
              </p>
            </div>

            {/* Energy Info */}
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-green-300 font-bold">TOTAL</p>
                  <p className="text-green-200 font-bold">{totalVoltage}V</p>
                </div>
                <div>
                  <p className="text-green-300 font-bold">PER TANJAKAN</p>
                  <p className="text-green-200 font-bold">{voltagePerLamp}V</p>
                </div>
                <div>
                  <p className="text-green-300 font-bold">TENAGA MOBIL</p>
                  <p className={`font-bold ${remainingEnergy > 66 ? "text-green-400" : remainingEnergy > 33 ? "text-yellow-400" : "text-red-400"}`}>
                    {Math.round(remainingEnergy)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 4: Hambatan dalam Rangkaian Seri
const Section4Resistance = () => {
  const [resistorCount, setResistorCount] = useState(3);
  const [carAnimPos, setCarAnimPos] = useState(0);
  const R1 = 2, R2 = 4, R3 = 6;
  const resistors = [R1, R2, R3].slice(0, resistorCount);
  const totalR = resistors.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarAnimPos((prev) => (prev + 0.3) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Calculate flow rate based on total resistance (inverse relationship)
  const baseFlow = 4;
  const actualFlow = Math.max(1, Math.round((baseFlow * 12) / totalR));
  const flowSpeed = (totalR / 12) * 1000 + 300; // Slower with higher resistance

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
    
      {/* Right: Text Content */}
      <div className="space-y-6 lg:order-2">
        <h2 className="text-4xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Hambatan dalam Rangkaian Seri
        </h2>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Setiap hambatan (resistor) <span className="font-bold text-orange-400">menahan arus sebagian</span>. Jadi, kalau semua hambatan disusun seri, <span className="font-bold text-orange-400">total hambatan bertambah</span>.
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-400/30">
          <h3 className="font-bold text-orange-300 mb-3">📐 Rumus:</h3>
          <p className="text-orange-200 font-mono text-lg font-bold">
            R<sub>tot</sub> = R<sub>1</sub> + R<sub>2</sub> + R<sub>3</sub> + ...
          </p>
          <p className="text-orange-200 text-sm mt-2">
            Semakin banyak resistor disusun seri → arus makin kecil (karena jalannya makin &quot;sempit&quot;).
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-6 border border-red-400/30">
          <h3 className="font-bold text-red-300 mb-3">🌊 Analogi:</h3>
          <p className="text-red-200 text-sm leading-relaxed">
            Hambatan seperti bagian terowongan yang menanjak, licin, atau sempit. Semakin besar hambatan, semakin sulit mobil melaju.
          </p>
        </div>
      </div>
      {/* Left: Visual */}
      <div className="relative group lg:order-1">
        <div className="absolute -inset-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-400/30 p-8 shadow-2xl">
          {/* Road with Multiple Obstacles */}
          <div className="space-y-6">
            <p className="text-orange-300 font-bold text-sm mb-4">🚗 Jalan Satu Arah - Rintangan Berurutan</p>
            
            {/* Main Road Visualization */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-4 border border-orange-500/20 mb-4 h-48 overflow-hidden relative">
              <svg className="w-full h-full" viewBox="0 0 450 150" preserveAspectRatio="none">
                {/* Road base */}
                <defs>
                  <pattern id="roadDash" x="20" y="0" width="40" height="150" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="75" x2="20" y2="75" stroke="rgba(255, 200, 0, 0.2)" strokeWidth="1" strokeDasharray="3,3" />
                  </pattern>
                </defs>
                
                <rect width="450" height="150" fill="rgba(60, 60, 60, 0.3)" />
                <rect width="450" height="150" fill="url(#roadDash)" />
                
                {/* Road markings - center line */}
                {[...Array(10)].map((_, i) => (
                  <line key={i} x1={i * 45} y1="75" x2={i * 45 + 20} y2="75" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
                ))}

                {/* Draw obstacles (resistors) */}
                {resistors.map((resistance, i) => {
                  const obstacleX = (i * (450 / resistorCount)) + 40;
                  const obstacleWidth = Math.max(15, Math.min(40, resistance * 5));
                  const obstacleIntensity = resistance / 6; // 0 to 1
                  
                  return (
                    <g key={i}>
                      {/* Obstacle representation */}
                      <rect
                        x={obstacleX - obstacleWidth / 2}
                        y={60 - obstacleIntensity * 20}
                        width={obstacleWidth}
                        height={30 + obstacleIntensity * 20}
                        fill={`rgba(255, 100, 0, ${0.3 + obstacleIntensity * 0.4})`}
                        stroke={`rgba(255, 150, 0, ${0.6 + obstacleIntensity * 0.3})`}
                        strokeWidth="2"
                        rx="4"
                      />
                      {/* Resistance label */}
                      <text
                        x={obstacleX}
                        y="130"
                        textAnchor="middle"
                        fill="rgba(255, 150, 0, 0.8)"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {resistance}Ω
                      </text>
                    </g>
                  );
                })}

                {/* Animated cars flowing through */}
                {[...Array(actualFlow)].map((_, carIdx) => {
                  const spacing = 450 / actualFlow;
                  const carX = (carAnimPos + carIdx * (100 / actualFlow)) % 100;
                  const carXPos = (carX / 100) * 450;
                  
                  // Find which obstacle car is near
                  let carSpeedMultiplier = 1;
                  resistors.forEach((r, i) => {
                    const obstacleX = (i * (450 / resistorCount)) + 40;
                    const distance = Math.abs(carXPos - obstacleX);
                    if (distance < 50) {
                      carSpeedMultiplier = Math.min(carSpeedMultiplier, 1 / (1 + (r / 6) * 0.8));
                    }
                  });
                  
                  return (
                    <g key={carIdx} transform={`translate(${carXPos}, 75)`}>
                      {/* Car body */}
                      <rect x="-10" y="-6" width="20" height="12" fill="rgba(255, 200, 0, 0.85)" rx="2" />
                      {/* Car wheels */}
                      <circle cx="-6" cy="6" r="3" fill="rgba(0, 0, 0, 0.6)" />
                      <circle cx="6" cy="6" r="3" fill="rgba(0, 0, 0, 0.6)" />
                      {/* Speed indicator */}
                      <circle cx="0" cy="-10" r="3" fill={carSpeedMultiplier > 0.5 ? "rgba(0, 255, 0, 0.6)" : "rgba(255, 150, 0, 0.6)"} />
                    </g>
                  );
                })}

                {/* Start and End */}
                <text x="10" y="20" fill="rgba(100, 200, 100, 0.6)" fontSize="10" fontWeight="bold">START</text>
                <text x="400" y="20" fill="rgba(200, 100, 100, 0.6)" fontSize="10" fontWeight="bold">END</text>
              </svg>
            </div>

            {/* Flow Analysis */}
            <div className="space-y-3">
              <p className="text-orange-300 font-bold text-sm">Analisis Hambatan</p>
              
              {/* Resistor breakdown */}
              <div className="space-y-2">
                {resistors.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 bg-orange-500/10 border border-orange-400/30 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-200 text-sm font-bold">R{i + 1}</span>
                        <span className="text-orange-300 font-mono text-sm">{r}Ω</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total calculation */}
              <div className="bg-orange-500/20 border-2 border-orange-400/50 rounded-lg p-4 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-orange-200 font-bold">Total Hambatan:</span>
                  <span className="text-orange-300 font-mono font-bold text-lg">{totalR}Ω</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-200 font-bold">Arus (I):</span>
                  <span className="text-orange-300 font-mono font-bold text-lg">{actualFlow} A</span>
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <label className="text-orange-300 font-bold text-sm">Jumlah Rintangan: {resistorCount}</label>
              <input
                type="range"
                min="1"
                max="3"
                value={resistorCount}
                onChange={(e) => setResistorCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 mt-2"
              />
              <p className="text-orange-200 text-xs">
                📌 Semakin banyak rintangan → total hambatan bertambah → arus berkurang → mobil lebih lambat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 5: Contoh Nyata - Lampu Hias
const Section5RealExample = () => {
  const [activeBulb, setActiveBulb] = useState<number | null>(null);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => (prev + 16) % 2000);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const bulbCount = 18  ;
  const isCircuitBroken = activeBulb !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Left: Text Content */}
      <div className="space-y-6">
        <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
          Contoh Nyata: Lampu Hias Lama
        </h2>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Pernahkah kamu melihat <span className="font-bold text-yellow-400">lampu hias lama yang padam semua hanya karena satu lampu putus</span>?
          </p>
          <p className="text-lg text-slate-200 leading-relaxed">
            Itu karena rangkaian lampu tersebut disusun seri. Jika satu lampu putus, <span className="font-bold text-yellow-400">arus tidak bisa mengalir ke lampu berikutnya</span>.
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-6 border border-yellow-400/30">
          <h3 className="font-bold text-yellow-300 mb-3">⚠️ Karakteristik:</h3>
          <ul className="text-yellow-200 space-y-2 text-sm">
            <li>✓ Satu titik putus, semua padam</li>
            <li>✓ Mudah diidentifikasi mana yang rusak</li>
            <li>✓ Sering ditemukan di lampu hias lama</li>
          </ul>
        </div>
      </div>

      {/* Right: Interactive Visual */}
      <div className="relative group">
        <div className="absolute -inset-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-yellow-400/30 p-8 shadow-2xl">
          {/* String of Lights - SVG */}
          <div className="space-y-6">
            <p className="text-yellow-300 font-bold text-sm text-center">Klik salah satu lampu untuk mematikannya</p>
            
            {/* Decorative Light String Visualization - Christmas Tree */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-6 border border-yellow-500/20 h-80 overflow-hidden flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 400 350" preserveAspectRatio="xMidYMid meet">
                {/* Define glow effect */}
                <defs>
                  <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="bulbGlowBright" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Tree trunk */}
                <rect x="175" y="280" width="50" height="60" fill="rgba(139, 90, 43, 0.8)" stroke="rgba(160, 110, 60, 0.9)" strokeWidth="2" />

                {/* Tree layers */}
                <path d="M 200 40 L 100 120 L 115 120 L 50 200 L 70 200 L 25 280 L 375 280 L 330 200 L 350 200 L 285 120 L 300 120 Z" 
                      fill="rgba(34, 139, 34, 0.6)" stroke="rgba(50, 180, 50, 0.8)" strokeWidth="2" />

                {/* Star on top */}
                <polygon points="200,15 210,40 235,40 215,55 225,80 200,65 175,80 185,55 165,40 190,40" 
                         fill="rgba(255, 215, 0, 0.9)" stroke="rgba(255, 200, 0, 0.9)" strokeWidth="1" />

                {/* Spiral light string with bulbs */}
                {[...Array(bulbCount)].map((_, i) => {
                  // Create spiral pattern
                  const angle = (i / bulbCount) * Math.PI * 6; // 2 full rotations
                  const radius = 160 - (i / bulbCount) * 70; // Decreases as we go up
                  const yPos = 240 - (i / bulbCount) * 180;
                  const xPos = 200 + Math.cos(angle) * radius;
                  
                  const isBroken = activeBulb === i + 1;
                  const isOn = !isCircuitBroken;

                  return (
                    <g key={i}>
                      {/* Wire strand of spiral */}
                      {i < bulbCount - 1 && (() => {
                        const nextAngle = ((i + 1) / bulbCount) * Math.PI * 6;
                        const nextRadius = 160 - ((i + 1) / bulbCount) * 70;
                        const nextYPos = 240 - ((i + 1) / bulbCount) * 180;
                        const nextXPos = 200 + Math.cos(nextAngle) * nextRadius;
                        
                        return (
                          <line
                            x1={xPos}
                            y1={yPos}
                            x2={nextXPos}
                            y2={nextYPos}
                            stroke={isCircuitBroken ? "rgba(255, 100, 100, 0.3)" : "rgba(255, 200, 0, 0.5)"}
                            strokeWidth="1.5"
                            opacity="0.7"
                          />
                        );
                      })()}
                      
                      {/* Bulb - clickable */}
                      <g
                        onClick={() => setActiveBulb(isBroken ? null : i + 1)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Outer glow when on */}
                        {isOn && !isBroken && (
                          <circle
                            cx={xPos}
                            cy={yPos}
                            r="12"
                            fill="none"
                            stroke="rgba(255, 220, 0, 0.3)"
                            strokeWidth="1"
                            opacity="0.7"
                          >
                            <animate attributeName="r" from="12" to="20" dur="1s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.7" to="0" dur="1s" repeatCount="indefinite" />
                          </circle>
                        )}

                        {/* Bulb shape */}
                        {isBroken ? (
                          <>
                            {/* Broken bulb - gray with X */}
                            <circle cx={xPos} cy={yPos} r="8" fill="rgba(100, 100, 100, 0.4)" stroke="rgba(100, 100, 100, 0.7)" strokeWidth="1.5" filter="url(#bulbGlow)" />
                            <text x={xPos} y={yPos + 2} textAnchor="middle" fill="rgba(200, 100, 100, 0.9)" fontSize="10" fontWeight="bold">✗</text>
                          </>
                        ) : (
                          <>
                            {/* Working bulb with gradient */}
                            <defs>
                              <radialGradient id={`christmasBulbGrad${i}`} cx="35%" cy="35%">
                                <stop offset="0%" stopColor={isOn ? "rgba(255, 255, 0, 0.95)" : "rgba(100, 100, 100, 0.3)"} />
                                <stop offset="100%" stopColor={isOn ? "rgba(255, 150, 0, 0.8)" : "rgba(80, 80, 80, 0.3)"} />
                              </radialGradient>
                            </defs>
                            <circle
                              cx={xPos}
                              cy={yPos}
                              r="8"
                              fill={`url(#christmasBulbGrad${i})`}
                              stroke={isOn ? "rgba(255, 200, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"}
                              strokeWidth="1.5"
                              filter={isOn ? "url(#bulbGlowBright)" : "url(#bulbGlow)"}
                            />
                            {/* Highlight on bulb */}
                            {isOn && (
                              <circle cx={xPos - 2} cy={yPos - 2} r="2" fill="rgba(255, 255, 255, 0.7)" />
                            )}
                          </>
                        )}
                      </g>
                    </g>
                  );
                })}

                {/* Power cord at bottom */}
                <line x1="50" y1="320" x2="350" y2="320" stroke={isCircuitBroken ? "rgba(255, 100, 100, 0.5)" : "rgba(0, 0, 0, 0.8)"} strokeWidth="2" />
                
                {/* Plug symbol */}
                <circle cx="30" cy="320" r="8" fill="rgba(200, 0, 0, 0.6)" stroke="rgba(255, 0, 0, 0.8)" strokeWidth="1" />
              </svg>
            </div>

            {/* Status Display */}
            {isCircuitBroken ? (
              <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 animate-pulse">
                <p className="text-red-200 font-bold text-center">
                  ⚡ LAMPU {activeBulb} PUTUS!
                </p>
                <p className="text-red-200 text-xs text-center mt-2">
                  Semua lampu padam karena rangkaian seri terputus
                </p>
              </div>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                <p className="text-yellow-200 font-bold text-center">
                  ✓ Semua Lampu Menyala
                </p>
                <p className="text-yellow-200 text-xs text-center mt-2">
                  Arus mengalir melalui semua lampu secara seri
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center">
              <p className="text-yellow-300 text-xs font-semibold mb-2">💡 Cara Kerja:</p>
              <p className="text-yellow-200 text-xs">
                Klik pada salah satu lampu untuk &quot;memutusnya&quot;. Lihat bagaimana semua lampu padam karena jalurnya putus!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 6: Soal dan Perhitungan
const Section6Calculation = () => {
  const [resistorCount, setResistorCount] = useState(3);
  const [highlightResistor, setHighlightResistor] = useState<number | null>(null);
  
  const R1 = 2, R2 = 4, R3 = 6;
  const V_total = 12;
  
  const resistors = [R1, R2, R3].slice(0, resistorCount);
  const R_total = resistors.reduce((a, b) => a + b, 0);
  const I_total = Math.round((V_total / R_total) * 100) / 100;
  
  const voltages = resistors.map(r => Math.round((I_total * r) * 100) / 100);

  return (
    <div className="space-y-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
        Soal dan Perhitungan
      </h2>

      {/* Problem Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
          
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-400/30 p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-cyan-300 mb-4">📊 Persoalan:</h3>
            <p className="text-slate-200 mb-4">
              Tiga buah hambatan disusun seri dan dihubungkan dengan baterai 12 V:
            </p>

            {/* Circuit Diagram */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-6 border border-cyan-500/20 mb-6 h-64 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                {/* Power line - top */}
                <line x1="30" y1="60" x2="100" y2="60" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                {/* Power line - top */}
                <line x1="140" y1="60" x2="230" y2="60" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                <line x1="270" y1="60" x2="360" y2="60" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                <line x1="400" y1="60" x2="570" y2="60" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />

                <line x1="570" y1="60" x2="570" y2="140" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                
                {/* Return line - bottom */}
                <line x1="30" y1="140" x2="570" y2="140" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />

                {/* Battery */}
                <g>
                  <circle cx="30" cy="100" r="15" fill="none" stroke="rgba(255, 100, 100, 0.8)" strokeWidth="2" />
                  <text x="30" y="105" textAnchor="middle" fill="rgba(255, 100, 100, 0.9)" fontSize="18" fontWeight="bold">🔋</text>
                </g>

                <line x1="30" y1="140" x2="30" y2="115" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                <line x1="30" y1="85" x2="30" y2="60" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />

                {/* Draw resistors */}
                {resistors.map((r, i) => {
                  const xPos = 120 + i * 130;
                  const isHighlighted = highlightResistor === i;
                  
                  return (
                    <g key={i}>
                      
                      
                      {/* Resistor symbol (zigzag) */}
                      <g
                        onClick={() => setHighlightResistor(isHighlighted ? null : i)}
                        style={{ cursor: 'pointer' }}
                        opacity={isHighlighted ? 1 : 0.7}
                      >
                        {/* Resistor box */}
                        <rect
                          x={xPos - 20}
                          y="50"
                          width="40"
                          height="20"
                          fill={isHighlighted ? "rgba(0, 255, 100, 0.2)" : "rgba(100, 150, 200, 0.2)"}
                          stroke={isHighlighted ? "rgba(0, 255, 100, 0.8)" : "rgba(100, 200, 255, 0.8)"}
                          strokeWidth="2"
                          rx="3"
                        />
                        
                        {/* Resistor label */}
                        <text
                          x={xPos}
                          y="65"
                          textAnchor="middle"
                          fill={isHighlighted ? "rgba(0, 255, 100, 0.9)" : "rgba(100, 200, 255, 0.7)"}
                          fontSize="11"
                          fontWeight="bold"
                        >
                          R{i + 1}
                        </text>
                      </g>
                      
                      {/* Resistance value */}
                      <text
                        x={xPos}
                        y="85"
                        textAnchor="middle"
                        fill={isHighlighted ? "rgba(0, 255, 100, 0.9)" : "rgba(150, 200, 255, 0.7)"}
                        fontSize="13"
                        fontWeight="bold"
                      >
                        {r}Ω
                      </text>
                      
                      {/* Voltage label above resistor */}
                      {isHighlighted && (
                        <text
                          x={xPos}
                          y="40"
                          textAnchor="middle"
                          fill="rgba(0, 255, 100, 0.9)"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          V{i + 1}={voltages[i]}V
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            <ul className="text-slate-300 space-y-2 text-sm font-mono">
              <li>• R₁ = 2 Ω</li>
              <li>• R₂ = 4 Ω</li>
              <li>• R₃ = 6 Ω</li>
            </ul>
            <p className="text-cyan-200 font-bold mt-4 text-sm">Hitunglah:</p>
            <ul className="text-cyan-200 space-y-1 text-sm mt-2">
              <li>1. Hambatan total (R<sub>tot</sub>)</li>
              <li>2. Arus listrik (I)</li>
              <li>3. Tegangan masing-masing hambatan</li>
              <li>4. Bagaimana dampak hambatan terhadap bersarnya arus?</li>
            </ul>
          </div>
        </div>

        {/* Interactive Calculator */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
          
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-400/30 p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-green-300 mb-4">🎯 Solusi:</h3>
            
            <div className="space-y-3 text-sm">
              <div className="bg-green-500/10 border border-green-400/50 rounded p-3">
                <p className="text-green-200 font-mono">R<sub>tot</sub> = {resistors.join(" + ")} = <span className="font-bold text-green-300">{R_total} Ω</span></p>
              </div>
              
              <div className="bg-cyan-500/10 border border-cyan-400/50 rounded p-3">
                <p className="text-cyan-200 font-mono">I = V / R<sub>tot</sub> = {V_total} / {R_total} = <span className="font-bold text-cyan-300">{I_total} A</span></p>
              </div>

              <div className="space-y-2">
                <p className="text-slate-300 font-bold">Tegangan masing-masing:</p>
                {resistors.map((r, i) => (
                  <div key={i} className="bg-yellow-500/10 border border-yellow-400/50 rounded p-2">
                    <p className="text-yellow-200 font-mono text-xs">V<sub>{i+1}</sub> = {I_total} × {r} = <span className="font-bold text-yellow-300">{voltages[i]} V</span></p>
                  </div>
                ))}
              </div>

              <div className="bg-purple-500/10 border border-purple-400/50 rounded p-3">
                <p className="text-purple-200 font-mono text-xs">Verifikasi: {voltages.join(" + ")} = <span className="font-bold text-purple-300">{voltages.reduce((a, b) => a + b, 0)} V ✓</span></p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="relative group mt-5">
            <div className="absolute -inset-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
            
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-400/30 p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-orange-300 mb-4">📈 Dampak Jumlah Hambatan terhadap Arus:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((count) => {
                  const testR = [R1, R2, R3].slice(0, count).reduce((a, b) => a + b, 0);
                  const testI = Math.round((V_total / testR) * 100) / 100;
                  return (
                    <div key={count} className="bg-orange-500/10 border border-orange-400/50 rounded-lg p-4 text-center">
                      <p className="text-orange-300 font-bold mb-2">R<sub>tot</sub> = {testR} Ω</p>
                      <p className="text-orange-200 font-mono font-bold text-lg">I = {testI} A</p>
                      <p className="text-orange-200/60 text-xs mt-2">
                        {count === 1 && "Arus terbesar"}
                        {count === 2 && "Arus berkurang"}
                        {count === 3 && "Arus terkecil"}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mt-4">
                <p className="text-red-200 font-semibold text-sm">
                  ⚡ <span className="font-bold">Kesimpulan:</span> Semakin banyak hambatan disusun seri, hambatan total bertambah, sehingga arus total semakin kecil!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 7: Ringkasan dan Perbandingan
const Section7Summary = () => {
  const [selectedAspect, setSelectedAspect] = useState<number | null>(null);
  
  const characteristics = [
    { aspect: "Arus (I)", seri: "Sama di seluruh komponen", detail: "I₁ = I₂ = I₃ = ... (konstan)", icon: "⚡", color: "from-blue-500 to-cyan-500" },
    { aspect: "Tegangan (V)", seri: "Terbagi di setiap komponen", detail: "V₁ + V₂ + V₃ = V_total", icon: "🔋", color: "from-green-500 to-emerald-500" },
    { aspect: "Hambatan (R)", seri: "Jumlah seluruh hambatan", detail: "R_total = R₁ + R₂ + R₃", icon: "🌊", color: "from-orange-500 to-red-500" },
    { aspect: "Jika satu putus", seri: "Semua komponen padam", detail: "Jalur arus terputus total", icon: "❌", color: "from-red-500 to-pink-500" },
    { aspect: "Contoh nyata", seri: "Senter, lampu hias lama", detail: "Rangkaian dengan satu jalur", icon: "💡", color: "from-yellow-500 to-amber-500" },
  ];

  return (
    <div className="space-y-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg mb-4">
          🎓 Ringkasan: Ciri-Ciri Rangkaian Seri
        </h2>
        <p className="text-slate-300 text-lg">Klik pada setiap item untuk melihat detail lebih lanjut</p>
      </div>

      {/* Characteristics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {characteristics.map((char, idx) => (
          <div
            key={idx}
            className="relative group cursor-pointer opacity-0 animate-fade-in transition-all transform hover:scale-105"
            style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
            onClick={() => setSelectedAspect(selectedAspect === idx ? null : idx)}
          >
            <div className={`absolute -inset-2 bg-gradient-to-r ${char.color} rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500`}></div>
            
            <div className={`relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 rounded-xl p-6 shadow-xl transition-all ${
              selectedAspect === idx 
                ? `border-transparent bg-gradient-to-br ${char.color} shadow-2xl` 
                : `border-slate-700 hover:border-slate-600`
            }`}>
              {/* Icon */}
              <div className={`text-5xl mb-3 transition-transform ${selectedAspect === idx ? 'scale-110' : ''}`}>
                {char.icon}
              </div>
              
              {/* Title */}
              <h3 className={`font-black text-lg mb-2 transition-all ${
                selectedAspect === idx ? 'text-white' : 'text-slate-200'
              }`}>
                {char.aspect}
              </h3>
              
              {/* Description */}
              <p className={`text-sm mb-3 transition-all ${
                selectedAspect === idx ? 'text-white font-semibold' : 'text-slate-400'
              }`}>
                {char.seri}
              </p>
              
              {/* Expandable Detail */}
              {selectedAspect === idx && (
                <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in">
                  <p className="text-xs font-mono text-white/80 bg-black/30 p-3 rounded-lg">
                    {char.detail}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Key Takeaway - Enhanced */}
      <div className="relative group mt-12">
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-red-500/40 rounded-3xl blur-3xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
        
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-yellow-400/60 p-10 shadow-2xl overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex items-start gap-6">
            <div className="text-6xl flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }}>🎯</div>
            
            <div className="flex-1">
              <h3 className="text-3xl font-black text-yellow-300 mb-6">Poin Penting</h3>
              <ul className="space-y-4">
                {[
                  { icon: "⚡", text: "Rangkaian seri adalah susunan komponen berurutan dalam satu jalur" },
                  { icon: "🔄", text: "Arus sama di semua titik, tegangan terbagi di setiap komponen" },
                  { icon: "📉", text: "Semakin banyak hambatan, arus semakin kecil" },
                  { icon: "🚫", text: "Jika satu komponen putus, seluruh rangkaian terputus" },
                ].map((point, i) => (
                  <li key={i} className="flex gap-4 group/item cursor-pointer transition-transform hover:translate-x-2">
                    <span className="text-2xl flex-shrink-0 group-hover/item:scale-125 transition-transform">{point.icon}</span>
                    <span className="text-yellow-100 text-lg leading-relaxed font-medium">{point.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
        </div>
      </div>

      {/* Formula Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-400/40 rounded-xl p-6 shadow-xl">
            <h4 className="text-xl font-black text-blue-300 mb-4">📐 Rumus Dasar</h4>
            <div className="space-y-3 font-mono text-sm text-blue-200">
              <div className="bg-blue-500/10 p-3 rounded border border-blue-400/30">
                <p>I = I₁ = I₂ = I₃</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded border border-blue-400/30">
                <p>V = V₁ + V₂ + V₃</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded border border-blue-400/30">
                <p>R = R₁ + R₂ + R₃</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-400/40 rounded-xl p-6 shadow-xl">
            <h4 className="text-xl font-black text-purple-300 mb-4">💡 Hukum Ohm</h4>
            <div className="space-y-3 font-mono text-sm text-purple-200">
              <div className="bg-purple-500/10 p-3 rounded border border-purple-400/30">
                <p>V = I × R</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded border border-purple-400/30">
                <p>I = V / R</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded border border-purple-400/30">
                <p>R = V / I</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="relative group">
        <div className="absolute -inset-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
        
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-400/40 p-8 shadow-2xl overflow-x-auto">
          <h4 className="text-2xl font-black text-green-300 mb-6">📊 Tabel Perbandingan</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-green-400/50">
                <th className="text-left py-3 px-4 text-green-300 font-bold">Karakteristik</th>
                <th className="text-left py-3 px-4 text-green-300 font-bold">Rangkaian Seri</th>
              </tr>
            </thead>
            <tbody>
              {[
                { char: "Jalur Arus", desc: "Satu jalur tunggal" },
                { char: "Arus (I)", desc: "Sama di semua titik" },
                { char: "Tegangan (V)", desc: "Terbagi ke komponen" },
                { char: "Hambatan (R)", desc: "R_total = Σ R" },
                { char: "Jika putus", desc: "Semua padam" },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-green-400/20 hover:bg-green-500/10 transition ${i % 2 === 0 ? 'bg-green-500/5' : ''}`}>
                  <td className="py-3 px-4 text-green-200 font-semibold">{row.char}</td>
                  <td className="py-3 px-4 text-green-100">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ModuleSeriesPageNew = ({ isCompleted = false, onMarkComplete }: ModuleSeriesPageProps) => {
  const [isModuleCompleted, setIsModuleCompleted] = useState(isCompleted);
  const [isClient, setIsClient] = useState(false);
  
  // Refs untuk sections
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);
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
      case "section5Start":
        section5Ref.current?.scrollIntoView(scrollOptions);
        break;
      case "section6Start":
        section6Ref.current?.scrollIntoView(scrollOptions);
        break;
      case "section7Start":
        section7Ref.current?.scrollIntoView(scrollOptions);
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-ping"
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-950 via-slate-900 to-slate-900 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-ping"
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
                <span className="text-yellow-400 text-sm font-bold">Modul 2</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-red-300 bg-clip-text text-transparent drop-shadow-2xl">
                Rangkaian Listrik Seri
              </h1>
              <p className="text-lg text-purple-200">Pelajari cara kerja komponen berurutan dalam satu jalur</p>
            </div>

            <div className="flex flex-col items-center px-6 py-4 rounded-2xl shadow-lg border border-white/20 backdrop-blur-xl bg-white/10">
              <Clock className="w-8 h-8 mb-2 text-purple-300" />
              <span className="font-bold text-sm text-purple-100">7 Sections</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Container */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {/* Section 1 */}
          <div ref={section1Ref}>
            <Section1Introduction />
          </div>

          {/* Divider */}
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent w-32"></div>
              <Zap className="w-6 h-6 text-purple-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 2 */}
          <div ref={section2Ref}>
            <Section2Current />
          </div>

          {/* Divider */}
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent w-32"></div>
              <Zap className="w-6 h-6 text-cyan-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 3 */}
          <div ref={section3Ref}>
            <Section3Voltage />
          </div>

          {/* Divider */}
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-32"></div>
              <Zap className="w-6 h-6 text-green-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 4 */}
          <div ref={section4Ref}>
            <Section4Resistance />
          </div>

          {/* Divider */}
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent w-32"></div>
              <Zap className="w-6 h-6 text-orange-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 5 */}
          <div ref={section5Ref}>
            <Section5RealExample />
          </div>

          {/* Divider */}
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent w-32"></div>
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 6 */}
          <div ref={section6Ref}>
            <Section6Calculation />
          </div>

          {/* Divider */}
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent w-32"></div>
              <Zap className="w-6 h-6 text-purple-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 7 */}
          <div ref={section7Ref}>
            <Section7Summary />
          </div>
        </div>
      </div>

      {/* Completion Section */}
      <div className="relative text-white py-32 px-6 overflow-hidden mt-20 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }} ref={completionRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950"></div>
        
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-purple-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-slate-900/80 to-purple-950/80 backdrop-blur-xl rounded-3xl border-2 border-purple-400/30 p-12 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Main Message */}
                <div className="md:col-span-2 flex flex-col justify-center">
                  <h2 className="text-5xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                    {isModuleCompleted ? "✨ Selesai!" : "🚀 Hampir Selesai!"}
                  </h2>
                  <p className="text-lg text-purple-100/90 mb-8 leading-relaxed max-w-xl">
                    {isModuleCompleted
                      ? "Anda telah menguasai rangkaian seri dengan sempurna. Sekarang Anda memahami bagaimana komponen bekerja berurutan!"
                      : "Anda telah menyelesaikan semua 7 section. Tandai modul ini sebagai selesai untuk melanjutkan!"}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-black text-purple-400">7</div>
                      <p className="text-xs text-purple-300 font-semibold mt-1">Sections</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-pink-400">100%</div>
                      <p className="text-xs text-pink-300 font-semibold mt-1">Selesai</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-purple-300">✓</div>
                      <p className="text-xs text-purple-200 font-semibold mt-1">Terpahami</p>
                    </div>
                  </div>
                </div>

                {/* Right: Visual Status */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl border-2 transition-all duration-1000 ${
                    isModuleCompleted
                      ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-purple-400/30"
                      : "bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-purple-400/50 shadow-purple-400/30"
                  }`}>
                    {isModuleCompleted ? (
                      <Trophy className="w-16 h-16 text-purple-300 fill-purple-300" />
                    ) : (
                      <CheckCircle className="w-16 h-16 text-purple-300" />
                    )}
                  </div>
                  <p className="text-sm font-bold tracking-widest text-purple-300">
                    {isModuleCompleted ? "ACHIEVEMENT" : "DALAM PROGRESS"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-end">
                {!isModuleCompleted && (
                  <button
                    onClick={() => {
                      setIsModuleCompleted(true);
                      if (onMarkComplete) onMarkComplete();
                    }}
                    className="group flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl border border-purple-300/30"
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
        </div>
      </div>

      {/* Footer */}
      <div className="relative bg-slate-950 py-12 px-6 text-center border-t border-white/10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-purple-400" />
          <p className="text-xl font-black text-white">CIRVIA</p>
        </div>
        <p className="text-purple-200 text-base mb-2">
          Platform Pembelajaran Rangkaian Listrik Interaktif
        </p>
        <p className="text-purple-400/60 text-sm">© 2025 CIRVIA. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ModuleSeriesPageNew;
