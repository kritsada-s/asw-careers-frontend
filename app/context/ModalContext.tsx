"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { MantineModal } from '../MantineModal';

interface ModalContextType {
  openModal: (content: ReactNode, title?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const openModal = (content: ReactNode, title?: string) => {
    setModalContent(content);
    setModalTitle(title || '');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <MantineModal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalTitle}
      >
        {modalContent}
      </MantineModal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}