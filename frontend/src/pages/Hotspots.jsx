import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotspots } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import ScanRepoModal from '../components/common/ScanRepoModal';
import JiraExportModal from '../components/integrations/JiraExportModal';
import { 
  Flame, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Code2, 
  ArrowRight, 
  GitBranch, 
  AlertTriangle, 
  SlidersHorizontal,
  ChevronRight,
  Zap,
  Bot
} from 'lucide-react';

export default function Hotspots() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [selectedComplexityFilter, setSelectedComplexityFilter] = useState('all');
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [jiraModalOpen, setJiraModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { notify } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getHotspots();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load hotspots');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingState message="Extracting Lexical AST metrics & God-classes..." />;
  if (error) return <ErrorState message={error} />;
  if (!data || data.length === 0) return <EmptyState title="No hotspots detected" />;

  const filteredData = data.filter((item) => {
    if (highRiskOnly && (item.risk_score || 0) < 75) return false;
    if (selectedComplexityFilter === 'high' && (item.complexity || 0) < 25) return false;
    return true;
  });

  const handleOpenJira = (item) => {
    setSelectedItem({
      component: item.file || item.name,
      priority_score: item.risk_score || 85.0,
      remediation_effort_hours: (item.complexity || 20) * 0.8,
      defect_probability: (item.defects || 3) * 0.15,
      technical_risk: item.risk_score || 80.0,
      business_impact: item.business_impact || 75.0,
      roi_quadrant: 'Strategic Refactoring',
    });
    setJiraModalOpen(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1720px] mx-auto animate-fade-in">
      
      {/* Top Header Banner */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f1db] text-[#2d3f16] font-mono text-[11px] font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#43562b] animate-pulse"></span>
              CONTINUOUS LEXICAL AST TELEMETRY
            </span>
            <span className="text-xs text-[#75786d] font-mono">Engine v4.18.2-prod</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161e10] tracking-tight">
            Monorepo Code Hotspots & Structural Decay
          </h1>
          <p className="text-sm text-[#45483e] max-w-3xl">
            Real-time abstract syntax tree analysis detecting god-classes, volatile cyclomatic churn nodes, and high-entropy defect clusters across core application domains.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setScanModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] text-xs font-bold transition border border-[#c5c8ba] shadow-xs active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#43562b]" />
            <span>Re-scan AST Delta</span>
          </button>

          <button
            onClick={() => navigate('/priorities')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#43562b] hover:bg-[#2d3f16] text-white text-xs font-bold transition shadow-[0_4px_14px_rgba(45,63,22,0.3)] hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>Simulate Refactor Impact</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Filter & Scope Bar */}
      <section className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#161e10] border border-[#d4dece] font-semibold">
          <GitBranch className="w-3.5 h-3.5 text-[#43562b]" />
          <span>Branch: <strong className="font-mono text-[#43562b]">main (9f2a4c1)</strong></span>
        </div>

        <button
          onClick={() => setSelectedComplexityFilter(selectedComplexityFilter === 'high' ? 'all' : 'high')}
          className={`px-3 py-1.5 rounded-full font-semibold transition border ${
            selectedComplexityFilter === 'high'
              ? 'bg-[#43562b] text-white border-[#43562b]'
              : 'bg-white text-[#45483e] border-[#d4dece] hover:bg-[#f8faf6]'
          }`}
        >
          Cyclomatic &gt; 25
        </button>

        <button
          onClick={() => setHighRiskOnly(!highRiskOnly)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition border shadow-xs ${
            highRiskOnly
              ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
              : 'bg-white text-[#ba1a1a] border-[#ffdad6] hover:bg-[#ffdad6]/40'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
          <span>High Risk Only (&gt;75)</span>
        </button>

        <div className="ml-auto hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f1db] text-[#2d3f16] text-[11px] font-mono font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>AST Depth: Level 4 Monad Parse</span>
        </div>
      </section>

      {/* Bento Overview Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* KPI 1: God Classes Detected */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#43562b] via-[#2d3f16] to-[#1e2a0f] p-6 rounded-3xl text-white shadow-[0_12px_28px_-6px_rgba(45,63,22,0.35)] flex flex-col justify-between border border-[#5b723a]/30 min-h-[200px]">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#d3ebb2] font-bold">
                God-Classes Detected
              </span>
              <div className="text-3xl font-extrabold tracking-tight mt-1 text-white leading-none">
                19 <span className="text-base text-[#d3ebb2]/80 font-normal">Classes</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#d3ebb2]/20 text-[#d3ebb2] text-xs font-mono font-bold">
              +3 new
            </span>
          </div>

          <div className="pt-4 relative z-10 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#d3ebb2]">
              &gt;40 complexity nodes
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#d3ebb2]">
              4 Monorepos affected
            </span>
          </div>
        </div>

        {/* KPI 2: Max Cyclomatic Complexity */}
        <div className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">
                Max Cyclomatic Peak
              </span>
              <div className="text-3xl font-extrabold text-[#161e10] tracking-tight mt-1">
                48.2 <span className="text-sm font-normal text-[#75786d]">Score</span>
              </div>
            </div>
            <span className="p-2 rounded-2xl bg-[#ffdad6] text-[#ba1a1a]">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <span className="text-xs text-[#ba1a1a] font-semibold pt-3">
            Critical complexity in routing/billing
          </span>
        </div>

        {/* KPI 3: Commit Churn Volatility */}
        <div className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">
                Code Churn (30d)
              </span>
              <div className="text-3xl font-extrabold text-[#161e10] tracking-tight mt-1">
                2,840 <span className="text-sm font-normal text-[#75786d]">LOC</span>
              </div>
            </div>
            <span className="p-2 rounded-2xl bg-[#d3e4ac] text-[#2d3f16]">
              <GitBranch className="w-5 h-5" />
            </span>
          </div>
          <span className="text-xs text-[#556437] font-semibold pt-3">
            14 Active Commit Authors
          </span>
        </div>

        {/* KPI 4: Duplication % */}
        <div className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">
                Code Duplication
              </span>
              <div className="text-3xl font-extrabold text-[#161e10] tracking-tight mt-1">
                18.4% <span className="text-sm font-normal text-[#75786d]">Clone Nodes</span>
              </div>
            </div>
            <span className="p-2 rounded-2xl bg-[#fdf2e7] text-[#855300]">
              <Code2 className="w-5 h-5" />
            </span>
          </div>
          <span className="text-xs text-[#855300] font-semibold pt-3">
            AST clone detection enabled
          </span>
        </div>
      </section>

      {/* Hotspots Deep Inspection Grid */}
      <section className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#161e10]">Code Hotspots Explorer ({filteredData.length})</h2>
            <p className="text-xs text-[#75786d]">Click any module card or row to launch deep telemetry breakdown and AI refactoring diffs</p>
          </div>
          <button
            onClick={() => setScanModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] text-xs font-bold rounded-xl transition border border-[#c5c8ba]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#43562b]" />
            <span>Scan Another Repo</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebe0] text-[#75786d] uppercase font-mono text-[10px]">
                <th className="py-3 px-4 font-bold">File Path</th>
                <th className="py-3 px-4 font-bold text-center">Complexity</th>
                <th className="py-3 px-4 font-bold text-center">Churn (LOC)</th>
                <th className="py-3 px-4 font-bold text-center">Smells / Bugs</th>
                <th className="py-3 px-4 font-bold text-center">Technical Risk</th>
                <th className="py-3 px-4 font-bold text-center">Business Impact</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f6f0]">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/files/${item.id}`)}
                  className="hover:bg-[#f8faf6] transition cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#43562b]" />
                      <span className="font-mono font-semibold text-[#161e10] group-hover:text-[#43562b] transition">
                        {item.file}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#161e10]">
                    {item.complexity}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#45483e]">
                    {item.churn}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-[#fdf2e7] text-[#855300] font-mono font-bold text-[10px]">
                      {item.defects || 2} Smells
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#ba1a1a]">
                    {item.risk_score} / 100
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-[#161e10]">
                    {item.business_impact} / 10
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenJira(item)}
                        className="px-2.5 py-1 bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] rounded-xl text-[11px] font-bold transition flex items-center gap-1 border border-[#c5c8ba]"
                      >
                        <Layers className="w-3 h-3" />
                        <span>Jira</span>
                      </button>
                      <button
                        onClick={() => navigate('/copilot')}
                        className="px-2.5 py-1 bg-[#43562b] hover:bg-[#2d3f16] text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Copilot</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
      <ScanRepoModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
      />

      <JiraExportModal
        isOpen={jiraModalOpen}
        onClose={() => setJiraModalOpen(false)}
        component={selectedItem}
      />
    </div>
  );
}
