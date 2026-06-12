'use client';

import { useState } from 'react';
import { mockPackages } from '@/lib/data';
import { Package } from '@/lib/types';
import Link from 'next/link';

function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    in_transit: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    delivered: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    pending: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    loading: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    delayed: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  };
  const sc = statusColors[pkg.status] || statusColors.pending;

  const typeColors: Record<string, string> = {
    express: 'text-amber-400', fragile: 'text-rose-400', hazardous: 'text-red-400', standard: 'text-gray-400',
  };

  return (
    <div
      className="animate-slide-up rounded-2xl glass overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] transition-all duration-500 group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" style={{ width: `${pkg.progress}%` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/10 flex items-center justify-center text-lg group-hover:animate-float">
              📦
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">{pkg.trackingNumber}</h3>
              <p className={`text-[10px] uppercase tracking-wider ${typeColors[pkg.type]}`}>{pkg.type}</p>
            </div>
          </div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} border ${sc.border} uppercase font-medium tracking-wider`}>
            {pkg.status.replace('_', ' ')}
          </span>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-gray-300">{pkg.origin.city}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-gray-600 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-[8px] shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000"
              style={{ left: `calc(${pkg.progress}% - 8px)` }}
            >
              📦
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-300">{pkg.destination.city}</span>
            <div className="w-2 h-2 rounded-full bg-pink-400" />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="text-purple-400 font-mono">{pkg.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
              style={{ width: `${pkg.progress}%` }}
            />
          </div>
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
            <div className="space-y-0">
              {pkg.events.map((event, i) => (
                <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                  {/* Timeline line */}
                  {i < pkg.events.length - 1 && (
                    <div className="absolute left-[5px] top-3 bottom-0 w-px bg-gradient-to-b from-purple-500/30 to-transparent" />
                  )}
                  {/* Dot */}
                  <div className={`w-[11px] h-[11px] rounded-full flex-shrink-0 mt-1 ${i === 0 ? 'bg-purple-400 animate-blink' : 'bg-gray-600'}`} />
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-white">{event.status}</span>
                      <span className="text-[9px] text-gray-600 font-mono">{event.timestamp.slice(11)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{event.description}</p>
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

export default function PackagesPage() {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = mockPackages.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = searchTerm === '' || p.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) || p.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/" className="text-xs text-gray-500 hover:text-purple-400 transition-colors">Dashboard</Link>
          <span className="text-xs text-gray-600">/</span>
          <span className="text-xs text-gray-300">Packages</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">Package Tracking</span>
            </h1>
            <p className="text-gray-500 text-sm">{mockPackages.length} packages across {new Set(mockPackages.map(p => p.origin.country)).size} countries</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative max-w-md">
