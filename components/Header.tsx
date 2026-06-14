"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  X,
  Package,
  MapPin,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { user, setSidebarOpen, sidebarCollapsed, notificationCount } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
          useAppStore.getState().setNotificationCount(
            data.notifications.filter((n: any) => !n.isRead).length
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/tracking?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-card-border flex items-center px-4 md:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-secondary hover:text-foreground transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden sm:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search shipments, tracking numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tx-input pl-9 pr-4 py-2"
          />
        </div>
      </form>

      <div className="flex-1 sm:hidden" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Tracking shortcut */}
        <Link
          href="/dashboard/tracking"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-secondary hover:text-foreground hover:bg-slate-50 transition-colors"
        >
          <MapPin size={16} />
          <span>Track</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-secondary hover:text-foreground hover:bg-slate-50 transition-colors"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-card-border rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-card-border flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-secondary hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-secondary">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n: any) => (
                    <Link
                      key={n.id}
                      href={n.link || "#"}
                      onClick={() => setShowNotifications(false)}
                      className="flex gap-3 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="text-xs text-secondary mt-0.5">{n.message}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <Link
                href="/dashboard/notifications"
                onClick={() => setShowNotifications(false)}
                className="block p-3 text-center text-sm font-medium text-primary hover:bg-slate-50 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-secondary leading-tight">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
            <ChevronDown size={14} className="hidden md:block text-secondary" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-card-border rounded-xl shadow-lg overflow-hidden z-50">
              <Link
                href="/dashboard/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-secondary hover:text-foreground hover:bg-slate-50 transition-colors"
              >
                <Settings size={16} />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-danger hover:bg-red-50 transition-colors w-full"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}