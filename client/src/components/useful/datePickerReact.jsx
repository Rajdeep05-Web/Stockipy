import { useState, useMemo, useEffect } from 'react';
import { Calendar, Sun, Moon } from 'lucide-react';

/**
 * Formats a Date object into a 'YYYY-MM-DD' string for the date input.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
const formatDateForInput = (date) => {
  const year = date.getFullYear();
  // getMonth() is 0-indexed, so we add 1.
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parses a 'YYYY-MM-DD' string from the input into a Date object.
 * Note: This creates the date in local time.
 * @param {string} dateString - The 'YYYY-MM-DD' string.
 * @returns {Date} The corresponding Date object.
 */
const parseInputDate = (dateString) => {
  const parts = dateString.split('-').map(part => parseInt(part, 10));
  // new Date(year, monthIndex, day)
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

/**
 * Single Date Picker Component
 * Allows selection of a single date via a native date input.
 * Styling is now controlled by Tailwind's dark: variant.
 * @param {function} onDateChange - Callback function when the date changes, receiving a Date object.
 */
const DatePicker = ({ onDateChange, dateReset }) => {
  const today = useMemo(() => new Date(), []);
  
  // State is now a single string in 'YYYY-MM-DD' format
  const [selectedDateStr, setSelectedDateStr] = useState("");

  useEffect(() => {
    if (dateReset) {
      // If the parent signals a reset, clear the internal state
      setSelectedDateStr("");
    }
  }, [dateReset]);

  const handleDateChange = (event) => {
    const newDateStr = event.target.value;
    // Update the internal string state
    setSelectedDateStr(newDateStr);
    
    // Notify the parent component with a full Date object
    if (newDateStr) {
      onDateChange?.(parseInputDate(newDateStr));
    } else {
      onDateChange?.(null); // Handle empty input if needed
    }
  }


  return (
            <div className="">
              <input
                type="date"
                value={selectedDateStr}
                onChange={handleDateChange}
                // Applying consistent styles with dark: variants
                className="w-full px-4 py-3 border bg-gray-50 text-gray-800 border-gray-300 hover:border-blue-500 focus:ring-blue-600/50 
                           dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:border-blue-500 dark:focus:ring-blue-400/50 
                           rounded-lg appearance-none transition duration-150 focus:outline-none focus:ring-2 text-base cursor-pointer
                           color-scheme-light dark:color-scheme-dark"
              />
            </div>
  );
}
export default DatePicker;