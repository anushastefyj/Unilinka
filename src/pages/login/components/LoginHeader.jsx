import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-6 md:mb-8 lg:mb-10">
      <div className="flex justify-center mb-4 md:mb-5">
        <div
          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center shadow-academic-md"
          style={{ background: 'var(--color-primary)' }}
        >
          <Icon name="GraduationCap" size={40} color="var(--color-primary-foreground)" />
        </div>
      </div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3" style={{ color: 'var(--color-foreground)' }}>
        Welcome to LearnShare
      </h1>
      <p className="text-sm md:text-base lg:text-lg" style={{ color: 'var(--color-muted-foreground)' }}>
        Sign in to access your academic resources and collaborate with peers
      </p>
    </div>
  );
};

export default LoginHeader;