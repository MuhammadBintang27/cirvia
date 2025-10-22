export interface User {
  id: string;
  role: 'teacher' | 'student';
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher extends User {
  role: 'teacher';
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  school?: string;
  isVerified: boolean;
}

export interface Student extends User {
  role: 'student';
  name: string;
  nis: string; // Nomor Induk Siswa (used as password)
  class: string;
  teacherId: string; // Reference to teacher who created this student
  email?: string;
  phoneNumber?: string;
  progress?: {
    preTestScore?: number;
    postTestScore?: number;
    completedMaterials: string[];
    practiceHistory: PracticeSession[];
  };
}

export interface PracticeSession {
  id: string;
  sessionDate: Date;
  moduleCompleted: string;
  score: number;
  timeSpent: number; // in minutes
}

export interface LoginCredentials {
  // For teachers
  email?: string;
  password?: string;
  // For students
  name?: string;
  nis?: string;
  // Common
  userType: 'teacher' | 'student';
}

export interface AuthResponse {
  success: boolean;
  user?: Teacher | Student;
  token?: string;
  message?: string;
}

export interface StudentImportData {
  name: string;
  nis: string;
  class: string;
  email?: string;
  phoneNumber?: string;
}

export interface RegisterTeacherData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  school?: string;
}

export interface AuthContextType {
  user: Teacher | Student | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  register: (data: RegisterTeacherData) => Promise<AuthResponse>;
  isTeacher: () => boolean;
  isStudent: () => boolean;
}

export interface ClassData {
  className: string;
  studentCount: number;
  students: Student[];
}

export interface TeacherDashboardStats {
  totalStudents: number;
  totalClasses: number;
  averagePreTestScore: number;
  averagePostTestScore: number;
  recentActivity: Array<{
    type: 'login' | 'test_completed' | 'material_viewed';
    studentName: string;
    timestamp: Date;
    details: string;
  }>;
}