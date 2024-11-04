// hooks/useForm.ts

import { useState, useCallback } from 'react';
import { ApplicationFormData, FormField } from '@/lib/types';

export function useApplicationForm(initialData: Partial<ApplicationFormData> = {}) {
  const [formData, setFormData] = useState<ApplicationFormData>(
    initialData as ApplicationFormData
  );
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