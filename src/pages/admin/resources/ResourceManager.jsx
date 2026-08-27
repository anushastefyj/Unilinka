import React, { useState } from 'react';
import { Upload, Search, Filter, MoreVertical, FileText, CheckCircle, Sparkles, AlertTriangle, X, Clock, Edit3, Check } from 'lucide-react';

const ResourceManager = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  
  const [resources, setResources] = useState([
    { id: 1, name: '2023_Data_Structures_MidSem.pdf', type: 'Question Paper', subject: 'Data Structures', branch: 'CSE', year: '2', semester: '3', date: '2023-10-15', status: 'Published' },
    { id: 2, name: 'OS_Memory_Management_Slides.pptx', type: 'Slides', subject: 'Operating Systems', branch: 'CSE', year: '2', semester: '4', date: '2023-11-02', status: 'Published' },
    { id: 3, name: 'Math_I_Full_Syllabus.pdf', type: 'Syllabus', subject: 'Engineering Mathematics I', branch: 'Common', year: '1', semester: '1', date: '2023-08-10', status: 'In Review' },
    { id: 4, name: 'Draft_Physics_Notes.docx', type: 'Notes', subject: 'Applied Physics', branch: 'ECE', year: '1', semester: '2', date: '2023-11-10', status: 'Draft' },
  ]);

  const handleSimulateUpload = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setDuplicateWarning(true);
      setAiSuggested(true);
    }, 1500);
  };

  const handleStatusChange = (id, newStatus) => {
    setResources(resources.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filteredResources = resources.filter(r => activeTab === 'All' || r.status === activeTab);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">Resource Library</h1>
          <p className="text-gray-500 mt-1">Manage uploads, view version history, and organize files.</p>
        </div>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="bg-[#1F4D3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#153a2b] transition-colors flex items-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          {showUpload ? 'Cancel Upload' : 'Upload Files'}
        </button>
      </div>

      {showUpload && (
        <div className="bg-white border border-[#1F4D3A]/20 p-6 rounded-xl shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-[#1F4D3A] mb-4">Upload New Resources</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Drag & Drop Zone */}
            <div 
              className="border-2 border-dashed border-[#1F4D3A]/30 bg-[#FAF7F0]/50 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-[#FAF7F0] transition-colors cursor-pointer min-h-[250px] relative overflow-hidden"
              onClick={handleSimulateUpload}
            >
              {isAnalyzing ? (
                <div className="flex flex-col items-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-[#1F4D3A] mb-3 animate-spin-slow" />
                  <p className="font-medium text-[#1F4D3A]">AI is analyzing document...</p>
                  <p className="text-xs text-[#1F4D3A]/70 mt-1">Extracting metadata and checking duplicates</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-[#1F4D3A]/60 mb-3" />
                  <p className="font-medium text-gray-700">Drag & drop files here</p>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Supports PDF, DOCX, PPTX (Max 50MB)</p>
                  <button className="px-4 py-2 border border-[#1F4D3A]/20 rounded-lg text-sm font-medium text-[#1F4D3A] bg-white hover:bg-[#FAF7F0] transition-colors">
                    Browse Files (Click to simulate)
                  </button>
                </>
              )}
            </div>

            {/* Metadata Form */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h4 className="font-medium text-gray-900">Apply Metadata to Batch</h4>
                {aiSuggested && (
                  <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <Sparkles className="w-3 h-3 mr-1" /> AI Auto-Tagged
                  </span>
                )}
              </div>
              
              {duplicateWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start text-amber-800">
                  <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold">Possible Duplicate Detected</h5>
                    <p className="text-xs mt-1">This looks 92% similar to '2023_Data_Structures_MidSem.pdf'. Are you sure you want to upload?</p>
                    <div className="mt-2 space-x-2">
                      <button className="text-xs bg-white border border-amber-200 px-3 py-1 rounded font-medium hover:bg-amber-100">Upload Anyway</button>
                      <button className="text-xs bg-amber-800 text-white px-3 py-1 rounded font-medium hover:bg-amber-900" onClick={() => setDuplicateWarning(false)}>Cancel Upload</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Resource Type</label>
                  <select className={`w-full text-sm rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A] ${aiSuggested ? 'bg-emerald-50 border-emerald-200' : 'border-gray-300'}`} defaultValue={aiSuggested ? 'Question Paper' : ''}>
                    <option>Select Type...</option>
                    <option value="Question Paper">Question Paper</option>
                    <option>Notes</option>
                    <option>Syllabus</option>
                    <option>Slides</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
                  <select className={`w-full text-sm rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A] ${aiSuggested ? 'bg-emerald-50 border-emerald-200' : 'border-gray-300'}`} defaultValue={aiSuggested ? 'CSE' : ''}>
                    <option>Select Branch...</option>
                    <option value="CSE">CSE</option>
                    <option>ECE</option>
                    <option>MECH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                  <select className={`w-full text-sm rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A] ${aiSuggested ? 'bg-emerald-50 border-emerald-200' : 'border-gray-300'}`} defaultValue={aiSuggested ? '2nd Year' : ''}>
                    <option>Select Year...</option>
                    <option>1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                  <select className={`w-full text-sm rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A] ${aiSuggested ? 'bg-emerald-50 border-emerald-200' : 'border-gray-300'}`} defaultValue={aiSuggested ? 'Data Structures' : ''}>
                    <option>Select Subject...</option>
                    <option value="Data Structures">Data Structures</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-3 border-t border-gray-100">
                <button className="flex-1 bg-white border border-[#1F4D3A] text-[#1F4D3A] py-2 rounded-lg text-sm font-bold hover:bg-[#FAF7F0] transition-colors">
                  Save as Draft
                </button>
                <button className="flex-1 bg-[#EFE7D8] text-[#1F4D3A] py-2 rounded-lg text-sm font-bold hover:bg-[#e0d6c3] transition-colors">
                  Submit for Review
                </button>
                <button className="flex-1 bg-[#1F4D3A] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#153a2b] transition-colors">
                  Publish Directly
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Table Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 bg-gray-50/50">
          {['All', 'Draft', 'In Review', 'Published'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-[#1F4D3A] text-[#1F4D3A]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 focus:border-[#1F4D3A]"
              />
            </div>
            <button className="flex items-center text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 bg-white transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Showing {filteredResources.length} resources
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-600 sticky top-0 border-b border-gray-200 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-semibold">File Name</th>
                <th className="px-6 py-3 font-semibold">Metadata</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Date Added</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResources.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{res.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{res.subject}</span>
                      <span className="text-xs text-gray-500">{res.branch} • Year {res.year} Sem {res.semester}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium border border-gray-200">
                      {res.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{res.date}</td>
                  <td className="px-6 py-4">
                    {res.status === 'Published' && (
                      <span className="flex items-center text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded w-max">
                        <CheckCircle className="w-3 h-3 mr-1" /> Published
                      </span>
                    )}
                    {res.status === 'In Review' && (
                      <span className="flex items-center text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded w-max">
                        <Clock className="w-3 h-3 mr-1" /> In Review
                      </span>
                    )}
                    {res.status === 'Draft' && (
                      <span className="flex items-center text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded w-max">
                        <Edit3 className="w-3 h-3 mr-1" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {res.status === 'In Review' ? (
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleStatusChange(res.id, 'Published')} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded transition-colors" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleStatusChange(res.id, 'Draft')} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button className="text-gray-400 hover:text-[#1F4D3A]">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResourceManager;
