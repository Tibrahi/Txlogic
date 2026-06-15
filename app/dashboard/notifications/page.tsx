"use client";
import { Bell } from "lucide-react";
export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-secondary mt-1">View and manage notifications</p>
      </div>
      <div className="tx-card">
        <div className="p-12 text-center">
          <Bell size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-secondary">No notifications</p>
          <p className="text-sm text-slate-400 mt-1">You're all caught up</p>
        </div>
      </div>
    </div>
  );
}