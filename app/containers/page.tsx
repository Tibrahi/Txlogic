'use client';

import { useState } from 'react';
import { mockContainers } from '@/lib/data';
import { Container } from '@/lib/types';
import PageHeader from '@/app/components/PageHeader';
import StatusBadge from '@/app/components/StatusBadge';
import ProgressBar from '@/app/components/ProgressBar';
import RouteVisualizer from '@/app/components/RouteVisualizer';
import SearchInput from '@/app/components/SearchInput';
import FilterBar from '@/app/components/FilterBar';
import EventTimeline from '@/app/components/EventTimeline';
import EmptyState from '@/app/components/EmptyState';
import { containerTypeLabels } from '@/lib/utils';

const statusFilters = ['all', 'in_transit', 'delivered', 'loading', 'delayed'];

function ContainerCard({ container, index }: { container: Container; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-slide-up rounded-2xl glass overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.08)] transition-all duration-500 group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Top accent */}
      <ProgressBar progress={container.progress} color="from-blue-500 via-cyan-500 to-teal-500" height="sm" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/10 flex items-center justify-center group-hover:animate-float">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">{container.containerNumber}</h3>
              <p className="text-[10px] text-gray-500">{containerTypeLabels[container.type] || container.type} • {container.weight}t</p>
            </div>
          </div>
          <StatusBadge status={container.status} />
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
        <div className="mb-4">
          <RouteVisualizer
            originCity={container.origin.city}
            destinationCity={container.destination.city}
            progress={container.progress}
            originColor="bg-blue-400"
            destinationColor="bg-cyan-400"
            icon="🚢"
          />
        </div>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar progress={container.progress} color="from-blue-500 to-cyan-500" showLabel labelColor="text-blue-400" />
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
            <EventTimeline
              events={container.events.map(e => ({
                ...e,
                description: e.description || '',
              }))}
              accentColor="blue"
            />
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
    const matchesSearch = searchTerm === '' ||
      c.containerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vessel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Container Tracking"
        subtitle={`${mockContainers.length} containers across ${new Set(mockContainers.map(c => c.vessel)).size} vessels`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/', accent: 'text-blue-400' },
          { label: 'Containers' },
        ]}
      />

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
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by container number or vessel..."
          accentColor="blue"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <FilterBar
          filters={statusFilters}
          activeFilter={filter}
          onFilterChange={setFilter}
          accentColor="blue"
        />
      </div>

      {/* Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((container, i) => (
          <ContainerCard key={container.id} container={container} index={i} />
        ))}
      </div>

      {filtered.length === 0 && <EmptyState message="No containers match your search" />}
    </div>
  );
}