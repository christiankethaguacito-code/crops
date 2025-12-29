
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SignupStep3() {
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state || {};

    const handleSubmit = () => {
        console.log("Submitting Registration", formData);
        navigate('/login');
    };

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#2E7D32',
                marginBottom: '24px'
            }}>Confirm Your Details</h1>

            <div id="tvSummary" style={{ marginBottom: '24px', width: '100%', textAlign: 'center' }}>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Full Name:</strong> {formData.fullName}</p>

            </div>

            <button
                onClick={handleSubmit}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '12px'
                }}
            >
                Submit Registration
            </button>

            <button
                onClick={() => navigate(-1)}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#E0E0E0',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Back
            </button>
        </div>
    );
}
