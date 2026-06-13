'use client';

import { useState, useEffect, useCallback } from 'react';
import { mockTrucks, mockPackages, mockContainers, mockCargo } from '@/lib/data';
import NavLink from '@/app/components/NavLink';

type Entity = {
  id: string;
  name: string;
  type: 'truck' | 'package' | 'container' | 'cargo';
  lat: number;
  lng: number;
  status: string;
  speed?: number;
  city: string;
};

const allEntities: Entity[] = [
  ...mockTrucks.map(t => ({ id: t.id, name: t.name, type: 'truck' as const, lat: t.location.lat, lng: t.location.lng, status: t.status, speed: t.speed, city: t.location.city })),
  ...mockPackages.map(p => ({ id: p.id, name: p.trackingNumber, type: 'package' as const, lat: p.currentLocation.lat, lng: p.currentLocation.lng, status: p.status, city: p.currentLocation.city })),
  ...mockContainers.map(c => ({ id: c.id, name: c.containerNumber, type: 'container' as const, lat: c.currentLocation.lat, lng: c.currentLocation.lng, status: c.status, city: c.currentLocation.city })),
  ...mockCargo.map(c => ({ id: c.id, name: c.shipmentNumber, type: 'cargo' as const, lat: c.currentLocation.lat, lng: c.currentLocation.lng, status: c.status, city: c.currentLocation.city })),
];

// Map projection: Africa/East Africa region
function projectToSVG(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - 10) / 80) * 900 + 50;
  const y = ((20 - lat) / 40) * 500 + 50;
  return { x: Math.max(20, Math.min(980, x)), y: Math.max(20, Math.min(480, y)) };
}

const typeEmoji: Record<string, string> = { truck: '🚛', package: '📦', container: '🚢', cargo: '✈️' };
const typeColor: Record<string, string> = { truck: '#06b6d4', package: '#8b5cf6', container: '#3b82f6', cargo: '#f59e0b' };

export default function TrackingPage() {
  const [time, setTime] = useState(new Date());
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [events, setEvents] = useState<{ time: string; text: string; type: string }[]>([
    { time: '14:32', text: 'Eagle Express passed Arusha checkpoint', type: 'truck' },
    { time: '14:28', text: 'TXLU-7842936 updated position: Indian Ocean', type: 'container' },
    { time: '14:25', text: 'TXL-2026-UG-72349 cleared Eldoret border', type: 'package' },
    { time: '14:20', text: 'CARGO-2026-KE-00142 containers loaded at Mombasa', type: 'cargo' },
    { time: '14:15', text: 'Night Owl speed: 95 km/h on Mogadishu-Nairobi route', type: 'truck' },
  ]);

  const generateRandomEvent = useCallback(() => {
    const events = [
      'Updated GPS position', 'Speed changed', 'Fuel level updated',
      'Route checkpoint cleared', 'Temperature reading: 4°C', 'ETA recalculated',
      'Vessel position updated', 'Border crossing detected', 'Warehouse scan complete',
      'Cargo weight verified', 'Container seal intact', 'Driver rest break ended',
      'Traffic delay on route', 'Weather update received', 'Speed: 85 km/h',
    ];
    const names = allEntities.map(e => e.name).slice(0, 6);
    return `${names[Math.floor(Math.random() * names.length)]}: ${events[Math.floor(Math.random() * events.length)]}`;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEvents(prev => {
        const newEvents = [
          { time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), text: generateRandomEvent(), type: ['truck', 'package', 'container', 'cargo'][Math.floor(Math.random() * 4)] },
        ];
        return [...newEvents, ...prev].slice(0, 20);
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [generateRandomEvent]);

  const filtered = filter === 'all' ? allEntities : allEntities.filter(e => e.type === filter);

  // SVG route lines
  const routes = [
    { from: 'Nairobi', to: 'Dar es Salaam', color: '#06b6d4' },
    { from: 'Kampala', to: 'Goma', color: '#10b981' },
    { from: 'Mombasa', to: 'Singapore', color: '#3b82f6' },
    { from: 'Kigali', to: 'Mwanza', color: '#ec4899' },
    { from: 'Mogadishu', to: 'Nairobi', color: '#f59e0b' },
  ];

  const cityPositions: Record<string, { lat: number; lng: number }> = {
    'Nairobi': { lat: -1.2921, lng: 36.8219 },
    'Dar es Salaam': { lat: -6.7924, lng: 39.2083 },
    'Kampala': { lat: 0.3476, lng: 32.5825 },
    'Goma': { lat: -1.6830, lng: 29.2260 },
    'Mombasa': { lat: -4.0435, lng: 39.6682 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Kigali': { lat: -1.9403, lng: 29.8739 },
    'Mwanza': { lat: -2.5489, lng: 32.8986 },
    'Mogadishu': { lat: 2.0469, lng: 45.3182 },
    'Addis Ababa': { lat: 9.0250, lng: 38.7469 },
    'Dodoma': { lat: -6.1630, lng: 35.7516 },
    'Luanda': { lat: -8.8390, lng: 13.2894 },
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <NavLink href="/" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">Dashboard</NavLink>
          <span className="text-xs text-gray-600">/</span>
          <span className="text-xs text-gray-300">Live Tracking</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">Live Tracking Control</span>
            </h1>
            <p className="text-gray-500 text-sm">Real-time positions of all tracked entities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-blink" />
              <span className="text-xs font-mono text-gray-300">LIVE</span>
              <span className="text-xs font-mono text-cyan-400">
                {time.toLocaleTimeString('en-US', { timeZone: 'Africa/Kigali', hour12: false })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Map */}
        <div className="xl:col-span-3 rounded-2xl neon-border bg-surface/30 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Map filter bar */}
          <div className="flex items-center gap-2 p-3 border-b border-border/30">
            {['all', 'truck', 'package', 'container', 'cargo'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] px-2.5 py-1 rounded-lg transition-all duration-300 ${
                  filter === f
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10'
                }`}
              >
                {f === 'all' ? '🌐 All' : f === 'truck' ? '🚛 Trucks' : f === 'package' ? '📦 Packages' : f === 'container' ? '🚢 Containers' : '✈️ Cargo'}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-blink" />
              <span className="text-[9px] text-gray-600 font-mono">{filtered.length} entities</span>
            </div>
          </div>

          {/* SVG Map */}
          <div className="relative bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] h-[450px] overflow-hidden">
            {/* Grid overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 550">
              {Array.from({ length: 25 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 22} x2="1000" y2={i * 22} stroke="#06b6d4" strokeWidth="0.3" />
              ))}
              {Array.from({ length: 50 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="550" stroke="#06b6d4" strokeWidth="0.3" />
              ))}
            </svg>

            {/* Land masses (simplified) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 550">
              <defs>
                <radialGradient id="landGrad" cx="30%" cy="40%">
                  <stop offset="0%" stopColor="#1a3a4a" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0d1f3c" stopOpacity="0.2" />
                </radialGradient>
              </defs>
              {/* Simplified Africa outline */}
              <path
                d="M 100,30 Q 120,20 180,15 Q 250,10 300,20 Q 320,25 330,50 Q 340,80 320,100 Q 310,120 280,150 Q 260,170 240,200 Q 230,230 220,270 Q 210,310 200,350 Q 190,380 170,400 Q 160,410 150,400 Q 140,380 130,350 Q 120,320 115,290 Q 110,260 105,230 Q 100,200 95,170 Q 90,140 90,110 Q 90,80 95,50 Z"
                fill="url(#landGrad)"
                stroke="#06b6d4"
                strokeWidth="0.5"
                opacity="0.3"
              />
              {/* East Africa detail */}
              <path
                d="M 200,20 Q 220,15 240,20 Q 260,30 270,50 Q 280,70 275,90 Q 270,110 260,130 Q 250,150 240,160 Q 230,170 220,165 Q 210,160 200,150 Q 190,140 185,120 Q 180,100 185,80 Q 190,60 195,40 Z"
                fill="url(#landGrad)"
                stroke="#06b6d4"
                strokeWidth="0.5"
                opacity="0.4"
              />
            </svg>

            {/* Route lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 550">
              {routes.map((route, i) => {
                const fromCity = cityPositions[route.from];
                const toCity = cityPositions[route.to];
                if (!fromCity || !toCity) return null;
                const from = projectToSVG(fromCity.lat, fromCity.lng);
                const to = projectToSVG(toCity.lat, toCity.lng);
                const midX = (from.x + to.x) / 2;
                const midY = Math.min(from.y, to.y) - 30;
                return (
                  <g key={i}>
                    <path
                      d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                      fill="none"
                      stroke={route.color}
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                      opacity="0.4"
                      className="animate-dash"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                    <circle cx={from.x} cy={from.y} r="3" fill={route.color} opacity="0.7" className="animate-blink" style={{ animationDelay: `${i * 0.3}s` }} />
                    <circle cx={to.x} cy={to.y} r="3" fill={route.color} opacity="0.7" className="animate-blink" style={{ animationDelay: `${i * 0.3 + 0.5}s` }} />
                  </g>
                );
              })}

              {/* Moving entities */}
              {filtered.map((entity, i) => {
                const pos = projectToSVG(entity.lat, entity.lng);
                const color = typeColor[entity.type];
                return (
                  <g key={entity.id} className="cursor-pointer" onClick={() => setSelectedEntity(entity)}>
                    {/* Pulse ring */}
                    <circle cx={pos.x} cy={pos.y} r="15" fill={color} opacity="0.1" className="animate-blink" style={{ animationDelay: `${i * 0.2}s` }} />
                    <circle cx={pos.x} cy={pos.y} r="10" fill={color} opacity="0.15" />
                    {/* Entity dot */}
                    <circle cx={pos.x} cy={pos.y} r="5" fill={color} stroke="white" strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
                    {/* Label */}
                    <text x={pos.x + 10} y={pos.y - 8} fill={color} fontSize="8" fontFamily="monospace" opacity="0.8">
                      {entity.name.length > 15 ? entity.name.slice(-8) : entity.name}
                    </text>
                    <text x={pos.x + 10} y={pos.y + 2} fill="#6b7280" fontSize="7" fontFamily="monospace" opacity="0.6">
                      {entity.city}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Compass */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <div className="text-[9px] text-cyan-400 font-bold">N</div>
            </div>

            {/* Scale */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1">
              <div className="w-16 h-px bg-gray-500" />
              <span className="text-[8px] text-gray-600">~500km</span>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Entity detail */}
          <div className="rounded-2xl glass p-4 animate-slide-right" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
              {selectedEntity ? 'Entity Details' : 'Select an entity on the map'}
            </h3>
            {selectedEntity ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-lg">
                    {typeEmoji[selectedEntity.type]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white font-mono">{selectedEntity.name}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{selectedEntity.type} • {selectedEntity.status.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white/[0.02]">
                    <span className="text-gray-500">Location</span>
                    <p className="text-white">{selectedEntity.city}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02]">
                    <span className="text-gray-500">Speed</span>
                    <p className="text-cyan-400 font-mono">{selectedEntity.speed || 'N/A'} km/h</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02]">
                    <span className="text-gray-500">Lat</span>
                    <p className="text-white font-mono text-[10px]">{selectedEntity.lat.toFixed(4)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02]">
                    <span className="text-gray-500">Lng</span>
                    <p className="text-white font-mono text-[10px]">{selectedEntity.lng.toFixed(4)}</p>
                  </div>
                </div>
          <NavLink
            href={selectedEntity.type === 'truck' ? '/trucks' : selectedEntity.type === 'package' ? '/packages' : selectedEntity.type === 'container' ? '/containers' : '/cargo'}
            className="block text-center text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors py-2 border-t border-white/5"
          >
            View full details →
          </NavLink>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <div className="text-3xl mb-2 animate-float">🗺️</div>
                <p className="text-[10px]">Click any entity on the map</p>
              </div>
            )}
          </div>

          {/* Live Event Feed */}
          <div className="rounded-2xl glass p-4 animate-slide-right" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-blink" />
              Live Event Feed
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {events.map((event, i) => {
                const color = typeColor[event.type] || '#6b7280';
                return (
                  <div key={`${event.time}-${i}`} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-300 leading-tight">{event.text}</p>
                      <p className="text-[8px] text-gray-600 font-mono mt-0.5">{event.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-2xl glass p-4 animate-slide-right" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Legend</h3>
            <div className="space-y-2">
              {Object.entries(typeColor).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="text-[10px] text-gray-400 capitalize">{type}s</span>
                  <span className="text-[10px] text-gray-600 font-mono ml-auto">{allEntities.filter(e => e.type === type).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}