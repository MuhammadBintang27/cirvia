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
  selectedIndex: number | null
): AnswerResult {
  const choices = question.choices || [];
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
    questionText: question.question || question.title || question.description || '', // ✅ FIX: Prioritize actual question text over title
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
  selectedIndex: number | null
): AnswerResult {
  const configurations = question.configurations || [];
  const correctIndex = configurations.findIndex(c => c.isCorrect) !== -1 
    ? configurations.findIndex(c => c.isCorrect) 
    : question.correctConfiguration ?? 0;
  
  let selectedText = 'Tidak Dijawab';
  let isCorrect = false;
  
  if (selectedIndex !== null && selectedIndex !== undefined) {
    if (configurations.length > 0 && configurations[selectedIndex]) {
      selectedText = `Konfigurasi ${selectedIndex + 1}: ${configurations[selectedIndex].description}`;
      isCorrect = configurations[selectedIndex].isCorrect;
    } else {
      selectedText = `Konfigurasi ${selectedIndex + 1}`;
      isCorrect = selectedIndex === correctIndex;
    }
  }
  
  const correctText = configurations.length > 0 && configurations[correctIndex]
    ? `Konfigurasi ${correctIndex + 1}: ${configurations[correctIndex].description}`
    : `Konfigurasi ${correctIndex + 1}`;
  
  return {
    questionId: String(question.id),
    questionType: 'circuit',
    selectedAnswer: selectedIndex ?? -1,
    correctAnswer: correctIndex,
    isCorrect,
    questionText: question.title || question.description || '',
    selectedText,
    correctText,
    explanation: question.explanation || question.hint || '',
    metadata: {
      totalConfigurations: configurations.length,
      circuitType: question.circuitType,
      voltage: question.voltage,
      targetCurrent: question.targetCurrent
    }
  };
}

/**
 * Extract answer for circuit analysis questions
 */
export function extractCircuitAnalysisAnswer(
  question: CircuitAnalysisQuestion,
  selectedIndex: number | null
): AnswerResult {
  const options = question.options || [];
  const correctIndex = options.findIndex(o => o.isCorrect) !== -1
    ? options.findIndex(o => o.isCorrect)
    : question.correctAnalysis ?? 0;
  
  let selectedText = 'Tidak Dijawab';
  let isCorrect = false;
  
  if (selectedIndex !== null && selectedIndex !== undefined) {
    if (options.length > 0 && options[selectedIndex]) {
      selectedText = options[selectedIndex].label;
      isCorrect = options[selectedIndex].isCorrect;
    } else {
      selectedText = `Pilihan ${selectedIndex + 1}`;
      isCorrect = selectedIndex === correctIndex;
    }
  }
  
  const correctText = options.length > 0 && options[correctIndex]
    ? options[correctIndex].label
    : `Pilihan ${correctIndex + 1}`;
  
  return {
    questionId: String(question.id),
    questionType: 'circuitAnalysis',
    selectedAnswer: selectedIndex ?? -1,
    correctAnswer: correctIndex,
    isCorrect,
    questionText: question.question || question.title || question.description || '', // ✅ FIX: Prioritize actual question text
    selectedText,
    correctText,
    explanation: question.explanation || question.hint || '',
    metadata: {
      totalOptions: options.length,
      selectedValue: selectedIndex !== null && selectedIndex !== undefined && options[selectedIndex] ? options[selectedIndex].value : null,
      analysisType: question.analysisType
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
  selectedIndex: number | null
): AnswerResult {
  const items = question.items || [];
  const correctOrder = question.correctOrder || [];
  const correctIndex = 0; // For circuit ordering, we typically track if the order is correct
  
  let selectedText = 'Tidak Dijawab';
  let isCorrect = false;
  
  if (selectedIndex !== null && selectedIndex !== undefined) {
    selectedText = `Urutan: ${selectedIndex}`;
    // Circuit ordering is typically validated differently
    // This is a simplified version - you may need to adjust based on your actual logic
    isCorrect = false; // Will be set by the specific ordering validation logic
  }
  
  return {
    questionId: String(question.id),
    questionType: 'circuitOrdering',
    selectedAnswer: selectedIndex ?? -1,
    correctAnswer: correctIndex,
    isCorrect,
    questionText: question.question || question.title || question.description || '',
    selectedText,
    correctText: correctOrder.length > 0 ? `Urutan benar: ${correctOrder.join(', ')}` : 'Urutan benar',
    explanation: question.explanation || question.hint || '',
    metadata: {
      totalItems: items.length,
      correctOrder,
      orderingType: question.orderingType
    }
  };
}

/**
 * Main function to extract answer for any question type
 * This is the primary entry point for answer extraction
 */
export function extractAnswer(
  question: Question,
  userAnswer: number | null | { voltage?: number; current?: number; resistance?: number }
): AnswerResult {
  switch (question.questionType) {
    case 'conceptual':
      return extractConceptualAnswer(question as ConceptualQuestion, userAnswer as number | null);
    
    case 'circuit':
      return extractCircuitAnswer(question as CircuitQuestion, userAnswer as number | null);
    
    case 'circuitAnalysis':
      return extractCircuitAnalysisAnswer(question as CircuitAnalysisQuestion, userAnswer as number | null);
    
    case 'circuitOrdering':
      return extractCircuitOrderingAnswer(question as CircuitOrderingQuestion, userAnswer as number | null);
    
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
