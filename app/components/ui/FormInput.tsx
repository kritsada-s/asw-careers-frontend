import { useDistricts, useProvinces, useSubDistricts, useTitles } from '@/app/hooks/useDataFetching';
import { ApplicationFormData } from '@/lib/types';
import React, { useEffect, useState, useRef } from 'react';
import { useEducations } from "@/app/hooks/useDataFetching";

interface FormInputProps {
  label: string;
  name: keyof ApplicationFormData;  // This ensures name is a valid form field
  value: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  updateField: (field: keyof ApplicationFormData, value: any) => void;
  markFieldTouched: (field: keyof ApplicationFormData) => void;
  isFieldTouched: (field: keyof ApplicationFormData) => boolean;
}

export const CustomFormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  type = 'text',
  required = false,
  disabled = false,
  updateField,
  markFieldTouched,
  isFieldTouched
}: FormInputProps) => {
  const hasError = required && isFieldTouched(name) && !value;

  return (
    <div className="space-y-1">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        id={name}
        type={type}
        value={value || ''}
        onChange={(e) => updateField(name, e.target.value)}
        onBlur={() => markFieldTouched(name)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md 
          ${hasError 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors
        `}
      />
      
      {hasError && (
        <p className="text-red-500 text-sm mt-1">
          {label} is required
        </p>
      )}
    </div>
  );
}

interface GenderOption {
  genderID: number;
  description: string;
}

interface GenderSelectProps {
  id: number;
  setGender: (gender: GenderOption | null) => void;
  isFieldTouched?: (field: keyof ApplicationFormData) => boolean;
}

export const GenderSelect: React.FC<GenderSelectProps> = ({ id, setGender, isFieldTouched }) => {
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [currentGender, setCurrentGender] = useState(1);
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  const genderData: GenderOption[] = [
    { genderID: 1, description: "ชาย / Male" },
    { genderID: 2, description: "หญิง / Female" },
    { genderID: 3, description: "LGBTQ" },
    { genderID: 4, description: "ไม่ระบุ / n/a" }
  ];

  const onGenderChange = (gender: GenderOption | null) => {
    //console.log('gender', gender);
    setGender(gender);
    setCurrentGender(gender?.genderID || 1);
    setIsGenderDropdownOpen(false);
  }

  useEffect(() => {
    setCurrentGender(id);
  }, [id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setIsGenderDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-[180px]" ref={genderDropdownRef}>
      <button
        type="button"
        id="gender"
        className={`mt-1 block w-full rounded border border-gray-600 bg-white px-2 py-1 text-left text-base shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
          isFieldTouched && isFieldTouched('gender') && !id ? 'border-red-500' : ''
        }`}
        onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
      >
        {genderData.find(option => option.genderID === currentGender)?.description || 'เลือกเพศ'}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isGenderDropdownOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {genderData.map(option => (
            <div
              key={option.genderID}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${id === option.genderID ? 'bg-primary-50 text-primary-600' : ''}`}
              onClick={() => {
                onGenderChange(option);
                setIsGenderDropdownOpen(false);
              }}
            >
              {option.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface MaritalStatusOption {
  maritalStatusID: number;
  description: string;
}

interface MaritalStatusSelectorProps {
  id?: number;
  isFieldTouched?: (field: string) => boolean;
}

export const MaritalStatusSelector: React.FC<MaritalStatusSelectorProps> = ({ id, isFieldTouched }) => {
  const [isMaritalStatusDropdownOpen, setIsMaritalStatusDropdownOpen] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatusOption | null>(null);
  const [currentMaritalStatus, setCurrentMaritalStatus] = useState(id || 1);
  const maritalStatusDropdownRef = useRef<HTMLDivElement>(null);

  const maritalStatusData: MaritalStatusOption[] = [
    { maritalStatusID: 1, description: 'โสด' },
    { maritalStatusID: 2, description: 'สมรส' },
    { maritalStatusID: 3, description: 'หย่าร้าง' },
    { maritalStatusID: 4, description: 'หม้าย' }
  ];

  const onMaritalStatusChange = (status: MaritalStatusOption | null) => {
    //console.log('maritalStatus', status);
    setMaritalStatus(status);
    setCurrentMaritalStatus(status?.maritalStatusID || 1);
    setIsMaritalStatusDropdownOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (maritalStatusDropdownRef.current && !maritalStatusDropdownRef.current.contains(event.target as Node)) {
        setIsMaritalStatusDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCurrentMaritalStatus(id || 1);
  }, [id]);

  return (
    <div className="relative w-[180px]" ref={maritalStatusDropdownRef}>
      <button
        type="button"
        id="maritalStatus"
        className={`mt-1 block w-full rounded border border-gray-600 bg-white px-2 py-1 text-left text-base shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
          isFieldTouched && isFieldTouched('maritalStatus') && !id ? 'border-red-500' : ''
        }`}
        onClick={() => setIsMaritalStatusDropdownOpen(!isMaritalStatusDropdownOpen)}
      >
        {maritalStatusData.find(option => option.maritalStatusID === currentMaritalStatus)?.description || 'เลือกสถานภาพ'}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isMaritalStatusDropdownOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {maritalStatusData.map(option => (
            <div
              key={option.maritalStatusID}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${id === option.maritalStatusID ? 'bg-primary-50 text-primary-600' : ''}`}
              onClick={() => {
                onMaritalStatusChange(option);
                setIsMaritalStatusDropdownOpen(false);
              }}
            >
              {option.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ProvinceSelectorProps {
  id?: number;
  isFieldTouched?: (field: string) => boolean;
  onProvinceChange: (province: any) => void;
}

export const ProvinceSelector: React.FC<ProvinceSelectorProps> = ({ id, isFieldTouched, onProvinceChange }) => {
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [currentProvinceId, setCurrentProvinceId] = useState<number>(id || 1);
  const { provinces, isLoading } = useProvinces();
  const provinceDropdownRef = useRef<HTMLDivElement>(null);

  const handleProvinceChange = (province: any) => {
    onProvinceChange(province);
    setSelectedProvince(province);
    setCurrentProvinceId(province?.provinceID || 1);
    setIsProvinceDropdownOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (provinceDropdownRef.current && !provinceDropdownRef.current.contains(event.target as Node)) {
        setIsProvinceDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCurrentProvinceId(id || 1);
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full min-w-[180px]" ref={provinceDropdownRef}>
      <button
        type="button"
        id="province"
        className={`block w-full rounded border border-gray-600 bg-white px-2 py-1 text-left text-base shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
          isFieldTouched && isFieldTouched('province') && !id ? 'border-red-500' : ''
        }`}
        onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
      >
        {provinces.find(province => province.provinceID === currentProvinceId)?.nameTH || 'เลือกจังหวัด'}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isProvinceDropdownOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {provinces.map(province => (
            <div
              key={province.provinceID}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${id === province.provinceID ? 'bg-primary-50 text-primary-600' : ''}`}
              onClick={() => {
                handleProvinceChange(province);
                setIsProvinceDropdownOpen(false);
              }}
            >
              {province.nameTH}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export const DistrictSelector = ({ id, provinceID, isFieldTouched, onDistrictChange }: { 
  id?: number;
  provinceID: number;
  isFieldTouched?: (field: string) => boolean;
  onDistrictChange: (district: any) => void;
}) => {
  const { districts, isLoading } = useDistricts(provinceID);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [currentDistrictId, setCurrentDistrictId] = useState<number>(id || 1);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  function handleDistrictChange(district: any) {
    onDistrictChange(district);
    setSelectedDistrict(district);
    setCurrentDistrictId(district?.districtID || 1);
    setIsDistrictDropdownOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setIsDistrictDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (districts.length > 0) {
      const defaultDistrict = districts[0];
      setSelectedDistrict(defaultDistrict);
      setCurrentDistrictId(defaultDistrict.districtID);
      onDistrictChange(defaultDistrict);
    }
    //console.log('provinceID', provinceID);
  }, [provinceID, districts]);

  useEffect(() => {
    setCurrentDistrictId(id || 1);
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full min-w-[180px]" ref={districtDropdownRef}>
      <button
        type="button"
        id="district"
        className={`block w-full rounded border border-gray-600 bg-white px-2 py-1 text-left text-base shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
          isFieldTouched && isFieldTouched('district') && !id ? 'border-red-500' : ''
        }`}
        onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
      >
        {districts.find(district => district.districtID === currentDistrictId)?.nameTH || 'เลือกอำเภอ'}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isDistrictDropdownOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {districts.map(district => (
            <div
              key={district.districtID}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${id === district.districtID ? 'bg-primary-50 text-primary-600' : ''}`}
              onClick={() => {
                handleDistrictChange(district);
                setIsDistrictDropdownOpen(false);
              }}
            >
              {district.nameTH}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SubDistrictSelector = ({ id, districtID, onSubDistrictChange, isFieldTouched }: { id?: number, districtID: number, onSubDistrictChange: (subDistrict: any) => void, isFieldTouched?: (field: string) => boolean }) => {
  const [isSubDistrictDropdownOpen, setIsSubDistrictDropdownOpen] = useState(false);
  const [currentSubDistrictId, setCurrentSubDistrictId] = useState<number>(id || 1);
  const subDistrictDropdownRef = useRef<HTMLDivElement>(null);
  const { subDistricts, isLoading } = useSubDistricts(districtID);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subDistrictDropdownRef.current && !subDistrictDropdownRef.current.contains(event.target as Node)) {
        setIsSubDistrictDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubDistrictChange = (subDistrict: any) => {
    setCurrentSubDistrictId(subDistrict.subDistrictID);
    onSubDistrictChange(subDistrict);
  };

  useEffect(() => {
    if (subDistricts.length > 0) {
      const defaultSubDistrict = subDistricts[0];
      setCurrentSubDistrictId(defaultSubDistrict.subDistrictID);
      onSubDistrictChange(defaultSubDistrict);
    }
    //console.log('districtID', districtID);
  }, [districtID, subDistricts]);

  useEffect(() => {
    setCurrentSubDistrictId(id || 1);
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full min-w-[180px]" ref={subDistrictDropdownRef}>
      <button
        type="button"
        id="subDistrict"
        className={`block w-full rounded border border-gray-600 bg-white px-2 py-1 text-left text-base shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
          isFieldTouched && isFieldTouched('subDistrict') && !id ? 'border-red-500' : ''
        }`}
        onClick={() => setIsSubDistrictDropdownOpen(!isSubDistrictDropdownOpen)}
      >
        {subDistricts.find(subDistrict => subDistrict.subDistrictID === currentSubDistrictId)?.nameTH || 'เลือกตำบล'}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isSubDistrictDropdownOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {subDistricts.map(subDistrict => (
            <div
              key={subDistrict.subDistrictID}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${id === subDistrict.subDistrictID ? 'bg-primary-50 text-primary-600' : ''}`}
              onClick={() => {
                handleSubDistrictChange(subDistrict);
                setIsSubDistrictDropdownOpen(false);
              }}
            >
              {subDistrict.nameTH}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface TitleSelectorProps {
  id?: number;
  onTitleChange: (title: { titleID: number; nameTH: string; nameEN: string }) => void;
  isFieldTouched?: (field: string) => boolean;
}

export const TitleSelector: React.FC<TitleSelectorProps> = ({ id, onTitleChange, isFieldTouched }) => {
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const [currentTitleId, setCurrentTitleId] = useState<number>(id || 1);
  const titleDropdownRef = useRef<HTMLDivElement>(null);
  const { titles, isLoading } = useTitles();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (titleDropdownRef.current && !titleDropdownRef.current.contains(event.target as Node)) {
        setIsTitleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentTitleId(id || 1);
  }, [id]);

  const handleTitleChange = (title: { titleID: number; nameTH: string; nameEN: string }) => {
    setCurrentTitleId(title.titleID);
    onTitleChange(title);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full min-w-[120px]" ref={titleDropdownRef}>
      <button
        type="button"
        id="title"
        className={`block w-full rounded border border-gray-600 bg-white px-2 py-1 text-left text-base shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
          isFieldTouched && isFieldTouched('title') && !id ? 'border-red-500' : ''
        }`}
        onClick={() => setIsTitleDropdownOpen(!isTitleDropdownOpen)}
      >
        {titles.find(title => title.titleID === currentTitleId)?.nameTH || 'เลือกคำนำหน้า'}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isTitleDropdownOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {titles.map(title => (
            <div
              key={title.titleID}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${id === title.titleID ? 'bg-primary-50 text-primary-600' : ''}`}
              onClick={() => {
                handleTitleChange(title);
                setIsTitleDropdownOpen(false);
              }}
            >
              {title.nameTH}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const TitleName = ({ titleID }: { titleID: number }) => {
  const { titles } = useTitles();
  return titles.find(title => title.titleID === titleID)?.nameTH || '';
};

export const EducationLevel = ({educationID}: {educationID: number}) => {
  const { educations, isLoading, error } = useEducations();
  return <>
    {educations.find(edu => edu.educationID === educationID)?.description || ''}
  </>;
}
