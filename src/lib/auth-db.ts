// Database utility functions for authentication
// Note: This is a simplified implementation. In production, use a proper database like PostgreSQL/MySQL

import { Teacher, Student, LoginCredentials, RegisterTeacherData, StudentImportData } from '@/types/auth';
import bcrypt from 'bcryptjs';

// Simulate database with localStorage (for development)
// In production, replace this with actual database operations

export class AuthDB {
  private static TEACHERS_KEY = 'cirvia_teachers';
  private static STUDENTS_KEY = 'cirvia_students';
  private static SESSIONS_KEY = 'cirvia_sessions';

  // Teachers operations
  static async createTeacher(data: RegisterTeacherData): Promise<Teacher> {
    const teachers = this.getAllTeachers();
    
    // Check if email already exists
    if (teachers.find(t => t.email === data.email)) {
      throw new Error('Email sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const teacher: Teacher = {
      id: this.generateId(),
      role: 'teacher',
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phoneNumber: data.phoneNumber,
      school: data.school,
      isVerified: true, // Auto-verify for now
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    teachers.push(teacher);
    localStorage.setItem(this.TEACHERS_KEY, JSON.stringify(teachers));
    
    return teacher;
  }

  static async findTeacherByEmail(email: string): Promise<Teacher | null> {
    const teachers = this.getAllTeachers();
    return teachers.find(t => t.email === email) || null;
  }

  static async validateTeacherPassword(email: string, password: string): Promise<Teacher | null> {
    const teacher = await this.findTeacherByEmail(email);
    if (!teacher) return null;

    const isValid = await bcrypt.compare(password, teacher.password);
    return isValid ? teacher : null;
  }

  // Students operations
  static async createStudent(teacherId: string, data: StudentImportData): Promise<Student> {
    const students = this.getAllStudents();
    
    // Check if NIS already exists
    if (students.find(s => s.nis === data.nis)) {
      throw new Error(`NIS ${data.nis} sudah terdaftar`);
    }

    const student: Student = {
      id: this.generateId(),
      role: 'student',
      name: data.name,
      nis: data.nis,
      class: data.class,
      teacherId: teacherId,
      email: data.email,
      phoneNumber: data.phoneNumber,
      progress: {
        completedMaterials: [],
        practiceHistory: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    students.push(student);
    localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(students));
    
    return student;
  }

  static async createStudentsBulk(teacherId: string, studentsData: StudentImportData[]): Promise<Student[]> {
    const results: Student[] = [];
    const errors: string[] = [];

    for (const data of studentsData) {
      try {
        const student = await this.createStudent(teacherId, data);
        results.push(student);
      } catch (error) {
        errors.push(`${data.name} (${data.nis}): ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      console.warn('Beberapa siswa gagal diimport:', errors);
    }

    return results;
  }

  static async findStudentByNameAndNis(name: string, nis: string): Promise<Student | null> {
    const students = this.getAllStudents();
    return students.find(s => 
      s.name.toLowerCase() === name.toLowerCase() && s.nis === nis
    ) || null;
  }

  static getStudentsByTeacher(teacherId: string): Student[] {
    const students = this.getAllStudents();
    return students.filter(s => s.teacherId === teacherId);
  }

  static getStudentsByClass(teacherId: string, className: string): Student[] {
    const students = this.getStudentsByTeacher(teacherId);
    return students.filter(s => s.class === className);
  }

  static getClassesByTeacher(teacherId: string): string[] {
    const students = this.getStudentsByTeacher(teacherId);
    const classSet = new Set(students.map(s => s.class));
    const classes = Array.from(classSet);
    return classes.sort();
  }

  // Session management
  static createSession(user: Teacher | Student): string {
    const sessionId = this.generateId();
    const sessions = this.getAllSessions();
    
    sessions[sessionId] = {
      userId: user.id,
      userRole: user.role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return sessionId;
  }

  static validateSession(sessionId: string): { userId: string; userRole: 'teacher' | 'student' } | null {
    const sessions = this.getAllSessions();
    const session = sessions[sessionId];

    if (!session) return null;
    if (new Date() > new Date(session.expiresAt)) {
      delete sessions[sessionId];
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      return null;
    }

    return {
      userId: session.userId,
      userRole: session.userRole,
    };
  }

  static destroySession(sessionId: string): void {
    const sessions = this.getAllSessions();
    delete sessions[sessionId];
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }

  // Helper methods
  private static getAllTeachers(): Teacher[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.TEACHERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private static getAllStudents(): Student[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private static getAllSessions(): Record<string, any> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(this.SESSIONS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Development helper - create default teacher account
  static async createDefaultTeacher(): Promise<Teacher> {
    try {
      return await this.createTeacher({
        name: 'Guru Demo',
        email: 'guru@cirvia.com',
        password: 'password123',
        school: 'SMA Demo',
        phoneNumber: '081234567890',
      });
    } catch (error) {
      // Teacher already exists
      return this.findTeacherByEmail('guru@cirvia.com') as Promise<Teacher>;
    }
  }
}