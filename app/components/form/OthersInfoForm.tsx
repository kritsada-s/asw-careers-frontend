import React, { useState } from 'react';
import { FormStepProps } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';
import { useEducations } from '@/app/hooks/useDataFetching';

export default function OthersInfoForm({
  formData,
  updateField,
  onNext,
  onPrevious,
  isLastStep
}: FormStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEduDropdownOpen, setIsEduDropdownOpen] = useState(false);
  const { educations, isLoading:isEducationsLoading } = useEducations();
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
        <div className="form-input-wrapper w-full md:w-1/2">
          <label 
            htmlFor="education" 
            className="block text-base font-medium text-gray-700"
          >
            Education
          </label>
          <div className="relative">
            <button
              type="button"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500"
              onClick={() => setIsEduDropdownOpen(!isEduDropdownOpen)}
            >
              {formData.education ? educations.find(edu => edu.educationID === formData.education)?.description : 'เลือกระดับการศึกษา'}
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            {isEduDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {educations.map((education) => (
                  <button
                    key={education.educationID}
                    type="button"
                    onClick={() => {
                      updateField('education', education.educationID);
                      setIsEduDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {education.description}
                  </button>
                ))}
              </div>
            )}
          </div>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
            className="mt-1 border bg-white block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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