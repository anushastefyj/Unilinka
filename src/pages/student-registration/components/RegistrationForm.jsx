import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
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
    studentId: '',
    mobileNumber: '',
    academicYear: '',
    program: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
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
    { value: 'mathematics', label: 'Mathematics' }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value?.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!value?.trim()) error = 'Mail is required';
        else if (!validateEmail(value)) error = 'Invalid mail format';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value?.length < 8) error = 'Min 8 characters required';
        break;
      case 'confirmPassword':
        if (!value) error = 'Confirm password';
        else if (value !== formData?.password) error = 'Passwords mismatch';
        break;
      case 'studentId':
        if (!value?.trim()) error = 'ID required';
        else if (!/^\d{10}$/.test(value?.trim())) error = 'Must be 10 digits';
        break;
      case 'mobileNumber':
        if (!value?.trim()) error = 'Mobile required';
        else if (!/^\d{10}$/.test(value?.trim())) error = 'Must be 10 digits';
        break;
      case 'academicYear':
        if (!value) error = 'Select year';
        break;
      case 'program':
        if (!value) error = 'Select program';
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    if ((name === 'studentId' || name === 'mobileNumber') && value && !/^\d*$/.test(value)) return; 
    if ((name === 'studentId' || name === 'mobileNumber') && value.length > 10) return;
    
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));

    if (errors?.[name]) {
      let error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      let error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData)?.forEach(key => {
      if (key !== 'termsAccepted') {
        let error = validateField(key, formData?.[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (!formData?.termsAccepted) {
      newErrors.termsAccepted = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await signup(formData.email, formData.password, {
        name: formData.fullName,
        role: 'student',
        course: formData.program,
        year: formData.academicYear,
        regNumber: formData.studentId,
        phoneNumber: formData.mobileNumber
      });
      
      if (error) {
        setErrors({ submit: error.message || 'Registration failed.' });
        setIsSubmitting(false);
      } else {
        await logout();
        setIsSubmitting(false);
        navigate('/login', { 
          state: { 
            message: 'Registration successful! You can now sign in using your new details.',
            email: formData?.email,
            registrationSuccess: true
          } 
        });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred.' });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Name"
          type="text"
          name="fullName"
          placeholder="Enter your name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          variant="underlined"
          required
        />
        <Input
          label="Mail"
          type="email"
          name="email"
          placeholder="Enter your mail"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          variant="underlined"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Mobile Number"
          type="text"
          name="mobileNumber"
          placeholder="10-digit number"
          value={formData?.mobileNumber}
          onChange={handleInputChange}
          error={errors?.mobileNumber}
          variant="underlined"
          required
        />
        <Input
          label="Student ID"
          type="text"
          name="studentId"
          placeholder="Enter your student ID"
          value={formData?.studentId}
          onChange={handleInputChange}
          error={errors?.studentId}
          variant="underlined"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            variant="underlined"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 text-gray-400"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Enter your confirm Password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            variant="underlined"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-8 text-gray-400"
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Select
          label="Year"
          placeholder="Select year"
          options={academicYearOptions}
          value={formData?.academicYear}
          onChange={(value) => handleSelectChange('academicYear', value)}
          error={errors?.academicYear}
          variant="underlined"
          required
        />
        <Select
          label="Program"
          placeholder="Select program"
          options={programOptions}
          value={formData?.program}
          onChange={(value) => handleSelectChange('program', value)}
          error={errors?.program}
          variant="underlined"
          required
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-[#333]">
        <input 
          type="checkbox" 
          id="termsReg" 
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleInputChange}
          className="rounded text-[#135ea2] focus:ring-[#135ea2]" 
          required 
        />
        <label htmlFor="termsReg" className="text-xs md:text-sm">
          By Signing Up. I Agree with <a href="#" className="text-[#135ea2] font-semibold">Terms & Conditions</a>
        </label>
      </div>

      {errors?.submit && (
        <div className="p-3 rounded-lg flex items-start gap-3 bg-red-50 border border-red-200">
          <Icon name="AlertCircle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{errors?.submit}</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 pt-6">
        <button
          type="submit"
          className="px-8 py-2 md:px-10 md:py-2.5 rounded-full bg-[#135ea2] text-white font-semibold shadow-md hover:bg-[#0f4b82] transition-colors flex items-center justify-center min-w-[120px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Wait...' : 'Sign Up'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="px-8 py-2 md:px-10 md:py-2.5 rounded-full border border-gray-400 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;