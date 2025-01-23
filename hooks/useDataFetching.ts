import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchLocationByID, fetchPosition } from '@/lib/api';
import axios from 'axios';
import { prodUrl } from '@/lib/utils';
import { districts as districtsData } from '@/lib/data';
import { subDistricts as subDistrictsData } from '@/lib/data';
import { provinces as provincesData } from '@/lib/data';
import { Candidate } from '@/lib/form';
import FormData from 'form-data';
import Swal from 'sweetalert2';
import { AppliedJob } from '@/lib/types';

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
  interface SubDistrict {
    subDistrictID: number;
    districtID: number;
    postCode: number;
    nameTH: string;
    nameEN: string;
  }

  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]); // Adjust type as necessary
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubDistrict() {
      if (districtId === undefined) return; // Avoid fetching if districtId is not provided
      try {
        setIsLoading(true);
        const response = subDistrictsData.map(subDistrict => ({
          subDistrictID: subDistrict.SubDistrictID,
          districtID: subDistrict.DistrictID,
          postCode: subDistrict.PostCode,
          nameTH: subDistrict.NameTH,
          nameEN: subDistrict.NameEN
        })).filter(subDistrict => subDistrict.districtID === districtId);
        setSubDistricts(response); // Assuming the response data contains sub-district details
      } catch (error) {
        console.error('Error fetching sub-district details:', error);
        setSubDistricts([]);
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

  // Fallback data in case of error
  const eduData = useMemo(() => [
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
      "description": "ปริญญาโท / Master's degree"
    },
    {
      "educationID": 6,
      "description": "ปริญญาเอก / Ph.D."
    }
  ], []);

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
  }, [eduData]); // Added prodUrl as a dependency to avoid the error

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
        const response = await axios.get(`${prodUrl}/secure/Candidate/GetCandidate/${email}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const data = response.data;
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        if (error.response.status === 404) {
          localStorage.removeItem('authToken');
          console.log('remove authToken...');
          return;
        } else {
          setError(error?.message || 'An unknown error occurred');
        }
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

// First, let's create a specific cache manager for images
const IMAGE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface ImageCache {
  data: string;
  timestamp: number;
}

// Helper function to manage localStorage cache
const imageCache = {
  get: (key: string): string | null => {
    try {
      const cached = localStorage.getItem(`img_${key}`);
      if (!cached) return null;

      const { data, timestamp }: ImageCache = JSON.parse(cached);
      if (Date.now() - timestamp > IMAGE_CACHE_DURATION) {
        sessionStorage.removeItem(`img_${key}`);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  set: (key: string, data: string) => {
    try {
      const cacheData: ImageCache = {
        data,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(`img_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error caching image:', error);
    }
  }
};

export function useFetchBase64Image(path: string) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const authToken = typeof window !== 'undefined' ? 
    localStorage.getItem('authToken') || '' : '';

  const fetchImage = useCallback(async () => {
    if (!path) return;

    // Generate a cache key based on path and auth token
    const cacheKey = `${path}_${authToken}`;

    try {
      // First, try to get from memory cache
      const cachedImage = imageCache.get(cacheKey);
      if (cachedImage) {
        setImageData(cachedImage);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append('filePath', path);
      formData.append("Content-Type", "multipart/form-data");
      
      const response = await axios.post(
        `${prodUrl}/secure/FileManagement/File`, 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      // Cache the result
      imageCache.set(cacheKey, response.data);
      setImageData(response.data);

    } catch (error: any) {
      console.error('Error fetching base64 image:', error);
      setError(error?.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [path, authToken]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  // Add a manual refresh function
  const refreshImage = useCallback(() => {
    if (path) {
      const cacheKey = `${path}_${authToken}`;
      localStorage.removeItem(`img_${cacheKey}`);
      console.log('remove img cache...');
      fetchImage();
    }
  }, [path, authToken, fetchImage]);

  return { 
    imageData, 
    isLoading, 
    error,
    refreshImage // Expose refresh function
  };
}

// Add this to your existing cache configuration
const PDF_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface PDFCache {
  data: string;
  timestamp: number;
}

// Helper function to manage localStorage cache for PDFs
const pdfCache = {
  get: (key: string): string | null => {
    try {
      const cached = localStorage.getItem(`pdf_${key}`);
      if (!cached) return null;

      const { data, timestamp }: PDFCache = JSON.parse(cached);
      if (Date.now() - timestamp > PDF_CACHE_DURATION) {
        sessionStorage.removeItem(`pdf_${key}`);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  set: (key: string, data: string) => {
    try {
      const cacheData: PDFCache = {
        data,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(`pdf_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error caching PDF:', error);
    }
  }
};

export function useFetchBase64PDF(path: string) {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const authToken = typeof window !== 'undefined' ? 
    localStorage.getItem('authToken') || '' : '';

  const fetchPDF = useCallback(async () => {
    if (!path) return;

    // Generate a cache key based on path and auth token
    const cacheKey = `${path}_${authToken}`;

    try {
      // First, try to get from cache
      const cachedPDF = pdfCache.get(cacheKey);
      if (cachedPDF) {
        setPdfData(cachedPDF);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append('filePath', path);
      formData.append("Content-Type", "multipart/form-data");
      
      const response = await axios.post(
        `${prodUrl}/secure/FileManagement/File`, 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      // Cache the result
      pdfCache.set(cacheKey, response.data);
      setPdfData(response.data);

    } catch (error: any) {
      console.error('Error fetching base64 PDF:', error);
      setError(error?.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [path, authToken]);

  useEffect(() => {
    fetchPDF();
  }, [fetchPDF]);

  // Add a manual refresh function
  const refreshPDF = useCallback(() => {
    if (path) {
      const cacheKey = `${path}_${authToken}`;
      localStorage.removeItem(`pdf_${cacheKey}`);
      console.log('remove pdf cache...');
      fetchPDF();
    }
  }, [path, authToken, fetchPDF]);

  return { 
    pdfData, 
    isLoading, 
    error,
    refreshPDF // Expose refresh function
  };
}

export function useSubmitJobApplication(jobID: string, candidateID: string) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  
  const submitApplication = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = { 
        'jobID': jobID,
        'candidateID': candidateID
      };
      const res = await axios.post(`${prodUrl}/secure/AppliedJob/Create`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setResponse(res.data);
      return res.data; // Return the response directly
    } catch (err: any) {
      if (err.response?.status === 400) {
        setIsError(true);
        setError(err.response.data);
      } else {
        setError(err?.message || 'An unknown error occurred');
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitApplication, isSubmitting, error, isError, response };
}

export function useFetchAppliedJobs(candidateID: string) {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
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
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const updateProfile = async (profileData: Candidate) => {    
    setIsSubmitting(true);
    setError(null);
    let authToken = '';

    if (profileData) {

      if (profileData.image) {
        const isUpperCase = profileData.image.name === profileData.image.name.toUpperCase();
        if (isUpperCase) {
          const lowerCaseImageName = profileData.image.name.toLowerCase();
          Object.defineProperty(profileData.image, 'name', {
            value: lowerCaseImageName,
            writable: true,
          });
        }
      }

      // Update the profile data with the new image name
      if (typeof window !== 'undefined') {
        authToken = localStorage.getItem('authToken') || '';
      }
  
      try {        
        console.log('image', profileData.maritalStatus.maritalStatusID);
        const formData = new FormData();
        formData.append('Candidate.CandidateID', profileData.candidateID);
        formData.append('Candidate.Revision', profileData.revision ? Number(profileData.revision) : 1);
        formData.append('Candidate.Email', profileData.email);
        formData.append('Candidate.TitleID', profileData.titleID ? Number(profileData.titleID) : 1);
        formData.append('Candidate.FirstName', profileData.firstName);
        formData.append('Candidate.LastName', profileData.lastName);
        formData.append('Candidate.NickName', profileData.nickName);
        formData.append('Candidate.Tel', profileData.tel);
        formData.append('Candidate.DateOfBirth', profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString() : null);
        formData.append('Candidate.Gender.GenderID', profileData.gender ? profileData.gender.genderID : 1);
        formData.append('Candidate.MaritalStatus.MaritalStatusID', profileData.maritalStatus ? profileData.maritalStatus.maritalStatusID : 1);
        formData.append('Candidate.Image', profileData.image);
        formData.append('Candidate.CV', profileData.cv);
        formData.append('Candidate.AddressDetails', profileData.addressDetails);
        formData.append('Candidate.Province.ProvinceID', profileData.province ? profileData.province.provinceID : 0);
        formData.append('Candidate.District.DistrictID', profileData.district ? profileData.district.districtID : 0);
        formData.append('Candidate.Subdistrict.SubdistrictID', profileData.subdistrict ? profileData.subdistrict.subDistrictID : 0);
        formData.append('Candidate.PostalCode', profileData.postalCode ? Number(profileData.postalCode) : 0);
        formData.append('Candidate.SourceInformation.SourceInformationID', 1);
        formData.append('Candidate.PDPAAccepted', true);
        formData.append('Candidate.PDPAAcceptedDate', new Date().toISOString());
        formData.append('Candidate.CandidateEducations[0].EducationID', profileData.candidateEducations[0].educationID ? Number(profileData.candidateEducations[0].educationID) : 1);
        formData.append('Candidate.CandidateEducations[0].Major', profileData.candidateEducations[0].major);
        formData.append("Content-Type", "multipart/form-data");
  
        // for (const [key, value] of (formData as any).entries()) {
        //   console.log(`${key}:`, value);
        // }


        // Test
  
        const res = await axios.post(`${prodUrl}/secure/Candidate/Update`, formData, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        console.log('res', res.data);
        setResponse(res.data);
      } catch (err: any) {
        console.error('Error updating profile:', err);
        setError(err?.message || 'An unknown error occurred');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('no profile data');
    }
  };

  return { updateProfile, isSubmitting, error, response };
}

export function useTitles() {
  const [titles, setTitles] = useState<{ titleID: number; nameTH: string; nameEN: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTitles() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${prodUrl}/TitleName/TitleNames`);
        setTitles(response.data);
      } catch (err: any) {
        console.error('Error fetching titles:', err);
        setError(err?.message || 'An unknown error occurred');
        // Fallback data in case of error
        setTitles([
          { titleID: 1, nameTH: "นาย", nameEN: "Mr." },
          { titleID: 2, nameTH: "นาง", nameEN: "Mrs." },
          { titleID: 3, nameTH: "นางสาว", nameEN: "Miss" }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTitles();
  }, []);

  return { titles, isLoading, error };
}

export function useSourceInformations() {
  const [sourceInformations, setSourceInformations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSourceInformations() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${prodUrl}/SourceInformation/SourceInformations`);
        setSourceInformations(response.data);
      } catch (err: any) {
        console.error('Error fetching source informations:', err);
        setError(err?.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSourceInformations();
  }, []);

  return { sourceInformations, isLoading, error };
}

export function useBenefits(companyID: string) {
  const [benefits, setBenefits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBenefits() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${prodUrl}/Benefit/Benefits/${companyID}`);
        setBenefits(response.data);
      } catch (err: any) {
        console.error('Error fetching benefits:', err);
        setError(err?.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (companyID) {
      fetchBenefits();
    }
  }, [companyID]);

  return { benefits, isLoading, error };
}


export function useJobTitle(jobId: string) {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobTitle() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${prodUrl}/JobAnnouncement/JobAnnouncement/${jobId}`);
        setJobTitle(response.data.jobPosition);
      } catch (err: any) {
        console.error('Error fetching job title:', err);
        setError(err?.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (jobId) {
      fetchJobTitle();
    }
  }, [jobId]);

  return { jobTitle, isLoading, error };
}

export function useLanguages() {
  const [languages, setLanguages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const preLanguages = useMemo(() => {
    return [
      {
        "languageID": 1,
        "description": "อังกฤษ / English"
      },
      {
        "languageID": 2,
        "description": "จีน / Chinese"
      },
      {
        "languageID": 3,
        "description": "ญี่ปุ่น / Japanese"
      },
      {
        "languageID": 4,
        "description": "รัสเซีย / Russia"
      }
    ];
  }, []);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${prodUrl}/Language/Languages`);
        setLanguages(response.data);
      } catch (err: any) {
        console.error('Error fetching languages:', err);
        setError(err?.message || 'An unknown error occurred');
        setLanguages(preLanguages);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLanguages();
  }, []);

  return { languages, isLoading, error };
}

export function useGenders() {
  const [genders, setGenders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGenders() {
      const response = await axios.get(`${prodUrl}/Gender/Genders`);
      setGenders(response.data);
    }
    fetchGenders();
  }, []);

  return { genders, isLoading, error };
}

export function useMaritalStatus() {
  const [maritalStatuses, setMaritalStatuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaritalStatus() {
      const response = await axios.get(`${prodUrl}/MaritalStatus/MaritalStatuses`);
      setMaritalStatuses(response.data);
    }
    fetchMaritalStatus();
  }, []);

  return { maritalStatuses, isLoading, error };
}

export function useSourceInformation() {
  const [sourceInformations, setSourceInformations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSourceInformation() {
      const response = await axios.get(`${prodUrl}/SourceInformation/SourceInformations`);
      setSourceInformations(response.data);
    }
    fetchSourceInformation();
  }, []);

  return { sourceInformations, isLoading, error };
}

export default useSubmitJobApplication
