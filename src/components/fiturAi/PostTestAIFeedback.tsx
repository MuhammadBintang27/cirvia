'use client'
import { Ico } from "@/components/ui/Ico";

import { useState, useEffect, useCallback } from 'react'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'
import AIAssessmentService, { AIRecommendation } from '@/lib/ai-assessment-service'

interface PostTestAIFeedbackProps {
  studentId: string
  studentName?: string
  testType: 'learning_style' | 'pretest' | 'posttest'
  score?: number
  improvement?: number
}

const PostTestAIFeedback: React.FC<PostTestAIFeedbackProps> = ({
  studentId,
  studentName,
  testType,
  score,
  improvement
}) => {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false) // PENTING: Track apakah sudah pernah load

  // ✅ Wrap loadRecommendation dengan useCallback untuk stabilitas
  const loadRecommendation = useCallback(async () => {
    try {
      setLoading(true)
      console.log(`🤖 [AI-FEEDBACK] Loading recommendation for ${testType}...`)
      let result: AIRecommendation

      if (testType === 'learning_style') {
        result = await AIAssessmentService.analyzeLearningStyle(studentId)
      } else {
        result = await AIAssessmentService.analyzeProgress(studentId)
      }

      setRecommendation(result)
      setHasLoaded(true) // PENTING: Mark sebagai sudah loaded
      console.log(`✅ [AI-FEEDBACK] Recommendation loaded successfully for ${testType}`)
    } catch (error) {
      console.error('❌ [AI-FEEDBACK] Error loading AI recommendation:', error)
      setHasLoaded(true) // Mark sebagai sudah dicoba (meskipun error)
    } finally {
      setLoading(false)
    }
  }, [studentId, testType]) // Dependencies yang benar

  useEffect(() => {
    // ✅ PENTING: Hanya load 1x saat component mount atau studentId/testType berubah
    if (!hasLoaded) {
      loadRecommendation()
    }
  }, [hasLoaded, loadRecommendation]) // Dependencies yang benar

  const getTestTypeIcon = () => {
    switch (testType) {
      case 'learning_style': return <Brain className="w-8 h-8" />
      case 'pretest': return <CheckCircle className="w-8 h-8" />
      case 'posttest': return <Award className="w-8 h-8" />
      default: return <Lightbulb className="w-8 h-8" />
    }
  }

  const getTestTypeColor = () => {
    switch (testType) {
      case 'learning_style': return 'bg-purple-100 border-ink'
      case 'pretest': return 'bg-mint-soft border-ink'
      case 'posttest': return 'bg-brand-soft border-ink'
      default: return 'bg-lamp-soft border-ink'
    }
  }

  const getScoreMessage = () => {
    // Always use AI-generated title (no fallback)
    return recommendation?.title || 'Menganalisis...'
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${getTestTypeColor()} rounded-2xl p-6 border`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
          </div>
          <h3 className="text-xl font-bold text-ink mb-2">AI sedang menganalisis...</h3>
          <p className="text-muted">Menghasilkan rekomendasi personal untuk Anda</p>
        </div>
      </motion.div>
    )
  }

  if (!recommendation) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${getTestTypeColor()} rounded-2xl p-6 border`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-ink" />
          </div>
          <h3 className="text-xl font-bold text-ink mb-2">Belum Ada Data AI</h3>
          <p className="text-muted mb-4">
            Silakan ikuti pre-test dan post-test untuk mendapatkan analisis progress pembelajaran dari AI.
          </p>
        </div>
        
        {/* Left-aligned instructions with justified text */}
        <div className="bg-paper rounded-lg p-4">
          <h4 className="font-semibold text-ink mb-3 text-left">Langkah Selanjutnya:</h4>
          <ol className="space-y-3">
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-soft rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-brand text-sm font-bold">1</span>
              </div>
              <span className="text-ink text-sm leading-relaxed flex-1 text-justify">
                Kerjakan pre-test untuk mengetahui kemampuan awal
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-soft rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-brand text-sm font-bold">2</span>
              </div>
              <span className="text-ink text-sm leading-relaxed flex-1 text-justify">
                Pelajari materi rangkaian listrik
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-soft rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-brand text-sm font-bold">3</span>
              </div>
              <span className="text-ink text-sm leading-relaxed flex-1 text-justify">
                Kerjakan post-test setelah pembelajaran
              </span>
            </li>
          </ol>
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-2xl mb-2"><Ico n="target" /></div>
          <p className="text-ink font-medium italic px-4">
            Mari mulai perjalanan pembelajaran Anda! Setiap ahli pernah menjadi pemula. 
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${getTestTypeColor()} rounded-2xl p-6 border`}
    >
      {/* Header - Centered */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto mb-4">
          {getTestTypeIcon()}
        </div>
        
        {/* Student Name Greeting - Personalization */}
        {studentName && (
          <div className="mb-3">
            <p className="text-muted text-sm">Hai,</p>
            <p className="text-2xl font-bold text-ink">
              {studentName}! 
            </p>
          </div>
        )}
        
        {/* AI Badge */}
        {recommendation.type === 'ai_powered' && (
          <div className="inline-flex items-center px-3 py-1 bg-brand-soft border-2 border-ink rounded-full mb-3">
            <Sparkles className="w-3 h-3 mr-1 text-amber-700" />
            <span className="text-xs font-bold text-ink">Powered by Google Gemini </span>
            <Sparkles className="w-3 h-3 ml-1 text-amber-700" />
          </div>
        )}
        
        <h3 className="text-2xl font-black text-ink mb-4 flex items-center justify-center">
          <Brain className="w-6 h-6 mr-2 text-purple-700" />
          AI Personal Feedback
          <Sparkles className="w-6 h-6 ml-2 text-amber-700" />
        </h3>
      </div>

      {/* AI Personal Message - Fully justified */}
      <div className="bg-paper rounded-xl p-6 mb-6 border-2 border-ink">
        <h4 className="text-xl font-bold text-ink mb-4 flex items-start">
          <span className="text-2xl mr-3"><Ico n="lightbulb" /></span>
          <span className="flex-1">{getScoreMessage()}</span>
        </h4>
        <div className="text-ink text-base leading-relaxed space-y-3">
          {/* Split by paragraphs if contains multiple paragraphs */}
          {recommendation.summary.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line break-words text-justify">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Key Recommendations Preview - Left aligned */}
      {recommendation.recommendations.length > 0 && (
        <div className="space-y-4 mb-6">
          <h4 className="text-lg font-bold text-ink flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-amber-700" />
            Yang Bisa Kamu Lakukan
          </h4>
          
          {recommendation.recommendations.slice(0, 2).map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-paper rounded-lg p-4 border-2 border-ink"
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <h5 className="font-semibold text-ink text-base flex-1">{category.category}</h5>
                <span className={`px-2 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${
                  category.priority === 'high' ? 'bg-coral-soft text-red-600 border-ink' :
                  category.priority === 'medium' ? 'bg-lamp-soft text-amber-700 border-ink' :
                  'bg-mint-soft text-emerald-700 border-ink'
                }`}>
                  {category.priority === 'high' ? 'Prioritas' : category.priority === 'medium' ? 'Penting' : 'Opsional'}
                </span>
              </div>
              <ul className="space-y-3">
                {category.items.slice(0, 3).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                    <span className="text-ink text-sm leading-relaxed break-words flex-1 text-justify">{item}</span>
                  </li>
                ))}
                {category.items.length > 3 && (
                  <li className="text-muted text-xs italic ml-7">
                    +{category.items.length - 3} tips lainnya...
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      )}

      {/* Next Steps - Left aligned with better word wrapping */}
      {recommendation.nextSteps.length > 0 && (
        <div className="bg-paper rounded-lg p-4 mb-6 border border-ink/20">
          <h4 className="font-semibold text-ink mb-3 flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-brand" />
            Langkah Selanjutnya Buat Kamu
          </h4>
          <ul className="space-y-3">
            {recommendation.nextSteps.slice(0, 3).map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-soft rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-brand text-sm font-bold">{index + 1}</span>
                </div>
                <span className="text-ink text-sm leading-relaxed break-words flex-1 text-justify">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Motivational Message - Justified for long messages */}
      {recommendation.motivationalMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className={`bg-purple-100 border-2 border-ink rounded-xl p-5 ${
            recommendation.motivationalMessage.length > 100 ? '' : 'text-center'
          }`}
        >
          <div className={`text-3xl mb-3 ${recommendation.motivationalMessage.length > 100 ? '' : 'text-center'}`}>
            <Ico n="award" />
          </div>
          <p className={`text-ink font-medium text-base leading-relaxed break-words whitespace-pre-line ${
            recommendation.motivationalMessage.length > 100 ? 'text-justify' : 'text-center'
          }`}>
            {recommendation.motivationalMessage}
          </p>
        </motion.div>
      )}

      {/* View Full Report Button - Only show for posttest or if multiple tests completed */}
      {(testType === 'posttest' || testType === 'learning_style') && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              // This will be handled by parent component or redirect
              const event = new CustomEvent('openFullAssessment', { 
                detail: { studentId } 
              })
              window.dispatchEvent(event)
            }}
            className="inline-flex items-center px-6 py-3 bg-purple-500 border-2 border-ink text-white rounded-xl font-bold hover:bg-purple-500 transition-all transform"
          >
            <Brain className="w-5 h-5 mr-2" />
            Lihat Full AI Assessment Report
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default PostTestAIFeedback