import { useState, useEffect } from 'react';
import { getPriorities } from '../services/api';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PriorityMatrix from '../charts/PriorityMatrix';
import { formatScore } from '../utils/risk';

export default function Priorities() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getPriorities();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load priorities');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingState message="Loading priorities..." />;
  if (error) return <ErrorState message={error} />;
  if (!data || data.length === 0) return <EmptyState title="No priority data available" />;

  return (
    <div>
      <PageHeader
        title="Remediation Priorities"
        description="Prioritized technical debt items ranked by business impact, risk, and remediation effort."
      />

      <Card title="Priority Matrix" subtitle="Business Impact vs Remediation Effort (dot size = risk score)" className="mb-6">
        <PriorityMatrix data={data} />
      </Card>

      <Card title="Prioritized Items">
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-sm font-bold text-slate-600 shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-medium text-slate-800 truncate">{item.file}</p>
                  <Badge variant={item.priority_level}>{item.priority_level}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.recommendation}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>Priority: <strong className="text-slate-700">{formatScore(item.priority_score)}</strong></span>
                  <span>Risk: <strong className="text-slate-700">{formatScore(item.risk_score)}</strong></span>
                  <span>Impact: <strong className="text-slate-700">{formatScore(item.business_impact)}</strong></span>
                  <span>Effort: <strong className="text-slate-700">{formatScore(item.remediation_effort)}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
