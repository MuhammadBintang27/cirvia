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
      return <Brain className="w-5 h-5 text-purple-700" />
    case 'post_pretest':
      return <MessageSquare className="w-5 h-5 text-brand" />
    case 'post_posttest':
      return <TrendingUp className="w-5 h-5 text-emerald-700" />
    default:
      return <MessageSquare className="w-5 h-5 text-muted" />
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
          <div className="w-5 h-5 bg-ink/10 rounded animate-pulse"></div>
          <div className="h-6 bg-ink/10 rounded w-48 animate-pulse"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-paper border border-ink/20 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-ink/10 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-ink/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (feedbackHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted mb-2">
          Belum Ada Riwayat AI Feedback
        </h3>
        <p className="text-muted">
          Feedback AI akan muncul setelah Anda menyelesaikan tes atau assessment
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-brand-soft rounded-lg">
          <Clock className="w-5 h-5 text-brand" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">
            Riwayat AI Feedback
          </h2>
          <p className="text-sm text-muted">
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
              className={`bg-paper border border-ink/20 rounded-xl overflow-hidden transition-all duration-300 ${
                !item.viewed_at ? 'ring-2 ring-brand border-ink' : ''
              }`}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-cream transition-colors"
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
                        <h3 className="font-semibold text-ink truncate">
                          {item.title}
                        </h3>
                        {!item.viewed_at && (
                          <span className="px-2 py-1 bg-brand-soft text-brand text-xs font-medium rounded-full">
                            Baru
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted mb-2">
                        {getFeedbackTypeLabel(item.feedback_type)}
                      </p>
                      <p className="text-sm text-ink line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className="text-xs text-muted">
                      {formatDate(item.created_at)}
                    </span>
                    {expandedItems.has(item.id) ? (
                      <ChevronUp className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
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
                    className="border-t border-ink/20"
                  >
                    <div className="p-4 space-y-4">
                      {/* Recommendations */}
                      {item.recommendations && item.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-ink mb-3">
                            Rekomendasi
                          </h4>
                          <div className="space-y-3">
                            {item.recommendations.map((rec: any, idx: number) => (
                              <div key={idx} className="bg-cream rounded-lg p-3">
                                <div className="flex items-start space-x-2 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    rec.priority === 'high' 
                                      ? 'bg-coral-soft text-red-800'
                                      : rec.priority === 'medium'
                                      ? 'bg-lamp-soft text-yellow-800'
                                      : 'bg-mint-soft text-green-800'
                                  }`}>
                                    {rec.priority === 'high' ? 'Tinggi' : 
                                     rec.priority === 'medium' ? 'Sedang' : 'Rendah'}
                                  </span>
                                  <h5 className="font-medium text-ink">
                                    {rec.category}
                                  </h5>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-sm text-ink">
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
                          <h4 className="font-semibold text-ink mb-3">
                            Langkah Selanjutnya
                          </h4>
                          <div className="bg-brand-soft rounded-lg p-3">
                            <ol className="list-decimal list-inside space-y-1 text-sm text-ink">
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
                          <h4 className="font-semibold text-ink mb-3">
                            Pesan Motivasi
                          </h4>
                          <div className="bg-purple-100 rounded-lg p-3">
                            <p className="text-sm text-ink italic">
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
            className="px-4 py-2 text-sm font-medium text-brand hover:text-brand hover:bg-brand-soft rounded-lg transition-colors"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  )
}

export default AIFeedbackHistory