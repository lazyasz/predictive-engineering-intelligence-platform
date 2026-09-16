import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Sparkles, X, CheckCircle, Lock, ExternalLink } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, profiles, user, handleSwitchPersona, handleGoogleLogin, loading } = useAuth();
  const [customEmail, setCustomEmail] = useState('');

  if (!authModalOpen) return null;

  const triggerGoogleServerAuth = () => {
    window.location.href = `${API_BASE_URL}/api/v1/auth/google/login`;
  };

  const triggerMockGoogleLogin = () => {
    const email = customEmail || 'dhruv.patel@engineering.org';
    const payload = {
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      sub: 'google_oauth_verified_2026'
    };
    const b64 = btoa(JSON.stringify(payload));
    handleGoogleLogin(`eyJhbGciOiJSUzI1NiJ9.${b64}.signature_mock`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161e10]/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#d4dece] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#2d3f16] via-[#43562b] to-[#1e2a0f] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-[#d3ebb2]" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Identity & RBAC Access Portal</h3>
              <p className="text-xs text-[#d3ebb2]">Server-Side Google OAuth 2.0 & Evaluation Personas</p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Section 1: Google OAuth SSO */}
          <div className="p-4 bg-[#f8faf6] rounded-2xl border border-[#d4dece]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#75786d]">
                Option 1: Google Workspace OAuth
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2d3f16] bg-[#d3ebb2] px-2.5 py-0.5 rounded-full border border-[#b8ce98]">
                <CheckCircle className="h-3 w-3 text-[#43562b]" /> Server-Side Flow Ready
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={triggerGoogleServerAuth}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-[#edf1e8] text-[#161e10] text-xs font-bold rounded-xl border border-[#c5c8ba] shadow-xs transition hover:shadow cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google Account (Production Flow)</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#75786d] ml-1" />
              </button>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  placeholder="Or enter evaluation sandbox email..."
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2 bg-white border border-[#c5c8ba] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43562b]"
                />
                <button
                  onClick={triggerMockGoogleLogin}
                  disabled={loading}
                  className="px-4 py-2 bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] text-xs font-bold rounded-xl transition cursor-pointer border border-[#c5c8ba]"
                >
                  Quick Auth
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Switch Evaluation Personas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#75786d]">
                Option 2: Switch Evaluation Personas (1-Click)
              </span>
              <span className="text-[10px] font-mono font-bold text-[#556437] bg-[#e8f1db] px-2 py-0.5 rounded-full">
                Defense & Viva Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(profiles).map(([key, prof]) => {
                const isActive = user?.email === prof.email;
                return (
                  <button
                    key={key}
                    onClick={() => handleSwitchPersona(key)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-[#eef7e0] border-[#43562b] ring-2 ring-[#43562b]/20 shadow-xs'
                        : 'bg-white border-[#d4dece] hover:border-[#b8ce98] hover:bg-[#f8faf6]'
                    }`}
                  >
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#d4dece]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#161e10] truncate">{prof.name}</p>
                        {isActive && <UserCheck className="h-3.5 w-3.5 text-[#43562b] flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] font-semibold text-[#556437] truncate">{prof.role}</p>
                      <p className="text-[10px] text-[#75786d] truncate mt-0.5">{prof.team}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Permissions Footer */}
          <div className="pt-3 border-t border-[#e5ebe0] flex items-center justify-between text-xs text-[#75786d] flex-wrap gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="h-3.5 w-3.5 text-[#43562b]" /> Active Permissions:
            </span>
            <div className="flex flex-wrap gap-1">
              {user?.permissions?.map((perm) => (
                <span key={perm} className="text-[10px] px-2 py-0.5 bg-[#edf1e8] text-[#2d3f16] rounded-md font-mono font-semibold">
                  {perm}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
