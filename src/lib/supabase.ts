import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Tables Schema
export type Database = {
  public: {
    Tables: {
      teachers: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          phone_number?: string
          school?: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          phone_number?: string
          school?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          phone_number?: string
          school?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          nis: string
          class: string
          teacher_id: string
          email?: string
          phone_number?: string
          pre_test_score?: number
          post_test_score?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          nis: string
          class: string
          teacher_id: string
          email?: string
          phone_number?: string
          pre_test_score?: number
          post_test_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          nis?: string
          class?: string
          teacher_id?: string
          email?: string
          phone_number?: string
          pre_test_score?: number
          post_test_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          student_id: string
          student_name: string
          student_nis: string
          test_type: 'pretest' | 'posttest'
          score: number
          total_questions: number
          correct_answers: number
          percentage: number
          time_spent: number
          grade: string
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          student_name: string
          student_nis: string
          test_type: 'pretest' | 'posttest'
          score: number
          total_questions: number
          correct_answers: number
          percentage: number
          time_spent: number
          grade: string
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          student_name?: string
          student_nis?: string
          test_type?: 'pretest' | 'posttest'
          score?: number
          total_questions?: number
          correct_answers?: number
          percentage?: number
          time_spent?: number
          grade?: string
          completed_at?: string
          created_at?: string
        }
      }
      test_answers: {
        Row: {
          id: string
          test_result_id: string
          question_id: number
          selected_answer: number
          correct_answer: number
          is_correct: boolean
          question_text: string
          selected_text: string
          correct_text: string
          explanation: string
          created_at: string
        }
        Insert: {
          id?: string
          test_result_id: string
          question_id: number
          selected_answer: number
          correct_answer: number
          is_correct: boolean
          question_text: string
          selected_text: string
          correct_text: string
          explanation: string
          created_at?: string
        }
        Update: {
          id?: string
          test_result_id?: string
          question_id?: number
          selected_answer?: number
          correct_answer?: number
          is_correct?: boolean
          question_text?: string
          selected_text?: string
          correct_text?: string
          explanation?: string
          created_at?: string
        }
      }
      student_progress: {
        Row: {
          id: string
          student_id: string
          pre_test_result_id?: string
          post_test_result_id?: string
          score_improvement?: number
          percentage_improvement?: number
          time_improvement?: number
          completed_materials: string[]
          practice_history: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          pre_test_result_id?: string
          post_test_result_id?: string
          score_improvement?: number
          percentage_improvement?: number
          time_improvement?: number
          completed_materials?: string[]
          practice_history?: any[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          pre_test_result_id?: string
          post_test_result_id?: string
          score_improvement?: number
          percentage_improvement?: number
          time_improvement?: number
          completed_materials?: string[]
          practice_history?: any[]
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          user_role: 'teacher' | 'student'
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_role: 'teacher' | 'student'
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_role?: 'teacher' | 'student'
          expires_at?: string
          created_at?: string
        }
      }
    }
  }
}