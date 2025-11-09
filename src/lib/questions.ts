// ==========================================
// CIRVIA — Question Interfaces & Default Packages
// ==========================================

// ===== Circuit Template System untuk Reusable Circuits =====
export type CircuitTemplateType = 'mixed-series-parallel' | 'multi-parallel-series' | 'nested-series-parallel';

// Circuit Templates yang bisa digunakan ulang
export const CIRCUIT_TEMPLATES = {
  // Template 1: Rangkaian 2 seri + 1 paralel
  'mixed-series-parallel': {
    components: [
      { id: 'battery', type: 'source', label: '12V', position: { x: 60, y: 200 } },
      { id: 'j1', type: 'junction', label: '', position: { x: 140, y: 200 } },
      { id: 'j2', type: 'junction', label: '', position: { x: 420, y: 200 } },
      { id: 'j3', type: 'junction', label: '', position: { x: 140, y: 300 } },
      { id: 'L1', type: 'lamp', label: 'L1', position: { x: 200, y: 140 } },
      { id: 'L2', type: 'lamp', label: 'L2', position: { x: 300, y: 140 } },
      { id: 'L3', type: 'lamp', label: 'L3', position: { x: 200, y: 200 } },
      { id: 'L4', type: 'lamp', label: 'L4', position: { x: 300, y: 200 } },
      { id: 'L5', type: 'lamp', label: 'L5', position: { x: 280, y: 260 } },
    ],
    connections: [
      { id: 'c1', from: 'battery', to: 'j1', type: 'series' },
      { id: 'c2', from: 'j1', to: 'L1', type: 'parallel' },
      { id: 'c3', from: 'L1', to: 'L2', type: 'series' },
      { id: 'c4', from: 'L2', to: 'j2', type: 'series' },
      { id: 'c5', from: 'j1', to: 'L3', type: 'parallel' },
      { id: 'c6', from: 'L3', to: 'L4', type: 'series' },
      { id: 'c7', from: 'L4', to: 'j2', type: 'series' },
      { id: 'c8', from: 'j1', to: 'L5', type: 'parallel' },
      { id: 'c9', from: 'L5', to: 'j2', type: 'series' },
      { id: 'c10', from: 'j2', to: 'j3', type: 'series' },
      { id: 'c11', from: 'j3', to: 'battery', type: 'series' },
    ],
  },

  // Template 2: Rangkaian 3 jalur paralel dengan seri internal
  'multi-parallel-series': {
    components: [
      { id: 'battery', type: 'source', label: '12V', position: { x: 60, y: 200 } },
      { id: 'j1', type: 'junction', label: '', position: { x: 140, y: 200 } },
      { id: 'j2', type: 'junction', label: '', position: { x: 380, y: 200 } },
      { id: 'j3', type: 'junction', label: '', position: { x: 140, y: 300 } },
      { id: 'L1', type: 'lamp', label: 'L1', position: { x: 200, y: 140 } },
      { id: 'L2', type: 'lamp', label: 'L2', position: { x: 280, y: 140 } },
      { id: 'L3', type: 'lamp', label: 'L3', position: { x: 200, y: 200 } },
      { id: 'L4', type: 'lamp', label: 'L4', position: { x: 280, y: 200 } },
      { id: 'L5', type: 'lamp', label: 'L5', position: { x: 240, y: 260 } },
    ],
    connections: [
      { id: 'c1', from: 'battery', to: 'j1', type: 'series' },
      { id: 'c2', from: 'j1', to: 'L1', type: 'parallel' },
      { id: 'c3', from: 'L1', to: 'L2', type: 'series' },
      { id: 'c4', from: 'L2', to: 'j2', type: 'series' },
      { id: 'c5', from: 'j1', to: 'L3', type: 'parallel' },
      { id: 'c6', from: 'L3', to: 'L4', type: 'series' },
      { id: 'c7', from: 'L4', to: 'j2', type: 'series' },
      { id: 'c8', from: 'j1', to: 'L5', type: 'parallel' },
      { id: 'c9', from: 'L5', to: 'j2', type: 'series' },
      { id: 'c10', from: 'j2', to: 'j3', type: 'series' },
      { id: 'c11', from: 'j3', to: 'battery', type: 'series' },
    ],
  },

  // Template 3: Rangkaian bertingkat - seri di dalam paralel
  'nested-series-parallel': {
    components: [
      { id: 'battery', type: 'source', label: '12V', position: { x: 60, y: 200 } },
      { id: 'j1', type: 'junction', label: '', position: { x: 140, y: 200 } },
      { id: 'j2', type: 'junction', label: '', position: { x: 380, y: 200 } },
      { id: 'j3', type: 'junction', label: '', position: { x: 140, y: 320 } },
      { id: 'L1', type: 'lamp', label: 'L1', position: { x: 240, y: 120 } },
      { id: 'L2', type: 'lamp', label: 'L2', position: { x: 200, y: 200 } },
      { id: 'L3', type: 'lamp', label: 'L3', position: { x: 280, y: 200 } },
      { id: 'L4', type: 'lamp', label: 'L4', position: { x: 200, y: 280 } },
      { id: 'L5', type: 'lamp', label: 'L5', position: { x: 280, y: 280 } },
    ],
    connections: [
      { id: 'c1', from: 'battery', to: 'j1', type: 'series' },
      { id: 'c2', from: 'j1', to: 'L1', type: 'parallel' },
      { id: 'c3', from: 'L1', to: 'j2', type: 'series' },
      { id: 'c4', from: 'j1', to: 'L2', type: 'parallel' },
      { id: 'c5', from: 'L2', to: 'L3', type: 'series' },
      { id: 'c6', from: 'L3', to: 'j2', type: 'series' },
      { id: 'c7', from: 'j1', to: 'L4', type: 'parallel' },
      { id: 'c8', from: 'L4', to: 'L5', type: 'series' },
      { id: 'c9', from: 'L5', to: 'j2', type: 'series' },
      { id: 'c10', from: 'j2', to: 'j3', type: 'series' },
      { id: 'c11', from: 'j3', to: 'battery', type: 'series' },
    ],
  },
} as const;

// ===== Base interface untuk semua tipe soal =====
export interface BaseQuestion {
  id: number | string;
  questionType: 'circuit' | 'circuitOrdering' | 'conceptual' | 'circuitAnalysis';
  title: string;
  description: string;
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ===== Circuit (TipeSoal1) =====
export interface CircuitQuestion extends BaseQuestion {
  questionType: 'circuit';
  circuitType: 'series' | 'parallel';
  voltage: number;
  targetCurrent?: number;
  targetVoltage?: number;
  resistorSlots: number;
  // Teacher-defined settings (same as form)
  availableResistors?: number[]; // Array of available resistor values for students
  correctSolution?: number[]; // Array of correct resistor values
}

// ===== Conceptual (TipeSoal3) — multi-select =====
export interface ConceptualQuestion extends BaseQuestion {
  questionType: 'conceptual';
  question: string;
  choices: { id: string; text: string; isCorrect: boolean }[];
  correctAnswers: string[];
}

// ===== Circuit primitives untuk analisis rangkaian =====
export interface CircuitComponent {
  id: string;
  type: 'source' | 'lamp' | 'junction';
  label: string;
  position: { x: number; y: number };
}

export interface CircuitConnection {
  id: string;
  from: string;
  to: string;
  type: 'series' | 'parallel';
}

// ===== Circuit Analysis (TipeSoal4) =====
export interface CircuitAnalysisQuestion extends BaseQuestion {
  questionType: 'circuitAnalysis';
  question: string;
  circuit: CircuitTemplateType | { components: CircuitComponent[]; connections: CircuitConnection[] };
  targetLamp: string;
  correctStates: { [lampId: string]: 'on' | 'off' };
}

// ===== Circuit Ordering (TipeSoal2) =====
export interface CircuitOrderingQuestion extends BaseQuestion {
  questionType: 'circuitOrdering';
  orderingType: 'current' | 'voltage' | 'resistance' | 'power' | 'brightness';
  question: string; // Main question text from database
  instruction: string; // UI instruction (can be derived from orderingType)
  circuits: {
    id: string;
    name: string;
    template: 'simple' | 'series' | 'parallel' | 'mixed' | 'complex-series' | 'complex-parallel' | 'mixed-advanced';
    voltage: number;
    resistors: { id: string; value: number; color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'brown' | 'orange' }[];
    lamps: { id: string; power: number }[];
    brightnessLevel: 'high' | 'medium' | 'low';
    totalCurrent?: number;
    description?: string;
  }[]; // Parsed from circuit_items jsonb
  correctOrder: string[]; // Circuit IDs in correct order (mapped from integer[] indices)
}

// ===== Union type untuk semua tipe soal yang masih aktif =====
export type Question =
  | CircuitQuestion
  | CircuitOrderingQuestion
  | ConceptualQuestion
  | CircuitAnalysisQuestion;

// ===== Helper Functions untuk Circuit Templates =====
export function resolveCircuitTemplate(
  circuit: CircuitTemplateType | { components: CircuitComponent[]; connections: CircuitConnection[] }
): { components: CircuitComponent[]; connections: CircuitConnection[] } {
  if (typeof circuit === 'string') {
    const template = CIRCUIT_TEMPLATES[circuit];
    return {
      components: [...template.components] as CircuitComponent[],
      connections: [...template.connections] as CircuitConnection[]
    };
  }
  return circuit;
}

// ===== Resistor data interface =====
// Interface untuk resistor yang akan didefinisikan oleh guru
export interface Resistor {
  id: number;
  value: number;
  colorCode?: string[];
  label: string;
}



// ==========================================
// DEFAULT PACKAGES - Fetch from Database
// ==========================================

/**
 * Import service untuk fetch default packages dari database
 */
import { SupabaseQuestionService } from './supabase-question-service'

/**
 * Fetch default pretest package dari database
 * Gunakan ini untuk menggantikan DEFAULT_PRETEST_PACKAGE yang hardcoded
 */
export async function getDefaultPretestPackage(): Promise<Question[]> {
  const { questions } = await SupabaseQuestionService.getDefaultPretestPackage()
  return questions
}

/**
 * Fetch default posttest package dari database  
 * Gunakan ini untuk menggantikan DEFAULT_POSTTEST_PACKAGE yang hardcoded
 */
export async function getDefaultPosttestPackage(): Promise<Question[]> {
  const { questions } = await SupabaseQuestionService.getDefaultPosttestPackage()
  return questions
}

/**
 * Check jika default packages sudah ada di database
 */
export async function checkDefaultPackagesExist() {
  return await SupabaseQuestionService.checkDefaultPackagesExist()
}


// ===== Helper skor =====
export const calculateQuizScore = (
  correctAnswers: number,
  totalQuestions: number,
): { score: number; grade: string; message: string } => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  if (percentage >= 90)
    return { score: percentage, grade: 'A+', message: '🎉 Luar biasa! Anda menguasai konsep rangkaian listrik dengan sempurna!' };
  if (percentage >= 80)
    return { score: percentage, grade: 'A', message: '⭐ Sangat baik! Pemahaman Anda tentang rangkaian listrik sangat solid!' };
  if (percentage >= 70)
    return { score: percentage, grade: 'B+', message: '👍 Bagus! Anda memahami konsep dasar dengan baik, terus berlatih!' };
  if (percentage >= 60)
    return { score: percentage, grade: 'B', message: '📚 Cukup baik! Tinjau kembali hukum Ohm & konfigurasi rangkaian.' };
  if (percentage >= 50)
    return { score: percentage, grade: 'C', message: '💪 Terus semangat! Fokus pada dasar hukum Ohm dan latihan lebih banyak.' };
  return { score: percentage, grade: 'D', message: '🎯 Jangan menyerah! Mulai dari konsep dasar dan berlatih bertahap.' };
};
