import { prodUrl } from '@/lib/utils';
import axios from 'axios';
import React, { useState } from 'react';

interface OtpStepProps {
  email: string;
  onSubmit: (token: string) => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function OtpStep({ 
  email, 
  onSubmit, 
  onBack,
  isLoading,
  setIsLoading 
}: OtpStepProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('OTP is required');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('keyPass', otp);
      formData.append('email', email);

      const config = {
        method: 'post',
        url: prodUrl+'/Authorization/OTPSubmit',
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      };

      const response = await axios.request(config);

      if (!response.status) throw new Error('Invalid OTP');

      const token = await response.data;
    
      onSubmit(token);
    } catch (err) {
      setError('Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">กรุณากรอกรหัสยืนยัน</h2>
      <p className="text-gray-600 mb-6">
        OTP ได้ถูกส่งไปยังอีเมล {email}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รหัสยืนยัน
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
            maxLength={6}
            disabled={isLoading}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-700 text-white py-2 px-4 rounded-md hover:bg-primary-800 transition-colors disabled:bg-primary-300"
          >
            {isLoading ? 'กำลังตรวจสอบรหัส...' : 'ตรวจสอบรหัส'}
          </button>
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="w-full text-gray-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
          >
            กลับ
          </button>
        </div>
      </form>
    </div>
  );
}