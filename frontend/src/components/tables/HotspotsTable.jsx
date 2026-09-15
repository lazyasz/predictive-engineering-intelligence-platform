import React, { useState } from 'react';
import Badge from '../ui/Badge';
import { formatScore } from '../../utils/risk';
import { Layers } from 'lucide-react';
import JiraExportModal from '../integrations/JiraExportModal';

export default function HotspotsTable({ data }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [jiraOpen, setJiraOpen] = useState(false);

  if (!data || data.length === 0) return null;

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
    setJiraOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-600">File</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Complexity</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Churn</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Defects</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Risk Score</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Business Impact</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Last Modified</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-medium text-slate-800 font-mono text-xs">{item.file}</span>
                </td>
                <td className="py-3 px-4 text-center text-slate-700">{item.complexity}</td>
                <td className="py-3 px-4 text-center text-slate-700">{item.churn}</td>
                <td className="py-3 px-4 text-center text-slate-700">{item.defects}</td>
                <td className="py-3 px-4 text-center">
                  <span className="font-bold text-rose-600">{formatScore(item.risk_score)}</span>
                </td>
                <td className="py-3 px-4 text-center text-slate-700">{formatScore(item.business_impact)}</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">{item.last_modified}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleOpenJira(item)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition cursor-pointer"
                    title="Export Hotspot to Jira"
                  >
                    <Layers className="h-3 w-3" />
                    <span>Jira</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <JiraExportModal
        isOpen={jiraOpen}
        onClose={() => setJiraOpen(false)}
        component={selectedItem}
      />
    </>
  );
}
