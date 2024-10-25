export interface Company {
    companyID: string;
    nameTH: string;
    nameEN: string;
    logoUrl: string;
    description: string | null;
    active: boolean;
}

export interface Job {
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

// Interface for the main response
export interface JobResponse {
    companyID: string;
    bConnectionID: string;
    departmentName: string;
    jobPosition: string;
    perPage: number;
    page: number;
    total: number;
    searchStr: string;
    urgently: boolean;
    announce: boolean;
    published: boolean;
    jobs: Job[];
}

export interface SingleJob {
    jobID: string,
    companyID: string,
    deparmentID: string,
    companyLocationID: string,
    jobContractID: string,
    jobPosition: string,
    jobPositionLevelID: string,
    requiredQuantity: number,
    jobDetails: string,
    requirements: string,
    requiredRequirements: string,
    appliedQuantity: number,
    interviewQuantity: number,
    addedNewQuantity: number,
    visitsQuantity: number,
    urgently: boolean,
    announce: boolean,
    createBy: string,
    updateBy: string,
    createDate: Date
}
