"use client";

import { Package, Plus, Search, Filter, ArrowRight, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  CREATED: "badge-neutral",
  PROCESSING: "badge-info",
  IN_WAREHOUSE: "badge-info",
  IN_TRANSIT: "badge-warning",
  DELIVERED: "badge-success",
  CANCELLED: "badge-danger",
  DELAYED: "badge-danger",
};

const statusLabels: Record<string, string> = {
  CREATED: "Created",
  PROCESSING: "Processing",
  IN_WAREHOUSE: "In Warehouse",
  CARGO_ASSIGNED: "Cargo Assigned",
  CONTAINER_ASSIGNED: "Container Assigned",
  TRUCK_ASSIGNED: "Truck Assigned",
  IN_TRANSIT: "In Transit",
  AT_DESTINATION_WAREHOUSE: "At Destination",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  DELAYED: "Delayed",
};

export default function ShipmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipments</h1>
          <p className="text-secondary mt-1">Manage and track all shipments</p>
        </div>
        <Link href="/dashboard/shipments/new" className="tx-btn tx-btn-primary">
          <Plus size={16} />
          New Shipment
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="tx-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search by tracking number, origin, destination..."
              className="tx-input pl-9"
            />
          </div>
          <div className="flex gap-2">
            <select className="tx-input w-auto">
              <option value="">All Status</option>
              <option value="CREATED">Created</option>
              <option value="PROCESSING">Processing</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select className="tx-input w-auto">
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="tx-card">
        <div className="p-5 border-b border-card-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            All Shipments
          </h2>
          <span className="text-sm text-secondary">0 shipments</span>
        </div>

        <div className="p-12 text-center">
          <Package size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-secondary">No shipments created yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Create your first shipment to get started
          </p>
          <Link href="/dashboard/shipments/new" className="tx-btn tx-btn-primary mt-4">
            <Plus size={16} />
            Create Shipment
          </Link>
        </div>
      </div>
    </div>
  );
}