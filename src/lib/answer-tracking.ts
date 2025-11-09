/**
 * Unified Answer Tracking System for CIRVIA
 * Supports all question types: conceptual, circuit, circuitAnalysis, simulation
 */

// ===== TYPE DEFINITIONS =====

export interface BaseQuestion {
  id: string | number;
  questionType: 'conceptual' | 'circuit' | 'circuitAnalysis' | 'circuitOrdering' | 'simulation';
  title?: string;
  question?: string;
  description?: string;
  explanation?: string;
  hint?: string;
}

export interface ConceptualQuestion extends BaseQuestion {
  questionType: 'conceptual';
  choices: Array<{
    id?: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
  correctAnswers?: string[];
}

export interface CircuitQuestion extends BaseQuestion {
  questionType: 'circuit';
  correctConfiguration?: number;
  configurations?: Array<{
    description: string;
    isCorrect: boolean;
  }>;
  voltage?: number;
  targetCurrent?: number;
  resistorSlots?: number;
  circuitType?: 'series' | 'parallel' | 'mixed';
  correctSolution?: number[]; // ✅ Array of resistor values that form the correct answer
}

export interface CircuitAnalysisQuestion extends BaseQuestion {
  questionType: 'circuitAnalysis';
  correctAnalysis?: number;
  options?: Array<{
    value: string;
    label: string;
    isCorrect: boolean;
  }>;
  analysisType?: string;
  circuitDiagram?: string;
  targetLamp?: string; // ✅ ID of the broken lamp (e.g., 'L3')
  correctStates?: { [lampId: string]: 'on' | 'off' }; // ✅ Correct lamp states after break
}

export interface CircuitOrderingQuestion extends BaseQuestion {
  questionType: 'circuitOrdering';
  correctOrder?: number[];
  items?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  orderingType?: string;
}

export interface SimulationQuestion extends BaseQuestion {
  questionType: 'simulation';
  expectedValues: {
    voltage?: number;
    current?: number;
    resistance?: number;
  };
  tolerance: number; // percentage tolerance
  simulationType?: string;
}

export type Question = ConceptualQuestion | CircuitQuestion | CircuitAnalysisQuestion | CircuitOrderingQuestion | SimulationQuestion;

/**
 * Normalized answer result for any question type
 */
export interface AnswerResult {
  questionId: string;
  questionType: string;
  selectedAnswer: number | string;
  correctAnswer: number | string;
  isCorrect: boolean;
  questionText: string;
  selectedText: string;
  correctText: string;
  explanation: string;
  metadata?: Record<string, any>;
}

// ===== EXTRACTION FUNCTIONS =====

/**
 * Extract answer for conceptual questions (multiple choice)
 */
export function extractConceptualAnswer(
  question: ConceptualQuestion,
  selectedIndexOrIds: number | string[] | null // ✅ Support both index (old) and array of IDs (new)
): AnswerResult {
  const choices = question.choices || [];
  
  // ✅ Handle array of choice IDs (new drag-and-drop format)
  if (Array.isArray(selectedIndexOrIds)) {
    const selectedIds = selectedIndexOrIds;
    const correctIds = question.correctAnswers || [];
    
    // Check if all selected are correct and all correct are selected
    const isCorrect = 
      selectedIds.length > 0 &&
      selectedIds.length === correctIds.length &&
      selectedIds.every(id => correctIds.includes(id)) &&
      correctIds.every(id => selectedIds.includes(id));
    
    // Build selected text
    const selectedTexts = selectedIds
      .map(id => choices.find(c => c.id === id)?.text)
      .filter(Boolean);
    const selectedText = selectedTexts.length > 0 
      ? selectedTexts.join(', ') 
      : 'Tidak Dijawab';
    
    // Build correct text
    const correctTexts = correctIds
      .map(id => choices.find(c => c.id === id)?.text)
      .filter(Boolean);
    const correctText = correctTexts.length > 0 
      ? correctTexts.join(', ') 
      : 'N/A';
    
    return {
      questionId: String(question.id),
      questionType: 'conceptual',
      selectedAnswer: selectedIds.join(','), // Store as comma-separated IDs
      correctAnswer: correctIds.join(','), // Store as comma-separated IDs
      isCorrect,
      questionText: question.question || question.title || question.description || '',
      selectedText,
      correctText,
      explanation: question.explanation || '',
      metadata: {
        totalChoices: choices.length,
        selectedCount: selectedIds.length,
        correctCount: correctIds.length,
        selectedIds: selectedIds,
        correctIds: correctIds
      }
    };
  }
  
  // ✅ Handle single index (old format - backward compatibility)
  const selectedIndex = selectedIndexOrIds as number | null;
  const correctIndex = choices.findIndex(c => c.isCorrect);
  
  let selectedText = 'Tidak Dijawab';
  let isCorrect = false;
  
  if (selectedIndex !== null && selectedIndex !== undefined && choices[selectedIndex]) {
    selectedText = choices[selectedIndex].text;
    isCorrect = choices[selectedIndex].isCorrect;
  }
  
  return {
    questionId: String(question.id),
    questionType: 'conceptual',
    selectedAnswer: selectedIndex ?? -1,
    correctAnswer: correctIndex,
    isCorrect,
    questionText: question.question || question.title || question.description || '',
    selectedText,
    correctText: correctIndex >= 0 ? choices[correctIndex].text : 'N/A',
    explanation: question.explanation || (selectedIndex !== null && selectedIndex !== undefined && choices[selectedIndex]?.explanation) || '',
    metadata: {
      totalChoices: choices.length,
      choiceExplanation: selectedIndex !== null && selectedIndex !== undefined && choices[selectedIndex]?.explanation
    }
  };
}

/**
 * Extract answer for circuit questions (circuit building)
 */
export function extractCircuitAnswer(
  question: CircuitQuestion,
  userAnswer: number | number[] | null
): AnswerResult {
  let selectedIndex: number | null = null;
  let selectedResistors: number[] | null = null;
  let isCorrect = false;
  let selectedText = 'Tidak Dijawab';
  
  // ✅ Handle different input formats
  if (Array.isArray(userAnswer)) {
    // New format: array of resistor values [30, 60]
    selectedResistors = userAnswer;
    
    // Compare with correct solution from database
    const correctSolution = question.correctSolution || [];
    
    // Sort both arrays for comparison (order might not matter in parallel circuits)
    const sortedUser = [...selectedResistors].sort((a, b) => a - b);
    const sortedCorrect = [...correctSolution].sort((a, b) => a - b);
    
    isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
    selectedText = `Resistor: ${selectedResistors.join('Ω, ')}Ω`;
    
  } else if (typeof userAnswer === 'number' && userAnswer >= 0) {
    // Old format: index of configuration
    selectedIndex = userAnswer;
    const configurations = question.configurations || [];
    const correctIndex = question.correctConfiguration ?? 0;
    
    if (configurations.length > 0 && configurations[selectedIndex]) {
      selectedText = `Konfigurasi ${selectedIndex + 1}: ${configurations[selectedIndex].description}`;
      isCorrect = configurations[selectedIndex].isCorrect;
    } else {
      selectedText = `Konfigurasi ${selectedIndex + 1}`;
      isCorrect = selectedIndex === correctIndex;
    }
  }
  
  const correctSolution = question.correctSolution || [];
  const correctText = correctSolution.length > 0
    ? `Resistor yang benar: ${correctSolution.join('Ω, ')}Ω`
    : 'Konfigurasi benar';
  
  return {
    questionId: String(question.id),
    questionType: 'circuit',
    selectedAnswer: selectedIndex ?? (selectedResistors ? -2 : -1), // -2 = array format, -1 = not answered
    correctAnswer: question.correctConfiguration ?? 0,
    isCorrect,
    questionText: question.title || question.description || '',
    selectedText,
    correctText,
    explanation: question.explanation || question.hint || '',
    metadata: {
      totalConfigurations: question.configurations?.length || 0,
      circuitType: question.circuitType,
      voltage: question.voltage,
      targetCurrent: question.targetCurrent,
      selectedResistors,
      correctSolution
    }
  };
}

/**
 * Extract answer for circuit analysis questions
 */
export function extractCircuitAnalysisAnswer(
  question: CircuitAnalysisQuestion,
  userAnswer: number | { [lampId: string]: 'on' | 'off' | 'unknown' } | null
): AnswerResult {
  let isCorrect = false;
  let selectedText = 'Tidak Dijawab';
  let selectedIndex: number | null = null;
  
  // ✅ Handle different input formats
  if (typeof userAnswer === 'object' && userAnswer !== null && !Array.isArray(userAnswer)) {
    // New format: lamp states object {L1: 'on', L2: 'on', L4: 'off', L5: 'on'}
    const lampStates = userAnswer as { [lampId: string]: 'on' | 'off' | 'unknown' };
    const correctStates = question.correctStates || {};
    
    // Compare each lamp state
    const lampIds = Object.keys(correctStates);
    const allCorrect = lampIds.every(lampId => lampStates[lampId] === correctStates[lampId]);
    const allAnswered = lampIds.every(lampId => lampStates[lampId] !== 'unknown');
    
    isCorrect = allCorrect && allAnswered;
    
    // Build selected text
    const stateTexts = Object.entries(lampStates)
      .filter(([id]) => id !== question.targetLamp) // Exclude broken lamp
      .map(([id, state]) => `${id}: ${state === 'on' ? 'Menyala' : state === 'off' ? 'Mati' : 'Belum dijawab'}`)
      .join(', ');
    selectedText = stateTexts || 'Tidak Dijawab';
    
  } else if (typeof userAnswer === 'number' && userAnswer >= 0) {
    // Old format: index of option
    selectedIndex = userAnswer;
    const options = question.options || [];
    const correctIndex = question.correctAnalysis ?? 0;
    
    if (options.length > 0 && options[selectedIndex]) {
      selectedText = options[selectedIndex].label;
      isCorrect = options[selectedIndex].isCorrect;
    } else {
      selectedText = `Pilihan ${selectedIndex + 1}`;
      isCorrect = selectedIndex === correctIndex;
    }
  }
  
  // Build correct text
  const correctStates = question.correctStates || {};
  const correctTexts = Object.entries(correctStates)
    .filter(([id]) => id !== question.targetLamp)
    .map(([id, state]) => `${id}: ${state === 'on' ? 'Menyala' : 'Mati'}`)
    .join(', ');
  const correctText = correctTexts || 'Lihat penjelasan';
  
  return {
    questionId: String(question.id),
    questionType: 'circuitAnalysis',
    selectedAnswer: selectedIndex ?? -2, // -2 = object format, -1 = not answered
    correctAnswer: question.correctAnalysis ?? 0,
    isCorrect,
    questionText: question.question || question.title || question.description || '',
    selectedText,
    correctText,
    explanation: question.explanation || question.hint || '',
    metadata: {
      totalOptions: question.options?.length || 0,
      analysisType: question.analysisType,
      targetLamp: question.targetLamp,
      correctStates
    }
  };
}

/**
 * Extract answer for simulation questions
 */
export function extractSimulationAnswer(
  question: SimulationQuestion,
  userValues: { voltage?: number; current?: number; resistance?: number } | null
): AnswerResult {
  const expected = question.expectedValues;
  const tolerance = question.tolerance / 100; // convert percentage to decimal
  
  let isCorrect = false;
  let selectedText = 'Tidak Dijawab';
  let correctText = '';
  const checks: boolean[] = [];
  const details: Array<{ param: string; expected: number; user: number; diff: number; withinTolerance: boolean }> = [];
  
  if (userValues) {
    // Check voltage
    if (expected.voltage !== undefined && userValues.voltage !== undefined) {
      const diff = Math.abs(userValues.voltage - expected.voltage);
      const withinTolerance = diff <= (expected.voltage * tolerance);
      checks.push(withinTolerance);
      details.push({
        param: 'voltage',
        expected: expected.voltage,
        user: userValues.voltage,
        diff,
        withinTolerance
      });
      correctText += `V=${expected.voltage}V `;
    }
    
    // Check current
    if (expected.current !== undefined && userValues.current !== undefined) {
      const diff = Math.abs(userValues.current - expected.current);
      const withinTolerance = diff <= (expected.current * tolerance);
      checks.push(withinTolerance);
      details.push({
        param: 'current',
        expected: expected.current,
        user: userValues.current,
        diff,
        withinTolerance
      });
      correctText += `I=${expected.current}A `;
    }
    
    // Check resistance
    if (expected.resistance !== undefined && userValues.resistance !== undefined) {
      const diff = Math.abs(userValues.resistance - expected.resistance);
      const withinTolerance = diff <= (expected.resistance * tolerance);
      checks.push(withinTolerance);
      details.push({
        param: 'resistance',
        expected: expected.resistance,
        user: userValues.resistance,
        diff,
        withinTolerance
      });
      correctText += `R=${expected.resistance}Ω`;
    }
    
    isCorrect = checks.length > 0 && checks.every(c => c);
    selectedText = `V=${userValues.voltage ?? 'N/A'}, I=${userValues.current ?? 'N/A'}, R=${userValues.resistance ?? 'N/A'}`;
  }
  
  return {
    questionId: String(question.id),
    questionType: 'simulation',
    selectedAnswer: JSON.stringify(userValues),
    correctAnswer: JSON.stringify(expected),
    isCorrect,
    questionText: question.question || question.title || question.description || '', // ✅ FIX: Prioritize actual question text
    selectedText,
    correctText: correctText.trim(),
    explanation: question.explanation || question.hint || '',
    metadata: {
      tolerance: question.tolerance,
      userValues,
      expectedValues: expected,
      individualChecks: checks,
      checkDetails: details,
      simulationType: question.simulationType
    }
  };
}

/**
 * Extract answer for circuit ordering questions
 */
export function extractCircuitOrderingAnswer(
  question: CircuitOrderingQuestion,
  userAnswer: number | string[] | null
): AnswerResult {
  let isCorrect = false;
  let selectedText = 'Tidak Dijawab';
  
  // ✅ Handle different input formats
  if (Array.isArray(userAnswer)) {
    // New format: array of circuit IDs in order ['A', 'B', 'C']
    const userOrder = userAnswer as string[];
    const correctOrder = question.correctOrder || [];
    
    // Compare orders
    isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    selectedText = `Urutan: ${userOrder.join(' → ')}`;
    
  } else if (typeof userAnswer === 'number' && userAnswer >= 0) {
    // Old format: not really applicable for ordering, but keep for compatibility
    selectedText = `Urutan: ${userAnswer}`;
    isCorrect = false;
  }
  
  const correctOrder = question.correctOrder || [];
  const correctText = correctOrder.length > 0 
    ? `Urutan benar: ${correctOrder.join(' → ')}` 
    : 'Urutan benar';
  
  return {
    questionId: String(question.id),
    questionType: 'circuitOrdering',
    selectedAnswer: Array.isArray(userAnswer) ? -2 : (userAnswer ?? -1), // -2 = array format
    correctAnswer: 0,
    isCorrect,
    questionText: question.question || question.title || question.description || '',
    selectedText,
    correctText,
    explanation: question.explanation || question.hint || '',
    metadata: {
      totalItems: question.items?.length || 0,
      correctOrder,
      orderingType: question.orderingType,
      userOrder: Array.isArray(userAnswer) ? userAnswer : null
    }
  };
}

/**
 * Main function to extract answer for any question type
 * This is the primary entry point for answer extraction
 */
export function extractAnswer(
  question: Question,
  userAnswer: number | null | string[] | number[] | { [key: string]: string | number } // ✅ Support all formats
): AnswerResult {
  switch (question.questionType) {
    case 'conceptual':
      return extractConceptualAnswer(
        question as ConceptualQuestion, 
        userAnswer as number | string[] | null
      );
    
    case 'circuit':
      return extractCircuitAnswer(
        question as CircuitQuestion, 
        userAnswer as number | number[] | null
      );
    
    case 'circuitAnalysis':
      return extractCircuitAnalysisAnswer(
        question as CircuitAnalysisQuestion, 
        userAnswer as number | { [lampId: string]: 'on' | 'off' | 'unknown' } | null
      );
    
    case 'circuitOrdering':
      return extractCircuitOrderingAnswer(
        question as CircuitOrderingQuestion, 
        userAnswer as number | string[] | null
      );
    
    case 'simulation':
      return extractSimulationAnswer(
        question as SimulationQuestion,
        userAnswer as { voltage?: number; current?: number; resistance?: number } | null
      );
    
    default:
      throw new Error(`Unknown question type: ${(question as any).questionType}`);
  }
}

/**
 * Calculate total score from answer results
 */
export function calculateScore(answerResults: AnswerResult[]): {
  correct: number;
  total: number;
  percentage: number;
} {
  const correct = answerResults.filter(r => r.isCorrect).length;
  const total = answerResults.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return { correct, total, percentage };
}

/**
 * Group answer results by correctness for analysis
 */
export function groupAnswersByCorrectness(answerResults: AnswerResult[]): {
  correct: AnswerResult[];
  incorrect: AnswerResult[];
  unanswered: AnswerResult[];
} {
  return {
    correct: answerResults.filter(r => r.isCorrect),
    incorrect: answerResults.filter(r => !r.isCorrect && (r.selectedAnswer !== -1 && r.selectedAnswer !== null)),
    unanswered: answerResults.filter(r => r.selectedAnswer === -1 || r.selectedAnswer === null)
  };
}

/**
 * Get answer statistics by question type
 */
export function getAnswerStatsByType(answerResults: AnswerResult[]): Record<string, {
  total: number;
  correct: number;
  percentage: number;
}> {
  const stats: Record<string, { total: number; correct: number; percentage: number }> = {};
  
  answerResults.forEach(result => {
    if (!stats[result.questionType]) {
      stats[result.questionType] = { total: 0, correct: 0, percentage: 0 };
    }
    
    stats[result.questionType].total++;
    if (result.isCorrect) {
      stats[result.questionType].correct++;
    }
  });
  
  // Calculate percentages
  Object.keys(stats).forEach(type => {
    const typeStats = stats[type];
    typeStats.percentage = typeStats.total > 0 
      ? Math.round((typeStats.correct / typeStats.total) * 100) 
      : 0;
  });
  
  return stats;
}
