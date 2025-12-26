import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { signIn } from '../../../lib/firebaseAuth';
import { getUser, createUser } from '../../../lib/firebaseDb';

const LoginForm = ({ initialEmail = '' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    password: '',
    role: 'student',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const mockCredentials = {
    student: { email: 'student@learnshare.edu', password: 'Student@123' },
    faculty: { email: 'faculty@learnshare.edu', password: 'Faculty@456' },
    admin: { email: 'admin@learnshare.edu', password: 'Admin@789' }
  };

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
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

  const handleRoleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      role: e?.target?.value
    }));
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
      // Sign in with Firebase
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        const user = result.user;
        
        // Get or create user data in Firestore
        let userDataResult = await getUser(user.uid);
        
        if (!userDataResult.success) {
          // Create user document if it doesn't exist
          await createUser(user.uid, {
            email: user.email,
            displayName: user.displayName || '',
            role: formData.role || 'student',
            createdAt: new Date().toISOString()
          });
          userDataResult = await getUser(user.uid);
        }

        const userRole = userDataResult.data?.role || formData.role || 'student';
        
        // Store in localStorage for backward compatibility
        localStorage.setItem('authToken', user.uid);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', user.email);

        if (formData?.rememberMe) {
          localStorage.setItem('rememberedEmail', formData?.email);
        }

        const dashboardRoutes = {
          student: '/student-dashboard',
          faculty: '/faculty-dashboard',
          admin: '/faculty-dashboard'
        };

        navigate(dashboardRoutes?.[userRole] || '/student-dashboard');
      } else {
        // Show user-friendly error message
        setErrors({
          submit: result.error || 'Invalid email or password. Please try again.'
        });
        setIsLoading(false);
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
      <div className="mb-4 md:mb-5 lg:mb-6">
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-foreground)' }}>
          Select Role
        </label>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-all" style={{
            borderColor: formData?.role === 'student' ? 'var(--color-primary)' : 'var(--color-border)',
            background: formData?.role === 'student' ? 'rgba(30, 64, 175, 0.05)' : 'transparent'
          }}>
            <input
              type="radio"
              name="role"
              value="student"
              checked={formData?.role === 'student'}
              onChange={handleRoleChange}
              disabled={isLoading}
              className="w-4 h-4"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Student</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-all" style={{
            borderColor: formData?.role === 'faculty' ? 'var(--color-primary)' : 'var(--color-border)',
            background: formData?.role === 'faculty' ? 'rgba(30, 64, 175, 0.05)' : 'transparent'
          }}>
            <input
              type="radio"
              name="role"
              value="faculty"
              checked={formData?.role === 'faculty'}
              onChange={handleRoleChange}
              disabled={isLoading}
              className="w-4 h-4"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Faculty</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-all" style={{
            borderColor: formData?.role === 'admin' ? 'var(--color-primary)' : 'var(--color-border)',
            background: formData?.role === 'admin' ? 'rgba(30, 64, 175, 0.05)' : 'transparent'
          }}>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={formData?.role === 'admin'}
              onChange={handleRoleChange}
              disabled={isLoading}
              className="w-4 h-4"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Admin</span>
          </label>
        </div>
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