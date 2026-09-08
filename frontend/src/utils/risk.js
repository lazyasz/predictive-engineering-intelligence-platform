/**
 * Risk display utilities.
 *
 * These are purely presentational helpers — they format values for display.
 * They do NOT calculate risk scores, predicted risk, or business impact.
 * All analytics values come from the service layer / FastAPI backend.
 */

/** Maps risk/severity level to a Tailwind text color class */
export function getRiskColor(level) {
  const colors = {
    critical: 'text-red-600',
    high: 'text-orange-500',
    medium: 'text-yellow-600',
    low: 'text-emerald-600',
    attention: 'text-amber-500',
  };
  return colors[level] || 'text-slate-500';
}

/** Maps risk/severity level to a Tailwind background color class */
export function getRiskBgColor(level) {
  const colors = {
    critical: 'bg-red-50 border-red-200',
    high: 'bg-orange-50 border-orange-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-emerald-50 border-emerald-200',
    attention: 'bg-amber-50 border-amber-200',
  };
  return colors[level] || 'bg-slate-50 border-slate-200';
}

/** Maps risk/severity level to a Tailwind badge color class */
export function getRiskBadgeColor(level) {
  const colors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    attention: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return colors[level] || 'bg-slate-100 text-slate-700 border-slate-200';
}

/** Returns a human-readable label for a risk level */
export function getRiskLabel(level) {
  const labels = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    attention: 'Attention',
  };
  return labels[level] || 'Unknown';
}

/** Formats a numeric score for display (1 decimal place) */
export function formatScore(score) {
  if (score == null) return '—';
  return Number(score).toFixed(1);
}
