import React, { useState } from 'react';
import { Users, Shield, Plus, MoreVertical, Search, Edit2, Trash2 } from 'lucide-react';

const UserManager = () => {
  const [users] = useState([
    { id: 1, name: 'Alice Admin', email: 'alice@unilinka.edu', role: 'Super Admin', branch: 'All Branches', lastActive: '2 mins ago', status: 'Active' },
    { id: 2, name: 'John Coordinator', email: 'john.c@unilinka.edu', role: 'Branch Coordinator', branch: 'CSE', lastActive: '1 hour ago', status: 'Active' },
    { id: 3, name: 'Sarah Eng', email: 'sarah.e@unilinka.edu', role: 'Branch Coordinator', branch: 'ECE', lastActive: '1 day ago', status: 'Active' },
    { id: 4, name: 'Mike Mech', email: 'mike.m@unilinka.edu', role: 'Branch Coordinator', branch: 'MECH', lastActive: '1 week ago', status: 'Inactive' },
  ]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1F4D3A]">User Management</h1>
          <p className="text-gray-500 mt-1">Manage admins and branch coordinators.</p>
        </div>
        <button className="bg-[#1F4D3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#153a2b] transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-[#EFE7D8] text-[#1F4D3A] rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Admins</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Super Admins</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">3</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Branch Coordinators</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">9</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 focus:border-[#1F4D3A]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="text-sm border-gray-300 rounded-lg focus:ring-[#1F4D3A] focus:border-[#1F4D3A] bg-white">
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>Branch Coordinator</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-600 sticky top-0 border-b border-gray-200 z-10">
              <tr>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Assigned Branch</th>
                <th className="px-6 py-3 font-semibold">Last Active</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center font-bold text-xs mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {user.branch}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center text-xs font-medium ${
                      user.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-1.5 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-1.5 text-gray-500 hover:text-[#1F4D3A] hover:bg-[#FAF7F0] rounded transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default UserManager;
