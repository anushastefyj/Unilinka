import React, { useState } from 'react';
import { Bell, Send, CheckCircle, Clock } from 'lucide-react';

const NotificationManager = () => {
  const [history] = useState([
    { id: 1, title: 'New Sem 1 papers uploaded for CSE', target: 'CSE Students', type: 'Announcement', date: '2 hours ago', status: 'Sent' },
    { id: 2, title: 'Platform Maintenance on Sunday', target: 'All Users', type: 'System', date: 'Yesterday', status: 'Sent' },
    { id: 3, title: 'Mid-Sem Solutions Available', target: 'Year 2', type: 'Announcement', date: 'Oct 15, 2023', status: 'Sent' },
  ]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">Notifications & Announcements</h1>
        <p className="text-gray-500 mt-1">Compose platform-wide or targeted messages to students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Compose Panel */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-[#FAF7F0]">
            <h2 className="font-bold text-[#1F4D3A] flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Compose New Message
            </h2>
          </div>
          
          <div className="p-6 flex-1 overflow-auto space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select className="w-full text-sm border-gray-300 rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A]">
                <option>All Users</option>
                <option>Specific Branch</option>
                <option>Specific Year</option>
                <option>Branch + Year Combo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Title</label>
              <input type="text" placeholder="e.g. New resources available..." className="w-full text-sm border-gray-300 rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
              <textarea rows={5} placeholder="Type your announcement here..." className="w-full text-sm border-gray-300 rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A] resize-none" />
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full bg-[#1F4D3A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#153a2b] transition-colors flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </button>
            </div>
          </div>
        </div>

        {/* History Panel */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Broadcast History</h2>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-gray-600 sticky top-0 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Message</th>
                  <th className="px-6 py-3 font-semibold">Target Audience</th>
                  <th className="px-6 py-3 font-semibold">Sent On</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{msg.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{msg.type}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {msg.target}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center text-xs">
                        <Clock className="w-3 h-3 mr-1 text-gray-400" />
                        {msg.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center text-emerald-600 text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" /> {msg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default NotificationManager;
