import { useState } from 'react';
import { Button } from '@nextui-org/react';
import Select, { GroupBase, StylesConfig } from 'react-select';
import { Language } from '@/lib/types';
import { useLanguages } from '@/pages/hooks/useDataFetching';

interface LanguagesInputProps {
  languages: Language[];
  setLanguages: (languages: Language[]) => void;
}

interface langOption {
  value: number;
  label: string;
}

interface LevelOption {
  value: string;
  label: string;
}

function LanguagesInput({ languages, setLanguages }: LanguagesInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { languages : langs, isLoading, error } = useLanguages();
  const [editingLanguage, setEditingLanguage] = useState<(Language & { index: number }) | null>(null);
  const languageLevels = [
    { value: '1', label: 'Beginner' },
    { value: '2', label: 'Intermediate' },
    { value: '3', label: 'Advanced' },
    { value: '4', label: 'Native' },
  ]

  const handleAddLanguage = () => {
    setLanguages([...languages, { language: '', level: '' }]);
  };

  const handleRemoveLanguage = (index: number) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    setLanguages(newLanguages);
  };

  const handleLanguageChange = (index: number, field: keyof Language, value: string) => {
    const newLanguages = [...languages];
    newLanguages[index][field] = value;
    setEditingLanguage({ ...newLanguages[index], index });
  };

  const handleEditLanguage = (index: number) => {
    setEditingLanguage({ ...languages[index], index });
  }

  const handleSaveLanguage = () => {
    //console.log('save language', editingLanguage);
    
    if (editingLanguage) {
      const newLanguages = [...languages];
      newLanguages[editingLanguage.index].language = editingLanguage.language;
      newLanguages[editingLanguage.index].level = editingLanguage.level;
      setLanguages(newLanguages);
      setEditingLanguage(null);
    }

    setIsEditing(false);
  }

  return (
    <div className="text-base">
      {(languages.length === 0 && !isEditing) && <div>ไม่พบข้อมูลภาษาของผู้สมัคร</div>}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!isLoading && !error && !isEditing && languages.map((lang, index) => (
        <div key={index}>
          {langs.find(l => l.languageID === parseInt(lang.language))?.description || 'ไม่ระบุภาษา'} <span className="text-gray-500">({ languageLevels.find(l => l.value === lang.level)?.label || 'ไม่ระบุระดับ'} )</span>
        </div>
      ))}
      {isEditing && languages.map((lang, index) => (
        <div key={index} className="flex items-center gap-4 mb-3">
          <div className="grid grid-cols-2 gap-4 flex-grow">
            <div>
              <Select<langOption>
                options={langs.map(lang => ({ 
                  value: lang.languageID, 
                  label: lang.description 
                }))}
                value={lang.language ? { 
                  value: parseInt(lang.language), 
                  label: langs.find(l => l.languageID === parseInt(lang.language))?.description || ''
                } : null}
                onChange={(newValue) => handleLanguageChange(index, 'language', String((newValue as langOption)?.value || 0))}
              />
            </div>
            <div>
              <Select<LevelOption>
                options={languageLevels}
                value={lang.level ? { 
                  value: lang.level, 
                  label: languageLevels.find(l => l.value === lang.level)?.label || ''
                } : null}
                onChange={(newValue) => handleLanguageChange(index, 'level', (newValue as LevelOption)?.value || '')}
              />
            </div>
          </div>
          {isEditing && (
            <Button
              color="danger"
              variant="light"
              isIconOnly
              size="sm"
              onPress={() => handleRemoveLanguage(index)}
              className="w-[20px] rounded-full bg-red-500 text-white text-xl"
            >
              -
            </Button>
          )}
        </div>
      ))}

      <div className="flex mt-4 gap-2">
        <Button
          color="primary"
          variant="bordered"
          size="sm"
          onPress={isEditing ? handleSaveLanguage : () => setIsEditing(!isEditing)}
        >
          {isEditing ? 'บันทึก' : 'แก้ไข'}
        </Button>
        {isEditing && (
          <Button
            color="primary"
            variant="light"
            size="sm"
            onPress={handleAddLanguage}
            className='text-kryptonite-green text-md'
          >
            เพิ่ม
          </Button>
        )}
      </div>
    </div>
  );
}

export default LanguagesInput;