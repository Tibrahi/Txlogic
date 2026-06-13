import mongoose, { Schema, Model } from 'mongoose';

export interface IContainer {
  id: string;
  containerNumber: string;
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
  vessel: string;
  voyage: string;
  progress: number;
  weight: number;
  sealNumber: string;
  commodities: string;
  events: {
    timestamp: string;
    location: string;
    status: string;
    vessel?: string;
    voyage?: string;
    description?: string;
  }[];
  estimatedArrival: string;
  lastUpdate: string;
  temperature?: number;
  humidity?: number;
}

const ContainerSchema = new Schema<IContainer>(
  {
    id: { type: String, required: true, unique: true },
    containerNumber: { type: String, required: true },
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
    vessel: { type: String, required: true },
    voyage: { type: String, required: true },
    progress: { type: Number, default: 0 },
    weight: { type: Number, required: true },
    sealNumber: { type: String, required: true },
    commodities: { type: String, required: true },
    events: [{
      timestamp: String,
      location: String,
      status: String,
      vessel: String,
      voyage: String,
      description: String,
    }],
    estimatedArrival: { type: String, default: '' },
    lastUpdate: { type: String, default: '' },
    temperature: { type: Number },
    humidity: { type: Number },
  },
  { timestamps: true }
);

const Container: Model<IContainer> = mongoose.models.Container || mongoose.model<IContainer>('Container', ContainerSchema);

export default Container;