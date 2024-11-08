import { decrypt } from "./utils";

interface UserTokenProps {
  KeyType: string;
  CandidateID: string;
  Email: string;
  CreateDate: string;
  ExpiredDate: string;
}

export function checkAuth(): UserTokenProps | null {
  try {

    let token;
    if (typeof window !== 'undefined') {
      token = window?.localStorage.getItem('authToken');
    }
    
    if (!token) return null;

    const decoded = decrypt(token);

    return JSON.parse(decoded)
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

export function redirectToHome() {
  window.location.href = '/';
}