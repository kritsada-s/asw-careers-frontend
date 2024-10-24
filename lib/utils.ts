import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getCompanies } from "./api";
import { Company } from "./types";
import { useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const defaultID = "00000000-0000-0000-0000-000000000000";
export const devUrl = "https://dev-career.assetwise.co.th/api";
export const bConnectionID = "7B93F134-D373-4227-B5A6-6B619FF0E355";

export async function getCompanyByID (companyID:string) {
  try {
    const company = await getCompanies(companyID);
    if (company) {
      return company;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error finding company:', error);
    throw error;
  }
}

// Function to fetch company name

interface CompanyNameResult {
  nameTH: string | null;
  error?: string;
}

export const default_params = {
  companyID: "00000000-0000-0000-0000-000000000000",
  bConnectionID: "7B93F134-D373-4227-B5A6-6B619FF0E355",
  departmentName: "",
  jobPosition: "",
  perPage: 10,
  page: 1,
  total: 1,
  searchStr: "",
  urgently: true,
  announce: true,
  published: true
};

export async function fetchCompanyName(companyID: string): Promise<CompanyNameResult> {
  try {
    const result = await getCompanyByID(companyID);
    if (result) {
      return { nameTH: result.nameTH };
    }
    return { nameTH: null };
  } catch (error) {
    console.error('Error fetching company name:', error);
    return { 
      nameTH: null, 
      error: 'Failed to fetch company name' 
    };
  }
}

export function getCompanyCi(companyID:string) {
  if (companyID !== '') {
    switch (companyID) {
      case '0886f27c-340a-433a-b753-60906abe84cc':
        return '#EB6424';
        break;
      case 'thetitleresidence':
        return '#AFBC37';
        break;
      case 'b0486dbc-0a09-443d-9293-e27da4beaf81':
        return '#2B6470';
        break;
      default:
        return '#123F6D';
        break;
    }
  }
}
