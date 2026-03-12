import mongoose, { Schema, Document } from 'mongoose';

export enum EventType {
  UPCOMING = 'UPCOMING',
  PAST = 'PAST',
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  type: EventType;
  posterUrl: string;
  driveFolderLink?: string;
  registrationLink?: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: Object.values(EventType),
      default: EventType.UPCOMING,
    },
    posterUrl: { type: String, required: true },
    driveFolderLink: { type: String },
    registrationLink: { type: String },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
