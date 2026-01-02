import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth, API_URL } from '../context/AuthContext';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons for different report types with emoji icons
const createReportIcon = (emoji, bgColor) => {
    return new L.DivIcon({
        className: 'custom-report-marker',
        html: `<div style="
            background-color: ${bgColor};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        ">${emoji}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });
};

const reportIcons = {
    pest: createReportIcon('🐛', '#ef4444'),      // Red with bug emoji
    flood: createReportIcon('🌊', '#3b82f6'),     // Blue with wave emoji
    drought: createReportIcon('☀️', '#f59e0b'),   // Orange with sun emoji
    default: createReportIcon('📍', '#6b7280')    // Gray with pin emoji
};

// Map bounds updater component
function MapBoundsUpdater({ reports }) {
    const map = useMap();
    
    useEffect(() => {
        if (reports && reports.length > 0) {
            const validReports = reports.filter(r => r.latitude && r.longitude);
            if (validReports.length > 0) {
                const bounds = L.latLngBounds(
                    validReports.map(r => [r.latitude, r.longitude])
                );
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [reports, map]);
    
    return null;
}

export default function AdminMap({ onReportClick }) {
    const { token } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        type: '',
        status: '',
        barangay: ''
    });
    const [barangays, setBarangays] = useState([]);

    // Default center: Norala, South Cotabato, Philippines
    const defaultCenter = [6.5294, 124.6647];
    const defaultZoom = 13;

    // Fetch reports with geolocation
    useEffect(() => {
        const fetchMapReports = async () => {
            try {
                let url = `${API_URL}/admin/reports/map?`;
                if (filter.type) url += `type=${filter.type}&`;
                if (filter.status) url += `status=${filter.status}&`;
                if (filter.barangay) url += `barangay=${filter.barangay}&`;

                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch map data');
                
                const data = await response.json();
                // Handle both array response and object with reports property
                const reportsArray = Array.isArray(data) ? data : (data.reports || []);
                setReports(reportsArray);
            } catch (err) {
                console.error('Map data fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchMapReports();
    }, [token, filter]);

    // Fetch barangays for filter
    useEffect(() => {
        const fetchBarangays = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/barangays`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setBarangays(data.barangays || []);
                }
            } catch (err) {
                console.error('Barangays fetch error:', err);
            }
        };

        if (token) fetchBarangays();
    }, [token]);

    const getIcon = (type) => {
        return reportIcons[type?.toLowerCase()] || reportIcons.default;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            verified: 'bg-blue-100 text-blue-800',
            resolved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-t-lg border-b flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">Type:</label>
                    <select
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                        className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">All Types</option>
                        <option value="pest">🐛 Pest</option>
                        <option value="flood">🌊 Flood</option>
                        <option value="drought">☀️ Drought</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">Status:</label>
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">Barangay:</label>
                    <select
                        value={filter.barangay}
                        onChange={(e) => setFilter({ ...filter, barangay: e.target.value })}
                        className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">All Barangays</option>
                        {barangays.map((b) => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="ml-auto text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{reports.length}</span> reports with location data
                </div>
            </div>

            {/* Legend */}
            <div className="bg-white px-4 py-2 flex gap-6 border-b text-sm">
                <span className="font-medium text-gray-600">Legend:</span>
                <span className="flex items-center gap-1">
                    <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs">🐛</span> Pest
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">🌊</span> Flood
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs">☀️</span> Drought
                </span>
            </div>

            {/* Map Container */}
            <div className="flex-1 min-h-[400px]">
                <MapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    className="h-full w-full rounded-b-lg"
                    style={{ height: '100%', minHeight: '400px' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <MapBoundsUpdater reports={reports} />

                    {reports.map((report) => {
                        // Parse details if it's a string
                        const details = typeof report.details === 'string' 
                            ? JSON.parse(report.details || '{}') 
                            : (report.details || {});
                        
                        const lat = parseFloat(report.latitude);
                        const lng = parseFloat(report.longitude);
                        
                        return lat && lng && !isNaN(lat) && !isNaN(lng) && (
                            <Marker
                                key={report.id}
                                position={[lat, lng]}
                                icon={getIcon(report.type)}
                            >
                                <Popup>
                                    <div className="min-w-[220px]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-gray-800 capitalize flex items-center gap-1">
                                                {report.type === 'pest' && '🐛'}
                                                {report.type === 'flood' && '🌊'}
                                                {report.type === 'drought' && '☀️'}
                                                {report.type} Report
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong>Farmer:</strong> {report.first_name} {report.last_name}</p>
                                            <p><strong>RSBSA:</strong> {report.rsbsa_id || 'N/A'}</p>
                                            <p><strong>Location:</strong> {report.location}</p>
                                            {details.cropType && <p><strong>Crop:</strong> {details.cropType}</p>}
                                            {details.affectedArea && <p><strong>Affected:</strong> {details.affectedArea} ha</p>}
                                            {details.severity && <p><strong>Severity:</strong> {details.severity}</p>}
                                            <p><strong>Coordinates:</strong> {parseFloat(report.latitude).toFixed(4)}, {parseFloat(report.longitude).toFixed(4)}</p>
                                            <p><strong>Date:</strong> {formatDate(report.created_at)}</p>
                                        </div>

                                        {onReportClick && (
                                            <button
                                                onClick={() => onReportClick(report)}
                                                className="mt-3 w-full bg-primary text-white text-sm py-1.5 rounded hover:bg-primary-dark transition-colors"
                                            >
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 text-sm text-center">
                    Error loading map: {error}
                </div>
            )}
        </div>
    );
}
