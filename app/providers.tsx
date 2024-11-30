"use client"
import { createContext, useCallback, useEffect, useState } from "react";
import { decrypt, prodUrl } from "@/lib/utils";
import { ContextTokenProps } from "@/lib/types";
export const AuthContext = createContext({} as ContextTokenProps);

export function AuthContextProvider({children}: {children: React.ReactNode}) {
  const [cuData, setCUData] = useState<ContextTokenProps>(); // CU = Current User  

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

  useEffect(() => {
    const validateToken = async () => {
      if (typeof window !== 'undefined') {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          const isValidToken = await checkValidToken(authToken);                    
          if (isValidToken) {
            const userData = JSON.parse(decrypt(authToken));
            const { KeyType, ...rest } = userData;
            setCUData(rest as ContextTokenProps);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      }
    };

    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={cuData as ContextTokenProps}>
      {children}
    </AuthContext.Provider>
  )
}
