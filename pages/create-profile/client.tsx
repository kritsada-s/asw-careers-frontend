"use client";

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useRef, useState } from 'react';
import { ProgressSteps } from '../components/layout/FormProgress';
import FileUploadButton from '../components/ui/FileUploadButton';
import { DistrictSelector, ProvinceSelector, SubDistrictSelector } from '../components/ui/FormInput';
import Select, { StylesConfig } from 'react-select';
import { districts, provinces, subDistricts } from '@/lib/data';
import BuddhistDatePicker from '../components/ui/DatePicker';
import { useEducations, useJobTitle } from '../hooks/useDataFetching';
import { useSearchParams } from 'next/navigation';
import CustomDatePicker from '../components/ui/DatePicker';
import CandidateLanguage from '../components/ui/CandidateLanguage';
import { CandidateLanguageProps, Language } from '@/lib/types';

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
  const [education, setEducation] = useState<Education | null>(null);

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

  const handleNext = () => {
    if (invalidFields.length > 0) {
      return;
    }
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
  };

  const handlePrevious = () => {
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
  };

  const handleResumeFileChange = (file: File) => {
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

  const handleEducationChange = (education: any) => {
    setEducation(education.value);
  };

  const handleLanguageChange = (languages: Language[]) => {
    console.log(languages);
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
    const jobId = params.get('id');
    if (jobId) {
      const { jobTitle } = useJobTitle(jobId);
      setJobTitle(jobTitle);
    }
  }, [params]);

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
                <div className="w-1/4">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-52 bg-gray-100 rounded mb-4 flex items-center justify-center border border-gray-300">
                      { profileImage ? (
                        <img src={URL.createObjectURL(profileImage)} alt="Profile Image" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">รูปภาพประจำตัว</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profile-image"
                      name="profile-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleProfileImageChange(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="profile-image"
                      className="bg-primary-700 !text-base text-white px-4 py-1 rounded cursor-pointer"
                    >
                      อัพโหลดรูปภาพ
                    </label>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block mb-1">ประสบการณ์การทำงาน (ปี) <span className="text-red-500">*</span></label>
                    <input
                      name="experience"
                      type="number" 
                      min="0"
                      max="100"
                      required
                      pattern='[0-9]*'
                      onBlur={handleValidateField}
                      defaultValue="0"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (parseInt(value) > 100) {
                          alert('this field allow only 0-100');
                          e.target.value = '0';
                        }
                      }}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                      }}
                      className={`w-full border border-gray-300 rounded-md p-2 text-xl ${invalidFields.includes('experience') ? 'border-red-500' : ''}`}
                    />
                    {invalidFields.includes('experience') && <p className="text-red-500 text-sm">กรุณากรอกข้อมูล</p>}
                  </div>
                  <div>
                    <label className="block mb-1">ค่าจ้างที่คาดหวัง <span className="text-red-500">*</span></label>
                    <input
                      name="salary"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      required
                      onBlur={handleValidateField}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (value) {
                          e.target.value = Number(value).toLocaleString();
                        }
                      }}
                      className={`w-full border border-gray-300 rounded-md p-2 text-xl ${invalidFields.includes('salary') ? 'border-red-500' : ''}`}
                    />
                    {invalidFields.includes('salary') && <p className="text-red-500 text-sm">กรุณากรอกข้อมูล</p>}
                  </div>
                  <div>
                    <label className="block mb-1">เอกสารประกอบการสมัคร (CV/Resume)</label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xl">
                <div>
                  <label className="block mb-1">ชื่อ <span className="text-red-500">*</span></label>
                  <input type="text" name="firstname" className="w-full border rounded p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block mb-1">นามสกุล <span className="text-red-500">*</span></label>
                  <input type="text" name="lastname" className="w-full border rounded p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block mb-1">ชื่อเล่น <span className="text-red-500">*</span></label>
                  <input type="text" name="nickname" className="w-full border rounded p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block mb-1">วันเกิด <span className="text-red-500">*</span></label>
                  <CustomDatePicker />
                </div>
                <div>
                  <label className="block mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" className="w-full border rounded p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block mb-1">อีเมล</label>
                  <input type="email" name="email" className="w-full bg-neutral-100 text-neutral-500 border rounded p-2 border-gray-300" disabled value='test@gmail.com'/>
                  <span className="text-gray-500 text-sm">อีเมลไม่สามารถแก้ไขได้</span>
                </div>
              </div>
            </section>

            {/* Address Information Section */}
            <section ref={addressInfoRef} className={`bg-white p-6 rounded-lg shadow relative`} >
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">ที่อยู่</label>
                  <input type="text" name="address" className="w-full h-[50px] border border-gray-300 rounded px-2 py-1 text-xl" />
                </div>
                <div className="custom-selector grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block mb-1">จังหวัด</label>
                    <Select<Option>
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
                    <label className="block mb-1">อำเภอ</label>
                    <Select<Option>
                      ref={districtSelect}
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
                    <label className="block mb-1">ตำบล</label>
                    <Select<Option>
                      ref={subDistrictSelect}
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
                  <h3 className="font-medium mb-2">ประวัติการศึกษา</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="custom-selector">
                        <label className="block mb-1">ระดับการศึกษา</label>
                        <Select<Option>
                          options={educations.map(education => ({
                            value: education.educationID,
                            label: education.description
                          }))}
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
                  <h3 className="font-medium mb-2">ภาษา</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CandidateLanguage onChange={handleLanguageChange} />
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
                onClick={() => console.log('Submit form')}
              >
                ส่งข้อมูล
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
        </form>
      </div>
    </LocalizationProvider>
  );
}

export default Client;