export type TrackingStatus = 'active' | 'idle' | 'maintenance' | 'delayed' | 'in_transit' | 'delivered' | 'pending' | 'loading' | 'unloading';

export interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface Truck {
  id: string;
  name: string;
  driver: string;
  plateNumber: string;
  type: 'flatbed' | 'tanker' | 'container' | 'refrigerated' | 'bulk';
  status: TrackingStatus;
  speed: number; // km/h
  fuelLevel: number; // percentage
  location: Location;
  destination: Location;
  progress: number; // percentage
 ETA: string;
  cargo: string;
  lastUpdate: string;
  temperature?: number;
  mileage: number;
}

export interface Package {
  id: string;
  trackingNumber: string;
  sender: string;
  receiver: string;
  origin: Location;
  destination: Location;
  status: TrackingStatus;
  weight: number; // kg
  dimensions: string;
  type: 'standard' | 'express' | 'fragile' | 'hazardous';
  currentLocation: Location;
  progress: number;
  events: PackageEvent[];
  estimatedDelivery: string;
  lastUpdate: string;
}

export interface PackageEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface Container {
  id: string;
  containerNumber: string;
  type: '20ft' | '40ft' | '40ft_hc' | '45ft_hc' | 'reefer';
  status: TrackingStatus;
  origin: Location;
  destination: Location;
  currentLocation: Location;
  vessel: string;
  voyage: string;
  progress: number;
  weight: number; // tons
  sealNumber: string;
  commodities: string;
  events: ContainerEvent[];
  estimatedArrival: string;
  lastUpdate: string;
  temperature?: number;
  humidity?: number;
}

export interface ContainerEvent {
  timestamp: string;
  location: string;
  status: string;
  vessel?: string;
  voyage?: string;
  description?: string;
}

export interface CargoShipment {
  id: string;
  shipmentNumber: string;
  type: 'FCL' | 'LCL' | 'air' | 'rail' | 'road';
  status: TrackingStatus;
  origin: Location;
  destination: Location;
  currentLocation: Location;
  cargoType: string;
  weight: number; // tons
  volume: number; // m³
  containers: number;
  trucks: number;
  progress: number;
  events: CargoEvent[];
  estimatedArrival: string;
  lastUpdate: string;
  insurance: boolean;
  hazmat: boolean;
  value: number;
}

export interface CargoEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
  milestone: boolean;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  label: string;
}