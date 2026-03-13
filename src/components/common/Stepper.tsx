import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: Props) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={index} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                  isCompleted && 'border-blue-600 bg-blue-600 text-white',
                  isCurrent && 'border-blue-600 bg-white text-blue-600',
                  !isCompleted && !isCurrent && 'border-gray-300 bg-white text-gray-400'
                )}>
                  {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                </div>
                <span className={cn(
                  'mt-1 hidden text-xs sm:block',
                  isCurrent ? 'font-medium text-blue-600' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                )}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={cn('mx-2 h-0.5 flex-1', isCompleted ? 'bg-blue-600' : 'bg-gray-200')} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
