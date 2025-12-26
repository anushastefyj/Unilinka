import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubjectCategoryCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleBrowse = () => {
    navigate('/resource-browse', { state: { selectedSubject: subject?.id } });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 lg:p-6 shadow-academic transition-academic hover:shadow-academic-md group">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className={`${subject?.iconBg} rounded-lg p-2 md:p-3 transition-academic group-hover:scale-110`}>
          <Icon name={subject?.icon} size={20} className="text-primary md:w-6 md:h-6" />
        </div>
        <div className="bg-primary/10 rounded-full px-2 md:px-3 py-1">
          <span className="text-xs md:text-sm font-semibold text-primary data-text">{subject?.resourceCount}</span>
        </div>
      </div>
      <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-2 line-clamp-1">
        {subject?.name}
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground caption mb-3 md:mb-4 line-clamp-2">
        {subject?.description}
      </p>
      <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
        <div className="flex items-center gap-1">
          <Icon name="Clock" size={14} className="md:w-4 md:h-4" />
          <span>Updated {subject?.lastUpdated}</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        iconName="ArrowRight" 
        iconPosition="right"
        onClick={handleBrowse}
        fullWidth
      >
        Browse Resources
      </Button>
    </div>
  );
};

export default SubjectCategoryCard;