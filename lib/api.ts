import axios, { AxiosResponse } from 'axios';
import { bConnectionID } from './utils';
import {prodUrl, default_params } from './utils';
import { Company, JobResponse, Position} from './types';
import { Candidate } from './form';
import { useContext } from 'react';
import { AuthContext } from '@/pages/providers';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

function getApiClient() {
  return axios.create({
    baseURL: prodUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    }
  });
}

async function apiCall<T>(endpoint: string, method: string = 'GET', data?: any): Promise<ApiResponse<T>> {
  try {
    const apiClient = getApiClient();
    const response: AxiosResponse<T> = await apiClient.request({
      url: endpoint,
      method,
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }
}

export async function getCompanies(companyID: string): Promise<Company | null> {
  try {
    const response = await apiCall('/Company/DropdownItems/' + bConnectionID, 'GET');
    
    // Type guard to ensure response.data is an array
    if (!response.data || !Array.isArray(response.data)) {
      console.log('No data available or invalid data format');
      return null;
    }

    // Find the company with matching companyID
    const matchedCompany = response.data.find((company: Company) => 
      company.companyID === companyID
    );

    return matchedCompany || null;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}

interface CompanyLocationsResult {
  locationName: string | null;
  error?: string;
}

interface LocationResult {
  companyLocationID : string;
  companyID: string;
  description: string;
  googleMapLink: string;
  createBy: string;
  updateBy: string;
  active: boolean;
}

export async function fetchCompanyLocations(companyID: string): Promise<LocationResult[] | null> {
  try {
    const result = await apiCall<LocationResult[]>('/CompanyLocation/Locations/'+companyID, 'GET')
    if (result) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching company locations:', error)
    return null;
  }
}

interface LocationByIDProps {
  companyID: string;
  locationID: string;
}

export async function fetchLocationByID(companyID: string, locationID: string): Promise<string> {
  try {
    const locations = await fetchCompanyLocations(companyID);
    
    if (locations && locationID) {
      const matchedLocation = locations.find(
        location => location.companyLocationID === locationID
      );
      
      if (matchedLocation) {
        return matchedLocation.description;
      }
    }

    return 'N/A';
  } catch (error) {
    console.error('Error in fetchLocationByID:', error);
    return 'N/A';
  }
}

export async function fetchedJobs(searchTerm?: string): Promise<JobResponse> {
  default_params.searchStr = searchTerm || '';
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: prodUrl+'/JobAnnouncement/JobAnnouncementsByPage',
    headers: { 
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(default_params)
  };
  
  try {
    const response = await axios.request<JobResponse>(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

export async function fetchPosition(id:string) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: prodUrl+'/JobAnnouncement/JobAnnouncement/'+id,
    headers: { 
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(default_params)
  };
  
  try {
    const response = await axios.request<Position>(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

export interface ProfileData {
    candidateID: string;
    revision: number;
    email: string;
    titleID: number;
    firstName: string;
    lastName: string;
    nickName: string | null;
    tel: string;
    dateOfBirth: string;
    gender: {
        genderID: number;
        description: string;
    };
    maritalStatus: {
        maritalStatusID: number;
        description: string;
    };
    imageUrl: string;
    image: string | null;
    cvUrl: string;
    cv: string | null;
    addressDetails: string;
    province: {
        provinceID: number;
        nameTH: string;
        nameEN: string;
    };
    district: {
        districtID: number;
        provinceID: number;
        nameTH: string;
        nameEN: string;
    };
    subdistrict: {
        subdistrictID: number;
        districtID: number;
        postCode: string | null;
        nameTH: string | null;
        nameEN: string | null;
    };
    postalCode: string | null;
    sourceInformation: {
        sourceInformationID: number;
        description: string;
    };
    pdpaAccepted: boolean;
    pdpaAcceptedDate: string;
    candidateEducations: {
        candidateID: string;
        revision: number;
        educationID: number;
        major: string;
    }[];
    candidateLanguages: any[]; // Adjust type as necessary
}

export async function fetchProfileData(email: string): Promise<Candidate> {
  const formData = new FormData();
  formData.append('email', email);

  let token;

  if (typeof window !== 'undefined') {
    token = window?.localStorage.getItem('authToken') || '';
  }

  const config = {
    method: 'get',
    url: prodUrl+'/secure/Candidate/GetCandidate/'+email,
    headers: { 
      'Authorization': 'Bearer '+token
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}
