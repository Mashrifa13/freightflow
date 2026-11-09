
import React, { useState } from 'react';
import { Ship, Eye, EyeOff, LockKeyhole, User, ArrowRight } from 'lucide-react';

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username.trim() || !password) {
            setError('Please enter your username and password.');
            return;
        }

        const success = onLogin(username, password, rememberMe);

        if (!success) {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1B2A] flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md">

                {/* Logo and Branding */}
                <div className="text-center mb-8">


                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Freight<span className="text-blue-500">Flow</span>
                    </h1>

                    <p className="text-gray-400 text-sm mt-2">
                        Pricing Management System
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#14243A] border border-slate-700/60 rounded-2xl p-7 sm:p-9 shadow-2xl">

                    <div className="mb-7">
                        <h2 className="text-2xl font-semibold text-white">
                            Welcome Back
                        </h2>

                        <p className="text-sm text-gray-400 mt-2">
                            Sign in to access your FreightFlow workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    className="w-full bg-[#0F1B2A] border border-slate-600 rounded-xl py-3 pl-11 pr-4 text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full bg-[#0F1B2A] border border-slate-600 rounded-xl py-3 pl-11 pr-12 text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 accent-blue-600 rounded"
                                />
                                Remember me
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        {/* Sign In */}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20"
                        >
                            Sign In
                            <ArrowRight size={17} />
                        </button>

                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-7">
                    FreightFlow Pricing Management System
                </p>

            </div>
        </div>
    );
}

export default LoginPage;
