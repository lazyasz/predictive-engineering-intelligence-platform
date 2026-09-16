import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
} from 'recharts';

export default function PriorityMatrix({ data, onSelectPoint }) {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="p-3 bg-[#1e2a0f] border border-[#43562b] rounded-2xl shadow-xl text-white text-xs space-y-1.5 min-w-[200px]">
          <p className="font-mono font-bold text-[#d3ebb2] truncate">{item.file || item.name || 'Component'}</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/10">
            <div>
              <span className="text-[#bec6a9] block">Business Impact:</span>
              <span className="font-bold text-white">{item.business_impact || 7.5} / 10</span>
            </div>
            <div>
              <span className="text-[#bec6a9] block">Effort:</span>
              <span className="font-bold text-white">{item.remediation_effort || 4.2}h</span>
            </div>
            <div>
              <span className="text-[#bec6a9] block">Risk Score:</span>
              <span className="font-bold text-[#ba1a1a]">{item.risk_score || 82.0}</span>
            </div>
            <div>
              <span className="text-[#bec6a9] block">Quadrant:</span>
              <span className="font-bold text-[#d3ebb2]">
                {(item.business_impact || 7) >= 5 && (item.remediation_effort || 4) <= 5 ? 'Quick Win' : 'Strategic'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-[380px]">
      {/* Quadrant Background Labels */}
      <div className="absolute top-3 left-12 text-[10px] font-mono font-bold uppercase tracking-wider text-[#43562b]/50 pointer-events-none">
        ⭐ Quick Wins (High Impact, Low Effort)
      </div>
      <div className="absolute top-3 right-6 text-[10px] font-mono font-bold uppercase tracking-wider text-[#855300]/50 pointer-events-none">
        🎯 Strategic Refactoring (High Impact, High Effort)
      </div>
      <div className="absolute bottom-10 left-12 text-[10px] font-mono font-bold uppercase tracking-wider text-[#75786d]/50 pointer-events-none">
        💤 Deprioritized (Low Impact, Low Effort)
      </div>
      <div className="absolute bottom-10 right-6 text-[10px] font-mono font-bold uppercase tracking-wider text-[#ba1a1a]/40 pointer-events-none">
        ⚠️ High Effort, Low ROI
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dce6d0" />
          <XAxis
            type="number"
            dataKey="remediation_effort"
            name="Remediation Effort"
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: '#75786d', fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#c5c8ba' }}
            tickLine={false}
            label={{ value: 'Remediation Effort (Hours / Complexity) →', position: 'bottom', fontSize: 11, fill: '#45483e', offset: 5 }}
          />
          <YAxis
            type="number"
            dataKey="business_impact"
            name="Business Impact"
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: '#75786d', fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#c5c8ba' }}
            tickLine={false}
            label={{ value: '↑ Business Impact Score', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#45483e' }}
          />
          <ZAxis type="number" dataKey="risk_score" range={[100, 500]} name="Risk Score" />
          
          <ReferenceLine x={5} stroke="#556437" strokeDasharray="4 4" strokeOpacity={0.6} />
          <ReferenceLine y={5} stroke="#556437" strokeDasharray="4 4" strokeOpacity={0.6} />

          <Tooltip content={<CustomTooltip />} />
          <Scatter 
            name="Refactoring Targets" 
            data={data} 
            fill="#43562b" 
            fillOpacity={0.8}
            onClick={(point) => onSelectPoint && onSelectPoint(point)}
            className="cursor-pointer"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
