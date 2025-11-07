'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Star, 
  Award, 
  BookOpen, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  Ear,
  Hand,
  BarChart3,
  Clock,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import AIAssessmentService, { 
  ComprehensiveAssessment, 
  AIRecommendation,
  ProgressAnalysis 
} from '@/lib/ai-assessment-service'

interface AIAssessmentReportProps {
  studentId: string
  studentName: string
  studentClass: string
  onClose?: () => void
}

const AIAssessmentReport: React.FC<AIAssessmentReportProps> = ({
  studentId,
  studentName,
  studentClass,
  onClose
}) => {
  const [assessment, setAssessment] = useState<ComprehensiveAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'learning_style' | 'progress' | 'recommendations'>('overview')

  useEffect(() => {
    loadAssessment()
  }, [studentId])

  const loadAssessment = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await AIAssessmentService.generateComprehensiveAssessment(
        studentId,
        studentName,
        studentClass
      )
      setAssessment(result)
    } catch (err) {
      console.error('Error loading assessment:', err)
      setError('Gagal memuat penilaian AI. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return <Eye className="w-6 h-6" />
      case 'auditory': return <Ear className="w-6 h-6" />
      case 'kinesthetic': return <Hand className="w-6 h-6" />
      default: return <Brain className="w-6 h-6" />
    }
  }

  const getLearningStyleColor = (style: string) => {
    switch (style) {
      case 'visual': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30'
      case 'auditory': return 'from-purple-500/20 to-pink-500/20 border-purple-400/30'
      case 'kinesthetic': return 'from-emerald-500/20 to-teal-500/20 border-emerald-400/30'
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-400/30'
    }
  }

  const getProgressColor = (analysis: ProgressAnalysis | null) => {
    if (!analysis) return 'from-gray-500/20 to-slate-500/20 border-gray-400/30'
    
    switch (analysis.learningEffectiveness) {
      case 'excellent': return 'from-green-500/20 to-emerald-500/20 border-green-400/30'
      case 'good': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30'
      case 'fair': return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
      case 'needs_improvement': return 'from-red-500/20 to-pink-500/20 border-red-400/30'
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-400/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-400/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
      case 'low': return 'bg-green-500/20 text-green-300 border-green-400/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Learning Data</h3>
          <p className="text-purple-200/70">AI sedang menganalisis hasil pembelajaran Anda...</p>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error</h3>
          <p className="text-red-200/70 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadAssessment}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-indigo-900/95 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white mb-1">AI Assessment Report</h1>
                    <p className="text-purple-200/80">
                      Analisis Pembelajaran untuk <strong>{studentName}</strong> - Kelas {studentClass}
                    </p>
                  </div>
                </div>
                
                {/* Overall Rating Badge */}
                <div className="text-center">
                  <div className="text-4xl mb-2">{assessment.overallRating.badge}</div>
                  <div className="text-2xl font-bold text-white">{assessment.overallRating.score}/100</div>
                  <div className="text-sm text-purple-200/70 capitalize">{assessment.overallRating.level}</div>
                </div>
                
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'learning_style', label: 'Gaya Belajar', icon: Brain },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'recommendations', label: 'Rekomendasi', icon: Lightbulb }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-400 bg-purple-500/10 text-purple-300'
                      : 'border-transparent text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
                      <div className="text-2xl mb-2">
                        {assessment.learningStyle ? getLearningStyleIcon(assessment.learningStyle.primaryStyle) : <Brain className="w-6 h-6 mx-auto" />}
                      </div>
                      <div className="text-sm text-white/70 mb-1">Gaya Belajar</div>
                      <div className="font-bold text-white">
                        {assessment.learningStyle ? 
                          assessment.learningStyle.primaryStyle.charAt(0).toUpperCase() + assessment.learningStyle.primaryStyle.slice(1) :
                          'Belum Tes'
                        }
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-sm text-white/70 mb-1">Pre-Test</div>
                      <div className="font-bold text-white">
                        {assessment.pretest ? `${assessment.pretest.percentage}%` : 'Belum'}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
                      <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm text-white/70 mb-1">Post-Test</div>
                      <div className="font-bold text-white">
                        {assessment.posttest ? `${assessment.posttest.percentage}%` : 'Belum'}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
                      <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-sm text-white/70 mb-1">Peningkatan</div>
                      <div className="font-bold text-white">
                        {assessment.progressAnalysis ? 
                          `${assessment.progressAnalysis.improvement > 0 ? '+' : ''}${assessment.progressAnalysis.improvement.toFixed(1)}%` :
                          'N/A'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Learning Style Summary */}
                    {assessment.learningStyle && (
                      <div className={`bg-gradient-to-br ${getLearningStyleColor(assessment.learningStyle.primaryStyle)} backdrop-blur-xl rounded-xl p-6 border`}>
                        <div className="flex items-center space-x-3 mb-4">
                          {getLearningStyleIcon(assessment.learningStyle.primaryStyle)}
                          <h3 className="text-xl font-bold text-white">Gaya Belajar Dominan</h3>
                        </div>
                        <p className="text-white/90 mb-4">
                          Anda adalah seorang <strong>{assessment.learningStyle.primaryStyle} learner</strong> dengan 
                          dominasi {assessment.learningStyle.percentages[assessment.learningStyle.primaryStyle]}%.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-lg font-bold text-white">{assessment.learningStyle.percentages.visual}%</div>
                            <div className="text-xs text-white/70">Visual</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">{assessment.learningStyle.percentages.auditory}%</div>
                            <div className="text-xs text-white/70">Auditory</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">{assessment.learningStyle.percentages.kinesthetic}%</div>
                            <div className="text-xs text-white/70">Kinesthetic</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progress Summary */}
                    {assessment.progressAnalysis && assessment.pretest && assessment.posttest && (
                      <div className={`bg-gradient-to-br ${getProgressColor(assessment.progressAnalysis)} backdrop-blur-xl rounded-xl p-6 border`}>
                        <div className="flex items-center space-x-3 mb-4">
                          <TrendingUp className="w-6 h-6" />
                          <h3 className="text-xl font-bold text-white">Progress Pembelajaran</h3>
                        </div>
                        <p className="text-white/90 mb-4">
                          Peningkatan <strong>{assessment.progressAnalysis.improvement.toFixed(1)}%</strong> dari 
                          pre-test ke post-test menunjukkan pembelajaran yang{' '}
                          <strong>
                            {assessment.progressAnalysis.learningEffectiveness === 'excellent' ? 'sangat efektif' :
                             assessment.progressAnalysis.learningEffectiveness === 'good' ? 'baik' :
                             assessment.progressAnalysis.learningEffectiveness === 'fair' ? 'cukup baik' :
                             'perlu ditingkatkan'}
                          </strong>.
                        </p>
                        <div className="flex justify-between text-center">
                          <div>
                            <div className="text-lg font-bold text-white">{assessment.pretest.percentage}%</div>
                            <div className="text-xs text-white/70">Pre-Test</div>
                          </div>
                          <ArrowRight className="w-6 h-6 text-white/50 self-center" />
                          <div>
                            <div className="text-lg font-bold text-white">{assessment.posttest.percentage}%</div>
                            <div className="text-xs text-white/70">Post-Test</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'learning_style' && (
                <div className="space-y-6">
                  {assessment.learningStyle ? (
                    <>
                      <div className={`bg-gradient-to-br ${getLearningStyleColor(assessment.learningStyle.primaryStyle)} backdrop-blur-xl rounded-xl p-8 border text-center`}>
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          {getLearningStyleIcon(assessment.learningStyle.primaryStyle)}
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">
                          {assessment.learningStyle.primaryStyle === 'visual' ? 'Visual Learner' :
                           assessment.learningStyle.primaryStyle === 'auditory' ? 'Auditory Learner' :
                           'Kinesthetic Learner'}
                        </h2>
                        <p className="text-white/90 text-lg mb-6">
                          Anda belajar paling efektif melalui{' '}
                          {assessment.learningStyle.primaryStyle === 'visual' ? 'gambar, diagram, dan representasi visual' :
                           assessment.learningStyle.primaryStyle === 'auditory' ? 'mendengar, diskusi, dan penjelasan verbal' :
                           'praktik langsung, percobaan, dan pengalaman fisik'}.
                        </p>
                        
                        {/* Percentage Breakdown */}
                        <div className="grid grid-cols-3 gap-4">
                          {Object.entries(assessment.learningStyle.percentages).map(([style, percentage]) => (
                            <div key={style} className="bg-white/10 rounded-lg p-4">
                              <div className="text-2xl font-bold text-white">{percentage}%</div>
                              <div className="text-white/70 capitalize">{style}</div>
                              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                <div 
                                  className="bg-white h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Learning Style Recommendations */}
                      {assessment.recommendations
                        .filter(rec => rec.type === 'learning_style')
                        .map((rec, index) => (
                          <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">{rec.title}</h3>
                            <p className="text-white/80 mb-6">{rec.summary}</p>
                            
                            <div className="space-y-4">
                              {rec.recommendations.map((category, catIndex) => (
                                <div key={catIndex} className="border border-white/10 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-white">{category.category}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(category.priority)}`}>
                                      {category.priority}
                                    </span>
                                  </div>
                                  <ul className="space-y-2">
                                    {category.items.map((item, itemIndex) => (
                                      <li key={itemIndex} className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-white/80 text-sm">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      }
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Tes Gaya Belajar Belum Dikerjakan</h3>
                      <p className="text-gray-400 mb-6">
                        Kerjakan tes gaya belajar untuk mendapatkan analisis dan rekomendasi yang personal.
                      </p>
                      <button
                        onClick={() => window.location.href = '/learning-style'}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        Ikuti Tes Gaya Belajar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="space-y-6">
                  {assessment.pretest && assessment.posttest && assessment.progressAnalysis ? (
                    <>
                      {/* Progress Overview */}
                      <div className={`bg-gradient-to-br ${getProgressColor(assessment.progressAnalysis)} backdrop-blur-xl rounded-xl p-8 border text-center`}>
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <TrendingUp className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">
                          Progress Analysis
                        </h2>
                        <div className="text-6xl font-black text-white mb-2">
                          {assessment.progressAnalysis.improvement > 0 ? '+' : ''}
                          {assessment.progressAnalysis.improvement.toFixed(1)}%
                        </div>
                        <p className="text-white/90 text-lg mb-6">
                          Peningkatan dari pre-test ke post-test
                        </p>
                        
                        {/* Detailed Stats */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white/10 rounded-lg p-4">
                            <h4 className="text-white font-bold mb-3">Test Scores</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-white/70">Pre-Test:</span>
                                <span className="text-white font-bold">{assessment.pretest.percentage}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Post-Test:</span>
                                <span className="text-white font-bold">{assessment.posttest.percentage}%</span>
                              </div>
                              <div className="flex justify-between border-t border-white/20 pt-2">
                                <span className="text-white/70">Improvement:</span>
                                <span className={`font-bold ${assessment.progressAnalysis.improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {assessment.progressAnalysis.improvement > 0 ? '+' : ''}
                                  {assessment.progressAnalysis.improvement.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/10 rounded-lg p-4">
                            <h4 className="text-white font-bold mb-3">Performance Metrics</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-white/70">Learning Effectiveness:</span>
                                <span className="text-white font-bold capitalize">
                                  {assessment.progressAnalysis.learningEffectiveness.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Time Efficiency:</span>
                                <span className="text-white font-bold capitalize">
                                  {assessment.progressAnalysis.timeEfficiency}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Strengths and Weaknesses */}
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-6 border border-green-400/30">
                          <div className="flex items-center space-x-3 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <h3 className="text-xl font-bold text-white">Strength Areas</h3>
                          </div>
                          <ul className="space-y-2">
                            {assessment.progressAnalysis.strengthAreas.map((area, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-white/90">{area}</span>
                              </li>
                            ))}
                            {assessment.progressAnalysis.strengthAreas.length === 0 && (
                              <li className="text-white/70 italic">Terus tingkatkan pembelajaran untuk mengidentifikasi area kekuatan</li>
                            )}
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl p-6 border border-yellow-400/30">
                          <div className="flex items-center space-x-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-xl font-bold text-white">Areas for Improvement</h3>
                          </div>
                          <ul className="space-y-2">
                            {assessment.progressAnalysis.weaknessAreas.map((area, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Target className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <span className="text-white/90">{area}</span>
                              </li>
                            ))}
                            {assessment.progressAnalysis.weaknessAreas.length === 0 && (
                              <li className="text-white/70 italic">Excellent! Tidak ada area yang perlu perbaikan signifikan</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Data Progress Tidak Lengkap</h3>
                      <p className="text-gray-400 mb-6">
                        Kerjakan pre-test dan post-test untuk mendapatkan analisis progress yang komprehensif.
                      </p>
                      <div className="flex gap-4 justify-center">
                        {!assessment.pretest && (
                          <button
                            onClick={() => window.location.href = '/pretest'}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                          >
                            Kerjakan Pre-Test
                          </button>
                        )}
                        {!assessment.posttest && (
                          <button
                            onClick={() => window.location.href = '/posttest'}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                          >
                            Kerjakan Post-Test
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-6">
                  {assessment.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center">
                          <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                      </div>
                      
                      <p className="text-white/80 mb-6">{rec.summary}</p>
                      
                      <div className="space-y-4 mb-6">
                        {rec.recommendations.map((category, catIndex) => (
                          <div key={catIndex} className="border border-white/10 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-white">{category.category}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(category.priority)}`}>
                                {category.priority}
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {category.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-white/80 text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {rec.nextSteps.length > 0 && (
                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-white mb-3 flex items-center">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Next Steps
                          </h4>
                          <ul className="space-y-1">
                            {rec.nextSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-white/80 text-sm">
                                {stepIndex + 1}. {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.motivationalMessage && (
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-4">
                          <p className="text-center text-white/90 italic">
                            💪 {rec.motivationalMessage}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gradient-to-r from-white/5 to-white/10 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                  Report generated by CIRVIA AI • {new Date().toLocaleDateString('id-ID')}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors"
                  >
                    Print Report
                  </button>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm transition-all"
                    >
                      Tutup
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AIAssessmentReport