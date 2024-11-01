import React, { useState } from 'react';
import FormNavigation from '../ui/FormNavigation';
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

export default function BasicInfoForm({
  formData,
  updateField,
  markFieldTouched,
  isFieldTouched,
  onNext,
  onPrevious,
  isSubmitting,
  isFirstStep,
  isLastStep
}: FormStepProps) {
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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="w-1/4">
            <div className="profile-wrapper border border-neutral-300 rounded-full overflow-hidden relative max-w-[250px]">
              {profilePreview ? (
                <div className="profile relative w-full aspect-square mx-auto overflow-hidden">
                  <Image
                    src={profilePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square mx-auto bg-gray-100 flex items-center justify-center">
                    <svg className="w-[80px] h-[80px] text-neutral-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd" />
                    </svg>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
                id="profile-upload"
              />
              <label htmlFor="profile-upload" className="block w-full px-4 py-2 text-center border border-gray-300 rounded-md cursor-pointer bg-neutral-700 hover:bg-gray-50 absolute bottom-0 left-0 text-white">
                Upload Image
              </label>
            </div>
          </div>
          <div className="w-3/4 flex gap-4 flex-col">
            <div className="row w-full flex gap-4">
              <div className="w-1/2">
                <FormInput
                  label="เงินเดือนที่คาดหวัง"
                  name="expectedSalary"
                  value={formData.expectedSalary || ''}
                  type="number"
                  required
                  disabled={isSubmitting}
                  updateField={updateField}
                  markFieldTouched={markFieldTouched}
                  isFieldTouched={isFieldTouched}
                />
              </div>
              <div className="w-1/2">
                <FormInput
                  label="ประสบการณ์การทำงาน"
                  name="experience"
                  value={formData.experience || ''}
                  type="number"
                  required
                  disabled={isSubmitting}
                  updateField={updateField}
                  markFieldTouched={markFieldTouched}
                  isFieldTouched={isFieldTouched}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-base font-medium text-gray-900 dark:text-white" htmlFor="file_input">อัพโหลด CV</label>
              <input type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'cv')}
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">JPG, JPEG, PDF (MAX. 5MB).</p>
            </div>
          </div>
        </div>
      </form>
      <FormNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isFirstStep={true} // Adjust based on your step logic
        isLastStep={false}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}