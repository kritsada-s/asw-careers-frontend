"use client"
import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { decrypt, prodUrl } from "@/lib/utils";
import AuthModal from "../components/Auth/AuthModal";
interface ContextTokenProps {
  CandidateID: string;
  email: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  refreshAuth: () => void;
  handleUpdateToken: (token: string) => void;
  // ... other existing props
}

export const AuthContext = createContext<ContextTokenProps | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [CandidateID, setCandidateID] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = JSON.parse(decrypt(token));
      setCandidateID(decodedToken.CandidateID);
      setEmail(decodedToken.Email);
    }
  }, []);

  const refreshAuth = () => {
    setCandidateID('');
  }

  const handleUpdateToken = (token: string) => {
    if (token) {
      localStorage.setItem('authToken', token);
      const decodedToken = JSON.parse(decrypt(token));
      setCandidateID(decodedToken.CandidateID);
      setEmail(decodedToken.Email);
    }
  }

  return (
    <AuthContext.Provider value={{
      CandidateID,
      email,
      isAuthModalOpen,
      setIsAuthModalOpen,
      refreshAuth: refreshAuth,
      handleUpdateToken: handleUpdateToken,
      // ... other values
    }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AuthContext.Provider>
  );
}
