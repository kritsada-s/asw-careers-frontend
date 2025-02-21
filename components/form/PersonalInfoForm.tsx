import React, { useEffect, useRef, useState } from 'react';
import { ApplicationFormData, FormStepProps } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';

// Add this function to check if a field has been touched
const isFieldTouched = (fieldName: string) => {
  // Implement your logic to determine if the field has been touched
  // For example, you could maintain a state for touched fields
  return false; // Placeholder return value
}

const genderOptions = [
  {
    "genderID": 1,
    "description": "ชาย / Male"
  },
  {
    "genderID": 2,
    "description": "หญิง / Female"
  },
  {
    "genderID": 3,
    "description": "LGBTQ"
  },
  {
    "genderID": 4,
    "description": "ไม่ระบุ / n/a"
  }
]

const maritalStatusOptions = [
  {
    "maritalStatusID": 1,
    "description": "โสด / Single"
  },
  {
    "maritalStatusID": 2,
    "description": "แต่งงาน / Married"
  },
  {
    "maritalStatusID": 3,
    "description": "หม้าย / Widowed"
  },
  {
    "maritalStatusID": 4,
    "description": "แยกกัน / Separated"
  }
]

export default function PersonalInfoForm({
  formData,
  updateField,
  onNext,
  onPrevious,
  isLastStep,
  markFieldTouched,
  isFieldTouched,
  decryptedToken
}: FormStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isMaritalStatusDropdownOpen, setIsMaritalStatusDropdownOpen] = useState(false);
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const maritalStatusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setIsGenderDropdownOpen(false);
      }
      if (maritalStatusDropdownRef.current && !maritalStatusDropdownRef.current.contains(event.target as Node)) {
        setIsMaritalStatusDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateData = () => {
    markFieldTouched('firstName');
    markFieldTouched('lastName');
    markFieldTouched('nickname');
    markFieldTouched('gender');
    markFieldTouched('maritalStatus');
    markFieldTouched('birthDate');
    markFieldTouched('phone');

    const isFirstNameValid = !!formData.firstName;
    const isLastNameValid = !!formData.lastName;
    const isNicknameValid = !!formData.nickname;
    const isGenderValid = formData.gender !== undefined;
    const isMaritalStatusValid = formData.maritalStatus !== undefined;
    const isBirthDateValid = !!formData.birthDate;
    const isPhoneValid = !!formData.phone;

    return isFirstNameValid && isLastNameValid && isNicknameValid && isGenderValid && isMaritalStatusValid && isBirthDateValid && isPhoneValid;
  }

  const handleNext = () => {    
    if (validateData()) {
      console.log('step 2 validated');
      onNext();
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="form-input-wrapper md:w-1/3 w-full">
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
              onBlur={() => markFieldTouched('firstName')}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none ${
                isFieldTouched('firstName') && !formData.firstName ? 'border-red-500' : ''
              }`}
            />
            { isFieldTouched('firstName') && !formData.firstName && <p className="text-red-500 text-sm mt-1">กรุณาระบุชื่อ</p> }
          </div>

          <div className="form-input-wrapper md:w-1/3 w-full">
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
              onBlur={() => markFieldTouched('lastName')}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none ${
                isFieldTouched('lastName') && !formData.lastName ? 'border-red-500' : ''
              }`}
            />
            { isFieldTouched('lastName') && !formData.lastName && <p className="text-red-500 text-sm mt-1">กรุณาระบุนามสกุล</p> }
          </div>

          <div className="form-input-wrapper md:w-1/3 w-full">
            <label 
              htmlFor="nickname" 
              className="block text-base font-medium text-gray-700"
            >
              ชื่อเล่น <span className="text-red-500">*</span>
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text" 
              required
              value={formData.nickname || ''}
              onChange={(e) => updateField('nickname', e.target.value)}
              onBlur={() => markFieldTouched('nickname')}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none ${
                isFieldTouched('nickname') && !formData.nickname ? 'border-red-500' : ''
              }`}
            />
            { isFieldTouched('nickname') && !formData.nickname && <p className="text-red-500 text-sm mt-1">กรุณาระบุชื่อเล่น</p> }
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="form-input-wrapper md:w-1/3 w-full">
            <label 
              htmlFor="gender" 
              className="block text-base font-medium text-gray-700"
            >
              เพศ <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={genderDropdownRef}>
              <button
                type="button"
                id="gender"
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  isFieldTouched('gender') && !formData.gender ? 'border-red-500' : ''
                }`}
                onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
              >
                {genderOptions.find(option => option.genderID === formData.gender)?.description || 'เลือกเพศ'}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
              {isGenderDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  {genderOptions.map(option => (
                    <div
                      key={option.genderID}
                      className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${formData.gender === option.genderID ? 'bg-primary-50 text-primary-600' : ''}`}
                      onClick={() => {
                        updateField('gender', option.genderID);
                        setIsGenderDropdownOpen(false);
                      }}
                    >
                      {option.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
            { isFieldTouched('gender') && !formData.gender && <p className="text-red-500 text-sm mt-1">กรุณาระบุเพศ</p> }
          </div>

          <div className="form-input-wrapper md:w-1/3 w-full">
            <label 
              htmlFor="maritalStatus" 
              className="block text-base font-medium text-gray-700"
            >
              สถานภาพสมรส <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={maritalStatusDropdownRef}>
              <button
                type="button"
                id="maritalStatus"
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  isFieldTouched('maritalStatus') && !formData.maritalStatus ? 'border-red-500' : ''
                }`}
                onClick={() => setIsMaritalStatusDropdownOpen(!isMaritalStatusDropdownOpen)}
              >
                {maritalStatusOptions.find(option => option.maritalStatusID === formData.maritalStatus)?.description || 'เลือกสถานภาพสมรส'}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
              {isMaritalStatusDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  {maritalStatusOptions.map(option => (
                    <div
                      key={option.maritalStatusID}
                      className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${formData.maritalStatus === option.maritalStatusID ? 'bg-primary-50 text-primary-600' : ''}`}
                      onClick={() => {
                        updateField('maritalStatus', option.maritalStatusID);
                        setIsMaritalStatusDropdownOpen(false);
                      }}
                    >
                      {option.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
            { isFieldTouched('maritalStatus') && !formData.maritalStatus && <p className="text-red-500 text-sm mt-1">กรุณาระบุสถานภาพสมรส</p> }
          </div>

          <div className="form-input-wrapper md:w-1/3 w-full">
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
              value={formData.birthDate ? formData.birthDate : ''}
              onChange={(e) => updateField('birthDate', e.target.value)}
              required 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none ${
                isFieldTouched('birthDate') && !formData.birthDate ? 'border-red-500' : ''
              }`}
              />
            { isFieldTouched('birthDate') && !formData.birthDate && <p className="text-red-500 text-sm mt-1">กรุณาระบุวันเกิด</p> }
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
              value={decryptedToken?.Email || 'no email'}
              disabled
              required
              className={`mt-1 block w-full text-gray-400 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none cursor-not-allowed ${
                isFieldTouched('email') && !decryptedToken?.Email ? 'border-red-500' : ''
              }`}
            />
            <small className="text-gray-500 text-xs mt-1">อีเมลจะไม่สามารถแก้ไขได้</small>
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none ${
                isFieldTouched('phone') && !formData.phone ? 'border-red-500' : ''
              }`}
            />
            { isFieldTouched('phone') && !formData.phone && <p className="text-red-500 text-sm mt-1">กรุณาระบุเบอร์โทร</p> }
          </div>
        </div>
        
        <FormNavigation
          onPrevious={onPrevious}
          onNext={handleNext}
          isFirstStep={false} // Adjust based on your step logic
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}