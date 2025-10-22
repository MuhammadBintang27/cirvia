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
  questionId: number
  selectedAnswer: number
  correctAnswer: number
  isCorrect: boolean
  questionText: string
  selectedText: string
  correctText: string
  explanation: string
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

export class SupabaseTestService {
  
  // Simpan hasil test ke database
  static async saveTestResult(result: TestResultInput): Promise<TestResult | null> {
    try {
      // 1. Save test result
      const { data: testResult, error: testError } = await supabase
        .from('test_results')
        .insert({
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
        })
        .select()
        .single()

      if (testError) {
        console.error('Error saving test result:', testError)
        return null
      }

      // 2. Save test answers
      const answersToInsert = result.answers.map(answer => ({
        test_result_id: testResult.id,
        question_id: answer.questionId,
        selected_answer: answer.selectedAnswer,
        correct_answer: answer.correctAnswer,
        is_correct: answer.isCorrect,
        question_text: answer.questionText,
        selected_text: answer.selectedText,
        correct_text: answer.correctText,
        explanation: answer.explanation
      }))

      const { error: answersError } = await supabase
        .from('test_answers')
        .insert(answersToInsert)

      if (answersError) {
        console.error('Error saving test answers:', answersError)
        // Rollback test result if answers fail
        await supabase.from('test_results').delete().eq('id', testResult.id)
        return null
      }

      // 3. Update student progress
      await this.updateStudentProgress(result.studentId, testResult.id, result.testType)

      // 4. Update student record
      await this.updateStudentRecord(result.studentId, result.testType, result.percentage)

      return testResult

    } catch (error) {
      console.error('Error in saveTestResult:', error)
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
      // Get existing progress
      const { data: existingProgress } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .single()

      if (existingProgress) {
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

        if (error) throw error

        // Calculate improvement if both tests completed
        await this.calculateImprovement(studentId)

      } else {
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

        if (error) throw error
      }

    } catch (error) {
      console.error('Error updating student progress:', error)
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
      const updateField = testType === 'pretest' ? 'pre_test_score' : 'post_test_score'
      
      const { error } = await supabase
        .from('students')
        .update({
          [updateField]: percentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId)

      if (error) throw error

    } catch (error) {
      console.error('Error updating student record:', error)
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
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          *,
          answers:test_answers(*)
        `)
        .eq('student_id', studentId)
        .eq('test_type', testType)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null

    } catch (error) {
      console.error('Error getting latest test result:', error)
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