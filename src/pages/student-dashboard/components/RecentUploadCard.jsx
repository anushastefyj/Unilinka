import React from 'react';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';

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
    <div className="bg-white border border-border rounded-3xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 rounded-2xl p-3 flex-shrink-0">
          <Icon name={getFileIcon(upload?.fileType)} size={24} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground mb-1 truncate">
            {upload?.title}
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="bg-muted px-2 py-0.5 rounded-full">{upload?.fileType || 'DOC'}</span>
            <span>•</span>
            <span>{formatDate(upload?.uploadDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {upload?.status === 'approved' && upload?.downloads > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <Icon name="Download" size={14} />
              <span>{upload?.downloads}</span>
            </div>
          )}
          <StatusIndicator status={upload?.status} size="small" />
        </div>
      </div>
      
      {upload?.status === 'rejected' && upload?.feedback && (
        <div className="mt-4 bg-error/10 border border-error/20 rounded-xl p-3 flex items-start gap-3">
          <p className="text-sm text-error flex-1">{upload?.feedback}</p>
          <button 
            onClick={() => onViewFeedback(upload)}
            className="text-xs font-bold text-error hover:underline whitespace-nowrap"
          >
            Fix Issues
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentUploadCard;