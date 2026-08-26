import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import StudentLayout from '../../components/layout/StudentLayout';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import RecentResourceCard from '../student-dashboard/components/RecentResourceCard';

const ProfilePage = () => {
  const { userData } = useAuth();
  
  // Mock data for downloads since this isn't strictly tracked in the DB for users yet
  const mockDownloads = [
    {
      id: 1,
      title: "Data Structures & Algorithms - End Semester",
      description: "Previous Year Question Paper for DSA",
      subject: "Data Structures",
      academicYear: "Year 2",
      fileType: "PDF",
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      fileUrl: "#",
    },
    {
      id: 2,
      title: "Computer Networks Unit 1 Notes",
      description: "Complete notes for Unit 1",
      subject: "Computer Networks",
      academicYear: "Year 3",
      fileType: "DOCX",
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      fileUrl: "#",
    }
  ];

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
              {mockDownloads.map(resource => (
                <RecentResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>

        </div>
      </StudentLayout>
    </AuthenticationGuard>
  );
};

export default ProfilePage;
