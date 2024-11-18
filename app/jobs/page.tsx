"use client";

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { fetchCompanyLocations, fetchedJobs, fetchLocationByID } from '@/lib/api';
import { Job } from '@/lib/types';
import { WorkLocation } from '../components/ui/WorkLocation';
import { timeAgo } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useModal } from '../components/MUIProvider';
import { useToken, useDecryptedToken } from '@/app/hooks/useToken';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button, CustomFlowbiteTheme, Modal } from 'flowbite-react';
import { useFetchBase64Image, useSubmitJobApplication, useUserProfile } from '../hooks/useDataFetching';
import Link from 'next/link';
import { HiExternalLink, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import Swal from 'sweetalert2';
import Image from 'next/image';

interface fetchedJobs {
  jobs: Job
} 

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const [isSelectedJobOpen, setIsSelectedJobOpen] = useState(false);
  const { openModal } = useModal()
  const jobDetailsRef = useRef<HTMLDivElement>(null);
  const summaryHeaderRef = useRef<HTMLDivElement>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const decryptedToken = useDecryptedToken();
  const { profile, isLoading: isLoadingProfile, error: profileError } = useUserProfile(decryptedToken?.Email || '');
  const { imageData, isLoading: isLoadingImage, error: imageError } = useFetchBase64Image(profile?.imageUrl || '');
  const { submitApplication, isSubmitting: isSubmittingApplication, error: submitErrMsg, isError: isSubmitError, response: submitApplicationResponse } = useSubmitJobApplication(selectedJob?.jobID || '', profile?.candidateID || '');
  const [isSubmitAppError, setIsSubmitAppError] = useState<boolean>(false);


  const modalTheme: CustomFlowbiteTheme['modal'] = {
    root: {
      base: `fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full transition-all ease-out ${
        isSummaryModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } `,

      show: {
        on: `flex bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-all ease-out`,
        off: 'always-on'
      }
    },
    header: {
      base: "flex items-start justify-between rounded-t border-b py-4 px-5 dark:border-gray-600",
      title: "text-xl md:text-2xl font-medium dark:text-white leading-none",
    },
    body: {
      base: "flex-1 overflow-auto px-4 md:px-5 py-4"
    },
    footer: {
      base: "flex items-center space-x-2 rounded-b border-gray-200 px-5 py-4 dark:border-gray-600",
    }
  }

  const findJobById = (jobs: Job[], searchId: string | null): Job | null => {
    return jobs.find(job => job.jobID === searchId) || null;
  };

  useEffect(() => {
    const fetchJobs = async (searchTerm?: string | '') => {
      try {
        const response = await fetchedJobs(searchTerm);
        if (response) {
          setJobs(response.jobs);
          if (response.jobs.length > 0) {
            if (params.get('id')) {
              const paramsId = params.get('id');
              setSelectedJob(findJobById(response.jobs, paramsId))
            } else {
              setSelectedJob(response.jobs[0]);
            }
          }          
        }
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.get('search')) {
      fetchJobs(params.get('search') || '');
    } else {
      fetchJobs();
    }
  }, [params]);

  // useEffect(()=>{
  //   console.log('modal open', isSummaryModalOpen);
  // }, [isSummaryModalOpen])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, [isMobile]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    if (isMobile) {
      setIsSelectedJobOpen(true);
    }
  };

  const handleErrorPopupClose = () => {
    setIsSubmitAppError(false);
  }

  useGSAP(() => {
    if (jobDetailsRef.current) {
      if (isSelectedJobOpen) {
        gsap.fromTo(jobDetailsRef.current, { opacity: 0, y: 800 }, { opacity: 1, y: 0, duration: 0.3});
      } else {
        gsap.fromTo(jobDetailsRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: 800, duration: 0.3});
      }
    }
  }, [isSelectedJobOpen]);

  useGSAP(() => {
    if (summaryHeaderRef.current) {
      gsap.fromTo(summaryHeaderRef.current, { opacity: 0, y: -100 }, { opacity: 1, y: 0, duration: 0.3});
    }
  }, [isSummaryModalOpen]);

  const token = useToken();

  const handleCloseSelectedJob = () => {
    setIsSelectedJobOpen(false);
  }

  const handleProfileSummaryModalConfirm = async () => {
    console.log('isSubmittingApplication', isSubmittingApplication);
    if (isSubmittingApplication) {
      setIsSummaryModalOpen(false);
      setIsModalConfirmOpen(false);
    } else {
      setIsModalConfirmOpen(false);
      setIsSubmitAppError(true);
    }
  }

  const handleJobSubmit = () => {
    if (token) {
      setIsSummaryModalOpen(true);
    } else {
      openModal({
        type: 'auth',
        props: {
          initialStep: 'email'
        }
      })
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <iframe src="https://lottie.host/embed/5af278ce-be06-47cf-9901-95b1e823ba14/ZvF1yAFgYj.json" className='mb-3'></iframe>
      <h4 className='text-xl font-medium text-red-500'>ไม่สามารถโหลดข้อมูลได้</h4>
      <small className='text-gray-500'>กรุณาลองอีกครั้งภายหลัง</small>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row relative">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">ตำแหน่งงานทั้งหมด</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 lg:p-6 bg-[#f6f6f6] flex flex-col gap-4">
          {jobs.map((job) => (
            <div
              key={job.jobID}
              onClick={() => handleJobSelect(job)}
              className={`p-4 leading-none cursor-pointer bg-white hover:bg-gray-50 rounded transition-colors ${selectedJob?.jobID === job.jobID ? 'bg-gradient-to-br from-primary-400 to-primary-700' : ''}`}
            >
              <h3 className={`font-medium text-lg ${selectedJob?.jobID === job.jobID ? 'text-white' : 'text-gray-900'}`}>
                {job.jobPosition}
              </h3>
              <p className={`${selectedJob?.jobID === job.jobID ? 'text-neutral-300' : 'text-neutral-500'}`}><WorkLocation comp={job.companyID} loc={job.companyLocationID} /></p>
              <small className={`${selectedJob?.jobID === job.jobID ? 'text-neutral-300' : 'text-neutral-500'}`}>{timeAgo(job.createDate)}</small>
              <div className={`mt-1 text-xs ${selectedJob?.jobID === job.jobID ? 'text-neutral-300' : 'text-neutral-600'}`}>
                คลิกเพื่อดูรายละเอียด
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div id="jobDetails" ref={jobDetailsRef} className={`flex-1 bg-white ${isMobile ? 'absolute left-0 w-full translate-y-[800px] opacity-0' : ''}`}>
        {selectedJob ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div id='detailsHeader' className="p-4 md:p-6 border-b border-gray-200 flex justify-between gap-2 md:gap-0 items-center bg-primary-700 min-h-[200px]">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {selectedJob.jobPosition}
              </h1>
              <button
                onClick={handleJobSubmit}
                className="px-5 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                สมัครงาน
              </button>
              {isMobile && (
                <button className='text-white absolute top-4 right-4' onClick={handleCloseSelectedJob}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedJob.jobDetails }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a job to view details
          </div>
        )}
      </div>

      {/* Modal */}

      <Modal 
        show={isSummaryModalOpen} 
        onClose={() => {setIsSummaryModalOpen(false)}} 
        
        ref={summaryHeaderRef} 
        theme={modalTheme} 
        className={`transition-opacity duration-300 ${isSummaryModalOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        <Modal.Header>
          สมัครงาน <span className='text-primary-700'>{selectedJob?.jobPosition}</span>
        </Modal.Header>
        <Modal.Body>
          <h3 className='text-base md:text-lg font-medium mb-2 md:mb-3'>โปรดตรวจสอบข้อมูลของท่านก่อนคลิกสมัครงาน</h3>
          <div className='flex flex-col md:flex-row md:gap-7'>
            <div className='w-full md:w-1/3 mb-5 md:mb-0'>
              {imageData ? <Image src={imageData} alt="Profile" className='w-full h-auto aspect-[3/4] object-cover mb-2' width={260} height={350} /> : <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1 7.5 0v12a3.75 3.75 0 1 1-7.5 0V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75v-3z" />
                </svg>
              </div>}
              <Link href={''} className='text-primary-700 hover:text-primary-800 flex gap-1 items-center leading-none underline'>แสดง CV <HiExternalLink/></Link>
            </div>
            <div className="w-full md:w-2/3">
            <p><strong>ชื่อ-นามสกุล:</strong> {profile?.firstName} {profile?.lastName}</p>
            <p><strong>ชื่อเล่น:</strong> {profile?.nickName || '-'}</p>
            <p><strong>เพศ:</strong> {profile?.gender?.description || '-'}</p>
            <p><strong>วันเกิด:</strong> {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
            <div className='h-4 md:h-0'></div>
            <p><strong>อีเมล:</strong> {profile?.email}</p>
            <p><strong>เบอร์โทร:</strong> {profile?.tel || '-'}</p>
            <p><strong>ที่อยู่:</strong> {profile?.addressDetails || '-'}</p>
            <p><strong>จังหวัด:</strong> {profile?.province?.nameTH || '-'}</p>
            <p><strong>อำเภอ:</strong> {profile?.district?.nameTH || '-'}</p>
            <p><strong>ตำบล:</strong> {profile?.subdistrict?.nameTH || '-'}</p> 
            <p><strong>รหัสไปรษณีย์:</strong> {profile?.postalCode || '-'}</p>
            <div className='h-4 md:h-0'></div>
            <p><strong>สถานภาพสมรส:</strong> {profile?.maritalStatus?.description || '-'}</p>
            <p><strong>ระดับการศึกษา:</strong> {profile?.candidateEducations[0]?.educationID || '-'}</p>
            <p><strong>สาขาวิชา:</strong> {profile?.candidateEducations[0]?.major || '-'}</p>
            <hr className='my-3' />
            <p>หากต้องการแก้ไขข้อมูล <Link href={'/profile'} className='text-primary-700 hover:text-primary-800 underline'>คลิกที่นี่</Link></p>
          </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-end'>
          <Button size='sm' className='text-red-500 hover:text-red-600 hover:bg-red-200 rounded-full' color='none' onClick={() => {setIsSummaryModalOpen(false)}}>ยกเลิก</Button>
          <Button color='none' size='sm' className='bg-primary-700 hover:bg-primary-600 text-[24px] text-white rounded-full px-5' onClick={() => {setIsModalConfirmOpen(true)}}>สมัครงาน</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isModalConfirmOpen} size="md" onClose={() => setIsModalConfirmOpen(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              คุณต้องการใช้ข้อมูลดังกล่าวเพื่อสมัครงานตำแหน่ง <span className='text-primary-700'>{selectedJob?.jobPosition}</span> หรือไม่?
            </h3>
            <div className="flex justify-center gap-2">
              <Button size='sm' color="success" className='px-4 rounded-full' onClick={handleProfileSummaryModalConfirm}>
                ยืนยัน
              </Button>
              <Button size='sm' color="failure" className='px-4 rounded-full' onClick={() => setIsModalConfirmOpen(false)}>
                ยกเลิก
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isSubmitAppError} size="md" onClose={() => handleErrorPopupClose()} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <p>เกิดข้อผิดพลาดในการสมัครงาน</p>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
}

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPage />
    </Suspense>
  )
}

export default App;