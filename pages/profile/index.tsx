"use client";

import React, { useContext, useEffect, useState } from 'react';
import { checkAuth, redirectToHome } from '@/lib/auth';
import { fetchProfileData, validateToken, type ProfileData } from '@/lib/api';
import LoaderHorizontal from '../../components/ui/loader';
import { Candidate } from '@/lib/form';
import Image from 'next/image';
import { useEducations, useFetchAppliedJobs, useFetchBase64Image, useFetchBase64PDF, useProfileUpdate, useLanguages } from '../../hooks/useDataFetching';
import { AppliedJob, CandidateLanguageProps } from '@/lib/types';
import JobBlock from '../../components/ui/JobBlock';
import { Table } from 'flowbite-react';
import { CustomFlowbiteTheme } from 'flowbite-react';
import FormSelect from '../../components/ui/FormAddress';
import { DistrictSelector, GenderSelect, MaritalStatusSelector, ProvinceSelector, SubDistrictSelector, TitleSelector } from '../../components/ui/FormInput';
import { TitleName } from '../../components/ui/FormInput';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Slide, Link, Chip } from '@mui/material';
import { AuthContext } from '../providers';
import CandidateLanguage from '@/components/ui/CandidateLanguage';

interface EducationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { educationID: number; major: string }) => void;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<Candidate | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenDate, setTokenDate] = useState<string | null>(null);
  const { imageData, isLoading: imageLoading, error: imageError } = useFetchBase64Image(profileData?.imageUrl || '');
  const { pdfData, isLoading: pdfLoading, error: pdfError } = useFetchBase64PDF(profileData?.cvUrl || '');
  const { appliedJobs: appliedJobsData, isLoading: appliedJobsLoading, error: appliedJobsError } = useFetchAppliedJobs(profileData?.candidateID || '');
  const { educations, isLoading: educationsLoading, error: educationsError } = useEducations();
  const { updateProfile, isSubmitting, error: updateError, response } = useProfileUpdate();
  const [editableProfileData, setEditableProfileData] = useState<Candidate>(profileData || {} as Candidate);
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const { languages, isLoading: languagesLoading, error: languagesError } = useLanguages();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('เกิดข้อผิดพลาด');
  const [snackBarType, setSnackBarType] = useState<'success' | 'error'>('error');

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

  const tableTheme: CustomFlowbiteTheme['table'] = {
    root: {
      base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
      shadow: "absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-white drop-shadow dark:bg-black",
      wrapper: "relative w-full lg:w-2/3"
    },
    body: {
      base: "group/body",
      cell: {
        base: "text-base text-neutral-500 px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"
      }
    },
    head: {
      base: "group/head uppercase text-gray-700 dark:text-gray-400",
      cell: {
        base: "text-base bg-gray-50 px-4 py-2 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"
      }
    },
    row: {
      base: "group/row",
      hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
      striped: "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
    }
  }

  const LogoutConfirmModal = () => {
    return (
      <Dialog
        open={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
      >
          <DialogTitle>ยืนยันการออกจากระบบ</DialogTitle>
          <DialogContent>
            <p className='text-neutral-500'>คุณต้องการออกจากระบบหรือไม่ ?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={logOut}>ออกจากระบบ</Button>
            <Button onClick={() => setIsLogoutConfirmOpen(false)}>ยกเลิก</Button>
          </DialogActions>
      </Dialog>
    )
  }

  const ConfirmUpdateModal = () => {
    return (
      <Dialog
        open={isConfirmUpdateOpen}
        onClose={() => setIsConfirmUpdateOpen(false)}
      >
        <DialogTitle>ยืนยันการบันทึกการเปลี่ยนแปลง</DialogTitle>
        <DialogContent>
          <p className='text-neutral-500'>คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>บันทึก</Button>
          <Button onClick={() => setIsConfirmUpdateOpen(false)}>ยกเลิก</Button>
        </DialogActions>
      </Dialog>
    )
  }

  const UpdateStatusSnackBar = () => {
    return (
      <Snackbar open={updateStatusOpen} 
        autoHideDuration={4000} 
        onClose={() => setUpdateStatusOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">บันทึกการเปลี่ยนแปลงสำเร็จ</Alert>
      </Snackbar>
    )
  }

  const EducationDialog = ({ open, onClose, onSave }: EducationDialogProps) => {
    const [selectedEducation, setSelectedEducation] = useState<number | null>(null);
    const [major, setMajor] = useState('');

    const handleSave = () => {
      onSave({ educationID: selectedEducation || 0, major });
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>เพิ่มการศึกษา</DialogTitle>
        <DialogContent>
          <div className='flex flex-col gap-4'>
            <div>
              <p className='text-neutral-900'>ระดับการศึกษา</p>
            </div>
            <div>
              <p className='text-neutral-900'>สาขาวิชา</p>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="border rounded p-1 w-full"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button onClick={handleSave}>บันทึก</Button>
        </DialogActions>
      </Dialog>
  );
  }

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  }

  const logOut = () => {
    if (typeof window !== 'undefined') {
      setIsLogoutConfirmOpen(false);
      
      // Clear all auth-related storage
      window.localStorage.clear();
      console.log('clear local storage...');
      // or specifically remove: window.localStorage.removeItem('authToken')
      window.sessionStorage.clear();
      
      // Force a small delay to ensure storage is cleared
      setTimeout(() => {
        console.log('Storage cleared, redirecting...');
        window.location.href = '/';
      }, 100);
    }
  };

  useEffect(() => {
    async function initializeProfile() {
      // Check authentication
      if (!authContext) {
        return; // Wait for context to be available
      }

      if (authContext.isAuth) {
        // Explicitly close any open dialogs
        authContext.setIsDialogOpen(false);
        
        try {
          const data = await fetchProfileData(authContext.email);
          setTokenDate(authContext.email);
          setProfileData(data);
        } catch (err: any) {
          if (err.response.status === 404) {
            logOut();
          } else {
            console.log('error', err.response.data);
          }
        }
      } else {
        // Only show the dialog if we're sure the user is not authenticated
        authContext.setDialogTitle('การตรวจสอบสิทธิเข้าสู่ระบบ');
        authContext.setDialogContent('กรุณาตรวจสอบสิทธิเข้าสู่ระบบของคุณ');
        authContext.setIsDialogOpen(true);
      }
      
      setLoading(false);
    }

    initializeProfile();
  }, [authContext?.isAuth]); // Only re-run when auth state changes

  useEffect(() => {
    setAppliedJobs(appliedJobsData);
  }, [appliedJobsData]);

  useEffect(() => {
    setEditableProfileData(profileData || {} as Candidate);
  }, [profileData]);

  // useEffect(() => {
  //   console.log('editableProfileData', editableProfileData);
  // }, [editableProfileData]);

  useEffect(() => {
    const updateProfileData = async () => {
      if (confirmUpdate) {
        //console.log(editableProfileData);
        //return;
        try {
          await updateProfile(editableProfileData);
          setConfirmUpdate(false);
          setProfileData(editableProfileData);
          setIsEditing(false);
          setIsConfirmUpdateOpen(false);
          setUpdateStatusOpen(true);
        } catch (error) {
          console.error('Error updating profile:', error);
          setIsConfirmUpdateOpen(false);
        }
      }
    };

    updateProfileData();
  }, [confirmUpdate]);

  const handleOpenCV = () => {
    if (typeof window !== 'undefined') {
      if (pdfData) {
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`<embed src="${pdfData}" width="100%" height="100%" />`);
          newTab.document.body.style.margin = '0';
        } else {
          console.error('No PDF data available to open.');
        }
      }
    }
  }

  const handleUploadCV = () => {
    console.log('uploading CV');
  }

  const handleEdit = (field: keyof Candidate, value: string | number) => {
    console.log('field', field, 'value', value);
    setEditableProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLanguageAdd = (language: CandidateLanguageProps) => {
    if (!profileData?.candidateID) return;
    
    const newLanguage = {
      candidateID: profileData.candidateID,
      revision: 0,
      languageID: language.languageID,
      level: language.level
    };
    
    setEditableProfileData((prev) => ({ ...prev, candidateLanguages: [...prev.candidateLanguages, newLanguage] }));
  };

  const handleLanguageDelete = (languageID: number) => {
    setEditableProfileData((prev) => ({
      ...prev,
      candidateLanguages: prev.candidateLanguages.filter(l => l.languageID !== languageID)
    }));
  };

  const handlePromptSave = () => {
    console.log('editableProfileData', editableProfileData);
    setIsConfirmUpdateOpen(true);
  }

  const handleSave = async () => {
    setConfirmUpdate(true);
  };

  const handleProvinceChange = (province: any) => {
    handleEdit('province', province);
  };

  const handleDistrictChange = (district: any) => {
    handleEdit('district', district);
  };

  if (loading) {
    return (
      <LoaderHorizontal />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h4 className='text-xl font-bold'>{error}</h4>
        <p className='text-neutral-500 mb-4'>กรุณาลองอีกครั้งภายหลัง</p>
        <p>
          <Link href="/" title='กลับสู่หน้าแรก' className='text-primary-700 underline'>กลับสู่หน้าแรก</Link> หรือ <button className='px-2 py-1 bg-red-500 text-white rounded-md' onClick={() => logOut()}>ออกจากระบบ</button>
        </p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h4 className='text-xl font-bold'>ไม่พบข้อมูลโปรไฟล์</h4>
        <p className='text-neutral-500 mb-4'>กรุณาลองอีกครั้งภายหลัง</p>
        <p>
          <Link href="/" title='กลับสู่หน้าแรก' className='text-primary-700 underline'>กลับสู่หน้าแรก</Link> หรือ <button className='px-2 py-1 bg-red-500 text-white rounded-md' onClick={() => logOut()}>ออกจากระบบ</button>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="profile-header flex gap-2 items-baseline">
        <h2 className="text-2xl font-bold leading-none">ข้อมูลผู้สมัคร</h2>
        <small className='text-neutral-500 mb-4'>อัพเดตล่าสุด : {new Date(profileData.updateDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
      </div>
      <div className="flex flex-col md:flex-row gap-6 text-[26px] justify-between">
        <div className="w-full md:w-2/6">
          {editableProfileData.image ? (
            <div className="flex flex-col items-center">
              <Image
                src={URL.createObjectURL(editableProfileData.image)}
                alt="Profile Image"
                className="rounded-[6px] w-auto h-auto aspect-[3/4] object-cover"
                width={374}
                height={499}
              />
            </div>
          ) : imageData ? (
            <div className="flex flex-col items-center xx">
              <Image
                src={imageData}
                alt="Profile Image"
                className="rounded-[6px] w-auto h-auto aspect-[3/4] object-cover border border-neutral-300"
                width={374}
                height={499}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          <div className="flex flex-col items-center">
            {isEditing && (
              <button
                className="mt-3 px-4 py-2 rounded-full bg-primary-700 text-white text-base hover:bg-primary-600 leading-none"
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = '.jpg, .jpeg, .png'; // Accept only jpg, jpeg, and png images
                  fileInput.onchange = async (event) => {
                    const target = event.target as HTMLInputElement;
                    if (target.files && target.files.length > 0) {
                      const file = target.files[0];
                      const formData = new FormData();
                      formData.append('image', file);
                      const validImageTypes = ['image/jpeg', 'image/png'];
                      if (validImageTypes.includes(file.type)) {
                        try {
                          setEditableProfileData((prev) => ({ ...prev, image: file }));
                        } catch (error) {
                          console.error('Error uploading image:', error);
                        }
                      } else {
                        alert('Please upload a valid image file (jpg, jpeg, or png).');
                      }
                    }
                  };
                  fileInput.click();
                }}
              >
                อัพโหลดภาพ
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:min-w-[750px] flex flex-col">
          <h3 className='text-2xl font-medium mb-3'><span className='font-medium'>รหัสประจำตัวผู้สมัคร :</span> {profileData.candidateID}</h3>
          {isEditing ? (
            // Edit Form
            <div className='flex flex-col gap-3 text-[20px]'>
              <div className='flex flex-col md:flex-row gap-2 md:gap-4 items-baseline justify-between'>
                <div className='w-full md:w-1/5'>
                  <p className='text-neutral-900'>คำนำหน้าชื่อ</p>
                  <TitleSelector id={editableProfileData.titleID} onTitleChange={(title) => handleEdit('titleID', title ? title.titleID : 1)} />
                </div>
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>ชื่อ</p>
                  <input
                    type="text"
                    value={editableProfileData.firstName}
                    onChange={(e) => handleEdit('firstName', e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>นามสกุล</p>
                  <input
                    type="text"
                    value={editableProfileData.lastName}
                    onChange={(e) => handleEdit('lastName', e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                </div>
              </div>
              <div className='flex flex-col md:flex-row gap-2 md:gap-4 items-baseline justify-between'>
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>ชื่อเล่น</p>
                  <input
                    type="text"
                    value={editableProfileData.nickName}
                    onChange={(e) => handleEdit('nickName', e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>อีเมล</p>
                  <input
                    type="email"
                    value={editableProfileData.email}
                    onChange={(e) => handleEdit('email', e.target.value)}
                    className="border rounded p-1  min-w-[240px] bg-gray-100 text-gray-500" disabled
                  />
                </div>
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>วันเกิด</p>
                  <input type="date" value={new Date(editableProfileData.dateOfBirth).toISOString().split('T')[0]} onChange={(e) => handleEdit('dateOfBirth', e.target.value)} className="border rounded p-1 w-full" />
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-2 md:gap-4 items-baseline'>
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>เบอร์โทรศัพท์</p>
                  <input type="tel" value={editableProfileData.tel} onChange={(e) => handleEdit('tel', e.target.value)} className="border rounded p-1 w-full" />
                </div>
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>เพศ</p>
                  <GenderSelect id={profileData.gender.genderID} setGender={(gender) => handleEdit('gender', gender ? String(gender.genderID) : '')} />
                </div>
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>สถานะสมรส</p>
                  <MaritalStatusSelector 
                    id={profileData.maritalStatus.maritalStatusID} 
                    onMaritalStatusChange={(maritalStatus) => handleEdit('maritalStatus', maritalStatus ? String(maritalStatus.maritalStatusID) : '')} 
                  />
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-2 md:gap-4 items-baseline'>
                <div className='w-full'>
                  <p className='text-neutral-900'>ที่อยู่</p>
                  <input type="text" value={editableProfileData.addressDetails} onChange={(e) => handleEdit('addressDetails', e.target.value)} className="border rounded p-1 w-full" />
                </div>
              </div>
              
              <div className='flex flex-col md:flex-row gap-2 md:gap-4'>
                <div className=''>
                  <p className='text-neutral-900'>จังหวัด</p>
                  <ProvinceSelector id={editableProfileData.province.provinceID} onProvinceChange={handleProvinceChange} />
                </div>
                <div className=''>
                  <p className='text-neutral-900'>อำเภอ</p>
                  <DistrictSelector id={editableProfileData.district.districtID} provinceID={editableProfileData.province.provinceID} onDistrictChange={(district) => handleEdit('district', district)} />
                </div>
                <div className=''>
                  <p className='text-neutral-900'>ตำบล</p>
                  <SubDistrictSelector id={editableProfileData.subdistrict.subDistrictID} districtID={editableProfileData.district.districtID} onSubDistrictChange={(subDistrict) => {
                    handleEdit('subdistrict', subDistrict);
                    handleEdit('postalCode', String(subDistrict.postCode));
                  }} />
                </div>
                <div className=''>
                  <p className='text-neutral-900'>รหัสไปรษณีย์</p>
                  <input type="text" value={editableProfileData.postalCode} onChange={(e) => handleEdit('postalCode', e.target.value)} className="border rounded p-1 bg-gray-100 text-gray-500" disabled />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className='text-neutral-900'>ภาษา</p>
                <div className="language-list">
                  <div className="flex flex-wrap gap-2">
                    {profileData.candidateLanguages.map((language) => (
                      <Chip key={language.languageID} label={`${languages.find((l) => l.languageID === language.languageID)?.description || '-'} - ${languageLevelLabel[language.level - 1].label}`} onDelete={() => handleLanguageDelete(language.languageID)} />
                    ))}
                  </div>
                </div>
                <CandidateLanguage handleLanguageAdd={handleLanguageAdd} />
              </div>

              {/* <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className='w-full md:w-1/2'>
                  <p className='text-neutral-900'>ประวัติการศึกษา</p>
                  { editableProfileData.candidateEducations.map((education) => (
                    <div className='flex gap-2'>
                      <div key={education.educationID}>ระดับ {educations.find((e) => e.educationID === education.educationID)?.description || '-'}</div>
                      <div key={education.educationID}>สาขาวิชา {education.major}</div>
                      <button className='text-primary-700 underline' onClick={() => {}}>แก้ไข</button>
                    </div>
                  )) }
                </div>
              </div> */}

              <hr className='mt-4 mb-3 border-neutral-300' />

              <div className="flex gap-2 justify-center md:justify-end">
                <button className='bg-primary-700 hover:bg-primary-600 text-white rounded-full px-4 py-1 text-[24px] transition-all' onClick={handlePromptSave}>บันทึกการเปลี่ยนแปลง</button>
                <button className="text-gray-600 hover:text-gray-600 rounded-full px-4 py-1 text-[24px] transition-all" onClick={() => setIsEditing(false)}>ยกเลิก</button>
              </div>
            </div>
          ) : (
            // Display Form
            <div className='flex flex-col gap-3 text-[28px] leading-none'>
              <div className='flex gap-2 items-baseline'>
                <label className="font-medium">ชื่อ-สกุล :</label>
                <div><TitleName titleID={profileData.titleID} /> {profileData.firstName} {profileData.lastName}</div>
              </div>
              <div className='flex gap-2'>
                <label className="font-medium">ชื่อเล่น :</label>
                <div>{profileData.nickName}</div>
              </div>
              <div className='flex gap-2 items-baseline'>
                <label className="font-medium">อีเมล :</label>
                <div>{profileData.email}</div>
              </div>
              <div className='flex gap-2 items-baseline'>
                <label className="font-medium">วันเกิด :</label>
                <div>{new Date(profileData.dateOfBirth).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <div className='flex gap-2 items-baseline'>
                <label className="font-medium">เบอร์โทรศัพท์ :</label>
                <div>{profileData.tel}</div>
              </div>
              <div className='flex gap-2 items-baseline'>
                <label className="font-medium">เพศ :</label>
                <div>{profileData.gender.description}</div>
              </div>
              <div className='flex gap-2 items-baseline'>
                <label className="font-medium">สถานะสมรส :</label>
                <div>{profileData.maritalStatus.description}</div>
              </div>
              <div className='flex flex-col md:flex-row gap-2 items-baseline'>
                <label className="font-medium flex-none">ที่อยู่ :</label>
                <div>{profileData.addressDetails}</div>
              </div>
              <div className='flex flex-col md:flex-row gap-2 items-baseline'>
                <label className="font-medium flex-none">จังหวัด :</label>
                <div>{profileData.province.nameTH}</div>
              </div>
              <div className='flex flex-col md:flex-row gap-2 items-baseline'>
                <label className="font-medium flex-none">อำเภอ :</label>
                <div>{profileData.district.nameTH}</div>
              </div>
              <div className='flex flex-col md:flex-row gap-2 items-baseline'>
                <label className="font-medium flex-none">ตำบล :</label>
                <div>{profileData.subdistrict.nameTH || '-'}</div>
              </div>
              <div className='flex flex-col md:flex-row gap-2 items-baseline'>
                <label className="font-medium flex-none">รหัสไปรษณีย์ :</label>
                <div>{profileData.postalCode || '-'}</div>
              </div>
              <div className='flex flex-col'>
                <h3 className='text-md font-medium leading-none mb-3'>ข้อมูลการศึกษา :</h3>
                <Table theme={tableTheme}>
                  <Table.Head>
                    <Table.HeadCell>ระดับการศึกษา</Table.HeadCell>
                    <Table.HeadCell>สาขาวิชา</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {profileData.candidateEducations.map((education) => (
                      <Table.Row key={education.educationID}>
                        <Table.Cell>{educations.find((e) => e.educationID === education.educationID)?.description || '-'}</Table.Cell>
                        <Table.Cell>{education.major}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
              
                <div className='flex flex-col'>
                  <h3 className='text-md font-medium leading-none mb-2'>ภาษา</h3>
                  {profileData.candidateLanguages.length > 0 ? (
                    <ul className='list-none list-inside'>
                      {profileData.candidateLanguages.map((language) => (
                        <li key={language.languageID}>{languages.find((l) => l.languageID === language.languageID)?.description || '-'} ({languageLevelLabel.find((l) => l.value === language.level)?.label || '-'})</li>
                      ))}
                    </ul>
                  ) : (
                    <small className='text-gray-500'>ไม่พบข้อมูลภาษา กด "แก้ไขข้อมูล" เพื่อเพิ่ม</small>
                  )}
                </div>
              {profileData.cvUrl && (
                <div className='flex gap-2 items-baseline'>
                  <label className="font-medium block">เรซูเม่ : </label>
                  <div>
                    {isEditing ? (
                      <input type="file" accept=".pdf" onChange={handleUploadCV} className='text-primary-700 underline' />
                    ) : (
                      <button onClick={() => handleOpenCV()} className='text-primary-700 underline'>ดาวน์โหลดเรซูเม่</button>
                    )}
                  </div>
                </div>
              )}
              <hr className='mt-4 mb-3 border-neutral-300' />
              <div className='flex gap-2 mt-3 justify-end leading-[36px]'>
                <button className='bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-1 text-[24px] transition-all' onClick={handleLogout}>ออกจากระบบ</button>
                <button className='bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-1 text-[24px] transition-all' onClick={() => setIsEditing(true)}>แก้ไขข้อมูล</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {appliedJobs.length > 0 && (
        <div className="flex flex-col pt-4">
          <h3 className="text-2xl font-bold mb-4">ประวัติการสมัครงาน</h3>
          <div className="grid lg:grid-cols-3 gap-4 mb-7">
            {appliedJobs.map((job) => (
              <JobBlock key={job.appliedJobID} job={job.job} status={job.status.statusID} applyDate={job.appliedDate} />
            ))}
          </div>
        </div>
      )}

      <UpdateStatusSnackBar />

      {isConfirmUpdateOpen && (
        <ConfirmUpdateModal />
      )}

      {isLogoutConfirmOpen && (
        <LogoutConfirmModal />
      )}
    </div>
  );
}