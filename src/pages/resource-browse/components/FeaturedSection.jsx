import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedSection = ({ resources, onViewDetails, onDownload }) => {
  const getFileIcon = (fileType) => {
    const iconMap = {
      'PDF': 'FileText',
      'PPT': 'Presentation',
      'DOC': 'FileType'
    };
    return iconMap?.[fileType] || 'File';
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-xl p-4 md:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Star" size={24} className="text-accent" />
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Featured Resources
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources?.map((resource) => (
          <div
            key={resource?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-academic transition-academic"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={getFileIcon(resource?.fileType)} size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 line-clamp-2">
                  {resource?.title}
                </h3>
                <p className="text-xs text-muted-foreground">{resource?.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1 text-xs text-success">
                <Icon name="BadgeCheck" size={14} />
                Verified
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="Download" size={14} />
                {resource?.downloadCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                onClick={() => onViewDetails(resource)}
                className="flex-1"
              >
                View
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                onClick={() => onDownload(resource)}
                className="flex-1"
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;