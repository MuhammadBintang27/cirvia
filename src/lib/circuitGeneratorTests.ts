/**
 * Test Suite for Circuit Generator Mathematical Accuracy
 * Verifies power calculations for complex circuits
 */

import { generateComplexCircuitQuestion } from './circuitGenerator';

// Test Series Circuit Calculations
function testSeriesCalculations() {
  console.log('🧮 Testing Series Circuit Calculations...');
  
  // Manual calculation verification
  // R1=100Ω, R2=150Ω, V=12V
  const R1 = 100, R2 = 150, V = 12;
  const RTotal = R1 + R2; // 250Ω
  const I = V / RTotal; // 0.048A
  const P1 = I * I * R1; // 0.2304W
  const P2 = I * I * R2; // 0.3456W
  const PTotal = P1 + P2; // 0.576W
  
  console.log(`Expected Series Results:`);
  console.log(`- Total Resistance: ${RTotal}Ω`);
  console.log(`- Current: ${I.toFixed(4)}A`);
  console.log(`- Power R1: ${P1.toFixed(4)}W`);
  console.log(`- Power R2: ${P2.toFixed(4)}W`);
  console.log(`- Total Power: ${PTotal.toFixed(4)}W`);
  
  return { RTotal, I, P1, P2, PTotal };
}

// Test Parallel Circuit Calculations
function testParallelCalculations() {
  console.log('\n🔀 Testing Parallel Circuit Calculations...');
  
  // Manual calculation verification
  // R1=100Ω, R2=150Ω, V=12V
  const R1 = 100, R2 = 150, V = 12;
  const I1 = V / R1; // 0.12A
  const I2 = V / R2; // 0.08A
  const P1 = V * I1; // 1.44W
  const P2 = V * I2; // 0.96W
  const PTotal = P1 + P2; // 2.4W
  const RTotal = 1 / ((1/R1) + (1/R2)); // 60Ω
  
  console.log(`Expected Parallel Results:`);
  console.log(`- Equivalent Resistance: ${RTotal.toFixed(2)}Ω`);
  console.log(`- Current I1: ${I1.toFixed(3)}A`);
  console.log(`- Current I2: ${I2.toFixed(3)}A`);
  console.log(`- Power R1: ${P1.toFixed(3)}W`);
  console.log(`- Power R2: ${P2.toFixed(3)}W`);
  console.log(`- Total Power: ${PTotal.toFixed(3)}W`);
  
  return { RTotal, I1, I2, P1, P2, PTotal };
}

// Test Mixed Circuit Calculations
function testMixedCalculations() {
  console.log('\n🔄 Testing Mixed Circuit Calculations...');
  
  // Manual calculation verification
  // R1=100Ω in series with (R2=150Ω || R3=150Ω)
  const R1 = 100, R2 = 150, R3 = 150, V = 12;
  const RParallel = 1 / ((1/R2) + (1/R3)); // 75Ω
  const RTotal = R1 + RParallel; // 175Ω
  const ITotal = V / RTotal; // 0.0686A
  const V1 = ITotal * R1; // 6.857V
  const VParallel = ITotal * RParallel; // 5.143V
  const I2 = VParallel / R2; // 0.0343A
  const I3 = VParallel / R3; // 0.0343A
  const P1 = ITotal * ITotal * R1; // 0.47W
  const P2 = VParallel * I2; // 0.176W
  const P3 = VParallel * I3; // 0.176W
  const PTotal = P1 + P2 + P3; // 0.823W
  
  console.log(`Expected Mixed Results:`);
  console.log(`- Series Resistance R1: ${R1}Ω`);
  console.log(`- Parallel Equivalent: ${RParallel}Ω`);
  console.log(`- Total Resistance: ${RTotal}Ω`);
  console.log(`- Total Current: ${ITotal.toFixed(4)}A`);
  console.log(`- Voltage R1: ${V1.toFixed(3)}V`);
  console.log(`- Voltage Parallel: ${VParallel.toFixed(3)}V`);
  console.log(`- Power R1: ${P1.toFixed(3)}W`);
  console.log(`- Power R2: ${P2.toFixed(3)}W`);
  console.log(`- Power R3: ${P3.toFixed(3)}W`);
  console.log(`- Total Power: ${PTotal.toFixed(3)}W`);
  
  return { RTotal, ITotal, V1, VParallel, P1, P2, P3, PTotal };
}

// Test Generator Output
function testGeneratorOutput() {
  console.log('\n🎲 Testing Generator Output...');
  
  const testSeeds = [12345, 23456, 34567];
  const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
  
  difficulties.forEach(difficulty => {
    console.log(`\n📊 Testing ${difficulty.toUpperCase()} difficulty:`);
    
    testSeeds.forEach(seed => {
      const generated = generateComplexCircuitQuestion(seed, difficulty);
      
      console.log(`  Seed ${seed}:`);
      generated.circuits.forEach(circuit => {
        console.log(`    ${circuit.id}: ${circuit.type} - ${circuit.totalPower.toFixed(3)}W (${circuit.brightnessLevel})`);
      });
      console.log(`    Correct Order: ${generated.correctOrder.join(' → ')}`);
    });
  });
}

// Validate Power Ordering
function validatePowerOrdering() {
  console.log('\n✅ Validating Power-based Ordering...');
  
  const testCases = [
    { seed: 12345, difficulty: 'easy' as const },
    { seed: 23456, difficulty: 'medium' as const },
    { seed: 34567, difficulty: 'hard' as const }
  ];
  
  testCases.forEach(({ seed, difficulty }) => {
    const generated = generateComplexCircuitQuestion(seed, difficulty);
    
    // Sort circuits by power (descending)
    const sortedByPower = [...generated.circuits].sort((a, b) => b.totalPower - a.totalPower);
    const expectedOrder = sortedByPower.map(c => c.id);
    
    const isCorrect = JSON.stringify(expectedOrder) === JSON.stringify(generated.correctOrder);
    
    console.log(`Seed ${seed} (${difficulty}): ${isCorrect ? '✅ PASS' : '❌ FAIL'}`);
    if (!isCorrect) {
      console.log(`  Expected: ${expectedOrder.join(' → ')}`);
      console.log(`  Generated: ${generated.correctOrder.join(' → ')}`);
    }
  });
}

// Brightness Level Assignment Test
function testBrightnessAssignment() {
  console.log('\n🌟 Testing Brightness Level Assignment...');
  
  const generated = generateComplexCircuitQuestion(12345, 'medium');
  const sortedByPower = [...generated.circuits].sort((a, b) => b.totalPower - a.totalPower);
  
  console.log('Circuits sorted by power (highest to lowest):');
  sortedByPower.forEach((circuit, index) => {
    const expectedBrightness = index === 0 ? 'high' : index === 1 ? 'medium' : 'low';
    const isCorrect = circuit.brightnessLevel === expectedBrightness;
    
    console.log(`  ${circuit.id}: ${circuit.totalPower.toFixed(3)}W - ${circuit.brightnessLevel} ${isCorrect ? '✅' : '❌'}`);
  });
}

// Run all tests
export function runCircuitGeneratorTests() {
  console.log('🧪 CIRCUIT GENERATOR TEST SUITE');
  console.log('================================\n');
  
  try {
    testSeriesCalculations();
    testParallelCalculations();
    testMixedCalculations();
    testGeneratorOutput();
    validatePowerOrdering();
    testBrightnessAssignment();
    
    console.log('\n🎉 ALL TESTS COMPLETED!');
    console.log('Check output above for any failures or validation issues.');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Export for use in console
if (typeof window !== 'undefined') {
  (window as any).runCircuitTests = runCircuitGeneratorTests;
  console.log('💡 Run circuit tests with: runCircuitTests()');
}