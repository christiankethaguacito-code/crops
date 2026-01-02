import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import NotificationBell from './NotificationBell';
import { Menu, Search } from 'lucide-react';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [headerAction, setHeaderAction] = useState(null);
    const location = useLocation();

    // Determine page title based on path
    const getPageHeader = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return { title: 'Dashboard Overview', subtitle: 'Summary of farm activities and reports.' };
        if (path.includes('farmers')) return { title: 'Farmer Management', subtitle: 'View and manage registered farmers and their land.' };
        if (path.includes('reports')) return { title: 'Incident Reports', subtitle: 'Track and manage farm incidents and claims.' };
        if (path.includes('map')) return { title: 'Farm Map', subtitle: 'Geospatial view of registered farms and reports.' };
        if (path.includes('settings')) return { title: 'System Settings', subtitle: 'Manage application preferences and configurations.' };
        return { title: 'Admin Panel', subtitle: 'CropAid Administration' };
    };

    const headerInfo = getPageHeader();

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-inter">
            <AdminSidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Main Content Scrollable Area */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {/* Top Bar for both Mobile and Desktop */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Mobile Menu Button - Visible only on mobile */}
                        <div className="flex items-center gap-4">
                            <button
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </button>

                            {/* Desktop Page Title */}
                            <div className="hidden lg:block">
                                <h1 className="text-2xl font-bold text-gray-900">{headerInfo.title}</h1>
                                <p className="text-sm text-gray-500">{headerInfo.subtitle}</p>
                            </div>
                        </div>

                        {/* Right Side Actions Container */}
                        <div className="flex items-center gap-3">
                            {/* Page Content Actions (Injected via Context) */}
                            {headerAction}

                            {/* Notification Bell with Real-time Polling */}
                            <NotificationBell />
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet context={{ setHeaderAction }} />
                    </div>
                </main>
            </div>
        </div>
    );
}
