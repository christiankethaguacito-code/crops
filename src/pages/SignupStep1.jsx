
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupStep1() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        rsbsa: '',
        password: '',
        confirmPassword: ''
    });

    const handleNext = () => {
        navigate('/signup/step2', { state: formData });
    };

    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: 'white' }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2E7D32',
                marginBottom: '24px'
            }}>Create Account</h1>

            <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Email</p>
            <input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            />

            <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>RSBSA Number</p>
            <input
                type="text"
                placeholder="Optional"
                value={formData.rsbsa}
                onChange={(e) => setFormData({ ...formData, rsbsa: e.target.value })}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            />

            <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Password</p>
            <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            />

            <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Confirm Password</p>
            <input
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '24px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            />

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
                    cursor: 'pointer'
                }}
            >
                Next
            </button>
        </div>
    );
}
