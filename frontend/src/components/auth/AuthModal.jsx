import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Sparkles, X, CheckCircle, Lock, ExternalLink } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, profiles, user, handleSwitchPersona, handleGoogleLogin, loading } = useAuth();
  const [customEmail, setCustomEmail] = useState('');

  if (!authModalOpen) return null;

  const triggerGoogleServerAuth = () => {
    // Redirects to backend /api/v1/auth/google/login for production server-side code exchange
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Identity & RBAC Access Portal</h3>
              <p className="text-xs text-slate-300">Server-Side Google OAuth 2.0 & Evaluation Personas</p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Section 1: Google OAuth SSO */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Option 1: Google Workspace OAuth
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="h-3 w-3" /> Server-Side Flow Ready
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={triggerGoogleServerAuth}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs transition hover:shadow cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google Account (Production Flow)</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 ml-1" />
              </button>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  placeholder="Or enter sandbox email..."
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  onClick={triggerMockGoogleLogin}
                  disabled={loading}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Quick Sign-In
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Switch Evaluation Personas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Option 2: Switch Evaluation Personas (1-Click)
              </span>
              <span className="text-[11px] text-slate-400">Viva & Defense Ready</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(profiles).map(([key, prof]) => {
                const isActive = user?.email === prof.email;
                return (
                  <button
                    key={key}
                    onClick={() => handleSwitchPersona(key)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800 truncate">{prof.name}</p>
                        {isActive && <UserCheck className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] font-semibold text-indigo-600 truncate">{prof.role}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{prof.team}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Active Permissions Pill */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="h-3.5 w-3.5 text-slate-400" /> Active Permissions:
            </span>
            <div className="flex flex-wrap gap-1">
              {user?.permissions?.map((perm) => (
                <span key={perm} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono">
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
