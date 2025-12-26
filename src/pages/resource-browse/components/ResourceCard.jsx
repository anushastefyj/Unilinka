import React from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ResourceCard = ({ resource, onDownload, onViewDetails }) => {
  const getFileIcon = (fileType) => {
    const iconMap = {
      'PDF': 'FileText',
      'PPT': 'Presentation',
      'DOC': 'FileType'
    };
    return iconMap?.[fileType] || 'File';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 hover:shadow-academic-md transition-academic">
      <div className="flex items-start gap-3 md:gap-4 mb-4">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name={getFileIcon(resource?.fileType)} size={24} className="text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 line-clamp-2">
            {resource?.title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {resource?.subject}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {resource?.description}
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs font-medium">
          <Icon name="FileType" size={14} />
          {resource?.fileType}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs font-medium">
          <Icon name="GraduationCap" size={14} />
          {resource?.academicLevel}
        </span>
        {resource?.isFeatured && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium">
            <Icon name="Star" size={14} />
            Featured
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon name="Calendar" size={16} />
            {formatDate(resource?.uploadDate)}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="Download" size={16} />
            {resource?.downloadCount}
          </span>
        </div>
        
        {resource?.facultyVerified && (
          <div className="flex items-center gap-1 text-xs text-success">
            <Icon name="BadgeCheck" size={16} />
            <span className="hidden sm:inline">Verified</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Eye"
          iconPosition="left"
          onClick={() => onViewDetails(resource)}
          className="flex-1"
        >
          Details
        </Button>
        <Button
          variant="default"
          size="sm"
          iconName="Download"
          iconPosition="left"
          onClick={() => onDownload(resource)}
          className="flex-1"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;