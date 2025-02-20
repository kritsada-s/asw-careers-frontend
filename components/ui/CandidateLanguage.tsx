import { CandidateLanguageProps } from "@/lib/types";
import { useLanguages } from "@/hooks/useDataFetching";
import { Button, ButtonGroup } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Select from 'react-select';

interface CandidateLanguageComponentProps {
  handleLanguageAdd: (language: CandidateLanguageProps) => void;
}

const CandidateLanguage: React.FC<CandidateLanguageComponentProps> = ({ 
  handleLanguageAdd 
}) => {

  const [selectedLanguage, setSelectedLanguage] = useState<CandidateLanguageProps | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const languages = useLanguages();

  // useEffect(() => {
  //   console.log('selectedLevel', selectedLevel);
  // }, [selectedLevel]);

  return (
    <div id="candidateLanguagesPanel" className="flex flex-col md:flex-row gap-2 md:gap-4 custom-selector">
      <Select className="md:min-w-[300px]"
        instanceId="language-select"
        options={languages.languages.map((language: any) => ({ value: language.languageID, label: language.description }))}
        placeholder="กรุณาเลือกภาษา"
        onChange={(selected) => {
          if (selected) {
            setSelectedLanguage({
              languageID: selected.value,
              languageName: selected.label,
              level: 0  // Set default level or get it from input
            });
          }
        }}
      />
      <div className="flex gap-1 md:gap-4 justify-between md:justify-start">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <p className="text-neutral-900">ระดับภาษา</p>
          <ButtonGroup variant="outlined" size="small" className="inline self-center">
            <Button value={1} onClick={() => setSelectedLevel(1)} className={`${selectedLevel === 1 ? '!bg-custom-orange !text-white' : ''}`}>พอใช้</Button>
            <Button value={2} onClick={() => setSelectedLevel(2)} className={`${selectedLevel === 2 ? '!bg-custom-orange !text-white' : ''}`}>ดี</Button>
            <Button value={3} onClick={() => setSelectedLevel(3)} className={`${selectedLevel === 3 ? '!bg-custom-orange !text-white' : ''}`}>ดีมาก</Button>
            <Button value={4} onClick={() => setSelectedLevel(4)} className={`${selectedLevel === 4 ? '!bg-custom-orange !text-white' : ''}`}>เชี่ยวชาญ</Button>
          </ButtonGroup>
        </div>
        <button type="button" className="bg-primary-700 text-white px-3 py-1 rounded-md flex items-center gap-1 md:hover:scale-95 transition text-sm h-fit self-end md:self-center" onClick={() => handleLanguageAdd({ languageID: selectedLanguage?.languageID ?? 0, languageName: selectedLanguage?.languageName ?? '', level: selectedLevel ?? 0 })}><PlusIcon className="w-3 h-3" /> เพิ่ม</button>
      </div>
    </div>
  );
}

export default CandidateLanguage;