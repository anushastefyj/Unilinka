import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, AlertTriangle, MessageSquare, ExternalLink, CheckCircle } from 'lucide-react';

const ReportedIssues = () => {
  const location = useLocation();
  const [activeStatus, setActiveStatus] = useState('New');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('filter') === 'system-detected') {
      setActiveStatus('System-Detected');
    }
  }, [location.search]);

  const issues = [
    { id: 'ISS-405', type: 'Missing resource', resource: '2022_Algorithms_MidSem', context: 'Year 2 • CSE • Sem 4', reporter: 'alex.m@student.edu', date: '2 hours ago', status: 'New', note: 'Can you upload the missing part B questions?' },
    { id: 'ISS-404', type: 'Broken link', resource: 'Physics_Lab_Manual.pdf', context: 'Year 1 • Common • Sem 1', reporter: 'sarah.j@student.edu', date: '5 hours ago', status: 'New', note: 'The file fails to open with a 404 error.' },
    { id: 'ISS-403', type: 'Wrong file', resource: 'Database_Notes_Ch1', context: 'Year 3 • IT • Sem 5', reporter: 'mike.k@student.edu', date: '1 day ago', status: 'In Progress', note: 'This actually contains chapter 2 notes, not chapter 1.' },
    { id: 'SYS-101', type: 'Broken link', resource: '2021_Math_II_Final.pdf', context: 'System Health Check', reporter: 'System', date: '10 mins ago', status: 'System-Detected', note: 'File is unreachable (404 Not Found). Please re-upload.' },
    { id: 'SYS-102', type: 'Broken link', resource: 'Chemistry_Lab_Manual_v2.pdf', context: 'System Health Check', reporter: 'System', date: '10 mins ago', status: 'System-Detected', note: 'File size is 0 bytes (corrupted).' },
  ];

  const filteredIssues = issues.filter(i => i.status === activeStatus);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">Reported Issues</h1>
          <p className="text-gray-500 mt-1">Manage student reports and resource corrections.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Workflow Tabs */}
        <div className="flex border-b border-gray-200 px-4 pt-2 bg-gray-50 overflow-x-auto">
          {['New', 'In Progress', 'System-Detected', 'Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                activeStatus === status
                  ? 'border-[#1F4D3A] text-[#1F4D3A] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              {status === 'System-Detected' && <AlertTriangle className="w-4 h-4 mr-2" />}
              {status}
              {status === 'New' && <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">2</span>}
              {status === 'System-Detected' && <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">2</span>}
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 overflow-auto bg-gray-50/50">
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                <p className="text-gray-500">No issues in this queue.</p>
              </div>
            ) : (
              filteredIssues.map(issue => (
                <div key={issue.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        issue.type === 'Missing resource' ? 'bg-amber-100 text-amber-600' :
                        issue.type === 'Broken link' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-900">{issue.type}</h3>
                          <span className="text-xs text-gray-500 font-data">{issue.id}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Resource: <span className="font-medium text-[#1F4D3A]">{issue.resource}</span></p>
                        <p className="text-xs text-gray-500 mt-1">{issue.context}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <p>{issue.date}</p>
                      <p className="mt-1">by {issue.reporter === 'System' ? <span className="font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded">System</span> : issue.reporter}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 flex items-start border border-gray-100">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    <p>"{issue.note}"</p>
                  </div>

                  <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                    <button className="text-[#1F4D3A] text-sm font-medium hover:underline flex items-center">
                      View Resource <ExternalLink className="w-4 h-4 ml-1" />
                    </button>
                    
                    <div className="space-x-3">
                      {activeStatus === 'New' && (
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                          Mark In Progress
                        </button>
                      )}
                      <button className="px-4 py-2 bg-[#1F4D3A] text-white text-sm font-medium rounded-lg hover:bg-[#153a2b] transition-colors">
                        {issue.type === 'Missing resource' ? 'Open Upload Form' : 'Resolve Issue'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportedIssues;
