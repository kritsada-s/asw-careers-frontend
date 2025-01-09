import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { createTheme, Theme, ThemeProvider } from '@mui/material';

const locales = ['th'];
const datePickerTheme = (theme: Theme) => createTheme({
  ...theme,
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
          color: 'red',
        },
      },
    },
  },
});

type LocaleKey = (typeof locales)[number];

interface CustomDatePickerProps {
  onBlur: (date: Date | null) => void;
}

function CustomDatePicker({ onBlur }: CustomDatePickerProps) {
  const [locale, setLocale] = React.useState<LocaleKey>('th');

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <DatePicker 
          
          sx={{
            '& .MuiInputBase-input': {
              paddingTop: 0,
              paddingBottom: 0,
            },
            '& .MuiSvgIcon-root': {
              width: '0.8em',
              height: '0.8em',
            },
            '& .MuiPickersDay-root': {
              fontSize: '1em',
            },
          }}

          onChange={(value) => onBlur(value ? value.toDate() : null)}
        />
      </LocalizationProvider>
  );
}

export default CustomDatePicker;