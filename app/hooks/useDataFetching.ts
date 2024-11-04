import { useState, useEffect } from 'react';
import { fetchLocationByID, fetchPosition } from '@/lib/api';
import axios from 'axios';
import { devUrl } from '@/lib/utils';
import { Position } from '@/lib/types';

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
        const path = devUrl+'/Department/DepartmentByID/'
        axios.get(path+did+'/'+comp).then((response:any) => {
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
    districtID: number;
    provinceID: number;
    nameTH: string;
    nameEN: string;
  }

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        setIsLoading(true);
        const response = await axios.get(devUrl+'/Address/Provinces');
        setProvinces(response.data); // Assuming the response data is an array of province names
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
  const [districts, setDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDistricts() {
      if (provinceId === undefined) return; // Avoid fetching if provinceId is not provided
      try {
        setIsLoading(true);
        const response = await axios.get(`/Address/Districts/${provinceId}`);
        setDistricts(response.data); // Assuming the response data is an array of district names
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

export function useSubDistrict(districtId: number) {
  const [subDistrict, setSubDistrict] = useState<any>(null); // Adjust type as necessary
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubDistrict() {
      if (districtId === undefined) return; // Avoid fetching if districtId is not provided
      try {
        setIsLoading(true);
        const response = await axios.get(`/Address/Districts/${districtId}`);
        setSubDistrict(response.data); // Assuming the response data contains sub-district details
      } catch (error) {
        console.error('Error fetching sub-district details:', error);
        setSubDistrict(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubDistrict();
  }, [districtId]);

  return { subDistrict, isLoading };
}


