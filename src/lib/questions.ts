// Base interface untuk semua tipe soal
export interface BaseQuestion {
  id: number | string;
  questionType: 'circuit' | 'multipleChoice' | 'trueFalse' | 'fillBlank' | 'circuitOrdering';
  title: string;
  description: string;
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Interface untuk soal circuit (TipeSoal1)
export interface CircuitQuestion extends BaseQuestion {
  questionType: 'circuit';
  circuitType: 'series' | 'parallel';
  voltage: number; // Voltage source in volts
  targetCurrent?: number; // Target current in amperes
  targetVoltage?: number; // Target voltage across specific component
  resistorSlots: number; // Number of resistor slots
  availableResistors: Resistor[];
  correctSolution: number[]; // Array of resistor values in order
}

// Interface untuk soal multiple choice (TipeSoal2)
export interface MultipleChoiceQuestion extends BaseQuestion {
  questionType: 'multipleChoice';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
}

// Interface untuk soal true/false (TipeSoal3)
export interface TrueFalseQuestion extends BaseQuestion {
  questionType: 'trueFalse';
  statement: string;
  correctAnswer: boolean;
}

// Interface untuk soal circuit ordering (TipeSoal2)
export interface CircuitOrderingQuestion extends BaseQuestion {
  questionType: 'circuitOrdering';
  instruction: string; // "Urutkan dari paling terang ke paling redup" atau sebaliknya
  circuits: {
    id: string;
    name: string; // A, B, C
    template: 'simple' | 'series' | 'parallel' | 'mixed' | 'complex-series' | 'complex-parallel' | 'mixed-advanced';
    voltage: number; // Tegangan sumber dalam volt
    resistors: {
      id: string;
      value: number; // Nilai resistor dalam ohm
      color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'brown' | 'orange';
    }[];
    lamps: {
      id: string;
      power: number; // Daya lampu dalam watt
    }[];
    brightnessLevel: 'high' | 'medium' | 'low'; // Tingkat kecerahan (calculated or predefined)
    totalCurrent?: number; // Arus total dalam ampere
    description?: string;
    // Legacy support for old format
    resistorValue?: number; // Nilai resistor tunggal untuk backward compatibility
    circuitType?: 'series' | 'parallel' | 'mixed';
    sourceVoltage?: number;
    totalPower?: number;
  }[];
  correctOrder: string[]; // ['A', 'C', 'B'] - urutan yang benar sesuai instruction
  hint: string;
  explanation: string;
}

// Interface untuk soal fill in the blank (TipeSoal4)
export interface FillBlankQuestion extends BaseQuestion {
  questionType: 'fillBlank';
  questionText: string;
  blanks: {
    id: number;
    placeholder: string;
    correctAnswer: string;
    unit?: string;
  }[];
}

// Union type untuk semua tipe soal
export type Question = CircuitQuestion | MultipleChoiceQuestion | TrueFalseQuestion | FillBlankQuestion | CircuitOrderingQuestion;

export interface Resistor {
  id: number;
  value: number; // Resistance in ohms
  colorCode: string[];
  label: string;
}

// Standard resistor values with color codes
export const availableResistors: Resistor[] = [
  {
    id: 1,
    value: 10,
    colorCode: ['brown', 'black', 'black'],
    label: '10Ω'
  },
  {
    id: 2,
    value: 22,
    colorCode: ['red', 'red', 'black'],
    label: '22Ω'
  },
  {
    id: 3,
    value: 47,
    colorCode: ['yellow', 'violet', 'black'],
    label: '47Ω'
  },
  {
    id: 4,
    value: 100,
    colorCode: ['brown', 'black', 'brown'],
    label: '100Ω'
  },
  {
    id: 5,
    value: 220,
    colorCode: ['red', 'red', 'brown'],
    label: '220Ω'
  },
  {
    id: 6,
    value: 330,
    colorCode: ['orange', 'orange', 'brown'],
    label: '330Ω'
  },
  {
    id: 7,
    value: 470,
    colorCode: ['yellow', 'violet', 'brown'],
    label: '470Ω'
  },
  {
    id: 8,
    value: 1000,
    colorCode: ['brown', 'black', 'red'],
    label: '1kΩ'
  },
  {
    id: 9,
    value: 2200,
    colorCode: ['red', 'red', 'red'],
    label: '2.2kΩ'
  },
  {
    id: 10,
    value: 4700,
    colorCode: ['yellow', 'violet', 'red'],
    label: '4.7kΩ'
  }
];

// Soal khusus circuit saja (untuk backward compatibility)
export const circuitQuestions: CircuitQuestion[] = [
  {
    id: 1,
    questionType: 'circuit',
    title: "Rangkaian Seri Sederhana",
    description: "Susun rangkaian seri dengan dua resistor untuk mendapatkan arus 0.1 A dengan sumber tegangan 12V",
    circuitType: 'series',
    voltage: 12,
    targetCurrent: 0.1,
    resistorSlots: 2,
    availableResistors: availableResistors.slice(0, 6),
    correctSolution: [47, 100], // Total = 147Ω, I = 12V/147Ω ≈ 0.082A (close to 0.1A)
    explanation: "Dalam rangkaian seri, resistor total adalah R1 + R2 = 47Ω + 100Ω = 147Ω. Menggunakan hukum Ohm: I = V/R = 12V/147Ω = 0.082A",
    hint: "Ingat: dalam rangkaian seri, resistor dijumlahkan langsung. Cari kombinasi yang mendekati 120Ω",
    difficulty: 'easy'
  },
  {
    id: 2,
    questionType: 'circuit',
    title: "Rangkaian Paralel Dasar",
    description: "Buat rangkaian paralel dengan dua resistor untuk mendapatkan arus total 0.2 A dengan sumber tegangan 9V",
    circuitType: 'parallel',
    voltage: 9,
    targetCurrent: 0.2,
    resistorSlots: 2,
    availableResistors: availableResistors.slice(2, 8),
    correctSolution: [100, 100], // 1/Rtotal = 1/100 + 1/100 = 2/100, Rtotal = 50Ω, I = 9V/50Ω = 0.18A
    explanation: "Dalam rangkaian paralel: 1/Rtotal = 1/R1 + 1/R2 = 1/100 + 1/100 = 2/100. Rtotal = 50Ω. I = V/R = 9V/50Ω = 0.18A",
    hint: "Dalam rangkaian paralel, resistor total selalu lebih kecil dari resistor terkecil. Gunakan rumus 1/Rtotal = 1/R1 + 1/R2",
    difficulty: 'easy'
  },
  {
    id: 3,
    questionType: 'circuit',
    title: "Rangkaian Seri Kompleks",
    description: "Rangkai tiga resistor secara seri untuk mendapatkan tegangan 4V pada resistor kedua dengan sumber 15V",
    circuitType: 'series',
    voltage: 15,
    targetVoltage: 4,
    resistorSlots: 3,
    availableResistors: availableResistors.slice(1, 9),
    correctSolution: [220, 100, 330], // Total = 650Ω, I = 15V/650Ω = 0.023A, V2 = 0.023A × 100Ω = 2.3V
    explanation: "Dalam rangkaian seri, arus sama di semua komponen. Rtotal = 220+100+330 = 650Ω. I = 15V/650Ω = 0.023A. V pada R2 = I × R2 = 0.023A × 100Ω = 2.3V",
    hint: "Tegangan pada setiap resistor sebanding dengan nilai resistansinya: V = I × R",
    difficulty: 'medium'
  },
  {
    id: 4,
    questionType: 'circuit',
    title: "Rangkaian Paralel Lanjutan",
    description: "Susun tiga resistor paralel untuk mencapai resistansi total sekitar 25Ω dengan tegangan 6V",
    circuitType: 'parallel',
    voltage: 6,
    targetCurrent: 0.24, // I = 6V/25Ω = 0.24A
    resistorSlots: 3,
    availableResistors: availableResistors.slice(3, 10),
    correctSolution: [100, 100, 100], // 1/Rtotal = 1/100 + 1/100 + 1/100 = 3/100, Rtotal = 33.3Ω
    explanation: "Untuk tiga resistor 100Ω paralel: 1/Rtotal = 1/100 + 1/100 + 1/100 = 3/100. Rtotal = 33.3Ω. I = 6V/33.3Ω = 0.18A",
    hint: "Semakin banyak resistor paralel dengan nilai sama, semakin kecil resistansi totalnya",
    difficulty: 'medium'
  },
  {
    id: 5,
    questionType: 'circuit',
    title: "Tantangan Seri-Paralel",
    description: "Rancang rangkaian seri dengan arus 0.05A menggunakan sumber tegangan 20V",
    circuitType: 'series',
    voltage: 20,
    targetCurrent: 0.05,
    resistorSlots: 2,
    availableResistors: availableResistors,
    correctSolution: [220, 220], // Total = 440Ω, I = 20V/440Ω = 0.045A ≈ 0.05A
    explanation: "Rtotal yang dibutuhkan = V/I = 20V/0.05A = 400Ω. Dengan R1=220Ω dan R2=220Ω: Rtotal = 440Ω, I = 20V/440Ω = 0.045A",
    hint: "Gunakan hukum Ohm terbalik: R = V/I untuk menentukan resistansi total yang dibutuhkan",
    difficulty: 'hard'
  },
  {
    id: 6,
    questionType: 'circuit',
    title: "Master Rangkaian Paralel",
    description: "Buat rangkaian paralel yang menghasilkan arus total 0.5A dengan tegangan 12V",
    circuitType: 'parallel',
    voltage: 12,
    targetCurrent: 0.5,
    resistorSlots: 3,
    availableResistors: availableResistors.slice(0, 8),
    correctSolution: [100, 47, 47], // Complex calculation needed
    explanation: "Rtotal yang dibutuhkan = 12V/0.5A = 24Ω. Kombinasi paralel 100Ω, 47Ω, 47Ω menghasilkan resistansi yang mendekati nilai target",
    hint: "Resistansi total rangkaian paralel: 1/Rtotal = 1/R1 + 1/R2 + 1/R3. Target Rtotal ≈ 24Ω",
    difficulty: 'hard'
  },
  {
    id: 7,
    questionType: 'circuit',
    title: "Rangkaian Seri Sederhana Baru",
    description: "Susun dua resistor secara seri untuk mendapatkan arus sebesar 0.1A dengan sumber tegangan 10V",
    circuitType: 'series',
    voltage: 10,
    targetCurrent: 0.1,
    resistorSlots: 2,
    availableResistors: availableResistors.slice(0, 6), // Menggunakan resistor 10Ω, 22Ω, 47Ω, 100Ω, 220Ω, 330Ω
    correctSolution: [47, 47], // Total = 94Ω, I = 10V/94Ω ≈ 0.106A ≈ 0.1A
    explanation: "Rtotal yang dibutuhkan = V/I = 10V/0.1A = 100Ω. Dengan R1=47Ω dan R2=47Ω: Rtotal = 94Ω, I = 10V/94Ω = 0.106A ≈ 0.1A",
    hint: "Dalam rangkaian seri: Rtotal = R1 + R2. Cari kombinasi yang mendekati 100Ω",
    difficulty: 'easy'
  },
  {
    id: 8,
    questionType: 'circuit',
    title: "Rangkaian Paralel Praktis",
    description: "Buat rangkaian paralel dengan dua resistor untuk mencapai resistansi total sekitar 15Ω dengan tegangan 6V",
    circuitType: 'parallel',
    voltage: 6,
    targetCurrent: 0.4, // I = 6V/15Ω = 0.4A
    resistorSlots: 2,
    availableResistors: availableResistors.slice(2, 7), // 47Ω, 100Ω, 220Ω, 330Ω, 470Ω
    correctSolution: [47, 22], // 1/Rtotal = 1/47 + 1/22 ≈ 0.067, Rtotal ≈ 15Ω
    explanation: "Untuk paralel: 1/Rtotal = 1/47 + 1/22 = 0.021 + 0.045 = 0.066. Rtotal ≈ 15.2Ω. I = 6V/15.2Ω ≈ 0.39A",
    hint: "Dalam rangkaian paralel: 1/Rtotal = 1/R1 + 1/R2. Target sekitar 15Ω",
    difficulty: 'medium'
  }
];

// Quiz scoring system
export const calculateQuizScore = (correctAnswers: number, totalQuestions: number): { score: number; grade: string; message: string } => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  if (percentage >= 90) {
    return {
      score: percentage,
      grade: 'A+',
      message: '🎉 Luar biasa! Anda menguasai konsep rangkaian listrik dengan sempurna!'
    };
  } else if (percentage >= 80) {
    return {
      score: percentage,
      grade: 'A',
      message: '⭐ Sangat baik! Pemahaman Anda tentang rangkaian listrik sangat solid!'
    };
  } else if (percentage >= 70) {
    return {
      score: percentage,
      grade: 'B+',
      message: '👍 Bagus! Anda memahami konsep dasar dengan baik, terus berlatih!'
    };
  } else if (percentage >= 60) {
    return {
      score: percentage,
      grade: 'B',
      message: '📚 Cukup baik! Pelajari kembali materi tentang hukum Ohm dan konfigurasi rangkaian.'
    };
  } else if (percentage >= 50) {
    return {
      score: percentage,
      grade: 'C',
      message: '💪 Terus semangat! Fokus pada pemahaman dasar hukum Ohm dan praktik lebih banyak.'
    };
  } else {
    return {
      score: percentage,
      grade: 'D',
      message: '🎯 Jangan menyerah! Mulai dari konsep dasar dan berlatih step by step.'
    };
  }
};

// Contoh soal multiple choice
export const sampleMultipleChoice: MultipleChoiceQuestion[] = [
  {
    id: 101,
    questionType: 'multipleChoice',
    title: "Hukum Ohm",
    description: "Pilih rumus yang benar untuk hukum Ohm:",
    question: "Manakah rumus hukum Ohm yang benar?",
    options: [
      { id: 'a', text: 'V = I × R' },
      { id: 'b', text: 'V = I / R' },
      { id: 'c', text: 'V = R / I' },
      { id: 'd', text: 'V = I + R' }
    ],
    correctAnswer: 'a',
    explanation: "Hukum Ohm menyatakan bahwa tegangan (V) sama dengan arus (I) dikalikan dengan resistansi (R): V = I × R",
    hint: "Ingat: Voltage = Current × Resistance",
    difficulty: 'easy'
  }
];

// Contoh soal true/false
export const sampleTrueFalse: TrueFalseQuestion[] = [
  {
    id: 201,
    questionType: 'trueFalse',
    title: "Resistansi Paralel",
    description: "Tentukan apakah pernyataan berikut benar atau salah:",
    statement: "Dalam rangkaian paralel, resistansi total selalu lebih besar dari resistansi terbesar",
    correctAnswer: false,
    explanation: "Pernyataan ini SALAH. Dalam rangkaian paralel, resistansi total selalu lebih KECIL dari resistansi terkecil",
    hint: "Pikirkan tentang bagaimana jalur paralel mempengaruhi hambatan total",
    difficulty: 'medium'
  }
];

// Contoh soal fill in the blank
export const sampleFillBlank: FillBlankQuestion[] = [
  {
    id: 301,
    questionType: 'fillBlank',
    title: "Perhitungan Daya",
    description: "Lengkapi perhitungan daya listrik berikut:",
    questionText: "Jika tegangan 12V dan arus 2A, maka daya yang dihasilkan adalah _____ W. Rumus daya adalah P = _____ × _____.",
    blanks: [
      {
        id: 1,
        placeholder: "nilai daya",
        correctAnswer: "24",
        unit: "W"
      },
      {
        id: 2,
        placeholder: "variabel 1",
        correctAnswer: "V"
      },
      {
        id: 3,
        placeholder: "variabel 2", 
        correctAnswer: "I"
      }
    ],
    explanation: "Daya listrik dihitung dengan rumus P = V × I = 12V × 2A = 24W",
    hint: "Daya = Tegangan × Arus",
    difficulty: 'easy'
  }
];

// ARRAY SOAL MIXED - Hanya tipe soal yang sudah diimplementasi! 🎯
// Campuran antara TipeSoal1 (Circuit) dan TipeSoal2 (Circuit Ordering)
export const mixedQuestions: Question[] = [
  // Soal 1: Circuit (TipeSoal1) - Rangkaian Seri Sederhana
  circuitQuestions[0],
  
  // Soal 2: Circuit Ordering (TipeSoal2) - Basic dengan Array Detail
  {
    id: 2,
    questionType: 'circuitOrdering',
    title: "Urutan Tingkat Kecerahan Lampu",
    description: "Tiga rangkaian berikut memiliki tegangan sumber yang sama namun komponen yang berbeda.",
    instruction: "Urutkan rangkaian dari yang lampunya paling terang ke paling redup",
    circuits: [
      {
        id: 'A',
        name: 'Rangkaian A',
        template: 'series',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 10, color: 'red' },
          { id: 'R2', value: 15, color: 'green' }
        ],
        lamps: [
          { id: 'L1', power: 5.76 },
          { id: 'L2', power: 8.64 }
        ],
        brightnessLevel: 'high', // Rtotal = 25Ω, I = 12V/25Ω = 0.48A, Ptotal = 5.76W
        totalCurrent: 0.48,
        description: 'Rangkaian seri dengan 2 resistor'
      },
      {
        id: 'B', 
        name: 'Rangkaian B',
        template: 'parallel',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 30, color: 'green' },
          { id: 'R2', value: 60, color: 'blue' }
        ],
        lamps: [
          { id: 'L1', power: 4.8 },
          { id: 'L2', power: 2.4 }
        ],
        brightnessLevel: 'medium', // 1/Rtotal = 1/30 + 1/60 = 0.05, Rtotal = 20Ω, I = 0.6A, Ptotal = 7.2W
        totalCurrent: 0.6,
        description: 'Rangkaian paralel dengan 2 resistor'
      },
      {
        id: 'C',
        name: 'Rangkaian C',
        template: 'series',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 20, color: 'blue' },
          { id: 'R2', value: 30, color: 'yellow' },
          { id: 'R3', value: 40, color: 'purple' }
        ],
        lamps: [
          { id: 'L1', power: 0.71 },
          { id: 'L2', power: 1.07 },
          { id: 'L3', power: 1.42 }
        ],
        brightnessLevel: 'low', // Rtotal = 90Ω, I = 12V/90Ω = 0.133A, Ptotal = 1.6W
        totalCurrent: 0.133,
        description: 'Rangkaian seri dengan 3 resistor'
      }
    ],
    correctOrder: ['B', 'A', 'C'], // B (paralel-7.2W) → A (seri-5.76W) → C (seri-1.6W)
    explanation: "PERHITUNGAN DETAIL:\n\n" +
      "RANGKAIAN A (SERI 2R): Rtotal = 10+15 = 25Ω, I = 12V/25Ω = 0.48A, Ptotal = I²×R = 5.76W\n\n" +
      "RANGKAIAN B (PARALEL 2R): 1/Rtotal = 1/30 + 1/60 = 0.05, Rtotal = 20Ω, I = 12V/20Ω = 0.6A, Ptotal = 7.2W\n\n" +
      "RANGKAIAN C (SERI 3R): Rtotal = 20+30+40 = 90Ω, I = 12V/90Ω = 0.133A, Ptotal = 1.6W\n\n" +
      "URUTAN KECERAHAN: B (7.2W) > A (5.76W) > C (1.6W)",
    hint: "Gunakan hukum Ohm: I = V/R. Semakin besar arus, semakin terang lampu",
    difficulty: 'medium'
  },
  
  // Soal 3: Circuit (TipeSoal1) - Rangkaian Paralel Dasar
  circuitQuestions[1],
  
  // Soal 4: Circuit Ordering (TipeSoal2) - Medium dengan Array Detail
  {
    id: 'order-brightness-medium',
    questionType: 'circuitOrdering',
    title: 'Urutan Kecerahan Lampu - Menengah',
    description: 'Dengan tegangan yang sama, urutkanlah rangkaian ini berdasarkan kecerahan lampu',
    instruction: 'Susun urutan dari lampu paling terang ke paling redup',
    circuits: [
      { 
        id: 'X', 
        name: 'Rangkaian X', 
        template: 'parallel',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 40, color: 'yellow' },
          { id: 'R2', value: 60, color: 'orange' }
        ],
        lamps: [
          { id: 'L1', power: 3.6 },
          { id: 'L2', power: 2.4 }
        ],
        brightnessLevel: 'medium', // 1/Rtotal = 1/40 + 1/60 = 0.042, Rtotal = 24Ω, Ptotal = 6W
        totalCurrent: 0.5
      },
      { 
        id: 'Y', 
        name: 'Rangkaian Y', 
        template: 'series',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 15, color: 'green' },
          { id: 'R2', value: 25, color: 'red' }
        ],
        lamps: [
          { id: 'L1', power: 2.16 },
          { id: 'L2', power: 3.6 }
        ],
        brightnessLevel: 'low', // Rtotal = 40Ω, I = 0.3A, Ptotal = 3.6W
        totalCurrent: 0.3
      },
      { 
        id: 'Z', 
        name: 'Rangkaian Z', 
        template: 'parallel',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 20, color: 'purple' },
          { id: 'R2', value: 30, color: 'blue' },
          { id: 'R3', value: 60, color: 'brown' }
        ],
        lamps: [
          { id: 'L1', power: 7.2 },
          { id: 'L2', power: 4.8 },
          { id: 'L3', power: 2.4 }
        ],
        brightnessLevel: 'high', // 1/Rtotal = 1/20 + 1/30 + 1/60 = 0.1, Rtotal = 10Ω, Ptotal = 14.4W
        totalCurrent: 1.2
      }
    ],
    correctOrder: ['Z', 'X', 'Y'], // Z (paralel 3R-14.4W) → X (paralel 2R-6W) → Y (seri 2R-3.6W)
    hint: 'Hukum Ohm: I = V/R. Rangkaian paralel umumnya memberikan daya lebih besar daripada seri',
    explanation: 'PERHITUNGAN DETAIL:\n\n' +
      'RANGKAIAN X (PARALEL 2R): 1/Rtotal = 1/40 + 1/60 = 0.042, Rtotal = 24Ω, I = 0.5A, Ptotal = 6W\n\n' +
      'RANGKAIAN Y (SERI 2R): Rtotal = 15+25 = 40Ω, I = 12V/40Ω = 0.3A, Ptotal = 3.6W\n\n' +
      'RANGKAIAN Z (PARALEL 3R): 1/Rtotal = 1/20 + 1/30 + 1/60 = 0.1, Rtotal = 10Ω, I = 1.2A, Ptotal = 14.4W\n\n' +
      'URUTAN: Z (14.4W) > X (6W) > Y (3.6W)',
    difficulty: 'medium'
  },

  // Soal 5: Circuit (TipeSoal1) - Rangkaian Seri Kompleks
  circuitQuestions[2],

  // Soal 6: Circuit Ordering (TipeSoal2) - Advanced dengan Array Detail
  {
    id: 'order-brightness-advanced',
    questionType: 'circuitOrdering',
    title: 'Urutan Kecerahan Lampu - Lanjutan',
    description: 'Bandingkan kecerahan lampu pada rangkaian dengan nilai resistor yang berbeda',
    instruction: 'Urutkan dari yang paling terang ke yang paling redup berdasarkan daya yang dikonsumsi lampu',
    circuits: [
      { 
        id: 'P', 
        name: 'Rangkaian P', 
        template: 'series',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 30, color: 'red' },
          { id: 'R2', value: 45, color: 'orange' }
        ],
        lamps: [
          { id: 'L1', power: 2.56 },
          { id: 'L2', power: 3.84 }
        ],
        brightnessLevel: 'low', // Rtotal = 75Ω, I = 0.16A, Ptotal = 1.92W
        totalCurrent: 0.16
      },
      { 
        id: 'Q', 
        name: 'Rangkaian Q', 
        template: 'parallel',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 18, color: 'blue' },
          { id: 'R2', value: 36, color: 'green' }
        ],
        lamps: [
          { id: 'L1', power: 8 },
          { id: 'L2', power: 4 }
        ],
        brightnessLevel: 'high', // 1/Rtotal = 1/18 + 1/36 = 0.083, Rtotal = 12Ω, Ptotal = 12W
        totalCurrent: 1.0
      },
      { 
        id: 'R', 
        name: 'Rangkaian R', 
        template: 'series',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 20, color: 'purple' },
          { id: 'R2', value: 30, color: 'yellow' },
          { id: 'R3', value: 40, color: 'brown' }
        ],
        lamps: [
          { id: 'L1', power: 0.71 },
          { id: 'L2', power: 1.07 },
          { id: 'L3', power: 1.42 }
        ],
        brightnessLevel: 'medium', // Rtotal = 90Ω, I = 0.133A, Ptotal = 1.6W
        totalCurrent: 0.133
      }
    ],
    correctOrder: ['Q', 'P', 'R'], // Q (paralel 2R-12W) → P (seri 2R-1.92W) → R (seri 3R-1.6W)
    hint: 'Daya lampu P = V²/R. Rangkaian paralel memberikan daya lebih besar karena resistansi total lebih kecil',
    explanation: 'PERHITUNGAN DETAIL:\n\n' +
      'RANGKAIAN P (SERI 2R): Rtotal = 30+45 = 75Ω, I = 12V/75Ω = 0.16A, Ptotal = I²×R = 1.92W\n\n' +
      'RANGKAIAN Q (PARALEL 2R): 1/Rtotal = 1/18 + 1/36 = 0.083, Rtotal = 12Ω, I = 1A, Ptotal = V²/R = 12W\n\n' +
      'RANGKAIAN R (SERI 3R): Rtotal = 20+30+40 = 90Ω, I = 0.133A, Ptotal = 1.6W\n\n' +
      'URUTAN: Q (12W) > P (1.92W) > R (1.6W)',
    difficulty: 'hard'
  },

  // Soal 7: Circuit (TipeSoal1) - Rangkaian Paralel Lanjutan  
  circuitQuestions[3],

  // Soal 8: Circuit Ordering (TipeSoal2) - Complex Manual Define
  {
    id: 'order-complex-easy',
    questionType: 'circuitOrdering',
    title: 'Perbandingan Rangkaian Seri vs Paralel',
    description: 'Bandingkan kecerahan total dari rangkaian dengan konfigurasi yang berbeda',
    instruction: 'Urutkan rangkaian dari yang memberikan pencahayaan paling terang ke paling redup',
    circuits: [
      {
        id: 'A',
        name: 'Rangkaian A - Seri',
        template: 'series',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 10, color: 'brown' },
          { id: 'R2', value: 20, color: 'red' },
          { id: 'R3', value: 40, color: 'orange' }
        ],
        lamps: [
          { id: 'L1', power: 1.7 },
          { id: 'L2', power: 3.4 },
          { id: 'L3', power: 6.9 }
        ],
        brightnessLevel: 'low', // Rtotal = 10+20+40 = 70Ω, I = 12V/70Ω = 0.171A, Ptotal = I²×R = 0.171²×70 = 2.05W
        totalCurrent: 0.171
      },
      {
        id: 'B',
        name: 'Rangkaian B - Paralel',
        template: 'parallel',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 10, color: 'brown' },
          { id: 'R2', value: 20, color: 'red' },
          { id: 'R3', value: 40, color: 'orange' }
        ],
        lamps: [
          { id: 'L1', power: 14.4 },
          { id: 'L2', power: 7.2 },
          { id: 'L3', power: 3.6 }
        ],
        brightnessLevel: 'high', // 1/Rtotal = 1/10 + 1/20 + 1/40 = 0.175, Rtotal = 5.71Ω, I = 12V/5.71Ω = 2.1A, Ptotal = 25.2W
        totalCurrent: 2.1
      },
      {
        id: 'C',
        name: 'Rangkaian C - Campuran',
        template: 'mixed',
        voltage: 12,
        resistors: [
          { id: 'R1', value: 10, color: 'brown' },
          { id: 'R2', value: 20, color: 'red' },
          { id: 'R3', value: 40, color: 'orange' }
        ],
        lamps: [
          { id: 'L1', power: 8.7 },
          { id: 'L2', power: 4.3 }
        ],
        brightnessLevel: 'medium', // Campuran R2||R3 = 13.3Ω, Rtotal = R1 + (R2||R3) = 23.3Ω, I = 0.515A, Ptotal = 13W
        totalCurrent: 0.515
      }
    ],
    correctOrder: ['B', 'C', 'A'], // B (paling terang) → C (sedang) → A (paling redup)
    hint: 'Rangkaian paralel umumnya memberikan daya lebih besar karena setiap lampu mendapat tegangan penuh',
    explanation: 'PERHITUNGAN DETAIL:\n\n' +
      'RANGKAIAN A (SERI): Rtotal = 10+20+40 = 70Ω, I = 12V/70Ω = 0.171A, Ptotal = I²×Rtotal = 0.171²×70 = 2.05W\n\n' +
      'RANGKAIAN B (PARALEL): 1/Rtotal = 1/10 + 1/20 + 1/40 = 0.175, Rtotal = 5.71Ω, I = 12V/5.71Ω = 2.1A, Ptotal = V²/Rtotal = 144/5.71 = 25.2W\n\n' +
      'RANGKAIAN C (CAMPURAN): R2||R3 = (20×40)/(20+40) = 13.33Ω, Rtotal = 10 + 13.33 = 23.33Ω, I = 12V/23.33Ω = 0.515A, Ptotal = I²×Rtotal = 13W\n\n' +
      'URUTAN KECERAHAN: B (25.2W) > C (13W) > A (2.05W)',
    difficulty: 'easy'
  }
];