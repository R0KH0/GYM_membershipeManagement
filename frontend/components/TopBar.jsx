import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { UserModal } from './UserModal';
import { useMobileMenu } from '../contexts/MobileMenuContext';
import { api } from '../src/api/axios';

export const TopBar = ({ title }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();
  const { toggle } = useMobileMenu();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("api/users/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.log("User not logged in");
      }
    };

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    fetchUser();

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("api/users/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-panda-border sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg border border-panda-border hover:bg-white/5 transition-colors"
          >
            <Icons.Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border border-panda-border hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-panda-red to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-neon">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <Icons.Down className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#151515] border border-panda-border rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-4 py-2 border-b border-panda-border mb-1">
                  <p className="text-sm text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

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
    </>
  );
};
