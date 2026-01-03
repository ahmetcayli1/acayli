'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminMatchRunsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [matchRuns, setMatchRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else {
      fetchMatchRuns()
    }
  }, [status, session, router])

  const fetchMatchRuns = async () => {
    try {
      const response = await fetch('/api/admin/match-runs')
      if (response.ok) {
        const data = await response.json()
        setMatchRuns(data.matchRuns)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || !session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Match Runs</h1>
            <p className="text-gray-400">{matchRuns.length} total match runs</p>
          </div>
          <Link href="/admin">
            <button className="px-4 py-2 glass rounded-lg hover:bg-white/10">
              ← Back to Admin
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="glass-dark rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Mode</th>
                    <th className="text-left p-4">Countries</th>
                    <th className="text-left p-4">Results</th>
                    <th className="text-left p-4">Created</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {matchRuns.map((run) => (
                    <tr key={run.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-sm">{run.user.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400">
                          {run.profile.mode}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{run.selectedCountries.join(', ')}</td>
                      <td className="p-4">{run._count.results}</td>
                      <td className="p-4 text-sm text-gray-400">
                        {new Date(run.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/match-runs/${run.id}`}>
                          <button className="px-3 py-1 text-xs bg-blue-600 rounded hover:bg-blue-700">
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
