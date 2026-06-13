import mongoose, { Schema, Model } from 'mongoose';

export interface ICargoShipment {
  id: string;
  shipmentNumber: string;
  type: string;
  status: string;
  origin: {
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
  currentLocation: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  cargoType: string;
  weight: number;
  volume: number;
  containers: number;
  trucks: number;
  progress: number;
  events: {
    timestamp: string;
    location: string;
    status: string;
    description: string;
    milestone: boolean;
  }[];
  estimatedArrival: string;
  lastUpdate: string;
  insurance: boolean;
  hazmat: boolean;
  value: number;
}

const CargoShipmentSchema = new Schema<ICargoShipment>(
  {
    id: { type: String, required: true, unique: true },
    shipmentNumber: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    origin: {
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
    currentLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    cargoType: { type: String, required: true },
    weight: { type: Number, required: true },
    volume: { type: Number, required: true },
    containers: { type: Number, default: 0 },
    trucks: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    events: [{
      timestamp: String,
      location: String,
      status: String,
      description: String,
      milestone: Boolean,
    }],
    estimatedArrival: { type: String, default: '' },
    lastUpdate: { type: String, default: '' },
    insurance: { type: Boolean, default: false },
    hazmat: { type: Boolean, default: false },
    value: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CargoShipment: Model<ICargoShipment> =
  mongoose.models.CargoShipment || mongoose.model<ICargoShipment>('CargoShipment', CargoShipmentSchema);

export default CargoShipment;