import React from 'react';

const SemesterTabs = ({ activeSemester, onSemesterSelect }) => {
  return (
    <div className="flex bg-[#EFE7D8]/50 p-1 rounded-full w-full max-w-sm mx-auto mb-8 border border-[#E7E2D6]">
      <button
        onClick={() => onSemesterSelect('Semester 1')}
        className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all ${
          activeSemester === 'Semester 1' 
            ? 'bg-white text-[#1F4D3A] shadow-sm' 
            : 'text-[#5C5C5C] hover:text-[#1C1C1C]'
        }`}
      >
        Semester 1
      </button>
      <button
        onClick={() => onSemesterSelect('Semester 2')}
        className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all ${
          activeSemester === 'Semester 2' 
            ? 'bg-white text-[#1F4D3A] shadow-sm' 
            : 'text-[#5C5C5C] hover:text-[#1C1C1C]'
        }`}
      >
        Semester 2
      </button>
    </div>
  );
};

export default SemesterTabs;
