import { prodUrl } from '@/lib/utils';
import axios from 'axios';
import React, { useState } from 'react';

interface EmailStepProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function EmailStep({ onSubmit, isLoading, setIsLoading }: EmailStepProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('email', email);

      const config = {
        method: 'post',
        url: prodUrl+'/Authorization/RequestOTP',
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      };

      const response = await axios.request(config);      

      if (!response.status) throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');

      onSubmit(email);
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-full flex flex-col justify-center'>
      <h2 className="text-2xl font-medium mb-2">กรอกอีเมลเพื่อรับ OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="hidden text-sm font-medium text-gray-700 mb-1">
            กรุณากรอกอีเมล
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`+(error ? ' border-red-500' : '')}
            placeholder="your@email.com"
            disabled={isLoading}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-700 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors disabled:bg-primary-400"
        >
          {isLoading ? 'กำลังส่งข้อมูล...' : 'รับ OTP'}
        </button>
      </form>
    </div>
  );
}