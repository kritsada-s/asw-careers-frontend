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