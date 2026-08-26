import React from 'react';
import Icon from '../../../components/AppIcon';

const HeroWelcomeCard = ({ userName, onBrowsePapers, onBrowseCurriculum }) => {
  return (
    <section className="bg-white rounded-[2rem] p-8 lg:p-12 border border-[#E7E2D6] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
      <div className="relative z-10 max-w-xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-4 font-serif">
          Welcome back, {userName || 'Student'}
        </h1>
        <p className="text-[#5C5C5C] mb-8 text-base leading-relaxed">
          Download previous year question papers, notes, and curriculum resources — PDFs, Word docs, and presentations — for any year, branch, and semester.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={onBrowsePapers}
            className="w-full sm:w-auto bg-[#1F4D3A] hover:bg-[#2E6B4F] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Icon name="FileText" size={18} />
            Browse Question Papers
          </button>
          <button 
            onClick={onBrowseCurriculum}
            className="w-full sm:w-auto bg-[#FAF7F0] hover:bg-[#EFE7D8] text-[#1F4D3A] border border-[#E7E2D6] px-8 py-3.5 rounded-full font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Icon name="BookOpen" size={18} />
            Browse Curriculum
          </button>
        </div>
      </div>
      
      {/* Decorative Illustration */}
      <div className="hidden md:block w-48 h-48 relative z-10 mr-8 mt-6 md:mt-0">
         <img 
          src="/signup-wave.jpg" 
          alt="Student Wave" 
          className="w-full h-full object-cover rounded-full shadow-sm border-4 border-[#FAF7F0]" 
        />
      </div>
    </section>
  );
};

export default HeroWelcomeCard;
