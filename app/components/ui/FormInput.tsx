import { ApplicationFormData } from '@/lib/types';
import React, { useEffect, useState } from 'react';

interface FormInputProps {
  label: string;
  name: keyof ApplicationFormData;  // This ensures name is a valid form field
  value: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  updateField: (field: keyof ApplicationFormData, value: any) => void;
  markFieldTouched: (field: keyof ApplicationFormData) => void;
  isFieldTouched: (field: keyof ApplicationFormData) => boolean;
}

export const CustomFormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  type = 'text',
  required = false,
  disabled = false,
  updateField,
  markFieldTouched,
  isFieldTouched
}: FormInputProps) => {
  const hasError = required && isFieldTouched(name) && !value;

  return (
    <div className="space-y-1">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
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
          transition-colors
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

interface GenderOption {
  genderID: number;
  description: string;
}

interface GenderSelectProps {
  id: number;
  setGender: (gender: GenderOption | null) => void;
  isFieldTouched?: (field: keyof ApplicationFormData) => boolean;
}

export const GenderSelect: React.FC<GenderSelectProps> = ({ id, setGender, isFieldTouched }) => {
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [currentGender, setCurrentGender] = useState(1);

  const genderData: GenderOption[] = [
    { genderID: 1, description: "ชาย / Male" },
    { genderID: 2, description: "หญิง / Female" },
    { genderID: 3, description: "LGBTQ" },
    { genderID: 4, description: "ไม่ระบุ / n/a" }
  ];

  const onGenderChange = (gender: GenderOption | null) => {
    console.log('gender', gender);
    setGender(gender);
    setCurrentGender(gender?.genderID || 1);
    setIsGenderDropdownOpen(false);
  }

  useEffect(() => {
    setCurrentGender(id);
  }, [id]);

  return (
    <div className="relative">
      <button
        type="button"
        id="gender"
        className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
          isFieldTouched && isFieldTouched('gender') && !id ? 'border-red-500' : ''
        }`}
        onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
      >
        {genderData.find(option => option.genderID === currentGender)?.description || 'เลือกเพศ'}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isGenderDropdownOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {genderData.map(option => (
            <div
              key={option.genderID}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${id === option.genderID ? 'bg-primary-50 text-primary-600' : ''}`}
              onClick={() => {
                onGenderChange(option);
                setIsGenderDropdownOpen(false);
              }}
            >
              {option.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
