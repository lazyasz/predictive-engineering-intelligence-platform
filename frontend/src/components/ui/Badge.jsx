import { getRiskBadgeColor } from '../../utils/risk';

export default function Badge({ variant = 'medium', children }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getRiskBadgeColor(variant)}`}
    >
      {children}
    </span>
  );
}
