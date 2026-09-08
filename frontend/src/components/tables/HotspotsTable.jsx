import Badge from '../ui/Badge';
import { formatScore } from '../../utils/risk';

export default function HotspotsTable({ data }) {
  if (!data || data.length === 0) return null;

  return (
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
                <span className="font-bold text-slate-800">{formatScore(item.risk_score)}</span>
              </td>
              <td className="py-3 px-4 text-center text-slate-700">{formatScore(item.business_impact)}</td>
              <td className="py-3 px-4 text-center text-slate-500 text-xs">{item.last_modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
