
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDailySummary() {
    const navigate = useNavigate();


    const summaries = [
        { id: 1, title: 'Daily Summary - Oct 27', count: 5 },
        { id: 2, title: 'Daily Summary - Oct 28', count: 8 },
        { id: 3, title: 'Daily Summary - Oct 29', count: 3 },
    ];

    return (
        <div style={{
            padding: '16px',
            minHeight: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Daily Report Summary</h1>

            <div style={{ flex: 1, marginBottom: '16px' }}>
                {summaries.map((summary) => (
                    <div key={summary.id} style={{
                        padding: '12px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <span>{summary.title}</span>
                        <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>{summary.count} Reports</span>
                    </div>
                ))}
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
                    cursor: 'pointer'
                }}
            >
                Home
            </button>
        </div>
    );
}
