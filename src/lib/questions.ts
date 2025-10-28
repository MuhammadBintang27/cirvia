// ==========================================
// CIRVIA — Question Interfaces & Sample Data (cleaned version)
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
  availableResistors: Resistor[];
  correctSolution: number[];
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

// ===== Circuit Ordering (TipeSoal5) =====
export interface CircuitOrderingQuestion extends BaseQuestion {
  questionType: 'circuitOrdering';
  instruction: string;
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
  }[];
  correctOrder: string[];
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

// ===== Resistor data =====
export interface Resistor {
  id: number;
  value: number;
  colorCode: string[];
  label: string;
}

export const availableResistors: Resistor[] = [
  { id: 1, value: 10, colorCode: ['brown', 'black', 'black'], label: '10Ω' },
  { id: 2, value: 22, colorCode: ['red', 'red', 'black'], label: '22Ω' },
  { id: 3, value: 47, colorCode: ['yellow', 'violet', 'black'], label: '47Ω' },
  { id: 4, value: 100, colorCode: ['brown', 'black', 'brown'], label: '100Ω' },
  { id: 5, value: 220, colorCode: ['red', 'red', 'brown'], label: '220Ω' },
  { id: 6, value: 330, colorCode: ['orange', 'orange', 'brown'], label: '330Ω' },
  { id: 7, value: 470, colorCode: ['yellow', 'violet', 'brown'], label: '470Ω' },
  { id: 8, value: 1000, colorCode: ['brown', 'black', 'red'], label: '1kΩ' },
  { id: 9, value: 2200, colorCode: ['red', 'red', 'red'], label: '2.2kΩ' },
  { id: 10, value: 4700, colorCode: ['yellow', 'violet', 'red'], label: '4.7kΩ' },
];

// ===== Soal Circuit (konstruksi/target) =====
export const circuitQuestions: CircuitQuestion[] = [
  {
    id: 1,
    questionType: 'circuit',
    title: 'Rangkaian Seri Sederhana',
    description: 'Susun dua resistor seri untuk arus ≈ 0.1 A (V=12V).',
    explanation: 'R_total ≈ 120Ω diperlukan. Contoh solusi: 47Ω + 100Ω = 147Ω → I ≈ 0.082A (mendekati).',
    hint: 'Pada seri: R_total = R1 + R2. Targetkan R_total ≈ V/I.',
    difficulty: 'easy',
    circuitType: 'series',
    voltage: 12,
    targetCurrent: 0.1,
    resistorSlots: 2,
    availableResistors: availableResistors.slice(0, 6),
    correctSolution: [47, 100],
  },
  {
    id: 2,
    questionType: 'circuit',
    title: 'Rangkaian Paralel Dasar',
    description: 'Buat dua resistor paralel untuk I_total ≈ 0.2 A (V=9V).',
    explanation: 'R_target = V/I ≈ 45Ω. 100Ω || 100Ω → R_eq = 50Ω → I ≈ 0.18A (mendekati).',
    hint: 'Paralel: 1/R_eq = 1/R1 + 1/R2.',
    difficulty: 'easy',
    circuitType: 'parallel',
    voltage: 9,
    targetCurrent: 0.2,
    resistorSlots: 2,
    availableResistors: availableResistors.slice(2, 8),
    correctSolution: [100, 100],
  },
  {
    id: 3,
    questionType: 'circuit',
    title: 'Rangkaian Seri — Tegangan Target',
    description: 'Tiga resistor seri, capai V_R2 ≈ 4V (V_s=15V).',
    explanation: 'R_total = 220+100+330 = 650Ω → I ≈ 0.023A → V_R2 ≈ 2.3V (contoh tidak persis, untuk latihan pemahaman).',
    hint: 'Pada seri, V_i = I × R_i.',
    difficulty: 'medium',
    circuitType: 'series',
    voltage: 15,
    targetVoltage: 4,
    resistorSlots: 3,
    availableResistors: availableResistors.slice(1, 9),
    correctSolution: [220, 100, 330],
  },
  {
    id: 4,
    questionType: 'circuit',
    title: 'Rangkaian Paralel Lanjutan',
    description: 'Tiga resistor paralel, target R_eq ≈ 25Ω (V=6V).',
    explanation: '100Ω||100Ω||100Ω → R_eq = 33.3Ω → I ≈ 0.18A (latihan pendekatan).',
    hint: 'Tambah cabang paralel menurunkan R_eq.',
    difficulty: 'medium',
    circuitType: 'parallel',
    voltage: 6,
    targetCurrent: 0.24,
    resistorSlots: 3,
    availableResistors: availableResistors.slice(3, 10),
    correctSolution: [100, 100, 100],
  },
  {
    id: 5,
    questionType: 'circuit',
    title: 'Tantangan Seri — R_target ≈ 400Ω',
    description: 'Dua resistor seri untuk I ≈ 0.05A (V=20V).',
    explanation: 'R_target = 400Ω. 220Ω + 220Ω = 440Ω → I ≈ 0.045A (mendekati).',
    hint: 'Gunakan R = V/I untuk estimasi.',
    difficulty: 'hard',
    circuitType: 'series',
    voltage: 20,
    targetCurrent: 0.05,
    resistorSlots: 2,
    availableResistors: availableResistors,
    correctSolution: [220, 220],
  },
  {
    id: 6,
    questionType: 'circuit',
    title: 'Master Paralel — I_total ≈ 0.5A',
    description: 'Tiga resistor paralel untuk R_eq ≈ 24Ω (V=12V).',
    explanation: 'Target R_eq = 24Ω. 100Ω || 47Ω || 47Ω ≈ 18.6Ω (lebih besar arus, contoh eksplorasi).',
    hint: '1/R_eq = Σ(1/R). Mainkan kombinasi mendekati target.',
    difficulty: 'hard',
    circuitType: 'parallel',
    voltage: 12,
    targetCurrent: 0.5,
    resistorSlots: 3,
    availableResistors: availableResistors.slice(0, 8),
    correctSolution: [100, 47, 47],
  },
  {
    id: 7,
    questionType: 'circuit',
    title: 'Seri 2R — V=10V, I≈0.1A',
    description: 'Cari kombinasi dua resistor seri mendekati 100Ω.',
    explanation: '47Ω + 47Ω = 94Ω → I ≈ 0.106A (mendekati 0.1A).',
    hint: 'Jumlahkan nilai R untuk seri.',
    difficulty: 'easy',
    circuitType: 'series',
    voltage: 10,
    targetCurrent: 0.1,
    resistorSlots: 2,
    availableResistors: availableResistors.slice(0, 6),
    correctSolution: [47, 47],
  },
  {
    id: 8,
    questionType: 'circuit',
    title: 'Paralel 2R — R_eq ≈ 15Ω',
    description: 'Dua resistor paralel untuk R_eq ~15Ω (V=6V).',
    explanation: '47Ω || 22Ω → R_eq ≈ 15.2Ω → I ≈ 0.39A.',
    hint: 'Gunakan 1/R_eq = 1/R1 + 1/R2.',
    difficulty: 'medium',
    circuitType: 'parallel',
    voltage: 6,
    targetCurrent: 0.4,
    resistorSlots: 2,
    availableResistors: availableResistors.slice(2, 7),
    correctSolution: [47, 22],
  },
];

// ===== Soal Analisis Rangkaian (TipeSoal4) =====
export const circuitAnalysisQuestions: CircuitAnalysisQuestion[] = [
  {
    id: 'analysis-1',
    questionType: 'circuitAnalysis',
    title: 'Analisis Rangkaian Campuran - L3 Putus',
    description: 'Prediksi status lampu ketika L3 padam (putus).',
    question: 'Jika lampu L3 padam (open circuit), lampu mana yang ikut padam dan mana yang tetap menyala?',
    hint: 'Analisis jalur arus: ada 2 jalur seri terpisah dan 1 jalur paralel independen.',
    explanation: 'L1-L2 adalah rangkaian seri pertama, L3-L4 adalah rangkaian seri kedua, L5 adalah jalur paralel independen. Jika L3 putus, maka L4 ikut padam (seri dengan L3), sedangkan L1-L2 dan L5 tetap menyala karena berada di jalur terpisah.',
    difficulty: 'medium',
    circuit: 'mixed-series-parallel',
    targetLamp: 'L3',
    correctStates: { L1: 'on', L2: 'on', L4: 'off', L5: 'on' },
  },
  {
    id: 'analysis-2',
    questionType: 'circuitAnalysis',
    title: 'Rangkaian Multi-Jalur - L2 Putus',
    description: 'Efek jika lampu di salah satu jalur paralel putus.',
    question: 'Jika L2 putus pada jalur atas, bagaimana status lampu lain?',
    hint: 'Tiga jalur paralel terpisah: jalur yang putus tidak mempengaruhi jalur lain.',
    explanation: 'Ada 3 jalur paralel: (1) L1-L2 seri, (2) L3-L4 seri, (3) L5 sendiri. Jika L2 putus, maka L1 ikut padam (seri dengan L2), sedangkan L3, L4, L5 tetap menyala karena di jalur paralel terpisah.',
    difficulty: 'medium',
    circuit: 'multi-parallel-series',
    targetLamp: 'L2',
    correctStates: { L1: 'off', L3: 'on', L4: 'on', L5: 'on' },
  },
  {
    id: 'analysis-3',
    questionType: 'circuitAnalysis',
    title: 'Rangkaian Bertingkat - L4 Putus',
    description: 'Efek jika lampu di rangkaian seri yang berada dalam jalur paralel putus.',
    question: 'Jika L4 putus pada rangkaian seri L4-L5 (yang berada dalam jalur paralel), bagaimana status lampu lain?',
    hint: 'L1 mandiri, L2-L3 seri di jalur paralel, L4-L5 seri di jalur paralel lain.',
    explanation: 'Ada 3 jalur paralel: (1) L1 sendiri, (2) L2-L3 seri, (3) L4-L5 seri. Jika L4 putus, maka L5 ikut padam (seri dengan L4), sedangkan L1, L2, L3 tetap menyala karena di jalur paralel terpisah.',
    difficulty: 'hard',
    circuit: 'nested-series-parallel',
    targetLamp: 'L4',
    correctStates: { L1: 'on', L2: 'on', L3: 'on', L5: 'off' },
  },
  {
    id: 'analysis-4',
    questionType: 'circuitAnalysis',
    title: 'Efek Kerusakan Lampu L1',
    description: 'Menggunakan rangkaian campuran, L1 yang rusak.',
    question: 'Jika lampu L1 tiba-tiba putus (open circuit), bagaimana status lampu-lampu lainnya?',
    hint: 'L1 berada di jalur seri dengan L2, sedangkan L3-L4 dan L5 di jalur paralel terpisah.',
    explanation: 'L1 dan L2 berada dalam jalur seri, jika L1 putus maka L2 ikut padam. Namun L3, L4, dan L5 berada di jalur paralel terpisah sehingga tetap menyala.',
    difficulty: 'medium',
    circuit: 'mixed-series-parallel',
    targetLamp: 'L1',
    correctStates: { L2: 'off', L3: 'on', L4: 'on', L5: 'on' },
  },
  {
    id: 'analysis-5',
    questionType: 'circuitAnalysis',
    title: 'Gangguan pada Jalur Paralel Tengah',
    description: 'Analisis efek kerusakan pada jalur seri di tengah.',
    question: 'Jika lampu L3 putus pada jalur tengah, apakah lampu L4 ikut terpengaruh?',
    hint: 'L3 dan L4 berada dalam jalur seri yang sama, terpisah dari jalur L1-L2 dan L5.',
    explanation: 'L3 dan L4 terhubung seri dalam satu jalur paralel. Jika L3 putus, L4 ikut padam karena tidak ada arus yang mengalir. L1, L2, dan L5 tetap menyala karena berada di jalur paralel terpisah.',
    difficulty: 'medium',
    circuit: 'multi-parallel-series',
    targetLamp: 'L3',
    correctStates: { L1: 'on', L2: 'on', L4: 'off', L5: 'on' },
  },
  {
    id: 'analysis-6',
    questionType: 'circuitAnalysis',
    title: 'Analisis Jalur Paralel Mandiri',
    description: 'Tes pemahaman tentang jalur paralel independen.',
    question: 'Jika lampu L5 pada jalur bawah putus, bagaimana pengaruhnya terhadap lampu lain?',
    hint: 'L5 berada di jalur paralel tersendiri, terpisah dari jalur L1-L2 dan L3-L4.',
    explanation: 'L5 berada dalam jalur paralel mandiri. Jika L5 putus, hanya L5 yang padam karena jalur L1-L2 dan L3-L4 tetap terhubung paralel dan mendapat tegangan penuh dari baterai.',
    difficulty: 'easy',
    circuit: 'mixed-series-parallel',
    targetLamp: 'L5',
    correctStates: { L1: 'on', L2: 'on', L3: 'on', L4: 'on' },
  },
  {
    id: 'analysis-7',
    questionType: 'circuitAnalysis',
    title: 'Kerusakan pada Jalur Seri Bertingkat',
    description: 'Analisis rangkaian bertingkat ketika L2 rusak.',
    question: 'Jika lampu L2 pada jalur tengah putus, lampu mana saja yang ikut terpengaruh?',
    hint: 'L2 dan L3 terhubung seri, sementara L1 dan pasangan L4-L5 berada di jalur paralel terpisah.',
    explanation: 'L2 dan L3 terhubung seri dalam satu jalur paralel. Jika L2 putus, maka L3 ikut padam. Namun L1 (jalur mandiri) dan L4-L5 (jalur seri terpisah) tetap menyala karena mendapat tegangan langsung dari baterai.',
    difficulty: 'medium',
    circuit: 'nested-series-parallel',
    targetLamp: 'L2',
    correctStates: { L1: 'on', L3: 'off', L4: 'on', L5: 'on' },
  },
];

// ===== Soal Circuit Ordering (contoh) =====
export const circuitOrderingQuestions: CircuitOrderingQuestion[] = [
  {
    id: 'order-1',
    questionType: 'circuitOrdering',
    title: 'Urutan Tingkat Kecerahan Lampu',
    description: 'Tiga rangkaian dengan V_sama, komponen berbeda.',
    instruction: 'Urutkan dari paling terang ke paling redup.',
    hint: 'I = V/R. Daya total ~ V²/R_total.',
    explanation: 'Perbandingan dilakukan via R_total dan P_total; paralel cenderung lebih terang karena R_total lebih kecil.',
    difficulty: 'medium',
    circuits: [
      {
        id: 'A',
        name: 'Rangkaian A',
        template: 'series',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 10, color: 'red' },
          { id: 'R2', value: 15, color: 'green' },
        ],
        lamps: [
          { id: 'L1', power: 5.76 },
          { id: 'L2', power: 8.64 },
        ],
        brightnessLevel: 'high',
        totalCurrent: 0.48,
        description: 'Seri 2R (R_total=25Ω, P≈5.76W)',
      },
      {
        id: 'B',
        name: 'Rangkaian B',
        template: 'parallel',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 30, color: 'green' },
          { id: 'R2', value: 60, color: 'blue' },
        ],
        lamps: [
          { id: 'L1', power: 4.8 },
          { id: 'L2', power: 2.4 },
        ],
        brightnessLevel: 'medium',
        totalCurrent: 0.6,
        description: 'Paralel 2R (R_total=20Ω, P≈7.2W)',
      },
      {
        id: 'C',
        name: 'Rangkaian C',
        template: 'series',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 20, color: 'blue' },
          { id: 'R2', value: 30, color: 'yellow' },
          { id: 'R3', value: 40, color: 'purple' },
        ],
        lamps: [
          { id: 'L1', power: 0.71 },
          { id: 'L2', power: 1.07 },
          { id: 'L3', power: 1.42 },
        ],
        brightnessLevel: 'low',
        totalCurrent: 0.133,
        description: 'Seri 3R (R_total≈90Ω, P≈1.6W)',
      },
    ],
    correctOrder: ['B', 'A', 'C'],
  },
];

// ===== Mixed set (selang-seling tipe) =====
export const mixedQuestions: Question[] = [
  circuitQuestions[0], // Circuit
  {
    id: 'conceptual-pretest-1',
    questionType: 'conceptual',
    title: 'Konsep Dasar Listrik',
    description: 'Pemahaman arus pada rangkaian seri',
    question: 'Manakah pernyataan yang BENAR tentang arus listrik dalam rangkaian seri?',
    hint: 'Pada seri hanya ada satu jalur arus.',
    explanation: 'Arus sama pada semua komponen seri (KCL).',
    difficulty: 'easy',
    choices: [
      { id: 'choice-1', text: 'Arus berbeda di tiap resistor', isCorrect: false },
      { id: 'choice-2', text: 'Arus sama di tiap resistor', isCorrect: true },
      { id: 'choice-3', text: 'Arus terbesar melewati R terkecil', isCorrect: false },
      { id: 'choice-4', text: 'Arus terbesar melewati R terbesar', isCorrect: false },
      { id: 'choice-5', text: 'Tidak ada arus di rangkaian seri', isCorrect: false },
    ],
    correctAnswers: ['choice-2'],
  },
  circuitOrderingQuestions[0], // Ordering
  circuitQuestions[1], // Circuit paralel
  circuitAnalysisQuestions[0], // Analysis L3 putus
  circuitQuestions[2], // Circuit seri 3R
  circuitAnalysisQuestions[1], // Analysis L2 putus
  circuitQuestions[3], // Circuit paralel 3R
  circuitAnalysisQuestions[2], // Analysis L4 putus
];

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
