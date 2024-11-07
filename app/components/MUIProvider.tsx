"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import AuthModal from './Auth/AuthModal';
import Crypt from '@/lib/Crypt';
import { isNotExpired } from '@/lib/dateUtils';

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

const ModalContext = createContext<ModalContextType | null>(null);

function ModalPortal({ 
  modalState, 
  onClose, 
  onSuccess, 
  onError 
}: { 
  modalState: { isOpen: boolean; config: ModalConfig | null; };
  onClose: () => void;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !modalState.config) return null;

  const modalContent = (
    <>
      {modalState.config.type === 'auth' && (
        <AuthModal 
          isOpen={modalState.isOpen}
          onClose={onClose}
          onSuccess={onSuccess}
          onError={onError}
          {...modalState.config.props}
        />
      )}
    </>
  );

  return createPortal(modalContent, document.body);
}

export default function MUIProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    config: ModalConfig | null;
  }>({
    isOpen: false,
    config: null
  });

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

  const isTokenNotExpired = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decrypted = Crypt(token);
      const expiryDate = decrypted.ExpiredDate;
      return isNotExpired(expiryDate);
    }
    return false;
  }, []);

  const handleSuccess = useCallback((data: any) => {
    modalState.config?.onSuccess?.(data);
    closeModal();
  }, [modalState.config, closeModal]);

  const handleError = useCallback((error: any) => {
    modalState.config?.onError?.(error);
  }, [modalState.config]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalState, isTokenNotExpired }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <ModalPortal 
          modalState={modalState}
          onClose={closeModal}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </ThemeProvider>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within MUIProvider');
  }
  return context;
}