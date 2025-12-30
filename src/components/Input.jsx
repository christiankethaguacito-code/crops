
import React from 'react';

export default function Input({ label, type = 'text', value, onChange, placeholder, className = '', ...props }) {
    return (
        <div className={`${className.includes('grid-layout') ? 'flex items-center' : ''}`}>
            {label && (
                <label
                    className={`${className.includes('grid-layout')
                        ? 'w-[35%] font-bold text-[13px] uppercase mr-2'
                        : 'block font-semibold text-sm text-text-main mb-1.5 uppercase tracking-wide'}`}
                >
                    {label}:
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-2.5 rounded-sm bg-gray-200 border-none text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary/30 ${className.includes('grid-layout') ? 'flex-1 h-8 text-xs px-2' : 'p-3 border-transparent bg-bg-surface text-base focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10'}`}
                style={className.includes('grid-layout') ? { backgroundColor: '#E5E7EB' } : {}}
                {...props}
            />
        </div>
    );
}
