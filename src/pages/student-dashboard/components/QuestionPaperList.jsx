import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import RecentResourceCard from './RecentResourceCard';
import { supabase } from '../../../lib/supabase';
import ReportIssueModal from '../../../components/ui/ReportIssueModal';
import JSZip from 'jszip';
import FrequentlyAskedPanel from './FrequentlyAskedPanel';
import SubjectAISummary from './SubjectAISummary';
import { getSubjectQueryList } from '../../../config/curriculum';

const QuestionPaperList = ({ subjects, selectedYear }) => {
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState({});
  const [reportSubject, setReportSubject] = useState(null);
  const [isZipping, setIsZipping] = useState({});

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
        const querySubjects = getSubjectQueryList(subject);
        
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('status', 'approved')
          .in('subject', querySubjects)
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

  const handleBulkDownload = async (subject, subjectResources) => {
    if (!subjectResources || subjectResources.length === 0) return;
    
    setIsZipping(prev => ({ ...prev, [subject]: true }));
    
    try {
      const zip = new JSZip();
      
      // Fetch all files
      const filePromises = subjectResources.map(async (resource) => {
        if (!resource.fileUrl) return null;
        try {
          const response = await fetch(resource.fileUrl);
          const blob = await response.blob();
          const extension = resource.fileType?.toLowerCase() || 'pdf';
          const filename = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
          zip.file(filename, blob);
          return true;
        } catch (e) {
          console.error(`Failed to fetch ${resource.title}`, e);
          return null;
        }
      });
      
      await Promise.all(filePromises);
      
      // Generate ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${subject.replace(/[^a-z0-9]/gi, '_')}_Question_Papers.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Bulk download failed", err);
      alert("Failed to create ZIP file. Please try downloading files individually.");
    } finally {
      setIsZipping(prev => ({ ...prev, [subject]: false }));
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
    <>
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
                <div className="p-6 sm:p-8 border-t border-[#E7E2D6] bg-[#FAF7F0]/30 grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* Left Column: AI & Analysis */}
                  <div className="lg:col-span-2">
                    <SubjectAISummary subject={subject} />
                    <FrequentlyAskedPanel subject={subject} />
                  </div>
                  
                  {/* Right Column: Question Papers List */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-bold text-[#1C1C1C] font-serif flex items-center gap-2">
                        <Icon name="FileText" size={18} className="text-[#1F4D3A]" />
                        Question Papers
                      </h4>
                      {subjectResources.length > 1 && (() => {
                        const estimatedSizeMB = (subjectResources.length * 1.8).toFixed(1);
                        return (
                          <button
                            onClick={() => handleBulkDownload(subject, subjectResources)}
                            disabled={isZipping[subject]}
                            className="text-sm font-bold bg-[#1F4D3A] text-white hover:bg-[#2E6B4F] rounded-xl px-4 py-2 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {isZipping[subject] ? (
                              <Icon name="Loader" size={16} className="animate-spin" />
                            ) : (
                              <Icon name="DownloadCloud" size={16} />
                            )}
                            Download All • {subjectResources.length} files • {estimatedSizeMB} MB
                          </button>
                        );
                      })()}
                    </div>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin text-[#1F4D3A]">
                          <Icon name="Loader" size={24} />
                        </div>
                      </div>
                    ) : subjectResources.length === 0 ? (
                      <div className="text-center py-10 bg-white rounded-2xl border border-[#E7E2D6]">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-400 mx-auto mb-3">
                          <Icon name="FileQuestion" size={24} />
                        </div>
                        <p className="text-sm font-bold text-[#1C1C1C] mb-1">No question papers found.</p>
                        <p className="text-xs text-[#5C5C5C] mb-4">We don't have any previous year papers for this subject yet.</p>
                        <button 
                          onClick={() => setReportSubject(subject)}
                          className="text-sm font-bold text-[#1F4D3A] border border-[#1F4D3A] rounded-xl px-4 py-2 hover:bg-[#1F4D3A] hover:text-white transition-colors inline-flex items-center gap-2"
                        >
                          <Icon name="Plus" size={16} />
                          Request this resource
                        </button>
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
      
      {reportSubject && (
        <ReportIssueModal 
          subjectContext={{ subject: reportSubject }} 
          onClose={() => setReportSubject(null)} 
        />
      )}
    </>
  );
};

export default QuestionPaperList;
