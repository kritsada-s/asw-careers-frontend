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

// Basic interfaces for nested objects
interface Gender {
    genderID: number;
    description: string;
}

interface MaritalStatus {
    maritalStatusID: number;
    description: string;
}

interface Province {
    provinceID: number;
    nameTH: string;
    nameEN: string;
}

interface District {
    districtID: number;
    provinceID: number;
    nameTH: string;
    nameEN: string;
}

interface Subdistrict {
    subdistrictID: number;
    districtID: number;
    postCode: string | null;
    nameTH: string;
    nameEN: string;
}

interface SourceInformation {
    sourceInformationID: number;
    description: string;
}

interface CandidateEducation {
    candidateID: string;
    revision: number;
    educationID: number;
    major: string;
}

interface CandidateLanguage {
    candidateID: string;
    revision: number;
    languageID: number;
    level: number;
}

// Main FormData interface
export interface FormData {
    candidateID: string;
    expectedSalary: number;
    experience: number;
    revision: number;
    email: string;
    titleID: number;
    firstName: string;
    lastName: string;
    nickName: string | null;
    tel: string;
    dateOfBirth: string;
    gender: Gender;
    maritalStatus: MaritalStatus;
    imageUrl: string;
    image: string | null;
    cvUrl: string;
    cv: string | null;
    addressDetails: string;
    province: Province;
    district: District;
    subdistrict: Subdistrict;
    postalCode: string | null;
    sourceInformation: SourceInformation;
    pdpaAccepted: boolean;
    pdpaAcceptedDate: string;
    candidateEducations: CandidateEducation[];
    candidateLanguages: CandidateLanguage[];
}

export interface FormStepProps {
    formData: FormData;
    updateFormData: (sectionKey: keyof FormData, data: any) => void;
    onNext: () => void;
    onPrevious: () => void;
    isLastStep: boolean;
    jobId: string;
    jobTitle: string;
}

export interface BasicInfo {
    position?: string;
    expectedSalary?: string;
    experience?: string;
    profileImage?: File;
    cv?: File;
}

export interface AddressInfo {
    addressLine1?: string;
    addressLine2?: string;
    province?: string;
    district?: string;
    postalCode?: string;
}

export interface PersonalInfo {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
}

export interface OtherInfo {
    education?: string;
    skills?: string[];
    certificates?: File[];
}

export interface BaseFormProps {
    onNext?: () => void;
    onPrevious?: () => void;
    isSubmitting: boolean;
    updateData: (data: any) => void;
}

// Specific form step props
export interface BasicInfoFormProps extends BaseFormProps {
    jobId?: string | string[];
    data: BasicInfo;
}

export interface AddressInfoFormProps extends BaseFormProps {
    data: AddressInfo;
}

export interface PersonalInfoFormProps extends BaseFormProps {
    data: PersonalInfo;
}

export interface OtherInfoFormProps extends BaseFormProps {
    data: OtherInfo;
    onSubmit: () => void;
}

export interface FormStep {
    id?: number;
    title?: string;
    component: React.ComponentType<any>;
    props: BasicInfoFormProps | AddressInfoFormProps | PersonalInfoFormProps | OtherInfoFormProps;
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
