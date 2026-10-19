'use client';
import { Ico } from "@/components/ui/Ico";

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-paper rounded-3xl border-2 border-ink w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-ink/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-mint-soft rounded-xl flex items-center justify-center border-2 border-ink">
                <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink">Import Data Siswa</h2>
                <p className="text-muted">Upload file Excel untuk menambah siswa secara massal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-ink transition-colors"
            >
              <Ico n="x" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {currentStep === 'upload' && (
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-brand-soft rounded-xl p-6 border-2 border-ink">
                <h3 className="text-lg font-bold text-ink mb-4">Format File Excel</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-brand font-medium mb-3">Kolom Wajib:</h4>
                    <ul className="space-y-2 text-muted text-sm">
                      <li>• <span className="font-medium">Nama Lengkap</span> - Nama siswa sesuai KTP/Kartu Pelajar</li>
                      <li>• <span className="font-medium">NIS</span> - Nomor Induk Siswa (akan digunakan sebagai password)</li>
                      <li>• <span className="font-medium">Kelas</span> - Kelas siswa (contoh: X-IPA-1)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-brand font-medium mb-3">Kolom Opsional:</h4>
                    <ul className="space-y-2 text-muted text-sm">
                      <li>• <span className="font-medium">Email</span> - Alamat email siswa</li>
                      <li>• <span className="font-medium">No. HP</span> - Nomor telepon siswa</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="mt-4 flex items-center px-4 py-2 bg-brand-soft hover:bg-brand-soft border-2 border-ink rounded-xl text-brand hover:text-ink transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template Excel
                </button>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-ink rounded-xl p-8 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
                
                <div className="w-16 h-16 bg-mint-soft rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-ink">
                  <Upload className="w-8 h-8 text-emerald-700" />
                </div>
                
                <h3 className="text-xl font-bold text-ink mb-2">Upload File Excel</h3>
                <p className="text-muted mb-6">Pilih file Excel (.xlsx atau .xls) yang berisi data siswa</p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-mint-soft hover:bg-mint-soft border-2 border-ink rounded-xl text-emerald-700 hover:text-ink font-medium transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Memproses...' : 'Pilih File Excel'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-ink">Preview Data Siswa</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep('upload')}
                    className="px-4 py-2 bg-ink/20 hover:bg-ink/30 border-2 border-ink rounded-xl text-muted hover:text-ink transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={validStudents.length === 0 || isProcessing}
                    className="px-6 py-2 bg-mint-soft hover:bg-mint-soft border-2 border-ink rounded-xl text-emerald-700 hover:text-ink font-medium transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Mengimpor...' : `Import ${validStudents.length} Siswa`}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-brand-soft rounded-xl p-4 border-2 border-ink">
                  <div className="flex items-center justify-between">
                    <Users className="w-8 h-8 text-brand" />
                    <span className="text-2xl font-bold text-ink">{parsedData.length}</span>
                  </div>
                  <p className="text-muted font-medium mt-2">Total Data</p>
                </div>
                <div className="bg-mint-soft rounded-xl p-4 border-2 border-ink">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="w-8 h-8 text-emerald-700" />
                    <span className="text-2xl font-bold text-ink">{validStudents.length}</span>
                  </div>
                  <p className="text-emerald-700 font-medium mt-2">Data Valid</p>
                </div>
                <div className="bg-coral-soft rounded-xl p-4 border-2 border-ink">
                  <div className="flex items-center justify-between">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <span className="text-2xl font-bold text-ink">{invalidStudents.length}</span>
                  </div>
                  <p className="text-red-600 font-medium mt-2">Data Error</p>
                </div>
              </div>

              {/* Valid Students Table */}
              {validStudents.length > 0 && (
                <div className="bg-paper rounded-xl border border-ink/20 overflow-hidden">
                  <div className="p-4 bg-mint-soft border-b border-ink">
                    <h4 className="text-emerald-700 font-medium">Data Valid ({validStudents.length})</h4>
                  </div>
                  <div className="overflow-x-auto max-h-64">
                    <table className="w-full">
                      <thead className="bg-paper">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted">Nama</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted">NIS</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted">Kelas</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validStudents.map((student, index) => (
                          <tr key={index} className="border-t border-ink/20">
                            <td className="px-4 py-2 text-ink">{student.name}</td>
                            <td className="px-4 py-2 text-ink">{student.nis}</td>
                            <td className="px-4 py-2 text-ink">{student.class}</td>
                            <td className="px-4 py-2 text-ink">{student.email || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Invalid Students */}
              {invalidStudents.length > 0 && (
                <div className="bg-paper rounded-xl border border-ink/20 overflow-hidden">
                  <div className="p-4 bg-coral-soft border-b border-ink">
                    <h4 className="text-red-600 font-medium">Data Error ({invalidStudents.length})</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {invalidStudents.map((student, index) => (
                      <div key={index} className="p-4 border-t border-ink/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-ink font-medium">Baris {student.rowNumber}</span>
                          <span className="text-red-600 text-sm">{student.errors.length} error</span>
                        </div>
                        <ul className="space-y-1">
                          {student.errors.map((error, errorIndex) => (
                            <li key={errorIndex} className="text-red-600 text-sm flex items-center">
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
              <div className="w-16 h-16 bg-mint-soft rounded-full flex items-center justify-center mx-auto border-2 border-ink">
                <CheckCircle className="w-8 h-8 text-emerald-700" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-ink mb-2">Import Selesai!</h3>
                <p className="text-emerald-700 text-lg">
                  {importResults.successful} siswa berhasil diimpor
                </p>
              </div>

              {importResults.failed.length > 0 && (
                <div className="bg-lamp-soft rounded-xl p-4 border-2 border-ink text-left">
                  <h4 className="text-amber-700 font-medium mb-2">Beberapa data gagal diimpor:</h4>
                  <ul className="space-y-1 text-amber-700 text-sm">
                    {importResults.failed.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-6 py-3 bg-brand-soft hover:bg-brand-soft border-2 border-ink rounded-xl text-brand hover:text-ink font-medium transition-all"
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