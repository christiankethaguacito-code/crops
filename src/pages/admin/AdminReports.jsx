import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAuth, API_URL } from '../../context/AuthContext';
import { MOCK_DATA } from '../../config/mockData';

export default function AdminReports() {
    const { token, isMockMode } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        setLoading(true);
        if (isMockMode) {
            // Mock Data
            setTimeout(() => {
                setReports(MOCK_DATA.admin.Reports);
                setLoading(false);
            }, 500);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/reports`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();
            // Backend returns { reports: [...] } or array directly
            const reportsArray = data.reports || data;
            // Normalize field names
            const normalizedReports = reportsArray.map(r => ({
                ...r,
                type: r.report_type || r.type,
                first_name: r.farmer_name?.split(' ')[0] || 'Unknown',
                last_name: r.farmer_name?.split(' ').slice(1).join(' ') || 'Farmer',
                details: r.description ? { description: r.description } : {}
            }));
            setReports(normalizedReports);
        } catch (err) {
            console.error(err);
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token || isMockMode) fetchReports();
    }, [token, isMockMode]);

    const handleStatusUpdate = async (id, newStatus) => {
        if (isMockMode) {
            // Mock Update - just update local state for visual feedback
            setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/reports/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Refresh list
            fetchReports();
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const filteredReports = reports.filter(r => {
        const matchesTab = activeTab === 'All' || r.status === activeTab.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        // Safe access checks
        const matchesSearch =
            (r.type && r.type.toLowerCase().includes(searchLower)) ||
            (r.first_name && r.first_name.toLowerCase().includes(searchLower)) ||
            (r.last_name && r.last_name.toLowerCase().includes(searchLower)) ||
            (r.location && r.location.toLowerCase().includes(searchLower));
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'verified': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Redundant header removed */}

            {/* Tabs & Search */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md self-start md:self-auto">
                    {['All', 'Pending', 'Verified', 'Resolved'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        className="w-full md:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {loading && <p className="text-center py-8 text-gray-500">Loading reports...</p>}

                {!loading && filteredReports.length === 0 && (
                    <p className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400">
                        No reports found.
                    </p>
                )}

                {filteredReports.map((report) => {
                    let details = {};
                    if (report.details) {
                        try {
                            details = typeof report.details === 'string' ? JSON.parse(report.details) : report.details;
                        } catch (e) {
                            // Fallback for plain string details
                            details = { description: report.details };
                        }
                    }
                    // Ensure details is an object to prevent crashes
                    if (!details || typeof details !== 'object') details = {};

                    return (
                        <div key={report.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(report.status)} uppercase tracking-wide`}>
                                            {report.status}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">{formatDate(report.created_at)}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 capitalize">
                                        <AlertTriangle size={18} className="text-primary" />
                                        {report.type} Report - <span className="text-gray-600">{details.severity || 'Unknown'} Severity</span>
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed italic">
                                        "{details.description || 'No description provided'}"
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                                {report.first_name ? report.first_name.charAt(0) : '?'}
                                            </div>
                                            {report.first_name} {report.last_name}
                                        </span>
                                        <span>•</span>
                                        <span>{report.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 md:border-l md:border-gray-100 md:pl-6 shrink-0 pt-4 md:pt-0 border-t border-gray-100 mt-2 md:mt-0">
                                    {report.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(report.id, 'verified')}
                                                className="flex flex-col items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors p-2 rounded-md hover:bg-emerald-50"
                                            >
                                                <CheckCircle size={20} />
                                                <span className="text-[10px] uppercase font-bold">Verify</span>
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(report.id, 'rejected')}
                                                className="flex flex-col items-center gap-1 text-red-600 hover:text-red-700 transition-colors p-2 rounded-md hover:bg-red-50"
                                            >
                                                <XCircle size={20} />
                                                <span className="text-[10px] uppercase font-bold">Reject</span>
                                            </button>
                                        </>
                                    )}
                                    {report.status === 'verified' && (
                                        <button
                                            onClick={() => handleStatusUpdate(report.id, 'resolved')}
                                            className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-md hover:bg-blue-50"
                                        >
                                            <CheckCircle size={20} />
                                            <span className="text-[10px] uppercase font-bold">Resolve</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
