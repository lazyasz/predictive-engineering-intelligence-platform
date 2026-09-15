import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AuthModal from '../auth/AuthModal';
import SettingsDrawer from '../integrations/SettingsDrawer';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/debt': 'Technical Debt',
  '/predictions': 'Predictions',
  '/priorities': 'Priorities',
  '/hotspots': 'Hotspots',
  '/copilot': 'AI Copilot',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const basePath = '/' + location.pathname.split('/')[1];
  const title = pageTitles[basePath] || 'File Intelligence';

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <AuthModal />
      <SettingsDrawer />
    </div>
  );
}
