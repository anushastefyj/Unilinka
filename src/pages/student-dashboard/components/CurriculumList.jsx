import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import RecentResourceCard from './RecentResourceCard';
import { supabase } from '../../../lib/supabase';

const CurriculumList = ({ subjects, selectedYear }) => {
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState({});

  const toggleSubject = async (subject) => {
    if (expandedSubject === subject) {
      setExpandedSubject(null);
      return;
    }
    
    setExpandedSubject(subject);
    
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
              uploaderId: r.uploader_id
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
      <div className="text-center py-12 bg-white rounded-3xl border border-[#E7E2D6]">
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
          <div key={index} className="bg-white border border-[#E7E2D6] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
            
            {/* Header Row */}
            <button 
              onClick={() => toggleSubject(subject)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#FAF7F0]/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A]">
                  <Icon name="BookOpen" size={20} />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-[#1C1C1C]">{subject}</h3>
                  <p className="text-xs text-[#5C5C5C] mt-0.5">
                    {subjectResources.length > 0 ? `${subjectResources.length} resources available` : 'Click to view resources'}
                  </p>
                </div>
              </div>
              <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <Icon name="ChevronDown" size={20} />
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-6 pb-6 pt-2 border-t border-[#E7E2D6] bg-[#FAF7F0]/30">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin text-[#1F4D3A]">
                      <Icon name="Loader" size={24} />
                    </div>
                  </div>
                ) : subjectResources.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#5C5C5C]">No resources uploaded yet for this subject.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {subjectResources.map(resource => (
                      <RecentResourceCard key={resource.id} resource={resource} />
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

export default CurriculumList;
