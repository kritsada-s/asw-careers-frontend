import { useState, useEffect } from 'react';
import { fetchLocationByID, fetchPosition } from '@/lib/api';
import axios from 'axios';
import { prodUrl } from '@/lib/utils';
import { districts as districtsData } from '@/lib/data';
import { subDistricts as subDistrictsData } from '@/lib/data';
import { provinces as provincesData } from '@/lib/data';

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



