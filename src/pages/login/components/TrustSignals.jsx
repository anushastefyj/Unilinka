import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'Secure Platform',
      description: 'Your data is protected with industry-standard encryption'
    },
    {
      icon: 'Users',
      title: 'Verified Community',
      description: 'Only verified students and faculty can access resources'
    },
    {
      icon: 'Lock',
      title: 'Privacy First',
      description: 'We respect your privacy and never share your information'
    }
  ];

  return (
    <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
              <Icon name={feature.icon} size={20} className="text-primary" />
            </div>
            <h4 className="text-xs md:text-sm font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>
              {feature.title}
            </h4>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;
