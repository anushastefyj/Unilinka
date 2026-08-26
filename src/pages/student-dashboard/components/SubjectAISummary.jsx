import React from 'react';
import Icon from './AppIcon';

// Mock AI Summary Generator
const getMockAISummary = (subject) => {
  return {
    overview: `This subject focuses on the foundational principles and practical applications of ${subject}. It is a core requirement that bridges theoretical concepts with real-world engineering problems.`,
    commonAreas: [
      `Understanding the core architecture and its limitations`,
      `Applying optimization techniques to improve performance`,
      `Analyzing case studies from recent industry developments`
    ]
  };
};

const SubjectAISummary = ({ subject }) => {
  const summary = getMockAISummary(subject);

  return (
    <div className="bg-[#1F4D3A] rounded-2xl p-6 mb-6 text-white relative overflow-hidden shadow-md">
      {/* Decorative Sparkles */}
      <div className="absolute -top-4 -right-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#EFE7D8] opacity-10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Sparkles" size={20} className="text-[#EFE7D8]" />
          <h4 className="text-sm font-bold tracking-wider uppercase text-[#EFE7D8]">AI Study Summary</h4>
        </div>
        
        <p className="text-sm leading-relaxed mb-4 text-[#FAF7F0] opacity-90">
          {summary.overview}
        </p>
        
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#EFE7D8] mb-2">Commonly Tested Areas:</p>
          <ul className="space-y-2">
            {summary.commonAreas.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-[#FAF7F0] opacity-90">
                <div className="mt-1">
                  <Icon name="ChevronRight" size={12} className="text-[#EFE7D8]" />
                </div>
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubjectAISummary;
