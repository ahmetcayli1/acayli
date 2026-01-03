'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-dark rounded-2xl p-12 text-center"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-6xl">
          ⚠️
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-gray-400 mb-8">
          Your payment was cancelled. You can try again anytime to unlock your full results.
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold transition"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  )
}
