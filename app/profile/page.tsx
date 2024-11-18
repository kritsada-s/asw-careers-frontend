"use client";

import React, { useEffect, useState } from 'react';
import { checkAuth, redirectToHome } from '@/lib/auth';
import { fetchProfileData, type ProfileData } from '@/lib/api';
import LoaderHorizontal from '../components/ui/loader';
import { Candidate } from '@/lib/form';
import Image from 'next/image';
import { useEducations, useFetchAppliedJobs, useFetchBase64Image, useProfileUpdate } from '../hooks/useDataFetching';
import { AppliedJob } from '@/lib/types';
import JobBlock from '../components/ui/JobBlock';
import { Table } from 'flowbite-react';
import { CustomFlowbiteTheme } from 'flowbite-react';
import FormSelect from '../components/ui/FormAddress';
import { DistrictSelector, GenderSelect, MaritalStatusSelector, ProvinceSelector, SubDistrictSelector, TitleSelector } from '../components/ui/FormInput';
import { TitleName } from '../components/ui/FormInput';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<Candidate | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenDate, setTokenDate] = useState<string | null>(null);
  const { imageData, isLoading: imageLoading, error: imageError } = useFetchBase64Image(profileData?.imageUrl || '');
  const { appliedJobs: appliedJobsData, isLoading: appliedJobsLoading, error: appliedJobsError } = useFetchAppliedJobs(profileData?.candidateID || '');
  const { educations, isLoading: educationsLoading, error: educationsError } = useEducations();
  const { updateProfile, isSubmitting, error: updateError, response } = useProfileUpdate();
  const [editableProfileData, setEditableProfileData] = useState<Candidate>(profileData || {} as Candidate);
  const [isEditing, setIsEditing] = useState(false);

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

  const logOut = () => {
    if (typeof window !== 'undefined') {
      window?.localStorage.removeItem('authToken')
      console.log('logout redirecting...');
      redirectToHome();
    }
  }

  useEffect(() => {
    async function initializeProfile() {
      // Check authentication
      const authData = checkAuth();
      //console.log('authData', authData);
      
      if (!authData) {
        alert('Please log in to view your profile');
        redirectToHome();
        return;
      }

      try {
        // Fetch profile data
        const data = await fetchProfileData(authData.Email);
        //console.log('data', data);
        const userProfileData = {
          firstName: data.firstName,
        }
        setTokenDate(authData.ExpiredDate)
        console.log('data', data.updateDate);
        setProfileData(data);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
        console.error('Profile loading error:', err);
      } finally {
        setLoading(false);
      }
    }
    initializeProfile();
  }, []);

  useEffect(() => {
    setAppliedJobs(appliedJobsData);
  }, [appliedJobsData]);

  useEffect(() => {
    setEditableProfileData(profileData || {} as Candidate);
    console.log('profileData', profileData);
  }, [profileData]);

  useEffect(() => {
    console.log('editableProfileData', editableProfileData);
  }, [editableProfileData]);

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
          <a href="/" title='กลับสู่หน้าแรก' className='text-primary-700 underline'>กลับสู่หน้าแรก</a> หรือ <button className='px-2 py-1 bg-red-500 text-white rounded-md' onClick={()=>logOut()}>ออกจากระบบ</button>
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
          <a href="/" title='กลับสู่หน้าแรก' className='text-primary-700 underline'>กลับสู่หน้าแรก</a> หรือ <button className='px-2 py-1 bg-red-500 text-white rounded-md' onClick={()=>logOut()}>ออกจากระบบ</button>
        </p>
      </div>
    );
  }

  const handleEdit = (field: keyof Candidate, value: string | number) => {
    //console.log('field', field, 'value', value);
    setEditableProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const confirmUpdate = window.confirm("คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?");
    if (confirmUpdate) {
      try {
        // Call your API to update the profile data
        await updateProfile(editableProfileData);
        setProfileData(editableProfileData);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleProvinceChange = (province: any) => {
    handleEdit('province', province);
  };

  const handleDistrictChange = (district: any) => {
    handleEdit('district', district);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="profile-header flex gap-2 items-baseline">
        <h2 className="text-2xl font-bold leading-none">ข้อมูลผู้สมัคร</h2>
        <small className='text-neutral-500 mb-4'>อัพเดตล่าสุด : { new Date(profileData.updateDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) }</small>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-7 text-[26px]">
        <div className="w-full md:w-1/3">
          { imageData && imageData !== '' ? (
            <Image src={imageData} alt="Profile Image" width={250} height={250} className='bg-slate-200 aspect-[3/4] object-cover md:mb-3 h-auto w-2/3 md:w-auto mx-auto md:mx-0' />
          ) : (
            <div className='bg-gray-200 aspect-[3/4] flex items-center justify-center'>
              <span className='text-gray-500'>No Image Available</span>
            </div>
          )}
        <div className="flex flex-col items-center">
          {isEditing && (
          <button 
            className="mt-3 px-4 py-2 rounded-full bg-primary-700 text-white text-base hover:bg-primary-600 leading-none"
            onClick={() => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = 'image/*';
              fileInput.onchange = async (event) => {
                const target = event.target as HTMLInputElement;
                if (target.files && target.files.length > 0) {
                  const file = target.files[0];
                  const formData = new FormData();
                  formData.append('image', file);
                  try {
                    //console.log(file.name);
                    setEditableProfileData((prev) => ({ ...prev, image: file }));
                  } catch (error) {
                    console.error('Error uploading image:', error);
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
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <p><span className='font-medium'>รหัสประจำตัวผู้สมัคร :</span> {profileData.candidateID}</p>
          {isEditing ? (
            <div className='flex gap-2 items-baseline'>
              <div>
                <TitleSelector id={editableProfileData.titleID} onTitleChange={(title) => handleEdit('titleID', title ? title.titleID : 1)} />
              </div>
              <label className="font-medium">ชื่อ :</label>
              <input
                type="text"
                value={editableProfileData.firstName}
                onChange={(e) => handleEdit('firstName', e.target.value)}
                className="border rounded p-1"
              />
              <label className="font-medium">นามสกุล :</label>
              <input
                type="text"
                value={editableProfileData.lastName}
                onChange={(e) => handleEdit('lastName', e.target.value)}
                className="border rounded p-1"
              />
            </div>
          ) : (
            <div className='flex gap-2 items-baseline'>
              <label className="font-medium">ชื่อ-สกุล :</label>
              <div><TitleName titleID={profileData.titleID} /> {profileData.firstName} {profileData.lastName}</div>
            </div>
          )}
          <div className='flex gap-2'>
            <label className="font-medium">ชื่อเล่น :</label>
            { isEditing ? (<input type="text" value={editableProfileData.nickName} onChange={(e) => handleEdit('nickName', e.target.value)} className="border rounded p-1" />) : (<div>{profileData.nickName}</div>)
            }
          </div>
          <div className='flex gap-2 items-baseline'>
            <label className="font-medium">อีเมล :</label>
            {isEditing ? (
              <input
                type="email"
                value={editableProfileData.email}
                onChange={(e) => handleEdit('email', e.target.value)}
                className="border rounded p-1"
              />
            ) : (
              <div>{profileData.email}</div>
            )}
          </div>
          <div className='flex gap-2 items-baseline'>
            <label className="font-medium">วันเกิด :</label>
            { isEditing ? (<input type="date" value={new Date(editableProfileData.dateOfBirth).toISOString().split('T')[0]} onChange={(e) => handleEdit('dateOfBirth', e.target.value)} className="border rounded p-1" />) : (<div>{new Date(profileData.dateOfBirth).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>)
            }
          </div>
          <div className='flex gap-2 items-baseline'>
            <label className="font-medium">เบอร์โทรศัพท์ :</label>
            {isEditing ? (
              <input
                type="tel"
                value={editableProfileData.tel}
                onChange={(e) => handleEdit('tel', e.target.value)}
                className="border rounded p-1"
              />
            ) : (
              <div>{profileData.tel}</div>
            )}
          </div>
          <div className='flex gap-2 items-baseline'>
            <label className="font-medium">เพศ :</label>
            {isEditing ? (
              <GenderSelect id={profileData.gender.genderID} setGender={(gender) => handleEdit('gender', gender ? String(gender.genderID) : '')} />
            ) : (
              <div>{profileData.gender.description}</div>
            )}
          </div>
          <div className='flex gap-2 items-baseline'>
            <label className="font-medium">สถานะสมรส :</label>
            {isEditing ? (
              <MaritalStatusSelector id={profileData.maritalStatus.maritalStatusID} />
            ) : (
              <div>{profileData.maritalStatus.description}</div>
            )}
          </div>
          <div className='flex flex-col md:flex-row gap-2 items-baseline'>
            <label className="font-medium flex-none">ที่อยู่ :</label>
            {isEditing ? (
              <input
                type="text"
                value={editableProfileData.addressDetails}
                onChange={(e) => handleEdit('addressDetails', e.target.value)}
                className="border rounded p-1 flex-1"
              />
            ) : (
              <div>{profileData.addressDetails}</div>
            )}
          </div>
          <div className='flex flex-col md:flex-row gap-2 items-baseline flex-wrap'>
            <div className='flex gap-1 items-baseline'>
              <label className="font-medium">จังหวัด:</label>
              { isEditing ? (
                <ProvinceSelector 
                  id={profileData.province.provinceID} 
                  onProvinceChange={handleProvinceChange} 
                />
              ) : (
                <div>{profileData.province.nameTH}</div>
              )}
            </div>
            <div className='flex gap-1'>
              <label className="font-medium">อำเภอ:</label>
              { isEditing ? (<DistrictSelector 
                id={editableProfileData.district.districtID} 
                provinceID={editableProfileData.province.provinceID}
                onDistrictChange={(district) => handleEdit('district', district)} 
              />) : (<div>{profileData.district.nameTH}</div>)
            }
            </div>
            <div className='flex gap-1'>
              <label className="font-medium">ตำบล:</label>
              { isEditing ? (<SubDistrictSelector 
                id={editableProfileData.subdistrict.subDistrictID} 
                districtID={editableProfileData.district.districtID}
                onSubDistrictChange={(subDistrict) => {
                  handleEdit('subdistrict', subDistrict);
                  handleEdit('postalCode', String(subDistrict.postCode));
                }}
              />) : (<div>{profileData.subdistrict.nameTH || '-'}</div>)
            }
            </div>
            
            <div className='flex gap-1'>
              <label className="font-medium">รหัสไปรษณีย์:</label>
              <div>{profileData.postalCode || '-'}</div>
            </div>
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
          {profileData.candidateLanguages.length > 0 && (
          <div className='flex flex-col'>
            <h3 className='text-md font-medium leading-none'>ภาษา</h3>
            <ul className='list-disc list-inside'>
            {profileData.candidateLanguages.map((language) => (
              <li key={language.languageID}>{language.languageID || '-'}</li>
            ))}
            </ul>
          </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end mb-5">
        <button className='bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-1' onClick={()=>logOut()}>ออกจากระบบ</button>
        {isEditing ? (
          <>
          <button className='bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1' onClick={handleSave}>บันทึกการเปลี่ยนแปลง</button>
          <button className="text-gray-600 hover:text-gray-600 rounded-full p-1" onClick={() => setIsEditing(false)}>ยกเลิก</button>
          </>

        ) : (
          <button className='bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-1' onClick={() => setIsEditing(true)}>แก้ไขข้อมูล</button>
        )}
      </div>

      { appliedJobs.length > 0 && (
        <div className="flex flex-col border-t border-gray-200 pt-4">
          <h3 className="text-2xl font-bold mb-4">ประวัติการสมัครงาน</h3>
          <div className="grid lg:grid-cols-3 gap-4 mb-7">
            {appliedJobs.map((job) => (
              <JobBlock key={job.appliedJobID} job={job.job} status={job.status.statusID} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}