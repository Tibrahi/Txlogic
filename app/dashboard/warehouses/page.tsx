"use client";
import { Warehouse, Plus, Search } from "lucide-react";
import Link from "next/link";
export default function WarehousesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Warehouses</h1>
          <p className="text-secondary mt-1">Manage warehouse facilities</p>
        </div>
        <Link href="/dashboard/warehouses/new" className="tx-btn tx-btn-primary">
          <Plus size={16} /> Add Warehouse
        </Link>
      </div>
      <div className="tx-card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input type="text" placeholder="Search warehouses..." className="tx-input pl-9" />
        </div>
      </div>
      <div className="tx-card">
        <div className="p-5 border-b border-card-border">
          <h2 className="text-lg font-semibold text-slate-900">All Warehouses</h2>
        </div>
        <div className="p-12 text-center">
          <Warehouse size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-secondary">No warehouses yet</p>
          <p className="text-sm text-slate-400 mt-1">Add your first warehouse to get started</p>
        </div>
      </div>
    </div>
  );
}