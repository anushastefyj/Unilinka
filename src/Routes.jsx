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

// Admin imports
import AdminLayout from './pages/admin/layout/AdminLayout';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import TaxonomyManager from './pages/admin/taxonomy/TaxonomyManager';
import ResourceManager from './pages/admin/resources/ResourceManager';
import ReportedIssues from './pages/admin/issues/ReportedIssues';
import AnalyticsDashboard from './pages/admin/analytics/AnalyticsDashboard';
import SubjectMergeManager from './pages/admin/merge/SubjectMergeManager';
import ContentGapDashboard from './pages/admin/analytics/ContentGapDashboard';
import UserManager from './pages/admin/users/UserManager';
import NotificationManager from './pages/admin/notifications/NotificationManager';

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

        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="taxonomy" element={<TaxonomyManager />} />
          <Route path="resources" element={<ResourceManager />} />
          <Route path="issues" element={<ReportedIssues />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="analytics/gaps" element={<ContentGapDashboard />} />
          <Route path="merge" element={<SubjectMergeManager />} />
          <Route path="notifications" element={<NotificationManager />} />
          <Route path="users" element={<UserManager />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
