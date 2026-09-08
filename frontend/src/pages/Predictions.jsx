import { usePredictions } from '../hooks/usePredictions';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import RiskTrend from '../charts/RiskTrend';
import { formatScore } from '../utils/risk';

export default function Predictions() {
  const { data, loading, error } = usePredictions();

  if (loading) return <LoadingState message="Loading predictions..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState title="No prediction data available" />;

  return (
    <div>
      <PageHeader
        title="Risk Predictions"
        description="AI-generated risk predictions for upcoming sprints and at-risk files."
      />

      <Card title="Risk Score Forecast" subtitle="Actual vs predicted risk across sprints" className="mb-6">
        <RiskTrend data={data.risk_trend} />
      </Card>

      <Card title="At-Risk Files" subtitle="Files predicted to increase in risk">
        {data.at_risk_files && data.at_risk_files.length > 0 ? (
          <div className="space-y-4">
            {data.at_risk_files.map((file) => (
              <div key={file.id} className="flex items-start justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                <div>
                  <p className="font-mono text-sm font-medium text-slate-800">{file.file}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>Current: <strong className="text-slate-700">{formatScore(file.current_risk)}</strong></span>
                    <span>Predicted: <strong className="text-orange-600">{formatScore(file.predicted_risk)}</strong></span>
                    <span>Confidence: <strong className="text-slate-700">{(file.confidence * 100).toFixed(0)}%</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {file.risk_factors.map((factor, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600">{factor}</span>
                    ))}
                  </div>
                </div>
                <Badge variant={file.risk_delta >= 5 ? 'high' : 'medium'}>+{file.risk_delta}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No at-risk files detected.</p>
        )}
      </Card>
    </div>
  );
}
