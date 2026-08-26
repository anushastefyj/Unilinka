import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import FacultyDashboard from './pages/faculty-dashboard';
import ResourceUpload from './pages/resource-upload';
import Login from './pages/login';
import ResourceBrowse from './pages/resource-browse';
import StudentDashboard from './pages/student-dashboard';
import StudentRegistration from './pages/student-registration';
import ProfilePage from './pages/profile';
import SettingsPage from './pages/settings';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Login />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/resource-upload" element={<ResourceUpload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resource-browse" element={<ResourceBrowse />} />
        
        {/* Student Dashboard & Tracks */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/question-papers" element={<StudentDashboard />} />
        <Route path="/curriculum" element={<StudentDashboard />} />
        
        {/* Profile & Settings */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        <Route path="/student-registration" element={<StudentRegistration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
