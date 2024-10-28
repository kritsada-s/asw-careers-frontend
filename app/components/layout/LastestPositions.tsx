import { fetchLocationByID } from "@/lib/api";
import { Job } from "@/lib/types";
import { Typography } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { WorkLocation } from "../ui/WorkLocation";
import { Department } from "../ui/Department";

interface LastestPositionsProps {
    items: Job[]
}

const PositionCell = ({children}:{children:ReactNode}) => {
    return (
        <div className="w-1/3 px-4 py-3">{ children }</div>
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
            <Typography variant="body1">ขณะนี้ไม่มีตำแหน่งงานที่ประกาศ</Typography>
        );
    }

    return (
        <div className="lastest-positions-listed">
            <div className="listed-header flex font-medium text-xl -ml-4 -mr-4">
                <PositionCell>ตำแหน่ง</PositionCell>
                <PositionCell>ทีม / แผนก</PositionCell>
                <PositionCell>Location</PositionCell>
            </div>
            { items.map((item, key)=>(
                <div className="text-[24px] lastest-position-item -ml-4 -mr-4 flex justify-between hover:bg-primary-600 hover:text-white hover:shadow-md cursor-pointer rounded-sm" key={key}>
                    <PositionCell><strong>{ item.jobPosition }</strong></PositionCell>
                    <PositionCell><Department comp={item.companyID} did={item.deparmentID}/></PositionCell>
                    <PositionCell><WorkLocation comp={item.companyID} loc={item.companyLocationID} /></PositionCell>
                </div>
            )) }
        </div>
    )
}

export default LastestPositions;