import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormNavigationProps {
  onPrevious?: () => void;
  onNext: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export default function FormNavigation({
  onPrevious,
  onNext,
  isFirstStep = false,
  isLastStep = false,
  isSubmitting = false
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
      {/* Previous Button */}
      <div className="w-24">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 text-primary-700 rounded border-[3px] border-primary-700 transition-colors w-full flex items-center justify-center gap-1"
            disabled={isSubmitting}
          >
            <ChevronLeft size={18}/>
            ก่อนหน้า
          </button>
        )}
      </div>

      {/* Next/Submit Button */}
      <div className="w-24">
        <button
          type="submit"
          className={`px-4 py-2 text-white font-medium border-[3px] rounded transition-colors w-full disabled:bg-blue-300 flex items-center justify-center gap-1 ` + (isLastStep ? 'bg-green-700 hover:bg-green-600 hover:border-green-600 border-green-700':'bg-primary-700 hover:bg-primary-600 border-primary-700')}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing
            </span>
          ) : isLastStep ? (
            'ส่งข้อมูล'
          ) : (
            'ต่อไป'
          )}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}