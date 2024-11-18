import { fetchCompanyName, getCompanyByID, getCompanyCi } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Job } from "@/lib/types";
import { Typography } from "@mui/material";
import { MapPin, Building, CircleDollarSign, CircleDot } from 'lucide-react';
import CustomButton from "./Button";
import { fetchCompanyLocations, fetchLocationByID } from "@/lib/api";

interface JobBlockProps {
    className?: string;
    job: Job;
    status?: number;
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

function JobBlock({className = '', job, status}: JobBlockProps) {
    const [companyThName, setCompanythName] = useState('');
    const [borderColor, setBorderColor] = useState<string>();
    const [location, setLocation] = useState('');

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

    return (
        <div className={`job-block p-4 flex flex-col justify-between bg-white border-2 rounded-[20px] hover:shadow-xl transition-shadow duration-300 ${className}`.trim()} style={{ borderColor: borderColor }}>
            <div className="details">
                <h4 className="leading-none text-[36px] mb-2 font-medium flex items-center gap-2" key={job.jobID}>{job.jobPosition}
                {status && appliedStatus(status)}
                </h4>
                <Typography variant="body1" className="flex gap-1 items-center text-gray-500">
                    <Building size={18} /> {companyThName}
                </Typography>
                <Typography variant="body1" className="flex gap-1 items-center text-gray-500">
                    <MapPin size={18}/> {location}
                </Typography>
                <Typography variant="body1" className="flex gap-1 items-center text-gray-500">
                    <CircleDollarSign size={18} /> เงินเดือนตามตกลง
                </Typography>
            </div>
            <div className="footer text-right">
                <CustomButton link={'/apply-job/'+job.jobID} varient="bordered">สมัครงาน</CustomButton>
            </div>
        </div>
    );
}

export default JobBlock;