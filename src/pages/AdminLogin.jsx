
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px'
        }}>
            <img
                src={logo}
                alt="Logo"
                style={{
                    width: '120px',
                    height: '120px',
                    marginBottom: '24px',
                    objectFit: 'contain'
                }}
            />

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '12px',
                    marginBottom: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '12px',
                    marginBottom: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            />

            <button
                onClick={() => navigate('/admin-dashboard')}
                style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '12px',
                    backgroundColor: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Login
            </button>
        </div>
    );
}
