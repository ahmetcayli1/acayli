'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

function MatchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profileId = searchParams.get('profileId')
  const countries = searchParams.get('countries')?.split(',') || []
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (profileId && countries.length > 0) {
      runMatching()
    }
  }, [profileId, countries])

  const runMatching = async () => {
    setRunning(true)
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90))
    }, 1000)

    try {
      const response = await fetch('/api/match/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          selectedCountries: countries,
          selectedLanguages: ['EN'],
          requestedCount: 20,
        }),
      })

      clearInterval(interval)

      if (!response.ok) {
        throw new Error('Matching failed')
      }

      const data = await response.json()
      setProgress(100)
      
      setTimeout(() => {
        router.push(`/results/${data.matchRun.id}`)
      }, 1000)
    } catch (error) {
      clearInterval(interval)
      console.error('Matching error:', error)
      alert('Matching failed. Please try again.')
      setRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="glass-dark rounded-2xl p-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-5xl animate-pulse">
            🎯
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Running AI Matching Pipeline</h1>
          <p className="text-gray-400 mb-8">
            Our AI is analyzing thousands of programs to find your perfect matches...
          </p>

          <div className="mb-6">
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{progress}% Complete</p>
          </div>

          <div className="space-y-2 text-sm text-gray-400 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress >= 20 ? 'bg-green-500' : 'bg-white/20'}`} />
              <span>Filtering by country and degree level...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress >= 40 ? 'bg-green-500' : 'bg-white/20'}`} />
              <span>Filtering by language preferences...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress >= 60 ? 'bg-green-500' : 'bg-white/20'}`} />
              <span>Calculating semantic similarity...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress >= 80 ? 'bg-green-500' : 'bg-white/20'}`} />
              <span>Running AI evaluation...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-white/20'}`} />
              <span>Finalizing results...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MatchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
      <MatchContent />
    </Suspense>
  )
}
