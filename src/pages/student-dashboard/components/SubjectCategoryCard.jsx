import React from 'react';
import Icon from '../../../components/AppIcon';

const SubjectCategoryCard = ({ year, isCurrentYear, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left bg-white border border-[#E7E2D6] rounded-[1.5rem] p-5 transition-all duration-200 hover:shadow-md hover:border-[#1F4D3A]/30 group flex items-start justify-between"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl flex items-center justify-center bg-[#EFE7D8] text-[#1F4D3A]`}>
          <Icon name={year.icon || 'Book'} size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-[#1C1C1C] group-hover:text-[#1F4D3A] transition-colors">
              {year.label}
            </h3>
            {isCurrentYear && (
              <span className="bg-[#1F4D3A]/10 text-[#1F4D3A] text-xs font-bold px-2 py-0.5 rounded-full">
                Your Year
              </span>
            )}
          </div>
          <p className="text-sm text-[#5C5C5C] mb-1">{year.description}</p>
        </div>
      </div>
      <div className="pt-2 text-gray-300 group-hover:text-[#1F4D3A] transition-colors">
        <Icon name="ChevronRight" size={20} />
      </div>
    </button>
  );
};

export default SubjectCategoryCard;