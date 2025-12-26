import React from 'react';
import Icon from '../../../components/AppIcon';

const GuidelinesPanel = () => {
  const guidelines = [
    {
      icon: 'CheckCircle',
      title: 'Content Quality',
      description: 'Ensure materials are accurate, well-organized, and relevant to the subject. Include proper citations for referenced work.'
    },
    {
      icon: 'Shield',
      title: 'Original Content',
      description: 'Upload only materials you have rights to share. Respect copyright laws and intellectual property rights.'
    },
    {
      icon: 'FileCheck',
      title: 'File Requirements',
      description: 'Files must be in PDF, PPT, or DOC format, under 50MB. Ensure documents are readable and properly formatted.'
    },
    {
      icon: 'Users',
      title: 'Faculty Review',
      description: 'All submissions undergo faculty verification to ensure academic standards and content appropriateness.'
    }
  ];

  const reviewProcess = [
    { step: '1', label: 'Upload', description: 'Submit your resource with complete metadata' },
    { step: '2', label: 'Queue', description: 'Resource enters faculty review queue' },
    { step: '3', label: 'Review', description: 'Faculty evaluates content quality and relevance' },
    { step: '4', label: 'Approval', description: 'Approved resources become available for download' }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-[var(--color-card)] rounded-xl p-6 md:p-8 border border-[var(--color-border)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center">
            <Icon name="BookOpen" size={20} />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-[var(--color-foreground)]">
            Upload Guidelines
          </h3>
        </div>

        <div className="space-y-4">
          {guidelines?.map((guideline, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-muted)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                <Icon name={guideline?.icon} size={18} />
              </div>
              <div>
                <h4 className="text-sm md:text-base font-semibold text-[var(--color-foreground)] mb-1">
                  {guideline?.title}
                </h4>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                  {guideline?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[var(--color-card)] rounded-xl p-6 md:p-8 border border-[var(--color-border)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] flex items-center justify-center">
            <Icon name="GitBranch" size={20} />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-[var(--color-foreground)]">
            Review Process
          </h3>
        </div>

        <div className="space-y-4">
          {reviewProcess?.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                {item?.step}
              </div>
              <div className="flex-1">
                <h4 className="text-sm md:text-base font-semibold text-[var(--color-foreground)] mb-1">
                  {item?.label}
                </h4>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {item?.description}
                </p>
              </div>
              {index < reviewProcess?.length - 1 && (
                <div className="absolute left-[16px] top-[40px] w-0.5 h-8 bg-[var(--color-border)]" style={{ position: 'relative', marginLeft: '16px', marginTop: '-8px' }} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[var(--color-muted)] rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Clock" size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[var(--color-foreground)] mb-1">
                Expected Review Time
              </p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Most resources are reviewed within 2-3 business days. You'll receive email notifications about status updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesPanel;