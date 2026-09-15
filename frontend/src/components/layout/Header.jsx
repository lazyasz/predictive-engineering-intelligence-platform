import React from 'react';
import { Menu, Bell, Settings, ShieldCheck, Layers, Database, User, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title, onMenuClick }) {
  const { user, integrations, setAuthModalOpen, setSettingsOpen, notification } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200">
        
        {/* Left: Menu & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
          </div>
        </div>

        {/* Right: Ecosystem Status + User Profile + Settings */}
        <div className="flex items-center gap-3">
          
          {/* Live Integration Status Badges */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs">
            {/* Google Auth Indicator */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition"
              title="Google OAuth Status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-[11px]">Google SSO</span>
            </button>

            <span className="text-slate-300">|</span>

            {/* Jira Indicator */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition"
              title="Jira Cloud Integration"
            >
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-semibold text-[11px]">Jira</span>
            </button>

            <span className="text-slate-300">|</span>

            {/* Notion Indicator */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition"
              title="Notion Workspace Hub"
            >
              <Database className="h-3.5 w-3.5 text-slate-800" />
              <span className="font-semibold text-[11px]">Notion</span>
            </button>
          </div>

          {/* User Persona & Profile Pill */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full transition shadow-2xs cursor-pointer"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-7 h-7 rounded-full object-cover border border-indigo-200"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Dhruv Patel'}</p>
              <p className="text-[10px] font-semibold text-indigo-600 leading-tight">{user?.role || 'Lead Architect'}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            aria-label="Settings & Integrations"
            title="Enterprise Integrations & API Keys"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Dynamic Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl border border-slate-700 animate-slideUp">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{notification.msg}</span>
        </div>
      )}
    </>
  );
}
