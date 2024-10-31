// app/jobs/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { fetchCompanyLocations, fetchedJobs, fetchLocationByID } from '@/lib/api';
import { Job } from '@/lib/types';
import { WorkLocation } from '../components/ui/WorkLocation';
import { timeAgo } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface fetchedJobs {
  jobs: Job
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useSearchParams();

  const findJobById = (jobs: Job[], searchId: string | null): Job | null => {
    return jobs.find(job => job.jobID === searchId) || null;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetchedJobs();
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

    fetchJobs();
  }, []);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleJobSubmit = () => {
    if (selectedJob) {
      console.log('job submitting');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">ตำแหน่งงานทั้งหมด</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)] p-6 bg-[#f6f6f6] flex flex-col gap-4">
          {jobs.map((job) => (
            <div
              key={job.jobID}
              onClick={() => handleJobSelect(job)}
              className={`p-4 cursor-pointer bg-white hover:bg-gray-50 rounded transition-colors ${selectedJob?.jobID === job.jobID ? 'bg-gradient-to-br from-primary-400 to-primary-700' : ''}`}
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
      <div id="jobDetails" className="flex-1 bg-white">
        {selectedJob ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div id='detailsHeader' className="p-6 border-b border-gray-200 flex justify-between items-center bg-primary-700 min-h-[200px]">
              <h1 className="text-2xl font-bold text-white">
                {selectedJob.jobPosition}
              </h1>
              <button
                onClick={handleJobSubmit}
                className="px-5 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                สมัครงาน
              </button>
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
    </div>
  );
}