"use client"
import { createContext, useCallback, useEffect, useState } from "react";
import { decrypt, prodUrl } from "@/lib/utils";
import { ContextTokenProps } from "@/lib/types";
export const AuthContext = createContext<ContextTokenProps | null>(null);

export function AuthContextProvider({children}: {children: React.ReactNode}) {
  const [cuData, setCUData] = useState<ContextTokenProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkValidToken = useCallback(async (token: string): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append('token', token);
        const response = await fetch(`${prodUrl}/Authorization/TokenValidation`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        console.log('Token validation response:', data);

        return data; // Assuming the API returns an object with an 'isValid' property
      } catch (error) {
          console.error('Error validating token:', error);
          return false;
      }
  }, []);

  const validateCandidate = useCallback(async (token: string, email: string): Promise<boolean> => {
      try {
        const formData = new FormData();
        formData.append('email', email);
        
        const response = await fetch(`${prodUrl}/secure/Candidate/GetCandidate/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Candidate validation response:', data);

        return data; // Assuming the API returns an object with a property indicating success
      } catch (error) {
          console.error('Error validating candidate:', error);
          return false;
      }
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      console.log('token', localStorage.getItem('authToken'));
    
      setIsLoading(true);
      if (typeof window !== 'undefined') {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          const isValidToken = await checkValidToken(authToken);                    
          if (isValidToken) {
            console.log('token is valid...');
            
            const userData = JSON.parse(decrypt(authToken));
            const { KeyType, ...rest } = userData;
            console.log('user data to validate: ', rest);
            
            const isValidCandidate = await validateCandidate(authToken, rest.Email); // Assuming email is part of userData
            if (isValidCandidate) {
              console.log('candidate is valid...');
              setCUData(rest as ContextTokenProps);
            } else {
              console.log('Invalid candidate data');
              localStorage.removeItem('authToken');
              setCUData(null);
            }
          } else {
            localStorage.removeItem('authToken');
            console.log('remove authToken...');
            setCUData(null);
          }
        } else {
          localStorage.removeItem('authToken');
          console.log('remove authToken...');
          setCUData(null);
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={cuData}>
      {children}
    </AuthContext.Provider>
  )
}
