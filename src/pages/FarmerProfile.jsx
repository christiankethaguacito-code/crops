import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth, API_URL } from '../context/AuthContext';
import { User, MapPin, Phone, Mail, Calendar, Edit2, Save, X, Camera, Crosshair } from 'lucide-react';
import { MOCK_DATA } from '../config/mockData';
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
function LocationPicker({ position, setPosition, isEditing }) {
    useMapEvents({
        click(e) {
            if (isEditing) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            }
        },
    });
    return position ? <Marker position={position} icon={farmIcon} /> : null;
}

export default function FarmerProfile() {
    const navigate = useNavigate();
    const { user, token, isMockMode, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLocationMap, setShowLocationMap] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        cellphone: '',
        rsbsaId: '',
        barangay: '',
        municipality: '',
        province: '',
        farmSize: '',
        farmBarangay: '',
        farmLatitude: null,
        farmLongitude: null,
        profilePicture: null
    });

    const [editedProfile, setEditedProfile] = useState({ ...profile });
    const [mapPosition, setMapPosition] = useState(null);

    // Norala center
    const defaultCenter = [6.5294, 124.6647];

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);

            if (isMockMode) {
                const username = user?.username || 'james';
                const farmer = MOCK_DATA.getFarmerDashboard(username);
                setProfile({
                    firstName: farmer.profile?.name?.split(' ')[0] || 'James',
                    lastName: farmer.profile?.name?.split(' ').slice(1).join(' ') || 'Machico',
                    email: `${username}@example.com`,
                    cellphone: '09123456789',
                    rsbsaId: farmer.profile?.rsbsa || '012-345-6789',
                    barangay: farmer.profile?.address_barangay || 'San Jose',
                    municipality: 'Norala',
                    province: 'South Cotabato',
                    farmSize: '2.5',
                    farmBarangay: farmer.profile?.address_barangay || 'San Jose',
                    farmLatitude: 6.5294,
                    farmLongitude: 124.6647,
                    profilePicture: null
                });
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/farmer/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch profile');
                
                const data = await response.json();
                setProfile({
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    email: data.email || '',
                    cellphone: data.cellphone || '',
                    rsbsaId: data.rsbsa_id || '',
                    barangay: data.address_barangay || '',
                    municipality: data.address_municipality || 'Norala',
                    province: data.address_province || 'South Cotabato',
                    farmSize: data.farm_size_hectares?.toString() || '',
                    farmBarangay: data.farm_barangay || '',
                    farmLatitude: data.farm_latitude || null,
                    farmLongitude: data.farm_longitude || null,
                    profilePicture: data.profile_picture || null
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, isMockMode, user]);

    useEffect(() => {
        setEditedProfile({ ...profile });
        if (profile.farmLatitude && profile.farmLongitude) {
            setMapPosition([profile.farmLatitude, profile.farmLongitude]);
        }
    }, [profile]);

    const handleEdit = () => {
        setIsEditing(true);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile({ ...profile });
        if (profile.farmLatitude && profile.farmLongitude) {
            setMapPosition([profile.farmLatitude, profile.farmLongitude]);
        }
        setError('');
    };

    const handleProfilePictureClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedProfile({ ...editedProfile, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const getCurrentLocation = () => {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = [position.coords.latitude, position.coords.longitude];
                    setMapPosition(newPos);
                    setEditedProfile({
                        ...editedProfile,
                        farmLatitude: position.coords.latitude,
                        farmLongitude: position.coords.longitude
                    });
                    setGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setGettingLocation(false);
                    setError('Could not get your location');
                },
                { enableHighAccuracy: true }
            );
        }
    };

    const handleLocationConfirm = () => {
        if (mapPosition) {
            setEditedProfile({
                ...editedProfile,
                farmLatitude: mapPosition[0],
                farmLongitude: mapPosition[1]
            });
        }
        setShowLocationMap(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        if (isMockMode) {
            setTimeout(() => {
                setProfile({ ...editedProfile });
                setIsEditing(false);
                setSuccess('Profile updated successfully!');
                setSaving(false);
            }, 1000);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/farmer/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cellphone: editedProfile.cellphone,
                    address_barangay: editedProfile.barangay,
                    farm_latitude: editedProfile.farmLatitude,
                    farm_longitude: editedProfile.farmLongitude,
                    profile_picture: editedProfile.profilePicture
                })
            });

            if (!response.ok) throw new Error('Failed to update profile');

            setProfile({ ...editedProfile });
            setIsEditing(false);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <Header title="My Profile" showBack onBack={() => navigate(-1)} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Header title="My Profile" showBack onBack={() => navigate(-1)} />

            <div className="flex-1 overflow-y-auto pb-24">
                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {/* Profile Header */}
                <div className="bg-primary text-white p-6 pb-16 relative">
                    <div className="flex items-center gap-4">
                        <div 
                            className={`relative w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden ${isEditing ? 'cursor-pointer' : ''}`}
                            onClick={handleProfilePictureClick}
                        >
                            {(isEditing ? editedProfile.profilePicture : profile.profilePicture) ? (
                                <img 
                                    src={isEditing ? editedProfile.profilePicture : profile.profilePicture} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                                    <User size={40} className="text-white" />
                                </div>
                            )}
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Camera size={24} className="text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
                            <p className="text-white/80 text-sm">RSBSA: {profile.rsbsaId}</p>
                            {isEditing && (
                                <p className="text-white/60 text-xs mt-1">Tap photo to change</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="px-4 -mt-10">
                    <div className="bg-white rounded-xl shadow-lg p-5">
                        {/* Action Buttons */}
                        <div className="flex justify-end mb-4">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        {/* Personal Info Section */}
                        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3">Personal Information</h3>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail size={18} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-sm font-medium">{profile.email || 'Not set'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Phone size={18} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Contact Number</p>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editedProfile.cellphone}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, cellphone: e.target.value })}
                                            className="w-full text-sm font-medium bg-white border border-gray-200 rounded px-2 py-1 mt-1"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium">{profile.cellphone || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <MapPin size={18} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Address</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedProfile.barangay}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, barangay: e.target.value })}
                                            className="w-full text-sm font-medium bg-white border border-gray-200 rounded px-2 py-1 mt-1"
                                            placeholder="Barangay"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium">
                                            {[profile.barangay, profile.municipality, profile.province].filter(Boolean).join(', ') || 'Not set'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Farm Info Section */}
                        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3">Farm Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <MapPin size={18} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Farm Location</p>
                                    <p className="text-sm font-medium">{profile.farmBarangay || 'Not set'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar size={18} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Farm Size</p>
                                    <p className="text-sm font-medium">{profile.farmSize ? `${profile.farmSize} hectares` : 'Not set'}</p>
                                </div>
                            </div>

                            {/* Farm Location Map */}
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                <div className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">Farm GPS Location</p>
                                            {(isEditing ? editedProfile.farmLatitude : profile.farmLatitude) ? (
                                                <p className="text-xs text-green-600 font-medium">
                                                    {(isEditing ? editedProfile.farmLatitude : profile.farmLatitude).toFixed(6)}, 
                                                    {(isEditing ? editedProfile.farmLongitude : profile.farmLongitude).toFixed(6)}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-500">Not pinned</p>
                                            )}
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={() => setShowLocationMap(true)}
                                            className="text-xs text-primary font-medium underline"
                                        >
                                            {editedProfile.farmLatitude ? 'Change' : 'Pin Location'}
                                        </button>
                                    )}
                                </div>
                                
                                {(isEditing ? editedProfile.farmLatitude : profile.farmLatitude) && (
                                    <div className="h-40">
                                        <MapContainer
                                            center={[
                                                isEditing ? editedProfile.farmLatitude : profile.farmLatitude,
                                                isEditing ? editedProfile.farmLongitude : profile.farmLongitude
                                            ]}
                                            zoom={15}
                                            className="h-full w-full"
                                            scrollWheelZoom={false}
                                            dragging={false}
                                            zoomControl={false}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Marker 
                                                position={[
                                                    isEditing ? editedProfile.farmLatitude : profile.farmLatitude,
                                                    isEditing ? editedProfile.farmLongitude : profile.farmLongitude
                                                ]} 
                                                icon={farmIcon} 
                                            />
                                        </MapContainer>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-4 p-4 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>

            {/* Location Map Modal */}
            {showLocationMap && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg h-[500px] flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold">Pin Your Farm Location</h3>
                            <button onClick={() => setShowLocationMap(false)} className="p-1">
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
                                <LocationPicker position={mapPosition} setPosition={setMapPosition} isEditing={true} />
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
                                onClick={handleLocationConfirm}
                                disabled={!mapPosition}
                                className="w-full p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
