// ==========================================
// CIRVIA — Student Question Service
// ==========================================

import { supabase } from '@/lib/supabase';
import { Question } from '@/lib/questions';

export interface StudentContext {
  studentId: string;
  className: string;
  testType: 'pretest' | 'posttest';
}

export class StudentQuestionService {
  
  /**
   * Get questions for student based on their class assignment
   */
  static async getQuestionsForStudent(context: StudentContext): Promise<{ data: Question[] | null; error: any }> {
    try {
      console.log('Getting questions for student:', context);

      // First, get the class package assignment
      const { data: classPackage, error: classError } = await supabase
        .from('class_packages')
        .select(`
          *,
          pretest_package:pretest_package_id(id, name, question_ids, time_limit),
          posttest_package:posttest_package_id(id, name, question_ids, time_limit)
        `)
        .eq('class_name', context.className)
        .single();

      if (classError) {
        console.error('Class package error:', classError);
        // If no class package found, return empty array (will use default questions)
        return { data: [], error: `No package assigned for class ${context.className}` };
      }

      if (!classPackage) {
        console.log('No class package found for class:', context.className);
        return { data: [], error: `No package assigned for class ${context.className}` };
      }

      // Get the appropriate package based on test type
      const targetPackage = context.testType === 'pretest' 
        ? (classPackage as any).pretest_package 
        : (classPackage as any).posttest_package;

      if (!targetPackage || !targetPackage.question_ids || targetPackage.question_ids.length === 0) {
        console.log(`No ${context.testType} package found or package has no questions`);
        return { data: [], error: `No ${context.testType} questions found for class ${context.className}` };
      }

      console.log(`Found ${context.testType} package:`, targetPackage);

      // Get all questions from the package
      const questions: Question[] = [];
      
      for (const questionId of targetPackage.question_ids) {
        // Get base question
        const { data: baseQuestion, error: baseError } = await supabase
          .from('questions')
          .select('*')
          .eq('id', questionId)
          .eq('is_active', true)
          .single();

        if (baseError || !baseQuestion) {
          console.error(`Error fetching question ${questionId}:`, baseError);
          continue;
        }

        // Get specific question data based on type
        let fullQuestion: Question | null = null;

        switch (baseQuestion.question_type) {
          case 'circuit':
            const { data: circuitData, error: circuitError } = await supabase
              .from('circuit_questions')
              .select('*')
              .eq('question_id', questionId)
              .single();

            if (!circuitError && circuitData) {
              fullQuestion = {
                id: baseQuestion.id,
                questionType: 'circuit',
                title: baseQuestion.title,
                description: circuitData.description,
                explanation: circuitData.explanation,
                hint: circuitData.hint || '',
                difficulty: baseQuestion.difficulty,
                circuitType: circuitData.circuit_type,
                voltage: circuitData.voltage,
                targetCurrent: circuitData.target_current,
                targetVoltage: circuitData.target_voltage,
                resistorSlots: circuitData.resistor_slots,
                availableResistors: circuitData.available_resistors.map((value: number) => ({ value })),
                correctSolution: circuitData.correct_solution
              };
            }
            break;

          case 'conceptual':
            const { data: conceptualData, error: conceptualError } = await supabase
              .from('conceptual_questions')
              .select('*')
              .eq('question_id', questionId)
              .single();

            if (!conceptualError && conceptualData) {
              fullQuestion = {
                id: baseQuestion.id,
                questionType: 'conceptual',
                title: baseQuestion.title,
                description: '',
                explanation: conceptualData.explanation,
                hint: conceptualData.hint || '',
                difficulty: baseQuestion.difficulty,
                question: conceptualData.question,
                choices: conceptualData.choices,
                correctAnswers: conceptualData.correct_answers
              };
            }
            break;

          case 'circuitAnalysis':
            const { data: analysisData, error: analysisError } = await supabase
              .from('circuit_analysis_questions')
              .select('*')
              .eq('question_id', questionId)
              .single();

            if (!analysisError && analysisData) {
              fullQuestion = {
                id: baseQuestion.id,
                questionType: 'circuitAnalysis',
                title: baseQuestion.title,
                description: '',
                explanation: analysisData.explanation,
                hint: analysisData.hint || '',
                difficulty: baseQuestion.difficulty,
                question: analysisData.question,
                circuit: analysisData.circuit_template,
                targetLamp: analysisData.broken_component,
                correctStates: analysisData.correct_answers.reduce((acc: any, lampId: string) => {
                  acc[lampId] = 'on'; // This should be properly parsed from database
                  return acc;
                }, {})
              };
            }
            break;

          case 'circuitOrdering':
            const { data: orderingData, error: orderingError } = await supabase
              .from('circuit_ordering_questions')
              .select('*')
              .eq('question_id', questionId)
              .single();

            if (!orderingError && orderingData) {
              fullQuestion = {
                id: baseQuestion.id,
                questionType: 'circuitOrdering',
                title: baseQuestion.title,
                description: '',
                explanation: orderingData.explanation,
                hint: orderingData.hint || '',
                difficulty: baseQuestion.difficulty,
                instruction: orderingData.question,
                circuits: orderingData.circuit_items,
                correctOrder: orderingData.correct_order.map((index: number) => orderingData.circuit_items[index]?.id || `circuit-${index}`)
              };
            }
            break;
        }

        if (fullQuestion) {
          questions.push(fullQuestion);
        }
      }

      console.log(`Successfully loaded ${questions.length} questions for student`);
      return { data: questions, error: null };

    } catch (error) {
      console.error('Error in getQuestionsForStudent:', error);
      return { data: null, error };
    }
  }

  /**
   * Get student's class name from their profile or determine from user context
   */
  static async getStudentClass(studentId: string): Promise<{ className: string | null; error: any }> {
    try {
      // This could be extended to get from a students table if you have one
      // For now, we'll try to infer from existing data or return a default
      
      // You might want to implement a students table with class assignments
      // For demo purposes, let's assume students have class info in their profile
      
      // Temporary: extract class from student ID or return a default
      // In a real system, you'd have a proper students table
      return { className: 'X-IPA-1', error: null }; // Default for demo
      
    } catch (error) {
      console.error('Error getting student class:', error);
      return { className: null, error };
    }
  }

  /**
   * Get questions with fallback to default questions if no assignment found
   */
  static async getQuestionsWithFallback(context: StudentContext, fallbackQuestions: Question[]): Promise<Question[]> {
    console.log('[getQuestionsWithFallback] Received fallback questions:', fallbackQuestions?.length);
    console.log('[getQuestionsWithFallback] Fallback questions sample:', fallbackQuestions?.slice(0, 2).map(q => ({ id: q.id, title: q.title })));
    
    const { data: questions, error } = await this.getQuestionsForStudent(context);
    
    if (error || !questions || questions.length === 0) {
      console.log('Using fallback questions:', error);
      console.log('Returning fallback questions count:', fallbackQuestions?.length);
      return fallbackQuestions;
    }
    
    return questions;
  }
}

// React hook for student questions
import { useState, useEffect } from 'react';

export function useStudentQuestions(
  studentId: string | null, 
  className: string | null, 
  testType: 'pretest' | 'posttest',
  fallbackQuestions: Question[]
) {
  const [questions, setQuestions] = useState<Question[]>(fallbackQuestions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug log for fallback questions
  console.log(`[useStudentQuestions] Received fallback questions: ${fallbackQuestions?.length} questions`);
  console.log('[useStudentQuestions] Fallback questions preview:', fallbackQuestions?.slice(0, 2).map(q => ({ id: q.id, title: q.title })));

  useEffect(() => {
    const loadQuestions = async () => {
      if (!studentId || !className) {
        console.log('Missing student context, using fallback questions');
        console.log('Final fallback questions count:', fallbackQuestions?.length);
        setQuestions(fallbackQuestions);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const context: StudentContext = {
          studentId,
          className,
          testType
        };

        const loadedQuestions = await StudentQuestionService.getQuestionsWithFallback(
          context, 
          fallbackQuestions
        );

        console.log('[useStudentQuestions] Final loaded questions count:', loadedQuestions?.length);
        console.log('[useStudentQuestions] Final questions preview:', loadedQuestions?.slice(0, 2).map(q => ({ id: q.id, title: q.title })));
        setQuestions(loadedQuestions);
      } catch (err) {
        console.error('Error loading student questions:', err);
        setError('Failed to load questions');
        setQuestions(fallbackQuestions);
      }

      setLoading(false);
    };

    loadQuestions();
  }, [studentId, className, testType, fallbackQuestions]);

  return { questions, loading, error };
}