
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminOrganizedReport() {
    const navigate = useNavigate();

    return (
        <div style={{
            padding: '16px',
            minHeight: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Organized Report Summary</h1>


                <button
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
                    Download
                </button>


                <button
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '12px',
                        marginTop: '20px',
                        backgroundColor: '#2E7D32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Download Report
                </button>
            </div>

            <button
                onClick={() => navigate('/admin-dashboard')}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#E0E0E0',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: 'auto'
                }}
            >
                Home
            </button>
        </div>
    );
}
