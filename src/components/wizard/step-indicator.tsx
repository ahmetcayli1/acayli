'use client'

import { cn } from '@/lib/utils'
import { Check, Globe, User, GraduationCap, Settings, CheckCircle } from 'lucide-react'

const STEP_ICONS: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  CheckCircle: <CheckCircle className="w-4 h-4" />,
}

interface Step {
  id: number
  title: string
  icon: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isClickable = onStepClick && step.id <= currentStep

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  'relative flex flex-col items-center',
                  isClickable && 'cursor-pointer'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && 'bg-blue-500 text-white ring-4 ring-blue-500/30',
                    !isCompleted && !isCurrent && 'bg-white/10 text-white/50'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    STEP_ICONS[step.icon] || <span>{step.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'absolute -bottom-6 text-xs font-medium whitespace-nowrap',
                    isCurrent && 'text-blue-400',
                    isCompleted && 'text-green-400',
                    !isCompleted && !isCurrent && 'text-white/50'
                  )}
                >
                  {step.title}
                </span>
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      step.id < currentStep ? 'bg-green-500' : 'bg-white/10'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
