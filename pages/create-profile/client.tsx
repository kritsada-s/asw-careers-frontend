import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import React, { useCallback, useContext } from 'react';
import gsap from 'gsap';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useRef, useState } from 'react';
import FileUploadButton from '../../components/ui/FileUploadButton';
import { DistrictSelector, ProvinceSelector, SubDistrictSelector } from '../../components/ui/FormInput';
import Select, { StylesConfig } from 'react-select';
import { districts, provinces, subDistricts } from '@/lib/data';
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
  }),
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
  const [isValid, setIsValid] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [province, setProvince] = useState<number>(0);
  const [district, setDistrict] = useState<number>(0);
  const [subDistrict, setSubDistrict] = useState<number>(0);
  const [postcode, setPostcode] = useState<string>('');
  const params = useSearchParams();
  const [jobTitle, setJobTitle] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
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

  const handleResumeFileChange = (file: File) => {
    if (!['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setSnackbarMessage('ไฟล์ต้องเป็น PDF, JPG หรือ JPEG');
      setSnackbarOpen(true);
      return;
    }
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

  const handleProfileImageChange = (file: File) => {
    setProfileImage(file);
  };

  const handleBirthDateChange = (date: Date | null) => {
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
    if (position) {
      setJobTitle(position);
    }
  }, [position]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-4xl font-medium text-center mt-4 mb-3">สร้างโปรไฟล์ใหม่</h2>
        <form className="space-y-8 bg-white p-6 rounded-lg shadow">
          {/* Basic Information */}
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
                      if (file.size > 1024 * 1024) {
                        setSnackbarMessage('ขนาดไฟล์ไม่เกิน 1MB');
                        setSnackBarType('error');
                        setSnackbarOpen(true);
                        e.target.value = '';
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
                    const value = e.target.value;
                    if (parseInt(value) > 100) {
                      alert('this field allow only 0-100');
                      e.target.value = '0';
                    }
                  }}
                />
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
                    const value = e.target.value.replace(/[^0-9,]/g, '').replace(/,/g, '');
                    if (value) {
                      e.target.value = Number(value).toLocaleString();
                    }
                  }}
                />
              </div>
              <div>
                <label className="block mb-1">เอกสารประกอบการสมัคร (CV/Resume) <span className="text-red-500">*</span> <span className="text-xs font-normal text-gray-500">ขนาดไฟล์ไม่เกิน 5 MB</span></label>
                <div className="flex items-center gap-2">
                  <FileUploadButton onChange={handleResumeFileChange} file={resumeFile} />
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
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

          {/* Address Information */}
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

          {/* Other Information */}
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

          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-2 bg-blue-500 text-white rounded"
              onClick={handleSubmitProfile}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin " /> : 'ส่งข้อมูล'}
            </button>
          </div>
        </form>

        <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setSnackbarOpen(false)} autoHideDuration={4500}>
          <Alert severity={snackBarType} onClose={() => setSnackbarOpen(false)} variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </LocalizationProvider>
  );
}

export default Client;