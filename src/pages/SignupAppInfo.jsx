import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupAppInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const prevData = location.state || {};

    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '', // Should be password/confirm password ideally, but following existing fields
        confirmPassword: '',
        ...prevData
    });

    const handleNext = () => {
        setError('');
        const requiredAppFields = [
            { key: 'username', label: 'Username' },
            { key: 'email', label: 'Email' },
            { key: 'password', label: 'Password' },
            { key: 'confirmPassword', label: 'Confirm Password' }
        ];

        const missing = requiredAppFields.filter(field => !formData[field.key]);

        if (missing.length > 0) {
            setError(`Please fill in required fields: ${missing.map(f => f.label).join(', ')}`);
            return;
        }

        // Email Format Validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        navigate('/signup/summary', { state: formData });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            <Header
                title="Sign Up – App Information"
                showBack
                onBack={() => navigate('/signup/farm-info', { state: formData })}
            />

            <div className="flex-1 px-6 pt-2 pb-20 flex flex-col justify-center overflow-y-auto">
                <div className="w-full mx-auto flex flex-col justify-center min-h-full max-w-[400px]">
                    <div className="flex flex-col gap-3">
                        <Input label="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                        <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-20 w-full bg-white">
                {error && <div className="text-red-500 text-[10px] font-bold text-center py-2 bg-red-50 border-t border-red-100">{error}</div>}
                <Button variant="secondary" onClick={handleNext} className="w-full py-4 text-black font-bold uppercase text-lg bg-primary-bg border-t border-primary-light/50 rounded-none shadow-none hover:bg-primary-bg/90 m-0">
                    NEXT
                </Button>
            </div>
        </div>
    );
}
