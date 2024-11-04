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
  min?: number;
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
  jobId?: string;
  jobTitle?: string;
}

function FormInput({
  label,
  name,
  value,
  type = 'text',
  min,
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
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Update the form data with the file
      updateField('profileImage', file);
      
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
      updateField(field, file);
      
      // If it's a profile image, create preview
      if (field === 'profileImage') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-step-wrapper">
        <div className="top flex">
          <div className="w-2/6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
                disabled={isSubmitting}
              />
              <label
                htmlFor="profileImage"
                className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
              >
                Upload Photo
              </label>
            </div>
          </div>
          <div className="w-4/6">
          <div className="form-input-wrapper">
            <label 
              htmlFor="expectedSalary" 
              className="block text-base font-medium text-gray-700"
            >
              Expected Salary <span className="text-red-500">*</span>
            </label>
            <input
              id="expectedSalary"
              name="expectedSalary"
              type="text" 
              value={formData.expectedSalary || ''}
              onChange={(e) => updateField('expectedSalary', e.target.value)}
              onBlur={() => markFieldTouched('expectedSalary')}
              required
              disabled={isSubmitting}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('expectedSalary') && !formData.expectedSalary ? 'border-red-500' : ''
              }`}
            />
          </div>
          
          <div className="form-input-wrapper">
            <label 
              htmlFor="experience" 
              className="block text-base font-medium text-gray-700"
            >
              Work Experience (Years) <span className="text-red-500">*</span>
            </label>
            <input
              id="experience"
              name="experience" 
              type="number"
              min={0}
              value={formData.experience || ''}
              onChange={(e) => updateField('experience', e.target.value)}
              onBlur={(e) => {
                markFieldTouched('experience');
                const value = Number(e.target.value);
                if (value < 0) {
                  updateField('experience', '0');
                }
              }}
              required
              disabled={isSubmitting}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('experience') && !formData.experience ? 'border-red-500' : ''
              }`}
            />
          </div>
          <div className="form-input-wrapper">
            <label 
              htmlFor="cv" 
              className="block text-base font-medium text-gray-700"
            >
              CV Upload <span className="text-red-500">*</span>
            </label>
            <input
              id="cv"
              name="cv"
              type="file"
              accept=".jpg,.jpeg,.pdf"
              onChange={(e) => updateField('cv', e.target.files?.[0])}
              onBlur={() => markFieldTouched('cv')}
              required
              disabled={isSubmitting}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                isFieldTouched('cv') && !formData.cv ? 'border-red-500' : ''
              }`}
            />
            <p className="mt-1 text-sm text-gray-500">Accepted file types: JPG, JPEG, PDF</p>
          </div>
          
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