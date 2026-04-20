'use client';

import { useState } from 'react';
import { quizQuestions } from '@/lib/data/quiz';
import { QuizProgress } from '@/components/fragrance-finder/QuizProgress';
import { QuizStep } from '@/components/fragrance-finder/QuizStep';
import { QuizResults } from '@/components/fragrance-finder/QuizResults';
import { AnimatePresence } from 'framer-motion';

export default function FragranceFinderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions.find((q) => q.id === currentStep);

  function handleSelect(optionId: string) {
    const newAnswers = { ...answers, [currentStep]: optionId };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentStep < quizQuestions.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowResults(true);
      }
    }, 300);
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }

  function handleRetake() {
    setAnswers({});
    setCurrentStep(1);
    setShowResults(false);
  }

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{ backgroundColor: 'var(--color-amoria-primary)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--color-amoria-accent)' }}>
            Fragrance Finder
          </p>
          <h1
            className="text-3xl font-light text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Find Your Perfect Scent
          </h1>
        </div>

        <div
          className="p-6 md:p-8"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          {!showResults ? (
            <>
              <QuizProgress
                currentStep={currentStep}
                totalSteps={quizQuestions.length}
                onBack={handleBack}
              />
              <AnimatePresence mode="wait">
                {currentQuestion && (
                  <QuizStep
                    question={currentQuestion}
                    selectedOption={answers[currentStep] ?? null}
                    onSelect={handleSelect}
                  />
                )}
              </AnimatePresence>
            </>
          ) : (
            <QuizResults answers={answers} onRetake={handleRetake} />
          )}
        </div>
      </div>
    </div>
  );
}
