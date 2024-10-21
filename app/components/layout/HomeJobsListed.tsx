"use client"

import { CircularProgress, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { bConnectionID, defaultID, devUrl } from "@/lib/utils";
import JobBlock from "../ui/JobBlock";

interface Job {
    jobID: string;
    companyID: string;
    deparmentID: string;
    companyLocationID: string;
    jobContractID: string;
    jobPosition: string;
    jobPositionLevelID: string;
    requiredQuantity: number;
    jobDetails: string;
    requirements: string;
    requiredRequirements: string;
    appliedQuantity: number;
    interviewQuantity: number;
    addedNewQuantity: number;
    visitsQuantity: number;
    urgently: boolean;
    announce: boolean;
    createBy: string;
    updateBy: string;
    createDate: string;
    }

interface JobResponse {
    jobs: Job[];
    total: number;
}

function HomeJobsListed() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const path = "/JobAnnouncement/JobAnnouncementsByPage";

    useEffect(() => {
        let dataObj = {
            companyID: "00000000-0000-0000-0000-000000000000",
            bConnectionID: bConnectionID,
            departmentName: "",
            jobPosition: "",
            perPage: 10,
            page: 1,
            total: 1,
            searchStr: "",
            urgently: true,
            announce: true,
            published: true
        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: devUrl+path,
            headers: { 
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': true,
                'Accept': 'text/plain'
            },
            data : dataObj
        };

        axios.request(config).then((response:any) => {
            setJobs(response.data.jobs)
            setLoading(false)
        }).catch((error:any) => {
            console.log(error);
            setLoading(false)
        });

    }, []);

    return (
        <div id="jobListed" className="min-h-[500px] bg-gradient-to-b from-white to-[#F2F9FF] py-5 lg:pt-9 lg:pb-12">
            <div className="container px-4 lg:px-0">
                <Typography variant="h3" className="text-primary mb-4">ตำแหน่งงานที่มีการประกาศล่าสุด</Typography>
                {loading && (
                    <div className="flex gap-4">
                        <Skeleton variant="rounded" className="w-1/3" height={230}></Skeleton>
                        <Skeleton variant="rounded" className="w-1/3" height={230}></Skeleton>
                        <Skeleton variant="rounded" className="w-1/3" height={230}></Skeleton>
                    </div>
                )}
                
                {error && <Typography color="error">{error}</Typography>}
                
                {!loading && !error && (
                    <div className="grid lg:grid-cols-3 gap-4 mb-7">
                        {jobs.slice(0,3).map((job, key) => (
                            <JobBlock className="bg-white aspect-video border border-gray-300 rounded-md" key={key}>
                                <Typography key={job.jobID}>{job.jobPosition}</Typography>
                            </JobBlock>
                        ))}
                    </div>
                )}

                <Typography variant="h3" className="text-primary mb-4">ตำแหน่งงานทั้งหมด</Typography>
                {loading && (
                    <p>Loading...</p>
                )}

                {error && <Typography color="error">{error}</Typography>}

                {!loading && !error && (
                    <>
                        {jobs.slice(4,10).map((job, key) => (
                            <JobBlock className="bg-white border border-gray-300 rounded-md mb-4" key={key}>
                                <Typography key={job.jobID}>{job.jobPosition}</Typography>
                            </JobBlock>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default HomeJobsListed;