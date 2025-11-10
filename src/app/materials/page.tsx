"use client";
import React from 'react';
import { BookOpen, Play, Zap, CheckCircle, Clock, ArrowRight, Sparkles, Star, Trophy } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface ModuleCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gradientColors: string;
  isCompleted: boolean;
}

const ModuleCard = ({ id, title, subtitle, description, gradientColors, isCompleted }: ModuleCardProps) => {
  return (
    <div className="group relative">
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradientColors} rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 pointer-events-none`}></div>
      
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 shadow-2xl h-full flex flex-col z-10">
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${
          isCompleted 
            ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' 
            : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
        }`}>
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Selesai</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>Belum</span>
            </>
          )}
        </div>

        {/* Content */}
        <div className="mb-6 flex-grow">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">{title}</h3>
            <p className="text-lg text-blue-200 font-medium mb-3 line-clamp-1">{subtitle}</p>
            <p className="text-blue-200/80 leading-relaxed line-clamp-2">{description}</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center space-x-1 text-blue-300 flex-1 justify-center">
            <BookOpen className="w-4 h-4" />
            <span>{id === 'module-1' ? '4 Section' : '7 Section'}</span>
          </div>
          <div className="border-l border-white/20"></div>
          <div className="flex items-center space-x-1 text-purple-300 flex-1 justify-center">
            <Zap className="w-4 h-4" />
            <span>Interaktif</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <button
            className={`w-full bg-gradient-to-r ${gradientColors} text-white py-3 px-6 rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center group`}
            onClick={() => window.location.href = `/materials/${id}`}
          >
            <span>Pelajari Sekarang</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface OverallProgressProps {
  totalProgress: number;
  completedModules: number;
  totalModules: number;
}

const OverallProgress = ({ totalProgress, completedModules, totalModules }: OverallProgressProps) => {
  const isComplete = completedModules === totalModules;
  const progressColor = isComplete 
    ? 'from-emerald-400 to-green-400' 
    : 'from-blue-500 to-cyan-500';

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-1000 pointer-events-none"></div>
      
      <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-white/20">
              {isComplete ? (
                <Trophy className="w-7 h-7 text-yellow-400" />
              ) : (
                <BookOpen className="w-7 h-7 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Progress Belajar</h3>
              <p className="text-blue-200/70 text-sm">Perjalanan pembelajaran Anda</p>
            </div>
          </div>
          
          {isComplete && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-400/30">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-yellow-300 font-semibold text-sm">Selesai!</span>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-semibold text-blue-300">Kemajuan</span>
            <div className="text-right">
              <div className="text-2xl font-black text-white">{Math.round(totalProgress)}%</div>
            </div>
          </div>
          
          <div className="relative w-full bg-blue-900/30 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className={`bg-gradient-to-r ${progressColor} h-4 rounded-full transition-all duration-2000 ease-out`}
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-400/20">
            <div className="text-2xl font-bold text-emerald-300 mb-1">{completedModules}</div>
            <div className="text-xs text-emerald-200/70 font-medium">Selesai</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-400/20">
            <div className="text-2xl font-bold text-blue-300 mb-1">{totalModules - completedModules}</div>
            <div className="text-xs text-blue-200/70 font-medium">Tersisa</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
            <div className="text-2xl font-bold text-purple-300 mb-1">{Math.round(totalProgress)}%</div>
            <div className="text-xs text-purple-200/70 font-medium">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialsPage = () => {
  const [progress, setProgress] = React.useState<{
    completedModules: string[];
    totalProgress: number;
  }>({
    completedModules: [],
    totalProgress: 0
  });

  // Load progress from localStorage on mount
  React.useEffect(() => {
    const loadProgress = () => {
      if (typeof window !== 'undefined') {
        const completed: string[] = [];
        if (localStorage.getItem('module-module-1-completed') === 'true') {
          completed.push('module-1');
        }
        if (localStorage.getItem('module-module-2-completed') === 'true') {
          completed.push('module-2');
        }
        if (localStorage.getItem('module-module-3-completed') === 'true') {
          completed.push('module-3');
        }
        
        const totalModules = 3;
        const newTotalProgress = (completed.length / totalModules) * 100;
        
        setProgress({
          completedModules: completed,
          totalProgress: newTotalProgress
        });
      }
    };

    loadProgress();

    // Listen for progress updates from other tabs/modules
    window.addEventListener('progress-updated', loadProgress);
    window.addEventListener('storage', loadProgress);

    return () => {
      window.removeEventListener('progress-updated', loadProgress);
      window.removeEventListener('storage', loadProgress);
    };
  }, []);

  const modulesData = [
    {
      id: 'module-1',
      title: 'Modul Pengantar',
      subtitle: 'Konsep Dasar Listrik',
      description: 'Cari tahu apa itu rangkaian listrik dengan visualisasi interaktif',
      gradientColors: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'module-2', 
      title: 'Rangkaian Seri',
      subtitle: 'Komponen Berurutan',
      description: 'Pahami cara kerja rangkaian seri dengan demonstrasi interaktif lengkap',
      gradientColors: 'from-purple-500 to-pink-500'
    },
    {
      id: 'module-3',
      title: 'Rangkaian Paralel',
      subtitle: 'Komponen Bercabang',
      description: 'Kuasai rangkaian paralel dengan soal-soal kontekstual dan simulator',
      gradientColors: 'from-emerald-500 to-teal-500'
    }
  ];

  const isModuleCompleted = (moduleId: string) => {
    return progress.completedModules.includes(moduleId);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="relative z-10">
        {/* ====== COMPACT HERO SECTION ====== */}
        <section className="py-12 px-6 md:px-12 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-semibold">Materi Pembelajaran Interaktif</span>
              </div>
              
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-black">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
                      Rangkaian Listrik
                    </span>
                  </h1>
                </div>
                
                {/* Progress Circle */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-full border-2 border-blue-400/50 shadow-2xl flex items-center justify-center group hover:border-blue-300/80 transition-all">
                    {/* Glow Effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-1000"></div>
                    
                    {/* Content */}
                    <div className="relative text-center">
                      <div className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                        {Math.round(progress.totalProgress)}%
                      </div>
                      <p className="text-xs text-blue-200/70 font-medium mt-1">Progress</p>
                    </div>

                    {/* Progress Ring Background */}
                    <svg className="absolute inset-0 transform -rotate-90" width="128" height="128" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="2" />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="2"
                        strokeDasharray={`${(progress.totalProgress / 100) * 364.42} 364.42`}
                        strokeLinecap="round"
                        className="transition-all duration-2000"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                          <stop offset="100%" stopColor="rgba(34, 211, 238, 0.8)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              
              <p className="text-blue-200/90 max-w-2xl text-sm md:text-base">
                Pelajari konsep dasar dengan penjelasan interaktif, animasi visual, dan simulasi real-time
              </p>
            </div>
          </div>
        </section>

        {/* ====== MODULES SECTION (FIRST) ====== */}
        <section id="modules-section" className="py-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Pilih Modul Belajarmu</h2>
              <p className="text-blue-200/80">Mulai dari modul dasar hingga modul khusus seri dan paralel</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modulesData.map((module, index) => (
                <div key={module.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ModuleCard
                    id={module.id}
                    title={module.title}
                    subtitle={module.subtitle}
                    description={module.description}
                    gradientColors={module.gradientColors}
                    isCompleted={isModuleCompleted(module.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        


        

        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default MaterialsPage;