import React, { useState } from 'react';
import { GitMerge, AlertCircle, Check, X, Search } from 'lucide-react';

const SubjectMergeManager = () => {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      base: { name: 'Engineering Mathematics I', branch: 'CSE', resources: 145 },
      target: { name: 'Mathematics I', branch: 'ECE', resources: 12 },
      similarity: 94,
    },
    {
      id: 2,
      base: { name: 'Data Structures', branch: 'CSE', resources: 88 },
      target: { name: 'Data Structures & Algorithms', branch: 'IT', resources: 45 },
      similarity: 89,
    }
  ]);

  const mockSubjects = [
    { id: 101, name: 'Physics Lab', branch: 'MECH', resources: 4 },
    { id: 102, name: 'Engineering Physics Lab', branch: 'CIVIL', resources: 8 },
    { id: 103, name: 'Applied Physics Laboratory', branch: 'CSE', resources: 12 },
  ];

  const handleDismiss = (id) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  const handleApprove = (id) => {
    // In a real app, this would call the backend to merge subjects
    setSuggestions(suggestions.filter(s => s.id !== id));
    alert('Subjects merged successfully!');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">Subject Merge Manager</h1>
        <p className="text-gray-500 mt-1">Combine duplicated subjects across branches to unify resource pools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* AI Suggestions Panel */}
        <div className="lg:col-span-1 bg-white border border-[#1F4D3A]/20 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-[#FAF7F0]">
            <h2 className="font-bold text-[#1F4D3A] flex items-center">
              <span className="bg-[#1F4D3A] text-white text-xs px-2 py-0.5 rounded mr-2">AI</span>
              Merge Suggestions
            </h2>
            <p className="text-xs text-gray-500 mt-1">Based on title similarity.</p>
          </div>
          
          <div className="p-4 flex-1 overflow-auto space-y-4 bg-gray-50/50">
            {suggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No active suggestions.
              </div>
            ) : (
              suggestions.map(s => (
                <div key={s.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {s.similarity}% Match
                    </span>
                  </div>
                  
                  <div className="space-y-3 relative">
                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{s.base.name}</p>
                      <p className="text-xs text-gray-500">{s.base.branch} • {s.base.resources} resources</p>
                    </div>
                    
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 -ml-2.5 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center z-10 text-gray-400">
                      <GitMerge className="w-3 h-3" />
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{s.target.name}</p>
                      <p className="text-xs text-gray-500">{s.target.branch} • {s.target.resources} resources</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleDismiss(s.id)}
                      className="flex-1 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <X className="w-3 h-3 mr-1" /> Dismiss
                    </button>
                    <button 
                      onClick={() => handleApprove(s.id)}
                      className="flex-1 py-1.5 bg-[#1F4D3A] text-white text-xs font-medium rounded hover:bg-[#153a2b] transition-colors flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 mr-1" /> Merge
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manual Merge Panel */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Manual Merge</h2>
            <p className="text-sm text-gray-500 mt-1">Select subjects from the list to combine them.</p>
          </div>
          
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 focus:border-[#1F4D3A]"
              />
            </div>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Filter Branch
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              {mockSubjects.map(sub => (
                <label key={sub.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-4 h-4 text-[#1F4D3A] border-gray-300 rounded focus:ring-[#1F4D3A]" />
                  <div className="ml-3 flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                      <p className="text-xs text-gray-500">{sub.branch}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {sub.resources} resources
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">0 subjects selected</span>
            <button className="bg-[#1F4D3A] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#153a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Merge Selected
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SubjectMergeManager;
