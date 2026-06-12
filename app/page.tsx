'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockTrucks, mockPackages, mockContainers, mockCargo } from '@/lib/data';

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count.toLocaleString()}</span>;
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-400',
    in_transit: 'bg-cyan-400',
    delivered: 'bg-emerald-500',
    delayed: 'bg-amber-400',
    maintenance: 'bg-gray-500',
    pending: 'bg-blue-400',
    loading: 'bg-purple-400',
    idle: 'bg-slate-400',
    unloading: 'bg-orange-400',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-gray-400'} animate-blink`} />
  );
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const activeTrucks = mockTrucks.filter(t => t.status === 'active' || t.status === 'in_transit');
  const delayedItems = [...mockTrucks, ...mockPackages, ...mockContainers, ...mockCargo].filter(i => i.status === 'delayed');
  const deliveredItems = [...mockPackages, ...mockContainers].filter(i => i.status === 'delivered');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">Mission Control</span>
            </h1>
            <p className="text-gray-500 text-sm">Real-time logistics intelligence overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-blink" />
              <span className="text-xs font-mono text-gray-300">LIVE</span>
              <span className="text-xs font-mono text-cyan-400">
                {time.toLocaleTimeString('en-US', { timeZone: 'Africa/Kigali', hour12: false })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {[
          { label: 'Active Vehicles', value: activeTrucks.length, icon: '🚛', color: 'from-cyan-500/20 to-cyan-500/5', borderColor: 'border-cyan-500/20', href: '/trucks' },
          { label: 'Packages Tracked', value: mockPackages.length, icon: '📦', color: 'from-purple-500/20 to-purple-500/5', borderColor: 'border-purple-500/20', href: '/packages' },
          { label: 'Containers at Sea', value: mockContainers.filter(c => c.status === 'in_transit').length, icon: '🚢', color: 'from-blue-500/20 to-blue-500/5', borderColor: 'border-blue-500/20', href: '/containers' },
          { label: 'Cargo Shipments', value: mockCargo.length, icon: '✈️', color: 'from-amber-500/20 to-amber-500/5', borderColor: 'border-amber-500/20', href: '/cargo' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className={`animate-slide-up group relative p-5 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]`}>
              <div className="text-2xl mb-2 group-hover:animate-float">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter target={stat.value} />
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Value & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Value */}
        <div className="lg:col-span-2 p-6 rounded-2xl neon-border bg-surface/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Cargo Value Under Management</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">+12.4% this week</span>
          </div>
          <div className="text-4xl font-bold text-white mb-4">
            $<AnimatedCounter target={3475000} duration={3} />
          </div>
          {/* Mini chart simulation */}
          <div className="flex items-end gap-1 h-16">
            {[35, 42, 38, 55, 48, 62, 58, 71, 65, 78, 72, 85, 80, 88, 82, 95, 90, 98, 92, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-500 animate-scale-in"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, rgba(6, 182, 212, 0.6), rgba(139, 92, 246, 0.4))`,
                  animationDelay: `${i * 0.05}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="p-6 rounded-2xl bg-surface/50 border border-amber-500/20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {delayedItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 animate-slide-right" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-sm">⚠️</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {'name' in item ? (item as typeof mockTrucks[0]).name : 'trackingNumber' in item ? (item as typeof mockPackages[0]).trackingNumber : 'containerNumber' in item ? (item as typeof mockContainers[0]).containerNumber : (item as typeof mockCargo[0]).shipmentNumber}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Delayed — {item.lastUpdate}</p>
                </div>
                <StatusDot status="delayed" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Fleet & Recent Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Live Fleet */}
        <div className="p-6 rounded-2xl glass animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Live Fleet</h3>
            <Link href="/trucks" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockTrucks.slice(0, 4).map((truck, i) => (
              <Link key={truck.id} href="/trucks">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center text-lg group-hover:animate-float">
                    🚛
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{truck.name}</span>
                      <StatusDot status={truck.status} />
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{truck.location.city} → {truck.destination.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-mono text-cyan-400">{truck.speed} km/h</div>
                    <div className="text-[10px] text-gray-600">ETA {truck.ETA}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Packages */}
        <div className="p-6 rounded-2xl glass animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Packages</h3>
            <Link href="/packages" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockPackages.slice(0, 4).map((pkg, i) => (
              <Link key={pkg.id} href="/packages">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group" style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center text-lg group-hover:animate-float">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate font-mono">{pkg.trackingNumber}</span>
                      <StatusDot status={pkg.status} />
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{pkg.sender} → {pkg.receiver}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                        style={{ width: `${pkg.progress}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-600 mt-1">{pkg.progress}%</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Containers & Cargo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Containers */}
        <div className="p-6 rounded-2xl glass animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Container Fleet</h3>
            <Link href="/containers" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockContainers.slice(0, 4).map((cnt, i) => (
              <Link key={cnt.id} href="/containers">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-lg group-hover:animate-float">
                    🚢
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate font-mono">{cnt.containerNumber}</span>
                      <StatusDot status={cnt.status} />
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{cnt.origin.city} → {cnt.destination.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                        style={{ width: `${cnt.progress}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-600 mt-1">{cnt.progress}%</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Cargo Shipments */}
        <div className="p-6 rounded-2xl glass animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Cargo Shipments</h3>
            <Link href="/cargo" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockCargo.slice(0, 4).map((crg, i) => (
              <Link key={crg.id} href="/cargo">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group" style={{ animationDelay: `${0.9 + i * 0.1}s` }}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-lg group-hover:animate-float">
                    ✈️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate font-mono">{crg.shipmentNumber}</span>
                      <StatusDot status={crg.status} />
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{crg.origin.city} → {crg.destination.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-mono text-amber-400">${crg.value.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-600">{crg.weight}t</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom world map visualization */}
      <div className="p-6 rounded-2xl neon-border bg-surface/30 animate-slide-up mb-8" style={{ animationDelay: '0.9s' }}>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Global Route Network</h3>
        <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
          {/* Animated route lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 200">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Route 1: Nairobi to Dar es Salaam */}
            <path d="M 180 120 Q 300 80 420 100" fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
            <circle cx="180" cy="120" r="4" fill="#06b6d4" className="animate-blink" />
            <circle cx="420" cy="100" r="4" fill="#8b5cf6" className="animate-blink" style={{ animationDelay: '0.5s' }} />
            
            {/* Route 2: Kampala to Goma */}
            <path d="M 200 90 Q 280 60 340 80" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" style={{ animationDelay: '0.3s' }} />
            <circle cx="200" cy="90" r="3" fill="#10b981" className="animate-blink" style={{ animationDelay: '0.2s' }} />
            <circle cx="340" cy="80" r="3" fill="#10b981" className="animate-blink" style={{ animationDelay: '0.7s' }} />

            {/* Route 3: Mombasa to Singapore */}
            <path d="M 230 140 Q 500 40 750 80" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 4" className="animate-dash" style={{ animationDelay: '0.6s' }} />
            <circle cx="230" cy="140" r="3" fill="#3b82f6" className="animate-blink" style={{ animationDelay: '0.4s' }} />
            <circle cx="750" cy="80" r="3" fill="#3b82f6" className="animate-blink" style={{ animationDelay: '0.9s' }} />

            {/* Route 4: Dar es Salaam to Rotterdam */}
            <path d="M 250 130 Q 550 20 820 60" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" style={{ animationDelay: '1s' }} />
            
            {/* Route 5: Kigali to Amsterdam */}
            <path d="M 190 95 Q 500 10 800 50" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" style={{ animationDelay: '1.5s' }} />

            {/* Moving dots on routes */}
            <circle r="5" fill="#06b6d4" className="animate-blink">
              <animateMotion dur="4s" repeatCount="indefinite" path="M 180 120 Q 300 80 420 100" />
            </circle>
            <circle r="4" fill="#3b82f6">
              <animateMotion dur="6s" repeatCount="indefinite" path="M 230 140 Q 500 40 750 80" />
            </circle>
            <circle r="3" fill="#10b981">
              <animateMotion dur="3s" repeatCount="indefinite" path="M 200 90 Q 280 60 340 80" />
            </circle>
          </svg>

          {/* Location labels */}
          <div className="absolute text-[10px] font-mono text-cyan-400/70" style={{ left: '15%', top: '55%' }}>Nairobi</div>
          <div className="absolute text-[10px] font-mono text-purple-400/70" style={{ left: '40%', top: '45%' }}>Dar es Salaam</div>
          <div className="absolute text-[10px] font-mono text-green-400/70" style={{ left: '18%', top: '35%' }}>Kampala</div>
          <div className="absolute text-[10px] font-mono text-blue-400/70" style={{ left: '73%', top: '35%' }}>Singapore</div>
          <div className="absolute text-[10px] font-mono text-amber-400/70" style={{ left: '80%', top: '25%' }}>Rotterdam</div>
          <div className="absolute text-[10px] font-mono text-pink-400/70" style={{ left: '78%', top: '18%' }}>Amsterdam</div>
        </div>
      </div>
    </div>
  );
}