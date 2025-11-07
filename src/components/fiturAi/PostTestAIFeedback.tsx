'use client'

import { useState, useEffect } from 'react'
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
  testType: 'learning_style' | 'pretest' | 'posttest'
  score?: number
  improvement?: number
}

const PostTestAIFeedback: React.FC<PostTestAIFeedbackProps> = ({
  studentId,
  testType,
  score,
  improvement
}) => {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendation()
  }, [studentId, testType])

  const loadRecommendation = async () => {
    try {
      setLoading(true)
      let result: AIRecommendation

      if (testType === 'learning_style') {
        result = await AIAssessmentService.analyzeLearningStyle(studentId)
      } else {
        result = await AIAssessmentService.analyzeProgress(studentId)
      }

      setRecommendation(result)
    } catch (error) {
      console.error('Error loading AI recommendation:', error)
    } finally {
      setLoading(false)
    }
  }

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
      case 'learning_style': return 'from-purple-500/20 to-pink-500/20 border-purple-400/30'
      case 'pretest': return 'from-green-500/20 to-emerald-500/20 border-green-400/30'
      case 'posttest': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30'
      default: return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
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
        className={`bg-gradient-to-br ${getTestTypeColor()} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI sedang menganalisis...</h3>
          <p className="text-white/70">Menghasilkan rekomendasi personal untuk Anda</p>
        </div>
      </motion.div>
    )
  }

  if (!recommendation) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br ${getTestTypeColor()} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Belum Ada Data AI</h3>
          <p className="text-white/70 mb-4">
            Silakan ikuti pre-test dan post-test untuk mendapatkan analisis progress pembelajaran dari AI.
          </p>
          <div className="bg-white/10 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-white mb-2">Langkah Selanjutnya:</h4>
            <ol className="space-y-2">
              <li className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-cyan-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-300 text-xs font-bold">1</span>
                </div>
                <span className="text-white/80 text-sm">Kerjakan pre-test untuk mengetahui kemampuan awal</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-cyan-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-300 text-xs font-bold">2</span>
                </div>
                <span className="text-white/80 text-sm">Pelajari materi rangkaian listrik</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-cyan-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-300 text-xs font-bold">3</span>
                </div>
                <span className="text-white/80 text-sm">Kerjakan post-test setelah pembelajaran</span>
              </li>
            </ol>
          </div>
          <div className="mt-4 text-2xl">🎯</div>
          <p className="text-white/90 font-medium italic mt-2">
            Mari mulai perjalanan pembelajaran Anda! Setiap ahli pernah menjadi pemula. 💪
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
      className={`bg-gradient-to-br ${getTestTypeColor()} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          {getTestTypeIcon()}
        </div>
        
        {/* AI Badge */}
        {recommendation.type === 'ai_powered' && (
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-full mb-3">
            <Sparkles className="w-3 h-3 mr-1 text-yellow-300" />
            <span className="text-xs font-bold text-white">Powered by GPT-4</span>
            <Sparkles className="w-3 h-3 ml-1 text-yellow-300" />
          </div>
        )}
        
        <h3 className="text-2xl font-black text-white mb-4 flex items-center justify-center">
          <Brain className="w-6 h-6 mr-2 text-purple-300" />
          AI Personal Feedback
          <Sparkles className="w-6 h-6 ml-2 text-yellow-300" />
        </h3>
        
        {/* AI Personal Message - Display as conversational text */}
        <div className="bg-white/10 rounded-xl p-6 mb-4 border border-white/20">
          <div className="text-2xl font-bold text-white mb-3">{getScoreMessage()}</div>
          <p className="text-white/90 text-lg leading-relaxed">{recommendation.summary}</p>
        </div>
      </div>

      {/* Key Recommendations Preview */}
      {recommendation.recommendations.length > 0 && (
        <div className="space-y-4 mb-6">
          <h4 className="text-lg font-bold text-white flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
            Yang Bisa Kamu Lakukan
          </h4>
          
          {recommendation.recommendations.slice(0, 2).map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 rounded-lg p-4 border border-white/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-white text-base">{category.category}</h5>
                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                  category.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-400/30' :
                  category.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                  'bg-green-500/20 text-green-300 border-green-400/30'
                }`}>
                  {category.priority === 'high' ? 'Prioritas' : category.priority === 'medium' ? 'Penting' : 'Opsional'}
                </span>
              </div>
              <ul className="space-y-2">
                {category.items.slice(0, 3).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
                {category.items.length > 3 && (
                  <li className="text-white/60 text-xs italic ml-6">
                    +{category.items.length - 3} tips lainnya...
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      )}

      {/* Next Steps */}
      {recommendation.nextSteps.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-cyan-400" />
            Langkah Selanjutnya Buat Kamu
          </h4>
          <ul className="space-y-2">
            {recommendation.nextSteps.slice(0, 3).map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-cyan-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-300 text-sm font-bold">{index + 1}</span>
                </div>
                <span className="text-white/90 text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Motivational Message */}
      {recommendation.motivationalMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-5 text-center"
        >
          <div className="text-3xl mb-3">💪✨</div>
          <p className="text-white font-medium text-base leading-relaxed">
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
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
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