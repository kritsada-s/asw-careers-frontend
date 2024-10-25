// app/jobs/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { fetchedJobs } from '@/lib/api';
import { Job, SingleJob } from '@/lib/types';

interface fetchedJobs {
  jobs: Job
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetchedJobs();
        if (response) {
          setJobs(response.jobs);
          if (response.jobs.length > 0) {
            setSelectedJob(response.jobs[0]);
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
      const subject = encodeURIComponent(`[สมัครงาน]: ${selectedJob.jobPosition}`);
      window.location.href = `mailto:careers@assetwise.co.th?subject=${subject}`;
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
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {jobs.map((job) => (
            <div
              key={job.jobID}
              onClick={() => handleJobSelect(job)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                ${selectedJob?.jobID === job.jobID ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
              `}
            >
              <h3 className="font-medium text-lg text-gray-900">
                {job.jobPosition}
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                คลิกเพื่อดูรายละเอียด
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-white">
        {selectedJob ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedJob.jobPosition}
              </h1>
              <button
                onClick={handleJobSubmit}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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