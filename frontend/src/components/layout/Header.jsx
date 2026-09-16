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
  const { user, isLoggedIn, setAuthModalOpen, setSettingsOpen, handleLogout, notification } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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
        
        {/* Left: Brand Icon + Title */}
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
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
            {/* Jira Integration */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#161e10] shadow-[0_2px_6px_-1px_rgba(45,63,22,0.06)] hover:bg-[#f8faf6] transition cursor-pointer"
              title="Jira Cloud Hub"
            >
              <Layers className="w-3.5 h-3.5 text-[#43562b]" />
              <span>Jira</span>
            </button>

            {/* Notion Integration */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#161e10] shadow-[0_2px_6px_-1px_rgba(45,63,22,0.06)] hover:bg-[#f8faf6] transition cursor-pointer"
              title="Notion Workspace Sync"
            >
              <Database className="w-3.5 h-3.5 text-[#384a24]" />
              <span>Notion</span>
            </button>
          </div>

          {/* User Profile / Sign In Section */}
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 bg-white py-1 pl-1 pr-3 rounded-full shadow-[0_2px_6px_-1px_rgba(45,63,22,0.08)] border border-[#d4dece] hover:border-[#b8ce98] transition cursor-pointer"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=43562b&color=ffffff`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#43562b]/30"
                />
                <div className="flex flex-col text-left hidden sm:flex">
                  <span className="text-xs font-bold text-[#161e10] leading-tight truncate max-w-[110px]">{user.name}</span>
                  <span className="text-[10px] text-[#556437] font-semibold leading-tight truncate max-w-[110px]">{user.role}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#75786d] transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Popover */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#d4dece] p-4 z-50 animate-fade-in text-left">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#e5ebe0]">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#d4dece]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#161e10] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#75786d] truncate">{user.email}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-bold px-2 py-0.5 bg-[#eef7e0] text-[#2d3f16] rounded-full">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setAuthModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#161e10] hover:bg-[#f4f7f0] rounded-xl transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#43562b]" /> Switch Persona / Account
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#75786d]" />
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setSettingsOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#161e10] hover:bg-[#f4f7f0] rounded-xl transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[#43562b]" /> API Keys & Integrations
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#75786d]" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#e5ebe0]">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-xl transition cursor-pointer border border-[#ffdad6]"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2d3f16] hover:bg-[#43562b] text-white text-xs font-bold rounded-full shadow-md transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In with Google</span>
            </button>
          )}

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

