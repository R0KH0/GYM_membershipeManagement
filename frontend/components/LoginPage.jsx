import React, { useState } from 'react';
import PandaLogo from './icons/Logo';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (email && password) {
            onLogin();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-black p-4">
            <div className="w-full max-w-sm text-center">
                <PandaLogo className="h-24 w-24 mx-auto mb-8" />
                <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
                <p className="text-brand-light-gray mb-8">Enter your email to sign in</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="email@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-brand-gray border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-brand-gray border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-brand-red text-white font-bold rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-brand-black"
                    >
                        Sign up with email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;