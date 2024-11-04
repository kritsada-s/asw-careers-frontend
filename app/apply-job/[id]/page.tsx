"use client";

import { fetchPosition } from '@/lib/api';
import { Position, ApplicationFormData } from '@/lib/types';
import { Candidate } from '@/lib/form';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import BasicInfoForm from '@/app/components/form/BasicInfoForm';
import PersonalInfoForm from '@/app/components/form/PersonalInfoForm';
import AddressInfoForm from '@/app/components/form/AddressInfoForm';
import OthersInfoForm from '@/app/components/form/OthersInfoForm';
import { ProgressSteps } from '@/app/components/layout/FormProgress';
import { useApplicationForm } from '@/app/hooks/useForm';

// Move to constants file later
const FORM_STEPS = [
  { id: 'basic', title: 'ข้อมูลเบื้องต้น' },
  { id: 'personal', title: 'ข้อมูลส่วนตัว' },
  { id: 'address', title: 'ที่อยู่' },
  { id: 'others', title: 'ข้อมูลเพิ่มเติม' }
] as const;

interface FormStep {
  id: number;
  title: string;
}

export default function ApplyJobPage() {
  const params = useParams();
  const jobId = params.id as string;
  
  // States
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [position, setPosition] = useState<Position | null>(null);

  const {
    formData,
    updateField,
    markFieldTouched,
    isFieldTouched
  } = useApplicationForm();

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length - 1));
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Fetch position data
  useEffect(() => {
    if (!jobId) return;

    async function loadPosition() {
      try {
        const data = await fetchPosition(jobId);
        setPosition(data);
        setJobTitle(data.jobPosition);
      } catch (error) {
        console.error('Error fetching position:', error);
      }
    }

    loadPosition();
  }, [jobId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData = new FormData();

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof File) {
            submitData.append(key, value, value.name);
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (item instanceof File) {
                submitData.append(`${key}[${index}]`, item, item.name);
              } else {
                submitData.append(`${key}[${index}]`, String(item));
              }
            });
          } else {
            submitData.append(key, String(value));
          }
        }
      });

      // Add position data
      if (position) {
        submitData.append('positionId', position.jobID);
        submitData.append('positionTitle', position.jobPosition);
      }

      console.log('Form Data Files:', {
        profileImage: submitData.get('profileImage'),
        cv: submitData.get('cv')
      });

      const candidateData: Candidate = {
        JobID: jobId,
        CandidateID: '', // Assuming this will be generated or fetched from somewhere
        Revision: 1, // Assuming a default revision number
        Email: formData.email || '',
        TitleID: 0, // Assuming this will be set based on your application logic
        FirstName: formData.firstName || '',
        LastName: formData.lastName || '',
        NickName: '', // Assuming this is optional or can be set later
        Tel: formData.phone || '',
        DateOfBirth: formData.birthDate || '',
        Gender: {
          GenderID: 0, // Assuming this will be set based on your application logic
          Description: '' // Assuming this will be set based on your application logic
        },
        MaritalStatus: {
          MaritalStatusID: 0, // Assuming this will be set based on your application logic
          Description: '' // Assuming this will be set based on your application logic
        },
        ImageUrl: '', // Assuming this will be set based on your application logic
        CVUrl: '', // Assuming this will be set based on your application logic
        AddressDetails: `${formData.addressLine1 || ''}, ${formData.addressLine2 || ''}`,
        Province: {
          ProvinceID: 0, // Assuming this will be set based on your application logic
          NameTH: formData.province || '',
          NameEN: '' // Assuming this will be set based on your application logic
        },
        District: {
          DistrictID: 0, // Assuming this will be set based on your application logic
          ProvinceID: 0, // Assuming this will be set based on your application logic
          NameTH: formData.district || '',
          NameEN: '' // Assuming this will be set based on your application logic
        },
        Subdistrict: {
          SubdistrictID: 0, // Assuming this will be set based on your application logic
          DistrictID: 0, // Assuming this will be set based on your application logic
          PostCode: formData.postalCode || '',
          NameTH: '', // Assuming this will be set based on your application logic
          NameEN: '' // Assuming this will be set based on your application logic
        },
        PostalCode: formData.postalCode || '',
        SourceInformation: {
          SourceInformationID: 0, // Assuming this will be set based on your application logic
          Description: '' // Assuming this will be set based on your application logic
        },
        PDPAAccepted: false, // Assuming this will be set based on your application logic
        PDPAAcceptedDate: '', // Assuming this will be set based on your application logic
        CandidateEducations: [], // Assuming this will be set based on your application logic
        CandidateLanguages: [] // Assuming this will be set based on your application logic
      };

      console.log('Candidate Data:', candidateData);

      // Your API call here
      // await submitApplication(submitData);
      
      // Handle success (e.g., redirect or show success message)
      
    } catch (error) {
      console.error('Submission error:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form steps configuration
  const formSteps = [
    {
      component: BasicInfoForm,
      props: {
        jobId,
        jobTitle,
        formData,
        updateField,
        markFieldTouched,
        isFieldTouched,
        onNext: handleNext,
        isSubmitting,
        isFirstStep: true,
        isLastStep: false
      }
    },
    {
      component: PersonalInfoForm,
      props: {
        formData,
        updateField,
        markFieldTouched,
        isFieldTouched,
        onNext: handleNext,
        onPrevious: handlePrevious,
        isSubmitting,
        isFirstStep: false,
        isLastStep: false
      }
    },
    {
      component: AddressInfoForm,
      props: {
        formData,
        updateField,
        markFieldTouched,
        isFieldTouched,
        onNext: handleNext,
        onPrevious: handlePrevious,
        isSubmitting,
        isFirstStep: false,
        isLastStep: false
      }
    },
    {
      component: OthersInfoForm,
      props: {
        formData,
        updateField,
        markFieldTouched,
        isFieldTouched,
        onNext: handleSubmit,
        onPrevious: handlePrevious,
        isSubmitting,
        isFirstStep: false,
        isLastStep: true
      }
    }
  ];

  const CurrentStepComponent = formSteps[currentStep].component;
  const currentStepProps = formSteps[currentStep].props;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <ProgressSteps 
        currentStep={currentStep} 
        steps={FORM_STEPS.map((step, index) => ({
          title: step.title,
          isCompleted: index < currentStep
        }))} 
      />

      {/* Title */}
      <h2 className="text-[30px] lg:text-[40px] text-gray-600 text-center mb-6">
        สมัครงานตำแหน่ง{' '}
        <strong className='text-primary-700 text-[1.2em] relative underline decoration-1'>
          {jobTitle}
        </strong>
      </h2>

      {/* Form Container */}
      <div className="bg-[#F2F9FF] rounded-lg shadow p-3 lg:p-6">
        <CurrentStepComponent {...currentStepProps} />
      </div>
    </div>
  );
}