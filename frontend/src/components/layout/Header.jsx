import { Menu, Bell, Settings } from 'lucide-react';

export default function Header({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
