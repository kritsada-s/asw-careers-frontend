import { fetchLocationByID } from "@/lib/api";
import { Job } from "@/lib/types";
import { ReactNode, useEffect } from "react";
import { WorkLocation } from "../ui/WorkLocation";
import { Department } from "../ui/Department";
import Link from "next/link";

interface LastestPositionsProps {
    items: Job[]
}

const PositionCell = ({children, className = 'w-1/3'}:{children:ReactNode, className?:string}) => {
    return (
        <div className={`md:px-4 md:py-3 ${className}`}>{ children }</div>
    )
}

const LastestPositions: React.FC<LastestPositionsProps> = ({items}) => {

    function getWorkLocation(comp: string, loc: string, callback: (result: string) => void) {
        fetchLocationByID(comp, loc)
            .then((result) => {
                callback(result);
            })
            .catch((error) => {
                console.error('Error fetching work location:', error);
                callback('N/A');
            });
    }

    if (!items || items.length === 0) {
        return (
            <p>ขณะนี้ไม่มีตำแหน่งงานที่ประกาศ</p>
        );
    }

    return (
        <div className="lastest-positions-listed">
            <div className="listed-header hidden md:flex font-medium text-xl md:-ml-4 md:-mr-4">
                <PositionCell>ตำแหน่ง</PositionCell>
                <PositionCell>ทีม / แผนก</PositionCell>
                <PositionCell>Location</PositionCell>
            </div>
            { items.map((item, key)=>(
                <Link href={{ pathname: '/jobs', query: { id: item.jobID} }} className="text-[24px] lastest-position-item -ml-4 -mr-4 flex flex-wrap md:flex-nowrap px-4 py-2 md:p-0 justify-between lg:hover:bg-primary-600 lg:hover:text-white lg:hover:shadow-md cursor-pointer rounded-sm font-light" key={key}>
                    <PositionCell className="w-full md:w-1/3"><span className="font-medium">{ item.jobPosition }</span> { item.urgently ? <span className="bg-red-700 text-white px-2 py-0 rounded-full text-xs leading-none">ด่วน</span> : ''}</PositionCell>
                    <PositionCell className="w-1/2 md:w-1/3"><Department comp={item.companyID} did={item.deparmentID}/></PositionCell>
                    <PositionCell className="w-1/2 md:w-1/3"><WorkLocation comp={item.companyID} loc={item.companyLocationID} /></PositionCell>
                    <hr className="w-full mt-3 md:hidden border-neutral-300" />
                </Link>
            )) }
        </div>
    )
}

export default LastestPositions;