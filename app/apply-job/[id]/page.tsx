"use client";
import { fetchedJobs, fetchPosition } from '@/lib/api';
import { Position, ApplicationFormData, FormField } from '@/lib/types';
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
//import FormData from 'form-data';
import { useToken } from '@/app/hooks/useToken';
import LoaderHorizontal from '@/app/components/ui/loader';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import { useFetchBase64Image, useUserProfile } from '@/app/hooks/useDataFetching';
import { Dialog } from '@mui/material';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const FORM_STEPS = [
  { id: 'basic', title: 'ข้อมูลเบื้องต้น' },
  { id: 'personal', title: 'ข้อมูลส่วนตัว' },
  { id: 'address', title: 'ที่อยู่' },
  { id: 'others', title: 'ข้อมูลเพิ่มเติม' }
] as const;

export async function generateStaticParams() {
  try {
    const response = await fetchedJobs();
    return response.jobs.map((job) => ({
      id: job.jobID,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

const ApplyJobPage = () => {
  const params = useParams();
  const jobId = params.id as string;
  
  const [authToken, setAuthToken] = useState<string>('');
  const [decryptedToken, setDecryptedToken] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [position, setPosition] = useState<Position | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = useToken();
  const requiredFields: FormField[] = ['expectedSalary', 'experience', 'firstName', 'lastName', 'nickname', 'phone', 'birthDate', 'addressLine1', 'province', 'district', 'postalCode'];
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
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
      nickname: 'John',
      phone: '0891234567',
      birthDate: '1991-12-13',
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

  const { profile, isLoading: isLoadingProfile, error } = useUserProfile(decryptedToken?.Email);

  // const prefillFormWithUserData = useCallback(() => {
  //   //updateField('profileImage', profile?.imageUrl);
  //   updateField('profileImagePath', profile?.imageUrl);
  //   updateField('cvPath', profile?.cvUrl);
  //   updateField('firstName', profile?.firstName);
  //   updateField('lastName', profile?.lastName);
  //   updateField('nickname', profile?.nickName);
  //   updateField('gender', profile?.gender.genderID ? profile?.gender.genderID : undefined);
  //   updateField('maritalStatus', profile?.maritalStatus.maritalStatusID ? profile?.maritalStatus.maritalStatusID : undefined);
  //   updateField('phone', profile?.tel);
  //   updateField('birthDate', profile?.dateOfBirth ? new Date(profile?.dateOfBirth).toISOString().substring(0, 10) : null);
  //   updateField('addressLine1', profile?.addressDetails ? profile?.addressDetails : '');
  //   updateField('province', profile?.province.provinceID ? profile?.province.provinceID : undefined);
  //   updateField('district', profile?.district.districtID ? profile?.district.districtID : undefined);
  //   updateField('subdistrict', profile?.subdistrict.subDistrictID ? profile?.subdistrict.subDistrictID : undefined);
  //   updateField('postalCode', profile?.postalCode ? profile?.postalCode : undefined);
  //   updateField('education', profile?.candidateEducations[0]?.educationID ? profile?.candidateEducations[0]?.educationID : undefined);
  //   updateField('refferedBy', profile?.sourceInformation.sourceInformationID ? profile?.sourceInformation.sourceInformationID : undefined);
  // }, [profile, updateField]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      //console.log(authToken);
      if (!authToken) {
        window.location.href = '/'; // Redirect to home page if authToken does not exist
      } else {
        setAuthToken(authToken);
        setIsLoading(false);
        setIsAuthenticated(true); // Set authenticated state if token exists
        setDecryptedToken(Crypt(authToken));
      }
    }
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

  // useEffect(() => {
  //   prefillFormWithUserData();
  // }, [prefillFormWithUserData]);

  const handleNext = useCallback(() => {
    //const hasErrors = requiredFields.some(field => !formData[field]);
    const hasErrors = false;

    requiredFields.forEach(field => {
      if (!formData[field]) {
        //console.log(`Field ${field} is missing in formData`);
      }
    });
    
    if (!hasErrors) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length - 1));
    } else {
      requiredFields.forEach(field => markFieldTouched(field));
    }
  }, [formData, markFieldTouched, requiredFields]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = async () => {
    try {
      const apiFormData = new FormData();
      apiFormData.append('JobID', jobId);
      //apiFormData.append('JobID', 3);
      apiFormData.append('Candidate.CandidateID', decryptedToken.CandidateID);
      //apiFormData.append('Candidate.Revision', '1');
      apiFormData.append('Candidate.Email', decryptedToken.Email);
      apiFormData.append('Candidate.TitleID', '1');
      apiFormData.append('Candidate.FirstName', formData.firstName || '');
      apiFormData.append('Candidate.LastName', formData.lastName || '');
      apiFormData.append('Candidate.NickName', formData.nickname || '');
      apiFormData.append('Candidate.Tel', formData.phone || '');
      apiFormData.append('Candidate.DateOfBirth', formData.birthDate ? new Date(formData.birthDate).toISOString() : '');
      apiFormData.append('Candidate.Gender.GenderID', '1');
      apiFormData.append('Candidate.MaritalStatus.MaritalStatusID', '1');
      apiFormData.append('Candidate.Image', formData.profileImage || '');
      apiFormData.append('Candidate.CV', formData.cv || '');
      apiFormData.append('Candidate.AddressDetails', formData.addressLine1 || '');
      apiFormData.append('Candidate.Province.ProvinceID', String(formData.province ? formData.province : '1'));
      apiFormData.append('Candidate.District.DistrictID', String(formData.district ? formData.district : '1001'));
      apiFormData.append('Candidate.Subdistrict.SubdistrictID', String(formData.subdistrict ? formData.subdistrict : '100101'));
      apiFormData.append('Candidate.PostalCode', String(formData.postalCode ? formData.postalCode : '10200'));
      apiFormData.append('Candidate.SourceInformation.SourceInformationID', String(formData.refferedBy ? formData.refferedBy : '1'));
      apiFormData.append('Candidate.PDPAAccepted', 'true');
      apiFormData.append('Candidate.PDPAAcceptedDate', new Date().toISOString());
      apiFormData.append('Candidate.CandidateEducations[0].EducationID', String(formData.education ? formData.education : '1'));
      apiFormData.append('Candidate.CandidateEducations[0].Major', formData.major ? formData.major : '');

      const config = {
        method: 'POST',
        contentType: 'multipart/form-data',
        url: prodUrl+'/secure/Candidate/Create',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        data: apiFormData,
        validateStatus: () => true,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      };

      const response = await axios.request(config);
      
      if (response.status === 200) {
        //console.log('Job applied successfully', response.data);
        //console.log('response', response.data);
        localStorage.setItem('authToken', response.data);
        window.location.href = '/profile';
      } else {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        setIsError(true);
        setErrorMessage(response?.data);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        setIsError(true);
        setErrorMessage(error.response?.data.message);
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

  if (isLoading) {
    return <LoaderHorizontal />;
  }

  const CurrentStepComponent = formSteps[currentStep].component;
  const currentStepProps = formSteps[currentStep].props;

  const SuccessMessageModal = () => {
    return (
      <Dialog open={true} onClose={() => {}}>
        <DialogTitle>สมัครงานสำเร็จ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณได้สมัครงานตำแหน่ง {jobTitle} เรียบร้อยแล้ว กรุณารอการติดต่อจากทางบริษัท
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.href = '/profile'}>ดูข้อมูลส่วนตัว</Button>
        </DialogActions>
      </Dialog>
    )
  }

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
      <h2 className="text-[30px] lg:text-[40px] text-gray-600 text-center">
        สมัครงานตำแหน่ง{' '}
        <strong className='text-primary-700 text-[1.2em] relative underline decoration-1'>
          {jobTitle}
        </strong>
      </h2>

      {isError && (
        <Alert color="failure" icon={HiInformationCircle} className='mb-4'>
          <span className="font-medium">{errorMessage}</span>
        </Alert>
      )}

      {/* Form Container */}
      <div className="bg-[#F2F9FF] rounded-lg shadow p-3 lg:p-6">
        <CurrentStepComponent {...currentStepProps}/>
      </div>
      {showSuccessMessage && <SuccessMessageModal />}
    </div>
  );
}

const App = () => {
  return (
    <Suspense fallback={<LoaderHorizontal />}>
      <ApplyJobPage />
    </Suspense>
  )
}
export default App;
