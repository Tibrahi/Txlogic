'use client';

import { useState, useEffect } from 'react';
import { Truck } from '@/lib/types';
import PageHeader from '@/app/components/PageHeader';
import StatusBadge from '@/app/components/StatusBadge';
import ProgressBar from '@/app/components/ProgressBar';
import RouteVisualizer from '@/app/components/RouteVisualizer';
import FilterBar from '@/app/components/FilterBar';
import { truckTypeIcons } from '@/lib/utils';

const statusFilters = ['all', 'active', 'in_transit', 'delayed', 'maintenance'];

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

  return (
    <div
      className="animate-slide-up rounded-2xl glass overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] transition-all duration-500 group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Progress bar top */}
      <ProgressBar progress={truck.progress} color="from-cyan-500 via-purple-500 to-pink-500" height="sm" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/10 flex items-center justify-center text-xl group-hover:animate-float">
              {truckTypeIcons[truck.type] || '🚛'}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{truck.name}</h3>
              <p className="text-[11px] text-gray-500 font-mono">{truck.plateNumber}</p>
            </div>
          </div>
          <StatusBadge status={truck.status} />
        </div>

        {/* Route */}
        <div className="mb-4">
          <RouteVisualizer
            originCity={truck.location.city}
            destinationCity={truck.destination.city}
            progress={truck.progress}
            icon="🚛"
          />
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
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setTrucks(data.trucks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTrucks = filter === 'all' ? trucks : trucks.filter(t => t.status === filter);
  const activeCount = trucks.filter(t => t.status === 'active' || t.status === 'in_transit').length;

  const stats = [
    { label: 'Total', value: trucks.length, color: 'text-white' },
    { label: 'Active', value: trucks.filter(t => t.status === 'active').length, color: 'text-green-400' },
    { label: 'In Transit', value: trucks.filter(t => t.status === 'in_transit').length, color: 'text-cyan-400' },
    { label: 'Delayed', value: trucks.filter(t => t.status === 'delayed').length, color: 'text-amber-400' },
    { label: 'Maintenance', value: trucks.filter(t => t.status === 'maintenance').length, color: 'text-gray-400' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Fleet Tracking"
        subtitle={`${activeCount} vehicles currently active on the road`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/', accent: 'text-cyan-400' },
          { label: 'Trucks' },
        ]}
        actions={
          <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-blink" />
            <span className="text-xs font-mono text-gray-300">LIVE FLEET</span>
          </div>
        }
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-3 mb-6 stagger-children">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 rounded-xl glass text-center animate-scale-in">
            <div className={`text-2xl font-bold ${stat.color} font-mono`}>{stat.value}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <FilterBar
          filters={statusFilters}
          activeFilter={filter}
          onFilterChange={setFilter}
          accentColor="cyan"
        />
      </div>

      {/* Truck Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTrucks.map((truck, i) => (
            <TruckCard key={truck.id} truck={truck} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
