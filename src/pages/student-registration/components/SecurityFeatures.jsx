import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'Secure Registration',
      description: 'Your data is encrypted and protected with industry-standard security protocols'
    },
    {
      icon: 'Mail',
      title: 'Email Verification',
      description: 'Verify your institutional email to ensure authentic academic community'
    },
    {
      icon: 'Lock',
      title: 'Password Protection',
      description: 'Strong password requirements to keep your account safe and secure'
    }
  ];

  return (
    <div className="mt-8 md:mt-10 lg:mt-12">
      <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-5 text-center" style={{ color: 'var(--color-foreground)' }}>
        Your Security Matters
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="p-4 md:p-5 rounded-lg md:rounded-xl text-center transition-academic hover:shadow-academic-md"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex justify-center mb-3">
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--color-muted)' }}
              >
                <Icon name={feature?.icon} size={24} className="md:w-7 md:h-7" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
            
            <h4 className="text-sm md:text-base font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
              {feature?.title}
            </h4>
            
            <p className="text-xs md:text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityFeatures;