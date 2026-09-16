import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  Flame,
  Activity,
  Bot,
  Layers,
  GitBranch,
  ShieldCheck,
  Zap,
  Sliders,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', to: '/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'Simulator & Gates', to: '/simulator', icon: Sliders, badge: 'ROI' },
  { name: 'Debt Matrix', to: '/priorities', icon: Grid, badge: '5D' },
  { name: 'Code Hotspots', to: '/hotspots', icon: Flame, badge: 'AST' },
  { name: 'Telemetry & ML', to: '/predictions', icon: Activity, badge: 'SZZ' },
  { name: 'Data Lineage & Quality', to: '/data-quality', icon: ShieldCheck, badge: 'Audit' },
  { name: 'Copilot Refactor', to: '/copilot', icon: Bot, badge: 'AI' },
];


export default function Sidebar({ open, onClose, onOpenScanModal }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#161e10]/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#edf1e8]/90 backdrop-blur-xl border-r border-[#d4dece] transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 h-20 px-5 border-b border-[#d4dece]">
          <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-[#43562b] text-white shadow-md">
            <span className="material-symbols-outlined text-2xl">hub</span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#161e10] tracking-tight">PEI Platform</h1>
            <p className="text-[10px] font-mono text-[#556437] font-semibold leading-tight">Intelligence Mesh</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          <div>
            <span className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#75786d]">
              Decision Engine
            </span>
            <nav className="mt-2 space-y-1.5">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#43562b] text-white shadow-[0_4px_14px_rgba(45,63,22,0.3)]'
                        : 'text-[#45483e] hover:bg-[#e2ecd5] hover:text-[#161e10]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#d3ebb2] text-[#2d3f16]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Quick Repo Scan Trigger */}
          <div className="p-4 bg-white/90 rounded-2xl border border-[#d4dece] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#2d3f16]">
              <GitBranch className="w-4 h-4" />
              <span className="text-xs font-bold">Live GitHub Scanner</span>
            </div>
            <p className="text-[11px] text-[#75786d] leading-snug">
              Analyze AST metrics & ML risk for any public repository.
            </p>
            <button
              onClick={() => {
                if (onClose) onClose();
                if (onOpenScanModal) onOpenScanModal();
              }}
              className="w-full mt-1 py-2 px-3 bg-[#eef7e0] hover:bg-[#d3ebb2] text-[#2d3f16] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-[#c5c8ba]"
            >
              <Zap className="w-3.5 h-3.5 text-[#43562b]" />
              <span>Scan Repo AST</span>
            </button>
          </div>
        </div>

        {/* System Health Footer */}
        <div className="p-4 m-4 bg-white rounded-2xl border border-[#d4dece] shadow-[0_8px_24px_-4px_rgba(45,63,22,0.06)]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#161e10]">System Health</span>
            <span className="bg-[#d3ebb2] text-[#2d3f16] px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
              94.2%
            </span>
          </div>
          <div className="w-full bg-[#e5ebe0] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#43562b] h-full rounded-full w-[94.2%]"></div>
          </div>
          <p className="text-[10px] text-[#75786d] mt-2 leading-tight">
            AST defect triage verified across 48 microservices.
          </p>
        </div>
      </aside>
    </>
  );
}
