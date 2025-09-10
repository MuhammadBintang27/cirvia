export interface CircuitQuestion {
  id: number;
  title: string;
  description: string;
  circuitType: 'series' | 'parallel';
  voltage: number; // Voltage source in volts
  targetCurrent?: number; // Target current in amperes
  targetVoltage?: number; // Target voltage across specific component
  resistorSlots: number; // Number of resistor slots
  availableResistors: Resistor[];
  correctSolution: number[]; // Array of resistor values in order
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

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

export const circuitQuestions: CircuitQuestion[] = [
  {
    id: 1,
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