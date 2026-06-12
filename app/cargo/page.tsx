'use client';

import { useState } from 'react';
import { mockCargo } from '@/lib/data';
import { CargoShipment } from '@/lib/types';
import Link from 'next/link';

function CargoCard({ cargo, index }: { cargo: CargoShipment; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    in_transit: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    delivered: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    pending: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    delayed: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    loading: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  };
  const sc = statusColors[cargo.status] || statusColors.pending;

  const typeLabels: Record<string, { icon: string; color: string }> = {
    FCL: { icon: '📦', color: 'text-amber-400' },
    LCL: { icon: '📋', color: 'text-blue-400' },
    air: { icon: '✈️', color: 'text-sky-400' },
    rail: { icon: '🚂', color: 'text-green-400' },
    road: { icon: '🚛', color: 'text-orange-400' },
  };
  const tc = typeLabels[cargo.type] || typeLabels.FCL;

  return (
    <div
      className="animate-slide-up rounded-2xl glass overflow-hidden hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] transition-all duration-500 group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" style={{ width: `${cargo.progress}%` }} />

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
          <span className={`text-[10px] px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} border ${sc.border} uppercase font-medium tracking-wider`}>
            {cargo.status.replace('_', ' ')}
          </span>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-gray-300">{cargo.origin.city}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-gray-600 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-[8px] shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000"
              style={{ left: `calc(${cargo.progress}% - 8px)` }}
            >
              {tc.icon}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-300">{cargo.destination.city}</span>
            <div className="w-2 h-2 rounded-full bg-orange-400" />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-gray-500">Shipment Progress</span>
            <span className="text-amber-400 font-mono">{cargo.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
              style={{ width: `${cargo.progress}%` }}
            />
          </div>
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
            <div className="text-sm font-bold text-amber-400 font-mono">${(cargo.value / 1000).toFixed(0)}K</div>
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
            <div className="space-y-0">
              {cargo.events.map((event, i) => (
                <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                  {i < cargo.events.length - 1 && (
                    <div className="absolute left-[5px] top-3 bottom-0 w-px bg-gradient-to-b from-amber-500/30 to-transparent" />
                  )}
                  <div className={`w-[11px] h-[11px] rounded-full flex-shrink-0 mt-1 ${i === 0 ? 'bg-amber-400 animate-blink' : event.milestone ? 'bg-amber-600' : 'bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-white">{event.status}</span>
                      <span className="text-[9px] text-gray-600 font-mono">{event.timestamp.slice(11)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{event.description}</p>
                    <p className="text-[9px] text-gray-600 mt-0.5">{event.location} • {event.timestamp.slice(0, 10)}</p>
                    {event.milestone && (
                      <span className="inline-block mt-1 text-[8px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Milestone</span>
                    )}
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

export default function CargoPage() {
  const [filter, setFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = mockCargo.filter(c => {
    const matchesStatus = filter === 'all' || c.status === filter;
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesSearch = searchTerm === '' || c.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) || c.cargoType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const totalValue = mockCargo.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Dashboard</Link>
          <span className="text-xs text-gray-600">/</span>
          <span className="text-xs text-gray-300">Cargo</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">Cargo Management</span>
            </h1>
            <p className="text-gray-500 text-sm">${totalValue.toLocaleString()} total cargo value across {mockCargo.length} shipments</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 stagger-children">
        {[
          { label: 'Total Weight', value: `${mockCargo.reduce((s, c) => s + c.weight, 0).toLocaleString()}t`, color: 'text-amber-400', icon: '⚖️' },
          { label: 'Total Volume', value: `${mockCargo.reduce((s, c) => s + c.volume, 0).toLocaleString()}m³`, color: 'text-orange-400', icon: '📐' },
          { label: 'Active Shipments', value: mockCargo.filter(c => c.status === 'in_transit').length, color: 'text-cyan-400', icon: '🚀' },
          { label: 'Insured Cargo', value: mockCargo.filter(c => c.insurance).length, color: 'text-green-400', icon: '🛡️' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl glass text-center animate-scale-in group hover:scale-[1.02] transition-all duration-300">
            <div className="text-xl mb-1 group-hover:animate-float">{stat.icon}</div>
            <div className={`text-xl font-bold ${stat.color} font-mono`}>{stat.value}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search by shipment number or cargo type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all duration-300"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <span className="text-[10px] text-gray-600 uppercase tracking-wider mr-1">Status:</span>
        {['all', 'in_transit', 'pending', 'delayed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
              filter === f
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
        <span className="text-[10px] text-gray-600 uppercase tracking-wider ml-4 mr-1">Type:</span>
        {['all', 'FCL', 'air', 'rail', 'road'].map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
              typeFilter === f
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10'
            }`}
          >
            {f === 'all' ? 'All Types' : f}
          </button>
        ))}
      </div>

      {/* Cargo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((cargo, i) => (
          <CargoCard key={cargo.id} cargo={cargo} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 animate-scale-in">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500">No cargo shipments match your search</p>
        </div>
      )}
    </div>
  );
}