'use client';

import { ChevronLeft } from 'lucide-react';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

export function QuizProgress({ currentStep, totalSteps, onBack }: QuizProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {currentStep > 1 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm hover:opacity-80"
            style={{ color: 'var(--color-amoria-accent)' }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
        ) : (
          <div />
        )}
        <span className="text-sm" style={{ color: 'var(--color-amoria-text-light, #A89880)' }}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: 'var(--color-amoria-accent)' }}
        />
      </div>
    </div>
  );
}
