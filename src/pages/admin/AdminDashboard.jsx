import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle, CloudRain, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth, API_URL } from '../../context/AuthContext';
import { MOCK_DATA } from '../../config/mockData';

export default function AdminDashboard() {
    const { token, isMockMode } = useAuth();
    const [stats, setStats] = useState({
        totalFarmers: 0,
        pendingReports: 0,
        resolvedReports: 0,
        weatherAlerts: 1 // Mock for now
    });
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            if (isMockMode) {
                // Mock Data
                setStats(MOCK_DATA.admin.Stats);
                setRecentReports(MOCK_DATA.admin.Reports.slice(0, 5));
                setLoading(false);
                return;
            }

            try {
                // Fetch Stats
                const statsRes = await fetch(`${API_URL}/admin/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await statsRes.json();

                // Fetch Recent Activity (Reports)
                const reportsRes = await fetch(`${API_URL}/admin/reports`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const reportsData = await reportsRes.json();

                setStats({
                    totalFarmers: statsData.totalFarmers,
                    pendingReports: statsData.pendingReports,
                    resolvedReports: statsData.resolvedReports,
                    weatherAlerts: 1 // Keep mock
                });
                setRecentReports(reportsData.slice(0, 5)); // Top 5
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token || isMockMode) fetchData();
    }, [token, isMockMode]);

    const statCards = [
        { label: 'Total Farmers', value: stats.totalFarmers, icon: Users, color: 'bg-blue-500' },
        { label: 'Pending Reports', value: stats.pendingReports, icon: AlertTriangle, color: 'bg-amber-500' },
        { label: 'Resolved Issues', value: stats.resolvedReports, icon: CheckCircle, color: 'bg-emerald-500' },
        { label: 'Weather Alerts', value: stats.weatherAlerts, icon: CloudRain, color: 'bg-red-500' },
    ];

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{loading ? '-' : stat.value}</h3>
                            </div>
                            <div className={`${stat.color} p-2 rounded-md text-white shadow-sm opacity-90`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area (Keeping visual placeholder) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-100 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Incident Reports Overview</h3>
                    <div className="w-full h-72 bg-gray-50 rounded border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        Graph Visualization (Pending Integration)
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Incident Reports</h3>
                    <div className="space-y-4">
                        {loading && <p className="text-sm text-gray-400">Loading activity...</p>}

                        {!loading && recentReports.length === 0 && <p className="text-sm text-gray-400">No recent activity.</p>}

                        {recentReports.map((report) => (
                            <div key={report.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 
                                    ${report.type.toLowerCase() === 'pest' ? 'bg-red-500' :
                                        report.type.toLowerCase() === 'flood' ? 'bg-blue-500' : 'bg-amber-500'}`}
                                />
                                <div>
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold">{report.first_name || 'Farmer'}</span> reported <span className="font-bold lowercase">{report.type}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(report.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
