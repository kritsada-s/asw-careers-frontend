// components/ProgressSteps.tsx
import React from 'react';
import { FormStep } from '@/lib/types';

interface ProgressStepsProps {
  steps: FormStep[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full lg:w-3/4 py-4 mx-auto">
      <div className="flex items-baseline z-10 relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Node */}
            <div className="flex flex-col items-center relative flex-1">
              {/* Circle */}
              <div 
                className={`
                  w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center
                  border-2 font-semibold text-md md:text-2xl transition-all duration-300 ease-in-out
                  ${index <= currentStep 
                    ? 'bg-green-700 border-green-700 text-white' 
                    : 'border-gray-300 text-gray-400'
                  } relative z-10
                `}
              >
                {index + 1}
              </div>
              
              {/* Title */}
              <div 
                className={`
                  mt-2 text-sm hidden md:flex lg:text-base font-medium transition-colors duration-300
                  ${index <= currentStep ? 'text-neutral-900' : 'text-gray-400'}
                `}
              >
                {step.title}
              </div>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[5px] relative z-0 bg-gray-200">
                <div 
                  className={`
                    h-full transition-all duration-500 ease-in-out
                    ${index < currentStep ? 'bg-green-700' : 'bg-gray-300'}
                  `}
                  style={{
                    width: index < currentStep ? '100%' : 
                           index === currentStep ? '50%' : '0%'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}