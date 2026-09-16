import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Settings, 
  Shield, 
  Layers, 
  Database, 
  ChevronDown, 
  GitBranch, 
  Command, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ onMenuClick, onOpenScanModal }) {
  const { user, setAuthModalOpen, setSettingsOpen, notification } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    if (query.includes('hotspot') || query.includes('smell') || query.includes('god')) {
      navigate('/hotspots');
    } else if (query.includes('predict') || query.includes('defect') || query.includes('ml')) {
      navigate('/predictions');
    } else if (query.includes('matrix') || query.includes('priorit') || query.includes('jira')) {
      navigate('/priorities');
    } else if (query.includes('copilot') || query.includes('refactor') || query.includes('ai')) {
      navigate('/copilot');
    } else {
      navigate('/dashboard');
    }
    setSearchQuery('');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Remediation Matrix', path: '/priorities' },
    { name: 'Code Hotspots', path: '/hotspots' },
    { name: 'ML Predictions', path: '/predictions' },
    { name: 'AI Copilot', path: '/copilot' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-[#edf1e8]/95 backdrop-blur-xl border-b border-[#d4dece] shadow-[0_4px_24px_-4px_rgba(45,63,22,0.06)]">
        
        {/* Left: Brand Icon + Title (visible on mobile / tablet) */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-xl text-[#45483e] hover:bg-[#e5ebe0] transition"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#43562b] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-xl">hub</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[#161e10] tracking-tight leading-none">PEI Platform</span>
              <span className="text-[10px] font-mono text-[#75786d] uppercase tracking-wider font-semibold">Intelligence Mesh</span>
            </div>
          </div>
        </div>

        {/* Center: Top Pill Navigation for Desktop */}
        <div className="hidden xl:flex items-center bg-[#dce6d0]/60 p-1.5 rounded-full shadow-[inset_0_2px_4px_0_rgba(45,63,22,0.05)] border border-[#c5c8ba]/50">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#43562b] text-white shadow-[0_4px_12px_rgba(45,63,22,0.3)]'
                      : 'text-[#45483e] hover:text-[#161e10] hover:bg-[#e8f1db]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Integrations & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Omni Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-[#dce6d0]/60 rounded-full px-3.5 py-1.5 border border-[#c5c8ba]/50 shadow-[inset_0_2px_4px_0_rgba(45,63,22,0.04)] focus-within:ring-2 focus-within:ring-[#43562b] transition">
            <Search className="w-4 h-4 text-[#75786d] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search telemetry, modules..."
              className="bg-transparent border-none text-xs text-[#161e10] placeholder-[#75786d] focus:outline-none w-36 lg:w-48"
            />
            <span className="bg-white font-mono text-[10px] text-[#75786d] px-1.5 py-0.5 rounded-md shadow-2xs font-semibold">
              ⌘K
            </span>
          </form>

          {/* Live Ecosystem Badges */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#dce6d0]/40 p-1 rounded-full border border-[#c5c8ba]/40">
            {/* Google OAuth Status */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#161e10] shadow-[0_2px_6px_-1px_rgba(45,63,22,0.06)] hover:bg-[#f8faf6] transition"
              title="Google SSO Authentication"
            >
              <Shield className="w-3.5 h-3.5 text-[#556437]" />
              <span>Google SSO</span>
            </button>

            {/* Jira Integration */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#161e10] shadow-[0_2px_6px_-1px_rgba(45,63,22,0.06)] hover:bg-[#f8faf6] transition"
              title="Jira Cloud Hub"
            >
              <Layers className="w-3.5 h-3.5 text-[#43562b]" />
              <span>Jira</span>
            </button>

            {/* Notion Integration */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#161e10] shadow-[0_2px_6px_-1px_rgba(45,63,22,0.06)] hover:bg-[#f8faf6] transition"
              title="Notion Workspace Sync"
            >
              <Database className="w-3.5 h-3.5 text-[#384a24]" />
              <span>Notion</span>
            </button>
          </div>

          {/* User Profile Pill */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 bg-white py-1 pl-1 pr-3 rounded-full shadow-[0_2px_6px_-1px_rgba(45,63,22,0.08)] border border-[#d4dece] hover:border-[#b8ce98] transition cursor-pointer"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Dhruv Patel'}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#43562b]/30"
            />
            <div className="flex flex-col text-left hidden sm:flex">
              <span className="text-xs font-bold text-[#161e10] leading-tight">{user?.name || 'Dhruv Patel'}</span>
              <span className="text-[10px] text-[#556437] font-semibold leading-tight">{user?.role || 'Lead Architect'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#75786d]" />
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl text-[#75786d] hover:text-[#161e10] hover:bg-[#e5ebe0] transition cursor-pointer"
            aria-label="Settings & Integrations"
            title="Integrations & API Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Dynamic Toast Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#1e2a0f] text-white text-xs font-semibold rounded-2xl shadow-2xl border border-[#43562b] animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-[#d3ebb2] animate-pulse"></span>
          <span>{notification.msg}</span>
        </div>
      )}
    </>
  );
}
