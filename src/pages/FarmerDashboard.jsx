
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Activity } from 'lucide-react';

export default function FarmerDashboard() {
    const navigate = useNavigate();

    return (
        <div style={{
            padding: '16px',
            backgroundColor: '#FAFAFA',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#212121',
                marginBottom: '16px'
            }}>Farmer Dashboard</h1>


            <div
                onClick={() => navigate('/report')}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>

                    <FileText size={24} color="#2E7D32" style={{ marginRight: '12px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Report Crop Issue</h2>
                </div>
                <p style={{ color: '#757575', margin: 0 }}>Flood or pest damage</p>
            </div>


            <div
                onClick={() => navigate('/status')}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Activity size={24} color="#1565C0" style={{ marginRight: '12px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>View Report Status</h2>
                </div>
                <p style={{ color: '#757575', margin: 0 }}>Track submitted reports</p>
            </div>


            <button
                onClick={() => navigate('/login')}
                style={{
                    backgroundColor: '#B71C1C',
                    color: 'white',
                    padding: '14px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: 'auto'
                }}
            >
                Logout
            </button>

        </div>
    );
}
