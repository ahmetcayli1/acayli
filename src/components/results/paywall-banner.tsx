'use client'

import { motion } from 'framer-motion'
import { Lock, Sparkles, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PRICING } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

interface PaywallBannerProps {
  lockedCount: number
  onUnlock: () => void
  isLoading?: boolean
}

export function PaywallBanner({ lockedCount, onUnlock, isLoading }: PaywallBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-8 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Lock className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Unlock All {lockedCount} Remaining Results
      </h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Get full access to your personalized university matches, including detailed analysis, 
        admission probabilities, and expert recommendations.
      </p>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-2xl text-white/40 line-through">
            {formatCurrency(PRICING.listPrice)}
          </span>
          <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold">
            {PRICING.discountPercent}% OFF
          </span>
        </div>
        <p className="text-4xl font-bold text-gradient-gold">
          {formatCurrency(PRICING.finalPrice)}
        </p>
        <p className="text-white/50 text-sm mt-1">One-time payment</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-lg mx-auto text-left">
        {[
          'Full match analysis for all programs',
          'Detailed admission probability scores',
          'Expert commentary and insights',
          'Tuition and scholarship information',
          'Personalized recommendations',
          'Priority email support',
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-white/80 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        onClick={onUnlock}
        isLoading={isLoading}
        leftIcon={<Sparkles className="w-5 h-5" />}
        rightIcon={<ArrowRight className="w-5 h-5" />}
        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400"
      >
        Unlock All Results - {formatCurrency(PRICING.finalPrice)}
      </Button>

      <p className="text-white/40 text-xs mt-4">
        🔒 Secure payment powered by Stripe
      </p>
    </motion.div>
  )
}
