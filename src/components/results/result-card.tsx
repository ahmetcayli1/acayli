'use client'

import { motion } from 'framer-motion'
import { Lock, MapPin, Globe, Award, TrendingUp, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { LLMAnalysis } from '@/types'

interface ResultCardProps {
  rank: number
  universityName: string
  programName: string
  country: string
  language: string
  description?: string | null
  finalScore: number
  llmAnalysis?: LLMAnalysis
  isLocked: boolean
}

export function ResultCard({
  rank,
  universityName,
  programName,
  country,
  language,
  description,
  finalScore,
  llmAnalysis,
  isLocked,
}: ResultCardProps) {
  const tagVariant = llmAnalysis?.tag === 'SAFE' 
    ? 'safe' 
    : llmAnalysis?.tag === 'TARGET' 
      ? 'target' 
      : 'reach'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        'relative glass rounded-2xl overflow-hidden transition-all duration-300',
        isLocked && 'opacity-60'
      )}
    >
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 backdrop-blur-md bg-slate-900/50 z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-white/50 mx-auto mb-2" />
            <p className="text-white/70 text-sm">Unlock to view</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              #{rank}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white line-clamp-1">
                {universityName}
              </h3>
              <p className="text-white/70">{programName}</p>
            </div>
          </div>
          
          {llmAnalysis?.tag && (
            <Badge variant={tagVariant}>
              {llmAnalysis.tag}
            </Badge>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="capitalize">{country}</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span>{language}</span>
          </div>
          {llmAnalysis?.rankingQs && (
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>QS #{llmAnalysis.rankingQs}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && !isLocked && (
          <p className="text-white/70 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Scores */}
        {!isLocked && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-white/50 mb-1">Match Score</p>
              <p className="text-2xl font-bold text-blue-400">
                {Math.round(finalScore)}%
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-white/50 mb-1">Admission Probability</p>
              <p className="text-2xl font-bold text-green-400">
                {llmAnalysis?.admissionProbability || 0}%
              </p>
            </div>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        {!isLocked && llmAnalysis && (
          <div className="space-y-3">
            {llmAnalysis.strengths && llmAnalysis.strengths.length > 0 && (
              <div>
                <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  Strengths
                </p>
                <div className="flex flex-wrap gap-2">
                  {llmAnalysis.strengths.map((strength, i) => (
                    <span key={i} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {llmAnalysis.weaknesses && llmAnalysis.weaknesses.length > 0 && (
              <div>
                <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-yellow-400" />
                  Considerations
                </p>
                <div className="flex flex-wrap gap-2">
                  {llmAnalysis.weaknesses.map((weakness, i) => (
                    <span key={i} className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg">
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expert commentary */}
        {!isLocked && llmAnalysis?.expertCommentary && (
          <div className="mt-4 p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-white/50 mb-1">Expert Insight</p>
            <p className="text-sm text-white/80">
              {llmAnalysis.expertCommentary}
            </p>
          </div>
        )}

        {/* Tuition */}
        {!isLocked && llmAnalysis?.tuitionInfo && (
          <div className="mt-3 text-sm text-white/60">
            💰 <span className="text-white/80">{llmAnalysis.tuitionInfo}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
