"use client"
import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { decrypt, prodUrl } from "@/lib/utils";
import AuthModal from "../components/Auth/AuthModal";
interface ContextTokenProps {
  CandidateID: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  refreshAuth: () => void;
  // ... other existing props
}

export const AuthContext = createContext<ContextTokenProps | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [CandidateID, setCandidateID] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const refreshAuth = () => {
    setCandidateID('');
  }

  return (
    <AuthContext.Provider value={{
      CandidateID,
      isAuthModalOpen,
      setIsAuthModalOpen,
      refreshAuth: refreshAuth,
      // ... other values
    }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AuthContext.Provider>
  );
}
