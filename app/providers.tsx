"use client"
import { createContext, useEffect, useState } from "react";
import { decrypt } from "@/lib/utils";
import { ContextTokenProps } from "@/lib/types";
export const AuthContext = createContext({} as ContextTokenProps);

export function AuthContextProvider({children}: {children: React.ReactNode}) {
  const [cuData, setCUData] = useState<ContextTokenProps>(); // CU = Current User
  useEffect(()=>{
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        const userData = JSON.parse(decrypt(authToken));
        const { KeyType, ...rest } = userData; // Destructure to remove KeyType
        setCUData(rest as ContextTokenProps);
      }
    }
  }, [])
  return (
    <AuthContext.Provider value={cuData as ContextTokenProps}>
      {children}
    </AuthContext.Provider>
  )
}
