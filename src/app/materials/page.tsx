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
  onMarkComplete: (id: string) => void;
}
const ModuleCard = ({ id, title, subtitle, description, gradientColors, isCompleted, onMarkComplete }: ModuleCardProps) => {
  return (
    <div className="group relative">
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradientColors} rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000`}></div>
      
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 shadow-2xl">
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
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-lg text-blue-200 font-medium mb-3">{subtitle}</p>
          <p className="text-blue-200/80 leading-relaxed">{description}</p>
        </div>

        {/* Features */}
        <div className="flex items-center space-x-4 mb-6 text-sm">
          <div className="flex items-center space-x-1 text-blue-300">
            <BookOpen className="w-4 h-4" />
            <span>Materi</span>
          </div>
          <div className="flex items-center space-x-1 text-purple-300">
            <Play className="w-4 h-4" />
            <span>Audio</span>
          </div>
          <div className="flex items-center space-x-1 text-orange-300">
            <Zap className="w-4 h-4" />
            <span>Demo</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full bg-gradient-to-r ${gradientColors} text-white py-3 px-6 rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center group`}
          onClick={() => window.location.href = `/materials/${id}`}
        >
          <span>Pelajari Sekarang</span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
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
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
      
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-white/20">
              {isComplete ? (
                <Trophy className="w-7 h-7 text-yellow-400" />
              ) : (
                <BookOpen className="w-7 h-7 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Progress Belajar</h3>
              <p className="text-blue-200/80">Perjalanan pembelajaran Anda</p>
            </div>
          </div>
          
          {isComplete && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-400/30">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-semibold">Selesai!</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <span className="text-lg font-semibold text-blue-200">Kemajuan Keseluruhan</span>
            <div className="text-right">
              <div className="text-3xl font-black text-white">{Math.round(totalProgress)}%</div>
              <div className="text-sm text-blue-300">dari target 100%</div>
            </div>
          </div>
          
          <div className="relative w-full bg-blue-900/30 rounded-full h-6 overflow-hidden shadow-inner">
            <div 
              className={`bg-gradient-to-r ${progressColor} h-6 rounded-full transition-all duration-2000 ease-out relative overflow-hidden`}
              style={{ width: `${totalProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-blue-200 font-medium">
              {isComplete 
                ? "Selamat! Semua modul telah diselesaikan! 🎉" 
                : `${totalModules - completedModules} modul tersisa - tetap semangat! 💪`
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-400/20 backdrop-blur-sm">
            <div className="text-3xl font-bold text-emerald-300 mb-1">{completedModules}</div>
            <div className="text-sm text-emerald-200/80 font-medium">Selesai</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20 backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-300 mb-1">{totalModules - completedModules}</div>
            <div className="text-sm text-blue-200/80 font-medium">Tersisa</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20 backdrop-blur-sm">
            <div className="text-3xl font-bold text-purple-300 mb-1">{Math.round(totalProgress)}%</div>
            <div className="text-sm text-purple-200/80 font-medium">Total</div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <span className="text-sm text-blue-200 font-medium">Modul:</span>
          {Array.from({ length: totalModules }).map((_, index) => (
            <div key={index} className="relative">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  index < completedModules
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg transform scale-125'
                    : 'bg-blue-900/40 border border-blue-400/30'
                }`}
              />
              {index < completedModules && (
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
              )}
            </div>
          ))}
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

  const modulesData = [
    {
      id: 'module-1',
      title: 'Konsep Dasar Listrik',
      subtitle: 'Memahami arus, tegangan, dan resistansi',
      description: 'Pelajari dasar-dasar listrik dengan cara yang mudah dipahami',
      gradientColors: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'module-2', 
      title: 'Rangkaian Seri',
      subtitle: 'Komponen tersusun berurutan',
      description: 'Pelajari bagaimana komponen listrik disusun berurutan',
      gradientColors: 'from-green-500 to-blue-500'
    },
    {
      id: 'module-3',
      title: 'Rangkaian Paralel',
      subtitle: 'Komponen tersusun bercabang',
      description: 'Pelajari konsep rangkaian listrik paralel dan cara menghitungnya',
      gradientColors: 'from-purple-500 to-pink-500'
    }
  ];

  const markModuleComplete = (moduleId: string) => {
    setProgress(prev => {
      const newCompleted = [...prev.completedModules];
      if (!newCompleted.includes(moduleId)) {
        newCompleted.push(moduleId);
      }
      
      const totalModules = 3;
      const newTotalProgress = (newCompleted.length / totalModules) * 100;
      
      return {
        completedModules: newCompleted,
        totalProgress: newTotalProgress
      };
    });
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress.completedModules.includes(moduleId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {[...Array(20)].map((_, i) => (
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

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-8">
              <BookOpen className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">Learning Materials</span>
              <Sparkles className="w-4 h-4 text-blue-400 ml-2" />
            </div>

            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                <span className="text-6xl relative z-10">📚</span>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
            </div>

            <h1 className="text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                Rangkaian
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Listrik
              </span>
            </h1>
            
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Pelajari konsep dasar rangkaian listrik dengan penjelasan yang mudah dipahami, dilengkapi audio pembelajaran dan demo interaktif
            </p>

            <div className="flex justify-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">3</div>
                <div className="text-blue-300 text-sm">Modul Lengkap</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-blue-300 text-sm">Audio & Visual</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-300 text-sm">Akses Gratis</div>
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="mb-12">
            <OverallProgress 
              totalProgress={progress.totalProgress}
              completedModules={progress.completedModules.length}
              totalModules={3}
            />
          </div>

          {/* Learning Modules Cards */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {modulesData.map((module, index) => (
              <div key={module.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ModuleCard
                  id={module.id}
                  title={module.title}
                  subtitle={module.subtitle}
                  description={module.description}
                  gradientColors={module.gradientColors}
                  isCompleted={isModuleCompleted(module.id)}
                  onMarkComplete={() => markModuleComplete(module.id)}
                />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-3xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full mb-8 mx-auto">
                <Zap className="w-12 h-12 text-cyan-400" />
              </div>
              
              <h3 className="text-4xl font-bold text-white mb-4">Siap untuk Praktik Langsung?</h3>
              <p className="text-blue-200/90 text-xl max-w-3xl mx-auto mb-8">
                Setelah mempelajari teori, saatnya mencoba simulator rangkaian listrik dengan teknologi interaktif terdepan
              </p>
              
              <button
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl"
                onClick={() => window.location.href = '/practicum'}
              >
                <Zap className="w-6 h-6" />
                <span>Mulai Praktikum</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;