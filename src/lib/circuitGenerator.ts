/**
 * Circuit Generator for TipeSoal2
 * Generates complex circuit configurations with series, parallel, and mixed arrangements
 */

export type CircuitType = 'series' | 'parallel' | 'mixed';
export type BrightnessLevel = 'high' | 'medium' | 'low';

export interface LampElement {
  id: string;
  resistance: number; // Ohm
  voltage: number;    // Voltage across this lamp
  current: number;    // Current through this lamp
  power: number;      // Power dissipated by this lamp
}

export interface CircuitConfiguration {
  id: string;
  name: string;
  type: CircuitType;
  sourceVoltage: number;
  lamps: LampElement[];
  totalPower: number;
  brightnessLevel: BrightnessLevel;
  description: string;
}

export interface GeneratedQuestion {
  circuits: CircuitConfiguration[];
  correctOrder: string[];
  explanation: string;
}

/**
 * Calculate equivalent resistance for series connection
 */
function calculateSeriesResistance(resistances: number[]): number {
  return resistances.reduce((total, r) => total + r, 0);
}

/**
 * Calculate equivalent resistance for parallel connection
 */
function calculateParallelResistance(resistances: number[]): number {
  const inverseSum = resistances.reduce((sum, r) => sum + (1 / r), 0);
  return 1 / inverseSum;
}

/**
 * Calculate power distribution in series circuit
 */
function calculateSeriesPowerDistribution(
  resistances: number[], 
  sourceVoltage: number
): LampElement[] {
  const totalResistance = calculateSeriesResistance(resistances);
  const current = sourceVoltage / totalResistance;
  
  return resistances.map((resistance, index) => ({
    id: `L${index + 1}`,
    resistance,
    voltage: current * resistance,
    current,
    power: current * current * resistance
  }));
}

/**
 * Calculate power distribution in parallel circuit
 */
function calculateParallelPowerDistribution(
  resistances: number[], 
  sourceVoltage: number
): LampElement[] {
  return resistances.map((resistance, index) => {
    const current = sourceVoltage / resistance;
    return {
      id: `L${index + 1}`,
      resistance,
      voltage: sourceVoltage,
      current,
      power: sourceVoltage * current
    };
  });
}

/**
 * Calculate power distribution in mixed circuit (series-parallel combination)
 * Format: [R1] -- [R2 || R3] (R1 in series with parallel R2,R3)
 */
function calculateMixedPowerDistribution(
  resistances: number[], 
  sourceVoltage: number
): LampElement[] {
  if (resistances.length < 3) {
    throw new Error('Mixed circuit requires at least 3 resistors');
  }
  
  // R1 is in series, R2 and R3 are in parallel
  const [r1, r2, r3, ...rest] = resistances;
  const parallelEquivalent = calculateParallelResistance([r2, r3]);
  const totalResistance = r1 + parallelEquivalent;
  const totalCurrent = sourceVoltage / totalResistance;
  
  // Voltage across series resistor R1
  const v1 = totalCurrent * r1;
  // Voltage across parallel branch
  const vParallel = totalCurrent * parallelEquivalent;
  
  // Currents in parallel branch
  const i2 = vParallel / r2;
  const i3 = vParallel / r3;
  
  const lamps: LampElement[] = [
    {
      id: 'L1',
      resistance: r1,
      voltage: v1,
      current: totalCurrent,
      power: totalCurrent * totalCurrent * r1
    },
    {
      id: 'L2',
      resistance: r2,
      voltage: vParallel,
      current: i2,
      power: vParallel * i2
    },
    {
      id: 'L3',
      resistance: r3,
      voltage: vParallel,
      current: i3,
      power: vParallel * i3
    }
  ];
  
  // Handle additional resistors in series if any
  if (rest.length > 0) {
    // Add remaining resistors in series after the parallel branch
    const remainingResistance = calculateSeriesResistance(rest);
    const remainingVoltage = totalCurrent * remainingResistance;
    
    rest.forEach((resistance, index) => {
      lamps.push({
        id: `L${4 + index}`,
        resistance,
        voltage: totalCurrent * resistance,
        current: totalCurrent,
        power: totalCurrent * totalCurrent * resistance
      });
    });
  }
  
  return lamps;
}

/**
 * Generate circuit configuration
 */
function generateCircuitConfiguration(
  id: string,
  name: string,
  type: CircuitType,
  resistances: number[],
  sourceVoltage: number = 12
): CircuitConfiguration {
  let lamps: LampElement[];
  let description: string;
  
  switch (type) {
    case 'series':
      lamps = calculateSeriesPowerDistribution(resistances, sourceVoltage);
      description = `Rangkaian seri ${resistances.length} lampu`;
      break;
      
    case 'parallel':
      lamps = calculateParallelPowerDistribution(resistances, sourceVoltage);
      description = `Rangkaian paralel ${resistances.length} lampu`;
      break;
      
    case 'mixed':
      lamps = calculateMixedPowerDistribution(resistances, sourceVoltage);
      description = `Rangkaian campuran (seri-paralel)`;
      break;
      
    default:
      throw new Error(`Unknown circuit type: ${type}`);
  }
  
  const totalPower = lamps.reduce((sum, lamp) => sum + lamp.power, 0);
  
  return {
    id,
    name,
    type,
    sourceVoltage,
    lamps,
    totalPower,
    brightnessLevel: 'medium', // Will be calculated later
    description
  };
}

/**
 * Assign brightness levels based on total power
 */
function assignBrightnessLevels(circuits: CircuitConfiguration[]): CircuitConfiguration[] {
  // Sort by total power (descending)
  const sorted = [...circuits].sort((a, b) => b.totalPower - a.totalPower);
  
  return circuits.map(circuit => {
    const rank = sorted.findIndex(c => c.id === circuit.id);
    let brightnessLevel: BrightnessLevel;
    
    if (rank === 0) brightnessLevel = 'high';
    else if (rank === 1) brightnessLevel = 'medium';
    else brightnessLevel = 'low';
    
    return { ...circuit, brightnessLevel };
  });
}

/**
 * Generate explanation text
 */
function generateExplanation(circuits: CircuitConfiguration[]): string {
  const sorted = [...circuits].sort((a, b) => b.totalPower - a.totalPower);
  
  let explanation = "Kecerahan lampu bergantung pada daya total yang dikonsumsi oleh rangkaian:\n\n";
  
  sorted.forEach((circuit, index) => {
    const rank = index === 0 ? "paling terang" : index === 1 ? "sedang" : "paling redup";
    explanation += `${index + 1}. Rangkaian ${circuit.id} (${rank}): `;
    
    switch (circuit.type) {
      case 'series':
        explanation += `Dalam rangkaian seri, arus sama di semua lampu (${circuit.lamps[0].current.toFixed(3)}A), tetapi tegangan terbagi. Total daya = ${circuit.totalPower.toFixed(2)}W.\n`;
        break;
        
      case 'parallel':
        explanation += `Dalam rangkaian paralel, setiap lampu mendapat tegangan penuh (${circuit.sourceVoltage}V), sehingga daya maksimal. Total daya = ${circuit.totalPower.toFixed(2)}W.\n`;
        break;
        
      case 'mixed':
        explanation += `Rangkaian campuran menggabungkan karakteristik seri dan paralel. Lampu pada cabang paralel berbagi tegangan, sedangkan lampu seri mendapat arus yang sama. Total daya = ${circuit.totalPower.toFixed(2)}W.\n`;
        break;
    }
  });
  
  explanation += "\nSemakin besar daya total, semakin terang pencahayaan keseluruhan rangkaian.";
  
  return explanation;
}

/**
 * Predefined resistance values (common resistor values)
 */
const STANDARD_RESISTANCES = [10, 22, 47, 68, 100, 150, 220, 330, 470, 680, 1000];

/**
 * Generate question with deterministic seed
 */
export function generateComplexCircuitQuestion(
  seed: number = Math.floor(Math.random() * 1000),
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): GeneratedQuestion {
  // Simple seeded random number generator
  let seedValue = seed;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
  
  const sourceVoltage = 12; // Standard voltage
  let circuits: CircuitConfiguration[] = [];
  
  // Generate different circuit configurations based on difficulty
  switch (difficulty) {
    case 'easy':
      // 2-lamp circuits with different configurations
      circuits = [
        generateCircuitConfiguration(
          'A', 'Rangkaian A', 'series',
          [100, 100], sourceVoltage
        ),
        generateCircuitConfiguration(
          'B', 'Rangkaian B', 'parallel',
          [100, 100], sourceVoltage
        ),
        generateCircuitConfiguration(
          'C', 'Rangkaian C', 'series',
          [220, 100], sourceVoltage
        )
      ];
      break;
      
    case 'medium':
      // 3-lamp circuits with more variety
      circuits = [
        generateCircuitConfiguration(
          'A', 'Rangkaian A', 'series',
          [100, 150, 100], sourceVoltage
        ),
        generateCircuitConfiguration(
          'B', 'Rangkaian B', 'parallel',
          [150, 150, 150], sourceVoltage
        ),
        generateCircuitConfiguration(
          'C', 'Rangkaian C', 'mixed',
          [100, 150, 150], sourceVoltage
        )
      ];
      break;
      
    case 'hard':
      // Complex mixed circuits
      circuits = [
        generateCircuitConfiguration(
          'A', 'Rangkaian A', 'mixed',
          [68, 100, 150], sourceVoltage
        ),
        generateCircuitConfiguration(
          'B', 'Rangkaian B', 'series',
          [47, 68, 100, 150], sourceVoltage
        ),
        generateCircuitConfiguration(
          'C', 'Rangkaian C', 'parallel',
          [100, 150, 220], sourceVoltage
        )
      ];
      break;
  }
  
  // Assign brightness levels
  circuits = assignBrightnessLevels(circuits);
  
  // Generate correct order (highest to lowest power)
  const correctOrder = [...circuits]
    .sort((a, b) => b.totalPower - a.totalPower)
    .map(c => c.id);
  
  const explanation = generateExplanation(circuits);
  
  return {
    circuits,
    correctOrder,
    explanation
  };
}

/**
 * Convert generated circuit to the format expected by TipeSoal2
 */
export function convertToTipeSoal2Format(generatedQuestion: GeneratedQuestion) {
  return {
    circuits: generatedQuestion.circuits.map(circuit => ({
      id: circuit.id,
      name: circuit.name,
      resistorValue: Math.round(circuit.totalPower * 10), // Use power as proxy for "resistor value"
      brightnessLevel: circuit.brightnessLevel
    })),
    correctOrder: generatedQuestion.correctOrder,
    explanation: generatedQuestion.explanation
  };
}