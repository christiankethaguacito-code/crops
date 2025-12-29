
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportStatus() {
    const navigate = useNavigate();

    const itemStyle = {
        padding: '12px',
        backgroundColor: '#FFFFFF',
        marginBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    };

    return (
        <div style={{
            padding: '16px',
            minHeight: '100vh',
            backgroundColor: '#F5F5F5'
        }}>
            <div style={{ padding: '16px' }}>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#2E7D32',
                    marginBottom: '16px'
                }}>Report Status</h1>


                <div style={itemStyle}>
                    <span style={{ fontWeight: 'bold' }}>Flood Report</span>
                    <span style={{ color: '#FF9800' }}>Status: Under Review</span>
                </div>


                <div style={itemStyle}>
                    <span style={{ fontWeight: 'bold' }}>Pest Infestation Report</span>
                    <span style={{ color: '#2196F3' }}>Status: Submitted</span>
                </div>


                <div style={itemStyle}>
                    <span style={{ fontWeight: 'bold' }}>Drought Report</span>
                    <span style={{ color: '#4CAF50' }}>Status: Resolved</span>
                </div>

                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '20px',
                        backgroundColor: '#E0E0E0',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
