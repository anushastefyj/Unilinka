import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import RecentResourceCard from './RecentResourceCard';
import { supabase } from '../../../lib/supabase';

const QuestionPaperList = ({ subjects, selectedYear }) => {
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState({});

  const toggleSubject = async (subject) => {
    if (expandedSubject === subject) {
      setExpandedSubject(null);
      return;
    }
    
    setExpandedSubject(subject);
    
    if (!resources[subject]) {
      setLoading(prev => ({ ...prev, [subject]: true }));
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('status', 'approved')
          .eq('subject', subject)
          // Ideally there would be a resource_category='question_paper' filter here
          .order('created_at', { ascending: false });
          
        if (!error) {
          // Group by exam year. If no year is specified in the DB, we mock it based on upload date or randomly for demonstration.
          // In a real scenario, the DB should have an 'exam_year' column.
          const grouped = data.reduce((acc, r) => {
            // Mocking exam year extraction since it's not explicitly in the schema provided
            const yearMatch = r.title.match(/(20\d{2})/);
            const examYear = yearMatch ? yearMatch[0] : new Date(r.created_at).getFullYear().toString();
            
            if (!acc[examYear]) acc[examYear] = [];
            acc[examYear].push({
              id: r.id,
              title: r.title,
              description: r.description,
              subject: r.subject,
              academicYear: r.academic_year,
              fileType: r.file_type?.toUpperCase(),
              uploadDate: r.created_at,
              fileUrl: r.file_url,
            });
            return acc;
          }, {});

          setResources(prev => ({
            ...prev,
            [subject]: grouped
          }));
        }
      } catch (err) {
        console.error("Error fetching papers:", err);
      } finally {
        setLoading(prev => ({ ...prev, [subject]: false }));
      }
    }
  };

  if (!subjects || subjects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-[2rem] border border-[#E7E2D6]">
        <p className="text-[#5C5C5C]">No subjects found for this selection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subjects.map((subject, index) => {
        const isExpanded = expandedSubject === subject;
        const subjectGroupedResources = resources[subject] || {};
        const isLoading = loading[subject];
        
        const totalPapers = Object.values(subjectGroupedResources).flat().length;

        return (
          <div key={index} className="bg-white border border-[#E7E2D6] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
            
            <button 
              onClick={() => toggleSubject(subject)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#FAF7F0]/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A]">
                  <Icon name="FileText" size={20} />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-[#1C1C1C]">{subject}</h3>
                  <p className="text-xs text-[#5C5C5C] mt-0.5">
                    {totalPapers > 0 ? `${totalPapers} papers available` : 'Click to view previous year papers'}
                  </p>
                </div>
              </div>
              <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <Icon name="ChevronDown" size={20} />
              </div>
            </button>

            {isExpanded && (
              <div className="px-6 pb-6 pt-2 border-t border-[#E7E2D6] bg-[#FAF7F0]/30">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin text-[#1F4D3A]">
                      <Icon name="Loader" size={24} />
                    </div>
                  </div>
                ) : Object.keys(subjectGroupedResources).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#5C5C5C]">No question papers available for this subject yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6 mt-4">
                    {Object.entries(subjectGroupedResources)
                      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // Sort years descending
                      .map(([year, papers]) => (
                      <div key={year}>
                        <h4 className="text-sm font-bold text-[#1C1C1C] mb-3 flex items-center gap-2">
                          <Icon name="Calendar" size={16} className="text-[#1F4D3A]" />
                          {year} Examinations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {papers.map(paper => (
                            <RecentResourceCard key={paper.id} resource={paper} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionPaperList;
