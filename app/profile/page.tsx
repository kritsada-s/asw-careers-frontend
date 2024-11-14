"use client";

import React, { useEffect, useState } from 'react';
import { checkAuth, redirectToHome } from '@/lib/auth';
import { fetchProfileData, type ProfileData } from '@/lib/api';
import LoaderHorizontal from '../components/ui/loader';
import { Candidate } from '@/lib/form';
import Image from 'next/image';
import { useEducations, useFetchAppliedJobs, useFetchBase64Image } from '../hooks/useDataFetching';
import { AppliedJob } from '@/lib/types';
import JobBlock from '../components/ui/JobBlock';
import { Table } from 'flowbite-react';
import { CustomFlowbiteTheme } from 'flowbite-react';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<Candidate | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenDate, setTokenDate] = useState<string | null>(null);
  const { imageData, isLoading: imageLoading, error: imageError } = useFetchBase64Image(profileData?.imageUrl || '');
  const { appliedJobs: appliedJobsData, isLoading: appliedJobsLoading, error: appliedJobsError } = useFetchAppliedJobs(profileData?.candidateID || '');
  const { educations, isLoading: educationsLoading, error: educationsError } = useEducations();

  const tableTheme: CustomFlowbiteTheme['table'] = {
    root: {
      base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
      shadow: "absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-white drop-shadow dark:bg-black",
      wrapper: "relative w-full md:w-1/2"
    },
    body: {
      base: "group/body",
      cell: {
        base: "px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"
      }
    },
    head: {
      base: "group/head uppercase text-gray-700 dark:text-gray-400",
      cell: {
        base: "bg-gray-50 px-4 py-2 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"
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

  // Render profile data
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="profile-header flex gap-2 items-baseline">
        <h2 className="text-2xl font-bold leading-none">ข้อมูลผู้สมัคร</h2>
        <small className='text-neutral-500 mb-4'>อัพเดตครั้งล่าสุด : 14 พ.ย. 2566</small>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-7 text-[26px]">
        <div className="w-full md:w-1/3">
          { imageData && <Image src={imageData || ''} alt="Profile Image" width={250} height={250} className='bg-slate-200 aspect-[3/4] object-cover md:mb-3 h-auto w-2/3 md:w-auto mx-auto md:mx-0'/> }
        </div>
        <div className="w-full md:w-2/3">
          <p><span className='font-medium'>รหัสประจำตัวผู้สมัคร :</span> {profileData.candidateID}</p>
          {/* <p>Token will expired at: {tokenDate ? new Date(tokenDate).toLocaleString() : 'N/A'}</p> */}
          <div className='flex gap-2 items-baseline'>
            <label className="font-medium">ชื่อ-สกุล :</label>
            <div>{profileData.firstName} {profileData.lastName}</div>
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
            <label className="font-medium">ที่อยู่ :</label>
            <div>{profileData.addressDetails}</div>
          </div>
          <div className='flex flex-col md:flex-row gap-2 items-baseline'>
            <div className='flex gap-1'>
              <label className="font-medium">ตำบล:</label>
              <div>{profileData.subdistrict.nameTH || '-'}</div>
            </div>
            <div className='flex gap-1'>
              <label className="font-medium">อำเภอ:</label>
              <div>{profileData.district.nameTH}</div>
            </div>
            <div className='flex gap-1'>
              <label className="font-medium">จังหวัด:</label>
              <div>{profileData.province.nameTH}</div>
            </div>
            <div className='flex gap-1'>
              <label className="font-medium">รหัสไปรษณีย์:</label>
              <div>{profileData.postalCode || '-'}</div>
            </div>
          </div>
          <div className="h-5"></div>
          <div className='flex flex-col'>
            <h3 className='text-md font-medium leading-none mb-4'>ข้อมูลการศึกษา :</h3>
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

      { appliedJobs.length > 0 && (
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold mb-4">ประวัติการสมัครงาน</h3>
          <div className="grid lg:grid-cols-3 gap-4 mb-7">
            {appliedJobs.map((job) => (
              <JobBlock key={job.appliedJobID} job={job.job} status={job.status.statusID} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button className='bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-1' onClick={()=>logOut()}>ออกจากระบบ</button>
      </div>
    </div>
  );
}