
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'white'
        }}>
            <img
                src={logo}
                alt="CropAid Logo"
                style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
}
