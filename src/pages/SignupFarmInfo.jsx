import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupFarmInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const prevData = location.state || {};

    const [formData, setFormData] = useState({
        ...prevData,
        sitio: '',
        barangay: '',
        municipality: '',
        province: '',
        boundaryNorth: '',
        boundarySouth: '',
        boundaryEast: '',
        boundaryWest: '',
        isConfirmed: false
    });

    const handleNext = () => {
        if (!formData.isConfirmed) {
            alert("Please confirm the information is true and correct.");
            return;
        }
        navigate('/signup/app-info', { state: formData });
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            <Header title="Sign Up – FARM" showBack />

            <div className="flex-1 px-6 pt-2 pb-20 flex flex-col justify-center overflow-y-auto">
                <div className="w-full mx-auto flex flex-col justify-center h-full">
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-center mb-4 uppercase tracking-wide">Farm Location</h3>
                        <div className="flex flex-col gap-1.5">
                            <Input className="grid-layout" label="Sitio/Purok" value={formData.sitio} onChange={(e) => setFormData({ ...formData, sitio: e.target.value })} />
                            <Input className="grid-layout" label="Barangay" value={formData.barangay} onChange={(e) => setFormData({ ...formData, barangay: e.target.value })} />
                            <Input className="grid-layout" label="Municipality" value={formData.municipality} onChange={(e) => setFormData({ ...formData, municipality: e.target.value })} />
                            <Input className="grid-layout" label="Province" value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-center mb-4 uppercase tracking-wide">Boundaries</h3>
                        <div className="flex flex-col gap-1.5">
                            <Input className="grid-layout" label="North" value={formData.boundaryNorth} onChange={(e) => setFormData({ ...formData, boundaryNorth: e.target.value })} />
                            <Input className="grid-layout" label="South" value={formData.boundarySouth} onChange={(e) => setFormData({ ...formData, boundarySouth: e.target.value })} />
                            <Input className="grid-layout" label="East" value={formData.boundaryEast} onChange={(e) => setFormData({ ...formData, boundaryEast: e.target.value })} />
                            <Input className="grid-layout" label="West" value={formData.boundaryWest} onChange={(e) => setFormData({ ...formData, boundaryWest: e.target.value })} />
                        </div>
                    </div>

                    <div className="mb-4 px-2">
                        <label className="flex items-start text-[10px] font-bold leading-tight cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={formData.isConfirmed}
                                onChange={(e) => setFormData({ ...formData, isConfirmed: e.target.checked })}
                                className="mt-0.5 mr-2 border-black h-3 w-3 rounded-none accent-black"
                            />
                            I hereby certify that the above information are true and correct to the best of my knowledge.
                        </label>
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
