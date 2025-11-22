import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Earnings } from './pages/Earnings';
import { Members } from './pages/Members';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { MobileMenuContext } from './contexts/MobileMenuContext';

// Layout component to wrap protected routes with Sidebar
const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const close = () => setIsMobileMenuOpen(false);

  return (
    <MobileMenuContext.Provider value={{ isOpen: isMobileMenuOpen, toggle, close }}>
      <div className="flex min-h-screen bg-black text-white selection:bg-panda-red selection:text-white relative">
        <Sidebar />
        
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
            onClick={close}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 w-full">
          <Outlet />
        </div>
      </div>
    </MobileMenuContext.Provider>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/members" element={<Members />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;