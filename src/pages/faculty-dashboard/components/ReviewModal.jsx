import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReviewModal = ({ material, onClose, onApprove, onReject }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove(material?.id, comment);
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!comment?.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsSubmitting(true);
    await onReject(material?.id, comment);
    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-academic-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Review Material
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-muted transition-academic flex items-center justify-center"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                {material?.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                  <Icon name="User" size={18} />
                  <span>Submitted by: {material?.studentName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                  <Icon name="BookOpen" size={18} />
                  <span>Subject: {material?.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                  <Icon name="Calendar" size={18} />
                  <span>Uploaded: {formatDate(material?.uploadDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                  <Icon name="File" size={18} />
                  <span>
                    {material?.fileType?.toUpperCase()} • {material?.fileSize}
                  </span>
                </div>
              </div>
            </div>

            {material?.description && (
              <div>
                <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">
                  Description
                </h4>
                <p className="text-sm md:text-base text-muted-foreground">
                  {material?.description}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-base md:text-lg font-semibold text-foreground mb-3">
                File Preview
              </h4>
              <div className="w-full h-96 rounded-lg overflow-hidden bg-muted border border-border">
                <iframe
                  src={material?.previewUrl}
                  title={`Preview of ${material?.title}`}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                />
              </div>
            </div>

            <div>
              <Input
                label="Review Comments"
                type="text"
                placeholder="Add your feedback or reason for rejection (required for rejection)"
                value={comment}
                onChange={(e) => setComment(e?.target?.value)}
                description="Your comments will be shared with the student"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            iconName="XCircle"
            iconPosition="left"
            onClick={handleReject}
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          >
            Reject
          </Button>
          <Button
            variant="success"
            iconName="CheckCircle"
            iconPosition="left"
            onClick={handleApprove}
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;