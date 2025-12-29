
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Confirmation() {
    const navigate = useNavigate();

    return (
        <div style={{
            padding: '24px',
            minHeight: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#2E7D32',
                marginBottom: '24px',
                textAlign: 'center'
            }}>Report Submitted Successfully!</h1>

            <button
                onClick={() => navigate('/status')}
                style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    backgroundColor: '#E0E0E0',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                View Report Status
            </button>

            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    backgroundColor: '#E0E0E0',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Back to Dashboard
            </button>
        </div>
    );
}
