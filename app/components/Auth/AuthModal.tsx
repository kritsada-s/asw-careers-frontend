// components/auth/AuthModal.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EmailStep from './Email';
import OtpStep from './Otp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data:any) => void;
  onError?: (data:any) => void;
}

type AuthStep = 'email' | 'otp' | 'success';

export default function AuthModal({ isOpen, onClose, onSuccess, onError }: AuthModalProps) {
  const router = useRouter();
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
    // Store token in session
    localStorage.setItem('authToken', token);    
    // Show success state briefly before redirecting
    setCurrentStep('success');
    setTimeout(() => {
      handleClose();
      router.push('/profile');
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl flex w-full max-w-3xl mx-4 overflow-hidden lg:min-h-[650px] z-20">
        {/* Left Side - Image */}
        <div className="w-1/2 relative hidden md:flex md:justify-center md:items-center bg-custom-light-blue">
          <div className={`img-wrapper relative `+(currentStep === 'email' ? 'w-2/3 h-2/3':'w-1/2 h1/2')}>
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

        {/* Right Side - Content */}
        <div className="w-full md:w-1/2 p-8">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content based on current step */}
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
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Success!</h3>
              <p className="text-gray-600">Redirecting to your profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}