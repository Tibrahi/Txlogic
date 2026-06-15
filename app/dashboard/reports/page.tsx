"use client";
import { BarChart3 } from "lucide-react";
export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-secondary mt-1">View reports and analytics</p>
      </div>
      <div className="tx-card">
        <div className="p-12 text-center">
          <BarChart3 size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-secondary">Reports coming soon</p>
        </div>
      </div>
    </div>
  );
}