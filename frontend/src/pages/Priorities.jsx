import { useState, useEffect } from 'react';
import { getPriorities } from '../services/api';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PriorityMatrix from '../charts/PriorityMatrix';
import JiraExportModal from '../components/integrations/JiraExportModal';
import NotionSyncModal from '../components/integrations/NotionSyncModal';
import { formatScore } from '../utils/risk';
import { Layers, Database, Sparkles, ExternalLink } from 'lucide-react';

export default function Priorities() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [jiraModalOpen, setJiraModalOpen] = useState(false);
  const [notionModalOpen, setNotionModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isBulkExport, setIsBulkExport] = useState(false);

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

  const openSingleJira = (item) => {
    setSelectedComponent({
      component: item.file || item.name || 'Component',
      priority_score: item.priority_score || 75.0,
      remediation_effort_hours: item.remediation_effort || 10.0,
      defect_probability: (item.risk_score || 60) / 100 * 0.8,
      technical_risk: item.risk_score || 60.0,
      business_impact: item.business_impact || 70.0,
      roi_quadrant: item.priority_level === 'critical' ? 'Quick Wins' : 'Strategic Refactoring',
    });
    setIsBulkExport(false);
    setJiraModalOpen(true);
  };

  const openBulkJira = () => {
    setIsBulkExport(true);
    setJiraModalOpen(true);
  };

  if (loading) return <LoadingState message="Loading priorities..." />;
  if (error) return <ErrorState message={error} />;
  if (!data || data.length === 0) return <EmptyState title="No priority data available" />;

  const formattedComponents = data.map((item) => ({
    component: item.file || item.name,
    priority_score: item.priority_score,
    remediation_effort_hours: item.remediation_effort,
    technical_risk: item.risk_score,
    business_impact: item.business_impact,
    roi_quadrant: item.priority_level === 'critical' ? 'Quick Wins' : 'Strategic Refactoring',
  }));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Remediation Priorities"
          description="Prioritized technical debt items ranked by business impact, risk, and remediation effort."
        />

        {/* Enterprise Integration Action Bar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={openBulkJira}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Layers className="h-4 w-4" />
            <span>Export Sprint to Jira</span>
          </button>
          <button
            onClick={() => setNotionModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Database className="h-4 w-4 text-amber-300" />
            <span>Sync to Notion</span>
          </button>
        </div>
      </div>

      <Card title="Priority Matrix" subtitle="Business Impact vs Remediation Effort (dot size = risk score)" className="mb-6">
        <PriorityMatrix data={data} />
      </Card>

      <Card title="Prioritized Items">
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.id || index} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-sm font-bold text-slate-600 shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <p className="font-mono text-sm font-medium text-slate-800 truncate">{item.file}</p>
                    <Badge variant={item.priority_level}>{item.priority_level}</Badge>
                  </div>
                  
                  {/* Single Ticket Action */}
                  <button
                    onClick={() => openSingleJira(item)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition shrink-0 cursor-pointer"
                    title="Generate Jira Refactoring Ticket"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Jira Ticket</span>
                  </button>
                </div>

                <p className="mt-1 text-sm text-slate-600">{item.recommendation}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>Priority: <strong className="text-slate-700">{formatScore(item.priority_score)}</strong></span>
                  <span>Risk: <strong className="text-slate-700">{formatScore(item.risk_score)}</strong></span>
                  <span>Impact: <strong className="text-slate-700">{formatScore(item.business_impact)}</strong></span>
                  <span>Effort: <strong className="text-slate-700">{formatScore(item.remediation_effort)}h</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Jira Modal */}
      <JiraExportModal
        isOpen={jiraModalOpen}
        onClose={() => setJiraModalOpen(false)}
        component={selectedComponent}
        isBulk={isBulkExport}
        bulkComponents={formattedComponents}
      />

      {/* Notion Modal */}
      <NotionSyncModal
        isOpen={notionModalOpen}
        onClose={() => setNotionModalOpen(false)}
        components={formattedComponents}
        summaryStats={{
          total_components: data.length,
          avg_priority: data.reduce((acc, curr) => acc + (curr.priority_score || 0), 0) / (data.length || 1),
          quick_wins: data.filter((d) => d.priority_level === 'critical').length,
          hotspots: data.filter((d) => (d.risk_score || 0) >= 70).length,
        }}
      />
    </div>
  );
}
