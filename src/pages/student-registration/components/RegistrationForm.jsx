import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { signup, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institutionName: '',
    studentId: '',
    academicYear: '',
    program: '',
    termsAccepted: false,
    privacyAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const academicYearOptions = [
    { value: 'freshman', label: 'Freshman (1st Year)' },
    { value: 'sophomore', label: 'Sophomore (2nd Year)' },
    { value: 'junior', label: 'Junior (3rd Year)' },
    { value: 'senior', label: 'Senior (4th Year)' },
    { value: 'graduate', label: 'Graduate Student' }
  ];

  const programOptions = [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business Administration' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'literature', label: 'Literature' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'economics', label: 'Economics' }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (password?.length >= 12) strength += 25;
    if (/[a-z]/?.test(password) && /[A-Z]/?.test(password)) strength += 25;
    if (/\d/?.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/?.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value?.trim()) error = 'Full name is required';
        else if (value?.trim()?.length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'email':
        if (!value?.trim()) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value?.length < 8) error = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(value)) {
          error = 'Password must contain uppercase, lowercase, and number';
        }
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData?.password) error = 'Passwords do not match';
        break;
      case 'institutionName':
        if (!value?.trim()) error = 'Institution name is required';
        break;
      case 'studentId':
        if (!value?.trim()) error = 'Student ID is required';
        else if (value?.trim()?.length < 4) error = 'Student ID must be at least 4 characters';
        break;
      case 'academicYear':
        if (!value) error = 'Please select your academic year';
        break;
      case 'program':
        if (!value) error = 'Please select your program';
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors?.[name]) {
      let error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors?.[name]) {
      let error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e?.target;
    let error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData)?.forEach(key => {
      if (key !== 'termsAccepted' && key !== 'privacyAccepted') {
        let error = validateField(key, formData?.[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (!formData?.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms of service';
    }
    if (!formData?.privacyAccepted) {
      newErrors.privacyAccepted = 'You must accept the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await signup(formData.email, formData.password, {
        name: formData.fullName,
        role: 'student',
        course: formData.program,
        year: formData.academicYear
      });
      
      if (error) {
        setErrors({
          submit: error.message || 'Registration failed. Please try again.'
        });
        setIsSubmitting(false);
      } else {
        // Sign out the user so they need to log in manually
        await logout();
        
        setIsSubmitting(false);
        
        // Redirect to login page with success message
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please sign in with your email and password.',
            email: formData?.email,
            registrationSuccess: true
          } 
        });
      }
    } catch (error) {
      setErrors({
        submit: error.message || 'An error occurred during registration. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  const isFormValid = () => {
    return Object.keys(formData)?.every(key => {
      if (key === 'termsAccepted' || key === 'privacyAccepted') {
        return formData?.[key] === true;
      }
      return formData?.[key] && formData?.[key]?.toString()?.trim() !== '';
    }) && Object.keys(errors)?.every(key => !errors?.[key]);
  };

  const getCompletionPercentage = () => {
    const totalFields = 10;
    const completedFields = Object.keys(formData)?.filter(key => {
      if (key === 'termsAccepted' || key === 'privacyAccepted') {
        return formData?.[key] === true;
      }
      return formData?.[key] && formData?.[key]?.toString()?.trim() !== '';
    })?.length;
    return Math.round((completedFields / totalFields) * 100);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm md:text-base font-medium" style={{ color: 'var(--color-foreground)' }}>
            Form Completion
          </span>
          <span className="text-sm md:text-base font-semibold" style={{ color: 'var(--color-primary)' }}>
            {getCompletionPercentage()}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: 'var(--color-muted)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${getCompletionPercentage()}%`,
              background: 'var(--color-primary)'
            }}
          />
        </div>
      </div>
      <div className="space-y-4 md:space-y-5">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={errors?.fullName}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="student@university.edu"
          description="Use your institutional email address"
          value={formData?.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={errors?.email}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors?.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 md:top-10"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
            {formData?.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                    Password Strength
                  </span>
                  <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--color-muted)' }}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData?.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors?.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 md:top-10"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>
        </div>

        <Input
          label="Institution Name"
          type="text"
          name="institutionName"
          placeholder="Your university or college name"
          value={formData?.institutionName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={errors?.institutionName}
          required
        />

        <Input
          label="Student ID"
          type="text"
          name="studentId"
          placeholder="Your student identification number"
          value={formData?.studentId}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={errors?.studentId}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <Select
            label="Academic Year"
            placeholder="Select your year"
            options={academicYearOptions}
            value={formData?.academicYear}
            onChange={(value) => handleSelectChange('academicYear', value)}
            error={errors?.academicYear}
            required
          />

          <Select
            label="Program/Major"
            placeholder="Select your program"
            options={programOptions}
            value={formData?.program}
            onChange={(value) => handleSelectChange('program', value)}
            error={errors?.program}
            searchable
            required
          />
        </div>

        <div className="p-4 md:p-5 rounded-lg md:rounded-xl" style={{ background: 'var(--color-muted)' }}>
          <div className="flex gap-3 mb-3">
            <Icon name="Info" size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <div>
              <h4 className="text-sm md:text-base font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>
                Institutional Verification
              </h4>
              <p className="text-xs md:text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                Your account will be reviewed by our team to verify your institutional affiliation. You will receive an email notification once your account is approved, typically within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Checkbox
            name="termsAccepted"
            label="I agree to the Terms of Service"
            description="By checking this box, you agree to our terms and conditions"
            checked={formData?.termsAccepted}
            onChange={handleInputChange}
            error={errors?.termsAccepted}
            required
          />

          <Checkbox
            name="privacyAccepted"
            label="I accept the Privacy Policy"
            description="We respect your privacy and protect your personal information"
            checked={formData?.privacyAccepted}
            onChange={handleInputChange}
            error={errors?.privacyAccepted}
            required
          />
        </div>

        {errors?.submit && (
          <div className="p-3 md:p-4 rounded-lg flex items-start gap-3" style={{ 
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid var(--color-error)'
          }}>
            <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
            <p className="text-sm" style={{ color: 'var(--color-error)' }}>
              {errors?.submit}
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          disabled={!isFormValid() || isSubmitting}
          loading={isSubmitting}
          iconName="UserPlus"
          iconPosition="left"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm md:text-base" style={{ color: 'var(--color-muted-foreground)' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;