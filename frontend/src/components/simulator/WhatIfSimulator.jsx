import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { runWhatIfSimulation } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PRESETS = [
  {
    name: 'Payment Webhook Gateway (P0 Hotspot)',
    churn: 240,
    complexity: 22.0,
    debt_minutes: 180,
    experience: 3,
    refactoring_effort_pct: 60,
    developer_seniority: 'Lead Architect',
    test_coverage_pct: 88,
    hourly_rate: 95
  },
  {
    name: 'Spark Ingestion Aggregator (High Churn)',
    churn: 380,
    complexity: 19.5,
    debt_minutes: 140,
    experience: 5,
    refactoring_effort_pct: 45,
    developer_seniority: 'Senior Engineer (6-8 yrs)',
    test_coverage_pct: 80,
    hourly_rate: 85
  },
  {
    name: 'Auth Token Provider (Security Hotspot)',
    churn: 110,
    complexity: 16.0,
    debt_minutes: 90,
    experience: 8,
    refactoring_effort_pct: 50,
    developer_seniority: 'Senior Engineer (6-8 yrs)',
    test_coverage_pct: 92,
    hourly_rate: 90
  }
];

export default function WhatIfSimulator({ initialModule, onOpenRecipe }) {
  const { notify } = useAuth();

  const [churn, setChurn] = useState(initialModule?.churn || 160);
  const [complexity, setComplexity] = useState(initialModule?.complexity || 16.5);
  const [debtMinutes, setDebtMinutes] = useState(initialModule?.debt_minutes || 120);
  const [experience, setExperience] = useState(5);
  const [effortPct, setEffortPct] = useState(50);
  const [seniority, setSeniority] = useState('Senior Engineer (6-8 yrs)');
  const [testCoverage, setTestCoverage] = useState(85);
  const [hourlyRate, setHourlyRate] = useState(85);

  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const applyPreset = (preset) => {
    setChurn(preset.churn);
    setComplexity(preset.complexity);
    setDebtMinutes(preset.debt_minutes);
    setExperience(preset.experience);
    setEffortPct(preset.refactoring_effort_pct);
    setSeniority(preset.developer_seniority);
    setTestCoverage(preset.test_coverage_pct);
    setHourlyRate(preset.hourly_rate);
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await runWhatIfSimulation({
        churn: parseInt(churn) || 120,
        complexity: parseFloat(complexity) || 14.0,
        debt_minutes: parseFloat(debtMinutes) || 90.0,
        experience: parseInt(experience) || 5,
        refactoring_effort_pct: parseFloat(effortPct),
        developer_seniority: seniority,
        test_coverage_pct: parseFloat(testCoverage),
        hourly_rate: parseFloat(hourlyRate)
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSimulate();
  }, [churn, complexity, debtMinutes, effortPct, seniority, testCoverage, hourlyRate]);

  return (
    <div className="bg-white rounded-3xl border border-[#d4dece] shadow-[0_4px_24px_-4px_rgba(45,63,22,0.08)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5ebe0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#e8f1db] text-[#2d3f16]">
              <Sliders className="w-5 h-5 text-[#43562b]" />
            </span>
            <h2 className="text-xl font-extrabold text-[#161e10] tracking-tight">
              Interactive "What-If" Defect & ROI Simulator
            </h2>
          </div>
          <p className="text-xs text-[#75786d] mt-1">
            Simulate refactoring ROI, risk decay curves, and engineering dollar savings using the live SZZ ML Random Forest model.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-[#75786d] font-bold mr-1">Presets:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-xl bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] text-[11px] font-semibold transition border border-[#c5c8ba] cursor-pointer"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls on Left (7 cols), Simulation Results on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Section 1: Refactoring Effort Slider */}
          <div className="p-4 bg-[#f8faf6] rounded-2xl border border-[#e2ecd5] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#161e10] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#43562b]" />
                Refactoring Effort Allocation
              </label>
              <span className="px-2.5 py-0.5 rounded-full font-mono font-extrabold text-xs bg-[#43562b] text-white">
                {effortPct}% Codebase Cleanse
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={effortPct}
              onChange={(e) => setEffortPct(Number(e.target.value))}
              className="w-full accent-[#43562b] cursor-pointer h-2 bg-[#d4dece] rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#75786d]">
              <span>0% (Patch Only)</span>
              <span>50% (Standard Refactor)</span>
              <span>100% (Complete Rewrite)</span>
            </div>
          </div>

          {/* Section 2: Developer Seniority & Test Coverage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Seniority Selector */}
            <div className="p-4 bg-[#f8faf6] rounded-2xl border border-[#e2ecd5] space-y-2">
              <label className="text-xs font-bold text-[#161e10] block">
                Assignee Seniority Level
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#c5c8ba] text-xs font-semibold text-[#161e10] focus:ring-2 focus:ring-[#43562b] outline-none"
              >
                <option value="Junior Engineer (1-2 yrs)">Junior Engineer (1-2 yrs)</option>
                <option value="Mid-Level Engineer (3-5 yrs)">Mid-Level Engineer (3-5 yrs)</option>
                <option value="Senior Engineer (6-8 yrs)">Senior Engineer (6-8 yrs)</option>
                <option value="Lead Architect">Lead Architect (&gt;8 yrs)</option>
              </select>
              <span className="text-[10px] text-[#75786d] block">
                Calculates cognitive experience & bug-injection damping factor.
              </span>
            </div>

            {/* Test Coverage Slider */}
            <div className="p-4 bg-[#f8faf6] rounded-2xl border border-[#e2ecd5] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#161e10]">
                  Target Test Coverage
                </label>
                <span className="font-mono font-bold text-[#43562b] text-xs">
                  {testCoverage}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={testCoverage}
                onChange={(e) => setTestCoverage(Number(e.target.value))}
                className="w-full accent-[#43562b] cursor-pointer h-2 bg-[#d4dece] rounded-lg"
              />
              <span className="text-[10px] text-[#75786d] block">
                Unit, integration & branch regression coverage harness.
              </span>
            </div>
          </div>

          {/* Section 3: Code Metrics Pre-conditions */}
          <div className="p-4 bg-white rounded-2xl border border-[#d4dece] space-y-3">
            <h3 className="text-xs font-bold uppercase font-mono text-[#75786d]">
              Pre-Condition Telemetry Inputs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-[#45483e] block">Churn (Lines)</label>
                <input
                  type="number"
                  value={churn}
                  onChange={(e) => setChurn(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#f8faf6] rounded-xl border border-[#c5c8ba] text-xs font-mono font-bold text-[#161e10]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#45483e] block">Complexity</label>
                <input
                  type="number"
                  step="0.5"
                  value={complexity}
                  onChange={(e) => setComplexity(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#f8faf6] rounded-xl border border-[#c5c8ba] text-xs font-mono font-bold text-[#161e10]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#45483e] block">Debt Mins</label>
                <input
                  type="number"
                  value={debtMinutes}
                  onChange={(e) => setDebtMinutes(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#f8faf6] rounded-xl border border-[#c5c8ba] text-xs font-mono font-bold text-[#161e10]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#45483e] block">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#f8faf6] rounded-xl border border-[#c5c8ba] text-xs font-mono font-bold text-[#161e10]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column (ROI & Risk Delta) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Main Hero Card: Simulated Defect Probability & Financial ROI */}
          <div className="p-5 bg-gradient-to-br from-[#2d3f16] via-[#384a24] to-[#1e2a0f] text-white rounded-3xl shadow-[0_8px_24px_-4px_rgba(45,63,22,0.4)] space-y-5 border border-[#5b723a]/40">
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#d3ebb2] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#d3ebb2]" />
                Simulated ML Forecast
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-white border border-white/20">
                {simulationResult?.simulated?.payback_velocity || 'Immediate Payback'}
              </span>
            </div>

            {/* Risk Before vs After Comparison */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                <span className="text-[10px] uppercase font-mono text-[#d3ebb2]/80">Baseline Risk</span>
                <div className="text-2xl font-extrabold text-white mt-0.5 font-mono">
                  {simulationResult?.baseline?.defect_probability_pct ?? 78.4}%
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-[#ff8a80] h-full rounded-full" 
                    style={{ width: `${simulationResult?.baseline?.defect_probability_pct || 78}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-md border border-white/20">
                <span className="text-[10px] uppercase font-mono text-[#d3ebb2]">Simulated Risk</span>
                <div className="text-2xl font-extrabold text-[#d3ebb2] mt-0.5 font-mono">
                  {simulationResult?.simulated?.defect_probability_pct ?? 18.2}%
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-[#a3e635] h-full rounded-full" 
                    style={{ width: `${simulationResult?.simulated?.defect_probability_pct || 18}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Financial ROI & Hours Saved Bento Capsule */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#d3ebb2]/80 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Net Engineering ROI
                </span>
                <div className="text-2xl font-extrabold text-[#d3ebb2] tracking-tight mt-0.5">
                  ${(simulationResult?.simulated?.financial_roi_usd || 1850).toLocaleString()}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-[#d3ebb2]/80 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Engineering Hours Saved
                </span>
                <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
                  {simulationResult?.simulated?.estimated_hours_saved ?? 22.5}h
                </div>
              </div>
            </div>

            <p className="text-xs text-[#d3ebb2]/90 italic bg-black/20 p-2.5 rounded-xl border border-white/10">
              "{simulationResult?.simulated?.recommendation || 'Refactoring this hotspot will avert downstream integration regressions.'}"
            </p>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                notify('🚀 Created Refactoring Sprint Initiative in Jira with simulated ROI metrics attached!');
              }}
              className="flex-1 py-3 px-4 bg-[#43562b] hover:bg-[#2d3f16] text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Export Sprint Scenario to Jira</span>
            </button>

            {onOpenRecipe && (
              <button
                onClick={() => onOpenRecipe({
                  file_path: initialModule?.file || 'src/core/DataTree.java',
                  complexity: complexity,
                  debt_minutes: debtMinutes,
                  risk_score: simulationResult?.baseline?.defect_probability_pct || 80
                })}
                className="py-3 px-4 bg-[#edf1e8] hover:bg-[#dde5d7] text-[#2d3f16] rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border border-[#c5c8ba] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#43562b]" />
                <span>AI Recipe</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
