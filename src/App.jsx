
import React from 'react';
import FarmerLayout from './components/FarmerLayout';
import { AuthProvider } from './context/AuthContext';
import MockModeOverlay from './components/MockModeOverlay';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import SignupBasicInfo from './pages/SignupBasicInfo';
import SignupFarmInfo from './pages/SignupFarmInfo';
import SignupAppInfo from './pages/SignupAppInfo';
import SignupSummary from './pages/SignupSummary';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminLayout from './components/AdminLayout';
import AdminDashboardNew from './pages/admin/AdminDashboard';
import AdminFarmers from './pages/admin/AdminFarmers';
import AdminReports from './pages/admin/AdminReports';
import UnifiedReport from './pages/UnifiedReport';
import ReportStatus from './pages/ReportStatus';
import PestReport from './pages/PestReport';
import FloodReport from './pages/FloodReport';
import Confirmation from './pages/Confirmation';
import ReportConfirmation from './pages/ReportConfirmation';
import AdminFarmReports from './pages/AdminFarmReports';
import AdminDailySummary from './pages/AdminDailySummary';
import AdminOrganizedReport from './pages/AdminOrganizedReport';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <MockModeOverlay />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/signup/basic-info" element={<SignupBasicInfo />} />
          <Route path="/signup/farm-info" element={<SignupFarmInfo />} />
          <Route path="/signup/app-info" element={<SignupAppInfo />} />
          <Route path="/signup/summary" element={<SignupSummary />} />

          {/* Farmer Routes with Persistent Navbar */}
          <Route element={<FarmerLayout />}>
            <Route path="/dashboard" element={<FarmerDashboard />} />
            <Route path="/report" element={<UnifiedReport />} />
            <Route path="/status" element={<ReportStatus />} />
          </Route>

          {/* Admin Routes with Sidebar Layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboardNew />} />
            <Route path="/admin/farmers" element={<AdminFarmers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            {/* Placeholders for now */}
            <Route path="/admin/map" element={<div className="p-8 font-bold">Map View (Coming Soon)</div>} />
            <Route path="/admin/settings" element={<div className="p-8 font-bold">Settings (Coming Soon)</div>} />
          </Route>

          <Route path="/report/pest" element={<PestReport />} />
          <Route path="/report/flood" element={<FloodReport />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/report-confirmation" element={<ReportConfirmation />} />
          {/* Legacy or specific standalone admin pages if needed, can keep or remove later */}
          <Route path="/admin/farm-reports" element={<AdminFarmReports />} />
          <Route path="/admin/daily-summary" element={<AdminDailySummary />} />
          <Route path="/admin/organized-report" element={<AdminOrganizedReport />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
