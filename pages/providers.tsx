"use client"
import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { decrypt, prodUrl } from "@/lib/utils";
import AuthModal from "../components/Auth/AuthModal";
import CustomDialog from "@/components/ui/CustomDialog";
interface ContextTokenProps {
  CandidateID: string;
  email: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  refreshAuth: (token?: string) => void;
  handleUpdateToken: (token: string) => void;
  isAuth: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  dialogTitle: string;
  setDialogTitle: (title: string) => void;
  dialogContent: string;
  setDialogContent: (content: string) => void;
  // ... other existing props
}

export const AuthContext = createContext<ContextTokenProps | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [CandidateID, setCandidateID] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = JSON.parse(decrypt(token));
      setCandidateID(decodedToken.CandidateID);
      setEmail(decodedToken.Email);
      setIsAuth(true);
    }
    setIsInitialized(true);
  }, []);

  const refreshAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    return new Promise<void>((resolve) => {
      if (token) {
        localStorage.setItem('authToken', token);
        const decodedToken = JSON.parse(decrypt(token));
        setCandidateID(decodedToken.CandidateID);
        setEmail(decodedToken.Email);
        setIsAuth(true);
      } else {
        localStorage.removeItem('authToken');
        setCandidateID('');
        setEmail('');
        setIsAuth(false);
      }
      resolve();
    });
  }

  const handleUpdateToken = (token: string) => {
    if (token) {
      console.log('handleUpdateToken token', token);
      localStorage.setItem('authToken', token);
      const decodedToken = JSON.parse(decrypt(token));
      setCandidateID(decodedToken.CandidateID);
      setEmail(decodedToken.Email);
      setIsAuth(true);
    }
  }

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      CandidateID,
      email,
      isAuthModalOpen,
      setIsAuthModalOpen,
      refreshAuth: refreshAuth,
      handleUpdateToken: handleUpdateToken,
      isAuth: isAuth,
      isDialogOpen,
      setIsDialogOpen,
      dialogTitle,
      setDialogTitle,
      dialogContent,
      setDialogContent,
      // ... other values
    }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CustomDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={dialogTitle}>
        {children}
      </CustomDialog>
    </AuthContext.Provider>
  );
}
