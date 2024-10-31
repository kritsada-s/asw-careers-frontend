import React from 'react';
import { 
  TextField, 
  IconButton, 
  InputAdornment,
  Button
} from '@mui/material';

interface SearchBoxProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="ค้นหาตำแหน่งงาน"
      sx={{
        borderRadius: '20px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '20px',
        },
      }}
      className='bg-primary-foreground lg:max-w-[760px]'
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={handleKeyPress}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <svg className="w-6 h-6 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/></svg>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Button onClick={handleSearch}
              className='bg-primary-700 text-primary-foreground px-5 lg:px-8 py-2 text-[22px] rounded-[10px] flex gap-1 leading-none'>
                <svg className="text-white w-[18px] h-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
                ค้นหา
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBox;