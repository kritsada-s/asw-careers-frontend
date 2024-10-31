import React, { useEffect, useState } from 'react';
import { FormStepProps } from '@/lib/types';
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
  InputAdornment 
} from '@mui/material';
import { fetchPosition } from '@/lib/api';
import { useParams, useSearchParams } from 'next/navigation';

export default function BasicInfoForm({
  formData,
  updateFormData,
  onNext,
  onPrevious,
  isLastStep
}: FormStepProps) {

  interface Position {
    jobID: string;
    jobPosition: string;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const params = useSearchParams();
  const paramsId = params.get('id');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  // Fetch positions on mount
  // useEffect(() => {
  //   async function fetchPositions() {
  //     try {
  //       const response = await fetchPosition(paramsId);
  //       setPositions(response.data);
        
  //       // If jobId exists, set the selected position
  //       if (jobId) {
  //         const position = response.data.find(p => p.jobID === jobId);
  //         if (position) {
  //           setSelectedPosition(position.jobID);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching positions:', error);
  //     }
  //   }

  //   fetchPositions();
  // }, [jobId]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Form fields will go here */}
        <FormNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstStep={true} // Adjust based on your step logic
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}