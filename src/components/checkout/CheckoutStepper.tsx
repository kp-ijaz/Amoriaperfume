interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: 'Delivery' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Review' },
];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              style={{
                backgroundColor:
                  step.id < currentStep
                    ? 'var(--color-amoria-accent)'
                    : step.id === currentStep
                    ? 'var(--color-amoria-primary)'
                    : 'var(--color-amoria-border)',
                color:
                  step.id < currentStep
                    ? 'var(--color-amoria-primary)'
                    : step.id === currentStep
                    ? 'white'
                    : 'var(--color-amoria-text-muted)',
              }}
            >
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <p
              className="text-xs mt-1 font-medium"
              style={{
                color:
                  step.id === currentStep
                    ? 'var(--color-amoria-primary)'
                    : 'var(--color-amoria-text-muted)',
              }}
            >
              {step.label}
            </p>
          </div>
          {idx < steps.length - 1 && (
            <div
              className="w-20 sm:w-32 h-0.5 mx-2 mb-5"
              style={{
                backgroundColor:
                  step.id < currentStep
                    ? 'var(--color-amoria-accent)'
                    : 'var(--color-amoria-border)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
