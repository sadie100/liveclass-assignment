import { cn } from '@/lib/utils'

interface StepperProps {
  currentStep: number
  steps: string[]
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="진행 단계">
      {steps.map((label, index) => {
        const step = index + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border text-sm font-medium tabular-nums',
                  isActive && 'border-primary bg-primary text-primary-foreground',
                  isCompleted && 'border-primary bg-primary/10 text-primary',
                  !isActive && !isCompleted && 'border-border bg-background text-muted-foreground',
                )}
              >
                {step}
              </span>
              <span
                className={cn(
                  'hidden text-sm sm:inline',
                  isActive ? 'text-foreground font-medium' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {step < steps.length && <span aria-hidden className="bg-border h-px w-6 sm:w-12" />}
          </li>
        )
      })}
    </ol>
  )
}
