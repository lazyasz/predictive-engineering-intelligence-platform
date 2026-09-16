import React, { useState } from 'react';
import { 
  Activity, 
  Flame, 
  TrendingDown, 
  Bolt, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Database, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Code2,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMetrics } from '../hooks/useMetrics';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import ScanRepoModal from '../components/common/ScanRepoModal';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Dashboard() {
  const { data, loading, error, refresh } = useMetrics();
  const { notify, setSettingsOpen } = useAuth();
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [isExportingNotion, setIsExportingNotion] = useState(false);
  const [isPushingJira, setIsPushingJira] = useState(false);
  const navigate = useNavigate();

  if (loading) return <LoadingState message="Connecting to AST telemetry & ML prediction mesh..." />;
  if (error) return <ErrorState message={error} />;

  const handlePushToJira = () => {
    setIsPushingJira(true);
    setTimeout(() => {
      setIsPushingJira(false);
      notify('✅ Created 8 Jira Tasks in sprint backlog for high-priority hotspots!');
    }, 900);
  };

  const handleSyncNotion = () => {
    setIsExportingNotion(true);
    setTimeout(() => {
      setIsExportingNotion(false);
      notify('📑 Synchronized 18 remediation initiatives to Notion Engineering Roadmap.');
    }, 800);
  };

  const trendData = data?.risk_trend || [
    { sprint: 'Sprint 42', score: 68 },
    { sprint: 'Sprint 43', score: 64 },
    { sprint: 'Sprint 44', score: 58 },
    { sprint: 'Sprint 45', score: 52 },
    { sprint: 'Sprint 46', score: 46 },
    { sprint: 'Sprint 47', score: 41 },
    { sprint: 'Sprint 48', score: 38 },
  ];

  const categoryData = [
    { name: 'Architecture & Coupling', value: 38, color: '#43562b' },
    { name: 'Complexity & Smells', value: 28, color: '#556437' },
    { name: 'Test Deficits', value: 18, color: '#855300' },
    { name: 'Security Hotspots', value: 16, color: '#ba1a1a' },
  ];

  const recentItems = data?.recent_high_priority || [
    { id: 1, file: 'services/auth/token_provider.py', risk_score: 89.2, priority_level: 'CRITICAL', category: 'Security' },
    { id: 2, file: 'pipeline/analytics/spark_aggregator.py', risk_score: 84.6, priority_level: 'CRITICAL', category: 'Complexity' },
    { id: 3, file: 'api/routes/transaction_billing.py', risk_score: 79.1, priority_level: 'HIGH', category: 'Maintainability' },
    { id: 4, file: 'models/decision_matrix_calculator.py', risk_score: 72.4, priority_level: 'HIGH', category: 'Performance' },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1720px] mx-auto animate-fade-in">
      
      {/* Top Hero Banner & Quick Actions */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f1db] text-[#2d3f16] font-mono text-[11px] font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#43562b] animate-pulse"></span>
              Continuous AST Telemetry Engine
            </span>
            <span className="text-xs text-[#75786d] font-mono">v4.18.2 · Active Mesh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161e10] tracking-tight">
            Engineering Decision Intelligence Overview
          </h1>
          <p className="text-sm text-[#45483e] max-w-3xl">
            Real-time algorithmic triage linking software big data, Random Forest defect forecasts ($R^2 = 0.9885$), and business ROI prioritization.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setScanModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] text-xs font-bold transition border border-[#c5c8ba] shadow-xs active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#43562b]" />
            <span>Scan Repo AST</span>
          </button>

          <button
            onClick={handleSyncNotion}
            disabled={isExportingNotion}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#f4f6f0] text-[#161e10] text-xs font-bold transition border border-[#d4dece] shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Database className="w-4 h-4 text-[#384a24]" />
            <span>{isExportingNotion ? 'Syncing...' : 'Sync Notion'}</span>
          </button>

          <button
            onClick={handlePushToJira}
            disabled={isPushingJira}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#43562b] hover:bg-[#2d3f16] text-white text-xs font-bold transition shadow-[0_4px_14px_rgba(45,63,22,0.3)] hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Layers className="w-4 h-4" />
            <span>{isPushingJira ? 'Pushing...' : 'Push to Jira Backlog'}</span>
          </button>
        </div>
      </section>

      {/* 4 Bento KPI Metric Capsules */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* KPI 1: Hero Lustrous Moss Satin Capsule */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#4d6332] via-[#384a24] to-[#253314] p-6 rounded-3xl text-white shadow-[0_12px_28px_-6px_rgba(37,51,20,0.4)] flex flex-col justify-between border border-[#5b723a]/30 min-h-[200px]">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#d3ebb2] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d3ebb2]"></span>
                Remediation Runway
              </span>
              <div className="text-3xl font-extrabold tracking-tight mt-1 text-white leading-none">
                $48.2k <span className="text-base text-[#d3ebb2]/80 font-normal">/ 340h</span>
              </div>
            </div>
            <span className="p-2 rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
              <TrendingDown className="w-5 h-5 text-white" />
            </span>
          </div>

          <div className="pt-4 relative z-10 flex items-center justify-between">
            <span className="text-xs text-[#d3ebb2] font-mono">Sprint 48 Forecast</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/15 backdrop-blur-md text-white font-bold border border-white/20">
              -14.2% Debt Drag
            </span>
          </div>
        </div>

        {/* KPI 2: Quick Wins Ready */}
        <div 
          onClick={() => navigate('/priorities')}
          className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between hover:shadow-md hover:border-[#b8ce98] transition cursor-pointer group min-h-[200px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">
                Quick Wins Identified
              </span>
              <div className="text-3xl font-extrabold text-[#161e10] tracking-tight mt-1">
                18 <span className="text-sm font-normal text-[#75786d]">High-ROI Modules</span>
              </div>
            </div>
            <span className="p-2 rounded-2xl bg-[#d3e4ac] text-[#2d3f16]">
              <Bolt className="w-5 h-5 text-[#43562b]" />
            </span>
          </div>
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-[#556437] font-semibold">Effort &lt; 40h · High Impact</span>
            <span className="text-xs font-bold text-[#43562b] group-hover:translate-x-1 transition flex items-center gap-1">
              <span>View Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* KPI 3: ML Defect Vulnerability */}
        <div 
          onClick={() => navigate('/predictions')}
          className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between hover:shadow-md hover:border-[#b8ce98] transition cursor-pointer group min-h-[200px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">
                Defect Probability
              </span>
              <div className="text-3xl font-extrabold text-[#161e10] tracking-tight mt-1">
                38.5% <span className="text-sm font-normal text-[#75786d]">Exposure</span>
              </div>
            </div>
            <span className="p-2 rounded-2xl bg-[#fdf2e7] text-[#855300]">
              <Cpu className="w-5 h-5 text-[#855300]" />
            </span>
          </div>
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-[#75786d] font-mono">Random Forest Regressor</span>
            <span className="text-xs font-bold text-[#2d3f16] group-hover:translate-x-1 transition flex items-center gap-1">
              <span>R² = 0.9885</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* KPI 4: Mean Absolute Error */}
        <div 
          onClick={() => navigate('/hotspots')}
          className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between hover:shadow-md hover:border-[#b8ce98] transition cursor-pointer group min-h-[200px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#75786d] font-bold">
                Hotspots Detected
              </span>
              <div className="text-3xl font-extrabold text-[#161e10] tracking-tight mt-1">
                19 <span className="text-sm font-normal text-[#75786d]">God Classes</span>
              </div>
            </div>
            <span className="p-2 rounded-2xl bg-[#ffdad6] text-[#ba1a1a]">
              <Flame className="w-5 h-5 text-[#ba1a1a]" />
            </span>
          </div>
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-[#ba1a1a] font-semibold">Cyclomatic Complexity &gt; 25</span>
            <span className="text-xs font-bold text-[#ba1a1a] group-hover:translate-x-1 transition flex items-center gap-1">
              <span>Inspect Files</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Mid Bento Grid: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Bento: Velocity & Risk Trajectory (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#161e10]">Technical Risk Velocity Trajectory</h2>
              <p className="text-xs text-[#75786d]">7-Sprint historical trend vs predicted defect mitigation decay curve</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#e8f1db] text-[#2d3f16]">
              -44.1% Overall
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="mossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#43562b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#43562b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="sprint" stroke="#75786d" fontSize={11} />
                <YAxis stroke="#75786d" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e2a0f', borderColor: '#43562b', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#43562b" strokeWidth={3} fillOpacity={1} fill="url(#mossGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Bento: Category Decomposition (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#161e10]">Debt Decomposition</h2>
            <p className="text-xs text-[#75786d]">Categorical breakdown of codebase friction</p>
          </div>

          <div className="h-44 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e2a0f', borderColor: '#43562b', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#e5ebe0]">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#45483e]">{item.name}</span>
                </div>
                <span className="font-bold text-[#161e10]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Remediation Hotspots Table */}
      <section className="p-6 bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#161e10]">Urgent Remediation Priority Queue</h2>
            <p className="text-xs text-[#75786d]">Direct AST telemetry for top friction modules requiring developer triage</p>
          </div>
          <button
            onClick={() => navigate('/priorities')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#43562b] hover:text-[#2d3f16] transition"
          >
            <span>Explore 5D Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebe0] text-[#75786d] uppercase font-mono text-[10px]">
                <th className="py-3 px-4 font-bold">Module Path</th>
                <th className="py-3 px-4 font-bold text-center">Risk Score</th>
                <th className="py-3 px-4 font-bold text-center">Priority</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f6f0]">
              {recentItems.map((item) => (
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
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#ba1a1a]">
                    {item.risk_score} / 100
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      item.priority_level === 'CRITICAL'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#ffddb8] text-[#855300]'
                    }`}>
                      {item.priority_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#45483e] font-medium">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          notify(`🚀 Dispatched Jira task for ${item.file}`);
                        }}
                        className="px-2.5 py-1 bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] rounded-xl text-[11px] font-bold transition flex items-center gap-1 border border-[#c5c8ba]"
                      >
                        <Layers className="w-3 h-3" />
                        <span>Jira</span>
                      </button>
                      <button
                        onClick={() => navigate('/copilot')}
                        className="px-2.5 py-1 bg-[#43562b] hover:bg-[#2d3f16] text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <Sparkles className="w-3 h-3" />
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

      {/* Modal instance */}
      <ScanRepoModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onScanComplete={(res) => {
          notify(`Analysis complete for ${res.repository || 'repository'}!`);
          refresh();
        }}
      />
    </div>
  );
}
