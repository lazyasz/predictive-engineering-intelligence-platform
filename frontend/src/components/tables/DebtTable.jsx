import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatScore, getRiskLabel } from '../../utils/risk';

export default function DebtTable({ data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-600">File</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600">Category</th>
            <th className="text-center py-3 px-4 font-semibold text-slate-600">Severity</th>
            <th className="text-center py-3 px-4 font-semibold text-slate-600">Risk Score</th>
            <th className="text-center py-3 px-4 font-semibold text-slate-600">Predicted Risk</th>
            <th className="text-center py-3 px-4 font-semibold text-slate-600">Business Impact</th>
            <th className="text-center py-3 px-4 font-semibold text-slate-600">Priority</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => navigate(`/files/${item.id}`)}
              className="hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <td className="py-3 px-4">
                <span className="font-medium text-slate-800 font-mono text-xs">{item.file}</span>
              </td>
              <td className="py-3 px-4 text-slate-600">{item.category}</td>
              <td className="py-3 px-4 text-center">
                <Badge variant={item.severity}>{getRiskLabel(item.severity)}</Badge>
              </td>
              <td className="py-3 px-4 text-center font-medium text-slate-800">{formatScore(item.risk_score)}</td>
              <td className="py-3 px-4 text-center font-medium text-slate-600">{formatScore(item.predicted_risk)}</td>
              <td className="py-3 px-4 text-center font-medium text-slate-600">{formatScore(item.business_impact)}</td>
              <td className="py-3 px-4 text-center">
                <Badge variant={item.priority_level}>{getRiskLabel(item.priority_level)}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
