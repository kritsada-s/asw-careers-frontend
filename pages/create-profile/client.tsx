"use client";

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useRef, useState } from 'react';
import { ProgressSteps } from '../components/layout/FormProgress';
import FileUploadButton from '../components/ui/FileUploadButton';
import { DistrictSelector, ProvinceSelector, SubDistrictSelector } from '../components/ui/FormInput';
import Select, { GroupBase, StylesConfig } from 'react-select';
import { districts, provinces, subDistricts } from '@/lib/data';
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale';
import {DateValue, now, parseAbsoluteToLocal} from "@internationalized/date";
import {I18nProvider} from "@react-aria/i18n";
import { useEducations, useJobTitle } from '../hooks/useDataFetching';
import LanguagesInput from '../components/ui/languagesInput';
import { Language } from '@/lib/types';
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from 'dayjs';

gsap.registerPlugin(useGSAP);
registerLocale('th', th);

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

function Client() {
  // Create refs for each section
  const basicInfoRef = useRef<HTMLElement>(null);
  const personalInfoRef = useRef<HTMLElement>(null);
  const addressInfoRef = useRef<HTMLElement>(null);
  const otherInfoRef = useRef<HTMLElement>(null);
  const provinceSelect = useRef<any>(null);
  const districtSelect = useRef<any>(null);
  const subDistrictSelect = useRef<any>(null);
  const { jobTitle, isLoading, error } = useJobTitle(sessionStorage.getItem('jobId') || '');

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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [educationLevels, setEducationLevels] = useState<any[]>([]);
  const { educations, isLoading: isLoadingEducations, error: errorEducations } = useEducations();
  const [languages, setLanguages] = useState<Language[]>([{ language: '', level: '' }]);
  const [candidate, setCandidate] = useState<any>(null);
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);

  const textFieldStyle = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      fontWeight: 300
    }
  };

  const selectStyles: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (styles) => ({
      ...styles,
      fontSize: '1rem',
      fontWeight: '300',
      borderRadius: '8px'
    })
  };

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
  };

  const setInvalidField = (field: string) => {
    if (!invalidFields.includes(field)) {
      setInvalidFields([...invalidFields, field]);
    }
  };

  const removeInvalidField = (field: string) => {
    setInvalidFields(invalidFields.filter(f => f !== field));
  };

  const handleValidateField = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value === '') {
      setInvalidField(event.target.name);
    } else {
      removeInvalidField(event.target.name);
    }
  };

  const handleLanguagesChange = (languages: Language[]) => {
    console.log(languages);
    setLanguages(languages);
  };

  const handleBirthDateChange = (date: Dayjs | null) => {
    setBirthDate(date);
  };

  const handleFormSubmit = () => {
    console.log('--- submit form ---');
    console.log(candidate);
  }

  useEffect(() => {
    // if (currentStep) {
    //   const currentStepRef = currentStep.ref.current;
    //   const fields = currentStepRef?.querySelectorAll('input, select');
    //   if (fields) {
    //     console.log('==============');
    //     fields.forEach(field => {
    //       console.log((field as HTMLInputElement).name);
    //     });
    //   }
    // }
  }, [currentStep]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th"> 
      <div className="max-w-4xl mx-auto p-6">
        <ProgressSteps currentStep={currentStepIndex} steps={steps} />
        <div className="my-4">
          <h2 className="text-3xl font-medium text-center">สมัครงานตำแหน่ง <span className="text-primary-600 underline">{ jobTitle }</span></h2>
        </div>
        <form className="space-y-4">
          <div className="form-wrapper min-h-[300px]">
            {/* Basic Information Section */}
            <section ref={basicInfoRef} className={`bg-white px-6 py-10 rounded-lg shadow relative`}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-1/4">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-52 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      {profileImage ? (
                        <img src={URL.createObjectURL(profileImage)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">รูปภาพประจำตัว</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      id="profile-image"
                      name="profile-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProfileImage(file);
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      component="label"
                      sx={{
                        bgcolor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark'
                        },
                        minHeight: '45px',
                        px: 2,
                        py: 0.5
                      }}
                      onClick={() => {
                        document.getElementById('profile-image')?.click();
                      }}
                    >
                      อัพโหลดรูปภาพ
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block mb-1 text-xl font-medium">ประสบการณ์การทำงาน (ปี) <span className="text-red-500">*</span></label>
                    <TextField
                      name="experience"
                      type="number"
                      required
                      inputProps={{
                        min: "0",
                        pattern: '[0-9]*'
                      }}
                      onBlur={handleValidateField}
                      error={invalidFields.includes('experience')}
                      helperText={invalidFields.includes('experience') ? "กรุณากรอกข้อมูล" : ""}
                      sx={textFieldStyle}
                      size="small"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value < 0) {
                          e.target.value = '0';
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xl font-medium">ค่าจ้างที่คาดหวัง <span className="text-red-500">*</span></label>
                    <TextField
                      name="salary"
                      required
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: "0"
                      }}
                      size="small"
                      onBlur={handleValidateField}
                      error={invalidFields.includes('salary')}
                      helperText={invalidFields.includes('salary') ? "กรุณากรอกข้อมูล" : ""}
                      sx={textFieldStyle}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (value) {
                          e.target.value = Number(value).toLocaleString();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xl font-medium">เอกสารประกอบการสมัคร (CV/Resume) <span className="text-red-500">*</span></label>
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
                  <TextField
                    name="firstname"
                    required
                    error={invalidFields.includes('firstname')}
                    helperText={invalidFields.includes('firstname') ? "กรุณากรอกข้อมูล" : ""}
                    onBlur={handleValidateField}
                    sx={textFieldStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1">นามสกุล <span className="text-red-500">*</span></label>
                  <TextField
                    name="lastname"
                    required
                    error={invalidFields.includes('lastname')}
                    helperText={invalidFields.includes('lastname') ? "กรุณากรอกข้อมูล" : ""}
                    onBlur={handleValidateField}
                    sx={textFieldStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1">ชื่อเล่น <span className="text-red-500">*</span></label>
                  <TextField
                    name="nickname"
                    required
                    error={invalidFields.includes('nickname')}
                    helperText={invalidFields.includes('nickname') ? "กรุณากรอกข้อมูล" : ""}
                    onBlur={handleValidateField}
                    sx={textFieldStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1">วันเกิด <span className="text-red-500">*</span></label>
                  <DatePicker 
                    value={birthDate}
                    onChange={handleBirthDateChange}
                    sx={textFieldStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                  <TextField
                    name="phone"
                    type="tel"
                    required
                    error={invalidFields.includes('phone')}
                    helperText={invalidFields.includes('phone') ? "กรุณากรอกข้อมูล" : ""}
                    onBlur={handleValidateField}
                    sx={textFieldStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1">อีเมล</label>
                  <TextField
                    name="email"
                    type="email"
                    disabled
                    sx={textFieldStyle}
                  />
                  <span className="text-gray-500 text-sm">อีเมลไม่สามารถแก้ไขได้</span>
                </div>
              </div>
            </section>

            {/* Address Information Section */}
            <section ref={addressInfoRef} className={`bg-white p-6 rounded-lg shadow relative text-xl`} >
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">ที่อยู่</label>
                  <TextField
                    name="address"
                    fullWidth
                    onBlur={handleValidateField}
                    sx={textFieldStyle}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      styles={selectStyles}
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
                      styles={selectStyles}
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
                      styles={selectStyles}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">รหัสไปรษณีย์</label>
                    <TextField
                      name="zipcode"
                      disabled
                      value={postcode || ''}
                      sx={textFieldStyle}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Other Information Section */}
            <section ref={otherInfoRef} className={`bg-white p-6 rounded-lg shadow relative text-xl`}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">ประวัติการศึกษา</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1">ระดับการศึกษา<span className="text-red-500">*</span></label>
                        <Select<Option>
                          options={educations.map(level => ({ value: level.educationID, label: level.description }))}
                          onChange={(selectedOption) => {
                            console.log(selectedOption);
                          }}
                          placeholder="เลือกระดับการศึกษา"
                          styles={selectStyles}
                        />
                      </div>
                      <div>
                        <label className="block mb-1">สาขาวิชา<span className="text-red-500">*</span></label>
                        <TextField
                          name="major"
                          required
                          error={invalidFields.includes('major')}
                          helperText={invalidFields.includes('major') ? "กรุณากรอกข้อมูล" : ""}
                          onBlur={handleValidateField}
                          sx={textFieldStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">ภาษา</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LanguagesInput languages={languages} setLanguages={handleLanguagesChange} />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            {currentStepIndex > 0 && (
              <Button
                variant="outlined"
                onClick={handlePrevious}
                sx={{ px: 3, py: 1 }}
              >
                ก่อนหน้า
              </Button>
            )}

            {isLastStep ? (
              <Button
                variant="contained"
                onClick={handleFormSubmit}
                sx={{
                  bgcolor: 'success.main',
                  '&:hover': {
                    bgcolor: 'success.dark'
                  },
                  px: 3,
                  py: 1
                }}
              >
                ส่งข้อมูล
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  },
                  px: 3,
                  py: 1
                }}
              >
                ต่อไป
              </Button>
            )}
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
}

export default Client;