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

// ===== PAKET SOAL DEFAULT PRETEST =====
export const DEFAULT_PRETEST_PACKAGE: Question[] = [
  // 1. Conceptual (Hukum Ohm)
  {
    id: 'conceptual-1',
    questionType: 'conceptual',
    title: 'Hukum Ohm Dasar',
    description: 'Pemahaman fundamental tentang hubungan V, I, R',
    question: 'Menurut hukum Ohm, jika tegangan naik 2 kali dan hambatan tetap, maka arus akan:',
    hint: 'V = I × R, jadi I = V/R',
    explanation: 'Menurut hukum Ohm I = V/R. Jika V naik 2 kali dan R tetap, maka I juga naik 2 kali.',
    difficulty: 'easy',
    choices: [
      { id: 'choice-1', text: 'Tetap sama', isCorrect: false },
      { id: 'choice-2', text: 'Naik 2 kali', isCorrect: true },
      { id: 'choice-3', text: 'Turun 2 kali', isCorrect: false },
      { id: 'choice-4', text: 'Naik 4 kali', isCorrect: false },
    ],
    correctAnswers: ['choice-2'],
  },
  
  // 2. Circuit (Seri)
  {
    id: 1,
    questionType: 'circuit',
    title: 'Rangkaian Seri',
    description:
      'Rangkaian di samping memiliki dua slot resistor yang tersusun seri. Siswa diminta memilih dua resistor dari daftar yang tersedia dan menempatkannya pada rangkaian agar arus yang mengalir sesuai target yang ditentukan guru. Karena susunannya seri, kombinasi hambatan yang dipilih akan langsung menentukan besarnya arus.',
    explanation: 'Pada rangkaian seri, hambatan total adalah jumlah semua hambatan. Gunakan rumus I = V/R_total untuk menghitung arus.',
    hint: 'Pada susunan seri, hambatan saling dijumlahkan dan memengaruhi besar arus.',
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
  
  // 4. Circuit Ordering (Kecerahan)
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
  
  // 5. Conceptual (Rangkaian Seri)
  {
    id: 'conceptual-2',
    questionType: 'conceptual',
    title: 'Karakteristik Rangkaian Seri',
    description: 'Pemahaman tentang sifat rangkaian seri',
    question: 'Pada rangkaian seri, manakah pernyataan yang BENAR?',
    hint: 'Rangkaian seri hanya memiliki satu jalur arus',
    explanation: 'Pada rangkaian seri, arus sama di semua komponen karena hanya ada satu jalur. Tegangan terbagi sesuai hambatan masing-masing.',
    difficulty: 'easy',
    choices: [
      { id: 'choice-1', text: 'Arus sama di semua komponen', isCorrect: true },
      { id: 'choice-2', text: 'Tegangan sama di semua komponen', isCorrect: false },
      { id: 'choice-3', text: 'Hambatan total lebih kecil dari hambatan terkecil', isCorrect: false },
      { id: 'choice-4', text: 'Jika satu komponen rusak, komponen lain tetap bekerja', isCorrect: false },
    ],
    correctAnswers: ['choice-1'],
  },
  
  // 6. Circuit (Paralel)
  {
    id: 2,
    questionType: 'circuit',
    title: 'Rangkaian Paralel',
    description:
      'Rangkaian ini memiliki dua cabang resistor paralel. Siswa harus memilih dua resistor dari daftar yang tersedia dan menempatkannya pada rangkaian agar arus total sesuai target yang ditentukan guru. Pada susunan paralel, penambahan cabang memengaruhi hambatan total sehingga arus berubah.',
    explanation: 'Pada rangkaian paralel, gunakan rumus 1/R_total = 1/R1 + 1/R2 + ... untuk menghitung hambatan total, kemudian I = V/R_total.',
    hint: 'Pada susunan paralel, penambahan cabang membuat hambatan total semakin kecil.',
    difficulty: 'easy',
    circuitType: 'parallel',
    voltage: 9,
    targetCurrent: 0.18,
    resistorSlots: 2,
  },
  
  // 7. Conceptual (Daya Listrik)
  {
    id: 'conceptual-4',
    questionType: 'conceptual',
    title: 'Daya Listrik',
    description: 'Pemahaman tentang daya listrik dan rumusnya',
    question: 'Daya listrik dapat dihitung dengan rumus:',
    hint: 'Daya adalah energi per satuan waktu, P = V × I',
    explanation: 'Daya listrik P = V × I = I² × R = V²/R. Semua rumus ini benar sesuai hukum Ohm.',
    difficulty: 'medium',
    choices: [
      { id: 'choice-1', text: 'P = V × I', isCorrect: true },
      { id: 'choice-2', text: 'P = I² × R', isCorrect: true },
      { id: 'choice-3', text: 'P = V²/R', isCorrect: true },
      { id: 'choice-4', text: 'P = V/I', isCorrect: false },
    ],
    correctAnswers: ['choice-1', 'choice-2', 'choice-3'],
  },
  
  // 8. Circuit Ordering (Arus Total)
  {
    id: 'order-pretest-2',
    questionType: 'circuitOrdering',
    title: 'Urutan Arus Total Rangkaian',
    description: 'Tiga rangkaian dengan tegangan sama, konfigurasi berbeda.',
    instruction: 'Urutkan dari arus total terbesar ke terkecil.',
    hint: 'I_total = V/R_total. Semakin kecil R_total, semakin besar arus.',
    explanation: 'Paralel memiliki R_total paling kecil, sehingga arus total paling besar.',
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
        description: 'Seri 2R (R_total=9Ω, I=1A)',
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
        description: 'Paralel 2R (R_total=3Ω, I=3A)',
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
        description: 'Campuran (R_total=5Ω, I=1.8A)',
      },
    ],
    correctOrder: ['Y', 'Z', 'X'],
  },
  
  // 9. Conceptual (Rangkaian Paralel)
  {
    id: 'conceptual-3',
    questionType: 'conceptual',
    title: 'Karakteristik Rangkaian Paralel',
    description: 'Pemahaman tentang sifat rangkaian paralel',
    question: 'Pada rangkaian paralel, manakah pernyataan yang BENAR?',
    hint: 'Rangkaian paralel memiliki beberapa jalur arus terpisah',
    explanation: 'Pada rangkaian paralel, tegangan sama di semua cabang, tetapi arus terbagi. Hambatan total lebih kecil dari hambatan terkecil.',
    difficulty: 'easy',
    choices: [
      { id: 'choice-1', text: 'Arus sama di semua cabang', isCorrect: false },
      { id: 'choice-2', text: 'Tegangan sama di semua cabang', isCorrect: true },
      { id: 'choice-3', text: 'Hambatan total sama dengan jumlah semua hambatan', isCorrect: false },
      { id: 'choice-4', text: 'Penambahan cabang menambah hambatan total', isCorrect: false },
    ],
    correctAnswers: ['choice-2'],
  },
  
  // 10. Circuit Analysis (L5 Putus)
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
];

// ===== PAKET SOAL DEFAULT POSTTEST =====
export const DEFAULT_POSTTEST_PACKAGE: Question[] = [
  // 1. Conceptual (Hambatan Paralel)
  {
    id: 'conceptual-6',
    questionType: 'conceptual',
    title: 'Hambatan Paralel',
    description: 'Pemahaman tentang perhitungan hambatan paralel',
    question: 'Jika dua resistor 6Ω dipasang paralel, hambatan totalnya adalah:',
    hint: '1/R_total = 1/R1 + 1/R2',
    explanation: '1/R_total = 1/6 + 1/6 = 2/6 = 1/3, jadi R_total = 3Ω',
    difficulty: 'medium',
    choices: [
      { id: 'choice-1', text: '12Ω', isCorrect: false },
      { id: 'choice-2', text: '6Ω', isCorrect: false },
      { id: 'choice-3', text: '3Ω', isCorrect: true },
      { id: 'choice-4', text: '2Ω', isCorrect: false },
    ],
    correctAnswers: ['choice-3'],
  },
  
  // 2. Circuit (Tantangan Seri)
  {
    id: 5,
    questionType: 'circuit',
    title: 'Tantangan Seri — Level Tinggi',
    description:
      'Rangkaian ini memiliki dua slot resistor seri. Siswa harus memilih dua resistor dari daftar yang tersedia agar arus yang mengalir sesuai target yang ditentukan guru. Susunan seri membuat arus tergantung pada total hambatan kombinasi yang dipilih. Level soal ini lebih menantang dengan target yang lebih presisi.',
    explanation: 'Hitung hambatan total dengan menjumlahkan semua resistor dalam rangkaian seri, kemudian gunakan hukum Ohm I = V/R_total.',
    hint: 'Pada susunan seri, hambatan saling dijumlahkan dan memengaruhi besar arus.',
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
  
  // 4. Circuit Ordering (Efisiensi)
  {
    id: 'order-posttest-2',
    questionType: 'circuitOrdering',
    title: 'Urutan Efisiensi Rangkaian',
    description: 'Tiga rangkaian dengan losses berbeda.',
    instruction: 'Urutkan dari efisiensi tertinggi ke terendah.',
    hint: 'Efisiensi = P_output/P_input. Rangkaian sederhana biasanya lebih efisien.',
    explanation: 'Rangkaian dengan komponen lebih sedikit dan resistansi internal lebih kecil memiliki efisiensi lebih tinggi.',
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
    title: 'Efek Kerusakan Komponen',
    description: 'Pemahaman tentang efek kerusakan pada rangkaian',
    question: 'Jika satu lampu putus pada rangkaian seri, apa yang terjadi?',
    hint: 'Rangkaian seri hanya memiliki satu jalur arus',
    explanation: 'Pada rangkaian seri, jika satu komponen putus, arus terputus sehingga semua komponen mati.',
    difficulty: 'medium',
    choices: [
      { id: 'choice-1', text: 'Lampu lain tetap menyala', isCorrect: false },
      { id: 'choice-2', text: 'Semua lampu mati', isCorrect: true },
      { id: 'choice-3', text: 'Lampu lain menyala lebih terang', isCorrect: false },
      { id: 'choice-4', text: 'Tidak ada pengaruh', isCorrect: false },
    ],
    correctAnswers: ['choice-2'],
  },
  
  // 6. Circuit (Master Paralel)
  {
    id: 6,
    questionType: 'circuit',
    title: 'Master Paralel — Level Tinggi',
    description:
      'Rangkaian paralel ini memiliki tiga cabang yang harus diisi dengan resistor dari daftar pilihan yang disediakan guru. Siswa harus menempatkan resistor agar arus total sesuai target yang ditentukan. Konfigurasi paralel membuat setiap penambahan cabang memengaruhi hambatan total dan arus keseluruhan. Level soal ini menantang dengan 3 slot resistor.',
    explanation:
      'Gunakan rumus paralel 1/R_total = 1/R1 + 1/R2 + 1/R3 untuk menghitung hambatan total, kemudian I = V/R_total.',
    hint: 'Pada susunan paralel, penambahan cabang membuat hambatan total semakin kecil.',
    difficulty: 'hard',
    circuitType: 'parallel',
    voltage: 12,
    targetCurrent: 0.5,
    resistorSlots: 3,
  },
  
  // 7. Conceptual (Efisiensi Energi)
  {
    id: 'conceptual-8',
    questionType: 'conceptual',
    title: 'Efisiensi Energi',
    description: 'Pemahaman tentang efisiensi dalam rangkaian listrik',
    question: 'Manakah yang mempengaruhi efisiensi rangkaian listrik?',
    hint: 'Efisiensi berkaitan dengan losses dan resistansi',
    explanation: 'Efisiensi dipengaruhi oleh hambatan dalam (resistansi kawat), kualitas kontak, dan desain rangkaian.',
    difficulty: 'hard',
    choices: [
      { id: 'choice-1', text: 'Hambatan dalam komponen', isCorrect: true },
      { id: 'choice-2', text: 'Kualitas sambungan kawat', isCorrect: true },
      { id: 'choice-3', text: 'Suhu lingkungan', isCorrect: true },
      { id: 'choice-4', text: 'Warna kabel', isCorrect: false },
    ],
    correctAnswers: ['choice-1', 'choice-2', 'choice-3'],
  },
  
  // 8. Circuit Ordering (Daya Total)
  {
    id: 'order-posttest-1',
    questionType: 'circuitOrdering',
    title: 'Urutan Daya Total Rangkaian',
    description: 'Empat rangkaian kompleks dengan tegangan sama.',
    instruction: 'Urutkan dari daya total terbesar ke terkecil.',
    hint: 'P_total = V²/R_total. Semakin kecil R_total, semakin besar daya.',
    explanation: 'Rangkaian dengan R_total terkecil memiliki daya terbesar karena P = V²/R.',
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
        description: 'Seri 3R (R_total=24Ω, P=6W)',
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
        description: 'Paralel 3R (R_total=4Ω, P=36W)',
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
        description: 'Campuran lanjut (R_total=6Ω, P=24W)',
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
        description: 'Seri 2R (R_total=6Ω, P=24W)',
      },
    ],
    correctOrder: ['Q', 'R', 'S', 'P'],
  },
  
  // 9. Conceptual (Rangkaian Campuran)
  {
    id: 'conceptual-7',
    questionType: 'conceptual',
    title: 'Analisis Rangkaian Campuran',
    description: 'Pemahaman tentang rangkaian campuran seri-paralel',
    question: 'Pada rangkaian campuran, untuk menghitung hambatan total:',
    hint: 'Identifikasi bagian seri dan paralel terlebih dahulu',
    explanation: 'Pada rangkaian campuran, kita harus mengidentifikasi bagian seri dan paralel, lalu menghitung secara bertahap.',
    difficulty: 'hard',
    choices: [
      { id: 'choice-1', text: 'Jumlahkan semua hambatan', isCorrect: false },
      { id: 'choice-2', text: 'Gunakan rumus paralel untuk semua', isCorrect: false },
      { id: 'choice-3', text: 'Identifikasi bagian seri dan paralel terlebih dahulu', isCorrect: true },
      { id: 'choice-4', text: 'Ambil nilai rata-rata semua hambatan', isCorrect: false },
    ],
    correctAnswers: ['choice-3'],
  },
  
  // 10. Circuit Analysis (L4 Putus)
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
