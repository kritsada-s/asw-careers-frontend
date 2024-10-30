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
    if (localStorage.authToken) {
      localStorage.removeItem('authToken')

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
        setError('Failed to load profile data');
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
      <div className="min-h-screen flex items-center justify-center">
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>No profile data available</div>
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