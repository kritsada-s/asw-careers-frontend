import { fetchCompanyName, getCompanyCi } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { Job, TokenProps } from "@/lib/types";
import { MapPin, Building, CircleDollarSign, CircleDot, CalendarCheck } from 'lucide-react';
import { fetchLocationByID } from "@/lib/api";
import { AuthContext } from "@/app/providers";

interface JobBlockProps {
    className?: string;
    job: Job;
    status?: number;
    applyDate?: string | null;
}

const appliedStatus = (status: number) => {
    const statuses = [
        {
            "statusID": 1,
            "name": "รอดำเนินการ",
            "color": "#bcaaa4"
        },
        {
            "statusID": 2,
            "name": "รอสัมภาษณ์",
            "color": "#ffc107"
        },
        {
            "statusID": 3,
            "name": "รอพิจารณา",
            "color": "#e0e0e0"
        },
        {
            "statusID": 4,
            "name": "ผ่านพิจารณา",
            "color": "#81d4fa"
        },
        {
            "statusID": 5,
            "name": "รับเข้าทำงาน",
            "color": "#53A548"
        },
        {
            "statusID": 6,
            "name": "ปฏิเสธ",
            "color": "#c62828"
        }
    ]
    const statusItem = statuses.find(item => item.statusID === status);
    return statusItem ? <span style={{ color: statusItem.color, borderColor: statusItem.color }} className={`border rounded-full px-2 py-1 text-[16px]`}>{statusItem.name}</span> : <span>ไม่พบสถานะ</span>;
}

function JobBlock({className = '', job, status, applyDate}: JobBlockProps) {
    const [companyThName, setCompanythName] = useState('');
    const [borderColor, setBorderColor] = useState<string>();
    const [location, setLocation] = useState('');   
    const userData = useContext(AuthContext);
    
    useEffect(()=>{
        const getCompanyData = async () => {
            const thName = await fetchCompanyName(job.companyID)
            const location = await fetchLocationByID(job.companyID, job.companyLocationID)
            setCompanythName(thName.nameTH || 'N/A')
            setLocation(location)
        }
        const bcolor = getCompanyCi(job.companyID);
        setBorderColor(bcolor)
        getCompanyData().catch(console.error)
    }, [job.companyID, job.companyLocationID])

    function handleApplyJob() {
        window.location.href = '/jobs/?id='+job.jobID;
        return;
        // if (userData) {
        //     // Assuming you have an API endpoint to send the application data
        //     fetch('/secure/AppliedJob/Create', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             jobID: job.jobID,
        //             candidateID: userData.CandidateID,
        //         }),
        //     })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('Application successful:', data);
        //         // Optionally, redirect or show a success message
        //     })
        //     .catch(error => {
        //         console.error('There was a problem with the fetch operation:', error);
        //     });
        // } else {
        //     window.location.href = '/jobs/?id='+job.jobID;
        // }
    }

    const ApplyJobButton = () => {
        return (
            <button onClick={handleApplyJob} className="w-[145px] text-center inline-block border-2 border-primary-700 rounded-[30px] px-[27px] py-[10px] leading-[24px] text-[28px] text-primary hover:bg-primary-700 hover:text-white transition-all">สมัครงาน</button>
        )
    }

    return (
        <div className={`job-block p-4 flex flex-col justify-between bg-white border-2 rounded-[20px] hover:shadow-xl transition-shadow duration-300 ${className}`.trim()} style={{ borderColor: borderColor }}>
            <div className="details">
                <h4 className="leading-none text-[36px] mb-2 font-medium" key={job.jobID}>{job.jobPosition}
                {status && appliedStatus(status)}
                { (job.urgently && !status) && <span className="bg-red-700 text-white ml-2 px-[15px] py-[2px] inline-block -translate-y-[4px] rounded-full text-xs leading-none">ด่วน</span>}
                </h4>
                <div className="detail flex flex-col gap-1 mb-2 leading-none">
                    <p className="flex gap-1 items-center text-gray-500">
                        <Building size={18} /> {companyThName}
                    </p>
                    <p className="flex gap-1 items-center text-gray-500">
                        <MapPin size={18}/> {location}
                    </p>
                    { applyDate !== undefined && applyDate !== '' ? (
                        <p className="flex gap-1 items-center text-gray-500">
                            <CalendarCheck size={18} /> สมัครแล้วเมื่อ { new Date(applyDate || '').toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) }
                        </p>
                    ) : (
                        <p className="flex gap-1 items-center text-gray-500">
                            <CircleDollarSign size={18} /> เงินเดือนตามตกลง
                        </p>
                    )}
                </div>
            </div>
            { !status && (
                <div className="footer text-right">
                    <ApplyJobButton />
                </div>
            )}
        </div>
    );
}

export default JobBlock;