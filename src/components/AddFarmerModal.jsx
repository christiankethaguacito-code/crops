import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Phone, Mail, FileText, Save, Loader2 } from 'lucide-react';
import { useAuth, API_URL } from '../context/AuthContext';

export default function AddFarmerModal({ onClose, onSuccess }) {
    const { token, isMockMode } = useAuth();
    const [loading, setLoading] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        cellphone: '',
        rsbsaId: '',
        addressBarangay: '',
        farmBarangay: '',
        farmSitio: '',
        farmSizeHectares: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        // Fetch barangays for dropdowns
        const fetchBarangays = async () => {
            if (isMockMode) {
                setBarangays([
                    { id: 1, name: 'Poblacion' },
                    { id: 2, name: 'San Miguel' },
                    { id: 3, name: 'Benigno Aquino' },
                    { id: 4, name: 'Libertad' },
                    { id: 5, name: 'Lapuz' }
                ]);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/barangays`);
                if (response.ok) {
                    const data = await response.json();
                    setBarangays(data);
                }
            } catch (err) {
                console.error('Failed to fetch barangays:', err);
            }
        };

        fetchBarangays();
    }, [isMockMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.username || !formData.password) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (isMockMode) {
            setTimeout(() => {
                onSuccess?.({
                    id: Date.now(),
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    cellphone: formData.cellphone,
                    rsbsa_id: formData.rsbsaId,
                    address_barangay: formData.addressBarangay,
                    username: formData.username
                });
                setLoading(false);
                onClose();
            }, 1000);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/farmers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    cellphone: formData.cellphone,
                    rsbsaId: formData.rsbsaId,
                    addressBarangay: formData.addressBarangay,
                    farmBarangay: formData.farmBarangay,
                    farmSitio: formData.farmSitio,
                    farmSizeHectares: parseFloat(formData.farmSizeHectares) || null,
                    username: formData.username,
                    password: formData.password
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add farmer');
            }

            const newFarmer = await response.json();
            onSuccess?.(newFarmer);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <User size={20} />
                        Add New Farmer
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Personal Info Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <User size={14} />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Cellphone</label>
                                <input
                                    type="tel"
                                    name="cellphone"
                                    value={formData.cellphone}
                                    onChange={handleChange}
                                    placeholder="09XXXXXXXXX"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">RSBSA ID</label>
                                <input
                                    type="text"
                                    name="rsbsaId"
                                    value={formData.rsbsaId}
                                    onChange={handleChange}
                                    placeholder="XX-XX-XX-XXX-XXXXXX"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Address Barangay</label>
                                <select
                                    name="addressBarangay"
                                    value={formData.addressBarangay}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                >
                                    <option value="">Select barangay</option>
                                    {barangays.map(b => (
                                        <option key={b.id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Farm Info Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <MapPin size={14} />
                            Farm Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Farm Barangay</label>
                                <select
                                    name="farmBarangay"
                                    value={formData.farmBarangay}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                >
                                    <option value="">Select barangay</option>
                                    {barangays.map(b => (
                                        <option key={b.id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Sitio/Purok</label>
                                <input
                                    type="text"
                                    name="farmSitio"
                                    value={formData.farmSitio}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Farm Size (hectares)</label>
                            <input
                                type="number"
                                name="farmSizeHectares"
                                value={formData.farmSizeHectares}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Account Info Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <FileText size={14} />
                            Account Credentials
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Add Farmer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
