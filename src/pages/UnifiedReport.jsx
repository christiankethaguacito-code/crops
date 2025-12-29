
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnifiedReport() {
    const navigate = useNavigate();

    return (
        <div style={{
            padding: '24px',
            minHeight: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h1 style={{ marginBottom: '24px', color: '#2E7D32', fontSize: '24px' }}>Select Report Type</h1>

            <button
                onClick={() => navigate('/report/pest')}
                style={{
                    width: '100%',
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Report Pest Issue
            </button>

            <button
                onClick={() => navigate('/report/flood')}
                style={{
                    width: '100%',
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Report Flood Damage
            </button>

            <button
                onClick={() => navigate('/report/pest')}
                style={{
                    width: '100%',
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Report Pest & Flood
            </button>

            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#E0E0E0',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: 'auto'
                }}
            >
                Back to Dashboard
            </button>
        </div>
    );
}
