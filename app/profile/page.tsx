"use client";

import React, { useEffect, useState } from 'react';
import { checkAuth, redirectToHome } from '@/lib/auth';
import { fetchProfileData, type ProfileData } from '@/lib/api';
import { decrypt } from '@/lib/utils';
import { isNotExpired } from '@/lib/dateUtils';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenDate, setTokenDate] = useState<string | null>(null);

  const logOut = () => {
    if (typeof window !== 'undefined') {
      window?.localStorage.removeItem('authToken')
      console.log('logout redirecting...');
      redirectToHome();
    }
  }

  useEffect(() => {
    async function initializeProfile() {
      // Check authentication
      const authData = checkAuth();
      
      if (!authData) {
        alert('Please log in to view your profile');
        redirectToHome();
        return;
      }

      try {
        // Fetch profile data
        const data = await fetchProfileData(authData.Email);
        setTokenDate(authData.ExpiredDate)
        setProfileData(data);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
        console.error('Profile loading error:', err);
      } finally {
        setLoading(false);
      }
    }

    initializeProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h4 className='text-xl font-bold'>{error}</h4>
        <p className='text-neutral-500 mb-4'>กรุณาลองอีกครั้งภายหลัง</p>
        <p>
          <a href="/" title='กลับสู่หน้าแรก' className='text-primary-700 underline'>กลับสู่หน้าแรก</a> หรือ <button className='px-2 py-1 bg-red-500 text-white rounded-md' onClick={()=>logOut()}>ออกจากระบบ</button>
        </p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h4 className='text-xl font-bold'>ไม่พบข้อมูลโปรไฟล์</h4>
        <p className='text-neutral-500 mb-4'>กรุณาลองอีกครั้งภายหลัง</p>
        <p>
          <a href="/" title='กลับสู่หน้าแรก' className='text-primary-700 underline'>กลับสู่หน้าแรก</a> หรือ <button className='px-2 py-1 bg-red-500 text-white rounded-md' onClick={()=>logOut()}>ออกจากระบบ</button>
        </p>
      </div>
    );
  }

  // Render profile data
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <p>Token will expired at: {tokenDate}</p>
      <button className='bg-red-500 text-white' onClick={()=>logOut()}>ออกจากระบบ</button>
      <div className="space-y-4">
        <div>
          <label className="font-medium">Name:</label>
          <div>{profileData.name}</div>
        </div>

        <div>
          <label className="font-medium">Email:</label>
          <div>{profileData.email}</div>
        </div>

        {/* Add more profile fields as needed */}
      </div>
    </div>
  );
}