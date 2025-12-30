import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [rsbsa, setRsbsa] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!rsbsa.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        const result = await login(rsbsa, password);
        setIsLoading(false);

        if (!result.success) {
            setError(result.error || "Login failed");
        }
    };

    return (
        <Layout className="justify-center items-center h-full overflow-hidden p-0 bg-farm bg-cover bg-center">
            <div className="flex-1 flex flex-col justify-center items-center mb-6">
                <img src={logo} alt="Norala Logo" className="w-[150px] h-[150px] object-contain mb-5 drop-shadow-md" />
                <h1 className="text-4xl font-bold text-primary drop-shadow-sm tracking-tight m-0">CropAid</h1>
                <p className="text-sm text-text-muted m-0 mt-1">Agricultural Reporting System</p>
            </div>

            <div className="w-[90%] max-w-[420px] bg-white p-6 rounded-md shadow-lg mb-0">
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                    <Input
                        label="Username or RSBSA Number"
                        value={rsbsa}
                        onChange={(e) => setRsbsa(e.target.value)}
                        placeholder="Enter Username or RSBSA"
                    />

                    <div className="mb-2">
                        <label className="block font-semibold text-sm text-text-main mb-1.5 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-10 rounded-sm border border-transparent bg-bg-surface text-base transition-all focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                                placeholder="Enter Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-0 cursor-pointer text-text-muted flex items-center justify-center"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm font-medium mb-3 bg-red-50 p-2 rounded text-center">{error}</div>}

                    <Button type="submit" className="mt-0" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </div>

            <div className="text-center m-0 mt-4 relative z-10">
                <button
                    type="button"
                    onClick={() => navigate('/signup/basic-info')}
                    className="text-primary font-bold cursor-pointer hover:underline m-0 bg-transparent border-none text-base"
                >
                    No account yet? Sign up
                </button>
                <p className="text-xs text-text-muted m-0 mt-2 text-center">Municipality of Norala</p>
            </div>
        </Layout>
    );
}
