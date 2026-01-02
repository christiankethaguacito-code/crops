import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, MapPin, Phone } from 'lucide-react';
import { useAuth, API_URL } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { MOCK_DATA } from '../../config/mockData';

export default function AdminFarmers() {
    const { token, isMockMode } = useAuth();
    const { setHeaderAction } = useOutletContext();
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Inject "Add New Farmer" button into header
    useEffect(() => {
        setHeaderAction(
            <button className="bg-primary text-white px-4 py-2 rounded-md font-bold text-sm shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
                + Add New Farmer
            </button>
        );
        return () => setHeaderAction(null);
    }, [setHeaderAction]);

    useEffect(() => {
        const fetchFarmers = async () => {
            setLoading(true);
            setError(null);

            if (isMockMode) {
                // Use Mock Data
                setTimeout(() => {
                    setFarmers(MOCK_DATA.admin.Farmers);
                    setLoading(false);
                }, 500);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/admin/farmers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch farmers');
                }
                const data = await response.json();
                // Backend returns { farmers: [...] }
                const farmersArray = data.farmers || data;
                // Normalize field names
                const normalizedFarmers = farmersArray.map(f => ({
                    ...f,
                    first_name: f.full_name?.split(' ')[0] || f.full_name || 'Unknown',
                    last_name: f.full_name?.split(' ').slice(1).join(' ') || '',
                    name: f.full_name,
                    rsbsa: f.rsbsa_number,
                    rsbsa_id: f.rsbsa_number,
                    address_barangay: f.barangay
                }));
                setFarmers(normalizedFarmers);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load farmers');
            } finally {
                setLoading(false);
            }
        };

        if (token || isMockMode) fetchFarmers();
    }, [token, isMockMode]);

    const filteredFarmers = farmers.filter(f => {
        const term = searchTerm.toLowerCase();
        return (
            (f.first_name && f.first_name.toLowerCase().includes(term)) ||
            (f.last_name && f.last_name.toLowerCase().includes(term)) ||
            (f.rsbsa_id && f.rsbsa_id.toLowerCase().includes(term)) ||
            (f.address_barangay && f.address_barangay.toLowerCase().includes(term))
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Farmer Management</h2>
                    <p className="text-sm text-gray-500">View and manage registered farmers and their land.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, RSBSA, or barangay..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white">
                    <Filter size={16} />
                    Filter
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold tracking-wider">
                                <th className="px-6 py-4">Farmer Name</th>
                                <th className="px-6 py-4">RSBSA ID</th>
                                <th className="px-6 py-4">Address</th>
                                <th className="px-6 py-4">Farm Location</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading farmers...</td>
                                </tr>
                            )}

                            {!loading && error && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-red-500">{error}</td>
                                </tr>
                            )}

                            {!loading && !error && filteredFarmers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No farmers found.</td>
                                </tr>
                            )}

                            {!loading && !error && filteredFarmers.map((farmer) => (
                                <tr key={farmer.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                {farmer.first_name ? farmer.first_name.charAt(0) : ''}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900 block">{farmer.first_name} {farmer.last_name}</span>
                                                <span className="text-xs text-gray-400">{farmer.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{farmer.rsbsa_id || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {farmer.address_barangay || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-gray-400" />
                                            {farmer.location_barangay ? `${farmer.location_sitio || ''}, ${farmer.location_barangay}` : 'No farm data'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Mock */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <p>Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">{filteredFarmers.length}</span> of <span className="font-bold text-gray-900">{farmers.length}</span> entries</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" disabled={true}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
