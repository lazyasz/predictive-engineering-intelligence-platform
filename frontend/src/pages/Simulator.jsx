import React, { useState } from 'react';
import { 
  Sliders, 
  GitPullRequest, 
  Layers, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Zap,
  TrendingDown
} from 'lucide-react';
import WhatIfSimulator from '../components/simulator/WhatIfSimulator';
import PrRiskGateSimulator from '../components/cicd/PrRiskGateSimulator';
import CodebaseTopologyTreemap from '../components/topology/CodebaseTopologyTreemap';
import RemediationRecipeModal from '../components/remediation/RemediationRecipeModal';
import ExecutiveReportModal from '../components/reports/ExecutiveReportModal';

export default function Simulator() {
  const [activeTab, setActiveTab] = useState('what-if'); // 'what-if' | 'topology' | 'pr-gate'
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [recipeTargetFile, setRecipeTargetFile] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedModuleForSimulator, setSelectedModuleForSimulator] = useState(null);

  const handleOpenRecipe = (fileObj) => {
    setRecipeTargetFile(fileObj);
    setRecipeModalOpen(true);
  };

  const handleOpenSimulator = (fileObj) => {
    setSelectedModuleForSimulator(fileObj);
    setActiveTab('what-if');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1720px] mx-auto animate-fade-in">
      
      {/* Top Hero Banner with Mode Selector */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-[#d4dece] shadow-[0_4px_20px_-4px_rgba(45,63,22,0.06)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f1db] text-[#2d3f16] font-mono text-[11px] font-bold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5 text-[#43562b]" />
              Predictive Simulation & CI/CD Gates
            </span>
            <span className="text-xs text-[#75786d] font-mono">Real-time SZZ Model Inference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161e10] tracking-tight">
            Refactoring ROI & Pre-Merge Risk Engine
          </h1>
          <p className="text-sm text-[#45483e] max-w-3xl">
            Simulate code improvements, explore codebase spatial topology, and enforce automated pre-merge risk gates before production deploys.
          </p>
        </div>

        {/* Action Button: 1-Click Executive PDF Report */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#43562b] hover:bg-[#2d3f16] text-white text-xs font-bold transition shadow-[0_4px_14px_rgba(45,63,22,0.3)] hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Executive Audit PDF</span>
          </button>
        </div>
      </section>

      {/* Feature Switcher Tabs */}
      <div className="flex items-center gap-2 bg-[#edf1e8] p-1.5 rounded-2xl border border-[#c5c8ba] max-w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('what-if')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'what-if'
              ? 'bg-[#43562b] text-white shadow-sm'
              : 'text-[#45483e] hover:text-[#161e10] hover:bg-[#dde5d7]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>What-If ROI Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('topology')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'topology'
              ? 'bg-[#43562b] text-white shadow-sm'
              : 'text-[#45483e] hover:text-[#161e10] hover:bg-[#dde5d7]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Codebase Hotspot Treemap</span>
        </button>

        <button
          onClick={() => setActiveTab('pr-gate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'pr-gate'
              ? 'bg-[#43562b] text-white shadow-sm'
              : 'text-[#45483e] hover:text-[#161e10] hover:bg-[#dde5d7]'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>GitHub CI/CD Risk Gate</span>
        </button>
      </div>

      {/* Active Feature Component */}
      <div className="space-y-6">
        {activeTab === 'what-if' && (
          <WhatIfSimulator
            initialModule={selectedModuleForSimulator}
            onOpenRecipe={handleOpenRecipe}
          />
        )}

        {activeTab === 'topology' && (
          <CodebaseTopologyTreemap
            onOpenRecipe={handleOpenRecipe}
            onOpenSimulator={handleOpenSimulator}
          />
        )}

        {activeTab === 'pr-gate' && (
          <PrRiskGateSimulator
            onOpenRecipe={handleOpenRecipe}
          />
        )}
      </div>

      {/* Modals */}
      <RemediationRecipeModal
        isOpen={recipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
        targetFile={recipeTargetFile}
      />

      <ExecutiveReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

    </div>
  );
}
