import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Truck from '@/lib/models/Truck';
import Package from '@/lib/models/Package';
import Container from '@/lib/models/Container';
import CargoShipment from '@/lib/models/CargoShipment';

const trucks = [
  {
    id: 'trk-001', name: 'Eagle Express', driver: 'Marcus Johnson', plateNumber: 'KE-4827-TX', type: 'container', status: 'active',
    speed: 85, fuelLevel: 72, location: { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
    destination: { lat: -6.7924, lng: 39.2083, city: 'Dar es Salaam', country: 'Tanzania' },
    progress: 45, ETA: '14h 32m', cargo: 'Electronics & Textiles', lastUpdate: '2 min ago', mileage: 245680,
  },
  {
    id: 'trk-002', name: 'Thunder Hauler', driver: 'Sarah Williams', plateNumber: 'UG-9132-KM', type: 'tanker', status: 'in_transit',
    speed: 92, fuelLevel: 58, location: { lat: 0.3476, lng: 32.5825, city: 'Kampala', country: 'Uganda' },
    destination: { lat: -1.9403, lng: 29.8739, city: 'Goma', country: 'DRC' },
    progress: 72, ETA: '5h 15m', cargo: 'Petroleum Products', lastUpdate: '1 min ago', temperature: 32, mileage: 189432,
  },
  {
    id: 'trk-003', name: 'Iron Wolf', driver: 'David Chen', plateNumber: 'TZ-6743-BH', type: 'flatbed', status: 'delayed',
    speed: 0, fuelLevel: 34, location: { lat: -6.1630, lng: 35.7516, city: 'Dodoma', country: 'Tanzania' },
    destination: { lat: -3.3731, lng: 29.3644, city: 'Bujumbura', country: 'Burundi' },
    progress: 28, ETA: '28h 45m', cargo: 'Construction Materials', lastUpdate: '15 min ago', mileage: 312045,
  },
  {
    id: 'trk-004', name: 'Arctic Runner', driver: 'Emma Thompson', plateNumber: 'RW-2156-MN', type: 'refrigerated', status: 'active',
    speed: 78, fuelLevel: 88, location: { lat: -1.9403, lng: 29.8739, city: 'Kigali', country: 'Rwanda' },
    destination: { lat: -2.5489, lng: 32.8986, city: 'Mwanza', country: 'Tanzania' },
    progress: 12, ETA: '32h 10m', cargo: 'Fresh Produce & Dairy', lastUpdate: '30 sec ago', temperature: 4, mileage: 156789,
  },
  {
    id: 'trk-005', name: 'Storm Chaser', driver: 'James Ochieng', plateNumber: 'ET-3891-XZ', type: 'bulk', status: 'maintenance',
    speed: 0, fuelLevel: 15, location: { lat: 9.0250, lng: 38.7469, city: 'Addis Ababa', country: 'Ethiopia' },
    destination: { lat: 4.0319, lng: 9.7670, city: 'Douala', country: 'Cameroon' },
    progress: 0, ETA: 'N/A', cargo: 'Minerals & Ores', lastUpdate: '2 hours ago', mileage: 478231,
  },
  {
    id: 'trk-006', name: 'Night Owl', driver: 'Fatima Hassan', plateNumber: 'SO-7845-QW', type: 'container', status: 'active',
    speed: 95, fuelLevel: 63, location: { lat: 2.0469, lng: 45.3182, city: 'Mogadishu', country: 'Somalia' },
    destination: { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
    progress: 55, ETA: '18h 20m', cargo: 'Imported Consumer Goods', lastUpdate: '45 sec ago', mileage: 203567,
  },
];

const packages = [
  {
    id: 'pkg-001', trackingNumber: 'TXL-2026-KE-48521', sender: 'TechHub Nairobi', receiver: 'Global Imports Ltd',
    origin: { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
    destination: { lat: -6.7924, lng: 39.2083, city: 'Dar es Salaam', country: 'Tanzania' },
    status: 'in_transit', weight: 12.5, dimensions: '60x40x35 cm', type: 'express',
    currentLocation: { lat: -3.6684, lng: 37.8012, city: 'Arusha', country: 'Tanzania' },
    progress: 68, estimatedDelivery: '2026-06-13', lastUpdate: '2 min ago',
    events: [
      { timestamp: '2026-06-12 14:30', location: 'Arusha, TZ', status: 'In Transit', description: 'Package cleared customs checkpoint' },
      { timestamp: '2026-06-12 08:15', location: 'Namanga, TZ', status: 'Border Crossing', description: 'Crossed Kenya-Tanzania border' },
      { timestamp: '2026-06-11 16:00', location: 'Nairobi, KE', status: 'Dispatched', description: 'Package picked up from warehouse' },
      { timestamp: '2026-06-11 10:30', location: 'Nairobi, KE', status: 'Labelled', description: 'Shipping label created' },
    ],
  },
  {
    id: 'pkg-002', trackingNumber: 'TXL-2026-UG-72349', sender: 'MedSupply Uganda', receiver: 'Red Cross Nairobi',
    origin: { lat: 0.3476, lng: 32.5825, city: 'Kampala', country: 'Uganda' },
    destination: { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
    status: 'in_transit', weight: 45.0, dimensions: '120x80x60 cm', type: 'fragile',
    currentLocation: { lat: 1.0500, lng: 34.5500, city: 'Eldoret', country: 'Kenya' },
    progress: 82, estimatedDelivery: '2026-06-12', lastUpdate: '5 min ago',
    events: [
      { timestamp: '2026-06-12 12:00', location: 'Eldoret, KE', status: 'In Transit', description: 'Package en route to Nairobi hub' },
      { timestamp: '2026-06-12 06:00', location: 'Malaba, KE', status: 'Border Crossing', description: 'Cleared Uganda-Kenya border' },
      { timestamp: '2026-06-11 14:00', location: 'Kampala, UG', status: 'Dispatched', description: 'Special handling medical shipment' },
    ],
  },
  {
    id: 'pkg-003', trackingNumber: 'TXL-2026-RW-11087', sender: 'Kigali Coffee Co.', receiver: 'Amsterdam Roasters',
    origin: { lat: -1.9403, lng: 29.8739, city: 'Kigali', country: 'Rwanda' },
    destination: { lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands' },
    status: 'pending', weight: 220, dimensions: 'Pallet (120x100x150 cm)', type: 'standard',
    currentLocation: { lat: -1.9403, lng: 29.8739, city: 'Kigali', country: 'Rwanda' },
    progress: 5, estimatedDelivery: '2026-06-18', lastUpdate: '3 hours ago',
    events: [
      { timestamp: '2026-06-12 09:00', location: 'Kigali, RW', status: 'Received', description: 'Awaiting flight scheduling' },
    ],
  },
  {
    id: 'pkg-004', trackingNumber: 'TXL-2026-ET-93821', sender: 'Addis Gems Ltd', receiver: 'Antwerp Diamond House',
    origin: { lat: 9.0250, lng: 38.7469, city: 'Addis Ababa', country: 'Ethiopia' },
    destination: { lat: 51.2194, lng: 4.4025, city: 'Antwerp', country: 'Belgium' },
    status: 'delivered', weight: 2.3, dimensions: '15x10x8 cm', type: 'express',
    currentLocation: { lat: 51.2194, lng: 4.4025, city: 'Antwerp', country: 'Belgium' },
    progress: 100, estimatedDelivery: '2026-06-12', lastUpdate: '10 min ago',
    events: [
      { timestamp: '2026-06-12 10:15', location: 'Antwerp, BE', status: 'Delivered', description: 'Package delivered to recipient' },
      { timestamp: '2026-06-12 07:30', location: 'Antwerp, BE', status: 'Out for Delivery', description: 'With local courier' },
      { timestamp: '2026-06-11 22:00', location: 'Antwerp, BE', status: 'Customs Cleared', description: 'Import duties paid' },
      { timestamp: '2026-06-11 14:00', location: 'Addis Ababa, ET', status: 'Dispatched', description: 'Priority air freight' },
    ],
  },
  {
    id: 'pkg-005', trackingNumber: 'TXL-2026-TZ-55678', sender: 'Mwanza Fisheries', receiver: 'Gulf Market Dubai',
    origin: { lat: -2.5489, lng: 32.8986, city: 'Mwanza', country: 'Tanzania' },
    destination: { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE' },
    status: 'loading', weight: 500, dimensions: 'Refrigerated Container', type: 'hazardous',
    currentLocation: { lat: -6.7924, lng: 39.2083, city: 'Dar es Salaam', country: 'Tanzania' },
    progress: 18, estimatedDelivery: '2026-06-22', lastUpdate: '1 min ago',
    events: [
      { timestamp: '2026-06-12 13:00', location: 'Dar es Salaam, TZ', status: 'Loading', description: 'Being loaded onto vessel MV Pacific Star' },
      { timestamp: '2026-06-12 06:00', location: 'Dar es Salaam, TZ', status: 'Arrived Port', description: 'Reached port terminal' },
    ],
  },
  {
    id: 'pkg-006', trackingNumber: 'TXL-2026-CD-88123', sender: 'Congo Minerals SA', receiver: 'Shanghai Metals Corp',
    origin: { lat: -4.3220, lng: 15.3082, city: 'Kinshasa', country: 'DRC' },
    destination: { lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'China' },
    status: 'delayed', weight: 1200, dimensions: '4x 40ft Containers', type: 'standard',
    currentLocation: { lat: -8.8390, lng: 13.2894, city: 'Luanda', country: 'Angola' },
    progress: 35, estimatedDelivery: '2026-07-05', lastUpdate: '30 min ago',
    events: [
      { timestamp: '2026-06-12 11:00', location: 'Luanda, AO', status: 'Delayed', description: 'Port congestion - 3 day delay expected' },
      { timestamp: '2026-06-10 08:00', location: 'Luanda, AO', status: 'In Port', description: 'Awaiting vessel allocation' },
    ],
  },
];

const containers = [
  {
    id: 'cnt-001', containerNumber: 'TXLU-7842936', type: '40ft', status: 'in_transit',
    origin: { lat: -4.0435, lng: 39.6682, city: 'Mombasa', country: 'Kenya' },
    destination: { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
    currentLocation: { lat: -10.0000, lng: 68.0000, city: 'Indian Ocean', country: 'International Waters' },
    vessel: 'MSC Diana', voyage: 'VY-2026-0847', progress: 42, weight: 28.5, sealNumber: 'ML-489271',
    commodities: 'Coffee, Tea & Spices', estimatedArrival: '2026-06-28', lastUpdate: '1 hour ago',
    events: [
      { timestamp: '2026-06-12 06:00', location: 'Indian Ocean', status: 'At Sea', vessel: 'MSC Diana', voyage: 'VY-2026-0847' },
      { timestamp: '2026-06-10 14:00', location: 'Mombasa, KE', status: 'Departed', vessel: 'MSC Diana', voyage: 'VY-2026-0847' },
      { timestamp: '2026-06-09 08:00', location: 'Mombasa, KE', status: 'Loaded', vessel: 'MSC Diana', voyage: 'VY-2026-0847' },
    ],
  },
  {
    id: 'cnt-002', containerNumber: 'TXLU-3928471', type: 'reefer', status: 'in_transit',
    origin: { lat: -6.7924, lng: 39.2083, city: 'Dar es Salaam', country: 'Tanzania' },
    destination: { lat: 51.9225, lng: 4.4792, city: 'Rotterdam', country: 'Netherlands' },
    currentLocation: { lat: -15.0000, lng: 40.0000, city: 'Mozambique Channel', country: 'International Waters' },
    vessel: 'Maersk Seletar', voyage: 'MS-2026-1203', progress: 25, weight: 22.0, sealNumber: 'ML-887462',
    commodities: 'Fresh Fruits & Vegetables', estimatedArrival: '2026-07-08', lastUpdate: '2 hours ago',
    temperature: -2, humidity: 85,
    events: [
      { timestamp: '2026-06-12 03:00', location: 'Mozambique Channel', status: 'At Sea', vessel: 'Maersk Seletar', voyage: 'MS-2026-1203' },
      { timestamp: '2026-06-10 20:00', location: 'Dar es Salaam, TZ', status: 'Departed', vessel: 'Maersk Seletar', voyage: 'MS-2026-1203' },
    ],
  },
  {
    id: 'cnt-003', containerNumber: 'TXLU-5617283', type: '20ft', status: 'delivered',
    origin: { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
    destination: { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
    currentLocation: { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
    vessel: 'Evergreen Fortune', voyage: 'EF-2026-0562', progress: 100, weight: 18.2, sealNumber: 'ML-339184',
    commodities: 'Electronics & Auto Parts', estimatedArrival: '2026-06-11', lastUpdate: '1 day ago',
    events: [
      { timestamp: '2026-06-11 16:00', location: 'Nairobi, KE', status: 'Delivered', vessel: 'Evergreen Fortune', voyage: 'EF-2026-0562' },
      { timestamp: '2026-06-11 08:00', location: 'Mombasa, KE', status: 'Discharged', vessel: 'Evergreen Fortune', voyage: 'EF-2026-0562' },
    ],
  },
  {
    id: 'cnt-004', containerNumber: 'TXLU-9182746', type: '40ft_hc', status: 'loading',
    origin: { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
    destination: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' },
    currentLocation: { lat: -4.0435, lng: 39.6682, city: 'Mombasa', country: 'Kenya' },
    vessel: 'COSCO Shipping Star', voyage: 'CS-2026-0491', progress: 8, weight: 26.8, sealNumber: 'ML-551738',
    commodities: 'Agricultural Products & Textiles', estimatedArrival: '2026-07-15', lastUpdate: '15 min ago',
    events: [
      { timestamp: '2026-06-12 14:00', location: 'Mombasa, KE', status: 'Loading', vessel: 'COSCO Shipping Star', voyage: 'CS-2026-0491' },
    ],
  },
  {
    id: 'cnt-005', containerNumber: 'TXLU-4471829', type: '45ft_hc', status: 'delayed',
    origin: { lat: 22.3193, lng: 114.1694, city: 'Hong Kong', country: 'China' },
    destination: { lat: -4.0435, lng: 39.6682, city: 'Mombasa', country: 'Kenya' },
    currentLocation: { lat: 12.5000, lng: 80.0000, city: 'Bay of Bengal', country: 'International Waters' },
    vessel: 'Yang Ming Wellbeing', voyage: 'YM-2026-0378', progress: 55, weight: 30.1, sealNumber: 'ML-773921',
    commodities: 'Machinery & Hardware', estimatedArrival: '2026-07-02', lastUpdate: '4 hours ago',
    events: [
      { timestamp: '2026-06-12 10:00', location: 'Bay of Bengal', status: 'Delayed', description: 'Weather delay - rerouting around cyclone' },
      { timestamp: '2026-06-11 16:00', location: 'Strait of Malacca', status: 'At Sea', vessel: 'Yang Ming Wellbeing', voyage: 'YM-2026-0378' },
    ],
  },
];

const cargoShipments = [
  {
    id: 'crg-001', shipmentNumber: 'CARGO-2026-KE-00142', type: 'FCL', status: 'in_transit',
    origin: { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
    destination: { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE' },
    currentLocation: { lat: -4.0435, lng: 39.6682, city: 'Mombasa', country: 'Kenya' },
    cargoType: 'Mixed Consumer Goods', weight: 45.2, volume: 68.5, containers: 3, trucks: 2, progress: 32,
    estimatedArrival: '2026-06-25', lastUpdate: '30 min ago', insurance: true, hazmat: false, value: 285000,
    events: [
      { timestamp: '2026-06-12 10:00', location: 'Mombasa, KE', status: 'Port Operations', description: 'Containers loaded onto vessel', milestone: true },
      { timestamp: '2026-06-11 16:00', location: 'Mombasa, KE', status: 'Customs Cleared', description: 'All documentation verified', milestone: true },
      { timestamp: '2026-06-11 08:00', location: 'Nairobi, KE', status: 'Truck Departure', description: '2 trucks departed for Mombasa', milestone: false },
    ],
  },
  {
    id: 'crg-002', shipmentNumber: 'CARGO-2026-UG-00087', type: 'air', status: 'in_transit',
    origin: { lat: 0.3476, lng: 32.5825, city: 'Kampala', country: 'Uganda' },
    destination: { lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands' },
    currentLocation: { lat: 10.0000, lng: 32.0000, city: 'Juba', country: 'South Sudan' },
    cargoType: 'Vanilla & Cocoa Beans', weight: 8.5, volume: 12.0, containers: 0, trucks: 1, progress: 45,
    estimatedArrival: '2026-06-13', lastUpdate: '1 hour ago', insurance: true, hazmat: false, value: 120000,
    events: [
      { timestamp: '2026-06-12 11:00', location: 'Juba, SS', status: 'In Transit', description: 'Air cargo - en route to Amsterdam', milestone: false },
      { timestamp: '2026-06-12 06:00', location: 'Kampala, UG', status: 'Airborne', description: 'Departed Entebbe International', milestone: true },
    ],
  },
  {
    id: 'crg-003', shipmentNumber: 'CARGO-2026-TZ-00234', type: 'rail', status: 'in_transit',
    origin: { lat: -6.7924, lng: 39.2083, city: 'Dar es Salaam', country: 'Tanzania' },
    destination: { lat: -13.9626, lng: 33.7741, city: 'Lilongwe', country: 'Malawi' },
    currentLocation: { lat: -10.5000, lng: 35.5000, city: 'Mbamba Bay', country: 'Tanzania' },
    cargoType: 'Fertilizer & Agricultural Inputs', weight: 1200, volume: 2400, containers: 24, trucks: 0, progress: 58,
    estimatedArrival: '2026-06-15', lastUpdate: '45 min ago', insurance: true, hazmat: true, value: 450000,
    events: [
      { timestamp: '2026-06-12 08:00', location: 'Mbamba Bay, TZ', status: 'In Transit', description: 'Rail convoy progressing on schedule', milestone: false },
      { timestamp: '2026-06-11 06:00', location: 'Dar es Salaam, TZ', status: 'Departed', description: '24 containers loaded on rail', milestone: true },
    ],
  },
  {
    id: 'crg-004', shipmentNumber: 'CARGO-2026-ET-00301', type: 'road', status: 'pending',
    origin: { lat: 9.0250, lng: 38.7469, city: 'Addis Ababa', country: 'Ethiopia' },
    destination: { lat: 2.0469, lng: 45.3182, city: 'Mogadishu', country: 'Somalia' },
    currentLocation: { lat: 9.0250, lng: 38.7469, city: 'Addis Ababa', country: 'Ethiopia' },
    cargoType: 'Emergency Relief Supplies', weight: 85.0, volume: 150.0, containers: 4, trucks: 6, progress: 0,
    estimatedArrival: '2026-06-16', lastUpdate: '2 hours ago', insurance: true, hazmat: false, value: 520000,
    events: [
      { timestamp: '2026-06-12 09:00', location: 'Addis Ababa, ET', status: 'Scheduled', description: 'Awaiting security clearance', milestone: true },
    ],
  },
  {
    id: 'crg-005', shipmentNumber: 'CARGO-2026-CD-00056', type: 'FCL', status: 'delayed',
    origin: { lat: -4.3220, lng: 15.3082, city: 'Kinshasa', country: 'DRC' },
    destination: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' },
    currentLocation: { lat: -8.8390, lng: 13.2894, city: 'Luanda', country: 'Angola' },
    cargoType: 'Coltan & Cobalt Ore', weight: 850, volume: 420, containers: 12, trucks: 4, progress: 22,
    estimatedArrival: '2026-07-20', lastUpdate: '1 hour ago', insurance: true, hazmat: true, value: 2100000,
    events: [
      { timestamp: '2026-06-12 12:00', location: 'Luanda, AO', status: 'Delayed', description: 'Port congestion - waiting for berth', milestone: false },
      { timestamp: '2026-06-10 08:00', location: 'Luanda, AO', status: 'In Port', description: 'Containers at port terminal', milestone: true },
      { timestamp: '2026-06-08 06:00', location: 'Kinshasa, CD', status: 'Departed', description: 'Road convoy to Luanda completed', milestone: true },
    ],
  },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Truck.deleteMany({}),
      Package.deleteMany({}),
      Container.deleteMany({}),
      CargoShipment.deleteMany({}),
    ]);

    // Insert seed data
    await Promise.all([
      Truck.insertMany(trucks),
      Package.insertMany(packages),
      Container.insertMany(containers),
      CargoShipment.insertMany(cargoShipments),
    ]);

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error: unknown) {
    console.error('Seed error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}