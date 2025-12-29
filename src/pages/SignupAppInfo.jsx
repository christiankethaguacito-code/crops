import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupAppInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const prevData = location.state || {};

    const [formData, setFormData] = useState({
        ...prevData,
        email: '',
        rsbsa: '',
        password: '', // Should be password/confirm password ideally, but following existing fields
        confirmPassword: ''
    });

    const handleNext = () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        navigate('/signup/summary', { state: formData });
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            <Header title="Sign Up – App Information" showBack />

            <div className="flex-1 px-6 pt-2 pb-20 flex flex-col justify-center overflow-y-auto">
                <div className="w-full mx-auto flex flex-col justify-center min-h-full max-w-[400px]">
                    <div className="flex flex-col gap-3">
                        <Input label="RSBSA Number" value={formData.rsbsa} onChange={(e) => setFormData({ ...formData, rsbsa: e.target.value })} />
                        <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-20 w-full">
                <Button variant="secondary" onClick={handleNext} className="w-full py-4 text-black font-bold uppercase text-lg bg-primary-bg border-t border-primary-light/50 rounded-none shadow-none hover:bg-primary-bg/90 m-0">
                    NEXT
                </Button>
            </div>
        </div>
    );
}
