'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Download, Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseAuthService } from '@/lib/supabase-auth-service';
import { StudentImportData } from '@/types/auth';

interface ExcelImportProps {
  onImportComplete: (importedStudents: number) => void;
  onClose: () => void;
}

interface ParsedStudent extends StudentImportData {
  rowNumber: number;
  errors: string[];
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onImportComplete, onClose }) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
  const [importResults, setImportResults] = useState<{
    successful: number;
    failed: string[];
  } | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'results'>('upload');

  const expectedColumns = [
    { key: 'name', label: 'Nama Lengkap', required: true },
    { key: 'nis', label: 'NIS', required: true },
    { key: 'class', label: 'Kelas', required: true },
    { key: 'email', label: 'Email', required: false },
    { key: 'phoneNumber', label: 'No. HP', required: false },
  ];

  const validateStudent = (student: any, rowNumber: number): ParsedStudent => {
    const errors: string[] = [];
    const parsedStudent: ParsedStudent = {
      rowNumber,
      errors,
      name: '',
      nis: '',
      class: '',
      email: '',
      phoneNumber: '',
    };

    // Validate name
    if (!student.name || typeof student.name !== 'string' || student.name.trim().length === 0) {
      errors.push('Nama tidak boleh kosong');
    } else {
      parsedStudent.name = student.name.trim();
    }

    // Validate NIS
    if (!student.nis) {
      errors.push('NIS tidak boleh kosong');
    } else {
      const nisStr = String(student.nis).trim();
      if (nisStr.length === 0) {
        errors.push('NIS tidak boleh kosong');
      } else {
        parsedStudent.nis = nisStr;
      }
    }

    // Validate class
    if (!student.class || typeof student.class !== 'string' || student.class.trim().length === 0) {
      errors.push('Kelas tidak boleh kosong');
    } else {
      parsedStudent.class = student.class.trim();
    }

    // Optional fields
    if (student.email && typeof student.email === 'string') {
      const email = student.email.trim();
      if (email.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push('Format email tidak valid');
        } else {
          parsedStudent.email = email;
        }
      }
    }

    if (student.phoneNumber) {
      parsedStudent.phoneNumber = String(student.phoneNumber).trim();
    }

    return parsedStudent;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header mapping
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: '' 
      }) as any[][];

      if (jsonData.length < 2) {
        throw new Error('File Excel harus memiliki minimal 1 baris header dan 1 baris data');
      }

      // Get headers from first row
      const headers = jsonData[0];
      
      // Map headers to expected columns (case insensitive)
      const columnMapping: { [key: string]: number } = {};
      expectedColumns.forEach(col => {
        const headerIndex = headers.findIndex((header: any) => 
          typeof header === 'string' && 
          header.toLowerCase().includes(col.label.toLowerCase()) ||
          header.toLowerCase().includes(col.key.toLowerCase())
        );
        if (headerIndex !== -1) {
          columnMapping[col.key] = headerIndex;
        }
      });

      // Check required columns
      const missingRequired = expectedColumns
        .filter(col => col.required && !(col.key in columnMapping))
        .map(col => col.label);

      if (missingRequired.length > 0) {
        throw new Error(`Kolom wajib tidak ditemukan: ${missingRequired.join(', ')}`);
      }

      // Parse data rows
      const students: ParsedStudent[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row.every(cell => !cell || String(cell).trim() === '')) {
          continue; // Skip empty rows
        }

        const studentData: any = {};
        expectedColumns.forEach(col => {
          const colIndex = columnMapping[col.key];
          if (colIndex !== undefined) {
            studentData[col.key] = row[colIndex];
          }
        });

        const validatedStudent = validateStudent(studentData, i + 1);
        students.push(validatedStudent);
      }

      if (students.length === 0) {
        throw new Error('Tidak ada data siswa yang valid ditemukan');
      }

      setParsedData(students);
      setCurrentStep('preview');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal memproses file Excel');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!user || user.role !== 'teacher') return;

    setIsProcessing(true);
    
    try {
      const validStudents = parsedData.filter(student => student.errors.length === 0);
      const studentData: StudentImportData[] = validStudents.map(student => ({
        name: student.name,
        nis: student.nis,
        class: student.class,
        email: student.email || undefined,
        phoneNumber: student.phoneNumber || undefined,
      }));

      const importedStudents = await SupabaseAuthService.createStudentsBulk(user.id, studentData);
      
      const failedStudents = parsedData
        .filter(student => student.errors.length > 0)
        .map(student => `Baris ${student.rowNumber}: ${student.errors.join(', ')}`);

      setImportResults({
        successful: importedStudents.length,
        failed: failedStudents,
      });

      setCurrentStep('results');
      onImportComplete(importedStudents.length);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal mengimpor data siswa');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['Nama Lengkap', 'NIS', 'Kelas', 'Email', 'No. HP'],
      ['Ahmad Budi Santoso', '220001', 'X-IPA-1', 'ahmad@email.com', '081234567890'],
      ['Siti Nurhaliza', '220002', 'X-IPA-1', 'siti@email.com', '081234567891'],
      ['Bayu Pratama', '220003', 'X-IPA-2', 'bayu@email.com', '081234567892'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Siswa');
    
    XLSX.writeFile(wb, 'template_siswa.xlsx');
  };

  const validStudents = parsedData.filter(student => student.errors.length === 0);
  const invalidStudents = parsedData.filter(student => student.errors.length > 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-xl flex items-center justify-center border border-emerald-400/30">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Import Data Siswa</h2>
                <p className="text-blue-200/80">Upload file Excel untuk menambah siswa secara massal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {currentStep === 'upload' && (
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-6 border border-blue-400/30">
                <h3 className="text-lg font-bold text-white mb-4">📋 Format File Excel</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-blue-300 font-medium mb-3">Kolom Wajib:</h4>
                    <ul className="space-y-2 text-blue-200/80 text-sm">
                      <li>• <span className="font-medium">Nama Lengkap</span> - Nama siswa sesuai KTP/Kartu Pelajar</li>
                      <li>• <span className="font-medium">NIS</span> - Nomor Induk Siswa (akan digunakan sebagai password)</li>
                      <li>• <span className="font-medium">Kelas</span> - Kelas siswa (contoh: X-IPA-1)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-blue-300 font-medium mb-3">Kolom Opsional:</h4>
                    <ul className="space-y-2 text-blue-200/80 text-sm">
                      <li>• <span className="font-medium">Email</span> - Alamat email siswa</li>
                      <li>• <span className="font-medium">No. HP</span> - Nomor telepon siswa</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="mt-4 flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template Excel
                </button>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
                
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
                  <Upload className="w-8 h-8 text-emerald-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Upload File Excel</h3>
                <p className="text-blue-200/80 mb-6">Pilih file Excel (.xlsx atau .xls) yang berisi data siswa</p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-xl text-emerald-300 hover:text-white font-medium transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Memproses...' : 'Pilih File Excel'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Preview Data Siswa</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep('upload')}
                    className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-xl text-gray-300 hover:text-white transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={validStudents.length === 0 || isProcessing}
                    className="px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-xl text-emerald-300 hover:text-white font-medium transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Mengimpor...' : `Import ${validStudents.length} Siswa`}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/30">
                  <div className="flex items-center justify-between">
                    <Users className="w-8 h-8 text-blue-400" />
                    <span className="text-2xl font-bold text-white">{parsedData.length}</span>
                  </div>
                  <p className="text-blue-200 font-medium mt-2">Total Data</p>
                </div>
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-400/30">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                    <span className="text-2xl font-bold text-white">{validStudents.length}</span>
                  </div>
                  <p className="text-emerald-200 font-medium mt-2">Data Valid</p>
                </div>
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-400/30">
                  <div className="flex items-center justify-between">
                    <XCircle className="w-8 h-8 text-red-400" />
                    <span className="text-2xl font-bold text-white">{invalidStudents.length}</span>
                  </div>
                  <p className="text-red-200 font-medium mt-2">Data Error</p>
                </div>
              </div>

              {/* Valid Students Table */}
              {validStudents.length > 0 && (
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="p-4 bg-emerald-500/10 border-b border-emerald-400/30">
                    <h4 className="text-emerald-300 font-medium">✅ Data Valid ({validStudents.length})</h4>
                  </div>
                  <div className="overflow-x-auto max-h-64">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-blue-200">Nama</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-blue-200">NIS</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-blue-200">Kelas</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-blue-200">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validStudents.map((student, index) => (
                          <tr key={index} className="border-t border-white/5">
                            <td className="px-4 py-2 text-white">{student.name}</td>
                            <td className="px-4 py-2 text-white">{student.nis}</td>
                            <td className="px-4 py-2 text-white">{student.class}</td>
                            <td className="px-4 py-2 text-white">{student.email || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Invalid Students */}
              {invalidStudents.length > 0 && (
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="p-4 bg-red-500/10 border-b border-red-400/30">
                    <h4 className="text-red-300 font-medium">❌ Data Error ({invalidStudents.length})</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {invalidStudents.map((student, index) => (
                      <div key={index} className="p-4 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Baris {student.rowNumber}</span>
                          <span className="text-red-300 text-sm">{student.errors.length} error</span>
                        </div>
                        <ul className="space-y-1">
                          {student.errors.map((error, errorIndex) => (
                            <li key={errorIndex} className="text-red-200/80 text-sm flex items-center">
                              <AlertCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'results' && importResults && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Import Selesai!</h3>
                <p className="text-emerald-300 text-lg">
                  {importResults.successful} siswa berhasil diimpor
                </p>
              </div>

              {importResults.failed.length > 0 && (
                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-400/30 text-left">
                  <h4 className="text-yellow-300 font-medium mb-2">⚠️ Beberapa data gagal diimpor:</h4>
                  <ul className="space-y-1 text-yellow-200/80 text-sm">
                    {importResults.failed.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white font-medium transition-all"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelImport;