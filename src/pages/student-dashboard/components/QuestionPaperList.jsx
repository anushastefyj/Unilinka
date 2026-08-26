import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import RecentResourceCard from './RecentResourceCard';
import { supabase } from '../../../lib/supabase';
import FrequentlyAskedPanel from './FrequentlyAskedPanel';
import SubjectAISummary from './SubjectAISummary';

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
    
    // Track Last Visited Subject
    if (subject) {
      localStorage.setItem('unilinka_last_visited', JSON.stringify({
        subject: subject,
        timestamp: Date.now()
      }));
    }
    
    if (!resources[subject]) {
      setLoading(prev => ({ ...prev, [subject]: true }));
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('status', 'approved')
          .eq('subject', subject)
          .like('title', '%Paper%') // Basic filter for demo
          .order('created_at', { ascending: false });
          
        if (!error) {
          setResources(prev => ({
            ...prev,
            [subject]: data.map(r => ({
              id: r.id,
              title: r.title,
              description: r.description,
              subject: r.subject,
              academicYear: r.academic_year,
              fileType: r.file_type?.toUpperCase(),
              uploadDate: r.created_at,
              fileUrl: r.file_url,
            }))
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
        const subjectResources = resources[subject] || [];
        const isLoading = loading[subject];

        return (
          <div key={index} className="bg-white border border-[#E7E2D6] rounded-[2rem] overflow-hidden transition-all duration-300 shadow-sm">
            
            <div 
              onClick={() => toggleSubject(subject)}
              className="w-full p-6 sm:px-8 sm:py-6 cursor-pointer hover:bg-[#FAF7F0]/50 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A] flex-shrink-0">
                  <Icon name="FileText" size={24} />
                </div>
                <div className="text-left min-w-0">
                  <h3 className="text-lg font-bold text-[#1C1C1C] truncate pr-2">{subject}</h3>
                  <p className="text-sm text-[#5C5C5C] mt-0.5">
                    {subjectResources.length > 0 ? `${subjectResources.length} papers` : 'View papers'}
                  </p>
                </div>
              </div>
              <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <Icon name="ChevronDown" size={24} />
              </div>
            </div>

            {isExpanded && (
              <div className="p-6 sm:p-8 border-t border-[#E7E2D6] bg-[#FAF7F0]/30 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: AI & Analysis */}
                <div className="lg:col-span-1">
                  <SubjectAISummary subject={subject} />
                  <FrequentlyAskedPanel subject={subject} />
                </div>
                
                {/* Right Column: Question Papers List */}
                <div className="lg:col-span-2">
                  <h4 className="text-base font-bold text-[#1C1C1C] font-serif mb-4 flex items-center gap-2">
                    <Icon name="FileText" size={18} className="text-[#1F4D3A]" />
                    Question Papers
                  </h4>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin text-[#1F4D3A]">
                        <Icon name="Loader" size={24} />
                      </div>
                    </div>
                  ) : subjectResources.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-2xl border border-[#E7E2D6]">
                      <p className="text-sm text-[#5C5C5C]">No question papers available for this subject yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {subjectResources.map(resource => (
                        <RecentResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionPaperList;
