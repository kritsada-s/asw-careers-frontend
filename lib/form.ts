export interface ApplicationFormData {
  // Basic Info
  position?: string;
  expectedSalary?: string;
  experience?: string;
  profileImage?: File;
  cv?: File;

  // Address Info
  addressLine1?: string;
  addressLine2?: string;
  province?: string;
  district?: string;
  postalCode?: string;

  // Personal Info
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;

  // Other Info
  education?: string;
  skills?: string[];
  certificates?: File[];
}

export type FormField = keyof ApplicationFormData;

export interface Candidate {
  JobID: string; // Assuming uuid is represented as a string
  CandidateID: string;
  Revision: number; // Assuming integer is represented as number
  Email: string;
  TitleID: number; // Assuming integer is represented as number
  FirstName: string;
  LastName: string;
  NickName: string;
  Tel: string;
  DateOfBirth: string; // Assuming dateTime is represented as string
  Gender: {
    GenderID: number; // Assuming integer is represented as number
    Description: string;
  };
  MaritalStatus: {
    MaritalStatusID: number; // Assuming integer is represented as number
    Description: string;
  };
  ImageUrl: string;
  CVUrl: string;
  AddressDetails: string;
  Province: {
    ProvinceID: number; // Assuming integer is represented as number
    NameTH: string;
    NameEN: string;
  };
  District: {
    DistrictID: number; // Assuming integer is represented as number
    ProvinceID: number; // Assuming integer is represented as number
    NameTH: string;
    NameEN: string;
  };
  Subdistrict: {
    SubdistrictID: number; // Assuming integer is represented as number
    DistrictID: number; // Assuming integer is represented as number
    PostCode: string;
    NameTH: string;
    NameEN: string;
  };
  PostalCode: string;
  SourceInformation: {
    SourceInformationID: number; // Assuming integer is represented as number
    Description: string;
  };
  PDPAAccepted: boolean;
  PDPAAcceptedDate: string; // Assuming dateTime is represented as string
  CandidateEducations: object[]; // Assuming array of objects
  CandidateLanguages: object[]; // Assuming array of objects
}