// ==========================================
// CIRVIA — Supabase Question Service (Hybrid Approach)
// ==========================================

import { supabase } from '@/lib/supabase';
import { Question, CircuitQuestion, ConceptualQuestion, CircuitAnalysisQuestion, CircuitOrderingQuestion } from '@/lib/questions';

// Database interfaces matching the schema
export interface DatabaseQuestion {
  id: string;
  teacher_id: string;
  question_type: 'circuit' | 'conceptual' | 'circuitAnalysis' | 'circuitOrdering';
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCircuitQuestion {
  id: string;
  question_id: string;
  circuit_type: 'series' | 'parallel';
  voltage: number;
  target_current?: number;
  target_voltage?: number;
  resistor_slots: number;
  available_resistors: number[];
  correct_solution: number[];
  description: string;
  explanation: string;
  hint?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseConceptualQuestion {
  id: string;
  question_id: string;
  question: string;
  explanation: string;
  hint?: string;
  is_multiple_choice: boolean;
  choices: Array<{ id: string; text: string; isCorrect: boolean }>;
  correct_answers: string[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseCircuitAnalysisQuestion {
  id: string;
  question_id: string;
  circuit_template: string;
  broken_component: string;
  question: string;
  explanation: string;
  hint?: string;
  choices: Array<{ id: string; text: string; isCorrect: boolean }>;
  correct_answers: string[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseCircuitOrderingQuestion {
  id: string;
  question_id: string;
  ordering_type: 'current' | 'voltage' | 'resistance' | 'power' | 'brightness';
  question: string;
  explanation: string;
  hint?: string;
  circuit_items: any[];
  correct_order: number[];
  created_at: string;
  updated_at: string;
}

// Existing interfaces (keeping the same)
export interface QuestionPackage {
  id: string;
  teacher_id: string;
  name: string;
  description?: string;
  package_type: 'pretest' | 'posttest' | 'practice' | 'quiz';
  question_ids: string[];
  time_limit?: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassPackage {
  id: string;
  teacher_id: string;
  class_name: string;
  pretest_package_id?: string;
  posttest_package_id?: string;
  assigned_at: string;
  created_at: string;
  updated_at: string;
}

export class SupabaseQuestionService {
  
  // ====================
  // QUESTION OPERATIONS (Hybrid Approach)
  // ====================
  
  static async createQuestion(question: Omit<Question, 'id'>, teacherId: string): Promise<{ data: Question | null; error: any }> {
    try {
      // Start transaction
      const { data: baseQuestion, error: baseError } = await supabase
        .from('questions')
        .insert([{
          teacher_id: teacherId,
          question_type: question.questionType,
          title: question.title,
          difficulty: question.difficulty,
          tags: []
        }])
        .select()
        .single();

      if (baseError || !baseQuestion) {
        return { data: null, error: baseError };
      }

      // Insert into specific question type table
      let specificData;
      let specificError;

      switch (question.questionType) {
        case 'circuit':
          const circuitQ = question as CircuitQuestion & { teacherSettings?: any };
          const teacherSettings = circuitQ.teacherSettings;
          const { data: circuitData, error: circuitError } = await supabase
            .from('circuit_questions')
            .insert([{
              question_id: baseQuestion.id,
              circuit_type: circuitQ.circuitType,
              voltage: circuitQ.voltage,
              target_current: circuitQ.targetCurrent,
              target_voltage: circuitQ.targetVoltage,
              resistor_slots: circuitQ.resistorSlots,
              available_resistors: teacherSettings?.resistorOptions?.map((r: any) => r.value) || [],
              correct_solution: teacherSettings?.correctSolution || [],
              description: circuitQ.description,
              explanation: circuitQ.explanation,
              hint: circuitQ.hint
            }])
            .select()
            .single();
          specificData = circuitData;
          specificError = circuitError;
          break;

        case 'conceptual':
          const conceptualQ = question as ConceptualQuestion;
          const { data: conceptualData, error: conceptualError } = await supabase
            .from('conceptual_questions')
            .insert([{
              question_id: baseQuestion.id,
              question: conceptualQ.question,
              explanation: conceptualQ.explanation,
              hint: conceptualQ.hint,
              is_multiple_choice: true,
              choices: conceptualQ.choices,
              correct_answers: conceptualQ.correctAnswers
            }])
            .select()
            .single();
          specificData = conceptualData;
          specificError = conceptualError;
          break;

        case 'circuitAnalysis':
          const analysisQ = question as CircuitAnalysisQuestion;
          const { data: analysisData, error: analysisError } = await supabase
            .from('circuit_analysis_questions')
            .insert([{
              question_id: baseQuestion.id,
              circuit_template: typeof analysisQ.circuit === 'string' ? analysisQ.circuit : JSON.stringify(analysisQ.circuit),
              broken_component: analysisQ.targetLamp,
              question: analysisQ.question,
              explanation: analysisQ.explanation,
              hint: analysisQ.hint,
              choices: [],
              correct_answers: Object.keys(analysisQ.correctStates)
            }])
            .select()
            .single();
          specificData = analysisData;
          specificError = analysisError;
          break;

        case 'circuitOrdering':
          const orderingQ = question as CircuitOrderingQuestion;
          const { data: orderingData, error: orderingError } = await supabase
            .from('circuit_ordering_questions')
            .insert([{
              question_id: baseQuestion.id,
              ordering_type: 'current',
              question: orderingQ.instruction,
              explanation: orderingQ.explanation,
              hint: orderingQ.hint,
              circuit_items: orderingQ.circuits,
              correct_order: orderingQ.correctOrder.map((id, index) => index)
            }])
            .select()
            .single();
          specificData = orderingData;
          specificError = orderingError;
          break;

        default:
          return { data: null, error: 'Invalid question type' };
      }

      if (specificError) {
        // Rollback - delete the base question if specific insert failed
        await supabase.from('questions').delete().eq('id', baseQuestion.id);
        return { data: null, error: specificError };
      }

      // Convert back to Question format
      const fullQuestion = await this.getQuestionById(baseQuestion.id);
      return fullQuestion;
    } catch (error) {
      console.error('Error creating question:', error);
      return { data: null, error };
    }
  }
  
  static async getQuestionsByTeacher(teacherId: string): Promise<{ data: Question[] | null; error: any }> {
    try {
      // Get all questions for teacher
      const { data: baseQuestions, error: baseError } = await supabase
        .from('questions')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (baseError || !baseQuestions) {
        return { data: null, error: baseError };
      }

      // Get specific data for each question type
      const questions: Question[] = [];
      
      for (const baseQ of baseQuestions) {
        const { data: fullQuestion } = await this.getQuestionById(baseQ.id);
        if (fullQuestion) {
          questions.push(fullQuestion);
        }
      }

      return { data: questions, error: null };
    } catch (error) {
      console.error('Error fetching questions:', error);
      return { data: null, error };
    }
  }
  
  static async getQuestionById(questionId: string): Promise<{ data: Question | null; error: any }> {
    try {
      // Get base question
      const { data: baseQuestion, error: baseError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .eq('is_active', true)
        .single();

      if (baseError || !baseQuestion) {
        return { data: null, error: baseError };
      }

      // Get specific question data based on type
      let fullQuestion: Question;

      switch (baseQuestion.question_type) {
        case 'circuit':
          const { data: circuitData, error: circuitError } = await supabase
            .from('circuit_questions')
            .select('*')
            .eq('question_id', questionId)
            .single();

          if (circuitError || !circuitData) {
            return { data: null, error: circuitError };
          }

          const circuitQuestion = {
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
            resistorSlots: circuitData.resistor_slots
          } as CircuitQuestion;
          
          // Add teacher settings for backwards compatibility
          (circuitQuestion as any).teacherSettings = {
            resistorOptions: circuitData.available_resistors.map((value: number, index: number) => ({
              value,
              label: `R${index + 1} (${value}Ω)`
            })),
            correctSolution: circuitData.correct_solution
          };
          
          fullQuestion = circuitQuestion;
          break;

        case 'conceptual':
          const { data: conceptualData, error: conceptualError } = await supabase
            .from('conceptual_questions')
            .select('*')
            .eq('question_id', questionId)
            .single();

          if (conceptualError || !conceptualData) {
            return { data: null, error: conceptualError };
          }

          fullQuestion = {
            id: baseQuestion.id,
            questionType: 'conceptual',
            title: baseQuestion.title,
            description: '', // Conceptual questions don't have separate description
            explanation: conceptualData.explanation,
            hint: conceptualData.hint || '',
            difficulty: baseQuestion.difficulty,
            question: conceptualData.question,
            choices: conceptualData.choices,
            correctAnswers: conceptualData.correct_answers
          } as ConceptualQuestion;
          break;

        case 'circuitAnalysis':
          const { data: analysisData, error: analysisError } = await supabase
            .from('circuit_analysis_questions')
            .select('*')
            .eq('question_id', questionId)
            .single();

          if (analysisError || !analysisData) {
            return { data: null, error: analysisError };
          }

          fullQuestion = {
            id: baseQuestion.id,
            questionType: 'circuitAnalysis',
            title: baseQuestion.title,
            description: '', // Analysis questions use question field
            explanation: analysisData.explanation,
            hint: analysisData.hint || '',
            difficulty: baseQuestion.difficulty,
            question: analysisData.question,
            circuit: analysisData.circuit_template,
            targetLamp: analysisData.broken_component,
            correctStates: analysisData.correct_answers.reduce((acc: any, lampId: string) => {
              acc[lampId] = 'on'; // Default to 'on', this should be enhanced
              return acc;
            }, {})
          } as CircuitAnalysisQuestion;
          break;

        case 'circuitOrdering':
          const { data: orderingData, error: orderingError } = await supabase
            .from('circuit_ordering_questions')
            .select('*')
            .eq('question_id', questionId)
            .single();

          if (orderingError || !orderingData) {
            return { data: null, error: orderingError };
          }

          fullQuestion = {
            id: baseQuestion.id,
            questionType: 'circuitOrdering',
            title: baseQuestion.title,
            description: '', // Ordering questions use instruction field
            explanation: orderingData.explanation,
            hint: orderingData.hint || '',
            difficulty: baseQuestion.difficulty,
            instruction: orderingData.question,
            circuits: orderingData.circuit_items,
            correctOrder: orderingData.correct_order.map((index: number) => orderingData.circuit_items[index]?.id || `circuit-${index}`)
          } as CircuitOrderingQuestion;
          break;

        default:
          return { data: null, error: 'Unknown question type' };
      }

      return { data: fullQuestion, error: null };
    } catch (error) {
      console.error('Error fetching question:', error);
      return { data: null, error };
    }
  }
  
  static async updateQuestion(questionId: string, updates: Partial<Question>): Promise<{ data: Question | null; error: any }> {
    try {
      // Update base question if needed
      const baseUpdates: Partial<DatabaseQuestion> = {};
      if (updates.title) baseUpdates.title = updates.title;
      if (updates.difficulty) baseUpdates.difficulty = updates.difficulty;

      if (Object.keys(baseUpdates).length > 0) {
        const { error: baseError } = await supabase
          .from('questions')
          .update(baseUpdates)
          .eq('id', questionId);

        if (baseError) {
          return { data: null, error: baseError };
        }
      }

      // Update specific question type table
      // This would need to be implemented based on question type
      // For now, we'll just return the updated question
      const { data: updatedQuestion } = await this.getQuestionById(questionId);
      return { data: updatedQuestion, error: null };
    } catch (error) {
      console.error('Error updating question:', error);
      return { data: null, error };
    }
  }
  
  static async deleteQuestion(questionId: string): Promise<{ error: any }> {
    try {
      // Soft delete - just set is_active to false
      const { error } = await supabase
        .from('questions')
        .update({ is_active: false })
        .eq('id', questionId);
      
      return { error };
    } catch (error) {
      console.error('Error deleting question:', error);
      return { error };
    }
  }

  // ====================
  // QUESTION PACKAGE OPERATIONS (Same as before)
  // ====================
  
  static async createQuestionPackage(packageData: Omit<QuestionPackage, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: QuestionPackage | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('question_packages')
        .insert([packageData])
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error creating question package:', error);
      return { data: null, error };
    }
  }
  
  static async getQuestionPackagesByTeacher(teacherId: string): Promise<{ data: QuestionPackage[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('question_packages')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching question packages:', error);
      return { data: null, error };
    }
  }
  
  static async updateQuestionPackage(packageId: string, updates: Partial<QuestionPackage>): Promise<{ data: QuestionPackage | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('question_packages')
        .update(updates)
        .eq('id', packageId)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating question package:', error);
      return { data: null, error };
    }
  }
  
  // ====================
  // CLASS PACKAGE OPERATIONS (Same as before)
  // ====================
  
  static async assignPackagesToClass(classPackage: Omit<ClassPackage, 'id' | 'assigned_at' | 'created_at' | 'updated_at'>): Promise<{ data: ClassPackage | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('class_packages')
        .upsert([classPackage], { onConflict: 'teacher_id,class_name' })
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error assigning packages to class:', error);
      return { data: null, error };
    }
  }
  
  static async getClassPackages(teacherId: string): Promise<{ data: ClassPackage[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('class_packages')
        .select(`
          *,
          pretest_package:pretest_package_id(id, name, package_type, time_limit),
          posttest_package:posttest_package_id(id, name, package_type, time_limit)
        `)
        .eq('teacher_id', teacherId)
        .order('class_name');
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching class packages:', error);
      return { data: null, error };
    }
  }

  // ====================
  // STATISTICS
  // ====================
  
  static async getQuestionStats(teacherId: string): Promise<{
    total: number;
    byType: Record<string, number>;
    byDifficulty: Record<string, number>;
    error?: any;
  }> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('question_type, difficulty')
        .eq('teacher_id', teacherId)
        .eq('is_active', true);
      
      if (error) {
        return { total: 0, byType: {}, byDifficulty: {}, error };
      }
      
      const total = data?.length || 0;
      const byType: Record<string, number> = {};
      const byDifficulty: Record<string, number> = {};
      
      data?.forEach(q => {
        byType[q.question_type] = (byType[q.question_type] || 0) + 1;
        byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
      });
      
      return { total, byType, byDifficulty };
    } catch (error) {
      console.error('Error fetching question stats:', error);
      return { total: 0, byType: {}, byDifficulty: {}, error };
    }
  }
}

// ====================
// REACT HOOKS
// ====================

import { useState, useEffect } from 'react';

export function useSupabaseQuestions(teacherId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadQuestions = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await SupabaseQuestionService.getQuestionsByTeacher(teacherId);
    
    if (fetchError) {
      setError('Gagal memuat soal');
      console.error('Error loading questions:', fetchError);
    } else if (data) {
      setQuestions(data);
    }
    
    setLoading(false);
  };
  
  const addQuestion = async (question: Omit<Question, 'id'>) => {
    const { data, error: createError } = await SupabaseQuestionService.createQuestion(question, teacherId);
    
    if (createError) {
      throw new Error('Gagal menambahkan soal');
    }
    
    if (data) {
      setQuestions(prev => [data, ...prev]);
      return data;
    }
  };
  
  const updateQuestion = async (questionId: string, updates: Partial<Question>) => {
    const { data, error: updateError } = await SupabaseQuestionService.updateQuestion(questionId, updates);
    
    if (updateError) {
      throw new Error('Gagal memperbarui soal');
    }
    
    if (data) {
      setQuestions(prev => prev.map(q => q.id === questionId ? data : q));
      return data;
    }
  };
  
  const deleteQuestion = async (questionId: string) => {
    const { error: deleteError } = await SupabaseQuestionService.deleteQuestion(questionId);
    
    if (deleteError) {
      throw new Error('Gagal menghapus soal');
    }
    
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };
  
  const getStats = async () => {
    return await SupabaseQuestionService.getQuestionStats(teacherId);
  };
  
  const exportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cirvia-questions-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const importQuestions = (file: File): Promise<{ success: boolean; count: number; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const jsonString = e.target?.result as string;
          const importedQuestions: Question[] = JSON.parse(jsonString);
          
          let successCount = 0;
          let errors: string[] = [];
          
          for (const question of importedQuestions) {
            try {
              await addQuestion(question);
              successCount++;
            } catch (error) {
              errors.push(`Gagal mengimpor soal: ${error}`);
            }
          }
          
          resolve({
            success: successCount > 0,
            count: successCount,
            error: errors.length > 0 ? errors.join(', ') : undefined
          });
        } catch (error) {
          resolve({ success: false, count: 0, error: 'Format file tidak valid' });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, count: 0, error: 'Gagal membaca file' });
      };
      reader.readAsText(file);
    });
  };
  
  useEffect(() => {
    loadQuestions();
  }, [teacherId]);
  
  return {
    questions,
    loading,
    error,
    loadQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    exportQuestions,
    importQuestions,
    getStats
  };
}