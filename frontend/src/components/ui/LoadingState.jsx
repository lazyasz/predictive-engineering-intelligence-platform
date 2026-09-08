import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}
