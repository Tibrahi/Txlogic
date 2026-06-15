"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  Container,
  Warehouse,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

interface DashboardStats {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  pending: number;
  totalWarehouses: number;
  activeTrucks: number;
  activeDrivers: number;
  recentShipments: Array<{
    id: string;
    trackingNumber: string;
    status: string;
    priority: string;
    origin: string;
    destination: string;
    createdAt: string;
  }>;
}

const statusColors: Record<string, string> = {
  CREATED: "badge-neutral",
  PROCESSING: "badge-info",
  IN_WAREHOUSE: "badge-info",
  CARGO_ASSIGNED: "badge-info",
  CONTAINER_ASSIGNED: "badge-info",
  TRUCK_ASSIGNED: "badge-info",
  IN_TRANSIT: "badge-warning",
  AT_DESTINATION_WAREHOUSE: "badge-info",
  OUT_FOR_DELIVERY: "badge-warning",
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

export default function DashboardPage() {
  const { user } = useAppStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    // For now, use placeholder stats since we don't have the API yet
    setStats({
      totalShipments: 0,
      inTransit: 0,
      delivered: 0,
      pending: 0,
      totalWarehouses: 0,
      activeTrucks: 0,
      activeDrivers: 0,
      recentShipments: [],
    });
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="tx-card p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting()}, {user?.firstName}!
        </h1>
        <p className="text-secondary mt-1">
          Here is an overview of your logistics operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Shipments",
            value: stats?.totalShipments || 0,
            icon: Package,
            color: "bg-primary/10 text-primary",
            link: "/dashboard/shipments",
          },
          {
            label: "In Transit",
            value: stats?.inTransit || 0,
            icon: Truck,
            color: "bg-warning/10 text-warning",
            link: "/dashboard/shipments?status=IN_TRANSIT",
          },
          {
            label: "Delivered",
            value: stats?.delivered || 0,
            icon: CheckCircle,
            color: "bg-success/10 text-success",
            link: "/dashboard/shipments?status=DELIVERED",
          },
          {
            label: "Pending",
            value: stats?.pending || 0,
            icon: Clock,
            color: "bg-accent/10 text-accent",
            link: "/dashboard/shipments?status=CREATED",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="tx-card p-5 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View details <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Shipments */}
      <div className="tx-card">
        <div className="p-5 border-b border-card-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Shipments
          </h2>
          <Link
            href="/dashboard/shipments"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            View all
          </Link>
        </div>

        {stats?.recentShipments && stats.recentShipments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <Link
                        href={`/dashboard/shipments/${shipment.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {shipment.trackingNumber}
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`tx-badge ${
                          statusColors[shipment.status] || "badge-neutral"
                        }`}
                      >
                        {statusLabels[shipment.status] || shipment.status}
                      </span>
                    </td>
                    <td className="text-sm">
                      {shipment.priority}
                    </td>
                    <td className="text-sm">{shipment.origin}</td>
                    <td className="text-sm">{shipment.destination}</td>
                    <td className="text-sm text-secondary">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-secondary">No shipments yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Create your first shipment to get started
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/shipments"
          className="tx-card p-5 group hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Shipments</p>
              <p className="text-sm text-secondary">
                Manage your shipments
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/containers"
          className="tx-card p-5 group hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Container size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Containers</p>
              <p className="text-sm text-secondary">
                Track container inventory
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/trucks"
          className="tx-card p-5 group hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Truck size={20} className="text-success" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Trucks</p>
              <p className="text-sm text-secondary">
                Monitor your fleet
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}