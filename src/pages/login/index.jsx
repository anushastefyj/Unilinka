import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userData, loading, login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState(
    location.state?.registrationSuccess ? location.state.message : null
  );

  useEffect(() => {
    if (isAuthenticated && userData && !loading) {
      const dashboardRoutes = {
        student: '/student-dashboard',
        faculty: '/faculty-dashboard',
        admin: '/faculty-dashboard'
      };
      navigate(dashboardRoutes[userData.role] || '/student-dashboard');
    }
  }, [navigate, isAuthenticated, userData, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccessMessage(null);

    try {
      const { error } = await login(formData.email, formData.password);
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated && loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8]">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Login - Unilinka</title>
      </Helmet>
      
      {/* Outer background similar to the image's edges */}
      <div className="min-h-screen bg-[#fdfaf2] flex items-center justify-center p-4 sm:p-8 font-sans">
        
        {/* Main White Card Container */}
        <div className="w-full max-w-[1000px] min-h-[600px] sm:h-[650px] bg-white rounded-[2rem] sm:rounded-[3rem] shadow-sm flex flex-col md:flex-row overflow-hidden border border-gray-100 relative">
          
          {/* Top/Left Side: Illustration */}
          <div className="w-full h-48 sm:h-64 md:w-1/2 md:h-full relative border-b-8 md:border-b-0 md:border-r-8 border-[#2d6a4f]">
            <img 
              src="/login-peek.jpg" 
              alt="Person peeking" 
              className="absolute inset-0 w-full h-full object-cover object-top md:object-left"
            />
          </div>

          {/* Bottom/Right Side: Form */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-16 py-8 md:py-12">
            
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2b3c] mb-4">
                Log in
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Hello, friend! Welcome back to Unilinka - the academic platform you can trust. Let's get in touch!
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-[#2d6a4f] text-sm font-medium text-center">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto w-full">
              
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#f4f6f8] text-gray-900 rounded-full py-3.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 transition-colors placeholder-gray-400 font-medium text-sm"
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#f4f6f8] text-gray-900 rounded-full py-3.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 transition-colors placeholder-gray-400 font-medium text-sm"
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2d6a4f] text-white font-medium rounded-full py-3.5 hover:bg-[#1b4332] transition-colors disabled:opacity-70 text-sm tracking-wide"
                >
                  {isSubmitting ? 'Wait...' : 'Let\'s start!'}
                </button>
              </div>

            </form>
            
            {/* Social Logins */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button className="w-10 h-10 rounded-full bg-[#f4f6f8] flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#f4f6f8] flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </button>
            </div>

            <div className="mt-8 text-center text-xs font-medium text-gray-500">
              Don't have an account?{' '}
              <Link to="/student-registration" className="text-[#2d6a4f] hover:text-[#1b4332] font-bold transition-colors">
                Sign up
              </Link>
            </div>

          </div>
        </div>
        
      </div>
    </>
  );
};

export default Login;