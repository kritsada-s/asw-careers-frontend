// app/apply-job/[id]/page.tsx
"use client";

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApplicationForm } from '@/app/hooks/useForm';
import type { ApplicationFormData } from '@/lib/form';
import BasicInfoForm from '@/app/components/form/BasicInfoForm';
import AddressInfoForm from '@/app/components/form/AddressInfoForm';
import PersonalInfoForm from '@/app/components/form/PersonalInfoForm';
import OthersInfoForm from '@/app/components/form/OthersInfoForm';
import { ProgressSteps } from '@/app/components/layout/FormProgress';
import { FormStep } from '@/lib/types';

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formData,
    updateField,
    markFieldTouched,
    isFieldTouched
  } = useApplicationForm();

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Your submission logic
      
      // After successful submission, redirect or show success
      router.push('/success');
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSteps = [
    {
      component: BasicInfoForm,
      props: {
        jobId: params.id,
        formData,
        updateField,
        markFieldTouched,
        isFieldTouched,
        onNext: handleNext,
        onPrevious: undefined, // First step doesn't need previous
        isSubmitting,
        isFirstStep: true,
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
      component: OthersInfoForm,
      props: {
        formData,
        updateField,
        markFieldTouched,
        isFieldTouched,
        onNext: handleSubmit, // Last step submits instead of going next
        onPrevious: handlePrevious,
        isSubmitting,
        isFirstStep: false,
        isLastStep: true
      }
    }
  ];

  const currentStepProps = formSteps[currentStep].props;
  const CurrentStepComponent = formSteps[currentStep].component;

  const steps:FormStep[] = [
    { id: 1, title: 'ข้อมูลเบื้องต้น' },
    { id: 2, title: 'ที่อยู่' },
    { id: 3, title: 'ข้อมูลส่วนตัว' },
    { id: 4, title: 'ข้อมูลเพิ่มเติม' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressSteps 
        currentStep={currentStep} 
        steps={steps.map((step, index) => ({
          id: step.id,
          title: step.title,
          isCompleted: index < currentStep
        }))} 
      />
      {/* Your form step component */}
      <CurrentStepComponent 
          formData={formData}
          updateField={updateField}
          markFieldTouched={markFieldTouched}
          isFieldTouched={isFieldTouched}
          onNext={
            currentStep === formSteps.length - 1 
              ? handleSubmit 
              : handleNext
          }
          onPrevious={handlePrevious}
          isSubmitting={isSubmitting}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === formSteps.length - 1}
          jobId={params.id as string}
          //jobTitle={jobTitle}
        />
    </div>
  );
}