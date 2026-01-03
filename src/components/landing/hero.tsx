'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Globe, GraduationCap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="relative w-24 h-24 glass rounded-2xl p-2 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="UNIWISE AI Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gradient">
            UNIWISE
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Globe className="w-6 h-6 text-blue-400" />
          <p className="text-xl text-white/80 italic">
            Advanced Academic Matching Algorithm
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/match/master">
            <Button 
              variant="primary" 
              size="lg"
              leftIcon={<Globe className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Master&apos;s Program Analysis
            </Button>
          </Link>
          <Link href="/match/bachelor">
            <Button 
              variant="secondary" 
              size="lg"
              leftIcon={<GraduationCap className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Bachelor&apos;s Program Analysis
            </Button>
          </Link>
        </motion.div>

        {/* Partner stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <p className="text-white/80">
            Connect with <span className="text-cyan-400 font-bold">7200+</span> Partner Universities Worldwide
          </p>
        </motion.div>

        {/* AI Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass rounded-3xl p-8 max-w-2xl mx-auto mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Your Perfect University Match, Powered by AI
          </h2>
          <p className="text-white/70 leading-relaxed">
            Upload your CV and transcript, tell us your preferences, and let our AI analyze 
            thousands of programs to find your ideal universities. Get personalized match 
            scores, admission probabilities, and expert insights in minutes.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '7200+', label: 'Partner Universities', icon: '🏛️' },
            { value: '25,000+', label: 'Academic Programs', icon: '📚' },
            { value: '50+', label: 'Countries Analyzed', icon: '🌍' },
            { value: '95.7%', label: 'Matching Accuracy', icon: '📊' },
          ].map((stat, index) => (
            <div key={index} className="glass rounded-xl p-6 text-center">
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-2xl font-bold text-cyan-400 mb-1">{stat.value}</p>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
