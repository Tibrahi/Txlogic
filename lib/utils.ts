import { format, formatDistanceToNow, differenceInDays, differenceInHours } from "date-fns";

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM dd, yyyy");
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM dd, yyyy HH:mm");
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function daysRemaining(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  return differenceInDays(d, new Date());
}

export function hoursRemaining(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  return differenceInHours(d, new Date());
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatWeight(weightInKg: number): string {
  if (weightInKg >= 1000) {
    return `${(weightInKg / 1000).toFixed(1)} t`;
  }
  return `${weightInKg.toFixed(1)} kg`;
}

export function generateTrackingNumber(): string {
  const prefix = "TXL";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getShipmentStatusColor(status: string): string {
  const colors: Record<string, string> = {
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
  return colors[status] || "badge-neutral";
}

export function getShipmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
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
  return labels[status] || status;
}

export function getContainerStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: "badge-success",
    IN_USE: "badge-info",
    IN_TRANSIT: "badge-warning",
    AT_WAREHOUSE: "badge-info",
    UNDER_MAINTENANCE: "badge-danger",
    RESERVED: "badge-neutral",
  };
  return colors[status] || "badge-neutral";
}

export function getTruckStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: "badge-success",
    IN_TRANSIT: "badge-warning",
    IN_MAINTENANCE: "badge-danger",
    OUT_OF_SERVICE: "badge-danger",
    RESERVED: "badge-neutral",
  };
  return colors[status] || "badge-neutral";
}

export function getTruckStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: "Available",
    IN_TRANSIT: "In Transit",
    IN_MAINTENANCE: "In Maintenance",
    OUT_OF_SERVICE: "Out of Service",
    RESERVED: "Reserved",
  };
  return labels[status] || status;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: "badge-neutral",
    NORMAL: "badge-info",
    HIGH: "badge-warning",
    URGENT: "badge-danger",
    CRITICAL: "badge-danger",
  };
  return colors[priority] || "badge-neutral";
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: "Low",
    NORMAL: "Normal",
    HIGH: "High",
    URGENT: "Urgent",
    CRITICAL: "Critical",
  };
  return labels[priority] || priority;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}