import React, { useState } from 'react';
import { Plus, Edit2, Archive, Search, ChevronDown, AlertCircle } from 'lucide-react';

const TaxonomyManager = () => {
  const [activeTab, setActiveTab] = useState('subjects');

  const tabs = [
    { id: 'subjects', label: 'Subjects' },
    { id: 'branches', label: 'Branches' },
    { id: 'semesters', label: 'Semesters' },
    { id: 'years', label: 'Years' }
  ];

  const mockSubjects = [
    { id: 1, name: 'Data Structures', branches: ['CSE', 'IT'], resources: 145, status: 'Active' },
    { id: 2, name: 'Digital Signal Processing', branches: ['ECE'], resources: 8, status: 'Active' },
    { id: 3, name: 'Engineering Mathematics I', branches: ['Common'], resources: 312, status: 'Active' },
    { id: 4, name: 'Machine Learning', branches: ['CSE', 'AIML'], resources: 94, status: 'Active' },
    { id: 5, name: 'Thermodynamics', branches: ['MECH'], resources: 0, status: 'Active' }, // empty subject example
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">Taxonomy Manager</h1>
          <p className="text-gray-500 mt-1">Manage standard metadata across the platform.</p>
        </div>
        <button className="bg-[#1F4D3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#153a2b] transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 pt-2 bg-gray-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#1F4D3A] text-[#1F4D3A] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 focus:border-[#1F4D3A]"
              />
            </div>
            <button className="flex items-center text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
              Filter <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 sticky top-0 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  {activeTab === 'subjects' && <th className="px-6 py-3 font-semibold">Associated Branches</th>}
                  {activeTab === 'subjects' && <th className="px-6 py-3 font-semibold">Resources</th>}
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeTab === 'subjects' && mockSubjects.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex gap-1">
                        {item.branches.map(b => (
                          <span key={b} className="px-2 py-0.5 bg-[#EFE7D8] text-[#1F4D3A] rounded text-xs font-semibold">{b}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.resources === 0 ? (
                        <span className="text-red-500 font-medium flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" /> 0
                        </span>
                      ) : (
                        <span className="text-gray-600">{item.resources}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-1.5 text-gray-500 hover:text-[#1F4D3A] hover:bg-[#FAF7F0] rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Archive">
                        <Archive className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activeTab !== 'subjects' && (
              <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                Select "Subjects" tab for demo data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonomyManager;
