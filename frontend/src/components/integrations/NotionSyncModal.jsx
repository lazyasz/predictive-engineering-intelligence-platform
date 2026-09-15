import React, { useState } from 'react';
import { syncNotion, createNotionReport } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Database, CheckCircle2, ExternalLink, X, Sparkles, BookOpen } from 'lucide-react';

export default function NotionSyncModal({ isOpen, onClose, components = [], summaryStats = {} }) {
  const { integrations, showNotification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'audit_report'

  const [databaseId, setDatabaseId] = useState(integrations?.notion?.database_id || 'notion_db_pei_backlog_2026');
  const [reportTitle, setReportTitle] = useState('Executive Technical Debt Audit — Q3 2026');

  if (!isOpen) return null;

  const handleSyncDatabase = async () => {
    setLoading(true);
    try {
      const payload = {
        database_id: databaseId,
        components: components.map((c) => ({
          component_name: c.component || c.name || c.file_path || 'Component',
          priority_score: c.priority_score || c.priority || 75.0,
          remediation_effort_hours: c.remediation_effort_hours || c.effort || 8.0,
          defect_probability: c.defect_probability || 0.45,
          technical_risk: c.technical_risk || 60.0,
          business_impact: c.business_impact || 70.0,
          roi_quadrant: c.roi_quadrant || 'Quick Wins',
        })),
      };
      const res = await syncNotion(payload);
      setResult(res);
      showNotification(`Synced ${res.synced_count} components to Notion workspace!`);
    } catch (err) {
      showNotification('Notion sync failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    setLoading(true);
    try {
      const payload = {
        title: reportTitle,
        total_components: summaryStats.total_components || components.length || 85,
        avg_priority_score: summaryStats.avg_priority || 64.2,
        quick_wins_count: summaryStats.quick_wins || 24,
        critical_hotspots_count: summaryStats.hotspots || 12,
      };
      const res = await createNotionReport(payload);
      setResult(res);
      showNotification('Executive Tech Debt Audit Report published to Notion!');
    } catch (err) {
      showNotification('Report creation failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl border border-white/10">
              <BookOpen className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Notion Knowledge Hub Sync</h3>
              <p className="text-xs text-slate-300">Living Backlog Databases & Architecture Decision Records</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selection */}
        {!result && (
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'database'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Sync Database Table</span>
            </button>
            <button
              onClick={() => setActiveTab('audit_report')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'audit_report'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Publish Audit Report (ADR)</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-4">
          {result ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">
                  {result.report_id ? 'Executive Audit Published!' : 'Notion Database Synchronized!'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {result.message}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Workspace:</span>
                  <span className="font-semibold text-slate-800">Engineering Tech Debt Hub</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Items / Scope:</span>
                  <span className="font-semibold text-emerald-600">
                    {result.synced_count ? `${result.synced_count} Components` : 'Comprehensive Executive Audit'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={result.notion_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow transition"
                >
                  <span>Open in Notion</span>
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
              {activeTab === 'database' ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-600 font-medium">
                      Pushes <b className="text-slate-900">{components.length} components</b> with 5D Priority Scores, ROI Quadrants, and Remediation hours into a structured Notion database.
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Target Notion Database ID</label>
                    <input
                      type="text"
                      value={databaseId}
                      onChange={(e) => setDatabaseId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                    <p className="font-medium">
                      Generates a formal <b>Architecture Decision Record (ADR)</b> page in Notion with KPI metrics, Quick Win breakdowns, and refactoring guidelines.
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Report Page Title</label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600"
                    />
                  </div>
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
                  onClick={activeTab === 'database' ? handleSyncDatabase : handleCreateReport}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>
                    {loading
                      ? 'Syncing to Notion...'
                      : activeTab === 'database'
                      ? `Sync ${components.length} Items to Notion`
                      : 'Publish Audit to Notion'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
