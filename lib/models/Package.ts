import mongoose, { Schema, Model } from 'mongoose';

export interface IPackage {
  id: string;
  trackingNumber: string;
  sender: string;
  receiver: string;
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
  status: string;
  weight: number;
  dimensions: string;
  type: string;
  currentLocation: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  progress: number;
  events: {
    timestamp: string;
    location: string;
    status: string;
    description: string;
  }[];
  estimatedDelivery: string;
  lastUpdate: string;
}

const PackageSchema = new Schema<IPackage>(
  {
    id: { type: String, required: true, unique: true },
    trackingNumber: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
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
    status: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: { type: String, required: true },
    type: { type: String, required: true },
    currentLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    progress: { type: Number, default: 0 },
    events: [{
      timestamp: String,
      location: String,
      status: String,
      description: String,
    }],
    estimatedDelivery: { type: String, default: '' },
    lastUpdate: { type: String, default: '' },
  },
  { timestamps: true }
);

const Package: Model<IPackage> = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;