import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  return (
    <div className="text-center mb-6 md:mb-8 lg:mb-10">
      <div className="flex justify-center mb-4 md:mb-5">
        <div 
          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-academic-md"
          style={{ background: 'var(--color-primary)' }}
        >
          <Icon name="GraduationCap" size={40} className="md:w-12 md:h-12 lg:w-14 lg:h-14" style={{ color: 'var(--color-primary-foreground)' }} />
        </div>
      </div>
      
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3" style={{ color: 'var(--color-foreground)' }}>
        Join LearnShare
      </h1>
      
      <p className="text-sm md:text-base lg:text-lg max-w-md mx-auto" style={{ color: 'var(--color-muted-foreground)' }}>
        Create your student account to access and share quality academic resources with your peers
      </p>
    </div>
  );
};

export default RegistrationHeader;