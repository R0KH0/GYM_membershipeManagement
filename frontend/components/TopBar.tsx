import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { UserModal } from './UserModal';
import { useMobileMenu } from '../contexts/MobileMenuContext';

interface TopBarProps {
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { toggle } = useMobileMenu();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // TODO: Clear auth tokens
    navigate('/');
  };

  // Mock Notifications Data
  const notifications = [
    { id: 1, text: "New member Sarah Connor joined", time: "10 min ago", type: "member" },
    { id: 2, text: "Payment received from John Wick", time: "1 hour ago", type: "payment" },
    { id: 3, text: "System maintenance scheduled", time: "Yesterday", type: "system" },
    { id: 4, text: "Membership expiring: Bruce Wayne", time: "2 days ago", type: "alert" },
  ];

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
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5 hidden md:block">Welcome back, Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 ${isNotificationsOpen ? 'text-white bg-white/5' : ''}`}
            >
              <span className="absolute top-2 right-2 w-2 h-2 bg-panda-red rounded-full shadow-[0_0_8px_rgba(230,0,0,0.8)] animate-pulse"></span>
              <Icons.Brand className="w-6 h-6" /> {/* Headphones Logo as Notification Icon */}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[#151515] border border-panda-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-4 py-3 border-b border-panda-border flex justify-between items-center bg-[#111]">
                  <h3 className="font-semibold text-white text-sm">Notifications</h3>
                  <button className="text-xs text-panda-red hover:text-red-400 transition-colors">Mark all read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-3 border-b border-panda-border/30 hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                          notif.type === 'payment' ? 'bg-green-500' : 
                          notif.type === 'member' ? 'bg-blue-500' : 
                          notif.type === 'alert' ? 'bg-panda-red' : 'bg-gray-500'
                        }`} />
                        <div>
                          <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{notif.text}</p>
                          <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-[#111] text-center border-t border-panda-border">
                  <button className="text-xs text-gray-400 hover:text-white transition-colors w-full py-1">View All Notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
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
              <div className="absolute right-0 mt-3 w-48 bg-[#151515] border border-panda-border rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
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

      <UserModal isOpen={isCreateUserOpen} onClose={() => setIsCreateUserOpen(false)} mode="add" />
    </>
  );
};