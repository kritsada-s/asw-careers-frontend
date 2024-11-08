"use client";
import { fetchPosition } from '@/lib/api';
import { Position, ApplicationFormData } from '@/lib/types';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import BasicInfoForm from '@/app/components/form/BasicInfoForm';
import PersonalInfoForm from '@/app/components/form/PersonalInfoForm';
import AddressInfoForm from '@/app/components/form/AddressInfoForm';
import OthersInfoForm from '@/app/components/form/OthersInfoForm';
import { ProgressSteps } from '@/app/components/layout/FormProgress';
import { useApplicationForm } from '@/app/hooks/useForm';
import Crypt from '@/lib/Crypt';
import { prodUrl } from '@/lib/utils';
import axios from 'axios';
import FormData from 'form-data';
import useToken from '@/app/hooks/useToken';

const FORM_STEPS = [
  { id: 'basic', title: 'ข้อมูลเบื้องต้น' },
  { id: 'personal', title: 'ข้อมูลส่วนตัว' },
  { id: 'address', title: 'ที่อยู่' },
  { id: 'others', title: 'ข้อมูลเพิ่มเติม' }
] as const;

const ApplyJobPage = () => {
  const params = useParams();
  const jobId = params.id as string;
  
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [decryptedToken, setDecryptedToken] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [position, setPosition] = useState<Position | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = useToken();

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
      birthDate: new Date('1991-12-13 05:30').toISOString(),
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
  }, [updateField]);

  useEffect(() => {
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
  }, [token]);

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
      const apiFormData = new FormData();
      apiFormData.append('JobID', jobId);
      //apiFormData.append('JobID', 3);
      apiFormData.append('Candidate.CandidateID', decryptedToken.CandidateID);
      //apiFormData.append('Candidate.Revision', '1');
      apiFormData.append('Candidate.Email', decryptedToken.Email);
      apiFormData.append('Candidate.TitleID', 1);
      apiFormData.append('Candidate.FirstName', formData.firstName);
      apiFormData.append('Candidate.LastName', formData.lastName);
      apiFormData.append('Candidate.NickName', formData.nickname);
      apiFormData.append('Candidate.Tel', formData.phone);
      apiFormData.append('Candidate.DateOfBirth', formData.birthDate);
      apiFormData.append('Candidate.Gender.GenderID', 1);
      apiFormData.append('Candidate.MaritalStatus.MaritalStatusID', 1);
      apiFormData.append('Candidate.Image', formData.profileImage);
      apiFormData.append('Candidate.CV', formData.cv);
      apiFormData.append('Candidate.AddressDetails', formData.addressLine1 + ', ' + formData.addressLine2);
      apiFormData.append('Candidate.Province.ProvinceID', formData.province ? Number(formData.province) : 1);
      apiFormData.append('Candidate.District.DistrictID', formData.district ? Number(formData.district) : 1001);
      apiFormData.append('Candidate.District.ProvinceID', formData.district ? Number(formData.district) : 1001);
      apiFormData.append('Candidate.Subdistrict.SubdistrictID', formData.subdistrict ? Number(formData.subdistrict) : 100101);
      apiFormData.append('Candidate.Subdistrict.DistrictID', formData.district ? Number(formData.district) : 1001);
      apiFormData.append('Candidate.Subdistrict.PostCode', formData.postalCode ? Number(formData.postalCode) : 10200);
      apiFormData.append('Candidate.PostalCode', formData.postalCode ? Number(formData.postalCode) : 10200);
      apiFormData.append('Candidate.SourceInformation.SourceInformationID', 1);
      apiFormData.append('Candidate.PDPAAccepted', true);
      apiFormData.append('Candidate.PDPAAcceptedDate', new Date().toISOString());
      apiFormData.append('Candidate.CandidateEducations[0].EducationID', formData.education ? Number(formData.education) : 1);
      apiFormData.append('Candidate.CandidateEducations[0].Major', 'computer science');
      //apiFormData.append('Candidate.CandidateLanguages[0].LanguageID', formData.language ? Number(formData.language) : 1);

      // for (let pair of apiFormData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const config = {
        method: 'POST',
        contentType: 'multipart/form-data',
        url: prodUrl+'/secure/Candidate/Create',
        //url: 'https://7125-202-80-250-90.ngrok-free.app/secure/Candidate/Create',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        data: apiFormData,
        validateStatus: () => true,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      };

      console.log('Auth Token:', authToken);
      console.log('Request URL:', config.url);
      console.log('Request Headers:', config.headers);

      const response = await axios.request(config);
      
      if (response.status !== 200) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      console.log('Success Response:', response.data);
      
    } catch (error) {
      console.error('Submission error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      }
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
        isLastStep: false,
        decryptedToken // Pass the authToken to this component
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

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplyJobPage />
    </Suspense>
  )
}

export default App;