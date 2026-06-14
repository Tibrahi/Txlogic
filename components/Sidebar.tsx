"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Truck,
  Container,
  Warehouse,
  Users,
  UserCheck,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Box,
  MapPin,
  FileText,
  LogOut,
  X,
  Menu,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Shipments", href: "/dashboard/shipments", icon: <Package size={20} /> },
  { label: "Containers", href: "/dashboard/containers", icon: <Container size={20} /> },
  { label: "Trucks", href: "/dashboard/trucks", icon: <Truck size={20} /> },
  { label: "Drivers", href: "/dashboard/drivers", icon: <UserCheck size={20} /> },
  { label: "Warehouses", href: "/dashboard/warehouses", icon: <Warehouse size={20} /> },
  { label: "Customers", href: "/dashboard/customers", icon: <Users size={20} /> },
  { label: "Tracking", href: "/dashboard/tracking", icon: <MapPin size={20} /> },
  { label: "Reports", href: "/dashboard/reports", icon: <BarChart3 size={20} /> },
  { label: "Notifications", href: "/dashboard/notifications", icon: <Bell size={20} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar-bg z-50 flex flex-col transition-all duration-300",
          collapsed ? "w-[4.5rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 border-b border-white/10 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Box size={18} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Txlogic</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Box size={18} className="text-white" />
            </div>
          )}
          <button
            onClick={onToggle}
            className="text-sidebar-text hover:text-white transition-colors hidden md:block"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            onClick={onMobileClose}
            className="text-sidebar-text hover:text-white transition-colors md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "text-sidebar-text hover:text-white hover:bg-sidebar-hover",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-2">
          {!collapsed && (
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-all"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}