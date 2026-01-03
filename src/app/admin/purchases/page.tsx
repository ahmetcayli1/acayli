'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { formatDate, formatCurrency } from '@/lib/utils'

interface Purchase {
  id: string
  amount: number
  currency: string
  status: string
  stripeSessionId: string
  stripePaymentId: string | null
  createdAt: string
  user: {
    email: string
  }
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const res = await fetch('/api/admin/purchases')
      const data = await res.json()
      if (data.success) {
        setPurchases(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
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
      case 'REFUNDED':
        return <RefreshCw className="w-4 h-4 text-yellow-400" />
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
      case 'REFUNDED':
        return 'warning'
      default:
        return 'default'
    }
  }

  const totalRevenue = purchases
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading text="Loading purchases..." />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Purchases</h1>
        <p className="text-white/60">
          View all payment transactions and entitlements
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-8 bg-gradient-to-br from-green-500/10 to-emerald-600/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Revenue</p>
              <p className="text-4xl font-bold text-green-400">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Completed Purchases</p>
              <p className="text-2xl font-bold text-white">
                {purchases.filter(p => p.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases List */}
      <div className="space-y-4">
        {purchases.map((purchase, index) => (
          <motion.div
            key={purchase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      purchase.status === 'COMPLETED'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}>
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{purchase.user.email}</p>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <span>{formatDate(purchase.createdAt)}</span>
                        <span>•</span>
                        <span>ID: {purchase.stripeSessionId.slice(0, 12)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        purchase.status === 'COMPLETED' ? 'text-green-400' : 'text-white/50'
                      }`}>
                        {formatCurrency(purchase.amount, purchase.currency.toUpperCase())}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(purchase.status)}
                      <Badge variant={getStatusVariant(purchase.status)}>
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {purchases.length === 0 && (
          <div className="text-center py-12 text-white/50">
            No purchases found
          </div>
        )}
      </div>
    </div>
  )
}
