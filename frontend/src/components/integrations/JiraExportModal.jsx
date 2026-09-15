import React, { useState } from 'react';
import { createJiraIssue, bulkExportJira } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Layers, CheckCircle2, ExternalLink, X, Sparkles, AlertCircle } from 'lucide-react';

export default function JiraExportModal({ isOpen, onClose, component, isBulk = false, bulkComponents = [] }) {
  const { integrations, showNotification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [projectKey, setProjectKey] = useState(integrations?.jira?.project_key || 'DEBT');
  const [issueType, setIssueType] = useState('Task');
  const [sprintName, setSprintName] = useState('Sprint 24 — High ROI Refactoring');

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    try {
      if (isBulk) {
        const payload = {
          sprint_name: sprintName,
          components: bulkComponents.map((c) => ({
            component_name: c.component || c.name || c.file_path || 'Component',
            priority_score: c.priority_score || c.priority || 75.0,
            remediation_effort_hours: c.remediation_effort_hours || c.effort || 8.0,
            defect_probability: c.defect_probability || 0.45,
            technical_risk: c.technical_risk || 60.0,
            business_impact: c.business_impact || 70.0,
            roi_quadrant: c.roi_quadrant || 'Quick Wins',
            issue_type: issueType,
          })),
        };
        const res = await bulkExportJira(payload);
        setResult(res);
        showNotification(`Created ${res.total_tickets_created} Jira tickets for ${sprintName}!`);
      } else {
        const payload = {
          component_name: component?.component || component?.name || component?.file_path || 'Component',
          priority_score: component?.priority_score || component?.priority || 75.0,
          remediation_effort_hours: component?.remediation_effort_hours || component?.effort || 8.0,
          defect_probability: component?.defect_probability || 0.45,
          technical_risk: component?.technical_risk || 60.0,
          business_impact: component?.business_impact || 70.0,
          roi_quadrant: component?.roi_quadrant || 'Quick Wins',
          issue_type: issueType,
          summary: `[Tech Debt] Refactor high-risk component: ${component?.component || component?.name || 'Component'}`,
        };
        const res = await createJiraIssue(payload);
        setResult(res);
        showNotification(`Created Jira ticket ${res.issue_key} successfully!`);
      }
    } catch (err) {
      showNotification('Jira export failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  const effortHours = component?.remediation_effort_hours || component?.effort || 8.0;
  const storyPoints = effortHours <= 4 ? 1 : effortHours <= 8 ? 2 : effortHours <= 16 ? 3 : effortHours <= 30 ? 5 : 8;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Layers className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {isBulk ? 'Bulk Export Sprint to Jira Cloud' : 'Create Jira Refactoring Issue'}
              </h3>
              <p className="text-xs text-blue-100">Automated 5D Debt Scoring & Story Point Estimation</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          
          {result ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">
                  {isBulk ? 'Sprint Backlog Created!' : `Jira Issue Created: ${result.issue_key}`}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isBulk
                    ? `Generated ${result.total_tickets_created} tickets totaling ${result.total_story_points} Story Points.`
                    : result.message}
                </p>
              </div>

              {!isBulk && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issue Key:</span>
                    <span className="font-mono font-bold text-blue-600">{result.issue_key}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Priority:</span>
                    <span className="font-semibold text-rose-600">{result.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Points:</span>
                    <span className="font-semibold text-slate-700">{result.story_points} SP</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={result.issue_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition"
                >
                  <span>Open in Jira Cloud</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Target Component Info */}
              {!isBulk && component && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 truncate">{component.component || component.name}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded-full text-[10px]">
                      {component.roi_quadrant || 'Quick Wins'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-slate-500 pt-1">
                    <span>Score: <b className="text-slate-800">{component.priority_score || component.priority || 75}/100</b></span>
                    <span>Effort: <b className="text-slate-800">{effortHours}h</b></span>
                    <span>Story Points: <b className="text-indigo-600">{storyPoints} SP</b></span>
                  </div>
                </div>
              )}

              {isBulk && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800">
                  <span className="font-bold">Batch Export:</span> Converting {bulkComponents.length} prioritized components into Jira Sprint Backlog items.
                </div>
              )}

              {/* Form Controls */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Project Key</label>
                  <input
                    type="text"
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Issue Type</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Task">Task</option>
                    <option value="Bug">Bug (Defect Risk)</option>
                    <option value="Story">Refactoring Story</option>
                  </select>
                </div>
              </div>

              {isBulk && (
                <div className="text-xs">
                  <label className="block text-slate-600 font-medium mb-1">Sprint Destination</label>
                  <input
                    type="text"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{loading ? 'Creating in Jira...' : isBulk ? 'Export Sprint to Jira' : 'Create Jira Ticket'}</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
