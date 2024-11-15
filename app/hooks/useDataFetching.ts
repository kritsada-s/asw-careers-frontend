import { useState, useEffect } from 'react';
import { fetchLocationByID, fetchPosition } from '@/lib/api';
import axios from 'axios';
import { prodUrl } from '@/lib/utils';
import { districts as districtsData } from '@/lib/data';
import { subDistricts as subDistrictsData } from '@/lib/data';
import { provinces as provincesData } from '@/lib/data';
import { Candidate } from '@/lib/form';
import Swal from 'sweetalert2';

// Hook for fetching Data
export function useWorkLocation(comp: string, loc: string) {
  const [location, setLocation] = useState<string>('N/A');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        setIsLoading(true);
        const result = await fetchLocationByID(comp, loc);
        setLocation(result);
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation('N/A');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocation();
  }, [comp, loc]);

  return { location, isLoading };
}

export function useDepartment(comp: string, did: string) {
  const [department, setDepartment] = useState<string>('N/A');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      try {
        setIsLoading(true);
        const path = prodUrl + '/Department/DepartmentByID/'
        axios.get(path + did + '/' + comp).then((response: any) => {
          setDepartment(response.data.nameTH);
        })
      } catch (error) {
        console.error('Error fetching location:', error);
        setDepartment('N/A');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDepartment();
  }, [comp, did]);

  return { department, isLoading };
}

export function useProvinces() {
  interface Province {
    provinceID: number;
    nameTH: string;
    nameEN: string;
  }

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        setIsLoading(false);
        setProvinces(provincesData.map(province => ({
          provinceID: province.ProvinceID,
          nameTH: province.NameTH,
          nameEN: province.NameEN
        }))); // Using fetched provinces data instead of API
      } catch (error) {
        console.error('Error fetching provinces:', error);
        setProvinces([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProvinces();
  }, []);

  return { provinces, isLoading };
}

export function useDistricts(provinceId: number) {
  interface District {
    districtID: number;
    provinceID: number;
    nameTH: string;
    nameEN: string;
  }

  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDistricts() {
      if (provinceId === undefined) return; // Avoid fetching if provinceId is not provided
      try {
        setIsLoading(true);
        const response = districtsData.map(district => ({
          districtID: district.DistrictID,
          provinceID: district.ProvinceID,
          nameTH: district.NameTH,
          nameEN: district.NameEN
        })).filter(district => district.provinceID === provinceId);
        setDistricts(response); // Filter districts by provinceID
      } catch (error) {
        console.error('Error fetching districts:', error);
        setDistricts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDistricts();
  }, [provinceId]);

  return { districts, isLoading };
}

export function useSubDistricts(districtId: number) {
  const [subDistricts, setSubDistricts] = useState<any>(null); // Adjust type as necessary
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubDistrict() {
      if (districtId === undefined) return; // Avoid fetching if districtId is not provided
      try {
        setIsLoading(true);
        const response = subDistrictsData.map(subDistrict => ({
          SubDistrictID: subDistrict.SubDistrictID,
          DistrictID: subDistrict.DistrictID,
          PostCode: subDistrict.PostCode,
          NameTH: subDistrict.NameTH,
          NameEN: subDistrict.NameEN
        })).filter(subDistrict => subDistrict.DistrictID === districtId);
        setSubDistricts(response); // Assuming the response data contains sub-district details
      } catch (error) {
        console.error('Error fetching sub-district details:', error);
        setSubDistricts(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubDistrict();
  }, [districtId]);

  return { subDistricts, isLoading };
}

export function useEducations() {
  const [educations, setEducations] = useState<any[]>([]); // Adjust type as necessary
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEducations() {
      try {
        setIsLoading(true);
        const response = await fetch(prodUrl + '/Education/Educations');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEducations(data); // Assuming the response data is an array of education objects
      } catch (error: any) {
        console.error('Error fetching educations:', error);
        setError(error?.message || 'An unknown error occurred');
        setEducations(eduData);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEducations();
    const eduData = [
      {
        "educationID": 1,
        "description": "ปวช. / Vocational Certificate"
      },
      {
        "educationID": 2,
        "description": "ปวส. / High Vocational Certificate"
      },
      {
        "educationID": 3,
        "description": "อนุปริญญา / Diploma"
      },
      {
        "educationID": 4,
        "description": "ปริญญาตรี / Bachelor's degree"
      },
      {
        "educationID": 5,
        "description": "ปริญญาเอก / Ph.D."
      }
    ];

  }, []);

  return { educations, isLoading, error };
}

export function useUserProfile (email: string) {
  const [profile, setProfile] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  let authToken = '';

  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('authToken') || '';
  }

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoading(true);
        const response = await fetch(`${prodUrl}/secure/Candidate/GetCandidate/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        setError(error?.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (email) {
      fetchUserProfile();
    }

  }, [email, authToken]);

  return { profile, isLoading, error };
};

export function useFetchBase64Image(path: string) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  let authToken = '';

  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('authToken') || '';
  }

  useEffect(() => {
    async function fetchImage() {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('filePath', path);
        formData.append("Content-Type", "multipart/form-data");
        const response = await axios.post(`${prodUrl}/secure/FileManagement/File`, formData, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        setImageData(response.data);
      } catch (error: any) {
        console.error('Error fetching base64 image:', error);
        setError(error?.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (path) {
      fetchImage();
    }
  }, [path, authToken]);

  return { imageData, isLoading, error };
}

export function useSubmitJobApplication(jobID: string, candidateID: string) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  let authToken = '';

  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('authToken') || '';
  }

  const submitApplication = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: any = { 
        'jobID': jobID,
        'candidateID': candidateID
      };
      const res = await axios.post(`${prodUrl}/secure/AppliedJob/Create`, payload, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setResponse(res.data);
    } catch (err: any) {
      if (err.response.status === 400) {
        setIsError(true);
        setIsSubmitting(false);
      } else {
        console.error('Error submitting job application:', err);
        setError(err?.message || 'An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitApplication, isSubmitting, error, isError, response };
}

export function useFetchAppliedJobs(candidateID: string) {
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  let authToken = '';

  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('authToken') || '';
  }

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${prodUrl}/secure/AppliedJob/AppliedJobs/${candidateID}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        setAppliedJobs(res.data);
      } catch (err: any) {
        console.error('Error fetching applied jobs:', err);
        setError(err?.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (candidateID) {
      fetchAppliedJobs();
    }
  }, [candidateID, authToken]);

  return { appliedJobs, isLoading, error };
}

export function useProfileUpdate() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const updateProfile = async (profileData: any) => {
    console.log(profileData);
    setIsSubmitting(true);
    setError(null);
    let authToken = '';

    if (typeof window !== 'undefined') {
      authToken = localStorage.getItem('authToken') || '';
    }

    try {
      const res = await axios.post(`${prodUrl}/secure/AppliedJob/Update`, profileData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setResponse(res.data);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err?.message || 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateProfile, isSubmitting, error, response };
}