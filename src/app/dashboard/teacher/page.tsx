'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ExcelImport from '@/components/ExcelImport';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Upload,
  FileSpreadsheet,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  GraduationCap,
  Trophy,
  Clock,
  TrendingUp,
  Brain,
  Ear,
  Hand
} from 'lucide-react';
import { SupabaseAuthService } from '@/lib/supabase-auth-service';
import { SupabaseTestService } from '@/lib/supabase-test-service';
import { Student, Teacher } from '@/types/auth';
import { TeacherRoute } from '@/components/ProtectedRoute';

const TeacherDashboard = () => {
  const { user, logout, isTeacher } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [learningStyleStats, setLearningStyleStats] = useState<{visual: number, auditory: number, kinesthetic: number} | null>(null);
  const [studentsLearningStyle, setStudentsLearningStyle] = useState<{[key: string]: any}>({});

  const teacher = user as Teacher;

  useEffect(() => {
    if (!isTeacher()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isTeacher, router]);

  const loadData = async () => {
    if (teacher) {
      const teacherStudents = await SupabaseAuthService.getStudentsByTeacher(teacher.id);
      const teacherClasses = await SupabaseAuthService.getClassesByTeacher(teacher.id);
      
      // Load learning style data for all students
      const learningStyleData: {[key: string]: any} = {};
      for (const student of teacherStudents) {
        const learningStyle = await SupabaseTestService.getLearningStyleResult(student.id);
        if (learningStyle) {
          learningStyleData[student.id] = learningStyle;
        }
      }
      
      // Calculate learning style statistics
      const stats = { visual: 0, auditory: 0, kinesthetic: 0 };
      Object.values(learningStyleData).forEach((style: any) => {
        if (style.primaryStyle === 'visual') stats.visual++;
        else if (style.primaryStyle === 'auditory') stats.auditory++;
        else if (style.primaryStyle === 'kinesthetic') stats.kinesthetic++;
      });
      
      setStudents(teacherStudents);
      setClasses(teacherClasses);
      setStudentsLearningStyle(learningStyleData);
      setLearningStyleStats(stats);
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.nis.includes(searchTerm);
    const matchesClass = selectedClass === '' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const stats = {
    totalStudents: students.length,
    totalClasses: classes.length,
    averagePreTest: students
      .filter(s => s.progress?.preTestScore !== undefined)
      .reduce((acc, s) => acc + (s.progress?.preTestScore || 0), 0) / 
      Math.max(students.filter(s => s.progress?.preTestScore !== undefined).length, 1),
    averagePostTest: students
      .filter(s => s.progress?.postTestScore !== undefined)
      .reduce((acc, s) => acc + (s.progress?.postTestScore || 0), 0) / 
      Math.max(students.filter(s => s.progress?.postTestScore !== undefined).length, 1),
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleImportComplete = async (importedCount: number) => {
    await loadData();
    setShowExcelImport(false);
    
    if (importedCount > 0) {
      alert(`Berhasil mengimpor ${importedCount} siswa!`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl border border-blue-400/30">
                <GraduationCap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard Guru</h1>
                <p className="text-blue-200/80 text-sm">Selamat datang, {teacher?.name}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl text-red-300 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'students', label: 'Kelola Siswa', icon: Users },
                  { id: 'materials', label: 'Materi', icon: BookOpen },
                  { id: 'settings', label: 'Pengaturan', icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                          : 'text-blue-200/70 hover:bg-white/5 hover:text-blue-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-blue-400" />
                      <span className="text-2xl font-bold text-white">{stats.totalStudents}</span>
                    </div>
                    <p className="text-blue-200 font-medium">Total Siswa</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30">
                    <div className="flex items-center justify-between mb-4">
                      <BookOpen className="w-8 h-8 text-emerald-400" />
                      <span className="text-2xl font-bold text-white">{stats.totalClasses}</span>
                    </div>
                    <p className="text-emerald-200 font-medium">Total Kelas</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
                    <div className="flex items-center justify-between mb-4">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{Math.round(stats.averagePreTest || 0)}</span>
                    </div>
                    <p className="text-yellow-200 font-medium">Rata-rata Pre-Test</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                      <span className="text-2xl font-bold text-white">{Math.round(stats.averagePostTest || 0)}</span>
                    </div>
                    <p className="text-purple-200 font-medium">Rata-rata Post-Test</p>
                  </div>
                </div>

                {/* Learning Style Statistics */}
                {learningStyleStats && (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-4">
                        <Brain className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Statistik Gaya Belajar Kelas</h3>
                        <p className="text-white/70">Distribusi gaya belajar siswa di kelas Anda</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Visual Learners */}
                      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/30">
                        <div className="flex items-center mb-3">
                          <Eye className="w-8 h-8 text-blue-400 mr-3" />
                          <div>
                            <h4 className="text-lg font-bold text-white">{learningStyleStats.visual}</h4>
                            <p className="text-blue-200/70 text-sm">Visual Learners</p>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.round((learningStyleStats.visual / (learningStyleStats.visual + learningStyleStats.auditory + learningStyleStats.kinesthetic)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Auditory Learners */}
                      <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/30">
                        <div className="flex items-center mb-3">
                          <Ear className="w-8 h-8 text-purple-400 mr-3" />
                          <div>
                            <h4 className="text-lg font-bold text-white">{learningStyleStats.auditory}</h4>
                            <p className="text-purple-200/70 text-sm">Auditory Learners</p>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.round((learningStyleStats.auditory / (learningStyleStats.visual + learningStyleStats.auditory + learningStyleStats.kinesthetic)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Kinesthetic Learners */}
                      <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-400/30">
                        <div className="flex items-center mb-3">
                          <Hand className="w-8 h-8 text-emerald-400 mr-3" />
                          <div>
                            <h4 className="text-lg font-bold text-white">{learningStyleStats.kinesthetic}</h4>
                            <p className="text-emerald-200/70 text-sm">Kinesthetic Learners</p>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.round((learningStyleStats.kinesthetic / (learningStyleStats.visual + learningStyleStats.auditory + learningStyleStats.kinesthetic)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6">Aksi Cepat</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('students')}
                      className="flex items-center p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all"
                    >
                      <Plus className="w-5 h-5 mr-3" />
                      Tambah Siswa
                    </button>
                    <button
                      onClick={() => setShowExcelImport(true)}
                      className="flex items-center p-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-xl text-emerald-300 hover:text-white transition-all"
                    >
                      <Upload className="w-5 h-5 mr-3" />
                      Import Excel
                    </button>
                    <button
                      onClick={() => setActiveTab('students')}
                      className="flex items-center p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-xl text-purple-300 hover:text-white transition-all"
                    >
                      <Download className="w-5 h-5 mr-3" />
                      Export Data
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6">Aktivitas Terbaru</h3>
                  <div className="space-y-4">
                    {students.slice(0, 5).map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center">
                            <span className="text-blue-400 text-sm font-bold">{student.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{student.name}</p>
                            <p className="text-blue-200/70 text-sm">{student.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-300 text-sm">Terdaftar</p>
                          <p className="text-blue-200/70 text-xs">Baru saja</p>
                        </div>
                      </div>
                    ))}
                    {students.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-blue-200/70">Belum ada siswa yang terdaftar</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <h2 className="text-2xl font-bold text-white">Kelola Siswa</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAddStudent(!showAddStudent)}
                      className="flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Siswa
                    </button>
                    <button 
                      onClick={() => setShowExcelImport(true)}
                      className="flex items-center px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-xl text-emerald-300 hover:text-white transition-all"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Import Excel
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                        <input
                          type="text"
                          placeholder="Cari nama atau NIS..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="md:w-48">
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:outline-none"
                      >
                        <option value="">Semua Kelas</option>
                        {classes.map((className) => (
                          <option key={className} value={className} className="bg-slate-800">
                            {className}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Add Student Form */}
                {showAddStudent && (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold text-white mb-4">Tambah Siswa Baru</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Nama lengkap siswa"
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Nomor Induk Siswa (NIS)"
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Kelas (contoh: X-IPA-1)"
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Email (opsional)"
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all">
                        Simpan
                      </button>
                      <button
                        onClick={() => setShowAddStudent(false)}
                        className="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-xl text-gray-300 hover:text-white transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {/* Students Table */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-blue-200 uppercase tracking-wider">Siswa</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-blue-200 uppercase tracking-wider">NIS</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-blue-200 uppercase tracking-wider">Kelas</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-blue-200 uppercase tracking-wider">Pre-Test</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-blue-200 uppercase tracking-wider">Post-Test</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-blue-200 uppercase tracking-wider">Gaya Belajar</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-blue-200 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-white/5">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-400 text-sm font-bold">{student.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="text-white font-medium">{student.name}</p>
                                  {student.email && <p className="text-blue-200/70 text-sm">{student.email}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-white">{student.nis}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                {student.class}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-white">
                              {student.progress?.preTestScore !== undefined ? (
                                <span className="text-emerald-300 font-bold">{student.progress.preTestScore}%</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-white">
                              {student.progress?.postTestScore !== undefined ? (
                                <span className="text-purple-300 font-bold">{student.progress.postTestScore}%</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {studentsLearningStyle[student.id] ? (
                                <div className="flex items-center">
                                  {studentsLearningStyle[student.id].primaryStyle === 'visual' && (
                                    <div className="flex items-center">
                                      <Eye className="w-4 h-4 text-blue-400 mr-2" />
                                      <span className="text-blue-300 text-sm font-medium">Visual</span>
                                    </div>
                                  )}
                                  {studentsLearningStyle[student.id].primaryStyle === 'auditory' && (
                                    <div className="flex items-center">
                                      <Ear className="w-4 h-4 text-purple-400 mr-2" />
                                      <span className="text-purple-300 text-sm font-medium">Auditory</span>
                                    </div>
                                  )}
                                  {studentsLearningStyle[student.id].primaryStyle === 'kinesthetic' && (
                                    <div className="flex items-center">
                                      <Hand className="w-4 h-4 text-emerald-400 mr-2" />
                                      <span className="text-emerald-300 text-sm font-medium">Kinesthetic</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">Belum tes</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 hover:text-white transition-all">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg text-yellow-300 hover:text-white transition-all">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-white transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                      <p className="text-blue-200/70 text-lg">Belum ada siswa</p>
                      <p className="text-blue-200/50 text-sm">Tambahkan siswa untuk mulai mengelola pembelajaran</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other tabs content can be added here */}
            {activeTab === 'materials' && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Kelola Materi</h3>
                <p className="text-blue-200/70">Fitur ini akan segera hadir</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Pengaturan</h3>
                <p className="text-blue-200/70">Fitur ini akan segera hadir</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Excel Import Modal */}
      {showExcelImport && (
        <ExcelImport
          onImportComplete={handleImportComplete}
          onClose={() => setShowExcelImport(false)}
        />
      )}
    </div>
  );
};

export default function TeacherDashboardPage() {
  return (
    <TeacherRoute>
      <TeacherDashboard />
    </TeacherRoute>
  );
}