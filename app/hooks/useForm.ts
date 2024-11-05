import { useState, useCallback, useEffect } from 'react';
import { ApplicationFormData, FormField } from '@/lib/types';

export function useApplicationForm(
  initialData: Partial<{
    [K in keyof ApplicationFormData]: ApplicationFormData[K] | null;
  }> = {}
) {
  // Create a default empty form data object
  const defaultFormData: ApplicationFormData = {
    expectedSalary: '',
    experience: '',
    nationality: '',
    profileImage: undefined,
    cv: undefined,
    // Add other required fields with default values
  };

  // Merge the initial data with default values
  const [formData, setFormData] = useState<ApplicationFormData>({
    ...defaultFormData,
    ...Object.fromEntries(
      Object.entries(initialData).map(([key, value]) => [key, value ?? undefined])
    )
  });
  
  const [touchedFields, setTouchedFields] = useState<Set<FormField>>(new Set());

  // Update single field
  const updateField = useCallback((field: FormField, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Mark field as touched (used onBlur)
  const markFieldTouched = useCallback((field: FormField) => {
    setTouchedFields(prev => new Set(prev).add(field));
  }, []);

  // Check if field has been touched
  const isFieldTouched = useCallback((field: FormField) => {
    return touchedFields.has(field);
  }, [touchedFields]);

  return {
    formData,
    updateField,
    markFieldTouched,
    isFieldTouched,
    setFormData
  };
}