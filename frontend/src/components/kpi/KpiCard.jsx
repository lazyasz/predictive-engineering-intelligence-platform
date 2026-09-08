import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getRiskColor } from '../../utils/risk';

export default function KpiCard({ title, value, trend, icon: Icon, status = 'medium' }) {
  const isPositiveTrend = trend < 0;
  const isNeutral = trend === 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100">
          <Icon className={`h-5 w-5 ${getRiskColor(status)}`} />
        </div>
        {trend != null && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isNeutral ? 'text-slate-400' : isPositiveTrend ? 'text-emerald-600' : 'text-red-500'
          }`}>
            {isNeutral ? (
              <Minus className="h-3 w-3" />
            ) : isPositiveTrend ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            <span>{Math.abs(trend)}{typeof trend === 'number' && trend % 1 !== 0 ? '%' : ''}</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-0.5 text-xs text-slate-500">{title}</p>
      </div>
    </div>
  );
}
