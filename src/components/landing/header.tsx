'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, UserPlus, LogOut, Settings, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Globe className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">UNIWISE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {/* Language Selector */}
              <button className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white transition-colors">
                <span className="text-lg">🇬🇧</span>
                <span className="text-sm">English</span>
              </button>

              {status === 'loading' ? (
                <div className="w-24 h-10 bg-white/10 animate-pulse rounded-xl" />
              ) : session ? (
                <div className="flex items-center gap-3">
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
                        Admin
                      </Button>
                    </Link>
                  )}
                  <span className="text-white/70 text-sm">{session.user.email}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass-dark mt-1 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {status === 'loading' ? (
                <div className="w-full h-10 bg-white/10 animate-pulse rounded-xl" />
              ) : session ? (
                <>
                  <p className="text-white/70 text-sm px-3">{session.user.email}</p>
                  {session.user.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      className="block w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin" 
                    className="block w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" size="sm" className="w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
