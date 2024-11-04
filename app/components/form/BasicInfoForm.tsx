import React, { useState } from 'react';
import { FormStepProps } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';
import CustomFormInput from '../ui/FormInput';

const BasicInfoForm: React.FC<FormStepProps> = ({
  formData,
  updateField,
  markFieldTouched,
  isFieldTouched,
  onNext,
  onPrevious,
  isSubmitting,
  isFirstStep,
  isLastStep,
  jobId,
  jobTitle
}) => {
  //const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-step-wrapper">
        <div className="top flex">
          <div className="w-2/6">
            <p>profile image</p>
          </div>
          <div className="w-4/6">
          <CustomFormInput
            label="Expected Salary"
            name="expectedSalary"
            value={formData.expectedSalary || ''}
            type="text"
            required
            disabled={isSubmitting}
            updateField={updateField}
            markFieldTouched={markFieldTouched}
            isFieldTouched={isFieldTouched}
          />
          </div>
        </div>
        <FormNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstStep={true} // Adjust based on your step logic
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}

export default BasicInfoForm