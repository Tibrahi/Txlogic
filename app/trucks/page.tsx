'use client';

import { useState, useEffect } from 'react';
import { mockTrucks } from '@/lib/data';
import { Truck } from '@/lib/types';
import Link from 'next/link';

function TruckCard({ truck, index }: { truck: Truck; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [speed, setSpeed] = useState(truck.speed);

  useEffect(() => {
    if (truck.status === 'active' || truck.status === 'in_transit') {
      const interval = setInterval(() => {
        setSpeed(prev => Math.max(0, prev + Math.floor(Math.random() * 7) - 3));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [truck.status]);

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    active: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    in_transit: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    delayed: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    maintenance: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
    idle: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  };
  const sc = statusColors[truck.status] || statusColors.idle;

  const typeIcons: Record<string, string> = {
    container: '🚛', tanker: '🛢️', flatbed: '🏗️', refrigerated: '❄️', bulk: '⛏️',
  };

  return (
    <div
      className="animate-slide-up rounded-2xl glass overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] transition-all duration-500 group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Progress bar top */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-1000 animate-gradient"
          style={{ width: `${truck.progress}%` }}
        />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/10 flex items-center justify-center text-xl group-hover:animate-float">
              {typeIcons[truck.type]}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{truck.name}</h3>
              <p className="text-[11px] text-gray-500 font-mono">{truck.plateNumber}</p>
            </div>
          </div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} border ${sc.border} uppercase font-medium tracking-wider`}>
            {truck.status.replace('_', ' ')}
          </span>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-gray-300">{truck.location.city}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-gray-600 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-[8px] shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
              style={{ left: `calc(${truck.progress}% - 8px)` }}
            >
              🚛
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-300">{truck.destination.city}</span>
            <div className="w-2 h-2 rounded-full bg-purple-400" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-lg font-bold text-cyan-400 font-mono">{speed}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">km/h</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-lg font-bold text-green-400 font-mono">{truck.fuelLevel}%</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">Fuel</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-lg font-bold text-purple-400 font-mono">{truck.ETA}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">ETA</div>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-[11px] text-gray-500 hover:text-cyan-400 transition-colors py-2 border-t border-white/5"
        >
          {expanded ? 'Show less ▲' : 'Show more ▼'}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-3 space-y-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <span className="text-gray-500">Driver</span>
                <p className="text-white font-medium">{truck.driver}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <span className="text-gray-500">Type</span>
                <p className="text-white font-medium capitalize">{truck.type}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <span className="text-gray-500">Cargo</span>
                <p className="text-white font-medium">{truck.cargo}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <span className="text-gray-500">Mileage</span>
                <p className="text-white font-medium font-mono">{truck.mileage.toLocaleString()} km</p>
              </div>
              {truck.temperature !== undefined && (
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-gray-500">Temperature</span>
                  <p className="text-blue-400 font-medium">{truck.temperature}°C</p>
                </div>
              )}
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <span className="text-gray-500">Last Update</span>
                <p className="text-gray-300">{truck.lastUpdate}</p>
              </div>
            </div>

            {/* Mini fuel gauge */}
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-gray-500">Fuel Level</span>
                <span className="text-green-400 font-mono">{truck.fuelLevel}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${truck.fuelLevel}%`,
                    background: truck.fuelLevel > 50 ? 'linear-gradient(90deg, #10b981, #34d399)' : truck.fuelLevel > 25 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrucksPage() {
  const [filter, setFilter] = useState<string>('all');
  const filteredTrucks = filter === 'all' ? mockTrucks : mockTrucks.filter(t => t.status === filter);
  const activeCount = mockTrucks.filter(t => t.status === 'active' || t.status === 'in_transit').length;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">Dashboard</Link>
          <span className="text-xs text-gray-600">/</span>
          <span className="text-xs text-gray-300">Trucks</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">Fleet Tracking</span>
            </h1>
            <p className="text-gray-500 text-sm">{activeCount} vehicles currently active on the road</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-blink" />
              <span className="text-xs font-mono text-gray-300">LIVE FLEET</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-3 mb-6 stagger-children">
        {[
          { label: 'Total', value: mockTrucks.length, color: 'text-white' },
          { label: 'Active', value: mockTrucks.filter(t => t.status === 'active').length, color: 'text-green-400' },
          { label: 'In Transit', value: mockTrucks.filter(t => t.status === 'in_transit').length, color: 'text-cyan-400' },
          { label: 'Delayed', value: mockTrucks.filter(t => t.status === 'delayed').length, color: 'text-amber-400' },
          { label: 'Maintenance', value: mockTrucks.filter(t => t.status === 'maintenance').length, color: 'text-gray-400' },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-xl glass text-center animate-scale-in">
            <div className={`text-2xl font-bold ${stat.color} font-mono`}>{stat.value}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {['all', 'active', 'in_transit', 'delayed', 'maintenance'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
              filter === f
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Truck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTrucks.map((truck, i) => (
          <TruckCard key={truck.id} truck={truck} index={i} />
        ))}
      </div>
    </div>
  );
}