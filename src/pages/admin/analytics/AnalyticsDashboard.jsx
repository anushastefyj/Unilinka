import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';

const trendData = [
  { name: 'Mon', downloads: 4000 },
  { name: 'Tue', downloads: 3000 },
  { name: 'Wed', downloads: 2000 },
  { name: 'Thu', downloads: 2780 },
  { name: 'Fri', downloads: 1890 },
  { name: 'Sat', downloads: 2390 },
  { name: 'Sun', downloads: 3490 },
];

const repeatedQuestions = [
  { topic: 'Binary Search Trees', subjects: ['Data Structures', 'Advanced Algo'], appearances: 14, lastSeen: '2023 End Sem' },
  { topic: 'Maxwell Equations', subjects: ['Electromagnetics', 'Physics II'], appearances: 11, lastSeen: '2023 Mid Sem' },
  { topic: 'Deadlock Prevention', subjects: ['Operating Systems'], appearances: 9, lastSeen: '2022 End Sem' },
  { topic: 'Fourier Transforms', subjects: ['Digital Signal Processing', 'Math III'], appearances: 8, lastSeen: '2023 End Sem' },
];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">Analytics & Insights</h1>
          <p className="text-gray-500 mt-1">Platform usage, trending content, and curriculum insights.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center shadow-sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Downloads Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#1F4D3A]" /> 
            Weekly Downloads
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="downloads" stroke="#1F4D3A" strokeWidth={3} dot={{fill: '#1F4D3A', strokeWidth: 2, r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Gap Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-amber-500" /> 
            Content Gaps Overview
          </h2>
          <p className="text-sm text-gray-500 mb-6">Critical missing resources across core subjects.</p>
          
          <div className="space-y-4 flex-1">
            {[
              { text: "Year 3 ECE Sem 2 — Digital Signal Processing has no question papers for 2024", severity: "high" },
              { text: "Year 2 CSE Sem 1 has no curriculum notes uploaded.", severity: "high" },
              { text: "Mechanical 1st Year Physics missing lab manuals.", severity: "medium" },
            ].map((gap, i) => (
              <div key={i} className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className={`w-2 h-2 mt-1.5 rounded-full mr-3 flex-shrink-0 ${gap.severity === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
                <span className="text-sm text-amber-900">{gap.text}</span>
              </div>
            ))}
          </div>
          
          <Link to="/admin/analytics/gaps" className="w-full mt-4 bg-[#EFE7D8] text-[#1F4D3A] py-2 rounded-lg text-sm font-bold hover:bg-[#e0d6c3] transition-colors text-center inline-block">
            View Full Content Gap Dashboard
          </Link>
        </div>
      </div>

      {/* Repeated-Question Analytics */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-[#1F4D3A]" />
            Repeated-Question Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">Cross-subject view of topics recurring most frequently in past exams.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Topic / Concept</th>
                <th className="px-6 py-3 font-semibold">Associated Subjects</th>
                <th className="px-6 py-3 font-semibold">Exam Appearances</th>
                <th className="px-6 py-3 font-semibold">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {repeatedQuestions.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.topic}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {item.subjects.map(s => (
                        <span key={s} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#1F4D3A] bg-[#EFE7D8] px-2.5 py-1 rounded-full text-xs">
                      {item.appearances} times
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
