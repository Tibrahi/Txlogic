import { getStatusDotColor } from '@/lib/utils';

interface StatusDotProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusDot({ status, size = 'sm' }: StatusDotProps) {
  const color = getStatusDotColor(status);
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return <span className={`inline-block rounded-full animate-blink ${sizeClasses[size]} ${color}`} />;
}