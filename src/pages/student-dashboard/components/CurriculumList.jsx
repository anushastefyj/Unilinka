import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import RecentResourceCard from './RecentResourceCard';
import { supabase } from '../../../lib/supabase';

// Mock topics since they aren't in the DB currently
const getMockTopics = (subject) => [
  `Introduction to ${subject}`,
  `Core Principles of ${subject}`,
  `Advanced Concepts`,
  `Practical Applications`,
  `Previous Year Case Studies`
];

const CurriculumList = ({ subjects, selectedYear }) => {
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState({});
  
  // Progress State mapping subject -> array of checked topic indices
  const [progress, setProgress] = useState({});

  useEffect(() => {
    try {
      const savedProgress = JSON.parse(localStorage.getItem('unilinka_progress') || '{}');
      setProgress(savedProgress);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleTopic = (subject, topicIndex) => {
    const currentSubjectProgress = progress[subject] || [];
    let newProgress;
    
    if (currentSubjectProgress.includes(topicIndex)) {
      newProgress = currentSubjectProgress.filter(i => i !== topicIndex);
    } else {
      newProgress = [...currentSubjectProgress, topicIndex];
    }
    
    const updatedState = { ...progress, [subject]: newProgress };
    setProgress(updatedState);
    localStorage.setItem('unilinka_progress', JSON.stringify(updatedState));
  };

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
    
    // Fetch resources if not already fetched
    if (!resources[subject]) {
      setLoading(prev => ({ ...prev, [subject]: true }));
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('status', 'approved')
          .eq('subject', subject)
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
        console.error("Error fetching resources for subject:", err);
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
    <div className="space-y-6">
      {subjects.map((subject, index) => {
        const isExpanded = expandedSubject === subject;
        const subjectResources = resources[subject] || [];
        const isLoading = loading[subject];
        
        const topics = getMockTopics(subject);
        const completedTopicsCount = (progress[subject] || []).length;
        const progressPercentage = Math.round((completedTopicsCount / topics.length) * 100);

        return (
          <div key={index} className="bg-white border border-[#E7E2D6] rounded-[2rem] overflow-hidden transition-all duration-300 shadow-sm">
            
            {/* Header Row with Progress */}
            <div 
              onClick={() => toggleSubject(subject)}
              className="w-full p-6 sm:px-8 sm:py-6 cursor-pointer hover:bg-[#FAF7F0]/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A] flex-shrink-0">
                    <Icon name="BookOpen" size={24} />
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className="text-lg font-bold text-[#1C1C1C] truncate pr-2">{subject}</h3>
                    <p className="text-sm text-[#5C5C5C] mt-0.5">
                      {subjectResources.length > 0 ? `${subjectResources.length} resources` : 'View resources'}
                    </p>
                  </div>
                </div>
                <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  <Icon name="ChevronDown" size={24} />
                </div>
              </div>
              
              {/* Progress Bar Mini */}
              <div className="pl-16 pr-2 sm:pr-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#5C5C5C]">Syllabus Coverage</span>
                  <span className="text-xs font-bold text-[#1F4D3A]">{completedTopicsCount}/{topics.length} Covered</span>
                </div>
                <div className="w-full h-2 bg-[#E7E2D6] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1F4D3A] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-[#E7E2D6] bg-[#FAF7F0]/30 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#E7E2D6]">
                
                {/* Syllabus Checklist */}
                <div className="p-6 sm:p-8 lg:col-span-1 bg-white/50">
                  <h4 className="text-base font-bold text-[#1C1C1C] font-serif mb-4 flex items-center gap-2">
                    <Icon name="CheckSquare" size={18} className="text-[#1F4D3A]" />
                    Syllabus Topics
                  </h4>
                  <div className="space-y-3">
                    {topics.map((topic, i) => {
                      const isChecked = (progress[subject] || []).includes(i);
                      return (
                        <div 
                          key={i} 
                          className="flex items-start gap-3 cursor-pointer group"
                          onClick={() => toggleTopic(subject, i)}
                        >
                          <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isChecked ? 'bg-[#1F4D3A] border-[#1F4D3A] text-white' : 'border-[#E7E2D6] group-hover:border-[#1F4D3A]'
                          }`}>
                            {isChecked && <Icon name="Check" size={12} strokeWidth={3} />}
                          </div>
                          <span className={`text-sm transition-colors leading-snug select-none ${
                            isChecked ? 'text-[#5C5C5C] line-through opacity-70' : 'text-[#1C1C1C] group-hover:text-[#1F4D3A]'
                          }`}>
                            {topic}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resources */}
                <div className="p-6 sm:p-8 lg:col-span-2">
                  <h4 className="text-base font-bold text-[#1C1C1C] font-serif mb-4 flex items-center gap-2">
                    <Icon name="FileText" size={18} className="text-[#1F4D3A]" />
                    Resources
                  </h4>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin text-[#1F4D3A]">
                        <Icon name="Loader" size={24} />
                      </div>
                    </div>
                  ) : subjectResources.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-[#5C5C5C]">No resources available for this subject yet.</p>
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

export default CurriculumList;
