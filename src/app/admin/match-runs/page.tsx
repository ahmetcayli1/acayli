'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { formatDate } from '@/lib/utils'
import { COUNTRIES } from '@/lib/constants'

interface MatchRun {
  id: string
  status: string
  selectedCountries: string[]
  selectedLanguages: string[]
  requestedCount: number
  createdAt: string
  completedAt: string | null
  user: {
    email: string
  }
  _count: {
    results: number
  }
}

export default function MatchRunsPage() {
  const [matchRuns, setMatchRuns] = useState<MatchRun[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMatchRuns()
  }, [])

  const fetchMatchRuns = async () => {
    try {
      const res = await fetch('/api/admin/match-runs')
      const data = await res.json()
      if (data.success) {
        setMatchRuns(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch match runs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'PROCESSING':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-white/50" />
    }
  }

  const getStatusVariant = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'FAILED':
        return 'error'
      case 'PROCESSING':
        return 'warning'
      default:
        return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading text="Loading match runs..." />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Match Runs</h1>
        <p className="text-white/60">
          View all matching operations and their results
        </p>
      </div>

      {/* Match Runs List */}
      <div className="space-y-4">
        {matchRuns.map((run, index) => (
          <motion.div
            key={run.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{run.user.email}</p>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <span>{formatDate(run.createdAt)}</span>
                        <span>•</span>
                        <span>ID: {run.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      <Badge variant={getStatusVariant(run.status)}>
                        {run.status}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-400">{run._count.results}</p>
                      <p className="text-xs text-white/50">Results</p>
                    </div>

                    <div className="flex gap-1">
                      {run.selectedCountries.slice(0, 3).map(country => (
                        <span key={country} className="text-lg">
                          {COUNTRIES.find(c => c.id === country)?.flag || '🌍'}
                        </span>
                      ))}
                      {run.selectedCountries.length > 3 && (
                        <span className="text-white/50 text-sm">
                          +{run.selectedCountries.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {matchRuns.length === 0 && (
          <div className="text-center py-12 text-white/50">
            No match runs found
          </div>
        )}
      </div>
    </div>
  )
}
