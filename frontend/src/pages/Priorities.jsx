import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPriorities } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PriorityMatrix from '../charts/PriorityMatrix';
import JiraExportModal from '../components/integrations/JiraExportModal';
import NotionSyncModal from '../components/integrations/NotionSyncModal';
import { 
  Grid, 
  Layers, 
  Database, 
  Sparkles, 
  Bolt, 
  TrendingDown, 
  Rocket, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Calendar,
  Code2
} from 'lucide-react';

export default function Priorities() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSquad, setActiveSquad] = useState('All Squads');
  const [activeQuadrant, setActiveQuadrant] = useState('All');
  const { notify } = useAuth();
  const navigate = useNavigate();

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
      roi_quadrant: (item.business_impact || 7) >= 5 && (item.remediation_effort || 4) <= 5 ? 'Quick Wins' : 'Strategic Refactoring',
    });
    setIsBulkExport(false);
    setJiraModalOpen(true);
  };

  const openBulkJira = () => {
    setIsBulkExport(true);
    setJiraModalOpen(true);
  };

  if (loading) return <LoadingState message="Calculating 5D Business-Aware Prioritization Matrix..." />;
  if (error) return <ErrorState message={error} />;
  if (!data || data.length === 0) return <EmptyState title="No priority data available" />;

  const squads = ['All Squads', 'Core Backend', 'Payments & Billing', 'Cloud Infra'];
  const quadrants = ['All', 'Quick Wins', 'Strategic Refactoring', 'Deprioritized'];

  const filteredData = data.filter((item) => {
    const isQuickWin = (item.business_impact || 7) >= 5 && (item.remediation_effort || 4) <= 5;
    const isStrategic = (item.business_impact || 7) >= 5 && (item.remediation_effort || 4) > 5;
    if (activeQuadrant === 'Quick Wins') return isQuickWin;
    if (activeQuadrant === 'Strategic Refactoring') return isStrategic;
    if (activeQuadrant === 'Deprioritized') return !isQuickWin && !isStrategic;
    return true;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1720px] mx-auto animate-fade-in">
      
      {/* Top Hero Header Bar */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#43562b] animate-pulse"></span>
            <span className="text-[11px] font-mono text-[#75786d] uppercase tracking-wider font-bold">Sprint 48 Remediation</span>
            <span className="text-[#75786d]/40">•</span>
            <span className="bg-[#e8f1db] text-[#2d3f16] px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1 border border-[#c5c8ba]">
              <Calendar className="w-3 h-3 text-[#43562b]" />
              Q3 Active Cycle
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161e10] tracking-tight">
            Remediation & 5D Payoff Matrix
          </h1>
          <p className="text-sm text-[#45483e] max-w-2xl">
            Algorithmic payoff balance prioritizing technical friction against revenue impact: $PS_{'{base}'} = 0.35 \cdot TR + 0.30 \cdot BI + 0.15 \cdot U + 0.10 \cdot MC + 0.10 \cdot DA$.
          </p>
        </div>

        {/* Squad Pills & Global Action Triggers */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Squad Filter Pills */}
          <div className="flex items-center bg-[#e5ebe0] p-1 rounded-full border border-[#d4dece]">
            {squads.map((squad) => (
              <button
                key={squad}
                onClick={() => setActiveSquad(squad)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeSquad === squad
                    ? 'bg-white text-[#161e10] shadow-xs'
                    : 'text-[#45483e] hover:text-[#161e10]'
                }`}
              >
                {squad}
              </button>
            ))}
          </div>

          <button
            onClick={() => setNotionModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#161e10] hover:bg-[#f8faf6] text-xs font-bold shadow-xs border border-[#d4dece] transition cursor-pointer"
          >
            <Database className="w-4 h-4 text-[#384a24]" />
            <span>Sync Notion</span>
          </button>

          <button
            onClick={openBulkJira}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#43562b] hover:bg-[#2d3f16] text-white text-xs font-bold shadow-[0_4px_16px_rgba(45,63,22,0.3)] transition active:scale-95 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Confirm & Push Jira (24 SP)</span>
          </button>
        </div>
      </section>

      {/* 4 Bento KPI Metric Capsules */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#4d6332] via-[#384a24] to-[#253314] p-6 rounded-3xl text-white shadow-[0_12px_28px_-6px_rgba(37,51,20,0.4)] flex flex-col justify-between border border-[#5b723a]/30">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#d3ebb2] font-bold">
                Remediation Runway
              </span>
              <div className="text-3xl font-extrabold mt-1 leading-none">
                $48.2k <span className="text-sm text-[#d3ebb2]/80 font-normal">/ 340h</span>
              </div>
            </div>
            <span className="p-2 rounded-2xl bg-white/15">
              <TrendingDown className="w-5 h-5" />
            </span>
          </div>
          <div className="pt-3 flex items-center justify-between z-10">
            <span className="text-xs text-[#d3ebb2] font-mono">Total Debt Drag</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/15 font-bold">-14.2% Drag</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">Quick Wins Ready</span>
              <div className="text-3xl font-extrabold text-[#161e10] mt-1">18 Modules</div>
            </div>
            <span className="p-2 rounded-2xl bg-[#d3e4ac] text-[#2d3f16]">
              <Bolt className="w-5 h-5" />
            </span>
          </div>
          <span className="text-xs text-[#556437] font-semibold pt-3">High Payoff · Low Effort</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">Strategic Refactors</span>
              <div className="text-3xl font-extrabold text-[#161e10] mt-1">12 Modules</div>
            </div>
            <span className="p-2 rounded-2xl bg-[#ffddb8] text-[#855300]">
              <Grid className="w-5 h-5" />
            </span>
          </div>
          <span className="text-xs text-[#855300] font-semibold pt-3">Core Architectural Epics</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">Prioritization Algorithm</span>
              <div className="text-3xl font-extrabold text-[#161e10] mt-1">5-Factor</div>
            </div>
            <span className="p-2 rounded-2xl bg-[#e8f1db] text-[#43562b]">
              <Sparkles className="w-5 h-5" />
            </span>
          </div>
          <span className="text-xs text-[#43562b] font-semibold pt-3">TR(35%) + BI(30%) + U(15%)</span>
        </div>
      </section>

      {/* 2D Priority Matrix Chart */}
      <section className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#161e10]">2D Decision Quadrant Chart</h2>
            <p className="text-xs text-[#75786d]">Hover over data nodes to view Business Impact vs Remediation Effort (dot size = Risk Score)</p>
          </div>

          {/* Quadrant filter pills */}
          <div className="flex items-center gap-1.5 bg-[#e5ebe0] p-1 rounded-full">
            {quadrants.map((quad) => (
              <button
                key={quad}
                onClick={() => setActiveQuadrant(quad)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  activeQuadrant === quad
                    ? 'bg-[#43562b] text-white shadow-xs'
                    : 'text-[#45483e] hover:text-[#161e10]'
                }`}
              >
                {quad}
              </button>
            ))}
          </div>
        </div>

        <PriorityMatrix 
          data={filteredData} 
          onSelectPoint={(pt) => {
            if (pt.id) navigate(`/files/${pt.id}`);
          }}
        />
      </section>

      {/* Prioritized Backlog Items Table */}
      <section className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#161e10]">Ranked Refactoring Backlog ({filteredData.length})</h2>
            <p className="text-xs text-[#75786d]">Ranked by $PS_{'{final}'}$ score with 1-click Jira ticket dispatch</p>
          </div>
          <button
            onClick={openBulkJira}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] text-xs font-bold transition border border-[#c5c8ba]"
          >
            <Layers className="w-3.5 h-3.5 text-[#43562b]" />
            <span>Bulk Export to Jira</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebe0] text-[#75786d] uppercase font-mono text-[10px]">
                <th className="py-3 px-4 font-bold text-center">Rank</th>
                <th className="py-3 px-4 font-bold">Module File</th>
                <th className="py-3 px-4 font-bold text-center">Priority Score</th>
                <th className="py-3 px-4 font-bold text-center">Business Impact</th>
                <th className="py-3 px-4 font-bold text-center">Effort</th>
                <th className="py-3 px-4 font-bold text-center">Quadrant</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f6f0]">
              {filteredData.map((item, idx) => {
                const isQuickWin = (item.business_impact || 7) >= 5 && (item.remediation_effort || 4) <= 5;
                return (
                  <tr 
                    key={item.id || idx}
                    onClick={() => navigate(`/files/${item.id || idx + 1}`)}
                    className="hover:bg-[#f8faf6] transition cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#75786d]">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#43562b]" />
                        <span className="font-mono font-semibold text-[#161e10] group-hover:text-[#43562b] transition">
                          {item.file || item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-[#43562b]">
                      {item.priority_score || 84.2}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-[#161e10]">
                      {item.business_impact || 7.5} / 10
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#45483e]">
                      {item.remediation_effort || 12}h
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        isQuickWin 
                          ? 'bg-[#d3ebb2] text-[#2d3f16]' 
                          : 'bg-[#ffddb8] text-[#855300]'
                      }`}>
                        {isQuickWin ? 'Quick Win' : 'Strategic'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openSingleJira(item)}
                          className="px-2.5 py-1 bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] rounded-xl text-[11px] font-bold transition flex items-center gap-1 border border-[#c5c8ba]"
                        >
                          <Layers className="w-3 h-3" />
                          <span>Create Jira</span>
                        </button>
                        <button
                          onClick={() => navigate(`/files/${item.id || idx + 1}`)}
                          className="px-2.5 py-1 bg-[#43562b] hover:bg-[#2d3f16] text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>Deep Dive</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Jira & Notion Modals */}
      <JiraExportModal
        isOpen={jiraModalOpen}
        onClose={() => setJiraModalOpen(false)}
        item={selectedComponent}
        isBulk={isBulkExport}
        components={filteredData}
      />

      <NotionSyncModal
        isOpen={notionModalOpen}
        onClose={() => setNotionModalOpen(false)}
        items={filteredData}
      />
    </div>
  );
}
