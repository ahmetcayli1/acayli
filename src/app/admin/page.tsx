'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, Users, BarChart3, CreditCard, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'

interface DashboardStats {
  totalPrograms: number
  totalUsers: number
  totalMatchRuns: number
  totalPurchases: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading text="Loading dashboard..." />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Programs',
      value: stats?.totalPrograms || 0,
      icon: Database,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-blue-600/20',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-green-600/20',
    },
    {
      title: 'Match Runs',
      value: stats?.totalMatchRuns || 0,
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-purple-600/20',
    },
    {
      title: 'Purchases',
      value: stats?.totalPurchases || 0,
      icon: CreditCard,
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500/20 to-yellow-600/20',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Overview of your UNIWISE AI platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${stat.bgColor}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-400">
              ${((stats?.revenue || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-white/50 text-sm mt-2">
              From {stats?.totalPurchases || 0} completed purchases
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
