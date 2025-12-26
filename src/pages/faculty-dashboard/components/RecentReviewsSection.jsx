import React from 'react';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';
import Button from '../../../components/ui/Button';

const RecentReviewsSection = ({ reviews, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-academic">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">
          Recently Completed Reviews
        </h3>
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>
      <div className="space-y-3 md:space-y-4">
        {reviews?.map((review) => (
          <div
            key={review?.id}
            className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-academic"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon name={getFileIcon(review?.fileType)} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base md:text-lg font-semibold text-foreground mb-1 line-clamp-1">
                      {review?.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="User" size={14} />
                        {review?.studentName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Icon name="BookOpen" size={14} />
                        {review?.subject}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {formatDate(review?.reviewedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {review?.comment && (
                  <p className="text-sm text-muted-foreground ml-13 line-clamp-2">
                    {review?.comment}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 lg:flex-shrink-0">
                <StatusIndicator status={review?.status} />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Icon
                    name={review?.notificationSent ? 'CheckCircle' : 'Clock'}
                    size={16}
                    color={
                      review?.notificationSent
                        ? 'var(--color-success)'
                        : 'var(--color-warning)'
                    }
                  />
                  <span className="caption">
                    {review?.notificationSent ? 'Notified' : 'Pending'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                  onClick={() => onViewDetails(review)}
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReviewsSection;