import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { signup, logout, isAuthenticated, userData, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    academicYear: '',
    branch: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userData && !loading) {
      if (userData.role === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else {
        navigate('/faculty-dashboard', { replace: true });
      }
    }
  }, [navigate, isAuthenticated, userData, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (Object.values(formData).some(val => !val) || !termsAccepted) {
      setError('Please fill in all fields and accept the terms.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a student ID since the user's new layout didn't include one but the backend might need it
      // For now, generating a dummy one or you can adapt your backend to make it optional
      const generatedId = Math.random().toString(36).substring(2, 12).toUpperCase();

      const { data, error } = await signup(formData.email, formData.password, {
        name: formData.fullName,
        role: 'student',
        course: formData.branch,
        year: formData.academicYear,
        regNumber: generatedId
      });
      
      if (error) throw error;
      
      await logout(); // Ensure clean state before redirecting to login
      navigate('/login', { 
        state: { 
          message: 'Registration successful! You can now sign in.',
          email: formData.email,
          registrationSuccess: true
        } 
      });
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated && loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8]">Loading...</div>;
  }

  // Common input class matching the login page
  const inputClass = "w-full bg-[#f4f6f8] text-gray-900 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 transition-colors placeholder-gray-400 font-medium text-sm";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <>
      <Helmet>
        <title>Sign Up - Unilinka</title>
      </Helmet>
      
      {/* Outer background matching the login page */}
      <div className="min-h-screen bg-[#fdfaf2] flex items-center justify-center p-4 sm:p-8 font-sans">
        
        {/* Main White Card Container */}
        <div className="w-full max-w-[1100px] bg-white rounded-[2rem] sm:rounded-[3rem] shadow-sm flex flex-col-reverse md:flex-row overflow-hidden border border-gray-100 relative">
          
          {/* Left Side: Form */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 md:py-12">
            
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2b3c] mb-4">
                Sign up
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Hello, friend! Welcome to Unilinka - the academic platform you can trust. Let's get started!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto w-full">
              
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Year & Branch Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className={selectClass}
                  >
                    <option value="" disabled>Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Branch"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Confirm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={inputClass}
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              {/* Accept Box */}
              <div className="flex items-center justify-center pt-2 pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-[#2d6a4f] border-[#2d6a4f]' : 'bg-white border-gray-300'}`}>
                      {termsAccepted && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs font-medium">I accept the Terms and Conditions</span>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2d6a4f] text-white font-medium rounded-full py-3.5 hover:bg-[#1b4332] transition-colors disabled:opacity-70 text-sm tracking-wide"
                >
                  {isSubmitting ? 'Wait...' : 'Let\'s start!'}
                </button>
              </div>

            </form>

            <div className="mt-8 text-center text-xs font-medium text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2d6a4f] hover:text-[#1b4332] font-bold transition-colors">
                Log in
              </Link>
            </div>

          </div>

          {/* Right Side: Illustration */}
          <div className="w-full h-48 sm:h-64 md:w-1/2 md:h-full min-h-[300px] md:min-h-full flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-sm aspect-square relative">
              <img 
                src="/signup-wave.jpg" 
                alt="Person waving from green circle" 
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
          
        </div>
        
      </div>
    </>
  );
};

export default StudentRegistration;