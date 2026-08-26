import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ icon, label, value, onClick }) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component 
      onClick={onClick}
      className={`bg-white border border-[#E7E2D6] rounded-full py-4 px-6 flex items-center justify-between shadow-sm transition-all w-full text-left
        ${onClick ? 'hover:shadow-md hover:border-[#1F4D3A]/30 cursor-pointer group' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A] flex-shrink-0 transition-transform ${onClick ? 'group-hover:scale-110' : ''}`}>
          <Icon name={icon} size={24} />
        </div>
        <span className={`text-sm font-bold transition-colors ${onClick ? 'text-[#5C5C5C] group-hover:text-[#1F4D3A]' : 'text-[#5C5C5C]'}`}>
          {label}
        </span>
      </div>
      <div className="pl-4">
        <span className={`text-2xl sm:text-3xl font-bold font-serif transition-colors ${onClick ? 'text-[#1C1C1C] group-hover:text-[#1F4D3A]' : 'text-[#1C1C1C]'}`}>
          {value}
        </span>
      </div>
    </Component>
  );
};

export default StatsCard;