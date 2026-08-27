import React from 'react';
import { ChevronRight, AlertCircle, FileX } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentGapDashboard = () => {
  const gaps = [
    { branch: 'ECE', year: '3', sem: '6', subject: 'VLSI Design', missing: ['Question Papers (2024)', 'Syllabus'] },
    { branch: 'CSE', year: '2', sem: '4', subject: 'Computer Networks', missing: ['Notes', 'Slides'] },
    { branch: 'MECH', year: '1', sem: '2', subject: 'Engineering Mechanics', missing: ['All Resources'] },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <Link to="/admin/analytics" className="hover:text-[#1F4D3A] hover:underline">Analytics</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-[#1F4D3A]">Content Gaps</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">Content Gap Dashboard</h1>
        <p className="text-gray-500 mt-1">Identify missing resources across the curriculum matrix.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex space-x-3">
            <select className="text-sm border-gray-300 rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A] bg-white">
              <option>All Branches</option>
              <option>CSE</option>
              <option>ECE</option>
            </select>
            <select className="text-sm border-gray-300 rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A] bg-white">
              <option>All Years</option>
              <option>Year 1</option>
            </select>
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Export List
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-50/30">
          <div className="max-w-4xl mx-auto space-y-4">
            {gaps.map((gap, i) => (
              <div key={i} className="bg-white border border-red-100 rounded-xl p-5 shadow-sm flex items-start">
                <div className="p-2 bg-red-50 rounded-lg text-red-500 mr-4">
                  <FileX className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900">{gap.subject}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {gap.branch} • Year {gap.year} • Sem {gap.sem}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-red-500" /> Missing:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500 ml-5">
                      {gap.missing.map(m => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#EFE7D8] text-[#1F4D3A] text-sm font-medium rounded-lg hover:bg-[#e0d6c3] transition-colors">
                  Upload Missing
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGapDashboard;
