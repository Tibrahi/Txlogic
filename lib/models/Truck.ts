import mongoose, { Schema, Model } from 'mongoose';

export interface ITruck {
  id: string;
  name: string;
  driver: string;
  plateNumber: string;
  type: string;
  status: string;
  speed: number;
  fuelLevel: number;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  destination: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  progress: number;
  ETA: string;
  cargo: string;
  lastUpdate: string;
  temperature?: number;
  mileage: number;
}

const TruckSchema = new Schema<ITruck>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    driver: { type: String, required: true },
    plateNumber: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    speed: { type: Number, default: 0 },
    fuelLevel: { type: Number, default: 100 },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    destination: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    progress: { type: Number, default: 0 },
    ETA: { type: String, default: 'N/A' },
    cargo: { type: String, default: '' },
    lastUpdate: { type: String, default: '' },
    temperature: { type: Number },
    mileage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Truck: Model<ITruck> = mongoose.models.Truck || mongoose.model<ITruck>('Truck', TruckSchema);

export default Truck;