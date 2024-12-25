import React, { useState } from 'react';
import { CandidateLanguageProps, Language } from '@/lib/types';

interface CandidateLanguageComponentProps {
  onChange: (languages: Language[]) => void;
}

const CandidateLanguage: React.FC<CandidateLanguageComponentProps> = ({ onChange }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newLanguage, setNewLanguage] = useState<Language>({
    languageID: 0,
    languageName: '',
    level: ''
  });

  const languageLevels = [
    'Beginner',
    'Elementary', 
    'Intermediate',
    'Upper Intermediate',
    'Advanced',
    'Native'
  ];

  const handleAdd = () => {
    if (newLanguage.languageName && newLanguage.level) {
      const updatedLanguages = [
        ...languages,
        { ...newLanguage, languageID: Date.now() }
      ];
      setLanguages(updatedLanguages);
      onChange(updatedLanguages);
      setNewLanguage({ languageID: 0, languageName: '', level: '' });
    }
  };

  const handleEdit = (id: number) => {
    if (editingId === id) {
      setEditingId(null);
    } else {
      setEditingId(id);
    }
  };

  const handleUpdate = (id: number, field: string, value: string) => {
    const updatedLanguages = languages.map(lang => 
      lang.languageID === id ? { ...lang, [field]: value } : lang
    );
    setLanguages(updatedLanguages);
    onChange(updatedLanguages);
  };

  const handleRemove = (id: number) => {
    const updatedLanguages = languages.filter(lang => lang.languageID !== id);
    setLanguages(updatedLanguages);
    onChange(updatedLanguages);
  };

  return (
    <div className="space-y-4">
      {/* Add new language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block mb-1">Language</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={newLanguage.languageName}
            onChange={(e) => setNewLanguage({ ...newLanguage, languageName: e.target.value })}
            placeholder="Enter language"
          />
        </div>
        <div>
          <label className="block mb-1">Level</label>
          <select 
            className="w-full border border-gray-300 rounded p-2"
            value={newLanguage.level}
            onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
          >
            <option value="">Select Level</option>
            {languageLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Language
        </button>
      </div>

      {/* Language list */}
      <div className="space-y-2">
        {languages.map(lang => (
          <div key={lang.languageID} className="flex items-center space-x-4 p-2 border rounded">
            {editingId === lang.languageID ? (
              <>
                <input
                  type="text"
                  className="flex-1 border rounded p-1"
                  value={lang.languageName}
                  onChange={(e) => handleUpdate(lang.languageID, 'languageName', e.target.value)}
                />
                <select
                  className="flex-1 border rounded p-1"
                  value={lang.level}
                  onChange={(e) => handleUpdate(lang.languageID, 'level', e.target.value)}
                >
                  {languageLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <span className="flex-1">{lang.languageName}</span>
                <span className="flex-1">{lang.level}</span>
              </>
            )}
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(lang.languageID)}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                {editingId === lang.languageID ? 'Save' : 'Edit'}
              </button>
              <button
                onClick={() => handleRemove(lang.languageID)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateLanguage;
