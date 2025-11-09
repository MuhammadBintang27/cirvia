/**
 * AI Assessment Service
 * Provides AI-powered analysis and recommendations based on student test results
 * Uses Google Gemini 2.5 Flash via API route (FREE - 1500 RPD, 10 RPM!)
 */

import { SupabaseTestService } from './supabase-test-service'

// Types for assessment analysis
export interface LearningStyleResult {
  visual: number
  auditory: number
  kinesthetic: number
  primaryStyle: 'visual' | 'auditory' | 'kinesthetic'
  percentages: {
    visual: number
    auditory: number
    kinesthetic: number
  }
}

export interface TestResult {
  id?: string
  studentId: string
  testType: 'pretest' | 'posttest'
  score: number
  totalQuestions: number
  percentage: number
  timeSpent: number
  completedAt: Date
  answers: any[]
}

export interface ProgressAnalysis {
  improvement: number
  strengthAreas: string[]
  weaknessAreas: string[]
  learningEffectiveness: 'excellent' | 'good' | 'fair' | 'needs_improvement'
  timeEfficiency: 'excellent' | 'good' | 'fair' | 'slow'
}

export interface AIRecommendation {
  type: 'learning_style' | 'progress' | 'comprehensive' | 'ai_powered'
  title: string
  summary: string
  recommendations: {
    category: string
    items: string[]
    priority: 'high' | 'medium' | 'low'
  }[]
  nextSteps: string[]
  motivationalMessage: string
}

export interface ComprehensiveAssessment {
  studentInfo: {
    id: string
    name: string
    class: string
  }
  learningStyle: LearningStyleResult | null
  pretest: TestResult | null
  posttest: TestResult | null
  progressAnalysis: ProgressAnalysis | null
  recommendations: AIRecommendation[]
  overallRating: {
    score: number
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    badge: string
  }
}

class AIAssessmentService {
  /**
   * Analyze learning style and provide recommendations
   */
  static async analyzeLearningStyle(studentId: string): Promise<AIRecommendation> {
    try {
      // Get learning style result from database
      const learningStyleData = await SupabaseTestService.getLearningStyleResult(studentId)
      
      if (!learningStyleData) {
        return {
          type: 'learning_style',
          title: 'Belum Ada Data Gaya Belajar',
          summary: 'Silakan ikuti tes gaya belajar terlebih dahulu untuk mendapatkan rekomendasi pembelajaran yang personal.',
          recommendations: [{
            category: 'Tes Gaya Belajar',
            items: ['Ikuti tes gaya belajar untuk menentukan strategi pembelajaran terbaik'],
            priority: 'high' as const
          }],
          nextSteps: ['Kerjakan tes gaya belajar'],
          motivationalMessage: 'Memahami gaya belajar Anda adalah langkah pertama menuju pembelajaran yang efektif! 🎯'
        }
      }

      const primaryStyle = learningStyleData.primaryStyle
      const percentages = learningStyleData.percentages

      // AI-powered analysis based on learning style
      const recommendations = this.generateLearningStyleRecommendations(primaryStyle, percentages)
      
      const result = {
        type: 'learning_style' as const,
        title: `Rekomendasi untuk ${this.getLearningStyleTitle(primaryStyle)}`,
        summary: this.getLearningStyleSummary(primaryStyle, percentages),
        recommendations,
        nextSteps: this.getLearningStyleNextSteps(primaryStyle),
        motivationalMessage: this.getLearningStyleMotivation(primaryStyle)
      }

      // Save AI feedback to database
      try {
        await SupabaseTestService.saveAIFeedback(
          studentId,
          null, // No test result ID for learning style
          learningStyleData.id || null,
          'post_learning_style',
          {
            title: result.title,
            summary: result.summary,
            recommendations: result.recommendations,
            nextSteps: result.nextSteps,
            motivationalMessage: result.motivationalMessage,
            contextData: learningStyleData
          }
        )
      } catch (saveError) {
        console.error('Failed to save learning style AI feedback:', saveError)
        // Continue without failing the analysis
      }

      return result
    } catch (error) {
      console.error('Error analyzing learning style:', error)
      throw error
    }
  }

  /**
   * Analyze progress between pretest and posttest
   */
  static async analyzeProgress(studentId: string): Promise<AIRecommendation> {
    try {
      // Fetch student info first
      const studentInfo = await SupabaseTestService.getStudentInfo(studentId)
      const studentName = studentInfo?.name || 'Student'
      const studentClass = studentInfo?.class || 'Unknown'
      
      console.log('👤 [AI-SERVICE] Student Info:', { studentId, studentName, studentClass })
      
      const pretest = await SupabaseTestService.getLatestTestResult(studentId, 'pretest')
      const posttest = await SupabaseTestService.getLatestTestResult(studentId, 'posttest')

      if (!pretest && !posttest) {
        return {
          type: 'progress',
          title: 'Belum Ada Data Evaluasi',
          summary: 'Silakan ikuti pre-test dan post-test untuk mendapatkan analisis progress pembelajaran.',
          recommendations: [{
            category: 'Evaluasi Pembelajaran',
            items: ['Ikuti pre-test untuk mengetahui kemampuan awal', 'Pelajari materi rangkaian listrik', 'Ikuti post-test setelah pembelajaran'],
            priority: 'high' as const
          }],
          nextSteps: ['Kerjakan pre-test', 'Pelajari materi', 'Kerjakan post-test'],
          motivationalMessage: 'Mari mulai perjalanan pembelajaran Anda! Setiap ahli pernah menjadi pemula. 💪'
        }
      }

      if (!pretest) {
        return {
          type: 'progress',
          title: 'Pre-Test Belum Dikerjakan',
          summary: 'Pre-test diperlukan sebagai baseline untuk mengukur progress pembelajaran Anda.',
          recommendations: [{
            category: 'Evaluasi Awal',
            items: ['Kerjakan pre-test untuk mengetahui kemampuan awal'],
            priority: 'high' as const
          }],
          nextSteps: ['Kerjakan pre-test'],
          motivationalMessage: 'Pre-test adalah titik awal perjalanan pembelajaran! Jangan khawatir tentang hasilnya. 🚀'
        }
      }

      if (!posttest) {
        // Generate AI analysis for pretest only
        const pretestAnalysis = await this.generateAIRecommendations(
          studentId,
          studentName,
          studentClass,
          null, // learningStyle
          pretest,
          null, // posttest
          null // progressAnalysis
        )

        if (pretestAnalysis) {
          const result = {
            type: 'progress' as const,
            title: pretestAnalysis.title || `Analisis Pre-Test: ${pretest.percentage}%`,
            summary: pretestAnalysis.summary,
            recommendations: pretestAnalysis.recommendations,
            nextSteps: [
              ...pretestAnalysis.nextSteps,
              'Kerjakan post-test setelah pembelajaran untuk melihat peningkatan'
            ],
            motivationalMessage: pretestAnalysis.motivationalMessage
          }

          // Save AI feedback to database
          try {
            await SupabaseTestService.saveAIFeedback(
              studentId,
              pretest.id,
              null,
              'post_pretest',
              {
                title: result.title,
                summary: result.summary,
                recommendations: result.recommendations,
                nextSteps: result.nextSteps,
                motivationalMessage: result.motivationalMessage,
                contextData: pretest
              }
            )
          } catch (saveError) {
            console.error('Failed to save pretest AI feedback:', saveError)
            // Continue without failing the analysis
          }

          return result
        }
        
        // Fallback if AI generation fails
        return {
          type: 'progress',
          title: `Hasil Pre-Test: ${pretest.percentage}%`,
          summary: `Anda telah menyelesaikan pre-test dengan skor ${pretest.percentage}%. Analisis AI akan memberikan rekomendasi pembelajaran yang sesuai.`,
          recommendations: [{
            category: 'Lanjutkan Pembelajaran',
            items: [
              'Pelajari materi rangkaian listrik secara mendalam',
              'Fokus pada area yang perlu ditingkatkan',
              'Kerjakan post-test setelah pembelajaran'
            ],
            priority: 'medium' as const
          }],
          nextSteps: ['Pelajari materi berdasarkan hasil pre-test', 'Kerjakan post-test'],
          motivationalMessage: 'Anda sudah memulai dengan baik! Lanjutkan pembelajaran dan lihat progress Anda. 📈'
        }
      }

      // Both tests completed - analyze progress with AI
      const progressAnalysis = this.calculateProgressAnalysis(pretest, posttest)
      
      // Generate AI-powered analysis for both tests
      const aiAnalysis = await this.generateAIRecommendations(
        studentId,
        studentName,
        studentClass,
        null, // learningStyle - can be fetched separately if needed
        pretest,
        posttest,
        progressAnalysis
      )

      if (aiAnalysis) {
        const result = {
          type: 'progress' as const,
          title: aiAnalysis.title || this.getProgressTitle(progressAnalysis),
          summary: aiAnalysis.summary,
          recommendations: aiAnalysis.recommendations,
          nextSteps: aiAnalysis.nextSteps,
          motivationalMessage: aiAnalysis.motivationalMessage
        }

        // Save AI feedback to database
        try {
          await SupabaseTestService.saveAIFeedback(
            studentId,
            posttest.id,
            null,
            'post_posttest',
            {
              title: result.title,
              summary: result.summary,
              recommendations: result.recommendations,
              nextSteps: result.nextSteps,
              motivationalMessage: result.motivationalMessage,
              contextData: { pretest, posttest, progressAnalysis }
            }
          )
        } catch (saveError) {
          console.error('Failed to save posttest AI feedback:', saveError)
        }

        return result
      }

      // Fallback to rule-based if AI fails
      const recommendations = this.generateProgressRecommendations(pretest, posttest, progressAnalysis)

      return {
        type: 'progress',
        title: this.getProgressTitle(progressAnalysis),
        summary: this.getProgressSummary(pretest, posttest, progressAnalysis),
        recommendations,
        nextSteps: this.getProgressNextSteps(progressAnalysis),
        motivationalMessage: this.getProgressMotivation(progressAnalysis)
      }
    } catch (error) {
      console.error('Error analyzing progress:', error)
      throw error
    }
  }

  /**
   * Generate comprehensive assessment with all data including detailed answers
   */
  static async generateComprehensiveAssessment(studentId: string, studentName: string, studentClass: string): Promise<ComprehensiveAssessment> {
    try {
      // Fetch all data including detailed answers
      const [learningStyleData, pretest, posttest] = await Promise.all([
        SupabaseTestService.getLearningStyleResult(studentId).catch(() => null),
        SupabaseTestService.getTestResultWithAnswers(studentId, 'pretest').catch(() => null),
        SupabaseTestService.getTestResultWithAnswers(studentId, 'posttest').catch(() => null)
      ])

      // Calculate progress analysis with detailed answer analysis
      const progressAnalysis = pretest && posttest ? 
        this.calculateProgressAnalysis(pretest, posttest) : null

      // Generate AI-powered comprehensive recommendations using detailed context
      const aiRecommendations = await this.generateAIRecommendations(
        studentId, studentName, studentClass, learningStyleData, pretest, posttest, progressAnalysis
      )

      // Generate all recommendations
      const recommendations: AIRecommendation[] = []
      
      // Learning style recommendations
      if (learningStyleData) {
        const learningStyleRec = await this.analyzeLearningStyle(studentId)
        recommendations.push(learningStyleRec)
      }

      // Progress recommendations
      const progressRec = await this.analyzeProgress(studentId)
      recommendations.push(progressRec)

      // Add AI-powered recommendations
      if (aiRecommendations) {
        recommendations.push(aiRecommendations)
      }

      // Comprehensive recommendations
      const comprehensiveRec = this.generateComprehensiveRecommendations(
        learningStyleData, pretest, posttest, progressAnalysis
      )
      recommendations.push(comprehensiveRec)

      // Calculate overall rating
      const overallRating = this.calculateOverallRating(
        learningStyleData, pretest, posttest, progressAnalysis
      )

      const result = {
        studentInfo: {
          id: studentId,
          name: studentName,
          class: studentClass
        },
        learningStyle: learningStyleData,
        pretest: pretest as any,
        posttest: posttest as any,
        progressAnalysis,
        recommendations,
        overallRating
      }

      // Save comprehensive AI assessment to database
      try {
        const triggerEvent = posttest ? 'posttest_completed' : pretest ? 'pretest_completed' : 'manual_request'
        const strengthAreas = progressAnalysis?.strengthAreas || []
        const weaknessAreas = progressAnalysis?.weaknessAreas || []
        const improvementScore = progressAnalysis?.improvement || 0

        await SupabaseTestService.saveAIAssessment(
          studentId,
          studentName,
          studentClass,
          'comprehensive',
          triggerEvent,
          {
            analysisData: {
              learningStyle: learningStyleData,
              pretest: pretest,
              posttest: posttest,
              progressAnalysis: progressAnalysis
            },
            recommendations: recommendations,
            progressAnalysis: progressAnalysis,
            learningStyleAnalysis: learningStyleData,
            overallRating: overallRating,
            priorityAreas: recommendations.filter(r => 
              r.recommendations.some(rec => rec.priority === 'high')
            ),
            nextSteps: recommendations.flatMap(r => r.nextSteps).slice(0, 5),
            motivationalMessage: recommendations[0]?.motivationalMessage || 'Terus semangat belajar!',
            improvementScore: improvementScore,
            strengthAreas: strengthAreas,
            weaknessAreas: weaknessAreas
          }
        )
      } catch (saveError) {
        console.error('Failed to save comprehensive assessment:', saveError)
        // Continue without failing the analysis
      }

      return result
    } catch (error) {
      console.error('Error generating comprehensive assessment:', error)
      throw error
    }
  }

  /**
   * Generate AI-powered recommendations using GPT with full context
   */
    private static async generateAIRecommendations(
    studentId: string,
    studentName: string,
    studentClass: string,
    learningStyle: any,
    pretest: any,
    posttest: any,
    progressAnalysis: any
  ): Promise<AIRecommendation | null> {
    try {
      // Build comprehensive context for AI analysis
      const contextData = {
        student: {
          id: studentId,
          name: studentName,
          class: studentClass
        },
        learningStyle: learningStyle ? {
          visual: learningStyle.visual,
          auditory: learningStyle.auditory,
          kinesthetic: learningStyle.kinesthetic,
          primaryStyle: learningStyle.primaryStyle,
          secondaryStyle: learningStyle.secondaryStyle
        } : null,
        pretest: pretest ? {
          score: pretest.score,
          totalQuestions: pretest.total_questions,
          percentage: pretest.percentage,
          timeSpent: pretest.time_spent,
          answers: pretest.answers?.map((answer: any) => ({
            questionText: answer.question_text,
            selectedAnswer: answer.selected_answer,
            correctAnswer: answer.correct_answer,
            selectedText: answer.selected_text,
            correctText: answer.correct_text,
            isCorrect: answer.is_correct,
            explanation: answer.explanation
          })) || []
        } : null,
        posttest: posttest ? {
          score: posttest.score,
          totalQuestions: posttest.total_questions,
          percentage: posttest.percentage,
          timeSpent: posttest.time_spent,
          answers: posttest.answers?.map((answer: any) => ({
            questionText: answer.question_text,
            selectedAnswer: answer.selected_answer,
            correctAnswer: answer.correct_answer,
            selectedText: answer.selected_text,
            correctText: answer.correct_text,
            isCorrect: answer.is_correct,
            explanation: answer.explanation
          })) || []
        } : null,
        progress: progressAnalysis
      }

      // Build prompt for AI analysis
      const prompt = this.buildAIAnalysisPrompt(contextData)
      
      // Call GPT API for real AI-powered analysis
      const result = await this.callGPTForAnalysis(prompt, contextData)

      // Save AI-powered recommendations to database
      if (result && (pretest || posttest)) {
        try {
          const testResultId = posttest?.id || pretest?.id || null
          const feedbackType = posttest ? 'post_posttest' : 'post_pretest'
          
          await SupabaseTestService.saveAIFeedback(
            contextData.student.id, // ✅ Use student ID (UUID) instead of name
            testResultId,
            null, // No learning style result ID
            feedbackType,
            {
              title: result.title,
              summary: result.summary,
              recommendations: result.recommendations,
              nextSteps: result.nextSteps,
              motivationalMessage: result.motivationalMessage,
              contextData: contextData,
              aiPrompt: prompt
            }
          )
        } catch (saveError) {
          console.error('Failed to save AI-powered feedback:', saveError)
          // Continue without failing the analysis
        }
      }

      return result

    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      return null
    }
  }

  /**
   * Build comprehensive prompt for AI analysis
   */
  private static buildAIAnalysisPrompt(contextData: any): string {
    let prompt = `ANALISIS PEMBELAJARAN RANGKAIAN LISTRIK - ${contextData.student.name} (${contextData.student.class})\n\n`
    
    // Learning Style Analysis
    if (contextData.learningStyle) {
      prompt += `📚 PROFIL GAYA BELAJAR:\n`
      prompt += `- Visual Learner: ${contextData.learningStyle.visual}% (${contextData.learningStyle.primaryStyle === 'visual' ? 'DOMINAN' : 'pendukung'})\n`
      prompt += `- Auditory Learner: ${contextData.learningStyle.auditory}% (${contextData.learningStyle.primaryStyle === 'auditory' ? 'DOMINAN' : 'pendukung'})\n`
      prompt += `- Kinesthetic Learner: ${contextData.learningStyle.kinesthetic}% (${contextData.learningStyle.primaryStyle === 'kinesthetic' ? 'DOMINAN' : 'pendukung'})\n`
      prompt += `→ Gaya Belajar Utama: ${contextData.learningStyle.primaryStyle.toUpperCase()}\n\n`
    }

    // Pre-test Analysis with detailed breakdown
    if (contextData.pretest) {
      prompt += `📊 HASIL PRE-TEST (Kemampuan Awal):\n`
      prompt += `- Skor Total: ${contextData.pretest.score}/${contextData.pretest.totalQuestions} (${contextData.pretest.percentage.toFixed(1)}%)\n`
      prompt += `- Waktu Pengerjaan: ${Math.floor(contextData.pretest.timeSpent / 60)} menit ${contextData.pretest.timeSpent % 60} detik\n`
      prompt += `- Efisiensi Waktu: ${(contextData.pretest.timeSpent / contextData.pretest.totalQuestions / 60).toFixed(1)} menit per soal\n\n`
      
      const wrongAnswersPretest = contextData.pretest.answers.filter((answer: any) => !answer.isCorrect)
      
      if (wrongAnswersPretest.length > 0) {
        prompt += `❌ ANALISIS KESALAHAN PRE-TEST:\n`
        wrongAnswersPretest.forEach((answer: any, index: number) => {
          prompt += `${index + 1}. SOAL: "${answer.questionText}"\n`
          prompt += `   ├─ Jawaban Siswa: "${answer.selectedText}" ❌\n`
          prompt += `   ├─ Jawaban Benar: "${answer.correctText}" ✅\n`
          prompt += `   └─ Konsep Terkait: ${this.extractDetailedConcept(answer.questionText, answer.explanation)}\n\n`
        })
      }
    }

    // Post-test Analysis with improvement tracking
    if (contextData.posttest) {
      prompt += `📈 HASIL POST-TEST (Kemampuan Akhir):\n`
      prompt += `- Skor Total: ${contextData.posttest.score}/${contextData.posttest.totalQuestions} (${contextData.posttest.percentage.toFixed(1)}%)\n`
      prompt += `- Waktu Pengerjaan: ${Math.floor(contextData.posttest.timeSpent / 60)} menit ${contextData.posttest.timeSpent % 60} detik\n`
      prompt += `- Efisiensi Waktu: ${(contextData.posttest.timeSpent / contextData.posttest.totalQuestions / 60).toFixed(1)} menit per soal\n\n`
      
      const wrongAnswersPosttest = contextData.posttest.answers.filter((answer: any) => !answer.isCorrect)
      if (wrongAnswersPosttest.length > 0) {
        prompt += `❌ ANALISIS KESALAHAN POST-TEST (Masih Perlu Diperbaiki):\n`
        wrongAnswersPosttest.forEach((answer: any, index: number) => {
          prompt += `${index + 1}. SOAL: "${answer.questionText}"\n`
          prompt += `   ├─ Jawaban Siswa: "${answer.selectedText}" ❌\n`
          prompt += `   ├─ Jawaban Benar: "${answer.correctText}" ✅\n`
          prompt += `   ├─ Penjelasan: ${answer.explanation}\n`
          prompt += `   └─ Konsep yang Perlu Diperkuat: ${this.extractDetailedConcept(answer.questionText, answer.explanation)}\n\n`
        })
      }

      const correctAnswersPosttest = contextData.posttest.answers.filter((answer: any) => answer.isCorrect)
      if (correctAnswersPosttest.length > 0) {
        prompt += `✅ KONSEP YANG SUDAH DIKUASAI:\n`
        const conceptsArray = correctAnswersPosttest.map((answer: any) => 
          this.extractDetailedConcept(answer.questionText, answer.explanation)
        )
        const masteredConcepts = conceptsArray.filter((concept: string, index: number) => 
          conceptsArray.indexOf(concept) === index
        )
        masteredConcepts.forEach((concept: string, index: number) => {
          prompt += `${index + 1}. ${concept}\n`
        })
        prompt += `\n`
      }
    }

    // Detailed Progress Analysis
    if (contextData.progress && contextData.pretest && contextData.posttest) {
      const improvement = contextData.progress.improvement
      prompt += `📊 ANALISIS PROGRESS PEMBELAJARAN:\n`
      prompt += `- Peningkatan Skor: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}% ${improvement > 0 ? '📈' : improvement < 0 ? '📉' : '➡️'}\n`
      prompt += `- Perubahan Waktu: ${contextData.pretest.timeSpent > contextData.posttest.timeSpent ? 'Lebih cepat' : 'Lebih lambat'} (${Math.abs(contextData.pretest.timeSpent - contextData.posttest.timeSpent)} detik)\n`
      prompt += `- Efektivitas Pembelajaran: ${contextData.progress.learningEffectiveness.toUpperCase()}\n`
      prompt += `- Efisiensi Waktu: ${contextData.progress.timeEfficiency.toUpperCase()}\n`
      
      if (contextData.progress.strengthAreas.length > 0) {
        prompt += `- Kekuatan Utama: ${contextData.progress.strengthAreas.join(', ')}\n`
      }
      if (contextData.progress.weaknessAreas.length > 0) {
        prompt += `- Area yang Perlu Diperkuat: ${contextData.progress.weaknessAreas.join(', ')}\n`
      }
      prompt += `\n`
    }

    // Specific request for AI analysis with detailed JSON format
    prompt += `🎯 REQUEST ANALISIS AI:\n\n`
    prompt += `Anda adalah AI mentor pribadi yang ramah dan supportif untuk siswa SMA dalam pembelajaran fisika rangkaian listrik.\n\n`
    
    prompt += `PERSONA: Bicara langsung ke "${contextData.student.name}" dengan cara yang friendly, encouraging, dan personal - seperti kakak yang peduli dengan pembelajaran mereka.\n\n`
    
    prompt += `INSTRUKSI RESPONSE:\n`
    prompt += `1. BICARA LANGSUNG KE SISWA - gunakan "kamu", bukan "siswa" atau "peserta didik"\n`
    prompt += `2. MULAI dengan sapaan personal yang sesuai hasil mereka (contoh: "Great job!", "Hebat!", "Ayo semangat!")\n`
    prompt += `3. ANALISIS pencapaian mereka dengan spesifik - sebutkan apa yang sudah bagus dan apa yang perlu diperbaiki\n`
    prompt += `4. BERIKAN rekomendasi yang jelas dan actionable (3 item per kategori)\n`
    prompt += `5. AKHIRI dengan motivasi yang genuine dan mendorong\n\n`
    
    prompt += `GAYA BAHASA:\n`
    prompt += `- Friendly dan conversational (seperti ngobrol dengan teman/kakak)\n`
    prompt += `- Mix bahasa Indonesia dan sedikit English untuk kesan modern\n`
    prompt += `- Emoji boleh dipakai untuk warmth tapi jangan berlebihan\n`
    prompt += `- Hindari bahasa terlalu formal/kaku\n\n`
    
    prompt += `FORMAT RESPONSE (gunakan format JSON yang valid):\n`
    prompt += `{\n`
    prompt += `  "title": "[Sapaan personal + highlight pencapaian - contoh: 'Great Job, ${contextData.student.name}! Kamu Nailed the Basics! 🎉']",\n`
    prompt += `  "summary": "[1 paragraf RINGKAS (3-4 kalimat) - Bicara langsung ke siswa. Mix Indo-English casual. Contoh tone: '${contextData.student.name}, I see that you've done a great job understanding the basics of electrical circuits. Kamu udah bisa ngerjain soal Hukum Ohm dan Analisis Arus Listrik dengan baik. That's fantastic! Tapi, aku notice ada beberapa area yang masih perlu kamu kuasai lebih dalam, khususnya tentang Rangkaian Seri dan dasar-dasar Rangkaian Listrik. No worries, kita bisa kerjain ini bareng! 💪']",\n`
    prompt += `  "recommendations": [\n`
    prompt += `    {\n`
    prompt += `      "category": "Yang Bisa Kamu Lakukan",\n`
    prompt += `      "items": ["[Item 1]", "[Item 2]", "[Item 3]"],\n`
    prompt += `      "priority": "medium"\n`
    prompt += `    },\n`
    prompt += `    {\n`
    prompt += `      "category": "Yang Perlu Kamu Kerjakan Lagi",\n`
    prompt += `      "items": ["[Tips spesifik 1 - contoh: 'Untuk soal Membandingkan Kecerahan Lampu, coba kamu review lagi materi tentang Rangkaian Campuran (Seri-Paralel)']", "[Item 2]", "[Item 3]"],\n`
    prompt += `      "priority": "high"\n`
    prompt += `    }\n`
    prompt += `  ],\n`
    prompt += `  "nextSteps": [\n`
    prompt += `    "[Langkah konkret 1 - contoh: 'Untuk memperdalam pemahamanmu, coba kamu tonton video tutorial tentang Rangkaian Seri dan Paralel']",\n`
    prompt += `    "[Langkah 2]",\n`
    prompt += `    "[Langkah 3]"\n`
    prompt += `  ],\n`
    prompt += `  "motivationalMessage": "[1-2 kalimat inspiring. Contoh: '${contextData.student.name}, jangan menyerah! Setiap ahli pernah menjadi pemula. Terus berlatih dan Anda pasti bisa! 💪 ✨']"\n`
    prompt += `}\n\n`
    
    prompt += `CONTOH TONE YANG DIHARAPKAN:\n`
    prompt += `❌ JANGAN: "Siswa menunjukkan pemahaman yang baik terhadap konsep dasar"\n`
    prompt += `✅ LAKUKAN: "Hebat! Kamu udah ngerti banget konsep dasarnya. Aku impressed dengan jawabanmu di bagian Hukum Ohm!"\n\n`
    
    prompt += `❌ JANGAN: "Disarankan untuk memperdalam pemahaman"\n`
    prompt += `✅ LAKUKAN: "Ayo kita tingkatkan lagi! Coba fokus lebih ke rangkaian seri-paralel - kamu pasti bisa!"\n\n`
    
    prompt += `PENTING:\n`
    prompt += `- Summary: RINGKAS, cukup 1 paragraf (3-4 kalimat), mix Indo-English casual\n`
    prompt += `- Recommendations: 2 kategori, masing-masing 3 items yang spesifik dan actionable\n`
    prompt += `- Next Steps: 3 langkah konkret\n`
    prompt += `- Sebutkan konsep spesifik (Hukum Ohm, Rangkaian Seri, dll) tapi jangan terlalu teknis\n`
    prompt += `- Response HARUS dalam format JSON yang valid\n`
    prompt += `- Tone friendly, casual, seperti ngobrol sama kakak - bukan guru formal!`
    
    return prompt
  }

  /**
   * Extract detailed concept from question and explanation
   */
  private static extractDetailedConcept(questionText: string, explanation: string): string {
    const text = (questionText + ' ' + explanation).toLowerCase()
    
    if (text.includes('resistansi') || text.includes('ohm') || text.includes('hambatan')) {
      return 'Hukum Ohm dan Perhitungan Resistansi'
    }
    if (text.includes('seri') && text.includes('paralel')) {
      return 'Analisis Rangkaian Campuran (Seri-Paralel)'
    }
    if (text.includes('seri')) {
      return 'Karakteristik dan Perhitungan Rangkaian Seri'
    }
    if (text.includes('paralel')) {
      return 'Karakteristik dan Perhitungan Rangkaian Paralel'
    }
    if (text.includes('daya') || text.includes('power') || text.includes('watt')) {
      return 'Perhitungan Daya Listrik dan Efisiensi Energi'
    }
    if (text.includes('arus') || text.includes('ampere')) {
      return 'Analisis Arus Listrik dalam Rangkaian'
    }
    if (text.includes('tegangan') || text.includes('voltase') || text.includes('volt')) {
      return 'Analisis Tegangan dan Distribusi Potensial'
    }
    if (text.includes('kirchhoff')) {
      return 'Hukum Kirchhoff untuk Analisis Rangkaian'
    }
    if (text.includes('kapasitor') || text.includes('induktor')) {
      return 'Komponen Reaktif dalam Rangkaian'
    }
    
    return 'Konsep Dasar Rangkaian Listrik'
  }

  /**
   * Call Gemini API via server-side route for real AI-powered analysis (FREE!)
   */
  private static async callGPTForAnalysis(prompt: string, contextData: any): Promise<AIRecommendation> {
    try {
      console.log('🤖 [AI-SERVICE] Calling Google Gemini 2.5 Flash API via server route...')
      console.log('🤖 [AI-SERVICE] Prompt length:', prompt.length, 'characters')
      
      // Call server-side API route
      const response = await fetch('/api/ai/analyze-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          contextData,
          temperature: 0.7,
          maxTokens: 3000  // Reduced for concise responses (like screenshot example)
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [AI-SERVICE] Gemini API call failed:', response.status, response.statusText)
        console.error('❌ [AI-SERVICE] Error response:', errorText)
        throw new Error(`Gemini API call failed: ${response.statusText}`)
      }

      const aiResponse = await response.json()
      
      console.log('📦 [AI-SERVICE] API Response received:', {
        success: aiResponse.success,
        hasAnalysis: !!aiResponse.analysis,
        analysisLength: aiResponse.analysis?.length || 0,
        fallback: aiResponse.fallback,
        error: aiResponse.error
      })
      
      if (aiResponse.fallback || aiResponse.error) {
        throw new Error(`Gemini API error: ${aiResponse.error || 'Fallback triggered'}`)
      }
      
      const analysisText = aiResponse.analysis
      
      if (!analysisText || typeof analysisText !== 'string') {
        console.error('❌ [AI-SERVICE] Invalid analysis response:', aiResponse)
        throw new Error('Invalid or empty analysis response from Gemini')
      }
      
      console.log('✅ [AI-SERVICE] Gemini analysis completed successfully')
      console.log('✅ [AI-SERVICE] Response length:', analysisText.length, 'chars')
      console.log('✅ [AI-SERVICE] Response preview:', analysisText.substring(0, 150) + '...')
      
      // Parse Gemini response into structured format
      return this.parseGPTResponse(analysisText, contextData)
      
    } catch (error) {
      console.error('❌ [AI-SERVICE] Error calling Gemini API:', error)
      console.error('❌ [AI-SERVICE] Error details:', error instanceof Error ? error.message : 'Unknown error')
      
      // Fallback to rule-based analysis if Gemini fails
      console.warn('⚠️ [AI-SERVICE] Falling back to rule-based analysis...')
      console.warn('⚠️ [AI-SERVICE] Please check GOOGLE_AI_API_KEY in .env.local')
      return this.generateSmartRecommendations(contextData)
    }
  }

  /**
   * Parse GPT response into structured AIRecommendation format
   */
  private static parseGPTResponse(gptText: string, contextData: any): AIRecommendation {
    try {
      console.log('📝 [AI-PARSE] Starting to parse Gemini response...')
      
      // Safety check for undefined/null
      if (!gptText || typeof gptText !== 'string') {
        console.error('❌ [AI-PARSE] Invalid input:', typeof gptText, gptText)
        throw new Error('Invalid gptText: must be a non-empty string')
      }
      
      console.log('📝 [AI-PARSE] Original response length:', gptText.length)
      
      // Remove markdown code blocks if present
      let cleanedText = gptText.trim()
      
      // Remove ```json and ``` markers
      if (cleanedText.includes('```json')) {
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        console.log('📝 [AI-PARSE] Removed ```json markers')
      } else if (cleanedText.includes('```')) {
        cleanedText = cleanedText.replace(/```\s*/g, '')
        console.log('📝 [AI-PARSE] Removed ``` markers')
      }
      
      console.log('📝 [AI-PARSE] Cleaned text length:', cleanedText.length)
      console.log('📝 [AI-PARSE] Cleaned text preview:', cleanedText.substring(0, 200))
      
      // Try to parse JSON response
      if (cleanedText.includes('{') && cleanedText.includes('}')) {
        try {
          // Extract JSON object (first { to last })
          const firstBrace = cleanedText.indexOf('{')
          const lastBrace = cleanedText.lastIndexOf('}')
          const jsonString = cleanedText.substring(firstBrace, lastBrace + 1)
          
          console.log('📝 [AI-PARSE] Attempting to parse JSON...')
          const parsedResponse = JSON.parse(jsonString)
          
          console.log('✅ [AI-PARSE] JSON parsed successfully!')
          console.log('✅ [AI-PARSE] Parsed structure:', {
            hasTitle: !!parsedResponse.title,
            hasSummary: !!parsedResponse.summary,
            recommendationsCount: parsedResponse.recommendations?.length || 0,
            nextStepsCount: parsedResponse.nextSteps?.length || 0,
            hasMotivation: !!parsedResponse.motivationalMessage
          })
          
          if (parsedResponse.title && (parsedResponse.recommendations || parsedResponse.summary)) {
            console.log('✅ [AI-PARSE] Valid AI response structure detected')
            
            const result = {
              type: 'ai_powered' as const,
              title: parsedResponse.title || 'Analisis AI Komprehensif',
              summary: parsedResponse.summary || 'Analisis berdasarkan Google Gemini',
              recommendations: parsedResponse.recommendations || [],
              nextSteps: parsedResponse.nextSteps || [],
              motivationalMessage: parsedResponse.motivationalMessage || this.generateMotivationalMessage(contextData)
            }
            
            console.log('🎉 [AI-PARSE] Final AI recommendation ready!')
            console.log('🎉 [AI-PARSE] Title:', result.title)
            console.log('🎉 [AI-PARSE] Summary length:', result.summary.length)
            console.log('🎉 [AI-PARSE] Recommendations:', result.recommendations.length)
            
            return result
          }
        } catch (jsonError) {
          console.warn('⚠️ [AI-PARSE] Failed to parse as JSON, falling back to text parsing')
          console.warn('⚠️ [AI-PARSE] JSON error:', jsonError instanceof Error ? jsonError.message : 'Unknown')
        }
      }

      // Parse text response with intelligent extraction
      const lines = gptText.split('\n').filter(line => line.trim());
      const recommendations: any[] = [];
      let currentCategory = '';
      let currentItems: string[] = [];
      let title = 'Rekomendasi AI Berdasarkan Analisis Gemini 2.5 Flash';
      let summary = '';
      let nextSteps: string[] = [];
      let motivationalMessage = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Extract title
        if (trimmedLine.toLowerCase().includes('judul:') || trimmedLine.toLowerCase().includes('title:')) {
          title = trimmedLine.replace(/^(judul:|title:)/i, '').trim();
          continue;
        }

        // Extract summary
        if (trimmedLine.toLowerCase().includes('ringkasan:') || trimmedLine.toLowerCase().includes('summary:')) {
          summary = trimmedLine.replace(/^(ringkasan:|summary:)/i, '').trim();
          continue;
        }

        // Extract motivational message
        if (trimmedLine.toLowerCase().includes('motivasi:') || trimmedLine.toLowerCase().includes('motivation:')) {
          motivationalMessage = trimmedLine.replace(/^(motivasi:|motivation:)/i, '').trim();
          continue;
        }

        // Extract categories (headers)
        if (trimmedLine.includes(':') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('•')) {
          // Save previous category
          if (currentCategory && currentItems.length > 0) {
            recommendations.push({
              category: currentCategory,
              items: currentItems,
              priority: this.determinePriority(currentCategory, currentItems) as 'high' | 'medium' | 'low'
            });
          }
          
          currentCategory = trimmedLine.replace(':', '').trim();
          currentItems = [];
          continue;
        }

        // Extract items (bullet points)
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.match(/^\d+\./)) {
          const item = trimmedLine.replace(/^[-•\d.]\s*/, '').trim();
          if (item) {
            if (currentCategory.toLowerCase().includes('langkah') || currentCategory.toLowerCase().includes('next')) {
              nextSteps.push(item);
            } else {
              currentItems.push(item);
            }
          }
          continue;
        }

        // If no category yet, this might be summary
        if (!currentCategory && trimmedLine.length > 20) {
          summary = summary ? `${summary} ${trimmedLine}` : trimmedLine;
        }
      }

      // Add last category
      if (currentCategory && currentItems.length > 0) {
        recommendations.push({
          category: currentCategory,
          items: currentItems,
          priority: this.determinePriority(currentCategory, currentItems) as 'high' | 'medium' | 'low'
        });
      }

      // Fallback values
      if (!summary) {
        summary = `Analisis AI menunjukkan pola pembelajaran spesifik berdasarkan ${contextData.posttest?.answers?.length || 0} jawaban yang dianalisis.`;
      }

      if (!motivationalMessage) {
        motivationalMessage = this.generateMotivationalMessage(contextData);
      }

      if (nextSteps.length === 0) {
        nextSteps = recommendations.flatMap(r => r.items).slice(0, 3);
      }

      return {
        type: 'ai_powered',
        title,
        summary,
        recommendations,
        nextSteps,
        motivationalMessage
      };

    } catch (error) {
      console.error('Error parsing GPT response:', error);
      
      // Return basic AI recommendation if parsing fails
      return {
        type: 'ai_powered',
        title: 'Analisis AI (Simplified)',
        summary: gptText.substring(0, 200) + '...',
        recommendations: [{
          category: 'Rekomendasi AI',
          items: ['Terus berlatih dan pelajari materi secara konsisten', 'Manfaatkan berbagai sumber belajar', 'Konsultasi dengan guru jika ada kesulitan'],
          priority: 'medium' as const
        }],
        nextSteps: ['Terapkan rekomendasi yang diberikan', 'Monitor progress pembelajaran', 'Evaluasi berkala'],
        motivationalMessage: this.generateMotivationalMessage(contextData)
      };
    }
  }

  /**
   * Determine priority based on category and items
   */
  private static determinePriority(category: string, items: string[]): string {
    const categoryLower = category.toLowerCase();
    const itemsText = items.join(' ').toLowerCase();

    // High priority indicators
    if (categoryLower.includes('mendesak') || categoryLower.includes('penting') || categoryLower.includes('urgent') ||
        categoryLower.includes('remedial') || categoryLower.includes('dasar') ||
        itemsText.includes('segera') || itemsText.includes('harus') || itemsText.includes('wajib')) {
      return 'high';
    }

    // Low priority indicators  
    if (categoryLower.includes('lanjutan') || categoryLower.includes('advanced') || categoryLower.includes('opsional') ||
        categoryLower.includes('tambahan') || itemsText.includes('jika ada waktu') || itemsText.includes('optional')) {
      return 'low';
    }

    // Default to medium
    return 'medium';
  }

  /**
   * Generate smart recommendations based on detailed analysis (FALLBACK)
   */
  private static generateSmartRecommendations(contextData: any): AIRecommendation {
    const recommendations: string[] = []
    let priority: 'high' | 'medium' | 'low' = 'medium'

    // Analyze wrong answers for specific recommendations
    if (contextData.posttest?.answers) {
      const wrongAnswers = contextData.posttest.answers.filter((answer: any) => !answer.isCorrect)
      const conceptualErrors = wrongAnswers.filter((answer: any) => 
        answer.questionText.toLowerCase().includes('konsep') || 
        answer.questionText.toLowerCase().includes('pengertian')
      )
      const calculationErrors = wrongAnswers.filter((answer: any) => 
        answer.questionText.toLowerCase().includes('hitung') || 
        answer.questionText.toLowerCase().includes('nilai')
      )

      if (conceptualErrors.length > 0) {
        recommendations.push('Perkuat pemahaman konsep dasar rangkaian listrik dengan membaca materi teori')
        recommendations.push('Gunakan analogi dan visualisasi untuk memahami konsep abstrak')
        priority = 'high'
      }

      if (calculationErrors.length > 0) {
        recommendations.push('Perbanyak latihan soal perhitungan dengan berbagai variasi')
        recommendations.push('Pahami rumus-rumus dasar dan cara aplikasinya')
        priority = 'high'
      }

      // Pattern analysis for common mistakes
      const commonMistakes = wrongAnswers.reduce((acc: any, answer: any) => {
        const concept = this.extractConcept(answer.questionText)
        acc[concept] = (acc[concept] || 0) + 1
        return acc
      }, {})

      const mostProblematicConcept = Object.entries(commonMistakes)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]

      if (mostProblematicConcept) {
        recommendations.push(`Fokus khusus pada materi: ${mostProblematicConcept[0]}`)
      }
    }

    // Learning style-specific recommendations
    if (contextData.learningStyle) {
      const style = contextData.learningStyle.primaryStyle
      if (style === 'visual') {
        recommendations.push('Gunakan diagram dan skema rangkaian berwarna untuk memudahkan pemahaman')
        recommendations.push('Manfaatkan simulasi interaktif dan video pembelajaran')
      } else if (style === 'auditory') {
        recommendations.push('Dengarkan penjelasan audio dan diskusikan dengan teman')
        recommendations.push('Bacakan rumus dan konsep dengan suara keras')
      } else if (style === 'kinesthetic') {
        recommendations.push('Praktikkan langsung dengan komponen rangkaian fisik')
        recommendations.push('Gunakan gesture control untuk simulasi praktikum')
      }
    }

    // Progress-based recommendations
    if (contextData.progress) {
      if (contextData.progress.improvement < 0) {
        recommendations.unshift('Konsultasi dengan guru untuk strategi pembelajaran yang lebih efektif')
        recommendations.unshift('Review kembali semua materi dasar sebelum lanjut ke topik advanced')
        priority = 'high'
      } else if (contextData.progress.improvement > 20) {
        recommendations.push('Eksplorasi topik lanjutan seperti analisis rangkaian AC')
        recommendations.push('Jadilah tutor bagi teman yang membutuhkan bantuan')
        priority = 'low'
      }
    }

    return {
      type: 'ai_powered',
      title: 'Rekomendasi AI Berdasarkan Analisis Mendalam',
      summary: `Analisis AI terhadap ${contextData.posttest?.answers?.length || 0} jawaban menunjukkan pola pembelajaran yang spesifik.`,
      recommendations: [{
        category: 'Rekomendasi AI Terpersonalisasi',
        items: recommendations,
        priority
      }],
      nextSteps: recommendations.slice(0, 3),
      motivationalMessage: this.generateMotivationalMessage(contextData)
    }
  }

  /**
   * Extract concept from question text for pattern analysis
   */
  private static extractConcept(questionText: string): string {
    const text = questionText.toLowerCase()
    if (text.includes('resistansi') || text.includes('ohm')) return 'Hukum Ohm dan Resistansi'
    if (text.includes('seri')) return 'Rangkaian Seri'
    if (text.includes('paralel')) return 'Rangkaian Paralel'
    if (text.includes('daya') || text.includes('power')) return 'Daya Listrik'
    if (text.includes('arus')) return 'Arus Listrik'
    if (text.includes('tegangan') || text.includes('voltase')) return 'Tegangan Listrik'
    return 'Konsep Umum Rangkaian Listrik'
  }

  /**
   * Generate personalized motivational message
   */
  private static generateMotivationalMessage(contextData: any): string {
    const name = contextData.student.name
    const progress = contextData.progress

    if (progress?.improvement > 20) {
      return `Luar biasa ${name}! Peningkatan Anda sangat mengesankan. Terus pertahankan semangat belajar! 🌟⚡`
    } else if (progress?.improvement > 0) {
      return `Bagus ${name}! Anda menunjukkan kemajuan yang baik. Sedikit lagi menuju kesempurnaan! 📈💪`
    } else if (progress?.improvement === 0) {
      return `${name}, konsistensi Anda patut diapresiasi. Mari coba strategi pembelajaran yang berbeda! 🎯✨`
    } else {
      return `${name}, jangan menyerah! Setiap ahli pernah menjadi pemula. Terus berlatih dan Anda pasti bisa! 💪🚀`
    }
  }

  // Helper methods for learning style analysis
  private static getLearningStyleTitle(style: string): string {
    const titles = {
      visual: 'Visual Learner (Pembelajar Visual)',
      auditory: 'Auditory Learner (Pembelajar Auditori)',
      kinesthetic: 'Kinesthetic Learner (Pembelajar Kinestetik)'
    }
    return titles[style as keyof typeof titles] || 'Mixed Learner'
  }

  private static getLearningStyleSummary(style: string, percentages: any): string {
    const primary = percentages[style]
    const summaries = {
      visual: `Anda adalah seorang visual learner (${primary}%). Anda belajar paling efektif melalui gambar, diagram, grafik, dan representasi visual lainnya. Mata Anda adalah jendela utama pembelajaran.`,
      auditory: `Anda adalah seorang auditory learner (${primary}%). Anda belajar paling efektif melalui mendengar, diskusi, penjelasan verbal, dan suara. Telinga Anda adalah saluran utama pembelajaran.`,
      kinesthetic: `Anda adalah seorang kinesthetic learner (${primary}%). Anda belajar paling efektif melalui praktik langsung, percobaan, dan pengalaman fisik. Tangan dan gerakan adalah kunci pembelajaran Anda.`
    }
    return summaries[style as keyof typeof summaries] || 'Anda memiliki gaya belajar yang seimbang.'
  }

  private static generateLearningStyleRecommendations(style: string, percentages: any) {
    const recommendations = {
      visual: [
        {
          category: 'Strategi Visual',
          items: [
            'Gunakan diagram dan skema rangkaian listrik yang berwarna',
            'Buat mind map untuk konsep-konsep listrik',
            'Manfaatkan simulasi interaktif dan animasi',
            'Highlight konsep penting dengan warna berbeda'
          ],
          priority: 'high' as const
        },
        {
          category: 'Tools & Resources',
          items: [
            'Gunakan aplikasi simulasi rangkaian seperti CircuitLab',
            'Buat flashcard visual untuk rumus-rumus',
            'Tonton video pembelajaran dengan grafik yang jelas',
            'Buat sketsa rangkaian sendiri saat belajar'
          ],
          priority: 'medium' as const
        }
      ],
      auditory: [
        {
          category: 'Strategi Auditori',
          items: [
            'Dengarkan penjelasan audio tentang konsep listrik',
            'Diskusikan materi dengan teman atau guru',
            'Baca materi dengan suara keras',
            'Gunakan teknik bercerita untuk mengingat konsep'
          ],
          priority: 'high' as const
        },
        {
          category: 'Tools & Resources',
          items: [
            'Dengarkan podcast tentang fisika dan elektronika',
            'Rekam penjelasan Anda sendiri dan putar ulang',
            'Bergabung dengan study group untuk diskusi',
            'Gunakan aplikasi text-to-speech untuk membaca materi'
          ],
          priority: 'medium' as const
        }
      ],
      kinesthetic: [
        {
          category: 'Strategi Kinestetik',
          items: [
            'Lakukan eksperimen langsung dengan komponen listrik',
            'Gunakan praktikum hands-on dan simulasi interaktif',
            'Buat model fisik rangkaian dengan benda nyata',
            'Gerakkan tangan saat menjelaskan aliran arus'
          ],
          priority: 'high' as const
        },
        {
          category: 'Tools & Resources',
          items: [
            'Gunakan breadboard dan komponen elektronik nyata',
            'Manfaatkan virtual lab untuk eksperimen',
            'Buat projek sederhana seperti lampu LED',
            'Gunakan gesture dan gerakan saat belajar'
          ],
          priority: 'medium' as const
        }
      ]
    }
    return recommendations[style as keyof typeof recommendations] || []
  }

  private static getLearningStyleNextSteps(style: string): string[] {
    const nextSteps = {
      visual: [
        'Mulai pembelajaran dengan melihat diagram rangkaian',
        'Gunakan fitur simulasi interaktif di CIRVIA',
        'Buat catatan visual dengan diagram dan skema',
        'Praktikkan dengan drag-and-drop circuit builder'
      ],
      auditory: [
        'Dengarkan penjelasan audio di setiap materi',
        'Diskusikan konsep dengan AI assistant CIRVIA',
        'Bacakan rumus dan konsep dengan suara keras',
        'Bergabung dengan study group online'
      ],
      kinesthetic: [
        'Mulai dengan praktikum hands-on',
        'Gunakan gesture control untuk simulasi',
        'Kerjakan eksperimen virtual lab',
        'Buat projek rangkaian sederhana'
      ]
    }
    return nextSteps[style as keyof typeof nextSteps] || []
  }

  private static getLearningStyleMotivation(style: string): string {
    const motivations = {
      visual: 'Mata Anda adalah jendela pembelajaran! Manfaatkan kekuatan visual Anda untuk menguasai rangkaian listrik. 👁️✨',
      auditory: 'Suara adalah musik pembelajaran! Dengarkan, diskusikan, dan nyanyikan konsep listrik. 🎵🔊',
      kinesthetic: 'Tangan Anda adalah kunci pemahaman! Sentuh, rasakan, dan praktikkan setiap konsep. 🤲⚡'
    }
    return motivations[style as keyof typeof motivations] || 'Terus semangat belajar! 💪'
  }

  // Helper methods for progress analysis
  private static calculateProgressAnalysis(pretest: any, posttest: any): ProgressAnalysis {
    const improvement = posttest.percentage - pretest.percentage
    const timeComparison = posttest.timeSpent / posttest.totalQuestions - pretest.timeSpent / pretest.totalQuestions
    
    // Analyze strength and weakness areas based on detailed answers
    const strengthAreas: string[] = []
    const weaknessAreas: string[] = []
    
    // Analyze answers from posttest for detailed insights
    if (posttest.answers && Array.isArray(posttest.answers)) {
      const correctAnswers = posttest.answers.filter((answer: any) => answer.isCorrect)
      const incorrectAnswers = posttest.answers.filter((answer: any) => !answer.isCorrect)
      
      // Categorize questions based on content analysis
      correctAnswers.forEach((answer: any) => {
        const questionText = answer.questionText?.toLowerCase() || ''
        if (questionText.includes('resistansi') || questionText.includes('ohm')) {
          if (!strengthAreas.includes('Perhitungan Hukum Ohm dan Resistansi')) {
            strengthAreas.push('Perhitungan Hukum Ohm dan Resistansi')
          }
        }
        if (questionText.includes('seri') || questionText.includes('paralel')) {
          if (!strengthAreas.includes('Analisis Rangkaian Seri-Paralel')) {
            strengthAreas.push('Analisis Rangkaian Seri-Paralel')
          }
        }
        if (questionText.includes('daya') || questionText.includes('power')) {
          if (!strengthAreas.includes('Perhitungan Daya Listrik')) {
            strengthAreas.push('Perhitungan Daya Listrik')
          }
        }
      })

      incorrectAnswers.forEach((answer: any) => {
        const questionText = answer.questionText?.toLowerCase() || ''
        if (questionText.includes('resistansi') || questionText.includes('ohm')) {
          if (!weaknessAreas.includes('Perhitungan Hukum Ohm dan Resistansi')) {
            weaknessAreas.push('Perhitungan Hukum Ohm dan Resistansi')
          }
        }
        if (questionText.includes('seri') || questionText.includes('paralel')) {
          if (!weaknessAreas.includes('Analisis Rangkaian Seri-Paralel')) {
            weaknessAreas.push('Analisis Rangkaian Seri-Paralel')
          }
        }
        if (questionText.includes('daya') || questionText.includes('power')) {
          if (!weaknessAreas.includes('Perhitungan Daya Listrik')) {
            weaknessAreas.push('Perhitungan Daya Listrik')
          }
        }
        if (questionText.includes('kompleks') || questionText.includes('campuran')) {
          if (!weaknessAreas.includes('Analisis Rangkaian Kompleks')) {
            weaknessAreas.push('Analisis Rangkaian Kompleks')
          }
        }
      })
    }

    // Fallback analysis if no detailed answers available
    if (strengthAreas.length === 0) {
      if (posttest.percentage >= 80) {
        strengthAreas.push('Pemahaman konsep rangkaian listrik')
      }
      if (posttest.percentage >= 70) {
        strengthAreas.push('Perhitungan nilai resistansi')
      }
    }

    if (weaknessAreas.length === 0) {
      if (posttest.percentage < 60) {
        weaknessAreas.push('Analisis rangkaian kompleks')
      }
      if (timeComparison > 30) {
        weaknessAreas.push('Kecepatan dalam memecahkan masalah')
      }
    }

    return {
      improvement,
      strengthAreas,
      weaknessAreas,
      learningEffectiveness: improvement > 20 ? 'excellent' : improvement > 10 ? 'good' : improvement > 0 ? 'fair' : 'needs_improvement',
      timeEfficiency: timeComparison < -10 ? 'excellent' : timeComparison < 0 ? 'good' : timeComparison < 10 ? 'fair' : 'slow'
    }
  }

  private static generateProgressRecommendations(pretest: any, posttest: any, analysis: ProgressAnalysis) {
    const recommendations: any[] = []

    if (analysis.improvement > 20) {
      recommendations.push({
        category: 'Pencapaian Luar Biasa',
        items: [
          'Pertahankan strategi belajar yang sudah efektif',
          'Jadilah mentor bagi teman-teman yang membutuhkan bantuan',
          'Eksplorasi topik advanced dalam elektronika',
          'Ikuti kompetisi sains untuk tantangan lebih'
        ],
        priority: 'high' as const
      })
    } else if (analysis.improvement > 0) {
      recommendations.push({
        category: 'Peningkatan Positif',
        items: [
          'Lanjutkan metode belajar yang sudah berhasil',
          'Fokus pada area yang masih perlu diperbaiki',
          'Perbanyak latihan soal dengan variasi yang lebih kompleks',
          'Gunakan feedback untuk pembelajaran selanjutnya'
        ],
        priority: 'medium' as const
      })
    } else {
      recommendations.push({
        category: 'Perlu Perbaikan Strategi',
        items: [
          'Review ulang materi yang belum dikuasai',
          'Coba metode pembelajaran yang berbeda',
          'Konsultasi dengan guru atau mentor',
          'Perbanyak praktik dengan soal-soal dasar'
        ],
        priority: 'high' as const
      })
    }

    if (analysis.weaknessAreas.length > 0) {
      recommendations.push({
        category: 'Area yang Perlu Diperkuat',
        items: analysis.weaknessAreas.map(area => `Fokus pembelajaran pada: ${area}`),
        priority: 'medium' as const
      })
    }

    return recommendations
  }

  private static getProgressTitle(analysis: ProgressAnalysis): string {
    if (analysis.improvement > 20) return 'Progress Luar Biasa! 🌟'
    if (analysis.improvement > 10) return 'Progress Sangat Baik! 📈'
    if (analysis.improvement > 0) return 'Ada Peningkatan! 👍'
    return 'Mari Tingkatkan Lagi! 💪'
  }

  private static getProgressSummary(pretest: any, posttest: any, analysis: ProgressAnalysis): string {
    const improvement = analysis.improvement
    return `Anda menunjukkan ${improvement > 0 ? 'peningkatan' : 'penurunan'} sebesar ${Math.abs(improvement).toFixed(1)}% dari pre-test (${pretest.percentage}%) ke post-test (${posttest.percentage}%). ${
      improvement > 20 ? 'Pencapaian yang luar biasa!' :
      improvement > 10 ? 'Progress yang sangat baik!' :
      improvement > 0 ? 'Ada kemajuan positif!' :
      'Mari kita tingkatkan strategi belajar!'
    }`
  }

  private static getProgressNextSteps(analysis: ProgressAnalysis): string[] {
    if (analysis.learningEffectiveness === 'excellent') {
      return [
        'Lanjutkan ke materi advanced',
        'Bantu teman-teman belajar',
        'Ikuti tantangan yang lebih kompleks',
        'Eksplorasi aplikasi praktis rangkaian listrik'
      ]
    } else if (analysis.learningEffectiveness === 'good') {
      return [
        'Perkuat pemahaman konsep dasar',
        'Perbanyak latihan soal',
        'Review materi yang masih lemah',
        'Gunakan berbagai metode pembelajaran'
      ]
    } else {
      return [
        'Review ulang semua materi dasar',
        'Konsultasi dengan guru',
        'Perbanyak praktik dan latihan',
        'Coba metode pembelajaran yang berbeda'
      ]
    }
  }

  private static getProgressMotivation(analysis: ProgressAnalysis): string {
    if (analysis.improvement > 20) {
      return 'Fantastic! Anda menunjukkan kemajuan yang luar biasa. Terus pertahankan semangat belajar! 🎉🌟'
    } else if (analysis.improvement > 0) {
      return 'Great job! Setiap langkah kecil adalah progress. Terus semangat menuju kesuksesan! 📈💪'
    } else {
      return 'Jangan menyerah! Setiap master pernah gagal lebih banyak dari yang pernah dicoba pemula. Keep going! 🚀💫'
    }
  }

  private static generateComprehensiveRecommendations(
    learningStyle: any, 
    pretest: any, 
    posttest: any, 
    progressAnalysis: any
  ): AIRecommendation {
    const recommendations: any[] = []

    // Learning path recommendations
    if (learningStyle && posttest) {
      if (posttest.percentage >= 80) {
        recommendations.push({
          category: 'Jalur Pembelajaran Advanced',
          items: [
            'Eksplorasi topik rangkaian AC dan DC kompleks',
            'Pelajari tentang mikroelektronika dan Arduino',
            'Ikuti kursus online tentang power electronics',
            'Mulai projek DIY elektronika'
          ],
          priority: 'medium' as const
        })
      } else if (posttest.percentage >= 60) {
        recommendations.push({
          category: 'Penguatan Konsep',
          items: [
            'Review konsep dasar yang belum solid',
            'Perbanyak praktik dengan simulasi',
            'Diskusi intensif dengan AI assistant',
            'Kerjakan lebih banyak variasi soal'
          ],
          priority: 'high' as const
        })
      } else {
        recommendations.push({
          category: 'Pembelajaran Remedial',
          items: [
            'Mulai dari konsep paling dasar',
            'Gunakan metode pembelajaran sesuai gaya belajar',
            'Minta bantuan guru atau tutor',
            'Alokasikan waktu belajar lebih banyak'
          ],
          priority: 'high' as const
        })
      }
    }

    // Future learning recommendations
    recommendations.push({
      category: 'Rencana Pembelajaran Selanjutnya',
      items: [
        'Lanjutkan ke topik rangkaian AC',
        'Pelajari tentang transformator dan motor listrik',
        'Eksplorasi aplikasi IoT dan smart home',
        'Persiapkan untuk ujian atau kompetisi sains'
      ],
      priority: 'low' as const
    })

    return {
      type: 'comprehensive',
      title: 'Roadmap Pembelajaran Comprehensive',
      summary: 'Berdasarkan analisis menyeluruh dari gaya belajar, pre-test, dan post-test, berikut adalah roadmap pembelajaran yang dipersonalisasi untuk Anda.',
      recommendations,
      nextSteps: [
        'Tinjau semua rekomendasi yang diberikan',
        'Pilih strategi yang paling sesuai dengan gaya belajar',
        'Buat jadwal belajar yang konsisten',
        'Monitor progress secara berkala'
      ],
      motivationalMessage: 'Perjalanan pembelajaran adalah marathon, bukan sprint. Setiap langkah membawa Anda lebih dekat ke tujuan! 🎯🏃‍♂️'
    }
  }

  private static calculateOverallRating(
    learningStyle: any,
    pretest: any,
    posttest: any,
    progressAnalysis: any
  ) {
    let score = 0
    let level: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner'
    let badge = '🌱'

    // Calculate score based on available data
    if (learningStyle) score += 25
    if (pretest) score += 25
    if (posttest) {
      score += Math.min(posttest.percentage / 2, 50) // Max 50 points from posttest
    }
    if (progressAnalysis && progressAnalysis.improvement > 0) {
      score += Math.min(progressAnalysis.improvement, 25) // Max 25 points from improvement
    }

    // Determine level and badge
    if (score >= 90) {
      level = 'expert'
      badge = '🏆'
    } else if (score >= 75) {
      level = 'advanced'
      badge = '⭐'
    } else if (score >= 50) {
      level = 'intermediate'
      badge = '📈'
    } else {
      level = 'beginner'
      badge = '🌱'
    }

    return { score, level, badge }
  }
}

export default AIAssessmentService