import { getCompanies } from "@/lib/api";
import { bConnectionID } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import axios from "axios";

interface JobBlockProps {
    children: ReactNode;
    className?: string;
}

function testCall() {
    let data = new FormData;
    data.append('bConnectionID', '7B93F134-D373-4227-B5A6-6B619FF0E355');
    console.log(data.get('bConnectionID'));

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://dev-career.assetwise.co.th/api/Company/DropdownItems',
        headers: { 
            'Content-Type': 'multipart/form-data', 
            //...data.getHeaders?.() ?? { 'Content-Type': 'multipart/form-data' }
        },
        body: { bConnectionID : data.get('bConnectionID') }
    };

    console.log(config);
    
    axios.request(config).then((response:any) => {
        console.log(JSON.stringify(response.data));
    }).catch((error:any) => {
        console.log(error);
    });

}

function JobBlock({children, className = ''}: JobBlockProps) {
    useEffect(()=>{
        testCall();
    }, [])
    
    return (
        <div className={`job-block ${className}`.trim()}>
            { children }
        </div>
    );
}

export default JobBlock;