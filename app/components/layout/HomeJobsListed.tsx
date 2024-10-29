"use client"

import { CircularProgress, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { bConnectionID, devUrl } from "@/lib/utils";
import JobBlock from "../ui/JobBlock";
import LastestPositions from "./LastestPositions";
import { getCompanies } from "@/lib/api";
import { Job } from "@/lib/types";

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
        const dataObj = {
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

        const config = {
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
                        <Skeleton variant="rounded" className="w-1/3" height={230} animation="wave"></Skeleton>
                        <Skeleton variant="rounded" className="w-1/3" height={230} animation="wave"></Skeleton>
                        <Skeleton variant="rounded" className="w-1/3" height={230} animation="wave"></Skeleton>
                    </div>
                )}
                
                {error && <Typography color="error">{error}</Typography>}
                
                {!loading && !error && (
                    <div className="grid lg:grid-cols-3 gap-4 mb-7">
                        { jobs.length > 0 ? (
                            jobs.slice(0,3).map((job, key) => (
                                <JobBlock key={key} job={job}></JobBlock>
                            ))
                        ) : (
                            <p>ไม่พบข้อมูล</p>
                        )}
                    </div>
                )}

                <Typography variant="h3" className="text-primary mb-4">ตำแหน่งงานทั้งหมด</Typography>
                {loading && (
                    <p>Loading...</p>
                )}

                {error && <Typography color="error">{error}</Typography>}

                {!loading && !error && (
                    <LastestPositions items={jobs.slice(3,10)}/>
                )}
                <div className="h-14"></div>
                <div className="flex justify-center items-center gap-2 flex-col md:flex-row">
                    <Typography variant="h5">ไม่พบตำแหน่งงานที่สนใจ ?</Typography>
                    <button className="bg-orange-600 text-white px-5 py-1 rounded-full transition hover:scale-105 duration-300">
                        <Typography variant="h5">ลงทะเบียนฝากประวัติ</Typography>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeJobsListed;