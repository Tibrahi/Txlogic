'use client';

import { useState } from 'react';
import { mockContainers } from '@/lib/data';
import { Container } from '@/lib/types';
import Link from 'next/link';

function ContainerCard({ container, index }: { container: Container; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    in_transit: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    delivered: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    loading: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    delayed: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    pending: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  };
  const sc = statusColors[container.status] || statusColors.pending;

  const typeLabels: Record<string, string> = {
    '20ft': '20ft Standard', '40ft': '40ft Standard', '40ft_hc': '40ft High Cube', '45ft_hc': '45ft High Cube', reefer: 'Reefer',
  };

  return (
    <div
      className="animate-slide-up rounded-2xl glass overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.08)] transition-all duration-500 group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" style={{ width: `${container.progress}%` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/10 flex items-center justify-center group-hover:animate-float">
              {/* Container SVG icon */}
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">{container.containerNumber}</h3>
              <p className="text-[10px] text-gray-500">{typeLabels[container.type]} • {container.weight}t</p>
            </div>
          </div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} border ${sc.border} uppercase font-medium tracking-wider`}>
            {container.status.replace('_', ' ')}
          </span>
        </div>

        {/* Vessel Info */}
        <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
          <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white font-medium truncate">{container.vessel}</p>
            <p className="text-[10px] text-gray-500 font-mono">{container.voyage}</p>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-gray-300">{container.origin.city}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-gray-600 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-[8px] shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"
              style={{ left: `calc(${container.progress}% - 8px)` }}
            >
              🚢
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-300">{container.destination.city}</span>
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-gray-500">Voyage Progress</span>
            <span className="text-blue-400 font-mono">{container.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
              style={{ width: `${container.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
          <div className="p-2 rounded-lg bg-white/[0.02]">
            <span className="text-gray-500">Commodities</span>
            <p className="text-white font-medium">{container.commodities}</p>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02]">
            <span className="text-gray-500">Seal Number</span>
            <p className="text-white font-medium font-mono">{container.sealNumber}</p>
          </div>
          {container.temperature !== undefined && (
            <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <span className="text-blue-400">🌡️ Temperature</span>
              <p className="text-blue-400 font-medium">{container.temperature}°C</p>
            </div>
          )}
          {container.humidity !== undefined && (
            <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <span className="text-blue-400">💧 Humidity</span>
              <p className="text-blue-400 font-medium">{container.humidity}%</p>
            </div>
          )}
          <div className="p-2 rounded-lg bg-white/[0.02]">
            <span className="text-gray-500">ETA</span>
            <p className="text-cyan-400 font-medium">{container.estimatedArrival}</p>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02]">
            <span className="text-gray-500">Last Update</span>
            <p className="text-gray-300">{container.lastUpdate}</p>
          </div>
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-[11px] text-gray-500 hover:text-blue-400 transition-colors py-2 border-t border-white/5"
        >
          {expanded ? 'Hide events ▲' : 'View events ▼'}
        </button>

        {/* Events */}
        {expanded && (
          <div className="mt-4 animate-slide-up">
            <h4 className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Container Events</h4>
            <div className="space-y-0">
              {container.events.map((event, i) => (
                <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                  {i < container.events.length - 1 && (
                    <div className="absolute left-[5px] top-3 bottom-0 w-px bg-gradient-to-b from-blue-500/30 to-transparent" />
                  )}
                  <div className={`w-[11px] h-[11px] rounded-full flex-shrink-0 mt-1 ${i === 0 ? 'bg-blue-400 animate-blink' : 'bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-white">{event.status}</span>
                      <span className="text-[9px] text-gray-600 font-mono">{event.timestamp.slice(11)}</span>
                    </div>
                    {event.description && <p className="text-[10px] text-gray-400">{event.description}</p>}
                    <p className="text-[9px] text-gray-600 mt-0.5">{event.location} • {event.timestamp.slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContainersPage() {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = mockContainers.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = searchTerm === '' || c.containerNumber.toLowerCase().includes(searchTerm.toLowerCase()) || c.vessel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/" className="text-xs text-gray-500 hover:text-blue-400 transition-colors">Dashboard</Link>
          <span className="text-xs text-gray-600">/</span>
          <span className="text-xs text-gray-300">Containers</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">Container Tracking</span>
            </h1>
            <p className="text-gray-500 text-sm">{mockContainers.length} containers across {new Set(mockContainers.map(c => c.vessel)).size} vessels</p>
          </div>
        </div>
      </div>

      {/* Ocean visualization */}
      <div className="mb-8 p-6 rounded-2xl neon-border bg-surface/30 animate-slide-up overflow-hidden relative" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 1200 100">
            <path d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50" fill="none" stroke="#3b82f6" strokeWidth="1" className="animate-dash" opacity="0.5" />
            <path d="M0,60 Q150,30 300,60 T600,60 T900,60 T1200,60" fill="none" stroke="#06b6d4" strokeWidth="1" className="animate-dash" style={{ animationDelay: '0.5s' }} opacity="0.3" />
          </svg>
        </div>
        <div className="relative flex items-center justify-between">
          {mockContainers.filter(c => c.status === 'in_transit').map((c, i) => (
            <div key={c.id} className="text-center animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
              <div className="text-2xl mb-1">🚢</div>
              <p className="text-[10px] font-mono text-blue-400">{c.containerNumber.slice(-6)}</p>
              <p className="text-[9px] text-gray-600">{c.currentLocation.city}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search by container number or vessel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {['all', 'in_transit', 'delivered', 'loading', 'delayed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
              filter === f
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((container, i) => (
          <ContainerCard key={container.id} container={container} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 animate-scale-in">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500">No containers match your search</p>
        </div>
      )}
    </div>
  );
}