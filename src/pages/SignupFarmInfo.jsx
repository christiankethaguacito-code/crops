import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupFarmInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const prevData = location.state || {};

    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        farmSitio: '',
        farmBarangay: '',
        farmMunicipality: 'Norala',
        farmProvince: 'South Cotabato',
        boundaryNorth: '',
        boundarySouth: '',
        boundaryEast: '',
        boundaryWest: '',
        isConfirmed: false,
        ...prevData
    });

    const handleNext = () => {
        setError('');
        if (!formData.farmBarangay) {
            setError("Please select a Barangay.");
            return;
        }
        if (!formData.farmSitio) {
            setError("Please select a Sitio/Purok.");
            return;
        }

        // Check Boundaries - at least one directional boundary should theoretically strictly be there, but maybe optional? 
        // User asked for "required fields". Usually boundaries are important. Let's enforce North at least? No, let's just warn generic blankness if all empty.
        // Actually, let's just stick to the specific "Municipality/Province/Barangay" which are core location. 

        if (!formData.isConfirmed) {
            setError("Please confirm the information is true and correct.");
            return;
        }
        navigate('/signup/app-info', { state: formData });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            <Header
                title="Sign Up – FARM"
                showBack
                onBack={() => navigate('/signup/basic-info', { state: formData })}
            />

            <div className="flex-1 px-6 pt-2 pb-20 flex flex-col justify-center overflow-y-auto">
                {/* ... existing content ... */}
                <div className="w-full mx-auto flex flex-col justify-center h-full">
                    {/* ... (rest of the form remains same, just need to update footer) ... */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-center mb-4 uppercase tracking-wide">Farm Location</h3>
                        <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-center">
                                <label className="w-[35%] font-bold text-xs uppercase mr-2 text-right">Sitio/Purok</label>
                                <select
                                    className="flex-1 p-2 rounded-sm border-none bg-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
                                    value={formData.farmSitio}
                                    onChange={(e) => setFormData({ ...formData, farmSitio: e.target.value })}
                                >
                                    <option value="">Select Sitio</option>
                                    <option value="Purok 1">Purok 1</option>
                                    <option value="Purok 2">Purok 2</option>
                                    <option value="Purok 3">Purok 3</option>
                                    <option value="Sitio A">Sitio A</option>
                                    <option value="Sitio B">Sitio B</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label className="w-[35%] font-bold text-xs uppercase mr-2 text-right">Barangay</label>
                                <select
                                    className="flex-1 p-2 rounded-sm border-none bg-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
                                    value={formData.farmBarangay}
                                    onChange={(e) => setFormData({ ...formData, farmBarangay: e.target.value })}
                                >
                                    <option value="">Select Barangay</option>
                                    <option value="San Jose">San Jose</option>
                                    <option value="Liberty">Liberty</option>
                                    <option value="Esperanza">Esperanza</option>
                                    <option value="San Miguel">San Miguel</option>
                                    <option value="Poblacion">Poblacion</option>
                                </select>
                            </div>
                            <Input className="grid-layout opacity-70 pointer-events-none bg-gray-100" label="Municipality" value="Norala" readOnly />
                            <Input className="grid-layout opacity-70 pointer-events-none bg-gray-100" label="Province" value="South Cotabato" readOnly />
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

            <div className="fixed bottom-0 left-0 right-0 z-20 w-full bg-white">
                {error && <div className="text-red-500 text-[10px] font-bold text-center py-2 bg-red-50 border-t border-red-100">{error}</div>}
                <Button variant="secondary" onClick={handleNext} className="w-full py-4 text-black font-bold uppercase text-lg bg-primary-bg border-t border-primary-light/50 rounded-none shadow-none hover:bg-primary-bg/90 m-0">
                    NEXT
                </Button>
            </div>
        </div>
    );
}
