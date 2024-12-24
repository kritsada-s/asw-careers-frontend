"use client"
import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import { Dialog, DialogTitle } from "@mui/material";
import { decrypt, prodUrl } from "@/lib/utils";

interface ContextTokenProps {
  CandidateID: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  refreshAuth: () => void;
  // ... other existing props
}

export const AuthContext = createContext<ContextTokenProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
      <Dialog open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <DialogTitle>กรุณากรอกข้อมูลของคุณ</DialogTitle>
      </Dialog>
    </AuthContext.Provider>
  );
}
