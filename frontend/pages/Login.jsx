import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: POST /api/auth/login
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-panda-red/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111] border border-panda-border rounded-2xl p-8 shadow-2xl relative z-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-panda-card rounded-full flex items-center justify-center border border-panda-border shadow-neon mb-4">
            <img src="/img/logo.png" alt="logo" className="text-panda-red w-15 h-15"/>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Icons.Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-panda-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-panda-red focus:ring-1 focus:ring-panda-red focus:outline-none transition-all placeholder-gray-700"
                placeholder="example@rokho.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Icons.Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-panda-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-panda-red focus:ring-1 focus:ring-panda-red focus:outline-none transition-all placeholder-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end">
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-panda-red text-white py-3 rounded-lg font-bold text-sm uppercase tracking-wider shadow-neon hover:bg-red-600 hover:shadow-[0_0_25px_rgba(230,0,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-panda-border text-center">
          <p className="text-sm text-gray-500">
            Proudly created by <a href="https://rokho.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-white cursor-pointer hover:text-panda-red transition-colors">Marwane Rokho</a>
          </p>
        </div>
      </div>
    </div>
  );
};