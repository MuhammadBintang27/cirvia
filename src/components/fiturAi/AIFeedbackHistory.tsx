import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SupabaseTestService } from '@/lib/supabase-test-service'
import { Clock, MessageSquare, TrendingUp, Brain, ChevronDown, ChevronUp } from 'lucide-react'

interface AIFeedbackHistoryProps {
  studentId: string
  studentName: string
}

interface AIFeedbackItem {
  id: string
  feedback_type: 'post_learning_style' | 'post_pretest' | 'post_posttest'
  title: string
  summary: string
  recommendations: any[]
  next_steps: string[]
  motivational_message: string
  created_at: string
  viewed_at: string | null
  viewed_full_report: boolean
}

const getFeedbackIcon = (type: string) => {
  switch (type) {
    case 'post_learning_style':
      return <Brain className="w-5 h-5 text-purple-500" />
    case 'post_pretest':
      return <MessageSquare className="w-5 h-5 text-blue-500" />
    case 'post_posttest':
      return <TrendingUp className="w-5 h-5 text-green-500" />
    default:
      return <MessageSquare className="w-5 h-5 text-gray-500" />
  }
}

const getFeedbackTypeLabel = (type: string) => {
  switch (type) {
    case 'post_learning_style':
      return 'Feedback Gaya Belajar'
    case 'post_pretest':
      return 'Feedback Pre-Test'
    case 'post_posttest':
      return 'Feedback Post-Test'
    default:
      return 'AI Feedback'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const AIFeedbackHistory: React.FC<AIFeedbackHistoryProps> = ({
  studentId,
  studentName
}) => {
  const [feedbackHistory, setFeedbackHistory] = useState<AIFeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadFeedbackHistory()
  }, [studentId])

  const loadFeedbackHistory = async () => {
    try {
      setLoading(true)
      const history = await SupabaseTestService.getAIFeedbackHistory(studentId, 20)
      setFeedbackHistory(history)
    } catch (error) {
      console.error('Error loading AI feedback history:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const markAsViewed = async (feedbackId: string) => {
    try {
      await SupabaseTestService.markAIFeedbackViewed(feedbackId, false)
      // Update local state
      setFeedbackHistory(prev => 
        prev.map(item => 
          item.id === feedbackId 
            ? { ...item, viewed_at: new Date().toISOString() }
            : item
        )
      )
    } catch (error) {
      console.error('Error marking feedback as viewed:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (feedbackHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Belum Ada Riwayat AI Feedback
        </h3>
        <p className="text-gray-500">
          Feedback AI akan muncul setelah Anda menyelesaikan tes atau assessment
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Riwayat AI Feedback
          </h2>
          <p className="text-sm text-gray-600">
            {feedbackHistory.length} feedback tersimpan untuk {studentName}
          </p>
        </div>
      </div>

      {/* Feedback Items */}
      <div className="space-y-3">
        <AnimatePresence>
          {feedbackHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${
                !item.viewed_at ? 'ring-2 ring-blue-100 border-blue-200' : ''
              }`}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  toggleExpanded(item.id)
                  if (!item.viewed_at) markAsViewed(item.id)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getFeedbackIcon(item.feedback_type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.title}
                        </h3>
                        {!item.viewed_at && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Baru
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {getFeedbackTypeLabel(item.feedback_type)}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className="text-xs text-gray-500">
                      {formatDate(item.created_at)}
                    </span>
                    {expandedItems.has(item.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedItems.has(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-4 space-y-4">
                      {/* Recommendations */}
                      {item.recommendations && item.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Rekomendasi
                          </h4>
                          <div className="space-y-3">
                            {item.recommendations.map((rec: any, idx: number) => (
                              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-start space-x-2 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    rec.priority === 'high' 
                                      ? 'bg-red-100 text-red-800'
                                      : rec.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {rec.priority === 'high' ? 'Tinggi' : 
                                     rec.priority === 'medium' ? 'Sedang' : 'Rendah'}
                                  </span>
                                  <h5 className="font-medium text-gray-800">
                                    {rec.category}
                                  </h5>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                  {rec.items.map((item: string, itemIdx: number) => (
                                    <li key={itemIdx}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Next Steps */}
                      {item.next_steps && item.next_steps.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Langkah Selanjutnya
                          </h4>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                              {item.next_steps.map((step: string, stepIdx: number) => (
                                <li key={stepIdx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}

                      {/* Motivational Message */}
                      {item.motivational_message && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Pesan Motivasi
                          </h4>
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700 italic">
                              &ldquo;{item.motivational_message}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button (if needed) */}
      {feedbackHistory.length >= 20 && (
        <div className="text-center pt-4">
          <button
            onClick={loadFeedbackHistory}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  )
}

export default AIFeedbackHistory