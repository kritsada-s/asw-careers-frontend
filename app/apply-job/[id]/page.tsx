"use client";

import { fetchPosition } from '@/lib/api';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import PersonalInfoForm from '@/app/components/form/PersonalInfoForm';
import { FormStep, FormStepProps } from '@/lib/types';
import BasicInfoForm from '@/app/components/form/BasicInfoForm';
import { ProgressSteps } from '@/app/components/layout/FormProgress';

// Types for form data
interface FormData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    // Add more fields as needed
  };
  workHistory?: {
    // Work history fields
  };
  education?: {
    // Education fields
  };
  // Add more sections as needed
}

export default function ApplyJobPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [jobTitle, setJobTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetchPosition(jobId);
        if (response) {
          setJobTitle(response.jobPosition);
        }
      } catch (err) {
        setError('Failed to load job details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Form steps configuration - you can add more steps here
  const formSteps: FormStep[] = [
    {
      id: 1,
      title: "ข้อมูลเบื้องต้น",
      description: "กรอกข้อมูลให้ครบถ้วน",
      component: BasicInfoForm // You'll create this component later
    },
    {
      id: 2,
      title: "ข้อมูลส่วนตัว",
      description: "กรอกข้อมูลให้ครบถ้วน",
      component: PersonalInfoForm // You'll create this component later
    },
    {
      id: 3,
      title: "ที่อยู่",
      description: "กรอกข้อมูลให้ครบถ้วน",
      component: PersonalInfoForm // You'll create this component later
    },
    {
      id: 4,
      title: "ข้อมูลอื่น ๆ",
      description: "กรอกข้อมูลให้ครบถ้วน",
      component: PersonalInfoForm // You'll create this component later
    },
  ];

  // Update form data
  const updateFormData = (sectionKey: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        ...data
      }
    }));
  };

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

  // Form submission
  const handleSubmit = async () => {
    try {
      // Add your submission logic here
      console.log('Form data to submit:', formData);
      // await submitApplication(jobId, formData);
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  if (loading) return <span className="loader"></span>;
  if (error) return <div>Error: {error}</div>;

  const CurrentStepComponent = formSteps[currentStep].component;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressSteps currentStep={currentStep} steps={formSteps}/>
      <div className="flex">
        <span className="loader"></span>
        <span className="loader"></span>
        <span className="loader"></span>
      </div>

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