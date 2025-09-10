// Circuit calculation utilities using Ohm's Law
// V = I × R, I = V / R, R = V / I

export interface CircuitResult {
  totalResistance: number;
  totalCurrent: number;
  totalPower: number;
  voltageDrops: number[];
  branchCurrents: number[];
  isValid: boolean;
  error?: string;
}

/**
 * Calculate total resistance for series circuit
 * In series: Rtotal = R1 + R2 + R3 + ...
 */
export const calculateSeriesResistance = (resistors: number[]): number => {
  return resistors.reduce((total, resistance) => total + resistance, 0);
};

/**
 * Calculate total resistance for parallel circuit  
 * In parallel: 1/Rtotal = 1/R1 + 1/R2 + 1/R3 + ...
 */
export const calculateParallelResistance = (resistors: number[]): number => {
  if (resistors.length === 0) return 0;
  if (resistors.some(r => r <= 0)) return 0; // Invalid resistance values
  
  const reciprocalSum = resistors.reduce((sum, resistance) => sum + (1 / resistance), 0);
  return 1 / reciprocalSum;
};

/**
 * Calculate circuit parameters for series configuration
 */
export const calculateSeriesCircuit = (voltage: number, resistors: number[]): CircuitResult => {
  try {
    // Validate inputs
    if (voltage <= 0) {
      return {
        totalResistance: 0,
        totalCurrent: 0,
        totalPower: 0,
        voltageDrops: [],
        branchCurrents: [],
        isValid: false,
        error: 'Tegangan harus positif'
      };
    }

    if (resistors.length === 0 || resistors.some(r => r <= 0)) {
      return {
        totalResistance: 0,
        totalCurrent: 0,
        totalPower: 0,
        voltageDrops: [],
        branchCurrents: [],
        isValid: false,
        error: 'Nilai resistor tidak valid'
      };
    }

    // Calculate total resistance (series: R1 + R2 + ...)
    const totalResistance = calculateSeriesResistance(resistors);
    
    // Calculate total current using Ohm's law (I = V/R)
    const totalCurrent = voltage / totalResistance;
    
    // In series circuit, current is same through all components
    const branchCurrents = resistors.map(() => totalCurrent);
    
    // Calculate voltage drop across each resistor (V = I × R)
    const voltageDrops = resistors.map(resistance => totalCurrent * resistance);
    
    // Calculate total power (P = V × I)
    const totalPower = voltage * totalCurrent;

    return {
      totalResistance,
      totalCurrent,
      totalPower,
      voltageDrops,
      branchCurrents,
      isValid: true
    };
  } catch (error) {
    return {
      totalResistance: 0,
      totalCurrent: 0,
      totalPower: 0,
      voltageDrops: [],
      branchCurrents: [],
      isValid: false,
      error: 'Terjadi kesalahan dalam perhitungan'
    };
  }
};

/**
 * Calculate circuit parameters for parallel configuration
 */
export const calculateParallelCircuit = (voltage: number, resistors: number[]): CircuitResult => {
  try {
    // Validate inputs
    if (voltage <= 0) {
      return {
        totalResistance: 0,
        totalCurrent: 0,
        totalPower: 0,
        voltageDrops: [],
        branchCurrents: [],
        isValid: false,
        error: 'Tegangan harus positif'
      };
    }

    if (resistors.length === 0 || resistors.some(r => r <= 0)) {
      return {
        totalResistance: 0,
        totalCurrent: 0,
        totalPower: 0,
        voltageDrops: [],
        branchCurrents: [],
        isValid: false,
        error: 'Nilai resistor tidak valid'
      };
    }

    // Calculate total resistance (parallel: 1/Rtotal = 1/R1 + 1/R2 + ...)
    const totalResistance = calculateParallelResistance(resistors);
    
    // Calculate total current using Ohm's law (I = V/R)
    const totalCurrent = voltage / totalResistance;
    
    // In parallel circuit, voltage is same across all branches
    const voltageDrops = resistors.map(() => voltage);
    
    // Calculate current through each branch (I = V/R)
    const branchCurrents = resistors.map(resistance => voltage / resistance);
    
    // Calculate total power (P = V × I)
    const totalPower = voltage * totalCurrent;

    return {
      totalResistance,
      totalCurrent,
      totalPower,
      voltageDrops,
      branchCurrents,
      isValid: true
    };
  } catch (error) {
    return {
      totalResistance: 0,
      totalCurrent: 0,
      totalPower: 0,
      voltageDrops: [],
      branchCurrents: [],
      isValid: false,
      error: 'Terjadi kesalahan dalam perhitungan'
    };
  }
};

/**
 * Calculate circuit based on type
 */
export const calculateCircuit = (
  circuitType: 'series' | 'parallel',
  voltage: number,
  resistors: number[]
): CircuitResult => {
  if (circuitType === 'series') {
    return calculateSeriesCircuit(voltage, resistors);
  } else {
    return calculateParallelCircuit(voltage, resistors);
  }
};

/**
 * Check if the calculated result matches the target within tolerance
 */
export const checkAnswer = (
  result: CircuitResult,
  targetCurrent?: number,
  targetVoltage?: number,
  tolerance: number = 0.1 // 10% tolerance
): { isCorrect: boolean; message: string; details: string } => {
  if (!result.isValid) {
    return {
      isCorrect: false,
      message: 'Perhitungan tidak valid',
      details: result.error || 'Terjadi kesalahan dalam perhitungan'
    };
  }

  let isCorrect = false;
  let message = '';
  let details = '';

  if (targetCurrent !== undefined) {
    const currentDiff = Math.abs(result.totalCurrent - targetCurrent);
    const currentTolerance = targetCurrent * tolerance;
    
    if (currentDiff <= currentTolerance) {
      isCorrect = true;
      message = `✅ Benar! Arus yang dihasilkan: ${result.totalCurrent.toFixed(3)}A (target: ${targetCurrent}A)`;
      details = `Resistansi total: ${result.totalResistance.toFixed(2)}Ω, Daya total: ${result.totalPower.toFixed(3)}W`;
    } else {
      message = `❌ Kurang tepat. Arus yang dihasilkan: ${result.totalCurrent.toFixed(3)}A (target: ${targetCurrent}A)`;
      details = `Selisih: ${currentDiff.toFixed(3)}A. Coba periksa kembali kombinasi resistor Anda.`;
    }
  }

  if (targetVoltage !== undefined) {
    // For voltage targets, we typically check the first resistor's voltage drop
    const firstVoltage = result.voltageDrops[0] || 0;
    const voltageDiff = Math.abs(firstVoltage - targetVoltage);
    const voltageTolerance = targetVoltage * tolerance;
    
    if (voltageDiff <= voltageTolerance) {
      isCorrect = true;
      message = `✅ Benar! Tegangan yang dihasilkan: ${firstVoltage.toFixed(2)}V (target: ${targetVoltage}V)`;
      details = `Arus rangkaian: ${result.totalCurrent.toFixed(3)}A, Resistansi total: ${result.totalResistance.toFixed(2)}Ω`;
    } else {
      message = `❌ Kurang tepat. Tegangan yang dihasilkan: ${firstVoltage.toFixed(2)}V (target: ${targetVoltage}V)`;
      details = `Selisih: ${voltageDiff.toFixed(2)}V. Periksa kembali nilai resistor dan konfigurasi rangkaian.`;
    }
  }

  return {
    isCorrect,
    message,
    details
  };
};

/**
 * Format number for display with appropriate units
 */
export const formatValue = (value: number, unit: string, precision: number = 3): string => {
  if (value === 0) return `0${unit}`;
  
  if (unit === 'Ω') {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(precision)}MΩ`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(precision)}kΩ`;
    }
  } else if (unit === 'A') {
    if (value < 0.001) {
      return `${(value * 1000000).toFixed(precision)}μA`;
    } else if (value < 1) {
      return `${(value * 1000).toFixed(precision)}mA`;
    }
  } else if (unit === 'V') {
    if (value < 0.001) {
      return `${(value * 1000000).toFixed(precision)}μV`;
    } else if (value < 1) {
      return `${(value * 1000).toFixed(precision)}mV`;
    }
  } else if (unit === 'W') {
    if (value < 0.001) {
      return `${(value * 1000000).toFixed(precision)}μW`;
    } else if (value < 1) {
      return `${(value * 1000).toFixed(precision)}mW`;
    }
  }
  
  return `${value.toFixed(precision)}${unit}`;
};

/**
 * Generate step-by-step solution explanation
 */
export const generateSolutionSteps = (
  circuitType: 'series' | 'parallel',
  voltage: number,
  resistors: number[],
  result: CircuitResult
): string[] => {
  const steps: string[] = [];
  
  if (circuitType === 'series') {
    steps.push('🔗 Rangkaian Seri - Langkah Penyelesaian:');
    steps.push(`1. Menghitung resistansi total: Rtotal = R1 + R2 + ... = ${resistors.join(' + ')} = ${formatValue(result.totalResistance, 'Ω')}`);
    steps.push(`2. Menghitung arus total: I = V/Rtotal = ${voltage}V / ${formatValue(result.totalResistance, 'Ω')} = ${formatValue(result.totalCurrent, 'A')}`);
    steps.push(`3. Dalam rangkaian seri, arus sama di semua komponen: I = ${formatValue(result.totalCurrent, 'A')}`);
    steps.push('4. Menghitung tegangan pada setiap resistor:');
    resistors.forEach((r, i) => {
      steps.push(`   V${i+1} = I × R${i+1} = ${formatValue(result.totalCurrent, 'A')} × ${formatValue(r, 'Ω')} = ${formatValue(result.voltageDrops[i], 'V')}`);
    });
  } else {
    steps.push('🔀 Rangkaian Paralel - Langkah Penyelesaian:');
    steps.push('1. Menghitung resistansi total:');
    steps.push(`   1/Rtotal = ${resistors.map((r, i) => `1/${formatValue(r, 'Ω')}`).join(' + ')}`);
    steps.push(`   Rtotal = ${formatValue(result.totalResistance, 'Ω')}`);
    steps.push(`2. Menghitung arus total: Itotal = V/Rtotal = ${voltage}V / ${formatValue(result.totalResistance, 'Ω')} = ${formatValue(result.totalCurrent, 'A')}`);
    steps.push(`3. Dalam rangkaian paralel, tegangan sama di semua cabang: V = ${voltage}V`);
    steps.push('4. Menghitung arus pada setiap cabang:');
    resistors.forEach((r, i) => {
      steps.push(`   I${i+1} = V/R${i+1} = ${voltage}V / ${formatValue(r, 'Ω')} = ${formatValue(result.branchCurrents[i], 'A')}`);
    });
  }
  
  steps.push(`5. Daya total: P = V × I = ${voltage}V × ${formatValue(result.totalCurrent, 'A')} = ${formatValue(result.totalPower, 'W')}`);
  
  return steps;
};
