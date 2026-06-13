'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatusDot from '@/app/components/StatusDot';
import NavLink from '@/app/components/NavLink';
import { getEntityName, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';

/* ------------------------------------------------------------------ */
/*  Intersection Observer hook (fade in on scroll)                     */
/* ------------------------------------------------------------------ */
function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, visible };
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
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

/* ------------------------------------------------------------------ */
/*  Stats card                                                         */
/* ------------------------------------------------------------------ */
function StatCard({
  label, value, icon, color, borderColor, href, delay,
}: {
  label: string; value: number; icon: string; color: string;
  borderColor: string; href: string; delay: string;
}) {
  const { ref, visible } = useInView();

  return (
    <NavLink
      href={href}
      className={`block group relative p-5 rounded-2xl bg-gradient-to-br ${color} border ${borderColor} hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] ${visible ? 'animate-slide-up' : 'opacity-0'}`}
      style={{ animationDelay: delay }}
    >
      <div ref={ref} />
      <div className="text-2xl mb-2 group-hover:animate-float">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">
        <AnimatedCounter target={value} />
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </NavLink>
  );
}

/* ------------------------------------------------------------------ */
/*  Content list panel                                                 */
/* ------------------------------------------------------------------ */
function ContentPanel({
  title, titleColor, viewHref, items, icon, iconBg, render,
  delay,
}: {
  title: string; titleColor: string; viewHref: string;
  items: unknown[]; icon: string; iconBg: string;
  render: (item: unknown, i: number) => React.ReactNode;
  delay: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`p-6 rounded-2xl glass animate-slide-up ${visible ? '' : 'opacity-0'}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
        <NavLink href={viewHref} className={`text-xs hover:opacity-80 transition-colors ${titleColor}`}>View all →</NavLink>
      </div>
      <div className="space-y-3">
        {items.slice(0, 4).map((item, i) => render(item, i))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DASHBOARD                                                          */
/* ================================================================== */
interface DashboardData {
  trucks: any[];
  packages: any[];
  containers: any[];
  cargoShipments: any[];
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [time, setTime] = useState(new Date());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* -------- redirect if not authenticated -------- */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  /* -------- clock -------- */
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* -------- fetch data from DB -------- */
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetch('/api/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4 animate-pulse-glow">
            <span className="text-3xl">⚡</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-cyan-500 border-t-transparent rounded-full" />
          <p className="text-gray-500 text-sm">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-cyan-400 hover:text-cyan-300 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const activeTrucks = data.trucks.filter((t) => t.status === 'active' || t.status === 'in_transit');
  const delayedItems = [
    ...data.trucks, ...data.packages, ...data.containers, ...data.cargoShipments,
  ].filter((i) => i.status === 'delayed');
  const totalValue = data.cargoShipments.reduce((sum, c) => sum + c.value, 0);

  const heroStats = [
    { label: 'Active Vehicles', value: activeTrucks.length, icon: '🚛', color: 'from-cyan-500/20 to-cyan-500/5', borderColor: 'border-cyan-500/20', href: '/trucks' },
    { label: 'Packages Tracked', value: data.packages.length, icon: '📦', color: 'from-purple-500/20 to-purple-500/5', borderColor: 'border-purple-500/20', href: '/packages' },
    { label: 'Containers at Sea', value: data.containers.filter((c) => c.status === 'in_transit').length, icon: '🚢', color: 'from-blue-500/20 to-blue-500/5', borderColor: 'border-blue-500/20', href: '/containers' },
    { label: 'Cargo Shipments', value: data.cargoShipments.length, icon: '✈️', color: 'from-amber-500/20 to-amber-500/5', borderColor: 'border-amber-500/20', href: '/cargo' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">Mission Control</span>
            </h1>
            <p className="text-gray-500 text-sm">Welcome back, {user.name} — Real-time logistics intelligence overview</p>
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
        {heroStats.map((stat, idx) => (
          <StatCard key={stat.label} {...stat} delay={`${idx * 0.1}s`} />
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
            $<AnimatedCounter target={totalValue} duration={3} />
          </div>
          {/* Mini chart simulation */}
          <div className="flex items-end gap-1 h-16">
            {[35, 42, 38, 55, 48, 62, 58, 71, 65, 78, 72, 85, 80, 88, 82, 95, 90, 98, 92, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-500 animate-scale-in"
                style={{
                  height: `${h}%`,
                  background: 'linear-gradient(to top, rgba(6, 182, 212, 0.6), rgba(139, 92, 246, 0.4))',
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
            {delayedItems.length === 0 && (
              <p className="text-xs text-gray-500">No active alerts</p>
            )}
            {delayedItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 animate-slide-right" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-sm">⚠️</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {getEntityName(item)}
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
        <ContentPanel title="Live Fleet" titleColor="text-cyan-400" viewHref="/trucks" items={data.trucks} icon="🚛" iconBg="from-cyan-500/20 to-purple-500/20" delay="0.5s" render={(item: any, i) => (
          <NavLink key={item.id} href="/trucks" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center text-lg group-hover:animate-float">
              🚛
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate">{item.name}</span>
                <StatusDot status={item.status} />
              </div>
              <p className="text-[11px] text-gray-500 truncate">{item.location.city} → {item.destination.city}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-mono text-cyan-400">{item.speed} km/h</div>
              <div className="text-[10px] text-gray-600">ETA {item.ETA}</div>
            </div>
          </NavLink>
        )} />

        {/* Recent Packages */}
        <ContentPanel title="Recent Packages" titleColor="text-purple-400" viewHref="/packages" items={data.packages} icon="📦" iconBg="from-purple-500/20 to-pink-500/20" delay="0.6s" render={(item: any, i) => (
          <NavLink key={item.id} href="/packages" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group" style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center text-lg group-hover:animate-float">
              📦
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate font-mono">{item.trackingNumber}</span>
                <StatusDot status={item.status} />
              </div>
              <p className="text-[11px] text-gray-500 truncate">{item.sender} → {item.receiver}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000" style={{ width: `${item.progress}%` }} />
              </div>
              <div className="text-[10px] text-gray-600 mt-1">{item.progress}%</div>
            </div>
          </NavLink>
        )} />
      </div>

      {/* Containers & Cargo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Containers */}
        <ContentPanel title="Container Fleet" titleColor="text-blue-400" viewHref="/containers" items={data.containers} icon="🚢" iconBg="from-blue-500/20 to-cyan-500/20" delay="0.7s" render={(item: any, i) => (
          <NavLink key={item.id} href="/containers" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-lg group-hover:animate-float">
              🚢
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate font-mono">{item.containerNumber}</span>
                <StatusDot status={item.status} />
              </div>
              <p className="text-[11px] text-gray-500 truncate">{item.origin.city} → {item.destination.city}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000" style={{ width: `${item.progress}%` }} />
              </div>
              <div className="text-[10px] text-gray-600 mt-1">{item.progress}%</div>
            </div>
          </NavLink>
        )} />

        {/* Cargo Shipments */}
        <ContentPanel title="Cargo Shipments" titleColor="text-amber-400" viewHref="/cargo" items={data.cargoShipments} icon="✈️" iconBg="from-amber-500/20 to-orange-500/20" delay="0.8s" render={(item: any, i) => (
          <NavLink key={item.id} href="/cargo" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group" style={{ animationDelay: `${0.9 + i * 0.1}s` }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-lg group-hover:animate-float">
              ✈️
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate font-mono">{item.shipmentNumber}</span>
                <StatusDot status={item.status} />
              </div>
              <p className="text-[11px] text-gray-500 truncate">{item.origin.city} → {item.destination.city}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-mono text-amber-400">{formatCurrency(item.value)}</div>
              <div className="text-[10px] text-gray-600">{item.weight}t</div>
            </div>
          </NavLink>
        )} />
      </div>

      {/* Bottom world map visualization */}
      <div className="p-6 rounded-2xl neon-border bg-surface/30 animate-slide-up mb-8" style={{ animationDelay: '0.9s' }}>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Global Route Network</h3>
        <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 200">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path d="M 180 120 Q 300 80 420 100" fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
            <circle cx="180" cy="120" r="4" fill="#06b6d4" className="animate-blink" />
            <circle cx="420" cy="100" r="4" fill="#8b5cf6" className="animate-blink" style={{ animationDelay: '0.5s' }} />
            <path d="M 200 90 Q 280 60 340 80" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" style={{ animationDelay: '0.3s' }} />
            <circle cx="200" cy="90" r="3" fill="#10b981" className="animate-blink" style={{ animationDelay: '0.2s' }} />
            <circle cx="340" cy="80" r="3" fill="#10b981" className="animate-blink" style={{ animationDelay: '0.7s' }} />
            <path d="M 230 140 Q 500 40 750 80" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 4" className="animate-dash" style={{ animationDelay: '0.6s' }} />
            <circle cx="230" cy="140" r="3" fill="#3b82f6" className="animate-blink" style={{ animationDelay: '0.4s' }} />
            <circle cx="750" cy="80" r="3" fill="#3b82f6" className="animate-blink" style={{ animationDelay: '0.9s' }} />
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