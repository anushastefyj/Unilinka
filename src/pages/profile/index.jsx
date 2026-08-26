import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import StudentLayout from '../../components/layout/StudentLayout';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import RecentResourceCard from '../student-dashboard/components/RecentResourceCard';

const ProfilePage = () => {
  const { userData } = useAuth();
  
  const [downloadHistory, setDownloadHistory] = useState([]);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('unilinka_downloads') || '[]');
      setDownloadHistory(history);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <AuthenticationGuard requiredRoles={['student']}>
      <Helmet>
        <title>My Profile - Unilinka</title>
      </Helmet>
      
      <StudentLayout headerContent={<div className="font-bold text-lg text-[#1C1C1C]">Profile</div>}>
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
          
          <div className="flex items-center gap-3 mb-6">
            <Icon name="User" size={24} className="text-[#1F4D3A]" />
            <h1 className="text-3xl font-bold text-[#1C1C1C] font-serif">Identity Card</h1>
          </div>

          <section className="bg-white rounded-[2rem] p-8 border border-[#E7E2D6] shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-start">
            
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EFE7D8] rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />

            {/* Profile Photo Editor */}
            <div className="relative group z-10 flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-[#FAF7F0] border-4 border-white shadow-md flex items-center justify-center text-[#1F4D3A] overflow-hidden">
                <Icon name="User" size={48} />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#1F4D3A] hover:bg-[#2E6B4F] text-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-105 border-2 border-white">
                <Icon name="Camera" size={18} />
              </button>
            </div>

            {/* Identity Details */}
            <div className="flex-1 z-10">
              <h2 className="text-2xl font-bold text-[#1C1C1C] mb-1 font-serif">{userData?.name || 'Student Name'}</h2>
              <p className="text-[#1F4D3A] font-bold text-sm mb-6 bg-[#EFE7D8] px-3 py-1 rounded-full w-fit">
                {userData?.rollNumber || 'Roll Number Not Set'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-xs text-[#5C5C5C] font-bold uppercase tracking-wider mb-1">Branch</p>
                  <p className="text-[#1C1C1C] font-medium">{userData?.course || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5C5C5C] font-bold uppercase tracking-wider mb-1">Academic Year</p>
                  <p className="text-[#1C1C1C] font-medium">{userData?.year || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5C5C5C] font-bold uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-[#1C1C1C] font-medium">{userData?.email || 'student@university.edu'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5C5C5C] font-bold uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-2 text-[#1F4D3A] font-medium">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Active Student
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Downloads */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="DownloadCloud" size={24} className="text-[#1F4D3A]" />
              <h2 className="text-2xl font-bold text-[#1C1C1C] font-serif">Recent Downloads</h2>
            </div>
            
            <div className="space-y-4">
              {downloadHistory.length === 0 ? (
                <div className="text-center py-8 bg-white border border-[#E7E2D6] rounded-2xl">
                  <p className="text-[#5C5C5C] text-sm">You haven't downloaded any resources yet.</p>
                </div>
              ) : (
                downloadHistory.map(resource => (
                  <RecentResourceCard key={resource.id} resource={resource} />
                ))
              )}
            </div>
          </div>

        </div>
      </StudentLayout>
    </AuthenticationGuard>
  );
};

export default ProfilePage;
