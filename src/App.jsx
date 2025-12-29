
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import SignupStep1 from './pages/SignupStep1';
import SignupStep2 from './pages/SignupStep2';
import SignupStep3 from './pages/SignupStep3';
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup/step1" element={<SignupStep1 />} />
        <Route path="/signup/step2" element={<SignupStep2 />} />
        <Route path="/signup/step3" element={<SignupStep3 />} />
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
