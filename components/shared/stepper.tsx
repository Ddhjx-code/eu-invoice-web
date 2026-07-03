'use client'

interface Step {
  title: string
  description: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center w-full text-sm">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <li
              key={step.title}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <button
                type="button"
                onClick={() => isCompleted && onStepClick(index)}
                disabled={!isCompleted}
                className={`flex items-center gap-2 ${isCompleted ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0 ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span className="hidden sm:block">
                  <span
                    className={`block font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {step.title}
                  </span>
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${isCompleted ? 'bg-primary/40' : 'bg-border'}`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
