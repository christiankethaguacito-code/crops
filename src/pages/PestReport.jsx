
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PestReport() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate('/report-confirmation');
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    };

    return (
        <div style={{
            padding: '16px',
            minHeight: '100vh',
            backgroundColor: '#F5F5F5'
        }}>
            <div style={{ padding: '16px', backgroundColor: 'transparent' }}>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#2E7D32',
                    marginBottom: '16px'
                }}>Pest Infestation Report</h1>

                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Location" style={inputStyle} />
                    <input type="text" placeholder="Crop Planted" style={inputStyle} />
                    <input type="text" placeholder="Type of Pest" style={inputStyle} />
                    <input type="text" placeholder="Severity Level" style={inputStyle} />
                    <input type="text" placeholder="Estimated Damage" style={inputStyle} />

                    <button type="button" style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '12px',
                        backgroundColor: '#E0E0E0',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>Add Media</button>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '14px',
                        marginTop: '16px',
                        backgroundColor: '#2E7D32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>Submit</button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginTop: '12px',
                            backgroundColor: 'transparent',
                            border: '1px solid #757575',
                            color: '#757575',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
