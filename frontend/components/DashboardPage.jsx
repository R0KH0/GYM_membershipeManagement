import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardContent from './content/DashboardContent';
import EarningContent from './content/EarningContent';
import MembersContent from './content/MembersContent';

const DashboardPage = () => {
    const [activePage, setActivePage] = useState('Dashboard');

    const renderContent = () => {
        switch (activePage) {
            case 'Dashboard':
                return <DashboardContent />;
            case 'Earning':
                return <EarningContent />;
            case 'Members':
                return <MembersContent />;
            case 'Radio':
                 return <MembersContent />; // Reusing MembersContent for Radio as per UI similarity
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="flex min-h-screen bg-brand-black">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;