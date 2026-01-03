'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CONSULTING_PACKAGE } from '@/lib/stripe'

interface MatchResult {
  id: string
  program: {
    id: string
    universityName: string
    programName: string
    country: string
    language: string
  }
  similarityScore: number
  preScore: number
  llmScore: number
  finalScore: number
  llmJson: {
    admission_probability: number
    strengths: string[]
    weaknesses: string[]
    expert_commentary: string
    city_insights: string
    tuition_info: string
    ranking: string
    tag: 'SAFE' | 'TARGET' | 'REACH'
  }
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [matchRun, setMatchRun] = useState<any>(null)
  const [hasEntitlement, setHasEntitlement] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc')
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    fetchResults()
  }, [params.id])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/match/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch results')
      
      const data = await response.json()
      setMatchRun(data.matchRun)
      setHasEntitlement(data.hasEntitlement)
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchRunId: params.id }),
      })

      if (!response.ok) throw new Error('Checkout failed')

      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout')
      setCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center">
        <div className="text-xl">Loading results...</div>
      </div>
    )
  }

  if (!matchRun) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center">
        <div className="text-xl">Results not found</div>
      </div>
    )
  }

  const results: MatchResult[] = matchRun.results
  const visibleCount = hasEntitlement ? results.length : 3
  const lockedCount = results.length - visibleCount

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    const aProb = a.llmJson?.admission_probability || 0
    const bProb = b.llmJson?.admission_probability || 0
    return sortBy === 'asc' ? aProb - bProb : bProb - aProb
  })

  const visibleResults = sortedResults.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  UNI<span className="text-yellow-400">WISE</span>
                </h1>
                <p className="text-sm text-gray-400">Your Match Results</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 glass rounded-lg hover:bg-white/10"
            >
              Dashboard
            </button>
          </div>

          <div className="glass-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {hasEntitlement ? '✅ Full Access Unlocked' : '🔒 Preview Mode'}
                </h2>
                <p className="text-gray-400">
                  {hasEntitlement
                    ? `Showing all ${results.length} matched programs`
                    : `Showing ${visibleCount} of ${results.length} programs`}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mr-2">Sort by probability:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc')}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="asc">Lowest to Highest</option>
                  <option value="desc">Highest to Lowest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Paywall Banner */}
        {!hasEntitlement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">🎯 Unlock All {results.length} Results</h3>
              <p className="text-lg mb-6">
                Get complete access to your personalized university matches with detailed analysis, admission probabilities, and expert insights.
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-200 line-through">
                    ${(CONSULTING_PACKAGE.listPrice / 100).toFixed(2)} USD
                  </div>
                  <div className="text-4xl font-bold">
                    ${(CONSULTING_PACKAGE.price / 100).toFixed(2)} USD
                  </div>
                </div>
                <div className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg">
                  {CONSULTING_PACKAGE.discount}% OFF
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 disabled:bg-gray-300 transition text-lg"
              >
                {checkingOut ? 'Processing...' : 'Unlock Full Results →'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Grid */}
        <div className="space-y-6">
          {visibleResults.map((result, idx) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-dark rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{result.program.programName}</h3>
                  <p className="text-gray-400">{result.program.universityName}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {result.program.country}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                      {result.program.language}
                    </span>
                    {result.llmJson?.tag && (
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          result.llmJson.tag === 'SAFE'
                            ? 'bg-green-500/20 text-green-400'
                            : result.llmJson.tag === 'TARGET'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {result.llmJson.tag}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-400">
                    {result.llmJson?.admission_probability || 0}%
                  </div>
                  <div className="text-sm text-gray-400">Admission Probability</div>
                </div>
              </div>

              {result.llmJson && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Expert Commentary</h4>
                    <p className="text-gray-400 text-sm">{result.llmJson.expert_commentary}</p>
                  </div>

                  {result.llmJson.strengths?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-green-400">Strengths</h4>
                      <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                        {result.llmJson.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.llmJson.weaknesses?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-red-400">Areas to Improve</h4>
                      <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                        {result.llmJson.weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="text-sm text-gray-400">Tuition</div>
                      <div className="font-semibold">{result.llmJson.tuition_info}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Ranking</div>
                      <div className="font-semibold">{result.llmJson.ranking}</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Locked Results Indicator */}
          {!hasEntitlement && lockedCount > 0 && (
            <div className="glass-dark rounded-xl p-12 text-center relative">
              <div className="absolute inset-0 backdrop-blur-sm bg-black/50 rounded-xl flex items-center justify-center">
                <div>
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-2xl font-bold mb-2">
                    {lockedCount} More Results Locked
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Unlock all results to see your complete matches
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 font-semibold"
                  >
                    Unlock Now →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
