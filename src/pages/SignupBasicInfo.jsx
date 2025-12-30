import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupBasicInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const prevData = location.state || {};

    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        rsbsaIdBasic: '',
        tribe: '',
        streetSitio: '',
        barangay: '',
        province: '',
        cellphone: '',
        sex: '',
        dobMonth: '',
        dobDay: '',
        dobYear: '',
        civilStatus: '',
        ...prevData
    });

    const handleNext = () => {
        setError('');
        const requiredFields = [
            { key: 'lastName', label: 'Last Name' },
            { key: 'firstName', label: 'First Name' },
            { key: 'rsbsaIdBasic', label: 'RSBSA Number' },
            { key: 'barangay', label: 'Barangay' },
            { key: 'province', label: 'Province' }
        ];

        const missing = requiredFields.filter(field => !formData[field.key]?.trim());

        if (missing.length > 0) {
            setError(`Please fill in required fields: ${missing.map(f => f.label).join(', ')}`);
            return;
        }

        // Basic format checks
        if (formData.rsbsaIdBasic.length < 5) {
            setError("RSBSA Number must be at least 5 characters.");
            return;
        }

        navigate('/signup/farm-info', { state: formData });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            <Header
                title="Sign Up – Basic Information"
                showBack
                onBack={() => navigate('/login')}
            />

            <div className="flex-1 px-6 pt-2 pb-20 flex flex-col justify-center overflow-y-auto">
                <div className="flex flex-col justify-center min-h-full">
                    <div>
                        <div className="flex gap-3 mb-2">
                            <div className="w-[35%] flex flex-col items-center justify-center p-1">
                                <div className="w-full aspect-square rounded-full border-2 border-black flex justify-center items-center bg-white shadow-sm overflow-hidden text-center p-2">
                                    <User className="w-full h-full text-black opacity-80" />
                                </div>
                            </div>

                            {/* Right Column: Name Fields */}
                            <div className="w-[65%] flex flex-col gap-1.5 justify-center">
                                <Input className="grid-layout" placeholder="LAST NAME" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                <Input className="grid-layout" placeholder="FIRST NAME" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                <Input className="grid-layout" placeholder="MIDDLE NAME" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Input className="grid-layout" label="RSBSA Number" value={formData.rsbsaIdBasic} onChange={(e) => setFormData({ ...formData, rsbsaIdBasic: e.target.value })} />
                            <Input className="grid-layout" label="Tribe" value={formData.tribe} onChange={(e) => setFormData({ ...formData, tribe: e.target.value })} />
                            <Input className="grid-layout" label="Street/Sitio" value={formData.streetSitio} onChange={(e) => setFormData({ ...formData, streetSitio: e.target.value })} />
                            <Input className="grid-layout" label="Barangay" value={formData.barangay} onChange={(e) => setFormData({ ...formData, barangay: e.target.value })} />
                            <Input className="grid-layout" label="Province" value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} />
                            <Input className="grid-layout" label="Cellphone #" type="tel" value={formData.cellphone} onChange={(e) => setFormData({ ...formData, cellphone: e.target.value })} />
                        </div>

                        <div className="flex items-center mb-2 mt-2">
                            <label className="w-[35%] font-bold text-xs uppercase mr-2">SEX:</label>
                            <div className="flex gap-4">
                                {['Male', 'Female'].map(option => (
                                    <label key={option} className="flex items-center text-xs font-bold cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={formData.sex === option}
                                            onChange={() => setFormData({ ...formData, sex: option })}
                                            className="mr-1.5 border-black h-3 w-3 rounded-none accent-black" // Visual tweak to match mockup checkboxes
                                        />
                                        {option.toUpperCase()}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center mb-2">
                            <label className="w-[35%] font-bold text-xs uppercase mr-2">DATE OF BIRTH:</label>
                            <div className="flex gap-2 flex-1">
                                <input className="w-full p-1.5 bg-gray-200 rounded-sm text-xs text-center border-none font-bold" placeholder="MM" value={formData.dobMonth} onChange={(e) => setFormData({ ...formData, dobMonth: e.target.value })} />
                                <input className="w-full p-1.5 bg-gray-200 rounded-sm text-xs text-center border-none font-bold" placeholder="DD" value={formData.dobDay} onChange={(e) => setFormData({ ...formData, dobDay: e.target.value })} />
                                <input className="w-full p-1.5 bg-gray-200 rounded-sm text-xs text-center border-none font-bold" placeholder="YYYY" value={formData.dobYear} onChange={(e) => setFormData({ ...formData, dobYear: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex items-start mb-2">
                            <label className="w-[35%] font-bold text-xs uppercase mr-2 mt-1">CIVIL STATUS:</label>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                                {['SINGLE', 'MARRIED', 'WIDOW/ER', 'SEPARATED'].map((status) => (
                                    <label key={status} className="flex items-center text-[10px] font-bold cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={formData.civilStatus === status}
                                            onChange={() => setFormData({ ...formData, civilStatus: status })}
                                            className="mr-1.5 border-black h-3 w-3 rounded-none accent-black"
                                        />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        </div>
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
