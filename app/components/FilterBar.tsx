interface FilterBarProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  accentColor?: string;
  labels?: Record<string, string>;
}

export default function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  accentColor = 'cyan',
  labels,
}: FilterBarProps) {
  const activeColorMap: Record<string, string> = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  };

  const defaultLabel = (f: string) => f === 'all' ? 'All' : f.replace('_', ' ');

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
            activeFilter === f
              ? `${activeColorMap[accentColor] || activeColorMap.cyan} border border-current/30`
              : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10'
          }`}
        >
          {labels?.[f] || defaultLabel(f)}
        </button>
      ))}
    </div>
  );
}