import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Map, Settings, LogOut, Menu, X, ChevronRight, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function AdminSidebar({ isOpen, toggle }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
        { icon: Users, label: 'Farmers', path: '/admin/farmers' },
        { icon: FileText, label: 'Reports', path: '/admin/reports' },
        { icon: Map, label: 'Farm Map', path: '/admin/map' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={toggle}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-0 z-50 h-screen w-full lg:w-64 bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:shadow-none
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="CropAid Logo" className="w-8 h-8 object-contain" />
                            <div>
                                <h1 className="text-xl font-bold text-primary tracking-tight leading-none">CropAid</h1>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Admin Panel</span>
                            </div>
                        </div>



                        <button onClick={toggle} className="lg:hidden text-gray-500">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={toggle}
                            >
                                {({ isActive }) => (
                                    <div className={`
                                        flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 group relative
                                        ${isActive
                                            ? 'bg-primary/10 text-primary font-bold shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                    `}>
                                        <item.icon size={20} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
                                        <span>{item.label}</span>
                                        {item.path === '/admin/reports' && (
                                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">3</span>
                                        )}
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-md">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                A
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">Administrator</p>
                                <p className="text-xs text-gray-500 truncate">admin@cropaid.gov</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
