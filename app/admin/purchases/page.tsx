'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPurchasesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else {
      fetchPurchases()
    }
  }, [status, session, router])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/admin/purchases')
      if (response.ok) {
        const data = await response.json()
        setPurchases(data.purchases)
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

  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Purchases</h1>
            <p className="text-gray-400">
              {purchases.length} transactions · ${(totalRevenue / 100).toFixed(2)} total revenue
            </p>
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
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Currency</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Stripe Session</th>
                    <th className="text-left p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-sm">{purchase.user.email}</td>
                      <td className="p-4 font-semibold">
                        ${(purchase.amount / 100).toFixed(2)}
                      </td>
                      <td className="p-4 text-sm uppercase">{purchase.currency}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          purchase.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {purchase.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-400 font-mono">
                        {purchase.stripeSessionId.substring(0, 20)}...
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {new Date(purchase.createdAt).toLocaleString()}
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
