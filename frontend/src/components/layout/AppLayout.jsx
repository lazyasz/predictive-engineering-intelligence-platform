import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AuthModal from '../auth/AuthModal';
import SettingsDrawer from '../integrations/SettingsDrawer';
import ScanRepoModal from '../common/ScanRepoModal';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f6f0] text-[#161e10]">
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onOpenScanModal={() => setScanModalOpen(true)}
      />
      <div className="lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          onOpenScanModal={() => setScanModalOpen(true)}
        />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
      <AuthModal />
      <SettingsDrawer />
      <ScanRepoModal 
        isOpen={scanModalOpen} 
        onClose={() => setScanModalOpen(false)} 
      />
    </div>
  );
}
