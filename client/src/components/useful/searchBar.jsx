
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholderText, search, setSearch, style="" }) => {
  return (
    <div className={`relative w-full max-w-md mb-4 ${style}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:bg-gray-800 dark:text-slate-200 rounded-lg text-sm 
                 bg-white placeholder-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-150 ease-in-out"
        placeholder={placeholderText}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;