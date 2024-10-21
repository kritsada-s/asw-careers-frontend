import axios, { AxiosResponse } from 'axios';
import { devUrl } from './utils';

const apiClient = axios.create({
  baseURL: devUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/plain'
  }
});

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

async function apiCall<T>(endpoint: string, method: string = 'GET', data?: any): Promise<ApiResponse<T>> {
  try {
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

export async function getCompanies(bConnectionID: string): Promise<ApiResponse<any>> {
  if (!bConnectionID) {
    throw new Error('bConnectionID is required');
  }
  return apiCall('/Company/DropdownItems', 'GET', { bConnectionID });
}

// Usage example:
/*
import { getCompanies } from './api';

async function fetchCompanies() {
  const bConnectionID = '7B93F134-D373-4227-B5A6-6B619FF0E355';
  try {
    const response = await getCompanies(bConnectionID);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching companies:', error);
  }
}
*/