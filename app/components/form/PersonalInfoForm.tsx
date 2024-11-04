import React, { useState } from 'react';
import { FormStepProps } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';

// Add this function to check if a field has been touched
const isFieldTouched = (fieldName: string) => {
  // Implement your logic to determine if the field has been touched
  // For example, you could maintain a state for touched fields
  return false; // Placeholder return value
}

export default function PersonalInfoForm({
  formData,
  updateField,
  onNext,
  onPrevious,
  isLastStep
}: FormStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="form-input-wrapper md:w-1/2 w-full">
            <label 
              htmlFor="firstName" 
              className="block text-base font-medium text-gray-700"
            >
              ชื่อ <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text" 
              value={formData.firstName || ''}
              onChange={(e) => updateField('firstName', e.target.value)}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('firstName') && !formData.firstName ? 'border-red-500' : ''
              }`}
            />
          </div>

          <div className="form-input-wrapper md:w-1/2 w-full">
            <label 
              htmlFor="lastName" 
              className="block text-base font-medium text-gray-700"
            >
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text" 
              value={formData.lastName || ''}
              onChange={(e) => updateField('lastName', e.target.value)}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('lastName') && !formData.lastName ? 'border-red-500' : ''
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="form-input-wrapper md:w-1/2 w-full">
            <label 
              htmlFor="email" 
              className="block text-base font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email" 
              value={formData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('email') && !formData.email ? 'border-red-500' : ''
              }`}
            />
          </div>

          <div className="form-input-wrapper md:w-1/2 w-full">
            <label 
              htmlFor="phone" 
              className="block text-base font-medium text-gray-700"
            >
              เบอร์โทร <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel" 
              value={formData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('phone') && !formData.phone ? 'border-red-500' : ''
              }`}
            />
          </div>
        </div>

        <div className="form-input-wrapper flex-1 md:w-1/2 w-full">
          <label 
            htmlFor="birthDate" 
            className="block text-base font-medium text-gray-700"
          >
            วันเกิด <span className="text-red-500">*</span>
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date" 
            value={formData.birthDate || ''}
            onChange={(e) => updateField('birthDate', e.target.value)}
            required
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
              isFieldTouched('birthDate') && !formData.birthDate ? 'border-red-500' : ''
            }`}
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