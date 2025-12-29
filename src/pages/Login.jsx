
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [rsbsa, setRsbsa] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if (rsbsa.trim() === '') {
            alert("Please enter an ID");
            return;
        }

        if (rsbsa.toLowerCase().includes('admin')) {
            navigate('/admin-dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F5F7F6',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px'
        }}>

            <img
                src={logo}
                alt="Norala Logo"
                style={{
                    width: '120px',
                    height: '120px',
                    marginBottom: '16px',
                    objectFit: 'contain'
                }}
            />


            <h1 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1B5E20',
                margin: '0 0 4px 0'
            }}>
                CropAid
            </h1>


            <p style={{
                fontSize: '14px',
                color: '#616161',
                margin: '0 0 32px 0'
            }}>
                Agricultural Reporting System
            </p>


            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                padding: '24px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <form onSubmit={handleLogin}>

                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            position: 'relative',
                            borderRadius: '12px',
                            border: '1px solid #757575',
                            padding: '2px'
                        }}>
                            <label style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '12px',
                                backgroundColor: 'white',
                                padding: '0 4px',
                                fontSize: '12px',
                                color: '#616161'
                            }}>RSBSA Number or Admin ID</label>
                            <input
                                type="text"
                                value={rsbsa}
                                onChange={(e) => setRsbsa(e.target.value)}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    padding: '16px 14px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </div>
                    </div>


                    <div style={{ marginBottom: '24px' }}>
                        <div style={{
                            position: 'relative',
                            borderRadius: '12px',
                            border: '1px solid #757575',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <label style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '12px',
                                backgroundColor: 'white',
                                padding: '0 4px',
                                fontSize: '12px',
                                color: '#616161'
                            }}>Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    padding: '16px 14px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    backgroundColor: 'transparent'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '12px',
                                    cursor: 'pointer',
                                    color: '#757575'
                                }}
                            >
                                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                            </button>
                        </div>
                    </div>


                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            height: '56px',
                            backgroundColor: '#2E7D32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '8px'
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>


            <p
                onClick={() => navigate('/signup/step1')}
                style={{
                    fontSize: '14px',
                    color: '#2E7D32',
                    marginTop: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                No account yet? Sign up
            </p>

            <p style={{
                fontSize: '12px',
                color: '#757575',
                marginTop: '12px'
            }}>
                Municipality of Norala
            </p>
        </div>
    );
}
