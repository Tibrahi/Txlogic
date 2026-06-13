'use client';

import { useState } from 'react';
import { mockCargo } from '@/lib/data';
import { CargoShipment } from '@/lib/types';
import PageHeader from '@/app/components/PageHeader';
import StatusBadge from '@/app/components/StatusBadge';
import ProgressBar from '@/app/components/ProgressBar';
import RouteVisualizer from '@/app/components/RouteVisualizer';
import SearchInput from '@/app/components/SearchInput';
import FilterBar from '@/app/components/FilterBar';
import EventTimeline from '@/app/components/EventTimeline';
import EmptyState from '@/app/components/EmptyState';
import { cargoTypeIcons, formatCurrency } from '@/lib/utils';

const statusFilters = ['all', 'in_transit', 'pending', 'delayed'];
const typeFilters = ['all', 'FCL', 'air', 'rail', 'road'];

function CargoCard({ cargo, index }: { cargo: CargoShipment; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const tc = cargoTypeIcons[cargo.type] || cargoTypeIcons.FCL;

  return (
    <div
      className="animate-slide-up rounded-2xl glass overflow-hidden hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] transition-all duration-500 group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Top accent */}
      <ProgressBar progress={cargo.progress} color="from-amber-500 via-orange-500 to-red-500" height="sm" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/10 flex items-center justify-center text-xl group-hover:animate-float">
              {tc.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">{cargo.shipmentNumber}</h3>
              <p className={`text-[10px] uppercase tracking-wider ${tc.color}`}>{cargo.type} • {cargo.cargoType}</p>
            </div>
          </div>
          <StatusBadge status={cargo.status} />
        </div>

        {/* Route */}
        <div className="mb-4">
          <RouteVisualizer
            originCity={cargo.origin.city}
            destinationCity={cargo.destination.city}
            progress={cargo.progress}
            originColor="bg-amber-400"
            destinationColor="bg-orange-400"
            icon={tc.icon}
          />
        </div>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar progress={cargo.progress} color="from-amber-500 to-orange-500" showLabel labelColor="text-amber-400" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-sm font-bold text-white">{cargo.weight}<span className="text-[9px] text-gray-500 ml-0.5">t</span></div>
            <div className="text-[9px] text-gray-500">Weight</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-sm font-bold text-white">{cargo.containers + cargo.trucks}</div>
            <div className="text-[9px] text-gray-500">Units</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-sm font-bold text-amber-400 font-mono">{formatCurrency(cargo.value)}</div>
            <div className="text-[9px] text-gray-500">Value</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {cargo.insurance && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">🛡️ Insured</span>
          )}
          {cargo.hazmat && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">☢️ Hazmat</span>
          )}
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
            ETA: {cargo.estimatedArrival}
          </span>
        </div>

        {/* Origin/Destination */}
        <div className="text-[11px] space-y-1 mb-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Origin</span>
            <span className="text-gray-300">{cargo.origin.city}, {cargo.origin.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Destination</span>
            <span className="text-gray-300">{cargo.destination.city}, {cargo.destination.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Volume</span>
            <span className="text-gray-300">{cargo.volume} m³</span>
          </div>
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-[11px] text-gray-500 hover:text-amber-400 transition-colors py-2 border-t border-white/5"
        >
          {expanded ? 'Hide timeline ▲' : 'View timeline ▼'}
        </button>

        {/* Timeline */}
        {expanded && (
          <div className="mt-4 animate-slide-up">
            <h4 className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Shipment Timeline</h4>
            <EventTimeline
              events={cargo.events.map(e => ({
                ...e,
                description: e.description || '',
              }))}
              accentColor="amber"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CargoPage() {
  const [filter, setFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockCargo.filter(c => {
    const matchesStatus = filter === 'all' || c.status === filter;
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesSearch = searchTerm === '' ||
      c.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cargoType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const totalValue = mockCargo.reduce((sum, c) => sum + c.value, 0);

  const summaryStats = [
    { label: 'Total Weight', value: `${mockCargo.reduce((s, c) => s + c.weight, 0).toLocaleString()}t`, color: 'text-amber-400', icon: '⚖️' },
    { label: 'Total Volume', value: `${mockCargo.reduce((s, c) => s + c.volume, 0).toLocaleString()}m³`, color: 'text-orange-400', icon: '📐' },
    { label: 'Active Shipments', value: mockCargo.filter(c => c.status === 'in_transit').length, color: 'text-cyan-400', icon: '🚀' },
    { label: 'Insured Cargo', value: mockCargo.filter(c => c.insurance).length, color: 'text-green-400', icon: '🛡️' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Cargo Management"
        subtitle={`$${totalValue.toLocaleString()} total cargo value across ${mockCargo.length} shipments`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/', accent: 'text-amber-400' },
          { label: 'Cargo' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 stagger-children">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl glass text-center animate-scale-in group hover:scale-[1.02] transition-all duration-300">
            <div className="text-xl mb-1 group-hover:animate-float">{stat.icon}</div>
            <div className={`text-xl font-bold ${stat.color} font-mono`}>{stat.value}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by shipment number or cargo type..."
          accentColor="amber"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 uppercase tracking-wider">Status:</span>
          <FilterBar
            filters={statusFilters}
            activeFilter={filter}
            onFilterChange={setFilter}
            accentColor="amber"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 uppercase tracking-wider">Type:</span>
          <FilterBar
            filters={typeFilters}
            activeFilter={typeFilter}
            onFilterChange={setTypeFilter}
            accentColor="orange"
            labels={{ all: 'All Types' }}
          />
        </div>
      </div>

      {/* Cargo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((cargo, i) => (
          <CargoCard key={cargo.id} cargo={cargo} index={i} />
        ))}
      </div>

      {filtered.length === 0 && <EmptyState message="No cargo shipments match your search" />}
    </div>
  );
}