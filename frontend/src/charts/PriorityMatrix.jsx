import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';

export default function PriorityMatrix({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          type="number"
          dataKey="remediation_effort"
          name="Remediation Effort"
          domain={[0, 10]}
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
          label={{ value: 'Remediation Effort', position: 'bottom', fontSize: 11, fill: '#94a3b8' }}
        />
        <YAxis
          type="number"
          dataKey="business_impact"
          name="Business Impact"
          domain={[0, 10]}
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
          label={{ value: 'Business Impact', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
        />
        <ZAxis type="number" dataKey="risk_score" range={[80, 400]} name="Risk Score" />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{
            backgroundColor: '#1e293b',
            border: 'none',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '12px',
          }}
          formatter={(value, name) => [value, name]}
        />
        <Scatter name="Files" data={data} fill="#6366f1" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
