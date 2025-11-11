"use client";
import React, { useState } from 'react';
// import { useParams } from 'next/navigation';
import { CheckCircle, Clock, BookOpen, Volume2, Zap, ArrowLeft, ArrowRight, Play, Pause, SkipBack, SkipForward, Star, Trophy } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Supabase Storage configuration - OUTSIDE component to avoid re-creation
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hczgbjgcolqxejtmaffn.supabase.co';
const AUDIO_BUCKET = 'audio-materials';

// Mock Audio Player Component
interface AudioPlayerProps {
  title: string;
  description: string;
  chapters: { title: string; startTime: number; duration: number }[];
}
const AudioPlayer = ({ title, description, chapters }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Map title to actual audio file names in Supabase Storage
  const getAudioFileName = (title: string): string => {
    // Remove "Audio: " prefix if exists and convert to lowercase
    const titleLower = title.toLowerCase().replace(/^audio:\s*/i, '');
    
    // Mapping actual audio files in Supabase Storage bucket: audio-materials
    const audioMap: { [key: string]: string } = {
      'konsep dasar listrik': 'audio-konsep-dasar-listrik.mp3',
      'pengantar rangkaian listrik': 'modul-pengantar.mp3',
      'rangkaian seri': 'modul-seri.mp3',
      'rangkaian paralel': 'modul-paralel.mp3',
    };

    // Try exact match first
    for (const [key, fileName] of Object.entries(audioMap)) {
      if (titleLower.includes(key)) {
        console.log(`✅ Audio match found: "${key}" -> ${fileName}`);
        return fileName;
      }
    }

    // Fallback: generate from title with 'audio-' prefix
    const fallbackName = 'audio-' + titleLower.replace(/[^a-z0-9]+/g, '-') + '.mp3';
    console.warn(`⚠️ No audio match for "${titleLower}", using fallback: ${fallbackName}`);
    return fallbackName;
  };

  const audioFileName = getAudioFileName(title);
  
  // Use Supabase Storage URL instead of local public folder
  const [audioSrc, setAudioSrc] = React.useState('');

  // Set audio source only on client side
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use Supabase Storage URL (constants now outside component)
      const src = `${SUPABASE_URL}/storage/v1/object/public/${AUDIO_BUCKET}/${audioFileName}`;
      setAudioSrc(src);
      
      console.log('🎵 Audio Player Debug (Supabase):', {
        originalTitle: title,
        cleanedTitle: title.toLowerCase().replace(/^audio:\s*/i, ''),
        audioFileName,
        audioSrc: src,
        supabaseUrl: SUPABASE_URL,
        bucket: AUDIO_BUCKET,
        fullPath: src,
      });

      // Test if file exists by trying to fetch it
      fetch(src, { method: 'HEAD' })
        .then(res => {
          console.log('🔍 Audio file HEAD check (Supabase):', {
            url: src,
            status: res.status,
            contentType: res.headers.get('content-type'),
            contentLength: res.headers.get('content-length'),
            ok: res.ok
          });
        })
        .catch(err => {
          console.error('❌ Audio file HEAD check failed:', err);
        });
    }
  }, [title, audioFileName]); // Removed SUPABASE_URL and AUDIO_BUCKET from deps

  // Handle audio load error
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return; // Don't attach listeners if no source

    const handleLoadedData = () => {
      console.log('✅ Audio loaded successfully:', audioSrc);
      setAudioLoaded(true);
      setAudioError(false);
    };

    const handleCanPlayThrough = () => {
      console.log('✅ Audio can play through:', audioSrc);
      setAudioLoaded(true);
      setAudioError(false);
    };

    const handleError = (e: Event) => {
      const audio = audioRef.current;
      console.error('❌ Audio load error:', {
        audioSrc,
        error: e,
        audioElement: audio,
        networkState: audio?.networkState,
        readyState: audio?.readyState,
        currentSrc: audio?.currentSrc || 'no source',
        errorCode: (e.target as HTMLMediaElement)?.error?.code,
        errorMessage: (e.target as HTMLMediaElement)?.error?.message,
      });
      
      // Try to reload once if it's a network error
      if (audio && audio.networkState === 3) { // NETWORK_NO_SOURCE
        console.log('🔄 Attempting to reload audio...');
        setTimeout(() => {
          audio.load();
        }, 1000);
      } else {
        setAudioError(true);
        setAudioLoaded(false);
        setIsPlaying(false);
      }
    };

    const handleLoadStart = () => {
      console.log('⏳ Audio loading started:', audioSrc);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    // Force load
    audio.load();

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [audioSrc]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (!audioRef.current || audioError || !audioSrc) {
      console.warn('Cannot play: audio element not ready, has error, or no source', {
        hasAudioRef: !!audioRef.current,
        audioError,
        audioSrc
      });
      return;
    }
    
    const audio = audioRef.current;
    
    // Check if audio has a valid source
    if (!audio.src && !audio.currentSrc) {
      console.error('Audio element has no source!', {
        src: audio.src,
        currentSrc: audio.currentSrc,
        audioSrc
      });
      setAudioError(true);
      return;
    }
    
    // Check if audio source is valid before attempting to play
    if (audio.readyState === 0) {
      console.warn('Audio not ready yet, attempting to load...', {
        readyState: audio.readyState,
        networkState: audio.networkState
      });
      audio.load(); // Try to load
      // Wait a bit and try again
      setTimeout(() => {
        if (audio.readyState > 0) {
          handlePlayPause(); // Retry
        } else {
          setAudioError(true);
        }
      }, 500);
      return;
    }
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Set time before playing
      audio.currentTime = chapters[currentChapter]?.startTime || 0;
      
      // Try to play with proper error handling
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Audio playing successfully');
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('❌ Error playing audio:', {
              error: error.message,
              name: error.name,
              audioSrc,
              readyState: audio.readyState,
              networkState: audio.networkState,
              currentSrc: audio.currentSrc,
              src: audio.src
            });
            setAudioError(true);
            setIsPlaying(false);
          });
      }
    }
  };

  // Handle chapter change
  const handleChapterChange = (next: boolean) => {
    if (audioError) return;
    
    let newChapter = currentChapter + (next ? 1 : -1);
    if (newChapter < 0) newChapter = 0;
    if (newChapter > chapters.length - 1) newChapter = chapters.length - 1;
    setCurrentChapter(newChapter);
    if (audioRef.current) {
      audioRef.current.currentTime = chapters[newChapter]?.startTime || 0;
      if (isPlaying) {
        // Ensure audio source exists before playing
        if (!audioRef.current.src || audioRef.current.readyState === 0) {
          console.error('Cannot play: no valid audio source');
          setAudioError(true);
          setIsPlaying(false);
          return;
        }
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio on chapter change:', error);
          setAudioError(true);
          setIsPlaying(false);
        });
      }
    }
    setProgress(0);
  };

  // Update progress bar
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      const chapter = chapters[currentChapter];
      if (!chapter) return;
      const elapsed = audio.currentTime - chapter.startTime;
      const percent = Math.min(100, (elapsed / chapter.duration) * 100);
      setProgress(percent);
      // Auto next chapter
      if (percent >= 100) {
        setIsPlaying(false);
        setProgress(0);
      }
    };
    if (isPlaying) {
      audio.addEventListener('timeupdate', updateProgress);
    } else {
      audio.removeEventListener('timeupdate', updateProgress);
    }
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [isPlaying, currentChapter, chapters]);

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <p className="text-purple-200/80 text-sm">{description}</p>
        </div>
        <div className="text-2xl">🎧</div>
      </div>

      {/* Audio Element - Only render when source is ready */}
      {audioSrc && (
        <audio 
          ref={audioRef} 
          preload="metadata"
          onEnded={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('❌ Audio element error:', {
              error: e,
              src: audioSrc,
              currentSrc: audioRef.current?.currentSrc,
              networkState: audioRef.current?.networkState,
              readyState: audioRef.current?.readyState
            });
            setAudioError(true);
            setAudioLoaded(false);
            setIsPlaying(false);
          }}
          src={audioSrc}
          style={{ display: 'none' }}
        >
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Debug Info - Show audio source status */}
      {audioSrc && !audioError && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/20 rounded-xl">
          <div className="text-xs text-blue-300 space-y-1">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              <span className="font-medium">Audio Ready from Supabase Storage</span>
            </div>
            <div className="text-blue-200/60 font-mono break-all">
              {audioSrc}
            </div>
            {audioLoaded && (
              <div className="text-green-400 text-xs">✓ File loaded successfully</div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {audioError && (
        <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-xl">
          <div className="flex items-center space-x-2 text-yellow-300 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium">
              File audio tidak tersedia
            </p>
          </div>
          <p className="text-xs text-yellow-200/70 ml-7">
            Path: {audioSrc}
          </p>
          <p className="text-xs text-yellow-200/70 ml-7">
            Silakan baca materi pembelajaran di bawah atau hubungi admin.
          </p>
        </div>
      )}

      {/* Chapters List */}
      <div className="mb-4">
        <div className="mb-2 text-purple-200 font-semibold text-sm">Bab Audio</div>
        <div className="rounded-xl overflow-hidden border border-purple-400/10 bg-white/5">
          {chapters.map((chapter, idx) => (
            <button
              key={idx}
              className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm transition-colors ${idx === currentChapter ? 'bg-purple-100/20 text-purple-300 font-bold' : 'hover:bg-purple-900/10 text-purple-200'}`}
              onClick={() => {
                setCurrentChapter(idx);
                if (audioRef.current) {
                  audioRef.current.currentTime = chapter.startTime;
                  if (isPlaying) {
                    // Ensure audio source exists before playing
                    if (!audioRef.current.src || audioRef.current.readyState === 0) {
                      console.error('Cannot play: no valid audio source');
                      setAudioError(true);
                      setIsPlaying(false);
                      return;
                    }
                    audioRef.current.play().catch((error) => {
                      console.error('Error playing audio on chapter change:', error);
                      setAudioError(true);
                      setIsPlaying(false);
                    });
                  }
                }
                setProgress(0);
              }}
            >
              <span>{chapter.title}</span>
              <span className="ml-2 text-xs text-purple-400">{`${Math.floor(chapter.startTime/60)}:${(chapter.startTime%60).toString().padStart(2,'0')}`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-purple-200 mb-2">
          <span>Chapter {currentChapter + 1}: {chapters[currentChapter]?.title}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-purple-900/30 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button 
          onClick={() => handleChapterChange(false)}
          disabled={audioError || currentChapter === 0}
          className={`p-2 rounded-full transition-colors ${
            audioError || currentChapter === 0
              ? 'bg-purple-500/10 opacity-50 cursor-not-allowed'
              : 'bg-purple-500/20 hover:bg-purple-500/30'
          }`}
        >
          <SkipBack className="w-4 h-4 text-purple-300" />
        </button>

        <button 
          onClick={handlePlayPause}
          disabled={audioError}
          className={`p-4 rounded-full transition-all transform ${
            audioError
              ? 'bg-gray-500/20 opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105'
          }`}
          title={audioError ? 'Audio tidak tersedia' : (isPlaying ? 'Pause' : 'Play')}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>

        <button 
          onClick={() => handleChapterChange(true)}
          disabled={audioError || currentChapter === chapters.length - 1}
          className={`p-2 rounded-full transition-colors ${
            audioError || currentChapter === chapters.length - 1
              ? 'bg-purple-500/10 opacity-50 cursor-not-allowed'
              : 'bg-purple-500/20 hover:bg-purple-500/30'
          }`}
        >
          <SkipForward className="w-4 h-4 text-purple-300" />
        </button>
      </div>

      {/* Download Button */}
      {!audioError && (
        <div className="flex justify-center mt-2">
          <a 
            href={audioSrc} 
            download 
            className="flex items-center space-x-2 text-purple-300 hover:text-purple-400 text-sm py-2 px-4 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
            <span>Download Audio untuk Offline</span>
          </a>
        </div>
      )}
    </div>
  );
};

// Mock Interactive Circuit Demo Component
interface InteractiveCircuitDemoProps {
  voltage: number;
  resistance: number;
  title: string;
}
const InteractiveCircuitDemo = ({ voltage, resistance, title }: InteractiveCircuitDemoProps) => {
  const [currentVoltage, setCurrentVoltage] = useState(voltage);
  const [currentResistance, setCurrentResistance] = useState(resistance);
  
  const current = currentVoltage / currentResistance;
  const power = (currentVoltage * currentVoltage) / currentResistance;

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <p className="text-orange-200/80 text-sm">Interaktif Circuit Simulator</p>
        </div>
        <div className="text-2xl">⚡</div>
      </div>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-orange-200 text-sm font-medium mb-2">
            Tegangan (V): {currentVoltage}V
          </label>
          <input
            type="range"
            min="1"
            max="24"
            value={currentVoltage}
            onChange={(e) => setCurrentVoltage(Number(e.target.value))}
            className="w-full h-2 bg-orange-900/30 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-orange-200 text-sm font-medium mb-2">
            Resistansi (Ω): {currentResistance}Ω
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            value={currentResistance}
            onChange={(e) => setCurrentResistance(Number(e.target.value))}
            className="w-full h-2 bg-orange-900/30 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-orange-500/20 rounded-xl border border-orange-400/30">
          <div className="text-2xl font-bold text-orange-300">{current.toFixed(2)}</div>
          <div className="text-sm text-orange-200">Arus (A)</div>
        </div>
        <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-400/30">
          <div className="text-2xl font-bold text-red-300">{currentVoltage}</div>
          <div className="text-sm text-red-200">Tegangan (V)</div>
        </div>
        <div className="text-center p-4 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
          <div className="text-2xl font-bold text-yellow-300">{power.toFixed(2)}</div>
          <div className="text-sm text-yellow-200">Daya (W)</div>
        </div>
      </div>
    </div>
  );
};

import { useParams } from 'next/navigation';
import ModuleIntroductionPageNew from '@/components/modules/ModuleIntroductionPageNew';
import ModuleSeriesPageNew from '@/components/modules/ModuleSeriesPageNew';
import ModuleParallelPageNew from '@/components/modules/ModuleParallelPageNew';

const ModuleDetailPage = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const params = useParams();
  const slugMap: Record<string, string> = {
    'module-1': 'konsep-dasar-listrik',
    'module-2': 'rangkaian-seri',
    'module-3': 'rangkaian-paralel',
  };
  const slugParam = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const key = slugMap[slugParam] || 'konsep-dasar-listrik';

  // Load completion status from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(`module-${slugParam}-completed`) === 'true';
      setIsCompleted(completed);
    }
  }, [slugParam]);

  // Handle marking module as complete
  const handleMarkComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`module-${slugParam}-completed`, 'true');
      setIsCompleted(true);
      // Trigger storage event untuk update di halaman lain
      window.dispatchEvent(new Event('progress-updated'));
    }
  };

  // Routing untuk modul-modul interaktif
  if (slugParam === 'module-1') {
    return <ModuleIntroductionPageNew isCompleted={isCompleted} onMarkComplete={handleMarkComplete} />;
  }
  if (slugParam === 'module-2') {
    return <ModuleSeriesPageNew isCompleted={isCompleted} onMarkComplete={handleMarkComplete} />;
  }
  if (slugParam === 'module-3') {
    return <ModuleParallelPageNew isCompleted={isCompleted} onMarkComplete={handleMarkComplete} />;
  }
  // Data modul
  const modulesData: Record<string, {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    content: string;
    audioData: {
      title: string;
      description: string;
      chapters: { title: string; startTime: number; duration: number }[];
    };
    demoData: {
      voltage: number;
      resistance: number;
      title: string;
    };
    gradientColors: string;
  }> = {
  'konsep-dasar-listrik': {
    id: 'module-1',
    title: 'Konsep Dasar Listrik',
    subtitle: 'Memahami arus, tegangan, dan resistansi',
    description: 'Pelajari dasar-dasar listrik dengan cara yang mudah dipahami',
    content: `
      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Pengenalan Arus Searah</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">Arus listrik searah (Direct Current/DC) adalah aliran listrik yang mengalir dalam satu arah konstan di rangkaian tertutup. Arus ini memiliki polaritas tetap, artinya arah alirannya selalu sama.</p>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Rangkaian Listrik</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:1rem;">Rangkaian listrik adalah susunan komponen yang saling terhubung sehingga arus bisa mengalir. Komponen utama meliputi:</p>
      <ul style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;padding-left:1.5rem;">
        <li>Sumber daya (baterai atau generator DC)</li>
        <li>Konduktor (kabel/kawat)</li>
        <li>Sakelar</li>
        <li>Beban (lampu, resistor, motor)</li>
      </ul>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Contoh Kontekstual</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">Bayangkan senter: baterai sebagai sumber, kabel sebagai penghantar, tombol on/off sebagai saklar, dan lampu sebagai beban. Saat tombol ditekan, arus mengalir ke lampu sehingga menyala; saat dilepas, aliran terputus dan lampu mati.</p>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Hukum Ohm</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:1rem;">Hukum Ohm menghubungkan tegangan (V), arus (I), dan hambatan (R):</p>
      <p style="color:#fbbf24;font-size:1.5rem;font-weight:bold;text-align:center;margin:2rem 0;">V = I × R</p>
      <ul style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;padding-left:1.5rem;">
        <li>I = kuat arus (A)</li>
        <li>V = tegangan (V)</li>
        <li>R = hambatan (Ω)</li>
      </ul>
    `,
    audioData: {
      title: 'Audio: Konsep Dasar Listrik',
      description: 'Penjelasan sederhana tentang arus, tegangan, dan resistansi',
      chapters: [
        { title: 'Pengenalan Listrik', startTime: 0, duration: 120 },
        { title: 'Arus Listrik', startTime: 120, duration: 90 },
        { title: 'Tegangan', startTime: 210, duration: 90 },
        { title: 'Resistansi', startTime: 300, duration: 90 },
        { title: 'Hukum Ohm', startTime: 390, duration: 120 }
      ]
    },
    demoData: {
      voltage: 12,
      resistance: 100,
      title: 'Demo: Hukum Ohm'
    },
    gradientColors: 'from-blue-500 to-cyan-500'
  },

  'rangkaian-seri': {
    id: 'module-2',
    title: 'Rangkaian Seri',
    subtitle: 'Komponen tersusun berurutan',
    description: 'Pelajari bagaimana komponen listrik disusun berurutan',
    content: `
      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Rangkaian Listrik Seri</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">Rangkaian seri adalah rangkaian dengan satu jalur arus tanpa percabangan—semua komponen disusun berderet.</p>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Ciri-ciri Rangkaian Seri</h4>
      <ul style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;padding-left:1.5rem;">
        <li>Kuat arus sama di setiap komponen: <strong>I<sub>tot</sub> = I<sub>1</sub> = I<sub>2</sub> = …</strong></li>
        <li>Tegangan total adalah jumlah tegangan tiap komponen: <strong>V<sub>tot</sub> = V<sub>1</sub> + V<sub>2</sub> + …</strong></li>
        <li>Hambatan total adalah jumlah hambatan: <strong>R<sub>tot</sub> = R<sub>1</sub> + R<sub>2</sub> + …</strong></li>
        <li>Jika satu komponen putus, seluruh rangkaian mati.</li>
      </ul>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Contoh Kontekstual</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">Lampu hias disusun berderet. Bila satu lampu putus, semuanya padam karena arus terputus.</p>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Contoh Soal</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:.75rem;">Tiga hambatan seri dihubungkan ke baterai 12 V. Diketahui R<sub>1</sub> = 2 Ω, R<sub>2</sub> = 4 Ω, R<sub>3</sub> = 6 Ω.</p>
      <ol style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;padding-left:1.25rem;">
        <li>Hambatan total: <strong>R<sub>tot</sub> = 2 + 4 + 6 = 12 Ω</strong></li>
        <li>Arus rangkaian: <strong>I = V / R<sub>tot</sub> = 12 / 12 = 1 A</strong></li>
        <li>Tegangan tiap hambatan:
          <ul style="margin-top:.5rem;padding-left:1.25rem;">
            <li>V<sub>1</sub> = I × R<sub>1</sub> = 1 × 2 = 2 V</li>
            <li>V<sub>2</sub> = 1 × 4 = 4 V</li>
            <li>V<sub>3</sub> = 1 × 6 = 6 V</li>
          </ul>
        </li>
      </ol>
      <p style="color:#22c55e;font-weight:600;margin:1rem 0 1.5rem;">Cek: V<sub>1</sub> + V<sub>2</sub> + V<sub>3</sub> = 2 + 4 + 6 = 12 V ✅</p>
    `,
    audioData: {
      title: 'Audio: Rangkaian Seri',
      description: 'Memahami karakteristik dan perhitungan rangkaian seri',
      chapters: [
        { title: 'Konsep Rangkaian Seri', startTime: 0, duration: 120 },
        { title: 'Ciri-ciri Seri', startTime: 120, duration: 100 },
        { title: 'Rumus Perhitungan', startTime: 220, duration: 110 },
        { title: 'Contoh Soal', startTime: 330, duration: 90 }
      ]
    },
    demoData: {
      voltage: 9,
      resistance: 150,
      title: 'Demo: Rangkaian Seri'
    },
    gradientColors: 'from-green-500 to-blue-500'
  },

  'rangkaian-paralel': {
    id: 'module-3',
    title: 'Rangkaian Paralel',
    subtitle: 'Komponen tersusun bercabang',
    description: 'Pelajari konsep rangkaian listrik paralel dan cara menghitungnya',
    content: `
      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Rangkaian Listrik Paralel</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">Rangkaian paralel memiliki lebih dari satu jalur arus. Setiap cabang mendapat tegangan yang sama dengan sumber.</p>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Ciri-ciri Rangkaian Paralel</h4>
      <ul style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;padding-left:1.5rem;">
        <li>Arus total adalah jumlah arus cabang: <strong>I<sub>tot</sub> = I<sub>1</sub> + I<sub>2</sub> + …</strong></li>
        <li>Tegangan sama di tiap cabang: <strong>V<sub>tot</sub> = V<sub>1</sub> = V<sub>2</sub> = …</strong></li>
        <li>Hambatan total: <strong>1/R<sub>tot</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + …</strong></li>
        <li>Jika satu komponen dicabut, cabang lain tetap bekerja.</li>
      </ul>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Contoh Kontekstual</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;">Stop kontak rumah bersifat paralel: tegangannya sama untuk semua peralatan, arus terbagi sesuai kebutuhan masing-masing.</p>

      <h4 style="color:#93c5fd;font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Contoh Soal</h4>
      <p style="color:#cbd5e1;line-height:1.7;margin-bottom:.75rem;">Dua lampu identik R = 6 Ω disusun paralel pada sumber 12 V.</p>
      <ol style="color:#cbd5e1;line-height:1.7;margin-bottom:1.5rem;padding-left:1.25rem;">
        <li>Tegangan tiap cabang: <strong>V<sub>1</sub> = V<sub>2</sub> = 12 V</strong></li>
        <li>Arus tiap lampu:
          <ul style="margin-top:.5rem;padding-left:1.25rem;">
            <li>I<sub>1</sub> = V/R<sub>1</sub> = 12/6 = 2 A</li>
            <li>I<sub>2</sub> = 12/6 = 2 A</li>
          </ul>
        </li>
        <li>Arus total: <strong>I<sub>tot</sub> = I<sub>1</sub> + I<sub>2</sub> = 2 + 2 = 4 A</strong></li>
      </ol>
    `,
    audioData: {
      title: 'Audio: Daya Listrik',
      description: 'Memahami konsep daya listrik dan aplikasinya',
      chapters: [
        { title: 'Konsep Daya', startTime: 0, duration: 110 },
        { title: 'Rumus Daya', startTime: 110, duration: 100 },
        { title: 'Contoh Perhitungan', startTime: 210, duration: 120 },
        { title: 'Aplikasi Sehari-hari', startTime: 330, duration: 90 }
      ]
    },
    demoData: {
      voltage: 15,
      resistance: 75,
      title: 'Demo: Daya Listrik'
    },
    gradientColors: 'from-purple-500 to-pink-500'
  }
};

  // slug di url: module-1, module-2, module-3
  // mapping ke key modulesData
  const moduleData = modulesData[key];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {[...Array(15)].map((_, i) => (
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

      {/* Glassmorphism Navbar */}
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 pb-24 md:pb-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Module Header */}
          <div className={`relative rounded-3xl overflow-hidden shadow-2xl mb-12 group bg-gradient-to-br ${moduleData.gradientColors} animate-fade-in`}> 
            {/* Glassmorphism Layer */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl z-0" />
            
            {/* Gradient Decorations */}
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl z-0" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-xl z-0" />
            
            <div className="relative z-10 p-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm font-medium">Premium Module</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                    {moduleData.title}
                  </h1>
                  <p className="text-lg md:text-xl font-medium text-blue-100 mb-2">{moduleData.subtitle}</p>
                  <p className="text-base text-blue-200/80">{moduleData.description}</p>
                </div>
                
                {/* Status Badge */}
                <div className={`flex flex-col items-center px-6 py-4 rounded-2xl shadow-lg border border-white/20 backdrop-blur-xl ${
                  isCompleted 
                    ? 'bg-emerald-400/20 text-emerald-100' 
                    : 'bg-white/10 text-blue-100'
                }`}>
                  {isCompleted ? (
                    <>
                      <Trophy className="w-8 h-8 mb-2 text-yellow-400" />
                      <CheckCircle className="w-6 h-6 mb-1" />
                      <span className="font-bold text-sm">Selesai</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-8 h-8 mb-2" />
                      <span className="font-bold text-sm text-center">Belum<br/>Selesai</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Features */}
              <div className="flex items-center space-x-8 text-base text-blue-200">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Materi Lengkap</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5" />
                  <span>Audio Premium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Demo Interaktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Audio Learning Section */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-purple-900/20 p-3 rounded-full">
                    <Volume2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Audio Pembelajaran</h3>
                    <p className="text-purple-200">Dengarkan penjelasan dengan gaya podcast edukatif</p>
                  </div>
                </div>
                <AudioPlayer 
                  title={moduleData.audioData.title}
                  description={moduleData.audioData.description}
                  chapters={moduleData.audioData.chapters}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-900/20 p-3 rounded-full">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Materi Pembelajaran</h3>
                    <p className="text-blue-200">Penjelasan lengkap dan mudah dipahami</p>
                  </div>
                </div>
                <div 
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: moduleData.content }}
                />
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-orange-900/20 p-3 rounded-full">
                    <Zap className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Demo Interaktif</h3>
                    <p className="text-orange-200">Simulasi rangkaian untuk pemahaman lebih baik</p>
                  </div>
                </div>
                <InteractiveCircuitDemo
                  voltage={moduleData.demoData.voltage}
                  resistance={moduleData.demoData.resistance}
                  title={moduleData.demoData.title}
                />
              </div>
            </div>

            {/* Completion Section */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
                {!isCompleted ? (
                  <div>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Selesaikan Modul Ini</h3>
                    <p className="text-blue-200 mb-6">
                      Tandai modul sebagai selesai setelah memahami semua materi
                    </p>
                    <button
                      onClick={handleMarkComplete}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                      ✅ Tandai Selesai
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-300 mb-2">Modul Selesai! 🎉</h3>
                    <p className="text-emerald-200 text-lg">
                      Selamat! Anda telah menyelesaikan modul ini dengan baik.
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
            <button
              className="flex items-center space-x-2 text-blue-200 hover:text-blue-100 font-semibold transition-colors group"
              onClick={() => window.location.href = '/materials'}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Daftar Materi</span>
            </button>
            
            <button
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg group"
              onClick={() => window.location.href = '/practicum'}
            >
              <span>Lanjut ke Praktikum</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;