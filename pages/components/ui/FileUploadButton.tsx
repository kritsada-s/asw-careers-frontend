import * as React from 'react';
import { CloudUploadIcon } from 'lucide-react';
import { Button } from '@nextui-org/react';

export default function InputFileUpload({ onChange, file }: { onChange: (file: File) => void, file: File | null }) {
  return (
    <div>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onChange(file);
          }
        }}
        style={{ display: 'none' }}
        id="upload-file-button"
      />
      <label htmlFor="upload-file-button">
        <Button 
          as="span"
          variant="solid"
          startContent={<CloudUploadIcon size={20} />}
          className="bg-zinc-500 hover:bg-zinc-600 active:bg-zinc-700 text-white cursor-pointer h-auto min-h-[45px] px-4 py-1"
        >
          {file ? file.name : 'อัพโหลดไฟล์'}
        </Button>
      </label>
    </div>
  );
}
