'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Globe, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepIndicator } from '@/components/wizard/step-indicator'
import { CountryCard } from '@/components/wizard/country-card'
import { Header } from '@/components/landing/header'
import { COUNTRIES, WIZARD_STEPS, LANGUAGES, RESULTS_LIMITS } from '@/lib/constants'
import { ProfileData, DegreeLevel } from '@/types'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

type WizardMode = 'master' | 'bachelor'

export default function MatchWizardPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const mode = params.mode as WizardMode

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [profile, setProfile] = useState<Partial<ProfileData>>({
    mode: mode.toUpperCase() as DegreeLevel,
    selectedCountries: [],
    selectedLanguages: ['EN'],
    requestedCount: RESULTS_LIMITS.defaultCount,
    personal: {
      firstName: '',
      lastName: '',
      birthYear: 2000,
      citizenship: '',
      residence: '',
      email: session?.user?.email || '',
      phone: '',
    },
    goals: {
      targetFields: [],
      motivation: '',
    },
    preferences: {
      budgetMin: 0,
      budgetMax: 50000,
      needsScholarship: false,
      programLanguages: ['EN'],
      resultCount: RESULTS_LIMITS.defaultCount,
    },
  })

  // Validate mode
  useEffect(() => {
    if (mode !== 'master' && mode !== 'bachelor') {
      router.push('/')
    }
  }, [mode, router])

  // Update email from session
  useEffect(() => {
    if (session?.user?.email && !profile.personal?.email) {
      setProfile(prev => ({
        ...prev,
        personal: {
          ...prev.personal!,
          email: session.user.email,
        },
      }))
    }
  }, [session, profile.personal?.email])

  const degreeLabel = mode === 'master' ? 'Master\'s' : 'Bachelor\'s'

  const toggleCountry = (countryId: string) => {
    setProfile(prev => {
      const selected = prev.selectedCountries || []
      if (selected.includes(countryId)) {
        return { ...prev, selectedCountries: selected.filter(c => c !== countryId) }
      }
      return { ...prev, selectedCountries: [...selected, countryId] }
    })
  }

  const toggleLanguage = (langId: string) => {
    setProfile(prev => {
      const selected = prev.selectedLanguages || []
      if (selected.includes(langId)) {
        if (selected.length === 1) return prev // Must have at least one
        return { ...prev, selectedLanguages: selected.filter(l => l !== langId) }
      }
      return { ...prev, selectedLanguages: [...selected, langId] }
    })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (profile.selectedCountries?.length || 0) > 0
      case 2:
        return profile.personal?.firstName && profile.personal?.lastName && profile.personal?.email
      case 3:
        return true // Academic scores are optional for now
      case 4:
        return (profile.selectedLanguages?.length || 0) > 0
      case 5:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Save profile first
      const profileRes = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (!profileRes.ok) {
        throw new Error('Failed to save profile')
      }

      const { data: savedProfile } = await profileRes.json()

      // Start matching
      const matchRes = await fetch('/api/match/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: savedProfile.id,
          selectedCountries: profile.selectedCountries,
          selectedLanguages: profile.selectedLanguages,
          requestedCount: profile.requestedCount,
        }),
      })

      if (!matchRes.ok) {
        throw new Error('Failed to start matching')
      }

      const { data: matchRun } = await matchRes.json()
      router.push(`/results/${matchRun.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Choose Your Destinations
            </h2>
            <p className="text-white/60 text-center mb-8">
              Select one or more countries where you&apos;d like to pursue your {degreeLabel.toLowerCase()} degree
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COUNTRIES.map(country => (
                <CountryCard
                  key={country.id}
                  country={country}
                  selected={profile.selectedCountries?.includes(country.id) || false}
                  onSelect={() => toggleCountry(country.id)}
                />
              ))}
            </div>
            {profile.selectedCountries && profile.selectedCountries.length > 0 && (
              <div className="mt-6 p-4 glass rounded-xl">
                <p className="text-sm text-white/60">
                  Selected Countries ({profile.selectedCountries.length}):
                </p>
                <p className="text-white font-medium">
                  {profile.selectedCountries
                    .map(id => COUNTRIES.find(c => c.id === id)?.name)
                    .join(', ')}
                </p>
              </div>
            )}
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Personal Profile
            </h2>
            <p className="text-white/60 text-center mb-8">
              Tell us about yourself
            </p>
            <div className="glass rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={profile.personal?.firstName || ''}
                  onChange={e => setProfile(prev => ({
                    ...prev,
                    personal: { ...prev.personal!, firstName: e.target.value }
                  }))}
                  required
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  value={profile.personal?.lastName || ''}
                  onChange={e => setProfile(prev => ({
                    ...prev,
                    personal: { ...prev.personal!, lastName: e.target.value }
                  }))}
                  required
                  placeholder="Doe"
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={profile.personal?.email || ''}
                onChange={e => setProfile(prev => ({
                  ...prev,
                  personal: { ...prev.personal!, email: e.target.value }
                }))}
                required
                placeholder="john@example.com"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Citizenship"
                  value={profile.personal?.citizenship || ''}
                  onChange={e => setProfile(prev => ({
                    ...prev,
                    personal: { ...prev.personal!, citizenship: e.target.value }
                  }))}
                  placeholder="Turkey"
                />
                <Input
                  label="Country of Residence"
                  value={profile.personal?.residence || ''}
                  onChange={e => setProfile(prev => ({
                    ...prev,
                    personal: { ...prev.personal!, residence: e.target.value }
                  }))}
                  placeholder="Turkey"
                />
              </div>
              <Input
                label="Phone (Optional)"
                type="tel"
                value={profile.personal?.phone || ''}
                onChange={e => setProfile(prev => ({
                  ...prev,
                  personal: { ...prev.personal!, phone: e.target.value }
                }))}
                placeholder="+90 555 123 4567"
              />
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Academic Scores
            </h2>
            <p className="text-white/60 text-center mb-8">
              Share your academic achievements (optional for now)
            </p>
            <div className="glass rounded-2xl p-6 space-y-6">
              <p className="text-white/60 text-center py-12">
                📚 Academic score input will be expanded in the full version.
                <br />
                For now, you can proceed to the next step.
              </p>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Preferences
            </h2>
            <p className="text-white/60 text-center mb-8">
              Set your matching preferences
            </p>
            <div className="glass rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Program Language(s) <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => toggleLanguage(lang.id)}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        profile.selectedLanguages?.includes(lang.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Number of Results: {profile.requestedCount}
                </label>
                <input
                  type="range"
                  min={RESULTS_LIMITS.minCount}
                  max={RESULTS_LIMITS.maxCount}
                  value={profile.requestedCount}
                  onChange={e => setProfile(prev => ({
                    ...prev,
                    requestedCount: parseInt(e.target.value),
                  }))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>{RESULTS_LIMITS.minCount}</span>
                  <span>{RESULTS_LIMITS.maxCount}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Review & Submit
            </h2>
            <p className="text-white/60 text-center mb-8">
              Review your profile before matching
            </p>
            <div className="glass rounded-2xl p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Degree Level</span>
                  <span className="text-white font-medium">{degreeLabel}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Selected Countries</span>
                  <span className="text-white font-medium">
                    {profile.selectedCountries
                      ?.map(id => COUNTRIES.find(c => c.id === id)?.name)
                      .join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Program Languages</span>
                  <span className="text-white font-medium">
                    {profile.selectedLanguages
                      ?.map(id => LANGUAGES.find(l => l.id === id)?.name)
                      .join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Name</span>
                  <span className="text-white font-medium">
                    {profile.personal?.firstName} {profile.personal?.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Email</span>
                  <span className="text-white font-medium">{profile.personal?.email}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white/60">Requested Results</span>
                  <span className="text-white font-medium">{profile.requestedCount}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">
              {degreeLabel} Program Analysis Engine
            </h1>
          </div>
          <p className="text-yellow-400 text-sm">
            🎓 Login to save and auto-fill your profile next time!
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-16">
          <StepIndicator
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onStepClick={step => step < currentStep && setCurrentStep(step)}
          />
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-6 flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl p-4"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentStep < WIZARD_STEPS.length ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed()}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Matching
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
