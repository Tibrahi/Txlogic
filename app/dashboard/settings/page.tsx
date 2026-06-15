"use client";
import { Settings } from "lucide-react";
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-secondary mt-1">Manage your account and preferences</p>
      </div>
      <div className="tx-card">
        <div className="p-12 text-center">
          <Settings size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-secondary">Settings page coming soon</p>
        </div>
      </div>
    </div>
  );
}