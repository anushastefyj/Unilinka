import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = ({ initialEmail = '' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.email?.trim()) newErrors.email = 'Mail is required';
    else if (!validateEmail(formData?.email)) newErrors.email = 'Valid mail required';

    if (!formData?.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await login(formData.email, formData.password);
      if (error) throw error;
      // Success! The redirect will be handled by the parent Login/index.jsx
    } catch (error) {
      setErrors({ submit: error.message || 'Invalid email or password.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          label="Mail"
          placeholder="Enter your mail"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
          variant="underlined"
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
            variant="underlined"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 text-gray-400"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
        </div>
        
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
            {isLoading ? 'Wait...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;