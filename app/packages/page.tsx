'use client';

import { useState } from 'react';
import { mockPackages } from '@/lib/data';
import { Package } from '@/lib/types';
import PageHeader from '@/app/components/PageHeader';
import StatusBadge from '@/app/components/StatusBadge';
import ProgressBar from '@/app/components/ProgressBar';
import RouteVisualizer from '@/app/components/RouteVisualizer';
import SearchInput from '@/app/components/SearchInput';
import FilterBar from '@/app/components/FilterBar';
import EventTimeline from '@/app/components/EventTimeline';
import EmptyState from '@/app/components/EmptyState';

const statusFilters = ['all', 'in_transit', 'delivered', 'pending', 'loading', 'delayed'];

const typeColors: Record<string, string> = {
  express: 'text-amber-400',
  fragile: 'text-rose-400',
  hazardous: 'text-red-400',
  standard: 'text-gray-400',
};

function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-slide-up rounded-2xl glass overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] transition-all duration-500 group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Top accent */}
      <ProgressBar progress={pkg.progress} color="from-purple-500 via-pink-500 to-rose-500" height="sm" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/10 flex items-center justify-center text-lg group-hover:animate-float">
              📦
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">{pkg.trackingNumber}</h3>
              <p className={`text-[10px] uppercase tracking-wider ${typeColors[pkg.type] || 'text-gray-400'}`}>{pkg.type}</p>
            </div>
          </div>
          <StatusBadge status={pkg.status} />
        </div>

        {/* Route */}
        <div className="mb-4">
          <RouteVisualizer
            originCity={pkg.origin.city}
            destinationCity={pkg.destination.city}
            progress={pkg.progress}
            originColor="bg-purple-400"
            destinationColor="bg-pink-400"
            icon="📦"
          />
        </div>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar progress={pkg.progress} color="from-purple-500 to-pink-500" showLabel labelColor="text-purple-400" />
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-sm font-bold text-white">{pkg.weight}<span className="text-[9px] text-gray-500 ml-0.5">kg</span></div>
            <div className="text-[9px] text-gray-500">Weight</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-xs font-bold text-white truncate">{pkg.dimensions.split(' ')[0]}</div>
            <div className="text-[9px] text-gray-500">Size</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-xs font-bold text-cyan-400">{pkg.estimatedDelivery.slice(5)}</div>
            <div className="text-[9px] text-gray-500">ETA</div>
          </div>
        </div>

        {/* Sender/Receiver */}
        <div className="text-[11px] space-y-1 mb-3">
          <div className="flex justify-between">
            <span className="text-gray-500">From</span>
            <span className="text-gray-300">{pkg.sender}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">To</span>
            <span className="text-gray-300">{pkg.receiver}</span>
          </div>
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-[11px] text-gray-500 hover:text-purple-400 transition-colors py-2 border-t border-white/5"
        >
          {expanded ? 'Hide timeline ▲' : 'View timeline ▼'}
        </button>

        {/* Timeline */}
        {expanded && (
          <div className="mt-4 animate-slide-up">
            <h4 className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Tracking Timeline</h4>
            <EventTimeline
              events={pkg.events.map(e => ({ ...e, description: e.description || '' }))}
              accentColor="purple"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockPackages.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = searchTerm === '' ||
      p.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Package Tracking"
        subtitle={`${mockPackages.length} packages across ${new Set(mockPackages.map(p => p.origin.country)).size} countries`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/', accent: 'text-purple-400' },
          { label: 'Packages' },
        ]}
      />

      {/* Search */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by tracking number or sender..."
          accentColor="purple"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <FilterBar
          filters={statusFilters}
          activeFilter={filter}
          onFilterChange={setFilter}
          accentColor="purple"
        />
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((pkg, i) => (
          <PackageCard key={pkg.id} pkg={pkg} index={i} />
        ))}
      </div>

      {filtered.length === 0 && <EmptyState message="No packages match your search" />}
    </div>
  );
}