import React, { useState } from 'react';
import FormNavigation from '../ui/FormNavigation';
import CustomFormInput from '../ui/FormInput';
import type { FormField, ApplicationFormData } from '@/lib/types';
import Image from 'next/image';

interface FormInputProps {
  label: string;
  name: FormField;
  value: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  updateField: (field: FormField, value: any) => void;
  markFieldTouched: (field: FormField) => void;
  isFieldTouched: (field: FormField) => boolean;
}

interface FormStepProps {
  formData: ApplicationFormData;
  updateField: (field: FormField, value: any) => void;
  markFieldTouched: (field: FormField) => void;
  isFieldTouched: (field: FormField) => boolean;
  onNext: () => void;
  onPrevious?: () => void;
  isSubmitting: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

function FormInput({
  label,
  name,
  value,
  type = 'text',
  required = false,
  disabled = false,
  updateField,
  markFieldTouched,
  isFieldTouched
}: FormInputProps) {
  const hasError = required && isFieldTouched(name) && !value;

  return (
    <div className="form-input-wrapper">
      <label 
        htmlFor={name} 
        className="block text-base font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        id={name}
        type={type}
        value={value || ''}
        onChange={(e) => updateField(name, e.target.value)}
        onBlur={() => markFieldTouched(name)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md 
          ${hasError 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors text-xl
        `}
      />
      
      {hasError && (
        <p className="text-red-500 text-sm mt-1">
          {label} is required
        </p>
      )}
    </div>
  );
}
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
    // Validate required fields
    const requiredFields: FormField[] = ['expectedSalary', 'experience'];
    const hasErrors = requiredFields.some(field => !formData[field]);
    
    if (!hasErrors) {
      onNext();
    } else {
      // Mark all required fields as touched to show errors
      requiredFields.forEach(field => markFieldTouched(field));
    }
  };

  //const [isSubmitting, setIsSubmitting] = useState(false);
  const [salary, setSalary] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  // Handle profile image upload
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'cv') => {
    const file = e.target.files?.[0];
    if (file) {
      updateField('cv', file);
    }
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