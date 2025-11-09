import { supabase } from './supabase'
import type { Database } from './supabase'

type Tables = Database['public']['Tables']
type TestResult = Tables['test_results']['Row']
type TestAnswer = Tables['test_answers']['Row']
type StudentProgress = Tables['student_progress']['Row']
type Student = Tables['students']['Row']

export interface TestResultWithAnswers extends TestResult {
  answers: TestAnswer[]
}

export interface StudentProgressComplete extends StudentProgress {
  preTestResult?: TestResultWithAnswers
  postTestResult?: TestResultWithAnswers
  learningStyleResult?: LearningStyleResult
  improvement?: {
    scoreIncrease: number
    percentageIncrease: number
    timeImprovement: number
  }
}

export interface TestAnswerInput {
  questionId: string // Now accepts both integer (as string) and UUID
  selectedAnswer: number | string // number for index-based, string for simulation JSON
  correctAnswer: number | string // number for index-based, string for simulation JSON
  isCorrect: boolean
  questionText: string
  selectedText: string
  correctText: string
  explanation: string
  questionType?: 'conceptual' | 'circuit' | 'circuitAnalysis' | 'simulation' // Type of question
  metadata?: Record<string, any> // Type-specific metadata (simulation values, circuit configs, etc.)
}

export interface TestResultInput {
  studentId: string
  studentName: string
  studentNis: string
  testType: 'pretest' | 'posttest'
  score: number
  totalQuestions: number
  correctAnswers: number
  percentage: number
  timeSpent: number
  answers: TestAnswerInput[]
  grade: string
}

export interface LearningStyleResult {
  id?: string
  studentId: string
  studentName: string
  studentNis: string
  visual: number
  auditory: number
  kinesthetic: number
  primaryStyle: 'visual' | 'auditory' | 'kinesthetic'
  percentages: {
    visual: number
    auditory: number
    kinesthetic: number
  }
  timeSpent: number
  answers: string[] // Array of 'a', 'b', 'c' answers
  completedAt?: string
  createdAt?: string
}

export interface AIFeedback {
  id: string
  studentId: string
  testResultId: string
  learningStyleResultId?: string
  feedbackType: 'post_learning_style' | 'post_pretest' | 'post_posttest'
  title: string
  summary: string
  recommendations: any // jsonb
  nextSteps: string[]
  motivationalMessage: string
  contextData: any // jsonb
  aiPrompt?: string
  viewedAt?: string
  viewedFullReport: boolean
  createdAt: string
}

export class SupabaseTestService {
  
  // Simpan hasil test ke database
  static async saveTestResult(result: TestResultInput): Promise<TestResult | null> {
    try {
      console.log('Starting saveTestResult process for:', result.testType, result.studentName);
      
      // 1. Save test result
      const testResultData = {
        student_id: result.studentId,
        student_name: result.studentName,
        student_nis: result.studentNis,
        test_type: result.testType,
        score: result.score,
        total_questions: result.totalQuestions,
        correct_answers: result.correctAnswers,
        percentage: result.percentage,
        time_spent: result.timeSpent,
        grade: result.grade,
        completed_at: new Date().toISOString()
      };

      console.log('Inserting test result data:', testResultData);

      // Use upsert to handle potential duplicate test attempts
      const { data: testResult, error: testError } = await supabase
        .from('test_results')
        .upsert(testResultData, {
          onConflict: 'student_id,test_type',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (testError) {
        console.error('Error saving test result:', testError)
        console.error('Error details:', testError.message, testError.details, testError.hint)
        return null
      }

      console.log('Test result saved successfully:', testResult.id);

      // 2. Save test answers
      console.log('🔍 [DEBUG] Received answers count:', result.answers.length);
      console.log('🔍 [DEBUG] First answer sample:', result.answers[0]);
      
      const answersToInsert = result.answers.map(answer => ({
        test_result_id: testResult.id,
        question_id: answer.questionId,
        selected_answer: typeof answer.selectedAnswer === 'number' ? answer.selectedAnswer : -1,
        correct_answer: typeof answer.correctAnswer === 'number' ? answer.correctAnswer : -1,
        is_correct: answer.isCorrect,
        question_text: answer.questionText,
        selected_text: answer.selectedText,
        correct_text: answer.correctText,
        explanation: answer.explanation,
        question_type: answer.questionType || 'conceptual', // Default to conceptual for backward compatibility
        metadata: answer.metadata || null // Store type-specific metadata
      }))

      console.log('Inserting test answers:', answersToInsert.length, 'answers');
      console.log('🔍 [DEBUG] test_result_id:', testResult.id);
      console.log('🔍 [DEBUG] First answer to insert:', answersToInsert[0]);

      // Delete existing test answers if this is an update
      await supabase
        .from('test_answers')
        .delete()
        .eq('test_result_id', testResult.id);

      console.log('🔍 [DEBUG] About to insert answers:', JSON.stringify(answersToInsert, null, 2));

      const { data: insertedAnswers, error: answersError } = await supabase
        .from('test_answers')
        .insert(answersToInsert)
        .select()  // ✨ Add select to get inserted data back

      console.log('🔍 [DEBUG] Insert result - Data:', insertedAnswers);
      console.log('🔍 [DEBUG] Insert result - Error:', answersError);

      if (answersError) {
        console.error('Error saving test answers:', answersError)
        console.error('Error details:', answersError.message, answersError.details, answersError.hint)
        // Rollback test result if answers fail
        await supabase.from('test_results').delete().eq('id', testResult.id)
        return null
      }

      console.log('Test answers saved successfully');

      // 3. Update student progress
      console.log('Updating student progress...');
      await this.updateStudentProgress(result.studentId, testResult.id, result.testType)

      // 4. Update student record
      console.log('Updating student record...');
      await this.updateStudentRecord(result.studentId, result.testType, result.percentage)

      console.log('saveTestResult completed successfully');
      return testResult

    } catch (error) {
      console.error('Error in saveTestResult:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      return null
    }
  }

  // Update progress siswa
  private static async updateStudentProgress(
    studentId: string, 
    testResultId: string, 
    testType: 'pretest' | 'posttest'
  ) {
    try {
      console.log('Updating student progress for:', studentId, testType);
      
      // Get existing progress
      const { data: existingProgress, error: fetchError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing progress:', fetchError);
        throw fetchError;
      }

      if (existingProgress) {
        console.log('Found existing progress, updating...');
        // Update existing progress
        const updateData = testType === 'pretest' 
          ? { pre_test_result_id: testResultId }
          : { post_test_result_id: testResultId }

        const { error } = await supabase
          .from('student_progress')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId)

        if (error) {
          console.error('Error updating existing progress:', error);
          throw error;
        }

        // Calculate improvement if both tests completed
        await this.calculateImprovement(studentId)

      } else {
        console.log('No existing progress found, creating new...');
        // Create new progress
        const insertData = {
          student_id: studentId,
          completed_materials: [],
          practice_history: [],
          ...(testType === 'pretest' 
            ? { pre_test_result_id: testResultId }
            : { post_test_result_id: testResultId }
          )
        }

        const { error } = await supabase
          .from('student_progress')
          .insert(insertData)

        if (error) {
          console.error('Error creating new progress:', error);
          throw error;
        }
      }

      console.log('Student progress updated successfully');

    } catch (error) {
      console.error('Error updating student progress:', error)
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Calculate improvement setelah kedua test selesai
  private static async calculateImprovement(studentId: string) {
    try {
      const { data: progress } = await supabase
        .from('student_progress')
        .select(`
          *,
          pre_test_result:pre_test_result_id(percentage, time_spent),
          post_test_result:post_test_result_id(percentage, time_spent)
        `)
        .eq('student_id', studentId)
        .single()

      if (progress?.pre_test_result && progress?.post_test_result) {
        const preScore = (progress.pre_test_result as any).percentage
        const postScore = (progress.post_test_result as any).percentage
        const preTime = (progress.pre_test_result as any).time_spent
        const postTime = (progress.post_test_result as any).time_spent

        const scoreIncrease = postScore - preScore
        const percentageIncrease = ((postScore - preScore) / preScore) * 100
        const timeImprovement = preTime - postTime

        await supabase
          .from('student_progress')
          .update({
            score_improvement: scoreIncrease,
            percentage_improvement: percentageIncrease,
            time_improvement: timeImprovement,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId)
      }

    } catch (error) {
      console.error('Error calculating improvement:', error)
    }
  }

  // Update record student dengan score
  private static async updateStudentRecord(
    studentId: string, 
    testType: 'pretest' | 'posttest', 
    percentage: number
  ) {
    try {
      console.log('Updating student record:', studentId, testType, percentage);
      
      const updateField = testType === 'pretest' ? 'pre_test_score' : 'post_test_score'
      
      const { error } = await supabase
        .from('students')
        .update({
          [updateField]: percentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId)

      if (error) {
        console.error('Error updating student record:', error);
        throw error;
      }

      console.log('Student record updated successfully');

    } catch (error) {
      console.error('Error updating student record:', error)
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Get hasil test by student ID
  static async getTestResultsByStudent(studentId: string): Promise<TestResultWithAnswers[]> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          *,
          answers:test_answers(*)
        `)
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false })

      if (error) throw error
      return data || []

    } catch (error) {
      console.error('Error getting test results:', error)
      return []
    }
  }

  // Get latest test result untuk student
  static async getLatestTestResult(
    studentId: string, 
    testType: 'pretest' | 'posttest'
  ): Promise<TestResultWithAnswers | null> {
    try {
      console.log('🔍 [getLatestTestResult] Fetching:', { studentId, testType });
      
      // First, get the test result
      const { data: testResults, error: testError } = await supabase
        .from('test_results')
        .select('*')
        .eq('student_id', studentId)
        .eq('test_type', testType)
        .order('completed_at', { ascending: false })
        .limit(1)

      if (testError) {
        console.error('❌ [getLatestTestResult] Error fetching test result:', testError);
        throw testError;
      }

      if (!testResults || testResults.length === 0) {
        console.log('⚠️ [getLatestTestResult] No test result found');
        return null;
      }

      const testResult = testResults[0];
      console.log('✅ [getLatestTestResult] Test result found:', testResult.id);

      // Then, fetch answers separately with retry logic for race condition
      let answers = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        const { data: fetchedAnswers, error: answersError } = await supabase
          .from('test_answers')
          .select('*')
          .eq('test_result_id', testResult.id)
          .order('created_at', { ascending: true });

        if (answersError) {
          console.error('❌ [getLatestTestResult] Error fetching answers:', answersError);
          break; // Don't retry on error, just return without answers
        }

        answers = fetchedAnswers;
        
        // If we got answers, break the loop
        if (answers && answers.length > 0) {
          console.log('✅ [getLatestTestResult] Answers fetched successfully:', answers.length);
          break;
        }
        
        // If no answers yet and this is recent test (< 5 seconds old), retry after delay
        const testCompletedAt = new Date(testResult.completed_at).getTime();
        const now = Date.now();
        const ageInSeconds = (now - testCompletedAt) / 1000;
        
        if (ageInSeconds < 5 && retryCount < maxRetries - 1) {
          console.log(`⏳ [getLatestTestResult] No answers yet (test is ${ageInSeconds.toFixed(1)}s old), retrying in 500ms... (attempt ${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
          retryCount++;
        } else {
          console.log(`⚠️ [getLatestTestResult] No answers found after ${retryCount + 1} attempts`);
          break;
        }
      }

      console.log('✅ [getLatestTestResult] Final answers count:', answers?.length || 0);
      if (answers && answers.length > 0) {
        console.log('🔍 [getLatestTestResult] First answer:', answers[0]);
      }

      return {
        ...testResult,
        answers: answers || []
      };

    } catch (error) {
      console.error('❌ [getLatestTestResult] Unexpected error:', error);
      return null;
    }
  }

  // Get student info by ID
  static async getStudentInfo(studentId: string): Promise<{ name: string; class: string; nis: string } | null> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('name, class, nis')
        .eq('id', studentId)
        .single()

      if (error) {
        console.error('Error fetching student info:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getStudentInfo:', error)
      return null
    }
  }

  // Get student progress
  static async getStudentProgress(studentId: string): Promise<StudentProgressComplete | null> {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select(`
          *,
          pre_test_result:pre_test_result_id(
            *,
            answers:test_answers(*)
          ),
          post_test_result:post_test_result_id(
            *,
            answers:test_answers(*)
          )
        `)
        .eq('student_id', studentId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      // Also get learning style result
      const learningStyleResult = await this.getLearningStyleResult(studentId)

      if (!data) return null

      // Calculate improvement if both tests exist
      let improvement = undefined
      if (data.pre_test_result && data.post_test_result) {
        const preScore = (data.pre_test_result as any).percentage
        const postScore = (data.post_test_result as any).percentage
        const preTime = (data.pre_test_result as any).time_spent
        const postTime = (data.post_test_result as any).time_spent

        improvement = {
          scoreIncrease: postScore - preScore,
          percentageIncrease: ((postScore - preScore) / preScore) * 100,
          timeImprovement: preTime - postTime
        }
      }

      return {
        ...data,
        preTestResult: data.pre_test_result as TestResultWithAnswers,
        postTestResult: data.post_test_result as TestResultWithAnswers,
        learningStyleResult,
        improvement
      }

    } catch (error) {
      console.error('Error getting student progress:', error)
      return null
    }
  }

  // Get class statistics untuk teacher
  static async getClassStatistics(teacherId: string) {
    try {
      // Get students untuk teacher ini
      const { data: students } = await supabase
        .from('students')
        .select('id, name, nis, pre_test_score, post_test_score')
        .eq('teacher_id', teacherId)

      if (!students) return null

      // Get detailed progress untuk semua students
      const studentIds = students.map(s => s.id)
      
      const { data: progressData } = await supabase
        .from('student_progress')
        .select(`
          *,
          pre_test_result:pre_test_result_id(percentage),
          post_test_result:post_test_result_id(percentage)
        `)
        .in('student_id', studentIds)

      const preTestScores: number[] = []
      const postTestScores: number[] = []
      const improvements: number[] = []

      progressData?.forEach(progress => {
        if (progress.pre_test_result) {
          preTestScores.push((progress.pre_test_result as any).percentage)
        }
        if (progress.post_test_result) {
          postTestScores.push((progress.post_test_result as any).percentage)
        }
        if (progress.score_improvement !== null) {
          improvements.push(progress.score_improvement!)
        }
      })

      // Sort students untuk top performers dan struggling
      const studentsWithProgress = students.map(student => {
        const progress = progressData?.find(p => p.student_id === student.id)
        const postScore = student.post_test_score || student.pre_test_score || 0
        return { ...student, progress, postScore }
      })

      const topPerformers = studentsWithProgress
        .sort((a, b) => b.postScore - a.postScore)
        .slice(0, 5)

      const strugglingStudents = studentsWithProgress
        .filter(s => {
          if (s.post_test_score && s.post_test_score < 60) return true
          if (s.progress?.score_improvement && s.progress.score_improvement < 0) return true
          if (s.pre_test_score && !s.post_test_score && s.pre_test_score < 50) return true
          return false
        })
        .slice(0, 5)

      return {
        totalStudents: students.length,
        completedPreTest: preTestScores.length,
        completedPostTest: postTestScores.length,
        averagePreTestScore: preTestScores.length > 0 ? 
          preTestScores.reduce((sum, score) => sum + score, 0) / preTestScores.length : 0,
        averagePostTestScore: postTestScores.length > 0 ? 
          postTestScores.reduce((sum, score) => sum + score, 0) / postTestScores.length : 0,
        averageImprovement: improvements.length > 0 ? 
          improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length : 0,
        topPerformers,
        strugglingStudents
      }

    } catch (error) {
      console.error('Error getting class statistics:', error)
      return null
    }
  }

  // Calculate grade berdasarkan percentage
  static calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'E'
  }

  // Export data untuk backup/analysis
  static async exportClassData(teacherId: string) {
    try {
      const stats = await this.getClassStatistics(teacherId)
      const { data: students } = await supabase
        .from('students')
        .select('id')
        .eq('teacher_id', teacherId)

      if (!students) return null

      const studentIds = students.map(s => s.id)
      
      const { data: testResults } = await supabase
        .from('test_results')
        .select(`
          *,
          answers:test_answers(*)
        `)
        .in('student_id', studentIds)

      return {
        classStatistics: stats,
        testResults: testResults || [],
        exportedAt: new Date().toISOString()
      }

    } catch (error) {
      console.error('Error exporting data:', error)
      return null
    }
  }

  // Learning Style Test Methods
  static async saveLearningStyleResult(result: Omit<LearningStyleResult, 'id' | 'completedAt' | 'createdAt'>): Promise<LearningStyleResult | null> {
    try {
      const { data, error } = await supabase
        .from('learning_style_results')
        .insert({
          student_id: result.studentId,
          student_name: result.studentName,
          student_nis: result.studentNis,
          visual: result.visual,
          auditory: result.auditory,
          kinesthetic: result.kinesthetic,
          primary_style: result.primaryStyle,
          percentages: result.percentages,
          time_spent: result.timeSpent,
          answers: result.answers,
          completed_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving learning style result:', error)
        return null
      }

      // Update student progress
      await this.updateStudentLearningStyle(result.studentId, result.primaryStyle)

      return this.convertLearningStyleFromDB(data)

    } catch (error) {
      console.error('Error saving learning style result:', error)
      return null
    }
  }

  static async getLearningStyleResult(studentId: string): Promise<LearningStyleResult | null> {
    try {
      const { data, error } = await supabase
        .from('learning_style_results')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) return null

      return this.convertLearningStyleFromDB(data)

    } catch (error) {
      console.error('Error getting learning style result:', error)
      return null
    }
  }

  static async updateStudentLearningStyle(studentId: string, primaryStyle: string): Promise<void> {
    try {
      // Update student_progress table with learning style
      const { error: progressError } = await supabase
        .from('student_progress')
        .upsert({
          student_id: studentId,
          learning_style: primaryStyle,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'student_id'
        })

      if (progressError) {
        console.error('Error updating student learning style:', progressError)
      }

    } catch (error) {
      console.error('Error updating student learning style:', error)
    }
  }

  static async getClassLearningStyles(teacherId: string): Promise<any> {
    try {
      // Get students for this teacher
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, name, nis')
        .eq('teacher_id', teacherId)

      if (studentsError || !students) return null

      const studentIds = students.map(s => s.id)

      // Get learning style results for these students
      const { data: results, error: resultsError } = await supabase
        .from('learning_style_results')
        .select('*')
        .in('student_id', studentIds)

      if (resultsError) return null

      // Calculate statistics
      const styleDistribution = {
        visual: 0,
        auditory: 0,
        kinesthetic: 0
      }

      const completedStudents = results?.length || 0
      
      results?.forEach(result => {
        styleDistribution[result.primary_style as keyof typeof styleDistribution]++
      })

      return {
        totalStudents: students.length,
        completedLearningStyleTest: completedStudents,
        styleDistribution,
        percentageDistribution: {
          visual: completedStudents > 0 ? Math.round((styleDistribution.visual / completedStudents) * 100) : 0,
          auditory: completedStudents > 0 ? Math.round((styleDistribution.auditory / completedStudents) * 100) : 0,
          kinesthetic: completedStudents > 0 ? Math.round((styleDistribution.kinesthetic / completedStudents) * 100) : 0
        },
        results: results?.map(this.convertLearningStyleFromDB) || []
      }

    } catch (error) {
      console.error('Error getting class learning styles:', error)
      return null
    }
  }

  /**
   * Get test result with detailed answers for AI analysis
   */
  static async getTestResultWithAnswers(studentId: string, testType: 'pretest' | 'posttest'): Promise<TestResultWithAnswers | null> {
    try {
      // Get the latest test result
      const { data: testResult, error: testError } = await supabase
        .from('test_results')
        .select('*')
        .eq('student_id', studentId)
        .eq('test_type', testType)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (testError || !testResult) {
        return null
      }

      // Get detailed answers for this test result
      const { data: answers, error: answersError } = await supabase
        .from('test_answers')
        .select('*')
        .eq('test_result_id', testResult.id)
        .order('question_id', { ascending: true })

      if (answersError) {
        console.error('Error fetching test answers:', answersError)
        // Return test result without answers if answers fetch fails
        return {
          ...testResult,
          answers: []
        }
      }

      return {
        ...testResult,
        answers: answers || []
      }

    } catch (error) {
      console.error('Error getting test result with answers:', error)
      return null
    }
  }

  /**
   * Save AI feedback history to database
   */
  static async saveAIFeedback(
    studentId: string,
    testResultId: string | null,
    learningStyleResultId: string | null,
    feedbackType: 'post_learning_style' | 'post_pretest' | 'post_posttest',
    feedbackData: {
      title: string
      summary: string
      recommendations: any[]
      nextSteps: string[]
      motivationalMessage: string
      contextData: any
      aiPrompt?: string
    }
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_feedback_history')
        .insert({
          student_id: studentId,
          test_result_id: testResultId,
          learning_style_result_id: learningStyleResultId,
          feedback_type: feedbackType,
          title: feedbackData.title,
          summary: feedbackData.summary,
          recommendations: feedbackData.recommendations,
          next_steps: feedbackData.nextSteps,
          motivational_message: feedbackData.motivationalMessage,
          context_data: feedbackData.contextData,
          ai_prompt: feedbackData.aiPrompt
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error saving AI feedback:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('Error saving AI feedback:', error)
      return null
    }
  }

  /**
   * Save comprehensive AI assessment to database
   */
  static async saveAIAssessment(
    studentId: string,
    studentName: string,
    studentClass: string,
    assessmentType: 'learning_style' | 'progress' | 'comprehensive' | 'ai_powered',
    triggerEvent: string,
    assessmentData: {
      analysisData: any
      recommendations: any[]
      progressAnalysis?: any
      learningStyleAnalysis?: any
      overallRating: any
      priorityAreas: any[]
      nextSteps: string[]
      motivationalMessage: string
      improvementScore?: number
      strengthAreas: string[]
      weaknessAreas: string[]
    }
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_assessment_results')
        .insert({
          student_id: studentId,
          student_name: studentName,
          student_class: studentClass,
          assessment_type: assessmentType,
          trigger_event: triggerEvent,
          analysis_data: assessmentData.analysisData,
          recommendations: assessmentData.recommendations,
          progress_analysis: assessmentData.progressAnalysis,
          learning_style_analysis: assessmentData.learningStyleAnalysis,
          overall_rating: assessmentData.overallRating,
          priority_areas: assessmentData.priorityAreas,
          next_steps: assessmentData.nextSteps,
          motivational_message: assessmentData.motivationalMessage,
          improvement_score: assessmentData.improvementScore,
          strength_areas: assessmentData.strengthAreas,
          weakness_areas: assessmentData.weaknessAreas
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error saving AI assessment:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('Error saving AI assessment:', error)
      return null
    }
  }

  /**
   * Get AI feedback history for a student
   */
  /**
   * Get AI feedback by test result ID
   */
  static async getAIFeedbackByTestResult(testResultId: string): Promise<AIFeedback | null> {
    try {
      const { data, error } = await supabase
        .from('ai_feedback_history')
        .select('*')
        .eq('test_result_id', testResultId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Error getting AI feedback by test result:', error)
        return null
      }

      if (!data) return null

      return {
        id: data.id,
        studentId: data.student_id,
        testResultId: data.test_result_id,
        learningStyleResultId: data.learning_style_result_id,
        feedbackType: data.feedback_type,
        title: data.title,
        summary: data.summary,
        recommendations: data.recommendations,
        nextSteps: data.next_steps,
        motivationalMessage: data.motivational_message,
        contextData: data.context_data,
        aiPrompt: data.ai_prompt,
        viewedAt: data.viewed_at,
        viewedFullReport: data.viewed_full_report,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Error getting AI feedback by test result:', error)
      return null
    }
  }

  /**
   * Get AI feedback by student ID and feedback type
   */
  static async getAIFeedback(
    studentId: string, 
    feedbackType: 'post_learning_style' | 'post_pretest' | 'post_posttest',
    testResultId?: string,
    learningStyleResultId?: string
  ): Promise<AIFeedback | null> {
    try {
      let query = supabase
        .from('ai_feedback_history')
        .select('*')
        .eq('student_id', studentId)
        .eq('feedback_type', feedbackType)
        .order('created_at', { ascending: false })
        .limit(1)

      if (testResultId) {
        query = query.eq('test_result_id', testResultId)
      }

      if (learningStyleResultId) {
        query = query.eq('learning_style_result_id', learningStyleResultId)
      }

      const { data, error } = await query.single()

      if (error) {
        console.error('Error getting AI feedback:', error)
        return null
      }

      if (!data) return null

      return {
        id: data.id,
        studentId: data.student_id,
        testResultId: data.test_result_id,
        learningStyleResultId: data.learning_style_result_id,
        feedbackType: data.feedback_type,
        title: data.title,
        summary: data.summary,
        recommendations: data.recommendations,
        nextSteps: data.next_steps,
        motivationalMessage: data.motivational_message,
        contextData: data.context_data,
        aiPrompt: data.ai_prompt,
        viewedAt: data.viewed_at,
        viewedFullReport: data.viewed_full_report,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error)
      return null
    }
  }

  static async getAIFeedbackHistory(studentId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_feedback_history')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error getting AI feedback history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting AI feedback history:', error)
      return []
    }
  }

  /**
   * Get AI assessment history for a student
   */
  static async getAIAssessmentHistory(studentId: string, limit: number = 5): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_assessment_results')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error getting AI assessment history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting AI assessment history:', error)
      return []
    }
  }

  /**
   * Mark AI feedback as viewed
   */
  static async markAIFeedbackViewed(feedbackId: string, viewedFullReport: boolean = false): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_feedback_history')
        .update({
          viewed_at: new Date().toISOString(),
          viewed_full_report: viewedFullReport
        })
        .eq('id', feedbackId)

      if (error) {
        console.error('Error marking AI feedback as viewed:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error marking AI feedback as viewed:', error)
      return false
    }
  }

  private static convertLearningStyleFromDB(data: any): LearningStyleResult {
    return {
      id: data.id,
      studentId: data.student_id,
      studentName: data.student_name,
      studentNis: data.student_nis,
      visual: data.visual,
      auditory: data.auditory,
      kinesthetic: data.kinesthetic,
      primaryStyle: data.primary_style,
      percentages: data.percentages,
      timeSpent: data.time_spent,
      answers: data.answers,
      completedAt: data.completed_at,
      createdAt: data.created_at
    }
  }
}