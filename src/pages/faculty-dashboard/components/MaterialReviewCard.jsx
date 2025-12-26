import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const MaterialReviewCard = ({ material, onReview, onQuickApprove, onQuickReject, onSelect, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return 'FileText';
      case 'ppt': case'pptx':
        return 'Presentation';
      case 'doc': case'docx':
        return 'FileText';
      default:
        return 'File';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
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
    <div
      className={`bg-card border-2 rounded-xl p-4 md:p-6 shadow-academic transition-academic hover:shadow-academic-md ${
        isSelected ? 'border-primary' : 'border-border'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(material?.id, e?.target?.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="w-full lg:w-32 h-40 lg:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={material?.thumbnail}
                alt={material?.thumbnailAlt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 line-clamp-2">
                    {material?.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="BookOpen" size={16} />
                      {material?.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={16} />
                      {material?.studentName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={16} />
                      {formatDate(material?.uploadDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg bg-muted text-sm md:text-base font-medium ${getPriorityColor(
                      material?.priority
                    )}`}
                  >
                    <Icon name="Flag" size={16} />
                    <span className="capitalize">{material?.priority}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted">
                  <Icon name={getFileIcon(material?.fileType)} size={16} />
                  <span className="text-sm md:text-base font-medium text-foreground uppercase">
                    {material?.fileType}
                  </span>
                </div>
                <span className="text-sm md:text-base text-muted-foreground data-text">
                  {material?.fileSize}
                </span>
                <span className="text-sm md:text-base text-muted-foreground">
                  {material?.downloads} downloads
                </span>
              </div>

              {isExpanded && material?.description && (
                <p className="text-sm md:text-base text-muted-foreground mb-3 line-clamp-3">
                  {material?.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 md:gap-3">
                <Button
                  variant="default"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => onReview(material)}
                >
                  Review
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  iconName="CheckCircle"
                  iconPosition="left"
                  onClick={() => onQuickApprove(material)}
                >
                  Quick Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  iconName="XCircle"
                  iconPosition="left"
                  onClick={() => onQuickReject(material)}
                >
                  Quick Reject
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                  iconPosition="right"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Less' : 'More'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialReviewCard;