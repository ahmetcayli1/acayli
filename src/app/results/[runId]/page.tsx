'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Filter, SortAsc, SortDesc, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/landing/header'
import { ResultCard } from '@/components/results/result-card'
import { PaywallBanner } from '@/components/results/paywall-banner'
import { Loading } from '@/components/ui/loading'
import { COUNTRIES, LANGUAGES, RESULTS_LIMITS } from '@/lib/constants'
import type { LLMAnalysis } from '@/types'

interface MatchResult {
  id: string
  rank: number
  programId: string
  universityName: string
  programName: string
  country: string
  language: string
  description?: string | null
  similarityScore: number
  preScore: number
  llmScore: number
  finalScore: number
  llmAnalysis?: LLMAnalysis
  isLocked: boolean
}

interface MatchRunData {
  id: string
  status: string
  selectedCountries: string[]
  selectedLanguages: string[]
  requestedCount: number
  createdAt: string
  completedAt?: string
}

type SortKey = 'rank' | 'finalScore' | 'admissionProbability'
type SortOrder = 'asc' | 'desc'

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const runId = params.runId as string

  const [matchRun, setMatchRun] = useState<MatchRunData | null>(null)
  const [results, setResults] = useState<MatchResult[]>([])
  const [hasFullAccess, setHasFullAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState('')
  
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [countryFilter, setCountryFilter] = useState<string>('')
  const [languageFilter, setLanguageFilter] = useState<string>('')

  useEffect(() => {
    if (sessionStatus === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/results/' + runId)
      return
    }
    fetchResults()
  }, [session, sessionStatus, runId, router])

  const fetchResults = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch(`/api/match/${runId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to load results')
        return
      }

      setMatchRun(data.data.matchRun)
      setResults(data.data.results)
      setHasFullAccess(data.data.hasFullAccess)
    } catch {
      setError('Failed to load results')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlock = async () => {
    setIsCheckingOut(true)
    
    try {
      const res = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchRunId: runId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setIsCheckingOut(false)
    }
  }

  // Filter and sort results
  const filteredResults = results
    .filter(r => !countryFilter || r.country === countryFilter)
    .filter(r => !languageFilter || r.language === languageFilter)
    .sort((a, b) => {
      let aVal: number, bVal: number
      
      switch (sortKey) {
        case 'admissionProbability':
          aVal = a.llmAnalysis?.admissionProbability || 0
          bVal = b.llmAnalysis?.admissionProbability || 0
          break
        case 'finalScore':
          aVal = a.finalScore
          bVal = b.finalScore
          break
        default:
          aVal = a.rank
          bVal = b.rank
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

  const unlockedResults = filteredResults.filter(r => !r.isLocked)
  const lockedResults = filteredResults.filter(r => r.isLocked)

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="lg" text="Loading your results..." />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 text-center">
          <div className="glass rounded-2xl p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchResults} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Try Again
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Your University Matches
            </h1>
            <p className="text-white/60">
              {results.length} programs matched from{' '}
              {matchRun?.selectedCountries.map(c => 
                COUNTRIES.find(co => co.id === c)?.name
              ).join(', ')}
            </p>
          </div>
          
          {hasFullAccess && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Full Access Unlocked</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/50" />
              <span className="text-white/50 text-sm">Filters:</span>
            </div>
            
            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">All Countries</option>
              {matchRun?.selectedCountries.map(c => (
                <option key={c} value={c}>
                  {COUNTRIES.find(co => co.id === c)?.name}
                </option>
              ))}
            </select>

            <select
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">All Languages</option>
              {matchRun?.selectedLanguages.map(l => (
                <option key={l} value={l}>
                  {LANGUAGES.find(la => la.id === l)?.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-white/50 text-sm">Sort by:</span>
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="rank">Rank</option>
                <option value="finalScore">Match Score</option>
                <option value="admissionProbability">Admission Probability</option>
              </select>
              <button
                onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4 text-white" />
                ) : (
                  <SortDesc className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Unlocked Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {unlockedResults.map(result => (
            <ResultCard
              key={result.id}
              rank={result.rank}
              universityName={result.universityName}
              programName={result.programName}
              country={result.country}
              language={result.language}
              description={result.description}
              finalScore={result.finalScore}
              llmAnalysis={result.llmAnalysis}
              isLocked={false}
            />
          ))}
        </div>

        {/* Paywall */}
        {!hasFullAccess && lockedResults.length > 0 && (
          <div className="mb-8">
            <PaywallBanner
              lockedCount={lockedResults.length}
              onUnlock={handleUnlock}
              isLoading={isCheckingOut}
            />
          </div>
        )}

        {/* Locked Results Preview */}
        {!hasFullAccess && lockedResults.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lockedResults.slice(0, 4).map(result => (
              <ResultCard
                key={result.id}
                rank={result.rank}
                universityName={result.universityName}
                programName={result.programName}
                country={result.country}
                language={result.language}
                description={result.description}
                finalScore={result.finalScore}
                llmAnalysis={result.llmAnalysis}
                isLocked={true}
              />
            ))}
          </div>
        )}

        {/* All unlocked results (when full access) */}
        {hasFullAccess && lockedResults.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lockedResults.map(result => (
              <ResultCard
                key={result.id}
                rank={result.rank}
                universityName={result.universityName}
                programName={result.programName}
                country={result.country}
                language={result.language}
                description={result.description}
                finalScore={result.finalScore}
                llmAnalysis={result.llmAnalysis}
                isLocked={false}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
