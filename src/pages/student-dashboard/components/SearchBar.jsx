import React from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ value, onChange, placeholder = "Search for subjects, topics, or file types..." }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#1F4D3A]">
        <Icon name="Search" size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[#E7E2D6] rounded-full py-4 pl-14 pr-6 text-base font-medium text-[#1C1C1C] placeholder-[#5C5C5C]/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 focus:border-[#1F4D3A]/30 transition-all"
        placeholder={placeholder}
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-[#1C1C1C] transition-colors"
        >
          <Icon name="X" size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
