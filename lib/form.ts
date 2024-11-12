// export interface ApplicationFormData {
//   // Basic Info
//   position?: string;
//   expectedSalary?: string;
//   experience?: string;
//   profileImage?: File;
//   cv?: File;

//   // Address Info
//   addressLine1?: string;
//   addressLine2?: string;
//   province?: number;
//   district?: number;
//   postalCode?: number;

//   // Personal Info
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   phone?: string;
//   birthDate?: string;
//   gender?: number;

//   // Other Info
//   education?: string;
//   skills?: string[];
//   certificates?: File[];
// }

// export type FormField = keyof ApplicationFormData;



export interface Candidate {
  jobID: string; // Assuming uuid is represented as a string
  candidateID: string;
  revision: number; // Assuming integer is represented as number
  email: string;
  titleID: number; // Assuming integer is represented as number
  firstName: string;
  lastName: string;
  nickName: string;
  tel: string;
  dateOfBirth: string; // Assuming dateTime is represented as string
  gender: {
    genderID: number; // Assuming integer is represented as number
    description: string;
  };
  maritalStatus: {
    maritalStatusID: number; // Assuming integer is represented as number
    description: string;
  };
  imageUrl: string;
  cvUrl: string;
  addressDetails: string;
  province: {
    provinceID: number; // Assuming integer is represented as number
    nameTH: string;
    nameEN: string;
  };
  district: {
    districtID: number; // Assuming integer is represented as number
    provinceID: number; // Assuming integer is represented as number
    nameTH: string;
    nameEN: string;
  };
  subdistrict: {
    subdistrictID: number; // Assuming integer is represented as number
    districtID: number; // Assuming integer is represented as number
    postCode: number;
    nameTH: string;
    nameEN: string;
  };
  postalCode: number;
  sourceInformation: {
    sourceInformationID: number; // Assuming integer is represented as number
    description: string;
  };
  pdpAAccepted: boolean;
  pdpAAcceptedDate: string; // Assuming dateTime is represented as string
  candidateEducations: object[]; // Assuming array of objects
  candidateLanguages: object[]; // Assuming array of objects
}

// Add this type definition and export
export type ApplicationFormData = {
  // Define your form fields here, for example:
  name: string;
  email: string;
  // ... other fields
};