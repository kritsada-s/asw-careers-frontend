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

export interface Position {
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


export interface FormData {
    personalInfo?: {
        firstName?: string;
        lastName?: string;
        // Add more fields as needed
    };
    workHistory?: {
        // Work history fields
    };
    education?: {
        // Education fields
    };
    // Add more sections as needed
}

export interface FormStepProps {
    formData: FormData;
    updateFormData: (sectionKey: keyof FormData, data: any) => void;
    onNext: () => void;
    onPrevious: () => void;
    isLastStep: boolean;
}

export interface FormStep {
    id: number;
    title: string;
    description: string;
    component: React.ComponentType<FormStepProps>;
}

export interface TokenProps {
    KeyType: string;
    CandidateID: string;
    Email: string;
    CreateDate: string;
    ExpiredDate: string;
  }

export type ModalType = 'auth' | 'confirm' | 'alert';

export interface ModalConfig {
  type: ModalType;
  props?: Record<string, any>;
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}
