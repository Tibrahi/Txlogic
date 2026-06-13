/**
 * System data has been erased.
 * All data is now fetched from MongoDB Atlas via the /api/dashboard endpoint.
 *
 * Usage in client components:
 *   const res = await fetch('/api/dashboard');
 *   const { trucks, packages, containers, cargoShipments } = await res.json();
 */

import { Truck, Package, Container, CargoShipment } from './types';

export const mockTrucks: Truck[] = [];
export const mockPackages: Package[] = [];
export const mockContainers: Container[] = [];
export const mockCargo: CargoShipment[] = [];