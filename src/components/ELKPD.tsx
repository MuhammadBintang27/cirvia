"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle,
  Lightbulb,
  BookOpen,
  FlaskConical,
  Target,
  ClipboardList,
  X,
  Maximize2,
  Minimize2,
  Save,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SupabaseLKPDService, LKPDData } from "@/lib/supabase-lkpd-service";
import { Student } from "@/types/auth";

interface LKPDSection {
  id: string;
  title: string;
  type: "objective" | "theory" | "procedure" | "observation" | "analysis" | "conclusion";
  content: string | string[];
  isCompleted?: boolean;
}

const lkpdData: LKPDSection[] = [
  {
    id: "0",
    title: "Menulis Hipotesis",
    type: "objective",
    content: "hypothesis-form" // Special marker for hypothesis form
  },
  {
    id: "1",
    title: "Langkah Kerja Rangkaian Seri",
    type: "procedure",
    content: [
      "Buka fitur praktikum interaktif CIRVIA",
      "Pilih Praktikum menggunakan Computer Vision atau Drag & Drop",
      "Susun rangkaian seperti pada gambar di bawah",
      "IMAGE:/lkpd/seri.png",
      "Coba nyalakan dan matikan lampu menggunakan saklar, amatilah apa yang terjadi",
      "Amati perubahan jika satu lampu dilepas pada rangkaian, sehingga tersisa dua lampu yang terdapat pada rangkaian",
      "Catat hasil pengamatan pada tabel"
    ]
  },
  {
    id: "1.5",
    title: "Langkah Kerja Rangkaian Paralel",
    type: "procedure",
    content: [
      "Buka fitur praktikum interaktif CIRVIA",
      "Pilih Praktikum menggunakan Computer Vision atau Drag & Drop",
      "Susun rangkaian seperti pada gambar di bawah",
      "IMAGE:/lkpd/paralel.png",
      "Coba nyalakan dan matikan lampu menggunakan saklar, amatilah apa yang terjadi",
      "Amati perubahan jika satu lampu dilepas pada rangkaian, sehingga tersisa dua lampu yang terdapat pada rangkaian",
      "Catat hasil pengamatan pada tabel"
    ]
  },
  {
    id: "2",
    title: "Tabel Pengamatan",
    type: "observation",
    content: "interactive-table" // Special marker for rendering input table
  },
  {
    id: "3",
    title: "Menguji Hipotesis",
    type: "analysis",
    content: "hypothesis-testing-form" // Special marker for hypothesis testing form
  },
  {
    id: "4",
    title: "Kesimpulan",
    type: "conclusion",
    content: "conclusion-form" // Special marker for conclusion form
  }
];

const getSectionIcon = (type: LKPDSection["type"]) => {
  switch (type) {
    case "objective":
      return <Target className="w-5 h-5" />;
    case "theory":
      return <BookOpen className="w-5 h-5" />;
    case "procedure":
      return <ClipboardList className="w-5 h-5" />;
    case "observation":
      return <FlaskConical className="w-5 h-5" />;
    case "analysis":
      return <Lightbulb className="w-5 h-5" />;
    case "conclusion":
      return <CheckCircle2 className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getSectionColor = (type: LKPDSection["type"]) => {
  switch (type) {
    case "objective":
      return "bg-brand-soft border-ink text-brand";
    case "theory":
      return "bg-purple-100 border-ink text-purple-700";
    case "procedure":
      return "bg-mint-soft border-ink text-emerald-700";
    case "observation":
      return "bg-lamp-soft border-ink text-amber-700";
    case "analysis":
      return "bg-purple-100 border-ink text-purple-700";
    case "conclusion":
      return "bg-purple-100 border-ink text-purple-700";
    default:
      return "bg-ink/20 border-ink text-muted";
  }
};

export default function ELKPD() {
  const { user, isStudent } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Start minimized
  const [isMaximized, setIsMaximized] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Form data state
  const [hypothesisText, setHypothesisText] = useState("");
  const [hypothesisTestingText, setHypothesisTestingText] = useState("");
  const [conclusionText, setConclusionText] = useState("");

  // Observation data state - New structure matching the table
  const [observationData, setObservationData] = useState({
    // Numerical data
    series_5_voltage: "",
    series_5_current: "",
    series_5_resistance: "",
    series_2_voltage: "",
    series_2_current: "",
    series_2_resistance: "",
    parallel_5_voltage: "",
    parallel_5_current: "",
    parallel_5_resistance: "",
    parallel_2_voltage: "",
    parallel_2_current: "",
    parallel_2_resistance: "",
    
    // Text observations for lamp conditions
    lamp_all_on_series_5: "",
    lamp_all_on_series_2: "",
    lamp_all_on_parallel_5: "",
    lamp_all_on_parallel_2: "",
    
    lamp_one_off_series_5: "",
    lamp_one_off_series_2: "",
    lamp_one_off_parallel_5: "",
    lamp_one_off_parallel_2: "",
    
    lamp_brightness_series_5: "",
    lamp_brightness_series_2: "",
    lamp_brightness_parallel_5: "",
    lamp_brightness_parallel_2: "",
  });

  // Load saved data on mount or when opening
  useEffect(() => {
    const loadData = async () => {
      // Only load once, and only when user is logged in
      if (hasLoadedData || !user || !isStudent()) {
        return;
      }

      setIsLoading(true);
      try {
        const data = await SupabaseLKPDService.getLKPDData(user.id);
        if (data) {
          // Load observation data
          setObservationData({
            series_5_voltage: data.series_5_voltage?.toString() || "",
            series_5_current: data.series_5_current?.toString() || "",
            series_5_resistance: data.series_5_resistance?.toString() || "",
            series_2_voltage: data.series_2_voltage?.toString() || "",
            series_2_current: data.series_2_current?.toString() || "",
            series_2_resistance: data.series_2_resistance?.toString() || "",
            parallel_5_voltage: data.parallel_5_voltage?.toString() || "",
            parallel_5_current: data.parallel_5_current?.toString() || "",
            parallel_5_resistance: data.parallel_5_resistance?.toString() || "",
            parallel_2_voltage: data.parallel_2_voltage?.toString() || "",
            parallel_2_current: data.parallel_2_current?.toString() || "",
            parallel_2_resistance: data.parallel_2_resistance?.toString() || "",
            
            lamp_all_on_series_5: data.lamp_all_on_series_5 || "",
            lamp_all_on_series_2: data.lamp_all_on_series_2 || "",
            lamp_all_on_parallel_5: data.lamp_all_on_parallel_5 || "",
            lamp_all_on_parallel_2: data.lamp_all_on_parallel_2 || "",
            
            lamp_one_off_series_5: data.lamp_one_off_series_5 || "",
            lamp_one_off_series_2: data.lamp_one_off_series_2 || "",
            lamp_one_off_parallel_5: data.lamp_one_off_parallel_5 || "",
            lamp_one_off_parallel_2: data.lamp_one_off_parallel_2 || "",
            
            lamp_brightness_series_5: data.lamp_brightness_series_5 || "",
            lamp_brightness_series_2: data.lamp_brightness_series_2 || "",
            lamp_brightness_parallel_5: data.lamp_brightness_parallel_5 || "",
            lamp_brightness_parallel_2: data.lamp_brightness_parallel_2 || "",
          });
          
          setCompletedSections(data.completed_sections || []);
          setLastSaved(data.last_saved_at ? new Date(data.last_saved_at) : null);
          
          // Load form data from analysis_answers and conclusion_answers JSONB fields
          if (data.analysis_answers) {
            const analysisData = typeof data.analysis_answers === 'string' 
              ? JSON.parse(data.analysis_answers) 
              : data.analysis_answers;
            setHypothesisText(analysisData.hypothesis || "");
            setHypothesisTestingText(analysisData.hypothesis_testing || "");
          }
          
          if (data.conclusion_answers) {
            const conclusionData = typeof data.conclusion_answers === 'string'
              ? JSON.parse(data.conclusion_answers)
              : data.conclusion_answers;
            setConclusionText(conclusionData.conclusion || "");
          }
        }
        setHasLoadedData(true);
      } catch (error) {
        console.error("Error loading LKPD data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, isStudent, hasLoadedData]);

  // Auto-save on observation data change
  useEffect(() => {
    if (!isLoading && user && isStudent()) {
      const timer = setTimeout(() => {
        saveData();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [observationData, hypothesisText, hypothesisTestingText, conclusionText, user, isStudent, isLoading]);

  const saveData = async () => {
    if (!user || !isStudent()) return;

    setIsSaving(true);
    try {
      const student = user as Student;
      const lkpdData: LKPDData = {
        student_id: student.id,
        student_name: student.name,
        student_nis: student.nis,
        series_5_voltage: observationData.series_5_voltage ? parseFloat(observationData.series_5_voltage) : undefined,
        series_5_current: observationData.series_5_current ? parseFloat(observationData.series_5_current) : undefined,
        series_5_resistance: observationData.series_5_resistance ? parseFloat(observationData.series_5_resistance) : undefined,
        series_2_voltage: observationData.series_2_voltage ? parseFloat(observationData.series_2_voltage) : undefined,
        series_2_current: observationData.series_2_current ? parseFloat(observationData.series_2_current) : undefined,
        series_2_resistance: observationData.series_2_resistance ? parseFloat(observationData.series_2_resistance) : undefined,
        parallel_5_voltage: observationData.parallel_5_voltage ? parseFloat(observationData.parallel_5_voltage) : undefined,
        parallel_5_current: observationData.parallel_5_current ? parseFloat(observationData.parallel_5_current) : undefined,
        parallel_5_resistance: observationData.parallel_5_resistance ? parseFloat(observationData.parallel_5_resistance) : undefined,
        parallel_2_voltage: observationData.parallel_2_voltage ? parseFloat(observationData.parallel_2_voltage) : undefined,
        parallel_2_current: observationData.parallel_2_current ? parseFloat(observationData.parallel_2_current) : undefined,
        parallel_2_resistance: observationData.parallel_2_resistance ? parseFloat(observationData.parallel_2_resistance) : undefined,
        
        lamp_all_on_series_5: observationData.lamp_all_on_series_5 || undefined,
        lamp_all_on_series_2: observationData.lamp_all_on_series_2 || undefined,
        lamp_all_on_parallel_5: observationData.lamp_all_on_parallel_5 || undefined,
        lamp_all_on_parallel_2: observationData.lamp_all_on_parallel_2 || undefined,
        
        lamp_one_off_series_5: observationData.lamp_one_off_series_5 || undefined,
        lamp_one_off_series_2: observationData.lamp_one_off_series_2 || undefined,
        lamp_one_off_parallel_5: observationData.lamp_one_off_parallel_5 || undefined,
        lamp_one_off_parallel_2: observationData.lamp_one_off_parallel_2 || undefined,
        
        lamp_brightness_series_5: observationData.lamp_brightness_series_5 || undefined,
        lamp_brightness_series_2: observationData.lamp_brightness_series_2 || undefined,
        lamp_brightness_parallel_5: observationData.lamp_brightness_parallel_5 || undefined,
        lamp_brightness_parallel_2: observationData.lamp_brightness_parallel_2 || undefined,
        
        analysis_answers: {
          hypothesis: hypothesisText,
          hypothesis_testing: hypothesisTestingText
        },
        
        conclusion_answers: {
          conclusion: conclusionText
        },
        
        completed_sections: completedSections,
        progress_percentage: (completedSections.length / 6) * 100,
        is_completed: completedSections.length === 6,
      };

      await SupabaseLKPDService.saveLKPDData(lkpdData);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving LKPD data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleObservationChange = (field: string, value: string) => {
    setObservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleComplete = async (sectionId: string) => {
    const newCompleted = completedSections.includes(sectionId)
      ? completedSections.filter(id => id !== sectionId)
      : [...completedSections, sectionId];
    
    setCompletedSections(newCompleted);
    
    // Save to database if user is logged in
    if (user && isStudent()) {
      try {
        await SupabaseLKPDService.updateCompletedSections(user.id, newCompleted);
      } catch (error) {
        console.error("Error updating completed sections:", error);
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 bg-brand border-2 border-ink text-white rounded-full shadow-hard transition-all transform animate-bounce"
      >
        <FileText className="w-5 h-5" />
        <span className="font-bold">Buka E-LKPD</span>
      </button>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-[450px] bg-paper rounded-2xl shadow-hard border-2 border-ink p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
          <p className="text-muted text-sm">Memuat E-LKPD...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 bg-paper rounded-2xl shadow-hard border-2 border-ink transition-all duration-300 ${
        isMaximized
          ? "inset-4"
          : "bottom-6 right-6 w-[450px] max-h-[600px]"
      }`}
      style={{ willChange: isMaximized ? 'auto' : 'transform' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-ink/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-soft rounded-lg">
            <FileText className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h3 className="text-ink font-bold text-xl">E-LKPD Praktikum</h3>
            <p className="text-muted text-sm">
              Lembar Kerja Peserta Didik Digital
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-2 hover:bg-lamp-soft rounded-lg transition-colors text-muted hover:text-ink"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-lamp-soft rounded-lg transition-colors text-muted hover:text-ink"
            title="Minimize"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-paper border-b border-ink/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Progress</span>
          <span className="text-sm font-bold text-brand">
            {completedSections.length}/{lkpdData.length}
          </span>
        </div>
        <div className="w-full h-2 bg-paper rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-500"
            style={{
              width: `${(completedSections.length / lkpdData.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div 
        className="overflow-y-auto p-4 space-y-3 overscroll-contain" 
        style={{ 
          maxHeight: isMaximized ? "calc(100vh - 220px)" : "450px",
          transform: 'translateZ(0)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {lkpdData.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const isCompleted = completedSections.includes(section.id);

          return (
            <div
              key={section.id}
              className={`${getSectionColor(
                section.type
              )} rounded-xl border overflow-hidden transition-all duration-300`}
            >
              {/* Section Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-ink scale-110">{getSectionIcon(section.type)}</div>
                  <div className="flex-1">
                    <h4 className="text-ink font-bold text-base">
                      {section.title}
                    </h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(section.id);
                    }}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <button className="text-muted">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Section Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2">
                  {section.content === "hypothesis-form" ? (
                    /* Render Hypothesis Form */
                    <div className="space-y-4">
                      <p className="text-base text-ink mb-4 leading-relaxed">
                        Setelah mempelajari materi interaktif di web CIRVIA yang sesuai dengan gaya belajar kalian (visual, auditori, atau kinestetik), buatlah dugaan sementara yang dapat diuji.
                      </p>
                      <div className="bg-paper rounded-lg p-4 border border-ink/20">
                        <label className="block text-ink font-semibold mb-3 text-base">
                          Tuliskan Hipotesis Awal Anda tentang Rangkaian:
                        </label>
                        <textarea
                          value={hypothesisText}
                          onChange={(e) => setHypothesisText(e.target.value)}
                          className="w-full bg-paper text-ink px-4 py-3 rounded-lg focus:bg-paper focus:outline-none focus:ring-2 focus:ring-brand resize-none text-base leading-relaxed"
                          placeholder="Tuliskan hipotesis awal Anda sebelum melakukan praktikum..."
                          rows={7}
                        />
                      </div>
                    </div>
                  ) : section.content === "hypothesis-testing-form" ? (
                    /* Render Hypothesis Testing Form */
                    <div className="space-y-4">
                      <p className="text-base text-ink mb-4 leading-relaxed">
                        Analisis hasil data pada tabel dan bandingkan dengan hipotesis kalian.
                      </p>
                      <div className="bg-paper rounded-lg p-4 border border-ink/20">
                        <label className="block text-ink font-semibold mb-3 text-base">
                          Hasil Pengujian Hipotesis:
                        </label>
                        <textarea
                          value={hypothesisTestingText}
                          onChange={(e) => setHypothesisTestingText(e.target.value)}
                          className="w-full bg-paper text-ink px-4 py-3 rounded-lg focus:bg-paper focus:outline-none focus:ring-2 focus:ring-brand resize-none text-base leading-relaxed"
                          placeholder="Bandingkan hasil pengamatan dengan hipotesis awal Anda..."
                          rows={7}
                        />
                      </div>
                    </div>
                  ) : section.content === "conclusion-form" ? (
                    /* Render Conclusion Form */
                    <div className="space-y-4">
                      <p className="text-base text-ink mb-4 leading-relaxed">
                        Setelah menganalisis hasil percobaan, tuliskan kesimpulan akhir secara ilmiah berdasarkan data dan diskusi kelompok.
                      </p>
                      <div className="bg-paper rounded-lg p-4 border border-ink/20">
                        <label className="block text-ink font-semibold mb-2 text-sm">
                          Kesimpulan:
                        </label>
                        <textarea
                          value={conclusionText}
                          onChange={(e) => setConclusionText(e.target.value)}
                          className="w-full bg-paper text-ink px-4 py-3 rounded-lg focus:bg-paper focus:outline-none focus:ring-2 focus:ring-brand resize-none text-sm"
                          placeholder="Tuliskan kesimpulan akhir berdasarkan data dan diskusi kelompok..."
                          rows={8}
                        />
                      </div>
                    </div>
                  ) : section.content === "interactive-table" ? (
                    /* Render Interactive Observation Table - New Structure */
                    <div className="space-y-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-brand-soft">
                              <th className="border-2 border-ink px-3 py-3 text-left text-ink font-bold">Jenis Rangkaian</th>
                              <th className="border-2 border-ink px-3 py-3 text-center text-ink font-bold">Seri (5 Lampu)</th>
                              <th className="border-2 border-ink px-3 py-3 text-center text-ink font-bold">Seri (2 Lampu)</th>
                              <th className="border-2 border-ink px-3 py-3 text-center text-ink font-bold">Paralel (5 Lampu)</th>
                              <th className="border-2 border-ink px-3 py-3 text-center text-ink font-bold">Paralel (2 Lampu)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Row 1: Tegangan Total */}
                            <tr className="bg-paper">
                              <td className="border-2 border-ink px-3 py-2 text-ink font-semibold">Tegangan Total (V)</td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={observationData.series_5_voltage}
                                  onChange={(e) => handleObservationChange('series_5_voltage', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={observationData.series_2_voltage}
                                  onChange={(e) => handleObservationChange('series_2_voltage', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={observationData.parallel_5_voltage}
                                  onChange={(e) => handleObservationChange('parallel_5_voltage', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={observationData.parallel_2_voltage}
                                  onChange={(e) => handleObservationChange('parallel_2_voltage', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.00"
                                />
                              </td>
                            </tr>

                            {/* Row 2: Arus Total */}
                            <tr>
                              <td className="border-2 border-ink px-3 py-2 text-ink font-semibold">Arus Total (A)</td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={observationData.series_5_current}
                                  onChange={(e) => handleObservationChange('series_5_current', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.0000"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={observationData.series_2_current}
                                  onChange={(e) => handleObservationChange('series_2_current', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.0000"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={observationData.parallel_5_current}
                                  onChange={(e) => handleObservationChange('parallel_5_current', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.0000"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={observationData.parallel_2_current}
                                  onChange={(e) => handleObservationChange('parallel_2_current', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.0000"
                                />
                              </td>
                            </tr>

                            {/* Row 3: Hambatan Total */}
                            <tr className="bg-paper">
                              <td className="border-2 border-ink px-3 py-2 text-ink font-semibold">Hambatan Total (Ω)</td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={observationData.series_5_resistance}
                                  onChange={(e) => handleObservationChange('series_5_resistance', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={observationData.series_2_resistance}
                                  onChange={(e) => handleObservationChange('series_2_resistance', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={observationData.parallel_5_resistance}
                                  onChange={(e) => handleObservationChange('parallel_5_resistance', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={observationData.parallel_2_resistance}
                                  onChange={(e) => handleObservationChange('parallel_2_resistance', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="0.00"
                                />
                              </td>
                            </tr>

                            {/* Row 4: Kondisi Lampu ketika semua saklar dihidupkan */}
                            <tr>
                              <td className="border-2 border-ink px-3 py-2 text-ink font-semibold">Kondisi Lampu ketika semua saklar dihidupkan</td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_all_on_series_5}
                                  onChange={(e) => handleObservationChange('lamp_all_on_series_5', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Kondisi..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_all_on_series_2}
                                  onChange={(e) => handleObservationChange('lamp_all_on_series_2', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Kondisi..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_all_on_parallel_5}
                                  onChange={(e) => handleObservationChange('lamp_all_on_parallel_5', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Kondisi..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_all_on_parallel_2}
                                  onChange={(e) => handleObservationChange('lamp_all_on_parallel_2', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Kondisi..."
                                />
                              </td>
                            </tr>

                            {/* Row 5: Kondisi Lampu jika salah satu saklar dimatikan */}
                            <tr className="bg-paper">
                              <td className="border-2 border-ink px-3 py-2 text-ink font-semibold">Kondisi Lampu jika salah satu saklar dimatikan</td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_one_off_series_5}
                                  onChange={(e) => handleObservationChange('lamp_one_off_series_5', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Kondisi..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_one_off_series_2}
                                  onChange={(e) => handleObservationChange('lamp_one_off_series_2', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Kondisi..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_one_off_parallel_5}
                                  onChange={(e) => handleObservationChange('lamp_one_off_parallel_5', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Kondisi..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_one_off_parallel_2}
                                  onChange={(e) => handleObservationChange('lamp_one_off_parallel_2', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Kondisi..."
                                />
                              </td>
                            </tr>

                            {/* Row 6: Kondisi Tingkat Kecerahan Lampu */}
                            <tr>
                              <td className="border-2 border-ink px-3 py-2 text-ink font-semibold">Kondisi Tingkat Kecerahan Lampu</td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_brightness_series_5}
                                  onChange={(e) => handleObservationChange('lamp_brightness_series_5', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Terang/Redup..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_brightness_series_2}
                                  onChange={(e) => handleObservationChange('lamp_brightness_series_2', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Terang/Redup..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_brightness_parallel_5}
                                  onChange={(e) => handleObservationChange('lamp_brightness_parallel_5', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Terang/Redup..."
                                />
                              </td>
                              <td className="border-2 border-ink px-2 py-1">
                                <input
                                  type="text"
                                  value={observationData.lamp_brightness_parallel_2}
                                  onChange={(e) => handleObservationChange('lamp_brightness_parallel_2', e.target.value)}
                                  className="w-full bg-paper text-ink text-center px-2 py-1.5 rounded focus:bg-paper focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                                  placeholder="Terang/Redup..."
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Auto-save indicator */}
                      <div className="flex items-center justify-between text-xs text-muted mt-4">
                        <div className="flex items-center gap-2">
                          {isSaving ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Menyimpan...</span>
                            </>
                          ) : lastSaved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Tersimpan otomatis {lastSaved.toLocaleTimeString('id-ID')}</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3 h-3" />
                              <span>Data akan tersimpan otomatis</span>
                            </>
                          )}
                        </div>
                        {!user && (
                          <span className="text-amber-700">Login untuk menyimpan data</span>
                        )}
                      </div>
                    </div>
                  ) : Array.isArray(section.content) ? (
                    <ul className="space-y-2">
                      {section.content.map((item, idx) => {
                        // Check if item is an image marker
                        if (item.startsWith('IMAGE:')) {
                          const imagePath = item.replace('IMAGE:', '');
                          return (
                            <li key={idx} className="my-4 list-none">
                              <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden border-2 border-ink bg-paper">
                                <Image 
                                  src={imagePath} 
                                  alt="Diagram Rangkaian" 
                                  fill
                                  className="object-contain p-2"
                                  priority
                                  sizes="(max-width: 768px) 100vw, 448px"
                                />
                              </div>
                            </li>
                          );
                        }
                        // Regular list item
                        return (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-base text-ink leading-relaxed"
                          >
                            <span className="text-brand mt-1 text-lg">•</span>
                            <span>{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="text-sm text-ink whitespace-pre-line font-mono">
                      {section.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-ink/20 bg-paper">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Tandai selesai setiap bagian yang sudah dikerjakan</span>
          {completedSections.length === lkpdData.length && (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Selesai!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
