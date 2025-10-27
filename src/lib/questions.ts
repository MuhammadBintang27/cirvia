// ==========================================
// CIRVIA — Question Interfaces & Sample Data (reduced types)
// Keinginan: hilangkan fillBlank, trueFalse, multipleChoice
// Tersisa: circuit, circuitOrdering, conceptual, circuitAnalysis
// ==========================================

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
  voltage: number; // Volt
  targetCurrent?: number; // Ampere
  targetVoltage?: number; // Volt (tegangan target di komponen tertentu)
  resistorSlots: number; // jumlah slot resistor yang harus diisi
  availableResistors: Resistor[];
  correctSolution: number[]; // nilai resistor (ohm) sesuai urutan slot
}

// ===== Conceptual (TipeSoal3) — multi-select =====
export interface ConceptualQuestion extends BaseQuestion {
  questionType: 'conceptual';
  question: string;
  choices: { id: string; text: string; isCorrect: boolean }[];
  correctAnswers: string[]; // id pilihan benar
}

// ===== Circuit primitives untuk analisis rangkaian =====
export interface CircuitComponent {
  id: string;
  type: 'source' | 'lamp' | 'junction';
  label: string; // contoh: L1, L2
  position: { x: number; y: number };
}

export interface CircuitConnection {
  id: string;
  from: string; // component id
  to: string; // component id
  type: 'series' | 'parallel';
}

// ===== Circuit Analysis (TipeSoal4) =====
export interface CircuitAnalysisQuestion extends BaseQuestion {
  questionType: 'circuitAnalysis';
  question: string;
  circuit: { components: CircuitComponent[]; connections: CircuitConnection[] };
  targetLamp: string; // id lampu yang dipadamkan/diuji
  correctStates: { [lampId: string]: 'on' | 'off' };
}

// ===== Circuit Ordering (TipeSoal5) =====
export interface CircuitOrderingQuestion extends BaseQuestion {
  questionType: 'circuitOrdering';
  instruction: string; // contoh: "Urutkan dari paling terang ke paling redup"
  circuits: {
    id: string;
    name: string; // A, B, C, ...
    template:
      | 'simple'
      | 'series'
      | 'parallel'
      | 'mixed'
      | 'complex-series'
      | 'complex-parallel'
      | 'mixed-advanced';
    voltage: number; // Volt
    resistors: { id: string; value: number; color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'brown' | 'orange' }[];
    lamps: { id: string; power: number }[]; // Watt (boleh estimasi)
    brightnessLevel: 'high' | 'medium' | 'low';
    totalCurrent?: number; // Ampere (opsional)
    description?: string;
    // Legacy support (opsional)
    resistorValue?: number;
    circuitType?: 'series' | 'parallel' | 'mixed';
    sourceVoltage?: number;
    totalPower?: number;
  }[];
  correctOrder: string[]; // misal: ['A','C','B']
}

// ===== Union type untuk semua tipe soal yang masih aktif =====
export type Question =
  | CircuitQuestion
  | CircuitOrderingQuestion
  | ConceptualQuestion
  | CircuitAnalysisQuestion;

// ===== Resistor data =====
export interface Resistor {
  id: number;
  value: number; // ohm
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
    explanation:
      'R_total ≈ 120Ω diperlukan. Contoh solusi: 47Ω + 100Ω = 147Ω → I ≈ 0.082A (mendekati).',
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
    explanation:
      'R_target = V/I ≈ 45Ω. 100Ω || 100Ω → R_eq = 50Ω → I ≈ 0.18A (mendekati).',
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
    explanation:
      'R_total = 220+100+330 = 650Ω → I ≈ 0.023A → V_R2 ≈ 2.3V (contoh tidak persis, untuk latihan pemahaman).',
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
    explanation:
      '100Ω||100Ω||100Ω → R_eq = 33.3Ω → I ≈ 0.18A (latihan pendekatan).',
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
    explanation:
      'R_target = 400Ω. 220Ω + 220Ω = 440Ω → I ≈ 0.045A (mendekati).',
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
    explanation:
      'Target R_eq = 24Ω. 100Ω || 47Ω || 47Ω ≈ 18.6Ω (lebih besar arus, contoh eksplorasi).',
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
    explanation:
      '47Ω + 47Ω = 94Ω → I ≈ 0.106A (mendekati 0.1A).',
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
    explanation:
      '47Ω || 22Ω → R_eq ≈ 15.2Ω → I ≈ 0.39A.',
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
    title: 'Analisis Rangkaian Campuran',
    description: 'Prediksi status lampu ketika L2 open circuit.',
    question:
      'Jika lampu L2 padam (open), lampu mana yang ikut padam dan mana yang tetap menyala?',
    hint: 'Komponen tanpa jalur tertutup → padam.',
    explanation:
      'Saat L2 open, cabang L2 terputus. Jalur lain yang masih lengkap akan tetap menyala.',
    difficulty: 'medium',
    circuit: {
      components: [
        { id: 'source', type: 'source', label: '+/-', position: { x: 50, y: 200 } },
        { id: 'ground', type: 'junction', label: 'GND', position: { x: 50, y: 350 } },
        { id: 'j1', type: 'junction', label: 'J1', position: { x: 200, y: 200 } },
        { id: 'j2', type: 'junction', label: 'J2', position: { x: 350, y: 200 } },
        { id: 'j3', type: 'junction', label: 'J3', position: { x: 200, y: 275 } },
        { id: 'L1', type: 'lamp', label: 'L1', position: { x: 275, y: 150 } },
        { id: 'L2', type: 'lamp', label: 'L2', position: { x: 275, y: 200 } },
        { id: 'L3', type: 'lamp', label: 'L3', position: { x: 275, y: 250 } },
        { id: 'L4', type: 'lamp', label: 'L4', position: { x: 450, y: 175 } },
        { id: 'L5', type: 'lamp', label: 'L5', position: { x: 450, y: 225 } },
      ],
      connections: [
        { id: 'c1', from: 'source', to: 'j1', type: 'series' },
        { id: 'c2', from: 'j1', to: 'L1', type: 'parallel' },
        { id: 'c3', from: 'j1', to: 'L2', type: 'parallel' },
        { id: 'c4', from: 'j1', to: 'j3', type: 'series' },
        { id: 'c5', from: 'j3', to: 'L3', type: 'parallel' },
        { id: 'c6', from: 'L1', to: 'j2', type: 'series' },
        { id: 'c7', from: 'L2', to: 'j2', type: 'series' },
        { id: 'c8', from: 'L3', to: 'j2', type: 'series' },
        { id: 'c9', from: 'j2', to: 'L4', type: 'parallel' },
        { id: 'c10', from: 'j2', to: 'L5', type: 'parallel' },
        { id: 'c11', from: 'L4', to: 'ground', type: 'series' },
        { id: 'c12', from: 'L5', to: 'ground', type: 'series' },
      ],
    },
    targetLamp: 'L2',
    correctStates: { L1: 'on', L3: 'on', L4: 'on', L5: 'on' },
  },
  {
    id: 'analysis-2',
    questionType: 'circuitAnalysis',
    title: 'Rangkaian Seri dengan Cabang Paralel',
    description: 'Efek jika komponen seri utama putus.',
    question:
      'Jika L1 (jalur seri utama) putus, bagaimana status L2–L5?',
    hint: 'Putus di seri utama → arus ke hilir terhenti.',
    explanation:
      'L1 memutus arus dari sumber ke percabangan, sehingga semua lampu lain padam.',
    difficulty: 'easy',
    circuit: {
      components: [
        { id: 'source', type: 'source', label: '+/-', position: { x: 50, y: 200 } },
        { id: 'ground', type: 'junction', label: 'GND', position: { x: 450, y: 350 } },
        { id: 'j1', type: 'junction', label: 'J1', position: { x: 200, y: 200 } },
        { id: 'j2', type: 'junction', label: 'J2', position: { x: 300, y: 200 } },
        { id: 'j3', type: 'junction', label: 'J3', position: { x: 400, y: 200 } },
        { id: 'L1', type: 'lamp', label: 'L1', position: { x: 125, y: 200 } },
        { id: 'L2', type: 'lamp', label: 'L2', position: { x: 250, y: 150 } },
        { id: 'L3', type: 'lamp', label: 'L3', position: { x: 250, y: 250 } },
        { id: 'L4', type: 'lamp', label: 'L4', position: { x: 350, y: 150 } },
        { id: 'L5', type: 'lamp', label: 'L5', position: { x: 350, y: 250 } },
      ],
      connections: [
        { id: 'c1', from: 'source', to: 'L1', type: 'series' },
        { id: 'c2', from: 'L1', to: 'j1', type: 'series' },
        { id: 'c3', from: 'j1', to: 'L2', type: 'parallel' },
        { id: 'c4', from: 'j1', to: 'L3', type: 'parallel' },
        { id: 'c5', from: 'L2', to: 'j2', type: 'series' },
        { id: 'c6', from: 'L3', to: 'j2', type: 'series' },
        { id: 'c7', from: 'j2', to: 'L4', type: 'parallel' },
        { id: 'c8', from: 'j2', to: 'L5', type: 'parallel' },
        { id: 'c9', from: 'L4', to: 'j3', type: 'series' },
        { id: 'c10', from: 'L5', to: 'j3', type: 'series' },
        { id: 'c11', from: 'j3', to: 'ground', type: 'series' },
      ],
    },
    targetLamp: 'L1',
    correctStates: { L2: 'off', L3: 'off', L4: 'off', L5: 'off' },
  },
  {
    id: 'analysis-3',
    questionType: 'circuitAnalysis',
    title: 'Paralel dengan Seri Internal',
    description: 'Efek open di salah satu cabang paralel berseri.',
    question:
      'Jika L3 putus pada cabang bawah (berpasangan seri dengan L4), bagaimana status lampu lain?',
    hint: 'Cabang yang putus → satu cabang padam; cabang lain tetap jika jalurnya lengkap.',
    explanation:
      'L3 putus → cabang L3–L4 padam. Cabang atas (L1–L2) dan L5 tetap menyala.',
    difficulty: 'medium',
    circuit: {
      components: [
        { id: 'source', type: 'source', label: '+/-', position: { x: 50, y: 200 } },
        { id: 'ground', type: 'junction', label: 'GND', position: { x: 450, y: 200 } },
        { id: 'j1', type: 'junction', label: 'J1', position: { x: 150, y: 200 } },
        { id: 'j2', type: 'junction', label: 'J2', position: { x: 350, y: 200 } },
        { id: 'L1', type: 'lamp', label: 'L1', position: { x: 200, y: 120 } },
        { id: 'L2', type: 'lamp', label: 'L2', position: { x: 300, y: 120 } },
        { id: 'L3', type: 'lamp', label: 'L3', position: { x: 200, y: 280 } },
        { id: 'L4', type: 'lamp', label: 'L4', position: { x: 300, y: 280 } },
        { id: 'L5', type: 'lamp', label: 'L5', position: { x: 250, y: 200 } },
      ],
      connections: [
        { id: 'c1', from: 'source', to: 'j1', type: 'series' },
        { id: 'c2', from: 'j1', to: 'L1', type: 'parallel' },
        { id: 'c3', from: 'j1', to: 'L3', type: 'parallel' },
        { id: 'c4', from: 'j1', to: 'L5', type: 'parallel' },
        { id: 'c5', from: 'L1', to: 'L2', type: 'series' },
        { id: 'c6', from: 'L3', to: 'L4', type: 'series' },
        { id: 'c7', from: 'L2', to: 'j2', type: 'series' },
        { id: 'c8', from: 'L4', to: 'j2', type: 'series' },
        { id: 'c9', from: 'L5', to: 'j2', type: 'series' },
        { id: 'c10', from: 'j2', to: 'ground', type: 'series' },
      ],
    },
    targetLamp: 'L3',
    correctStates: { L1: 'on', L2: 'on', L4: 'off', L5: 'on' },
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
    explanation:
      'Perbandingan dilakukan via R_total dan P_total; paralel cenderung lebih terang karena R_total lebih kecil.',
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

// ===== Mixed set (selang-seling tipe) TANPA MC/TF/FillBlank =====
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
  circuitAnalysisQuestions[0], // Analysis L2 open
  circuitQuestions[2], // Circuit seri 3R
  circuitAnalysisQuestions[1], // Analysis L1 putus
  circuitQuestions[3], // Circuit paralel 3R
  circuitAnalysisQuestions[2], // Analysis L3 putus cabang
];

// (Opsional) Helper skor tetap dibiarkan karena tidak tergantung tipe yang dihapus
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