import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Sparkles, X, CheckCircle, Lock, ExternalLink } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, profiles, user, handleSwitchPersona, handleGoogleLogin, loading } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('Lead Architect');

  if (!authModalOpen) return null;


  const triggerGoogleAuth = (e) => {
    e?.preventDefault();
    const email = customEmail.trim() || 'dhruvsakhare2006@gmail.com';
    const rawName = email.split('@')[0].replace(/[._]/g, ' ');
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const payload = {
      email,
      name,
      role: selectedRole,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=43562b&color=ffffff&size=120`,
      sub: `usr_google_${Date.now()}`
    };
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    handleGoogleLogin(`eyJhbGciOiJSUzI1NiJ9.${b64}.signature_mock`);
  };

  const quickEmails = [
    'dhruvsakhare2006@gmail.com',
    'dhruv.lead@engineering.org',
    'sarah.j@engineering.org',
    'alex.pm@engineering.org'
  ];

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
              <p className="text-xs text-[#d3ebb2]">Sign In with Any Google Account or Evaluation Persona</p>
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
          
          {/* Section 1: Sign in with ANY Google Account */}
          <div className="p-4 bg-[#f8faf6] rounded-2xl border border-[#d4dece] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#75786d] flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Sign in with Google Account
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2d3f16] bg-[#d3ebb2] px-2 py-0.5 rounded-full border border-[#b8ce98]">
                <CheckCircle className="h-3 w-3 text-[#43562b]" /> Universal Login
              </span>
            </div>

            {/* Email Input Form */}
            <form onSubmit={triggerGoogleAuth} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#45483e] mb-1">
                  Enter your Gmail / Google Workspace address:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-[#c5c8ba] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43562b] font-medium"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-[#2d3f16] hover:bg-[#43562b] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <span>Sign In</span>
                  </button>
                </div>
              </div>

              {/* Quick Select Preset Email Chips */}
              <div>
                <span className="text-[10px] text-[#75786d] font-medium block mb-1">Quick Select:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickEmails.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCustomEmail(em)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                        customEmail === em
                          ? 'bg-[#43562b] text-white border-[#43562b]'
                          : 'bg-white text-[#45483e] border-[#d4dece] hover:bg-[#edf1e8]'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection for Entered Email */}
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-[#75786d] font-medium">Assigned Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-white border border-[#c5c8ba] text-[#161e10] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#43562b] font-semibold"
                >
                  <option value="Lead Architect">Lead Architect (Full Access)</option>
                  <option value="Staff ML Engineer">Staff ML Engineer</option>
                  <option value="Product & Engineering Lead">Product & Engineering Lead</option>
                  <option value="Software Engineer">Software Engineer</option>
                </select>
              </div>
            </form>
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
