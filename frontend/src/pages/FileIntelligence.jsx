import { useParams } from 'react-router-dom';
import { useFile } from '../hooks/useFile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileCode, Clock, Users, GitBranch, Shield, Target } from 'lucide-react';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import RiskIndicator from '../components/risk/RiskIndicator';
import { formatScore } from '../utils/risk';

export default function FileIntelligence() {
  const { id } = useParams();
  const { data, loading, error } = useFile(id);

  if (loading) return <LoadingState message="Loading file intelligence..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState title="File not found" />;

  return (
    <div>
      <PageHeader
        title={data.file}
        description={data.description}
      >
        <Badge variant={data.severity}>{data.severity}</Badge>
      </PageHeader>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Risk Score', value: formatScore(data.risk_score), icon: Shield },
          { label: 'Predicted Risk', value: formatScore(data.predicted_risk), icon: Target },
          { label: 'Complexity', value: data.complexity, icon: GitBranch },
          { label: 'Churn', value: data.churn, icon: Clock },
          { label: 'Lines of Code', value: data.lines_of_code?.toLocaleString(), icon: FileCode },
          { label: 'Contributors', value: data.contributors?.length, icon: Users },
        ].map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <metric.icon className="h-4 w-4 text-slate-400 mb-2" />
            <p className="text-lg font-bold text-slate-900">{metric.value}</p>
            <p className="text-xs text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk History */}
        <Card title="Risk History" subtitle="Risk score progression over time">
          {data.risk_history && data.risk_history.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.risk_history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }} />
                <Line type="monotone" dataKey="risk_score" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} name="Risk Score" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500">No history available.</p>
          )}
        </Card>

        {/* Risk Level + Details */}
        <Card title="Risk Assessment">
          <div className="space-y-4">
            <RiskIndicator level={data.severity} score={data.risk_score} />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Business Impact</p>
                <p className="font-semibold text-slate-800">{formatScore(data.business_impact)} / 10</p>
              </div>
              <div>
                <p className="text-slate-500">Remediation Effort</p>
                <p className="font-semibold text-slate-800">{formatScore(data.remediation_effort)} / 10</p>
              </div>
              <div>
                <p className="text-slate-500">Priority Score</p>
                <p className="font-semibold text-slate-800">{formatScore(data.priority_score)}</p>
              </div>
              <div>
                <p className="text-slate-500">Test Coverage</p>
                <p className="font-semibold text-slate-800">{data.test_coverage}%</p>
              </div>
              <div>
                <p className="text-slate-500">Defects</p>
                <p className="font-semibold text-slate-800">{data.defects}</p>
              </div>
              <div>
                <p className="text-slate-500">Debt Age</p>
                <p className="font-semibold text-slate-800">{data.debt_age} days</p>
              </div>
            </div>

            {/* Risk Factors */}
            {data.risk_factors && data.risk_factors.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Risk Factors</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.risk_factors.map((factor, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 border border-red-200">{factor}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card title="Recommendations" subtitle="Suggested remediation actions">
          <ul className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-slate-700">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
