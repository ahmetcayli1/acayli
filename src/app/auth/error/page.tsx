'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have access to this resource.',
    Verification: 'The verification link may have expired or already been used.',
    Default: 'An authentication error occurred.',
  }

  const message = errorMessages[error || 'Default'] || errorMessages.Default

  return (
    <div className="glass rounded-3xl p-8">
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-8 h-8 text-white" />
      </div>
      
      <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
      <p className="text-white/60 mb-8">{message}</p>

      <div className="flex flex-col gap-3">
        <Link href="/auth/signin">
          <Button variant="primary" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Sign In
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <Suspense fallback={
          <div className="glass rounded-3xl p-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl animate-pulse mx-auto mb-6" />
            <div className="h-8 bg-white/10 rounded animate-pulse mb-4" />
            <div className="h-4 bg-white/10 rounded animate-pulse mb-8" />
          </div>
        }>
          <ErrorContent />
        </Suspense>
      </motion.div>
    </main>
  )
}
