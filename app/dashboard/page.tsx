'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  UNI<span className="text-yellow-400">WISE</span>
                </h1>
                <p className="text-sm text-gray-400">Welcome, {session.user.email}</p>
              </div>
            </div>
            <div className="flex gap-4">
              {session.user.role === 'ADMIN' && (
                <Link href="/admin">
                  <button className="px-4 py-2 glass rounded-lg hover:bg-white/10">
                    Admin Panel
                  </button>
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 glass rounded-lg hover:bg-white/10"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/wizard?mode=bachelor">
            <div className="glass-dark rounded-xl p-8 hover:bg-white/5 cursor-pointer transition">
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold mb-2">Bachelor's Program</h2>
              <p className="text-gray-400">
                Start your undergraduate journey with AI-powered university matching
              </p>
            </div>
          </Link>

          <Link href="/wizard?mode=master">
            <div className="glass-dark rounded-xl p-8 hover:bg-white/5 cursor-pointer transition">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-2">Master's Program</h2>
              <p className="text-gray-400">
                Find the perfect graduate program tailored to your profile
              </p>
            </div>
          </Link>
        </div>

        <div className="glass-dark rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
                1️⃣
              </div>
              <h3 className="font-semibold mb-2">Choose Your Path</h3>
              <p className="text-sm text-gray-400">
                Select Bachelor or Master's program
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
                2️⃣
              </div>
              <h3 className="font-semibold mb-2">Build Your Profile</h3>
              <p className="text-sm text-gray-400">
                Complete our 8-step wizard
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
                3️⃣
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-400">
                Our AI matches you with programs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
                4️⃣
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-sm text-gray-400">
                View personalized recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
