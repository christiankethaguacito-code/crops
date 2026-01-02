
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FileText, Activity, Home, User, LogOut, X, Map, Bell, Newspaper, LayoutGrid, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import Layout from '../components/Layout';
import BottomNavbar from '../components/BottomNavbar';
import { API_URL, useAuth } from '../context/AuthContext';
import { MOCK_DATA } from '../config/mockData';
import { fetchWeather, getCurrentPosition } from '../services/api';

export default function FarmerDashboard() {
    const navigate = useNavigate();
    const { user, token, logout, isMockMode, loading: authLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liveWeather, setLiveWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Fetch live weather data
    useEffect(() => {
        const getWeather = async () => {
            try {
                let lat = 6.5294; // Default: Norala, South Cotabato, Philippines
                let lon = 124.6647;

                try {
                    const coords = await getCurrentPosition();
                    lat = coords.latitude;
                    lon = coords.longitude;
                } catch (err) {
                    console.log('Using default location for weather');
                }

                const weatherData = await fetchWeather(lat, lon);
                setLiveWeather(weatherData);
            } catch (err) {
                console.error('Weather fetch error:', err);
            } finally {
                setWeatherLoading(false);
            }
        };

        getWeather();
        // Refresh every 15 minutes
        const interval = setInterval(getWeather, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Get weather icon component
    const getWeatherIcon = (condition) => {
        if (!condition) return <Sun size={24} className="text-yellow-500" />;
        const cond = condition.toLowerCase();
        if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain size={24} className="text-blue-500" />;
        if (cond.includes('thunder') || cond.includes('storm')) return <CloudLightning size={24} className="text-purple-500" />;
        if (cond.includes('cloud') || cond.includes('overcast')) return <Cloud size={24} className="text-gray-500" />;
        return <Sun size={24} className="text-yellow-500" />;
    };

    useEffect(() => {
        // Wait for auth initialization
        if (authLoading) return;

        const fetchDashboardData = async () => {
            if (isMockMode) {
                // Mock Data - Dynamic based on logged in user
                const username = user?.username || 'james'; // Default to james if generic
                setDashboardData(MOCK_DATA.getFarmerDashboard(username));
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/farmer/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                }
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        if (token || isMockMode) fetchDashboardData();
    }, [token, isMockMode, authLoading]);

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { profile, weather, stats, latest_advisory } = dashboardData || {};

    return (
        <>
            {/* Header / Top Bar */}
            <div className="bg-primary text-white p-5 pt-8 rounded-b-3xl shadow-md relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={toggleSidebar} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                        <User size={24} className="text-white" />
                    </button>
                    <div className="text-right">
                        <h1 className="text-xl font-bold m-0">Hello, {profile?.name?.split(' ')[0] || 'Farmer'}</h1>
                        <p className="text-xs text-white/80 m-0">{profile?.barangay || 'Norala'}, South Cotabato</p>
                    </div>
                </div>

                {/* Weather / Status Card */}
                <div className="bg-white text-text-main p-4 rounded-xl shadow-lg flex justify-between items-center mb-[-40px]">
                    <div className="flex flex-col">
                        <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Current Weather</span>
                        <div className="flex items-center gap-2 mt-1">
                            {weatherLoading ? (
                                <div className="w-6 h-6 animate-pulse bg-gray-200 rounded-full"></div>
                            ) : (
                                getWeatherIcon(liveWeather?.condition)
                            )}
                            <span className="text-2xl font-bold">{liveWeather?.temperature || weather?.temp || 32}°C</span>
                        </div>
                        <span className="text-[10px] text-text-muted">
                            {liveWeather?.condition || weather?.condition || 'Sunny'}, {liveWeather?.humidity ? `${liveWeather.humidity}% humidity` : profile?.barangay || 'Norala'}
                        </span>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-200"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Active Reports</span>
                        <span className="text-2xl font-bold text-primary">{stats?.active_reports || 0}</span>
                        <span className="text-[10px] text-text-muted">{stats?.active_reports > 0 ? 'Pending issues' : 'No pending issues'}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mt-16 px-5 py-4">
                {/* Quick Actions Grid (Updated) */}
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Quick Services</h3>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col items-center gap-2" onClick={() => navigate('/my-map')}>
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm cursor-pointer hover:bg-orange-200 transition-colors">
                            <Map size={24} />
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight">Farm<br />Map</span>
                    </div>
                    <div className="flex flex-col items-center gap-2" onClick={() => navigate('/notifications')}>
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shadow-sm cursor-pointer hover:bg-red-200 transition-colors">
                            <Bell size={24} />
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight">Notifications</span>
                    </div>
                    <div className="flex flex-col items-center gap-2" onClick={() => navigate('/news')}>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm cursor-pointer hover:bg-blue-200 transition-colors">
                            <Newspaper size={24} />
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight">News</span>
                    </div>
                    <div className="flex flex-col items-center gap-2" onClick={toggleSidebar}>
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shadow-sm cursor-pointer hover:bg-gray-200 transition-colors">
                            <LayoutGrid size={24} />
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight">More</span>
                    </div>
                </div>

                {/* Promo / Info Section */}
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Latest Advisory</h3>
                <div className="bg-gradient-to-r from-primary to-primary-light text-white p-4 rounded-xl shadow-md mb-4">
                    <h4 className="font-bold text-sm mb-1">{latest_advisory?.title || 'System Notice'}</h4>
                    <p className="text-xs opacity-90">{latest_advisory?.message || 'No critical alerts at this time.'}</p>
                </div>
            </div>

            {/* Sidebar (Full Screen Overlay) - Portal Used to Escape Setup Stacking Context */}
            {createPortal(
                <div className="fixed inset-0 z-[100] flex justify-center pointer-events-none">
                    <div className="w-full max-w-[480px] h-full relative overflow-hidden">
                        <div className={`absolute inset-0 bg-primary pointer-events-auto flex flex-col p-6 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                            {/* Close Button (Top Left - matching profile button) */}
                            <div className="flex justify-between items-center mb-6 mt-8">
                                <button onClick={toggleSidebar} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                    <X size={24} className="text-white" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center mb-8">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 text-primary shadow-lg border-4 border-white/20">
                                    <User size={40} />
                                </div>
                                <h2 className="text-2xl font-bold">{profile?.name || 'Farmer'}</h2>
                                <p className="text-white/70 text-sm">RSBSA: {profile?.rsbsa}</p>
                            </div>

                            <div className="flex-1">
                                <div className="space-y-4">
                                    <div onClick={() => { toggleSidebar(); navigate('/profile'); }} className="p-4 bg-white/10 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors">
                                        <User size={20} />
                                        <span className="font-medium">My Profile</span>
                                    </div>
                                    <div onClick={() => { toggleSidebar(); navigate('/status'); }} className="p-4 bg-white/10 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors">
                                        <Activity size={20} />
                                        <span className="font-medium">Report History</span>
                                    </div>
                                    <div onClick={() => { toggleSidebar(); navigate('/notifications'); }} className="p-4 bg-white/10 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors">
                                        <Bell size={20} />
                                        <span className="font-medium">Notifications</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="w-full bg-white text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg mt-auto"
                            >
                                <LogOut size={20} />
                                LOGOUT
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
