import React, { useState } from 'react';
import { FormStepProps } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';

export default function OthersInfoForm({
  formData,
  updateField,
  onNext,
  onPrevious,
  isLastStep
}: FormStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields if needed
    const isValid = true; // Add your validation logic here
    
    if (isValid) {
      onNext(); // This will trigger the main handleSubmit function
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="form-input-wrapper">
          <label 
            htmlFor="education" 
            className="block text-base font-medium text-gray-700"
          >
            Education
          </label>
          <input
            id="education"
            name="education"
            type="text" 
            value={formData.education || ''}
            onChange={(e) => updateField('education', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div className="form-input-wrapper">
          <label 
            htmlFor="skills" 
            className="block text-base font-medium text-gray-700"
          >
            Skills
          </label>
          <input
            id="skills"
            name="skills"
            type="text" 
            value={formData.skills?.join(', ') || ''}
            onChange={(e) => updateField('skills', e.target.value.split(',').map(skill => skill.trim()))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div className="form-input-wrapper">
          <label 
            htmlFor="certificates" 
            className="block text-base font-medium text-gray-700"
          >
            Certificates
          </label>
          <input
            id="certificates"
            name="certificates"
            type="file" 
            onChange={(e) => updateField('certificates', Array.from(e.target.files || []))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            multiple
          />
        </div>
        <FormNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstStep={false} // Adjust based on your step logic
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}