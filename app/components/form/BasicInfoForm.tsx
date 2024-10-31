import React, { useEffect, useState } from 'react';
import { FormStepProps, Job, Position, BasicInfo } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';
import Image from 'next/image';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Box,
  Typography,
  InputAdornment, 
  Grid2
} from '@mui/material';

export default function BasicInfoForm({
  formData,
  updateFormData,
  onNext,
  onPrevious,
  isLastStep,
  jobId,
  jobTitle
}: FormStepProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salary, setSalary] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  interface BasicInfoFormProps {
    jobId?: string;
    data: BasicInfo;
    updateData: (data: Partial<BasicInfo>) => void;
    onNext: () => void;
    isSubmitting: boolean;
  }

  // Handle profile image upload
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'cv') => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData('cv', file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="w-1/4">
            <div className="profile-wrapper border border-neutral-300 rounded-full overflow-hidden relative max-w-[250px]">
              {profilePreview ? (
                <div className="profile relative w-full aspect-square mx-auto overflow-hidden">
                  <Image
                    src={profilePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square mx-auto bg-gray-100 flex items-center justify-center">
                  <p>No image selected</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
                id="profile-upload"
              />
              <label htmlFor="profile-upload" className="block w-full px-4 py-2 text-center border border-gray-300 rounded-md cursor-pointer bg-neutral-700 hover:bg-gray-50 absolute bottom-0 left-0 text-white">
                Upload Image
              </label>
            </div>
          </div>
          <div className="w-3/4 flex gap-4 flex-col">
            <div className="row w-full flex gap-4">
              <div className="w-1/2">
                <TextField
                  fullWidth
                  size='small'
                  label="เงินเดือนที่คาดหวัง"
                  value={formData.expectedSalary || ''}
                  onChange={(e) => updateFormData('expectedSalary', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  fullWidth
                  size='small'
                  label="Experience"
                  value={formData.experience || ''}
                  onChange={(e) => updateFormData('experience', e.target.value )}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="w-full">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'cv')}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </form>
      <FormNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isFirstStep={true} // Adjust based on your step logic
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}