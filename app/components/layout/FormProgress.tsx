import React from "react";

interface Step {
  title: string;
  isCompleted: boolean;
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full lg:w-3/4 py-4 mx-auto">
      <div className="flex z-10 relative">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
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
                  ${step.isCompleted ? 'bg-primary-600 text-white' : ''}
                `}
              >
                {step.isCompleted ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
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

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[5px] relative z-0 bg-gray-200 mt-[30px]">
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

// You can create a separate icons file
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}