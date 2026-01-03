'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import landingImages from '@/config/landing_images.json'

export default function HomePage() {
  const leftImages = landingImages.slice(0, 6)
  const rightImages = landingImages.slice(6, 12)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629]">
      {/* Animated Background Images - Left Side */}
      <div className="absolute left-0 top-0 h-full w-32 overflow-hidden opacity-30">
        <motion.div
          className="flex flex-col gap-4"
          animate={{
            y: [0, -1000],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...leftImages, ...leftImages].map((img, idx) => (
            <div key={idx} className="w-32 h-48 rounded-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Animated Background Images - Right Side */}
      <div className="absolute right-0 top-0 h-full w-32 overflow-hidden opacity-30">
        <motion.div
          className="flex flex-col gap-4"
          animate={{
            y: [-1000, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...rightImages, ...rightImages].map((img, idx) => (
            <div key={idx} className="w-32 h-48 rounded-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-3xl">
              🎓
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                UNI<span className="text-yellow-400">WISE</span>
              </h1>
              <p className="text-xs text-gray-400">Advanced Academic Matching Algorithm</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <button className="px-6 py-2 glass rounded-lg hover:bg-white/10 transition">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Your Perfect University Match,
                <br />
                Powered by AI
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Upload your CV and transcript, tell us your preferences, and let our AI analyze
                thousands of programs to find your ideal universities. Get personalized match
                scores, admission probabilities, and expert insights in minutes.
              </p>

              <div className="glass-dark rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    ✨
                  </div>
                  <h3 className="text-2xl font-semibold">Connect with 7200+ Partner Universities Worldwide</h3>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/wizard?mode=master">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition flex items-center gap-3"
                  >
                    🎯 Master's Program Analysis
                  </motion.button>
                </Link>
                <Link href="/wizard?mode=bachelor">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-teal-500/50 transition flex items-center gap-3"
                  >
                    🎓 Bachelor's Program Analysis
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="glass-dark rounded-xl p-6">
                  <div className="text-4xl font-bold text-blue-400">7200+</div>
                  <div className="text-sm text-gray-400 mt-2">Partner Universities</div>
                </div>
                <div className="glass-dark rounded-xl p-6">
                  <div className="text-4xl font-bold text-purple-400">25,000+</div>
                  <div className="text-sm text-gray-400 mt-2">Academic Programs</div>
                </div>
                <div className="glass-dark rounded-xl p-6">
                  <div className="text-4xl font-bold text-pink-400">50+</div>
                  <div className="text-sm text-gray-400 mt-2">Countries Analyzed</div>
                </div>
                <div className="glass-dark rounded-xl p-6">
                  <div className="text-4xl font-bold text-teal-400">95.7%</div>
                  <div className="text-sm text-gray-400 mt-2">Matching Accuracy</div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-gray-500">
          <p>© 2026 UNIWISE AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
