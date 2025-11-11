"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle, Trophy, Star, Zap, Lightbulb, Info, Home, Activity, TrendingUp, GitBranch, Calculator, Clock, Play, Pause } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Audio timestamps untuk auto-scroll (dalam detik)
const AUDIO_TIMESTAMPS = {
  section1Start: 20,
  section2Start: 144,
  section3Start: 300,
  section4Start: 420,
  section5Start: 628,
  section6Start: 680,
  section7Start: 765,
  completion: 938
};

interface ModuleParallelPageProps {
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
        // Jika belum pernah diputar, mulai dari detik 0
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
      {/* Audio Element - Hidden - Using Supabase Storage */}
      <audio
        ref={audioRef}
        src="https://hczgbjgcolqxejtmaffn.supabase.co/storage/v1/object/public/audio-materials/modul-paralel.mp3"
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
                    audioRef.current.currentTime = 20;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-300 transition-all"
              >
                S1 (0:20)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 144;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg text-cyan-300 transition-all"
              >
                S2 (2:24)
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
                    audioRef.current.currentTime = 420;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-yellow-500/20 hover:bg-yellow-500/40 rounded-lg text-yellow-300 transition-all"
              >
                S4 (7:00)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 628;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-orange-500/20 hover:bg-orange-500/40 rounded-lg text-orange-300 transition-all"
              >
                S5 (10:28)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 680;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-pink-500/20 hover:bg-pink-500/40 rounded-lg text-pink-300 transition-all"
              >
                S6 (11:20)
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 765;
                    setIsPlaying(true);
                    audioRef.current.play();
                  }
                }}
                className="text-xs py-1.5 px-2 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg text-purple-300 transition-all"
              >
                S7 (12:45)
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

// Section 1: Pengenalan Rangkaian Paralel
const Section1Introduction = () => {
  const [activeLamps, setActiveLamps] = useState<Set<number>>(new Set([1, 2, 3]));
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => (prev + 16) % 2000);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const toggleLamp = (branchId: number) => {
    const newLamps = new Set(activeLamps);
    if (newLamps.has(branchId)) {
      newLamps.delete(branchId);
    } else {
      newLamps.add(branchId);
    }
    setActiveLamps(newLamps);
  };

  const branches = [
    { id: 1, color: "from-blue-400 to-blue-600", label: "Cabang 1" },
    { id: 2, color: "from-green-400 to-green-600", label: "Cabang 2" },
    { id: 3, color: "from-red-400 to-red-600", label: "Cabang 3" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Left: Text Content */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-12 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full"></div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            Apa itu Rangkaian Paralel?
          </h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Bayangkan kamu menyalakan tiga lampu kecil dengan satu baterai. Namun kali ini, setiap lampu punya jalur sendiri menuju baterai.
          </p>
          <p className="text-lg text-slate-200 leading-relaxed">
            Dari kutub positif baterai, kabel bercabang menjadi tiga — masing-masing menuju satu lampu — lalu kembali bergabung ke kutub negatif baterai. <span className="font-bold text-green-400">Inilah yang disebut rangkaian paralel</span>.
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm hover:border-green-400/60 transition-all duration-300">
          <h3 className="font-bold text-green-300 mb-3 flex items-center gap-2">
            <span className="text-xl">📌</span>
            Definisi:
          </h3>
          <p className="text-green-200 font-semibold">
            Rangkaian listrik paralel adalah jenis susunan komponen listrik di mana terdapat lebih dari satu jalur untuk arus listrik mengalir.
          </p>
          <p className="text-green-200 text-sm mt-3">
            ⚡ Jika salah satu jalur terputus, arus di jalur lain tetap mengalir. Lampu lainnya tetap menyala!
          </p>
        </div>
      </div>

      {/* Right: Interactive Visual */}
      <div className="space-y-6">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
          
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-400/30 p-8 shadow-2xl">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              <defs>
                <filter id="glow-parallel">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Electrons flowing through parallel branches */}
              {activeLamps.size > 0 && [0, 1, 2, 3].map((i) => {
                const offset = (animationTime + i * 750) % 3000;
                let ex, ey;
                
                // Get which branch this electron should follow based on active lamps
                const activeBranchIds = Array.from(activeLamps).sort();
                const branchId = activeBranchIds[i % activeBranchIds.length];
                
                // Path segments: 
                // Segment 1: Battery to top (y=100) - vertical at x=100
                // Segment 2: Top to lamp (x varies, stays at y=100)
                // Segment 3: Lamp down (x constant, y goes from 100 to 400)
                // Segment 4: Ground horizontal back to x=100 (y=400)
                // Segment 5: Up to battery (x=100, y from 400 to 250)
                
                if (branchId === 1) {
                  // L1 at x=250
                  if (offset < 750) {
                    // Battery (100,250) → top junction (100,100)
                    const t = offset / 750;
                    ex = 100;
                    ey = 250 - t * 150;
                  } else if (offset < 1500) {
                    // Top junction (100,100) → Lamp1 (250,100)
                    const t = (offset - 750) / 750;
                    ex = 100 + t * 150;
                    ey = 100;
                  } else if (offset < 2250) {
                    // Lamp1 (250,100) → down to ground (250,400)
                    const t = (offset - 1500) / 750;
                    ex = 250;
                    ey = 100 + t * 300;
                  } else {
                    // Ground (250,400) → left to (100,400)
                    const t = (offset - 2250) / 750;
                    ex = 250 - t * 150;
                    ey = 400;
                  }
                }
                else if (branchId === 2) {
                  // L2 at x=350
                  if (offset < 750) {
                    // Battery (100,250) → top junction (100,100)
                    const t = offset / 750;
                    ex = 100;
                    ey = 250 - t * 150;
                  } else if (offset < 1500) {
                    // Top junction (100,100) → Lamp2 (350,100)
                    const t = (offset - 750) / 750;
                    ex = 100 + t * 250;
                    ey = 100;
                  } else if (offset < 2250) {
                    // Lamp2 (350,100) → down to ground (350,400)
                    const t = (offset - 1500) / 750;
                    ex = 350;
                    ey = 100 + t * 300;
                  } else {
                    // Ground (350,400) → left to (100,400)
                    const t = (offset - 2250) / 750;
                    ex = 350 - t * 250;
                    ey = 400;
                  }
                }
                else if (branchId === 3) {
                  // L3 at x=450
                  if (offset < 750) {
                    // Battery (100,250) → top junction (100,100)
                    const t = offset / 750;
                    ex = 100;
                    ey = 250 - t * 150;
                  } else if (offset < 1500) {
                    // Top junction (100,100) → Lamp3 (450,100)
                    const t = (offset - 750) / 750;
                    ex = 100 + t * 350;
                    ey = 100;
                  } else if (offset < 2250) {
                    // Lamp3 (450,100) → down to ground (450,400)
                    const t = (offset - 1500) / 750;
                    ex = 450;
                    ey = 100 + t * 300;
                  } else {
                    // Ground (450,400) → left to (100,400)
                    const t = (offset - 2250) / 750;
                    ex = 450 - t * 350;
                    ey = 400;
                  }
                }

                return (
                  <g key={`electron-branch-${i}`}>
                    <circle cx={ex} cy={ey} r="8" fill="rgba(255, 215, 0, 0.2)" filter="url(#glow-parallel)" />
                    <circle cx={ex} cy={ey} r="4" fill="rgba(255, 230, 0, 0.95)" filter="drop-shadow(0 0 3px rgba(255, 215, 0, 0.9))" />
                  </g>
                );
              })}

              {/* Battery */}
              <circle cx="100" cy="250" r="30" fill="none" stroke="rgba(255, 100, 100, 0.8)" strokeWidth="3" />
              <text x="100" y="265" textAnchor="middle" fill="rgba(255, 150, 150, 0.9)" fontSize="35" fontWeight="bold">🔋</text>

              {/* Main wire from battery up to top junction */}
              <line x1="100" y1="220" x2="100" y2="100" stroke={activeLamps.size > 0 ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />

              {/* Top horizontal wire connecting to all lamps */}
              <line x1="100" y1="100" x2="450" y2="100" stroke={activeLamps.size > 0 ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />

              {/* Branch 1 - Vertical down to L1 */}
              <line x1="250" y1="100" x2="250" y2="220" stroke={activeLamps.has(1) ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
              {/* Lamp 1 */}
              <g onClick={() => toggleLamp(1)} style={{ cursor: 'pointer' }}>
                <circle cx="250" cy="250" r="30" fill="none" stroke={activeLamps.has(1) ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.4)"} strokeWidth="3" />
                <text x="250" y="265" textAnchor="middle" fill={activeLamps.has(1) ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="35" fontWeight="bold">{activeLamps.has(1) ? "💡" : "🔌"}</text>
                {activeLamps.has(1) && (
                  <circle cx="250" cy="250" r="36" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2">
                    <animate attributeName="r" from="36" to="50" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
              {/* Wire from lamp 1 down to ground */}
              <line x1="250" y1="280" x2="250" y2="400" stroke={activeLamps.has(1) ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />

              {/* Branch 2 - Vertical down to L2 */}
              <line x1="350" y1="100" x2="350" y2="220" stroke={activeLamps.has(2) ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
              {/* Lamp 2 */}
              <g onClick={() => toggleLamp(2)} style={{ cursor: 'pointer' }}>
                <circle cx="350" cy="250" r="30" fill="none" stroke={activeLamps.has(2) ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.4)"} strokeWidth="3" />
                <text x="350" y="265" textAnchor="middle" fill={activeLamps.has(2) ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="35" fontWeight="bold">{activeLamps.has(2) ? "💡" : "🔌"}</text>
                {activeLamps.has(2) && (
                  <circle cx="350" cy="250" r="36" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2">
                    <animate attributeName="r" from="36" to="50" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
              {/* Wire from lamp 2 down to ground */}
              <line x1="350" y1="280" x2="350" y2="400" stroke={activeLamps.has(2) ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />

              {/* Branch 3 - Vertical down to L3 */}
              <line x1="450" y1="100" x2="450" y2="220" stroke={activeLamps.has(3) ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
              {/* Lamp 3 */}
              <g onClick={() => toggleLamp(3)} style={{ cursor: 'pointer' }}>
                <circle cx="450" cy="250" r="30" fill="none" stroke={activeLamps.has(3) ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.4)"} strokeWidth="3" />
                <text x="450" y="265" textAnchor="middle" fill={activeLamps.has(3) ? "rgba(255, 215, 0, 0.9)" : "rgba(100, 100, 100, 0.5)"} fontSize="35" fontWeight="bold">{activeLamps.has(3) ? "💡" : "🔌"}</text>
                {activeLamps.has(3) && (
                  <circle cx="450" cy="250" r="36" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="2">
                    <animate attributeName="r" from="36" to="50" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
              {/* Wire from lamp 3 down to ground */}
              <line x1="450" y1="280" x2="450" y2="400" stroke={activeLamps.has(3) ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />

              {/* Ground return wire - bottom horizontal connecting all ground returns */}
              <line x1="100" y1="400" x2="450" y2="400" stroke={activeLamps.size > 0 ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />

              {/* Return wire from ground back to battery */}
              <line x1="100" y1="400" x2="100" y2="280" stroke={activeLamps.size > 0 ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 100, 100, 0.5)"} strokeWidth="4" />
            </svg>

            {/* Info Box */}
            <div className={`rounded-lg p-4 transition-all -mt-8 bg-green-500/20 border border-green-400/50 text-green-200`}>
              <p className="text-sm font-semibold text-center">
                {activeLamps.size === 3 
                  ? "✓ Ketiga cabang aktif - Rangkaian paralel tertutup" 
                  : activeLamps.size === 0
                  ? "❌ Semua lampu mati - Buka lampu untuk mengaktifkan rangkaian"
                  : `✓ ${activeLamps.size} dari 3 cabang aktif - Cabang lain tetap bisa hidup/mati independen!`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30">
          <h3 className="text-xl font-bold text-green-300 mb-3">🎮 Interaktif Demo:</h3>
          <ul className="space-y-2 text-green-200 text-sm">
            <li>✅ <strong>Ketiga lampu menyala</strong> saat rangkaian tertutup</li>
            <li>⚡ <strong>Lihat aliran elektron</strong> (titik kuning) mengalir di setiap cabang yang aktif</li>
            <li>💡 <strong>Klik lampu untuk hidup/matikan</strong> secara independen</li>
            <li>✨ <strong>Setiap lampu bisa hidup/mati bebas</strong> - Lampu lain tetap berfungsi karena memiliki jalur terpisah!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Section 2: Arus dalam Rangkaian Paralel
const Section2Current = () => {
  const [animationTime, setAnimationTime] = useState(0);
  const [branchCount, setBranchCount] = useState(3); // Tambah state untuk jumlah cabang
  const lastBranchX = [150, 400, 650][branchCount - 1];
  
  // Total current dari sumber: 6A
  const I_total = 6;
  
  // Distribusi arus berdasarkan hambatan masing-masing cabang
  // Asumsikan: T1 = 6Ω, T2 = 4Ω, T3 = 12Ω (V = 12V)
  const resistances = [
    { branch: 1, R: 6, color: "text-blue-300" },
    { branch: 2, R: 4, color: "text-green-300" },
    { branch: 3, R: 12, color: "text-red-300" },
  ];
  
  // Hitung arus per cabang menggunakan V/R (V=12V)
  const V = 12; // Voltage dari sumber
  const currentPerBranch = resistances.slice(0, branchCount).map(r => ({
    branch: r.branch,
    I: parseFloat((V / r.R).toFixed(2)),
    R: r.R,
    color: r.color,
  }));
  
  // Total arus yang harus sama (untuk validasi)
  const I_calculated = parseFloat(currentPerBranch.reduce((sum, c) => sum + c.I, 0).toFixed(2));

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => (prev + 16) % 4000); // 4000ms cycle dengan mobil
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Distribusi mobil berdasarkan branchCount
  const getCars = () => {
    const allCars = [
      { id: 0, branch: 1, offset: 0 },    // T1 - mobil pertama
      { id: 1, branch: 1, offset: 1200 }, // T1 - mobil kedua (spacing)
      { id: 2, branch: 2, offset: 300 },  // T2 - mobil pertama
      { id: 3, branch: 2, offset: 1200 }, // T2 - mobil kedua
      { id: 4, branch: 2, offset: 2200 }, // T2 - mobil ketiga
      { id: 5, branch: 3, offset: 500 },  // T3 - mobil satu-satunya
    ];
    // Filter mobil sesuai branchCount
    return allCars.filter(car => car.branch <= branchCount);
  };

  const cars = getCars();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Right: Text Content */}
      <div className="space-y-6 lg:order-2">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            Arus dalam Rangkaian Paralel
          </h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Arus di setiap cabang bisa berbeda-beda, tergantung besar hambatan di cabang tersebut. Tetapi <span className="font-bold text-cyan-400">jumlah total arus yang masuk = jumlah arus yang keluar</span>.
            <br /><br /><span className="font-bold text-cyan-400">Jumlah Arus terbagi di setiap cabang, sehingga setiap arus untuk setiap cabang harus dijumlahkan.</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/30 backdrop-blur-sm hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
          <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
            <span className="text-xl">📐</span>
            Rumus:
          </h3>
          <p className="text-blue-200 font-mono text-lg font-bold">
            I<sub>tot</sub> = I₁ + I₂ + I₃ + ...
          </p>
          <p className="text-blue-200 text-sm mt-3">
            Total arus = Jumlah arus di semua cabang
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-400/30 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
          <h3 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
            <span className="text-xl">🚗</span>
            Analogi Terowongan:
          </h3>
          <p className="text-cyan-200 text-sm leading-relaxed mb-4">
            Bayangkan jalan utama yang bercabang menjadi <span className="font-bold">tiga terowongan</span>. Setiap terowongan bisa punya jumlah mobil berbeda, tapi semua mobil dari ketiga terowongan kembali bergabung di ujung.
          </p>
          <p className="text-cyan-200 text-sm leading-relaxed font-semibold">
            ✨ <span className="text-yellow-300">Total mobil yang kembali = jumlah mobil di semua terowongan!</span>
          </p>
        </div>
      </div>
      {/* Right: Interactive Visual */}
      <div className="space-y-6 lg:order-1">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
          
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-400/30 p-8 shadow-2xl">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Lintasan Tertutup - Rangkaian Paralel dengan Mobil */}
              
              {/* Baterai Positif (+) - Kiri Atas */}
              <circle cx="50" cy="250" r="18" fill="none" stroke="rgba(255, 200, 0, 0.8)" strokeWidth="3" />
              <text x="50" y="250" textAnchor="middle" fill="rgba(255, 200, 0, 0.9)" fontSize="20" fontWeight="bold">+</text>
              {/* Baterai Negatif (-) - Kiri Bawah */}
              <text x="50" y="265" textAnchor="middle" fill="rgba(255, 200, 0, 0.9)" fontSize="20" fontWeight="bold">-</text>
              
              {/* Lintasan Atas (dari + ke kanan) */}
              <line x1="50" y1="100" x2={lastBranchX} y2="100" stroke="rgba(255, 200, 0, 0.7)" strokeWidth="10" />
              {/* lintassaan ke atas */}
              <line x1="50" y1="235" x2="50" y2="96" stroke="rgba(255, 150, 0, 0.7)" strokeWidth="10" />
              
              {/* Lintasan Bawah (dari terowongan ke -) */}
              <line x1={lastBranchX} y1="400" x2="50" y2="400" stroke="rgba(255, 150, 0, 0.7)" strokeWidth="10" />
              <line x1="50" y1="404" x2="50" y2="265" stroke="rgba(255, 150, 0, 0.7)" strokeWidth="10" />
              
              
              {/* Dynamic Terowongan based on branchCount */}
              {[...Array(branchCount)].map((_, idx) => {
                const positions = [
                  { x: 150, color: "rgba(100, 150, 255, 0.7)", label: "T1" },
                  { x: 400, color: "rgba(100, 200, 100, 0.7)", label: "T2" },
                  { x: 650, color: "rgba(255, 100, 100, 0.7)", label: "T3" },
                ];
                const pos = positions[idx];
                const branchCurrent = currentPerBranch[idx]?.I || 0;
                
                return (
                  <g key={`tunnel-${idx}`}>
                    {/* Vertical line down */}
                    <line x1={pos.x} y1="100" x2={pos.x} y2="150" stroke={pos.color} strokeWidth="8" />
                    
                    {/* Terowongan rectangle */}
                    <rect x={pos.x - 50} y="150" width="100" height="60" fill="none" stroke={pos.color} strokeWidth="8" rx="5" />
                    <text x={pos.x} y="190" textAnchor="middle" fill={pos.color} fontSize="12" fontWeight="bold">{pos.label}</text>
                    
                    {/* Vertical line up */}
                    <line x1={pos.x} y1="210" x2={pos.x} y2="400" stroke={pos.color} strokeWidth="8" />
                    
                    {/* Arus label - Dynamic */}
                    <text x={pos.x + 30} y="250" fill={pos.color} fontSize="20" fontWeight="bold" textAnchor="start">
                      I{idx + 1}: {branchCurrent}A
                    </text>
                    
                    {/* Hambatan label - Dynamic */}
                    <text x={pos.x + 30} y="270" fill={pos.color} fontSize="16" fontWeight="bold" textAnchor="start">
                      R{idx + 1}: {currentPerBranch[idx]?.R}Ω
                    </text>
                  </g>
                );
              })}
              
              {/* Animated cars */}
              {cars.map((car) => {
                const offset = (animationTime + car.offset) % 4000;
                const positions = [
                  { x: 150, color: "rgba(100, 150, 255, 0.9)" },  // T1
                  { x: 400, color: "rgba(100, 200, 100, 0.9)" },  // T2
                  { x: 650, color: "rgba(255, 100, 100, 0.9)" },  // T3
                ];
                const pos = positions[car.branch - 1];
                
                let cx = 50, cy = 100; // Start from + circle
                
                // Animation path (4000ms cycle) - Loop tertutup dari circle
                // Circle +: (50, 100) / Circle -: (50, 400)
                // Terowongan: atas y=150, bawah y=400, x = 150/400/650
                
                if (offset < 300) {
                  // Segment 1: Dari circle + ke terowongan (naik ke lintasan atas)
                  const t = offset / 300;
                  cx = 50 + t * (pos.x - 50);
                  cy = 100;
                } else if (offset < 1200) {
                  // Segment 2: Turun melalui terowongan (dari y=150 ke y=400)
                  const t = (offset - 300) / 900;
                  cx = pos.x;
                  cy = 150 + t * 250;
                } else if (offset < 1700) {
                  // Segment 3: Dari terowongan ke lintasan bawah (kembali dari terowongan)
                  const t = (offset - 1200) / 500;
                  cx = pos.x - t * (pos.x - 50);
                  cy = 400;
                } else if (offset < 2200) {
                  // Segment 4: Di lintasan bawah menuju circle - (pause dan bersiap)
                  // Sudah di circle -, tunggu untuk naik kembali ke circle +
                  cx = 50;
                  cy = 400;
                } else if (offset < 2800) {
                  // Segment 5: Dari circle - naik ke circle +
                  const t = (offset - 2200) / 600;
                  cx = 50;
                  cy = 400 - t * 300;
                } else {
                  // Segment 6: Di circle +, siap untuk cycle berikutnya
                  cx = 50;
                  cy = 100;
                }
                
                return (
                  <g key={`car-${car.id}`}>
                    {/* Mobil yang lebih besar: rect 24x16 */}
                    <rect x={cx - 12} y={cy - 8} width="24" height="16" fill={pos.color} rx="3" />
                    {/* Roda yang lebih besar */}
                    <circle cx={cx - 6} cy={cy + 6} r="3" fill="rgba(0, 0, 0, 0.8)" />
                    <circle cx={cx + 6} cy={cy + 6} r="3" fill="rgba(0, 0, 0, 0.8)" />
                    {/* Jendela */}
                    <rect x={cx - 8} y={cy - 5} width="8" height="6" fill="rgba(255, 255, 255, 0.3)" rx="1" />
                  </g>
                );
              })}
            </svg>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/30">
              <h3 className="text-xl font-bold text-blue-300 mb-3">🎮 Analisis Distribusi Arus:</h3>
              <div className="space-y-2 text-blue-200 text-sm">
                <p className="font-semibold text-cyan-300 mb-3">⚡ Perhitungan Arus (V = {V}V).<br/>Arus mengalir ke {branchCount} cabang dengan resistansi berbeda:</p>
                {currentPerBranch.map((data, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded border border-slate-700/50">
                    <span>
                      <strong className={data.color}>T{data.branch}:</strong> R = {data.R}Ω → I = I = V/R → {V}V ÷ {data.R}Ω
                    </span>
                    <span className={`font-bold text-base ${data.color}`}>{data.I}A</span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-600/40 to-cyan-600/40 px-3 py-2 rounded border border-blue-400/60 mt-3 font-bold">
                  <span className="text-yellow-300">✨ Total arus yang mengalir:</span>
                  <span className="text-yellow-300 text-lg">{I_calculated}A</span>
                </div>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600 mt-5">
              <label className="text-orange-200 font-bold text-sm block mb-4">Klik tombol untuk menambah/mengurangi cabang:</label>
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBranchCount(num)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-110 ${
                      branchCount === num
                        ? "bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                        : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    }`}
                  >
                    {num} Cabang
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 3: Tegangan dalam Rangkaian Paralel
const Section3Voltage = () => {
  const [branchCount, setBranchCount] = useState(3);
  const totalVoltage = 12;
  const lastBranchX = [150, 400, 650][branchCount - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Left: Visual */}
      <div className="relative group lg:order-2">
        <div className="absolute -inset-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-400/30 p-8 shadow-2xl">
          <svg className="w-full h-full" viewBox="0 0 800 500">
            {/* Lintasan Tegangan - Rangkaian Paralel */}
            
            
            {/* Baterai Positif (+) - Kiri Atas */}
            <circle cx="50" cy="230" r="18" fill="none" stroke="rgba(255, 200, 0, 0.8)" strokeWidth="3" />
            <text x="80" y="270" textAnchor="middle" fill="rgba(255, 200, 0, 0.9)" fontSize="20" fontWeight="bold">12V</text>
            <text x="50" y="230" textAnchor="middle" fill="rgba(255, 200, 0, 0.9)" fontSize="20" fontWeight="bold">+</text>
            {/* Baterai Negatif (-) - Kiri Bawah */}
            <text x="50" y="245" textAnchor="middle" fill="rgba(255, 200, 0, 0.9)" fontSize="20" fontWeight="bold">-</text>

            <line x1="50" y1="350" x2="50" y2="245" stroke="rgba(255, 150, 0, 0.7)" strokeWidth="10" />
            <line x1="50" y1="100" x2="50" y2="215" stroke="rgba(255, 150, 0, 0.7)" strokeWidth="10" />
              
            
            {/* Lintasan Atas (dari + ke kanan) */}
            <line x1="50" y1="100" x2={lastBranchX} y2="100" stroke="rgba(255, 200, 0, 0.7)" strokeWidth="10" />
            
            {/* Lintasan Bawah (dari terowongan ke -) */}
            <line x1={lastBranchX} y1="350" x2="50" y2="350" stroke="rgba(255, 150, 0, 0.7)" strokeWidth="10" />
            
            {/* Dynamic Terowongan based on branchCount */}
            {[...Array(branchCount)].map((_, idx) => {
              const positions = [
                { x: 150, color: "rgba(100, 150, 255, 0.7)", label: "T1", voltmeterX: 115 },
                { x: 400, color: "rgba(100, 200, 100, 0.7)", label: "T2", voltmeterX: 365 },
                { x: 650, color: "rgba(255, 100, 100, 0.7)", label: "T3", voltmeterX: 615 },
              ];
              const pos = positions[idx];
              
              return (
                <g key={`branch-${idx}`}>
                  {/* Vertical line down */}
                  <line x1={pos.x} y1="100" x2={pos.x} y2="150" stroke={pos.color} strokeWidth="8" />
                  
                  {/* Terowongan rectangle */}
                  <rect x={pos.x - 50} y="150" width="100" height="60" fill="none" stroke={pos.color} strokeWidth="8" rx="5" />
                  <text x={pos.x} y="190" textAnchor="middle" fill={pos.color} fontSize="12" fontWeight="bold">{pos.label}</text>
                  
                  {/* Vertical line up */}
                  <line x1={pos.x} y1="210" x2={pos.x} y2="350" stroke={pos.color} strokeWidth="8" />
                  
                  {/* Tegangan label */}
                  <text x={pos.x + 30} y="250" fill={pos.color} fontSize="20" fontWeight="bold" textAnchor="start">
                    12V
                  </text>
                  
                  {/* Voltmeter Indicator Lines */}
                  <line x1={pos.voltmeterX} y1="150" x2={pos.voltmeterX} y2="210" stroke={pos.color.replace("0.7", "0.5")} strokeWidth="2" strokeDasharray="5,5" />
                  <circle cx={pos.voltmeterX} cy="150" r="3" fill={pos.color.replace("0.7", "0.8")} />
                  <circle cx={pos.voltmeterX} cy="210" r="3" fill={pos.color.replace("0.7", "0.8")} />
                  {/* Voltage bar */}
                  <rect x={pos.voltmeterX + 10} y="160" width="15" height="40" fill="none" stroke={pos.color.replace("0.7", "0.6")} strokeWidth="2" />
                  <rect x={pos.voltmeterX + 10} y="160" width="15" height="40" fill={pos.color.replace("0.7", "0.4")} />
                </g>
              );
            })}
          </svg>

          {/* Info Box - Dynamic */}
          <div className="mt-6 bg-green-900/30 rounded-lg p-4 border border-green-400/50">
            <p className="text-green-200 font-semibold text-center text-sm">
              ⚡ Tegangan Sama | {branchCount >= 1 && <span className="text-blue-300">T1: 12V</span>} {branchCount >= 2 && <span className="text-green-300">T2: 12V</span>} {branchCount >= 3 && <span className="text-red-300">T3: 12V</span>}
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600 mt-5">
            <label className="text-orange-200 font-bold text-sm block mb-4">Klik tombol untuk menambah/mengurangi cabang:</label>
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setBranchCount(num)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-110 ${
                    branchCount === num
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50"
                      : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  }`}
                >
                  {num} Cabang
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Text Content */}
      <div className="space-y-6 lg:order-1">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-12 bg-gradient-to-b from-emerald-400 to-green-400 rounded-full"></div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            Tegangan dalam Rangkaian Paralel
          </h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Meskipun arusnya terbagi, tegangan pada setiap cabang paralel adalah <span className="font-bold text-green-400">sama besar</span>.
          </p>
          <p className="text-lg text-slate-200 leading-relaxed">
            Artinya, setiap terowongan &quot;merasakan&quot; tegangan yang sama dari sumber! Semua cabang terhubung langsung ke kutub positif dan negatif baterai.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
          <h3 className="font-bold text-green-300 mb-3 flex items-center gap-2">
            <span className="text-xl">📐</span>
            Rumus:
          </h3>
          <p className="text-green-200 font-mono text-lg font-bold">
            V<sub>tot</sub> = V₁ = V₂ = V₃ = 12V
          </p>
          <p className="text-green-200 text-sm mt-3">
            Tegangan sama di semua cabang!
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-500/10 to-green-500/10 rounded-2xl p-6 border border-teal-400/30 backdrop-blur-sm hover:border-teal-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20">
          <h3 className="font-bold text-teal-300 mb-3 flex items-center gap-2">
            <span className="text-xl">🚙</span>
            Analogi Terowongan:
          </h3>
          <p className="text-teal-200 text-sm leading-relaxed">
            Ada tiga terowongan sejajar yang semuanya berawal dari jalan utama dan berakhir di tempat yang sama. Mobil merasakan tenaga mesin (tegangan) yang sama — karena semua terhubung ke sumber tenaga yang sama.
          </p>
        </div>
      </div>
    </div>
  );
};

// Section 4: Hambatan dalam Rangkaian Paralel
const Section4Resistance = () => {
  const [branchCount, setBranchCount] = useState(3);
  const [animationTime, setAnimationTime] = useState(0);
  const R = 6; // Each branch has 6Ω
  const R_total = Math.round((R / branchCount) * 100) / 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => (prev + 16) % 5000); // 5000ms cycle
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Menentukan jumlah dan offset mobil berdasarkan jumlah cabang
  const getCarDistribution = () => {
    const distributions: { [key: number]: Array<{ id: number; branch: number; offset: number }> } = {
      1: [
        { id: 0, branch: 1, offset: 0 },
      ],
      2: [
        { id: 0, branch: 1, offset: 0 },
        { id: 1, branch: 2, offset: 500 },
      ],
      3: [
        { id: 0, branch: 1, offset: 0 },
        { id: 1, branch: 2, offset: 500 },
        { id: 2, branch: 3, offset: 1000 },
      ],
      4: [
        { id: 0, branch: 1, offset: 0 },
        { id: 1, branch: 2, offset: 400 },
        { id: 2, branch: 3, offset: 800 },
        { id: 3, branch: 4, offset: 1200 },
      ],
    };
    return distributions[branchCount] || distributions[3];
  };

  const cars = getCarDistribution();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Right: Text Content */}
      <div className="space-y-6 lg:order-2">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-12 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"></div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Hambatan dalam Rangkaian Paralel
          </h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Di rangkaian seri, menambah hambatan membuat arus makin kecil. Nah, di paralel, justru sebaliknya! <span className="font-bold text-orange-400">Semakin banyak cabang, hambatan total semakin kecil.</span>
          </p>
          <p className="text-lg text-slate-200 leading-relaxed">
            <span className="font-bold text-red-400">Semakin banyak cabang, semakin mudah arus mengalir</span> — seperti jalan terbagi lebih banyak jalur!
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-400/30 backdrop-blur-sm hover:border-orange-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
          <h3 className="font-bold text-orange-300 mb-3 flex items-center gap-2">
            <span className="text-xl">📐</span>
            Rumus Hambatan Paralel:
          </h3>
          <p className="text-orange-200 font-mono text-lg font-bold">
            1/R<sub>tot</sub> = 1/R₁ + 1/R₂ + 1/R₃
          </p>
          <p className="text-orange-200 text-sm mt-3">
            ⭐ Hambatan total <strong>lebih kecil</strong> dari hambatan terkecil!
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-6 border border-red-400/30 backdrop-blur-sm hover:border-red-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
          <h3 className="font-bold text-red-300 mb-3 flex items-center gap-2">
            <span className="text-xl">🚗</span>
            Analogi Terowongan:
          </h3>
          <p className="text-red-200 text-sm leading-relaxed mb-3">
            Bayangkan <strong>3 terowongan paralel</strong> yang sepi mobil. Tapi jika buka lebih banyak terowongan, lebih banyak mobil bisa lewat bersamaan. Hambatan berkurang, arus mengalir lebih lancar!
          </p>
          <p className="text-red-200 text-xs italic font-semibold">
            💡 Klik tombol di bawah → lihat hambatan total berkurang! ⬇
          </p>
        </div>
      </div>
            {/* Left: Visual */}
      <div className="relative group lg:order-1">
        <div className="absolute -inset-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-400/30 p-8 shadow-2xl">
          <svg className="w-full h-full" viewBox="0 0 800 500">
            {/* Lintasan Tertutup - Rangkaian Paralel dengan Hambatan Visual */}
            
            {/* Define posisi cabang berdasarkan branchCount */}
            {(() => {
              const branchPositions = [
                { x: 150, color: "rgba(100, 150, 255, 0.7)", label: "T1" },
                { x: 350, color: "rgba(100, 200, 100, 0.7)", label: "T2" },
                { x: 550, color: "rgba(255, 100, 100, 0.7)", label: "T3" },
                { x: 725, color: "rgba(200, 100, 255, 0.7)", label: "T4" },
              ];
              // Ambil posisi x dari cabang terakhir yang aktif
              const lastBranchX = branchPositions[branchCount - 1].x;
              
              return (
                <>
                  {/* Baterai Positif (+) - Kiri Atas */}
                  <circle cx="50" cy="250" r="18" fill="none" stroke="rgba(255, 200, 0, 0.8)" strokeWidth="3" />
                  <text x="50" y="250" textAnchor="middle" fill="rgba(255, 200, 0, 0.9)" fontSize="20" fontWeight="bold">+</text>           
                  {/* Baterai Negatif (-) - Kiri Bawah */}
                  <text x="50" y="265" textAnchor="middle" fill="rgba(255, 200, 0, 0.9)" fontSize="20" fontWeight="bold">-</text>
                  
                  <line x1="50" y1="230" x2="50" y2="95" stroke="rgba(255, 200, 0, 0.7)" strokeWidth="10" />
                  <line x1="50" y1="265" x2="50" y2="405" stroke="rgba(255, 200, 0, 0.7)" strokeWidth="10" />

                  {/* Lintasan Atas (dari + ke cabang terakhir) */}
                  <line x1="50" y1="100" x2={lastBranchX} y2="100" stroke="rgba(255, 200, 0, 0.7)" strokeWidth="10" />
                  
                  {/* Lintasan Bawah (dari cabang terakhir ke -) */}
                  <line x1={lastBranchX} y1="400" x2="50" y2="400" stroke="rgba(255, 150, 0, 0.7)" strokeWidth="10" />
                </>
              );
            })()}
            
            {/* Dynamic Terowongan based on branchCount - dengan visual hambatan */}
            {[...Array(branchCount)].map((_, idx) => {
              const positions = [
                { x: 150, color: "rgba(100, 150, 255, 0.7)", label: "T1" },
                { x: 350, color: "rgba(100, 200, 100, 0.7)", label: "T2" },
                { x: 550, color: "rgba(255, 100, 100, 0.7)", label: "T3" },
                { x: 725, color: "rgba(200, 100, 255, 0.7)", label: "T4" },
              ];
              const pos = positions[idx];
              
              return (
                <g key={`tunnel-${idx}`}>
                  {/* Vertical line down */}
                  <line x1={pos.x} y1="100" x2={pos.x} y2="140" stroke={pos.color} strokeWidth="8" />
                  
                  {/* Resistor symbol - zigzag (lebih kecil) */}
                  <polyline
                    points={`${pos.x - 12},150 ${pos.x - 8},156 ${pos.x - 4},150 ${pos.x},156 ${pos.x + 4},150 ${pos.x + 8},156 ${pos.x + 12},150`}
                    fill="none"
                    stroke={pos.color}
                    strokeWidth="3"
                  />
                  <text x={pos.x} y="175" textAnchor="middle" fill={pos.color} fontSize="9" fontWeight="bold">6Ω</text>
                  
                  {/* Tunnel container */}
                  <rect x={pos.x - 50} y="180" width="100" height="50" fill="none" stroke={pos.color} strokeWidth="6" rx="5" />
                  {/* Label */}
                  <text x={pos.x} y="212" textAnchor="middle" fill={pos.color} fontSize="11" fontWeight="bold">{pos.label}</text>
                  
                  {/* Vertical line up */}
                  <line x1={pos.x} y1="230" x2={pos.x} y2="400" stroke={pos.color} strokeWidth="8" />
                </g>
              );
            })}
            
            {/* Hambatan Total Display - menunjukkan visual perubahan hambatan */}
            <g>
              <text x="50%" y="30" textAnchor="middle" fill="rgba(255, 200, 0, 0.9)" fontSize="14" fontWeight="bold">
                R<tspan baseline-shift="super" fontSize="10">tot</tspan> = {R_total}Ω
              </text>
              {/* Visual hambatan bar - semakin banyak cabang, semakin pendek (hambatan berkurang) */}
              <line x1="300" y1="45" x2={300 + (R_total / 6) * 150} y2="45" stroke="rgba(255, 150, 0, 0.8)" strokeWidth="8" strokeLinecap="round" />
              <text x="300" y="60" fill="rgba(255, 150, 0, 0.7)" fontSize="10">hambatan total</text>
            </g>

            {/* Animated cars */}
            {cars.map((car) => {
              const offset = (animationTime + car.offset) % 4000;
              const positions = [
                { x: 150, color: "rgba(100, 150, 255, 0.9)" },
                { x: 350, color: "rgba(100, 200, 100, 0.9)" },
                { x: 550, color: "rgba(255, 100, 100, 0.9)" },
                { x: 725, color: "rgba(200, 100, 255, 0.9)" },
              ];
              const pos = positions[car.branch - 1];
              
              let cx = 50, cy = 100;
              
              // Animation path (4000ms cycle) - sama seperti Section 2
              if (offset < 300) {
                // Segment 1: Dari circle + ke terowongan (naik ke lintasan atas)
                const t = offset / 300;
                cx = 50 + t * (pos.x - 50);
                cy = 100;
              } else if (offset < 1200) {
                // Segment 2: Turun melalui terowongan
                const t = (offset - 300) / 900;
                cx = pos.x;
                cy = 180 + t * 220;
              } else if (offset < 1700) {
                // Segment 3: Keluar terowongan → lintasan bawah
                const t = (offset - 1200) / 500;
                cx = pos.x - t * (pos.x - 50);
                cy = 400;
              } else if (offset < 2200) {
                // Segment 4: Di circle -
                cx = 50;
                cy = 400;
              } else if (offset < 2800) {
                // Segment 5: Naik dari circle - ke circle +
                const t = (offset - 2200) / 600;
                cx = 50;
                cy = 400 - t * 300;
              } else {
                // Segment 6: Siap di circle +
                cx = 50;
                cy = 100;
              }
              
              return (
                <g key={`car-${car.id}`}>
                  {/* Mobil lebih besar */}
                  <rect x={cx - 12} y={cy - 8} width="24" height="16" fill={pos.color} rx="3" />
                  {/* Roda */}
                  <circle cx={cx - 6} cy={cy + 6} r="3" fill="rgba(0, 0, 0, 0.8)" />
                  <circle cx={cx + 6} cy={cy + 6} r="3" fill="rgba(0, 0, 0, 0.8)" />
                  {/* Jendela */}
                  <rect x={cx - 8} y={cy - 5} width="8" height="6" fill="rgba(255, 255, 255, 0.3)" rx="1" />
                </g>
              );
            })}
          </svg>

          {/* Info Boxes */}
          <div className="mt-6 space-y-3">
            <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-400/50">
              <p className="text-orange-200 font-semibold text-center text-sm">
                📊 Jumlah Cabang: {branchCount} | Hambatan Total: <span className="text-orange-300 font-bold">{R_total}Ω</span>
              </p>
            </div>
            <div className="bg-red-900/30 rounded-lg p-3 border border-red-400/50">
              <p className="text-red-200 text-xs font-mono mb-2 text-center">
                <span className="text-red-300 font-bold">1/R<sub>tot</sub> = 1/6</span>
                {branchCount > 1 && ` + 1/6`}
                {branchCount > 2 && ` + 1/6`}
                {branchCount > 3 && ` + 1/6`}
              </p>
              <p className="text-red-300 text-xs font-bold text-center">
                ⬇ R<sub>tot</sub> = {R_total}Ω ⬇
              </p>
              <p className="text-red-200 text-xs mt-2 text-center italic">
                Semakin banyak cabang, hambatan total semakin kecil!
              </p>
            </div>
            <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-400/50">
              <p className="text-amber-200 text-center text-xs">
                ✨ <span className="font-bold">Jalur bertambah</span> → hambatan menurun ↓ → arus meningkat ↑
              </p>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600 mt-5">
            <label className="text-orange-200 font-bold text-sm block mb-4">Klik tombol untuk menambah/mengurangi cabang:</label>
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setBranchCount(num)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-110 ${
                    branchCount === num
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                      : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  }`}
                >
                  {num} Cabang
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 5: Contoh Nyata - Stop Kontak
const Section5RealExample = () => {
  const [activeDevices, setActiveDevices] = useState<Set<string>>(new Set());
  
  const devices = [
    { id: "tv", name: "📺 TV", resistance: 220, color: "from-red-500 to-red-700", icon: "📺" },
    { id: "charger", name: "🔌 Charger", resistance: 220, color: "from-blue-500 to-blue-700", icon: "🔌" },
    { id: "fan", name: "🌀 Kipas", resistance: 440, color: "from-cyan-500 to-cyan-700", icon: "🌀" },
  ];

  const V_total = 220; // Tegangan PLN

  const toggleDevice = (deviceId: string) => {
    const newActive = new Set(activeDevices);
    if (newActive.has(deviceId)) {
      newActive.delete(deviceId);
    } else {
      newActive.add(deviceId);
    }
    setActiveDevices(newActive);
  };

  const getTotalCurrent = () => {
    let totalCurrent = 0;
    activeDevices.forEach(deviceId => {
      const device = devices.find(d => d.id === deviceId);
      if (device) {
        const I = V_total / device.resistance;
        totalCurrent += I;
      }
    });
    return totalCurrent.toFixed(2);
  };

  const getDevicesCurrent = () => {
    return Array.from(activeDevices).map((deviceId: string) => {
      const device = devices.find(d => d.id === deviceId);
      if (device) {
        return { deviceId, I: (V_total / device.resistance).toFixed(2) };
      }
      return null;
    }).filter(Boolean);
  };

  const activeCurrent = getTotalCurrent();
  const deviceCurrents = getDevicesCurrent();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      {/* Left: Text Content */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"></div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
            Contoh Nyata: Stop Kontak
          </h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            Di rumah Anda, stop kontak dengan 3 atau lebih colokan menggunakan prinsip rangkaian paralel. Setiap alat (TV, charger, kipas) tersambung ke jalur yang sama dari PLN, tapi masing-masing punya cabangnya sendiri.
          </p>
          <p className="text-lg text-slate-200 leading-relaxed">
            <span className="font-bold text-yellow-400">Keuntungannya:</span> Kalau Anda cabut charger, TV dan kipas tetap menyala! Atau hidupkan semuanya sekaligus untuk membagi arus.
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-6 border border-yellow-400/30">
          <h3 className="font-bold text-yellow-300 mb-3">🏠 Keunggulan Rangkaian Paralel:</h3>
          <ul className="space-y-2 text-yellow-200 text-sm">
            <li>✓ Tegangan penuh untuk setiap alat (220V)</li>
            <li>✓ Alat bisa dinyalakan/dimatikan terpisah</li>
            <li>✓ Jika satu rusak, yang lain tetap bekerja</li>
            <li>✓ Arus terbagi ke beberapa alat</li>
          </ul>
        </div>

        {/* Current Status Info */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-400/30">
          <h3 className="font-bold text-orange-300 mb-3">⚡ Status Saat Ini:</h3>
          <div className="space-y-2 text-orange-200 text-sm">
            <div className="flex justify-between">
              <span>Alat Aktif:</span>
              <span className="font-bold">{activeDevices.size} dari {devices.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Tegangan (V):</span>
              <span className="font-bold text-yellow-300">{V_total}V</span>
            </div>
            <div className="flex justify-between">
              <span>Arus Total:</span>
              <span className="font-bold text-yellow-300">{activeCurrent}A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Interactive Visual */}
      <div className="relative group">
        <div className="absolute -inset-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-yellow-400/30 p-8 shadow-2xl">
          {/* Power Source - PLN */}
          <div className="text-center mb-12">
            <div className="inline-block">
              <div className="w-20 h-32 bg-gradient-to-b from-red-500 to-red-700 rounded-lg border-4 border-red-600 flex flex-col items-center justify-center shadow-lg hover:shadow-red-500/50">
                <span className="text-white font-bold text-3xl">⚡</span>
                <span className="text-white text-xs font-bold mt-1">PLN</span>
              </div>
              <div className="text-xs font-bold text-yellow-300 mt-3">220V AC</div>
            </div>
          </div>

          {/* Kabel dari PLN ke Stop Kontak */}
          <div className="flex justify-center mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-red-500 to-yellow-500 rounded-full animate-pulse"></div>
          </div>

          {/* Stop Kontak dengan 3+ Lubang */}
          <div className="mb-8">
            <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-xl p-6 shadow-2xl border-4 border-amber-300">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {devices.map((device, idx) => (
                  <div key={device.id} className="flex flex-col items-center">
                    {/* Stop Kontak Lubang */}
                    <div className="relative mb-3">
                      {/* Frame stop kontak */}
                      <div className="w-24 h-32 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg border-2 border-yellow-400 flex flex-col items-center justify-center p-2 cursor-pointer transition-all transform hover:scale-105 relative"
                        onClick={() => toggleDevice(device.id)}
                      >
                        {/* Dua lubang stop kontak */}
                        <div className="flex gap-2 mb-2">
                          <div className="w-2 h-3 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-3 bg-gray-400 rounded-full"></div>
                        </div>
                        
                        {/* Indikator aktif */}
                        {activeDevices.has(device.id) && (
                          <div className="absolute inset-1 bg-yellow-300/30 rounded-lg animate-pulse border-2 border-yellow-400"></div>
                        )}
                        
                        {/* Icon alat */}
                        <div className="text-3xl mb-1">{device.icon}</div>
                        
                        {/* Status dan Arus */}
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-700">{device.name.split(" ")[1]}</p>
                          {activeDevices.has(device.id) && (
                            <p className="text-xs text-green-600 font-semibold">{(V_total / device.resistance).toFixed(2)}A</p>
                          )}
                        </div>

                        {/* Plug animation */}
                        {activeDevices.has(device.id) && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div className="flex gap-1">
                              <div className="w-1 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                              <div className="w-1 h-4 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Label dan Status */}
                    <button
                      onClick={() => toggleDevice(device.id)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                        activeDevices.has(device.id)
                          ? `bg-gradient-to-r ${device.color} text-white shadow-lg`
                          : "bg-gray-400 text-gray-700 hover:bg-gray-500"
                      }`}
                    >
                      {activeDevices.has(device.id) ? "✓ ON" : "OFF"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Ampere Rating */}
              <div className="text-center text-xs text-gray-600 font-bold border-t-2 border-yellow-300 pt-3">
                ⚡ Rated: 16A maksimal
              </div>
            </div>
          </div>

          {/* Status Arus */}
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-lg p-4 border border-yellow-400/60 space-y-3">
            {/* Total Current Display */}
            <div className="flex items-center justify-between">
              <span className="text-yellow-200 font-semibold text-sm">🔌 Arus Total:</span>
              <span className="text-yellow-300 font-bold text-lg">{activeCurrent}A</span>
            </div>

            {/* Active Devices List */}
            {activeDevices.size > 0 && (
              <div className="bg-black/30 rounded p-2 border border-yellow-400/40">
                <p className="text-yellow-200 text-xs font-semibold mb-2">Alat Aktif & Arus:</p>
                <div className="space-y-1">
                  {devices.map(device => {
                    if (activeDevices.has(device.id)) {
                      const I = (V_total / device.resistance).toFixed(2);
                      return (
                        <div key={device.id} className="flex justify-between text-xs bg-slate-700/50 px-2 py-1 rounded border border-yellow-400/30">
                          <span className="text-yellow-200">{device.name}</span>
                          <span className="text-yellow-300 font-bold">I = 220V ÷ {device.resistance}Ω = {I}A</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {activeDevices.size === 0 && (
              <div className="text-center text-yellow-300/70 text-sm font-semibold italic">
                💡 Klik stop kontak untuk menghubungkan alat
              </div>
            )}
          </div>

          {/* Info Text */}
          <div className="text-xs text-center text-slate-400 mt-4">
            ✅ Klík stop kontak untuk menyalakan/mematikan | 🎯 Bisa mengoperasikan semuanya sekaligus
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 6: Soal dan Perhitungan
const Section6Calculation = () => {
  const [resistorCount, setResistorCount] = useState(2);
  const [highlightResistor, setHighlightResistor] = useState<number | null>(null);
  
  const R1 = 6, R2 = 6;
  const V_total = 12;
  
  const resistors = [R1, R2].slice(0, resistorCount);
  const I1 = V_total / R1;
  const I2 = V_total / R2;
  const I_total = I1 + I2;
  
  const currents = resistors.map(r => V_total / r);

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
            <h3 className="text-xl font-bold text-cyan-300 mb-4">� Persoalan:</h3>
            <p className="text-slate-200 mb-4">
              Dua buah hambatan disusun paralel dan dihubungkan dengan baterai 12 V:
            </p>

            {/* Circuit Diagram */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-6 border border-cyan-500/20 mb-6 h-64 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                {/* Power line - left vertical */}
                <line x1="50" y1="50" x2="50" y2="150" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                
                {/* Battery */}
                <g>
                  <circle cx="50" cy="100" r="15" fill="none" stroke="rgba(255, 100, 100, 0.8)" strokeWidth="2" />
                  <text x="50" y="105" textAnchor="middle" fill="rgba(255, 100, 100, 0.9)" fontSize="18" fontWeight="bold">🔋</text>
                </g>

                {/* Top parallel line */}
                <line x1="50" y1="50" x2="400" y2="50" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                
                {/* Bottom parallel line */}
                <line x1="50" y1="150" x2="400" y2="150" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />

                {/* Vertical connectors to resistors */}
                <line x1="150" y1="50" x2="150" y2="70" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                <line x1="150" y1="130" x2="150" y2="150" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                
                <line x1="400" y1="50" x2="400" y2="70" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />
                <line x1="400" y1="130" x2="400" y2="150" stroke="rgba(255, 200, 0, 0.6)" strokeWidth="3" />

                {/* Draw resistors */}
                {resistors.map((r, i) => {
                  const xPos = 150 + i * 250;
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
                          y="80"
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
                          y="95"
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
                        y="120"
                        textAnchor="middle"
                        fill={isHighlighted ? "rgba(0, 255, 100, 0.9)" : "rgba(150, 200, 255, 0.7)"}
                        fontSize="13"
                        fontWeight="bold"
                      >
                        {r}Ω
                      </text>
                      
                      {/* Current label when highlighted */}
                      {isHighlighted && (
                        <text
                          x={xPos}
                          y="40"
                          textAnchor="middle"
                          fill="rgba(0, 255, 100, 0.9)"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          I{i + 1}={currents[i]}A
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            <ul className="text-slate-300 space-y-2 text-sm font-mono">
              <li>• R₁ = 6 Ω</li>
              <li>• R₂ = 6 Ω</li>
            </ul>
            <p className="text-cyan-200 font-bold mt-4 text-sm">Hitunglah:</p>
            <ul className="text-cyan-200 space-y-1 text-sm mt-2">
              <li>1. Tegangan pada masing-masing hambatan</li>
              <li>2. Arus pada masing-masing hambatan</li>
              <li>3. Arus total pada rangkaian</li>
              <li>4. Apa yang terjadi jika satu hambatan putus?</li>
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
                <p className="text-green-200 font-mono">V<sub>tot</sub> = V₁ = V₂ = <span className="font-bold text-green-300">{V_total} V</span></p>
                <p className="text-green-200 text-xs mt-1">Tegangan sama untuk semua cabang</p>
              </div>
              
              <div className="bg-cyan-500/10 border border-cyan-400/50 rounded p-3">
                <p className="text-cyan-200 font-mono text-xs">I₁ = V / R₁ = {V_total} / {R1} = <span className="font-bold text-cyan-300">{I1} A</span></p>
                <p className="text-cyan-200 font-mono text-xs">I₂ = V / R₂ = {V_total} / {R2} = <span className="font-bold text-cyan-300">{I2} A</span></p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-400/50 rounded p-3">
                <p className="text-yellow-200 font-mono">I<sub>tot</sub> = I₁ + I₂ = {I1} + {I2} = <span className="font-bold text-yellow-300">{I_total} A</span></p>
              </div>

              <div className="bg-purple-500/10 border border-purple-400/50 rounded p-3">
                <p className="text-purple-200 font-mono text-xs"><span className="font-bold">Jika satu hambatan putus:</span> Arus masih bisa lewat cabang lain ✓</p>
              </div>
            </div>
          </div>
        
        {/* Comparison: Effect of Branch Count */}
      <div className="relative group mt-5">
        <div className="absolute -inset-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-400/30 p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-orange-300 mb-4">📈 Dampak Jumlah Cabang terhadap Arus Total:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-500/10 border border-orange-400/50 rounded-lg p-4 text-center">
                  <p className="text-orange-300 font-bold mb-2">1 Cabang</p>
                  <p className="text-orange-200 font-mono font-bold text-lg">I = {I1.toFixed(2)} A</p>
                  <p className="text-orange-200/60 text-xs mt-2">Arus dari 1 cabang saja</p>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-400/50 rounded-lg p-4 text-center">
                  <p className="text-orange-300 font-bold mb-2">2 Cabang</p>
                  <p className="text-orange-200 font-mono font-bold text-lg">I = {I_total.toFixed(2)} A</p>
                  <p className="text-orange-200/60 text-xs mt-2">Arus bertambah!</p>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mt-4">
                <p className="text-red-200 font-semibold text-sm">
                  ⚡ <span className="font-bold">Kesimpulan:</span> Pada rangkaian paralel, semakin banyak cabang, hambatan total berkurang, sehingga arus total bertambah!
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
    { aspect: "Jalur Arus", paralel: "Lebih dari satu jalur (bercabang)", detail: "I_tot = I₁ + I₂ + I₃ + ...", icon: "🔀", color: "from-blue-500 to-cyan-500" },
    { aspect: "Tegangan (V)", paralel: "Sama di semua cabang", detail: "V = V₁ = V₂ = V₃ = ...", icon: "🔋", color: "from-green-500 to-emerald-500" },
    { aspect: "Hambatan (R)", paralel: "Lebih kecil dari terkecil", detail: "1/R_tot = 1/R₁ + 1/R₂ + ...", icon: "🌊", color: "from-orange-500 to-red-500" },
    { aspect: "Jika Rusak", paralel: "Cabang lain tetap bekerja", detail: "Independen dan redundan", icon: "✅", color: "from-purple-500 to-pink-500" },
    { aspect: "Contoh Nyata", paralel: "Stop kontak rumah, jalan raya", detail: "Instalasi listrik yang aman", icon: "🏠", color: "from-yellow-500 to-amber-500" },
  ];

  return (
    <div className="space-y-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg mb-4">
          🎓 Ringkasan: Ciri-Ciri Rangkaian Paralel
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
                {char.paralel}
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
                  { icon: "�", text: "Rangkaian paralel memiliki lebih dari satu jalur untuk arus mengalir" },
                  { icon: "⚡", text: "Arus terbagi di cabang, tetapi tegangan tetap sama di semua cabang" },
                  { icon: "📈", text: "Semakin banyak cabang, hambatan total semakin kecil, arus total meningkat" },
                  { icon: "✅", text: "Jika satu komponen rusak, komponen lain tetap bekerja dengan independen" },
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
                <p>I<sub>tot</sub> = I₁ + I₂ + I₃</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded border border-blue-400/30">
                <p>V = V₁ = V₂ = V₃</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded border border-blue-400/30">
                <p>1/R = 1/R₁ + 1/R₂ + 1/R₃</p>
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
                <th className="text-left py-3 px-4 text-green-300 font-bold">Rangkaian Paralel</th>
              </tr>
            </thead>
            <tbody>
              {[
                { char: "Jalur Arus", desc: "Lebih dari satu (bercabang)" },
                { char: "Arus (I)", desc: "Berbeda di setiap cabang" },
                { char: "Tegangan (V)", desc: "Sama di semua cabang" },
                { char: "Hambatan (R)", desc: "1/R_tot = Σ 1/R" },
                { char: "Jika Rusak", desc: "Yang lain tetap bekerja" },
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
const ModuleParallelPageNew = ({ isCompleted = false, onMarkComplete }: ModuleParallelPageProps) => {
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-ping"
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
      <div className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-ping"
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
                <span className="text-yellow-400 text-sm font-bold">Modul 3</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-emerald-200 via-teal-200 to-green-300 bg-clip-text text-transparent drop-shadow-2xl">
                Rangkaian Listrik Paralel
              </h1>
              <p className="text-lg text-emerald-200">Pelajari cara kerja komponen dalam jalur bercabang</p>
            </div>

            <div className="flex flex-col items-center px-6 py-4 rounded-2xl shadow-lg border border-white/20 backdrop-blur-xl bg-white/10">
              <Clock className="w-8 h-8 mb-2 text-emerald-300" />
              <span className="font-bold text-sm text-emerald-100">7 Sections</span>
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
          <div className="flex justify-center">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent w-32"></div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-full shadow-xl border border-white/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 2 */}
          <div ref={section2Ref}>
            <Section2Current />
          </div>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent w-32"></div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-full shadow-xl border border-white/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 3 */}
          <div ref={section3Ref}>
            <Section3Voltage />
          </div>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent w-32"></div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-full shadow-xl border border-white/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 4 */}
          <div ref={section4Ref}>
            <Section4Resistance />
          </div>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent w-32"></div>
              <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-3 rounded-full shadow-xl border border-white/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 5 */}
          <div ref={section5Ref}>
            <Section5RealExample />
          </div>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-32"></div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-full shadow-xl border border-white/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 6 */}
          <div ref={section6Ref}>
            <Section6Calculation />
          </div>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="flex items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent w-32"></div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full shadow-xl border border-white/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent w-32"></div>
            </div>
          </div>

          {/* Section 7 */}
          <div ref={section7Ref}>
            <Section7Summary />
          </div>
        </div>
      </div>

      {/* Completion Section - Extended dengan Footer */}
      <div className="relative text-white py-32 px-6 overflow-hidden mt-20 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }} ref={completionRef}>
        {/* Background yang sama dengan section */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950"></div>
        
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Completion Card */}
          <div className="group relative mb-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-emerald-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-slate-900/80 to-emerald-950/80 backdrop-blur-xl rounded-3xl border-2 border-emerald-400/30 p-12 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Main Message */}
                <div className="md:col-span-2 flex flex-col justify-center">
                  <h2 className="text-5xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
                    {isModuleCompleted ? "✨ Selesai!" : "🚀 Hampir Selesai!"}
                  </h2>
                  <p className="text-lg text-emerald-100/90 mb-8 leading-relaxed max-w-xl">
                    {isModuleCompleted
                      ? "Anda telah menguasai rangkaian paralel dengan sempurna. Sekarang Anda memahami bagaimana komponen bekerja independen!"
                      : "Anda telah menyelesaikan semua 7 section. Tandai modul ini sebagai selesai untuk melanjutkan!"}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-black text-emerald-400">7</div>
                      <p className="text-xs text-emerald-300 font-semibold mt-1">Sections</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-teal-400">100%</div>
                      <p className="text-xs text-teal-300 font-semibold mt-1">Selesai</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-emerald-300">✓</div>
                      <p className="text-xs text-emerald-200 font-semibold mt-1">Terpahami</p>
                    </div>
                  </div>
                </div>

                {/* Right: Visual Status */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl border-2 transition-all duration-1000 ${
                    isModuleCompleted
                      ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-400/50 shadow-emerald-400/30"
                      : "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-emerald-400/50 shadow-emerald-400/30"
                  }`}>
                    {isModuleCompleted ? (
                      <Trophy className="w-16 h-16 text-emerald-300 fill-emerald-300" />
                    ) : (
                      <CheckCircle className="w-16 h-16 text-emerald-300" />
                    )}
                  </div>
                  <p className="text-sm font-bold tracking-widest text-emerald-300">
                    {isModuleCompleted ? "ACHIEVEMENT" : "DALAM PROGRESS"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-end">
                {!isModuleCompleted && (
                  <button
                    onClick={() => {
                      setIsModuleCompleted(true);
                      if (onMarkComplete) onMarkComplete();
                    }}
                    className="group flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-2xl border border-emerald-300/30"
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

          {/* Footer Section - Integrated dengan theme emerald */}
          <Footer theme="emerald" />
        </div>
      </div>

      
    </div>
  );
};

export default ModuleParallelPageNew;