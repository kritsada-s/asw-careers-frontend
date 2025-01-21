import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import React, { useCallback, useContext } from 'react';
import gsap from 'gsap';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useRef, useState } from 'react';
import ProgressSteps from '../../components/layout/FormProgress';
import FileUploadButton from '../../components/ui/FileUploadButton';
import { DistrictSelector, ProvinceSelector, SubDistrictSelector } from '../../components/ui/FormInput';
import Select, { StylesConfig } from 'react-select';
import { districts, provinces, subDistricts } from '@/lib/data';
//import BuddhistDatePicker from '../../components/ui/DatePicker';
import useSubmitJobApplication, { useEducations, useJobTitle, useTitles, useGenders, useMaritalStatus, useSourceInformation } from '../../hooks/useDataFetching';
import { useSearchParams } from 'next/navigation';
import CustomDatePicker from '../../components/ui/DatePicker';
import CandidateLanguage from '../../components/ui/CandidateLanguage';
import { CandidateLanguageProps } from '@/lib/types';
import { DeleteIcon, Loader2, X } from 'lucide-react';
import { Alert, Chip, FormControl, FormHelperText, OutlinedInput, Snackbar, TextField } from '@mui/material';
import { useFormControl } from '@mui/material/FormControl';
import { Candidate } from '@/lib/form';
import { AuthContext } from '../providers'
import { decrypt, prodUrl } from '@/lib/utils';
import axios from 'axios';
import router from 'next/router';

gsap.registerPlugin(useGSAP);

const districtSelectorStyle: StylesConfig<Option, false> = {
  input: (base) => ({
    ...base,
    //height: 38,
  }),
}

interface Step {
  title: string;
  isCompleted: boolean;
  ref: React.RefObject<HTMLElement>;
}

interface Option {
  value: number;
  label: string;
  postCode?: string;
}

interface Education {
  educationID: number;
  description: string;
}

function Client() {
  // Create refs for each section
  const basicInfoRef = useRef<HTMLElement>(null);
  const personalInfoRef = useRef<HTMLElement>(null);
  const addressInfoRef = useRef<HTMLElement>(null);
  const otherInfoRef = useRef<HTMLElement>(null);
  const provinceSelect = useRef<any>(null);
  const districtSelect = useRef<any>(null);
  const subDistrictSelect = useRef<any>(null);

  const [isLastStep, setIsLastStep] = useState(false);
  const steps: Step[] = [
    { title: 'เบื้องต้น', isCompleted: false, ref: basicInfoRef },
    { title: 'ข้อมูลส่วนตัว', isCompleted: false, ref: personalInfoRef },
    { title: 'ที่อยู่', isCompleted: false, ref: addressInfoRef },
    { title: 'อื่นๆ', isCompleted: false, ref: otherInfoRef }
  ];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [province, setProvince] = useState<number>(0);
  const [district, setDistrict] = useState<number>(0);
  const [subDistrict, setSubDistrict] = useState<number>(0);
  const [postcode, setPostcode] = useState<string>('');
  const params = useSearchParams();
  const [jobTitle, setJobTitle] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { educations } = useEducations();
  const { genders } = useGenders();
  const [education, setEducation] = useState<Education | null>(null);
  const [candidateLanguages, setCandidateLanguages] = useState<CandidateLanguageProps[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('เกิดข้อผิดพลาด');
  const [snackBarType, setSnackBarType] = useState<'success' | 'error'>('error');
  const { jobTitle: position } = useJobTitle(params.get('id') || '');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const { titles } = useTitles();
  const [title, setTitle] = useState<number>(0);
  const [gender, setGender] = useState<number>(0);
  const { maritalStatuses } = useMaritalStatus();
  const [maritalStatus, setMaritalStatus] = useState<number>(0);
  const authContext = useContext(AuthContext);
  const email = authContext?.email;
  const { sourceInformations } = useSourceInformation();
  const [sourceInformation, setSourceInformation] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidateID, setCandidateID] = useState<string>('');
  const { submitApplication } = useSubmitJobApplication(sessionStorage.getItem('jobId') as string, candidateID as string);

  const languageLevelLabel = [{
    value: 1,
    label: 'พอใช้'
  }, {
    value: 2,
    label: 'ดี'
  }, {
    value: 3,
    label: 'ดีมาก'
  }, {
    value: 4,
    label: 'เชี่ยวชาญ'
  }]

  useGSAP(() => {
    // Hide all sections except first on start
    setCurrentStepIndex(0);
    setIsLastStep(false);
    steps.forEach((step, index) => {
      if (index === 0) {
        gsap.set(step.ref.current, { opacity: 1, x: 0, display: 'block' });
      } else {
        gsap.set(step.ref.current, { opacity: 0, x: 50, display: 'none' });
      }
    });
  }, []);

  const handleSectionTransition = (direction: 'next' | 'previous') => {
    if (direction === 'next') {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        // Hide current section
        gsap.to(currentStep.ref.current, {
          opacity: 0,
          x: -50,
          display: 'none',
          duration: 0.3,
          ease: "power2.inOut"
        });

        // Show next section
        gsap.to(steps[nextIndex].ref.current, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: "power2.inOut",
          display: 'block',
          delay: 0.33
        });

        setCurrentStepIndex(nextIndex);
        setIsLastStep(nextIndex === steps.length - 1);
      }
    } else {
      const prevIndex = currentStepIndex - 1;
      if (prevIndex >= 0) {
        // Hide current section
        gsap.to(currentStep.ref.current, {
          opacity: 0,
          x: 50,
          duration: 0.3,
          ease: "power2.inOut",
          display: 'none'
        });

        // Show previous section
        gsap.to(steps[prevIndex].ref.current, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          delay: 0.33,
          ease: "power2.inOut",
          display: 'block'
        });

        setCurrentStepIndex(prevIndex);
        setIsLastStep(false);
      }
    }
  }

  const checkInvalidFields = useCallback(() => {
    const currentStepRef = currentStep.ref.current;
    let hasEmptyFields = false;
    const newInvalidFields: string[] = [];

    if (currentStepRef) {
      const inputs = currentStepRef.querySelectorAll('input, select');
      
      inputs.forEach((input: Element) => {
        const inputElement = input as HTMLInputElement | HTMLSelectElement;
        const { name, value, required } = inputElement;
        
        // Only validate if the field is required or has the required attribute
        if (required && (!value || value.trim() === '')) {
          hasEmptyFields = true;
          newInvalidFields.push(name);
        }
      });

      // Additional validation for specific steps
      if (currentStepIndex === 0) {
        // Basic Info validation
        if (!profileImage) {
          hasEmptyFields = true;
          newInvalidFields.push('profile-image');
        }
        if (!resumeFile) {
          hasEmptyFields = true;
          newInvalidFields.push('resume');
        }
      } else if (currentStepIndex === 1) {
        // Personal Info validation
        if (!birthDate) {
          hasEmptyFields = true;
          newInvalidFields.push('birthDate');
        }
        if (!gender) {
          hasEmptyFields = true;
          newInvalidFields.push('gender');
        }
      } else if (currentStepIndex === 2) {
        // Address validation
        if (!province || !district || !subDistrict) {
          hasEmptyFields = true;
          if (!province) newInvalidFields.push('province');
          if (!district) newInvalidFields.push('district');
          if (!subDistrict) newInvalidFields.push('subDistrict');
        }
      } else if (currentStepIndex === 3) {
        // Other Info validation
        if (!education) {
          hasEmptyFields = true;
          newInvalidFields.push('education');
        }
      }

      setInvalidFields(newInvalidFields);
    }

    return hasEmptyFields;
  }, [currentStepIndex, profileImage, resumeFile, birthDate, gender, province, district, subDistrict, education]);

  const handleNext = () => {    
    if (checkInvalidFields()) {
      setSnackbarMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      setSnackbarOpen(true);
      return;
    }
    handleSectionTransition('next');
  };

  const handlePrevious = () => {
    handleSectionTransition('previous');
  };

  const handleResumeFileChange = (file: File) => {
    if (!['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setSnackbarMessage('ไฟล์ต้องเป็น PDF, JPG หรือ JPEG');
      setSnackbarOpen(true);
      return;
    }
    setResumeFile(file);
    //console.log(file.name);
  };

  const handleProvinceChange = (province: any) => {
    setProvince(province.value);
    setDistrict(0);
    setSubDistrict(0);
    setPostcode('');
  };

  const handleDistrictChange = (district: any) => {
    setDistrict(district.value);
  };

  const handleSubDistrictChange = (subDistrict: any) => {
    setSubDistrict(subDistrict.value);
    setPostcode(subDistrict.postCode);
    console.log(subDistrict.postCode);
  };

  const setInvalidField = (field: string) => {
    if (!invalidFields.includes(field)) {
      setInvalidFields([...invalidFields, field]);
    }
  };

  const removeInvalidField = (field: string) => {
    setInvalidFields(invalidFields.filter(f => f !== field));
  };

  const handleValidateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setInvalidField(event.target.name);
    } else {
      removeInvalidField(event.target.name);
    }
  };

  const handleProfileImageChange = (file: File) => {
    setProfileImage(file);
  };

  const handleBirthDateChange = (date: Date | null) => {
    console.log(date);
    if (date instanceof Date && !isNaN(date.getTime())) {
      setBirthDate(date);
    }
  };

  const handleTitleChange = (title: any) => {
    setTitle(title.value);
  };

  const handleGenderChange = (gender: any) => {
    setGender(gender.value);
  };

  const handleEducationChange = (education: any) => {
    setEducation(education.value);
  };

  const handleMaritalStatusChange = (maritalStatus: any) => {
    setMaritalStatus(maritalStatus.value);
  };

  const handleSourceInformationChange = (sourceInformation: any) => {
    setSourceInformation(sourceInformation.value);
  };

  const handleLanguageAdd = (language: CandidateLanguageProps) => {
    if (language.languageID === 0 || language.level === 0) {
      setSnackbarMessage('กรุณาเลือกภาษาและระดับภาษา');
      setSnackBarType('error');
      setSnackbarOpen(true);
      return;
    }
    if (candidateLanguages.find(l => l.languageID === language.languageID)) {
      setSnackbarMessage('ภาษานี้มีอยู่ในรายการแล้ว');
      setSnackBarType('error');
      setSnackbarOpen(true);
      return;
    }
    setCandidateLanguages([...candidateLanguages, language]);
  };

  const handleLanguageDelete = (languageID: number) => {
    setCandidateLanguages(candidateLanguages.filter(l => l.languageID !== languageID));
  };

  function FormInputHelper() {
    const { focused } = useFormControl() || {};
    const helperText = React.useMemo(() => {
      if (focused) {
        return 'This field is being focused';
      }
  
      return 'Helper text';
    }, [focused]);
  
    return <FormHelperText>{helperText}</FormHelperText>;
  }

  const handleSubmitProfile = async () => {
    setIsSubmitting(true);
    const form = document.querySelector('form');
    const formData = new FormData(form as HTMLFormElement);

    const formDataToSend = new FormData();

    // Basic Info
    formDataToSend.append('Candidate.Image', profileImage as File);
    formDataToSend.append('Candidate.FirstName', formData.get('firstname') as string);
    formDataToSend.append('Candidate.LastName', formData.get('lastname') as string); 
    formDataToSend.append('Candidate.Email', authContext?.email || '');
    formDataToSend.append('Candidate.Tel', formData.get('phone') as string);
    formDataToSend.append('Candidate.CV', resumeFile as File);

    // Personal Info
    formDataToSend.append('Candidate.TitleID', title.toString());
    formDataToSend.append('Candidate.Nickname', formData.get('nickname') as string);
    formDataToSend.append('Candidate.DateOfBirth', birthDate?.toISOString() || '');
    formDataToSend.append('Candidate.Gender.GenderID', gender.toString());
    formDataToSend.append('Candidate.MaritalStatus.MaritalStatusID', maritalStatus.toString());

    // Address Info
    formDataToSend.append('Candidate.AddressDetails', formData.get('address') as string);
    formDataToSend.append('Candidate.Province.ProvinceID', province.toString());
    formDataToSend.append('Candidate.District.DistrictID', district.toString());
    formDataToSend.append('Candidate.Subdistrict.SubDistrictID', subDistrict.toString());
    formDataToSend.append('Candidate.PostalCode', postcode.toString());
    formDataToSend.append('Candidate.SourceInformation.SourceInformationID', sourceInformation.toString());
    // Other Info
    formDataToSend.append('Candidate.CandidateEducations[0].educationID', education?.toString() || '0');
    formDataToSend.append('Candidate.CandidateEducations[0].major', formData.get('major') as string);
    formDataToSend.append("Candidate.PDPAAccepted", "true");
    formDataToSend.append("Candidate.PDPAAcceptedDate", new Date().toISOString());
    candidateLanguages.map((language, index) => {
      formDataToSend.append(`Candidate.CandidateLanguages[${index}].languageID`, language.languageID.toString());
      formDataToSend.append(`Candidate.CandidateLanguages[${index}].level`, language.level.toString());
    });

    // TODO: Add API call to submit data
    try {
      const response = await axios.post(`${prodUrl}/secure/Candidate/Create`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.status !== 200) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitting(false);

      if (response.data) {
        authContext?.handleUpdateToken(response.data);

        setSnackbarMessage('บันทึกข้อมูลสำเร็จ');
        setSnackBarType('success');
        setSnackbarOpen(true);

        if (sessionStorage.getItem('jobId')) {
          router.push(`/jobs?jobId=${sessionStorage.getItem('jobId')}`);
        } else {
          router.push('/profile');
        }
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbarMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setSnackbarOpen(true);
      setSnackBarType('error');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (currentStep) {
      const currentStepRef = currentStep.ref.current;
      const fields = currentStepRef?.querySelectorAll('input, select');
      if (fields) {
        // console.log('==============');
        // fields.forEach(field => {
        //   console.log((field as HTMLInputElement).name);
        // });
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (position) {
      setJobTitle(position);
    }
  }, [position]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <div className="max-w-4xl mx-auto p-6">
        <ProgressSteps currentStep={currentStepIndex} steps={steps} />
        <h2 className="text-4xl font-medium text-center mt-4 mb-3">สร้างโปรไฟล์ใหม่</h2>
        <form className="space-y-4">
          <div className="form-wrapper min-h-[300px]">
            {/* Basic Information Section */}
            <section ref={basicInfoRef} className={`bg-white px-6 py-10 rounded-lg shadow relative`}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/5">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-52 bg-gray-100 rounded mb-4 flex items-center justify-center border border-gray-300">
                      { profileImage ? (
                        <Image src={URL.createObjectURL(profileImage)} width={350} height={480} alt="Profile Image" className="w-full h-full object-cover rounded-sm" />
                      ) : (
                        <span className="text-gray-400">รูปภาพประจำตัว</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
                      className="hidden"
                      id="profile-image" 
                      name="profile-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 1024 * 1024) { // Check if file size > 1MB
                            setSnackbarMessage('ขนาดไฟล์ไม่เกิน 1MB');
                            setSnackBarType('error');
                            setSnackbarOpen(true);
                            e.target.value = ''; // Clear the input
                            return;
                          }
                          handleProfileImageChange(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="profile-image"
                      className="bg-primary-700 !text-base text-white px-4 py-1 rounded cursor-pointer"
                    >
                      อัพโหลดรูปภาพ <span className="text-red-500">*</span>
                    </label>
                    <FormHelperText>ขนาดไฟล์ไม่เกิน 1MB</FormHelperText>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <label htmlFor="experience" className="block mb-1">ประสบการณ์การทำงาน (ปี) <span className="text-red-500">*</span></label>
                    <TextField 
                      id="experience"
                      name="experience"
                      type="number" 
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          max: 100,
                          pattern: '[0-9]*',
                          defaultValue: '0'
                        }
                      }}
                      required
                      defaultValue="0"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        handleValidateField(e as React.ChangeEvent<HTMLInputElement>);
                        const value = e.target.value;
                        if (parseInt(value) > 100) {
                          alert('this field allow only 0-100');
                          e.target.value = '0';
                        }
                      }}
                    />
                    {invalidFields.includes('experience') && <p className="text-red-500 text-sm">กรุณากรอกข้อมูล</p>}
                  </div>
                  <div>
                    <label className="block mb-1">ค่าจ้างที่คาดหวัง <span className="text-red-500">*</span></label>
                    <TextField
                      id="salary"
                      name="salary"
                      type="text"
                      inputMode="numeric"
                      slotProps={{
                        htmlInput: {
                          pattern: '[0-9]*',
                          min: 0,
                          required: true
                        }
                      }}
                      required
                      onChange={(e) => {
                        handleValidateField(e as React.ChangeEvent<HTMLInputElement>);
                        const value = e.target.value.replace(/[^0-9,]/g, '').replace(/,/g, '');
                        if (value) {
                          e.target.value = Number(value).toLocaleString();
                        }
                      }}
                    />
                    {invalidFields.includes('salary') && <p className="text-red-500 text-sm">กรุณากรอกข้อมูล</p>}
                  </div>
                  <div>
                    <label className="block mb-1">เอกสารประกอบการสมัคร (CV/Resume) <span className="text-red-500">*</span> <span className="text-xs font-normal text-gray-500">ขนาดไฟล์ไม่เกิน 5 MB</span></label>
                    <div className="flex items-center gap-2">
                      <FileUploadButton onChange={handleResumeFileChange} file={resumeFile} />
                    </div>
                    {invalidFields.includes('resume') && <p className="text-red-500 text-sm">กรุณาอัพโหลดไฟล์</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Information Section */}
            <section ref={personalInfoRef} className={`bg-white p-6 rounded-lg shadow relative`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xl mb-4">
                <div>
                  <label className="block mb-1">ชื่อ <span className="text-red-500">*</span></label>
                  <input type="text" required id="firstname" name="firstname" className="w-full border rounded p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block mb-1">นามสกุล <span className="text-red-500">*</span></label>
                  <input type="text" required id="lastname" name="lastname" className="w-full border rounded p-2 border-gray-300" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xl">
                <div>
                  <label className='block mb-1'>คำนำหน้า <span className="text-red-500">*</span></label>
                  <Select<Option>
                    instanceId="title-select"
                    options={titles.map(title => ({
                      value: title.titleID,
                      label: title.nameTH
                    }))}
                    onChange={(selectedOption) => {
                      handleTitleChange(selectedOption as Option);
                    }}
                    placeholder="เลือกคำนำหน้า"
                    styles={districtSelectorStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1">เพศ <span className="text-red-500">*</span></label>
                  <Select<Option>
                    options={genders.map(gender => ({
                      value: gender.genderID,
                      label: gender.description
                    }))}
                    onChange={(selectedOption) => {
                      handleGenderChange(selectedOption as Option);
                    }}
                    placeholder="เลือกเพศ"
                    styles={districtSelectorStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1">ชื่อเล่น <span className="text-red-500">*</span></label>
                  <input type="text" required id="nickname" name="nickname" className="w-full border rounded p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block mb-1">วันเกิด(ปี ค.ศ.) <span className="text-red-500">*</span></label>
                  <CustomDatePicker onBlur={handleBirthDateChange} />
                </div>
                <div>
                  <label className="block mb-1">สถานะสมรส <span className="text-red-500">*</span></label>
                  <Select<Option>
                    options={maritalStatuses.map(maritalStatus => ({
                      value: maritalStatus.maritalStatusID,
                      label: maritalStatus.description
                    }))}
                    onChange={(selectedOption) => {
                      handleMaritalStatusChange(selectedOption as Option);
                    }}
                    placeholder="เลือกสถานะสมรส"
                    styles={districtSelectorStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                  <input type="tel" required id="phone" name="phone" className="w-full border rounded p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block mb-1">อีเมล <span className="text-red-500">*</span></label>
                  <input type="email" required id="email" name="email" className="w-full bg-neutral-100 text-neutral-500 border rounded p-2 border-gray-300" disabled value={email}/>
                  <span className="text-gray-500 text-sm">อีเมลไม่สามารถแก้ไขได้</span>
                </div>
              </div>
            </section>

            {/* Address Information Section */}
            <section ref={addressInfoRef} className={`bg-white p-6 rounded-lg shadow relative`} >
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">ที่อยู่ <span className="text-red-500">*</span></label>
                  <input type="text" required id="address" name="address" className="w-full h-[50px] border border-gray-300 rounded px-2 py-1 text-xl" />
                </div>
                <div className="custom-selector grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block mb-1">จังหวัด <span className="text-red-500">*</span></label>
                    <Select<Option>
                      instanceId="province-select"
                      options={provinces.map(province => ({
                        value: province.ProvinceID,
                        label: province.NameTH
                      }))}
                      onChange={(selectedOption) => {
                        handleProvinceChange(selectedOption as Option);
                      }}
                      placeholder="เลือกจังหวัด"
                      styles={districtSelectorStyle}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">อำเภอ <span className="text-red-500">*</span></label>
                    <Select<Option>
                      ref={districtSelect}
                      instanceId="district-select"
                      options={districts
                        .filter((district) => district.ProvinceID === province)
                        .map((district) => ({
                          value: district.DistrictID,
                          label: district.NameTH
                        }))}
                      value={district ? {
                        value: district,
                        label: districts.find(d => d.DistrictID === district)?.NameTH || ''
                      } as Option : null}
                      onChange={(selectedOption) => handleDistrictChange(selectedOption as Option)}
                      placeholder="เลือกอำเภอ"
                      styles={districtSelectorStyle}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">ตำบล <span className="text-red-500">*</span></label>
                    <Select<Option>
                      ref={subDistrictSelect}
                      instanceId="sub-district-select"
                      options={subDistricts
                        .filter((subDistrict) => subDistrict.DistrictID === district)
                        .map((subDistrict) => ({
                          value: subDistrict.SubDistrictID,
                          label: subDistrict.NameTH,
                          postCode: subDistrict.PostCode.toString()
                        }))}
                      value={subDistrict ? {
                        value: subDistrict,
                        label: subDistricts.find(s => s.SubDistrictID === subDistrict)?.NameTH || '',
                        postCode: subDistricts.find(s => s.SubDistrictID === subDistrict)?.PostCode || ''
                      } as Option : null}
                      onChange={(selectedOption) => handleSubDistrictChange(selectedOption as Option)}
                      placeholder="เลือกตำบล"
                      styles={districtSelectorStyle}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">รหัสไปรษณีย์</label>
                    <input type="text" name="zipcode" className="w-full h-[50px] border rounded px-2 py-1 text-xl bg-neutral-200 text-neutral-400 border-gray-300" value={postcode || ''} disabled />
                  </div>
                </div>
              </div>
            </section>

            {/* Other Information Section */}
            <section ref={otherInfoRef} className={`bg-white p-6 rounded-lg shadow relative`}>
              <div className="space-y-6">
                <div>
                  <label className='block mb-1'>ท่านทราบข่าวการสมัครงานจากช่องทางใด <span className="text-red-500">*</span></label>
                  <Select<Option>
                    options={sourceInformations.map(sourceInformation => ({
                      value: sourceInformation.sourceInformationID,
                      label: sourceInformation.description
                    }))}
                    onChange={(selectedOption) => {
                      handleSourceInformationChange(selectedOption as Option);
                    }}
                    placeholder="เลือกช่องทาง"
                    styles={districtSelectorStyle}
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-2">ประวัติการศึกษา <span className="text-red-500">*</span></h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="custom-selector">
                        <label className="block mb-1">ระดับการศึกษา</label>
                        <Select<Option>
                          options={educations.map(education => ({
                            value: education.educationID,
                            label: education.description
                          }))}
                          instanceId="education-level"
                          onChange={(selectedOption) => {
                            handleEducationChange(selectedOption as Option);
                          }}
                          placeholder="เลือกระดับการศึกษา"
                          styles={districtSelectorStyle}
                        />
                      </div>
                      <div>
                        <label className="block mb-1">สาขาวิชา</label>
                        <input type="text" name="major" className="w-full border border-gray-300 rounded p-2" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">ภาษา <span className="text-red-500">*</span></h3>
                  <div className="flex flex-col gap-4">
                    <div className="language-list">
                      <div className="flex flex-wrap gap-2">
                        {candidateLanguages.map((language, index) => (
                          <Chip key={index} label={`${language.languageName} - ${languageLevelLabel[language.level - 1].label}`} onDelete={() => handleLanguageDelete(language.languageID)} />
                        ))}
                      </div>
                    </div>
                    <CandidateLanguage handleLanguageAdd={handleLanguageAdd} />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end space-x-4">
            {currentStepIndex > 0 && (
              <button
                type="button"
                className="px-6 py-2 border rounded"
                onClick={handlePrevious}
              >
                ก่อนหน้า
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                className="px-6 py-2 bg-blue-500 text-white rounded"
                onClick={handleSubmitProfile}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin " /> : 'ส่งข้อมูล'}
              </button>
            ) : (
              <button
                type="button"
                className="px-6 py-2 bg-blue-500 text-white rounded"
                onClick={handleNext}
              >
                ต่อไป
              </button>
            )}
          </div>
          <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setSnackbarOpen(false)} autoHideDuration={4500}>
            <Alert severity={snackBarType} onClose={() => setSnackbarOpen(false)} variant="filled">
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </form>
      </div>
    </LocalizationProvider>
  );
}

export default Client;