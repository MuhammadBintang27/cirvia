import { supabase } from './supabase';

export interface LKPDObservationData {
  // Series 5 Lampu
  series_5_voltage?: number;
  series_5_current?: number;
  series_5_resistance?: number;
  
  // Series 2 Lampu
  series_2_voltage?: number;
  series_2_current?: number;
  series_2_resistance?: number;
  
  // Parallel 5 Lampu
  parallel_5_voltage?: number;
  parallel_5_current?: number;
  parallel_5_resistance?: number;
  
  // Parallel 2 Lampu
  parallel_2_voltage?: number;
  parallel_2_current?: number;
  parallel_2_resistance?: number;
}

export interface LKPDData {
  id?: string;
  student_id: string;
  student_name: string;
  student_nis: string;
  
  // Observation data - New structure
  series_5_voltage?: number;
  series_5_current?: number;
  series_5_resistance?: number;
  series_2_voltage?: number;
  series_2_current?: number;
  series_2_resistance?: number;
  parallel_5_voltage?: number;
  parallel_5_current?: number;
  parallel_5_resistance?: number;
  parallel_2_voltage?: number;
  parallel_2_current?: number;
  parallel_2_resistance?: number;
  
  // Lamp condition observations (JSONB for flexibility)
  lamp_all_on_series_5?: string;
  lamp_all_on_series_2?: string;
  lamp_all_on_parallel_5?: string;
  lamp_all_on_parallel_2?: string;
  
  lamp_one_off_series_5?: string;
  lamp_one_off_series_2?: string;
  lamp_one_off_parallel_5?: string;
  lamp_one_off_parallel_2?: string;
  
  lamp_brightness_series_5?: string;
  lamp_brightness_series_2?: string;
  lamp_brightness_parallel_5?: string;
  lamp_brightness_parallel_2?: string;
  
  // Analysis and conclusion
  analysis_answers?: Record<string, string>;
  conclusion_answers?: Record<string, string>;
  
  // Progress tracking
  completed_sections?: string[];
  progress_percentage?: number;
  is_completed?: boolean;
  
  // Timestamps
  started_at?: string;
  completed_at?: string;
  last_saved_at?: string;
  created_at?: string;
  updated_at?: string;
}

class SupabaseLKPDService {
  /**
   * Get student's LKPD data
   */
  async getLKPDData(studentId: string): Promise<LKPDData | null> {
    try {
      const { data, error } = await supabase
        .from('lkpd_data')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return null
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching LKPD data:', error);
      return null;
    }
  }

  /**
   * Save or update LKPD data
   */
  async saveLKPDData(data: LKPDData): Promise<LKPDData | null> {
    try {
      // Check if data exists
      const existing = await this.getLKPDData(data.student_id);

      if (existing) {
        // Update existing data
        const { data: updated, error } = await supabase
          .from('lkpd_data')
          .update({
            ...data,
            last_saved_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('student_id', data.student_id)
          .select()
          .single();

        if (error) throw error;
        return updated;
      } else {
        // Insert new data
        const { data: inserted, error } = await supabase
          .from('lkpd_data')
          .insert({
            ...data,
            started_at: new Date().toISOString(),
            last_saved_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return inserted;
      }
    } catch (error) {
      console.error('Error saving LKPD data:', error);
      throw error;
    }
  }

  /**
   * Update observation data only
   */
  async updateObservationData(
    studentId: string,
    observationData: LKPDObservationData
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lkpd_data')
        .update({
          ...observationData,
          last_saved_at: new Date().toISOString(),
        })
        .eq('student_id', studentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating observation data:', error);
      return false;
    }
  }

  /**
   * Update completed sections
   */
  async updateCompletedSections(
    studentId: string,
    completedSections: string[]
  ): Promise<boolean> {
    try {
      const progressPercentage = (completedSections.length / 6) * 100;
      const isCompleted = completedSections.length === 6;

      const { error } = await supabase
        .from('lkpd_data')
        .update({
          completed_sections: completedSections,
          progress_percentage: progressPercentage,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_saved_at: new Date().toISOString(),
        })
        .eq('student_id', studentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating completed sections:', error);
      return false;
    }
  }

  /**
   * Update analysis answers
   */
  async updateAnalysisAnswers(
    studentId: string,
    answers: Record<string, string>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lkpd_data')
        .update({
          analysis_answers: answers,
          last_saved_at: new Date().toISOString(),
        })
        .eq('student_id', studentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating analysis answers:', error);
      return false;
    }
  }

  /**
   * Update conclusion answers
   */
  async updateConclusionAnswers(
    studentId: string,
    answers: Record<string, string>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lkpd_data')
        .update({
          conclusion_answers: answers,
          last_saved_at: new Date().toISOString(),
        })
        .eq('student_id', studentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating conclusion answers:', error);
      return false;
    }
  }

  /**
   * Get all LKPD data for a teacher's students
   */
  async getStudentsLKPDData(teacherId: string): Promise<LKPDData[]> {
    try {
      // First get all students for this teacher
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id')
        .eq('teacher_id', teacherId);

      if (studentsError) throw studentsError;

      const studentIds = students?.map(s => s.id) || [];

      // Then get all LKPD data for these students
      const { data, error } = await supabase
        .from('lkpd_data')
        .select('*')
        .in('student_id', studentIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching students LKPD data:', error);
      return [];
    }
  }
}

const supabaseLKPDServiceInstance = new SupabaseLKPDService();
export { supabaseLKPDServiceInstance as SupabaseLKPDService };
