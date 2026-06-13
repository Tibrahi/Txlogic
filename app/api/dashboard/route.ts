import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Truck from '@/lib/models/Truck';
import Package from '@/lib/models/Package';
import Container from '@/lib/models/Container';
import CargoShipment from '@/lib/models/CargoShipment';

export async function GET() {
  try {
    await connectDB();

    const [trucks, packages, containers, cargoShipments] = await Promise.all([
      Truck.find({}).sort({ createdAt: -1 }),
      Package.find({}).sort({ createdAt: -1 }),
      Container.find({}).sort({ createdAt: -1 }),
      CargoShipment.find({}).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({
      trucks,
      packages,
      containers,
      cargoShipments,
    });
  } catch (error: unknown) {
    console.error('Dashboard data error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}