import React, { useEffect, useRef, useState } from 'react';
import { FormStepProps } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';
import { useEducations, useSourceInformations } from '@/hooks/useDataFetching';

export default function OthersInfoForm({
  formData,
  updateField,
  onNext,
  onPrevious,
  isLastStep,
  markFieldTouched,
  isFieldTouched
}: FormStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEduDropdownOpen, setIsEduDropdownOpen] = useState(false);
  const [isRefferedByDropdownOpen, setIsRefferedByDropdownOpen] = useState(false);
  const { educations, isLoading:isEducationsLoading } = useEducations();
  const educationDropdownRef = useRef<HTMLDivElement>(null);
  const refferedByDropdownRef = useRef<HTMLDivElement>(null);
  const { sourceInformations, isLoading:isSourceInformationsLoading } = useSourceInformations();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (educationDropdownRef.current && !educationDropdownRef.current.contains(event.target as Node)) {
        setIsEduDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRefferedByChange = (option: any) => {
    updateField('refferedBy', option.sourceInformationID);
    setIsRefferedByDropdownOpen(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleNext = () => {
    // Validate required fields
    const requiredFields = ['education', 'major'] as const;
    const hasErrors = requiredFields.some(
      field => !formData[field as keyof typeof formData]
    );

    if (hasErrors) {
      console.log('hasErrors', hasErrors);
      requiredFields.forEach(field => 
        markFieldTouched(field as keyof typeof formData)
      );
      return;
    }
    onNext();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="form-input-wrapper w-full md:w-1/2">
          <label 
            htmlFor="education" 
            className="block text-base font-medium text-gray-700"
          >
            Education
          </label>
          <div className="relative" ref={educationDropdownRef}>
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
          {isFieldTouched('education') && !formData.education && <p className="text-red-500 text-sm">กรุณาเลือกระดับการศึกษา</p>}
        </div>
        <div className='form-input-wrapper w-full md:w-1/2'>
          <label 
            htmlFor="refferedBy" 
            className="block text-base font-medium text-gray-700"
          >
            ท่านได้รับข้อมูลการสมัครงานจากที่ใด
          </label>
          <div className='relative' ref={refferedByDropdownRef}>
            <button
              type="button"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500"
              onClick={() => setIsRefferedByDropdownOpen(!isRefferedByDropdownOpen)}
            >
              {formData.refferedBy ? sourceInformations.find(source => source.sourceInformationID === formData.refferedBy)?.description : 'เลือกที่มา'}
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            {isRefferedByDropdownOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                {sourceInformations.map(option => (
                <div
                  key={option.sourceInformationID}
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${formData.refferedBy === option.sourceInformationID ? 'bg-primary-50 text-primary-600' : ''}`}
                  onClick={() => {
                    updateField('refferedBy', option.sourceInformationID);
                    setIsRefferedByDropdownOpen(false);
                    }}
                  >
                    {option.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <div className="form-input-wrapper w-full md:w-1/2">
          <label 
            htmlFor="major" 
            className="block text-base font-medium text-gray-700"
          >
            สาขาวิชา <span className="text-red-500">*</span>
          </label>
          <input
            id="major"
            name="major" 
            type="text"
            required
            value={formData.major || ''}
            onChange={(e) => updateField('major', e.target.value)}
            onBlur={() => markFieldTouched('major')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${isFieldTouched('major') && !formData.major ? 'border-red-500' : ''}`}
          />
          {isFieldTouched('major') && !formData.major && <p className="text-red-500 text-sm">กรุณาระบุสาขาวิชา</p>}
        </div>
        <div className="form-input-wrapper w-full md:w-1/2">
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
      </div>

      <div>
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
      </div>
      <div>
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