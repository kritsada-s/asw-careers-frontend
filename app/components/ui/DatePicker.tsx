// BuddhistDatePicker.tsx
import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

interface BuddhistDatePickerProps {
  format?: string;
  onChange?: (date: Date | null) => void;
  value?: Date;
  className?: string;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  format?: string;
  selectedDate: Date | null;
}

// Thai month names
const thaiMonths: string[] = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Convert CE to BE year
const toBuddhistYear = (date: Date | null): number | string => {
  if (!date) return '';
  return date.getFullYear() + 543;
};

// Generate range of years (BE)
const generateYearRange = (currentDate: Date): number[] => {
  const currentYear = currentDate.getFullYear();
  const years: number[] = [];
  for (let year = currentYear - 50; year <= currentYear; year++) {
    years.push(year + 543); // Convert to Buddhist Era
  }
  return years;
};

// Format date according to specified pattern
const formatBuddhistDate = (date: Date | null, format: string = 'DD-MM-YYYY'): string => {
  if (!date) return '';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const buddhistYear = toBuddhistYear(date);
  const shortYear = typeof buddhistYear === 'number' ? buddhistYear % 100 : '';
  const thaiMonth = thaiMonths[date.getMonth()];
  
  return format
    .replace('YYYY', buddhistYear.toString())
    .replace('YY', shortYear.toString())
    .replace('DD', day)
    .replace('dd', day)
    .replace('MMMM', thaiMonth)
    .replace('MM', month)
    .replace('mm', month);
};

// Custom input component with forwarded ref
const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, format, selectedDate }, ref) => (
    <input
      value={formatBuddhistDate(selectedDate, format)}
      onClick={onClick}
      ref={ref}
      readOnly
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
);

CustomInput.displayName = 'CustomInput';

// Custom header component
const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps): JSX.Element => {
  const [isMonthOpen, setIsMonthOpen] = useState<boolean>(false);
  const years = generateYearRange(date);
  const currentBuddhistYear = toBuddhistYear(date);
  
  return (
    <div className="p-2">
      {/* Month and Year Selection Row */}
      <div className="flex justify-center items-center space-x-2 mb-2">
        <button
          type="button"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {"<"}
        </button>

        {/* Month Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMonthOpen(!isMonthOpen)}
            className="px-2 py-1 border rounded outline-none cursor-pointer hover:bg-gray-50 flex items-center justify-between min-w-[120px]"
          >
            {thaiMonths[date.getMonth()]}
            <span className="ml-2">▼</span>
          </button>
          {isMonthOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
              {thaiMonths.map((month, index) => (
                <button
                  key={month}
                  onClick={() => {
                    changeMonth(index);
                    setIsMonthOpen(false);
                  }}
                  className="w-full px-2 py-1 text-left hover:bg-gray-100"
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Selector */}
        <select
          value={currentBuddhistYear.toString()}
          onChange={(e) => {
            // Convert BE back to CE before changing year
            const buddhistYear = Number(e.target.value);
            const christianYear = buddhistYear - 543;
            changeYear(christianYear);
          }}
          className="px-2 py-1 border rounded outline-none cursor-pointer hover:bg-gray-50"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

const BuddhistDatePicker: React.FC<BuddhistDatePickerProps> = ({
  format = 'DD/MM/YYYY',
  onChange,
  value,
  className = 'w-full font-db',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || new Date());

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log(date?.toISOString());
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className={className}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        renderCustomHeader={CustomHeader}
        showMonthYearPicker={false}
        customInput={
          <CustomInput format={format} selectedDate={selectedDate} />
        }
        formatWeekDay={(nameOfDay: string) => nameOfDay.substring(0, 3)}
      />
    </div>
  );
};

export default BuddhistDatePicker;