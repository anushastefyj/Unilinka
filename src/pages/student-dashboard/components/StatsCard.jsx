import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ icon, label, value }) => {
  return (
    <div className="bg-white border border-[#E7E2D6] rounded-full py-3 px-4 sm:px-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A] flex-shrink-0">
          <Icon name={icon} size={20} />
        </div>
        <span className="text-sm font-semibold text-[#5C5C5C]">{label}</span>
      </div>
      <div className="pl-4">
        <span className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">{value}</span>
      </div>
    </div>
  );
};

export default StatsCard;