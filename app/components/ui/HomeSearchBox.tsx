import React from 'react';

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
    <div className="flex justify-between p-[8px] bg-white rounded-[15px] w-full md:w-[750px]">
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  placeholder="ค้นหาตำแหน่งงาน" className="pl-2 md:pl-4 pr-1 py-0 border-none focus:outline-none focus:ring-0 w-full" onKeyUp={handleKeyPress}/>
      <button onClick={handleSearch} className="w-[130px] h-[40px] text-white bg-primary-700 hover:bg-primary-600 transition rounded-[10px] flex items-center justify-center gap-2">
        <svg className="w-[20px] h-[20px] text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
        </svg>
        ค้นหา
      </button>
    </div>
  );
};

export default SearchBox;