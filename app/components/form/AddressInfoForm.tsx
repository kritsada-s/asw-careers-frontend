import React, { useState, useEffect } from 'react';
import { FormStepProps, SubDistrict } from '@/lib/types';
import { Province } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';
import { useProvinces, useDistricts, useSubDistricts } from '@/app/hooks/useDataFetching';
import { DistrictSelector, ProvinceSelector, SubDistrictSelector } from '../ui/FormInput';

export default function AddressInfoForm({
  formData,
  updateField,
  onNext,
  onPrevious,
  isLastStep
}: FormStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProvincesDropdownOpen, setIsProvincesDropdownOpen] = useState(false);
  const [isDistrictsDropdownOpen, setIsDistrictsDropdownOpen] = useState(false);
  const [isSubDistrictsDropdownOpen, setIsSubDistrictsDropdownOpen] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const { provinces, isLoading:isProvincesLoading } = useProvinces();
  const { districts, isLoading:isDistrictsLoading } = useDistricts(Number(formData.province));
  const { subDistricts, isLoading:isSubDistrictsLoading } = useSubDistricts(Number(formData.district));
  const [postalCode, setPostalCode] = useState('');

  // Add this function to check if a field has been touched
  const isFieldTouched = (fieldName: string) => {
    return touchedFields.includes(fieldName);
  };

  const [touchedFields, setTouchedFields] = useState<string[]>([]);

  const handleFieldTouch = (fieldName: string) => {
    if (!touchedFields.includes(fieldName)) {
      setTouchedFields([...touchedFields, fieldName]);
    }
  };

  const handleSubDistrictChange = (subDistrict: SubDistrict) => {
    updateField('subdistrict', subDistrict.subdistrictID);
    setPostalCode(subDistrict.postCode || '');
  }

  // Add this effect to handle automatic district selection
  useEffect(() => {
    if (districts.length > 0 && !formData.district) {
      // Automatically select the first district when districts are loaded
      updateField('district', String(districts[0].districtID));
    }
  }, [formData.district, districts, updateField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">

        <div className="form-input-wrapper w-full">
          <label
            htmlFor="addressLine1"
            className="block text-base font-medium text-gray-700"
          >
            ที่อยู่ <span className="text-red-500">*</span>
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            type="text"
            value={formData.addressLine1 || ''}
            onChange={(e) => {
              updateField('addressLine1', e.target.value);
              handleFieldTouch('addressLine1');
            }}
            required
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${isFieldTouched('addressLine1') && !formData.addressLine1 ? 'border-red-500' : ''}`}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="province">จังหวัด</label>
            <ProvinceSelector id={formData.province} onProvinceChange={(province) => updateField('province', province.provinceID)} />
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="district">อำเภอ</label>
            <DistrictSelector id={formData.district} provinceID={Number(formData.province)} onDistrictChange={(district) => updateField('district', district.districtID)} />
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="subdistrict">ตำบล</label>
            <SubDistrictSelector id={formData.subdistrict} districtID={Number(formData.district)} onSubDistrictChange={handleSubDistrictChange} />
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="postalCode">รหัสไปรษณีย์</label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={postalCode}
              onChange={(e) => updateField('postalCode', e.target.value)} disabled
              className={`block w-full border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500 px-2 py-1 rounded ${isFieldTouched('postalCode') && !formData.postalCode ? 'border-red-500' : ''}`}
            />
          </div>
        </div>

        <FormNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstStep={false} // Adjust based on your step logic
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}