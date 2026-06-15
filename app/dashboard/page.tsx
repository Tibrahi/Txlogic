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
  totalContainers?:_off: number;
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
