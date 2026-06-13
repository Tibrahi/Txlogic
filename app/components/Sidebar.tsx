'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/trucks', label: 'Trucks', icon: 'M8 17h.01M12 17h.01M16 17h.01M21 17l-3-3V5a2 2 0 00-2-2H6a2 2 0 00-2 2v10l3 3' },
  { href: '/packages', label: 'Packages', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { href: '/containers', label: 'Containers', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { href: '/cargo', label: 'Cargo', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1h2m10 1l2-1V8a1 1 0 00-1-1h-4' },
  { href: '/tracking', label: 'Live Tracking', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 transition-all duration-500 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, rgba(3, 7, 18, 0.95) 30%)',
        borderRight: '1px solid rgba(6, 182, 212, 0.15)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/30">
        <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {!collapsed && (
          <div className="animate-slide-right">
            <h1 className="text-lg font-bold gradient-text">TXLogic</h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">Cargo Intelligence</p>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
      >
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full animate-scale-in" />
              )}
              <svg
                className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                  isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'
                }`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-blink" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info & Logout */}
      {!collapsed && (
        <div className="absolute bottom-6 left-3 right-3">
          <div className="p-3 rounded-xl bg-surface/50 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-blink" />
              <span className="text-xs text-gray-400">System Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono truncate">
                {user?.name || 'Guest'}
              </span>
              {user && (
                <button
                  onClick={logout}
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}