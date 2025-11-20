import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { CreateUserModal } from './CreateUserModal';

interface TopBarProps {
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // TODO: Clear auth tokens
    navigate('/');
  };

  return (
    <>
      <header className="h-20 px-8 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-panda-border sticky top-0 z-40">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">Welcome back, Admin</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications Placeholder */}
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-panda-red rounded-full"></span>
            <Icons.Brand className="w-5 h-5 rotate-45" /> {/* Using generic brand icon as bell placeholder */}
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border border-panda-border hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-panda-red to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-neon">
                A
              </div>
              <Icons.Down className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#151515] border border-panda-border rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-panda-border mb-1">
                  <p className="text-sm text-white font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@ironpanda.com</p>
                </div>
                <button
                  onClick={() => {
                    setIsCreateUserOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-panda-red flex items-center gap-2 transition-colors"
                >
                  <Icons.CreateUser className="w-4 h-4" />
                  Create User
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-red-500 flex items-center gap-2 transition-colors"
                >
                  <Icons.Logout className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <CreateUserModal isOpen={isCreateUserOpen} onClose={() => setIsCreateUserOpen(false)} />
    </>
  );
};