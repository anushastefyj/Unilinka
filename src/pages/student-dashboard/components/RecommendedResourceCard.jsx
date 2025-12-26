import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecommendedResourceCard = ({ resource }) => {
  const getFileIcon = (type) => {
    const icons = {
      'PDF': 'FileText',
      'PPT': 'Presentation',
      'DOC': 'FileType'
    };
    return icons?.[type] || 'File';
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-academic transition-academic hover:shadow-academic-md">
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-secondary/10 rounded-lg p-2 md:p-3 flex-shrink-0">
            <Icon name={getFileIcon(resource?.fileType)} size={20} className="text-secondary md:w-6 md:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm md:text-base font-semibold text-foreground mb-1 line-clamp-2">
              {resource?.title}
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground caption">
              {resource?.subject}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 mb-3 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Image 
              src={resource?.uploaderAvatar} 
              alt={resource?.uploaderAvatarAlt}
              className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover"
            />
            <span className="line-clamp-1">{resource?.uploaderName}</span>
          </div>
          <span>•</span>
          <span>{formatDate(resource?.uploadDate)}</span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 mb-4 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Download" size={14} className="md:w-4 md:h-4" />
            <span className="data-text">{resource?.downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Star" size={14} className="text-warning fill-warning md:w-4 md:h-4" />
            <span className="data-text">{resource?.rating}</span>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="sm" 
          iconName="Download" 
          iconPosition="left"
          fullWidth
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default RecommendedResourceCard;