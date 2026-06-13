import { getStatusColor, formatStatus } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const sc = getStatusColor(status);

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-1',
    md: 'text-xs px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-wider uppercase ${sizeClasses[size]} ${sc.bg} ${sc.text} border ${sc.border}`}
    >
      {formatStatus(status)}
    </span>
  );
}