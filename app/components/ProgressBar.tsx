interface ProgressBarProps {
  progress: number;
  color?: string; // Tailwind gradient classes e.g. 'from-cyan-500 to-purple-500'
  height?: 'sm' | 'md';
  showLabel?: boolean;
  labelColor?: string;
}

export default function ProgressBar({
  progress,
  color = 'from-cyan-500 to-purple-500',
  height = 'sm',
  showLabel = false,
  labelColor = 'text-cyan-400',
}: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
  };

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-gray-500">Progress</span>
          <span className={`font-mono ${labelColor}`}>{progress}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-gray-800 overflow-hidden ${heightClasses[height]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}