import { Modal, ModalProps } from '@mantine/core';
import { ReactNode } from 'react';

interface CustomModalProps extends Omit<ModalProps, 'opened'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function MantineModal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  centered = true,
  ...props 
}: CustomModalProps) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      {...props}
    >
      {children}
    </Modal>
  );
}