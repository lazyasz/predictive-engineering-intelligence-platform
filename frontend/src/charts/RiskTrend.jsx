import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function RiskTrend({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: 'none',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '12px',
          }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="risk_score"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 4, fill: '#6366f1' }}
          name="Actual Risk"
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="predicted_risk"
          stroke="#f97316"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 4, fill: '#f97316' }}
          name="Predicted Risk"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
