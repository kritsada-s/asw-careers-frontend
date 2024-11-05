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
import Crypt from '@/lib/Crypt';

const FORM_STEPS = [
  { id: 'basic', title: 'ข้อมูลเบื้องต้น' },
  { id: 'personal', title: 'ข้อมูลส่วนตัว' },
  { id: 'address', title: 'ที่อยู่' },
  { id: 'others', title: 'ข้อมูลเพิ่มเติม' }
] as const;

export default function ApplyJobPage() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [decryptedToken, setDecryptedToken] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [position, setPosition] = useState<Position | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    formData,
    updateField,
    markFieldTouched,
    isFieldTouched
  } = useApplicationForm();

  const prefillFormWithSampleData = useCallback(() => {
    const sampleData: Partial<ApplicationFormData> = {
      // Basic Info
      //profileImage: null, // File type needs to be handled separately
      expectedSalary: '50000',
      experience: '5',
      //cv: null, // File type needs to be handled separately

      // Personal Info
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '0891234567',
      birthDate: '1990-01-01',
      nationality: 'Thai',

      // Address Info
      addressLine1: '123 Sample Street',
      addressLine2: 'Sample address line 2',
      district: 1001,
      province: 1,
      postalCode: 10400,

      // Others Info
      education: 1,
      skills: ['JavaScript', 'React', 'TypeScript'],
    };

    // Update each field
    Object.entries(sampleData).forEach(([key, value]) => {
      if (value !== null) {
        updateField(key as keyof ApplicationFormData, value);
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/';
      return;
    }
    
    const decrypted = Crypt(token);
    if (!decrypted) {
      window.location.href = '/';
      return;
    }
    
    setAuthToken(token);
    setDecryptedToken(decrypted);
    setIsAuthenticated(true);
  }, []);

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

  useEffect(() => {
    prefillFormWithSampleData();
  }, [prefillFormWithSampleData]);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length - 1));
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

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
        CandidateID: decryptedToken.CandidateID, // Assuming this will be generated or fetched from somewhere
        Revision: 1, // Assuming a default revision number
        Email: formData.email || '',
        TitleID: 0, // Assuming this will be set based on your application logic
        FirstName: formData.firstName || '',
        LastName: formData.lastName || '',
        NickName: formData.nickname || '',
        Tel: formData.phone || '',
        DateOfBirth: formData.birthDate || '',
        Gender: {
          GenderID: formData.gender || 1, // Assuming this will be set based on your application logic
          Description: '' // Assuming this will be set based on your application logic
        },
        MaritalStatus: {
          MaritalStatusID: formData.maritalStatus || 1, // Assuming this will be set based on your application logic
          Description: '' // Assuming this will be set based on your application logic
        },
        ImageUrl: formData.profileImage ? URL.createObjectURL(formData.profileImage) : '', // Convert File to URL for image files (jpg/jpeg)
        CVUrl: formData.cv ? URL.createObjectURL(formData.cv) : '', // Convert File to URL for PDF files
        AddressDetails: `${formData.addressLine1 || ''}, ${formData.addressLine2 || ''}`,
        Province: {
          ProvinceID: formData.province ? Number(formData.province) : 0,
          NameTH: '',
          NameEN: ''
        },
        District: {
          DistrictID: formData.district ? Number(formData.district) : 0,
          ProvinceID: formData.district ? Number(formData.district) : 0,
          NameTH: '',
          NameEN: ''
        },
        Subdistrict: {
          SubdistrictID: formData.subdistrict ? Number(formData.subdistrict) : 0,
          DistrictID: formData.district ? Number(formData.district) : 0,
          PostCode: formData.postalCode ? Number(formData.postalCode) : 0,
          NameTH: '',
          NameEN: ''
        },
        PostalCode: formData.postalCode ? Number(formData.postalCode) : 0,
        SourceInformation: {
          SourceInformationID: 0, // Assuming this will be set based on your application logic
          Description: '' // Assuming this will be set based on your application logic
        },
        PDPAAccepted: false, // Assuming this will be set based on your application logic
        PDPAAcceptedDate: '', // Assuming this will be set based on your application logic
        CandidateEducations: [{
          EducationID: formData.education ? Number(formData.education) : 1,
          // Add other required education fields based on your type definition
        }],
        CandidateLanguages: []
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