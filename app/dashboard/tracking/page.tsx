"use client";
import { MapPin, Search } from "lucide-react";
export default function TrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tracking</h1>
        <p className="text-secondary mt-1">Track shipments in real-time</p>
      </div>
      <div className="tx-card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input type="text" placeholder="Enter tracking number..." className="tx-input pl-9" />
        </div>
      </div>
      <div className="tx-card">
        <div className="p-12 text-center">
          <MapPin size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-secondary">Enter a tracking number to see location details</p>
        </div>
      </div>
    </div>
  );
}