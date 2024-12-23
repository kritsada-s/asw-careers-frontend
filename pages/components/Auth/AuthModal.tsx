"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EmailStep from './Email';
import OtpStep from './Otp';
import { decrypt } from '@/lib/utils';
import { Modal, ModalBody, ModalContent } from '@nextui-org/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data:any) => void;
  onError?: (data:any) => void;
  router: any;
  authContext: any;
}

type AuthStep = 'email' | 'otp' | 'success';

export default function AuthModal({ isOpen, onClose, onSuccess, onError, router, authContext }: AuthModalProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep('email');
    setEmail('');
    onClose();
  };

  // Success handler
  const handleSuccess = (token: string) => {
    setCurrentStep('success');
    const decryptedToken = JSON.parse(decrypt(token));
    console.log('decryptedToken', decryptedToken);

    if (typeof window !== 'undefined') {
      const authToken = window.localStorage.getItem('authToken');
      console.log('Existing authToken:', authToken);

      // Set the new authToken
      window.localStorage.setItem('authToken', token);
      console.log('New authToken set:', token);

      if (decryptedToken.CandidateID === '') {
        console.log('No candidate id in token... redirect to profile create page');
        const jobId = sessionStorage.getItem('jobId');
        let path = '/apply-job/';
        if (jobId) {
          path = '/apply-job/' + jobId;
        }
        setTimeout(() => {
          handleClose();
          router.push(path);
        }, 1000);
      } else {
        console.log('Candidate id in token... redirect to profile page');
        setTimeout(() => {
          handleClose();
          authContext?.refreshAuth();
          router.push('/profile');
        }, 3000);
      }
    } else {
      console.log('Window is undefined');
      return;
    }
  };

  return (
    
    <Modal isOpen={isOpen} onOpenChange={onClose} 
      classNames={{
        base: 'bg-white rounded-lg shadow-xl flex w-full max-w-3xl mx-4 overflow-hidden lg:min-h-[650px] z-20',
        body: 'flex flex-col md:flex-row p-0'
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose)=>(
          <ModalBody>
            <div className="w-1/2 relative hidden md:flex md:justify-center md:items-center bg-custom-light-blue">
            <div className={`img-wrapper relative `+(currentStep === 'email' ? 'w-2/3 h-2/3':'w-1/3 h-1/3')}>
              <Image
                src={currentStep === 'email' 
                  ? '/images/email-step-img.png' 
                  : '/images/otp-step-img.png'
                }
                alt="Authentication"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
            <div className="w-full md:w-1/2 p-8">
              {currentStep === 'email' && (
                <EmailStep
                  onSubmit={(email) => {
                    setEmail(email);
                    setCurrentStep('otp');
                  }}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}

              {currentStep === 'otp' && (
                <OtpStep
                  email={email}
                  onSubmit={handleSuccess}
                  onBack={() => setCurrentStep('email')}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}

              {currentStep === 'success' && (
                <div className='flex justify-center items-center h-full'>
                <div className="text-center">
                  <div className='w-[130px] mx-auto mb-3'>
                    <svg viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></g><g id="SVGRepo_iconCarrier"> <path d="M16.0303 10.0303C16.3232 9.73744 16.3232 9.26256 16.0303 8.96967C15.7374 8.67678 15.2626 8.67678 14.9697 8.96967L10.5 13.4393L9.03033 11.9697C8.73744 11.6768 8.26256 11.6768 7.96967 11.9697C7.67678 12.2626 7.67678 12.7374 7.96967 13.0303L9.96967 15.0303C10.2626 15.3232 10.7374 15.3232 11.0303 15.0303L16.0303 10.0303Z" fill="#24b819"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#24b819"></path> </g></svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">เข้าสู่ระบบสำเร็จ !</h3>
                  <p className="text-gray-600">กำลังนำคุณไปยังหน้าโปรไฟล์...</p>
                </div>
              </div>
              )}
          </div>
        </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}