interface RouteVisualizerProps {
  originCity: string;
  destinationCity: string;
  progress: number;
  originColor?: string;
  destinationColor?: string;
  icon?: string;
}

export default function RouteVisualizer({
  originCity,
  destinationCity,
  progress,
  originColor = 'bg-cyan-400',
  destinationColor = 'bg-purple-400',
  icon = '🚛',
}: RouteVisualizerProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${originColor}`} />
        <span className="text-gray-300">{originCity}</span>
      </div>
      <div className="flex-1 border-t border-dashed border-gray-600 relative">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-[8px] shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
          style={{ left: `calc(${progress}% - 8px)` }}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-300">{destinationCity}</span>
        <div className={`w-2 h-2 rounded-full ${destinationColor}`} />
      </div>
    </div>
  );
}