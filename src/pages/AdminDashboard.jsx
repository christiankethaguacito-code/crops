
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div style={{
            padding: '16px',
            minHeight: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h1 style={{ marginBottom: '24px', color: '#2E7D32' }}>Admin Dashboard</h1>

            <button
                onClick={() => navigate('/admin/farm-reports')}
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
                Farm Reports
            </button>

            <button
                onClick={() => navigate('/admin/daily-summary')}
                style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Daily Summary
            </button>

            <button
                onClick={() => navigate('/login')}
                style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#B71C1C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: '24px'
                }}
            >
                Logout
            </button>

        </div>
    );
}
