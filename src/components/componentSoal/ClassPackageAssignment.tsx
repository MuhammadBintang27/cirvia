'use client';

import React, { useState, useEffect } from 'react';
import { QuestionPackage, ClassPackage, SupabaseQuestionService } from '@/lib/supabase-question-service';
import { useToast } from '@/components/Toast';
import { Users, Package, Clock, FileText, Settings, Save, RefreshCw } from 'lucide-react';

interface ClassPackageAssignmentProps {
  teacherId: string;
  classes: string[];
}

export default function ClassPackageAssignment({ teacherId, classes }: ClassPackageAssignmentProps) {
  const { addToast } = useToast();
  const [packages, setPackages] = useState<QuestionPackage[]>([]);
  const [classPackages, setClassPackages] = useState<ClassPackage[]>([]);
  const [assignments, setAssignments] = useState<Record<string, { pretest: string; posttest: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [teacherId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load available packages
      const { data: packagesData, error: packagesError } = await SupabaseQuestionService.getQuestionPackagesByTeacher(teacherId);
      if (packagesError) {
        console.error('Error loading packages:', packagesError);
      } else if (packagesData) {
        setPackages(packagesData);
      }

      // Load existing class assignments
      const { data: classData, error: classError } = await SupabaseQuestionService.getClassPackages(teacherId);
      if (classError) {
        console.error('Error loading class packages:', classError);
      } else if (classData) {
        setClassPackages(classData);
        
        // Convert to assignments format
        const assignmentsMap: Record<string, { pretest: string; posttest: string }> = {};
        classes.forEach(className => {
          const existing = classData.find(cp => cp.class_name === className);
          assignmentsMap[className] = {
            pretest: existing?.pretest_package_id || '',
            posttest: existing?.posttest_package_id || ''
          };
        });
        setAssignments(assignmentsMap);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      addToast({
        type: 'error',
        title: 'Gagal memuat data',
        message: 'Terjadi kesalahan saat memuat data paket dan kelas.'
      });
    }
    setLoading(false);
  };

  const handleAssignmentChange = (className: string, packageType: 'pretest' | 'posttest', packageId: string) => {
    setAssignments(prev => ({
      ...prev,
      [className]: {
        ...prev[className],
        [packageType]: packageId
      }
    }));
  };

  const saveAssignments = async () => {
    setSaving(true);
    try {
      const promises = classes.map(async (className) => {
        const assignment = assignments[className];
        if (assignment) {
          return SupabaseQuestionService.assignPackagesToClass({
            teacher_id: teacherId,
            class_name: className,
            pretest_package_id: assignment.pretest || undefined,
            posttest_package_id: assignment.posttest || undefined
          });
        }
      });

      await Promise.all(promises);
      
      addToast({
        type: 'success',
        title: 'Assignment berhasil disimpan!',
        message: 'Semua assignment paket soal ke kelas telah disimpan.'
      });
      
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error saving assignments:', error);
      addToast({
        type: 'error',
        title: 'Gagal menyimpan assignment',
        message: 'Terjadi kesalahan saat menyimpan assignment paket soal.'
      });
    }
    setSaving(false);
  };

  const getPackageInfo = (packageId: string) => {
    return packages.find(pkg => pkg.id === packageId);
  };

  const getPretestPackages = () => packages.filter(pkg => pkg.package_type === 'pretest');
  const getPosttestPackages = () => packages.filter(pkg => pkg.package_type === 'posttest');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
        <span className="ml-2 text-muted">Memuat data...</span>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center p-8">
        <Users className="w-16 h-16 text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted mb-2">Belum Ada Kelas</h3>
        <p className="text-muted">
          Anda belum memiliki kelas. Tambahkan siswa terlebih dahulu untuk membuat kelas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Assignment Paket ke Kelas
          </h2>
          <p className="text-muted mt-1">
            Tetapkan paket soal pretest dan posttest untuk setiap kelas
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-ink/20 hover:bg-paper disabled:opacity-50 text-ink px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={saveAssignments}
            disabled={saving}
            className="bg-brand border-2 border-ink hover:bg-brand disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Menyimpan...' : 'Simpan Assignment'}
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-brand-soft border-2 border-ink rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-brand mt-0.5" />
          <div>
            <h3 className="font-medium text-brand mb-1">Informasi Assignment Paket</h3>
            <ul className="text-sm text-muted space-y-1">
              <li>• Jika tidak ada paket yang dipilih, sistem akan menggunakan paket default</li>
              <li>• Paket pretest digunakan untuk mengukur pemahaman awal siswa</li>
              <li>• Paket posttest digunakan untuk mengukur pemahaman akhir setelah pembelajaran</li>
              <li>• Setiap kelas bisa menggunakan paket yang berbeda sesuai kebutuhan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="space-y-4">
        {classes.map((className) => (
          <div key={className} className="bg-paper border-2 border-ink rounded-xl p-6">
            {/* Class Header */}
            <div className="flex items-center mb-6">
              <Users className="w-5 h-5 text-brand mr-2" />
              <h3 className="text-xl font-semibold text-ink">Kelas {className}</h3>
            </div>

            {/* Package Assignment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pretest Package */}
              <div>
                <label className="block text-sm font-medium text-muted mb-3">
                  Paket Pretest
                </label>
                <select
                  value={assignments[className]?.pretest || ''}
                  onChange={(e) => handleAssignmentChange(className, 'pretest', e.target.value)}
                  className="w-full bg-paper border-2 border-ink rounded-lg px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="">Gunakan Paket Default</option>
                  {getPretestPackages().map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} {pkg.is_default ? '(Default)' : ''} - {pkg.question_ids.length} soal
                    </option>
                  ))}
                </select>
                
                {/* Package Info */}
                {assignments[className]?.pretest && (
                  <div className="mt-3 p-3 bg-paper rounded-lg">
                    {(() => {
                      const pkg = getPackageInfo(assignments[className].pretest);
                      return pkg ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>{pkg.question_ids.length} soal</span>
                          </div>
                          {pkg.time_limit && (
                            <div className="flex items-center text-sm text-muted">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{pkg.time_limit} menit</span>
                            </div>
                          )}
                          {pkg.description && (
                            <p className="text-sm text-muted">{pkg.description}</p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Posttest Package */}
              <div>
                <label className="block text-sm font-medium text-muted mb-3">
                  Paket Posttest
                </label>
                <select
                  value={assignments[className]?.posttest || ''}
                  onChange={(e) => handleAssignmentChange(className, 'posttest', e.target.value)}
                  className="w-full bg-paper border-2 border-ink rounded-lg px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="">Gunakan Paket Default</option>
                  {getPosttestPackages().map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} {pkg.is_default ? '(Default)' : ''} - {pkg.question_ids.length} soal
                    </option>
                  ))}
                </select>
                
                {/* Package Info */}
                {assignments[className]?.posttest && (
                  <div className="mt-3 p-3 bg-paper rounded-lg">
                    {(() => {
                      const pkg = getPackageInfo(assignments[className].posttest);
                      return pkg ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>{pkg.question_ids.length} soal</span>
                          </div>
                          {pkg.time_limit && (
                            <div className="flex items-center text-sm text-muted">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{pkg.time_limit} menit</span>
                            </div>
                          )}
                          {pkg.description && (
                            <p className="text-sm text-muted">{pkg.description}</p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-paper border-2 border-ink rounded-xl p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">Ringkasan Assignment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((className) => {
            const pretestPkg = assignments[className]?.pretest ? getPackageInfo(assignments[className].pretest) : null;
            const posttestPkg = assignments[className]?.posttest ? getPackageInfo(assignments[className].posttest) : null;
            
            return (
              <div key={className} className="bg-paper rounded-lg p-4">
                <h4 className="font-medium text-ink mb-3">Kelas {className}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted">Pretest: </span>
                    <span className="text-ink">
                      {pretestPkg ? pretestPkg.name : 'Default System'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted">Posttest: </span>
                    <span className="text-ink">
                      {posttestPkg ? posttestPkg.name : 'Default System'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}