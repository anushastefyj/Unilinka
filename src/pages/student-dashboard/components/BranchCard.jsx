import React from 'react';
import Icon from '../../../components/AppIcon';

const BranchCard = ({ branch, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left bg-white border border-[#E7E2D6] rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:border-[#1F4D3A]/30 group flex flex-col items-center justify-center text-center gap-3"
    >
      <div className="w-16 h-16 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A] group-hover:scale-110 transition-transform">
        <Icon name="Briefcase" size={28} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#1C1C1C] group-hover:text-[#1F4D3A] transition-colors">
          {branch.value}
        </h3>
        <p className="text-xs text-[#5C5C5C] mt-1">{branch.label}</p>
      </div>
    </button>
  );
};

export default BranchCard;
