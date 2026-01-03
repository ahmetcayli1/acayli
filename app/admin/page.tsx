'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])

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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-2xl">
                👨‍💼
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome, {session.user.email}</p>
              </div>
            </div>
            <Link href="/">
              <button className="px-4 py-2 glass rounded-lg hover:bg-white/10">
                Back to Home
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/datasets">
            <div className="glass-dark rounded-xl p-6 hover:bg-white/5 cursor-pointer transition">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-xl font-semibold mb-1">Datasets</h3>
              <p className="text-sm text-gray-400">Manage program data</p>
            </div>
          </Link>

          <Link href="/admin/users">
            <div className="glass-dark rounded-xl p-6 hover:bg-white/5 cursor-pointer transition">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="text-xl font-semibold mb-1">Users</h3>
              <p className="text-sm text-gray-400">View all users</p>
            </div>
          </Link>

          <Link href="/admin/match-runs">
            <div className="glass-dark rounded-xl p-6 hover:bg-white/5 cursor-pointer transition">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-xl font-semibold mb-1">Match Runs</h3>
              <p className="text-sm text-gray-400">View matching results</p>
            </div>
          </Link>

          <Link href="/admin/purchases">
            <div className="glass-dark rounded-xl p-6 hover:bg-white/5 cursor-pointer transition">
              <div className="text-4xl mb-2">💳</div>
              <h3 className="text-xl font-semibold mb-1">Purchases</h3>
              <p className="text-sm text-gray-400">Transaction history</p>
            </div>
          </Link>
        </div>

        <div className="glass-dark rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-400">-</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">-</div>
              <div className="text-sm text-gray-400">Total Programs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">-</div>
              <div className="text-sm text-gray-400">Match Runs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">-</div>
              <div className="text-sm text-gray-400">Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
