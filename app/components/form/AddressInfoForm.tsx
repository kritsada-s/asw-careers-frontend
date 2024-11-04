import React, { useState } from 'react';
import { FormStepProps } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';
import { useProvinces } from '@/app/hooks/useDataFetching';

// Add this function to check if a field has been touched
const isFieldTouched = (fieldName: string) => {
  // Implement your logic to determine if the field has been touched
  // For example, you could maintain a state for touched fields
  return false; // Placeholder return value
};

export default function AddressInfoForm({
  formData,
  updateField,
  onNext,
  onPrevious,
  isLastStep
}: FormStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { provinces, isLoading:isProvincesLoading } = useProvinces();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
          <div className="form-input-wrapper w-full md:w-1/2">
            <label 
              htmlFor="addressLine1" 
              className="block text-base font-medium text-gray-700"
            >
              ที่อยู่ <span className="text-red-500">*</span>
            </label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text" 
              value={formData.addressLine1 || ''}
              onChange={(e) => updateField('addressLine1', e.target.value)}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('addressLine1') && !formData.addressLine1 ? 'border-red-500' : ''
              }`}
            />
          </div>

          <div className="form-input-wrapper w-full md:w-1/2">
            <label 
              htmlFor="province" 
              className="block text-base font-medium text-gray-700"
            >
              จังหวัด <span className="text-red-500">*</span>
            </label>

            <select
              id="province"
              name="province"
              value={formData.province || ''}
              onChange={(e) => updateField('province', e.target.value)}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('province') && !formData.province ? 'border-red-500' : ''
              }`}
              disabled={isProvincesLoading}
            >
              <option value="" disabled>Select a province</option>
              {!isProvincesLoading && provinces.map((province) => (
                <option key={province.provinceID} value={province.provinceID}>{province.nameTH}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-input-wrapper w-full md:w-1/2">
          <label 
            htmlFor="district" 
            className="block text-base font-medium text-gray-700"
          >
            อำเภอ <span className="text-red-500">*</span>
          </label>
          <input
            id="district"
            name="district"
            type="text" 
            value={formData.district || ''}
            onChange={(e) => updateField('district', e.target.value)}
            required
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
              isFieldTouched('district') && !formData.district ? 'border-red-500' : ''
            }`}
          />
        </div>

        <div className="form-input-wrapper">
          <label 
            htmlFor="postalCode" 
            className="block text-base font-medium text-gray-700"
          >
            รหัสไปรษณีย์ <span className="text-red-500">*</span>
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text" 
            value={formData.postalCode || ''}
            onChange={(e) => updateField('postalCode', e.target.value)}
            required
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
              isFieldTouched('postalCode') && !formData.postalCode ? 'border-red-500' : ''
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