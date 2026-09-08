import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bug,
  TrendingUp,
  ListOrdered,
  Flame,
  Bot,
  Activity,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Technical Debt', to: '/debt', icon: Bug },
  { name: 'Predictions', to: '/predictions', icon: TrendingUp },
  { name: 'Priorities', to: '/priorities', icon: ListOrdered },
  { name: 'Hotspots', to: '/hotspots', icon: Flame },
  { name: 'AI Copilot', to: '/copilot', icon: Bot },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-800">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-600">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">PEI Platform</h1>
            <p className="text-[10px] text-slate-400 leading-tight">Engineering Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Analytics
          </p>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>v0.1.0 · Mock Data</span>
          </div>
        </div>
      </aside>
    </>
  );
}
