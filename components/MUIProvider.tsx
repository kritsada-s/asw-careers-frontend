"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import AuthModal from './Auth/AuthModal';
import Crypt from '@/lib/Crypt';
import { isNotExpired } from '@/lib/dateUtils';
import useToken from '@/hooks/useToken';

// Define types
type ModalType = 'auth' | 'confirm' | 'alert';

interface ModalConfig {
  type: ModalType;
  props?: Record<string, any>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  modalState: {
    isOpen: boolean;
    config: ModalConfig | null;
  };
  isTokenNotExpired: () => boolean;
}

// const ModalContext = createContext<ModalContextType | null>(null);

// function ModalPortal({ 
//   modalState, 
//   onClose, 
//   onSuccess, 
//   onError 
// }: { 
//   modalState: { isOpen: boolean; config: ModalConfig | null; };
//   onClose: () => void;
//   onSuccess: (data: any) => void;
//   onError: (error: any) => void;
// }) {
//   const [mounted, setMounted] = useState(false);

//   React.useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted || !modalState.config) return null;

//   const modalContent = (
//     <>
//       {modalState.config.type === 'auth' && (
//         <AuthModal 
//           isOpen={modalState.isOpen}
//           onClose={onClose}
//           onSuccess={onSuccess}
//           onError={onError}
//           {...modalState.config.props}
//         />
//       )}
//     </>
//   );

//   return createPortal(modalContent, document.body);
// }

export default function MUIProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    config: ModalConfig | null;
  }>({
    isOpen: false,
    config: null
  });
  const [isTokenNotExpired, setIsTokenNotExpired] = useState(false);
  const token = useToken();

  const openModal = useCallback((config: ModalConfig) => {
    setModalState({
      isOpen: true,
      config
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      config: null
    });
  }, []);

  const isTokenNotExpiredFn = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        const decrypted = Crypt(token);
        const expiryDate = decrypted.ExpiredDate;
        return isNotExpired(expiryDate);
      }
    }
    return false;
  }, [token]);

  const handleSuccess = useCallback((data: any) => {
    modalState.config?.onSuccess?.(data);
    closeModal();
  }, [modalState.config, closeModal]);

  const handleError = useCallback((error: any) => {
    modalState.config?.onError?.(error);
  }, [modalState.config]);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
  );
}
