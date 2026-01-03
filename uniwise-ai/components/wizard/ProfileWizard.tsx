'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { COUNTRIES } from '@/config/constants'

interface ProfileWizardProps {
  mode: 'BACHELOR' | 'MASTER'
}

export default function ProfileWizard({ mode }: ProfileWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    mode,
    personalJson: {},
    educationJson: {},
    testsJson: {},
    languagesJson: {},
    experiencesJson: [],
    projectsJson: [],
    goalsJson: {},
    prefsJson: {},
  })
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const steps = [
    'Personal Info',
    'Education',
    'Tests & Language',
    'Experience',
    'Projects & Awards',
    'Goals & Motivation',
    'Preferences',
    'Country Selection',
  ]

  const saveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      const data = await response.json()
      return data.profile
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    await saveProfile()
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    const profile = await saveProfile()
    if (profile && selectedCountries.length > 0) {
      router.push(`/match?profileId=${profile.id}&countries=${selectedCountries.join(',')}`)
    }
  }

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                UNI<span className="text-yellow-400">WISE</span>
              </h1>
              <p className="text-sm text-gray-400">
                {mode === 'BACHELOR' ? "Bachelor's" : "Master's"} Program Analysis
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                  idx === currentStep
                    ? 'bg-blue-600'
                    : idx < currentStep
                    ? 'bg-green-600/50'
                    : 'bg-white/10'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-dark rounded-2xl p-8 mb-6"
          >
            {currentStep === 0 && <PersonalInfoStep data={formData.personalJson} onChange={(data) => updateFormData('personalJson', data)} />}
            {currentStep === 1 && <EducationStep mode={mode} data={formData.educationJson} onChange={(data) => updateFormData('educationJson', data)} />}
            {currentStep === 2 && <TestsStep mode={mode} data={formData.testsJson} onChange={(data) => updateFormData('testsJson', data)} />}
            {currentStep === 3 && <ExperienceStep data={formData.experiencesJson} onChange={(data) => updateFormData('experiencesJson', data)} />}
            {currentStep === 4 && <ProjectsStep data={formData.projectsJson} onChange={(data) => updateFormData('projectsJson', data)} />}
            {currentStep === 5 && <GoalsStep data={formData.goalsJson} onChange={(data) => updateFormData('goalsJson', data)} />}
            {currentStep === 6 && <PreferencesStep data={formData.prefsJson} onChange={(data) => updateFormData('prefsJson', data)} />}
            {currentStep === 7 && (
              <CountrySelectionStep
                selectedCountries={selectedCountries}
                onChange={setSelectedCountries}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 glass rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Back
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 transition"
            >
              {saving ? 'Saving...' : 'Next →'}
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving || selectedCountries.length === 0}
              className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition"
            >
              {saving ? 'Saving...' : 'Start Matching →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Step Components
function PersonalInfoStep({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Name *</label>
          <input
            type="text"
            value={data.firstName || ''}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name *</label>
          <input
            type="text"
            value={data.lastName || ''}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Birth Year</label>
          <input
            type="number"
            value={data.birthYear || ''}
            onChange={(e) => onChange({ ...data, birthYear: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="1995"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Citizenship</label>
        <input
          type="text"
          value={data.citizenship || ''}
          onChange={(e) => onChange({ ...data, citizenship: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Country"
        />
      </div>
    </div>
  )
}

function EducationStep({ mode, data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Education Background</h2>
      
      {mode === 'BACHELOR' ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">High School Name *</label>
            <input
              type="text"
              value={data.schoolName || ''}
              onChange={(e) => onChange({ ...data, schoolName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Graduation Year</label>
              <input
                type="number"
                value={data.graduationYear || ''}
                onChange={(e) => onChange({ ...data, graduationYear: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="2023"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GPA / Score</label>
              <input
                type="text"
                value={data.gpa || ''}
                onChange={(e) => onChange({ ...data, gpa: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="3.8 / 95"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">University Name *</label>
            <input
              type="text"
              value={data.universityName || ''}
              onChange={(e) => onChange({ ...data, universityName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Major / Department</label>
            <input
              type="text"
              value={data.major || ''}
              onChange={(e) => onChange({ ...data, major: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Computer Science"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Year</label>
              <input
                type="number"
                value={data.startYear || ''}
                onChange={(e) => onChange({ ...data, startYear: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="2019"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Year</label>
              <input
                type="number"
                value={data.endYear || ''}
                onChange={(e) => onChange({ ...data, endYear: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="2023"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GPA (4.0 scale)</label>
              <input
                type="text"
                value={data.gpa || ''}
                onChange={(e) => onChange({ ...data, gpa: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="3.75"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function TestsStep({ mode, data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Test Scores</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">TOEFL</label>
          <input
            type="number"
            value={data.toefl || ''}
            onChange={(e) => onChange({ ...data, toefl: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="0-120"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">IELTS</label>
          <input
            type="number"
            step="0.5"
            value={data.ielts || ''}
            onChange={(e) => onChange({ ...data, ielts: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="0.0-9.0"
          />
        </div>
      </div>

      {mode === 'MASTER' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">GRE</label>
            <input
              type="number"
              value={data.gre || ''}
              onChange={(e) => onChange({ ...data, gre: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="260-340"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GMAT</label>
            <input
              type="number"
              value={data.gmat || ''}
              onChange={(e) => onChange({ ...data, gmat: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="200-800"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">SAT</label>
            <input
              type="number"
              value={data.sat || ''}
              onChange={(e) => onChange({ ...data, sat: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="400-1600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">ACT</label>
            <input
              type="number"
              value={data.act || ''}
              onChange={(e) => onChange({ ...data, act: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="1-36"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ExperienceStep({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
      <textarea
        value={data[0]?.description || ''}
        onChange={(e) => onChange([{ description: e.target.value, duration: 1 }])}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 h-32"
        placeholder="Describe your internships, jobs, and relevant experience..."
      />
    </div>
  )
}

function ProjectsStep({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Projects & Awards</h2>
      <textarea
        value={data[0]?.description || ''}
        onChange={(e) => onChange([{ description: e.target.value }])}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 h-32"
        placeholder="Describe your projects, publications, awards, and achievements..."
      />
    </div>
  )
}

function GoalsStep({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Goals & Motivation</h2>
      
      <div>
        <label className="block text-sm font-medium mb-2">Target Field(s)</label>
        <input
          type="text"
          value={data.targetFields?.join(', ') || ''}
          onChange={(e) => onChange({ ...data, targetFields: e.target.value.split(',').map((s: string) => s.trim()) })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Computer Science, Data Science, AI"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Motivation</label>
        <textarea
          value={data.motivation || ''}
          onChange={(e) => onChange({ ...data, motivation: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 h-32"
          placeholder="Why do you want to pursue this degree? What are your career goals?"
        />
      </div>
    </div>
  )
}

function PreferencesStep({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Preferences</h2>
      
      <div>
        <label className="block text-sm font-medium mb-2">Preferred Program Languages</label>
        <div className="grid grid-cols-3 gap-3">
          {['EN', 'DE', 'IT', 'PL', 'FR', 'ES'].map(lang => (
            <label key={lang} className="flex items-center gap-2 px-4 py-3 glass rounded-lg cursor-pointer hover:bg-white/10">
              <input
                type="checkbox"
                checked={data.languages?.includes(lang) || false}
                onChange={(e) => {
                  const languages = data.languages || []
                  if (e.target.checked) {
                    onChange({ ...data, languages: [...languages, lang] })
                  } else {
                    onChange({ ...data, languages: languages.filter((l: string) => l !== lang) })
                  }
                }}
                className="w-4 h-4"
              />
              <span>{lang}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Number of Results (10-50)</label>
        <input
          type="number"
          min="10"
          max="50"
          value={data.resultCount || 20}
          onChange={(e) => onChange({ ...data, resultCount: parseInt(e.target.value) })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Annual Budget (USD)</label>
        <input
          type="text"
          value={data.budget || ''}
          onChange={(e) => onChange({ ...data, budget: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="10,000 - 30,000"
        />
      </div>
    </div>
  )
}

function CountrySelectionStep({ selectedCountries, onChange }: any) {
  const mvpCountries = COUNTRIES.filter(c => ['DE', 'IT', 'PL'].includes(c.code))
  const otherCountries = COUNTRIES.filter(c => !['DE', 'IT', 'PL'].includes(c.code))

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      onChange(selectedCountries.filter((c: string) => c !== code))
    } else {
      onChange([...selectedCountries, code])
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Choose Your Destinations</h2>
      <p className="text-gray-400 mb-6">
        Select one or more countries where you'd like to pursue your degree. You can select multiple countries for better matching.
      </p>

      <div>
        <h3 className="text-lg font-semibold mb-4">🌟 Featured Countries (MVP)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mvpCountries.map(country => (
            <button
              key={country.code}
              onClick={() => toggleCountry(country.code)}
              className={`p-6 rounded-xl border-2 transition ${
                selectedCountries.includes(country.code)
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/10 glass hover:border-white/30'
              }`}
            >
              <div className="text-4xl mb-2">{country.flag}</div>
              <div className="font-semibold text-lg">{country.name}</div>
              <div className="text-sm text-gray-400 mt-1">{country.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">🌍 Additional Countries (Coming Soon)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {otherCountries.map(country => (
            <div
              key={country.code}
              className="p-4 rounded-lg glass opacity-50 cursor-not-allowed text-center"
            >
              <div className="text-2xl mb-1">{country.flag}</div>
              <div className="text-xs">{country.name}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedCountries.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
          <p className="text-green-400">
            ✓ {selectedCountries.length} {selectedCountries.length === 1 ? 'country' : 'countries'} selected
          </p>
        </div>
      )}
    </div>
  )
}
