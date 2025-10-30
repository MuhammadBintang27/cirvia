'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/lib/questions';
import { QuestionPackage, SupabaseQuestionService } from '@/lib/supabase-question-service';
import { useToast } from '@/components/Toast';
import { Package, Clock, FileText, Users, Settings, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface QuestionPackageManagerProps {
  teacherId: string;
  questions: Question[];
}

interface PackageFormData {
  name: string;
  description: string;
  package_type: 'pretest' | 'posttest' | 'practice' | 'quiz';
  question_ids: string[];
  time_limit: number;
}

export default function QuestionPackageManager({ teacherId, questions }: QuestionPackageManagerProps) {
  const { addToast } = useToast();
  const [packages, setPackages] = useState<QuestionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<QuestionPackage | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    package_type: 'pretest',
    question_ids: [],
    time_limit: 30
  });

  useEffect(() => {
    loadPackages();
  }, [teacherId]);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await SupabaseQuestionService.getQuestionPackagesByTeacher(teacherId);
      if (error) {
        addToast({
          type: 'error',
          title: 'Gagal memuat paket soal',
          message: 'Terjadi kesalahan saat memuat paket soal.'
        });
      } else if (data) {
        setPackages(data);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.question_ids.length === 0) {
      addToast({
        type: 'warning',
        title: 'Pilih soal terlebih dahulu',
        message: 'Paket soal harus memiliki minimal 1 soal.'
      });
      return;
    }

    try {
      if (editingPackage) {
        const { data, error } = await SupabaseQuestionService.updateQuestionPackage(editingPackage.id, formData);
        if (error) throw error;
        
        addToast({
          type: 'success',
          title: 'Paket soal berhasil diperbarui!',
          message: `Paket "${formData.name}" telah diperbarui.`
        });
      } else {
        const { data, error } = await SupabaseQuestionService.createQuestionPackage({
          ...formData,
          teacher_id: teacherId,
          is_default: false,
          is_active: true
        });
        if (error) throw error;
        
        addToast({
          type: 'success',
          title: 'Paket soal berhasil dibuat!',
          message: `Paket "${formData.name}" telah ditambahkan.`
        });
      }
      
      loadPackages();
      resetForm();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal menyimpan paket soal',
        message: 'Terjadi kesalahan saat menyimpan paket soal.'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      package_type: 'pretest',
      question_ids: [],
      time_limit: 30
    });
    setShowCreateForm(false);
    setEditingPackage(null);
  };

  const handleEdit = (pkg: QuestionPackage) => {
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      package_type: pkg.package_type,
      question_ids: pkg.question_ids,
      time_limit: pkg.time_limit || 30
    });
    setEditingPackage(pkg);
    setShowCreateForm(true);
  };

  const handleDelete = async (pkg: QuestionPackage) => {
    if (pkg.is_default) {
      addToast({
        type: 'warning',
        title: 'Tidak dapat menghapus',
        message: 'Paket default sistem tidak dapat dihapus.'
      });
      return;
    }

    if (confirm(`Yakin ingin menghapus paket "${pkg.name}"?`)) {
      try {
        const { error } = await SupabaseQuestionService.updateQuestionPackage(pkg.id, { is_active: false });
        if (error) throw error;
        
        addToast({
          type: 'success',
          title: 'Paket soal berhasil dihapus!',
          message: `Paket "${pkg.name}" telah dihapus.`
        });
        
        loadPackages();
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Gagal menghapus paket soal',
          message: 'Terjadi kesalahan saat menghapus paket soal.'
        });
      }
    }
  };

  const toggleQuestionSelection = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      question_ids: prev.question_ids.includes(questionId)
        ? prev.question_ids.filter(id => id !== questionId)
        : [...prev.question_ids, questionId]
    }));
  };

  const getPackageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pretest: 'Pre-Test',
      posttest: 'Post-Test',
      practice: 'Latihan',
      quiz: 'Kuis'
    };
    return labels[type] || type;
  };

  const getPackageTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pretest: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      posttest: 'bg-green-500/20 text-green-300 border-green-400/30',
      practice: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      quiz: 'bg-purple-500/20 text-purple-300 border-purple-400/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-300">Memuat paket soal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Package className="w-6 h-6 mr-2" />
            Kelola Paket Soal
          </h2>
          <p className="text-gray-400 mt-1">
            Buat dan kelola paket soal untuk pretest, posttest, dan latihan
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Paket Baru
        </button>
      </div>

      {/* Package List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            {/* Package Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPackageTypeColor(pkg.package_type)}`}>
                    {getPackageTypeLabel(pkg.package_type)}
                  </span>
                  {pkg.is_default && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                      Default
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white text-lg">{pkg.name}</h3>
                {pkg.description && (
                  <p className="text-gray-400 text-sm mt-1">{pkg.description}</p>
                )}
              </div>
            </div>

            {/* Package Stats */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-300 text-sm">
                <FileText className="w-4 h-4 mr-2" />
                <span>{pkg.question_ids.length} soal</span>
              </div>
              {pkg.time_limit && (
                <div className="flex items-center text-gray-300 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{pkg.time_limit} menit</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(pkg)}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              {!pkg.is_default && (
                <button
                  onClick={() => handleDelete(pkg)}
                  className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingPackage ? 'Edit Paket Soal' : 'Buat Paket Soal Baru'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nama Paket
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama paket"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tipe Paket
                  </label>
                  <select
                    value={formData.package_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, package_type: e.target.value as any }))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={editingPackage?.is_default}
                  >
                    <option value="pretest">Pre-Test</option>
                    <option value="posttest">Post-Test</option>
                    <option value="practice">Latihan</option>
                    <option value="quiz">Kuis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi paket (opsional)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Batas Waktu (menit)
                </label>
                <input
                  type="number"
                  value={formData.time_limit}
                  onChange={(e) => setFormData(prev => ({ ...prev, time_limit: parseInt(e.target.value) || 30 }))}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="180"
                />
              </div>

              {/* Question Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Pilih Soal ({formData.question_ids.length} dipilih)
                </label>
                <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-600 rounded-lg p-4">
                  {questions.map((question) => (
                    <div key={question.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.question_ids.includes(String(question.id))}
                        onChange={() => toggleQuestionSelection(String(question.id))}
                        className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                            {question.questionType}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-600/50 text-gray-300 rounded-full">
                            {question.difficulty}
                          </span>
                        </div>
                        <p className="text-white text-sm font-medium">{question.title}</p>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{question.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingPackage ? 'Perbarui Paket' : 'Buat Paket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}