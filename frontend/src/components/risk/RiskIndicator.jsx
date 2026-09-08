import { getRiskColor, getRiskLabel, formatScore } from '../../utils/risk';

export default function RiskIndicator({ level, score }) {
  const barWidths = { critical: 'w-full', high: 'w-3/4', medium: 'w-1/2', low: 'w-1/4' };
  const barColors = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-emerald-500' };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full ${barColors[level] || 'bg-slate-300'} ${barWidths[level] || 'w-1/2'}`} />
        </div>
      </div>
      <span className={`text-xs font-semibold min-w-[48px] text-right ${getRiskColor(level)}`}>
        {formatScore(score)}
      </span>
      <span className={`text-xs font-medium ${getRiskColor(level)}`}>
        {getRiskLabel(level)}
      </span>
    </div>
  );
}
