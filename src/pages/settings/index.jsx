import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import StudentLayout from '../../components/layout/StudentLayout';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const ToggleSwitch = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-4 border-b border-[#E7E2D6] last:border-0">
    <div className="flex-1">
      <h3 className="text-sm font-bold text-[#1C1C1C] mb-1">{label}</h3>
      <p className="text-xs text-[#5C5C5C] leading-relaxed">{description}</p>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#1F4D3A]' : 'bg-[#E7E2D6]'}`}
      role="switch"
      aria-checked={checked}
    >
      <div 
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} 
      />
    </button>
  </div>
);

const SettingsPage = () => {
  const { userData } = useAuth();
  
  // UI State for toggles/dropdowns
  const [notifyBranch, setNotifyBranch] = useState(true);
  const [notifyPapers, setNotifyPapers] = useState(true);
  return (
    <AuthenticationGuard requiredRoles={['student']}>
      <Helmet>
        <title>Settings - Unilinka</title>
      </Helmet>
      
      <StudentLayout headerContent={<div className="font-bold text-lg text-[#1C1C1C]">Settings</div>}>
        <div className="max-w-3xl space-y-8 animate-in fade-in duration-300 pb-12">
          
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Settings" size={24} className="text-[#1F4D3A]" />
            <h1 className="text-3xl font-bold text-[#1C1C1C] font-serif">Account Settings</h1>
          </div>

          {/* Account Section */}
          <section className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E7E2D6] shadow-sm">
            <h2 className="text-lg font-bold text-[#1C1C1C] mb-6 flex items-center gap-2">
              <Icon name="User" size={20} className="text-[#1F4D3A]" />
              Account Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#1C1C1C] mb-2">Email Address</label>
                <div className="relative">
                  <Icon name="Mail" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    value={userData?.email || 'student@university.edu'} 
                    disabled 
                    className="w-full bg-[#FAF7F0] border border-[#E7E2D6] rounded-xl py-3 pl-11 pr-4 text-sm text-[#5C5C5C] cursor-not-allowed opacity-70"
                  />
                </div>
                <p className="text-xs text-[#5C5C5C] mt-2">Email cannot be changed as it is linked to your university domain.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1C1C1C] mb-2">Change Password</label>
                <button className="bg-[#FAF7F0] hover:bg-[#EFE7D8] text-[#1F4D3A] border border-[#E7E2D6] px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                  <Icon name="Key" size={16} />
                  Send Password Reset Link
                </button>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E7E2D6] shadow-sm">
            <h2 className="text-lg font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
              <Icon name="Bell" size={20} className="text-[#1F4D3A]" />
              Notifications
            </h2>
            
            <div className="flex flex-col">
              <ToggleSwitch 
                label="Year & Branch Updates" 
                description="Notify me about new curriculum resources added for my specific Year and Branch."
                checked={notifyBranch}
                onChange={setNotifyBranch}
              />
              <ToggleSwitch 
                label="Question Paper Alerts" 
                description="Notify me when new previous year question papers are uploaded for my subjects."
                checked={notifyPapers}
                onChange={setNotifyPapers}
              />
            </div>
          </section>


        </div>
      </StudentLayout>
    </AuthenticationGuard>
  );
};

export default SettingsPage;
