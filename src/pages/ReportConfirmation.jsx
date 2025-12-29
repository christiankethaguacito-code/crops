
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportConfirmation() {
    const navigate = useNavigate();

    return (
        <div style={{
            padding: '24px',
            minHeight: '100vh',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#2E7D32',
                marginBottom: '12px',
                textAlign: 'center'
            }}>Report Submitted</h1>

            <p style={{
                fontSize: '16sp', // React uses px or unitless, but 'sp' in XML. Using 16px.
                marginBottom: '24px',
                textAlign: 'center'
            }}>Your report has been successfully submitted.</p>

            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2E7D32', // Assuming primary color for standard button
                    color: 'white',
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
