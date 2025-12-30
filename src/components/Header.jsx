
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = false, className = '', onBack }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className={`flex items-center p-4 bg-primary-bg border-b border-primary-light/20 ${className}`}>
            {showBack && (
                <button onClick={handleBack} className="mr-3 p-1 rounded-full hover:bg-black/5 border-none bg-transparent cursor-pointer flex items-center justify-center">
                    <ChevronLeft size={24} className="text-black" />
                </button>
            )}
            <h1 className="text-lg font-bold text-black m-0 flex-1 text-center pr-8">{title}</h1>
        </div>
    );
}
