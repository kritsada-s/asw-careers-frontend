import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { CloudUploadIcon } from 'lucide-react';
import clsx from 'clsx';
//import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FileUploadButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function InputFileUpload({ onChange, file }: { onChange: (file: File) => void, file: File | null }) {
  return (
    <FileUploadButton
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      className="!text-sm px-4 py-1"
      >
      { file?.name || 'อัพโหลดเอกสาร'}
      <VisuallyHiddenInput
        type="file"
        name="resume"
        required
        accept=".pdf,.doc,.docx"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onChange(file);
          }
        }}
      />
    </FileUploadButton>
  );
}
