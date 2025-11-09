/**
 * Test Suite: Conceptual Question Answer Tracking (Choice ID-based)
 * 
 * Validates that extractConceptualAnswer correctly handles:
 * - Array of choice IDs (new drag-and-drop format)
 * - Empty selection (no answer)
 * - Partial selection (1 of 2 correct)
 * - Full correct selection (both correct)
 * - Wrong selection
 * - Reordered choices (drag-and-drop scenario)
 */

import { extractConceptualAnswer } from '@/lib/answer-tracking';
import { ConceptualQuestion } from '@/lib/questions';

describe('extractConceptualAnswer - Choice ID-based Validation', () => {
  // Mock PRETEST Q1 structure (2 correct answers)
  const mockQuestion: ConceptualQuestion = {
    id: 'pretest-q1',
    questionType: 'conceptual',
    title: 'Hukum Ohm — Dampak Perubahan Tegangan',
    question: 'Di ruang tamu, tiga lampu terhubung pada sumber 220 V...',
    choices: [
      { id: 'choice-1', text: 'Lampu-lampu disusun paralel', isCorrect: true },
      { id: 'choice-2', text: 'Arus yang mengalir di setiap lampu sama besar', isCorrect: false },
      { id: 'choice-3', text: 'Tegangan pada tiap lampu sama besar', isCorrect: true },
      { id: 'choice-4', text: 'Lampu disusun seri', isCorrect: false },
      { id: 'choice-5', text: 'Hambatan total rangkaian bertambah', isCorrect: false }
    ],
    correctAnswers: ['choice-1', 'choice-3'], // 2 correct answers
    explanation: 'Karena ketika satu lampu padam dua lainnya tetap menyala...',
    hint: 'Ingat ciri paralel: tiap beban tetap menyala sendiri dan tegangannya sama'
  };

  describe('Array of Choice IDs (New Format)', () => {
    test('Should mark CORRECT when both correct choices selected', () => {
      const result = extractConceptualAnswer(mockQuestion, ['choice-1', 'choice-3']);
      
      expect(result.isCorrect).toBe(true);
      expect(result.selectedText).toContain('Lampu-lampu disusun paralel');
      expect(result.selectedText).toContain('Tegangan pada tiap lampu sama besar');
      expect(result.metadata.selectedIds).toEqual(['choice-1', 'choice-3']);
      expect(result.metadata.correctIds).toEqual(['choice-1', 'choice-3']);
    });

    test('Should mark WRONG when only 1 of 2 correct choices selected', () => {
      const result = extractConceptualAnswer(mockQuestion, ['choice-1']); // Missing choice-3
      
      expect(result.isCorrect).toBe(false);
      expect(result.selectedText).toBe('Lampu-lampu disusun paralel');
      expect(result.metadata.selectedCount).toBe(1);
      expect(result.metadata.correctCount).toBe(2);
    });

    test('Should mark WRONG when empty selection', () => {
      const result = extractConceptualAnswer(mockQuestion, []);
      
      expect(result.isCorrect).toBe(false);
      expect(result.selectedText).toBe('Tidak Dijawab');
      expect(result.metadata.selectedCount).toBe(0);
    });

    test('Should mark WRONG when wrong choices selected', () => {
      const result = extractConceptualAnswer(mockQuestion, ['choice-2', 'choice-4']);
      
      expect(result.isCorrect).toBe(false);
      expect(result.selectedText).toContain('Arus yang mengalir di setiap lampu sama besar');
      expect(result.selectedText).toContain('Lampu disusun seri');
      expect(result.metadata.selectedIds).toEqual(['choice-2', 'choice-4']);
    });

    test('Should mark WRONG when mixing correct and wrong choices', () => {
      const result = extractConceptualAnswer(mockQuestion, ['choice-1', 'choice-2', 'choice-3']);
      
      expect(result.isCorrect).toBe(false); // Extra wrong choice
      expect(result.metadata.selectedCount).toBe(3);
      expect(result.metadata.correctCount).toBe(2);
    });

    test('Should handle reordered choices (drag-and-drop scenario)', () => {
      // Simulate user dragging choices to different order
      const reorderedQuestion = {
        ...mockQuestion,
        choices: [
          { id: 'choice-5', text: 'Hambatan total rangkaian bertambah', isCorrect: false },
          { id: 'choice-3', text: 'Tegangan pada tiap lampu sama besar', isCorrect: true },
          { id: 'choice-1', text: 'Lampu-lampu disusun paralel', isCorrect: true },
          { id: 'choice-2', text: 'Arus yang mengalir di setiap lampu sama besar', isCorrect: false },
          { id: 'choice-4', text: 'Lampu disusun seri', isCorrect: false }
        ]
      };

      // User selects correct IDs regardless of UI order
      const result = extractConceptualAnswer(reorderedQuestion as ConceptualQuestion, ['choice-1', 'choice-3']);
      
      expect(result.isCorrect).toBe(true); // ✅ Still correct despite reordering
      expect(result.selectedText).toContain('Lampu-lampu disusun paralel');
      expect(result.selectedText).toContain('Tegangan pada tiap lampu sama besar');
    });
  });

  describe('Backward Compatibility (Single Index)', () => {
    const singleChoiceQuestion: ConceptualQuestion = {
      id: 'test-single',
      questionType: 'conceptual',
      title: 'Test Single Answer',
      question: 'Which is correct?',
      choices: [
        { id: 'choice-1', text: 'Wrong A', isCorrect: false },
        { id: 'choice-2', text: 'Correct B', isCorrect: true },
        { id: 'choice-3', text: 'Wrong C', isCorrect: false }
      ],
      correctAnswers: ['choice-2'],
      explanation: 'B is correct',
      hint: 'Think about B'
    };

    test('Should handle single index (old format)', () => {
      const result = extractConceptualAnswer(singleChoiceQuestion, 1); // Index 1 = choice-2
      
      expect(result.isCorrect).toBe(true);
      expect(result.selectedText).toBe('Correct B');
      expect(result.selectedAnswer).toBe(1);
      expect(result.correctAnswer).toBe(1);
    });

    test('Should mark wrong when wrong index selected', () => {
      const result = extractConceptualAnswer(singleChoiceQuestion, 0); // Index 0 = choice-1 (wrong)
      
      expect(result.isCorrect).toBe(false);
      expect(result.selectedText).toBe('Wrong A');
    });

    test('Should handle null index (no selection)', () => {
      const result = extractConceptualAnswer(singleChoiceQuestion, null);
      
      expect(result.isCorrect).toBe(false);
      expect(result.selectedText).toBe('Tidak Dijawab');
      expect(result.selectedAnswer).toBe(-1);
    });
  });

  describe('Edge Cases', () => {
    test('Should handle question with no correct answers defined', () => {
      const noCorrectQuestion = {
        ...mockQuestion,
        correctAnswers: []
      };

      const result = extractConceptualAnswer(noCorrectQuestion as ConceptualQuestion, ['choice-1']);
      
      expect(result.isCorrect).toBe(false);
      expect(result.metadata.correctCount).toBe(0);
    });

    test('Should handle empty choices array', () => {
      const emptyChoicesQuestion = {
        ...mockQuestion,
        choices: [],
        correctAnswers: []
      };

      const result = extractConceptualAnswer(emptyChoicesQuestion as ConceptualQuestion, []);
      
      expect(result.isCorrect).toBe(false);
      expect(result.selectedText).toBe('Tidak Dijawab');
      expect(result.metadata.totalChoices).toBe(0);
    });

    test('Should handle non-existent choice IDs gracefully', () => {
      const result = extractConceptualAnswer(mockQuestion, ['choice-999', 'choice-888']);
      
      expect(result.isCorrect).toBe(false);
      expect(result.selectedText).toBe('Tidak Dijawab'); // No valid texts found
    });
  });

  describe('Metadata Tracking', () => {
    test('Should include proper metadata for correct answer', () => {
      const result = extractConceptualAnswer(mockQuestion, ['choice-1', 'choice-3']);
      
      expect(result.metadata).toMatchObject({
        totalChoices: 5,
        selectedCount: 2,
        correctCount: 2,
        selectedIds: ['choice-1', 'choice-3'],
        correctIds: ['choice-1', 'choice-3']
      });
    });

    test('Should include proper metadata for wrong answer', () => {
      const result = extractConceptualAnswer(mockQuestion, ['choice-2']);
      
      expect(result.metadata).toMatchObject({
        totalChoices: 5,
        selectedCount: 1,
        correctCount: 2,
        selectedIds: ['choice-2'],
        correctIds: ['choice-1', 'choice-3']
      });
    });
  });
});
