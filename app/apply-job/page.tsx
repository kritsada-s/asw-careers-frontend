'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import LoaderHorizontal from '../components/ui/loader';

function ApplyJobPage() {
  const params = useParams();
  const jobId = params.id as string;

  // useEffect(() => {
  //   if (!jobId) {
  //     if (typeof window !== 'undefined') {
  //       sessionStorage.getItem('jobId')
  //     }
  //   }
  // }, [jobId]);

  return (
    <div className='flex justify-center items-center h-screen'>
      <p>Apply Job Page for {sessionStorage.getItem('jobId')}</p>
    </div>
  );
}

export default ApplyJobPage;