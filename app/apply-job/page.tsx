import { fetchedJobs } from '@/lib/api';
import React, { Suspense } from 'react';
import LoaderHorizontal from '@/app/components/ui/loader';
import ApplyJobPage from './[id]/client';

type Props = {
  params: { id: string }
}

const Page = async ({ params }: Props) => {
  return (
    <Suspense fallback={<LoaderHorizontal />}>
      <ApplyJobPage />
    </Suspense>
  )
}

export async function generateStaticParams() {
  try {
    const response = await fetchedJobs();
    return response.jobs.map((job) => ({
      id: job.jobID.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default Page;