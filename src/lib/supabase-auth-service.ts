import { supabase, Database } from './supabase'
import { Teacher, Student, LoginCredentials, RegisterTeacherData, StudentImportData } from '@/types/auth'
import bcrypt from 'bcryptjs'

type TeacherDB = Database['public']['Tables']['teachers']['Row']
type StudentDB = Database['public']['Tables']['students']['Row']
type SessionDB = Database['public']['Tables']['sessions']['Row']

export class SupabaseAuthService {
  // Teachers operations
  static async createTeacher(data: RegisterTeacherData): Promise<Teacher> {
    // Check if email already exists
    const { data: existingTeacher } = await supabase
      .from('teachers')
      .select('email')
      .eq('email', data.email)
      .single()

    if (existingTeacher) {
      throw new Error('Email sudah terdaftar')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Insert new teacher
    const { data: teacher, error } = await supabase
      .from('teachers')
      .insert({
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        phone_number: data.phoneNumber,
        school: data.school,
        is_verified: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Gagal membuat akun teacher: ${error.message}`)
    }

    return this.convertTeacherFromDB(teacher)
  }

  static async findTeacherByEmail(email: string): Promise<Teacher | null> {
    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !teacher) return null

    return this.convertTeacherFromDB(teacher)
  }

  static async validateTeacherPassword(email: string, password: string): Promise<Teacher | null> {
    const teacher = await this.findTeacherByEmail(email)
    if (!teacher) return null

    const { data: teacherWithHash } = await supabase
      .from('teachers')
      .select('password_hash')
      .eq('email', email)
      .single()

    if (!teacherWithHash) return null

    const isValid = await bcrypt.compare(password, teacherWithHash.password_hash)
    return isValid ? teacher : null
  }

  // Students operations
  static async createStudent(teacherId: string, data: StudentImportData): Promise<Student> {
    // Check if NIS already exists
    const { data: existingStudent } = await supabase
      .from('students')
      .select('nis')
      .eq('nis', data.nis)
      .single()

    if (existingStudent) {
      throw new Error(`NIS ${data.nis} sudah terdaftar`)
    }

    // Insert new student
    const { data: student, error } = await supabase
      .from('students')
      .insert({
        name: data.name,
        nis: data.nis,
        class: data.class,
        teacher_id: teacherId,
        email: data.email,
        phone_number: data.phoneNumber,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Gagal membuat siswa: ${error.message}`)
    }

    return this.convertStudentFromDB(student)
  }

  static async createStudentsBulk(teacherId: string, studentsData: StudentImportData[]): Promise<Student[]> {
    const results: Student[] = []
    const errors: string[] = []

    for (const data of studentsData) {
      try {
        const student = await this.createStudent(teacherId, data)
        results.push(student)
      } catch (error) {
        errors.push(`${data.name} (${data.nis}): ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    if (errors.length > 0) {
      console.warn('Beberapa siswa gagal diimport:', errors)
    }

    return results
  }

  static async findStudentByNameAndNis(name: string, nis: string): Promise<Student | null> {
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .ilike('name', name)
      .eq('nis', nis)
      .single()

    if (error || !student) return null

    return this.convertStudentFromDB(student)
  }

  static async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('name')

    if (error || !students) return []

    return students.map(this.convertStudentFromDB)
  }

  static async getStudentsByClass(teacherId: string, className: string): Promise<Student[]> {
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('class', className)
      .order('name')

    if (error || !students) return []

    return students.map(this.convertStudentFromDB)
  }

  static async getClassesByTeacher(teacherId: string): Promise<string[]> {
    const { data: classes, error } = await supabase
      .from('students')
      .select('class')
      .eq('teacher_id', teacherId)
      .order('class')

    if (error || !classes) return []

    // Remove duplicates and return sorted
    const classSet = new Set(classes.map(c => c.class))
    const uniqueClasses = Array.from(classSet)
    return uniqueClasses.sort()
  }

  static async updateStudent(studentId: string, data: Partial<StudentImportData>): Promise<Student> {
    const { data: student, error } = await supabase
      .from('students')
      .update({
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.class && { class: data.class }),
        ...(data.nis && { nis: data.nis }),
        ...(data.phoneNumber && { phone_number: data.phoneNumber }),
        updated_at: new Date().toISOString()
      })
      .eq('id', studentId)
      .select()
      .single()

    if (error) {
      throw new Error(`Gagal memperbarui data siswa: ${error.message}`)
    }

    return this.convertStudentFromDB(student)
  }

  static async deleteStudent(studentId: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId)

    if (error) {
      throw new Error(`Gagal menghapus siswa: ${error.message}`)
    }
  }

  // Session management
  static async createSession(user: Teacher | Student): Promise<string> {
    // Clean up expired sessions first
    await this.cleanupExpiredSessions()

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        user_role: user.role,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (error || !session) {
      throw new Error('Gagal membuat session')
    }

    return session.id
  }

  static async validateSession(sessionId: string): Promise<{ userId: string; userRole: 'teacher' | 'student' } | null> {
    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error || !session) return null

    // Check if session is expired
    if (new Date() > new Date(session.expires_at)) {
      // Delete expired session
      await supabase.from('sessions').delete().eq('id', sessionId)
      return null
    }

    return {
      userId: session.user_id,
      userRole: session.user_role
    }
  }

  static async destroySession(sessionId: string): Promise<void> {
    await supabase.from('sessions').delete().eq('id', sessionId)
  }

  static async cleanupExpiredSessions(): Promise<void> {
    const now = new Date().toISOString()
    await supabase
      .from('sessions')
      .delete()
      .lt('expires_at', now)
  }

  static async getUserById(userId: string, role: 'teacher' | 'student'): Promise<Teacher | Student | null> {
    if (role === 'teacher') {
      const { data: teacher, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !teacher) return null
      return this.convertTeacherFromDB(teacher)
    } else {
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !student) return null
      return this.convertStudentFromDB(student)
    }
  }

  // Helper methods to convert DB types to app types
  private static convertTeacherFromDB(teacher: TeacherDB): Teacher {
    return {
      id: teacher.id,
      role: 'teacher',
      email: teacher.email,
      password: '', // Don't expose password
      name: teacher.name,
      phoneNumber: teacher.phone_number || undefined,
      school: teacher.school || undefined,
      isVerified: teacher.is_verified,
      createdAt: new Date(teacher.created_at),
      updatedAt: new Date(teacher.updated_at)
    }
  }

  private static convertStudentFromDB(student: StudentDB): Student {
    return {
      id: student.id,
      role: 'student',
      name: student.name,
      nis: student.nis,
      class: student.class,
      teacherId: student.teacher_id,
      email: student.email || undefined,
      phoneNumber: student.phone_number || undefined,
      progress: {
        completedMaterials: [],
        practiceHistory: [],
        preTestScore: student.pre_test_score,
        postTestScore: student.post_test_score
      },
      createdAt: new Date(student.created_at),
      updatedAt: new Date(student.updated_at)
    }
  }

  // Development helper - create default teacher account
  static async createDefaultTeacher(): Promise<Teacher | null> {
    try {
      const existingTeacher = await this.findTeacherByEmail('guru@cirvia.com')
      if (existingTeacher) {
        return existingTeacher
      }

      return await this.createTeacher({
        name: 'Guru Demo',
        email: 'guru@cirvia.com',
        password: 'password123',
        school: 'SMA Demo',
        phoneNumber: '081234567890'
      })
    } catch (error) {
      console.error('Error creating default teacher:', error)
      return null
    }
  }

  // Migration helper - move data from localStorage to Supabase
  static async migrateFromLocalStorage(): Promise<void> {
    console.log('Starting migration from localStorage to Supabase...')

    try {
      // Migrate teachers
      if (typeof window !== 'undefined') {
        const teachersData = localStorage.getItem('cirvia_teachers')
        if (teachersData) {
          const teachers = JSON.parse(teachersData)
          for (const teacher of teachers) {
            try {
              await this.createTeacher({
                name: teacher.name,
                email: teacher.email,
                password: 'password123', // Default password - should be reset
                school: teacher.school,
                phoneNumber: teacher.phoneNumber
              })
              console.log(`Migrated teacher: ${teacher.email}`)
            } catch (error) {
              console.warn(`Failed to migrate teacher ${teacher.email}:`, error)
            }
          }
        }

        // Migrate students
        const studentsData = localStorage.getItem('cirvia_students')
        if (studentsData) {
          const students = JSON.parse(studentsData)
          for (const student of students) {
            try {
              await this.createStudent(student.teacherId, {
                name: student.name,
                nis: student.nis,
                class: student.class,
                email: student.email,
                phoneNumber: student.phoneNumber
              })
              console.log(`Migrated student: ${student.name} (${student.nis})`)
            } catch (error) {
              console.warn(`Failed to migrate student ${student.name}:`, error)
            }
          }
        }

        console.log('Migration completed!')
      }
    } catch (error) {
      console.error('Migration failed:', error)
    }
  }
}