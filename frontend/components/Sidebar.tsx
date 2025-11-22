import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from './Icons';
import { useMobileMenu } from '../contexts/MobileMenuContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { isOpen, close } = useMobileMenu();

  const isActive = (route: string) => {
    return path === route || (route === '/members' && path.startsWith('/members')) || (route === '/users' && path.startsWith('/users'));
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
    { name: 'Members', path: '/members', icon: Icons.Members },
    { name: 'Users', path: '/users', icon: Icons.SystemUsers },
    { name: 'Earnings', path: '/earnings', icon: Icons.Earnings },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-panda-border flex flex-col transition-transform duration-300 ease-in-out
      md:translate-x-0 md:static md:h-screen md:sticky md:top-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Brand / Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-panda-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-panda-card rounded-full flex items-center justify-center border border-panda-border shadow-neon">
              <Icons.Brand className="text-panda-red w-6 h-6" />
            </div>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide">IRON<span className="text-panda-red">PANDA</span></h1>
            <p className="text-xs text-gray-500">Manager Pro</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button onClick={close} className="md:hidden text-gray-500 hover:text-white">
          <Icons.Close className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={close}
            className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-panda-red text-white shadow-[0_0_15px_rgba(230,0,0,0.4)] border border-transparent'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-white'
              }`}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};