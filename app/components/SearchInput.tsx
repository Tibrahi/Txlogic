interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accentColor?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  accentColor = 'cyan',
}: SearchInputProps) {
  const focusColorMap: Record<string, string> = {
    cyan: 'focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]',
    purple: 'focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]',
    blue: 'focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    amber: 'focus:border-amber-500/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]',
  };

  return (
    <div className="relative max-w-md">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${focusColorMap[accentColor] || focusColorMap.cyan}`}
      />
    </div>
  );
}