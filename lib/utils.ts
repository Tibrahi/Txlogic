
/** Status color configuration used consistently across all pages */
export const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  active: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  in_transit: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  delivered: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  delayed: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  maintenance: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
  idle: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  pending: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  loading: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  unloading: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
};

/** Status dot color mapping */
export const statusDotColors: Record<string, string> = {
  active: 'bg-green-400',
  in_transit: 'bg-cyan-400',
  delivered: 'bg-emerald-500',
  delayed: 'bg-amber-400',
  maintenance: 'bg-gray-500',
  pending: 'bg-blue-400',
  loading: 'bg-purple-400',
  idle: 'bg-slate-400',
  unloading: 'bg-orange-400',
};

/** Progress bar gradient colors per section */
export const progressGradients: Record<string, string> = {
  truck: 'from-cyan-500 via-purple-500 to-pink-500',
  package: 'from-purple-500 to-pink-500',
  container: 'from-blue-500 to-cyan-500',
  cargo: 'from-amber-500 to-orange-500',
};

/** Get status color config for a given status */
export function getStatusColor(status: string) {
  return statusColors[status] || statusColors.pending;
}

/** Get status dot color for a given status */
export function getStatusDotColor(status: string) {
  return statusDotColors[status] || 'bg-gray-400';
}

/** Format status label for display (e.g. 'in_transit' → 'In Transit') */
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Format currency values */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

/** Format weight values */
export function formatWeight(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}Kt`;
  }
  return `${value}t`;
}

/** Get the display name/identifier for any entity type */
export function getEntityName(item: { name?: string; trackingNumber?: string; containerNumber?: string; shipmentNumber?: string }): string {
  if (item.name) return item.name;
  if (item.trackingNumber) return item.trackingNumber;
  if (item.containerNumber) return item.containerNumber;
  if (item.shipmentNumber) return item.shipmentNumber;
  return 'Unknown';
}

/** Get the detail page href for an entity type */
export function getEntityDetailHref(type: string): string {
  switch (type) {
    case 'truck': return '/trucks';
    case 'package': return '/packages';
    case 'container': return '/containers';
    case 'cargo': return '/cargo';
    default: return '/';
  }
}

/** Type labels for truck types */
export const truckTypeLabels: Record<string, string> = {
  container: 'Container',
  tanker: 'Tanker',
  flatbed: 'Flatbed',
  refrigerated: 'Refrigerated',
  bulk: 'Bulk',
};

/** Type labels for container types */
export const containerTypeLabels: Record<string, string> = {
  '20ft': '20ft Standard',
  '40ft': '40ft Standard',
  '40ft_hc': '40ft High Cube',
  '45ft_hc': '45ft High Cube',
  reefer: 'Reefer',
};

/** Emoji icons for truck types */
export const truckTypeIcons: Record<string, string> = {
  container: '🚛',
  tanker: '🛢️',
  flatbed: '🏗️',
  refrigerated: '❄️',
  bulk: '⛏️',
};

/** Emoji icons for cargo types */
export const cargoTypeIcons: Record<string, { icon: string; color: string }> = {
  FCL: { icon: '📦', color: 'text-amber-400' },
  LCL: { icon: '📋', color: 'text-blue-400' },
  air: { icon: '✈️', color: 'text-sky-400' },
  rail: { icon: '🚂', color: 'text-green-400' },
  road: { icon: '🚛', color: 'text-orange-400' },
};

/** Color palette for section theming */
export const sectionTheme = {
  trucks: { accent: 'cyan', gradient: 'from-cyan-500/20 to-purple-500/20', border: 'border-cyan-500/10', hoverShadow: 'rgba(6,182,212,0.08)', textAccent: 'text-cyan-400' },
  packages: { accent: 'purple', gradient: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/10', hoverShadow: 'rgba(139,92,246,0.08)', textAccent: 'text-purple-400' },
  containers: { accent: 'blue', gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/10', hoverShadow: 'rgba(59,130,246,0.08)', textAccent: 'text-blue-400' },
  cargo: { accent: 'amber', gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/10', hoverShadow: 'rgba(245,158,11,0.08)', textAccent: 'text-amber-400' },
} as const;