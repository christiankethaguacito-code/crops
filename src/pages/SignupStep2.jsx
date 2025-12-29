
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SignupStep2() {
    const navigate = useNavigate();
    const location = useLocation();
    const prevData = location.state || {};

    const [formData, setFormData] = useState({
        ...prevData,
        fullName: '',
        farmerId: '',
        address: '',
        contact: '',
        dob: '',
        sex: '',
        tribe: '',
        civilStatus: ''
    });

    const handleNext = () => {
        navigate('/signup/step3', { state: formData });
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    };

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '4px',
        display: 'block'
    };

    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: 'white' }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2E7D32',
                marginBottom: '24px'
            }}>Personal Information</h1>

            <label style={labelStyle}>Full Name</label>
            <input type="text" placeholder="Juan Dela Cruz" style={inputStyle}
                value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />

            <label style={labelStyle}>Farmer ID</label>
            <input type="text" placeholder="Optional" style={inputStyle}
                value={formData.farmerId} onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })} />

            <label style={labelStyle}>Address</label>
            <input type="text" placeholder="Barangay / Municipality" style={inputStyle}
                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

            <label style={labelStyle}>Contact Number</label>
            <input type="tel" placeholder="09XXXXXXXXX" style={inputStyle}
                value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />

            <label style={labelStyle}>Date of Birth</label>
            <input type="date" placeholder="DD-MM-YYYY" style={inputStyle}
                value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />

            <label style={labelStyle}>Sex</label>
            <select style={inputStyle} value={formData.sex} onChange={(e) => setFormData({ ...formData, sex: e.target.value })}>
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>

            <label style={labelStyle}>Tribe</label>
            <input type="text" placeholder="If applicable" style={inputStyle}
                value={formData.tribe} onChange={(e) => setFormData({ ...formData, tribe: e.target.value })} />

            <label style={labelStyle}>Civil Status</label>
            <select style={inputStyle} value={formData.civilStatus} onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}>
                <option value="">Select Civil Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
            </select>

            <button
                onClick={handleNext}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '8px'
                }}
            >
                Next
            </button>
        </div>
    );
}
