
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import SignupBasicInfo from './pages/SignupBasicInfo';
import SignupFarmInfo from './pages/SignupFarmInfo';
import SignupAppInfo from './pages/SignupAppInfo';
import SignupSummary from './pages/SignupSummary';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UnifiedReport from './pages/UnifiedReport';
import PestReport from './pages/PestReport';
import FloodReport from './pages/FloodReport';
import ReportStatus from './pages/ReportStatus';
import AdminFarmReports from './pages/AdminFarmReports';
import AdminDailySummary from './pages/AdminDailySummary';
import AdminOrganizedReport from './pages/AdminOrganizedReport';
import Confirmation from './pages/Confirmation';
import ReportConfirmation from './pages/ReportConfirmation';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup/basic-info" element={<SignupBasicInfo />} />
        <Route path="/signup/farm-info" element={<SignupFarmInfo />} />
        <Route path="/signup/app-info" element={<SignupAppInfo />} />
        <Route path="/signup/summary" element={<SignupSummary />} />
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/report" element={<UnifiedReport />} />
        <Route path="/report/pest" element={<PestReport />} />
        <Route path="/report/flood" element={<FloodReport />} />
        <Route path="/status" element={<ReportStatus />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/report-confirmation" element={<ReportConfirmation />} />
        <Route path="/admin/farm-reports" element={<AdminFarmReports />} />
        <Route path="/admin/daily-summary" element={<AdminDailySummary />} />
        <Route path="/admin/organized-report" element={<AdminOrganizedReport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
