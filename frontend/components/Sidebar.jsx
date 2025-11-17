import React from 'react';
import PandaLogo from './icons/PandaLogo';
import DashboardIcon from './icons/DashboardIcon';
import EarningIcon from './icons/EarningIcon';
import MembersIcon from './icons/MembersIcon';

const NavItem = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-brand-red text-white' : 'text-brand-light-gray hover:bg-brand-gray hover:text-white'
            }`}
        >
            <span className="w-6 h-6 mr-3">{icon}</span>
            <span className="font-semibold">{label}</span>
        </button>
    );
};

const Sidebar = ({ activePage, setActivePage }) => {
    const navItems = [
        { label: 'Dashboard', icon: <DashboardIcon /> },
        { label: 'Earning', icon: <EarningIcon /> },
        { label: 'Members', icon: <MembersIcon /> },
    ];

    return (
        <aside className="w-64 bg-brand-gray p-6 flex-shrink-0 flex-col hidden lg:flex">
            <div className="flex items-center justify-center mb-12">
                <PandaLogo className="h-16 w-16" />
            </div>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <NavItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        isActive={activePage === item.label}
                        onClick={() => setActivePage(item.label)}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;