import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data available', message = 'There is nothing to display at the moment.', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
