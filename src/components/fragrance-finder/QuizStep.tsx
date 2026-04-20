'use client';

import { motion } from 'framer-motion';
import { QuizQuestion } from '@/lib/data/quiz';

interface QuizStepProps {
  question: QuizQuestion;
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
}

export function QuizStep({ question, selectedOption, onSelect }: QuizStepProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      <h2
        className="text-2xl md:text-3xl font-light text-white mb-8 text-center"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {question.question}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="flex flex-col items-center justify-center gap-2 p-5 border-2 transition-all duration-200 min-h-[100px]"
              style={{
                borderColor: isSelected ? 'var(--color-amoria-accent)' : 'rgba(255,255,255,0.2)',
                backgroundColor: isSelected ? 'var(--color-amoria-accent)' : 'rgba(255,255,255,0.05)',
              }}
            >
              <span className="text-2xl">{option.icon}</span>
              <span
                className="text-sm font-medium text-center leading-tight"
                style={{ color: isSelected ? 'var(--color-amoria-primary)' : 'white' }}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
