import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubmissionConfirmation = ({ trackingNumber, filesCount, onClose }) => {
  const navigate = useNavigate();

  const handleViewDashboard = () => {
    navigate('/student-dashboard');
  };

  const handleUploadMore = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-background)]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-academic-xl max-w-md w-full p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mb-4 md:mb-6">
            <Icon name="CheckCircle" size={40} color="var(--color-success)" />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-foreground)] mb-2">
            Upload Successful!
          </h2>

          <p className="text-sm md:text-base text-[var(--color-muted-foreground)] mb-6">
            Your {filesCount} {filesCount === 1 ? 'resource has' : 'resources have'} been submitted for faculty review.
          </p>

          <div className="w-full bg-[var(--color-muted)] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--color-foreground)]">
                Tracking Number
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText(trackingNumber)}
                className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors duration-250"
              >
                <Icon name="Copy" size={16} />
              </button>
            </div>
            <p className="text-base md:text-lg font-semibold text-[var(--color-primary)] data-text">
              {trackingNumber}
            </p>
          </div>

          <div className="w-full space-y-3 mb-6">
            <div className="flex items-start gap-3 text-left">
              <Icon name="Mail" size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">
                  Email Notification
                </p>
                <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">
                  You'll receive updates about the review status
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <Icon name="Clock" size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">
                  Review Timeline
                </p>
                <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">
                  Expected review within 2-3 business days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <Icon name="LayoutDashboard" size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">
                  Track Progress
                </p>
                <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">
                  Monitor status from your dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleUploadMore}
              iconName="Plus"
              iconPosition="left"
              fullWidth
            >
              Upload More
            </Button>
            <Button
              variant="default"
              onClick={handleViewDashboard}
              iconName="LayoutDashboard"
              iconPosition="left"
              fullWidth
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;