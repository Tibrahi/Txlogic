import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Truck from '@/lib/models/Truck';
import Package from '@/lib/models/Package';
import Container from '@/lib/models/Container';
import CargoShipment from '@/lib/models/CargoShipment';

export async function GET() {
  try {
    await connectDB();

