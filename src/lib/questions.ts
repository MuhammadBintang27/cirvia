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
  // availableResistors akan diisi oleh guru saat membuat soal
  // correctSolution akan dihitung otomatis berdasarkan target
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

// ===== Resistor data interface =====
// Interface untuk resistor yang akan didefinisikan oleh guru
export interface Resistor {
  id: number;
  value: number;
  colorCode?: string[];
  label: string;
}

// ===== PAKET SOAL DEFAULT PRETEST (versi narasi diperkuat & konseptual=5 opsi) =====
export const DEFAULT_PRETEST_PACKAGE: Question[] = [
  // 1. Conceptual (Hukum Ohm)
  {
    id: 'conceptual-1',
    questionType: 'conceptual',
    title: 'Hukum Ohm — Dampak Perubahan Tegangan',
    description: 'Menaksir perubahan arus ketika tegangan diubah sementara hambatan tetap.',
    question:
      'Sebuah rangkaian sederhana memiliki hambatan tetap. Jika sumber tegangannya dinaikkan menjadi 2 kali semula, bagaimana perubahan arus yang mengalir melalui rangkaian menurut Hukum Ohm?',
    hint: 'Gunakan I = V/R dan bandingkan kondisi sebelum–sesudah.',
    explanation:
      'Hukum Ohm menyatakan I = V/R. Karena R tetap dan V menjadi 2V, maka I baru = (2V)/R = 2 × (V/R). Arus meningkat 2 kali lipat.',
    difficulty: 'easy',
    choices: [
      { id: 'choice-1', text: 'Tetap sama', isCorrect: false },
      { id: 'choice-2', text: 'Naik 2 kali', isCorrect: true },
      { id: 'choice-3', text: 'Turun 2 kali', isCorrect: false },
      { id: 'choice-4', text: 'Naik 4 kali', isCorrect: false },
      { id: 'choice-5', text: 'Naik 1,5 kali', isCorrect: false },
    ],
    correctAnswers: ['choice-2'],
  },

  // 2. Circuit (Seri)
  {
    id: 1,
    questionType: 'circuit',
    title: 'Rangkaian Seri — Menyetel Arus Target',
    description:
    'Sebuah rangkaian terdiri atas dua slot resistor yang disusun seri dan dihubungkan dengan sumber tegangan sebesar 12 volt. Tujuan percobaan ini adalah menentukan kombinasi dua resistor yang mampu menghasilkan arus total sekitar 0,08 ampere. Gunakan pemahamanmu tentang hubungan antara tegangan, arus, dan hambatan untuk mencapai hasil yang diinginkan.',
    explanation:
      'Pada rangkaian seri, R_total = R₁ + R₂. Setelah R_total diperoleh, arus dapat dihitung dengan I = V/R_total.',
    hint: 'Semakin besar R_total, semakin kecil arus (I berbanding terbalik dengan R_total).',
    difficulty: 'easy',
    circuitType: 'series',
    voltage: 12,
    targetCurrent: 0.08,
    resistorSlots: 2,
  },

  // 3. Circuit Analysis (L3 Putus)
  {
    id: 'analysis-1',
    questionType: 'circuitAnalysis',
    title: 'Analisis Campuran: Dampak L3 Putus',
    description:
      'Tentukan lampu yang tetap menyala dan yang padam ketika L3 mengalami open circuit pada rangkaian campuran.',
    question:
      'Jika lampu L3 padam (open circuit), lampu mana saja yang ikut padam dan mana yang tetap menyala?',
    hint: 'Identifikasi jalur: (L1–L2) seri, (L3–L4) seri, dan L5 jalur paralel mandiri.',
    explanation:
      'L1–L2 berada pada jalur seri terpisah dari L3–L4, sementara L5 berdiri sendiri pada jalur paralel mandiri. Saat L3 putus, arus di jalur L3–L4 terhenti sehingga L4 padam. L1–L2 dan L5 tetap menyala.',
    difficulty: 'medium',
    circuit: 'mixed-series-parallel',
    targetLamp: 'L3',
    correctStates: { L1: 'on', L2: 'on', L4: 'off', L5: 'on' },
  },

  // 4. Circuit Ordering (Kecerahan)
  {
    id: 'order-1',
    questionType: 'circuitOrdering',
    title: 'Membandingkan Kecerahan Lampu',
    description:
      'Tiga rangkaian dengan tegangan sama namun konfigurasi berbeda. Urutkan tingkat kecerahan total.',
    instruction: 'Urutkan dari rangkaian paling terang ke paling redup.',
    hint: 'P_total ≈ V²/R_total. R_total lebih kecil → P_total lebih besar.',
    explanation:
      'Rangkaian paralel umumnya memiliki R_total lebih kecil daripada seri, sehingga daya total (dan kecerahan) cenderung lebih besar.',
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
        description: 'Seri 2R (R_total=25Ω, P≈5,76 W)',
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
        description: 'Paralel 2R (R_total=20Ω, P≈7,2 W)',
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
        description: 'Seri 3R (R_total≈90Ω, P≈1,6 W)',
      },
    ],
    correctOrder: ['B', 'A', 'C'],
  },

  // 5. Conceptual (Rangkaian Seri)
  {
    id: 'conceptual-2',
    questionType: 'conceptual',
    title: 'Ciri Khas Rangkaian Seri',
    description: 'Menentukan sifat arus, tegangan, dan hambatan total pada susunan seri.',
    question:
      'Manakah pernyataan yang BENAR untuk rangkaian seri ideal dengan komponen linear?',
    hint: 'Rangkaian seri hanya memiliki satu jalur arus.',
    explanation:
      'Di rangkaian seri, arus sama di semua komponen. Tegangan terbagi sesuai nilai hambatan masing-masing. Hambatan total adalah penjumlahan semua hambatan.',
    difficulty: 'easy',
    choices: [
      { id: 'choice-1', text: 'Arus sama di semua komponen', isCorrect: true },
      { id: 'choice-2', text: 'Tegangan sama di semua komponen', isCorrect: false },
      { id: 'choice-3', text: 'Hambatan total lebih kecil dari hambatan terkecil', isCorrect: false },
      { id: 'choice-4', text: 'Jika satu komponen putus, komponen lain tetap bekerja', isCorrect: false },
      { id: 'choice-5', text: 'Hambatan total adalah jumlah seluruh hambatan', isCorrect: true }, // Boleh multi-benar? Jika ingin single-answer, set ini ke false.
    ],
    // Jika ingin single-correct, gunakan hanya choice-1. Jika multi-correct diperbolehkan, pertahankan keduanya:
    correctAnswers: ['choice-1', 'choice-5'],
  },

  // 6. Circuit (Paralel)
  {
    id: 2,
    questionType: 'circuit',
    title: 'Rangkaian Paralel — Menyetel Arus Total',
    description:
    'Bayangkan sebuah rangkaian dengan dua cabang resistor paralel yang dihubungkan ke sumber tegangan 9 volt. Tugasmu adalah menentukan kombinasi dua resistor yang dapat menghasilkan arus total mendekati 0,18 ampere. Ingat bahwa pada susunan paralel, penambahan cabang akan menurunkan hambatan total dan meningkatkan arus.',
    explanation:
      'Gunakan 1/R_total = 1/R₁ + 1/R₂. Setelah R_total, hitung arus dengan I = V/R_total.',
    hint: 'R_total paralel selalu lebih kecil dari hambatan terkecil yang dipasang.',
    difficulty: 'easy',
    circuitType: 'parallel',
    voltage: 9,
    targetCurrent: 0.18,
    resistorSlots: 2,
  },

  // 7. Conceptual (Daya Listrik) — multi-correct
  {
    id: 'conceptual-4',
    questionType: 'conceptual',
    title: 'Rumus Daya Listrik',
    description: 'Memilih bentuk rumus daya yang ekuivalen berdasarkan Hukum Ohm.',
    question:
      'Pilih semua persamaan yang BENAR untuk menyatakan daya listrik (untuk komponen linear).',
    hint: 'Gabungkan P = V × I dengan V = I × R.',
    explanation:
      'Semua bentuk benar: P = V × I, P = I² × R, dan P = V²/R. Bentuk P = V/I dan P = V/R tidak benar secara dimensi.',
    difficulty: 'medium',
    choices: [
      { id: 'choice-1', text: 'P = V × I', isCorrect: true },
      { id: 'choice-2', text: 'P = I² × R', isCorrect: true },
      { id: 'choice-3', text: 'P = V²/R', isCorrect: true },
      { id: 'choice-4', text: 'P = V/I', isCorrect: false },
      { id: 'choice-5', text: 'P = V/R', isCorrect: false },
    ],
    correctAnswers: ['choice-1', 'choice-2', 'choice-3'],
  },

  // 8. Circuit Ordering (Arus Total)
  {
    id: 'order-pretest-2',
    questionType: 'circuitOrdering',
    title: 'Membandingkan Arus Total',
    description:
      'Tiga rangkaian diberi tegangan sama. Bandingkan arus totalnya berdasarkan R_total.',
    instruction: 'Urutkan dari arus total terbesar ke terkecil.',
    hint: 'I_total = V/R_total.',
    explanation:
      'Rangkaian paralel memiliki R_total paling kecil → arus total paling besar, lalu campuran, kemudian seri.',
    difficulty: 'easy',
    circuits: [
      {
        id: 'X',
        name: 'Rangkaian X',
        template: 'series',
        voltage: 9,
        resistors: [{ id: 'R1', value: 3 }, { id: 'R2', value: 6 }],
        lamps: [{ id: 'L1', power: 2.43 }, { id: 'L2', power: 4.86 }],
        brightnessLevel: 'low',
        totalCurrent: 1.0,
        description: 'Seri 2R (R_total=9Ω, I=1 A)',
      },
      {
        id: 'Y',
        name: 'Rangkaian Y',
        template: 'parallel',
        voltage: 9,
        resistors: [{ id: 'R1', value: 6 }, { id: 'R2', value: 6 }],
        lamps: [{ id: 'L1', power: 13.5 }, { id: 'L2', power: 13.5 }],
        brightnessLevel: 'high',
        totalCurrent: 3.0,
        description: 'Paralel 2R (R_total=3Ω, I=3 A)',
      },
      {
        id: 'Z',
        name: 'Rangkaian Z',
        template: 'mixed',
        voltage: 9,
        resistors: [{ id: 'R1', value: 2 }, { id: 'R2', value: 4 }, { id: 'R3', value: 4 }],
        lamps: [{ id: 'L1', power: 8.1 }, { id: 'L2', power: 4.05 }, { id: 'L3', power: 4.05 }],
        brightnessLevel: 'medium',
        totalCurrent: 1.8,
        description: 'Campuran (R_total=5Ω, I=1,8 A)',
      },
    ],
    correctOrder: ['Y', 'Z', 'X'],
  },

  // 9. Conceptual (Rangkaian Paralel)
  {
    id: 'conceptual-3',
    questionType: 'conceptual',
    title: 'Ciri Khas Rangkaian Paralel',
    description: 'Menentukan relasi tegangan, arus, dan hambatan pada paralel.',
    question:
      'Manakah pernyataan yang BENAR untuk rangkaian paralel ideal dengan komponen linear?',
    hint: 'Setiap cabang paralel terhubung langsung ke sumber.',
    explanation:
      'Tegangan sama pada semua cabang paralel. Arus bercabang sesuai besar hambatan. R_total lebih kecil daripada hambatan terkecil.',
    difficulty: 'easy',
    choices: [
      { id: 'choice-1', text: 'Arus sama di semua cabang', isCorrect: false },
      { id: 'choice-2', text: 'Tegangan sama di semua cabang', isCorrect: true },
      { id: 'choice-3', text: 'Hambatan total sama dengan jumlah semua hambatan', isCorrect: false },
      { id: 'choice-4', text: 'Penambahan cabang menambah hambatan total', isCorrect: false },
      { id: 'choice-5', text: 'Arus cabang terbesar melalui hambatan terkecil', isCorrect: true },
    ],
    correctAnswers: ['choice-2', 'choice-5'],
  },

  // 10. Circuit Analysis (L5 Putus)
  {
    id: 'analysis-6',
    questionType: 'circuitAnalysis',
    title: 'Analisis Jalur Paralel Mandiri — L5 Putus',
    description:
      'Evaluasi pengaruh open circuit pada cabang paralel yang berdiri sendiri.',
    question:
      'Jika lampu L5 (jalur bawah) putus, bagaimana pengaruhnya terhadap lampu lain?',
    hint: 'L5 berada di jalur paralel mandiri, terpisah dari L1–L2 dan L3–L4.',
    explanation:
      'Karena L5 punya jalur sendiri, ketika putus hanya L5 yang padam. Jalur L1–L2 dan L3–L4 tetap mendapat tegangan penuh.',
    difficulty: 'easy',
    circuit: 'mixed-series-parallel',
    targetLamp: 'L5',
    correctStates: { L1: 'on', L2: 'on', L3: 'on', L4: 'on' },
  },
];

// ===== PAKET SOAL DEFAULT POSTTEST (versi narasi diperkuat & konseptual=5 opsi) =====
export const DEFAULT_POSTTEST_PACKAGE: Question[] = [
  // 1. Conceptual (Hambatan Paralel)
  {
    id: 'conceptual-6',
    questionType: 'conceptual',
    title: 'Menghitung Hambatan Ekuivalen Paralel',
    description:
      'Menerapkan rumus hambatan ekuivalen untuk dua resistor identik yang dipasang paralel.',
    question:
      'Dua resistor 6Ω dipasang paralel pada sumber yang sama. Berapakah hambatan total ekuivalennya?',
    hint: 'Gunakan 1/R_total = 1/R₁ + 1/R₂.',
    explanation:
      '1/R_total = 1/6 + 1/6 = 2/6 = 1/3 → R_total = 3Ω.',
    difficulty: 'medium',
    choices: [
      { id: 'choice-1', text: '12Ω', isCorrect: false },
      { id: 'choice-2', text: '6Ω', isCorrect: false },
      { id: 'choice-3', text: '3Ω', isCorrect: true },
      { id: 'choice-4', text: '2Ω', isCorrect: false },
      { id: 'choice-5', text: '3,5Ω', isCorrect: false },
    ],
    correctAnswers: ['choice-3'],
  },

  // 2. Circuit (Tantangan Seri)
  {
    id: 5,
    questionType: 'circuit',
    title: 'Tantangan Seri — Presisi Arus',
    description:
    'Rangkaian ini terdiri dari dua resistor yang dihubungkan secara seri dengan sumber tegangan 20 volt. Tantanganmu adalah mencari kombinasi dua resistor yang menghasilkan arus sekitar 0,05 ampere. Arus yang lebih kecil menunjukkan hambatan total yang lebih besar, sehingga diperlukan kombinasi resistor dengan nilai yang tepat.',
    explanation:
      'Hitung R_total = R₁ + R₂, lalu I = V/R_total. Sesuaikan pilihan hingga mendekati target.',
    hint: 'Pertimbangkan toleransi nilai resistor terhadap target arus.',
    difficulty: 'hard',
    circuitType: 'series',
    voltage: 20,
    targetCurrent: 0.05,
    resistorSlots: 2,
  },

  // 3. Circuit Analysis (L2 Putus)
  {
    id: 'analysis-7',
    questionType: 'circuitAnalysis',
    title: 'Kerusakan pada Jalur Seri Bertingkat — L2 Putus',
    description:
      'Menilai pengaruh open circuit pada salah satu lampu di jalur seri yang menjadi bagian dari paralel bertingkat.',
    question:
      'Jika L2 pada jalur tengah putus, lampu mana saja yang padam dan yang tetap menyala?',
    hint: 'L2–L3 seri dalam satu cabang paralel. L1 sendiri, L4–L5 seri di cabang lain.',
    explanation:
      'Putus di L2 memutus arus cabang L2–L3 sehingga L3 padam. L1 serta pasangan L4–L5 tetap menyala karena berada di cabang berbeda yang masih tersuplai.',
    difficulty: 'medium',
    circuit: 'nested-series-parallel',
    targetLamp: 'L2',
    correctStates: { L1: 'on', L3: 'off', L4: 'on', L5: 'on' },
  },

  // 4. Circuit Ordering (Efisiensi)
  {
    id: 'order-posttest-2',
    questionType: 'circuitOrdering',
    title: 'Membandingkan Efisiensi Rangkaian',
    description:
      'Tiga rangkaian dengan tingkat rugi-rugi berbeda. Urutkan dari paling efisien.',
    instruction: 'Urutkan dari efisiensi tertinggi ke terendah.',
    hint: 'Efisiensi = P_output / P_input. Rangkaian lebih sederhana cenderung lebih efisien.',
    explanation:
      'Semakin sedikit elemen yang menambah rugi-rugi (kawat panjang, sambungan, komponen), semakin tinggi efisiensi total.',
    difficulty: 'hard',
    circuits: [
      {
        id: 'E1',
        name: 'Rangkaian E1',
        template: 'simple',
        voltage: 12,
        resistors: [{ id: 'R1', value: 12 }],
        lamps: [{ id: 'L1', power: 12 }],
        brightnessLevel: 'high',
        totalCurrent: 1.0,
        description: 'Sederhana 1R (Efisiensi ≈ 95%)',
      },
      {
        id: 'E2',
        name: 'Rangkaian E2',
        template: 'series',
        voltage: 12,
        resistors: [{ id: 'R1', value: 6 }, { id: 'R2', value: 6 }],
        lamps: [{ id: 'L1', power: 6 }, { id: 'L2', power: 6 }],
        brightnessLevel: 'medium',
        totalCurrent: 1.0,
        description: 'Seri 2R (Efisiensi ≈ 90%)',
      },
      {
        id: 'E3',
        name: 'Rangkaian E3',
        template: 'parallel',
        voltage: 12,
        resistors: [{ id: 'R1', value: 24 }, { id: 'R2', value: 24 }],
        lamps: [{ id: 'L1', power: 6 }, { id: 'L2', power: 6 }],
        brightnessLevel: 'medium',
        totalCurrent: 1.0,
        description: 'Paralel 2R (Efisiensi ≈ 85%)',
      },
    ],
    correctOrder: ['E1', 'E2', 'E3'],
  },

  // 5. Conceptual (Efek Kerusakan)
  {
    id: 'conceptual-5',
    questionType: 'conceptual',
    title: 'Dampak Putus pada Rangkaian Seri',
    description:
      'Memahami konsekuensi kerusakan satu komponen terhadap aliran arus pada seri.',
    question:
      'Pada rangkaian seri ideal, jika satu lampu putus, apa yang terjadi pada rangkaian?',
    hint: 'Seri hanya memiliki satu jalur arus.',
    explanation:
      'Putus pada satu komponen memutus jalur arus sehingga seluruh rangkaian tidak dialiri arus dan semua lampu padam.',
    difficulty: 'medium',
    choices: [
      { id: 'choice-1', text: 'Lampu lain tetap menyala', isCorrect: false },
      { id: 'choice-2', text: 'Semua lampu mati', isCorrect: true },
      { id: 'choice-3', text: 'Lampu lain menyala lebih terang', isCorrect: false },
      { id: 'choice-4', text: 'Tidak ada pengaruh', isCorrect: false },
      { id: 'choice-5', text: 'Hanya lampu yang rusak yang padam', isCorrect: false },
    ],
    correctAnswers: ['choice-2'],
  },

  // 6. Circuit (Master Paralel)
  {
    id: 6,
    questionType: 'circuit',
    title: 'Master Paralel — Sinkron Arus Total',
    description:
    'Sebuah rangkaian paralel dengan tiga cabang resistor dihubungkan ke sumber tegangan 12 volt. Tugasmu adalah menentukan kombinasi tiga resistor yang mampu menghasilkan arus total sekitar 0,5 ampere. Perhatikan bahwa setiap cabang paralel menambah jalur arus, sehingga hambatan total menjadi semakin kecil.',
    explanation:
      'Hitung R_total dengan 1/R_total = 1/R₁ + 1/R₂ + 1/R₃, lalu I = V/R_total.',
    hint: 'Setiap cabang menambah konduktansi total (1/R).',
    difficulty: 'hard',
    circuitType: 'parallel',
    voltage: 12,
    targetCurrent: 0.5,
    resistorSlots: 3,
  },

  // 7. Conceptual (Efisiensi Energi) — multi-correct
  {
    id: 'conceptual-8',
    questionType: 'conceptual',
    title: 'Faktor Penentu Efisiensi Rangkaian',
    description:
      'Mengidentifikasi faktor yang memengaruhi efisiensi sistem kelistrikan.',
    question:
      'Pilih semua faktor yang memengaruhi efisiensi rangkaian listrik praktis.',
    hint: 'Pertimbangkan rugi-rugi resistif dan kualitas koneksi.',
    explanation:
      'Efisiensi menurun oleh hambatan dalam (kabel/komponen), sambungan kurang baik, dan pengaruh suhu. Warna kabel maupun logo produsen tidak berpengaruh teknis.',
    difficulty: 'hard',
    choices: [
      { id: 'choice-1', text: 'Hambatan dalam komponen', isCorrect: true },
      { id: 'choice-2', text: 'Kualitas sambungan kawat', isCorrect: true },
      { id: 'choice-3', text: 'Suhu lingkungan', isCorrect: true },
      { id: 'choice-4', text: 'Warna kabel', isCorrect: false },
      { id: 'choice-5', text: 'Logo pabrik pada komponen', isCorrect: false },
    ],
    correctAnswers: ['choice-1', 'choice-2', 'choice-3'],
  },

  // 8. Circuit Ordering (Daya Total)
  {
    id: 'order-posttest-1',
    questionType: 'circuitOrdering',
    title: 'Membandingkan Daya Total',
    description:
      'Empat rangkaian kompleks bervariasi. Tentukan urutan daya totalnya.',
    instruction: 'Urutkan dari daya total terbesar ke terkecil.',
    hint: 'P_total = V²/R_total.',
    explanation:
      'Semakin kecil R_total, semakin besar P_total. Urutan mengikuti perbandingan R_total masing-masing rangkaian.',
    difficulty: 'hard',
    circuits: [
      {
        id: 'P',
        name: 'Rangkaian P',
        template: 'complex-series',
        voltage: 12,
        resistors: [{ id: 'R1', value: 4 }, { id: 'R2', value: 8 }, { id: 'R3', value: 12 }],
        lamps: [{ id: 'L1', power: 2.4 }, { id: 'L2', power: 4.8 }, { id: 'L3', power: 7.2 }],
        brightnessLevel: 'low',
        totalCurrent: 0.5,
        description: 'Seri 3R (R_total=24Ω, P=6 W)',
      },
      {
        id: 'Q',
        name: 'Rangkaian Q',
        template: 'complex-parallel',
        voltage: 12,
        resistors: [{ id: 'R1', value: 12 }, { id: 'R2', value: 12 }, { id: 'R3', value: 12 }],
        lamps: [{ id: 'L1', power: 12 }, { id: 'L2', power: 12 }, { id: 'L3', power: 12 }],
        brightnessLevel: 'high',
        totalCurrent: 3.0,
        description: 'Paralel 3R (R_total=4Ω, P=36 W)',
      },
      {
        id: 'R',
        name: 'Rangkaian R',
        template: 'mixed-advanced',
        voltage: 12,
        resistors: [{ id: 'R1', value: 6 }, { id: 'R2', value: 3 }, { id: 'R3', value: 6 }],
        lamps: [{ id: 'L1', power: 16 }, { id: 'L2', power: 24 }, { id: 'L3', power: 8 }],
        brightnessLevel: 'medium',
        totalCurrent: 2.0,
        description: 'Campuran lanjut (R_total=6Ω, P=24 W)',
      },
      {
        id: 'S',
        name: 'Rangkaian S',
        template: 'series',
        voltage: 12,
        resistors: [{ id: 'R1', value: 2 }, { id: 'R2', value: 4 }],
        lamps: [{ id: 'L1', power: 8 }, { id: 'L2', power: 16 }],
        brightnessLevel: 'medium',
        totalCurrent: 2.0,
        description: 'Seri 2R (R_total=6Ω, P=24 W)',
      },
    ],
    correctOrder: ['Q', 'R', 'S', 'P'],
  },

  // 9. Conceptual (Rangkaian Campuran)
  {
    id: 'conceptual-7',
    questionType: 'conceptual',
    title: 'Strategi Menghitung R_total Rangkaian Campuran',
    description:
      'Menentukan langkah sistematis menghitung hambatan total rangkaian seri-paralel.',
    question:
      'Langkah yang paling tepat untuk menghitung hambatan total pada rangkaian campuran adalah…',
    hint: 'Pisahkan bagian seri dan paralel menjadi tahapan bertahap.',
    explanation:
      'Identifikasi sub-bagian seri dan paralel, sederhanakan bertahap hingga tersisa satu hambatan ekuivalen.',
    difficulty: 'hard',
    choices: [
      { id: 'choice-1', text: 'Jumlahkan semua hambatan secara langsung', isCorrect: false },
      { id: 'choice-2', text: 'Gunakan rumus paralel untuk semua bagian', isCorrect: false },
      { id: 'choice-3', text: 'Identifikasi bagian seri dan paralel terlebih dahulu', isCorrect: true },
      { id: 'choice-4', text: 'Ambil nilai rata-rata seluruh hambatan', isCorrect: false },
      { id: 'choice-5', text: 'Urutkan komponen secara abjad lalu jumlahkan', isCorrect: false },
    ],
    correctAnswers: ['choice-3'],
  },

  // 10. Circuit Analysis (L4 Putus)
  {
    id: 'analysis-3',
    questionType: 'circuitAnalysis',
    title: 'Paralel Bertingkat: L4 Putus pada Cabang Seri',
    description:
      'Menilai efek open circuit pada salah satu elemen di cabang seri yang menjadi bagian dari paralel.',
    question:
      'Jika L4 putus pada cabang seri L4–L5 (yang merupakan salah satu cabang paralel), bagaimana status lampu lain?',
    hint: 'Ada 3 cabang paralel: (1) L1, (2) L2–L3, (3) L4–L5.',
    explanation:
      'Putus di L4 memutus arus pada cabang L4–L5, sehingga L5 ikut padam. L1 dan pasangan L2–L3 tetap menyala karena berada pada cabang paralel lain yang masih tersuplai.',
    difficulty: 'hard',
    circuit: 'nested-series-parallel',
    targetLamp: 'L4',
    correctStates: { L1: 'on', L2: 'on', L3: 'on', L5: 'off' },
  },
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
