import React from 'react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left side (Blue with Logo and Cloud Divider) */}
      <div className="relative w-full md:w-5/12 lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 min-h-[40vh] md:min-h-screen z-10" style={{ backgroundColor: '#135ea2' }}>
        
        {/* Content Container */}
        <div className="flex flex-col items-center justify-center text-white z-20 max-w-sm w-full text-center mt-8 md:mt-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-6 tracking-wide">Welcome to</h2>
          
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-[280px] md:max-w-xs shadow-xl relative">
            {/* Simple Unilinka Logo Representation */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#135ea2] rounded-full flex items-center justify-center mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h1 className="text-[#135ea2] text-2xl md:text-3xl font-bold tracking-wider mb-1">UNILINKA</h1>
              <p className="text-emerald-500 text-xs md:text-sm font-semibold tracking-wide">Learn Together, Grow Together.</p>
            </div>
          </div>
        </div>

        {/* Desktop Cloud Divider (Right edge) */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 w-[120px] pointer-events-none translate-x-[99%]">
          <svg preserveAspectRatio="none" viewBox="0 0 100 1000" className="w-full h-full text-white fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 0 C 80 50, 40 150, 60 250 C 90 350, 30 450, 70 550 C 100 650, 20 750, 60 850 C 90 950, 0 1000, 0 1000 L 100 1000 L 100 0 Z" />
          </svg>
        </div>

        {/* Mobile Cloud Divider (Bottom edge) */}
        <div className="md:hidden absolute left-0 right-0 bottom-0 h-[60px] pointer-events-none translate-y-[99%]">
          <svg preserveAspectRatio="none" viewBox="0 0 1000 100" className="w-full h-full text-white fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 0 C 100 60, 200 20, 300 70 C 400 90, 500 30, 600 60 C 700 80, 800 20, 900 70 C 950 90, 1000 0, 1000 0 L 1000 100 L 0 100 Z" />
          </svg>
        </div>
      </div>

      {/* Right side (White form area) */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 xl:px-32 relative z-0 mt-8 md:mt-0">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-12 text-[#333]">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
