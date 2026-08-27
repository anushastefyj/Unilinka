import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, Download, Activity, Link2Off } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
    <div className="p-3 bg-[#EFE7D8] text-[#1F4D3A] rounded-lg">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      {trend && (
        <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Resources" value="12,482" icon={FileText} trend="+142 this week" />
        <StatCard title="Pending Issues" value="34" icon={AlertCircle} trend="12 need urgent review" />
        <Link to="/admin/issues?filter=system-detected" className="block hover:-translate-y-1 transition-transform">
          <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm flex items-center space-x-4 h-full ring-1 ring-red-500/20">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Link2Off className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Broken Links</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">5</h3>
              <p className="text-xs text-red-600 mt-1 font-medium">System-detected</p>
            </div>
          </div>
        </Link>
        <StatCard title="Downloads (7d)" value="45.2k" icon={Download} trend="+12% from last week" />
        <StatCard title="Active Users" value="8,901" icon={Activity} trend="+5.4% from last week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "Uploaded 5 Question Papers", user: "John Doe (CSE Coord)", time: "10 mins ago" },
              { action: "Resolved Issue #402 (Missing Syllabus)", user: "Admin", time: "1 hour ago" },
              { action: "Merged 'Data Structures' (CSE, IT)", user: "Admin", time: "3 hours ago" },
              { action: "Archived 2019 Curriculum Resources", user: "Jane Smith (ECE Coord)", time: "Yesterday" }
            ].map((activity, i) => (
              <div key={i} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#1F4D3A] mr-4 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#1F4D3A] hover:bg-[#FAF7F0] transition-colors text-sm font-medium text-[#1F4D3A]">
              Review Pending Issues
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#1F4D3A] hover:bg-[#FAF7F0] transition-colors text-sm font-medium text-[#1F4D3A]">
              Upload New Resources
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#1F4D3A] hover:bg-[#FAF7F0] transition-colors text-sm font-medium text-[#1F4D3A]">
              Check Content Gaps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
