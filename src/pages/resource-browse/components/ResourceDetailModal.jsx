import React from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResourceDetailModal = ({ resource, isOpen, onClose, onDownload }) => {
  if (!isOpen || !resource) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getFileIcon = (fileType) => {
    const iconMap = {
      'PDF': 'FileText',
      'PPT': 'Presentation',
      'DOC': 'FileType'
    };
    return iconMap?.[fileType] || 'File';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-academic-xl">
        <div className="sticky top-0 bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Resource Details
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-academic"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name={getFileIcon(resource?.fileType)} size={32} className="text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                {resource?.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                  <Icon name="BookOpen" size={16} />
                  {resource?.subject}
                </span>
                {resource?.facultyVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-lg text-sm font-medium">
                    <Icon name="BadgeCheck" size={16} />
                    Faculty Verified
                  </span>
                )}
                {resource?.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-lg text-sm font-medium">
                    <Icon name="Star" size={16} />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {resource?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="FileType" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">File Type</span>
                </div>
                <p className="text-sm text-muted-foreground">{resource?.fileType}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="HardDrive" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">File Size</span>
                </div>
                <p className="text-sm text-muted-foreground">{resource?.fileSize}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="GraduationCap" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Academic Level</span>
                </div>
                <p className="text-sm text-muted-foreground">{resource?.academicLevel}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Calendar" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Upload Date</span>
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(resource?.uploadDate)}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="User" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Uploaded By</span>
                </div>
                <p className="text-sm text-muted-foreground">{resource?.uploadedBy}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Download" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Downloads</span>
                </div>
                <p className="text-sm text-muted-foreground">{resource?.downloadCount} times</p>
              </div>
            </div>

            {resource?.tags && resource?.tags?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {resource?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resource?.facultyRecommendation && (
              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="MessageSquare" size={20} className="text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      Faculty Recommendation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {resource?.facultyRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              iconName="X"
              iconPosition="left"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              variant="default"
              iconName="Download"
              iconPosition="left"
              onClick={() => {
                onDownload(resource);
                onClose();
              }}
              className="flex-1"
            >
              Download Resource
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal;