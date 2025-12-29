
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';

export default function SignupSummary() {
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state || {};
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = () => {
        // Simulate API call
        console.log("Registering User Data:", formData);
        setIsSuccess(true);

        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-primary-bg animate-fade-in relative z-50">
                <div className="bg-white p-8 rounded-full shadow-lg mb-6">
                    <Check size={64} className="text-primary stroke-[4]" />
                </div>
                <h1 className="text-2xl font-bold text-primary mb-2 uppercase tracking-wider">Success!</h1>
                <p className="text-black font-medium text-center px-8">
                    Your account has been successfully created.
                    <br />
                    Redirecting to login...
                </p>
            </div>
        );
    }

    const Section = ({ title, data }) => (
        <div className="mb-6 border-b border-gray-200 pb-4 last:border-0 last:mb-0 last:pb-0">
            <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider bg-primary/10 inline-block px-2 py-1 rounded-sm">{title}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {data.map(({ label, value }) => value ? (
                    <React.Fragment key={label}>
                        <div className="text-gray-500 font-medium text-[11px] uppercase self-center">{label}:</div>
                        <div className="font-bold text-black break-words">{value.toString()}</div>
                    </React.Fragment>
                ) : null)}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            <Header title="Sign Up – Review" showBack />

            <div className="flex-1 px-6 pt-4 pb-24 overflow-y-auto">

                <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
                    <Section
                        title="Basic Information"
                        data={[
                            { label: 'Name', value: `${formData.lastName || ''}, ${formData.firstName || ''} ${formData.middleName || ''}`.trim() },
                            { label: 'Farmer ID', value: formData.farmerId },
                            { label: 'Tribe', value: formData.tribe },
                            { label: 'Address', value: `${formData.streetSitio || ''}, ${formData.barangay || ''}, ${formData.province || ''}`.trim() },
                            { label: 'Sex', value: formData.sex },
                            { label: 'Birthdate', value: `${formData.dobMonth}/${formData.dobDay}/${formData.dobYear}` },
                            { label: 'Civil Status', value: formData.civilStatus },
                            { label: 'Phone', value: formData.cellphone },
                        ]}
                    />

                    <Section
                        title="Farm Information"
                        data={[
                            { label: 'Farm Location', value: `${formData.sitio || ''}, ${formData.barangay || ''}, ${formData.municipality || ''}, ${formData.province || ''}`.trim() },
                            { label: 'Boundaries', value: `N: ${formData.boundaryNorth}, S: ${formData.boundarySouth}, E: ${formData.boundaryEast}, W: ${formData.boundaryWest}` },
                        ]}
                    />

                    <Section
                        title="Account Info"
                        data={[
                            { label: 'RSBSA #', value: formData.rsbsa },
                            { label: 'Email', value: formData.email },
                        ]}
                    />
                </div>

                <div className="mt-6 text-center text-xs text-gray-500 px-4">
                    By clicking Register, you confirm that all information provided is accurate and you agree to our Terms of Service.
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-20 w-full">
                <Button variant="primary" onClick={handleRegister} className="w-full py-4 text-white font-bold uppercase text-lg bg-primary border-t border-primary-light/50 rounded-none shadow-none hover:bg-primary/90 m-0">
                    REGISTER
                </Button>
            </div>
        </div>
    );
}
