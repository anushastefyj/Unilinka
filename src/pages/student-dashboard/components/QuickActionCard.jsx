import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActionCard = ({ action }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (action?.path) {
      navigate(action?.path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-card border border-border rounded-xl p-4 md:p-5 lg:p-6 shadow-academic transition-academic hover:shadow-academic-md hover:border-primary group text-left w-full"
    >
      <div className={`${action?.iconBg} rounded-lg p-3 md:p-4 inline-flex mb-3 md:mb-4 transition-academic group-hover:scale-110`}>
        <Icon name={action?.icon} size={24} className="text-primary md:w-7 md:h-7 lg:w-8 lg:h-8" />
      </div>
      <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-2">
        {action?.title}
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground caption line-clamp-2">
        {action?.description}
      </p>
      <div className="flex items-center gap-2 mt-3 md:mt-4 text-xs md:text-sm font-medium text-primary">
        <span>{action?.actionText}</span>
        <Icon name="ArrowRight" size={16} className="transition-academic group-hover:translate-x-1 md:w-5 md:h-5" />
      </div>
    </button>
  );
};

export default QuickActionCard;