import React from 'react';
import Icon from '../../../components/AppIcon';

import StatusIndicator from '../../../components/ui/StatusIndicator';
import Button from '../../../components/ui/Button';

const RecentUploadCard = ({ upload, onViewFeedback }) => {
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
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-academic transition-academic hover:shadow-academic-md">
      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="bg-primary/10 rounded-lg p-2 md:p-3 flex-shrink-0">
          <Icon name={getFileIcon(upload?.fileType)} size={20} className="text-primary md:w-6 md:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base lg:text-lg font-semibold text-foreground mb-1 line-clamp-1">
            {upload?.title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground caption mb-2">
            {upload?.subject} • {formatDate(upload?.uploadDate)}
          </p>
          <StatusIndicator status={upload?.status} size="small" />
        </div>
      </div>
      {upload?.status === 'rejected' && upload?.feedback && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-3">
          <p className="text-xs md:text-sm text-error line-clamp-2">{upload?.feedback}</p>
        </div>
      )}
      {upload?.status === 'approved' && upload?.downloads > 0 && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-3">
          <Icon name="Download" size={14} className="md:w-4 md:h-4" />
          <span className="data-text">{upload?.downloads} downloads</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        {upload?.status === 'rejected' && (
          <Button 
            variant="outline" 
            size="sm" 
            iconName="MessageSquare" 
            iconPosition="left"
            onClick={() => onViewFeedback(upload)}
            className="flex-1"
          >
            View Feedback
          </Button>
        )}
        {upload?.status === 'approved' && (
          <Button 
            variant="secondary" 
            size="sm" 
            iconName="Eye" 
            iconPosition="left"
            className="flex-1"
          >
            View Resource
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecentUploadCard;