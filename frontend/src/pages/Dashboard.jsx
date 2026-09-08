import { Activity, AlertTriangle, AlertOctagon, Flame, Briefcase } from 'lucide-react';
import { useMetrics } from '../hooks/useMetrics';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import KpiCard from '../components/kpi/KpiCard';
import Badge from '../components/ui/Badge';
import RiskDistribution from '../charts/RiskDistribution';
import RiskTrend from '../charts/RiskTrend';

export default function Dashboard() {
  const { data, loading, error } = useMetrics();

  if (loading) return <LoadingState message="Loading dashboard metrics..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState title="No metrics available" />;

  return (
    <div>
      <PageHeader
        title="Engineering Intelligence Dashboard"
        description="Real-time overview of technical debt health, risk predictions, and priorities."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard
          title="Technical Debt Health"
          value={`${data.technical_debt_health.score}/100`}
          trend={data.technical_debt_health.trend}
          icon={Activity}
          status={data.technical_debt_health.status}
        />
        <KpiCard
          title="Critical Items"
          value={data.critical_items.count}
          trend={data.critical_items.trend}
          icon={AlertOctagon}
          status={data.critical_items.status}
        />
        <KpiCard
          title="High Risk Items"
          value={data.high_risk_items.count}
          trend={data.high_risk_items.trend}
          icon={AlertTriangle}
          status={data.high_risk_items.status}
        />
        <KpiCard
          title="Predicted Hotspots"
          value={data.predicted_hotspots.count}
          trend={data.predicted_hotspots.trend}
          icon={Flame}
          status={data.predicted_hotspots.status}
        />
        <KpiCard
          title="Business Critical Items"
          value={data.business_critical_items.count}
          trend={data.business_critical_items.trend}
          icon={Briefcase}
          status={data.business_critical_items.status}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Risk Distribution" subtitle="Current risk category breakdown">
          <RiskDistribution data={data.risk_distribution} />
        </Card>
        <Card title="Risk Trend" subtitle="Risk score progression across sprints">
          <RiskTrend data={data.risk_trend} />
        </Card>
      </div>

      {/* Recent High Priority */}
      <Card title="Recent High-Priority Items" subtitle="Items requiring immediate attention">
        {data.recent_high_priority && data.recent_high_priority.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-semibold text-slate-600">File</th>
                  <th className="text-center py-2 px-3 font-semibold text-slate-600">Risk Score</th>
                  <th className="text-center py-2 px-3 font-semibold text-slate-600">Priority</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-600">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recent_high_priority.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-xs text-slate-800">{item.file}</td>
                    <td className="py-2 px-3 text-center font-medium text-slate-800">{item.risk_score}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant={item.priority_level}>{item.priority_level}</Badge>
                    </td>
                    <td className="py-2 px-3 text-slate-600">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No high-priority items at this time.</p>
        )}
      </Card>
    </div>
  );
}
