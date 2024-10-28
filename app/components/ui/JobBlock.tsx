import { fetchCompanyName, getCompanyByID, getCompanyCi } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Job } from "@/lib/types";
import { Typography } from "@mui/material";
import { MapPin, Building, CircleDollarSign } from 'lucide-react';
import CustomButton from "./Button";
import { fetchCompanyLocations, fetchLocationByID } from "@/lib/api";

interface JobBlockProps {
    className?: string;
    job: Job;
}

function JobBlock({className = '', job}: JobBlockProps) {
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
                <Typography variant="h4" className="leading-none" key={job.jobID}>{job.jobPosition}</Typography>
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
                <CustomButton link="/jobs" varient="bordered">สมัครงาน</CustomButton>
            </div>
        </div>
    );
}

export default JobBlock;