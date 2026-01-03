'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'
import type { Country } from '@/types'

interface CountryCardProps {
  country: Country
  selected: boolean
  onSelect: () => void
}

export function CountryCard({ country, selected, onSelect }: CountryCardProps) {
  return (
    <motion.button
      whileHover={{ scale: country.available ? 1.02 : 1 }}
      whileTap={{ scale: country.available ? 0.98 : 1 }}
      onClick={country.available ? onSelect : undefined}
      disabled={!country.available}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 w-full',
        'bg-gradient-to-br',
        country.gradient,
        selected && 'ring-4 ring-blue-500 ring-offset-2 ring-offset-slate-900',
        country.available 
          ? 'cursor-pointer hover:shadow-xl' 
          : 'opacity-50 cursor-not-allowed grayscale'
      )}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Soon badge */}
      {!country.available && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-yellow-500/90 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold">
          <Lock className="w-3 h-3" />
          Soon
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <p className="text-3xl font-bold text-white mb-1">{country.code}</p>
        <h3 className="text-lg font-semibold text-white mb-2">{country.name}</h3>
        <p className="text-sm text-white/60">{country.code}</p>
        <p className="text-xs text-white/70 mt-3">{country.description}</p>
      </div>

      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}
