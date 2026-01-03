import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { MapPin, Crosshair, X } from 'lucide-react';
import { noralaBoundaryCoordinates } from '../config/noralaBoundary';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom farm marker
const farmIcon = new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
        background-color: #16a34a;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    ">🌾</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

// Map click handler component
function LocationPicker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return position ? <Marker position={position} icon={farmIcon} /> : null;
}

export default function SignupFarmInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const prevData = location.state || {};

    const [error, setError] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const [formData, setFormData] = useState({
        farmSitio: '',
        farmBarangay: '',
        farmMunicipality: 'Norala',
        farmProvince: 'South Cotabato',
        farmLatitude: null,
        farmLongitude: null,
        isConfirmed: false,
        ...prevData
    });

    const [mapPosition, setMapPosition] = useState(
        formData.farmLatitude && formData.farmLongitude 
            ? [formData.farmLatitude, formData.farmLongitude]
            : null
    );

    // Norala center
    const defaultCenter = [6.5294, 124.6647];

    const getCurrentLocation = () => {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = [position.coords.latitude, position.coords.longitude];
                    setMapPosition(newPos);
                    setFormData({
                        ...formData,
                        farmLatitude: position.coords.latitude,
                        farmLongitude: position.coords.longitude
                    });
                    setGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setGettingLocation(false);
                    setError('Could not get your location. Please try pinning manually.');
                },
                { enableHighAccuracy: true }
            );
        } else {
            setGettingLocation(false);
            setError('Geolocation is not supported by your browser');
        }
    };

    const handleMapConfirm = () => {
        if (mapPosition) {
            setFormData({
                ...formData,
                farmLatitude: mapPosition[0],
                farmLongitude: mapPosition[1]
            });
        }
        setShowMap(false);
    };

    const clearLocation = () => {
        setMapPosition(null);
        setFormData({
            ...formData,
            farmLatitude: null,
            farmLongitude: null
        });
    };

    const handleNext = () => {
        setError('');
        if (!formData.farmBarangay) {
            setError("Please select a Barangay.");
            return;
        }
        if (!formData.farmSitio) {
            setError("Please select a Sitio/Purok.");
            return;
        }

        // Check Boundaries - at least one directional boundary should theoretically strictly be there, but maybe optional? 
        // User asked for "required fields". Usually boundaries are important. Let's enforce North at least? No, let's just warn generic blankness if all empty.
        // Actually, let's just stick to the specific "Municipality/Province/Barangay" which are core location. 

        if (!formData.isConfirmed) {
            setError("Please confirm the information is true and correct.");
            return;
        }
        navigate('/signup/app-info', { state: formData });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            <Header
                title="Sign Up – FARM"
                showBack
                onBack={() => navigate('/signup/basic-info', { state: formData })}
            />

            <div className="flex-1 px-6 pt-2 pb-20 flex flex-col justify-center overflow-y-auto">
                {/* ... existing content ... */}
                <div className="w-full mx-auto flex flex-col justify-center h-full">
                    {/* ... (rest of the form remains same, just need to update footer) ... */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-center mb-4 uppercase tracking-wide">Farm Location</h3>
                        <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-center">
                                <label className="w-[35%] font-bold text-xs uppercase mr-2 text-right">Sitio/Purok</label>
                                <select
                                    className="flex-1 p-2 rounded-sm border-none bg-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
                                    value={formData.farmSitio}
                                    onChange={(e) => setFormData({ ...formData, farmSitio: e.target.value })}
                                >
                                    <option value="">Select Sitio</option>
                                    <option value="Purok 1">Purok 1</option>
                                    <option value="Purok 2">Purok 2</option>
                                    <option value="Purok 3">Purok 3</option>
                                    <option value="Sitio A">Sitio A</option>
                                    <option value="Sitio B">Sitio B</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label className="w-[35%] font-bold text-xs uppercase mr-2 text-right">Barangay</label>
                                <select
                                    className="flex-1 p-2 rounded-sm border-none bg-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
                                    value={formData.farmBarangay}
                                    onChange={(e) => setFormData({ ...formData, farmBarangay: e.target.value })}
                                >
                                    <option value="">Select Barangay</option>
                                    <option value="San Jose">San Jose</option>
                                    <option value="Liberty">Liberty</option>
                                    <option value="Esperanza">Esperanza</option>
                                    <option value="San Miguel">San Miguel</option>
                                    <option value="Poblacion">Poblacion</option>
                                </select>
                            </div>
                            <Input className="grid-layout opacity-70 pointer-events-none bg-gray-100" label="Municipality" value="Norala" readOnly />
                            <Input className="grid-layout opacity-70 pointer-events-none bg-gray-100" label="Province" value="South Cotabato" readOnly />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-center mb-4 uppercase tracking-wide">Farm Location Pin (Optional)</h3>
                        <p className="text-xs text-gray-500 text-center mb-4">
                            Pin your exact farm location on the map for more accurate reporting
                        </p>
                        
                        {formData.farmLatitude && formData.farmLongitude ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Location Pinned</p>
                                            <p className="text-xs text-green-600">
                                                {formData.farmLatitude.toFixed(6)}, {formData.farmLongitude.toFixed(6)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(true)}
                                            className="text-xs text-green-700 underline"
                                        >
                                            Change
                                        </button>
                                        <button
                                            type="button"
                                            onClick={clearLocation}
                                            className="text-xs text-red-600 underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowMap(true)}
                                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <MapPin size={20} />
                                <span className="font-medium">Pin Farm Location on Map</span>
                            </button>
                        )}
                    </div>

                    <div className="mb-4 px-2">
                        <label className="flex items-start text-[10px] font-bold leading-tight cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={formData.isConfirmed}
                                onChange={(e) => setFormData({ ...formData, isConfirmed: e.target.checked })}
                                className="mt-0.5 mr-2 border-black h-3 w-3 rounded-none accent-black"
                            />
                            I hereby certify that the above information are true and correct to the best of my knowledge.
                        </label>
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            {showMap && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg h-[500px] flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold">Pin Your Farm Location</h3>
                            <button onClick={() => setShowMap(false)} className="p-1">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-3 bg-blue-50 text-blue-800 text-xs">
                            Tap on the map to pin your farm location, or use the button below to get your current location.
                        </div>

                        <div className="flex-1 relative">
                            <MapContainer
                                center={mapPosition || defaultCenter}
                                zoom={14}
                                className="h-full w-full"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap'
                                />
                                <Polygon
                                    positions={noralaBoundaryCoordinates}
                                    pathOptions={{
                                        color: '#1B5E20',
                                        weight: 4,
                                        opacity: 1,
                                        fillColor: '#4CAF50',
                                        fillOpacity: 0.2
                                    }}
                                />
                                <LocationPicker position={mapPosition} setPosition={setMapPosition} />
                            </MapContainer>
                        </div>

                        <div className="p-4 border-t space-y-3">
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={gettingLocation}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                <Crosshair size={18} className={gettingLocation ? 'animate-spin' : ''} />
                                {gettingLocation ? 'Getting Location...' : 'Use My Current Location'}
                            </button>
                            <button
                                type="button"
                                onClick={handleMapConfirm}
                                disabled={!mapPosition}
                                className="w-full p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 z-20 w-full bg-white">
                {error && <div className="text-red-500 text-[10px] font-bold text-center py-2 bg-red-50 border-t border-red-100">{error}</div>}
                <Button variant="secondary" onClick={handleNext} className="w-full py-4 text-black font-bold uppercase text-lg bg-primary-bg border-t border-primary-light/50 rounded-none shadow-none hover:bg-primary-bg/90 m-0">
                    NEXT
                </Button>
            </div>
        </div>
    );
}
