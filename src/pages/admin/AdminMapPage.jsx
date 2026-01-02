import React, { useState } from 'react';
import AdminMap from '../../components/AdminMap';
import { X, MapPin, Calendar, User, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth, API_URL } from '../../context/AuthContext';

export default function AdminMapPage() {
    const { token } = useAuth();
    const [selectedReport, setSelectedReport] = useState(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [photoData, setPhotoData] = useState(null);

    const handleReportClick = (report) => {
        setSelectedReport(report);
        setPhotoData(null);
    };

    const closeDetailPanel = () => {
        setSelectedReport(null);
        setPhotoData(null);
    };

    const loadReportPhoto = async () => {
        if (!selectedReport?.id) return;
        
        setPhotoLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/reports/${selectedReport.id}/photo`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setPhotoData(data.photo);
                setShowPhotoModal(true);
            }
        } catch (err) {
            console.error('Failed to load photo:', err);
        } finally {
            setPhotoLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-600 bg-yellow-50',
            verified: 'text-blue-600 bg-blue-50',
            resolved: 'text-green-600 bg-green-50',
            rejected: 'text-red-600 bg-red-50'
        };
        return colors[status?.toLowerCase()] || 'text-gray-600 bg-gray-50';
    };

    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'pest': return '🐛';
            case 'flood': return '🌊';
            case 'drought': return '☀️';
            default: return '📋';
        }
    };

    return (
        <>
            <div className="h-[calc(100vh-120px)] flex gap-4">
                {/* Main Map Area */}
                <div className={`flex-1 bg-white rounded-xl shadow-sm overflow-hidden transition-all ${selectedReport ? 'w-2/3' : 'w-full'}`}>
                    <AdminMap onReportClick={handleReportClick} />
                </div>

                {/* Detail Panel */}
                {selectedReport && (
                    <div className="w-1/3 min-w-[320px] bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="bg-primary text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{getTypeIcon(selectedReport.report_type)}</span>
                                <div>
                                    <h3 className="font-bold capitalize">{selectedReport.report_type} Report</h3>
                                    <p className="text-sm opacity-80">ID: #{selectedReport.id}</p>
                                </div>
                            </div>
                            <button 
                                onClick={closeDetailPanel}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Status Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedReport.status)}`}>
                                {selectedReport.status === 'verified' && <CheckCircle size={16} />}
                                {selectedReport.status === 'pending' && <AlertTriangle size={16} />}
                                {selectedReport.status?.toUpperCase()}
                            </div>

                            {/* Farmer Info */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <User size={16} />
                                    <span className="text-sm font-medium">Farmer Information</span>
                                </div>
                                <p className="font-semibold text-gray-800">{selectedReport.farmer_name || 'Unknown'}</p>
                            </div>

                            {/* Location Info */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <MapPin size={16} />
                                    <span className="text-sm font-medium">Location</span>
                                </div>
                                <p className="text-gray-800">{selectedReport.location}</p>
                                {selectedReport.latitude && selectedReport.longitude && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        GPS: {selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}
                                    </p>
                                )}
                            </div>

                            {/* Crop Info */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Leaf size={16} />
                                    <span className="text-sm font-medium">Crop Information</span>
                                </div>
                                <p className="text-gray-800">{selectedReport.crop_planted || 'Not specified'}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Affected Area: <span className="font-medium">{selectedReport.affected_area || 0} hectares</span>
                                </p>
                            </div>

                            {/* Date Info */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Calendar size={16} />
                                    <span className="text-sm font-medium">Report Date</span>
                                </div>
                                <p className="text-gray-800">
                                    {new Date(selectedReport.created_at).toLocaleDateString('en-PH', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {/* Description */}
                            {selectedReport.description && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-sm font-medium text-gray-600 mb-2">Description</div>
                                    <p className="text-gray-800 text-sm">{selectedReport.description}</p>
                                </div>
                            )}

                            {/* Photo Button */}
                            <button
                                onClick={loadReportPhoto}
                                disabled={photoLoading}
                                className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                            >
                                {photoLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Loading Photo...
                                    </>
                                ) : (
                                    <>📷 View Photo Evidence</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Photo Modal */}
            {showPhotoModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-bold text-lg">Photo Evidence</h3>
                            <button 
                                onClick={() => setShowPhotoModal(false)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-4">
                            {photoData ? (
                                <img 
                                    src={photoData} 
                                    alt="Report evidence" 
                                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                                />
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <span className="text-4xl block mb-2">📷</span>
                                    No photo available for this report
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
