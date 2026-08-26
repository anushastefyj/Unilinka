import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import AuthLayout from '../../../components/ui/AuthLayout';

const LoginForm = ({ initialEmail = '' }) => {
  const navigate = useNavigate();
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    studentId: '',
    mobileNumber: '',
    otp: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData?.email)) newErrors.email = 'Valid email required';

    if (!formData?.studentId?.trim()) newErrors.studentId = 'Registration ID is required';
    else if (!/^[a-zA-Z0-9]{10}$/.test(formData?.studentId?.trim())) newErrors.studentId = 'Must be exactly 10 characters';

    if (!formData?.mobileNumber?.trim()) newErrors.mobileNumber = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData?.mobileNumber?.trim())) newErrors.mobileNumber = 'Must be exactly 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    if ((name === 'mobileNumber' || name === 'otp') && value && !/^\d*$/.test(value)) return; 
    if ((name === 'studentId' || name === 'mobileNumber') && value.length > 10) return;
    if (name === 'otp' && value.length > 6) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!validateStep1()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await sendPhoneOtp(formData.mobileNumber);
      if (error) throw error;
      setStep(2);
    } catch (error) {
      if (error.message.includes('sms provider')) {
        setErrors({ submit: 'SMS Provider is not configured in Supabase. Please configure it to send real OTPs.' });
      } else {
        setErrors({ submit: error.message || 'Failed to send OTP.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!formData.otp || formData.otp.length < 6) {
      setErrors({ otp: 'Please enter the 6-digit OTP' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await verifyPhoneOtp(formData.mobileNumber, formData.otp);
      if (error) throw error;
      // Success! The redirect will be handled by the parent Login/index.jsx
    } catch (error) {
      setErrors({ submit: error.message || 'Invalid OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <Input
            type="text"
            name="studentId"
            label="Registration ID"
            placeholder="10-digit ID"
            value={formData?.studentId}
            onChange={handleInputChange}
            error={errors?.studentId}
            required
            disabled={isLoading}
            variant="underlined"
          />
          <Input
            type="text"
            name="mobileNumber"
            label="Mobile Number"
            placeholder="10-digit Phone Number"
            value={formData?.mobileNumber}
            onChange={handleInputChange}
            error={errors?.mobileNumber}
            required
            disabled={isLoading}
            variant="underlined"
          />
          <Input
            type="email"
            name="email"
            label="Mail"
            placeholder="student@university.edu"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
            variant="underlined"
          />
          
          <div className="flex items-center gap-2 mt-4 text-[#333]">
            <input type="checkbox" id="terms" className="rounded text-[#135ea2] focus:ring-[#135ea2]" required />
            <label htmlFor="terms" className="text-xs md:text-sm">
              By Logging In. I Agree with <a href="#" className="text-[#135ea2] font-semibold">Terms & Conditions</a>
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
              type="button"
              onClick={() => navigate('/student-registration')}
              className="px-8 py-2 md:px-10 md:py-2.5 rounded-full border border-gray-400 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Sign Up
            </button>
            <button
              type="submit"
              className="px-8 py-2 md:px-10 md:py-2.5 rounded-full bg-[#135ea2] text-white font-semibold shadow-md hover:bg-[#0f4b82] transition-colors flex items-center justify-center min-w-[120px]"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Sign In'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-4">
              We've sent a 6-digit code to <br/>
              <span className="font-semibold text-gray-800">{formData.mobileNumber}</span>
            </p>
          </div>
          <Input
            type="text"
            name="otp"
            label="One-Time Password (OTP)"
            placeholder="Enter 6-digit code"
            value={formData?.otp}
            onChange={handleInputChange}
            error={errors?.otp}
            required
            disabled={isLoading}
            variant="underlined"
          />
          
          {errors?.submit && (
            <div className="p-3 rounded-lg flex items-start gap-3 bg-red-50 border border-red-200">
              <Icon name="AlertCircle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{errors?.submit}</p>
            </div>
          )}
          
          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              type="submit"
              className="w-full max-w-[200px] py-2.5 rounded-full bg-[#135ea2] text-white font-semibold shadow-md hover:bg-[#0f4b82] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            
            <button
              type="button"
              onClick={() => { setStep(1); setErrors({}); }}
              className="text-sm font-medium text-[#135ea2] hover:underline mt-2"
              disabled={isLoading}
            >
              Back to Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;