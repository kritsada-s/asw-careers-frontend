import React, { useState, useEffect } from 'react';
import { FormStepProps, SubDistrict } from '@/lib/types';
import { Province } from '@/lib/types';
import FormNavigation from '../ui/FormNavigation';
//import { useProvinces, useDistricts } from '@/app/hooks/useDataFetching';

// Add this function to check if a field has been touched
const isFieldTouched = (fieldName: string) => {
  // Implement your logic to determine if the field has been touched
  // For example, you could maintain a state for touched fields
  return false; // Placeholder return value
};

import { useProvinces, useDistricts, useSubDistricts } from '@/app/hooks/useDataFetching';

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

  // Add this effect to handle automatic district selection
  useEffect(() => {
    if (districts.length > 0 && !formData.district) {
      // Automatically select the first district when districts are loaded
      updateField('district', String(districts[0].districtID));
    }
  }, [formData.district, districts, updateField]);

  useEffect(() => {
    if (formData.district && subDistricts && subDistricts.length > 0) {
      const firstSubDistrict = subDistricts.find((sd: { DistrictID: number }) => 
        sd.DistrictID === Number(formData.district)
      );
      if (firstSubDistrict) {
        updateField('subdistrict', String(firstSubDistrict.SubDistrictID));
        updateField('postalCode', firstSubDistrict.PostCode);
      }
    }
  }, [formData.district, subDistricts, updateField]);

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
            onChange={(e) => updateField('addressLine1', e.target.value)}
            required
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${isFieldTouched('addressLine1') && !formData.addressLine1 ? 'border-red-500' : ''
              }`}
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
          <div className="form-input-wrapper w-full md:w-1/3">
            <label
              htmlFor="province"
              className="block text-base font-medium text-gray-700"
            >
              จังหวัด <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <button
                type="button"
                id="province"
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500 ${isFieldTouched('province') && !formData.province ? 'border-red-500' : ''
                  }`}
                onClick={() => setIsProvincesDropdownOpen(!isProvincesDropdownOpen)}
                disabled={isProvincesLoading}
              >
                {formData.province ? (provinces || []).find(p => p.provinceID === Number(formData.province))?.nameTH : 'เลือกจังหวัด'}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
              {isProvincesDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="sticky top-0 bg-white p-2">
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="ค้นหาจังหวัด..."
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const filtered = provinces.filter(province => 
                          province.nameTH.toLowerCase().includes(searchTerm) ||
                          province.nameEN.toLowerCase().includes(searchTerm)
                        );
                        setFilteredProvinces(filtered);
                      }}
                    />
                  </div>
                  {!isProvincesLoading && (filteredProvinces || provinces).map((province) => (
                    <div
                      key={province.provinceID}
                      className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${formData.province === province.provinceID ? 'bg-primary-50 text-primary-600' : ''
                        }`}
                      onClick={() => {
                        updateField('province', String(province.provinceID));
                        updateField('district', ''); // Clear the current district
                        setIsProvincesDropdownOpen(false);
                      }}
                    >
                      {province.nameTH}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-input-wrapper w-full md:w-1/3">
            <label
              htmlFor="district"
              className="block text-base font-medium text-gray-700"
            >
              อำเภอ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                id="district"
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500 ${isFieldTouched('district') && !formData.district ? 'border-red-500' : ''
                  }`}
                onClick={() => setIsDistrictsDropdownOpen(!isDistrictsDropdownOpen)}
                disabled={isDistrictsLoading || !formData.province}
              >
                {formData.district ? districts.find(d => d.districtID === Number(formData.district))?.nameTH : 'เลือกอำเภอ'}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
              {isDistrictsDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  {!isDistrictsLoading && districts.map((district) => (
                    <div
                      key={district.districtID}
                      className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${Number(formData.district) === district.districtID ? 'bg-primary-50 text-primary-600' : ''
                        }`}
                      onClick={() => {
                        updateField('district', String(district.districtID));
                        setIsDistrictsDropdownOpen(false);
                      }}
                    >
                      {district.nameTH}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-input-wrapper w-full md:w-1/3">
            <label
              htmlFor="subdistrict"
              className="block text-base font-medium text-gray-700"
            >
              ตำบล <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              
              <button
                type="button"
                id="subdistrict"
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500 ${isFieldTouched('subdistrict') && !formData.subdistrict ? 'border-red-500' : ''
                  }`}
                onClick={() => setIsSubDistrictsDropdownOpen(!isSubDistrictsDropdownOpen)}
                disabled={isSubDistrictsLoading || !formData.district}
              >
                {formData.subdistrict && subDistricts ? subDistricts.find((sd: SubDistrict) =>
                  sd.subdistrictID === Number(formData.subdistrict.subdistrictID))?.nameTH : 'เลือกตำบล'}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
              {isSubDistrictsDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  {!isSubDistrictsLoading && subDistricts.filter((sd: { DistrictID: number }) => sd.DistrictID === Number(formData.district)).map((subDistrict: {
                    SubDistrictID: number;
                    NameTH: string;
                    PostCode: number;
                  }) => (
                    <div
                      key={subDistrict.SubDistrictID}
                      className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${Number(formData.subdistrict) === subDistrict.SubDistrictID ? 'bg-primary-50 text-primary-600' : ''
                        }`}
                      onClick={() => {
                        updateField('subdistrict', String(subDistrict.SubDistrictID));
                        updateField('postalCode', subDistrict.PostCode);
                        setIsSubDistrictsDropdownOpen(false);
                      }}
                    >
                      {subDistrict.NameTH}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-input-wrapper w-full md:w-1/3">
            <label 
              htmlFor="postalCode" 
              className="block text-base font-medium text-gray-700"
            >
              รหัสไปรษณีย์ <span className="text-red-500">*</span>
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={formData.postalCode || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                updateField('postalCode', value ? Number(value) : '');
              }}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 leading-none ${
                isFieldTouched('postalCode') && !formData.postalCode ? 'border-red-500' : ''
              }`}
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