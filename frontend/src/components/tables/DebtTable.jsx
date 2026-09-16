import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatScore, getRiskLabel } from '../../utils/risk';
import { Code2, ArrowRight } from 'lucide-react';

export default function DebtTable({ data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[#e5ebe0] text-[#75786d] uppercase font-mono text-[10px]">
            <th className="py-3 px-4 font-bold">Module File</th>
            <th className="py-3 px-4 font-bold">Category</th>
            <th className="py-3 px-4 font-bold text-center">Severity</th>
            <th className="py-3 px-4 font-bold text-center">Current Risk</th>
            <th className="py-3 px-4 font-bold text-center">Predicted Risk</th>
            <th className="py-3 px-4 font-bold text-center">Business Impact</th>
            <th className="py-3 px-4 font-bold text-center">Priority</th>
            <th className="py-3 px-4 font-bold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f4f6f0]">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => navigate(`/files/${item.id}`)}
              className="hover:bg-[#f8faf6] cursor-pointer transition group"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#43562b]" />
                  <span className="font-mono font-semibold text-[#161e10] group-hover:text-[#43562b] transition">
                    {item.file}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-[#45483e] font-medium">{item.category}</td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  item.severity === 'critical'
                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                    : 'bg-[#ffddb8] text-[#855300]'
                }`}>
                  {getRiskLabel(item.severity)}
                </span>
              </td>
              <td className="py-3 px-4 text-center font-mono font-bold text-[#ba1a1a]">
                {formatScore(item.risk_score)}
              </td>
              <td className="py-3 px-4 text-center font-mono font-bold text-[#855300]">
                {formatScore(item.predicted_risk)}
              </td>
              <td className="py-3 px-4 text-center font-mono font-semibold text-[#161e10]">
                {formatScore(item.business_impact)} / 10
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  item.priority_level === 'CRITICAL' || item.priority_level === 'critical'
                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                    : 'bg-[#d3ebb2] text-[#2d3f16]'
                }`}>
                  {getRiskLabel(item.priority_level)}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/files/${item.id}`);
                  }}
                  className="px-2.5 py-1 bg-[#43562b] hover:bg-[#2d3f16] text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-xs ml-auto"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
