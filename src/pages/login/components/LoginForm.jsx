import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = ({ initialEmail = '' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRememberMeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: e?.target?.checked
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await login(formData.email, formData.password);
      
      if (error) {
        setErrors({
          submit: error.message || 'Invalid email or password. Please try again.'
        });
        setIsLoading(false);
      } else if (data?.user) {
        if (formData?.rememberMe) {
          localStorage.setItem('rememberedEmail', formData?.email);
        }
        // Redirection is handled by the useEffect in Login/index.jsx
      }
    } catch (error) {
      setErrors({
        submit: error.message || 'An error occurred. Please try again.'
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4 md:mb-5 lg:mb-6">
        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />
      </div>
      <div className="mb-4 md:mb-5 lg:mb-6">
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="flex items-center justify-between mb-5 md:mb-6 lg:mb-7">
        <Checkbox
          label="Remember me"
          checked={formData?.rememberMe}
          onChange={handleRememberMeChange}
          disabled={isLoading}
          size="sm"
        />
        <button
          type="button"
          className="text-sm font-medium transition-colors"
          style={{ color: 'var(--color-primary)' }}
          disabled={isLoading}
        >
          Forgot Password?
        </button>
      </div>
      {errors?.submit && (
        <div className="mb-4 p-3 md:p-4 rounded-lg flex items-start gap-3" style={{ 
          background: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid var(--color-error)'
        }}>
          <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm whitespace-pre-line" style={{ color: 'var(--color-error)' }}>
            {errors?.submit}
          </p>
        </div>
      )}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
        className="mb-4 md:mb-5"
      >
        Sign In
      </Button>
      <div className="text-center">
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/student-registration')}
            className="font-medium transition-colors"
            style={{ color: 'var(--color-primary)' }}
            disabled={isLoading}
          >
            Create Student Account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;