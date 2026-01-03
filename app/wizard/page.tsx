'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProfileWizard from '@/components/wizard/ProfileWizard'

function WizardContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') as 'BACHELOR' | 'MASTER' | null

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please select a degree level</h2>
          <div className="flex gap-4">
            <a href="/wizard?mode=bachelor" className="px-6 py-3 bg-teal-600 rounded-lg hover:bg-teal-700 transition">
              Bachelor's Program
            </a>
            <a href="/wizard?mode=master" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              Master's Program
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <ProfileWizard mode={mode} />
}

export default function WizardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <WizardContent />
    </Suspense>
  )
}
