"use client";

import { fetchPosition } from '@/lib/api';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import BasicInfoForm from '@/app/components/form/BasicInfoForm';
import PersonalInfoForm from '@/app/components/form/PersonalInfoForm';
import AddressInfoForm from '@/app/components/form/AddressInfoForm';
import OthersInfoForm from '@/app/components/form/OthersInfoForm';
import { FormStep, FormStepProps, BasicInfo, AddressInfo, PersonalInfo, OtherInfo} from '@/lib/types';
import { ProgressSteps } from '@/app/components/layout/FormProgress';

interface FormData {
  basicInfo: BasicInfo;
  addressInfo: AddressInfo;
  personalInfo: PersonalInfo;
  otherInfo: OtherInfo;
}

export default function ApplyJobPage() {
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobTitle, setJobTitle] = useState('');

  // Initialize form data state
  const [formData, setFormData] = useState<FormData>({
    basicInfo: {},
    addressInfo: {},
    personalInfo: {},
    otherInfo: {}
  });

  // Form update handler
  const updateFormData = useCallback((
    section: keyof FormData,
    data: Partial<BasicInfo | AddressInfo | PersonalInfo | OtherInfo>
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  }, []);

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Final submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create FormData instance for file uploads
      const submitData = new FormData();

      // Append basic form data
      Object.entries(formData).forEach(([section, data]) => {
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof File) {
            submitData.append(`${section}.${key}`, value);
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (item instanceof File) {
                submitData.append(`${section}.${key}.${index}`, item);
              } else {
                submitData.append(`${section}.${key}.${index}`, String(item));
              }
            });
          } else {
            submitData.append(`${section}.${key}`, String(value));
          }
        });
      });

      // Your API call here
      // await submitApplication(submitData);

      // Handle success (e.g., redirect or show success message)
    } catch (error) {
      console.error('Error submitting application:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form step components with their props
  const formSteps: FormStep[] = [
    {
      component: BasicInfoForm,
      props: {
        jobId: params.id,
        data: formData.basicInfo,
        updateData: (data: Partial<BasicInfo>) => updateFormData('basicInfo', data),
        onNext: handleNext,
        isSubmitting: isSubmitting
      }
    },
    {
      component: AddressInfoForm,
      props: {
        data: formData.addressInfo,
        updateData: (data: Partial<AddressInfo>) => updateFormData('addressInfo', data),
        onNext: handleNext,
        onPrevious: handlePrevious,
        isSubmitting: isSubmitting
      }
    },
    {
      component: PersonalInfoForm,
      props: {
        data: formData.personalInfo,
        updateData: (data: Partial<PersonalInfo>) => updateFormData('personalInfo', data),
        onNext: handleNext,
        onPrevious: handlePrevious,
        isSubmitting: isSubmitting
      }
    },
    {
      component: OthersInfoForm,
      props: {
        data: formData.otherInfo,
        updateData: (data: Partial<OtherInfo>) => updateFormData('otherInfo', data),
        onSubmit: handleSubmit,
        onPrevious: handlePrevious,
        isSubmitting: isSubmitting
      }
    }
  ];

  const CurrentStepComponent = formSteps[currentStep].component;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressSteps currentStep={currentStep} steps={formSteps}/>

      <h2 className="text-[30px] lg:text-[40px] text-gray-600 text-center mb-6">สมัครงานตำแหน่ง <strong className='text-primary-700 text-[1.2em] relative underline decoration-1'>{jobTitle}</strong></h2>

      <div className="bg-[#F2F9FF] rounded-lg shadow p-3 lg:p-6">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLastStep={currentStep === formSteps.length - 1}
        />
      </div>
    </div>
  );
}