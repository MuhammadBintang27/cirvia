'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { Question } from '@/lib/questions';
import TeacherQuestionForm from '@/components/componentSoal/TeacherQuestionForm';
import { useSupabaseQuestions } from '@/lib/supabase-question-service';
import { useToast } from '@/components/Toast';
import QuestionPackageManager from '@/components/componentSoal/QuestionPackageManager';
import ClassPackageAssignment from '@/components/componentSoal/ClassPackageAssignment';

const TeacherDashboard = () => {
  const { user, logout, isTeacher } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
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
  
  // Student management states
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  
  // New student form state
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    nis: '',
    class: '',
    email: '',
    phoneNumber: ''
  });
  
  // Question management states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionView, setQuestionView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  // Question storage hook
  const teacherId = user?.id || ''; // Get teacher ID from user context
  const {
    questions: loadedQuestions,
    loading: questionsLoading,
    error: questionsError,
    loadQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    exportQuestions,
    importQuestions,
    getStats
  } = useSupabaseQuestions(teacherId);

  const teacher = user as Teacher;

  const loadData = useCallback(async () => {
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
      
      // Questions are loaded automatically by useSupabaseQuestions hook
      // Set questions from the hook
      setQuestions(loadedQuestions);
      
      setStudents(teacherStudents);
      setClasses(teacherClasses);  
      setStudentsLearningStyle(learningStyleData);
      setLearningStyleStats(stats);
      setIsLoading(false);
    }
  }, [teacher, loadedQuestions]);

  useEffect(() => {
    if (!isTeacher()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isTeacher, router, loadData]);

  // Sync questions from Supabase hook
  useEffect(() => {
    setQuestions(loadedQuestions);
  }, [loadedQuestions]);

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
    addToast({
      type: 'success',
      title: 'Logout berhasil!',
      message: 'Anda telah keluar dari sistem. Sampai jumpa!'
    });
    setTimeout(() => {
      logout(); // This will trigger loading state in AuthContext
    }, 1000);
  };

  const handleImportComplete = async (importedCount: number) => {
    await loadData();
    setShowExcelImport(false);
    
    if (importedCount > 0) {
      addToast({
        type: 'success',
        title: 'Impor siswa berhasil!',
        message: `${importedCount} data siswa berhasil diimpor.`
      });
    } else {
      addToast({
        type: 'info',
        title: 'Tidak ada data baru',
        message: 'Tidak ada data siswa baru yang diimpor.'
      });
    }
  };

  // Student management functions
  const handleViewStudent = (student: Student) => {
    setViewingStudent(student);
    setShowStudentDetail(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowEditStudent(true);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      // TODO: Implement update student in Supabase
      await SupabaseAuthService.updateStudent(updatedStudent.id, {
        name: updatedStudent.name,
        email: updatedStudent.email,
        class: updatedStudent.class,
        nis: updatedStudent.nis
      });
      
      await loadData();
      setShowEditStudent(false);
      setEditingStudent(null);
      
      addToast({
        type: 'success',
        title: 'Data siswa berhasil diperbarui!',
        message: `Data ${updatedStudent.name} telah diperbarui.`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal memperbarui data',
        message: 'Terjadi kesalahan saat memperbarui data siswa. Silakan coba lagi.'
      });
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (confirm(`Yakin ingin menghapus siswa "${student.name}"?\n\nSemua data progress dan hasil tes siswa ini akan terhapus permanen.`)) {
      try {
        await SupabaseAuthService.deleteStudent(student.id);
        await loadData();
        
        addToast({
          type: 'success',
          title: 'Siswa berhasil dihapus!',
          message: `Data ${student.name} telah dihapus dari sistem.`
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Gagal menghapus siswa',
          message: 'Terjadi kesalahan saat menghapus data siswa. Silakan coba lagi.'
        });
      }
    }
  };

  // Add new student handler
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newStudentForm.name || !newStudentForm.nis || !newStudentForm.class) {
      addToast({
        type: 'error',
        title: 'Data tidak lengkap',
        message: 'Nama, NIS, dan Kelas wajib diisi!'
      });
      return;
    }

    try {
      await SupabaseAuthService.createStudent(teacher.id, {
        name: newStudentForm.name,
        nis: newStudentForm.nis,
        class: newStudentForm.class,
        email: newStudentForm.email || undefined,
        phoneNumber: newStudentForm.phoneNumber || undefined
      });
      
      await loadData();
      setShowAddStudent(false);
      
      // Reset form
      setNewStudentForm({
        name: '',
        nis: '',
        class: '',
        email: '',
        phoneNumber: ''
      });
      
      addToast({
        type: 'success',
        title: 'Siswa berhasil ditambahkan!',
        message: `${newStudentForm.name} telah ditambahkan ke daftar siswa.`
      });
    } catch (error: any) {
      console.error('Error creating student:', error);
      addToast({
        type: 'error',
        title: 'Gagal menambahkan siswa',
        message: error.message || 'Terjadi kesalahan saat menambahkan siswa.'
      });
    }
  };

  // Question management functions
  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setQuestionView('create');
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionView('edit');    
  };

  const handleSubmitQuestion = async (question: Question) => {
    try {
      if (editingQuestion) {
        await updateQuestion(String(question.id), question);
        addToast({
          type: 'success',
          title: 'Soal berhasil diperbarui!',
          message: `Soal telah diperbarui.`
        });
      } else {
        await addQuestion(question);
        addToast({
          type: 'success',
          title: 'Soal berhasil ditambahkan!',
          message: `Soal telah ditambahkan ke bank soal.`
        });
      }
      setQuestionView('list');
      setEditingQuestion(null);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal menyimpan soal',
        message: 'Terjadi kesalahan saat menyimpan soal. Silakan coba lagi.'
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string | number) => {
    if (confirm('Yakin ingin menghapus soal ini?')) {
      try {
        await deleteQuestion(String(questionId));
        addToast({
          type: 'success',
          title: 'Soal berhasil dihapus!',
          message: 'Soal telah dihapus dari bank soal.'
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Gagal menghapus soal',
          message: 'Terjadi kesalahan saat menghapus soal. Silakan coba lagi.'
        });
      }
    }
  };

  const handleExportQuestions = () => {
    try {
      exportQuestions();
      addToast({
        type: 'success',
        title: 'Ekspor berhasil!',
        message: 'File bank soal telah berhasil diunduh.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal mengekspor soal',
        message: 'Terjadi kesalahan saat mengekspor bank soal. Silakan coba lagi.'
      });
    }
  };

  const handleImportQuestions = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await importQuestions(file);
        if (result.success) {
          // Questions will be automatically updated by the hook
          addToast({
            type: 'success',
            title: 'Impor berhasil!',
            message: `${result.count} soal berhasil diimpor ke bank soal.`
          });
          if (result.error) {
            addToast({
              type: 'warning',
              title: 'Catatan',
              message: result.error
            });
          }
        } else {
          addToast({
            type: 'error',
            title: 'Gagal mengimpor soal',
            message: result.error || 'Terjadi kesalahan saat mengimpor file.'
          });
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Gagal mengimpor soal',
          message: 'Terjadi kesalahan saat memproses file. Pastikan format file benar.'
        });
      }
      // Reset file input
      event.target.value = '';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'circuit': return 'Konstruksi Rangkaian';
      case 'conceptual': return 'Konseptual';
      case 'circuitAnalysis': return 'Analisis Rangkaian';
      case 'circuitOrdering': return 'Pengurutan Rangkaian';
      default: return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border border-green-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-400/30';
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
                  { id: 'questions', label: 'Kelola Soal', icon: FileSpreadsheet },
                  { id: 'packages', label: 'Paket Soal', icon: BookOpen },
                  { id: 'assignments', label: 'Assignment Kelas', icon: Settings },
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
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Students Card */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-3xl font-bold text-white">{stats.totalStudents}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-blue-200 font-semibold text-lg mb-1">Total Siswa</p>
                      <p className="text-blue-200/70 text-sm">
                        {students.filter(s => s.progress?.preTestScore !== undefined).length} telah mengikuti pre-test
                      </p>
                    </div>
                  </div>
                  
                  {/* Total Classes Card */}
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-3xl font-bold text-white">{stats.totalClasses}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-emerald-200 font-semibold text-lg mb-1">Total Kelas</p>
                      <p className="text-emerald-200/70 text-sm">
                        {classes.length > 0 ? `Kelas: ${classes.join(', ')}` : 'Belum ada kelas aktif'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Pre-Test Average Card */}
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-white">{Math.round(stats.averagePreTest || 0)}</span>
                        <span className="text-yellow-200 text-lg">%</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-yellow-200 font-semibold text-lg mb-1">Rata-rata Pre-Test</p>
                      <p className="text-yellow-200/70 text-sm">
                        {students.filter(s => s.progress?.preTestScore !== undefined).length} dari {stats.totalStudents} siswa
                      </p>
                    </div>
                  </div>
                  
                  {/* Post-Test Average & Improvement Card */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-white">{Math.round(stats.averagePostTest || 0)}</span>
                        <span className="text-purple-200 text-lg">%</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-purple-200 font-semibold text-lg mb-1">Rata-rata Post-Test</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-purple-200/70 text-sm">
                          {students.filter(s => s.progress?.postTestScore !== undefined).length} siswa selesai
                        </p>
                        {stats.averagePostTest > stats.averagePreTest && (
                          <div className="flex items-center text-green-400 text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{Math.round(stats.averagePostTest - stats.averagePreTest)}%
                          </div>
                        )}
                      </div>
                    </div>
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
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mr-3">
                      <Settings className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Aksi Cepat</h3>
                      <p className="text-white/70 text-sm">Kelola pembelajaran dengan mudah</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('students')}
                      className="flex flex-col items-center p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all group"
                    >
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Tambah Siswa</span>
                      <span className="text-xs text-blue-200/70 mt-1">Daftarkan siswa baru</span>
                    </button>
                    <button
                      onClick={() => setShowExcelImport(true)}
                      className="flex flex-col items-center p-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-xl text-emerald-300 hover:text-white transition-all group"
                    >
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-500/30 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Import Excel</span>
                      <span className="text-xs text-emerald-200/70 mt-1">Import data siswa</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('questions')}
                      className="flex flex-col items-center p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-xl text-purple-300 hover:text-white transition-all group"
                    >
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Kelola Soal</span>
                      <span className="text-xs text-purple-200/70 mt-1">{questions.length} soal tersedia</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('packages')}
                      className="flex flex-col items-center p-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-xl text-yellow-300 hover:text-white transition-all group"
                    >
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500/30 transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Paket Soal</span>
                      <span className="text-xs text-yellow-200/70 mt-1">Atur ujian</span>
                    </button>
                  </div>
                </div>

                {/* Recent Activity & Performance Overview */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Student Activity */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Aktivitas Terbaru</h3>
                        <p className="text-white/70 text-sm">Progress pembelajaran siswa</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {students.slice(0, 5).map((student, index) => {
                        const hasPreTest = student.progress?.preTestScore !== undefined;
                        const hasPostTest = student.progress?.postTestScore !== undefined;
                        const hasLearningStyle = studentsLearningStyle[student.id];
                        
                        let activityText = "Baru mendaftar";
                        let activityColor = "text-blue-300";
                        let activityIcon = Users;
                        
                        if (hasPostTest) {
                          activityText = `Post-test: ${student.progress?.postTestScore}%`;
                          activityColor = "text-purple-300";
                          activityIcon = Trophy;
                        } else if (hasPreTest) {
                          activityText = `Pre-test: ${student.progress?.preTestScore}%`;
                          activityColor = "text-yellow-300";
                          activityIcon = GraduationCap;
                        } else if (hasLearningStyle) {
                          activityText = `Tes gaya belajar selesai`;
                          activityColor = "text-emerald-300";
                          activityIcon = Brain;
                        }
                        
                        const ActivityIcon = activityIcon;
                        
                        return (
                          <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center">
                                <span className="text-blue-400 text-sm font-bold">{student.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{student.name}</p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-blue-200/70 text-xs">{student.class}</span>
                                  {hasLearningStyle && (
                                    <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/30">
                                      {studentsLearningStyle[student.id].primaryStyle}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex items-center space-x-2">
                              <ActivityIcon className="w-4 h-4 text-blue-400" />
                              <div>
                                <p className={`text-sm font-medium ${activityColor}`}>{activityText}</p>
                                <p className="text-blue-200/50 text-xs">
                                  {index === 0 ? "Baru saja" : `${index + 1} hari lalu`}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {students.length === 0 && (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
                          <p className="text-blue-200/70">Belum ada siswa yang terdaftar</p>
                          <p className="text-blue-200/50 text-sm mt-1">Mulai dengan menambahkan siswa pertama</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Class Performance Summary */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mr-3">
                        <BarChart3 className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Ringkasan Kelas</h3>
                        <p className="text-white/70 text-sm">Analisis performa pembelajaran</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Class-by-class breakdown */}
                      {classes.length > 0 ? classes.map((className) => {
                        const classStudents = students.filter(s => s.class === className);
                        const preTestCompleted = classStudents.filter(s => s.progress?.preTestScore !== undefined).length;
                        const postTestCompleted = classStudents.filter(s => s.progress?.postTestScore !== undefined).length;
                        const avgPreTest = classStudents
                          .filter(s => s.progress?.preTestScore !== undefined)
                          .reduce((sum, s) => sum + (s.progress?.preTestScore || 0), 0) / Math.max(preTestCompleted, 1);
                        const avgPostTest = classStudents
                          .filter(s => s.progress?.postTestScore !== undefined)
                          .reduce((sum, s) => sum + (s.progress?.postTestScore || 0), 0) / Math.max(postTestCompleted, 1);
                        
                        return (
                          <div key={className} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-semibold">{className}</h4>
                              <span className="text-blue-300 text-sm font-medium">{classStudents.length} siswa</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                                <p className="text-yellow-300 font-bold text-lg">{Math.round(avgPreTest || 0)}%</p>
                                <p className="text-yellow-200/70 text-xs">Pre-Test ({preTestCompleted}/{classStudents.length})</p>
                              </div>
                              <div className="text-center p-2 bg-purple-500/10 rounded-lg border border-purple-400/20">
                                <p className="text-purple-300 font-bold text-lg">{Math.round(avgPostTest || 0)}%</p>
                                <p className="text-purple-200/70 text-xs">Post-Test ({postTestCompleted}/{classStudents.length})</p>
                              </div>
                            </div>
                            
                            {avgPostTest > avgPreTest && avgPreTest > 0 && (
                              <div className="mt-2 flex items-center justify-center text-green-400 text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Peningkatan +{Math.round(avgPostTest - avgPreTest)}%
                              </div>
                            )}
                          </div>
                        );
                      }) : (
                        <div className="text-center py-6">
                          <BookOpen className="w-10 h-10 text-blue-400/50 mx-auto mb-3" />
                          <p className="text-blue-200/70">Belum ada kelas aktif</p>
                          <p className="text-blue-200/50 text-sm">Kelas akan muncul setelah menambahkan siswa</p>
                        </div>
                      )}
                    </div>
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
                    <form onSubmit={handleAddStudent}>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Nama lengkap siswa *"
                          value={newStudentForm.name}
                          onChange={(e) => setNewStudentForm({...newStudentForm, name: e.target.value})}
                          className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Nomor Induk Siswa (NIS) *"
                          value={newStudentForm.nis}
                          onChange={(e) => setNewStudentForm({...newStudentForm, nis: e.target.value})}
                          className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Kelas (contoh: X-IPA-1) *"
                          value={newStudentForm.class}
                          onChange={(e) => setNewStudentForm({...newStudentForm, class: e.target.value})}
                          className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email (opsional)"
                          value={newStudentForm.email}
                          onChange={(e) => setNewStudentForm({...newStudentForm, email: e.target.value})}
                          className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Nomor Telepon (opsional)"
                          value={newStudentForm.phoneNumber}
                          onChange={(e) => setNewStudentForm({...newStudentForm, phoneNumber: e.target.value})}
                          className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          type="submit"
                          className="px-6 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all font-medium"
                        >
                          Simpan Siswa
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddStudent(false);
                            // Reset form when cancelled
                            setNewStudentForm({
                              name: '',
                              nis: '',
                              class: '',
                              email: '',
                              phoneNumber: ''
                            });
                          }}
                          className="px-6 py-2.5 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-xl text-gray-300 hover:text-white transition-all font-medium"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
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
                                <button 
                                  onClick={() => handleViewStudent(student)}
                                  className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 hover:text-white transition-all"
                                  title="Lihat Detail"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditStudent(student)}
                                  className="p-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg text-yellow-300 hover:text-white transition-all"
                                  title="Edit Data"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteStudent(student)}
                                  className="p-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-white transition-all"
                                  title="Hapus Siswa"
                                >
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

            {activeTab === 'questions' && (
              <div className="space-y-6">
                {questionView === 'create' || questionView === 'edit' ? (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <TeacherQuestionForm
                      onSubmit={handleSubmitQuestion}
                      onCancel={() => setQuestionView('list')}
                      initialData={editingQuestion || undefined}
                    />
                  </div>
                ) : (
                  <>
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <h2 className="text-2xl font-bold text-white">Kelola Soal</h2>
                      <div className="flex space-x-3">
                        <label className="flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Soal
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportQuestions}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={handleExportQuestions}
                          disabled={questions.length === 0}
                          className="flex items-center px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-xl text-emerald-300 hover:text-white transition-all disabled:opacity-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export ({questions.length})
                        </button>
                        <button
                          onClick={handleCreateQuestion}
                          className="flex items-center px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-xl text-purple-300 hover:text-white transition-all"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Buat Soal Baru
                        </button>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
                        <div className="flex items-center justify-between mb-4">
                          <FileSpreadsheet className="w-8 h-8 text-blue-400" />
                          <span className="text-2xl font-bold text-white">{questions.length}</span>
                        </div>
                        <p className="text-blue-200 font-medium">Total Soal</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30">
                        <div className="flex items-center justify-between mb-4">
                          <Settings className="w-8 h-8 text-emerald-400" />
                          <span className="text-2xl font-bold text-white">
                            {questions.filter(q => q.questionType === 'circuit').length}
                          </span>
                        </div>
                        <p className="text-emerald-200 font-medium">Konstruksi Rangkaian</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
                        <div className="flex items-center justify-between mb-4">
                          <Brain className="w-8 h-8 text-yellow-400" />
                          <span className="text-2xl font-bold text-white">
                            {questions.filter(q => q.questionType === 'conceptual').length}
                          </span>
                        </div>
                        <p className="text-yellow-200 font-medium">Konseptual</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30">
                        <div className="flex items-center justify-between mb-4">
                          <Search className="w-8 h-8 text-purple-400" />
                          <span className="text-2xl font-bold text-white">
                            {questions.filter(q => q.questionType === 'circuitAnalysis').length}
                          </span>
                        </div>
                        <p className="text-purple-200 font-medium">Analisis Rangkaian</p>
                      </div>
                    </div>

                    {/* Questions List */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20">
                      {questions.length === 0 ? (
                        <div className="p-12 text-center">
                          <div className="text-blue-400/50 text-6xl mb-4">📝</div>
                          <h3 className="text-lg font-medium text-white mb-2">Belum ada soal</h3>
                          <p className="text-blue-200/70 mb-4">
                            Mulai membuat soal pertama untuk pembelajaran rangkaian listrik
                          </p>
                          <button
                            onClick={handleCreateQuestion}
                            className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-xl text-purple-300 hover:text-white transition-all"
                          >
                            Buat Soal Pertama
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/10">
                          {questions.map((question) => (
                            <div key={question.id} className="p-6 hover:bg-white/5 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-medium text-white">
                                      {question.title}
                                    </h3>
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-400/30">
                                      {getQuestionTypeLabel(question.questionType)}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                                      {question.difficulty.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-blue-200/70 text-sm mb-3 line-clamp-3">
                                    {question.description}
                                  </p>
                                  
                                  {/* Question-specific details */}
                                  <div className="text-xs text-blue-200/50 space-x-4">
                                    {question.questionType === 'circuit' && (
                                      <>
                                        <span>🔧 {(question as any).circuitType}</span>
                                        <span>⚡ {(question as any).voltage}V</span>
                                        {(question as any).targetCurrent && (
                                          <span>🎯 {(question as any).targetCurrent}A</span>
                                        )}
                                      </>
                                    )}
                                    
                                    {question.questionType === 'conceptual' && (
                                      <span>💡 {(question as any).choices?.length || 0} pilihan jawaban</span>
                                    )}
                                    
                                    {question.questionType === 'circuitAnalysis' && (
                                      <span>🔍 Target: {(question as any).targetLamp}</span>
                                    )}
                                    
                                    {question.questionType === 'circuitOrdering' && (
                                      <span>📊 {(question as any).circuits?.length || 0} rangkaian</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2 ml-4">
                                  <button
                                    onClick={() => handleEditQuestion(question)}
                                    className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 hover:text-white transition-all"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="p-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-white transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
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

            {activeTab === 'packages' && (
              <QuestionPackageManager
                teacherId={teacherId}
                questions={questions}
              />
            )}

            {activeTab === 'assignments' && (
              <ClassPackageAssignment
                teacherId={teacherId}
                classes={classes}
              />
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

      {/* Student Detail Modal */}
      {showStudentDetail && viewingStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Detail Siswa</h3>
                <button
                  onClick={() => setShowStudentDetail(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-400 text-3xl font-bold">{viewingStudent.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">{viewingStudent.name}</h4>
                      <p className="text-blue-200/70">NIS: {viewingStudent.nis}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30 mt-2">
                        {viewingStudent.class}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-blue-200/70 text-sm mb-1">Email</p>
                      <p className="text-white font-medium">{viewingStudent.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-blue-200/70 text-sm mb-1">Nomor Telepon</p>
                      <p className="text-white font-medium">{viewingStudent.phoneNumber || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Learning Style */}
                {studentsLearningStyle[viewingStudent.id] && (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
                    <h5 className="text-lg font-bold text-white mb-4">Gaya Belajar</h5>
                    <div className="flex items-center space-x-4">
                      {studentsLearningStyle[viewingStudent.id].primaryStyle === 'visual' && (
                        <>
                          <Eye className="w-8 h-8 text-blue-400" />
                          <div>
                            <p className="text-white font-bold text-xl">Visual Learner</p>
                            <p className="text-blue-200/70 text-sm">Belajar lebih baik dengan gambar dan diagram</p>
                          </div>
                        </>
                      )}
                      {studentsLearningStyle[viewingStudent.id].primaryStyle === 'auditory' && (
                        <>
                          <Ear className="w-8 h-8 text-purple-400" />
                          <div>
                            <p className="text-white font-bold text-xl">Auditory Learner</p>
                            <p className="text-purple-200/70 text-sm">Belajar lebih baik dengan mendengar</p>
                          </div>
                        </>
                      )}
                      {studentsLearningStyle[viewingStudent.id].primaryStyle === 'kinesthetic' && (
                        <>
                          <Hand className="w-8 h-8 text-emerald-400" />
                          <div>
                            <p className="text-white font-bold text-xl">Kinesthetic Learner</p>
                            <p className="text-emerald-200/70 text-sm">Belajar lebih baik dengan praktik langsung</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
                  <h5 className="text-lg font-bold text-white mb-4">Progress Pembelajaran</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-400/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-yellow-200 text-sm">Pre-Test</span>
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </div>
                      <p className="text-3xl font-bold text-yellow-300">
                        {viewingStudent.progress?.preTestScore !== undefined ? `${viewingStudent.progress.preTestScore}%` : '-'}
                      </p>
                      <p className="text-yellow-200/70 text-xs mt-1">
                        {viewingStudent.progress?.preTestScore !== undefined ? 'Selesai' : 'Belum mengerjakan'}
                      </p>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-200 text-sm">Post-Test</span>
                        <Trophy className="w-5 h-5 text-purple-400" />
                      </div>
                      <p className="text-3xl font-bold text-purple-300">
                        {viewingStudent.progress?.postTestScore !== undefined ? `${viewingStudent.progress.postTestScore}%` : '-'}
                      </p>
                      <p className="text-purple-200/70 text-xs mt-1">
                        {viewingStudent.progress?.postTestScore !== undefined ? 'Selesai' : 'Belum mengerjakan'}
                      </p>
                    </div>
                  </div>

                  {viewingStudent.progress?.preTestScore !== undefined && viewingStudent.progress?.postTestScore !== undefined && (
                    <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                      <div className="flex items-center justify-center text-green-400">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        <span className="font-bold">
                          Peningkatan: +{Math.round((viewingStudent.progress.postTestScore || 0) - (viewingStudent.progress.preTestScore || 0))}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowStudentDetail(false);
                    handleEditStudent(viewingStudent);
                  }}
                  className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all"
                >
                  Edit Data
                </button>
                <button
                  onClick={() => setShowStudentDetail(false)}
                  className="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-xl text-gray-300 hover:text-white transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudent && editingStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 rounded-2xl border border-white/20 max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Edit Data Siswa</h3>
                <button
                  onClick={() => setShowEditStudent(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateStudent(editingStudent);
              }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">NIS *</label>
                    <input
                      type="text"
                      value={editingStudent.nis}
                      onChange={(e) => setEditingStudent({...editingStudent, nis: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Kelas *</label>
                    <input
                      type="text"
                      value={editingStudent.class}
                      onChange={(e) => setEditingStudent({...editingStudent, class: e.target.value})}
                      placeholder="Contoh: X-IPA-1"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Email</label>
                    <input
                      type="email"
                      value={editingStudent.email || ''}
                      onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-200 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      value={editingStudent.phoneNumber || ''}
                      onChange={(e) => setEditingStudent({...editingStudent, phoneNumber: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditStudent(false)}
                    className="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-xl text-gray-300 hover:text-white transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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