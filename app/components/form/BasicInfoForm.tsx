import React, { useEffect, useState } from 'react';
import FormNavigation from '../ui/FormNavigation';
import type { FormField, ApplicationFormData } from '@/lib/types';
import Image from 'next/image';
import { useFetchBase64Image, useFetchBase64PDF } from '@/app/hooks/useDataFetching';

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
  const [profilePreview, setProfilePreview] = useState<string>('');
  const { imageData, isLoading: isLoadingImage, error: imageError } = useFetchBase64Image(formData.profileImagePath || '');
  const { pdfData, isLoading, error } = useFetchBase64PDF(formData.cvPath || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();    
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'cv') => {
    const file = e.target.files?.[0];
    if (file) {
      updateField(field, file);
      
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
            <div className="relative max-w-44 mx-auto mb-4">
              {imageData && !profilePreview ? (
                <Image src={imageData} alt="Profile Preview" className="aspect-[3/4] w-auto h-auto fill rounded object-cover" width={240} height={320} />
              ) : profilePreview ? (
                <Image src={profilePreview} alt="Profile Preview" className="aspect-[3/4] w-auto h-auto rounded object-cover" width={240} height={320} />
              ) : (
                <div className="flex justify-center items-center w-[240px] h-[320px] bg-gray-100 rounded">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'profileImage')}
                disabled={isSubmitting}
              />
              <label
                htmlFor="profileImage"
                className="cursor-pointer bg-primary-600 text-white px-5 py-1 rounded-full hover:bg-primary-700 transition-colors text-sm"
              >
                อัพโหลดรูปภาพ
              </label>
            </div>
          </div>
          <div className="w-4/6">
          <div className="form-input-wrapper mb-3">
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none ${
                isFieldTouched('expectedSalary') && !formData.expectedSalary ? 'border-red-500' : ''
              }`}
            />
            {isFieldTouched('expectedSalary') && !formData.expectedSalary && (
              <p className="text-red-500 text-sm mt-1">
                กรุณาระบุเงินเดือนที่คาดหวัง
              </p>
            )}
          </div>
          
          <div className="form-input-wrapper mb-3">
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none ${
                isFieldTouched('experience') && !formData.experience ? 'border-red-500' : ''
              }`}
            />
            {isFieldTouched('experience') && !formData.experience && (
              <p className="text-red-500 text-sm mt-1">
                กรุณาระบุประสบการณ์ทำงาน
              </p>
            )}
          </div>
          <div className="form-input-wrapper mb-3">
              <div className="cv-selector">
                <label
                  htmlFor="cv"
                  className="block text-base font-medium text-gray-700"
                >
                  CV Upload <span className="text-red-500">*</span>
                </label>
                { formData.cvPath !== '' && (
                <p className='text-base text-neutral-800'>ไฟล์ CV ปัจจุบัน : <span className='font-medium underline'>{formData.cvPath?.split('\\').pop()}</span> <span className='text-neutral-500 text-[16px]'>(อัพเดตเมื่อ 14 พฤศจิกายน 2567)</span></p>
                ) }
                <input
                  id="cv"
                  name="cv"
                  type="file"
                  accept=".jpg,.jpeg,.pdf"
                  onChange={(e) => updateField('cv', e.target.files?.[0])}
                  onBlur={() => markFieldTouched('cv')}
                  required
                  disabled={isSubmitting}
                  className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white ${isFieldTouched('cv') && formData.cvPath === '' ? 'border-red-500' : '' }`}
                />
                <p className="mt-1 text-sm text-gray-500">Accepted file types: JPG, JPEG, PDF</p>
            </div>
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