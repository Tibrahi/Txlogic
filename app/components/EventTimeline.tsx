interface Event {
  timestamp: string;
  location: string;
  status: string;
  description: string;
  vessel?: string;
  voyage?: string;
  milestone?: boolean;
}

interface EventTimelineProps {
  events: Event[];
  accentColor?: string; // e.g. 'purple' or 'blue'
}

export default function EventTimeline({ events, accentColor = 'purple' }: EventTimelineProps) {
  const colorMap: Record<string, { dot: string; line: string; blink: string }> = {
    purple: { dot: 'bg-purple-400', line: 'from-purple-500/30', blink: 'animate-blink' },
    blue: { dot: 'bg-blue-400', line: 'from-blue-500/30', blink: 'animate-blink' },
    amber: { dot: 'bg-amber-400', line: 'from-amber-500/30', blink: 'animate-blink' },
    cyan: { dot: 'bg-cyan-400', line: 'from-cyan-500/30', blink: 'animate-blink' },
  };

  const colors = colorMap[accentColor] || colorMap.purple;

  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
          {i < events.length - 1 && (
            <div className={`absolute left-[5px] top-3 bottom-0 w-px bg-gradient-to-b ${colors.line} to-transparent`} />
          )}
          <div className={`w-[11px] h-[11px] rounded-full flex-shrink-0 mt-1 ${i === 0 ? `${colors.dot} ${colors.blink}` : 'bg-gray-600'}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-medium text-white">{event.status}</span>
              <span className="text-[9px] text-gray-600 font-mono">{event.timestamp.slice(11)}</span>
            </div>
            <p className="text-[10px] text-gray-400">{event.description}</p>
            <p className="text-[9px] text-gray-600 mt-0.5">{event.location} • {event.timestamp.slice(0, 10)}</p>
            {(event.vessel || event.milestone) && (
              <div className="flex items-center gap-2 mt-0.5">
                {event.vessel && (
                  <span className="text-[8px] text-gray-500">Vessel: {event.vessel}</span>
                )}
                {event.milestone && (
                  <span className="inline-block text-[8px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Milestone</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}